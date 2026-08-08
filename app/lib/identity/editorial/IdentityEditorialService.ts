/**
 * Maison Identity Platform — Identity Editorial Transaction Service
 *
 * SERVER-ONLY MODULE.
 * This module reads and writes the identity registry from the filesystem.
 * It must only be imported in server-side code (Server Components, Server Actions, scripts).
 * The `server-only` package is not installed in this project — this constraint
 * is enforced by convention and by the fact that production I/O uses readFileSync.
 *
 * Provides seven editorial mutations and two read projections for the first
 * campaign review cycle (EP5-P3).
 *
 * Actions implemented: verify, correct-canonical, confirm-alias,
 *   request-more-research, elevate, reject, dispute.
 *
 * Actions deferred: deprecate, merge, split, reinstate, category-correction,
 *   alias-removal, confidence-editing, evidence-deletion.
 *
 * Constitutional anchor: HUMANS APPROVE INSTITUTIONAL TRUTH.
 *
 * Design principles:
 *   1. Injected clock — all timestamps come from this.clock.now(). No scattered
 *      new Date() calls. Tests inject a fixed timestamp for determinism.
 *   2. Repository abstraction — production wraps persistence.ts; tests use
 *      an in-memory implementation. No filesystem access inside this class.
 *   3. Optimistic concurrency — every mutation checks expectedUpdatedAt against
 *      the live record before writing.
 *   4. Confidence independence — no mutation modifies confidence.score,
 *      confidence.basis, or confidence.lastEvaluatedAt.
 *   5. Evidence immutability — every spread-reconstruct preserves the full
 *      evidence array unchanged.
 *   6. Canonical collision guard — before every write, a fresh IdentityRegistry
 *      is rebuilt with all other records, then the updated record is registered.
 *      This exercises all guards including the brand-conditional canonical guard.
 */

import type {
  IdentityId,
  IdentityRecord,
  IdentityHistoryEntry,
  MarketedGender,
  CanonicalIdentity,
} from "../types";
import {
  IdentityAliasCollisionError,
  IdentityDuplicateCanonicalError,
} from "../types";
import { validateIdentityRecord } from "../validator";
import { IdentityRegistry } from "../IdentityRegistry";
import { normalizeIdentityString } from "../normalizer";

import type {
  IdentityEditorialClock,
  IdentityEditorialRepository,
  EditorialResult,
  VerifyInput,
  CorrectCanonicalInput,
  ConfirmAliasInput,
  RequestMoreResearchInput,
  ElevateInput,
  RejectInput,
  DisputeInput,
  ReviewQueueFilter,
  IdentityReviewSummary,
  IdentityReviewDetail,
  CampaignEntry,
} from "./types";

// ── Internal helpers ──────────────────────────────────────────────────────────

/**
 * Pure canonical name safety guard.
 * Mirrors scripts/identity/ingestion/sourceValidation.ts:isCleanCanonicalProposal.
 * Inlined here to avoid importing scripts/ into app/ directory.
 *
 * Rejects names that contain ambiguity markers that indicate the name has not
 * been editorially resolved and should not be institutionally verified.
 */
function isCleanCanonicalProposal(name: string): boolean {
  const trimmed = name.trim();
  if (!trimmed) return false;
  if (trimmed.includes(" / ")) return false;
  if (trimmed.includes("(Note:")) return false;
  if (/\([^)]*\bunverified\b[^)]*\)/i.test(trimmed)) return false;
  return true;
}

/** Internal discriminated union for _transact mutation callbacks. */
type MutateReturn =
  | { readonly kind: "updated"; readonly record: IdentityRecord }
  | { readonly kind: "error"; readonly result: EditorialResult };

// ── Service ───────────────────────────────────────────────────────────────────

export class IdentityEditorialService {
  constructor(
    private readonly repository: IdentityEditorialRepository,
    private readonly clock: IdentityEditorialClock,
  ) {}

