/**
 * Maison Identity Platform — Relationship Editorial Review Types (EP6-P5B/P5BR/P5C)
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
 * EP6-P5C addition: founder decision ledger and service types.
 *   - RelationshipDecisionEntry — one append-only ledger entry per founder decision.
 *   - RelationshipDecisionLedger — the mutable decision artifact.
 *   - Service inputs, results, progress, and repository abstractions.
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
 *
 * IMMUTABLE after EP6-P5BR. Never modified by P5C or later episodes.
 * The queue is the frozen proposal/evidence artifact. Decisions live in the ledger.
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

// ══════════════════════════════════════════════════════════════════════════════
// EP6-P5C — Founder Decision Ledger Types
// ══════════════════════════════════════════════════════════════════════════════

// ── Decision entry ────────────────────────────────────────────────────────────

/**
 * One founder decision recorded in the append-only decision ledger.
 *
 * The ledger is the ONLY mutable governance artifact. The queue is immutable.
 * Entries are never modified or deleted. The complete governance history for
 * any unit is the ordered sequence of entries matching its reviewId.
 *
 * transactionId: generated server-side via crypto.randomUUID(). Never client-side.
 * decidedAt: from the injected RelationshipEditorialClock. Never new Date() inline.
 */
export interface RelationshipDecisionEntry {
  /** Server-side UUID. Dedup sentinel. Never generated client-side. */
  readonly transactionId: string;
  /** Stable pair identifier. Links to the frozen queue unit. */
  readonly reviewId: RelationshipReviewId;
  /** Denormalised for human-readable audit without queue lookup. */
  readonly pairType: RelationshipPairType;
  readonly slugA: string;
  readonly slugB: string;
  /** The founder decision: FOUNDER_APPROVED, FOUNDER_REJECTED, or DEFERRED. */
  readonly decision: "FOUNDER_APPROVED" | "FOUNDER_REJECTED" | "DEFERRED";
  /** Governance state before this decision. */
  readonly previousGovernanceState: RelationshipGovernanceState;
  /** Governance state after this decision. */
  readonly newGovernanceState: RelationshipGovernanceState;
  /** Review status before this decision. */
  readonly previousStatus: RelationshipReviewStatus;
  /** Review status after this decision. */
  readonly newStatus: RelationshipReviewStatus;
  /** Who performed this action. Required non-empty. */
  readonly actor: string;
  /** Why this decision was made. Required non-empty. */
  readonly reason: string;
  /** Optional additional founder notes. Null if not provided. */
  readonly founderNotes: string | null;
  /** ISO 8601 timestamp. From injected clock only — never new Date() inline. */
  readonly decidedAt: string;
}

// ── Decision ledger ───────────────────────────────────────────────────────────

/**
 * The append-only founder decision ledger.
 * Written to: app/lib/identity/data/decisions/catalogue-relationship-decision-ledger.json
 *
 * The ledger records all founder decisions against the frozen EP6-P5BR queue.
 * Runtime governance state = queue baseline + ordered ledger history per reviewId.
 *
 * graphFingerprint must match the queue artifact's fingerprint. Verified at load time.
 * Entries are strictly append-only. No deletion or modification permitted.
 */
export interface RelationshipDecisionLedger {
  readonly schemaVersion: "EP6-P5C-v1";
  /** Must match catalogue-relationship-review-queue.json schemaVersion. */
  readonly initialQueueVersion: "EP6-P5BR-v1";
  /** Must match the post-P5A graph fingerprint: 478fd478… */
  readonly graphFingerprint: string;
  readonly entries: readonly RelationshipDecisionEntry[];
}

// ── Clock injection ───────────────────────────────────────────────────────────

/**
 * Injected clock for the relationship editorial service.
 * Production uses new Date().toISOString(). Tests inject a fixed value.
 * All timestamps in decision entries come exclusively from this clock.
 */
export type RelationshipEditorialClock = {
  readonly now: () => string;
};

// ── Repository abstractions ───────────────────────────────────────────────────

/**
 * Read-only repository for the immutable queue artifact.
 * The queue is never written by the editorial service.
 */
export interface RelationshipQueueRepository {
  load(): RelationshipReviewQueueData;
}

/**
 * Read-write repository for the mutable decision ledger.
 * Save must be atomic (tmp → verify → backup → rename pattern).
 */
export interface RelationshipLedgerRepository {
  load(): RelationshipDecisionLedger;
  save(data: RelationshipDecisionLedger): void;
}

// ── Service error taxonomy ────────────────────────────────────────────────────

/**
 * Discriminated error kinds for all relationship editorial operation failures.
 */
export type RelationshipEditorialErrorKind =
  | "not-found"           // reviewId not present in queue
  | "research-blocked"    // unit is RESEARCH_BLOCKED — no founder decision allowed
  | "invalid-transition"  // the decision is not valid from current governance state
  | "stale-review"        // expectedGovernanceState does not match current reconstructed state
  | "invalid-input";      // malformed or empty required input field

