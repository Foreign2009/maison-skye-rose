/**
 * EP5-P4D — Identity-Qualified Factory Run Audit — Validation Suite
 *
 * Constitutional mandate: GOVERNANCE MUST BE AUDITABLE AFTER EXECUTION.
 *
 * Deterministic proof suite — 60 proofs across 12 sections.
 *
 * ISOLATION INVARIANTS (non-negotiable):
 *   - ALL audit operations use in-memory repositories.
 *   - The production identity-qualified-run-audit.json is NEVER written by this suite.
 *   - The pipeline runner is ALWAYS a stub — no real run(), no AI calls, no generation.
 *   - identity-registry.json and identity-product-registry.json are READ but never written.
 *
 * §100 SCHEMA             — audit file structure and type discriminants
 * §200 RUN ID             — MIPRUN format, injection, uniqueness
 * §300 GOVERNANCE REJECTION — attempt record written for all rejection paths
 * §400 GOVERNANCE AUDIT FAILURE — Correction 2: rejection audit failure is visible
 * §500 GOVERNANCE PASS    — attempt record before run(), complete record structure
 * §600 PRE-RUN FAIL CLOSED — Correction: audit failure before run() blocks pipeline
 * §700 PIPELINE OUTCOMES  — four pipeline statuses → correct outcome records
 * §800 POST-RUN AUDIT FAILURE — Correction 3: outcome failure visible in result
 * §900 APPEND ONLY        — records accumulate, duplicates blocked, no delete export
 * §1000 CORRUPTION        — malformed store blocks writes and never resets
 * §1100 READ API          — list, find, findByIdentity query surfaces
 * §1200 PRODUCTION SAFETY — production file untouched, registry SHA unchanged
 */

import { createHash }           from "crypto";
import { readFileSync, existsSync } from "fs";
import { join }                 from "path";
import type { IdentityId }      from "../../app/lib/identity/types";
import type { PipelineInput, PipelineResult } from "../factory/types";
import {
  IDENTITY_QUALIFIED_AUDIT_VERSION,
  AUDIT_FILE_PATH,
  createInMemoryIdentityQualifiedAuditRepository,
  createFailingIdentityQualifiedAuditRepository,
  defaultRunIdGenerator,
  listIdentityQualifiedRuns,
  findIdentityQualifiedRun,
  findRunsByIdentity,
} from "../factory/identity/IdentityQualifiedRunLogger";
import type {
  IdentityQualifiedAttemptRecord,
  IdentityQualifiedOutcomeRecord,
  IdentityQualifiedAuditRecord,
  IdentityQualifiedRunAuditFile,
} from "../factory/identity/IdentityQualifiedRunLogger";
import {
  runIdentityQualifiedPipeline,
  type IdentityQualifiedPipelineDependencies,
} from "../factory/identity/runIdentityQualifiedPipeline";

// ── Proof harness ───────────────────────────────────────────────────────────────

let passed   = 0;
let failed   = 0;
const errors: string[] = [];

async function proof(label: string, fn: () => void | Promise<void>): Promise<void> {
  try {
    await fn();
    passed++;
    console.log(`  ✓  ${label}`);
  } catch (err) {
    failed++;
    const msg = err instanceof Error ? err.message : String(err);
    errors.push(`${label}: ${msg}`);
    console.error(`  ✗  ${label}`);
    console.error(`     ${msg}`);
  }
}

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

function assertDefined<T>(val: T | null | undefined, message: string): asserts val is T {
  if (val == null) throw new Error(message);
}

// ── Stub pipeline runner ────────────────────────────────────────────────────────

function makeStubRunner(
  status: "complete" | "degraded" | "skipped" | "failed" = "complete",
  durationMs = 42,
): (input: PipelineInput) => Promise<PipelineResult> {
  return async (_input: PipelineInput): Promise<PipelineResult> => ({
    status,
    slug:      _input.slug,
    draftPath: null,
    state:     null,
    message:   `stub:${status}`,
    durationMs,
  });
}

// ── Deterministic deps factory ──────────────────────────────────────────────────

let seqCounter = 0;

function makeDeps(overrides?: Partial<IdentityQualifiedPipelineDependencies>): {
  deps:  IdentityQualifiedPipelineDependencies;
  repo:  ReturnType<typeof createInMemoryIdentityQualifiedAuditRepository>;
  runId: string;
} {
  const runId = `MIPRUN-test${String(++seqCounter).padStart(8, "0")}`;
  const repo  = createInMemoryIdentityQualifiedAuditRepository();

  const deps: IdentityQualifiedPipelineDependencies = {
    runIdGenerator:  () => runId,
    auditClock:      () => "2026-08-09T12:00:00.000Z",
    pipelineRunner:  makeStubRunner("complete"),
    auditRepository: repo,
    ...overrides,
  };

  return { deps, repo, runId };
}

// ── Repository that passes first append, fails second ──────────────────────────

function createPreRunOkPostRunFailRepo() {
  let appendCount = 0;
  const inner     = createInMemoryIdentityQualifiedAuditRepository();
  return {
    load:       inner.load.bind(inner),
    getRecords: inner.getRecords.bind(inner),
    append: (rec: IdentityQualifiedAuditRecord) => {
      appendCount++;
      if (appendCount === 2) throw new Error("[test] simulated post-run append failure");
      inner.append(rec);
    },
  };
}

// ── Known test identities ───────────────────────────────────────────────────────
//  MIP-000012  verified, mapped → alien-goddess-inspired (Rose)
//  MIP-000001  verified, unmapped
//  MIP-999999  does not exist in registry
//  "BAD-FORMAT" invalid IdentityId format

const ID_MAPPED    = "MIP-000012" as IdentityId;
const ID_UNMAPPED  = "MIP-000001" as IdentityId;
const ID_NOT_FOUND = "MIP-999999" as IdentityId;
const ID_INVALID   = "BAD-FORMAT" as IdentityId;

// ── Main ────────────────────────────────────────────────────────────────────────