  // ── Read projections ────────────────────────────────────────────────────────

  /**
   * Returns the filtered, ordered review queue.
   *
   * Default statuses: pending-review, candidate, disputed.
   * Order: pending-review → candidate → disputed → id ascending within each group.
   *
   * Campaign enrichment (recommendedAction, researchConfidence, possibleNameIssue)
   * is joined from campaignEntries when provided.
   */
  getReviewQueue(
    filter?: ReviewQueueFilter,
    campaignEntries?: readonly CampaignEntry[],
  ): IdentityReviewSummary[] {
    const data = this.repository.load();
    const campaignMap = IdentityEditorialService._buildCampaignMap(campaignEntries);

    const reviewStatuses = filter?.status ?? ["pending-review", "candidate", "disputed"];
    let records = data.identities.filter(r => reviewStatuses.includes(r.status));

    if (filter?.possibleNameIssue !== undefined) {
      records = records.filter(r => {
        const entry = campaignMap.get(r.id);
        return entry?.possibleNameIssue === filter.possibleNameIssue;
      });
    }

    if (filter?.researchConfidence !== undefined) {
      records = records.filter(r => {
        const entry = campaignMap.get(r.id);
        return entry?.researchConfidence === filter.researchConfidence;
      });
    }

    if (filter?.recommendedAction !== undefined && filter.recommendedAction.length > 0) {
      records = records.filter(r => {
        const entry = campaignMap.get(r.id);
        return entry !== undefined && filter.recommendedAction!.includes(entry.recommendedAction);
      });
    }

    const statusOrder: Record<string, number> = {
      "pending-review": 0,
      "candidate": 1,
      "disputed": 2,
    };

    records = [...records].sort((a, b) => {
      const sa = statusOrder[a.status] ?? 99;
      const sb = statusOrder[b.status] ?? 99;
      if (sa !== sb) return sa - sb;
      return a.id.localeCompare(b.id);
    });

    return records.map(r => {
      const entry = campaignMap.get(r.id);
      const supplierGroups = [
        ...new Set(
          r.supplierIdentities
            .map(si => si.supplierCategory ?? "")
            .filter(Boolean),
        ),
      ];
      const summary: IdentityReviewSummary = {
        id: r.id,
        canonicalName: r.canonicalIdentity.canonicalName,
        canonicalBrand: r.canonicalIdentity.canonicalBrand,
        category: r.canonicalIdentity.category,
        status: r.status,
        confidenceScore: r.confidence.score,
        supplierName: r.supplierIdentities[0]?.supplierName ?? "",
        supplierGroups,
        recommendedAction: entry?.recommendedAction,
        researchConfidence: entry?.researchConfidence,
        possibleNameIssue: entry?.possibleNameIssue,
        updatedAt: r.updatedAt,
      };
      return summary;
    });
  }

  /**
   * Returns full detail for a single identity under review, including campaign
   * enrichment and pre-computed verification eligibility gate.
   *
   * Returns null if the identity ID is not found.
   */
  getIdentityReview(
    id: IdentityId,
    campaignEntries?: readonly CampaignEntry[],
  ): IdentityReviewDetail | null {
    const data = this.repository.load();
    const record = data.identities.find(r => r.id === id) ?? null;
    if (!record) return null;

    const campaignMap = IdentityEditorialService._buildCampaignMap(campaignEntries);
    const campaignEntry = campaignMap.get(id);

    const blockers: string[] = [];

    if (record.status !== "pending-review" && record.status !== "disputed") {
      blockers.push(
        `Status is "${record.status}" — only pending-review or disputed identities may be verified.`,
      );
    }

    if (!record.canonicalIdentity.canonicalName?.trim()) {
      blockers.push("canonicalName is required.");
    } else if (!isCleanCanonicalProposal(record.canonicalIdentity.canonicalName)) {
      blockers.push(
        `canonicalName "${record.canonicalIdentity.canonicalName}" contains ambiguity markers. ` +
        `Correct the canonical name first.`,
      );
    }

    if (!record.canonicalIdentity.canonicalBrand?.trim()) {
      blockers.push("canonicalBrand is required before verification.");
    }

    let canonicalCollisionWarning: string | null = null;
    if (record.canonicalIdentity.canonicalBrand) {
      const otherRecords = data.identities.filter(r => r.id !== id);
      const tempRegistry = new IdentityRegistry();
      for (const r of otherRecords) {
        try { tempRegistry.register(r); } catch { /* ignore pre-existing data */ }
      }
      try {
        tempRegistry.register(record);
      } catch (err) {
        if (err instanceof IdentityDuplicateCanonicalError) {
          canonicalCollisionWarning =
            `Potential canonical collision with identity "${err.existingId}".`;
        }
      }
    }

    return {
      record,
      campaignEntry,
      verificationEligible: blockers.length === 0,
      verificationBlockers: blockers,
      canonicalCollisionWarning,
    };
  }

