/**
 * qualified-event (Materials → inbound; retains main-engine pydantic semantics).
 *
 * Translated field-by-field from the main-engine `app/schemas/inbound_event.py`
 * `QualifiedEventInbound`. Deliberate tightening vs. pydantic: all datetime fields require
 * a timezone offset (`offset: true`).
 */
import { z } from 'zod';
declare const referenceSchema: z.ZodObject<{
    url: z.ZodEffects<z.ZodString, string, string>;
    title: z.ZodString;
    source_name: z.ZodString;
    published_at: z.ZodOptional<z.ZodString>;
    observed_at: z.ZodOptional<z.ZodString>;
    is_authoritative: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    title: string;
    url: string;
    source_name: string;
    is_authoritative: boolean;
    published_at?: string | undefined;
    observed_at?: string | undefined;
}, {
    title: string;
    url: string;
    source_name: string;
    is_authoritative: boolean;
    published_at?: string | undefined;
    observed_at?: string | undefined;
}>;
export declare const qualifiedEventSchema: z.ZodObject<{
    schema_version: z.ZodLiteral<"1.0">;
    delivery_id: z.ZodString;
    source_event_id: z.ZodString;
    decision_revision: z.ZodNumber;
    occurred_at: z.ZodString;
    event: z.ZodObject<{
        canonical_title: z.ZodString;
        summary: z.ZodString;
        field: z.ZodNullable<z.ZodString>;
        risk_level: z.ZodEnum<["low", "medium", "high"]>;
        event_fingerprint: z.ZodString;
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
        event_fingerprint: string;
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
        event_fingerprint: string;
    }>;
    trend: z.ZodObject<{
        first_seen_at: z.ZodString;
        last_seen_at: z.ZodString;
        score: z.ZodNumber;
        trend_score: z.ZodNumber;
        source_count: z.ZodNumber;
        source_codes: z.ZodArray<z.ZodString, "many">;
        best_rank: z.ZodNullable<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        first_seen_at: string;
        score: number;
        last_seen_at: string;
        trend_score: number;
        source_count: number;
        source_codes: string[];
        best_rank: number | null;
    }, {
        first_seen_at: string;
        score: number;
        last_seen_at: string;
        trend_score: number;
        source_count: number;
        source_codes: string[];
        best_rank: number | null;
    }>;
    decision: z.ZodObject<{
        should_write: z.ZodLiteral<true>;
        priority: z.ZodEnum<["high", "normal"]>;
        decision_score: z.ZodNumber;
        reason_codes: z.ZodArray<z.ZodString, "many">;
        reason_summary: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        should_write: true;
        priority: "high" | "normal";
        decision_score: number;
        reason_codes: string[];
        reason_summary: string;
    }, {
        should_write: true;
        priority: "high" | "normal";
        decision_score: number;
        reason_codes: string[];
        reason_summary: string;
    }>;
    references: z.ZodArray<z.ZodObject<{
        url: z.ZodEffects<z.ZodString, string, string>;
        title: z.ZodString;
        source_name: z.ZodString;
        published_at: z.ZodOptional<z.ZodString>;
        observed_at: z.ZodOptional<z.ZodString>;
        is_authoritative: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        title: string;
        url: string;
        source_name: string;
        is_authoritative: boolean;
        published_at?: string | undefined;
        observed_at?: string | undefined;
    }, {
        title: string;
        url: string;
        source_name: string;
        is_authoritative: boolean;
        published_at?: string | undefined;
        observed_at?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    schema_version: "1.0";
    trend: {
        first_seen_at: string;
        score: number;
        last_seen_at: string;
        trend_score: number;
        source_count: number;
        source_codes: string[];
        best_rank: number | null;
    };
    delivery_id: string;
    source_event_id: string;
    decision_revision: number;
    occurred_at: string;
    event: {
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
        event_fingerprint: string;
    };
    decision: {
        should_write: true;
        priority: "high" | "normal";
        decision_score: number;
        reason_codes: string[];
        reason_summary: string;
    };
    references: {
        title: string;
        url: string;
        source_name: string;
        is_authoritative: boolean;
        published_at?: string | undefined;
        observed_at?: string | undefined;
    }[];
}, {
    schema_version: "1.0";
    trend: {
        first_seen_at: string;
        score: number;
        last_seen_at: string;
        trend_score: number;
        source_count: number;
        source_codes: string[];
        best_rank: number | null;
    };
    delivery_id: string;
    source_event_id: string;
    decision_revision: number;
    occurred_at: string;
    event: {
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
        event_fingerprint: string;
    };
    decision: {
        should_write: true;
        priority: "high" | "normal";
        decision_score: number;
        reason_codes: string[];
        reason_summary: string;
    };
    references: {
        title: string;
        url: string;
        source_name: string;
        is_authoritative: boolean;
        published_at?: string | undefined;
        observed_at?: string | undefined;
    }[];
}>;
export type QualifiedEvent = z.infer<typeof qualifiedEventSchema>;
export type QualifiedEventReference = z.infer<typeof referenceSchema>;
export {};
