/**
 * Knowledge Factory × Maison Identity Platform
 * Identity-Qualified Factory Entry Point
 *
 * EP5-P4C — Establish Identity-Qualified Factory Invocation
 * EP5-P4D — Establish Identity-Qualified Factory Run Audit (audit integration)
 *
 * Constitutional anchor:
 *   IDENTITY PRECEDES KNOWLEDGE.
 *   IDENTITY-QUALIFIED GENERATION MUST FAIL CLOSED.
 *   GOVERNANCE MUST BE AUDITABLE AFTER EXECUTION.
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
 *   7. Write governance-attempt audit record — FAIL CLOSED for passed invocations
 *   8. Invoke the existing legacy factory run()
 *   9. Write pipeline-outcome audit record — FAIL VISIBLE
 *
 * NEVER calls run() before steps 1–7 succeed.
 * NEVER accepts an arbitrary caller-supplied slug.
 * NEVER infers or guesses the Maison product — only the governed bridge is authoritative.
 * NEVER duplicates: eligibility logic, mapping registry logic, catalogue rules, producers.
 *
 * Pattern: pure/production split (mirrors FactoryIdentityGate)
 *   resolveIdentityQualifiedTarget() — pure function, injected registries, no disk I/O
 *   runIdentityQualifiedPipeline()   — production entry, loads registries, calls run()
 *
 * Audit domain separation:
 *   auditStatus / auditFailure are FACTORY OPERATIONAL fields.
 *   They are structurally distinct from governanceFailure / IdentityQualifiedFailureReason.
 *   An audit-store-unavailable result means infrastructure failed — not governance failed.
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
import type { PipelineInput, PipelineResult } from "../types";
import {
  createProductionIdentityQualifiedAuditRepository,
  defaultRunIdGenerator,
  defaultAuditClock,
  FACTORY_VERSION,
} from "./IdentityQualifiedRunLogger";
import type {
  IdentityQualifiedAttemptRecord,
  IdentityQualifiedOutcomeRecord,
  IdentityQualifiedAuditRepository,
  RunIdGenerator,
  AuditClock,
} from "./IdentityQualifiedRunLogger";

// ── Input type ──────────────────────────────────────────────────────────────────

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

// ── Failure taxonomy ────────────────────────────────────────────────────────────

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
 *
 * "audit-store-unavailable" is NOT in this union — it is an infrastructure
 * failure, not a governance failure. It appears as a top-level result status.
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

// ── Governance target ───────────────────────────────────────────────────────────

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

// ── Injectable pipeline runner type ────────────────────────────────────────────

export type PipelineRunner = (input: PipelineInput) => Promise<PipelineResult>;

// ── Dependencies (injectable for testing) ──────────────────────────────────────

export type IdentityQualifiedPipelineDependencies = {
  readonly runIdGenerator?:  RunIdGenerator;
  readonly auditClock?:      AuditClock;
  readonly pipelineRunner?:  PipelineRunner;
  readonly auditRepository?: IdentityQualifiedAuditRepository;
};

// ── Result type ─────────────────────────────────────────────────────────────────

/**
 * The result of a full identity-qualified pipeline invocation.
 *
 * Three structural variants:
 *
 * `governance-failed` — governance checks failed before run() was called.
 *   auditStatus: "recorded" | "failed" — Correction 2: audit failure is VISIBLE.
 *   auditFailure?: string — present only when auditStatus === "failed".
 *   governanceFailure and message identify the governance problem.
 *   auditFailure identifies the audit infrastructure problem.
 *   These domains must never be conflated.
 *
 * `audit-store-unavailable` — governance PASSED but pre-run audit write failed.
 *   Fail-closed: pipeline was NOT invoked. No pipelineResult is present.
 *   This is an infrastructure failure, NOT a governance failure.
 *
 * `complete` | `degraded` | `skipped` | `pipeline-failed` — governance passed;
 *   run() was called. auditStatus: "complete" | "incomplete" — Correction 3.
 *   resolvedMaisonSlug and identityId are always present for traceability.
 *   `pipeline-failed` maps to PipelineResult.status === "failed".
 */
export type IdentityQualifiedPipelineResult =
  | {
      readonly status:             "complete" | "degraded" | "skipped" | "pipeline-failed";
      readonly identityId:         IdentityId;
      readonly resolvedMaisonSlug: string;
      readonly pipelineResult:     PipelineResult;
      readonly auditStatus:        "complete" | "incomplete";
      readonly auditFailure?:      string;
    }
  | {
      readonly status:            "governance-failed";
      readonly identityId:        IdentityId;
      readonly governanceFailure: IdentityQualifiedFailureReason;
      readonly message:           string;
      readonly auditStatus:       "recorded" | "failed";
      readonly auditFailure?:     string;
    }
  | {
      readonly status:     "audit-store-unavailable";
      readonly identityId: IdentityId;
      readonly message:    string;
    };

