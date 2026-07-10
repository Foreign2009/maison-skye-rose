/**
 * Maison Knowledge Catalogue — Coverage Dashboard
 *
 * Reports migration progress, knowledge quality metrics, and collection
 * coverage for the MKC native record migration.
 *
 * READ-ONLY: This script performs no writes, no fixes, and no repository
 * modifications. It is a reporting tool only.
 *
 * Usage: npm run mkc:coverage
 */

import { nativeFragrances }        from "../app/lib/mkc/native/index";
import { validateAll } from "../app/lib/mkc/validator";
import { skyeFragrances }          from "../app/data/skye";
import { roseFragrances }          from "../app/data/rose";
import { eliteFragrances }         from "../app/data/elite";
import type { FragranceKnowledge } from "../app/lib/mkc/types";

// ── Slug derivation (mirrors knowledgeAdapter logic) ──────────────────────────

function deriveSlug(title: string): string {
  return title.toLowerCase().replace(/\s+/g, "-");
}

// ── Catalogue totals ──────────────────────────────────────────────────────────

const rawSkye  = skyeFragrances  as Array<{ title: string; bestSeller: boolean }>;
const rawRose  = roseFragrances  as Array<{ title: string; bestSeller: boolean }>;
const rawElite = eliteFragrances as Array<{ title: string; bestSeller: boolean }>;
const rawAll   = [...rawSkye, ...rawRose, ...rawElite];

const totalCount       = rawAll.length;
const totalBestsellers = rawAll.filter((f) => f.bestSeller).length;

// ── Native registry ───────────────────────────────────────────────────────────

const native: FragranceKnowledge[] = [...nativeFragrances.values()];
const nativeSlugs = new Set(nativeFragrances.keys());

const nativeCount       = native.length;
const adapterCount      = totalCount - nativeCount;

// ── Bestseller coverage ───────────────────────────────────────────────────────

const nativeBestsellerCount = rawAll.filter(
  (f) => f.bestSeller && nativeSlugs.has(deriveSlug(f.title))
).length;

// ── Per-collection breakdown ──────────────────────────────────────────────────

interface CollectionStats {
  total:             number;
  native:            number;
  adapter:           number;
  bestsellers:       number;
  nativeBestsellers: number;
}

function collectionStats(
  raw:        Array<{ title: string; bestSeller: boolean }>,
  nativeCol:  string
): CollectionStats {
  const total       = raw.length;
  const nativeInCol = native.filter((k) => k.collection === nativeCol).length;
  const bs          = raw.filter((f) => f.bestSeller).length;
  const nativeBS    = raw.filter(
    (f) => f.bestSeller && nativeSlugs.has(deriveSlug(f.title))
  ).length;
  return {
    total,
    native:            nativeInCol,
    adapter:           total - nativeInCol,
    bestsellers:       bs,
    nativeBestsellers: nativeBS,
  };
}

const stats = {
  Skye:  collectionStats(rawSkye,  "Skye"),
  Rose:  collectionStats(rawRose,  "Rose"),
  Elite: collectionStats(rawElite, "Elite"),
};

// ── Knowledge quality (native records only) ───────────────────────────────────

const withAcademyLinks   = native.filter((k) => (k.academyArticleIds?.length  ?? 0) > 0).length;
const withDescription    = native.filter((k) => (k.description?.length        ?? 0) > 0).length;
const withEducationTags  = native.filter((k) => (k.educationTags?.length      ?? 0) > 0).length;
const withLearningPath   = native.filter((k) => (k.learningPath?.length       ?? 0) > 0).length;
const withRecommendedFor = native.filter((k) => (k.recommendedFor?.length     ?? 0) > 0).length;

// ── Validation (read-only — mirrors mkc:validate without detailed output) ─────

const validationResults  = validateAll(native);
const validationPassed   = validationResults.filter((r) => r.status === "PASS").length;
const validationWarned   = validationResults.filter((r) => r.status === "PASS_WITH_WARNINGS").length;
const validationFailed   = validationResults.filter((r) => r.status === "FAIL").length;

// ── Migration remaining ───────────────────────────────────────────────────────

const wave1Remaining = rawAll.filter(
  (f) => f.bestSeller && !nativeSlugs.has(deriveSlug(f.title))
).length;

// ── Formatting helpers ────────────────────────────────────────────────────────

const BAR  = "─".repeat(62);
const DBAR = "═".repeat(62);

