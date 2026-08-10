/**
 * Maison Identity Platform — Relationship Decision Ledger Persistence (EP6-P5C)
 *
 * SERVER-ONLY MODULE.
 * Typed loader and atomic writer for the relationship decision ledger JSON store.
 *
 * Ledger file:
 *   app/lib/identity/data/decisions/catalogue-relationship-decision-ledger.json
 *
 * The queue artifact is read-only — never written by this module.
 * All decision mutations must go through saveRelationshipDecisionLedger().
 *
 * Atomic write sequence (mirrors saveIdentityRegistry from persistence.ts):
 *   1. Validate data structure before any I/O.
 *   2. Serialise to JSON and write to a .tmp file.
 *   3. Read the .tmp file back and verify the round-trip is correct.
 *   4. Copy the existing ledger to .bak (rollback-safe).
 *   5. Rename .tmp → ledger (atomic on same-filesystem NTFS/ext4).
 */

import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  unlinkSync,
  writeFileSync,
} from "fs";
import { dirname, join } from "path";

import type {
  RelationshipDecisionLedger,
  RelationshipQueueRepository,
  RelationshipLedgerRepository,
} from "./types";
import type { RelationshipReviewQueueData } from "./types";

// ── Paths ──────────────────────────────────────────────────────────────────────

const ROOT = process.cwd();

const QUEUE_PATH = join(
  ROOT,
  "app/lib/identity/data/reviews/catalogue-relationship-review-queue.json",
);

const LEDGER_PATH = join(
  ROOT,
  "app/lib/identity/data/decisions/catalogue-relationship-decision-ledger.json",
);

// ── Known constants ────────────────────────────────────────────────────────────

const EXPECTED_QUEUE_SCHEMA_VERSION  = "EP6-P5BR-v1" as const;
const EXPECTED_LEDGER_SCHEMA_VERSION = "EP6-P5C-v1"  as const;
const POST_P5A_FINGERPRINT = "478fd478d930137fe21d058470797c324649156d615b60d3b9d3a9108f73b8e2";

// ── Queue loader (read-only) ───────────────────────────────────────────────────

/**
 * Loads the immutable relationship review queue artifact.
 * Validates schema version. Throws on any structural error.
 * Never writes to the queue.
 */
export function loadRelationshipQueue(): RelationshipReviewQueueData {
  const raw = readFileSync(QUEUE_PATH, "utf-8");
  const parsed = JSON.parse(raw) as { schemaVersion?: unknown; units?: unknown; graphFingerprint?: unknown };

  if (parsed.schemaVersion !== EXPECTED_QUEUE_SCHEMA_VERSION) {
    throw new Error(
      `catalogue-relationship-review-queue.json: schemaVersion "${String(parsed.schemaVersion)}" ` +
      `does not match expected "${EXPECTED_QUEUE_SCHEMA_VERSION}".`,
    );
  }

  if (!Array.isArray(parsed.units)) {
    throw new Error(
      `catalogue-relationship-review-queue.json: "units" field must be an array.`,
    );
  }

  if (parsed.graphFingerprint !== POST_P5A_FINGERPRINT) {
    throw new Error(
      `catalogue-relationship-review-queue.json: graphFingerprint "${String(parsed.graphFingerprint)}" ` +
      `does not match post-P5A baseline "${POST_P5A_FINGERPRINT}".`,
    );
  }

  return parsed as unknown as RelationshipReviewQueueData;
}

// ── Ledger loader ─────────────────────────────────────────────────────────────

/**
 * Loads the relationship decision ledger.
 * Validates schema version and graph fingerprint. Throws on structural error.
 */
