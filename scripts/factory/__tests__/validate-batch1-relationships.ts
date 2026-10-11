/**
 * Validate Wave 9 Batch 1 draft relationships against the active native catalogue
 * PLUS the staged batch 1 candidates as context.
 *
 * Run from msr-catalogue-wave9 root:
 *   npx tsx scripts/factory/__tests__/validate-batch1-relationships.ts
 *
 * With allRecords provided the validator fires:
 *   - RELATIONSHIP_SLUG_NOT_FOUND: target slug absent from allRecords
 *   - RELATIONSHIP_NOT_RECIPROCAL: wardrobePartner does not list this slug back
 *
 * Alternatives are checked for slug existence only (no reciprocity requirement).
 * wardrobePartners are checked for both slug existence AND reciprocity.
 *
 * Staging alignment: staged draft slugs must equal the slugs in wave-9-catalogue.ts —
 * missing, extra or duplicate slugs (or a withdrawn draft in the catalogue) exit non-zero.
 *
 * Groups:
 *   STAGED (6)              — counted in totals and exit code (includes the promoted
 *                             beautiful-by-estee-lauder-inspired; same slug as its native record).
 *   WITHDRAWN REFERENCE (2) — preserved DUPLICATE_ALIAS drafts: versace-yellow-diamonds-inspired
 *                             (→ yellow-diamond-inspired) and dolce-and-gabbana-the-one-inspired
 *                             (→ the-one-pour-femme-inspired). Excluded from the context map so no
 *                             staged record can resolve a relationship to them; reported only.
 *
 * This script does NOT modify any native record.
 */

import { validateKnowledgeRecord }       from "../../../app/lib/mkc/validator";
import type { FragranceKnowledge }       from "../../../app/lib/mkc/types";
import { nativeFragrances }              from "../../../app/lib/mkc/native/index";
import { deriveSlug }                    from "../core/deriveSlug";
import { wave9Catalogue }                from "../data/wave-9-catalogue";
import { dolceAndGabbanaTheOneInspired } from "../drafts/dolce-and-gabbana-the-one-inspired";
import { gucciRushInspired }             from "../drafts/gucci-rush-inspired";
import { jimmyChooInspired }             from "../drafts/jimmy-choo-inspired";
import { romanceByRalphLaurenInspired }  from "../drafts/romance-by-ralph-lauren-inspired";
import { tommyGirlInspired }             from "../drafts/tommy-girl-inspired";
import { versaceYellowDiamondsInspired } from "../drafts/versace-yellow-diamonds-inspired";
import { beautifulByEsteeLauderInspired } from "../drafts/beautiful-by-estee-lauder-inspired";
import { poisonByDiorInspired }          from "../drafts/poison-by-dior-inspired";

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

// Context = native MKC + staged candidates only. No native record is modified.
const allRecords = new Map(nativeFragrances);
for (const draft of stagedDrafts) allRecords.set(draft.slug, draft);

console.log(`\nContext: ${nativeFragrances.size} native records + ${stagedDrafts.length} staged drafts = ${allRecords.size} total`);
console.log(`(withdrawn reference drafts excluded from context: ${withdrawnReferenceDrafts.map((d) => d.slug).join(", ")})`);

function runGroup(label: string, drafts: FragranceKnowledge[]): { errors: number; warnings: number } {
  let errors = 0;
  let warnings = 0;
  console.log(`\n══ ${label} (${drafts.length}) ══\n`);
  for (const draft of drafts) {
    const result = validateKnowledgeRecord(draft, allRecords);
    const relGroup = result.groups["relationships"];
    errors += result.totalErrors;
    warnings += result.totalWarnings;

    console.log(`── ${draft.slug}`);
    console.log(`   Overall:       ${result.status}  (${result.totalErrors} error(s), ${result.totalWarnings} warning(s))`);
    console.log(`   Relationships: ${relGroup.status}  (${relGroup.issues.length} issue(s))`);
    if (relGroup.issues.length > 0) {
      for (const issue of relGroup.issues) {
        const tag = issue.severity === "error" ? "ERROR" : "WARN ";
        console.log(`     [${tag}] ${issue.code} — ${issue.field}: ${issue.message}`);
      }
    } else {
      console.log(`     (no relationship issues with catalogue context)`);
    }
    const nonRelIssues = [...result.errors, ...result.warnings].filter((i) => i.group !== "relationships");
    if (nonRelIssues.length > 0) {
      console.log(`   Other issues:`);
      for (const issue of nonRelIssues) {
        const tag = issue.severity === "error" ? "ERROR" : "WARN ";
        console.log(`     [${tag}] ${issue.code} — ${issue.field}: ${issue.message}`);
      }
    }
    console.log();
  }
  return { errors, warnings };
}

const staged = runGroup("STAGED", stagedDrafts);
const reference = runGroup("WITHDRAWN REFERENCE — not staged, not promotable", withdrawnReferenceDrafts);

console.log(`══════════════════════════════════════════`);
console.log(`Staged totals:              ${staged.errors} error(s), ${staged.warnings} warning(s)`);
console.log(`Withdrawn reference totals: ${reference.errors} error(s), ${reference.warnings} warning(s) (informational)`);
console.log(`Staging catalogue sync:     ${stagingInSync ? "OK" : "MISMATCH"}`);
process.exit(staged.errors > 0 || !stagingInSync ? 1 : 0);
