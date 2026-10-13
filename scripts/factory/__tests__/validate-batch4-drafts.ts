/**
 * Validate Wave 9 Batch 4 review drafts (W9-B4-P1, 2026-10-13).
 * Run from the worktree root: npx tsx scripts/factory/__tests__/validate-batch4-drafts.ts
 *
 * Checks (any failure exits non-zero):
 *   1. Staging sync — draft slugs equal the slugs in wave9Batch4Catalogue (no missing, extra or duplicate).
 *   2. Native status — PROMOTED Batch 4 slugs (founder Gate A + local promotion approval 2026-10-13, W9-B4-P2)
 *      must be registered natively and the native record must equal the reviewed draft.
 *   3. Record validator — validateKnowledgeRecord(draft) and validateKnowledgeRecord(draft, context)
 *      where context = native MKC + Batch 4 drafts (relationship existence/reciprocity).
 *   4. Adapter consistency — adaptFragrance(staging entry) must reproduce the draft's sweetness,
 *      freshness, warmth, intensity, versatility, scentCharacter and family (as a set); draft notes
 *      must equal the staging notesStructured and flat notes; profile, season, mood, collection and gender must match.
 *   5. Relationships empty — proposals live in the ledger, not in drafts.
 *   6. Copy scan — no projection/longevity/performance wording, and no reference-brand, equivalence or
 *      concentration wording in description, mood, recommendedFor or signatureStyle (subtitle: performance only).
 *   7. Catalogue authority — prices equal the staging prices (R60/R100/R250 via the shared PRICES constant).
 *
 * This script does NOT modify any record.
 */

import { validateKnowledgeRecord }   from "../../../app/lib/mkc/validator";
import type { FragranceKnowledge }   from "../../../app/lib/mkc/types";
import { nativeFragrances }          from "../../../app/lib/mkc/native/index";
import { adaptFragrance }            from "../../../app/lib/knowledgeAdapter";
import { deriveSlug }                from "../core/deriveSlug";
import { wave9Batch4Catalogue }      from "../data/wave-9-catalogue";
import { _212SexyMenInspired }       from "../drafts/212-sexy-men-inspired";
import { _212VipMenInspired }        from "../drafts/212-vip-men-inspired";
import { burberryBodyInspired }      from "../drafts/burberry-body-inspired";
import { armaniDiamondsInspired }    from "../drafts/armani-diamonds-inspired";

const drafts: FragranceKnowledge[] = [_212SexyMenInspired, _212VipMenInspired, burberryBodyInspired, armaniDiamondsInspired];

const PERFORMANCE_WORDING = /\b(long[- ]lasting|longevity|lasts|all[- ]day|sillage|projection|projects?|reapplication|beast mode|fills the room|compliments?|every occasion|any occasion|impossible to ignore)\b/i;
const EQUIVALENCE_WORDING = /\b(carolina herrera|herrera|burberry|armani|emporio|dupe|clone|identical|same as|smells like|exact (match|copy)|equivalent|eau de parfum|eau de toilette|edp|edt|concentration)\b/i;
const SCORE_KEYS = ["sweetness", "freshness", "warmth", "intensity", "versatility"] as const;
// Promoted to local native MKC 2026-10-13 after founder Gate A + local promotion approval (Wave 9 revision 22).
const PROMOTED = new Set(["212-sexy-men-inspired", "212-vip-men-inspired", "burberry-body-inspired", "armani-diamonds-inspired"]);

let problems = 0;
const fail = (slug: string, msg: string) => { problems++; console.log(`   ✗ ${slug}: ${msg}`); };

// 1. Staging sync
const dup = (xs: string[]) => [...new Set(xs.filter((x, i) => xs.indexOf(x) !== i))];
const catalogueSlugs = wave9Batch4Catalogue.map((f) => deriveSlug(f.title));
const draftSlugs = drafts.map((d) => d.slug);
const missing = catalogueSlugs.filter((s) => !draftSlugs.includes(s));
const extra = draftSlugs.filter((s) => !catalogueSlugs.includes(s));
const dups = [...new Set([...dup(catalogueSlugs), ...dup(draftSlugs)])];
const inSync = !missing.length && !extra.length && !dups.length;
console.log(`Staging catalogue sync (Batch 4): ${inSync ? "OK" : "MISMATCH"} (catalogue ${catalogueSlugs.length}, drafts ${draftSlugs.length})`);
if (!inSync) { problems++; console.log(`   missing ${missing.join(", ") || "-"} | extra ${extra.join(", ") || "-"} | duplicates ${dups.join(", ") || "-"}`); }

// 3. Context for relationship checks
const context = new Map(nativeFragrances);
for (const d of drafts) context.set(d.slug, d);
console.log(`Context: ${nativeFragrances.size} native + ${drafts.length} Batch 4 drafts = ${context.size}\n`);

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
  const s = wave9Batch4Catalogue.find((c) => deriveSlug(c.title) === d.slug) as any;
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
  const copy = [d.description, d.mood, ...(d.recommendedFor ?? []), ...(d.signatureStyle ?? [])].join(" | ");
  const perf = `${copy} | ${d.subtitle}`.match(PERFORMANCE_WORDING);
  if (perf) fail(d.slug, `performance wording: "${perf[0]}"`);
  const eq = copy.match(EQUIVALENCE_WORDING);
  if (eq) fail(d.slug, `reference-brand/equivalence/concentration wording: "${eq[0]}"`);

  // 7. Catalogue authority (prices)
  if (JSON.stringify(d.prices) !== JSON.stringify(s.prices)) fail(d.slug, `prices ${JSON.stringify(d.prices)} differ from staging ${JSON.stringify(s.prices)}`);

  console.log(`   adapter: family ${JSON.stringify(a.family)} char ${a.scentCharacter} scores ${SCORE_KEYS.map((k) => a[k]).join("/")} | notes ${flat.length}`);
}

console.log(`\n${problems} problem(s)`);
process.exit(problems ? 1 : 0);
