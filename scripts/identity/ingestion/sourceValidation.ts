/**
 * Maison Identity Platform — EP5-P2CR Source Validation
 *
 * Runtime validation for Mid-Year 2026 source data files.
 * Replaces unsafe `JSON.parse(...) as SupplierSourceFile` casts with
 * deterministic guards that verify every field before any ingestion processing.
 *
 * Exported for use by both the ingestion script and the validation proof suite.
 */

import { normalizeIdentityString } from "../../../app/lib/identity/normalizer";

import type {
  SupplierSourceFile,
  SupplierSourceEntry,
  ResearchSourceFile,
  ResearchSourceEntry,
  ResearchMarketedGender,
  UniqueSupplierEntry,
} from "./types";

// ── Campaign constants ────────────────────────────────────────────────────────

/** Total supplier rows in the Mid-Year 2026 list (26 unique + 5 L/M duplicate pairs). */
export const CAMPAIGN_SOURCE_ROW_COUNT = 31;

/** Unique fragrance identities after collapsing L/M duplicate rows. */
export const CAMPAIGN_UNIQUE_COUNT = 26;

/** Number of fragrances that appear under both L and M in the supplier list. */
export const CAMPAIGN_DUPLICATE_COUNT = 5;

// ── Canonical proposal safety ─────────────────────────────────────────────────

/**
 * Returns true when a research canonical name represents one clean, unambiguous
 * identity proposal that is safe to use as CanonicalIdentity.canonicalName.
 *
 * Rejects:
 *   " / "           — multi-option separator (two possible products, e.g. "A / B")
 *   "(Note:"        — research annotation text embedded in the name field
 *   parentheticals containing "unverified" — uncertainty markers
 *
 * Permits: apostrophes, hyphens, "|" pipes (e.g., "Capri In a Bottle | 14"),
 * numbers, accented characters, and parentheses in legitimate official titles.
 *
 * Does NOT inspect sourceConfidence or possibleNameIssue — those are handled
 * by classifyEntry(). This function guards canonical NAME QUALITY only.
 */
export function isCleanCanonicalProposal(name: string): boolean {
  const trimmed = name.trim();
  if (!trimmed) return false;
  if (trimmed.includes(" / ")) return false;
  if (trimmed.includes("(Note:")) return false;
  if (/\([^)]*\bunverified\b[^)]*\)/i.test(trimmed)) return false;
  return true;
}

// ── Internal type guards ──────────────────────────────────────────────────────

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && (v as unknown[]).every(item => typeof item === "string");
}

// ── Supplier source validation ────────────────────────────────────────────────

export function parseSupplierSourceFile(raw: unknown): SupplierSourceFile {
  if (!isObject(raw)) {
    throw new Error("Supplier source: root must be an object");
  }
  if (!isNonEmptyString(raw["batchId"])) {
    throw new Error("Supplier source: batchId must be a non-empty string");
  }
  if (!isNonEmptyString(raw["description"])) {
    throw new Error("Supplier source: description must be a non-empty string");
  }
  if (!isNonEmptyString(raw["sourceReference"])) {
    throw new Error("Supplier source: sourceReference must be a non-empty string");
  }
  if (!Array.isArray(raw["entries"])) {
    throw new Error("Supplier source: entries must be an array");
  }

  const rawEntries = raw["entries"] as unknown[];
  const entries: SupplierSourceEntry[] = [];

  for (let i = 0; i < rawEntries.length; i++) {
    const e = rawEntries[i];
    if (!isObject(e)) {
      throw new Error(`Supplier source: entries[${i}] must be an object`);
    }
    if (!isNonEmptyString(e["supplierName"])) {
      throw new Error(`Supplier source: entries[${i}].supplierName must be a non-empty string`);
    }
    if (e["supplierCategory"] !== undefined && typeof e["supplierCategory"] !== "string") {
      throw new Error(`Supplier source: entries[${i}].supplierCategory must be a string if present`);
    }
    if (e["sourceReference"] !== undefined && typeof e["sourceReference"] !== "string") {
      throw new Error(`Supplier source: entries[${i}].sourceReference must be a string if present`);
    }
    entries.push({
      supplierName: e["supplierName"] as string,
      ...(e["supplierCategory"] !== undefined ? { supplierCategory: e["supplierCategory"] as string } : {}),
      ...(e["sourceReference"] !== undefined ? { sourceReference: e["sourceReference"] as string } : {}),
    });
  }

  return {
    batchId:         raw["batchId"] as string,
    description:     raw["description"] as string,
    sourceReference: raw["sourceReference"] as string,
    entries,
  };
}

