/**
 * Idempotency key construction and validation.
 *
 * Sources: Scanner `buildCandidateDeliveryPayload` (candidate key) and the main-engine
 * inbound service (writing key).
 */

/** `toutiao:{sourceTopicId}:{candidateVersion}:{notificationType}` */
export function candidateIdempotencyKey(
  sourceTopicId: string,
  version: number,
  type: string
): string {
  return `toutiao:${sourceTopicId}:${version}:${type}`;
}

/** `{sourceEventId}:write:v1` */
export function writingIdempotencyKey(sourceEventId: string): string {
  return `${sourceEventId}:write:v1`;
}

/**
 * Validate an idempotency key's *shape*. This is a structural sanity check (non-empty,
 * no whitespace, no control characters), not a full semantic validator.
 */
export function validateIdempotencyKeyFormat(key: string): boolean {
  if (typeof key !== 'string' || key.length === 0) return false;
  if (key.length > 512) return false;
  // Reject whitespace and control characters; keys are ASCII-safe tokens.
  return !/[\s\u0000-\u001f\u007f]/.test(key);
}
