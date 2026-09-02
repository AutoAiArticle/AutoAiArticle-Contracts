/**
 * HMAC signing / verification for inbound events.
 *
 * Byte-for-byte aligned with the main-engine's `app/core/security.py`
 * (`build_inbound_canonical_string`, `compute_signature`) and the verification order of
 * `app/api/inbound_auth.py`. Pure functions only; relies solely on the Web Crypto API so
 * it runs in both Node.js >= 18 and Cloudflare Workers.
 */
import { type ErrorCode } from '../errors.js';
/** The six-line canonical string, `\n`-joined (matches Python `"\n".join([...])`). */
export declare function buildCanonicalString(method: string, path: string, timestamp: string, nonce: string, bodySha256Hex: string, bodyLength: number): string;
/** HMAC-SHA256 signature, returns `'v1=' + 64 lowercase hex chars`. */
export declare function computeSignature(secret: string, canonicalString: string): Promise<string>;
/** SHA-256 hex (lowercase) of a byte sequence or UTF-8 string. */
export declare function sha256Hex(body: Uint8Array | string): Promise<string>;
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
export declare function signRequest(keys: Record<string, string>, keyId: string, method: string, path: string, body: Uint8Array): Promise<SignHeaders>;
export type SignatureErrorCode = Extract<ErrorCode, 'unknown_key_id' | 'invalid_signature' | 'timestamp_expired' | 'payload_too_large' | 'unsupported_media_type' | 'invalid_request'>;
export type VerifyResult = {
    ok: true;
    keyId: string;
} | {
    ok: false;
    code: SignatureErrorCode;
};
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
export declare function verifyRequest(args: VerifyRequestArgs): Promise<VerifyResult>;
/**
 * Constant-time string comparison (equivalent of Python `hmac.compare_digest`). Encodes
 * both strings to UTF-8 and always walks the longer length so no branch leaks length
 * information early. Never use `===` for secret comparison.
 */
export declare function constantTimeEqual(a: string, b: string): boolean;
