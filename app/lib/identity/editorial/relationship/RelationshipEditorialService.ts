/**
 * Maison Identity Platform — Relationship Editorial Transaction Service (EP6-P5C/P5CR)
 *
 * SERVER-ONLY MODULE.
 * Provides founder decision governance for the 162 PENDING relationship review units.
 *
 * Constitutional anchor: HUMANS APPROVE INSTITUTIONAL TRUTH.
 * Founders perform all editorial decisions. No automatic decisions. No AI decisions.
 *
 * Design principles (mirrors IdentityEditorialService):
 *   1. Injected clock — all timestamps come from this.clock.now(). No scattered
 *      new Date() calls inside domain logic.
 *   2. Repository abstraction — queue repository is read-only; ledger repository
 *      is read-write. No filesystem access inside this class.
 *   3. Stale-write protection — every mutation checks expectedGovernanceState against
 *      the current reconstructed governance state before writing.
 *   4. Server-side transactionId — crypto.randomUUID() called inside the trusted
 *      server domain. Never client-side.
 *   5. Append-only ledger — entries are never modified or deleted.
 *   6. Evolution guard — RESEARCH_BLOCKED units are unconditionally rejected from
 *      all mutation paths.
 *
 * EP6-P5CR — Single-snapshot transaction core:
 *   Each mutation in _decide() loads queue + ledger exactly ONCE and uses that
 *   coherent snapshot for all validation AND the append operation. This eliminates
 *   the avoidable second ledgerRepo.load() call that existed in the original P5C
 *   implementation, narrowing the stale-write race window.
 *
 * Filesystem concurrency limitation (unchanged after P5CR):
 *   The single-snapshot design removes ONE avoidable race window but cannot
 *   eliminate filesystem-level concurrency between independent processes:
 *   - Two simultaneous requests can still both pass the expectedGovernanceState
 *     check between each other's load and save operations.
 *   - Atomic file replacement (tmp → rename) protects against partial-file
 *     corruption but not against concurrent reads before either write.
 *   - True cross-process CAS would require a database or a filesystem locking
 *     primitive.
 *   For a single-founder admin workflow this residual risk is accepted.
 *   The correct post-P5CR guarantee: stale-review tokens protect normal stale
 *   submissions; each transaction uses one coherent snapshot; atomic file
 *   replacement protects file integrity; distributed CAS is not claimed.
 */

import { randomUUID } from "crypto";

import type {
  RelationshipQueueRepository,
  RelationshipLedgerRepository,
  RelationshipEditorialClock,
  RelationshipReviewUnit,
  RelationshipDecisionEntry,
  RelationshipDecisionLedger,
  RelationshipGovernanceState,
  RelationshipReviewStatus,
  RelationshipEditorialResult,
  ApproveRelationshipInput,
  RejectRelationshipInput,
  DeferRelationshipInput,
  RelationshipReviewProgress,
  RelationshipReviewSummary,
  RelationshipQueueFilter,
} from "./types";

import type { FragranceKnowledge } from "../../../mkc/types";

// ── Internal types ────────────────────────────────────────────────────────────

/** Reconstructed current state of a unit (queue baseline + latest ledger entry). */
interface UnitCurrentState {
  readonly unit: RelationshipReviewUnit;
  readonly governanceState: RelationshipGovernanceState;
  readonly status: RelationshipReviewStatus;
  readonly latestEntry: RelationshipDecisionEntry | null;
}

// ── Service ───────────────────────────────────────────────────────────────────

export class RelationshipEditorialService {
  constructor(
    private readonly queueRepo: RelationshipQueueRepository,
    private readonly ledgerRepo: RelationshipLedgerRepository,
    private readonly mkcIndex: ReadonlyMap<string, FragranceKnowledge>,
    private readonly clock: RelationshipEditorialClock,
  ) {}

  // ── Read projections ────────────────────────────────────────────────────────

