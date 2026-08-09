/**
 * Knowledge Factory × Maison Identity Platform
 * EP5-P4E — First Controlled Identity-Qualified Knowledge Factory Generation
 *
 * Invocation:
 *   npm run mkc:identity-qualified:controlled
 *
 * Safety constraints (all enforced by this script):
 *   • APPROVED_IDENTITY_ID must be set to the founder-authorised IdentityId.
 *     When null: STOP. Zero AI calls. Zero audit records. Zero draft writes.
 *   • Only one identity per invocation.
 *   • No batch. No second identity. No promotion. No native write.
 *   • ABSOLUTE_STOP_AFTER: result inspection and audit verification only.
 *   • Human review report printed before process exits.
 *
 * Governance:
 *   All identity qualification, eligibility check, mapping resolution,
 *   audit record production, and pipeline invocation are performed by
 *   runIdentityQualifiedPipeline(). This script is the controlled
 *   activation wrapper — not a reimplementation.
 *
 * EP5-P4E authorises exactly one identity:
 *   MIP-000012 (Alien Goddess / Mugler → alien-goddess-inspired, Rose)
 *
 * DO NOT add more identities. DO NOT run a batch. DO NOT promote.
 * DO NOT write native records. DO NOT change the audit store directly.
 */

import type { IdentityId } from "../../app/lib/identity/types";
import {
  runIdentityQualifiedPipeline,
} from "./identity/runIdentityQualifiedPipeline";
import {
  loadIdentityQualifiedRunAudit,
  AUDIT_FILE_PATH,
  FACTORY_VERSION,
} from "./identity/IdentityQualifiedRunLogger";
import { IDENTITY_QUALIFIED_AUDIT_VERSION } from "./identity/IdentityQualifiedRunLogger";
import { loadIdentityRegistry }             from "../../app/lib/identity/persistence";
import { IdentityRegistry }                 from "../../app/lib/identity/IdentityRegistry";
import { isIdentityKnowledgeEligible }      from "../../app/lib/identity/eligibility";
import { loadIdentityProductRegistry }      from "../../app/lib/identity/productMapping";
import { intake }                           from "./intake";

// ═════════════════════════════════════════════════════════════════════════════
// FOUNDER-AUTHORISED IDENTITY
// ═════════════════════════════════════════════════════════════════════════════
//
// This constant controls whether a real identity-qualified generation runs.
//
// When null:
//   Script prints a STOP report and exits cleanly. Zero AI calls.
//   Zero audit records. Zero draft writes. Zero cost.
//
// When set to an authorised IdentityId:
//   All pre-run gates are checked. If all pass, runIdentityQualifiedPipeline()
//   is invoked. One real AI-backed factory run executes.
//
// EP5-P4E authorises exactly one identity:
//   "MIP-000012" as IdentityId
//
// Force policy: false (safe default — will skip if product is already native)
// Set force to true ONLY after founder explicitly approves regeneration of
// an existing promoted knowledge record.
//
// DO NOT set this value without founder approval.
// DO NOT change identityId to any other identity for this episode.

const APPROVED_IDENTITY_ID: IdentityId | null = null;

// Force policy (read-only — do not change without founder approval):
//   false — honours factory idempotency (skips if already native or drafted)
//   true  — bypasses intake guards; will regenerate even if native file exists
const FORCE: boolean = false;

// ═════════════════════════════════════════════════════════════════════════════

const SEP = "═".repeat(72);
const DIV = "─".repeat(72);

