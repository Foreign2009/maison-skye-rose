/**
 * Identity ↔ Product Bridge — Read API
 *
 * Provides read-only access to the governed cross-domain bridge between the
 * Maison Identity Platform and the Maison Product / Knowledge Catalogue.
 *
 * Conceptual role: this is NOT an extension of IdentityRecord or canonical
 * identity truth. It records explicit, human-approved associations between a
 * verified MIP identity and one or more Maison product slugs.
 *
 * Domain boundary:
 *   identity-registry.json         → canonical identity truth (MIP domain)
 *   product catalogue (skye/rose/elite, native records) → Maison product truth
 *   identity-product-registry.json → governed bridge between the two domains
 *
 * Cardinality:
 *   One IdentityId → zero, one, or multiple Maison product slugs (allowed)
 *   One Maison product slug → at most one IdentityId (invariant)
 *
 * All functions are read-only. No writes. No side effects on either registry.
 */

import { readFileSync } from "fs";
import { join }         from "path";
import type { IdentityId } from "./types";
import { isValidIdentityId } from "./types";

// ── Types ──────────────────────────────────────────────────────────────────────

export type MaisonProductMapping = {
  readonly identityId:   IdentityId;
  readonly maisonSlug:   string;
  readonly collection:   "Skye" | "Rose" | "Elite";
  readonly associatedAt: string;
  readonly associatedBy: string;
  readonly notes?:       string;
};

export type IdentityProductRegistry = {
  readonly version:  string;
  readonly mappings: readonly MaisonProductMapping[];
};

// ── Load ───────────────────────────────────────────────────────────────────────

const REGISTRY_PATH = join(
  process.cwd(),
  "app", "lib", "identity", "data", "identity-product-registry.json",
);

export function loadIdentityProductRegistry(): IdentityProductRegistry {
  return JSON.parse(readFileSync(REGISTRY_PATH, "utf-8")) as IdentityProductRegistry;
}

// ── Query ──────────────────────────────────────────────────────────────────────

/**
 * Returns all Maison product mappings for a given identity.
 * One identity may map to zero, one, or multiple Maison products
 * (e.g. a fragrance product and a future body product from the same identity).
 * Returns an empty array if the identityId is invalid or has no mappings.
 */
export function getMappingsForIdentity(identityId: IdentityId): readonly MaisonProductMapping[] {
  if (!isValidIdentityId(identityId)) return [];
  const registry = loadIdentityProductRegistry();
  return registry.mappings.filter(m => m.identityId === identityId);
}

/**
 * Returns the IdentityId that governs a given Maison product slug, or null.
 * Invariant: one Maison product slug maps to at most one IdentityId.
 */
export function getIdentityForMaisonSlug(slug: string): IdentityId | null {
  const registry = loadIdentityProductRegistry();
  return registry.mappings.find(m => m.maisonSlug === slug)?.identityId ?? null;
}
