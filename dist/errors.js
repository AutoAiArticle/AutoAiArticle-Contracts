/**
 * Error codes and retry classification.
 *
 * Retry classification mirrors Scanner `src/domain/state-machine.ts` `classifyRetry`,
 * `BACKOFF_SECONDS`, and `retryDelaySeconds` byte-for-byte so both sides' retry rhythm
 * stays identical.
 */
/** Signature / inbound error codes (aligned with main-engine SignatureError codes). */
export const ERROR_CODES = {
    unknown_key_id: 'unknown_key_id',
    invalid_signature: 'invalid_signature',
    timestamp_expired: 'timestamp_expired',
    replay_detected: 'replay_detected',
    payload_too_large: 'payload_too_large',
    unsupported_media_type: 'unsupported_media_type',
    invalid_request: 'invalid_request',
    invalid_json: 'invalid_json',
    schema_not_supported: 'schema_not_supported',
    should_write_false: 'should_write_false',
    intake_overloaded: 'intake_overloaded',
    internal_error: 'internal_error'
};
/** HTTP status for each signature error code (aligned with `_signature_error_status`). */
export const SIGNATURE_ERROR_STATUS = {
    unknown_key_id: 401,
    invalid_signature: 401,
    timestamp_expired: 401,
    replay_detected: 403,
    payload_too_large: 413,
    unsupported_media_type: 415,
    invalid_request: 400
};
/**
 * Codes that a receiver may retry. Signature errors are terminal (a retry with the same
 * payload would fail again) except for transient 5xx / rate-limit codes produced by the
 * service itself.
 */
export function isRetryableCode(code) {
    return code === ERROR_CODES.intake_overloaded || code === ERROR_CODES.internal_error;
}
/**
 * HTTP-status based retry classification (byte-for-byte equivalent of Scanner
 * `classifyRetry`, parameterized only by status).
 */
export function classifyHttpStatus(httpStatus) {
    if (httpStatus === null || (httpStatus >= 500 && httpStatus <= 599)) {
        return 'network_or_5xx';
    }
    if (httpStatus === 429)
        return 'rate_limited';
    if ([400, 401, 403, 404].includes(httpStatus))
        return 'auth_or_config';
    return 'final';
}
const BACKOFF_SECONDS = {
    rate_limited: [60, 120, 300, 600, 1200, 1800],
    network_or_5xx: [30, 90, 180, 480, 900],
    auth_or_config: [120, 300, 600, 1200, 1800]
};
/**
 * Backoff seconds, byte-for-byte equivalent of Scanner `retryDelaySeconds`.
 * The `random` parameter is injectable for deterministic testing.
 */
export function retryDelaySeconds(retryClass, retryableFailureCount, retryAfterSeconds, random = Math.random) {
    if (retryClass === 'rate_limited' && retryAfterSeconds !== null && retryAfterSeconds >= 0) {
        return Math.ceil(retryAfterSeconds * (1 + random() * 0.1));
    }
    const values = BACKOFF_SECONDS[retryClass];
    const base = values[Math.min(retryableFailureCount, values.length - 1)];
    return Math.max(1, Math.round(base * (0.8 + random() * 0.4)));
}