async function main(): Promise<void> {
  console.log(`\n${SEP}`);
  console.log("EP5-P4E — Controlled Identity-Qualified Knowledge Factory Generation");
  console.log(`Factory: ${FACTORY_VERSION}   Audit schema: ${IDENTITY_QUALIFIED_AUDIT_VERSION}`);
  console.log(DIV);

  // ── NULL-GUARD: APPROVED_IDENTITY_ID must be set ───────────────────────────
  if (APPROVED_IDENTITY_ID === null) {
    printNullGuardReport();
    process.exit(0);
  }

  const identityId = APPROVED_IDENTITY_ID;

  // ── PRE-RUN GATE 1: ANTHROPIC_API_KEY present (required only when FORCE = true) ─
  // With FORCE = false, the pipeline will return "skipped" before any producer
  // executes — no API key is needed. With FORCE = true, generation requires the key.
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (FORCE && !apiKey) {
    console.error(`\n${SEP}`);
    console.error("STOP — PRE-RUN GATE 1 FAILED: ANTHROPIC_API_KEY is not set.");
    console.error("FORCE = true requires a valid API key for AI generation.");
    console.error("Set ANTHROPIC_API_KEY in your environment before proceeding.\n");
    process.exit(1);
  }
  if (FORCE) {
    console.log("\n  ✓ Gate 1 — ANTHROPIC_API_KEY present (required — FORCE = true)");
  } else {
    console.log("\n  ✓ Gate 1 — ANTHROPIC_API_KEY check skipped (FORCE = false — no AI generation expected)");
  }

  // ── PRE-RUN GATE 2: AUDIT STORE valid and empty check ─────────────────────
  let auditFile;
  try {
    auditFile = loadIdentityQualifiedRunAudit();
  } catch (err) {
    console.error(`\n${SEP}`);
    console.error("STOP — PRE-RUN GATE 2 FAILED: Audit store could not be loaded.");
    console.error(err instanceof Error ? err.message : String(err));
    console.error("Inspect scripts/factory/identity/identity-qualified-run-audit.json\n");
    process.exit(1);
  }
  console.log(`  ✓ Gate 2 — Audit store valid   version=${auditFile.version}   records=${auditFile.records.length}`);
  if (auditFile.records.length > 0) {
    console.log(`\n  NOTE: Audit store already contains ${auditFile.records.length} record(s).`);
    console.log("  This is not the first production run. Existing audit records will be preserved.");
  }

  // ── PRE-RUN GATE 3: IDENTITY STATE ────────────────────────────────────────
  const registryData = loadIdentityRegistry();
  const registry     = new IdentityRegistry();
  for (const r of registryData.identities) registry.register(r);

  const identityRecord = registry.getById(identityId);
  if (!identityRecord) {
    console.error(`\n${SEP}`);
    console.error(`STOP — PRE-RUN GATE 3 FAILED: Identity "${identityId}" not found in registry.`);
    process.exit(1);
  }
  const eligible = isIdentityKnowledgeEligible(identityRecord);
  if (!eligible) {
    console.error(`\n${SEP}`);
    console.error(`STOP — PRE-RUN GATE 3 FAILED: Identity "${identityId}" is not eligible.`);
    console.error(`  status: ${identityRecord.status}   eligibility: false`);
    process.exit(1);
  }
  console.log(`  ✓ Gate 3 — Identity state`);
  console.log(`            id:             ${identityRecord.id}`);
  console.log(`            canonicalName:  ${identityRecord.canonicalIdentity.canonicalName}`);
  console.log(`            canonicalBrand: ${identityRecord.canonicalIdentity.canonicalBrand ?? "(not set)"}`);
  console.log(`            status:         ${identityRecord.status}   eligible: true`);

  // ── PRE-RUN GATE 4: GOVERNED MAPPING ──────────────────────────────────────
  const productRegistry = loadIdentityProductRegistry();
  const mappings        = productRegistry.mappings.filter(m => m.identityId === identityId);
  if (mappings.length === 0) {
    console.error(`\n${SEP}`);
    console.error(`STOP — PRE-RUN GATE 4 FAILED: No governed mapping for "${identityId}".`);
    process.exit(1);
  }
  if (mappings.length > 1) {
    console.log(`\n  NOTE: Multiple mappings found for "${identityId}" (${mappings.length}).`);
    console.log("  Providing no maisonSlug — runIdentityQualifiedPipeline will require selection.");
  }
  const mapping = mappings[0];
  console.log(`  ✓ Gate 4 — Governed mapping`);
  console.log(`            maisonSlug:      ${mapping.maisonSlug}`);
  console.log(`            collection:      ${mapping.collection}`);
  console.log(`            mappingVersion:  ${productRegistry.version}`);

  // ── PRE-RUN GATE 5: PRODUCT INTAKE ────────────────────────────────────────
  const intakeResult = intake({ slug: mapping.maisonSlug, force: FORCE });
  if (intakeResult.status === "not_found") {
    console.error(`\n${SEP}`);
    console.error(`STOP — PRE-RUN GATE 5 FAILED: "${mapping.maisonSlug}" not found in supplier catalogue.`);
    console.error("The bridge mapping may be stale. Review identity-product-registry.json.");
    process.exit(1);
  }
  if (intakeResult.status === "already_native" && !FORCE) {
    // NOTE: The native file exists from a legacy factory run (before EP5).
    // Option A (approved): proceed to runIdentityQualifiedPipeline with force: false.
    // The pipeline will call run() with force: false; the orchestrator will return
    // { status: "skipped" } — the expected and correct institutional outcome.
    // Two audit records (attempt + outcome) will be written. No AI. No draft change.
    console.log(`\n  NOTE Gate 5 — native file exists (legacy run, pre-EP5)`);
    console.log(`    app/lib/mkc/native/${mapping.maisonSlug}.ts`);
    console.log("    Proceeding with force: false — pipeline will return 'skipped' (expected).");
    console.log("    Two MIPRUN-* audit records will be written. No AI. No draft change.");
  }
  if (intakeResult.status === "already_drafted" && !FORCE) {
    console.log(`\n${DIV}`);
    console.log("  PRE-RUN GATE 5 — EXISTING DRAFT — STOP REQUIRED");
    console.log(`  intake("${mapping.maisonSlug}", force: false) → already_drafted`);
    console.log(`  An existing draft is at scripts/factory/drafts/${mapping.maisonSlug}.ts`);
    console.log("  Set FORCE = true to regenerate (requires founder approval).");
    console.log(`${DIV}`);
    process.exit(0);
  }
  // Category check: only needed when intake resolved a fresh record.
  // already_native → product is confirmed in the MKC, category implicitly fragrance.
  if (intakeResult.status === "found") {
    const productIntake = intakeResult.intake!;
    if (productIntake.category !== "fragrance") {
      console.error(`\n${SEP}`);
      console.error(`STOP — PRE-RUN GATE 5 FAILED: Category mismatch. "${mapping.maisonSlug}" is "${productIntake.category}".`);
      process.exit(1);
    }
    console.log(`  ✓ Gate 5 — Product intake    slug=${mapping.maisonSlug}   category=${productIntake.category}   status=found`);
  } else {
    // already_native or already_drafted with FORCE = false: product confirmed to exist
    console.log(`  ✓ Gate 5 — Product intake    slug=${mapping.maisonSlug}   status=${intakeResult.status}   (category: fragrance — confirmed by MKC native record)`);
  }

  // ── ALL PRE-RUN GATES PASSED ───────────────────────────────────────────────
  console.log(`\n${DIV}`);
  console.log("  All pre-run gates passed. Invoking identity-qualified pipeline.");
  console.log(`  identityId:  ${identityId}`);
  console.log(`  maisonSlug:  ${mapping.maisonSlug}   (resolved by governance — not manually supplied)`);
  console.log(`  force:       ${FORCE}`);
  console.log(`  dryRun:      false`);
  console.log(DIV);

  // ── INVOKE runIdentityQualifiedPipeline ────────────────────────────────────
  const startedAt = Date.now();

  const result = await runIdentityQualifiedPipeline({
    identityId,
    // maisonSlug omitted — identity has exactly 1 governed mapping; auto-selected
    force:  FORCE,
    dryRun: false,
  });

  const elapsedMs = Date.now() - startedAt;

  // ════════════════════════════════════════════════════════════════════════════
  // ABSOLUTE_STOP_AFTER_PIPELINE
  // Nothing below this boundary may: promote, write native records,
  // modify application code, update catalogues, or process a second identity.
  // ════════════════════════════════════════════════════════════════════════════

  printRunReport(result, identityId, mapping.maisonSlug, elapsedMs);

  process.exit(0);
}

