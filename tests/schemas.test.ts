/**
 * Focused edge-case tests for the documented tricky semantics:
 * - hotspot-candidate `hot_value` three-state (absent / number / null)
 * - hotspot-candidate `needs_source_verification` must NOT be a receiver-side validation
 * - qualified-event reference URL SSRF syntactic rejection (private hosts, credentials)
 */
import { describe, expect, it } from 'vitest';
import { hotspotCandidateSchema } from '../src/events/hotspot-candidate.js';
import { qualifiedEventSchema } from '../src/events/qualified-event.js';

function baseHotspot(overrides: Record<string, unknown> = {}) {
  return {
    schema_version: 1,
    event_type: 'hotspot_candidate',
    event_id: 'toutiao:topic-x',
    candidate_version: 1,
    notification_type: 'initial',
    source: { platform: 'toutiao', board: 'hotboard', url: null },
    topic: { title: '标题', source_tags: [], ai_category: null },
    observed: {
      at: '2026-08-30T10:00:00Z',
      rank: 1,
      first_seen_at: '2026-08-30T08:00:00Z'
    },
    trend: { score: 50, reasons: [] },
    requirements: {
      needs_source_verification: false,
      do_not_treat_as_verified_fact: true
    },
    idempotency_key: 'toutiao:topic-x:1:initial',
    ai_review: { status: 'unavailable' },
    ...overrides
  };
}

describe('hotspot-candidate hot_value three-state', () => {
  it('accepts key absent', () => {
    expect(() => hotspotCandidateSchema.parse(baseHotspot())).not.toThrow();
  });

  it('accepts number', () => {
    const p = baseHotspot();
    (p.observed as Record<string, unknown>).hot_value = 12345;
    expect(() => hotspotCandidateSchema.parse(p)).not.toThrow();
  });

  it('accepts explicit null (NaN→null serialization)', () => {
    const p = baseHotspot();
    (p.observed as Record<string, unknown>).hot_value = null;
    expect(() => hotspotCandidateSchema.parse(p)).not.toThrow();
  });
});

describe('hotspot-candidate needs_source_verification is NOT validated', () => {
  it('accepts degraded with non-requires_authoritative_source risk (no superRefine)', () => {
    const p = baseHotspot({
      notification_type: 'degraded',
      ai_review: {
        status: 'succeeded',
        writing_score: 30,
        score_breakdown: {
          timeliness: 5,
          information_gain: 5,
          audience_fit: 5,
          verifiability: 5,
          expandability: 5,
          competition: 2,
          risk: 3
        },
        summary: '摘要',
        entities: [],
        risk_level: 'allowed',
        risk_flags: [],
        search_queries: []
      },
      requirements: {
        needs_source_verification: false,
        do_not_treat_as_verified_fact: true
      }
    });
    expect(() => hotspotCandidateSchema.parse(p)).not.toThrow();
  });
});

function baseQualified(overrides: Record<string, unknown> = {}) {
  return {
    schema_version: '1.0',
    delivery_id: 'dlv-00000001',
    source_event_id: 'evt-001',
    decision_revision: 1,
    occurred_at: '2026-08-30T10:00:00Z',
    event: {
      canonical_title: '标题',
      summary:
        '这是一个长度超过五十个字符的摘要文本，用于满足最小长度约束，确保该字段能够通过校验，继续补充到足够长度。',
      field: null,
      risk_level: 'low',
      event_fingerprint: 'fp-1',
      entities: {
        people: [],
        organizations: [],
        locations: [],
        keywords: [],
        time_expressions: []
      }
    },
    trend: {
      first_seen_at: '2026-08-30T09:00:00Z',
      last_seen_at: '2026-08-30T10:00:00Z',
      score: 50,
      trend_score: 50,
      source_count: 1,
      source_codes: ['test'],
      best_rank: null
    },
    decision: {
      should_write: true,
      priority: 'normal',
      decision_score: 50,
      reason_codes: ['test'],
      reason_summary: 'test'
    },
    references: [
      { url: 'https://example.com/a', title: 't', source_name: 's', is_authoritative: false }
    ],
    ...overrides
  };
}

describe('qualified-event reference URL', () => {
  it('rejects private hosts (localhost, 127.0.0.1, RFC1918, link-local)', () => {
    const bad = [
      'http://localhost/x',
      'http://127.0.0.1/x',
      'http://10.0.0.1/x',
      'http://192.168.1.1/x',
      'http://172.16.0.1/x',
      'http://169.254.169.254/x'
    ];
    for (const url of bad) {
      const p = baseQualified();
      (p.references as Array<Record<string, unknown>>)[0].url = url;
      expect(() => qualifiedEventSchema.parse(p)).toThrow();
    }
  });

  it('rejects credentials in URL', () => {
    const p = baseQualified();
    (p.references as Array<Record<string, unknown>>)[0].url = 'https://user:pass@example.com/x';
    expect(() => qualifiedEventSchema.parse(p)).toThrow();
  });

  it('rejects non-http(s) scheme', () => {
    const p = baseQualified();
    (p.references as Array<Record<string, unknown>>)[0].url = 'file:///etc/passwd';
    expect(() => qualifiedEventSchema.parse(p)).toThrow();
  });

  it('rejects naive (no offset) datetime', () => {
    const p = baseQualified();
    p.occurred_at = '2026-08-30T10:00:00';
    expect(() => qualifiedEventSchema.parse(p)).toThrow();
  });

  it('accepts both +08:00 and Z offsets', () => {
    expect(() =>
      qualifiedEventSchema.parse(baseQualified({ occurred_at: '2026-08-30T10:00:00+08:00' }))
    ).not.toThrow();
    expect(() =>
      qualifiedEventSchema.parse(baseQualified({ occurred_at: '2026-08-30T10:00:00Z' }))
    ).not.toThrow();
  });
});
