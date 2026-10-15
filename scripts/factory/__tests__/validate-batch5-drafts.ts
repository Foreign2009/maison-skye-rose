/**
 * Validate Wave 9 Batch 5 review drafts (W9-B5-P1B, 2026-10-15).
 * Run from the worktree root: npx tsx scripts/factory/__tests__/validate-batch5-drafts.ts
 *
 * Checks (any failure exits non-zero):
 *   1. Staging sync — draft slugs equal the slugs in wave9Batch5Catalogue (no missing, extra or duplicate).
 *   2. Native status — Batch 5 drafts are NOT promoted: no draft slug, id or name exists in the native registry.
 *   3. Record validator — validateKnowledgeRecord(draft) and validateKnowledgeRecord(draft, context)
 *      where context = native MKC + Batch 5 drafts (relationship existence/reciprocity).
 *   4. Adapter consistency — adaptFragrance(staging entry) must reproduce the draft's sweetness,
 *      freshness, warmth, intensity, versatility, scentCharacter and family (as a set); draft notes
 *      must equal the staging notesStructured and flat notes; profile, season, mood, collection and gender must match.
 *   5. Evidence lock — notesEvidenceLocked is set on draft and staging (sparse tiers are source-supported).
 *   6. Relationships empty — no pairings are proposed in this phase.
 *   7. Copy scan — no projection/longevity/performance wording, and no reference-brand, equivalence or
 *      concentration wording in description, mood, recommendedFor or signatureStyle (subtitle: performance only).
 *   8. Catalogue authority — prices equal the staging prices (R60/R100/R250 via the shared PRICES constant).
 *
 * This script does NOT modify any record.
 */

import { validateKnowledgeRecord }   from "../../../app/lib/mkc/validator";
import type { FragranceKnowledge }   from "../../../app/lib/mkc/types";
import { nativeFragrances }          from "../../../app/lib/mkc/native/index";
import { adaptFragrance }            from "../../../app/lib/knowledgeAdapter";
import { deriveSlug }                from "../core/deriveSlug";
import { wave9Batch5Catalogue }      from "../data/wave-9-catalogue";
import { thisIsHimInspired }         from "../drafts/this-is-him-inspired";
import { thisIsHerInspired }         from "../drafts/this-is-her-inspired";

const drafts: FragranceKnowledge[] = [thisIsHimInspired, thisIsHerInspired];

const PERFORMANCE_WORDING = /\b(long[- ]lasting|longevity|lasts|lasting|all[- ]day|sillage|projection|projects?|trail|reapplication|beast mode|fills the room|compliments?|every occasion|any occasion|impossible to ignore)\b/i;
const EQUIVALENCE_WORDING = /\b(zadig|voltaire|yves saint laurent|ysl|crivelli|dupe|clone|identical|same as|smells like|exact (match|copy)|equivalent|eau de parfum|eau de toilette|extrait|edp|edt|concentration)\b/i;
const SCORE_KEYS = ["sweetness", "freshness", "warmth", "intensity", "versatility"] as const;

let problems = 0;
const fail = (slug: string, msg: string) => { problems++; console.log(`   ✗ ${slug}: ${msg}`); };

// 1. Staging sync
const dup = (xs: string[]) => [...new Set(xs.filter((x, i) => xs.indexOf(x) !== i))];
const catalogueSlugs = wave9Batch5Catalogue.map((f) => deriveSlug(f.title));
const draftSlugs = drafts.map((d) => d.slug);
const missing = catalogueSlugs.filter((s) => !draftSlugs.includes(s));
const extra = draftSlugs.filter((s) => !catalogueSlugs.includes(s));
const dups = [...new Set([...dup(catalogueSlugs), ...dup(draftSlugs)])];
const inSync = !missing.length && !extra.length && !dups.length;
console.log(`Staging catalogue sync (Batch 5): ${inSync ? "OK" : "MISMATCH"} (catalogue ${catalogueSlugs.length}, drafts ${draftSlugs.length})`);
if (!inSync) { problems++; console.log(`   missing ${missing.join(", ") || "-"} | extra ${extra.join(", ") || "-"} | duplicates ${dups.join(", ") || "-"}`); }

// 3. Context for relationship checks
const context = new Map(nativeFragrances);
for (const d of drafts) context.set(d.slug, d);
console.log(`Context: ${nativeFragrances.size} native + ${drafts.length} Batch 5 drafts = ${context.size}\n`);

