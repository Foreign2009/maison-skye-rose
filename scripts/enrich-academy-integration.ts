#!/usr/bin/env npx tsx
/**
 * EP13.0-P5 — enrich-academy-integration.ts
 *
 * Merges family-specific and occasion-specific Academy article associations
 * into each MKC native record's academyArticleIds and learningPath fields.
 * Preserves existing editorial associations. Trims to defined maximums.
 *
 * Usage:
 *   npx tsx scripts/enrich-academy-integration.ts --dry-run
 *   npx tsx scripts/enrich-academy-integration.ts --apply
 */

import fs   from "fs";
import path from "path";
import { nativeFragrances } from "../app/lib/mkc/native/index";
import type { FragranceKnowledge } from "../app/lib/mkc/types";
import { academyCatalogue } from "../app/lib/academy/catalogue";

// ── CLI ───────────────────────────────────────────────────────────────────────

const isDryRun = process.argv.includes("--dry-run");
const isApply  = process.argv.includes("--apply");

if (!isDryRun && !isApply) {
  console.error("Usage: npx tsx scripts/enrich-academy-integration.ts [--dry-run | --apply]");
  process.exit(1);
}

// ── Constants ─────────────────────────────────────────────────────────────────

const MAX_IDS  = 6;
const MAX_PATH = 5;

const NATIVE_DIR = path.resolve(process.cwd(), "app/lib/mkc/native");
const VALID      = new Set(academyCatalogue.map(a => a.slug));

// ── Mappings ──────────────────────────────────────────────────────────────────

// One primary article per family. Order within each array = priority.
const FAMILY_ARTICLES: Record<string, string[]> = {
  "Amber":        ["oriental-and-amber-fragrances",           "vanilla-and-amber-the-warm-base"],
  "Vanilla":      ["vanilla-and-amber-the-warm-base",         "oriental-and-amber-fragrances"],
  "Spicy":        ["oriental-and-amber-fragrances"],
  "Floral":       ["the-world-of-floral-fragrances"],
  "Rose":         ["the-world-of-floral-fragrances"],
  "White Floral": ["the-world-of-floral-fragrances"],
  "Woody":        ["woody-fragrances-explained"],
  "Oud":          ["oud-the-worlds-most-complex-ingredient",  "woody-fragrances-explained"],
  "Tobacco":      ["oud-the-worlds-most-complex-ingredient"],
  "Leather":      ["oud-the-worlds-most-complex-ingredient"],
  "Fresh":        ["fresh-citrus-and-aquatic-fragrances"],
  "Citrus":       ["fresh-citrus-and-aquatic-fragrances"],
  "Aquatic":      ["fresh-citrus-and-aquatic-fragrances"],
  "Aromatic":     ["fresh-citrus-and-aquatic-fragrances",     "office-and-professional-fragrances"],
  "Fruity":       ["weekend-and-casual-fragrances"],
  "Gourmand":     ["gourmand-fragrances-guide",                "vanilla-and-amber-the-warm-base"],
  "Sweet":        ["gourmand-fragrances-guide"],
  "Musk":         ["musks-the-hidden-foundation"],
  "Powdery":      [],
};

const OCCASION_ARTICLE: Record<string, string> = {
  "evening":         "evening-and-date-night-fragrances",
  "date night":      "evening-and-date-night-fragrances",
  "formal events":   "evening-and-date-night-fragrances",
  "formal":          "evening-and-date-night-fragrances",
  "wedding":         "evening-and-date-night-fragrances",
  "social events":   "evening-and-date-night-fragrances",
  "office":          "office-and-professional-fragrances",
  "daily wear":      "office-and-professional-fragrances",
  "business":        "office-and-professional-fragrances",
  "weekend":         "weekend-and-casual-fragrances",
  "casual":          "weekend-and-casual-fragrances",
  "vacation":        "weekend-and-casual-fragrances",
  "travel":          "weekend-and-casual-fragrances",
  "summer days":     "fresh-citrus-and-aquatic-fragrances",
  "winter evenings": "choosing-your-season-scent",
  "winter days":     "choosing-your-season-scent",
  "autumn evenings": "choosing-your-season-scent",
};

