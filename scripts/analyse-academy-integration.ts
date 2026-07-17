/**
 * Academy Integration Analysis — EP13.0-P5
 *
 * Scans all 93 MKC native records to produce:
 *   1. academyArticleIds frequency distribution
 *   2. learningPath frequency distribution
 *   3. Articles never referenced
 *   4. Family distribution across the catalogue
 *   5. Occasion distribution across the catalogue
 *   6. Per-family article gap analysis
 *   7. Per-occasion article gap analysis
 *   8. Record-level enrichment opportunities
 *
 * READ-ONLY: This script performs no writes, no modifications.
 *
 * Usage: npx tsx scripts/analyse-academy-integration.ts
 */

import { mkcCatalogue }      from "../app/lib/mkc/catalogue";
import { nativeFragrances }  from "../app/lib/mkc/native/index";
import { ARTICLE_REGISTRY }  from "../app/lib/academy/registry";
import { academyCatalogue }  from "../app/lib/academy/catalogue";
import type { FragranceKnowledge } from "../app/lib/mkc/types";

// ── Helpers ───────────────────────────────────────────────────────────────────

const PAD  = (s: string, n: number) => s.padEnd(n, " ").slice(0, n);
const LPAD = (s: string, n: number) => s.padStart(n, " ").slice(0, n);
const HR   = (c = "─", n = 64) => c.repeat(n);
const BAR  = (n: number, max: number, width = 30) =>
  "█".repeat(Math.round((n / max) * width)).padEnd(width, "·");

// ── Load data ─────────────────────────────────────────────────────────────────

const natives: FragranceKnowledge[] = [...nativeFragrances.values()];
const allSlugs = new Set(academyCatalogue.map((a) => a.slug));

// ── 1. academyArticleIds frequency ───────────────────────────────────────────

const articleIdFreq = new Map<string, number>();
let totalWithArticleIds = 0;
let totalArticleIdSlots = 0;

for (const f of natives) {
  const ids = f.academyArticleIds ?? [];
  if (ids.length > 0) totalWithArticleIds++;
  totalArticleIdSlots += ids.length;
  for (const id of ids) {
    articleIdFreq.set(id, (articleIdFreq.get(id) ?? 0) + 1);
  }
}

// ── 2. learningPath frequency ─────────────────────────────────────────────────

const pathFreq = new Map<string, number>();
let totalWithPath = 0;
let totalPathSlots = 0;

for (const f of natives) {
  const path = f.learningPath ?? [];
  if (path.length > 0) totalWithPath++;
  totalPathSlots += path.length;
  for (const id of path) {
    pathFreq.set(id, (pathFreq.get(id) ?? 0) + 1);
  }
}

// ── 3. Never-referenced articles ─────────────────────────────────────────────

const neverReferencedInIds  = academyCatalogue.filter((a) => !articleIdFreq.has(a.slug));
const neverReferencedInPath = academyCatalogue.filter((a) => !pathFreq.has(a.slug));

// ── 4. Family distribution ────────────────────────────────────────────────────

const familyDist    = new Map<string, number>();
const familyRecords = new Map<string, FragranceKnowledge[]>();

for (const f of natives) {
  for (const fam of f.family) {
    familyDist.set(fam, (familyDist.get(fam) ?? 0) + 1);
    if (!familyRecords.has(fam)) familyRecords.set(fam, []);
    familyRecords.get(fam)!.push(f);
  }
}

const sortedFamilies = [...familyDist.entries()].sort((a, b) => b[1] - a[1]);
const maxFamilyCount = Math.max(...familyDist.values());

// ── 5. Occasion distribution ──────────────────────────────────────────────────

const occDist    = new Map<string, number>();
const occRecords = new Map<string, FragranceKnowledge[]>();

for (const f of natives) {
  for (const occ of f.occasions) {
    const key = occ.toLowerCase();
    occDist.set(key, (occDist.get(key) ?? 0) + 1);
    if (!occRecords.has(key)) occRecords.set(key, []);
    occRecords.get(key)!.push(f);
  }
}

const sortedOccasions = [...occDist.entries()].sort((a, b) => b[1] - a[1]);
const maxOccCount = Math.max(...occDist.values());

