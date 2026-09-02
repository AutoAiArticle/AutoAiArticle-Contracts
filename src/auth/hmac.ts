/**
 * HMAC signing / verification for inbound events.
 *
 * Byte-for-byte aligned with the main-engine's `app/core/security.py`
 * (`build_inbound_canonical_string`, `compute_signature`) and the verification order of
 * `app/api/inbound_auth.py`. Pure functions only; relies solely on the Web Crypto API so
 * it runs in both Node.js >= 18 and Cloudflare Workers.
 */

import { ERROR_CODES, type ErrorCode } from '../errors.js';

/** The six-line canonical string, `\n`-joined (matches Python `"\n".join([...])`). */
export function buildCanonicalString(
  method: string,
  path: string,
  timestamp: string,
  nonce: string,
  bodySha256Hex: string,
  bodyLength: number
): string {
  return [method.toUpperCase(), path, timestamp, nonce, bodySha256Hex, String(bodyLength)].join(
    '\n'
  );
}

/** HMAC-SHA256 signature, returns `'v1=' + 64 lowercase hex chars`. */
export async function computeSignature(secret: string, canonicalString: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(canonicalString)
  );
  return `v1=${bytesToHex(new Uint8Array(signature))}`;
}

/** SHA-256 hex (lowercase) of a byte sequence or UTF-8 string. */
export async function sha256Hex(body: Uint8Array | string): Promise<string> {
  const bytes = typeof body === 'string' ? new TextEncoder().encode(body) : body;
  // Uint8Array may be a view (byteOffset != 0 or length != buffer byteLength); passing
  // .buffer directly to subtle.digest would hash the wrong bytes, so slice an exact copy.
  const buffer: ArrayBuffer =
    bytes.byteOffset === 0 && bytes.byteLength === bytes.buffer.byteLength
      ? (bytes.buffer as ArrayBuffer)
      : (bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer);
  const digest = await crypto.subtle.digest('SHA-256', buffer);
  return bytesToHex(new Uint8Array(digest));
}

export type SignHeaders = Record<string, string> & {
  'Content-Type': string;
  'X-AA-Key-Id': string;
  'X-AA-Timestamp': string;
  'X-AA-Nonce': string;
  'X-AA-Content-SHA256': string;
  'X-AA-Signature': string;
};

/**
 * Produce the full set of signing headers for a request body. The caller supplies the
 * key id; the secret is looked up from `keys` by key id.
 */
export async function signRequest(
  keys: Record<string, string>,
  keyId: string,
  method: string,
  path: string,
  body: Uint8Array
): Promise<SignHeaders> {
  const secret = keys[keyId];
  if (secret === undefined) {
    throw new Error(`unknown key id: ${keyId}`);
  }
  const timestamp = new Date().toISOString();
  const nonce = crypto.randomUUID();
  const contentSha256 = await sha256Hex(body);
  const canonical = buildCanonicalString(
    method,
    path,
    timestamp,
    nonce,
    contentSha256,
    body.length
  );
  const signature = await computeSignature(secret, canonical);
  return {
    'Content-Type': 'application/json',
    'X-AA-Key-Id': keyId,
    'X-AA-Timestamp': timestamp,
    'X-AA-Nonce': nonce,
    'X-AA-Content-SHA256': contentSha256,
    'X-AA-Signature': signature
  };
}

export type SignatureErrorCode = Extract<
  ErrorCode,
  | 'unknown_key_id'
  | 'invalid_signature'
  | 'timestamp_expired'
  | 'payload_too_large'
  | 'unsupported_media_type'
  | 'invalid_request'
>;

export type VerifyResult = { ok: true; keyId: string } | { ok: false; code: SignatureErrorCode };

export interface VerifyRequestArgs {
  /** keyId -> secret mapping (main-engine `settings.inbound_event_hmac_keys`). */
  keys: Record<string, string>;
  method: string;
  path: string;
  body: Uint8Array;
  headers: Record<string, string>;
  toleranceSeconds: number;
  maxBodyBytes: number;
}

