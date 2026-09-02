/**
 * candidate-feedback (Writer/Publisher → Scanner).
 *
 * Copied field-for-field from Scanner `src/domain/contracts.ts` `feedbackSchema`, including
 * the two superRefine constraints (rejected → rejected_reason; article_created/published →
 * article_id).
 */
import { z } from 'zod';
const ISO_UTC_SECOND = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
export const candidateFeedbackSchema = z
    .object({
    schema_version: z.literal(1),
    callback_id: z.string().uuid(),
    receipt_id: z.string().min(1),
    idempotency_key: z.string().min(1),
    event_id: z.string().min(1),
    lifecycle_status: z.enum(['received', 'adopted', 'rejected', 'article_created', 'published']),
    adopted: z.boolean().nullable(),
    rejected_reason: z.string().max(500).nullable(),
    article_id: z.string().max(128).nullable(),
    article_created_at: z.string().regex(ISO_UTC_SECOND).nullable(),
    published_at: z.string().regex(ISO_UTC_SECOND).nullable(),
    manual_quality_score: z.number().int().min(0).max(100).nullable(),
    performance_score: z.number().nonnegative().nullable(),
    occurred_at: z.string().regex(ISO_UTC_SECOND)
})
    .superRefine((value, context) => {
    if (value.lifecycle_status === 'rejected' && !value.rejected_reason) {
        context.addIssue({ code: z.ZodIssueCode.custom, message: 'rejected_reason required' });
    }
    if (['article_created', 'published'].includes(value.lifecycle_status) && !value.article_id) {
        context.addIssue({ code: z.ZodIssueCode.custom, message: 'article_id required' });
    }
});
