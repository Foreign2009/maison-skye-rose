/**
 * Validate Wave 9 Batch 2 review drafts.
 * Run from msr-catalogue-wave9 root: npx tsx scripts/factory/__tests__/validate-batch2-drafts.ts
 *
 * Checks (any failure exits non-zero):
 *   1. Staging sync — draft slugs equal the slugs in wave9Batch2Catalogue (no missing, extra or duplicate).
 *   2. Native status — PROMOTED slugs (founder-approved 2026-10-11) must be registered natively and the native
 *      record must equal the draft; every other Batch 2 slug must NOT exist in the native registry.
 *   3. Record validator — validateKnowledgeRecord(draft) and validateKnowledgeRecord(draft, context)
 *      where context = native MKC + Batch 2 drafts (relationship existence/reciprocity).
 *   4. Adapter consistency — adaptFragrance(staging entry) must reproduce the draft's sweetness,
 *      freshness, warmth, intensity, versatility, scentCharacter and family (as a set); draft notes
 *      must equal the staging notesStructured and flat notes; profile, season and mood must match.
 *   5. Relationships empty — proposals live in the ledger, not in drafts.
 *   6. Copy scan — no projection/longevity/performance wording in description, mood, subtitle,
 *      recommendedFor or signatureStyle.
 *
 * This script does NOT modify any record.
 */

import { validateKnowledgeRecord }   from "../../../app/lib/mkc/validator";
import type { FragranceKnowledge }   from "../../../app/lib/mkc/types";
import { nativeFragrances }          from "../../../app/lib/mkc/native/index";
import { adaptFragrance }            from "../../../app/lib/knowledgeAdapter";
import { deriveSlug }                from "../core/deriveSlug";
import { wave9Batch2Catalogue }      from "../data/wave-9-catalogue";
import { perfectByMarcJacobsInspired }     from "../drafts/perfect-by-marc-jacobs-inspired";
import { euphoriaByCalvinKleinInspired }   from "../drafts/euphoria-by-calvin-klein-inspired";
import { wonderlustByMichaelKorsInspired } from "../drafts/wonderlust-by-michael-kors-inspired";
import { pradaCandyInspired }              from "../drafts/prada-candy-inspired";
import { onlyTheBraveInspired }            from "../drafts/only-the-brave-inspired";

const drafts: FragranceKnowledge[] = [
  perfectByMarcJacobsInspired,
  euphoriaByCalvinKleinInspired,
  wonderlustByMichaelKorsInspired,
  pradaCandyInspired,
  onlyTheBraveInspired,
];

const PERFORMANCE_WORDING = /\b(long[- ]lasting|longevity|lasts|all[- ]day|sillage|projection|projects?|reapplication|beast mode|fills the room|compliments?|every occasion|any occasion)\b/i;
const SCORE_KEYS = ["sweetness", "freshness", "warmth", "intensity", "versatility"] as const;
// Promoted to native 2026-10-11 after founder editorial/promotion approval (Wave 9 revision 15);
// wonderlust and prada-candy promoted 2026-10-12 after founder Gate A/B approval (Wave 9 revision 19).
const PROMOTED = new Set(["perfect-by-marc-jacobs-inspired", "euphoria-by-calvin-klein-inspired", "only-the-brave-inspired",
  "wonderlust-by-michael-kors-inspired", "prada-candy-inspired"]);

let problems = 0;
const fail = (slug: string, msg: string) => { problems++; console.log(`   ✗ ${slug}: ${msg}`); };

// 1. Staging sync
const dup = (xs: string[]) => [...new Set(xs.filter((x, i) => xs.indexOf(x) !== i))];
const catalogueSlugs = wave9Batch2Catalogue.map((f) => deriveSlug(f.title));
const draftSlugs = drafts.map((d) => d.slug);
const missing = catalogueSlugs.filter((s) => !draftSlugs.includes(s));
const extra = draftSlugs.filter((s) => !catalogueSlugs.includes(s));
const dups = [...new Set([...dup(catalogueSlugs), ...dup(draftSlugs)])];
const inSync = !missing.length && !extra.length && !dups.length;
console.log(`Staging catalogue sync (Batch 2): ${inSync ? "OK" : "MISMATCH"} (catalogue ${catalogueSlugs.length}, drafts ${draftSlugs.length})`);
if (!inSync) { problems++; console.log(`   missing ${missing.join(", ") || "-"} | extra ${extra.join(", ") || "-"} | duplicates ${dups.join(", ") || "-"}`); }

