/**
 * publish-request (Writer → Publisher).
 */
import { z } from 'zod';
export const publishRequestSchema = z.object({
    schema_version: z.literal(1),
    request_id: z.string().uuid(),
    article_id: z.string(),
    platform: z.string(),
    account_id: z.string(),
    content_r2_key: z.string(),
    idempotency_key: z.string()
});
