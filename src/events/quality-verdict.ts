/**
 * quality-verdict (QualityGate → Writer). New contract; thresholds from the main-engine
 * `app/core/config.py` and the two-stage decision logic from `pipeline.py`.
 */
import { z } from 'zod';

const boundedScore = z.number().min(0).max(100);

export const qualityVerdictSchema = z.object({
  schema_version: z.literal(1),
  evaluation_id: z.string().uuid(),
  article_draft_id: z.string(),
  scores: z.object({
    ai_trace: z.object({
      score: boundedScore,
      rule_score: boundedScore,
      model_score: boundedScore,
      passed: z.boolean(),
      rewrite_required: z.boolean()
    }),
    originality: z.object({
      score: boundedScore,
      passed: z.boolean(),
      similarity_evidence: z.array(z.unknown())
    }),
    fact_risk: z.object({
      score: boundedScore,
      passed: z.boolean(),
      mismatched_entities: z.array(z.unknown())
    }),
    values: z.object({
      score: boundedScore,
      passed: z.boolean(),
      hard_block: z.boolean(),
      hit_rules: z.array(z.unknown())
    })
  }),
  overall_passed: z.boolean(),
  reasons: z.array(z.string()),
  evaluated_at: z.string().datetime({ offset: true })
});

export type QualityVerdict = z.infer<typeof qualityVerdictSchema>;
