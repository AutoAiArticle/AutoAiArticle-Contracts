/**
 * Version constants.
 *
 * SUPPORTED_SCHEMA_VERSIONS declares, per event, the schema_version value that the
 * contract's zod schema will accept. Note the deliberate asymmetry documented in the
 * spec: hotspot-candidate and the other new contracts use a number literal `1`, while
 * qualified-event keeps the main-engine's string `"1.0"` semantics.
 */
export const PACKAGE_VERSION = '0.1.0';

export const SUPPORTED_SCHEMA_VERSIONS = {
  hotspotCandidate: 1,
  qualifiedEvent: '1.0',
  writingRequest: 1,
  qualityVerdict: 1,
  imageRequest: 1,
  publishRequest: 1,
  candidateFeedback: 1
} as const;

export type SupportedSchemaVersions = typeof SUPPORTED_SCHEMA_VERSIONS;