// ── Research source validation ────────────────────────────────────────────────

const VALID_MARKETED_GENDER = new Set<string>([
  "female", "male", "unisex", "shared", "unknown",
]);
const VALID_SOURCE_CONFIDENCE = new Set<string>(["high", "medium", "low"]);
const ARRAY_KNOWLEDGE_FIELDS = [
  "fragranceFamily",
  "topNotes",
  "heartNotes",
  "baseNotes",
  "mainAccords",
  "perfumer",
] as const;

export function parseResearchSourceFile(raw: unknown): ResearchSourceFile {
  if (!isObject(raw)) {
    throw new Error("Research source: root must be an object");
  }
  if (!isNonEmptyString(raw["batchId"])) {
    throw new Error("Research source: batchId must be a non-empty string");
  }
  if (!isNonEmptyString(raw["researchedBy"])) {
    throw new Error("Research source: researchedBy must be a non-empty string");
  }
  if (!isNonEmptyString(raw["researchDate"])) {
    throw new Error("Research source: researchDate must be a non-empty string");
  }
  if (!Array.isArray(raw["entries"])) {
    throw new Error("Research source: entries must be an array");
  }

  const rawEntries = raw["entries"] as unknown[];
  const entries: ResearchSourceEntry[] = [];

  for (let i = 0; i < rawEntries.length; i++) {
    const e = rawEntries[i];
    if (!isObject(e)) {
      throw new Error(`Research source: entries[${i}] must be an object`);
    }
    if (!isNonEmptyString(e["supplierName"])) {
      throw new Error(`Research source: entries[${i}].supplierName must be a non-empty string`);
    }
    if (typeof e["canonicalName"] !== "string") {
      throw new Error(`Research source: entries[${i}].canonicalName must be a string`);
    }
    if (typeof e["brand"] !== "string") {
      throw new Error(`Research source: entries[${i}].brand must be a string`);
    }
    if (
      e["launchYear"] !== undefined &&
      e["launchYear"] !== null &&
      typeof e["launchYear"] !== "number"
    ) {
      throw new Error(
        `Research source: entries[${i}].launchYear must be a number, null, or absent`,
      );
    }
    if (
      e["marketedGender"] !== undefined &&
      (typeof e["marketedGender"] !== "string" ||
        !VALID_MARKETED_GENDER.has(e["marketedGender"] as string))
    ) {
      throw new Error(
        `Research source: entries[${i}].marketedGender "${String(e["marketedGender"])}" ` +
        `must be one of: female, male, unisex, shared, unknown`,
      );
    }
    if (
      typeof e["sourceConfidence"] !== "string" ||
      !VALID_SOURCE_CONFIDENCE.has(e["sourceConfidence"] as string)
    ) {
      throw new Error(
        `Research source: entries[${i}].sourceConfidence "${String(e["sourceConfidence"])}" ` +
        `must be one of: high, medium, low`,
      );
    }
    if (e["sourceNotes"] !== undefined && typeof e["sourceNotes"] !== "string") {
      throw new Error(
        `Research source: entries[${i}].sourceNotes must be a string if present`,
      );
    }
    if (typeof e["possibleNameIssue"] !== "boolean") {
      throw new Error(
        `Research source: entries[${i}].possibleNameIssue must be a boolean`,
      );
    }
    if (
      e["nameIssueExplanation"] !== undefined &&
      typeof e["nameIssueExplanation"] !== "string"
    ) {
      throw new Error(
        `Research source: entries[${i}].nameIssueExplanation must be a string if present`,
      );
    }
    for (const field of ARRAY_KNOWLEDGE_FIELDS) {
      if (e[field] !== undefined && !isStringArray(e[field])) {
        throw new Error(
          `Research source: entries[${i}].${field} must be an array of strings if present`,
        );
      }
    }

    entries.push({
      supplierName:         e["supplierName"] as string,
      canonicalName:        e["canonicalName"] as string,
      brand:                e["brand"] as string,
      launchYear:           e["launchYear"] as number | null | undefined,
      marketedGender:       e["marketedGender"] as ResearchMarketedGender | undefined,
      sourceConfidence:     e["sourceConfidence"] as "high" | "medium" | "low",
      sourceNotes:          e["sourceNotes"] as string | undefined,
      possibleNameIssue:    e["possibleNameIssue"] as boolean,
      nameIssueExplanation: e["nameIssueExplanation"] as string | undefined,
      fragranceFamily:      e["fragranceFamily"] as readonly string[] | undefined,
      topNotes:             e["topNotes"] as readonly string[] | undefined,
      heartNotes:           e["heartNotes"] as readonly string[] | undefined,
      baseNotes:            e["baseNotes"] as readonly string[] | undefined,
      mainAccords:          e["mainAccords"] as readonly string[] | undefined,
      perfumer:             e["perfumer"] as readonly string[] | undefined,
    });
  }

  return {
    batchId:      raw["batchId"] as string,
    researchedBy: raw["researchedBy"] as string,
    researchDate: raw["researchDate"] as string,
    entries,
  };
}