// ── Service result ────────────────────────────────────────────────────────────

/**
 * All relationship editorial mutation methods return RelationshipEditorialResult.
 * Never throws for expected domain failures.
 */
export type RelationshipEditorialResult =
  | { readonly success: true; readonly entry: RelationshipDecisionEntry }
  | {
      readonly success: false;
      readonly kind: RelationshipEditorialErrorKind;
      readonly message: string;
    };

// ── Decision inputs ───────────────────────────────────────────────────────────

/**
 * Base input for all relationship founder decisions.
 *
 * expectedGovernanceState: the governance state the founder saw when they loaded
 * the review unit. If the reconstructed current state does not match this, the
 * service returns kind: "stale-review" — the unit changed after the page was loaded.
 *
 * This is the stale-write protection token, equivalent to expectedUpdatedAt in
 * IdentityEditorialService. It prevents two concurrent sessions from both deciding
 * on a unit that appeared PENDING to both, where only one decision is valid.
 *
 * Filesystem concurrency limitation: Node.js readFileSync/renameSync cannot
 * guarantee atomicity across independent processes on Windows NTFS. Two simultaneous
 * requests could theoretically both pass the stale check before either saves.
 * This risk is accepted for a single-founder admin workflow on Vercel (each
 * serverless function invocation operates on the same underlying filesystem, but
 * truly concurrent requests remain theoretically possible). The expectedGovernanceState
 * check provides best-effort protection; true CAS would require a database or file lock.
 */
export interface BaseRelationshipDecisionInput {
  readonly reviewId: RelationshipReviewId;
  readonly actor: string;
  readonly reason: string;
  readonly founderNotes?: string;
  /**
   * Stale-write protection token.
   * Must match the current reconstructed governance state at transaction time.
   */
  readonly expectedGovernanceState: RelationshipGovernanceState;
}

/** approve: PENDING | DEFERRED → FOUNDER_APPROVED. reason required. */
export interface ApproveRelationshipInput extends BaseRelationshipDecisionInput {}

/** reject: PENDING | DEFERRED → FOUNDER_REJECTED. reason required. */
export interface RejectRelationshipInput extends BaseRelationshipDecisionInput {}

/** defer: PENDING → DEFERRED only. DEFERRED → DEFERRED is invalid. reason required. */
export interface DeferRelationshipInput extends BaseRelationshipDecisionInput {}

// ── Progress ──────────────────────────────────────────────────────────────────

/**
 * Derived progress across all relationship review units.
 *
 * All counts are derived at runtime from the queue + ledger.
 * No value is hardcoded. totalDecisionUnits is derived from:
 *   queue.units.filter(u => u.requiresFounderDecision).length
 */
export interface RelationshipReviewProgress {
  /** Derived from queue: units where requiresFounderDecision = true. */
  readonly totalDecisionUnits: number;
  /** Units currently in PENDING governance state (not yet decided). */
  readonly pending: number;
  /** Units with FOUNDER_APPROVED governance state. */
  readonly founderApproved: number;
  /** Units with FOUNDER_REJECTED governance state. */
  readonly founderRejected: number;
  /**
   * Units currently in DEFERRED governance state.
   * Note: a unit re-decided after deferral moves to FOUNDER_APPROVED/REJECTED;
   * it is no longer counted as deferred.
   */
  readonly deferred: number;
  /** Derived from queue: units where requiresFounderDecision = false (RESEARCH_BLOCKED). */
  readonly researchBlocked: number;
  /** (founderApproved + founderRejected) / totalDecisionUnits × 100. Terminal decisions only. */
  readonly completionPercent: number;
}

// ── List summary ──────────────────────────────────────────────────────────────

/**
 * Summary row for the relationship review queue list.
 * MKC fragrance names are resolved server-side and included here.
 * Current governance state reflects the merged queue + ledger projection.
 */
export interface RelationshipReviewSummary {
  readonly reviewId: RelationshipReviewId;
  readonly pairType: RelationshipPairType;
  readonly slugA: string;
  readonly slugB: string;
  /** Resolved from MKC by slugA. Falls back to slug if not found. */
  readonly nameA: string;
  /** Resolved from MKC by slugB. Falls back to slug if not found. */
  readonly nameB: string;
  readonly overlapScore: number;
  /** Current governance state: from ledger if decided, from queue otherwise. */
  readonly governanceState: RelationshipGovernanceState;
  readonly status: RelationshipReviewStatus;
  readonly requiresFounderDecision: boolean;
}

// ── Queue filter ──────────────────────────────────────────────────────────────

/**
 * Filter for the relationship review queue list.
 * All fields optional — omitting all returns all units.
 */
export type RelationshipQueueFilter = {
  readonly pairType?: RelationshipPairType;
  readonly governanceState?: RelationshipGovernanceState;
  readonly overlapScoreMin?: number;
  readonly overlapScoreMax?: number;
};
