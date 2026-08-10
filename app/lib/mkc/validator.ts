/**
 * Maison Knowledge Catalogue — Native Record Validator
 *
 * Quality gate for all native FragranceKnowledge records.
 * Returns structured validation data suitable for CLI, Admin UI, and CI pipelines.
 *
 * NOT imported by the Next.js application. Development and CI use only.
 */

import type { FragranceKnowledge, ProductCategory, GuestAvailabilityStatus } from "./types";
import { fragranceFamilies } from "../../data/fragranceFamilies";

// ── Governed vocabularies for EP2-P7D fields ─────────────────────────────────

const VALID_PRODUCT_CATEGORIES: readonly ProductCategory[] = [
  "fragrance",
  "body-care",
  "personal-care",
  "home-fragrance",
  "bottles-packaging",
  "accessories",
  "lifestyle",
];

const VALID_AVAILABILITY_STATUSES: readonly GuestAvailabilityStatus[] = [
  "online",
  "on-request",
  "coming-soon",
  "seasonal",
  "limited",
];

// ── Public types ──────────────────────────────────────────────────────────────

export type ValidationStatus = "PASS" | "PASS_WITH_WARNINGS" | "FAIL";

export type ValidationGroup =
  | "identity"
  | "classification"
  | "composition"
  | "editorial"
  | "discovery"
  | "intelligence"
  | "commerce"
  | "relationships";

export interface ValidationIssue {
  code:     string;
  group:    ValidationGroup;
  field:    string;
  message:  string;
  severity: "error" | "warning";
}

export interface ValidationGroupResult {
  group:  ValidationGroup;
  status: ValidationStatus;
  issues: ValidationIssue[];
}

export interface ValidationResult {
  status:        ValidationStatus;
  slug:          string;
  name:          string;
  groups:        Record<ValidationGroup, ValidationGroupResult>;
  errors:        ValidationIssue[];
  warnings:      ValidationIssue[];
  totalErrors:   number;
  totalWarnings: number;
}

// ── Vocabulary ────────────────────────────────────────────────────────────────

const FAMILY_VOCABULARY = new Set<string>(fragranceFamilies);

// ── Issue builders ────────────────────────────────────────────────────────────

function e(code: string, group: ValidationGroup, field: string, message: string): ValidationIssue {
  return { code, group, field, message, severity: "error" };
}

function w(code: string, group: ValidationGroup, field: string, message: string): ValidationIssue {
  return { code, group, field, message, severity: "warning" };
}

// ── Group validators ──────────────────────────────────────────────────────────

function checkIdentity(k: FragranceKnowledge): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const g: ValidationGroup = "identity";

  if (!k.id?.trim())    issues.push(e("ID_REQUIRED",    g, "id",    "id is required"));
  if (!k.slug?.trim())  issues.push(e("SLUG_REQUIRED",  g, "slug",  "slug is required"));
  if (!k.name?.trim())  issues.push(e("NAME_REQUIRED",  g, "name",  "name is required"));
  if (!k.brand?.trim()) issues.push(e("BRAND_REQUIRED", g, "brand", "brand is required"));

  if (k.id && k.slug && k.id !== k.slug) {
    issues.push(e("ID_SLUG_MISMATCH", g, "id/slug",
      `id "${k.id}" must equal slug "${k.slug}"`));
  }

  if (k.name && k.slug) {
    const derived = k.name.toLowerCase().replace(/\s+/g, "-");
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

  // ── EP2-P7D: multi-category foundation fields ─────────────────────────────
  // Absence is valid — existing records default to "fragrance" / "online".
  // An explicit value must be from the governed vocabulary.

  if (k.category !== undefined) {
    if (!(VALID_PRODUCT_CATEGORIES as readonly string[]).includes(k.category)) {
      issues.push(e("CATEGORY_INVALID", g, "category",
        `category "${k.category}" is not a recognised ProductCategory value`));
    }
  }

  if (k.availabilityStatus !== undefined) {
    if (!(VALID_AVAILABILITY_STATUSES as readonly string[]).includes(k.availabilityStatus)) {
      issues.push(e("AVAILABILITY_STATUS_INVALID", g, "availabilityStatus",
        `availabilityStatus "${k.availabilityStatus}" is not a recognised GuestAvailabilityStatus value`));
    }
  }

  return issues;
}

