/**
 * Maison Knowledge Catalogue — Home Fragrance Record Validator
 *
 * Quality gate for HomeFragranceKnowledge records.
 * Returns the category-neutral ValidationResult type (reused from fragrance validator).
 *
 * Groups applied:  identity, composition, editorial, discovery, commerce
 * Groups omitted:  classification, intelligence, relationships
 *   (returned as PASS with empty issues — home fragrance has no such fields)
 *
 * Foundation vs AI-enriched quality:
 *   - 0 notes per tier  → error   (structural requirement)
 *   - 1 note per tier   → warning (pre-AI quality signal)
 *   - 2+ notes per tier → pass
 *
 * Discovery arrays empty at scaffold stage → warnings only (populated by EP4-P4 producers).
 * Description not set at scaffold stage    → warning only  (populated by Editorial Producer).
 */

import { deriveSlug } from "./deriveSlug";
import type { HomeFragranceKnowledge } from "./homeFragranceTypes";
import type {
  ValidationGroup,
  ValidationGroupResult,
  ValidationIssue,
  ValidationResult,
  ValidationStatus,
} from "./validator";

// ── Issue builders ────────────────────────────────────────────────────────────

function e(code: string, group: ValidationGroup, field: string, message: string): ValidationIssue {
  return { code, group, field, message, severity: "error" };
}

function w(code: string, group: ValidationGroup, field: string, message: string): ValidationIssue {
  return { code, group, field, message, severity: "warning" };
}

// ── Group validators ──────────────────────────────────────────────────────────

function checkIdentity(k: HomeFragranceKnowledge): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const g: ValidationGroup = "identity";

  if (!k.id?.trim())    issues.push(e("ID_REQUIRED",    g, "id",    "id is required"));
  if (!k.slug?.trim())  issues.push(e("SLUG_REQUIRED",  g, "slug",  "slug is required"));
  if (!k.name?.trim())  issues.push(e("NAME_REQUIRED",  g, "name",  "name is required"));
  if (!k.brand?.trim()) issues.push(e("BRAND_REQUIRED", g, "brand", "brand is required"));
  if (!k.range?.trim()) issues.push(e("RANGE_REQUIRED", g, "range", "range is required"));

  if (k.category !== "home-fragrance") {
    issues.push(e("CATEGORY_INVALID", g, "category",
      `category must be "home-fragrance" (got "${String(k.category)}")`));
  }

  if (k.id && k.slug && k.id !== k.slug) {
    issues.push(e("ID_SLUG_MISMATCH", g, "id/slug",
      `id "${k.id}" must equal slug "${k.slug}"`));
  }

  if (k.name && k.slug) {
    const derived = deriveSlug(k.name);
    if (k.slug !== derived) {
      issues.push(e("SLUG_FORMULA", g, "slug",
        `slug "${k.slug}" should be "${derived}" (derived from name "${k.name}")`));
    }
  }

  if (!k.status || (k.status !== "active" && k.status !== "discontinued")) {
    issues.push(w("STATUS_NOT_SET", g, "status",
      `status should be "active" or "discontinued"`));
  }

  if (!k.catalogVersion?.trim()) {
    issues.push(w("CATALOG_VERSION_MISSING", g, "catalogVersion",
      `catalogVersion not set — use "1.0" for initial native records`));
  }

  return issues;
}

function checkComposition(k: HomeFragranceKnowledge): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const g: ValidationGroup = "composition";

  if (!k.profile?.trim()) issues.push(e("PROFILE_REQUIRED", g, "profile", "profile is required"));
  if (!k.season?.trim())  issues.push(e("SEASON_REQUIRED",  g, "season",  "season is required"));
  if (!k.mood?.trim())    issues.push(e("MOOD_REQUIRED",    g, "mood",    "mood is required"));

  const top   = k.notes.top;
  const heart = k.notes.heart;
  const base  = k.notes.base;

  if (top.length === 0) {
    issues.push(e("NOTES_TOP_REQUIRED",   g, "notes.top",
      "at least one top note is required"));
  } else if (top.length < 2) {
    issues.push(w("NOTES_TOP_SINGLE",     g, "notes.top",
      `single top note found — 2+ per tier recommended for AI-enriched quality (found ${top.length})`));
  }

  if (heart.length === 0) {
    issues.push(e("NOTES_HEART_REQUIRED", g, "notes.heart",
      "at least one heart note is required"));
  } else if (heart.length < 2) {
    issues.push(w("NOTES_HEART_SINGLE",   g, "notes.heart",
      `single heart note found — 2+ per tier recommended for AI-enriched quality (found ${heart.length})`));
  }

  if (base.length === 0) {
    issues.push(e("NOTES_BASE_REQUIRED",  g, "notes.base",
      "at least one base note is required"));
  } else if (base.length < 2) {
    issues.push(w("NOTES_BASE_SINGLE",    g, "notes.base",
      `single base note found — 2+ per tier recommended for AI-enriched quality (found ${base.length})`));
  }

  return issues;
}

