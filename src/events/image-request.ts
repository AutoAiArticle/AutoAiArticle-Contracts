/**
 * image-request (Writer → ImageGen), plus its response shape.
 */
import { z } from 'zod';

export const imageRequestSchema = z.object({
  schema_version: z.literal(1),
  request_id: z.string().uuid(),
  article_id: z.string(),
  cover_prompt: z.string().max(500),
  fallback_allowed: z.literal(true),
  idempotency_key: z.string()
});

export const imageResponseSchema = z.object({
  asset_id: z.string(),
  r2_key: z.string(),
  fallback_used: z.boolean()
});

export type ImageRequest = z.infer<typeof imageRequestSchema>;
export type ImageResponse = z.infer<typeof imageResponseSchema>;