function checkClassification(k: FragranceKnowledge): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const g: ValidationGroup = "classification";

  const validGenders: string[] = ["male", "female", "unisex"];
  if (!validGenders.includes(k.gender)) {
    issues.push(e("GENDER_INVALID", g, "gender",
      `gender "${k.gender}" must be male, female, or unisex`));
  }

  if (!k.family || k.family.length === 0) {
    issues.push(e("FAMILY_EMPTY", g, "family", "at least one fragrance family is required"));
  } else {
    for (const fam of k.family) {
      if (!FAMILY_VOCABULARY.has(fam)) {
        issues.push(e("FAMILY_NOT_IN_VOCABULARY", g, "family",
          `"${fam}" is not in the approved fragrance family vocabulary`));
      }
    }
  }

  const validCharacters: string[] = [
    "Fresh & Light", "Balanced Signature", "Rich & Full-Bodied", "Deep & Intense",
  ];
  if (!validCharacters.includes(k.scentCharacter)) {
    issues.push(e("SCENT_CHARACTER_INVALID", g, "scentCharacter",
      `"${k.scentCharacter}" is not a valid scentCharacter`));
  }

  const validProjections: string[] = ["soft", "moderate", "strong"];
  if (!validProjections.includes(k.projection)) {
    issues.push(e("PROJECTION_INVALID", g, "projection",
      `projection "${k.projection}" must be soft, moderate, or strong`));
  }

  return issues;
}

function checkComposition(k: FragranceKnowledge): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const g: ValidationGroup = "composition";

  if (!k.profile?.trim()) issues.push(e("PROFILE_REQUIRED", g, "profile", "profile is required"));
  if (!k.season?.trim())  issues.push(e("SEASON_REQUIRED",  g, "season",  "season is required"));
  if (!k.mood?.trim())    issues.push(e("MOOD_REQUIRED",    g, "mood",    "mood is required"));

  const top   = k.notes.top   ?? [];
  const heart = k.notes.heart ?? [];
  const base  = k.notes.base  ?? [];

  if (top.length < 2)   issues.push(e("NOTES_TOP_MIN",   g, "notes.top",   `minimum 2 top notes required (found ${top.length})`));
  if (heart.length < 2) issues.push(e("NOTES_HEART_MIN", g, "notes.heart", `minimum 2 heart notes required (found ${heart.length})`));
  if (base.length < 2)  issues.push(e("NOTES_BASE_MIN",  g, "notes.base",  `minimum 2 base notes required (found ${base.length})`));

  return issues;
}

function checkEditorial(k: FragranceKnowledge): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const g: ValidationGroup = "editorial";

  if (!k.subtitle?.trim()) {
    issues.push(e("SUBTITLE_REQUIRED", g, "subtitle", "subtitle is required for all native records"));
  }
  if (!k.description?.trim()) {
    issues.push(e("DESCRIPTION_REQUIRED", g, "description", "description is required for all native records"));
  }
  if (!k.signatureStyle || k.signatureStyle.length === 0) {
    issues.push(e("SIGNATURE_STYLE_REQUIRED", g, "signatureStyle", "at least one signatureStyle is required"));
  }

  if (!k.academyArticleIds || k.academyArticleIds.length === 0) {
    issues.push(w("ACADEMY_ARTICLES_NOT_LINKED", g, "academyArticleIds",
      "no academy articles linked — academy article boost (+50) will not apply"));
  }
  if (!k.educationTags || k.educationTags.length === 0) {
    issues.push(w("EDUCATION_TAGS_MISSING", g, "educationTags",
      "no education tags — academy cross-referencing disabled for this record"));
  }
  if (!k.learningPath || k.learningPath.length === 0) {
    issues.push(w("LEARNING_PATH_NOT_SET", g, "learningPath", "no learning path defined"));
  }

  return issues;
}

function checkDiscovery(k: FragranceKnowledge): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const g: ValidationGroup = "discovery";

  const vibeCount      = (k.vibe          ?? []).length;
  const occasionCount  = (k.occasions     ?? []).length;
  const recommendCount = (k.recommendedFor ?? []).length;
  const seasonCount    = (k.seasons       ?? []).length;

  if (vibeCount < 3) {
    issues.push(e("VIBE_MIN", g, "vibe",
      `minimum 3 vibe tags required (found ${vibeCount})`));
  }
  if (occasionCount < 2) {
    issues.push(e("OCCASIONS_MIN", g, "occasions",
      `minimum 2 occasions required (found ${occasionCount})`));
  }
  if (recommendCount < 2) {
    issues.push(e("RECOMMENDED_FOR_MIN", g, "recommendedFor",
      `minimum 2 recommendedFor values required (found ${recommendCount})`));
  }
  if (seasonCount === 0) {
    issues.push(e("SEASONS_EMPTY", g, "seasons",
      "at least one season is required in the seasons array"));
  }

  return issues;
}

