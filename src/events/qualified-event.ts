/**
 * qualified-event (Materials → inbound; retains main-engine pydantic semantics).
 *
 * Translated field-by-field from the main-engine `app/schemas/inbound_event.py`
 * `QualifiedEventInbound`. Deliberate tightening vs. pydantic: all datetime fields require
 * a timezone offset (`offset: true`).
 */
import { z } from 'zod';

const URL_RE = /^https?:\/\/.+/i;

const PRIVATE_HOST_RE =
  /^(localhost|127\.0\.0\.1|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+|169\.254\.\d+\.\d+)$/i;

const URL_SAFE_SCHEMES = ['http:', 'https:'];

function validateReferenceUrl(url: string): boolean {
  // Length already checked by the string schema; here we do the semantic checks.
  if (url.length > 2000) return false;
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }
  if (!URL_SAFE_SCHEMES.includes(parsed.protocol)) return false;
  if (!parsed.hostname) return false;
  if (parsed.username || parsed.password) return false;
  if (PRIVATE_HOST_RE.test(parsed.hostname)) return false;
  return true;
}

const entityListSchema = (maxItems: number) => z.array(z.string().min(1).max(100)).max(maxItems);

const entitiesSchema = z.object({
  people: entityListSchema(30),
  organizations: entityListSchema(30),
  locations: entityListSchema(30),
  keywords: entityListSchema(30),
  time_expressions: entityListSchema(30)
});

const eventSchema = z.object({
  canonical_title: z.string().min(1).max(300),
  summary: z.string().min(50).max(4000),
  field: z.string().nullable(),
  risk_level: z.enum(['low', 'medium', 'high']),
  event_fingerprint: z.string().min(1).max(128),
  entities: entitiesSchema
});

const trendSchema = z.object({
  first_seen_at: z.string().datetime({ offset: true }),
  last_seen_at: z.string().datetime({ offset: true }),
  score: z.number().min(0).max(100),
  trend_score: z.number().min(0).max(100),
  source_count: z.number().int().min(1),
  source_codes: z.array(z.string()).max(20),
  best_rank: z.number().int().min(1).nullable()
});

const decisionSchema = z.object({
  should_write: z.literal(true),
  priority: z.enum(['high', 'normal']),
  decision_score: z.number().min(0).max(100),
  reason_codes: z.array(z.string()).min(1).max(20),
  reason_summary: z.string().max(1000)
});

const referenceSchema = z.object({
  url: z
    .string()
    .min(1)
    .max(2000)
    .regex(URL_RE, 'url must be http(s)')
    .refine(validateReferenceUrl, {
      message: 'url must have a valid host and must not point at private hosts'
    }),
  title: z.string().max(300),
  source_name: z.string().max(200),
  published_at: z.string().datetime({ offset: true }).optional(),
  observed_at: z.string().datetime({ offset: true }).optional(),
  is_authoritative: z.boolean()
});

export const qualifiedEventSchema = z.object({
  schema_version: z.literal('1.0'),
  delivery_id: z.string().min(8).max(64),
  source_event_id: z.string().min(1).max(128),
  decision_revision: z.number().int().min(1),
  occurred_at: z.string().datetime({ offset: true }),
  event: eventSchema,
  trend: trendSchema,
  decision: decisionSchema,
  references: z.array(referenceSchema).min(1).max(20)
});

export type QualifiedEvent = z.infer<typeof qualifiedEventSchema>;
export type QualifiedEventReference = z.infer<typeof referenceSchema>;
