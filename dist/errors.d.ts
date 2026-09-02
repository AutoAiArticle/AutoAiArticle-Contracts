/**
 * Error codes and retry classification.
 *
 * Retry classification mirrors Scanner `src/domain/state-machine.ts` `classifyRetry`,
 * `BACKOFF_SECONDS`, and `retryDelaySeconds` byte-for-byte so both sides' retry rhythm
 * stays identical.
 */
/** Signature / inbound error codes (aligned with main-engine SignatureError codes). */
export declare const ERROR_CODES: {
    readonly unknown_key_id: "unknown_key_id";
    readonly invalid_signature: "invalid_signature";
    readonly timestamp_expired: "timestamp_expired";
    readonly replay_detected: "replay_detected";
    readonly payload_too_large: "payload_too_large";
    readonly unsupported_media_type: "unsupported_media_type";
    readonly invalid_request: "invalid_request";
    readonly invalid_json: "invalid_json";
    readonly schema_not_supported: "schema_not_supported";
    readonly should_write_false: "should_write_false";
    readonly intake_overloaded: "intake_overloaded";
    readonly internal_error: "internal_error";
};
export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
/** HTTP status for each signature error code (aligned with `_signature_error_status`). */
export declare const SIGNATURE_ERROR_STATUS: Record<string, number>;
/**
 * Codes that a receiver may retry. Signature errors are terminal (a retry with the same
 * payload would fail again) except for transient 5xx / rate-limit codes produced by the
 * service itself.
 */
export declare function isRetryableCode(code: string): boolean;
export type RetryClass = 'rate_limited' | 'network_or_5xx' | 'auth_or_config' | 'final';
/**
 * HTTP-status based retry classification (byte-for-byte equivalent of Scanner
 * `classifyRetry`, parameterized only by status).
 */
export declare function classifyHttpStatus(httpStatus: number | null): RetryClass;
/**
 * Backoff seconds, byte-for-byte equivalent of Scanner `retryDelaySeconds`.
 * The `random` parameter is injectable for deterministic testing.
 */
export declare function retryDelaySeconds(retryClass: Exclude<RetryClass, 'final'>, retryableFailureCount: number, retryAfterSeconds: number | null, random?: () => number): number;
