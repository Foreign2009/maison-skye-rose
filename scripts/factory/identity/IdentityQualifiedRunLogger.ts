/**
 * Knowledge Factory × Maison Identity Platform
 * Identity-Qualified Factory Run Audit — Logger
 *
 * EP5-P4D — Establish Identity-Qualified Factory Run Audit
 *
 * Constitutional anchor:
 *   GOVERNANCE MUST BE AUDITABLE AFTER EXECUTION.
 *   IDENTITY PRECEDES KNOWLEDGE. AUDIT PRECEDES PIPELINE.
 *
 * Owns: audit record types, file schema, injectable repository interface,
 *       production and in-memory implementations, read API.
 *
 * Domain: FACTORY OPERATIONAL PROVENANCE with identity context.
 * Not:    MIP identity truth, bridge truth, MKC knowledge, editorial evidence.
 *
 * Two-record event model per governed invocation:
 *   IdentityQualifiedAttemptRecord  — written after governance resolves (before run())
 *   IdentityQualifiedOutcomeRecord  — appended after run() completes
 *
 * An invocation that fails governance produces only an attempt record.
 * A successful invocation that completes produces an attempt + outcome record.
 * Both records share the same runId.
 *
 * Fail-closed: the production implementation uses atomic write (write .tmp → renameSync).
 * Corruption: a malformed audit file is NEVER reset to empty. Corrupt → throws.
 * Duplicate: duplicate runId → throws.
 *
 * Tests use createInMemoryIdentityQualifiedAuditRepository() exclusively.
 * Tests NEVER touch the production identity-qualified-run-audit.json file.
 */