// ── Null-guard report ─────────────────────────────────────────────────────────

function printNullGuardReport(): void {
  console.log(`\n${SEP}`);
  console.log("EP5-P4E — STOP: No Founder-Authorised Identity Found");
  console.log(DIV);
  console.log(`
APPROVED_IDENTITY_ID is null.

No AI call has been made.
No audit records have been written.
No draft has been written.
No cost has been incurred.

Per EP5-P4E governance:
  The first real identity-qualified AI generation must be explicitly
  authorised by the founder. No identity may be invented or selected
  without explicit institutional approval.

EP5-P4E authorises exactly one identity:

  MIP-000012 — Alien Goddess / Mugler
  → Maison product: alien-goddess-inspired (Rose collection)

IMPORTANT: A native MKC record already exists for alien-goddess-inspired.
This product was generated via the LEGACY factory path (before EP5 / MIP
was established). Generation through this runner would be identity-governed
RE-GENERATION, not first generation.

The founder must decide:

  Option A — FORCE = false (safe):
    Proves the governance and audit chain without AI generation.
    Pipeline returns "skipped" (product already native).
    First real MIPRUN-* audit record pair is created.
    No AI cost. No draft change. No native change.

    To activate: set APPROVED_IDENTITY_ID = "MIP-000012" as IdentityId
                 Leave FORCE = false

  Option B — FORCE = true (regeneration):
    Full AI-backed re-generation of alien-goddess-inspired under
    identity governance. New draft produced for human review.
    Native file unchanged until explicit promotion step.
    AI cost incurred (Haiku 4.5: ~6,000–8,000 tokens estimated).
    Two real MIPRUN-* audit records created.

    To activate: set APPROVED_IDENTITY_ID = "MIP-000012" as IdentityId
                 Set FORCE = true
                 Ensure ANTHROPIC_API_KEY is set in environment

To proceed (only after founder approval):
  1. Open: scripts/factory/run-identity-qualified-controlled.ts
  2. Find: const APPROVED_IDENTITY_ID: IdentityId | null = null;
  3. Set it to the approved identity (only "MIP-000012" is authorised for EP5-P4E).
  4. Set FORCE to true or false per the decision above.
  5. Re-run: npm run mkc:identity-qualified:controlled

${DIV}
WHAT WILL HAPPEN ON ACTIVATION
${DIV}

  1. runIdentityQualifiedPipeline({ identityId: "MIP-000012", force: FORCE })
  2. Identity eligibility gate → MIP-000012 verified ✓
  3. Bridge registry → alien-goddess-inspired, Rose ✓
  4. Intake validation → category: fragrance ✓
  5. Governance-attempt audit record written (MIPRUN-{id})
  6. Legacy run() invoked:
       FORCE = false → returns { status: "skipped" }  (no AI)
       FORCE = true  → runs all 5 producers, writes draft  (AI cost)
  7. Pipeline-outcome audit record written
  8. Result returned to this runner
  9. Human review report printed
  10. ABSOLUTE STOP — no promotion, no native write

${DIV}
No AI call has been made.
No cost has been incurred.
${SEP}
`);
}

