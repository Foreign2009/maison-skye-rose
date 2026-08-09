/**
 * Knowledge Factory × Maison Identity Platform
 * Identity-Qualified Factory Entry Point
 *
 * EP5-P4C — Establish Identity-Qualified Factory Invocation
 *
 * Constitutional anchor:
 *   IDENTITY PRECEDES KNOWLEDGE.
 *   IDENTITY-QUALIFIED GENERATION MUST FAIL CLOSED.
 *
 * This module is the SOLE governed entry point for identity-qualified factory runs.
 * Legacy generation remains in orchestrator.run() — that contract is unchanged.
 *
 * Governance sequence (must be preserved exactly — order is an invariant):
 *   1. Validate IdentityId format
 *   2. Check identity existence and eligibility via FactoryIdentityGate
 *   3. Resolve governed product mappings via IdentityProductResolver
 *   4. Handle multi-mapping product selection
 *   5. Validate the resolved slug exists in the supplier catalogue
 *   6. Validate product category compatibility
 *   7. Invoke the existing legacy factory run()
 *
 * NEVER calls run() before steps 1–6 succeed.
 * NEVER accepts an arbitrary caller-supplied slug.
 * NEVER infers or guesses the Maison product — only the governed bridge is authoritative.
 * NEVER duplicates: eligibility logic, mapping registry logic, catalogue rules, producers.
 *
 * Pattern: pure/production split (mirrors FactoryIdentityGate)
 *   resolveIdentityQualifiedTarget() — pure function, injected registries, no disk I/O
 *   runIdentityQualifiedPipeline()   — production entry, loads registries, calls run()
 *
 * Legacy run() is not called "identity-qualified", "MIP-verified", or "identity-governed".
 * Legacy means legacy. Only output from this module carries identity provenance.
 */

import type { IdentityId }             from "../../../app/lib/identity/types";
import { IdentityRegistry }             from "../../../app/lib/identity/IdentityRegistry";
import { loadIdentityRegistry }         from "../../../app/lib/identity/persistence";
import { loadIdentityProductRegistry }  from "../../../app/lib/identity/productMapping";
import type { IdentityProductRegistry } from "../../../app/lib/identity/productMapping";
import { resolveIdentityEligibility }   from "./FactoryIdentityGate";
import { intake }                       from "../intake";
import { run }                          from "../orchestrator";
import type { PipelineResult }          from "../types";

// ── Input type ─────────────────────────────────────────────────────────────────

/**
 * Identity-qualified factory input.
 *
 * Structurally separate from PipelineInput — this type has no `slug` field.
 * The governed Maison product slug is resolved internally from the bridge registry.
 * Callers cannot supply an arbitrary slug and pair it with an IdentityId.
 *
 * maisonSlug is only required when an identity maps to multiple Maison products.
 * It must be one of the governed mappings for the given identityId — arbitrary slugs
 * are rejected with `invalid-product-selection`.
 */
export type IdentityQualifiedPipelineInput = {
  readonly identityId:  IdentityId;
  readonly maisonSlug?: string;   // selection required only when identity has 2+ mappings
  readonly force?:      boolean;  // defaults to false
  readonly dryRun?:     boolean;  // defaults to false
};

// ── Failure taxonomy ───────────────────────────────────────────────────────────

/**
 * Typed identity-governance failure reasons.
 *
 * Eight structurally distinct reasons. These must never be collapsed into a
 * generic "not_found" or "failed" — each identifies a different institutional
 * data problem and requires a different human response.
 *
 *   invalid-identity-id         — IdentityId format violation (MIP-NNNNNN expected)
 *   identity-not-found          — well-formed ID absent from the registry
 *   identity-not-eligible       — record exists; isIdentityKnowledgeEligible() false
 *   identity-unmapped           — eligible identity has zero governed mappings
 *   multiple-product-mappings   — 2+ mappings, no product selection provided
 *   invalid-product-selection   — provided maisonSlug not in governed mappings
 *   mapped-product-not-found    — governed slug absent from supplier catalogue
 *   category-mismatch           — governed product category not factory-supported
 */
export type IdentityQualifiedFailureReason =
  | "invalid-identity-id"
  | "identity-not-found"
  | "identity-not-eligible"
  | "identity-unmapped"
  | "multiple-product-mappings"
  | "invalid-product-selection"
  | "mapped-product-not-found"
  | "category-mismatch";

// ── Governance target ──────────────────────────────────────────────────────────