function checkIntelligence(k: FragranceKnowledge): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const g: ValidationGroup = "intelligence";

  const scale5: Array<[string, number]> = [
    ["sweetness",   k.sweetness],
    ["freshness",   k.freshness],
    ["warmth",      k.warmth],
    ["intensity",   k.intensity],
    ["versatility", k.versatility],
  ];

  for (const [field, val] of scale5) {
    if (typeof val !== "number" || !Number.isInteger(val) || val < 1 || val > 5) {
      issues.push(e(`${field.toUpperCase()}_RANGE`, g, field,
        `${field} must be an integer between 1 and 5 (got ${val})`));
    }
  }

  if (
    typeof k.popularity !== "number" ||
    !Number.isInteger(k.popularity) ||
    k.popularity < 1 ||
    k.popularity > 10
  ) {
    issues.push(e("POPULARITY_RANGE", g, "popularity",
      `popularity must be an integer between 1 and 10 (got ${k.popularity})`));
  }

  return issues;
}

function checkCommerce(k: FragranceKnowledge): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const g: ValidationGroup = "commerce";

  for (const size of ["5ml", "10ml", "30ml"] as const) {
    const price = k.prices?.[size];
    if (typeof price !== "number" || price <= 0) {
      issues.push(e("PRICE_INVALID", g, `prices.${size}`,
        `price for ${size} must be a positive number (got ${price})`));
    }
    const img = k.images?.[size];
    if (!img?.trim()) {
      issues.push(e("IMAGE_MISSING", g, `images.${size}`,
        `image path for ${size} is required`));
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

function checkRelationships(
  k: FragranceKnowledge,
  allRecords?: ReadonlyMap<string, FragranceKnowledge>
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const g: ValidationGroup = "relationships";
  const rel = k.relationships;

  if (!rel) return issues;

  const self = k.slug;

  // ── Per-record helpers ────────────────────────────────────────────────────────

  function selfRef(field: string, slug: string): void {
    if (slug === self) {
      issues.push(e("RELATIONSHIP_SELF_REFERENCE", g, field,
        `"${self}" lists itself in ${field} — a fragrance cannot reference its own slug`));
    }
  }

  function checkDuplicates(field: string, slugs: string[]): void {
    const seen = new Set<string>();
    for (const slug of slugs) {
      if (seen.has(slug)) {
        issues.push(e("RELATIONSHIP_DUPLICATE_SLUG", g, field,
          `"${slug}" appears more than once in ${field} for record "${self}"`));
      }
      seen.add(slug);
    }
  }

  // ── Cross-record helpers ──────────────────────────────────────────────────────

  function slugExists(field: string, slug: string): boolean {
    if (!allRecords) return true;
    if (!allRecords.has(slug)) {
      issues.push(e("RELATIONSHIP_SLUG_NOT_FOUND", g, field,
        `"${self}" references "${slug}" in ${field} — slug does not exist in the native registry`));
      return false;
    }
    return true;
  }

  // ── evolutionOf ───────────────────────────────────────────────────────────────

  if (rel.evolutionOf !== undefined) {
    const pred = rel.evolutionOf;
    selfRef("evolutionOf", pred);

    if (allRecords && slugExists("evolutionOf", pred)) {
      const predecessor = allRecords.get(pred)!;
      const evolutions = predecessor.relationships?.evolutions ?? [];
      if (!evolutions.includes(self)) {
        issues.push(e("RELATIONSHIP_EVOLUTION_NOT_RECIPROCAL", g, "evolutionOf",
          `"${self}" has evolutionOf: "${pred}", but "${pred}" does not list "${self}" in its evolutions — evolution chains must be fully reciprocal`));
      }
    }
  }

  // ── evolutions ────────────────────────────────────────────────────────────────

  if (rel.evolutions && rel.evolutions.length > 0) {
    checkDuplicates("evolutions", rel.evolutions);

    for (const slug of rel.evolutions) {
      selfRef("evolutions", slug);

      if (allRecords && slugExists("evolutions", slug)) {
        const child = allRecords.get(slug)!;
        if (child.relationships?.evolutionOf !== self) {
          issues.push(e("RELATIONSHIP_EVOLUTION_NOT_RECIPROCAL", g, "evolutions",
            `"${self}" lists "${slug}" in evolutions, but "${slug}" does not have evolutionOf: "${self}" — evolution chains must be fully reciprocal`));
        }
      }
    }
  }

  // ── alternatives ──────────────────────────────────────────────────────────────

  if (rel.alternatives && rel.alternatives.length > 0) {
    checkDuplicates("alternatives", rel.alternatives);

    for (const slug of rel.alternatives) {
      selfRef("alternatives", slug);

      if (allRecords && slugExists("alternatives", slug)) {
        const other = allRecords.get(slug)!;
        const reciprocal = other.relationships?.alternatives ?? [];
        if (!reciprocal.includes(self)) {
          issues.push(e("RELATIONSHIP_ALTERNATIVES_NOT_RECIPROCAL", g, "alternatives",
            `"${self}" lists "${slug}" as an alternative, but "${slug}" does not list "${self}" in its alternatives — alternative relationships must be symmetric`));
        }
      }
    }
  }

  // ── wardrobePartners ──────────────────────────────────────────────────────────

  if (rel.wardrobePartners && rel.wardrobePartners.length > 0) {
    checkDuplicates("wardrobePartners", rel.wardrobePartners);

    for (const slug of rel.wardrobePartners) {
      selfRef("wardrobePartners", slug);

      if (allRecords && slugExists("wardrobePartners", slug)) {
        const partner = allRecords.get(slug)!;
        const reciprocal = partner.relationships?.wardrobePartners ?? [];
        if (!reciprocal.includes(self)) {
          issues.push(e("RELATIONSHIP_WARDROBE_PARTNERS_NOT_RECIPROCAL", g, "wardrobePartners",
            `"${self}" lists "${slug}" as a wardrobePartner, but "${slug}" does not list "${self}" in its wardrobePartners — wardrobe partner relationships must be symmetric`));
        }
      }
    }
  }

  return issues;
}

// ── Status helpers ────────────────────────────────────────────────────────────

function groupStatus(issues: ValidationIssue[]): ValidationStatus {
  if (issues.some((i) => i.severity === "error"))   return "FAIL";
  if (issues.some((i) => i.severity === "warning")) return "PASS_WITH_WARNINGS";
  return "PASS";
}

function overallStatus(groupResults: Record<ValidationGroup, ValidationGroupResult>): ValidationStatus {
  const statuses = Object.values(groupResults).map((g) => g.status);
  if (statuses.includes("FAIL"))               return "FAIL";
  if (statuses.includes("PASS_WITH_WARNINGS")) return "PASS_WITH_WARNINGS";
  return "PASS";
}

// ── Public API ────────────────────────────────────────────────────────────────

const GROUP_ORDER: ValidationGroup[] = [
  "identity", "classification", "composition", "editorial",
  "discovery", "intelligence", "commerce", "relationships",
];

const VALIDATORS: Record<ValidationGroup, (k: FragranceKnowledge) => ValidationIssue[]> = {
  identity:       checkIdentity,
  classification: checkClassification,
  composition:    checkComposition,
  editorial:      checkEditorial,
  discovery:      checkDiscovery,
  intelligence:   checkIntelligence,
  commerce:       checkCommerce,
  relationships:  (k) => checkRelationships(k),
};

export function validateKnowledgeRecord(
  record: FragranceKnowledge,
  allRecords?: ReadonlyMap<string, FragranceKnowledge>
): ValidationResult {
  const groups = {} as Record<ValidationGroup, ValidationGroupResult>;

  for (const group of GROUP_ORDER) {
    const issues = (group === "relationships" && allRecords)
      ? checkRelationships(record, allRecords)
      : VALIDATORS[group](record);
    groups[group] = { group, status: groupStatus(issues), issues };
  }

  const allIssues = GROUP_ORDER.flatMap((g) => groups[g].issues);
  const errors    = allIssues.filter((i) => i.severity === "error");
  const warnings  = allIssues.filter((i) => i.severity === "warning");

  return {
    status:        overallStatus(groups),
    slug:          record.slug,
    name:          record.name,
    groups,
    errors,
    warnings,
    totalErrors:   errors.length,
    totalWarnings: warnings.length,
  };
}

export function validateAll(records: FragranceKnowledge[]): ValidationResult[] {
  const map = new Map<string, FragranceKnowledge>(records.map(r => [r.slug, r]));
  return records.map(r => validateKnowledgeRecord(r, map));
}