  // ── Mutations ───────────────────────────────────────────────────────────────

  /**
   * verify: pending-review | disputed → verified
   *
   * Gate requirements:
   *   • actor non-empty
   *   • status ∈ {pending-review, disputed}
   *   • canonicalName present and passes the clean-name guard
   *   • canonicalBrand present and non-empty
   *   • validateIdentityRecord PASS
   *   • no canonical collision
   */
  verifyIdentity(input: VerifyInput): EditorialResult {
    if (!input.actor.trim()) {
      return { success: false, kind: "invalid-input", message: "Actor (reviewer name) is required." };
    }

    return this._transact(input.identityId, input.expectedUpdatedAt, (record, now) => {
      if (record.status !== "pending-review" && record.status !== "disputed") {
        return {
          kind: "error",
          result: {
            success: false,
            kind: "invalid-transition",
            message:
              `Cannot verify identity with status "${record.status}". ` +
              `Only pending-review and disputed identities may be verified.`,
          },
        };
      }

      const name = record.canonicalIdentity.canonicalName?.trim() ?? "";
      if (!name) {
        return {
          kind: "error",
          result: { success: false, kind: "validation", message: "canonicalName is required before verification." },
        };
      }
      if (!isCleanCanonicalProposal(name)) {
        return {
          kind: "error",
          result: {
            success: false,
            kind: "validation",
            message:
              `canonicalName "${record.canonicalIdentity.canonicalName}" contains ambiguity ` +
              `markers and cannot be verified. Correct the canonical name first.`,
          },
        };
      }
      if (!record.canonicalIdentity.canonicalBrand?.trim()) {
        return {
          kind: "error",
          result: {
            success: false,
            kind: "validation",
            message: "canonicalBrand is required before an identity may be verified.",
          },
        };
      }

      const historyEntry: IdentityHistoryEntry = {
        timestamp: now,
        event: "verified",
        summary: input.reason
          ? `Identity verified. Reason: ${input.reason}`
          : "Identity verified.",
        actor: input.actor.trim(),
        previousValue: JSON.stringify(record.status),
        nextValue: JSON.stringify("verified"),
      };

      const updated: IdentityRecord = {
        ...record,
        status: "verified",
        history: [...record.history, historyEntry],
        updatedAt: now,
      };

      return { kind: "updated", record: updated };
    });
  }