// ── 6. Per-family article gap analysis ───────────────────────────────────────
// For each MKC family, identify which Academy articles target it and which
// records in that family have zero family-specific article in their academyArticleIds.

interface FamilyGap {
  family: string;
  recordCount: number;
  targetingArticles: string[];   // Academy articles that target this family
  recordsMissingArticles: number; // Records that don't yet reference any targeting article
  sampleRecords: string[];
}

function getFamilyGaps(): FamilyGap[] {
  const gaps: FamilyGap[] = [];

  for (const [family, count] of sortedFamilies) {
    const targetingArticles = ARTICLE_REGISTRY
      .filter((e) => e.families.includes(family))
      .map((e) => e.slug);

    const records = familyRecords.get(family) ?? [];
    const missingRecords = records.filter((f) => {
      const ids = f.academyArticleIds ?? [];
      return !ids.some((id) => targetingArticles.includes(id));
    });

    gaps.push({
      family,
      recordCount: count,
      targetingArticles,
      recordsMissingArticles: missingRecords.length,
      sampleRecords: missingRecords.slice(0, 3).map((f) => f.slug),
    });
  }

  return gaps.sort((a, b) => b.recordsMissingArticles - a.recordsMissingArticles);
}

const familyGaps = getFamilyGaps();

// ── 7. Per-occasion article gap analysis ─────────────────────────────────────

interface OccasionGap {
  occasion: string;
  recordCount: number;
  targetingArticles: string[];
  recordsMissingArticles: number;
  sampleRecords: string[];
}

function getOccasionGaps(): OccasionGap[] {
  const gaps: OccasionGap[] = [];

  for (const [occasion, count] of sortedOccasions) {
    const targetingArticles = ARTICLE_REGISTRY
      .filter((e) => e.occasions.includes(occasion))
      .map((e) => e.slug);

    if (targetingArticles.length === 0) continue; // No article targets this occasion

    const records = occRecords.get(occasion) ?? [];
    const missingRecords = records.filter((f) => {
      const ids = f.academyArticleIds ?? [];
      return !ids.some((id) => targetingArticles.includes(id));
    });

    gaps.push({
      occasion,
      recordCount: count,
      targetingArticles,
      recordsMissingArticles: missingRecords.length,
      sampleRecords: missingRecords.slice(0, 3).map((f) => f.slug),
    });
  }

  return gaps.sort((a, b) => b.recordsMissingArticles - a.recordsMissingArticles);
}

const occasionGaps = getOccasionGaps();

// ── 8. Enrichment opportunity per record (top candidates) ────────────────────

interface EnrichmentCandidate {
  slug: string;
  name: string;
  family: string[];
  occasions: string[];
  currentIds: string[];
  suggestedAdditions: string[];
  currentPathSlugs: string[];
  suggestedPathAdditions: string[];
}

function computeEnrichmentCandidates(): EnrichmentCandidate[] {
  const candidates: EnrichmentCandidate[] = [];

  for (const f of natives) {
    const currentIds  = f.academyArticleIds ?? [];
    const currentPath = f.learningPath ?? [];
    const suggested: string[] = [];
    const suggestedPath: string[] = [];

    // Family-specific articles
    for (const fam of f.family) {
      const familyArticles = ARTICLE_REGISTRY
        .filter((e) => e.families.includes(fam))
        .map((e) => e.slug);
      for (const slug of familyArticles) {
        if (!currentIds.includes(slug) && !suggested.includes(slug)) {
          suggested.push(slug);
        }
        if (!currentPath.includes(slug) && !suggestedPath.includes(slug)) {
          suggestedPath.push(slug);
        }
      }
    }

    // Occasion-specific articles
    for (const occ of f.occasions) {
      const key = occ.toLowerCase();
      const occArticles = ARTICLE_REGISTRY
        .filter((e) => e.occasions.includes(key))
        .map((e) => e.slug);
      for (const slug of occArticles) {
        if (!currentIds.includes(slug) && !suggested.includes(slug)) {
          suggested.push(slug);
        }
      }
    }

    // Science articles for special cases
    // (Scent science is relevant to everyone but particularly to complex fragrances)
    const scienceArticles = ["why-fragrances-smell-different-on-everyone", "the-science-of-longevity-and-projection"];
    if (f.projection === "strong" || f.scentCharacter === "Deep & Intense") {
      for (const slug of scienceArticles) {
        if (!currentIds.includes(slug) && !suggested.includes(slug)) {
          suggested.push(slug);
        }
      }
    }

    if (suggested.length > 0 || suggestedPath.length > 0) {
      candidates.push({
        slug:                   f.slug,
        name:                   f.name,
        family:                 f.family,
        occasions:              f.occasions,
        currentIds,
        suggestedAdditions:     suggested,
        currentPathSlugs:       currentPath,
        suggestedPathAdditions: suggestedPath,
      });
    }
  }

  // Sort by number of suggested additions descending
  return candidates.sort((a, b) => b.suggestedAdditions.length - a.suggestedAdditions.length);
}

