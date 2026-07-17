/**
 * Academy Knowledge Graph Validator — EP13.0-P4
 *
 * Validates the complete Academy knowledge base for structural integrity,
 * relationship consistency, metadata compliance, and recommendation diversity.
 *
 * Checks performed:
 *   1.  Catalogue ↔ Registry synchronisation
 *   2.  Duplicate slug detection
 *   3.  Broken relatedArticleIds
 *   4.  Broken recommendedArticleIds
 *   5.  Category type compliance
 *   6.  Category consistency between catalogue and registry
 *   7.  MKC family taxonomy compliance
 *   8.  Empty relationship warnings
 *   9.  Self-reference detection
 *  10.  Recommendation diversity simulation (6 fragrance scenarios)
 *
 * READ-ONLY: This script performs no writes, no fixes, and no repository
 * modifications. It is a reporting and validation tool only.
 *
 * Usage: npm run academy:validate
 */

import { academyCatalogue }        from "../app/lib/academy/catalogue";
import { ARTICLE_REGISTRY }        from "../app/lib/academy/registry";
import { mkcCatalogue }            from "../app/lib/mkc/catalogue";
import type { AcademyArticle }     from "../app/lib/academy/types";
import type { ArticleRegistryEntry } from "../app/lib/academy/registry";
import type { FragranceKnowledge } from "../app/lib/mkc/types";

// ── MKC family taxonomy ───────────────────────────────────────────────────────
// Derived from grep of all 93 native records. Used to validate registry entries.

const MKC_FAMILY_TAXONOMY = new Set([
  "Amber", "Vanilla", "Aromatic", "Spicy", "Leather", "Aquatic",
  "Woody", "White Floral", "Fruity", "Musk", "Citrus", "Fresh",
  "Floral", "Rose", "Gourmand", "Sweet", "Oud", "Tobacco", "Powdery",
]);

// ── Valid AcademyCategory values ──────────────────────────────────────────────

const VALID_CATEGORIES = new Set([
  "Fragrance Families",
  "The Note Pyramid",
  "Wear & Application",
  "Scent Science",
  "Occasions & Style",
  "Fragrance Fundamentals",
]);

// ── Scoring constants (mirrors recommendAcademyArticles.ts) ───────────────────

const UNIVERSAL_SCORE         = 30;
const UNIVERSAL_FAMILY_SCORE  = 20;
const UNIVERSAL_OCCASION_SCORE = 15;
const FAMILY_MATCH_SCORE      = 10;
const OCCASION_MATCH_SCORE    = 10;
const SEASON_MATCH_SCORE      = 15;
const EXPLICIT_ARTICLE_SCORE  = 50;

// ── Types ─────────────────────────────────────────────────────────────────────

interface Issue {
  severity: "ERROR" | "WARN";
  slug: string;
  message: string;
}

interface SimulationResult {
  label: string;
  fragrance: string;
  family: string[];
  occasions: string[];
  topArticles: Array<{ slug: string; score: number; category: string }>;
}

// ── Scoring function (local, mirroring the engine) ────────────────────────────

function scoreEntry(entry: ArticleRegistryEntry, frag: FragranceKnowledge): number {
  let score = 0;

  if (entry.universalRelevance)            score += UNIVERSAL_SCORE;
  if (entry.families.length === 0)         score += UNIVERSAL_FAMILY_SCORE;
  else {
    for (const fam of frag.family) {
      if (entry.families.includes(fam))    score += FAMILY_MATCH_SCORE;
    }
  }

  if (entry.occasions.length === 0)        score += UNIVERSAL_OCCASION_SCORE;
  else {
    const fragOcc = frag.occasions.map((o) => o.toLowerCase());
    for (const ao of entry.occasions) {
      if (fragOcc.includes(ao))            score += OCCASION_MATCH_SCORE;
    }
  }

  const isSeasonSpecific = frag.season.toLowerCase() !== "all season";
  if (entry.seasonal && isSeasonSpecific)  score += SEASON_MATCH_SCORE;

  if (frag.academyArticleIds?.includes(entry.slug)) score += EXPLICIT_ARTICLE_SCORE;

  return score;
}

