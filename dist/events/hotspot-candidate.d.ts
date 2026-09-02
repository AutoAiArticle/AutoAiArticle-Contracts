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
declare const aiReviewSchema: z.ZodUnion<[z.ZodObject<{
    status: z.ZodLiteral<"unavailable">;
}, "strip", z.ZodTypeAny, {
    status: "unavailable";
}, {
    status: "unavailable";
}>, z.ZodEffects<z.ZodObject<{
    status: z.ZodLiteral<"succeeded">;
    writing_score: z.ZodNumber;
    score_breakdown: z.ZodObject<{
        timeliness: z.ZodNumber;
        information_gain: z.ZodNumber;
        audience_fit: z.ZodNumber;
        verifiability: z.ZodNumber;
        expandability: z.ZodNumber;
        competition: z.ZodNumber;
        risk: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        timeliness: number;
        information_gain: number;
        audience_fit: number;
        verifiability: number;
        expandability: number;
        competition: number;
        risk: number;
    }, {
        timeliness: number;
        information_gain: number;
        audience_fit: number;
        verifiability: number;
        expandability: number;
        competition: number;
        risk: number;
    }>;
    summary: z.ZodString;
    entities: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        type: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        type: string;
    }, {
        name: string;
        type: string;
    }>, "many">;
    risk_level: z.ZodEnum<["allowed", "requires_authoritative_source", "requires_manual_review", "blocking"]>;
    risk_flags: z.ZodArray<z.ZodString, "many">;
    search_queries: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    status: "succeeded";
    writing_score: number;
    score_breakdown: {
        timeliness: number;
        information_gain: number;
        audience_fit: number;
        verifiability: number;
        expandability: number;
        competition: number;
        risk: number;
    };
    summary: string;
    entities: {
        name: string;
        type: string;
    }[];
    risk_level: "allowed" | "requires_authoritative_source" | "requires_manual_review" | "blocking";
    risk_flags: string[];
    search_queries: string[];
}, {
    status: "succeeded";
    writing_score: number;
    score_breakdown: {
        timeliness: number;
        information_gain: number;
        audience_fit: number;
        verifiability: number;
        expandability: number;
        competition: number;
        risk: number;
    };
    summary: string;
    entities: {
        name: string;
        type: string;
    }[];
    risk_level: "allowed" | "requires_authoritative_source" | "requires_manual_review" | "blocking";
    risk_flags: string[];
    search_queries: string[];
}>, {
    status: "succeeded";
    writing_score: number;
    score_breakdown: {
        timeliness: number;
        information_gain: number;
        audience_fit: number;
        verifiability: number;
        expandability: number;
        competition: number;
        risk: number;
    };
    summary: string;
    entities: {
        name: string;
        type: string;
    }[];
    risk_level: "allowed" | "requires_authoritative_source" | "requires_manual_review" | "blocking";
    risk_flags: string[];
    search_queries: string[];
}, {
    status: "succeeded";
    writing_score: number;
    score_breakdown: {
        timeliness: number;
        information_gain: number;
        audience_fit: number;
        verifiability: number;
        expandability: number;
        competition: number;
        risk: number;
    };
    summary: string;
    entities: {
        name: string;
        type: string;
    }[];
    risk_level: "allowed" | "requires_authoritative_source" | "requires_manual_review" | "blocking";
    risk_flags: string[];
    search_queries: string[];
}>]>;
declare const evidenceItemSchema: z.ZodObject<{
    source: z.ZodEnum<["internal_recent", "internal_history", "web_search"]>;
    title: z.ZodString;
    snippet: z.ZodNullable<z.ZodString>;
    url: z.ZodNullable<z.ZodString>;
    similarity: z.ZodNullable<z.ZodNumber>;
    meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    source: "internal_recent" | "internal_history" | "web_search";
    title: string;
    snippet: string | null;
    url: string | null;
    similarity: number | null;
    meta?: Record<string, unknown> | undefined;
}, {
    source: "internal_recent" | "internal_history" | "web_search";
    title: string;
    snippet: string | null;
    url: string | null;
    similarity: number | null;
    meta?: Record<string, unknown> | undefined;
}>;
export declare const hotspotCandidateSchema: z.ZodObject<{
    schema_version: z.ZodLiteral<1>;
    event_type: z.ZodLiteral<"hotspot_candidate">;
    event_id: z.ZodString;
    candidate_version: z.ZodNumber;
    notification_type: z.ZodEnum<["initial", "update", "degraded"]>;
    source: z.ZodObject<{
        platform: z.ZodLiteral<"toutiao">;
        board: z.ZodLiteral<"hotboard">;
        url: z.ZodNullable<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        url: string | null;
        platform: "toutiao";
        board: "hotboard";
    }, {
        url: string | null;
        platform: "toutiao";
        board: "hotboard";
    }>;
    topic: z.ZodObject<{
        title: z.ZodString;
        source_tags: z.ZodUnknown;
        ai_category: z.ZodNullable<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        title: string;
        ai_category: string | null;
        source_tags?: unknown;
    }, {
        title: string;
        ai_category: string | null;
        source_tags?: unknown;
    }>;
    observed: z.ZodObject<{
        at: z.ZodString;
        rank: z.ZodNumber;
        first_seen_at: z.ZodString;
        hot_value: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    }, "strip", z.ZodTypeAny, {
        at: string;
        rank: number;
        first_seen_at: string;
        hot_value?: number | null | undefined;
    }, {
        at: string;
        rank: number;
        first_seen_at: string;
        hot_value?: number | null | undefined;
    }>;
    trend: z.ZodObject<{
        score: z.ZodNumber;
        reasons: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        score: number;
        reasons: string[];
    }, {
        score: number;
        reasons: string[];
    }>;
    requirements: z.ZodObject<{
        needs_source_verification: z.ZodBoolean;
        do_not_treat_as_verified_fact: z.ZodLiteral<true>;
    }, "strip", z.ZodTypeAny, {
        needs_source_verification: boolean;
        do_not_treat_as_verified_fact: true;
    }, {
        needs_source_verification: boolean;
        do_not_treat_as_verified_fact: true;
    }>;
    idempotency_key: z.ZodString;
    ai_review: z.ZodUnion<[z.ZodObject<{
        status: z.ZodLiteral<"unavailable">;
    }, "strip", z.ZodTypeAny, {
        status: "unavailable";
    }, {
        status: "unavailable";
    }>, z.ZodEffects<z.ZodObject<{
        status: z.ZodLiteral<"succeeded">;
        writing_score: z.ZodNumber;
        score_breakdown: z.ZodObject<{
            timeliness: z.ZodNumber;
            information_gain: z.ZodNumber;
            audience_fit: z.ZodNumber;
            verifiability: z.ZodNumber;
            expandability: z.ZodNumber;
            competition: z.ZodNumber;
            risk: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            timeliness: number;
            information_gain: number;
            audience_fit: number;
            verifiability: number;
            expandability: number;
            competition: number;
            risk: number;
        }, {
            timeliness: number;
            information_gain: number;
            audience_fit: number;
            verifiability: number;
            expandability: number;
            competition: number;
            risk: number;
        }>;
        summary: z.ZodString;
        entities: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            type: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
            type: string;
        }, {
            name: string;
            type: string;
        }>, "many">;
        risk_level: z.ZodEnum<["allowed", "requires_authoritative_source", "requires_manual_review", "blocking"]>;
        risk_flags: z.ZodArray<z.ZodString, "many">;
        search_queries: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        status: "succeeded";
        writing_score: number;
        score_breakdown: {
            timeliness: number;
            information_gain: number;
            audience_fit: number;
            verifiability: number;
            expandability: number;
            competition: number;
            risk: number;
        };
        summary: string;
        entities: {
            name: string;
            type: string;
        }[];
        risk_level: "allowed" | "requires_authoritative_source" | "requires_manual_review" | "blocking";
        risk_flags: string[];
        search_queries: string[];
    }, {
        status: "succeeded";
        writing_score: number;
        score_breakdown: {
            timeliness: number;
            information_gain: number;
            audience_fit: number;
            verifiability: number;
            expandability: number;
            competition: number;
            risk: number;
        };
        summary: string;
        entities: {
            name: string;
            type: string;
        }[];
        risk_level: "allowed" | "requires_authoritative_source" | "requires_manual_review" | "blocking";
        risk_flags: string[];
        search_queries: string[];
    }>, {
        status: "succeeded";
        writing_score: number;
        score_breakdown: {
            timeliness: number;
            information_gain: number;
            audience_fit: number;
            verifiability: number;
            expandability: number;
            competition: number;
            risk: number;
        };
        summary: string;
        entities: {
            name: string;
            type: string;
        }[];
        risk_level: "allowed" | "requires_authoritative_source" | "requires_manual_review" | "blocking";
        risk_flags: string[];
        search_queries: string[];
    }, {
        status: "succeeded";
        writing_score: number;
        score_breakdown: {
            timeliness: number;
            information_gain: number;
            audience_fit: number;
            verifiability: number;
            expandability: number;
            competition: number;
            risk: number;
        };
        summary: string;
        entities: {
            name: string;
            type: string;
        }[];
        risk_level: "allowed" | "requires_authoritative_source" | "requires_manual_review" | "blocking";
        risk_flags: string[];
        search_queries: string[];
    }>]>;
    evidence: z.ZodOptional<z.ZodObject<{
        verified: z.ZodLiteral<false>;
        note: z.ZodString;
        items: z.ZodArray<z.ZodObject<{
            source: z.ZodEnum<["internal_recent", "internal_history", "web_search"]>;
            title: z.ZodString;
            snippet: z.ZodNullable<z.ZodString>;
            url: z.ZodNullable<z.ZodString>;
            similarity: z.ZodNullable<z.ZodNumber>;
            meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, "strip", z.ZodTypeAny, {
            source: "internal_recent" | "internal_history" | "web_search";
            title: string;
            snippet: string | null;
            url: string | null;
            similarity: number | null;
            meta?: Record<string, unknown> | undefined;
        }, {
            source: "internal_recent" | "internal_history" | "web_search";
            title: string;
            snippet: string | null;
            url: string | null;
            similarity: number | null;
            meta?: Record<string, unknown> | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        verified: false;
        note: string;
        items: {
            source: "internal_recent" | "internal_history" | "web_search";
            title: string;
            snippet: string | null;
            url: string | null;
            similarity: number | null;
            meta?: Record<string, unknown> | undefined;
        }[];
    }, {
        verified: false;
        note: string;
        items: {
            source: "internal_recent" | "internal_history" | "web_search";
            title: string;
            snippet: string | null;
            url: string | null;
            similarity: number | null;
            meta?: Record<string, unknown> | undefined;
        }[];
    }>>;
}, "strip", z.ZodTypeAny, {
    source: {
        url: string | null;
        platform: "toutiao";
        board: "hotboard";
    };
    schema_version: 1;
    event_type: "hotspot_candidate";
    event_id: string;
    candidate_version: number;
    notification_type: "initial" | "update" | "degraded";
    topic: {
        title: string;
        ai_category: string | null;
        source_tags?: unknown;
    };
    observed: {
        at: string;
        rank: number;
        first_seen_at: string;
        hot_value?: number | null | undefined;
    };
    trend: {
        score: number;
        reasons: string[];
    };
    requirements: {
        needs_source_verification: boolean;
        do_not_treat_as_verified_fact: true;
    };
    idempotency_key: string;
    ai_review: {
        status: "succeeded";
        writing_score: number;
        score_breakdown: {
            timeliness: number;
            information_gain: number;
            audience_fit: number;
            verifiability: number;
            expandability: number;
            competition: number;
            risk: number;
        };
        summary: string;
        entities: {
            name: string;
            type: string;
        }[];
        risk_level: "allowed" | "requires_authoritative_source" | "requires_manual_review" | "blocking";
        risk_flags: string[];
        search_queries: string[];
    } | {
        status: "unavailable";
    };
    evidence?: {
        verified: false;
        note: string;
        items: {
            source: "internal_recent" | "internal_history" | "web_search";
            title: string;
            snippet: string | null;
            url: string | null;
            similarity: number | null;
            meta?: Record<string, unknown> | undefined;
        }[];
    } | undefined;
}, {
    source: {
        url: string | null;
        platform: "toutiao";
        board: "hotboard";
    };
    schema_version: 1;
    event_type: "hotspot_candidate";
    event_id: string;
    candidate_version: number;
    notification_type: "initial" | "update" | "degraded";
    topic: {
        title: string;
        ai_category: string | null;
        source_tags?: unknown;
    };
    observed: {
        at: string;
        rank: number;
        first_seen_at: string;
        hot_value?: number | null | undefined;
    };
    trend: {
        score: number;
        reasons: string[];
    };
    requirements: {
        needs_source_verification: boolean;
        do_not_treat_as_verified_fact: true;
    };
    idempotency_key: string;
    ai_review: {
        status: "succeeded";
        writing_score: number;
        score_breakdown: {
            timeliness: number;
            information_gain: number;
            audience_fit: number;
            verifiability: number;
            expandability: number;
            competition: number;
            risk: number;
        };
        summary: string;
        entities: {
            name: string;
            type: string;
        }[];
        risk_level: "allowed" | "requires_authoritative_source" | "requires_manual_review" | "blocking";
        risk_flags: string[];
        search_queries: string[];
    } | {
        status: "unavailable";
    };
    evidence?: {
        verified: false;
        note: string;
        items: {
            source: "internal_recent" | "internal_history" | "web_search";
            title: string;
            snippet: string | null;
            url: string | null;
            similarity: number | null;
            meta?: Record<string, unknown> | undefined;
        }[];
    } | undefined;
}>;
export type HotspotCandidate = z.infer<typeof hotspotCandidateSchema>;
export type HotspotCandidateAiReview = z.infer<typeof aiReviewSchema>;
export type HotspotCandidateEvidence = z.infer<typeof evidenceItemSchema>;
export {};
