/**
 * Knowledge Factory — Intake
 *
 * Reads the supplier catalogue and returns the DisplayFragrance for a given slug.
 * Validates that the record exists and is eligible for factory processing.
 *
 * Ownership: All supplier catalogue reads go through this module.
 * No other factory module reads from app/data/ directly.
 */

import { existsSync } from "fs";
import path from "path";
import type { DisplayFragrance } from "../../app/lib/knowledgeAdapter";
import { nativeFragrances }      from "../../app/lib/mkc/native/index";
import { fragrances }            from "../../app/data/fragrances";
import type { IntakeInput, IntakeResult } from "./types";

// ── Slug derivation ───────────────────────────────────────────────────────────

export function deriveSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}

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

// ── Intake ────────────────────────────────────────────────────────────────────

const ROOT      = process.cwd();
const DRAFT_DIR = path.join(ROOT, "scripts", "factory", "drafts");

export function intake(input: IntakeInput): IntakeResult {
  const { slug, force } = input;

  // Guard: already in the native registry?
  if (nativeFragrances.has(slug)) {
    if (!force) {
      return { status: "already_native", displayFrag: null, collection: null, source: null };
    }
    // --force continues past this guard
  }

  // Guard: draft already exists?
  const draftPath = path.join(DRAFT_DIR, `${slug}.ts`);
  if (existsSync(draftPath) && !force) {
    return { status: "already_drafted", displayFrag: null, collection: null, source: null };
  }

  // Search the full catalogue for a matching slug
  const allFragrances = fragrances as DisplayFragrance[];
  const match = allFragrances.find(f => deriveSlug(f.title) === slug);

  if (!match) {
    return { status: "not_found", displayFrag: null, collection: null, source: null };
  }

  const sourceMap: Record<string, "skye" | "rose" | "elite"> = {
    Skye:  "skye",
    Rose:  "rose",
    Elite: "elite",
  };

  return {
    status:      "found",
    displayFrag: match,
    collection:  match.collection,
    source:      sourceMap[match.collection] ?? "skye",
  };
}