// ── Pure governance resolver ────────────────────────────────────────────────────

/**
 * Pure governance resolution function. Accepts injected registries.
 * No disk I/O. No AI calls. Deterministically testable.
 *
 * This is the testable form — parallel to resolveIdentityEligibility() in
 * FactoryIdentityGate. Validation suites call this directly with in-memory
 * fixtures to prove governance logic without disk access or AI generation.
 *
 * Governance steps (1–4 of the full 9-step check order):
 *   1. IdentityId format + existence + eligibility → via resolveIdentityEligibility()
 *   2. Governed product mapping lookup → from injected productRegistry
 *   3. Zero-mapping guard → identity-unmapped
 *   4. Multi-mapping selection logic → multiple-product-mappings | invalid-product-selection
 *
 * Steps 5–9 (catalogue validation, category check, audit write, run()) require
 * I/O and live in runIdentityQualifiedPipeline().
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

// ── Production entry point ──────────────────────────────────────────────────────

/**
 * Identity-qualified factory invocation — production entry point.
 *
 * Loads both registries from disk, runs pure governance resolution, performs
 * catalogue validation, writes audit records, then invokes the existing legacy
 * factory run().
 *
 * The registry is loaded fresh on every call — no in-process cache.
 * saveIdentityRegistry() and saveIdentityProductRegistry() are never called.
 *
 * Full 9-step governed sequence:
 *   1–4: resolveIdentityQualifiedTarget() — pure, no I/O
 *   5:   intake() catalogue validation
 *   6:   category compatibility check
 *   7:   write governance-attempt audit record — FAIL CLOSED for passed invocations
 *   8:   run() — existing legacy factory pipeline
 *   9:   write pipeline-outcome audit record — FAIL VISIBLE
 *
 * Optional deps parameter enables test injection of:
 *   runIdGenerator  — deterministic ID in tests
 *   auditClock      — deterministic timestamps in tests
 *   pipelineRunner  — stub runner that never calls real AI generation
 *   auditRepository — in-memory repository that never touches the production file
 */