  /**
   * Returns the filtered, ordered review queue with MKC names resolved.
   * Current governance state is derived from queue + ledger at call time.
   */
  getReviewQueue(filter?: RelationshipQueueFilter): RelationshipReviewSummary[] {
    const { units, entryMap } = this._loadMerged();

    let results = units.map((unit): RelationshipReviewSummary => {
      const latest = entryMap.get(unit.reviewId) ?? null;
      const governanceState = latest ? latest.newGovernanceState : unit.governanceState;
      const status          = latest ? latest.newStatus          : unit.status;
      return {
        reviewId:               unit.reviewId,
        pairType:               unit.pairType,
        slugA:                  unit.slugA,
        slugB:                  unit.slugB,
        nameA:                  this.mkcIndex.get(unit.slugA)?.name ?? unit.slugA,
        nameB:                  this.mkcIndex.get(unit.slugB)?.name ?? unit.slugB,
        overlapScore:           unit.auditEvidence.overlapScore,
        governanceState,
        status,
        requiresFounderDecision: unit.requiresFounderDecision,
      };
    });

    // Apply filters
    if (filter?.pairType !== undefined) {
      results = results.filter(r => r.pairType === filter.pairType);
    }
    if (filter?.governanceState !== undefined) {
      results = results.filter(r => r.governanceState === filter.governanceState);
    }
    if (filter?.overlapScoreMin !== undefined) {
      results = results.filter(r => r.overlapScore >= filter.overlapScoreMin!);
    }
    if (filter?.overlapScoreMax !== undefined) {
      results = results.filter(r => r.overlapScore <= filter.overlapScoreMax!);
    }

    return results;
  }

  /**
   * Returns full detail for a single review unit, with current governance state
   * reconstructed from queue + ledger. Returns null if reviewId not found.
   */
  getReviewUnit(reviewId: string): UnitCurrentState | null {
    const { units, entryMap } = this._loadMerged();
    const unit = units.find(u => u.reviewId === reviewId) ?? null;
    if (!unit) return null;

    const latestEntry     = entryMap.get(reviewId) ?? null;
    const governanceState = latestEntry ? latestEntry.newGovernanceState : unit.governanceState;
    const status          = latestEntry ? latestEntry.newStatus          : unit.status;

    return { unit, governanceState, status, latestEntry };
  }

  /**
   * Returns derived review progress. All counts derived from queue + ledger.
   * No hardcoded population values.
   */
  getProgress(): RelationshipReviewProgress {
    const { units, allEntries } = this._loadMerged();

    // Derived from queue — never hardcoded
    const totalDecisionUnits = units.filter(u => u.requiresFounderDecision).length;
    const researchBlocked    = units.filter(u => !u.requiresFounderDecision).length;

    // Build current governance state map
    const currentState = this._buildCurrentStateMap(units, allEntries);

    let pending         = 0;
    let founderApproved = 0;
    let founderRejected = 0;
    let deferred        = 0;

    for (const unit of units) {
      if (!unit.requiresFounderDecision) continue;
      const gs = currentState.get(unit.reviewId) ?? unit.governanceState;
      if (gs === "PENDING")           pending++;
      else if (gs === "FOUNDER_APPROVED") founderApproved++;
      else if (gs === "FOUNDER_REJECTED") founderRejected++;
      else if (gs === "DEFERRED")         deferred++;
    }

    const terminal = founderApproved + founderRejected;
    const completionPercent = totalDecisionUnits > 0
      ? Math.round((terminal / totalDecisionUnits) * 100)
      : 0;

    return {
      totalDecisionUnits,
      pending,
      founderApproved,
      founderRejected,
      deferred,
      researchBlocked,
      completionPercent,
    };
  }

  // ── Mutations ───────────────────────────────────────────────────────────────

  /**
   * approve: PENDING | DEFERRED → FOUNDER_APPROVED.
   * Records that the founder confirms this relationship should exist.
   * No MKC canonical mutation. currentCanonicalState remains PRESENT.
   * actor and reason required.
   */
  approveRelationship(input: ApproveRelationshipInput): RelationshipEditorialResult {
    return this._decide(input, "FOUNDER_APPROVED", ["PENDING", "DEFERRED"], "approved");
  }