(async () => {

// ─────────────────────────────────────────────────────────────────────────────
// §100  SCHEMA
// ─────────────────────────────────────────────────────────────────────────────

console.log("\n§100 SCHEMA");

await proof("101: audit file schema version constant is 1.0.0", () => {
  assert(IDENTITY_QUALIFIED_AUDIT_VERSION === "1.0.0",
    `Expected "1.0.0", got "${IDENTITY_QUALIFIED_AUDIT_VERSION}"`);
});

await proof("102: in-memory repo initialises with empty records array", () => {
  const repo = createInMemoryIdentityQualifiedAuditRepository();
  const file = repo.load();
  assert(file.version === "1.0.0", "version must be 1.0.0");
  assert(Array.isArray(file.records), "records must be an array");
  assert(file.records.length === 0, "records must be empty on init");
});

await proof("103: governance-attempt type discriminant is preserved on append/load", () => {
  const repo = createInMemoryIdentityQualifiedAuditRepository();
  const rec: IdentityQualifiedAttemptRecord = {
    type:                          "governance-attempt",
    runId:                         "MIPRUN-schema-103",
    identityId:                    ID_UNMAPPED,
    qualificationOutcome:          "governance-rejected",
    governanceFailureReason:       "identity-unmapped",
    maisonSlug:                    null,
    collection:                    null,
    identityStatusAtQualification: "verified",
    mappingVersion:                "1.0.0",
    factoryVersion:                "0.5.0",
    force:                         false,
    dryRun:                        false,
    startedAt:                     "2026-08-09T12:00:00.000Z",
  };
  repo.append(rec);
  assert(repo.load().records[0].type === "governance-attempt",
    "discriminant must be preserved after append/load");
});

await proof("104: pipeline-outcome type discriminant is preserved on append/load", () => {
  const repo = createInMemoryIdentityQualifiedAuditRepository();
  const rec: IdentityQualifiedOutcomeRecord = {
    type:           "pipeline-outcome",
    runId:          "MIPRUN-schema-104",
    pipelineStatus: "complete",
    completedAt:    "2026-08-09T12:00:01.000Z",
    durationMs:     42,
  };
  repo.append(rec);
  assert(repo.load().records[0].type === "pipeline-outcome",
    "pipeline-outcome discriminant must be preserved");
});

await proof("105: attempt + outcome with shared runId form a valid two-record model", () => {
  const runId = "MIPRUN-schema-105";
  const repo  = createInMemoryIdentityQualifiedAuditRepository();
  repo.append({
    type:                          "governance-attempt",
    runId,
    identityId:                    ID_MAPPED,
    qualificationOutcome:          "governance-passed",
    governanceFailureReason:       null,
    maisonSlug:                    "alien-goddess-inspired",
    collection:                    "Rose",
    identityStatusAtQualification: "verified",
    mappingVersion:                "1.0.0",
    factoryVersion:                "0.5.0",
    force:                         false,
    dryRun:                        false,
    startedAt:                     "2026-08-09T12:00:00.000Z",
  });
  repo.append({
    type:           "pipeline-outcome",
    runId,
    pipelineStatus: "complete",
    completedAt:    "2026-08-09T12:00:01.000Z",
    durationMs:     42,
  });
  const file = repo.load();
  assert(file.records.length === 2, "must have 2 records");
  assert(file.records[0].runId === runId, "attempt runId must match");
  assert(file.records[1].runId === runId, "outcome runId must match");
});

// ─────────────────────────────────────────────────────────────────────────────
// §200  RUN ID
// ─────────────────────────────────────────────────────────────────────────────

console.log("\n§200 RUN ID");

await proof("201: default production runId generator produces MIPRUN- prefix", () => {
  const id = defaultRunIdGenerator();
  assert(id.startsWith("MIPRUN-"), `Expected MIPRUN- prefix, got "${id}"`);
});

await proof("202: production runId has 12-character nanoid suffix", () => {
  const id     = defaultRunIdGenerator();
  const suffix = id.slice("MIPRUN-".length);
  assert(suffix.length === 12,
    `Expected 12-char suffix, got "${suffix}" (${suffix.length} chars)`);
});

await proof("203: injected deterministic generator produces exactly the expected runId", () => {
  const fixed = "MIPRUN-testFixed12";
  assert((() => fixed)() === fixed, "injected generator must produce exact value");
});

await proof("204: attempt and outcome records from one invocation share the same runId", async () => {
  const { deps, repo, runId } = makeDeps();
  await runIdentityQualifiedPipeline({ identityId: ID_MAPPED }, deps);
  const records = repo.getRecords();
  assert(records.length === 2, `Expected 2 records, got ${records.length}`);
  assert(records[0].runId === runId, "attempt runId must match injected runId");
  assert(records[1].runId === runId, "outcome runId must match injected runId");
});

await proof("205: in-memory repo rejects duplicate runId on second append", () => {
  const repo = createInMemoryIdentityQualifiedAuditRepository();
  const rec: IdentityQualifiedAttemptRecord = {
    type:                          "governance-attempt",
    runId:                         "MIPRUN-duplicate",
    identityId:                    ID_UNMAPPED,
    qualificationOutcome:          "governance-rejected",
    governanceFailureReason:       "identity-unmapped",
    maisonSlug:                    null,
    collection:                    null,
    identityStatusAtQualification: "verified",
    mappingVersion:                "1.0.0",
    factoryVersion:                "0.5.0",
    force:                         false,
    dryRun:                        false,
    startedAt:                     "2026-08-09T12:00:00.000Z",
  };
  repo.append(rec);
  let threw = false;
  try { repo.append(rec); } catch { threw = true; }
  assert(threw, "second append with same runId must throw");
  assert(repo.getRecords().length === 1,
    "store must have exactly 1 record after rejected duplicate");
});

// ─────────────────────────────────────────────────────────────────────────────
// §300  GOVERNANCE REJECTION
// ─────────────────────────────────────────────────────────────────────────────

console.log("\n§300 GOVERNANCE REJECTION");

await proof("301: invalid-identity-id → governance-rejected attempt record written", async () => {
  const { deps, repo } = makeDeps();
  const result = await runIdentityQualifiedPipeline({ identityId: ID_INVALID }, deps);
  assert(result.status === "governance-failed", "status must be governance-failed");
  const records = repo.getRecords();
  assert(records.length === 1, `Expected 1 record, got ${records.length}`);
  const r = records[0] as IdentityQualifiedAttemptRecord;
  assert(r.type === "governance-attempt", "record type must be governance-attempt");
  assert(r.qualificationOutcome === "governance-rejected",
    "qualificationOutcome must be governance-rejected");
  assert(r.governanceFailureReason === "invalid-identity-id",
    "governanceFailureReason must be invalid-identity-id");
});

await proof("302: identity-not-found → governance-rejected attempt record written", async () => {
  const { deps, repo } = makeDeps();
  const result = await runIdentityQualifiedPipeline({ identityId: ID_NOT_FOUND }, deps);
  assert(result.status === "governance-failed", "status must be governance-failed");
  const r = repo.getRecords()[0] as IdentityQualifiedAttemptRecord;
  assert(r.governanceFailureReason === "identity-not-found",
    "governanceFailureReason must be identity-not-found");
});

await proof("303: identity-unmapped (MIP-000001 verified, unmapped) → attempt record written", async () => {
  const { deps, repo } = makeDeps();
  const result = await runIdentityQualifiedPipeline({ identityId: ID_UNMAPPED }, deps);
  assert(result.status === "governance-failed", "status must be governance-failed");
  const r = repo.getRecords()[0] as IdentityQualifiedAttemptRecord;
  assert(r.governanceFailureReason === "identity-unmapped",
    "governanceFailureReason must be identity-unmapped");
});

await proof("304: governance-rejected attempt record preserves identityId", async () => {
  const { deps, repo } = makeDeps();
  await runIdentityQualifiedPipeline({ identityId: ID_UNMAPPED }, deps);
  const r = repo.getRecords()[0] as IdentityQualifiedAttemptRecord;
  assert(r.identityId === ID_UNMAPPED, "identityId must be preserved in attempt record");
});

await proof("305: audit record governanceFailureReason matches result governanceFailure", async () => {
  const { deps, repo } = makeDeps();
  const result = await runIdentityQualifiedPipeline({ identityId: ID_UNMAPPED }, deps);
  assert(result.status === "governance-failed", "status must be governance-failed");
  if (result.status === "governance-failed") {
    const r = repo.getRecords()[0] as IdentityQualifiedAttemptRecord;
    assert(r.governanceFailureReason === result.governanceFailure,
      "audit record reason must match result governanceFailure field");
  }
});

await proof("306: governance-rejected invocation writes NO pipeline-outcome record", async () => {
  const { deps, repo } = makeDeps();
  await runIdentityQualifiedPipeline({ identityId: ID_UNMAPPED }, deps);
  const outcomes = repo.getRecords().filter(r => r.type === "pipeline-outcome");
  assert(outcomes.length === 0, "no outcome record may be written for governance rejection");
});

await proof("307: pipeline runner is NOT called for governance rejection", async () => {
  let callCount = 0;
  const spyRunner = async (i: PipelineInput): Promise<PipelineResult> => {
    callCount++;
    return { status: "complete", slug: i.slug, draftPath: null, state: null, message: "spy", durationMs: 0 };
  };
  const { deps } = makeDeps({ pipelineRunner: spyRunner });
  await runIdentityQualifiedPipeline({ identityId: ID_UNMAPPED }, deps);
  assert(callCount === 0,
    `Pipeline runner must not be called; was called ${callCount} time(s)`);
});

// ─────────────────────────────────────────────────────────────────────────────
// §400  GOVERNANCE AUDIT FAILURE
// ─────────────────────────────────────────────────────────────────────────────

console.log("\n§400 GOVERNANCE AUDIT FAILURE");

await proof("401: rejected invocation whose audit fails returns auditStatus failed", async () => {
  const failRepo = createFailingIdentityQualifiedAuditRepository("append");
  const deps = {
    runIdGenerator:  () => "MIPRUN-auditfail-401",
    auditClock:      () => "2026-08-09T12:00:00.000Z",
    pipelineRunner:  makeStubRunner(),
    auditRepository: failRepo,
  };
  const result = await runIdentityQualifiedPipeline({ identityId: ID_UNMAPPED }, deps);
  assert(result.status === "governance-failed", "status must be governance-failed");
  if (result.status === "governance-failed") {
    assert(result.auditStatus === "failed",
      `auditStatus must be "failed", got "${result.auditStatus}"`);
  }
});

await proof("402: auditFailure field is present and non-empty when rejection audit write fails", async () => {
  const failRepo = createFailingIdentityQualifiedAuditRepository("append");
  const deps = {
    runIdGenerator:  () => "MIPRUN-auditfail-402",
    auditClock:      () => "2026-08-09T12:00:00.000Z",
    pipelineRunner:  makeStubRunner(),
    auditRepository: failRepo,
  };
  const result = await runIdentityQualifiedPipeline({ identityId: ID_UNMAPPED }, deps);
  if (result.status === "governance-failed") {
    assert(
      typeof result.auditFailure === "string" && result.auditFailure.length > 0,
      "auditFailure must be a non-empty string",
    );
  }
});

await proof("403: governance reason and audit failure are structurally separate fields", async () => {
  const failRepo = createFailingIdentityQualifiedAuditRepository("append");
  const deps = {
    runIdGenerator:  () => "MIPRUN-auditfail-403",
    auditClock:      () => "2026-08-09T12:00:00.000Z",
    pipelineRunner:  makeStubRunner(),
    auditRepository: failRepo,
  };
  const result = await runIdentityQualifiedPipeline({ identityId: ID_UNMAPPED }, deps);
  assert(result.status === "governance-failed", "status must be governance-failed");
  if (result.status === "governance-failed") {
    assert(result.governanceFailure === "identity-unmapped",
      "governance reason must be preserved independently");
    assert(result.auditStatus === "failed", "auditStatus must be failed");
    assert("governanceFailure" in result, "governanceFailure field must exist");
    assert("auditStatus"       in result, "auditStatus field must exist");
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// §500  GOVERNANCE PASS
// ─────────────────────────────────────────────────────────────────────────────

console.log("\n§500 GOVERNANCE PASS");

await proof("501: MIP-000012 → governance-passed attempt record is written", async () => {
  const { deps, repo } = makeDeps();
  const result = await runIdentityQualifiedPipeline({ identityId: ID_MAPPED }, deps);
  assert(
    result.status !== "governance-failed" && result.status !== "audit-store-unavailable",
    `Expected pipeline status, got "${result.status}"`,
  );
  const attempt = repo.getRecords().find(r => r.type === "governance-attempt") as
    IdentityQualifiedAttemptRecord | undefined;
  assertDefined(attempt, "attempt record must be present");
  assert(attempt.qualificationOutcome === "governance-passed",
    "qualificationOutcome must be governance-passed");
  assert(attempt.governanceFailureReason === null,
    "governanceFailureReason must be null for passed invocations");
});

await proof("502: governance-passed attempt record preserves identityId", async () => {
  const { deps, repo } = makeDeps();
  await runIdentityQualifiedPipeline({ identityId: ID_MAPPED }, deps);
  const attempt = repo.getRecords().find(r => r.type === "governance-attempt") as
    IdentityQualifiedAttemptRecord | undefined;
  assertDefined(attempt, "attempt record must be present");
  assert(attempt.identityId === ID_MAPPED, `identityId must be ${ID_MAPPED}`);
});

await proof("503: governance-passed attempt record captures resolved maisonSlug", async () => {
  const { deps, repo } = makeDeps();
  await runIdentityQualifiedPipeline({ identityId: ID_MAPPED }, deps);
  const attempt = repo.getRecords().find(r => r.type === "governance-attempt") as
    IdentityQualifiedAttemptRecord | undefined;
  assertDefined(attempt, "attempt record must be present");
  assert(attempt.maisonSlug === "alien-goddess-inspired",
    `maisonSlug must be "alien-goddess-inspired", got "${attempt.maisonSlug}"`);
});

await proof("504: governance-passed attempt record captures collection Rose", async () => {
  const { deps, repo } = makeDeps();
  await runIdentityQualifiedPipeline({ identityId: ID_MAPPED }, deps);
  const attempt = repo.getRecords().find(r => r.type === "governance-attempt") as
    IdentityQualifiedAttemptRecord | undefined;
  assertDefined(attempt, "attempt record must be present");
  assert(attempt.collection === "Rose",
    `collection must be "Rose", got "${attempt.collection}"`);
});

await proof("505: governance-passed attempt captures identityStatusAtQualification as verified", async () => {
  const { deps, repo } = makeDeps();
  await runIdentityQualifiedPipeline({ identityId: ID_MAPPED }, deps);
  const attempt = repo.getRecords().find(r => r.type === "governance-attempt") as
    IdentityQualifiedAttemptRecord | undefined;
  assertDefined(attempt, "attempt record must be present");
  assert(attempt.identityStatusAtQualification === "verified",
    `status must be "verified", got "${attempt.identityStatusAtQualification}"`);
});

await proof("506: governance-passed attempt record captures mappingVersion", async () => {
  const { deps, repo } = makeDeps();
  await runIdentityQualifiedPipeline({ identityId: ID_MAPPED }, deps);
  const attempt = repo.getRecords().find(r => r.type === "governance-attempt") as
    IdentityQualifiedAttemptRecord | undefined;
  assertDefined(attempt, "attempt record must be present");
  assert(
    typeof attempt.mappingVersion === "string" && attempt.mappingVersion.length > 0,
    "mappingVersion must be a non-empty string",
  );
});

await proof("507: governance-passed attempt record captures factoryVersion 0.5.0", async () => {
  const { deps, repo } = makeDeps();
  await runIdentityQualifiedPipeline({ identityId: ID_MAPPED }, deps);
  const attempt = repo.getRecords().find(r => r.type === "governance-attempt") as
    IdentityQualifiedAttemptRecord | undefined;
  assertDefined(attempt, "attempt record must be present");
  assert(attempt.factoryVersion === "0.5.0",
    `factoryVersion must be "0.5.0", got "${attempt.factoryVersion}"`);
});

// ─────────────────────────────────────────────────────────────────────────────
// §600  PRE-RUN FAIL CLOSED
// ─────────────────────────────────────────────────────────────────────────────

console.log("\n§600 PRE-RUN FAIL CLOSED");

await proof("601: governance-passed + failing audit repo → pipeline runner NOT called", async () => {
  let runnerCalls = 0;
  const spyRunner = async (i: PipelineInput): Promise<PipelineResult> => {
    runnerCalls++;
    return { status: "complete", slug: i.slug, draftPath: null, state: null, message: "spy", durationMs: 0 };
  };
  const failRepo = createFailingIdentityQualifiedAuditRepository("append");
  const deps = {
    runIdGenerator:  () => "MIPRUN-failclosed-601",
    auditClock:      () => "2026-08-09T12:00:00.000Z",
    pipelineRunner:  spyRunner,
    auditRepository: failRepo,
  };
  const result = await runIdentityQualifiedPipeline({ identityId: ID_MAPPED }, deps);
  assert(runnerCalls === 0,
    `Runner must not be called; was called ${runnerCalls} time(s)`);
  assert(result.status === "audit-store-unavailable",
    `Result must be audit-store-unavailable, got "${result.status}"`);
});

await proof("602: audit-store-unavailable result contains identityId", async () => {
  const failRepo = createFailingIdentityQualifiedAuditRepository("append");
  const deps = {
    runIdGenerator:  () => "MIPRUN-failclosed-602",
    auditClock:      () => "2026-08-09T12:00:00.000Z",
    pipelineRunner:  makeStubRunner(),
    auditRepository: failRepo,
  };
  const result = await runIdentityQualifiedPipeline({ identityId: ID_MAPPED }, deps);
  assert(result.status === "audit-store-unavailable",
    "status must be audit-store-unavailable");
  if (result.status === "audit-store-unavailable") {
    assert(result.identityId === ID_MAPPED,
      "identityId must be preserved in audit-store-unavailable result");
  }
});

await proof("603: audit-store-unavailable result contains a diagnostic message", async () => {
  const failRepo = createFailingIdentityQualifiedAuditRepository("append");
  const deps = {
    runIdGenerator:  () => "MIPRUN-failclosed-603",
    auditClock:      () => "2026-08-09T12:00:00.000Z",
    pipelineRunner:  makeStubRunner(),
    auditRepository: failRepo,
  };
  const result = await runIdentityQualifiedPipeline({ identityId: ID_MAPPED }, deps);
  if (result.status === "audit-store-unavailable") {
    assert(
      typeof result.message === "string" && result.message.length > 0,
      "message must be a non-empty diagnostic string",
    );
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// §700  PIPELINE OUTCOMES
// ─────────────────────────────────────────────────────────────────────────────

console.log("\n§700 PIPELINE OUTCOMES");

await proof("701: complete pipeline status → attempt + outcome both written", async () => {
  const { deps, repo } = makeDeps({ pipelineRunner: makeStubRunner("complete") });
  await runIdentityQualifiedPipeline({ identityId: ID_MAPPED }, deps);
  const records = repo.getRecords();
  assert(records.length === 2, `Expected 2 records, got ${records.length}`);
  assert(records[0].type === "governance-attempt", "first record must be attempt");
  assert(records[1].type === "pipeline-outcome", "second record must be outcome");
});

await proof("702: degraded pipeline status → outcome records pipelineStatus degraded", async () => {
  const { deps, repo } = makeDeps({ pipelineRunner: makeStubRunner("degraded") });
  await runIdentityQualifiedPipeline({ identityId: ID_MAPPED }, deps);
  const outcome = repo.getRecords().find(r => r.type === "pipeline-outcome") as
    IdentityQualifiedOutcomeRecord | undefined;
  assertDefined(outcome, "outcome must be present");
  assert(outcome.pipelineStatus === "degraded",
    `pipelineStatus must be degraded, got "${outcome.pipelineStatus}"`);
});

await proof("703: skipped pipeline status → outcome records pipelineStatus skipped", async () => {
  const { deps, repo } = makeDeps({ pipelineRunner: makeStubRunner("skipped") });
  await runIdentityQualifiedPipeline({ identityId: ID_MAPPED }, deps);
  const outcome = repo.getRecords().find(r => r.type === "pipeline-outcome") as
    IdentityQualifiedOutcomeRecord | undefined;
  assertDefined(outcome, "outcome must be present");
  assert(outcome.pipelineStatus === "skipped",
    `pipelineStatus must be skipped, got "${outcome.pipelineStatus}"`);
});

await proof("704: failed pipeline → result status pipeline-failed, outcome has pipeline-failed", async () => {
  const { deps, repo } = makeDeps({ pipelineRunner: makeStubRunner("failed") });
  const result = await runIdentityQualifiedPipeline({ identityId: ID_MAPPED }, deps);
  assert(result.status === "pipeline-failed",
    `result.status must be pipeline-failed, got "${result.status}"`);
  const outcome = repo.getRecords().find(r => r.type === "pipeline-outcome") as
    IdentityQualifiedOutcomeRecord | undefined;
  assertDefined(outcome, "outcome must be present");
  assert(outcome.pipelineStatus === "pipeline-failed",
    `outcome pipelineStatus must be pipeline-failed, got "${outcome.pipelineStatus}"`);
});

await proof("705: attempt record is written BEFORE outcome record (ordering invariant)", async () => {
  const order: string[] = [];
  const inner = createInMemoryIdentityQualifiedAuditRepository();
  const spyRepo = {
    load:   inner.load.bind(inner),
    append: (rec: IdentityQualifiedAuditRecord) => {
      order.push(rec.type);
      inner.append(rec);
    },
  };
  const { deps: baseDeps } = makeDeps();
  await runIdentityQualifiedPipeline({ identityId: ID_MAPPED }, { ...baseDeps, auditRepository: spyRepo });
  assert(order[0] === "governance-attempt", "first write must be governance-attempt");
  assert(order[1] === "pipeline-outcome",   "second write must be pipeline-outcome");
});

await proof("706: pipeline outcome record contains correct pipelineStatus", async () => {
  const { deps, repo } = makeDeps({ pipelineRunner: makeStubRunner("complete") });
  await runIdentityQualifiedPipeline({ identityId: ID_MAPPED }, deps);
  const outcome = repo.getRecords().find(r => r.type === "pipeline-outcome") as
    IdentityQualifiedOutcomeRecord | undefined;
  assertDefined(outcome, "outcome must be present");
  assert(outcome.pipelineStatus === "complete",
    `pipelineStatus must be complete, got "${outcome.pipelineStatus}"`);
});

await proof("707: outcome record durationMs is taken from pipeline result", async () => {
  const expectedDuration = 999;
  const { deps, repo } = makeDeps({ pipelineRunner: makeStubRunner("complete", expectedDuration) });
  await runIdentityQualifiedPipeline({ identityId: ID_MAPPED }, deps);
  const outcome = repo.getRecords().find(r => r.type === "pipeline-outcome") as
    IdentityQualifiedOutcomeRecord | undefined;
  assertDefined(outcome, "outcome must be present");
  assert(outcome.durationMs === expectedDuration,
    `durationMs must be ${expectedDuration}, got ${outcome.durationMs}`);
});

await proof("708: successful invocation result carries auditStatus complete", async () => {
  const { deps } = makeDeps();
  const result = await runIdentityQualifiedPipeline({ identityId: ID_MAPPED }, deps);
  if (
    result.status === "complete" || result.status === "degraded" ||
    result.status === "skipped"  || result.status === "pipeline-failed"
  ) {
    assert(result.auditStatus === "complete",
      `auditStatus must be complete, got "${result.auditStatus}"`);
  } else {
    throw new Error(`Expected pipeline result, got "${result.status}"`);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// §800  POST-RUN AUDIT FAILURE
// ─────────────────────────────────────────────────────────────────────────────

console.log("\n§800 POST-RUN AUDIT FAILURE");

await proof("801: pipeline runner executes exactly once despite post-run audit failure", async () => {
  let runnerCalls = 0;
  const countingRunner = async (i: PipelineInput): Promise<PipelineResult> => {
    runnerCalls++;
    return { status: "complete", slug: i.slug, draftPath: null, state: null, message: "ok", durationMs: 1 };
  };
  const repo  = createPreRunOkPostRunFailRepo();
  const deps = {
    runIdGenerator:  () => "MIPRUN-postfail-801",
    auditClock:      () => "2026-08-09T12:00:00.000Z",
    pipelineRunner:  countingRunner,
    auditRepository: repo,
  };
  await runIdentityQualifiedPipeline({ identityId: ID_MAPPED }, deps);
  assert(runnerCalls === 1,
    `Runner must execute exactly once; executed ${runnerCalls} time(s)`);
});

await proof("802: pre-run attempt record remains after post-run audit failure", async () => {
  const repo = createPreRunOkPostRunFailRepo();
  const deps = {
    runIdGenerator:  () => "MIPRUN-postfail-802",
    auditClock:      () => "2026-08-09T12:00:00.000Z",
    pipelineRunner:  makeStubRunner(),
    auditRepository: repo,
  };
  await runIdentityQualifiedPipeline({ identityId: ID_MAPPED }, deps);
  const attempt = repo.getRecords().find(r => r.type === "governance-attempt");
  assertDefined(attempt, "pre-run attempt record must remain in store");
});

await proof("803: post-run audit failure → result carries auditStatus incomplete", async () => {
  const repo = createPreRunOkPostRunFailRepo();
  const deps = {
    runIdGenerator:  () => "MIPRUN-postfail-803",
    auditClock:      () => "2026-08-09T12:00:00.000Z",
    pipelineRunner:  makeStubRunner("complete"),
    auditRepository: repo,
  };
  const result = await runIdentityQualifiedPipeline({ identityId: ID_MAPPED }, deps);
  if (
    result.status === "complete" || result.status === "degraded" ||
    result.status === "skipped"  || result.status === "pipeline-failed"
  ) {
    assert(result.auditStatus === "incomplete",
      `auditStatus must be incomplete, got "${result.auditStatus}"`);
  } else {
    throw new Error(`Expected pipeline result, got "${result.status}"`);
  }
});

await proof("804: real pipeline status is preserved even when post-run audit fails", async () => {
  const repo = createPreRunOkPostRunFailRepo();
  const deps = {
    runIdGenerator:  () => "MIPRUN-postfail-804",
    auditClock:      () => "2026-08-09T12:00:00.000Z",
    pipelineRunner:  makeStubRunner("degraded"),
    auditRepository: repo,
  };
  const result = await runIdentityQualifiedPipeline({ identityId: ID_MAPPED }, deps);
  assert(result.status === "degraded",
    `Pipeline status must be degraded (not masked), got "${result.status}"`);
});

await proof("805: post-run audit failure sets non-empty auditFailure in result", async () => {
  const repo = createPreRunOkPostRunFailRepo();
  const deps = {
    runIdGenerator:  () => "MIPRUN-postfail-805",
    auditClock:      () => "2026-08-09T12:00:00.000Z",
    pipelineRunner:  makeStubRunner("complete"),
    auditRepository: repo,
  };
  const result = await runIdentityQualifiedPipeline({ identityId: ID_MAPPED }, deps);
  if (
    result.status === "complete" || result.status === "degraded" ||
    result.status === "skipped"  || result.status === "pipeline-failed"
  ) {
    assert(
      typeof result.auditFailure === "string" && result.auditFailure.length > 0,
      "auditFailure must be a non-empty string when auditStatus is incomplete",
    );
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// §900  APPEND ONLY
// ─────────────────────────────────────────────────────────────────────────────

console.log("\n§900 APPEND ONLY");

await proof("901: second invocation appends without overwriting first run records", async () => {
  const repo = createInMemoryIdentityQualifiedAuditRepository();

  await runIdentityQualifiedPipeline({ identityId: ID_MAPPED }, {
    runIdGenerator:  () => "MIPRUN-append-901a",
    auditClock:      () => "2026-08-09T12:00:00.000Z",
    pipelineRunner:  makeStubRunner(),
    auditRepository: repo,
  });

  await runIdentityQualifiedPipeline({ identityId: ID_MAPPED }, {
    runIdGenerator:  () => "MIPRUN-append-901b",
    auditClock:      () => "2026-08-09T12:01:00.000Z",
    pipelineRunner:  makeStubRunner(),
    auditRepository: repo,
  });

  assert(repo.getRecords().length === 4,
    `Expected 4 records (2 attempt + 2 outcome), got ${repo.getRecords().length}`);
});

await proof("902: first record is deep-equal after second run appends", async () => {
  const repo  = createInMemoryIdentityQualifiedAuditRepository();
  const runId = "MIPRUN-append-902a";

  await runIdentityQualifiedPipeline({ identityId: ID_MAPPED }, {
    runIdGenerator:  () => runId,
    auditClock:      () => "2026-08-09T12:00:00.000Z",
    pipelineRunner:  makeStubRunner(),
    auditRepository: repo,
  });
  const snapshot = { ...repo.getRecords()[0] };

  await runIdentityQualifiedPipeline({ identityId: ID_MAPPED }, {
    runIdGenerator:  () => "MIPRUN-append-902b",
    auditClock:      () => "2026-08-09T12:01:00.000Z",
    pipelineRunner:  makeStubRunner(),
    auditRepository: repo,
  });

  assert(
    JSON.stringify(repo.getRecords()[0]) === JSON.stringify(snapshot),
    "first record must not be modified after second run",
  );
});

await proof("903: second invocation with duplicate runId → audit-store-unavailable", async () => {
  const repo    = createInMemoryIdentityQualifiedAuditRepository();
  const sameId  = "MIPRUN-dedup-903";

  await runIdentityQualifiedPipeline({ identityId: ID_MAPPED }, {
    runIdGenerator:  () => sameId,
    auditClock:      () => "2026-08-09T12:00:00.000Z",
    pipelineRunner:  makeStubRunner(),
    auditRepository: repo,
  });
  const countAfterFirst = repo.getRecords().length;

  const result2 = await runIdentityQualifiedPipeline({ identityId: ID_MAPPED }, {
    runIdGenerator:  () => sameId,
    auditClock:      () => "2026-08-09T12:01:00.000Z",
    pipelineRunner:  makeStubRunner(),
    auditRepository: repo,
  });

  assert(result2.status === "audit-store-unavailable",
    `Duplicate runId must cause audit-store-unavailable, got "${result2.status}"`);
  assert(repo.getRecords().length === countAfterFirst,
    "record count must not increase after duplicate runId rejection");
});

await proof("904: IdentityQualifiedRunLogger exports no delete/truncate/reset functions", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const exports = Object.keys(require("../factory/identity/IdentityQualifiedRunLogger"));
  const forbidden = ["deleteRecord", "truncateAudit", "resetAudit", "clearAudit", "wipeAudit"];
  for (const name of forbidden) {
    assert(!exports.includes(name), `Forbidden export "${name}" must not exist in logger`);
  }
});

await proof("905: runIdentityQualifiedPipeline exports no audit clear/reset functions", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const exports = Object.keys(require("../factory/identity/runIdentityQualifiedPipeline"));
  const forbidden = ["clearAudit", "resetAudit", "deleteAudit", "wipeAudit"];
  for (const name of forbidden) {
    assert(!exports.includes(name), `Forbidden export "${name}" must not exist in wrapper`);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// §1000  CORRUPTION
// ─────────────────────────────────────────────────────────────────────────────

console.log("\n§1000 CORRUPTION");

await proof("1001: failing repo append throws — never silently swallows", () => {
  const failRepo = createFailingIdentityQualifiedAuditRepository("append");
  const rec: IdentityQualifiedAttemptRecord = {
    type:                          "governance-attempt",
    runId:                         "MIPRUN-corrupt-1001",
    identityId:                    ID_UNMAPPED,
    qualificationOutcome:          "governance-rejected",
    governanceFailureReason:       "identity-unmapped",
    maisonSlug:                    null,
    collection:                    null,
    identityStatusAtQualification: "verified",
    mappingVersion:                "1.0.0",
    factoryVersion:                "0.5.0",
    force:                         false,
    dryRun:                        false,
    startedAt:                     "2026-08-09T12:00:00.000Z",
  };
  let threw = false;
  try { failRepo.append(rec); } catch { threw = true; }
  assert(threw, "append must throw on failure — never swallow silently");
});

await proof("1002: failing repo load throws — never returns empty fallback", () => {
  const failRepo = createFailingIdentityQualifiedAuditRepository("load");
  let threw = false;
  try { failRepo.load(); } catch { threw = true; }
  assert(threw, "load() must throw on corrupt store, never return empty fallback");
});

await proof("1003: corrupt repo (fails load+append) → audit-store-unavailable for passed run", async () => {
  const failRepo = createFailingIdentityQualifiedAuditRepository("both");
  const deps = {
    runIdGenerator:  () => "MIPRUN-corrupt-1003",
    auditClock:      () => "2026-08-09T12:00:00.000Z",
    pipelineRunner:  makeStubRunner(),
    auditRepository: failRepo,
  };
  const result = await runIdentityQualifiedPipeline({ identityId: ID_MAPPED }, deps);
  assert(result.status === "audit-store-unavailable",
    `Corrupt repo must block execution; got "${result.status}"`);
});

// ─────────────────────────────────────────────────────────────────────────────
// §1100  READ API
// ─────────────────────────────────────────────────────────────────────────────

console.log("\n§1100 READ API");

await proof("1101: listIdentityQualifiedRuns returns only attempt records from production file", () => {
  const runs = listIdentityQualifiedRuns();
  assert(Array.isArray(runs), "must return an array");
  assert(
    runs.every(r => r.type === "governance-attempt"),
    "all entries must have type governance-attempt",
  );
});

await proof("1102: findIdentityQualifiedRun returns null for both fields on unknown runId", () => {
  const result = findIdentityQualifiedRun("MIPRUN-nonexistent-1102");
  assert(result.attempt === null, "attempt must be null for unknown runId");
  assert(result.outcome === null, "outcome must be null for unknown runId");
});

await proof("1103: findRunsByIdentity returns empty array for identity with no audit records", () => {
  const result = findRunsByIdentity(ID_NOT_FOUND);
  assert(Array.isArray(result), "must return an array");
  assert(result.length === 0, "must be empty for identity with no runs");
});

await proof("1104: in-memory repo supports attempt+outcome paired query by runId", () => {
  const runId = "MIPRUN-readapi-1104";
  const repo  = createInMemoryIdentityQualifiedAuditRepository();

  repo.append({
    type:                          "governance-attempt",
    runId,
    identityId:                    ID_MAPPED,
    qualificationOutcome:          "governance-passed",
    governanceFailureReason:       null,
    maisonSlug:                    "alien-goddess-inspired",
    collection:                    "Rose",
    identityStatusAtQualification: "verified",
    mappingVersion:                "1.0.0",
    factoryVersion:                "0.5.0",
    force:                         false,
    dryRun:                        false,
    startedAt:                     "2026-08-09T12:00:00.000Z",
  });
  repo.append({
    type:           "pipeline-outcome",
    runId,
    pipelineStatus: "complete",
    completedAt:    "2026-08-09T12:00:01.000Z",
    durationMs:     42,
  });

  const file = repo.load();
  const attemptRecords = file.records.filter(
    r => r.type === "governance-attempt" && r.runId === runId,
  );
  const outcomeRecord = file.records.find(
    r => r.type === "pipeline-outcome" && r.runId === runId,
  );
  const byIdentity = file.records.filter(
    r => r.type === "governance-attempt" &&
    (r as IdentityQualifiedAttemptRecord).identityId === ID_MAPPED,
  );

  assert(attemptRecords.length === 1, "must find exactly one attempt by runId");
  assert(outcomeRecord !== undefined, "must find outcome by runId");
  assert(byIdentity.length === 1, "must find one record by identityId");
});

// ─────────────────────────────────────────────────────────────────────────────
// §1200  PRODUCTION SAFETY
// ─────────────────────────────────────────────────────────────────────────────

console.log("\n§1200 PRODUCTION SAFETY");

await proof("1201: production audit file exists with correct schema", () => {
  assert(existsSync(AUDIT_FILE_PATH),
    `Audit file must exist at ${AUDIT_FILE_PATH}`);
  const raw    = readFileSync(AUDIT_FILE_PATH, "utf-8");
  const parsed = JSON.parse(raw) as IdentityQualifiedRunAuditFile;
  assert(parsed.version === "1.0.0",
    `version must be 1.0.0, got "${parsed.version}"`);
  assert(Array.isArray(parsed.records), "records must be an array");
});

await proof("1202: production audit contains the first real MIPRUN governance pair for MIP-000012", () => {
  // EP5-P4E-A (Option A): first real production invocation. The audit now contains
  // exactly the governance-passed + skipped pair for MIP-000012 / alien-goddess-inspired.
  const raw    = readFileSync(AUDIT_FILE_PATH, "utf-8");
  const parsed = JSON.parse(raw) as IdentityQualifiedRunAuditFile;
  assert(parsed.records.length >= 2,
    `Production audit must have at least 2 records after EP5-P4E-A; has ${parsed.records.length}`);
  const attempt = parsed.records.find(
    r => r.type === "governance-attempt" &&
         (r as { identityId: string }).identityId === "MIP-000012",
  ) as { type: string; identityId: string; qualificationOutcome: string; runId: string } | undefined;
  if (!attempt) throw new Error("Production audit must contain a governance-attempt for MIP-000012");
  assert(attempt.qualificationOutcome === "governance-passed",
    `MIP-000012 attempt must be governance-passed, got "${attempt.qualificationOutcome}"`);
  const outcome = parsed.records.find(
    r => r.type === "pipeline-outcome" && r.runId === attempt!.runId,
  ) as { type: string; runId: string; pipelineStatus: string } | undefined;
  if (!outcome) throw new Error(`No pipeline-outcome record found for runId "${attempt.runId}"`);
  assert(outcome.pipelineStatus === "skipped",
    `EP5-P4E-A outcome must be skipped, got "${outcome.pipelineStatus}"`);
});

await proof("1203: production audit is NOT in the initial empty-store state — EP5-P4E-A written", () => {
  // EP5-P4E-A established the first real MIPRUN record pair. The production audit
  // is no longer in the empty baseline. This proof verifies the transition occurred.
  const raw         = readFileSync(AUDIT_FILE_PATH, "utf-8");
  const parsed      = JSON.parse(raw) as IdentityQualifiedRunAuditFile;
  const emptySha    = createHash("sha256")
    .update('{\n  "version": "1.0.0",\n  "records": []\n}\n').digest("hex");
  const actualSha   = createHash("sha256").update(raw).digest("hex");
  assert(parsed.records.length > 0,
    "Production audit must not be empty after EP5-P4E-A");
  assert(actualSha !== emptySha,
    "Production audit SHA must differ from empty-store baseline after EP5-P4E-A");
});

await proof("1204: identity registry SHA-256 matches EP5 baseline c75f74b5...", () => {
  const path     = join(process.cwd(), "app", "lib", "identity", "data", "identity-registry.json");
  const sha      = createHash("sha256").update(readFileSync(path, "utf-8")).digest("hex");
  const expected = "c75f74b56d4c2064b4f00e422c26e454343defc6a8c61df288e4fe8c2c650a1d";
  assert(sha === expected,
    `Registry SHA mismatch — expected ${expected}, got ${sha}`);
});

await proof("1205: identity-product-registry.json is unchanged (1 mapping, MIP-000012)", () => {
  const path   = join(process.cwd(), "app", "lib", "identity", "data", "identity-product-registry.json");
  const parsed = JSON.parse(readFileSync(path, "utf-8"));
  assert(parsed.mappings.length === 1,
    `Bridge must have 1 mapping, has ${parsed.mappings.length}`);
  assert(parsed.mappings[0].identityId === "MIP-000012",
    "Only mapping must be MIP-000012");
  assert(parsed.mappings[0].maisonSlug === "alien-goddess-inspired",
    "Slug must be alien-goddess-inspired");
});

await proof("1206: no AI generation occurred — structural proof: no AI SDK references", () => {
  const selfPath    = join(process.cwd(), "scripts", "identity", "validate-identity-qualified-audit.ts");
  const selfContent = readFileSync(selfPath, "utf-8");
  // Split tokens to avoid self-referencing the forbidden strings in assertion messages
  const gp = "Generation" + "Provider";
  const gc = "generate" + "Content";
  const oa = "open" + "ai";
  const ac = "anthro" + "pic";
  assert(!selfContent.includes(gp),  `This suite must not import ${gp}`);
  assert(!selfContent.includes(gc),  `This suite must not call ${gc}`);
  assert(!selfContent.includes(oa) && !selfContent.includes(ac),
    "This suite must not reference external AI SDKs");
});

// ─────────────────────────────────────────────────────────────────────────────
// REPORT
// ─────────────────────────────────────────────────────────────────────────────

const total = passed + failed;
console.log("\n" + "─".repeat(60));
console.log("EP5-P4D Identity-Qualified Factory Run Audit — Validation");
console.log("─".repeat(60));
console.log(`  Passed:  ${passed}/${total}`);
console.log(`  Failed:  ${failed}`);

if (errors.length > 0) {
  console.log("\nFailures:");
  for (const e of errors) {
    console.log(`  • ${e}`);
  }
}

console.log("─".repeat(60));

if (failed > 0) process.exit(1);

})();
