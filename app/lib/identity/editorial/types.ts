/**
 * Maison Identity Platform — Editorial Domain Types
 *
 * All types that govern the Identity Editorial Transaction Service: actions,
 * inputs, results, repository abstraction, clock injection, and read projections.
 *
 * Constitutional anchor: HUMANS APPROVE INSTITUTIONAL TRUTH.
 * AI may produce evidence. Humans perform all editorial transitions.
 */

import type {
  IdentityId,
  IdentityRecord,
  IdentityStatus,
  AliasType,
  MarketedGender,
  ProductCategory,
} from "../types";

import type { IdentityRegistryData } from "../persistence";

// ── Action vocabulary ──────────────────────────────────────────────────────────

/**
 * The seven editorial actions available in EP5-P3 (first campaign scope).
 *
 * Actions NOT included in this episode: deprecate, merge, split, reinstate,
 * category-correction, alias-removal, confidence-editing, evidence-deletion.
 */
export type IdentityEditorialAction =
  | "verify"                 // pending-review | disputed → verified
  | "correct-canonical"      // update canonical name, brand, year, or gender (any status)
  | "confirm-alias"          // add a verified alias (any status)
  | "request-more-research"  // pending-review → candidate (demote for further work)
  | "elevate"                // candidate → pending-review
  | "reject"                 // candidate | pending-review | disputed → rejected
  | "dispute";               // verified → disputed

// ── Clock injection ────────────────────────────────────────────────────────────

/**
 * Injected clock interface. Production uses new Date().toISOString().
 * Tests inject a fixed value for determinism.
 *
 * All timestamps in editorial history entries come exclusively from this clock.
 * Scattered new Date() calls are explicitly forbidden in the service.
 */
export type IdentityEditorialClock = {
  readonly now: () => string; // Returns ISO 8601 string
};

// ── Repository abstraction ─────────────────────────────────────────────────────

/**
 * Persistence abstraction for the editorial service.
 *
 * Production: wraps loadIdentityRegistry / saveIdentityRegistry from persistence.ts.
 * Tests: use InMemoryIdentityEditorialRepository (defined in the validation script).
 *
 * The editorial service must never touch the filesystem directly — it always
 * calls through this interface. This enforces test isolation.
 */
export interface IdentityEditorialRepository {
  load(): IdentityRegistryData;
  save(data: IdentityRegistryData): void;
}

// ── Error taxonomy ─────────────────────────────────────────────────────────────

/**
 * Discriminated error kind for all editorial operation failures.
 */
export type EditorialErrorKind =
  | "not-found"           // identity ID not present in registry
  | "invalid-transition"  // the action is not valid from the current status
  | "validation"          // validateIdentityRecord returned FAIL
  | "stale-review"        // expectedUpdatedAt does not match current record
  | "canonical-collision" // the updated canonical identity already exists in registry
  | "alias-collision"     // the alias already maps to a different identity
  | "no-op"               // no fields actually changed (correctCanonical)
  | "invalid-input";      // malformed or empty required input field

/**
 * Thrown when the editorial service detects optimistic concurrency failure.
 * The caller must reload the record before retrying.
 */
export class StaleReviewError extends Error {
  constructor(
    public readonly identityId: IdentityId,
    public readonly expectedUpdatedAt: string,
    public readonly actualUpdatedAt: string,
  ) {
    super(
      `Identity "${identityId}" was modified since this review was opened. ` +
      `Expected updatedAt: "${expectedUpdatedAt}", actual: "${actualUpdatedAt}". ` +
      `Reload to see current state.`,
    );
    this.name = "StaleReviewError";
  }
}

// ── Collision detail ───────────────────────────────────────────────────────────

/**
 * Detail surfaced with canonical-collision and alias-collision errors.
 */
export type CollisionDetail = {
  readonly canonicalKey?: string;  // set when kind = "canonical-collision"
  readonly aliasValue?: string;    // set when kind = "alias-collision"
  readonly existingId: IdentityId; // the identity that already holds the conflicting key
};

// ── Editorial result union ─────────────────────────────────────────────────────

/**
 * All editorial mutation methods return EditorialResult.
 * Never throws for expected domain failures — throws only for unexpected errors.
 */
export type EditorialResult =
  | { readonly success: true; readonly record: IdentityRecord }
  | {
      readonly success: false;
      readonly kind: EditorialErrorKind;
      readonly message: string;
      readonly collision?: CollisionDetail;
    };

// ── Base input ─────────────────────────────────────────────────────────────────

/**
 * All editorial mutation inputs extend BaseEditorialInput.
 */
export interface BaseEditorialInput {
  readonly identityId: IdentityId;
  readonly actor: string;          // Required non-empty — who is performing the action
  readonly expectedUpdatedAt: string; // Optimistic concurrency: must match record.updatedAt
  readonly reason?: string;        // Optional for most actions; required where noted
}