  /**
   * correct-canonical: update canonical name, brand, year, or gender.
   * Valid from any status. Does not change status.
   * Returns no-op if no field actually changed.
   */
  correctCanonical(input: CorrectCanonicalInput): EditorialResult {
    if (!input.actor.trim()) {
      return { success: false, kind: "invalid-input", message: "Actor (reviewer name) is required." };
    }

    if ("canonicalName" in input && input.canonicalName !== undefined && !input.canonicalName.trim()) {
      return { success: false, kind: "invalid-input", message: "canonicalName cannot be empty if provided." };
    }
    if ("canonicalBrand" in input && input.canonicalBrand !== undefined && !input.canonicalBrand.trim()) {
      return { success: false, kind: "invalid-input", message: "canonicalBrand cannot be empty if provided." };
    }
    if ("launchYear" in input && input.launchYear !== null && input.launchYear !== undefined) {
      if (!Number.isInteger(input.launchYear) || input.launchYear < 1800 || input.launchYear > 2100) {
        return {
          success: false,
          kind: "invalid-input",
          message: `launchYear must be an integer between 1800 and 2100. Received: ${input.launchYear}.`,
        };
      }
    }

    return this._transact(input.identityId, input.expectedUpdatedAt, (record, now) => {
      const oldCi = record.canonicalIdentity;

      // Resolve new values — using `in` to distinguish absent from explicit
      const newName: string =
        "canonicalName" in input && input.canonicalName !== undefined
          ? input.canonicalName.trim()
          : oldCi.canonicalName;

      const newBrand: string | undefined =
        "canonicalBrand" in input && input.canonicalBrand !== undefined
          ? input.canonicalBrand.trim()
          : oldCi.canonicalBrand;

      const newLaunchYear: number | undefined =
        "launchYear" in input
          ? (input.launchYear == null ? undefined : input.launchYear)
          : oldCi.launchYear;

      const newMarketedGender: MarketedGender | undefined =
        "marketedGender" in input
          ? (input.marketedGender == null ? undefined : input.marketedGender)
          : oldCi.marketedGender;

      // Detect changes
      const nameChanged = newName !== oldCi.canonicalName;
      const brandChanged = newBrand !== oldCi.canonicalBrand;
      const yearChanged = newLaunchYear !== oldCi.launchYear;
      const genderChanged = newMarketedGender !== oldCi.marketedGender;

      if (!nameChanged && !brandChanged && !yearChanged && !genderChanged) {
        return {
          kind: "error",
          result: {
            success: false,
            kind: "no-op",
            message: "No canonical fields changed. All provided values are identical to current values.",
          },
        };
      }

      // Validate the new canonical name if it changed
      if (nameChanged && !isCleanCanonicalProposal(newName)) {
        return {
          kind: "error",
          result: {
            success: false,
            kind: "validation",
            message:
              `canonicalName "${newName}" contains ambiguity markers and cannot be set. ` +
              `Resolve the ambiguity (remove " / ", "(Note:", or "(unverified)" patterns) first.`,
          },
        };
      }

      // Build updated canonical identity — spread with conditional optionals
      const newCi: CanonicalIdentity = {
        canonicalName: newName,
        category: oldCi.category,
        ...(newBrand !== undefined ? { canonicalBrand: newBrand } : {}),
        ...(newLaunchYear !== undefined ? { launchYear: newLaunchYear } : {}),
        ...(newMarketedGender !== undefined ? { marketedGender: newMarketedGender } : {}),
      };

      // Build history summary
      const changes: string[] = [];
      if (nameChanged) changes.push(`canonicalName: "${oldCi.canonicalName}" → "${newName}"`);
      if (brandChanged) changes.push(`canonicalBrand: "${oldCi.canonicalBrand ?? "(none)"}" → "${newBrand ?? "(cleared)"}"`);
      if (yearChanged) changes.push(`launchYear: ${oldCi.launchYear ?? "(none)"} → ${newLaunchYear ?? "(cleared)"}`);
      if (genderChanged) changes.push(`marketedGender: "${oldCi.marketedGender ?? "(none)"}" → "${newMarketedGender ?? "(cleared)"}"`);

      const changeSummary = changes.join("; ");
      const reasonSuffix = input.reason ? ` Reason: ${input.reason}` : "";

      const eventType = nameChanged ? "canonical-name-changed" : "brand-changed";

      const historyEntry: IdentityHistoryEntry = {
        timestamp: now,
        event: eventType,
        summary: `Canonical correction: ${changeSummary}.${reasonSuffix}`,
        actor: input.actor.trim(),
        previousValue: JSON.stringify(oldCi),
        nextValue: JSON.stringify(newCi),
      };

      const updated: IdentityRecord = {
        ...record,
        canonicalIdentity: newCi,
        history: [...record.history, historyEntry],
        updatedAt: now,
      };

      return { kind: "updated", record: updated };
    });
  }

