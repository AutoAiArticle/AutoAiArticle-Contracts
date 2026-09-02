/**
 * Error code classification and backoff tests.
 *
 * Values mirror Scanner `src/domain/state-machine.ts` byte-for-byte.
 */
import { describe, expect, it } from 'vitest';
import {
  classifyHttpStatus,
  ERROR_CODES,
  isRetryableCode,
  retryDelaySeconds,
  SIGNATURE_ERROR_STATUS
} from '../src/errors.js';

describe('classifyHttpStatus', () => {
  it('5xx → network_or_5xx', () => {
    expect(classifyHttpStatus(500)).toBe('network_or_5xx');
    expect(classifyHttpStatus(503)).toBe('network_or_5xx');
    expect(classifyHttpStatus(599)).toBe('network_or_5xx');
  });
  it('null → network_or_5xx', () => {
    expect(classifyHttpStatus(null)).toBe('network_or_5xx');
  });
  it('429 → rate_limited', () => {
    expect(classifyHttpStatus(429)).toBe('rate_limited');
  });
  it('400/401/403/404 → auth_or_config', () => {
    for (const s of [400, 401, 403, 404]) {
      expect(classifyHttpStatus(s)).toBe('auth_or_config');
    }
  });
  it('everything else → final', () => {
    expect(classifyHttpStatus(200)).toBe('final');
    expect(classifyHttpStatus(201)).toBe('final');
    expect(classifyHttpStatus(422)).toBe('final');
    expect(classifyHttpStatus(302)).toBe('final');
  });
});

describe('retryDelaySeconds', () => {
  const fixed = () => 0.5; // mid-point of the 0.8..1.2 jitter window

  it('rate_limited with Retry-After uses ceil(retryAfter * (1 + r*0.1))', () => {
    // r=0.5 → 1.05; ceil(60*1.05)=63
    expect(retryDelaySeconds('rate_limited', 0, 60, fixed)).toBe(63);
    // retryAfter=0 → ceil(0)=0, but the formula returns 0 here (no floor applied).
    expect(retryDelaySeconds('rate_limited', 0, 0, fixed)).toBe(0);
  });

  it('rate_limited without Retry-After falls back to the table', () => {
    // base 60, r=0.5 → 60*(0.8+0.2)=60
    expect(retryDelaySeconds('rate_limited', 0, null, fixed)).toBe(60);
    // attempt beyond table length clamps to last value
    expect(retryDelaySeconds('rate_limited', 99, null, fixed)).toBe(1800);
  });

  it('network_or_5xx uses its own table', () => {
    expect(retryDelaySeconds('network_or_5xx', 0, null, fixed)).toBe(30);
    expect(retryDelaySeconds('network_or_5xx', 1, null, fixed)).toBe(90);
    expect(retryDelaySeconds('network_or_5xx', 99, null, fixed)).toBe(900);
  });

  it('auth_or_config uses its own table', () => {
    expect(retryDelaySeconds('auth_or_config', 0, null, fixed)).toBe(120);
    expect(retryDelaySeconds('auth_or_config', 2, null, fixed)).toBe(600);
    expect(retryDelaySeconds('auth_or_config', 99, null, fixed)).toBe(1800);
  });

  it('never returns below 1 for table-based backoff', () => {
    // r near 0 → 0.8 factor; base 30 → 24, still >= 1
    expect(retryDelaySeconds('network_or_5xx', 0, null, () => 0)).toBe(24);
  });

  it('clamps attempt index to the last table entry', () => {
    // rate_limited table length 6, index 6 → clamps to 5 (1800)
    expect(retryDelaySeconds('rate_limited', 5, null, fixed)).toBe(1800);
    expect(retryDelaySeconds('rate_limited', 6, null, fixed)).toBe(1800);
  });
});

describe('isRetryableCode', () => {
  it('marks overloaded/internal errors retryable', () => {
    expect(isRetryableCode(ERROR_CODES.intake_overloaded)).toBe(true);
    expect(isRetryableCode(ERROR_CODES.internal_error)).toBe(true);
  });
  it('marks signature errors terminal', () => {
    expect(isRetryableCode(ERROR_CODES.invalid_signature)).toBe(false);
    expect(isRetryableCode(ERROR_CODES.unknown_key_id)).toBe(false);
    expect(isRetryableCode(ERROR_CODES.invalid_json)).toBe(false);
  });
});

describe('SIGNATURE_ERROR_STATUS', () => {
  it('maps codes to the documented HTTP statuses', () => {
    expect(SIGNATURE_ERROR_STATUS.unknown_key_id).toBe(401);
    expect(SIGNATURE_ERROR_STATUS.invalid_signature).toBe(401);
    expect(SIGNATURE_ERROR_STATUS.timestamp_expired).toBe(401);
    expect(SIGNATURE_ERROR_STATUS.payload_too_large).toBe(413);
    expect(SIGNATURE_ERROR_STATUS.unsupported_media_type).toBe(415);
    expect(SIGNATURE_ERROR_STATUS.invalid_request).toBe(400);
  });
});
