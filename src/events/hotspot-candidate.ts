/**
 * hotspot-candidate (Scanner → Materials).
 *
 * Field-by-field from Scanner `src/domain/delivery.ts` `buildCandidateDeliveryPayload` and
 * `src/domain/contracts.ts`. The `score_breakdown`-sums-to-`writing_score` superRefine is
 * the single schema-level constraint (Scanner contracts.ts). The
 * `needs_source_verification` derivation is *not* validated here (delivery.ts L66-68 is
 * sender-side behavior, not a receiver constraint).
 */
import { z } from 'zod';

const scoreBreakdownSchema = z.object({
  timeliness: z.number().int().min(0).max(20),
  information_gain: z.number().int().min(0).max(20),
  audience_fit: z.number().int().min(0).max(15),
  verifiability: z.number().int().min(0).max(15),
  expandability: z.number().int().min(0).max(15),
  competition: z.number().int().min(0).max(5),
  risk: z.number().int().min(0).max(10)
});

const riskLevelSchema = z.enum([
  'allowed',
  'requires_authoritative_source',
  'requires_manual_review',
  'blocking'
]);

const aiReviewSucceededSchema = z
  .object({
    status: z.literal('succeeded'),
    writing_score: z.number().int().min(0).max(100),
    score_breakdown: scoreBreakdownSchema,
    summary: z.string().max(120),
    entities: z.array(z.object({ name: z.string(), type: z.string() })).max(20),
    risk_level: riskLevelSchema,
    risk_flags: z.array(z.string()).max(20),
    search_queries: z.array(z.string()).max(10)
  })
  .superRefine((value, context) => {
    const total = Object.values(value.score_breakdown).reduce((sum, score) => sum + score, 0);
    if (total !== value.writing_score) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'score_breakdown must sum to writing_score'
      });
    }
  });

const aiReviewSchema = z.union([
  z.object({ status: z.literal('unavailable') }),
  aiReviewSucceededSchema
]);

const evidenceItemSchema = z.object({
  source: z.enum(['internal_recent', 'internal_history', 'web_search']),
  title: z.string(),
  snippet: z.string().nullable(),
  url: z.string().nullable(),
  similarity: z.number().nullable(),
  meta: z.record(z.unknown()).optional()
});

export const hotspotCandidateSchema = z.object({
  schema_version: z.literal(1),
  event_type: z.literal('hotspot_candidate'),
  event_id: z.string(),
  candidate_version: z.number().int().min(1),
  notification_type: z.enum(['initial', 'update', 'degraded']),
  source: z.object({
    platform: z.literal('toutiao'),
    board: z.literal('hotboard'),
    url: z.string().nullable()
  }),
  topic: z.object({
    title: z.string().min(1).max(200),
    // Scanner passes input.sourceTags through verbatim; the contract does not promise a
    // structure (delivery.ts L60). Receivers must not assume it is an array.
    source_tags: z.unknown(),
    ai_category: z.string().nullable()
  }),
  observed: z.object({
    at: z.string().datetime({ offset: true }),
    rank: z.number().int().min(1),
    first_seen_at: z.string().datetime({ offset: true }),
    // Three-state semantics (see spec FR-1.1): key-absent, number, or explicit null.
    // `.nullable().optional()` — `.optional()` alone would reject the explicit-null form.
    hot_value: z.number().nullable().optional()
  }),
  trend: z.object({
    score: z.number().min(0).max(100),
    reasons: z.array(z.string())
  }),
  requirements: z.object({
    needs_source_verification: z.boolean(),
    do_not_treat_as_verified_fact: z.literal(true)
  }),
  idempotency_key: z.string(),
  ai_review: aiReviewSchema,
  evidence: z
    .object({
      verified: z.literal(false),
      note: z.string(),
      items: z.array(evidenceItemSchema).max(6)
    })
    .optional()
});

export type HotspotCandidate = z.infer<typeof hotspotCandidateSchema>;
export type HotspotCandidateAiReview = z.infer<typeof aiReviewSchema>;
export type HotspotCandidateEvidence = z.infer<typeof evidenceItemSchema>;
