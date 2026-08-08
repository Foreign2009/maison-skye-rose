/**
 * Knowledge Factory × Maison Identity Platform — Identity Eligibility Gate
 *
 * Answers the single institutional question:
 *   "Is this identity eligible to participate in Knowledge Factory operations?"
 *
 * Constitutional anchor: IDENTITY PRECEDES KNOWLEDGE.
 * HUMANS APPROVE INSTITUTIONAL TRUTH.
 *
 * This gate is a STANDALONE ELIGIBILITY BOUNDARY.
 *
 * It does NOT:
 *   - resolve Maison catalogue slugs
 *   - invoke scaffold, producers, or the generation engine
 *   - create drafts or promote records
 *   - infer Maison product associations
 *   - write to the identity registry
 *   - make AI or API calls
 *
 * The governed bridge between an IdentityId and a Maison supplier catalogue
 * entry does not yet exist. That bridge is established in EP5-P4B after an
 * explicit, founder-reviewed association record is in place.
 *
 * Production entry point:  checkIdentityEligibility(identityId)
 *   Loads the registry from disk. Read-only. Never calls saveIdentityRegistry().
 *
 * Testable entry point:    resolveIdentityEligibility(registry, identityId)
 *   Pure function. Accepts an injected IdentityRegistry. No disk I/O.
 *   Use this form in validation suites and unit tests.
 *
 * EP5-P4A — Identity-Aware Factory Intake Foundation
 */

import type { IdentityId }        from "../../../app/lib/identity/types";
import { isValidIdentityId }       from "../../../app/lib/identity/types";
import { IdentityRegistry }        from "../../../app/lib/identity/IdentityRegistry";
import { isIdentityKnowledgeEligible } from "../../../app/lib/identity/eligibility";
import { loadIdentityRegistry }    from "../../../app/lib/identity/persistence";

// ── Gate result types ──────────────────────────────────────────────────────────

/**
 * Three structurally distinct failure reasons:
 *
 *   invalid-identity-id   — the ID string fails the MIP-NNNNNN format check.
 *                           The registry was never consulted.
 *
 *   identity-not-found    — the ID is well-formed but absent from the registry.
 *                           The record may not have been ingested yet.
 *
 *   identity-not-eligible — the record exists but isIdentityKnowledgeEligible()
 *                           returned false. Only "verified" records are eligible.
 *                           The current status is included in the message for
 *                           diagnostic/editorial use — it is NOT a second policy.
 *
 * These reasons must remain structurally distinct. Do not collapse them into a
 * single "not-eligible" reason — the distinction matters for caller diagnostics.
 */
export type IdentityGateFailureReason =
  | "invalid-identity-id"
  | "identity-not-found"
  | "identity-not-eligible";

export type IdentityGateResult =
  | { readonly eligible: true;  readonly identityId: IdentityId }
  | {
      readonly eligible:  false;
      readonly reason:    IdentityGateFailureReason;
      readonly identityId: IdentityId;
      readonly message:   string;
    };

// ── Testable entry point ───────────────────────────────────────────────────────

/**
 * Pure eligibility resolver. The caller provides the registry.
 *
 * Resolution chain:
 *   1. isValidIdentityId(identityId)       — format check
 *   2. registry.getById(identityId)        — existence check
 *   3. isIdentityKnowledgeEligible(record) — institutional gate
 *
 * The eligibility decision is always delegated to isIdentityKnowledgeEligible().
 * This function never compares record.status directly.
 */
export function resolveIdentityEligibility(
  registry: IdentityRegistry,
  identityId: IdentityId,
): IdentityGateResult {
  if (!isValidIdentityId(identityId)) {
    return {
      eligible:   false,
      reason:     "invalid-identity-id",
      identityId,
      message:    `"${identityId}" is not a valid MIP identity ID. Expected format: MIP-NNNNNN.`,
    };
  }

  const record = registry.getById(identityId);
  if (!record) {
    return {
      eligible:   false,
      reason:     "identity-not-found",
      identityId,
      message:    `Identity "${identityId}" is not registered in the identity registry.`,
    };
  }

  if (!isIdentityKnowledgeEligible(record)) {
    return {
      eligible:   false,
      reason:     "identity-not-eligible",
      identityId,
      message:
        `Identity "${identityId}" (${record.canonicalIdentity.canonicalName}) ` +
        `has status "${record.status}" and is not eligible for Knowledge Factory ` +
        `operations. Only verified identities may proceed.`,
    };
  }

  return { eligible: true, identityId };
}

// ── Production entry point ─────────────────────────────────────────────────────

/**
 * Loads the current identity registry from disk and resolves eligibility.
 *
 * The registry is loaded fresh on every call — no in-process cache.
 * saveIdentityRegistry() is never called by this function.
 *
 * This is the entry point for production factory invocations.
 * For tests, use resolveIdentityEligibility() with an injected registry.
 */
export function checkIdentityEligibility(identityId: IdentityId): IdentityGateResult {
  const data = loadIdentityRegistry();
  const registry = new IdentityRegistry();
  for (const record of data.identities) {
    registry.register(record);
  }
  return resolveIdentityEligibility(registry, identityId);
}