// ── Run report ────────────────────────────────────────────────────────────────

function printRunReport(
  result:     Awaited<ReturnType<typeof runIdentityQualifiedPipeline>>,
  identityId: IdentityId,
  slug:       string,
  elapsedMs:  number,
): void {
  console.log(`\n${SEP}`);
  console.log("EP5-P4E — RUN RESULT");
  console.log(DIV);

  console.log(`\n  status:      ${result.status}`);
  console.log(`  identityId:  ${identityId}`);
  console.log(`  elapsed:     ${elapsedMs}ms`);

  if (result.status === "audit-store-unavailable") {
    console.error("\n  CRITICAL: Audit store unavailable. Pipeline was NOT executed.");
    console.error(`  message: ${result.message}`);
    console.log(`\n${SEP}`);
    return;
  }

  if (result.status === "governance-failed") {
    console.log(`\n  governanceFailure: ${result.governanceFailure}`);
    console.log(`  message:           ${result.message}`);
    console.log(`  auditStatus:       ${result.auditStatus}`);
    if (result.auditFailure) {
      console.log(`  auditFailure:      ${result.auditFailure}`);
    }
    console.log(`\n${SEP}`);
    return;
  }

  // Pipeline ran (complete | degraded | skipped | pipeline-failed)
  console.log(`  resolvedMaisonSlug: ${result.resolvedMaisonSlug}`);
  console.log(`  auditStatus:        ${result.auditStatus}`);
  if (result.auditFailure) {
    console.log(`  auditFailure:       ${result.auditFailure}`);
  }

  const pr = result.pipelineResult;
  console.log(`\n  Pipeline result:`);
  console.log(`    status:     ${pr.status}`);
  console.log(`    draftPath:  ${pr.draftPath ?? "(none)"}`);
  console.log(`    message:    ${pr.message ?? "(none)"}`);
  console.log(`    durationMs: ${pr.durationMs}ms`);

  // Audit verification
  console.log(`\n${DIV}`);
  console.log("  AUDIT VERIFICATION");
  let auditCheck;
  try {
    auditCheck = loadIdentityQualifiedRunAudit();
    const runRecords = auditCheck.records.filter(r =>
      r.type === "governance-attempt" &&
      (r as { identityId: string }).identityId === identityId,
    );
    console.log(`  Audit records total:  ${auditCheck.records.length}`);
    console.log(`  Attempt records for ${identityId}:  ${runRecords.length}`);
    for (const rec of runRecords) {
      const attempt = rec as { runId: string; qualificationOutcome: string; startedAt: string };
      console.log(`    runId: ${attempt.runId}   outcome: ${attempt.qualificationOutcome}   startedAt: ${attempt.startedAt}`);
    }
    const outcomeRecords = auditCheck.records.filter(r => r.type === "pipeline-outcome");
    console.log(`  Outcome records:  ${outcomeRecords.length}`);
  } catch (err) {
    console.error(`  Could not read audit store: ${err instanceof Error ? err.message : String(err)}`);
  }

  console.log(`\n${DIV}`);
  console.log("  HUMAN REVIEW REQUIRED");
  console.log(DIV);

  if (result.status === "skipped") {
    console.log(`
  Pipeline returned: skipped
  Reason: alien-goddess-inspired is already in the native MKC registry.
  The product was not regenerated (FORCE = ${FORCE}).

  The governance and audit path has been proven:
    ✓ Identity eligibility checked
    ✓ Bridge mapping resolved
    ✓ Governance-attempt audit record written
    ✓ Pipeline-outcome audit record written (status: skipped)

  No AI generation occurred. No draft changed. No native file changed.

  To regenerate with identity governance:
    Set FORCE = true in this script and re-run with founder approval.`);
  } else if (result.status === "complete" || result.status === "degraded") {
    console.log(`
  Pipeline returned: ${result.status}
  Draft path: ${pr.draftPath ?? "(not reported)"}

  REVIEW CHECKLIST:
    □ Identity provenance verified — audit records match expectations
    □ MIP-000012 status remains "verified" — no mutation
    □ alien-goddess-inspired bridge mapping unchanged — 1 mapping
    □ Draft file reviewed for content quality
    □ Draft does not redefine MIP canonical identity
    □ No supplier name leakage in generated editorial
    □ Validation status in draft header checked
    □ Relationships reviewed for accuracy
    □ Decision made: APPROVE / REGENERATE / MANUALLY CORRECT / REJECT
    □ Native file NOT updated until explicit promotion episode

  ABSOLUTE STOP. Do not promote. Do not modify the native file.
  Communicate review decision before any further action.`);
  } else {
    console.log(`
  Pipeline returned: ${result.status}
  Investigate before proceeding.
  No promotion. No retry without founder approval.`);
  }

  console.log(`\n${SEP}`);
  console.log("EP5-P4E — STOP.");
  console.log("Result inspected. Human review and founder decision required before next step.");
  console.log(`${SEP}\n`);
}

// ── Entry point ───────────────────────────────────────────────────────────────

main().catch((err: unknown) => {
  console.error(
    `\n[mkc:identity-qualified:controlled] Fatal: ${err instanceof Error ? err.message : String(err)}\n`,
  );
  process.exit(1);
});