const FOUNDATIONS = [
  "the-note-pyramid-explained",
  "guide-to-fragrance-families",
];

const APPLICATION_PRIORITY = [
  "what-makes-a-signature-scent",
  "choosing-your-season-scent",
  "how-to-layer-fragrances",
  "how-to-wear-fragrance",
];

// ── Enrichment logic ──────────────────────────────────────────────────────────

interface Enrichment {
  academyArticleIds: string[];
  learningPath: string[];
}

function dedup(items: string[]): string[] {
  const seen = new Set<string>();
  return items.filter(x => seen.has(x) ? false : (seen.add(x), true));
}

function computeEnrichment(record: FragranceKnowledge): Enrichment {
  const existing  = (record.academyArticleIds ?? []).filter(id => VALID.has(id));
  const families  = record.family ?? [];
  const occasions = (record.occasions ?? []).map(o => o.toLowerCase());

  // Primary article per family: 1 article per family, up to 2 families covered.
  // This ensures diverse family representation rather than exhausting slots on one family.
  const primaryFamily: string[] = [];
  for (const fam of families) {
    const primary = (FAMILY_ARTICLES[fam] ?? [])[0];
    if (primary && !primaryFamily.includes(primary)) primaryFamily.push(primary);
    if (primaryFamily.length >= 2) break;
  }

  // Secondary family articles for slot-filling only
  const secondaryFamily: string[] = [];
  for (const fam of families) {
    for (const a of (FAMILY_ARTICLES[fam] ?? []).slice(1)) {
      if (!primaryFamily.includes(a) && !secondaryFamily.includes(a)) {
        secondaryFamily.push(a);
      }
    }
  }

  // Occasion candidates in priority order
  const occasionCandidates: string[] = dedup(
    occasions.flatMap(occ => {
      const a = OCCASION_ARTICLE[occ];
      return a ? [a] : [];
    }),
  );
  const primaryOccasion = occasionCandidates[0];

  // ── academyArticleIds ────────────────────────────────────────────────────────
  // Slot allocation: 2 foundations + 2 primary family + 1 occasion + 1 application = 6
  const ids: string[] = dedup([
    ...FOUNDATIONS,
    ...primaryFamily,
    ...(primaryOccasion ? [primaryOccasion] : []),
  ]);

  // Fill remaining slots: existing application articles first (in priority order)
  for (const a of APPLICATION_PRIORITY) {
    if (ids.length >= MAX_IDS) break;
    if (existing.includes(a) && !ids.includes(a)) ids.push(a);
  }

  // Then secondary family articles
  for (const a of secondaryFamily) {
    if (ids.length >= MAX_IDS) break;
    if (!ids.includes(a)) ids.push(a);
  }

  // Then any remaining existing valid articles
  for (const a of existing) {
    if (ids.length >= MAX_IDS) break;
    if (!ids.includes(a)) ids.push(a);
  }

  const academyArticleIds = ids.slice(0, MAX_IDS);

  // ── learningPath ─────────────────────────────────────────────────────────────
  // Ordered progression: foundation → family → occasion → application
  const pathItems: string[] = [...FOUNDATIONS];

  if (primaryFamily[0] && !pathItems.includes(primaryFamily[0])) {
    pathItems.push(primaryFamily[0]);
  }

  if (primaryOccasion && !pathItems.includes(primaryOccasion)) {
    pathItems.push(primaryOccasion);
  }

  const appArticle = selectApplicationArticle(record, existing);
  if (appArticle && !pathItems.includes(appArticle)) {
    pathItems.push(appArticle);
  }

  return {
    academyArticleIds,
    learningPath: pathItems.slice(0, MAX_PATH),
  };
}

function selectApplicationArticle(
  record: FragranceKnowledge,
  existing: string[],
): string {
  // Seasonal records: guide the customer on when to wear this fragrance
  if (record.season && record.season !== "All Season") {
    return "choosing-your-season-scent";
  }
  // Complex/rich families that reward layering technique
  const isComplex = (record.family ?? []).some(f =>
    ["Oud", "Amber", "Gourmand", "Vanilla"].includes(f),
  );
  if (isComplex && existing.includes("how-to-layer-fragrances")) {
    return "how-to-layer-fragrances";
  }
  // Signature / bestseller: reinforce identity and ownership
  if (record.bestSeller === true || (record.scentCharacter ?? "").includes("Signature")) {
    return "what-makes-a-signature-scent";
  }
  return "how-to-wear-fragrance";
}