function checkEditorial(k: HomeFragranceKnowledge): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const g: ValidationGroup = "editorial";

  if (!k.subtitle?.trim()) {
    issues.push(e("SUBTITLE_REQUIRED", g, "subtitle", "subtitle is required"));
  }

  if (!k.description?.trim()) {
    issues.push(w("DESCRIPTION_NOT_SET", g, "description",
      "description not set — add after Editorial Producer or manually before promotion"));
  }

  return issues;
}

function checkDiscovery(k: HomeFragranceKnowledge): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const g: ValidationGroup = "discovery";

  if (k.vibe.length === 0) {
    issues.push(w("VIBE_EMPTY", g, "vibe",
      "vibe tags not populated — Discovery Producer will add these in EP4-P4"));
  }
  if (k.seasons.length === 0) {
    issues.push(w("SEASONS_EMPTY", g, "seasons",
      "seasons not populated — Discovery Producer will add these in EP4-P4"));
  }
  if (k.signatureStyle.length === 0) {
    issues.push(w("SIGNATURE_STYLE_EMPTY", g, "signatureStyle",
      "signatureStyle not populated — Discovery Producer will add these in EP4-P4"));
  }
  if (k.recommendedFor.length === 0) {
    issues.push(w("RECOMMENDED_FOR_EMPTY", g, "recommendedFor",
      "recommendedFor not populated — Discovery Producer will add these in EP4-P4"));
  }

  return issues;
}

function checkCommerce(k: HomeFragranceKnowledge): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const g: ValidationGroup = "commerce";

  const priceKeys = Object.keys(k.prices ?? {});
  if (priceKeys.length === 0) {
    issues.push(e("PRICES_EMPTY", g, "prices", "at least one price variant is required"));
  } else {
    for (const variant of priceKeys) {
      const price = k.prices[variant];
      if (typeof price !== "number" || price <= 0) {
        issues.push(e("PRICE_INVALID", g, `prices.${variant}`,
          `price for ${variant} must be a positive number (got ${String(price)})`));
      }
    }
  }

  const imageKeys = Object.keys(k.images ?? {});
  if (imageKeys.length === 0) {
    issues.push(e("IMAGES_EMPTY", g, "images", "at least one image variant is required"));
  } else {
    for (const variant of imageKeys) {
      const img = k.images[variant];
      if (!img?.trim()) {
        issues.push(e("IMAGE_MISSING", g, `images.${variant}`,
          `image path for ${variant} is required`));
      }
    }
  }

  if (typeof k.bestSeller !== "boolean") {
    issues.push(e("BESTSELLER_TYPE", g, "bestSeller", "bestSeller must be a boolean"));
  }
  if (typeof k.newArrival !== "boolean") {
    issues.push(e("NEWARRIVAL_TYPE", g, "newArrival", "newArrival must be a boolean"));
  }

  return issues;
}

// ── Status helpers ────────────────────────────────────────────────────────────

function groupStatus(issues: ValidationIssue[]): ValidationStatus {
  if (issues.some((i) => i.severity === "error"))   return "FAIL";
  if (issues.some((i) => i.severity === "warning")) return "PASS_WITH_WARNINGS";
  return "PASS";
}

// ── Empty group helper (for non-applicable groups) ────────────────────────────

function emptyGroup(group: ValidationGroup): ValidationGroupResult {
  return { group, status: "PASS", issues: [] };
}

// ── Public API ────────────────────────────────────────────────────────────────

export function validateHomeFragranceRecord(
  record: HomeFragranceKnowledge,
): ValidationResult {
  const identityIssues    = checkIdentity(record);
  const compositionIssues = checkComposition(record);
  const editorialIssues   = checkEditorial(record);
  const discoveryIssues   = checkDiscovery(record);
  const commerceIssues    = checkCommerce(record);

  const groups: Record<ValidationGroup, ValidationGroupResult> = {
    identity:       { group: "identity",    status: groupStatus(identityIssues),    issues: identityIssues },
    classification: emptyGroup("classification"),
    composition:    { group: "composition", status: groupStatus(compositionIssues), issues: compositionIssues },
    editorial:      { group: "editorial",   status: groupStatus(editorialIssues),   issues: editorialIssues },
    discovery:      { group: "discovery",   status: groupStatus(discoveryIssues),   issues: discoveryIssues },
    intelligence:   emptyGroup("intelligence"),
    commerce:       { group: "commerce",    status: groupStatus(commerceIssues),    issues: commerceIssues },
    relationships:  emptyGroup("relationships"),
  };

  const allIssues = [
    ...identityIssues,
    ...compositionIssues,
    ...editorialIssues,
    ...discoveryIssues,
    ...commerceIssues,
  ];
  const errors   = allIssues.filter((i) => i.severity === "error");
  const warnings = allIssues.filter((i) => i.severity === "warning");

  const statuses = Object.values(groups).map((g) => g.status);
  const status: ValidationStatus =
    statuses.includes("FAIL")               ? "FAIL" :
    statuses.includes("PASS_WITH_WARNINGS") ? "PASS_WITH_WARNINGS" :
    "PASS";

  return {
    status,
    slug:          record.slug,
    name:          record.name,
    groups,
    errors,
    warnings,
    totalErrors:   errors.length,
    totalWarnings: warnings.length,
  };
}