const enrichmentCandidates = computeEnrichmentCandidates();

// ── Renderer ──────────────────────────────────────────────────────────────────

console.log();
console.log("╔" + HR("═") + "╗");
console.log("║" + "  Academy Integration Analysis — EP13.0-P5".padEnd(64) + "║");
console.log("╚" + HR("═") + "╝");
console.log();

// ── Section 1: Summary ────────────────────────────────────────────────────────

console.log(HR());
console.log("CURRENT ASSOCIATION SUMMARY");
console.log(HR());
console.log();
console.log(`  Native records scanned          : ${natives.length}`);
console.log(`  Academy articles available      : ${academyCatalogue.length}`);
console.log();
console.log(`  Records with academyArticleIds  : ${totalWithArticleIds} of ${natives.length} (${((totalWithArticleIds/natives.length)*100).toFixed(0)}%)`);
console.log(`  Total article ID slots used     : ${totalArticleIdSlots}`);
console.log(`  Average IDs per record          : ${(totalArticleIdSlots / natives.length).toFixed(1)}`);
console.log();
console.log(`  Records with learningPath       : ${totalWithPath} of ${natives.length} (${((totalWithPath/natives.length)*100).toFixed(0)}%)`);
console.log(`  Total learning path slots used  : ${totalPathSlots}`);
console.log(`  Average path length per record  : ${(totalPathSlots / natives.length).toFixed(1)}`);
console.log();

// ── Section 2: academyArticleIds frequency ───────────────────────────────────

console.log(HR());
console.log("academyArticleIds FREQUENCY DISTRIBUTION");
console.log(HR());
console.log();

const sortedByFreq = [...articleIdFreq.entries()].sort((a, b) => b[1] - a[1]);
const maxFreq = sortedByFreq[0]?.[1] ?? 1;

for (const [slug, count] of sortedByFreq) {
  const pct = ((count / natives.length) * 100).toFixed(0);
  console.log(`  ${PAD(slug, 42)} ${LPAD(String(count), 3)} (${LPAD(pct, 3)}%)  ${BAR(count, maxFreq)}`);
}

if (neverReferencedInIds.length > 0) {
  console.log();
  console.log(`  Never referenced in academyArticleIds (${neverReferencedInIds.length} articles):`);
  for (const a of neverReferencedInIds) {
    console.log(`    ○ ${a.slug}  [${a.category}]`);
  }
}

console.log();

// ── Section 3: learningPath frequency ────────────────────────────────────────

console.log(HR());
console.log("learningPath FREQUENCY DISTRIBUTION");
console.log(HR());
console.log();

const sortedPathByFreq = [...pathFreq.entries()].sort((a, b) => b[1] - a[1]);
const maxPathFreq = sortedPathByFreq[0]?.[1] ?? 1;

for (const [slug, count] of sortedPathByFreq) {
  const pct = ((count / natives.length) * 100).toFixed(0);
  console.log(`  ${PAD(slug, 42)} ${LPAD(String(count), 3)} (${LPAD(pct, 3)}%)  ${BAR(count, maxPathFreq)}`);
}