  /**
   * reject: PENDING | DEFERRED → FOUNDER_REJECTED.
   * Records that the founder determined this relationship should not exist.
   * No MKC canonical mutation in P5C. currentCanonicalState remains PRESENT.
   * Canonical removal requires a separate future episode.
   * actor and reason required.
   */
  rejectRelationship(input: RejectRelationshipInput): RelationshipEditorialResult {
    return this._decide(input, "FOUNDER_REJECTED", ["PENDING", "DEFERRED"], "rejected");
  }

  /**
   * defer: PENDING → DEFERRED only.
   * DEFERRED → DEFERRED is not a valid transition (no-op protection).
   * A deferred unit may later be approved or rejected.
   * actor and reason required.
   */
  deferRelationship(input: DeferRelationshipInput): RelationshipEditorialResult {
    return this._decide(input, "DEFERRED", ["PENDING"], "deferred");
  }

  // ── Private transaction core ────────────────────────────────────────────────

  /**
   * Core decision transaction — EP6-P5CR single-snapshot design:
   *
   *  1. Validate input (actor, reason non-empty) — cheapest path, no I/O
   *  2. Load queue + ledger — EXACTLY ONCE per transaction. Both repositories
   *     are read from this single coherent snapshot. No second load is made.
   *  3. Build current-state index from the loaded ledger entries
   *  4. Locate unit in queue (not-found guard)
   *  5. Evolution guard: !requiresFounderDecision → research-blocked error
   *  6. Reconstruct current governance state from THE SAME loaded ledger
   *  7. Stale-write check: currentGovState vs input.expectedGovernanceState
   *  8. Transition guard: currentGovState ∈ allowedFromStates
   *  9. Generate server-side transactionId (randomUUID, server domain only)
   * 10. Guard against transactionId collision in the LOADED ledger snapshot
   * 11. Build decision entry — identity fields derived from queue unit, not input
   * 12. Append to THE SAME loaded ledger snapshot (no second ledgerRepo.load())
   * 13. Save atomically via ledgerRepo.save()
   */
  private _decide(
    input: ApproveRelationshipInput | RejectRelationshipInput | DeferRelationshipInput,
    decision: "FOUNDER_APPROVED" | "FOUNDER_REJECTED" | "DEFERRED",
    allowedFromStates: RelationshipGovernanceState[],
    newStatus: RelationshipReviewStatus,
  ): RelationshipEditorialResult {

    // 1. Input validation — before any I/O
    if (!input.actor.trim()) {
      return { success: false, kind: "invalid-input", message: "Actor (reviewer name) is required." };
    }
    if (!input.reason.trim()) {
      return { success: false, kind: "invalid-input", message: "Reason is required for this decision." };
    }

    // 2. Single coherent snapshot — queue and ledger loaded ONCE.
    //    All subsequent validation and the append use these exact objects.
    //    ledgerRepo.load() is NOT called again after this point.
    const queue  = this.queueRepo.load();
    const ledger = this.ledgerRepo.load();
    const units  = queue.units;

    // 3. Build governance state index from this ledger snapshot (last-entry-wins)
    const latestGovStateMap = new Map<string, RelationshipGovernanceState>();
    for (const entry of ledger.entries) {
      latestGovStateMap.set(entry.reviewId, entry.newGovernanceState);
    }

    // 4. Locate unit
    const unit = units.find(u => u.reviewId === input.reviewId) ?? null;
    if (!unit) {
      return {
        success: false,
        kind: "not-found",
        message: `Review unit "${input.reviewId}" not found in the relationship queue.`,
      };
    }

    // 5. Evolution / research-blocked guard
    if (!unit.requiresFounderDecision) {
      return {
        success: false,
        kind: "research-blocked",
        message:
          `Review unit "${input.reviewId}" is RESEARCH_BLOCKED — evolution pairs require ` +
          `external authoritative confirmation before a founder decision can be made. ` +
          `No decision action is available in this review cycle.`,
      };
    }

    // 6. Reconstruct current governance state from THE SAME snapshot
    const currentGovState = latestGovStateMap.get(unit.reviewId) ?? unit.governanceState;
    const currentStatus   = this._governanceToStatus(currentGovState, unit.status);

    // 7. Stale-write check
    if (currentGovState !== input.expectedGovernanceState) {
      return {
        success: false,
        kind: "stale-review",
        message:
          `Review unit "${input.reviewId}" was modified since this review was opened. ` +
          `Expected governance state: "${input.expectedGovernanceState}", ` +
          `current: "${currentGovState}". Reload to see current state.`,
      };
    }

    // 8. Transition validation
    if (!allowedFromStates.includes(currentGovState)) {
      return {
        success: false,
        kind: "invalid-transition",
        message:
          `Cannot apply decision "${decision}" to unit "${input.reviewId}" ` +
          `with governance state "${currentGovState}". ` +
          `Allowed source states: ${allowedFromStates.join(", ")}.`,
      };
    }

    // 9. Generate server-side transactionId (randomUUID — never client-side)
    const transactionId = randomUUID();

    // 10. Guard against transactionId collision in the loaded ledger snapshot.
    //     UUID v4 collision probability is ~10^-18 per entry; guard included
    //     for ledger integrity completeness.
    if (ledger.entries.some(e => e.transactionId === transactionId)) {
      return {
        success: false,
        kind:    "invalid-input",
        message: "Transaction ID collision detected (UUID v4 collision). This is an internal error — please retry.",
      };
    }

    // 11. Build entry — reviewId/pairType/slugA/slugB derived from queue unit
    const now = this.clock.now();
    const entry: RelationshipDecisionEntry = {
      transactionId,
      reviewId:               unit.reviewId,
      pairType:               unit.pairType,
      slugA:                  unit.slugA,
      slugB:                  unit.slugB,
      decision,
      previousGovernanceState: currentGovState,
      newGovernanceState:      decision === "DEFERRED" ? "DEFERRED" : decision,
      previousStatus:          currentStatus,
      newStatus,
      actor:                  input.actor.trim(),
      reason:                 input.reason.trim(),
      founderNotes:           input.founderNotes?.trim() || null,
      decidedAt:              now,
    };

    // 12. Append to THE SAME ledger snapshot — no second ledgerRepo.load()
    const updatedLedger: RelationshipDecisionLedger = {
      ...ledger,
      entries: [...ledger.entries, entry],
    };

    // 13. Atomic save
    this.ledgerRepo.save(updatedLedger);

    return { success: true, entry };
  }