// ── File patching ─────────────────────────────────────────────────────────────

function formatArray(items: string[], eol: string): string {
  const lines = items.map(s => `    "${s}",`).join(eol);
  return `[${eol}${lines}${eol}  ]`;
}

function patchSource(source: string, ids: string[], lp: string[]): string {
  const eol = source.includes("\r\n") ? "\r\n" : "\n";
  let out = source;

  out = out.replace(
    /(academyArticleIds\s*:\s*)\[[\s\S]*?\],?/,
    (_, prefix) => `${prefix}${formatArray(ids, eol)},`,
  );

  out = out.replace(
    /(learningPath\s*:\s*)\[[\s\S]*?\],?/,
    (_, prefix) => `${prefix}${formatArray(lp, eol)},`,
  );

  return out;
}

// ── Equality ──────────────────────────────────────────────────────────────────

function eq(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

// ── Main ──────────────────────────────────────────────────────────────────────

interface Change {
  slug: string;
  beforeIds: string[];
  afterIds:  string[];
  beforePath: string[];
  afterPath:  string[];
  idsAdded:   string[];
  idsRemoved: string[];
  pathAdded:  string[];
  pathRemoved: string[];
}

function run(): void {
  const changes: Change[] = [];
  let   unchanged = 0;

  for (const [slug, record] of nativeFragrances) {
    const { academyArticleIds: newIds, learningPath: newPath } = computeEnrichment(record);
    const oldIds  = (record.academyArticleIds ?? []).filter(id => VALID.has(id));
    const oldPath = record.learningPath ?? [];

    if (eq(oldIds, newIds) && eq(oldPath, newPath)) {
      unchanged++;
      continue;
    }

    changes.push({
      slug,
      beforeIds:   oldIds,
      afterIds:    newIds,
      beforePath:  oldPath,
      afterPath:   newPath,
      idsAdded:    newIds.filter(a => !oldIds.includes(a)),
      idsRemoved:  oldIds.filter(a => !newIds.includes(a)),
      pathAdded:   newPath.filter(a => !oldPath.includes(a)),
      pathRemoved: oldPath.filter(a => !newPath.includes(a)),
    });
  }

  // ── Header ────────────────────────────────────────────────────────────────

  const mode = isDryRun ? "DRY RUN" : "APPLYING";
  console.log(`\n╔════════════════════════════════════════════════════════════════╗`);
  console.log(`║  Academy Enrichment — EP13.0-P5  [${mode}]${" ".repeat(27 - mode.length)}║`);
  console.log(`╚════════════════════════════════════════════════════════════════╝\n`);
  console.log(`  Records scanned   : ${nativeFragrances.size}`);
  console.log(`  Records to modify : ${changes.length}`);
  console.log(`  Records unchanged : ${unchanged}`);

  // ── Coverage projection ───────────────────────────────────────────────────

  const freq: Record<string, number> = {};
  for (const [, record] of nativeFragrances) {
    const { academyArticleIds } = computeEnrichment(record);
    for (const a of academyArticleIds) freq[a] = (freq[a] ?? 0) + 1;
  }

  console.log("\n────────────────────────────────────────────────────────────────");
  console.log("ARTICLE COVERAGE AFTER ENRICHMENT");
  console.log("────────────────────────────────────────────────────────────────\n");

  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
  for (const [slug, count] of sorted) {
    const bar = "█".repeat(Math.round((count / 93) * 30));
    const pct = String(Math.round((count / 93) * 100)).padStart(3);
    console.log(`  ${slug.padEnd(48)} ${String(count).padStart(3)} (${pct}%)  ${bar}`);
  }

  // ── Per-record diffs ──────────────────────────────────────────────────────

  console.log("\n────────────────────────────────────────────────────────────────");
  console.log("RECORD DIFFS (first 25 shown)");
  console.log("────────────────────────────────────────────────────────────────");

  for (const ch of changes.slice(0, 25)) {
    console.log(`\n  ${ch.slug}`);
    console.log(`    academyArticleIds`);
    console.log(`      before : [${ch.beforeIds.join(", ")}]`);
    console.log(`      after  : [${ch.afterIds.join(", ")}]`);
    if (ch.idsAdded.length)   console.log(`      +add   : ${ch.idsAdded.join(", ")}`);
    if (ch.idsRemoved.length) console.log(`      -drop  : ${ch.idsRemoved.join(", ")}`);
    console.log(`    learningPath`);
    console.log(`      before : [${ch.beforePath.join(", ")}]`);
    console.log(`      after  : [${ch.afterPath.join(", ")}]`);
    if (ch.pathAdded.length)   console.log(`      +add   : ${ch.pathAdded.join(", ")}`);
    if (ch.pathRemoved.length) console.log(`      -drop  : ${ch.pathRemoved.join(", ")}`);
  }

  if (changes.length > 25) {
    console.log(`\n  ... and ${changes.length - 25} more records (all follow the same rules).`);
  }

  // ── Summary stats ─────────────────────────────────────────────────────────

  const totalIdsAdded   = changes.reduce((n, c) => n + c.idsAdded.length,   0);
  const totalIdsRemoved = changes.reduce((n, c) => n + c.idsRemoved.length, 0);
  const totalPathAdded  = changes.reduce((n, c) => n + c.pathAdded.length,  0);
  const avgIdsAfter     = changes.length
    ? (changes.reduce((n, c) => n + c.afterIds.length, 0) / changes.length).toFixed(1)
    : "—";

  console.log("\n────────────────────────────────────────────────────────────────");
  console.log("SUMMARY");
  console.log("────────────────────────────────────────────────────────────────\n");
  console.log(`  Total article ID slots added    : ${totalIdsAdded}`);
  console.log(`  Total article ID slots removed  : ${totalIdsRemoved}`);
  console.log(`  Total learning path slots added : ${totalPathAdded}`);
  console.log(`  Avg academyArticleIds per record: ${avgIdsAfter}`);

  if (isDryRun) {
    console.log("\n════════════════════════════════════════════════════════════════");
    console.log("DRY RUN COMPLETE — no files written.");
    console.log("Run with --apply after approval.");
    console.log("════════════════════════════════════════════════════════════════\n");
    return;
  }

  // ── Apply mode ────────────────────────────────────────────────────────────

  let applied = 0;
  let failed  = 0;
  const errors: string[] = [];

  for (const ch of changes) {
    const filePath = path.join(NATIVE_DIR, `${ch.slug}.ts`);

    try {
      if (!fs.existsSync(filePath)) {
        errors.push(`${ch.slug}: file not found`);
        failed++;
        continue;
      }

      const original = fs.readFileSync(filePath, "utf8");
      const patched  = patchSource(original, ch.afterIds, ch.afterPath);

      if (patched === original) {
        errors.push(`${ch.slug}: regex did not match — skipped`);
        failed++;
        continue;
      }

      fs.writeFileSync(filePath, patched, "utf8");
      applied++;
    } catch (err) {
      errors.push(`${ch.slug}: ${String(err)}`);
      failed++;
    }
  }

  console.log("\n────────────────────────────────────────────────────────────────");
  console.log("APPLY RESULT");
  console.log("────────────────────────────────────────────────────────────────\n");
  console.log(`  Applied  : ${applied}`);
  console.log(`  Skipped  : ${unchanged}`);
  console.log(`  Failed   : ${failed}`);

  if (errors.length) {
    console.log("\n  Errors:");
    for (const e of errors) console.log(`    ✗ ${e}`);
  }

  if (failed === 0) {
    console.log("\n  Next steps:");
    console.log("    npm run build");
    console.log("    npm run academy:validate");
    console.log("    npm run mkc:validate");
    console.log("    npm run mkc:coverage");
    console.log("    npx tsx scripts/analyse-academy-integration.ts\n");
  }
}

run();