/**
 * Verify an inbound request, applying checks in the exact order of the main-engine's
 * `inbound_auth.py` (order is not interchangeable):
 *
 * 1. method/path            -> invalid_request
 * 2. content-type JSON      -> unsupported_media_type
 * 3. body size              -> payload_too_large
 * 4. key id configured      -> unknown_key_id
 * 5. timestamp window       -> timestamp_expired
 * 6. nonce is a UUID        -> invalid_request
 * 7. body digest match      -> invalid_signature
 * 8. HMAC constant-time     -> invalid_signature
 */
export async function verifyRequest(args: VerifyRequestArgs): Promise<VerifyResult> {
  const { keys, method, path, body, headers, toleranceSeconds, maxBodyBytes } = args;

  // 1. method/path
  if (method.toUpperCase() !== 'POST') return { ok: false, code: ERROR_CODES.invalid_request };
  if (typeof path !== 'string' || path.length === 0) {
    return { ok: false, code: ERROR_CODES.invalid_request };
  }

  // 2. content-type
  const contentType = header(headers, 'content-type') ?? '';
  if (!contentType.toLowerCase().includes('application/json')) {
    return { ok: false, code: ERROR_CODES.unsupported_media_type };
  }

  // 3. body size
  if (body.byteLength > maxBodyBytes) {
    return { ok: false, code: ERROR_CODES.payload_too_large };
  }

  // 4. key id configured
  const keyId = header(headers, 'x-aa-key-id') ?? '';
  if (!keyId || keys[keyId] === undefined) {
    return { ok: false, code: ERROR_CODES.unknown_key_id };
  }

  // 5. timestamp window
  const timestamp = header(headers, 'x-aa-timestamp') ?? '';
  const parsedTs = parseRfc3339(timestamp);
  if (parsedTs === null) return { ok: false, code: ERROR_CODES.invalid_request };
  const nowMs = Date.now();
  if (Math.abs(nowMs - parsedTs.getTime()) > toleranceSeconds * 1000) {
    return { ok: false, code: ERROR_CODES.timestamp_expired };
  }

  // 6. nonce is a UUID
  const nonce = header(headers, 'x-aa-nonce') ?? '';
  if (!isUuid(nonce)) return { ok: false, code: ERROR_CODES.invalid_request };

  // 7. body digest match
  const contentSha256 = (header(headers, 'x-aa-content-sha256') ?? '').trim().toLowerCase();
  const signature = (header(headers, 'x-aa-signature') ?? '').trim();
  if (!contentSha256 || !signature) return { ok: false, code: ERROR_CODES.invalid_request };

  const bodyDigest = await sha256Hex(body);
  if (!constantTimeEqual(bodyDigest, contentSha256)) {
    return { ok: false, code: ERROR_CODES.invalid_signature };
  }

  // 8. HMAC constant-time compare
  const canonical = buildCanonicalString(
    method,
    path,
    timestamp,
    nonce,
    contentSha256,
    body.byteLength
  );
  const expected = await computeSignature(keys[keyId], canonical);
  if (!constantTimeEqual(expected, signature)) {
    return { ok: false, code: ERROR_CODES.invalid_signature };
  }

  return { ok: true, keyId };
}

/**
 * Constant-time string comparison (equivalent of Python `hmac.compare_digest`). Encodes
 * both strings to UTF-8 and always walks the longer length so no branch leaks length
 * information early. Never use `===` for secret comparison.
 */
export function constantTimeEqual(a: string, b: string): boolean {
  const ab = new TextEncoder().encode(a);
  const bb = new TextEncoder().encode(b);
  const length = Math.max(ab.length, bb.length);
  let diff = ab.length ^ bb.length;
  for (let i = 0; i < length; i++) {
    diff |= (ab[i] ?? 0) ^ (bb[i] ?? 0);
  }
  return diff === 0;
}

function bytesToHex(bytes: Uint8Array): string {
  let out = '';
  for (let i = 0; i < bytes.length; i++) {
    out += bytes[i].toString(16).padStart(2, '0');
  }
  return out;
}

function header(headers: Record<string, string>, name: string): string | undefined {
  const lower = name.toLowerCase();
  for (const [k, v] of Object.entries(headers)) {
    if (k.toLowerCase() === lower) return v;
  }
  return undefined;
}

function parseRfc3339(value: string): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isUuid(value: string): boolean {
  return UUID_RE.test(value);
}
