/**
 * Maison Identity Platform — Persistence Foundation
 *
 * Typed schema and loader for the identity registry JSON store.
 * EP5-P1 provides a loader only — no write/save function.
 *
 * The data file is intentionally empty in EP5-P1:
 *   app/lib/identity/data/identity-registry.json
 *
 * No actual supplier or fragrance identities are persisted in this episode.
 * Population of the identity store belongs to EP5-P2+ after the domain
 * foundation has been validated and the resolver engine is established.
 *
 * No database. No Supabase. No API route. No mutations.
 */

import { readFileSync }       from "fs";
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
 *
 * Validates that the file version matches IDENTITY_PLATFORM_VERSION.
 * In EP5-P1 this always returns an empty identities array.
 *
 * Throws if the file cannot be read or the version is incompatible.
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
