/**
 * Maison Identity Platform — Persistence
 *
 * Typed schema, loader, and atomic writer for the identity registry JSON store.
 * EP5-P1 introduced the loader. EP5-P2C adds the atomic save writer.
 *
 * Registry file:
 *   app/lib/identity/data/identity-registry.json
 *
 * No database. No Supabase. No API route.
 * All mutations must go through saveIdentityRegistry() — no direct file writes
 * outside this module.
 */

import {
  copyFileSync,
  existsSync,
  readFileSync,
  renameSync,
  unlinkSync,
  writeFileSync,
} from "fs";
import { join }               from "path";
import type { IdentityRecord } from "./types";
import { IDENTITY_PLATFORM_VERSION } from "./version";

// ── Typed persistence schema ───────────────────────────────────────────────────

/**
 * The shape of the JSON file on disk.
 * version must match IDENTITY_PLATFORM_VERSION for safe loading.
 * identities is an array of serialised IdentityRecord objects.
 */
export interface IdentityRegistryData {
  readonly version:    string;
  readonly identities: readonly IdentityRecord[];
}

// ── Loader ────────────────────────────────────────────────────────────────────

const REGISTRY_PATH = join(
  process.cwd(),
  "app",
  "lib",
  "identity",
  "data",
  "identity-registry.json",
);

/**
 * Loads the identity registry JSON file and returns typed data.
 * Throws if the file cannot be read, the JSON is malformed, or the
 * version is incompatible with the running platform version.
 */
export function loadIdentityRegistry(): IdentityRegistryData {
  const raw = readFileSync(REGISTRY_PATH, "utf-8");
  const parsed = JSON.parse(raw) as { version?: unknown; identities?: unknown };

  if (typeof parsed.version !== "string") {
    throw new Error(
      `identity-registry.json: "version" field is missing or not a string`,
    );
  }

  if (parsed.version !== IDENTITY_PLATFORM_VERSION) {
    throw new Error(
      `identity-registry.json: version "${parsed.version}" does not match ` +
      `IDENTITY_PLATFORM_VERSION "${IDENTITY_PLATFORM_VERSION}". ` +
      `Migration may be required.`,
    );
  }

  if (!Array.isArray(parsed.identities)) {
    throw new Error(
      `identity-registry.json: "identities" field must be an array`,
    );
  }

  return {
    version:    parsed.version,
    identities: parsed.identities as readonly IdentityRecord[],
  };
}

// ── Atomic writer ─────────────────────────────────────────────────────────────

/**
 * Atomically writes identity registry data to disk.
 *
 * Write sequence:
 *   1. Validate data structure before any I/O.
 *   2. Serialise to JSON and write to a .tmp file.
 *   3. Read the .tmp file back and verify the round-trip is correct.
 *   4. Copy the existing registry to .bak (rollback-safe).
 *   5. Rename .tmp → registry (atomic on same-filesystem NTFS/ext4).
 *
 * If any step fails the temp file is cleaned up and no change is
 * made to the live registry.
 *
 * Throws on version mismatch, validation failure, or I/O error.
 */
export function saveIdentityRegistry(data: IdentityRegistryData): void {
  if (data.version !== IDENTITY_PLATFORM_VERSION) {
    throw new Error(
      `saveIdentityRegistry: data version "${data.version}" does not match ` +
      `IDENTITY_PLATFORM_VERSION "${IDENTITY_PLATFORM_VERSION}". Refusing write.`,
    );
  }

  if (!Array.isArray(data.identities)) {
    throw new Error(
      `saveIdentityRegistry: identities must be an array. Refusing write.`,
    );
  }

  const tempPath   = REGISTRY_PATH + ".tmp";
  const backupPath = REGISTRY_PATH + ".bak";

  const json = JSON.stringify(
    { version: data.version, identities: data.identities },
    null,
    2,
  );

  // Write to temp file
  writeFileSync(tempPath, json, "utf-8");

  // Round-trip verification — confirm the file was written correctly
  let roundTrip: { version?: unknown; identities?: unknown };
  try {
    roundTrip = JSON.parse(readFileSync(tempPath, "utf-8")) as typeof roundTrip;
  } catch (err) {
    unlinkSync(tempPath);
    throw new Error(
      `saveIdentityRegistry: round-trip verification failed — could not re-parse temp file: ${String(err)}`,
    );
  }

  if (roundTrip.version !== IDENTITY_PLATFORM_VERSION || !Array.isArray(roundTrip.identities)) {
    unlinkSync(tempPath);
    throw new Error(
      `saveIdentityRegistry: round-trip verification failed — ` +
      `version="${String(roundTrip.version)}", identities isArray=${Array.isArray(roundTrip.identities)}`,
    );
  }

  // Backup existing registry before replacing
  if (existsSync(REGISTRY_PATH)) {
    copyFileSync(REGISTRY_PATH, backupPath);
  }

  // Atomic rename — temp → live
  renameSync(tempPath, REGISTRY_PATH);
}