function pct(n: number, d: number): string {
  if (d === 0) return "—";
  return `${((n / d) * 100).toFixed(1)}%`;
}

function row(
  label: string, value: string | number, note = ""
): string {
  const l = String(label).padEnd(30);
  const v = String(value).padStart(8);
  return `  ${l} ${v}${note ? `   ${note}` : ""}`;
}

function collRow(
  col: string, s: CollectionStats
): string {
  const total  = String(s.total).padStart(5);
  const nat    = String(s.native).padStart(7);
  const adp    = String(s.adapter).padStart(8);
  const cov    = pct(s.native, s.total).padStart(9);
  const bs     = String(s.bestsellers).padStart(12);
  const natBS  = String(s.nativeBestsellers).padStart(10);
  return `  ${col.padEnd(8)} ${total} ${nat} ${adp} ${cov} ${bs} ${natBS}`;
}

const timestamp = new Date().toISOString().replace("T", " ").substring(0, 19) + " UTC";

// ── Report output ─────────────────────────────────────────────────────────────

console.log(`\n${DBAR}`);
console.log("  Maison Knowledge Catalogue — Coverage Dashboard");
console.log(`  Last Updated: ${timestamp}`);
console.log(DBAR);

// Overview
console.log("\n  CATALOGUE OVERVIEW");
console.log(BAR);
console.log(row("Total Catalogue",    totalCount,  `(Skye: ${stats.Skye.total}  Rose: ${stats.Rose.total}  Elite: ${stats.Elite.total})`));
console.log(row("Native Records",     nativeCount,  `(${pct(nativeCount, totalCount)})`));
console.log(row("Adapter Records",    adapterCount, `(${pct(adapterCount, totalCount)})`));

// Priority metrics
console.log("\n  PRIORITY METRICS");
console.log(BAR);
console.log(row("Native Coverage",       `${pct(nativeCount, totalCount)}`,       `(${nativeCount} / ${totalCount})`));
console.log(row("Bestseller Coverage",   `${pct(nativeBestsellerCount, totalBestsellers)}`, `(${nativeBestsellerCount} / ${totalBestsellers})`));
console.log(row("Validation Pass Rate",  `${pct(validationPassed, nativeCount)}`, `(${validationPassed} / ${nativeCount})`));
if (validationWarned > 0 || validationFailed > 0) {
  console.log(row("  Warnings",   validationWarned));
  console.log(row("  Failures",   validationFailed));
}

// Collection coverage table
console.log("\n  COLLECTION COVERAGE");
console.log(BAR);
console.log(`  ${"Collection".padEnd(8)} ${"Total".padStart(5)} ${"Native".padStart(7)} ${"Adapter".padStart(8)} ${"Coverage".padStart(9)} ${"Bestsellers".padStart(12)} ${"BS Native".padStart(10)}`);
console.log(`  ${BAR.slice(2)}`);
console.log(collRow("Skye",  stats.Skye));
console.log(collRow("Rose",  stats.Rose));
console.log(collRow("Elite", stats.Elite));

// Knowledge quality
console.log("\n  KNOWLEDGE QUALITY  (native records only)");
console.log(BAR);
console.log(row("Description",     `${pct(withDescription,    nativeCount)}`, `(${withDescription} / ${nativeCount})`));
console.log(row("Academy Links",   `${pct(withAcademyLinks,   nativeCount)}`, `(${withAcademyLinks} / ${nativeCount})`));
console.log(row("Education Tags",  `${pct(withEducationTags,  nativeCount)}`, `(${withEducationTags} / ${nativeCount})`));
console.log(row("Learning Path",   `${pct(withLearningPath,   nativeCount)}`, `(${withLearningPath} / ${nativeCount})`));
console.log(row("Recommended For", `${pct(withRecommendedFor, nativeCount)}`, `(${withRecommendedFor} / ${nativeCount})`));

// Migration remaining
console.log("\n  MIGRATION REMAINING");
console.log(BAR);
console.log(row("Wave 1 (bestsellers)",  wave1Remaining,              "(highest priority)"));
console.log(row("Skye remaining",        stats.Skye.adapter,          ""));
console.log(row("Rose remaining",        stats.Rose.adapter,          ""));
console.log(row("Elite remaining",       stats.Elite.adapter,         ""));
console.log(row("Total remaining",       adapterCount,                ""));

console.log(`\n  See docs/mkc-migration-plan.md for wave definitions and roadmap.`);
console.log(`\n${DBAR}\n`);
