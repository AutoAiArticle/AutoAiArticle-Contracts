/**
 * writing-request (Materials → Writer). New contract per the planning doc, Writer card.
 */
import { z } from 'zod';
const entityListSchema = (maxItems) => z.array(z.string().min(1).max(100)).max(maxItems);
export const writingRequestSchema = z
    .object({
    schema_version: z.literal(1),
    request_id: z.string().uuid(),
    bundle_id: z.string(),
    source_event_id: z.string(),
    event_snapshot: z.object({
        canonical_title: z.string().min(1).max(300),
        summary: z.string().min(50).max(4000),
        field: z.string().nullable(),
        risk_level: z.enum(['low', 'medium', 'high']),
        entities: z.object({
            people: entityListSchema(30),
            organizations: entityListSchema(30),
            locations: entityListSchema(30),
            keywords: entityListSchema(30),
            time_expressions: entityListSchema(30)
        })
    }),
    account_constraints: z.object({
        field_restrictions: z.array(z.string().min(1).max(100)).max(20),
        max_daily_posts: z.number().int().min(0).max(100)
    }),
    word_range: z.object({
        min: z.number().int().min(300).max(3000),
        max: z.number().int().min(500).max(10000)
    }),
    idempotency_key: z.string()
})
    .superRefine((value, context) => {
    if (value.word_range.min > value.word_range.max) {
        context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['word_range', 'min'],
            message: 'word_range.min must be <= word_range.max'
        });
    }
});