// 3. Context for relationship checks
const context = new Map(nativeFragrances);
for (const d of drafts) context.set(d.slug, d);
console.log(`Context: ${nativeFragrances.size} native + ${drafts.length} Batch 2 drafts = ${context.size}\n`);

for (const d of drafts as any[]) {
  console.log(`── ${d.slug}  profile="${d.profile}" season="${d.season}"`);
  // 2. Native status
  if (PROMOTED.has(d.slug)) {
    const n = nativeFragrances.get(d.slug);
    if (!n) fail(d.slug, "promoted slug missing from native registry");
    else if (JSON.stringify(n) !== JSON.stringify(d)) fail(d.slug, "native record differs from reviewed draft");
    else console.log(`   native: registered, identical to draft (promoted)`);
  } else if (nativeFragrances.has(d.slug)) fail(d.slug, "unpromoted draft slug already exists in native registry");

  const plain = validateKnowledgeRecord(d);
  const withCtx = validateKnowledgeRecord(d, context);
  console.log(`   validator: ${plain.status} (${plain.totalErrors}e/${plain.totalWarnings}w); with context: ${withCtx.status} (${withCtx.totalErrors}e/${withCtx.totalWarnings}w)`);
  for (const i of [...withCtx.errors, ...withCtx.warnings]) console.log(`     [${i.severity}] ${i.code} — ${i.field}: ${i.message}`);
  if (plain.status === "FAIL" || withCtx.status === "FAIL") fail(d.slug, "record validator FAIL");

  // 4. Adapter consistency
  const s = wave9Batch2Catalogue.find((c) => deriveSlug(c.title) === d.slug) as any;
  if (!s) { fail(d.slug, "no staging entry"); continue; }
  const a = adaptFragrance(s) as any;
  for (const k of SCORE_KEYS) if (a[k] !== d[k]) fail(d.slug, `${k}: draft ${d[k]} vs adapter ${a[k]}`);
  if (a.scentCharacter !== d.scentCharacter) fail(d.slug, `scentCharacter: draft ${d.scentCharacter} vs adapter ${a.scentCharacter}`);
  if ([...d.family].sort().join("/") !== [...a.family].sort().join("/")) fail(d.slug, `family: draft ${JSON.stringify(d.family)} vs adapter ${JSON.stringify(a.family)}`);
  const flat = [...d.notes.top, ...d.notes.heart, ...d.notes.base];
  if (JSON.stringify(flat) !== JSON.stringify(s.notes)) fail(d.slug, `flat notes differ from staging`);
  if (JSON.stringify(d.notes) !== JSON.stringify({ top: s.notesStructured.top, heart: s.notesStructured.heart, base: s.notesStructured.base })) fail(d.slug, "notes differ from staging notesStructured");
  if (d.notesEvidenceLocked !== true || s.notesEvidenceLocked !== true) fail(d.slug, "notesEvidenceLocked not set on draft and staging");
  for (const k of ["profile", "season", "mood", "collection", "gender"]) if (s[k] !== d[k]) fail(d.slug, `staging ${k} "${s[k]}" vs draft "${d[k]}"`);

  // 5. Relationships empty
  const rel = d.relationships ?? {};
  if ((rel.alternatives ?? []).length || (rel.wardrobePartners ?? []).length) fail(d.slug, "relationships not empty");

  // 6. Copy scan
  const copy = [d.description, d.mood, d.subtitle, ...(d.recommendedFor ?? []), ...(d.signatureStyle ?? [])].join(" | ");
  const hit = copy.match(PERFORMANCE_WORDING);
  if (hit) fail(d.slug, `performance wording: "${hit[0]}"`);

  console.log(`   adapter: family ${JSON.stringify(a.family)} char ${a.scentCharacter} scores ${SCORE_KEYS.map((k) => a[k]).join("/")} | notes ${flat.length}`);
}

console.log(`\n${problems} problem(s)`);
process.exit(problems ? 1 : 0);