import { existsSync, readFileSync, writeFileSync, renameSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { nanoid } from "nanoid";
import { FACTORY_VERSION } from "../version";
import type { IdentityId } from "../../../app/lib/identity/types";

// ── Schema version ──────────────────────────────────────────────────────────────

export const IDENTITY_QUALIFIED_AUDIT_VERSION = "1.0.0";

// ── Audit file paths ────────────────────────────────────────────────────────────

export const AUDIT_FILE_PATH = join(
  process.cwd(),
  "scripts", "factory", "identity", "identity-qualified-run-audit.json",
);

const AUDIT_TMP_PATH = AUDIT_FILE_PATH + ".tmp";

// ── Governance failure reasons (mirrored from runIdentityQualifiedPipeline)
//    Defined here to avoid circular imports. Must remain in sync.

type GovernanceFailureReason =
  | "invalid-identity-id"
  | "identity-not-found"
  | "identity-not-eligible"
  | "identity-unmapped"
  | "multiple-product-mappings"
  | "invalid-product-selection"
  | "mapped-product-not-found"
  | "category-mismatch";

// ── Audit record types ──────────────────────────────────────────────────────────

/**
 * Written immediately after governance resolution (before pipeline runs).
 * For governance-passed invocations, this record MUST be durably stored
 * before run() is invoked — fail closed.
 */
export type IdentityQualifiedAttemptRecord = {
  readonly type:                          "governance-attempt";
  readonly runId:                         string;
  readonly identityId:                    IdentityId;
  readonly qualificationOutcome:          "governance-passed" | "governance-rejected";
  readonly governanceFailureReason:       GovernanceFailureReason | null;
  readonly maisonSlug:                    string | null;
  readonly collection:                    "Skye" | "Rose" | "Elite" | null;
  readonly identityStatusAtQualification: string;
  readonly mappingVersion:                string | null;
  readonly factoryVersion:                string;
  readonly force:                         boolean;
  readonly dryRun:                        boolean;
  readonly startedAt:                     string;
};

/**
 * Written after pipeline execution completes (pass or fail).
 * Links to the attempt record via runId.
 */
export type IdentityQualifiedOutcomeRecord = {
  readonly type:           "pipeline-outcome";
  readonly runId:          string;
  readonly pipelineStatus: "complete" | "degraded" | "skipped" | "pipeline-failed";
  readonly completedAt:    string;
  readonly durationMs:     number;
};

export type IdentityQualifiedAuditRecord =
  | IdentityQualifiedAttemptRecord
  | IdentityQualifiedOutcomeRecord;

export type IdentityQualifiedRunAuditFile = {
  readonly version: string;
  readonly records: readonly IdentityQualifiedAuditRecord[];
};

// ── Repository interface ────────────────────────────────────────────────────────

/**
 * Injectable persistence abstraction.
 *
 * Production: reads/writes identity-qualified-run-audit.json atomically.
 * Tests:      in-memory implementation — never touches the production file.
 *
 * append() throws on:
 *   - Duplicate runId
 *   - Corrupt or malformed store (production: malformed JSON)
 *   - I/O failure (production)
 */
export interface IdentityQualifiedAuditRepository {
  load():   IdentityQualifiedRunAuditFile;
  append(record: IdentityQualifiedAuditRecord): void;
}

// ── Injectable types ────────────────────────────────────────────────────────────

export type RunIdGenerator = () => string;
export type AuditClock     = () => string;

// ── Production repository ───────────────────────────────────────────────────────

export function createProductionIdentityQualifiedAuditRepository(): IdentityQualifiedAuditRepository {

  function load(): IdentityQualifiedRunAuditFile {
    if (!existsSync(AUDIT_FILE_PATH)) {
      return { version: IDENTITY_QUALIFIED_AUDIT_VERSION, records: [] };
    }
    const raw = readFileSync(AUDIT_FILE_PATH, "utf-8");
    // If JSON is malformed, throw — NEVER reset to empty. History must not be destroyed.
    return JSON.parse(raw) as IdentityQualifiedRunAuditFile;
  }

  function append(record: IdentityQualifiedAuditRecord): void {
    const file = load();

    // Reject same-type duplicates: two attempt records or two outcome records for the same runId.
    // A governance-attempt + pipeline-outcome with the same runId is the intended two-record model.
    if (file.records.some(r => r.runId === record.runId && r.type === record.type)) {
      throw new Error(
        `[mip:audit] Duplicate ${record.type} record for runId "${record.runId}" — ` +
        `a ${record.type} with this runId already exists.`,
      );
    }

    const updated: IdentityQualifiedRunAuditFile = {
      version: file.version,
      records: [...file.records, record],
    };

    const json = JSON.stringify(updated, null, 2) + "\n";
    const dir  = dirname(AUDIT_FILE_PATH);

    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

    // Atomic write: write to .tmp then rename to final path.
    // renameSync is atomic within the same filesystem — the file is never
    // in a partially-written state from the perspective of a reader.
    writeFileSync(AUDIT_TMP_PATH, json, "utf-8");
    renameSync(AUDIT_TMP_PATH, AUDIT_FILE_PATH);
  }

  return { load, append };
}

// ── In-memory repository (tests only) ──────────────────────────────────────────

export function createInMemoryIdentityQualifiedAuditRepository(
  initial?: IdentityQualifiedAuditRecord[],
): IdentityQualifiedAuditRepository & { getRecords(): readonly IdentityQualifiedAuditRecord[] } {

  const records: IdentityQualifiedAuditRecord[] = [...(initial ?? [])];

  function load(): IdentityQualifiedRunAuditFile {
    return { version: IDENTITY_QUALIFIED_AUDIT_VERSION, records: [...records] };
  }

  function append(record: IdentityQualifiedAuditRecord): void {
    if (records.some(r => r.runId === record.runId && r.type === record.type)) {
      throw new Error(
        `[mip:audit] Duplicate ${record.type} record for runId "${record.runId}" — ` +
        `a ${record.type} with this runId already exists.`,
      );
    }
    records.push(record);
  }

  function getRecords(): readonly IdentityQualifiedAuditRecord[] {
    return [...records];
  }

  return { load, append, getRecords };
}

// ── Failing repository (corruption / error simulation for tests) ────────────────

export function createFailingIdentityQualifiedAuditRepository(
  failOn: "load" | "append" | "both",
): IdentityQualifiedAuditRepository {

  function load(): IdentityQualifiedRunAuditFile {
    if (failOn === "load" || failOn === "both") {
      throw new Error("[mip:audit:test] Simulated audit load failure");
    }
    return { version: IDENTITY_QUALIFIED_AUDIT_VERSION, records: [] };
  }

  function append(_record: IdentityQualifiedAuditRecord): void {
    if (failOn === "append" || failOn === "both") {
      throw new Error("[mip:audit:test] Simulated audit append failure");
    }
  }

  return { load, append };
}

// ── Default production injectable generators ────────────────────────────────────

export const defaultRunIdGenerator: RunIdGenerator = () => `MIPRUN-${nanoid(12)}`;
export const defaultAuditClock:     AuditClock     = () => new Date().toISOString();

// ── Read API (production — reads the canonical file) ───────────────────────────

export function loadIdentityQualifiedRunAudit(): IdentityQualifiedRunAuditFile {
  return createProductionIdentityQualifiedAuditRepository().load();
}

export function listIdentityQualifiedRuns(): IdentityQualifiedAttemptRecord[] {
  const file = loadIdentityQualifiedRunAudit();
  return file.records.filter(
    (r): r is IdentityQualifiedAttemptRecord => r.type === "governance-attempt",
  );
}

export function findIdentityQualifiedRun(runId: string): {
  attempt: IdentityQualifiedAttemptRecord | null;
  outcome: IdentityQualifiedOutcomeRecord | null;
} {
  const file = loadIdentityQualifiedRunAudit();
  const attempt = file.records.find(
    (r): r is IdentityQualifiedAttemptRecord =>
      r.type === "governance-attempt" && r.runId === runId,
  ) ?? null;
  const outcome = file.records.find(
    (r): r is IdentityQualifiedOutcomeRecord =>
      r.type === "pipeline-outcome" && r.runId === runId,
  ) ?? null;
  return { attempt, outcome };
}

export function findRunsByIdentity(identityId: IdentityId): IdentityQualifiedAttemptRecord[] {
  const file = loadIdentityQualifiedRunAudit();
  return file.records.filter(
    (r): r is IdentityQualifiedAttemptRecord =>
      r.type === "governance-attempt" && r.identityId === identityId,
  );
}

// Re-export FACTORY_VERSION for callers that need audit + version from one import
export { FACTORY_VERSION };