  // ── Private utilities ───────────────────────────────────────────────────────

  /**
   * Loads and merges queue + ledger for READ-ONLY projections.
   * Used by getReviewQueue, getReviewUnit, getProgress.
   * NOT used by _decide() — mutations use a dedicated single-snapshot load
   * inside _decide() to eliminate the second-read race window (EP6-P5CR).
   */
  private _loadMerged(): {
    units: readonly RelationshipReviewUnit[];
    allEntries: readonly RelationshipDecisionEntry[];
    entryMap: Map<string, RelationshipDecisionEntry>;
  } {
    const queue  = this.queueRepo.load();
    const ledger = this.ledgerRepo.load();

    // entryMap: latest decision per reviewId (last entry wins)
    const entryMap = new Map<string, RelationshipDecisionEntry>();
    for (const entry of ledger.entries) {
      entryMap.set(entry.reviewId, entry);
    }

    return { units: queue.units, allEntries: ledger.entries, entryMap };
  }

  private _buildCurrentStateMap(
    units: readonly RelationshipReviewUnit[],
    allEntries: readonly RelationshipDecisionEntry[],
  ): Map<string, RelationshipGovernanceState> {
    const map = new Map<string, RelationshipGovernanceState>();
    // Last entry per reviewId is the current state
    for (const entry of allEntries) {
      map.set(entry.reviewId, entry.newGovernanceState);
    }
    return map;
  }

  private _governanceToStatus(
    gs: RelationshipGovernanceState,
    fallback: RelationshipReviewStatus,
  ): RelationshipReviewStatus {
    switch (gs) {
      case "PENDING":           return "pending-review";
      case "RESEARCH_BLOCKED":  return "needs-research";
      case "FOUNDER_APPROVED":  return "approved";
      case "FOUNDER_REJECTED":  return "rejected";
      case "DEFERRED":          return "deferred";
      default:                  return fallback;
    }
  }
}

// ── UnitCurrentState re-export ────────────────────────────────────────────────

export type { UnitCurrentState as RelationshipUnitCurrentState };
