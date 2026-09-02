/**
 * Version constants.
 *
 * SUPPORTED_SCHEMA_VERSIONS declares, per event, the schema_version value that the
 * contract's zod schema will accept. Note the deliberate asymmetry documented in the
 * spec: hotspot-candidate and the other new contracts use a number literal `1`, while
 * qualified-event keeps the main-engine's string `"1.0"` semantics.
 */
export declare const PACKAGE_VERSION = "0.1.1";
export declare const SUPPORTED_SCHEMA_VERSIONS: {
    readonly hotspotCandidate: 1;
    readonly qualifiedEvent: "1.0";
    readonly writingRequest: 1;
    readonly qualityVerdict: 1;
    readonly imageRequest: 1;
    readonly publishRequest: 1;
    readonly candidateFeedback: 1;
};
export type SupportedSchemaVersions = typeof SUPPORTED_SCHEMA_VERSIONS;