export function loadRelationshipDecisionLedger(): RelationshipDecisionLedger {
  const raw = readFileSync(LEDGER_PATH, "utf-8");
  const parsed = JSON.parse(raw) as {
    schemaVersion?: unknown;
    initialQueueVersion?: unknown;
    graphFingerprint?: unknown;
    entries?: unknown;
  };

  if (parsed.schemaVersion !== EXPECTED_LEDGER_SCHEMA_VERSION) {
    throw new Error(
      `catalogue-relationship-decision-ledger.json: schemaVersion "${String(parsed.schemaVersion)}" ` +
      `does not match expected "${EXPECTED_LEDGER_SCHEMA_VERSION}".`,
    );
  }

  if (parsed.initialQueueVersion !== EXPECTED_QUEUE_SCHEMA_VERSION) {
    throw new Error(
      `catalogue-relationship-decision-ledger.json: initialQueueVersion "${String(parsed.initialQueueVersion)}" ` +
      `does not match expected "${EXPECTED_QUEUE_SCHEMA_VERSION}".`,
    );
  }

  if (parsed.graphFingerprint !== POST_P5A_FINGERPRINT) {
    throw new Error(
      `catalogue-relationship-decision-ledger.json: graphFingerprint does not match post-P5A baseline.`,
    );
  }

  if (!Array.isArray(parsed.entries)) {
    throw new Error(
      `catalogue-relationship-decision-ledger.json: "entries" field must be an array.`,
    );
  }

  return parsed as unknown as RelationshipDecisionLedger;
}

// ── Ledger atomic writer ──────────────────────────────────────────────────────

/**
 * Atomically writes the relationship decision ledger to disk.
 * Mirrors the saveIdentityRegistry() write sequence from persistence.ts.
 * Throws on validation failure or I/O error.
 */
export function saveRelationshipDecisionLedger(data: RelationshipDecisionLedger): void {
  if (data.schemaVersion !== EXPECTED_LEDGER_SCHEMA_VERSION) {
    throw new Error(
      `saveRelationshipDecisionLedger: schemaVersion "${data.schemaVersion}" ` +
      `does not match expected "${EXPECTED_LEDGER_SCHEMA_VERSION}". Refusing write.`,
    );
  }

  if (!Array.isArray(data.entries)) {
    throw new Error(
      `saveRelationshipDecisionLedger: entries must be an array. Refusing write.`,
    );
  }

  const tempPath   = LEDGER_PATH + ".tmp";
  const backupPath = LEDGER_PATH + ".bak";

  // Ensure the decisions directory exists
  mkdirSync(dirname(LEDGER_PATH), { recursive: true });

  const json = JSON.stringify(data, null, 2);

  writeFileSync(tempPath, json, "utf-8");

  // Round-trip verification
  let roundTrip: { schemaVersion?: unknown; entries?: unknown };
  try {
    roundTrip = JSON.parse(readFileSync(tempPath, "utf-8")) as typeof roundTrip;
  } catch (err) {
    unlinkSync(tempPath);
    throw new Error(
      `saveRelationshipDecisionLedger: round-trip verification failed — could not re-parse temp file: ${String(err)}`,
    );
  }

  if (roundTrip.schemaVersion !== EXPECTED_LEDGER_SCHEMA_VERSION || !Array.isArray(roundTrip.entries)) {
    unlinkSync(tempPath);
    throw new Error(
      `saveRelationshipDecisionLedger: round-trip verification failed — ` +
      `schemaVersion="${String(roundTrip.schemaVersion)}", entries isArray=${Array.isArray(roundTrip.entries)}`,
    );
  }

  if (existsSync(LEDGER_PATH)) {
    copyFileSync(LEDGER_PATH, backupPath);
  }

  renameSync(tempPath, LEDGER_PATH);
}

// ── Production repository factories ──────────────────────────────────────────

/**
 * Creates a production read-only repository for the immutable queue artifact.
 */
export function createProductionQueueRepository(): RelationshipQueueRepository {
  return { load: loadRelationshipQueue };
}

/**
 * Creates a production read-write repository for the decision ledger.
 * Each call returns a fresh adapter safe for independent Server Action calls.
 */
export function createProductionLedgerRepository(): RelationshipLedgerRepository {
  return {
    load: loadRelationshipDecisionLedger,
    save: saveRelationshipDecisionLedger,
  };
}

/**
 * Production clock for the relationship editorial service.
 */
export const RELATIONSHIP_PRODUCTION_CLOCK = {
  now: (): string => new Date().toISOString(),
};