export async function runIdentityQualifiedPipeline(
  input: IdentityQualifiedPipelineInput,
  deps?: IdentityQualifiedPipelineDependencies,
): Promise<IdentityQualifiedPipelineResult> {

  const generateRunId = deps?.runIdGenerator  ?? defaultRunIdGenerator;
  const clock         = deps?.auditClock      ?? defaultAuditClock;
  const runner        = deps?.pipelineRunner  ?? run;
  const auditRepo     = deps?.auditRepository ?? createProductionIdentityQualifiedAuditRepository();

  const runId     = generateRunId();
  const startedAt = clock();

  // Load MIP registry fresh
  const mipData     = loadIdentityRegistry();
  const mipRegistry = new IdentityRegistry();
  for (const record of mipData.identities) {
    mipRegistry.register(record);
  }

  // Load bridge registry fresh
  const productRegistry = loadIdentityProductRegistry();

  // Steps 1–5: pure governance resolution (no I/O, no AI)
  const target = resolveIdentityQualifiedTarget(mipRegistry, productRegistry, input);

  // Identity status snapshot for the audit record (best-effort; falls back to "unknown")
  const identityRecord                = mipRegistry.getById(input.identityId);
  const identityStatusAtQualification = identityRecord?.status ?? "unknown";

  // Returns true when the failure occurred before the mapping step.
  // Used to omit mappingVersion for pre-mapping failures where it is meaningless.
  function isPreMappingFailure(reason: IdentityQualifiedFailureReason): boolean {
    return (
      reason === "invalid-identity-id"  ||
      reason === "identity-not-found"   ||
      reason === "identity-not-eligible"
    );
  }

  // Write a governance-rejected attempt record and return the typed result.
  // Correction 2: audit write failure is VISIBLE in the returned result.
  function appendGovernanceRejected(
    reason:     IdentityQualifiedFailureReason,
    maisonSlug: string | null,
    collection: "Skye" | "Rose" | "Elite" | null,
    message:    string,
  ): IdentityQualifiedPipelineResult {
    const attemptRecord: IdentityQualifiedAttemptRecord = {
      type:                          "governance-attempt",
      runId,
      identityId:                    input.identityId,
      qualificationOutcome:          "governance-rejected",
      governanceFailureReason:       reason,
      maisonSlug,
      collection,
      identityStatusAtQualification,
      mappingVersion:                isPreMappingFailure(reason) ? null : productRegistry.version,
      factoryVersion:                FACTORY_VERSION,
      force:                         input.force  ?? false,
      dryRun:                        input.dryRun ?? false,
      startedAt,
    };

    try {
      auditRepo.append(attemptRecord);
      return {
        status:            "governance-failed",
        identityId:        input.identityId,
        governanceFailure: reason,
        message,
        auditStatus:       "recorded",
      };
    } catch (err) {
      return {
        status:            "governance-failed",
        identityId:        input.identityId,
        governanceFailure: reason,
        message,
        auditStatus:       "failed",
        auditFailure:      err instanceof Error ? err.message : String(err),
      };
    }
  }

  // Handle pure governance failure from resolveIdentityQualifiedTarget
  if (!target.resolved) {
    return appendGovernanceRejected(target.reason, null, null, target.message);
  }

  // Step 6: Validate mapped slug still exists in the supplier catalogue.
  // force: true bypasses native/drafted guards — we only want to confirm
  // the product exists in the supplier catalogue, not whether it needs regeneration.
  const intakeResult = intake({ slug: target.slug, force: true });

  if (intakeResult.status === "not_found") {
    const msg =
      `Governed mapping for "${input.identityId}" points to "${target.slug}", ` +
      `which was not found in the Maison supplier catalogue. ` +
      `The bridge mapping may be stale — review and update identity-product-registry.json.`;
    return appendGovernanceRejected("mapped-product-not-found", target.slug, target.collection, msg);
  }

  // Step 7: Validate category compatibility.
  // The factory currently supports identity-qualified generation for fragrance only.
  const productIntake = intakeResult.intake!;
  if (productIntake.category !== "fragrance") {
    const msg =
      `Governed mapping for "${input.identityId}" points to "${target.slug}" ` +
      `(category: "${productIntake.category}"). The factory currently supports ` +
      `identity-qualified generation for fragrance products only.`;
    return appendGovernanceRejected("category-mismatch", target.slug, target.collection, msg);
  }

  // All 7 governance checks passed.
  // Write governance-passed attempt record — FAIL CLOSED (pipeline must not run without it).
  const preRunRecord: IdentityQualifiedAttemptRecord = {
    type:                          "governance-attempt",
    runId,
    identityId:                    input.identityId,
    qualificationOutcome:          "governance-passed",
    governanceFailureReason:       null,
    maisonSlug:                    target.slug,
    collection:                    target.collection,
    identityStatusAtQualification,
    mappingVersion:                productRegistry.version,
    factoryVersion:                FACTORY_VERSION,
    force:                         input.force  ?? false,
    dryRun:                        input.dryRun ?? false,
    startedAt,
  };

  try {
    auditRepo.append(preRunRecord);
  } catch (err) {
    // Pre-run audit write failed. FAIL CLOSED — pipeline is NOT invoked.
    // This is an infrastructure failure, not a governance failure.
    return {
      status:     "audit-store-unavailable",
      identityId: input.identityId,
      message:
        `Identity-qualified audit persistence failed before pipeline execution for ` +
        `"${input.identityId}" (runId: ${runId}). Cannot proceed without a durable ` +
        `governance record. Audit error: ${err instanceof Error ? err.message : String(err)}`,
    };
  }

  // All governance and audit pre-conditions satisfied. Invoke the pipeline.
  const pipelineResult = await runner({
    slug:   target.slug,
    force:  input.force  ?? false,
    dryRun: input.dryRun ?? false,
  });

  const completedAt    = clock();
  const pipelineStatus: "complete" | "degraded" | "skipped" | "pipeline-failed" =
    pipelineResult.status === "failed" ? "pipeline-failed" : pipelineResult.status;

  // Write post-run outcome record — FAIL VISIBLE (Correction 3).
  // The pipeline already ran — fail closed would not protect anything here.
  // The result must expose audit completion state so callers can alert.
  const outcomeRecord: IdentityQualifiedOutcomeRecord = {
    type:           "pipeline-outcome",
    runId,
    pipelineStatus,
    completedAt,
    durationMs:     pipelineResult.durationMs,
  };

  try {
    auditRepo.append(outcomeRecord);
    return {
      status:             pipelineStatus,
      identityId:         input.identityId,
      resolvedMaisonSlug: target.slug,
      pipelineResult,
      auditStatus:        "complete",
    };
  } catch (err) {
    const auditFailureMsg = err instanceof Error ? err.message : String(err);
    // Post-run audit failure: pipeline ran successfully but the outcome record was not stored.
    // Console.warn is supplemental; the result is the authoritative signal (Correction 3).
    console.warn(
      `[mip:factory] Warning: could not write identity-qualified outcome audit record. ` +
      `runId: ${runId}  slug: ${target.slug}  error: ${auditFailureMsg}`,
    );
    return {
      status:             pipelineStatus,
      identityId:         input.identityId,
      resolvedMaisonSlug: target.slug,
      pipelineResult,
      auditStatus:        "incomplete",
      auditFailure:       auditFailureMsg,
    };
  }
}
