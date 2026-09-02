/**
 * candidate-feedback (Writer/Publisher → Scanner).
 *
 * Copied field-for-field from Scanner `src/domain/contracts.ts` `feedbackSchema`, including
 * the two superRefine constraints (rejected → rejected_reason; article_created/published →
 * article_id).
 */
import { z } from 'zod';
export declare const candidateFeedbackSchema: z.ZodEffects<z.ZodObject<{
    schema_version: z.ZodLiteral<1>;
    callback_id: z.ZodString;
    receipt_id: z.ZodString;
    idempotency_key: z.ZodString;
    event_id: z.ZodString;
    lifecycle_status: z.ZodEnum<["received", "adopted", "rejected", "article_created", "published"]>;
    adopted: z.ZodNullable<z.ZodBoolean>;
    rejected_reason: z.ZodNullable<z.ZodString>;
    article_id: z.ZodNullable<z.ZodString>;
    article_created_at: z.ZodNullable<z.ZodString>;
    published_at: z.ZodNullable<z.ZodString>;
    manual_quality_score: z.ZodNullable<z.ZodNumber>;
    performance_score: z.ZodNullable<z.ZodNumber>;
    occurred_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    schema_version: 1;
    event_id: string;
    idempotency_key: string;
    published_at: string | null;
    occurred_at: string;
    article_id: string | null;
    callback_id: string;
    receipt_id: string;
    lifecycle_status: "received" | "adopted" | "rejected" | "article_created" | "published";
    adopted: boolean | null;
    rejected_reason: string | null;
    article_created_at: string | null;
    manual_quality_score: number | null;
    performance_score: number | null;
}, {
    schema_version: 1;
    event_id: string;
    idempotency_key: string;
    published_at: string | null;
    occurred_at: string;
    article_id: string | null;
    callback_id: string;
    receipt_id: string;
    lifecycle_status: "received" | "adopted" | "rejected" | "article_created" | "published";
    adopted: boolean | null;
    rejected_reason: string | null;
    article_created_at: string | null;
    manual_quality_score: number | null;
    performance_score: number | null;
}>, {
    schema_version: 1;
    event_id: string;
    idempotency_key: string;
    published_at: string | null;
    occurred_at: string;
    article_id: string | null;
    callback_id: string;
    receipt_id: string;
    lifecycle_status: "received" | "adopted" | "rejected" | "article_created" | "published";
    adopted: boolean | null;
    rejected_reason: string | null;
    article_created_at: string | null;
    manual_quality_score: number | null;
    performance_score: number | null;
}, {
    schema_version: 1;
    event_id: string;
    idempotency_key: string;
    published_at: string | null;
    occurred_at: string;
    article_id: string | null;
    callback_id: string;
    receipt_id: string;
    lifecycle_status: "received" | "adopted" | "rejected" | "article_created" | "published";
    adopted: boolean | null;
    rejected_reason: string | null;
    article_created_at: string | null;
    manual_quality_score: number | null;
    performance_score: number | null;
}>;
export type CandidateFeedback = z.infer<typeof candidateFeedbackSchema>;
