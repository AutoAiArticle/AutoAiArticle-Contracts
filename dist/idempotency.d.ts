/**
 * Idempotency key construction and validation.
 *
 * Sources: Scanner `buildCandidateDeliveryPayload` (candidate key) and the main-engine
 * inbound service (writing key).
 */
/** `toutiao:{sourceTopicId}:{candidateVersion}:{notificationType}` */
export declare function candidateIdempotencyKey(sourceTopicId: string, version: number, type: string): string;
/** `{sourceEventId}:write:v1` */
export declare function writingIdempotencyKey(sourceEventId: string): string;
/**
 * Validate an idempotency key's *shape*. This is a structural sanity check (non-empty,
 * no whitespace, no control characters), not a full semantic validator.
 */
export declare function validateIdempotencyKeyFormat(key: string): boolean;
