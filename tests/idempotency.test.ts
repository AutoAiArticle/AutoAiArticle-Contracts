/**
 * Idempotency key construction and version constants.
 */
import { describe, expect, it } from 'vitest';
import {
  candidateIdempotencyKey,
  validateIdempotencyKeyFormat,
  writingIdempotencyKey
} from '../src/idempotency.js';
import { PACKAGE_VERSION, SUPPORTED_SCHEMA_VERSIONS } from '../src/version.js';

describe('idempotency keys', () => {
  it('candidateIdempotencyKey builds toutiao:{id}:{version}:{type}', () => {
    expect(candidateIdempotencyKey('topic-1', 3, 'update')).toBe('toutiao:topic-1:3:update');
  });

  it('writingIdempotencyKey builds {sourceEventId}:write:v1', () => {
    expect(writingIdempotencyKey('evt-001')).toBe('evt-001:write:v1');
  });

  it('validateIdempotencyKeyFormat accepts valid keys', () => {
    expect(validateIdempotencyKeyFormat('toutiao:topic-1:1:initial')).toBe(true);
    expect(validateIdempotencyKeyFormat('evt-001:write:v1')).toBe(true);
  });

  it('validateIdempotencyKeyFormat rejects empty / whitespace / control chars', () => {
    expect(validateIdempotencyKeyFormat('')).toBe(false);
    expect(validateIdempotencyKeyFormat('   ')).toBe(false);
    expect(validateIdempotencyKeyFormat('key with space')).toBe(false);
    expect(validateIdempotencyKeyFormat('key\nnewline')).toBe(false);
    expect(validateIdempotencyKeyFormat('key\u0000nul')).toBe(false);
  });
});

describe('version constants', () => {
  it('SUPPORTED_SCHEMA_VERSIONS declares the documented versions', () => {
    expect(SUPPORTED_SCHEMA_VERSIONS.hotspotCandidate).toBe(1);
    expect(SUPPORTED_SCHEMA_VERSIONS.qualifiedEvent).toBe('1.0');
    expect(SUPPORTED_SCHEMA_VERSIONS.writingRequest).toBe(1);
    expect(SUPPORTED_SCHEMA_VERSIONS.qualityVerdict).toBe(1);
    expect(SUPPORTED_SCHEMA_VERSIONS.imageRequest).toBe(1);
    expect(SUPPORTED_SCHEMA_VERSIONS.publishRequest).toBe(1);
    expect(SUPPORTED_SCHEMA_VERSIONS.candidateFeedback).toBe(1);
  });

  it('PACKAGE_VERSION is a semver string', () => {
    expect(PACKAGE_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
  });
});
