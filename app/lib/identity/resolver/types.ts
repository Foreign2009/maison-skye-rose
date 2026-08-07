/**
 * Maison Identity Platform — Resolver Type Contracts
 *
 * All types for the deterministic Identity Resolver.
 *
 * Design constraints:
 *   - ResolutionResult contains no live timestamps (purity guarantee)
 *   - ResolutionInput.category is required (hard category boundary)
 *   - CandidateMatch uses IdentityProjection, not full IdentityRecord (safe projection)
 *   - score on ResolutionResult/CandidateMatch is resolver match score (0–100)
 *     NOT IdentityConfidence.score — they measure entirely different things
 *   - Only "verified" IdentityRecords are eligible for status "resolved"
 *
 * Resolver contract:
 *   reads → scores → explains → returns
 *   never: creates, modifies, adds aliases, persists, calls AI
 */

import type { IdentityId, IdentityStatus } from "../types";
import type { ProductCategory }            from "../../mkc/types";

// ── Resolution input ──────────────────────────────────────────────────────────

/**
 * Input to the resolver. category is required as a hard institutional boundary.
 * A fragrance supplier input must never resolve to a home-fragrance identity.
 *
 * supplierCategory is the verbatim supplier group label (e.g., "L", "M", "UNISEX").
 * It is preserved as provenance only. It is NOT automatically mapped to canonical
 * gender or ProductCategory — that reconciliation belongs to future editorial work.
 */
export type ResolutionInput = {
  readonly supplierName:      string;           // Required: verbatim supplier product name
  readonly category:          ProductCategory;  // Required: hard category boundary
  readonly supplierBrand?:    string;           // Optional: separate brand field from supplier data
  readonly supplierCategory?: string;           // Optional: verbatim supplier group (L/M/UNISEX)
  readonly sourceReference?:  string;           // Optional: source description for auditing
};

// ── Resolution status ─────────────────────────────────────────────────────────

/**
 * Outcome of a resolution attempt.
 *
 * "candidate" covers all cases where:
 *   - An exact or near-exact match exists, but the identity is not verified
 *   - A probable token match exists but cannot be auto-resolved
 *   - An exact alias match points to a non-verified identity
 *
 * The explanation field always records why "candidate" was not upgraded to "resolved".
 */
export type ResolutionStatus =
  | "resolved"    // Definitive match; identity is verified; institutionally safe to act on
  | "candidate"   // Likely match but not auto-resolvable; requires editorial review
  | "ambiguous"   // Multiple plausible candidates; editorial decision required
  | "no-match"    // No identity found with sufficient signal
  | "blocked";    // Unexpected registry error prevented resolution

// ── Resolution strategy ───────────────────────────────────────────────────────

export type ResolutionStrategy =
  | "alias-exact"      // Stage 1: exact normalized alias lookup
  | "canonical-exact"  // Stage 2: exact normalized canonical name match
  | "strip-suffix"     // Stage 3: attribution suffix stripped, then exact match
  | "token-match"      // Stage 4: deterministic token overlap scoring
  | "none";            // Stage 5: no match found

// ── Resolution signals ────────────────────────────────────────────────────────

/**
 * Signal types emitted during resolution.
 * Every candidate and every resolved result carries at least one signal.
 * Signals are the audit trail — they explain exactly why the resolver
 * arrived at its score and status.
 */
export type ResolutionSignalType =
  | "alias-hit"
  | "canonical-name-exact"
  | "suffix-stripped"
  | "name-token-overlap"
  | "brand-token-match"
  | "brand-mismatch"
  | "digit-preserved"
  | "digit-mismatch"
  | "category-match"
  | "identity-verified"
  | "identity-unverified"
  | "identity-disputed"
  | "identity-deprecated"
  | "identity-rejected"
  | "meaningful-token-mismatch"
  | "short-name-protected";

export type ResolutionSignal = {
  readonly type:    ResolutionSignalType;
  readonly detail:  string;   // Human-readable explanation: what matched, or why penalised
  readonly weight:  number;   // Positive = supports match, negative = conflict, 0 = informational
};

// ── Identity projection ───────────────────────────────────────────────────────

/**
 * A safe read-only projection of the relevant IdentityRecord fields.
 * Returned instead of the full IdentityRecord to avoid returning mutable
 * registry internals through the resolver API.
 */
export type IdentityProjection = {
  readonly identityId:     IdentityId;
  readonly canonicalName:  string;
  readonly canonicalBrand: string | undefined;
  readonly category:       ProductCategory;
  readonly identityStatus: IdentityStatus;
};

// ── Candidate match ───────────────────────────────────────────────────────────

/**
 * A single candidate in the resolution result.
 * score is the resolver's match score (0–100) for this specific resolution attempt.
 * It is NOT the identity's own IdentityConfidence.score.
 */
export type CandidateMatch = {
  readonly identity:  IdentityProjection;
  readonly score:     number;                       // Resolver match score (0–100)
  readonly signals:   readonly ResolutionSignal[];  // What drove this score
};

// ── Resolution result ─────────────────────────────────────────────────────────

/**
 * The result of a resolution attempt.
 *
 * Purity invariants (all enforced in DeterministicIdentityResolver):
 *   - No live timestamps, UUIDs, or random values
 *   - Same input + same registry state → identical result (deep-equal)
 *   - identity !== null if and only if status === "resolved"
 *   - score >= 80 when status === "resolved" via alias-exact or canonical-exact
 *   - score >= 55 when status === "resolved" via token-match
 *   - candidates.length === 0 when status === "resolved" or "no-match"
 *   - candidates.length >= 2 when status === "ambiguous"
 *   - candidates.length >= 1 when status === "candidate"
 *   - score === 0 when status === "no-match"
 */
export type ResolutionResult = {
  readonly supplierName:    string;
  readonly normalizedInput: string;
  readonly category:        ProductCategory;
  readonly status:          ResolutionStatus;
  readonly strategy:        ResolutionStrategy;
  readonly identity:        IdentityProjection | null;    // Non-null only when status === "resolved"
  readonly candidates:      readonly CandidateMatch[];    // Non-empty for "candidate" or "ambiguous"
  readonly score:           number;                       // Top result's resolver match score (0–100)
  readonly signals:         readonly ResolutionSignal[];  // Top-level resolution signals
  readonly explanation:     string;                       // Human-readable rationale
};

// ── Resolver interface ────────────────────────────────────────────────────────

export interface IdentityResolver {
  /**
   * Resolves a supplier name to an identity in the registry.
   *
   * Purity guarantee: same input + same registry state → same output, always.
   * Non-mutation guarantee: no writes to registry or any external system.
   * Synchronous: returns a value immediately; never awaits.
   * Isolated: no AI, no file I/O, no external API calls.
   */
  resolve(input: ResolutionInput): ResolutionResult;
}
