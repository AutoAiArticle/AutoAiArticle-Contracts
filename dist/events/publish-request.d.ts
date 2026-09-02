/**
 * publish-request (Writer → Publisher).
 */
import { z } from 'zod';
export declare const publishRequestSchema: z.ZodObject<{
    schema_version: z.ZodLiteral<1>;
    request_id: z.ZodString;
    article_id: z.ZodString;
    platform: z.ZodString;
    account_id: z.ZodString;
    content_r2_key: z.ZodString;
    idempotency_key: z.ZodString;
}, "strip", z.ZodTypeAny, {
    schema_version: 1;
    platform: string;
    idempotency_key: string;
    request_id: string;
    article_id: string;
    account_id: string;
    content_r2_key: string;
}, {
    schema_version: 1;
    platform: string;
    idempotency_key: string;
    request_id: string;
    article_id: string;
    account_id: string;
    content_r2_key: string;
}>;
export type PublishRequest = z.infer<typeof publishRequestSchema>;