  /**
   * confirm-alias: add a verified alias. Valid from any status.
   * Returns alias-collision if the normalized alias already maps to a different identity.
   * Returns no-op if the alias already exists on this record.
   */
  confirmAlias(input: ConfirmAliasInput): EditorialResult {
    if (!input.actor.trim()) {
      return { success: false, kind: "invalid-input", message: "Actor (reviewer name) is required." };
    }
    if (!input.aliasValue.trim()) {
      return { success: false, kind: "invalid-input", message: "Alias value is required." };
    }

    return this._transact(input.identityId, input.expectedUpdatedAt, (record, now) => {
      const normalizedAlias = normalizeIdentityString(input.aliasValue.trim());

      // Same-record duplicate check (produces cleaner error than validator)
      const alreadyExists = record.aliases.some(
        a => normalizeIdentityString(a.value) === normalizedAlias,
      );
      if (alreadyExists) {
        return {
          kind: "error",
          result: {
            success: false,
            kind: "no-op",
            message: `Alias "${input.aliasValue.trim()}" is already registered on this identity.`,
          },
        };
      }

      const historyEntry: IdentityHistoryEntry = {
        timestamp: now,
        event: "alias-added",
        summary: `Alias confirmed: "${input.aliasValue.trim()}" (type: ${input.aliasType}).${input.reason ? ` Reason: ${input.reason}` : ""}`,
        actor: input.actor.trim(),
        previousValue: undefined,
        nextValue: JSON.stringify({ value: input.aliasValue.trim(), type: input.aliasType }),
      };

      const updated: IdentityRecord = {
        ...record,
        aliases: [
          ...record.aliases,
          {
            value: input.aliasValue.trim(),
            type: input.aliasType,
            source: input.actor.trim(),
            createdAt: now,
            verified: true,
          },
        ],
        evidence: record.evidence, // explicit evidence preservation
        history: [...record.history, historyEntry],
        updatedAt: now,
      };

      return { kind: "updated", record: updated };
    });
  }

  /**
   * request-more-research: pending-review → candidate.
   * Demotes the record back to candidate status. reason required.
   */
  requestMoreResearch(input: RequestMoreResearchInput): EditorialResult {
    if (!input.actor.trim()) {
      return { success: false, kind: "invalid-input", message: "Actor (reviewer name) is required." };
    }
    if (!input.reason.trim()) {
      return { success: false, kind: "invalid-input", message: "Reason is required for request-more-research." };
    }

    return this._transact(input.identityId, input.expectedUpdatedAt, (record, now) => {
      if (record.status !== "pending-review") {
        return {
          kind: "error",
          result: {
            success: false,
            kind: "invalid-transition",
            message:
              `Cannot request more research on identity with status "${record.status}". ` +
              `Only pending-review identities may be demoted to candidate.`,
          },
        };
      }

      const historyEntry: IdentityHistoryEntry = {
        timestamp: now,
        event: "candidate-demoted",
        summary: `Returned to candidate for further research. Reason: ${input.reason.trim()}`,
        actor: input.actor.trim(),
        previousValue: JSON.stringify(record.status),
        nextValue: JSON.stringify("candidate"),
      };

      const updated: IdentityRecord = {
        ...record,
        status: "candidate",
        evidence: record.evidence, // explicit evidence preservation
        history: [...record.history, historyEntry],
        updatedAt: now,
      };

      return { kind: "updated", record: updated };
    });
  }