// ── Action-specific inputs ─────────────────────────────────────────────────────

/** verify: pending-review | disputed → verified */
export interface VerifyInput extends BaseEditorialInput {
  // No additional fields. actor required. reason encouraged but not enforced.
}

/**
 * correct-canonical: update one or more canonical fields on any status.
 *
 * Field semantics:
 *   canonicalName   — if provided, must be non-empty and pass the clean-name gate
 *   canonicalBrand  — if provided, must be non-empty
 *   launchYear      — number = set, null = clear, absent = keep current value
 *   marketedGender  — MarketedGender = set, null = clear, absent = keep current value
 *
 * At least one field must produce a real change; otherwise the service returns
 * kind: "no-op".
 */
export interface CorrectCanonicalInput extends BaseEditorialInput {
  readonly canonicalName?: string;
  readonly canonicalBrand?: string;
  readonly launchYear?: number | null;
  readonly marketedGender?: MarketedGender | null;
}

/** confirm-alias: add a verified alias to any-status record */
export interface ConfirmAliasInput extends BaseEditorialInput {
  readonly aliasValue: string;
  readonly aliasType: AliasType;
}

/** request-more-research: pending-review → candidate. reason required. */
export interface RequestMoreResearchInput extends BaseEditorialInput {
  readonly reason: string; // overrides optional — must be non-empty
}

/** elevate: candidate → pending-review. reason required. */
export interface ElevateInput extends BaseEditorialInput {
  readonly reason: string; // overrides optional — must be non-empty
}

/** reject: candidate | pending-review | disputed → rejected. reason required. */
export interface RejectInput extends BaseEditorialInput {
  readonly reason: string; // overrides optional — must be non-empty
}

/** dispute: verified → disputed. reason required. */
export interface DisputeInput extends BaseEditorialInput {
  readonly reason: string; // overrides optional — must be non-empty
}

// ── Campaign enrichment types ─────────────────────────────────────────────────

/**
 * Recommended editorial action from the campaign batch file.
 * Mirrors the campaign JSON shape without importing from scripts/.
 */
export type RecommendedAction =
  | "verify"
  | "correct-canonical"
  | "confirm-alias"
  | "research-more"
  | "reject";

/**
 * A single entry from the campaign editorial batch file, used for read
 * projection enrichment.
 *
 * Campaign files are read-only provenance artifacts. The editorial service
 * never writes to them. This type mirrors the relevant fields of
 * EditorialReviewEntry (scripts/identity/ingestion/types.ts) without
 * importing from the scripts directory into app code.
 */
export type CampaignEntry = {
  readonly identityId: string;
  readonly supplierName: string;
  readonly supplierGroups: readonly string[];
  readonly proposedCanonicalName: string;
  readonly proposedCanonicalBrand?: string;
  readonly researchCanonicalProposal?: string;
  readonly researchConfidence: "high" | "medium" | "low" | "none";
  readonly possibleNameIssue: boolean;
  readonly researchNotes?: string;
  readonly nameIssueExplanation?: string;
  readonly evidenceIds: readonly string[];
  readonly recommendedAction: RecommendedAction;
};

// ── Review queue filter ────────────────────────────────────────────────────────

/**
 * Filter parameters for getReviewQueue.
 * All fields are optional — omitting all returns all reviewable identities.
 */
export type ReviewQueueFilter = {
  readonly status?: IdentityStatus[];
  readonly recommendedAction?: RecommendedAction[];
  readonly researchConfidence?: "high" | "medium" | "low" | "none";
  readonly possibleNameIssue?: boolean;
};

// ── Review projections ─────────────────────────────────────────────────────────

/**
 * Summary row for the review queue. Used for list views.
 * Campaign enrichment fields are present only when a matching campaign entry exists.
 */
export type IdentityReviewSummary = {
  readonly id: IdentityId;
  readonly canonicalName: string;
  readonly canonicalBrand?: string;
  readonly category: ProductCategory;
  readonly status: IdentityStatus;
  readonly confidenceScore: number;
  readonly supplierName: string;
  readonly supplierGroups: readonly string[];
  readonly recommendedAction?: RecommendedAction;
  readonly researchConfidence?: "high" | "medium" | "low" | "none";
  readonly possibleNameIssue?: boolean;
  readonly updatedAt: string;
};

/**
 * Full detail view for a single identity under review.
 * Includes the live record, campaign enrichment, and pre-computed verification gate.
 */
export type IdentityReviewDetail = {
  readonly record: IdentityRecord;
  readonly campaignEntry?: CampaignEntry;
  readonly verificationEligible: boolean;
  readonly verificationBlockers: readonly string[];
  readonly canonicalCollisionWarning: string | null;
};
