/**
 * Maison Identity Platform — Relationship Editorial Review Types (EP6-P5B)
 *
 * Governs pair-level governance units for catalogue relationship review.
 * A symmetric pair (A↔B) is ONE review unit — not two.
 * A directional evolution pair (parent→child) is ONE review unit.
 *
 * Constitutional anchor: HUMANS APPROVE INSTITUTIONAL TRUTH.
 * AI may generate relationship proposals. Founders perform all editorial decisions.
 */

// ── Pair type ──────────────────────────────────────────────────────────────────

/**
 * The type of relationship pair governed by a review unit.
 */
export type RelationshipPairType =
  | "alternatives"      // symmetric: A↔B both in each other's alternatives
  | "wardrobePartners"  // symmetric: A↔B both in each other's wardrobePartners
  | "evolution";        // directional: child evolutionOf parent + parent evolutions child

// ── Review lifecycle ───────────────────────────────────────────────────────────

/**
 * Lifecycle status of a relationship review unit.
 * All units begin as "pending-review".
 * "approved" and "rejected" are terminal states.
 */
export type RelationshipReviewStatus =
  | "pending-review"   // awaiting founder review
  | "in-review"        // actively being reviewed by founder
  | "approved"         // founder confirmed this relationship should exist
  | "rejected"         // founder determined this relationship should be removed
  | "needs-research"   // requires external research before founder can decide
  | "deferred";        // founder deprioritised — return later

// ── Provenance and governance ──────────────────────────────────────────────────

/**
 * How the relationship pair was originally proposed.
 * AI_GENERATED: produced by RelationshipProducer (Anthropic Claude Haiku).
 * This tracks origin method and never changes after a founder decision.
 */
export type RelationshipProposalProvenance = "AI_GENERATED";

/**
 * The governance state of the relationship pair.
 *
 * REPOSITORY_SUPPORTED: the relationship exists in the canonical repository
 *   but has not received an explicit founder decision.
 * FOUNDER_APPROVED: the founder has explicitly approved this pair.
 * FOUNDER_REJECTED: the founder has explicitly rejected this pair.
 *
 * REPOSITORY_SUPPORTED ≠ FOUNDER_APPROVED.
 * Existence in the repository is not the same as founder approval.
 */
export type RelationshipGovernanceState =
  | "REPOSITORY_SUPPORTED"  // exists in repo; no explicit founder decision yet
  | "FOUNDER_APPROVED"      // founder explicitly confirmed
  | "FOUNDER_REJECTED";     // founder explicitly rejected

// ── Review ID ─────────────────────────────────────────────────────────────────

/**
 * Deterministic review ID for a relationship pair. Stable across regeneration.
 *
 * Format:
 *   alternatives:     REL-alternatives-<slugA>--<slugB>      (slugA < slugB lexically)
 *   wardrobePartners: REL-wardrobe-partners-<slugA>--<slugB> (slugA < slugB lexically)
 *   evolution:        REL-evolution-<parentSlug>--<childSlug> (direction preserved)
 *
 * Double dash (--) separates slugs, which themselves contain single dashes.
 */
export type RelationshipReviewId = string;

// ── Evidence ──────────────────────────────────────────────────────────────────

/**
 * Repository evidence snapshot for a relationship pair.
 * Copied from the canonical audit at queue creation time.
 * Immutable after queue creation.
 */
export interface RelationshipPairEvidence {
  readonly familyOverlap: readonly string[];
  readonly scentCharacterMatch: boolean;
  readonly genderMatch: boolean;
  readonly collectionMatch: boolean;
  readonly topNoteOverlap: readonly string[];
  readonly baseNoteOverlap: readonly string[];
  readonly overlapScore: number;
}

// ── Review unit ───────────────────────────────────────────────────────────────

/**
 * The atomic governance unit for a relationship pair.
 *
 * For alternatives and wardrobePartners:
 *   slugA = lexically first slug, slugB = lexically second slug.
 *   Evidence is taken from the edge where sourceSlug = slugA.
 *
 * For evolution:
 *   slugA = parent (predecessor) slug, slugB = child (successor) slug.
 *   Evidence is taken from the evolutionOf edge (child→parent direction).
 */
export interface RelationshipReviewUnit {
  /** Deterministic review ID. Stable across regeneration. */
  readonly reviewId: RelationshipReviewId;
  /** The type of relationship pair. */
  readonly pairType: RelationshipPairType;
  /**
   * For alternatives/wardrobePartners: lexically first slug.
   * For evolution: parent (predecessor) slug.
   */
  readonly slugA: string;
  /**
   * For alternatives/wardrobePartners: lexically second slug.
   * For evolution: child (successor) slug.
   */
  readonly slugB: string;
  /** Origin method. Always AI_GENERATED in the initial queue. Never changes. */
  readonly proposalProvenance: RelationshipProposalProvenance;
  /** Governance state. All begin as REPOSITORY_SUPPORTED. */
  readonly governanceState: RelationshipGovernanceState;
  /** Review lifecycle status. All begin as pending-review. */
  readonly status: RelationshipReviewStatus;
  /** Evidence from the audit at queue creation time. */
  readonly auditEvidence: RelationshipPairEvidence;
  /** Evidence limitations from the audit. */
  readonly evidenceLimitations: readonly string[];
  /** Whether this pair requires external research before a founder decision. */
  readonly requiresExternalResearch: boolean;
  /** Human-readable blocking reason from the audit. Null if no blocking reason. */
  readonly blockingReason: string | null;
  /** ISO 8601 timestamp when this unit was first created. */
  readonly createdAt: string;
  /** ISO 8601 timestamp when this unit was last updated. */
  readonly updatedAt: string;
  /** Founder notes. Null until reviewed. */
  readonly founderNotes: string | null;
}

// ── Queue summary ─────────────────────────────────────────────────────────────

export interface RelationshipReviewQueueSummary {
  readonly totalUnits: number;
  readonly alternativePairs: number;
  readonly wardrobePartnerPairs: number;
  readonly evolutionPairs: number;
  readonly byStatus: Readonly<Record<RelationshipReviewStatus, number>>;
  readonly byGovernanceState: Readonly<Record<RelationshipGovernanceState, number>>;
  readonly requiresExternalResearch: number;
}

// ── Queue persistence ─────────────────────────────────────────────────────────

/**
 * Persistence shape for the relationship review queue artifact.
 * Written to: app/lib/identity/data/reviews/catalogue-relationship-review-queue.json
 */
export interface RelationshipReviewQueueData {
  readonly schemaVersion: "EP6-P5B-v1";
  readonly generatedAt: string;
  readonly generatedBy: string;
  /** SHA-256 fingerprint of the 336-edge post-P5A relationship graph. */
  readonly graphFingerprint: string;
  readonly summary: RelationshipReviewQueueSummary;
  readonly units: readonly RelationshipReviewUnit[];
}