if (neverReferencedInPath.length > 0) {
  console.log();
  console.log(`  Never referenced in learningPath (${neverReferencedInPath.length} articles):`);
  for (const a of neverReferencedInPath) {
    console.log(`    ○ ${a.slug}  [${a.category}]`);
  }
}

console.log();

// ── Section 4: Family distribution ───────────────────────────────────────────

console.log(HR());
console.log("MKC FAMILY DISTRIBUTION (93 native records)");
console.log(HR());
console.log();

for (const [family, count] of sortedFamilies) {
  console.log(`  ${PAD(family, 16)} ${LPAD(String(count), 3)} records  ${BAR(count, maxFamilyCount)}`);
}

console.log();

// ── Section 5: Occasion distribution ─────────────────────────────────────────

console.log(HR());
console.log("OCCASION DISTRIBUTION (93 native records)");
console.log(HR());
console.log();

for (const [occ, count] of sortedOccasions) {
  console.log(`  ${PAD(occ, 24)} ${LPAD(String(count), 3)} records  ${BAR(count, maxOccCount)}`);
}

console.log();

// ── Section 6: Family article gaps ───────────────────────────────────────────

console.log(HR());
console.log("PER-FAMILY ARTICLE GAP ANALYSIS");
console.log(HR());
console.log();

for (const gap of familyGaps) {
  if (gap.targetingArticles.length === 0) {
    console.log(`  ${PAD(gap.family, 14)} ${gap.recordCount} records  → No targeting article exists`);
    continue;
  }
  const coverage = ((gap.recordCount - gap.recordsMissingArticles) / gap.recordCount * 100).toFixed(0);
  const icon = gap.recordsMissingArticles === 0 ? "✓" : "○";
  console.log(`  ${icon} ${PAD(gap.family, 14)} ${LPAD(String(gap.recordCount), 3)} records  coverage ${LPAD(coverage, 3)}%  ${gap.targetingArticles.join(", ")}`);
  if (gap.recordsMissingArticles > 0) {
    console.log(`    Missing: ${gap.recordsMissingArticles} records — e.g. ${gap.sampleRecords.join(", ")}`);
  }
}

console.log();

// ── Section 7: Occasion article gaps ─────────────────────────────────────────

console.log(HR());
console.log("PER-OCCASION ARTICLE GAP ANALYSIS");
console.log(HR());
console.log();

for (const gap of occasionGaps) {
  const coverage = ((gap.recordCount - gap.recordsMissingArticles) / gap.recordCount * 100).toFixed(0);
  const icon = gap.recordsMissingArticles === 0 ? "✓" : "○";
  console.log(`  ${icon} ${PAD(gap.occasion, 22)} ${LPAD(String(gap.recordCount), 3)} records  coverage ${LPAD(coverage, 3)}%  ${gap.targetingArticles.join(", ")}`);
  if (gap.recordsMissingArticles > 0) {
    console.log(`    Missing: ${gap.recordsMissingArticles} records — e.g. ${gap.sampleRecords.join(", ")}`);
  }
}

console.log();

// ── Section 8: Top enrichment candidates ─────────────────────────────────────

console.log(HR());
console.log("TOP ENRICHMENT CANDIDATES (by number of missing associations)");
console.log(HR());
console.log();

for (const c of enrichmentCandidates.slice(0, 15)) {
  console.log(`  ${c.slug}`);
  console.log(`    Family: [${c.family.join(", ")}]   Occasions: [${c.occasions.slice(0, 3).join(", ")}]`);
  console.log(`    Current:   ${c.currentIds.join(", ")}`);
  if (c.suggestedAdditions.length) {
    console.log(`    + Add IDs: ${c.suggestedAdditions.join(", ")}`);
  }
  if (c.suggestedPathAdditions.length) {
    console.log(`    + Add Path: ${c.suggestedPathAdditions.join(", ")}`);
  }
  console.log();
}

if (enrichmentCandidates.length > 15) {
  console.log(`  ... and ${enrichmentCandidates.length - 15} more records with enrichment opportunities.`);
}

console.log();
console.log(HR("═"));
console.log(`Analysis complete — ${natives.length} records scanned, ${academyCatalogue.length} articles evaluated.`);
console.log();
