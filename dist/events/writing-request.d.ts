/**
 * writing-request (Materials → Writer). New contract per the planning doc, Writer card.
 */
import { z } from 'zod';
export declare const writingRequestSchema: z.ZodEffects<z.ZodObject<{
    schema_version: z.ZodLiteral<1>;
    request_id: z.ZodString;
    bundle_id: z.ZodString;
    source_event_id: z.ZodString;
    event_snapshot: z.ZodObject<{
        canonical_title: z.ZodString;
        summary: z.ZodString;
        field: z.ZodNullable<z.ZodString>;
        risk_level: z.ZodEnum<["low", "medium", "high"]>;
        entities: z.ZodObject<{
            people: z.ZodArray<z.ZodString, "many">;
            organizations: z.ZodArray<z.ZodString, "many">;
            locations: z.ZodArray<z.ZodString, "many">;
            keywords: z.ZodArray<z.ZodString, "many">;
            time_expressions: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            people: string[];
            organizations: string[];
            locations: string[];
            keywords: string[];
            time_expressions: string[];
        }, {
            people: string[];
            organizations: string[];
            locations: string[];
            keywords: string[];
            time_expressions: string[];
        }>;
    }, "strip", z.ZodTypeAny, {
        summary: string;
        entities: {
            people: string[];
            organizations: string[];
            locations: string[];
            keywords: string[];
            time_expressions: string[];
        };
        risk_level: "low" | "medium" | "high";
        canonical_title: string;
        field: string | null;
    }, {
        summary: string;
        entities: {
            people: string[];
            organizations: string[];
            locations: string[];
            keywords: string[];
            time_expressions: string[];
        };
        risk_level: "low" | "medium" | "high";
        canonical_title: string;
        field: string | null;
    }>;
    account_constraints: z.ZodObject<{
        field_restrictions: z.ZodArray<z.ZodString, "many">;
        max_daily_posts: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        field_restrictions: string[];
        max_daily_posts: number;
    }, {
        field_restrictions: string[];
        max_daily_posts: number;
    }>;
    word_range: z.ZodObject<{
        min: z.ZodNumber;
        max: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        min: number;
        max: number;
    }, {
        min: number;
        max: number;
    }>;
    idempotency_key: z.ZodString;
}, "strip", z.ZodTypeAny, {
    schema_version: 1;
    idempotency_key: string;
    source_event_id: string;
    request_id: string;
    bundle_id: string;
    event_snapshot: {
        summary: string;
        entities: {
            people: string[];
            organizations: string[];
            locations: string[];
            keywords: string[];
            time_expressions: string[];
        };
        risk_level: "low" | "medium" | "high";
        canonical_title: string;
        field: string | null;
    };
    account_constraints: {
        field_restrictions: string[];
        max_daily_posts: number;
    };
    word_range: {
        min: number;
        max: number;
    };
}, {
    schema_version: 1;
    idempotency_key: string;
    source_event_id: string;
    request_id: string;
    bundle_id: string;
    event_snapshot: {
        summary: string;
        entities: {
            people: string[];
            organizations: string[];
            locations: string[];
            keywords: string[];
            time_expressions: string[];
        };
        risk_level: "low" | "medium" | "high";
        canonical_title: string;
        field: string | null;
    };
    account_constraints: {
        field_restrictions: string[];
        max_daily_posts: number;
    };
    word_range: {
        min: number;
        max: number;
    };
}>, {
    schema_version: 1;
    idempotency_key: string;
    source_event_id: string;
    request_id: string;
    bundle_id: string;
    event_snapshot: {
        summary: string;
        entities: {
            people: string[];
            organizations: string[];
            locations: string[];
            keywords: string[];
            time_expressions: string[];
        };
        risk_level: "low" | "medium" | "high";
        canonical_title: string;
        field: string | null;
    };
    account_constraints: {
        field_restrictions: string[];
        max_daily_posts: number;
    };
    word_range: {
        min: number;
        max: number;
    };
}, {
    schema_version: 1;
    idempotency_key: string;
    source_event_id: string;
    request_id: string;
    bundle_id: string;
    event_snapshot: {
        summary: string;
        entities: {
            people: string[];
            organizations: string[];
            locations: string[];
            keywords: string[];
            time_expressions: string[];
        };
        risk_level: "low" | "medium" | "high";
        canonical_title: string;
        field: string | null;
    };
    account_constraints: {
        field_restrictions: string[];
        max_daily_posts: number;
    };
    word_range: {
        min: number;
        max: number;
    };
}>;
export type WritingRequest = z.infer<typeof writingRequestSchema>;
