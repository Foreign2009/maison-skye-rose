/**
 * Validate Wave 9 Batch 1 draft records against the FragranceKnowledge validator.
 * Run from msr-catalogue-wave9 root: npx tsx scripts/factory/__tests__/validate-batch1-drafts.ts
 *
 * Called WITHOUT allRecords — drafts are not in the native registry, so slug-existence
 * and reciprocity checks on wardrobePartners/alternatives do NOT fire here.
 * That is expected; those checks run at promotion time when allRecords is supplied.
 *
 * Two groups are reported separately:
 *   STAGED (6)              — records present in wave9Batch1Catalogue (scripts/factory/data/wave-9-catalogue.ts)
 *                             (includes beautiful-by-estee-lauder-inspired, already promoted).
 *                             Any FAIL here fails the run.
 *   WITHDRAWN REFERENCE (2) — preserved DUPLICATE_ALIAS drafts of active native records:
 *                             versace-yellow-diamonds-inspired → yellow-diamond-inspired,
 *                             dolce-and-gabbana-the-one-inspired → the-one-pour-femme-inspired.
 *                             Validated for reference only; results do not affect the exit code.
 */

import { validateKnowledgeRecord } from "../../../app/lib/mkc/validator";
import type { FragranceKnowledge } from "../../../app/lib/mkc/types";
import { deriveSlug }                     from "../core/deriveSlug";
import { wave9Batch1Catalogue as wave9Catalogue }                 from "../data/wave-9-catalogue";
import { dolceAndGabbanaTheOneInspired }  from "../drafts/dolce-and-gabbana-the-one-inspired";
import { gucciRushInspired }              from "../drafts/gucci-rush-inspired";
import { jimmyChooInspired }              from "../drafts/jimmy-choo-inspired";
import { romanceByRalphLaurenInspired }   from "../drafts/romance-by-ralph-lauren-inspired";
import { tommyGirlInspired }              from "../drafts/tommy-girl-inspired";
import { versaceYellowDiamondsInspired }  from "../drafts/versace-yellow-diamonds-inspired";
import { beautifulByEsteeLauderInspired } from "../drafts/beautiful-by-estee-lauder-inspired";
import { poisonByDiorInspired }           from "../drafts/poison-by-dior-inspired";

const stagedDrafts: FragranceKnowledge[] = [
  gucciRushInspired,
  jimmyChooInspired,
  romanceByRalphLaurenInspired,
  tommyGirlInspired,
  beautifulByEsteeLauderInspired,
  poisonByDiorInspired,
];

const withdrawnReferenceDrafts: FragranceKnowledge[] = [
  versaceYellowDiamondsInspired,
  dolceAndGabbanaTheOneInspired,
];

function runGroup(label: string, drafts: FragranceKnowledge[]): { pass: number; fail: number } {
  let pass = 0;
  let fail = 0;
  console.log(`\n══ ${label} (${drafts.length}) ══`);
  for (const draft of drafts) {
    const result = validateKnowledgeRecord(draft);
    if (result.status === "FAIL") fail++; else pass++;
    console.log(`\n── ${draft.slug}`);
    console.log(`   Status: ${result.status}  (${result.totalErrors} error(s), ${result.totalWarnings} warning(s))`);
    for (const issue of [...result.errors, ...result.warnings]) {
      const tag = issue.severity === "error" ? "ERROR" : "WARN ";
      console.log(`   [${tag}] ${issue.code} — ${issue.field}: ${issue.message}`);
    }
  }
  return { pass, fail };
}

const duplicatesIn = (slugs: string[]) => [...new Set(slugs.filter((s, i) => slugs.indexOf(s) !== i))];
const catalogueSlugs = wave9Catalogue.map((f) => deriveSlug(f.title));
const stagedSlugs = stagedDrafts.map((d) => d.slug);
const missingFromStaged = catalogueSlugs.filter((s) => !stagedSlugs.includes(s));
const extraInStaged = stagedSlugs.filter((s) => !catalogueSlugs.includes(s));
const duplicateSlugs = [...new Set([...duplicatesIn(catalogueSlugs), ...duplicatesIn(stagedSlugs)])];
const withdrawnInCatalogue = withdrawnReferenceDrafts.map((d) => d.slug).filter((s) => catalogueSlugs.includes(s));
const stagingInSync = !missingFromStaged.length && !extraInStaged.length && !duplicateSlugs.length && !withdrawnInCatalogue.length;
console.log(`Staging catalogue sync: ${stagingInSync ? "OK" : "MISMATCH"} (catalogue ${catalogueSlugs.length}, staged drafts ${stagedSlugs.length})`);
if (missingFromStaged.length)    console.log(`   missing (in catalogue, not staged): ${missingFromStaged.join(", ")}`);
if (extraInStaged.length)        console.log(`   extra (staged, not in catalogue):   ${extraInStaged.join(", ")}`);
if (duplicateSlugs.length)       console.log(`   duplicate slugs:                    ${duplicateSlugs.join(", ")}`);
if (withdrawnInCatalogue.length) console.log(`   withdrawn draft present in catalogue: ${withdrawnInCatalogue.join(", ")}`);

const staged = runGroup("STAGED", stagedDrafts);
const reference = runGroup("WITHDRAWN REFERENCE — not staged, not promotable", withdrawnReferenceDrafts);

console.log(`\n══════════════════════════════════════════`);
console.log(`Staged:              ${staged.pass} PASS, ${staged.fail} FAIL`);
console.log(`Withdrawn reference: ${reference.pass} PASS, ${reference.fail} FAIL (informational)`);
const ok = stagingInSync && staged.fail === 0;
console.log(`Overall (staged): ${ok ? "ALL PASS (no FAIL)" : "FAILURES PRESENT"}`);
process.exit(ok ? 0 : 1);