// ── Deduplication ─────────────────────────────────────────────────────────────

export function deduplicateSupplierRows(
  entries: readonly SupplierSourceEntry[],
): UniqueSupplierEntry[] {
  const seen = new Map<string, SupplierSourceEntry[]>();

  for (const entry of entries) {
    const key = normalizeIdentityString(entry.supplierName);
    const existing = seen.get(key);
    if (existing) {
      existing.push(entry);
    } else {
      seen.set(key, [entry]);
    }
  }

  return Array.from(seen.entries()).map(([normalizedKey, supplierEntries]) => ({
    normalizedKey,
    supplierEntries,
    researchEntry: null as ResearchSourceEntry | null,
  }));
}

export function matchResearch(
  uniqueEntries: UniqueSupplierEntry[],
  researchEntries: readonly ResearchSourceEntry[],
): UniqueSupplierEntry[] {
  const researchByKey = new Map<string, ResearchSourceEntry>();
  for (const re of researchEntries) {
    researchByKey.set(normalizeIdentityString(re.supplierName), re);
  }
  return uniqueEntries.map(entry => ({
    ...entry,
    researchEntry: researchByKey.get(entry.normalizedKey) ?? null,
  }));
}

// ── Source/research correspondence check ──────────────────────────────────────

/**
 * Verifies 1:1 correspondence between unique supplier entries and research entries.
 * Throws with a STOP-level message on any of:
 *   - duplicate research supplierName (after normalization)
 *   - unique supplier with no research entry
 *   - orphan research entry with no matching supplier
 *   - count mismatch
 */
export function verifySourceCorrespondence(
  uniqueEntries: UniqueSupplierEntry[],
  researchEntries: readonly ResearchSourceEntry[],
): void {
  // No duplicate research entries (normalized supplierName)
  const researchKeys = new Map<string, number>();
  for (let i = 0; i < researchEntries.length; i++) {
    const key = normalizeIdentityString(researchEntries[i].supplierName);
    if (researchKeys.has(key)) {
      throw new Error(
        `Source correspondence: duplicate research entry for ` +
        `"${researchEntries[i].supplierName}" ` +
        `(first at index ${researchKeys.get(key) ?? "?"})`,
      );
    }
    researchKeys.set(key, i);
  }

  // Every unique supplier has a research entry
  for (const entry of uniqueEntries) {
    if (!researchKeys.has(entry.normalizedKey)) {
      throw new Error(
        `Source correspondence: no research entry for supplier ` +
        `"${entry.supplierEntries[0].supplierName}" (normalized: "${entry.normalizedKey}")`,
      );
    }
  }

  // No orphan research entries
  const supplierKeySet = new Set(uniqueEntries.map(e => e.normalizedKey));
  for (const re of researchEntries) {
    const key = normalizeIdentityString(re.supplierName);
    if (!supplierKeySet.has(key)) {
      throw new Error(
        `Source correspondence: orphan research entry ` +
        `"${re.supplierName}" — no matching supplier entry`,
      );
    }
  }

  // Count must match exactly
  if (uniqueEntries.length !== researchEntries.length) {
    throw new Error(
      `Source correspondence: ${uniqueEntries.length} unique suppliers but ` +
      `${researchEntries.length} research entries — counts must be equal`,
    );
  }
}