const nativeNames = new Set([...nativeFragrances.values()].map((k) => k.name.toLowerCase()));
const nativeIds = new Set([...nativeFragrances.values()].map((k) => k.id));

for (const d of drafts as any[]) {
  console.log(`── ${d.slug}  profile="${d.profile}" season="${d.season}"`);
  // 2. Not promoted; no identity collision with the native catalogue
  if (nativeFragrances.has(d.slug)) fail(d.slug, "draft slug already exists in native registry");
  if (nativeIds.has(d.id)) fail(d.slug, "draft id already exists in native registry");
  if (nativeNames.has(d.name.toLowerCase())) fail(d.slug, "draft name already exists in native registry");
  if (d.slug !== d.id || d.slug !== deriveSlug(d.name)) fail(d.slug, `slug/id/name mismatch (${d.id}, ${deriveSlug(d.name)})`);

  const plain = validateKnowledgeRecord(d);
  const withCtx = validateKnowledgeRecord(d, context);
  console.log(`   validator: ${plain.status} (${plain.totalErrors}e/${plain.totalWarnings}w); with context: ${withCtx.status} (${withCtx.totalErrors}e/${withCtx.totalWarnings}w)`);
  for (const i of [...withCtx.errors, ...withCtx.warnings]) console.log(`     [${i.severity}] ${i.code} — ${i.field}: ${i.message}`);
  if (plain.status === "FAIL" || withCtx.status === "FAIL") fail(d.slug, "record validator FAIL");

  // 4. Adapter consistency
  const s = wave9Batch5Catalogue.find((c) => deriveSlug(c.title) === d.slug) as any;
  if (!s) { fail(d.slug, "no staging entry"); continue; }
  const a = adaptFragrance(s) as any;
  for (const k of SCORE_KEYS) if (a[k] !== d[k]) fail(d.slug, `${k}: draft ${d[k]} vs adapter ${a[k]}`);
  if (a.scentCharacter !== d.scentCharacter) fail(d.slug, `scentCharacter: draft ${d.scentCharacter} vs adapter ${a.scentCharacter}`);
  if ([...d.family].sort().join("/") !== [...a.family].sort().join("/")) fail(d.slug, `family: draft ${JSON.stringify(d.family)} vs adapter ${JSON.stringify(a.family)}`);
  const flat = [...d.notes.top, ...d.notes.heart, ...d.notes.base];
  if (JSON.stringify(flat) !== JSON.stringify(s.notes)) fail(d.slug, `flat notes differ from staging`);
  if (JSON.stringify(d.notes) !== JSON.stringify({ top: s.notesStructured.top, heart: s.notesStructured.heart, base: s.notesStructured.base })) fail(d.slug, "notes differ from staging notesStructured");
  for (const k of ["profile", "season", "mood", "collection", "gender"]) if (s[k] !== d[k]) fail(d.slug, `staging ${k} "${s[k]}" vs draft "${d[k]}"`);

  // 5. Evidence lock
  if (d.notesEvidenceLocked !== true || s.notesEvidenceLocked !== true) fail(d.slug, "notesEvidenceLocked not set on draft and staging");

  // 6. Relationships empty
  const rel = d.relationships ?? {};
  if ((rel.alternatives ?? []).length || (rel.wardrobePartners ?? []).length) fail(d.slug, "relationships not empty");

  // 7. Copy scan
  const copy = [d.description, d.mood, ...(d.recommendedFor ?? []), ...(d.signatureStyle ?? [])].join(" | ");
  const perf = `${copy} | ${d.subtitle}`.match(PERFORMANCE_WORDING);
  if (perf) fail(d.slug, `performance wording: "${perf[0]}"`);
  const eq = copy.match(EQUIVALENCE_WORDING);
  if (eq) fail(d.slug, `reference-brand/equivalence/concentration wording: "${eq[0]}"`);

  // 8. Catalogue authority (prices)
  if (JSON.stringify(d.prices) !== JSON.stringify(s.prices)) fail(d.slug, `prices ${JSON.stringify(d.prices)} differ from staging ${JSON.stringify(s.prices)}`);

  console.log(`   adapter: family ${JSON.stringify(a.family)} char ${a.scentCharacter} scores ${SCORE_KEYS.map((k) => a[k]).join("/")} | notes ${flat.length}`);
}

console.log(`\n${problems} problem(s)`);
process.exit(problems ? 1 : 0);
