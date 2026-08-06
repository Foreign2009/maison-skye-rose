/**
 * Knowledge Factory — Intake
 *
 * Reads the supplier catalogue and returns the ProductIntake for a given slug.
 * Validates that the record exists and is eligible for factory processing.
 *
 * Ownership: All supplier catalogue reads go through this module.
 * No other factory module reads from app/data/ directly.
 *
 * Category is explicit at the intake boundary: every successful intake carries
 * a typed, discriminated ProductIntake with category: "fragrance" (or the
 * category of the matching catalogue when additional categories are registered).
 */

import { existsSync } from "fs";
import path from "path";
import type { DisplayFragrance } from "../../app/lib/knowledgeAdapter";
import { nativeFragrances }      from "../../app/lib/mkc/native/index";
import { fragrances }            from "../../app/data/fragrances";
import { CatalogueRegistry }     from "./core/CatalogueRegistry";
import { deriveSlug }            from "./core/deriveSlug";
import type { IntakeInput, IntakeResult, FragranceIntake } from "./types";

// ── Slug derivation ───────────────────────────────────────────────────────────

export { deriveSlug };

// ── Const name derivation ─────────────────────────────────────────────────────
// Produces a valid JavaScript identifier from a slug.
// Consistent with mkc-scaffold.ts derivation for common cases.
// Apostrophes, numbers at the start, and other special characters are handled.

export function deriveConstName(slug: string): string {
  const parts = slug
    .split("-")
    .map(p => p.replace(/[^a-zA-Z0-9]/g, ""))
    .filter(Boolean);

  if (parts.length === 0) return "unknownRecord";

  const [first, ...rest] = parts;
  const camelRest = rest.map(p => p.charAt(0).toUpperCase() + p.slice(1));
  const base = /^[0-9]/.test(first) ? `_${first}` : first;
  return base + camelRest.join("");
}

// ── Fragrance intake conversion ───────────────────────────────────────────────
// Adds the explicit category discriminant to a DisplayFragrance record.
// This is the only place in the factory where a DisplayFragrance becomes a
// typed FragranceIntake — preserving all existing values unchanged.

export function toFragranceIntake(f: DisplayFragrance): FragranceIntake {
  return { ...f, category: "fragrance" as const };
}

// ── Catalogue registry ─────────────────────────────────────────────────────────
// One loader registered per category. The fragrance loader searches the
// combined fragrances catalogue. Additional categories register additional loaders.

export const defaultCatalogueRegistry = new CatalogueRegistry();
defaultCatalogueRegistry.register("fragrance", (slug) => {
  const allFragrances = fragrances as DisplayFragrance[];
  const match = allFragrances.find(f => deriveSlug(f.title) === slug);
  return match ? toFragranceIntake(match) : null;
});

// ── Intake ────────────────────────────────────────────────────────────────────

const ROOT      = process.cwd();
const DRAFT_DIR = path.join(ROOT, "scripts", "factory", "drafts");

export function intake(input: IntakeInput): IntakeResult {
  const { slug, force } = input;

  // Guard: already in the native registry?
  if (nativeFragrances.has(slug)) {
    if (!force) {
      return { status: "already_native", intake: null, collection: null, source: null };
    }
    // --force continues past this guard
  }

  // Guard: draft already exists?
  const draftPath = path.join(DRAFT_DIR, `${slug}.ts`);
  if (existsSync(draftPath) && !force) {
    return { status: "already_drafted", intake: null, collection: null, source: null };
  }

  // Resolve via registry — enforces global slug uniqueness across all catalogues
  const productIntake = defaultCatalogueRegistry.find(slug);

  if (!productIntake) {
    return { status: "not_found", intake: null, collection: null, source: null };
  }

  // collection / source are fragrance-specific metadata kept for downstream compatibility.
  // When ProductIntake expands to a union, these will be null for non-fragrance categories.
  const sourceMap: Record<string, "skye" | "rose" | "elite"> = {
    Skye:  "skye",
    Rose:  "rose",
    Elite: "elite",
  };

  return {
    status:     "found",
    intake:     productIntake,
    collection: productIntake.collection,
    source:     sourceMap[productIntake.collection] ?? "skye",
  };
}
