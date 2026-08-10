/**
 * Maison Identity Platform — Relationship Editorial Review Types (EP6-P5B/P5BR)
 *
 * Governs pair-level governance units for catalogue relationship review.
 * A symmetric pair (A↔B) is ONE review unit — not two.
 * A directional evolution pair (parent→child) is ONE review unit.
 *
 * Constitutional anchor: HUMANS APPROVE INSTITUTIONAL TRUTH.
 * AI may generate relationship proposals. Founders perform all editorial decisions.
 *
 * EP6-P5BR correction: three governance concepts are now explicitly separated:
 *   1. RelationshipCanonicalState — is the relationship currently in MKC?
 *   2. RelationshipProposalProvenance — how was it originally proposed?
 *   3. RelationshipGovernanceState — what human decision has been reached?
 *
 * Repository presence (canonical state: PRESENT) is not semantic support.
 * AI origin (provenance: AI_GENERATED) is not human approval.
 * Research-blocked (governance: RESEARCH_BLOCKED) is not pending founder review.
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
 *
 * Initial states:
 *   alternatives/wardrobePartners → pending-review
 *   evolution → needs-research (external confirmation required before founder decides)
 *
 * Terminal states: "approved", "rejected".
 */
export type RelationshipReviewStatus =
  | "pending-review"   // awaiting founder review
  | "in-review"        // actively being reviewed by founder
  | "approved"         // founder confirmed this relationship should exist
  | "rejected"         // founder determined this relationship should be removed
  | "needs-research"   // blocked: external research required before founder can decide
  | "deferred";        // founder deprioritised — return later

// ── Canonical state ────────────────────────────────────────────────────────────

/**
 * Whether the relationship currently exists in the MKC canonical repository.
 *
 * PRESENT: the relationship appears in app/lib/mkc/native/*.ts.
 *   This records physical presence only. It does NOT imply semantic support,
 *   founder approval, or evidence quality.
 * ABSENT: the relationship has been removed or was never added.
 */
export type RelationshipCanonicalState = "PRESENT" | "ABSENT";

// ── Provenance ────────────────────────────────────────────────────────────────

/**
 * How the relationship pair was originally proposed.
 * AI_GENERATED: produced by RelationshipProducer (Anthropic Claude Haiku).
 *
 * This field records origin method. It never changes after an editorial decision.
 * A founder approval changes governanceState → FOUNDER_APPROVED; provenance
 * remains AI_GENERATED to preserve historical accuracy.
 */
export type RelationshipProposalProvenance = "AI_GENERATED";

// ── Governance state ──────────────────────────────────────────────────────────

/**
 * The human-governance state of the relationship pair.
 *
 * PENDING:          Awaiting founder review. Research is not required.
 *                   (alternatives and wardrobePartners pairs start here)
 * RESEARCH_BLOCKED: External research is required before the founder can
 *                   make an informed decision. The pair is blocked until
 *                   authoritative evidence is available.
 *                   (evolution pairs start here)
 * FOUNDER_APPROVED: The founder has explicitly confirmed this pair.
 * FOUNDER_REJECTED: The founder has explicitly rejected this pair.
 * DEFERRED:         The founder has deprioritised this pair for later review.
 *
 * PENDING ≠ FOUNDER_APPROVED.
 * Existence in the repository does NOT advance governance state.
 * Only an explicit founder editorial decision changes governance state.
 */
export type RelationshipGovernanceState =
  | "PENDING"           // awaiting founder review; no research required
  | "RESEARCH_BLOCKED"  // blocked by required external research
  | "FOUNDER_APPROVED"  // founder explicitly confirmed
  | "FOUNDER_REJECTED"  // founder explicitly rejected
  | "DEFERRED";         // founder deprioritised — return later

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
 *   Initial state: status=pending-review, governanceState=PENDING,
 *     requiresFounderDecision=true, requiresExternalResearch=false.
 *
 * For evolution:
 *   slugA = parent (predecessor) slug, slugB = child (successor) slug.
 *   Evidence is taken from the evolutionOf edge (child→parent direction).
 *   Initial state: status=needs-research, governanceState=RESEARCH_BLOCKED,
 *     requiresFounderDecision=false, requiresExternalResearch=true.
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
  /** Whether this relationship currently exists in the MKC canonical repository. */
  readonly currentCanonicalState: RelationshipCanonicalState;
  /** Origin method. Always AI_GENERATED in the initial queue. Never changes. */
  readonly proposalProvenance: RelationshipProposalProvenance;
  /** Human-governance decision state. Separate from canonical presence. */
  readonly governanceState: RelationshipGovernanceState;
  /** Review lifecycle status. */
  readonly status: RelationshipReviewStatus;
  /** Evidence from the audit at queue creation time. */
  readonly auditEvidence: RelationshipPairEvidence;
  /** Evidence limitations from the audit. */
  readonly evidenceLimitations: readonly string[];
  /** Whether this pair requires external research before a founder decision. */
  readonly requiresExternalResearch: boolean;
  /** Whether this pair requires a founder editorial decision. False when RESEARCH_BLOCKED. */
  readonly requiresFounderDecision: boolean;
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
  readonly requiresFounderDecision: number;
}

// ── Queue persistence ─────────────────────────────────────────────────────────

/**
 * Persistence shape for the relationship review queue artifact.
 * Written to: app/lib/identity/data/reviews/catalogue-relationship-review-queue.json
 *
 * EP6-P5BR-v1: Corrected governance semantics.
 *   - RelationshipCanonicalState added (PRESENT/ABSENT).
 *   - RelationshipGovernanceState corrected (PENDING/RESEARCH_BLOCKED vs REPOSITORY_SUPPORTED).
 *   - requiresFounderDecision added per unit.
 *   - Evolution pairs correctly initialised as needs-research / RESEARCH_BLOCKED.
 */
export interface RelationshipReviewQueueData {
  readonly schemaVersion: "EP6-P5BR-v1";
  readonly generatedAt: string;
  readonly generatedBy: string;
  /** SHA-256 fingerprint of the 336-edge post-P5A relationship graph. */
  readonly graphFingerprint: string;
  readonly summary: RelationshipReviewQueueSummary;
  readonly units: readonly RelationshipReviewUnit[];
}