function rankArticles(frag: FragranceKnowledge, count = 5) {
  return ARTICLE_REGISTRY
    .map((entry) => ({ entry, score: scoreEntry(entry, frag) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(({ entry, score }) => ({
      slug: entry.slug,
      score,
      category: entry.category,
    }));
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const PAD = (s: string, n: number) => s.padEnd(n, " ").slice(0, n);
const LPAD = (s: string, n: number) => s.padStart(n, " ").slice(0, n);
const HR = (char = "─", n = 60) => char.repeat(n);

// ── Section 1: Integrity validation ──────────────────────────────────────────

function validateIntegrity(): Issue[] {
  const issues: Issue[] = [];
  const catalogueSlugs = new Set(academyCatalogue.map((a) => a.slug));
  const registrySlugs  = new Set(ARTICLE_REGISTRY.map((e) => e.slug));

  const addErr  = (slug: string, msg: string) => issues.push({ severity: "ERROR", slug, message: msg });
  const addWarn = (slug: string, msg: string) => issues.push({ severity: "WARN",  slug, message: msg });

  // ── 1. Duplicate slugs ────────────────────────────────────────────────────
  const seenC = new Set<string>();
  for (const a of academyCatalogue) {
    if (seenC.has(a.slug)) addErr(a.slug, "Duplicate slug in catalogue");
    seenC.add(a.slug);
  }

  const seenR = new Set<string>();
  for (const e of ARTICLE_REGISTRY) {
    if (seenR.has(e.slug)) addErr(e.slug, "Duplicate slug in registry");
    seenR.add(e.slug);
  }

  // ── 2. Catalogue ↔ Registry sync ─────────────────────────────────────────
  for (const a of academyCatalogue) {
    if (!registrySlugs.has(a.slug))
      addErr(a.slug, "Catalogue article has no registry entry");
  }

  for (const e of ARTICLE_REGISTRY) {
    if (!catalogueSlugs.has(e.slug))
      addErr(e.slug, "Registry entry has no catalogue article");
  }

  // ── 3. relatedArticleIds resolution ──────────────────────────────────────
  for (const a of academyCatalogue) {
    for (const rel of a.relatedArticleIds ?? []) {
      if (rel === a.slug)
        addErr(a.slug, `Self-referencing relatedArticleId: ${rel}`);
      else if (!catalogueSlugs.has(rel))
        addErr(a.slug, `Broken relatedArticleId: "${rel}"`);
    }
  }

  // ── 4. recommendedArticleIds resolution ──────────────────────────────────
  for (const a of academyCatalogue) {
    for (const rec of a.recommendedArticleIds ?? []) {
      if (rec === a.slug)
        addErr(a.slug, `Self-referencing recommendedArticleId: ${rec}`);
      else if (!catalogueSlugs.has(rec))
        addErr(a.slug, `Broken recommendedArticleId: "${rec}"`);
    }
  }

  // ── 5. Category type compliance ───────────────────────────────────────────
  for (const a of academyCatalogue) {
    if (!VALID_CATEGORIES.has(a.category))
      addErr(a.slug, `Invalid category: "${a.category}"`);
  }

  // ── 6. Category consistency between catalogue and registry ────────────────
  for (const e of ARTICLE_REGISTRY) {
    const a = academyCatalogue.find((x) => x.slug === e.slug);
    if (a && a.category !== e.category)
      addErr(e.slug, `Category mismatch — catalogue: "${a.category}" vs registry: "${e.category}"`);
  }

  // ── 7. MKC family taxonomy compliance ────────────────────────────────────
  for (const e of ARTICLE_REGISTRY) {
    for (const fam of e.families) {
      if (!MKC_FAMILY_TAXONOMY.has(fam))
        addErr(e.slug, `Unknown MKC family: "${fam}"`);
    }
  }

  // ── 8. Empty relationship warnings ───────────────────────────────────────
  for (const a of academyCatalogue) {
    if (!a.relatedArticleIds?.length)
      addWarn(a.slug, "relatedArticleIds is empty or absent");
    if (!a.recommendedArticleIds?.length)
      addWarn(a.slug, "recommendedArticleIds is empty or absent");
  }

  return issues;
}

// ── Section 2: Metrics ────────────────────────────────────────────────────────

function computeMetrics() {
  const byCategory  = new Map<string, AcademyArticle[]>();
  const byDiff      = new Map<string, ArticleRegistryEntry[]>();
  const familyCount = new Map<string, number>();
  const occCount    = new Map<string, number>();

  for (const a of academyCatalogue) {
    if (!byCategory.has(a.category)) byCategory.set(a.category, []);
    byCategory.get(a.category)!.push(a);
  }

  for (const e of ARTICLE_REGISTRY) {
    if (!byDiff.has(e.difficulty)) byDiff.set(e.difficulty, []);
    byDiff.get(e.difficulty)!.push(e);

    for (const f of e.families)   familyCount.set(f, (familyCount.get(f) ?? 0) + 1);
    for (const o of e.occasions)  occCount.set(o,    (occCount.get(o)    ?? 0) + 1);
  }

  const universalFamily   = ARTICLE_REGISTRY.filter((e) => e.families.length === 0).length;
  const universalOccasion = ARTICLE_REGISTRY.filter((e) => e.occasions.length === 0).length;
  const universalRelevance = ARTICLE_REGISTRY.filter((e) => e.universalRelevance).length;

  let totalRelated = 0, totalRecommended = 0;
  for (const a of academyCatalogue) {
    totalRelated     += a.relatedArticleIds?.length     ?? 0;
    totalRecommended += a.recommendedArticleIds?.length ?? 0;
  }
  const n = academyCatalogue.length;
  const avgRelated     = (totalRelated / n).toFixed(1);
  const avgRecommended = (totalRecommended / n).toFixed(1);

  // Connectivity: articles with fewest outbound links (weak nodes)
  const weakNodes = academyCatalogue
    .map((a) => ({
      slug: a.slug,
      total: (a.relatedArticleIds?.length ?? 0) + (a.recommendedArticleIds?.length ?? 0),
    }))
    .sort((a, b) => a.total - b.total)
    .slice(0, 5);

  return {
    byCategory, byDiff, familyCount, occCount,
    universalFamily, universalOccasion, universalRelevance,
    avgRelated, avgRecommended, weakNodes,
  };
}

// ── Section 3: Recommendation simulation ─────────────────────────────────────

function buildSimulations(): SimulationResult[] {
  // Find representative MKC records for each scenario
  const find = (predicate: (f: FragranceKnowledge) => boolean) =>
    mkcCatalogue.find(predicate);

  const scenarios: Array<{ label: string; predicate: (f: FragranceKnowledge) => boolean }> = [
    { label: "Floral",   predicate: (f) => f.family.includes("Floral") && f.family.includes("Rose") },
    { label: "Woody",    predicate: (f) => f.family.includes("Woody") && f.family.includes("Aromatic") },
    { label: "Gourmand", predicate: (f) => f.family.includes("Gourmand") && f.family.includes("Sweet") },
    { label: "Fresh",    predicate: (f) => f.family.includes("Fresh") && f.family.includes("Citrus") },
    { label: "Evening",  predicate: (f) => f.occasions.some((o) => o.toLowerCase().includes("evening")) },
    { label: "Office",   predicate: (f) => f.occasions.some((o) => o.toLowerCase().includes("office")) },
  ];

  const results: SimulationResult[] = [];

  for (const scenario of scenarios) {
    const frag = find(scenario.predicate);
    if (!frag) {
      results.push({
        label: scenario.label,
        fragrance: "(no matching record found)",
        family: [],
        occasions: [],
        topArticles: [],
      });
      continue;
    }

    results.push({
      label: scenario.label,
      fragrance: frag.name,
      family: frag.family,
      occasions: frag.occasions,
      topArticles: rankArticles(frag, 5),
    });
  }

  return results;
}

// ── Renderer ──────────────────────────────────────────────────────────────────

function render() {
  const issues  = validateIntegrity();
  const metrics = computeMetrics();
  const sims    = buildSimulations();

  const errors   = issues.filter((i) => i.severity === "ERROR");
  const warnings = issues.filter((i) => i.severity === "WARN");

  console.log();
  console.log("╔" + HR("═") + "╗");
  console.log("║" + "  Academy Knowledge Graph Validator — EP13.0-P4".padEnd(60) + "║");
  console.log("╚" + HR("═") + "╝");
  console.log();

  // ── Integrity Results ────────────────────────────────────────────────────

  console.log(HR());
  console.log(`INTEGRITY VALIDATION`);
  console.log(HR());
  console.log();

  if (errors.length === 0 && warnings.length === 0) {
    console.log("  ✓ No errors. No warnings. Knowledge graph is clean.");
  } else {
    if (errors.length > 0) {
      console.log(`  ✗ ${errors.length} ERROR(S):`);
      for (const e of errors) {
        console.log(`    [${e.slug}] ${e.message}`);
      }
      console.log();
    }
    if (warnings.length > 0) {
      console.log(`  ⚠ ${warnings.length} WARNING(S):`);
      for (const w of warnings) {
        console.log(`    [${w.slug}] ${w.message}`);
      }
    }
  }

  console.log();
  console.log(`  Catalogue articles : ${academyCatalogue.length}`);
  console.log(`  Registry entries   : ${ARTICLE_REGISTRY.length}`);
  console.log(`  Errors             : ${errors.length}`);
  console.log(`  Warnings           : ${warnings.length}`);
  console.log();

  // ── Coverage Metrics ─────────────────────────────────────────────────────

  console.log(HR());
  console.log(`ARTICLES PER CATEGORY`);
  console.log(HR());
  console.log();

  const categoryOrder = [
    "Fragrance Fundamentals",
    "Fragrance Families",
    "The Note Pyramid",
    "Wear & Application",
    "Occasions & Style",
    "Scent Science",
  ];

  for (const cat of categoryOrder) {
    const articles = metrics.byCategory.get(cat) ?? [];
    const slugList = articles.map((a) => a.slug).join(", ");
    const label = PAD(cat, 28);
    const count = LPAD(String(articles.length), 3);
    console.log(`  ${label} ${count}  ${slugList}`);
  }

  console.log();
  console.log(HR());
  console.log(`DIFFICULTY DISTRIBUTION`);
  console.log(HR());
  console.log();

  const diffOrder: Array<"beginner" | "intermediate" | "advanced"> = ["beginner", "intermediate", "advanced"];
  for (const diff of diffOrder) {
    const entries = metrics.byDiff.get(diff) ?? [];
    const slugs = entries.map((e) => e.slug).join(", ");
    const label = PAD(diff.charAt(0).toUpperCase() + diff.slice(1), 14);
    const count = LPAD(String(entries.length), 3);
    const pct   = LPAD(((entries.length / ARTICLE_REGISTRY.length) * 100).toFixed(0) + "%", 4);
    console.log(`  ${label} ${count}  ${pct}  |  ${slugs}`);
  }

  console.log();
  console.log(HR());
  console.log(`UNIVERSALITY`);
  console.log(HR());
  console.log();
  console.log(`  Universal family relevance (families=[])    : ${metrics.universalFamily} of ${ARTICLE_REGISTRY.length} articles`);
  console.log(`  Universal occasion relevance (occasions=[]) : ${metrics.universalOccasion} of ${ARTICLE_REGISTRY.length} articles`);
  console.log(`  Universal relevance flag (universalRelevance=true) : ${metrics.universalRelevance} of ${ARTICLE_REGISTRY.length} articles`);

  console.log();
  console.log(HR());
  console.log(`MKC FAMILY COVERAGE`);
  console.log(HR());
  console.log();

  const sortedFamilies = [...metrics.familyCount.entries()].sort((a, b) => b[1] - a[1]);
  for (const [family, count] of sortedFamilies) {
    const bar = "█".repeat(count);
    console.log(`  ${PAD(family, 14)} ${LPAD(String(count), 2)} article(s)  ${bar}`);
  }

  // Report families NOT covered by any targeted article
  const uncoveredFamilies = [...MKC_FAMILY_TAXONOMY].filter((f) => !metrics.familyCount.has(f));
  if (uncoveredFamilies.length > 0) {
    console.log();
    console.log(`  Families with no targeted article: ${uncoveredFamilies.join(", ")}`);
    console.log(`  (These still receive universal coverage from articles with families=[])`);
  }

  console.log();
  console.log(HR());
  console.log(`OCCASION COVERAGE`);
  console.log(HR());
  console.log();

  if (metrics.occCount.size === 0) {
    console.log(`  No occasion-specific articles.`);
  } else {
    const sortedOcc = [...metrics.occCount.entries()].sort((a, b) => b[1] - a[1]);
    for (const [occ, count] of sortedOcc) {
      console.log(`  ${PAD(occ, 20)} ${LPAD(String(count), 2)} article(s)`);
    }
  }

  console.log();
  console.log(HR());
  console.log(`KNOWLEDGE GRAPH CONNECTIVITY`);
  console.log(HR());
  console.log();
  console.log(`  Average relatedArticleIds per article    : ${metrics.avgRelated}`);
  console.log(`  Average recommendedArticleIds per article: ${metrics.avgRecommended}`);
  console.log();
  console.log(`  Least connected articles (by outbound link count):`);
  for (const node of metrics.weakNodes) {
    console.log(`    ${PAD(node.slug, 44)} ${LPAD(String(node.total), 2)} link(s)`);
  }

  // ── Recommendation Simulation ────────────────────────────────────────────

  console.log();
  console.log(HR());
  console.log(`RECOMMENDATION DIVERSITY SIMULATION`);
  console.log(HR());
  console.log();

  for (const sim of sims) {
    console.log(`  ┌─ ${sim.label.toUpperCase()} — ${sim.fragrance}`);
    if (sim.family.length) {
      console.log(`  │  Family: [${sim.family.join(", ")}]`);
      console.log(`  │  Occasions: [${sim.occasions.join(", ")}]`);
      console.log(`  │  Top recommendations:`);
      for (const r of sim.topArticles) {
        const tag = PAD(`[${r.category}]`, 26);
        console.log(`  │    ${LPAD(String(r.score), 3)} pts  ${tag}  ${r.slug}`);
      }
    } else {
      console.log(`  │  (no matching MKC record found)`);
    }
    console.log(`  └${"─".repeat(57)}`);
    console.log();
  }

  // ── Result ───────────────────────────────────────────────────────────────

  console.log(HR("═"));

  const status = errors.length === 0
    ? `✓  PASS — ${academyCatalogue.length} articles validated, 0 errors`
    : `✗  FAIL — ${errors.length} error(s) require attention`;

  console.log(status);

  if (warnings.length > 0) {
    console.log(`⚠  ${warnings.length} warning(s) noted above`);
  }

  console.log();

  // Exit with error code if any hard errors found
  if (errors.length > 0) {
    process.exit(1);
  }
}

render();
