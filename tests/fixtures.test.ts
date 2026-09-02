/**
 * Bidirectional fixture validation + count enforcement (NFR-4).
 *
 * Every event directory must contain at least one `valid.*` and one `invalid.*` fixture.
 * `valid.*` must parse, `invalid.*` must be rejected.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { candidateFeedbackSchema } from '../src/events/candidate-feedback.js';
import { hotspotCandidateSchema } from '../src/events/hotspot-candidate.js';
import { imageRequestSchema } from '../src/events/image-request.js';
import { publishRequestSchema } from '../src/events/publish-request.js';
import { qualifiedEventSchema } from '../src/events/qualified-event.js';
import { qualityVerdictSchema } from '../src/events/quality-verdict.js';
import { writingRequestSchema } from '../src/events/writing-request.js';

const here = dirname(fileURLToPath(import.meta.url));
const FIXTURES_DIR = resolve(here, '..', 'fixtures');

const EVENTS: Record<string, z.ZodTypeAny> = {
  'hotspot-candidate': hotspotCandidateSchema,
  'qualified-event': qualifiedEventSchema,
  'writing-request': writingRequestSchema,
  'quality-verdict': qualityVerdictSchema,
  'image-request': imageRequestSchema,
  'publish-request': publishRequestSchema,
  'candidate-feedback': candidateFeedbackSchema
};

describe.each(Object.entries(EVENTS))('%s fixtures', (name, schema) => {
  const dir = join(FIXTURES_DIR, name);

  it('directory exists', () => {
    expect(existsSync(dir)).toBe(true);
  });

  it('has at least 1 valid + 1 invalid fixture', () => {
    const files = readdirSync(dir);
    expect(files.some((f) => f.startsWith('valid.'))).toBe(true);
    expect(files.some((f) => f.startsWith('invalid.'))).toBe(true);
  });

  const files = readdirSync(dir).filter((f) => f.endsWith('.json'));
  for (const f of files) {
    const expectPass = f.startsWith('valid.');
    it(`${f} ${expectPass ? '解析通过' : '按错误码拒绝'}`, () => {
      const raw = JSON.parse(readFileSync(join(dir, f), 'utf-8'));
      if (expectPass) {
        expect(() => schema.parse(raw)).not.toThrow();
      } else {
        expect(() => schema.parse(raw)).toThrow();
      }
    });
  }
});
