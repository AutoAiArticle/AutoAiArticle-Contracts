/**
 * image-request (Writer → ImageGen), plus its response shape.
 */
import { z } from 'zod';
export declare const imageRequestSchema: z.ZodObject<{
    schema_version: z.ZodLiteral<1>;
    request_id: z.ZodString;
    article_id: z.ZodString;
    cover_prompt: z.ZodString;
    fallback_allowed: z.ZodLiteral<true>;
    idempotency_key: z.ZodString;
}, "strip", z.ZodTypeAny, {
    schema_version: 1;
    idempotency_key: string;
    request_id: string;
    article_id: string;
    cover_prompt: string;
    fallback_allowed: true;
}, {
    schema_version: 1;
    idempotency_key: string;
    request_id: string;
    article_id: string;
    cover_prompt: string;
    fallback_allowed: true;
}>;
export declare const imageResponseSchema: z.ZodObject<{
    asset_id: z.ZodString;
    r2_key: z.ZodString;
    fallback_used: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    asset_id: string;
    r2_key: string;
    fallback_used: boolean;
}, {
    asset_id: string;
    r2_key: string;
    fallback_used: boolean;
}>;
export type ImageRequest = z.infer<typeof imageRequestSchema>;
export type ImageResponse = z.infer<typeof imageResponseSchema>;