/**
 * The output of the pure governance resolver.
 *
 * When `resolved: true`: the governed Maison product slug is ready for
 * catalogue validation and factory invocation.
 *
 * When `resolved: false`: a typed governance failure with a diagnostic message.
 * The factory pipeline must not be invoked.
 */
export type IdentityQualifiedTarget =
  | {
      readonly resolved:   true;
      readonly identityId: IdentityId;
      readonly slug:       string;
      readonly collection: "Skye" | "Rose" | "Elite";
    }
  | {
      readonly resolved: false;
      readonly reason:   IdentityQualifiedFailureReason;
      readonly message:  string;
    };

// ── Result type ────────────────────────────────────────────────────────────────

/**
 * The result of a full identity-qualified pipeline invocation.
 *
 * `governance-failed` — a governance check failed before run() was called.
 *   Access: result.governanceFailure and result.message.
 *   No pipelineResult is present.
 *
 * `complete` | `degraded` | `skipped` | `pipeline-failed` — governance passed;
 *   run() was called. Access: result.pipelineResult for the full pipeline output.
 *   `resolvedMaisonSlug` and `identityId` are always present for auditability.
 *
 * `pipeline-failed` maps to PipelineResult.status === "failed". The identity
 * context is preserved even when the downstream factory pipeline fails.
 */
export type IdentityQualifiedPipelineResult =
  | {
      readonly status:             "complete" | "degraded" | "skipped" | "pipeline-failed";
      readonly identityId:         IdentityId;
      readonly resolvedMaisonSlug: string;
      readonly pipelineResult:     PipelineResult;
    }
  | {
      readonly status:            "governance-failed";
      readonly identityId:        IdentityId;
      readonly governanceFailure: IdentityQualifiedFailureReason;
      readonly message:           string;
    };

// ── Pure governance resolver ───────────────────────────────────────────────────

/**
 * Pure governance resolution function. Accepts injected registries.
 * No disk I/O. No AI calls. Deterministically testable.
 *
 * This is the testable form — parallel to resolveIdentityEligibility() in
 * FactoryIdentityGate. Validation suites call this directly with in-memory
 * fixtures to prove governance logic without disk access or AI generation.
 *
 * Governance steps (1–4 of the full 7-step check order):
 *   1. IdentityId format + existence + eligibility → via resolveIdentityEligibility()
 *   2. Governed product mapping lookup → from injected productRegistry
 *   3. Zero-mapping guard → identity-unmapped
 *   4. Multi-mapping selection logic → multiple-product-mappings | invalid-product-selection
 *
 * Steps 5–7 (catalogue validation + run()) require I/O and live in
 * runIdentityQualifiedPipeline().
 */
export function resolveIdentityQualifiedTarget(
  mipRegistry:     IdentityRegistry,
  productRegistry: IdentityProductRegistry,
  input:           IdentityQualifiedPipelineInput,
): IdentityQualifiedTarget {

  // Steps 1–3: format check + identity existence + eligibility.
  // Delegated entirely to FactoryIdentityGate — never duplicated here.
  // isIdentityKnowledgeEligible() is the single eligibility authority.
  const gateResult = resolveIdentityEligibility(mipRegistry, input.identityId);
  if (!gateResult.eligible) {
    return {
      resolved: false,
      reason:   gateResult.reason,
      message:  gateResult.message,
    };
  }

  // Step 4: Governed product mapping resolution.
  // Filter injected productRegistry directly — no duplicate disk read.
  // This is the same logic as getMappingsForIdentity() but with an injected registry.
  const mappings = productRegistry.mappings.filter(m => m.identityId === input.identityId);

  if (mappings.length === 0) {
    return {
      resolved: false,
      reason:   "identity-unmapped",
      message:
        `Identity "${input.identityId}" has no governed Maison product mapping. ` +
        `Association must be established in the Identity-Product Bridge ` +
        `(identity-product-registry.json) before a factory invocation is authorised.`,
    };
  }

  // Step 5: Multi-mapping selection.
  let selectedMapping: (typeof mappings)[number];

  if (mappings.length === 1) {
    // Exactly one mapping — proceed automatically.
    // No caller-supplied slug is required or consulted in the single-mapping case.
    selectedMapping = mappings[0];
  } else {
    // Multiple mappings — explicit governed selection is required.
    // Array order is never used to select silently.
    if (!input.maisonSlug) {
      const slugList = mappings.map(m => m.maisonSlug).join(", ");
      return {
        resolved: false,
        reason:   "multiple-product-mappings",
        message:
          `Identity "${input.identityId}" maps to ${mappings.length} Maison products: ` +
          `[${slugList}]. Provide maisonSlug to select one governed mapping.`,
      };
    }

    // Validate the provided slug is one of the GOVERNED mappings.
    // An arbitrary slug that happens to exist in the catalogue is still rejected.
    const match = mappings.find(m => m.maisonSlug === input.maisonSlug);
    if (!match) {
      const slugList = mappings.map(m => m.maisonSlug).join(", ");
      return {
        resolved: false,
        reason:   "invalid-product-selection",
        message:
          `"${input.maisonSlug}" is not among the governed mappings for ` +
          `"${input.identityId}". Valid selections: [${slugList}].`,
      };
    }

    selectedMapping = match;
  }

  return {
    resolved:   true,
    identityId: input.identityId,
    slug:       selectedMapping.maisonSlug,
    collection: selectedMapping.collection,
  };
}