  /**
   * elevate: candidate → pending-review.
   * Promotes the record to pending-review for editorial consideration. reason required.
   */
  elevate(input: ElevateInput): EditorialResult {
    if (!input.actor.trim()) {
      return { success: false, kind: "invalid-input", message: "Actor (reviewer name) is required." };
    }
    if (!input.reason.trim()) {
      return { success: false, kind: "invalid-input", message: "Reason is required for elevate." };
    }

    return this._transact(input.identityId, input.expectedUpdatedAt, (record, now) => {
      if (record.status !== "candidate") {
        return {
          kind: "error",
          result: {
            success: false,
            kind: "invalid-transition",
            message:
              `Cannot elevate identity with status "${record.status}". ` +
              `Only candidate identities may be elevated to pending-review.`,
          },
        };
      }

      const historyEntry: IdentityHistoryEntry = {
        timestamp: now,
        event: "candidate-promoted",
        summary: `Elevated to pending-review. Reason: ${input.reason.trim()}`,
        actor: input.actor.trim(),
        previousValue: JSON.stringify(record.status),
        nextValue: JSON.stringify("pending-review"),
      };

      const updated: IdentityRecord = {
        ...record,
        status: "pending-review",
        evidence: record.evidence, // explicit evidence preservation
        history: [...record.history, historyEntry],
        updatedAt: now,
      };

      return { kind: "updated", record: updated };
    });
  }

  /**
   * reject: candidate | pending-review | disputed → rejected.
   *
   * Note: verified → rejected is NOT allowed in EP5-P3. A verified institutional
   * assertion must first be disputed before it can be rejected. This enforces
   * a mandatory reflection step.
   *
   * reason required.
   */
  rejectIdentity(input: RejectInput): EditorialResult {
    if (!input.actor.trim()) {
      return { success: false, kind: "invalid-input", message: "Actor (reviewer name) is required." };
    }
    if (!input.reason.trim()) {
      return { success: false, kind: "invalid-input", message: "Reason is required for rejection." };
    }

    return this._transact(input.identityId, input.expectedUpdatedAt, (record, now) => {
      const allowedStatuses = ["candidate", "pending-review", "disputed"] as const;
      if (!allowedStatuses.includes(record.status as typeof allowedStatuses[number])) {
        return {
          kind: "error",
          result: {
            success: false,
            kind: "invalid-transition",
            message:
              `Cannot reject identity with status "${record.status}". ` +
              `Allowed: candidate, pending-review, disputed. ` +
              (record.status === "verified"
                ? "A verified identity must first be disputed before rejection."
                : ""),
          },
        };
      }

      const historyEntry: IdentityHistoryEntry = {
        timestamp: now,
        event: "rejected",
        summary: `Identity rejected. Reason: ${input.reason.trim()}`,
        actor: input.actor.trim(),
        previousValue: JSON.stringify(record.status),
        nextValue: JSON.stringify("rejected"),
      };

      const updated: IdentityRecord = {
        ...record,
        status: "rejected",
        evidence: record.evidence, // explicit evidence preservation
        history: [...record.history, historyEntry],
        updatedAt: now,
      };

      return { kind: "updated", record: updated };
    });
  }

