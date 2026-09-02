/**
 * quality-verdict (QualityGate → Writer). New contract; thresholds from the main-engine
 * `app/core/config.py` and the two-stage decision logic from `pipeline.py`.
 */
import { z } from 'zod';
export declare const qualityVerdictSchema: z.ZodObject<{
    schema_version: z.ZodLiteral<1>;
    evaluation_id: z.ZodString;
    article_draft_id: z.ZodString;
    scores: z.ZodObject<{
        ai_trace: z.ZodObject<{
            score: z.ZodNumber;
            rule_score: z.ZodNumber;
            model_score: z.ZodNumber;
            passed: z.ZodBoolean;
            rewrite_required: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            score: number;
            rule_score: number;
            model_score: number;
            passed: boolean;
            rewrite_required: boolean;
        }, {
            score: number;
            rule_score: number;
            model_score: number;
            passed: boolean;
            rewrite_required: boolean;
        }>;
        originality: z.ZodObject<{
            score: z.ZodNumber;
            passed: z.ZodBoolean;
            similarity_evidence: z.ZodArray<z.ZodUnknown, "many">;
        }, "strip", z.ZodTypeAny, {
            score: number;
            passed: boolean;
            similarity_evidence: unknown[];
        }, {
            score: number;
            passed: boolean;
            similarity_evidence: unknown[];
        }>;
        fact_risk: z.ZodObject<{
            score: z.ZodNumber;
            passed: z.ZodBoolean;
            mismatched_entities: z.ZodArray<z.ZodUnknown, "many">;
        }, "strip", z.ZodTypeAny, {
            score: number;
            passed: boolean;
            mismatched_entities: unknown[];
        }, {
            score: number;
            passed: boolean;
            mismatched_entities: unknown[];
        }>;
        values: z.ZodObject<{
            score: z.ZodNumber;
            passed: z.ZodBoolean;
            hard_block: z.ZodBoolean;
            hit_rules: z.ZodArray<z.ZodUnknown, "many">;
        }, "strip", z.ZodTypeAny, {
            score: number;
            passed: boolean;
            hard_block: boolean;
            hit_rules: unknown[];
        }, {
            score: number;
            passed: boolean;
            hard_block: boolean;
            hit_rules: unknown[];
        }>;
    }, "strip", z.ZodTypeAny, {
        values: {
            score: number;
            passed: boolean;
            hard_block: boolean;
            hit_rules: unknown[];
        };
        ai_trace: {
            score: number;
            rule_score: number;
            model_score: number;
            passed: boolean;
            rewrite_required: boolean;
        };
        originality: {
            score: number;
            passed: boolean;
            similarity_evidence: unknown[];
        };
        fact_risk: {
            score: number;
            passed: boolean;
            mismatched_entities: unknown[];
        };
    }, {
        values: {
            score: number;
            passed: boolean;
            hard_block: boolean;
            hit_rules: unknown[];
        };
        ai_trace: {
            score: number;
            rule_score: number;
            model_score: number;
            passed: boolean;
            rewrite_required: boolean;
        };
        originality: {
            score: number;
            passed: boolean;
            similarity_evidence: unknown[];
        };
        fact_risk: {
            score: number;
            passed: boolean;
            mismatched_entities: unknown[];
        };
    }>;
    overall_passed: z.ZodBoolean;
    reasons: z.ZodArray<z.ZodString, "many">;
    evaluated_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    schema_version: 1;
    reasons: string[];
    evaluation_id: string;
    article_draft_id: string;
    scores: {
        values: {
            score: number;
            passed: boolean;
            hard_block: boolean;
            hit_rules: unknown[];
        };
        ai_trace: {
            score: number;
            rule_score: number;
            model_score: number;
            passed: boolean;
            rewrite_required: boolean;
        };
        originality: {
            score: number;
            passed: boolean;
            similarity_evidence: unknown[];
        };
        fact_risk: {
            score: number;
            passed: boolean;
            mismatched_entities: unknown[];
        };
    };
    overall_passed: boolean;
    evaluated_at: string;
}, {
    schema_version: 1;
    reasons: string[];
    evaluation_id: string;
    article_draft_id: string;
    scores: {
        values: {
            score: number;
            passed: boolean;
            hard_block: boolean;
            hit_rules: unknown[];
        };
        ai_trace: {
            score: number;
            rule_score: number;
            model_score: number;
            passed: boolean;
            rewrite_required: boolean;
        };
        originality: {
            score: number;
            passed: boolean;
            similarity_evidence: unknown[];
        };
        fact_risk: {
            score: number;
            passed: boolean;
            mismatched_entities: unknown[];
        };
    };
    overall_passed: boolean;
    evaluated_at: string;
}>;
export type QualityVerdict = z.infer<typeof qualityVerdictSchema>;