// ── Production entry point ─────────────────────────────────────────────────────

/**
 * Identity-qualified factory invocation — production entry point.
 *
 * Loads both registries from disk, runs pure governance resolution, performs
 * catalogue validation, then invokes the existing legacy factory run().
 *
 * The registry is loaded fresh on every call — no in-process cache.
 * saveIdentityRegistry() and saveIdentityProductRegistry() are never called.
 *
 * Full 7-step governance sequence:
 *   1–4: resolveIdentityQualifiedTarget() — pure, no I/O
 *   5: intake() catalogue validation
 *   6: category compatibility check
 *   7: run() — existing legacy factory pipeline
 */
export async function runIdentityQualifiedPipeline(
  input: IdentityQualifiedPipelineInput,
): Promise<IdentityQualifiedPipelineResult> {

  // Load MIP registry fresh
  const mipData     = loadIdentityRegistry();
  const mipRegistry = new IdentityRegistry();
  for (const record of mipData.identities) {
    mipRegistry.register(record);
  }

  // Load bridge registry fresh
  const productRegistry = loadIdentityProductRegistry();

  // Steps 1–5 (pure governance — no I/O, no AI)
  const target = resolveIdentityQualifiedTarget(mipRegistry, productRegistry, input);

  if (!target.resolved) {
    return {
      status:            "governance-failed",
      identityId:        input.identityId,
      governanceFailure: target.reason,
      message:           target.message,
    };
  }

  // Step 6: Validate mapped slug still exists in the supplier catalogue.
  // force: true bypasses native/drafted guards — we only want to confirm
  // the product exists in the supplier catalogue, not whether it needs regeneration.
  const intakeResult = intake({ slug: target.slug, force: true });

  if (intakeResult.status === "not_found") {
    return {
      status:            "governance-failed",
      identityId:        input.identityId,
      governanceFailure: "mapped-product-not-found",
      message:
        `Governed mapping for "${input.identityId}" points to "${target.slug}", ` +
        `which was not found in the Maison supplier catalogue. ` +
        `The bridge mapping may be stale — review and update identity-product-registry.json.`,
    };
  }

  // Step 7: Validate category compatibility.
  // The factory currently supports identity-qualified generation for fragrance only.
  const productIntake = intakeResult.intake!;
  if (productIntake.category !== "fragrance") {
    return {
      status:            "governance-failed",
      identityId:        input.identityId,
      governanceFailure: "category-mismatch",
      message:
        `Governed mapping for "${input.identityId}" points to "${target.slug}" ` +
        `(category: "${productIntake.category}"). The factory currently supports ` +
        `identity-qualified generation for fragrance products only.`,
    };
  }

  // All governance checks passed — invoke the existing legacy factory pipeline.
  // The slug is the governed slug from the bridge. The caller cannot alter it.
  const pipelineResult = await run({
    slug:   target.slug,
    force:  input.force  ?? false,
    dryRun: input.dryRun ?? false,
  });

  if (pipelineResult.status === "failed") {
    return {
      status:             "pipeline-failed",
      identityId:         input.identityId,
      resolvedMaisonSlug: target.slug,
      pipelineResult,
    };
  }

  return {
    status:             pipelineResult.status as "complete" | "degraded" | "skipped",
    identityId:         input.identityId,
    resolvedMaisonSlug: target.slug,
    pipelineResult,
  };
}