  /**
   * dispute: verified → disputed.
   * Challenges an existing institutional assertion. reason required.
   * Only verified identities may enter the disputed state.
   */
  disputeIdentity(input: DisputeInput): EditorialResult {
    if (!input.actor.trim()) {
      return { success: false, kind: "invalid-input", message: "Actor (reviewer name) is required." };
    }
    if (!input.reason.trim()) {
      return { success: false, kind: "invalid-input", message: "Reason is required for dispute." };
    }

    return this._transact(input.identityId, input.expectedUpdatedAt, (record, now) => {
      if (record.status !== "verified") {
        return {
          kind: "error",
          result: {
            success: false,
            kind: "invalid-transition",
            message:
              `Cannot dispute identity with status "${record.status}". ` +
              `Only verified identities may be disputed.`,
          },
        };
      }

      const historyEntry: IdentityHistoryEntry = {
        timestamp: now,
        event: "disputed",
        summary: `Institutional assertion disputed. Reason: ${input.reason.trim()}`,
        actor: input.actor.trim(),
        previousValue: JSON.stringify(record.status),
        nextValue: JSON.stringify("disputed"),
      };

      const updated: IdentityRecord = {
        ...record,
        status: "disputed",
        evidence: record.evidence, // explicit evidence preservation
        history: [...record.history, historyEntry],
        updatedAt: now,
      };

      return { kind: "updated", record: updated };
    });
  }

  // ── Private transaction core ────────────────────────────────────────────────

  /**
   * Load → stale check → mutate → validate → collision check → save atomically.
   *
   * All mutations route through this single method to guarantee the invariants:
   * - Optimistic concurrency enforced on every write.
   * - validateIdentityRecord always runs before any write (defense in depth).
   * - Canonical and alias collision checks always run before any write.
   * - No partial writes: all failures return EditorialResult without writing.
   */
  private _transact(
    identityId: IdentityId,
    expectedUpdatedAt: string,
    mutate: (record: IdentityRecord, now: string) => MutateReturn,
  ): EditorialResult {
    // 1. Load
    const data = this.repository.load();
    const current = data.identities.find(r => r.id === identityId) ?? null;

    if (!current) {
      return {
        success: false,
        kind: "not-found",
        message: `Identity "${identityId}" not found in registry.`,
      };
    }

    // 2. Optimistic concurrency check
    if (current.updatedAt !== expectedUpdatedAt) {
      return {
        success: false,
        kind: "stale-review",
        message:
          `Identity "${identityId}" was modified since this review was opened. ` +
          `Expected updatedAt: "${expectedUpdatedAt}", current: "${current.updatedAt}". ` +
          `Reload to see current state.`,
      };
    }

    // 3. Domain mutation
    const now = this.clock.now();
    const mutateResult = mutate(current, now);
    if (mutateResult.kind === "error") return mutateResult.result;

    const updated = mutateResult.record;

    // 4. Record validation (defense in depth)
    const validation = validateIdentityRecord(updated);
    if (validation.status === "FAIL") {
      return {
        success: false,
        kind: "validation",
        message: `Record validation failed: ${validation.errors.map(e => e.message).join("; ")}`,
      };
    }

    // 5. Canonical and alias collision check via fresh registry rebuild
    const otherRecords = data.identities.filter(r => r.id !== identityId);
    const freshRegistry = new IdentityRegistry();
    for (const r of otherRecords) {
      freshRegistry.register(r); // pre-existing records — any throw is a data integrity bug
    }
    try {
      freshRegistry.register(updated);
    } catch (err) {
      if (err instanceof IdentityDuplicateCanonicalError) {
        return {
          success: false,
          kind: "canonical-collision",
          message: err.message,
          collision: { canonicalKey: err.canonicalKey, existingId: err.existingId },
        };
      }
      if (err instanceof IdentityAliasCollisionError) {
        return {
          success: false,
          kind: "alias-collision",
          message: err.message,
          collision: { aliasValue: err.normalizedAlias, existingId: err.existingId },
        };
      }
      throw err; // unexpected — propagate
    }

    // 6. Persist
    const newIdentities = data.identities.map(r => (r.id === identityId ? updated : r));
    this.repository.save({ version: data.version, identities: newIdentities });

    return { success: true, record: updated };
  }

  // ── Private utilities ───────────────────────────────────────────────────────

  private static _buildCampaignMap(
    entries?: readonly CampaignEntry[],
  ): Map<string, CampaignEntry> {
    if (!entries) return new Map();
    return new Map(entries.map(e => [e.identityId, e]));
  }
}
