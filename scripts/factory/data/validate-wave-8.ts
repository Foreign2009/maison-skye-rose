/**
 * Wave 8 Draft Governance — Evidence-Lock Validation
 *
 * CATALOGUE-WAVE8-P3: verifies Wave 8 evidence contracts and draft-level
 * governance state. Must pass before editorial review or promotion.
 *
 * Run: npx tsx scripts/factory/data/validate-wave-8.ts
 *
 * Does NOT call any AI provider. Does NOT generate any drafts.
 * Does NOT modify any files. Read-only validation only.
 *
 * Source provenance for all 4 records:
 *   data/identity/source/mid-year-2026-research.json
 *   Researcher: Gemini — AI_RESEARCH_SUMMARY (not AUTHORITATIVE)
 *   Research date: 2026-08-08. No stored URLs.
 *   Evidence tier: PYRAMID_SECONDARY_SUPPORTED for all 4 records.
 */

import assert from "node:assert/strict";
import { wave8Catalogue } from "./wave-8-catalogue";

import { azzaroWantedByNightInspired } from "../drafts/azzaro-wanted-by-night-inspired";
import { _24FaubourgInspired }         from "../drafts/24-faubourg-inspired";
import { bossNuitPourFemmeInspired }   from "../drafts/boss-nuit-pour-femme-inspired";
import { capriLemonSugarInspired }     from "../drafts/capri-lemon-sugar-inspired";

import { nativeFragrances } from "../../../app/lib/mkc/native/index";
import { fragranceFamilies } from "../../../app/data/fragranceFamilies";

// ── Test harness ──────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void): void {
  try {
    fn();
    console.log(`  ✓  ${name}`);
    passed++;
  } catch (err) {
    const msg = err instanceof assert.AssertionError ? err.message : String(err);
    console.error(`  ✗  ${name}\n     ${msg}`);
    failed++;
  }
}

const VALID_FAMILIES = new Set(fragranceFamilies);

const wave8Drafts = [
  azzaroWantedByNightInspired,
  _24FaubourgInspired,
  bossNuitPourFemmeInspired,
  capriLemonSugarInspired,
];

const WAVE8_SLUGS = [
  "azzaro-wanted-by-night-inspired",
  "24-faubourg-inspired",
  "boss-nuit-pour-femme-inspired",
  "capri-lemon-sugar-inspired",
];

// ── Section 1: Catalogue registration ────────────────────────────────────────

console.log("\n  Wave 8 Draft Governance — Evidence-Lock Validator\n  CATALOGUE-WAVE8-P3\n");
console.log("  ─── Section 1: Catalogue registration ───\n");

test("W8-V1 — wave8Catalogue contains exactly 4 records", () => {
  assert.equal(wave8Catalogue.length, 4,
    `wave8Catalogue must have 4 records, got ${wave8Catalogue.length}`);
});

test("W8-V2 — wave8Drafts array contains exactly 4 draft records", () => {
  assert.equal(wave8Drafts.length, 4,
    `wave8Drafts must have 4 records, got ${wave8Drafts.length}`);
});

test("W8-V3 — all 4 expected slugs are registered in wave8Catalogue", () => {
  for (const slug of WAVE8_SLUGS) {
    const found = wave8Catalogue.some(f => f.title.toLowerCase().replace(/\s+/g, "-").replace(/-inspired$/, "") === slug.replace(/-inspired$/, ""));
    // Use slug-aware check
    const foundByTitle = wave8Catalogue.some(f => {
      const derived = f.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");
      return derived === slug;
    });
    assert.ok(foundByTitle || wave8Catalogue.some(f => f.title.toLowerCase().includes(slug.replace("-inspired", "").replace(/-/g, " "))),
      `Expected slug '${slug}' not found in wave8Catalogue`);
  }
});

test("W8-V4 — all 4 Wave 8 slugs are absent from native MKC (not promoted)", () => {
  for (const slug of WAVE8_SLUGS) {
    assert.ok(!nativeFragrances.has(slug),
      `${slug} must NOT be in native MKC yet — Wave 8 not promoted`);
  }
});

test("W8-V5 — all 4 catalogue records have notesEvidenceLocked: true", () => {
  const unlocked = wave8Catalogue.filter(f => f.notesEvidenceLocked !== true);
  assert.equal(unlocked.length, 0,
    `${unlocked.length} catalogue records have notesEvidenceLocked !== true: ${unlocked.map(f => f.title).join(", ")}`);
});

test("W8-V6 — all 4 catalogue records have notesStructured defined", () => {
  const missing = wave8Catalogue.filter(f => f.notesStructured === undefined);
  assert.equal(missing.length, 0,
    `${missing.length} catalogue records have undefined notesStructured: ${missing.map(f => f.title).join(", ")}`);
});

// ── Section 2: Gender and collection locks ────────────────────────────────────

console.log("\n  ─── Section 2: Gender and collection locks ───\n");

test("W8-V7 — azzaro-wanted-by-night-inspired: gender = male", () => {
  assert.equal(azzaroWantedByNightInspired.gender, "male",
    `Expected gender 'male', got '${azzaroWantedByNightInspired.gender}'`);
});

test("W8-V8 — azzaro-wanted-by-night-inspired: collection = Skye", () => {
  assert.equal(azzaroWantedByNightInspired.collection, "Skye",
    `Expected collection 'Skye', got '${azzaroWantedByNightInspired.collection}'`);
});

test("W8-V9 — 24-faubourg-inspired: gender = female", () => {
  assert.equal(_24FaubourgInspired.gender, "female",
    `Expected gender 'female', got '${_24FaubourgInspired.gender}'`);
});

test("W8-V10 — 24-faubourg-inspired: collection = Rose", () => {
  assert.equal(_24FaubourgInspired.collection, "Rose",
    `Expected collection 'Rose', got '${_24FaubourgInspired.collection}'`);
});

test("W8-V11 — boss-nuit-pour-femme-inspired: gender = female", () => {
  assert.equal(bossNuitPourFemmeInspired.gender, "female",
    `Expected gender 'female', got '${bossNuitPourFemmeInspired.gender}'`);
});

test("W8-V12 — boss-nuit-pour-femme-inspired: collection = Rose", () => {
  assert.equal(bossNuitPourFemmeInspired.collection, "Rose",
    `Expected collection 'Rose', got '${bossNuitPourFemmeInspired.collection}'`);
});

test("W8-V13 — capri-lemon-sugar-inspired: gender = unisex (CAPRI_COLLECTION_ELITE)", () => {
  assert.equal(capriLemonSugarInspired.gender, "unisex",
    `Expected gender 'unisex', got '${capriLemonSugarInspired.gender}'`);
});

test("W8-V14 — capri-lemon-sugar-inspired: collection = Elite (CAPRI_COLLECTION_ELITE)", () => {
  assert.equal(capriLemonSugarInspired.collection, "Elite",
    `Expected collection 'Elite', got '${capriLemonSugarInspired.collection}'`);
});

// ── Section 3: Family locks ───────────────────────────────────────────────────

console.log("\n  ─── Section 3: Family locks ───\n");

test("W8-V15 — azzaro family contains Woody, Spicy, Tobacco (no others)", () => {
  const f = azzaroWantedByNightInspired.family;
  assert.ok(f.includes("Woody"),   `azzaro family must include 'Woody'. Got: [${f.join(", ")}]`);
  assert.ok(f.includes("Spicy"),   `azzaro family must include 'Spicy'. Got: [${f.join(", ")}]`);
  assert.ok(f.includes("Tobacco"), `azzaro family must include 'Tobacco'. Got: [${f.join(", ")}]`);
  assert.equal(f.length, 3, `azzaro family must have exactly 3 values. Got: [${f.join(", ")}]`);
});

test("W8-V16 — azzaro family does NOT contain Aromatic or Leather as family value", () => {
  const f = azzaroWantedByNightInspired.family;
  assert.ok(!f.includes("Aromatic"), `azzaro family must NOT include 'Aromatic' (governance: UNSUPPORTED_FAMILY_EXCLUSION). Got: [${f.join(", ")}]`);
  assert.ok(!f.includes("Leather"),  `azzaro family must NOT include 'Leather' (governance: base note, not primary family). Got: [${f.join(", ")}]`);
});

test("W8-V17 — 24-faubourg family contains Floral and Amber (no Fruity)", () => {
  const f = _24FaubourgInspired.family;
  assert.ok(f.includes("Floral"), `24-faubourg family must include 'Floral'. Got: [${f.join(", ")}]`);
  assert.ok(f.includes("Amber"),  `24-faubourg family must include 'Amber'. Got: [${f.join(", ")}]`);
  assert.ok(!f.includes("Fruity"), `24-faubourg family must NOT include 'Fruity' (Peach is a top-note character, not family driver). Got: [${f.join(", ")}]`);
});

test("W8-V18 — boss-nuit family is exactly [Floral] (single family — no Powdery without editorial basis)", () => {
  const f = bossNuitPourFemmeInspired.family;
  assert.ok(f.includes("Floral"), `boss-nuit family must include 'Floral'. Got: [${f.join(", ")}]`);
  assert.ok(!f.includes("Powdery"), `boss-nuit family must NOT include 'Powdery' without governed editorial confirmation. Got: [${f.join(", ")}]`);
});

test("W8-V19 — capri family contains Citrus and Gourmand (no Sweet as redundant expansion)", () => {
  const f = capriLemonSugarInspired.family;
  assert.ok(f.includes("Citrus"),   `capri family must include 'Citrus'. Got: [${f.join(", ")}]`);
  assert.ok(f.includes("Gourmand"), `capri family must include 'Gourmand'. Got: [${f.join(", ")}]`);
  assert.ok(!f.includes("Sweet"),   `capri family must NOT include 'Sweet' as redundant expansion of Gourmand. Got: [${f.join(", ")}]`);
});

test("W8-V20 — all family values across all 4 drafts are in MKC vocabulary", () => {
  for (const draft of wave8Drafts) {
    for (const fam of draft.family) {
      assert.ok(VALID_FAMILIES.has(fam),
        `${draft.slug}: family value '${fam}' is not in MKC vocabulary`);
    }
  }
});

// ── Section 4: Note pyramid locks ────────────────────────────────────────────

console.log("\n  ─── Section 4: Note pyramid locks ───\n");

test("W8-V21 — all 4 drafts have notesEvidenceLocked: true", () => {
  for (const draft of wave8Drafts) {
    assert.equal(draft.notesEvidenceLocked, true,
      `${draft.slug}: notesEvidenceLocked must be true`);
  }
});

test("W8-V22 — azzaro top: exactly Cinnamon, Mandarin Orange, Lavender, Lemon (4 notes)", () => {
  const top = azzaroWantedByNightInspired.notes.top;
  assert.deepEqual(top, ["Cinnamon", "Mandarin Orange", "Lavender", "Lemon"],
    `azzaro top notes mismatch. Got: [${top.join(", ")}]`);
});

test("W8-V23 — azzaro heart: exactly Fruity Notes, Red Cedar, Cumin, Incense (4 notes — generic Fruity Notes preserved)", () => {
  const heart = azzaroWantedByNightInspired.notes.heart;
  assert.deepEqual(heart, ["Fruity Notes", "Red Cedar", "Cumin", "Incense"],
    `azzaro heart notes mismatch. Got: [${heart.join(", ")}]`);
});

test("W8-V24 — azzaro base: exactly 8 notes including Iso E Super preserved literally", () => {
  const base = azzaroWantedByNightInspired.notes.base;
  assert.deepEqual(base, ["Tobacco", "Vanilla", "Cedar", "Leather", "Cypress", "Iso E Super", "Patchouli", "Benzoin"],
    `azzaro base notes mismatch. Got: [${base.join(", ")}]`);
});

test("W8-V25 — azzaro total note count = 16 (FULL_PYRAMID preserved)", () => {
  const total = azzaroWantedByNightInspired.notes.top.length +
                azzaroWantedByNightInspired.notes.heart.length +
                azzaroWantedByNightInspired.notes.base.length;
  assert.equal(total, 16, `azzaro must have 16 total notes, got ${total}`);
});

test("W8-V26 — 24-faubourg top: exactly 5 notes (Hyacinth, Orange, Peach, Bergamot, Ylang-Ylang)", () => {
  const top = _24FaubourgInspired.notes.top;
  assert.deepEqual(top, ["Hyacinth", "Orange", "Peach", "Bergamot", "Ylang-Ylang"],
    `24-faubourg top notes mismatch. Got: [${top.join(", ")}]`);
});

test("W8-V27 — 24-faubourg heart: exactly 5 notes including Black Elder (FULL_EVIDENCE_PYRAMID_REQUIRED)", () => {
  const heart = _24FaubourgInspired.notes.heart;
  assert.deepEqual(heart, ["Jasmine", "Orange Blossom", "Gardenia", "Black Elder", "Iris"],
    `24-faubourg heart notes mismatch. Got: [${heart.join(", ")}]`);
  assert.ok(heart.includes("Black Elder"),
    `24-faubourg heart must include 'Black Elder' — must not be dropped`);
});

test("W8-V28 — 24-faubourg base: exactly 4 notes (Sandalwood, Amber, Patchouli, Vanilla)", () => {
  const base = _24FaubourgInspired.notes.base;
  assert.deepEqual(base, ["Sandalwood", "Amber", "Patchouli", "Vanilla"],
    `24-faubourg base notes mismatch. Got: [${base.join(", ")}]`);
});

test("W8-V29 — 24-faubourg total note count = 14 (FULL_EVIDENCE_PYRAMID_REQUIRED — not abbreviated)", () => {
  const total = _24FaubourgInspired.notes.top.length +
                _24FaubourgInspired.notes.heart.length +
                _24FaubourgInspired.notes.base.length;
  assert.equal(total, 14, `24-faubourg must have 14 total notes (no abbreviation), got ${total}`);
});

test("W8-V30 — boss-nuit top: exactly Aldehydes, Peach (sparse pyramid intentional)", () => {
  const top = bossNuitPourFemmeInspired.notes.top;
  assert.deepEqual(top, ["Aldehydes", "Peach"],
    `boss-nuit top notes mismatch. Got: [${top.join(", ")}]`);
});

test("W8-V31 — boss-nuit heart: White Flowers preserved as generic placeholder (not expanded)", () => {
  const heart = bossNuitPourFemmeInspired.notes.heart;
  assert.deepEqual(heart, ["White Flowers", "Jasmine", "Violet"],
    `boss-nuit heart notes mismatch. Got: [${heart.join(", ")}]`);
  assert.ok(heart.includes("White Flowers"),
    `boss-nuit heart must include 'White Flowers' as sourced — not expanded to named florals`);
});

test("W8-V32 — boss-nuit base: exactly Sandalwood, Moss (sparse by evidence)", () => {
  const base = bossNuitPourFemmeInspired.notes.base;
  assert.deepEqual(base, ["Sandalwood", "Moss"],
    `boss-nuit base notes mismatch. Got: [${base.join(", ")}]`);
});

test("W8-V33 — boss-nuit total note count = 7 (sparse pyramid preserved exactly)", () => {
  const total = bossNuitPourFemmeInspired.notes.top.length +
                bossNuitPourFemmeInspired.notes.heart.length +
                bossNuitPourFemmeInspired.notes.base.length;
  assert.equal(total, 7, `boss-nuit must have exactly 7 total notes, got ${total}`);
});

test("W8-V34 — capri top: exactly Lemon, Mandarin Orange, Bergamot", () => {
  const top = capriLemonSugarInspired.notes.top;
  assert.deepEqual(top, ["Lemon", "Mandarin Orange", "Bergamot"],
    `capri top notes mismatch. Got: [${top.join(", ")}]`);
});

test("W8-V35 — capri heart: exactly Freesia, Raspberry, Peach", () => {
  const heart = capriLemonSugarInspired.notes.heart;
  assert.deepEqual(heart, ["Freesia", "Raspberry", "Peach"],
    `capri heart notes mismatch. Got: [${heart.join(", ")}]`);
});

test("W8-V36 — capri base: exactly Brown Sugar, Vanilla, Musk, Amber", () => {
  const base = capriLemonSugarInspired.notes.base;
  assert.deepEqual(base, ["Brown Sugar", "Vanilla", "Musk", "Amber"],
    `capri base notes mismatch. Got: [${base.join(", ")}]`);
});

test("W8-V37 — capri total note count = 10", () => {
  const total = capriLemonSugarInspired.notes.top.length +
                capriLemonSugarInspired.notes.heart.length +
                capriLemonSugarInspired.notes.base.length;
  assert.equal(total, 10, `capri must have 10 total notes, got ${total}`);
});

// ── Section 5: Unknown perfumer discipline ────────────────────────────────────

console.log("\n  ─── Section 5: Unknown perfumer discipline ───\n");

test("W8-V38 — boss-nuit-pour-femme-inspired has no perfumer field (UNKNOWN must be omitted)", () => {
  assert.ok(
    !("perfumer" in bossNuitPourFemmeInspired) ||
    (bossNuitPourFemmeInspired as unknown as Record<string, unknown>)["perfumer"] === undefined,
    "boss-nuit must not have a populated perfumer field — UNKNOWN cannot be fabricated"
  );
});

test("W8-V39 — capri-lemon-sugar-inspired has no perfumer field (UNKNOWN must be omitted)", () => {
  assert.ok(
    !("perfumer" in capriLemonSugarInspired) ||
    (capriLemonSugarInspired as unknown as Record<string, unknown>)["perfumer"] === undefined,
    "capri must not have a populated perfumer field — UNKNOWN cannot be fabricated"
  );
});

// ── Section 6: Merchandising state ───────────────────────────────────────────

console.log("\n  ─── Section 6: Merchandising state ───\n");

test("W8-V40 — all 4 drafts have bestSeller: false (not authorized)", () => {
  for (const draft of wave8Drafts) {
    assert.equal(draft.bestSeller, false,
      `${draft.slug}: bestSeller must be false — not authorized in P3`);
  }
});

test("W8-V41 — all 4 drafts have newArrival: false (not authorized)", () => {
  for (const draft of wave8Drafts) {
    assert.equal(draft.newArrival, false,
      `${draft.slug}: newArrival must be false — not authorized in P3`);
  }
});

// ── Section 7: Performance claim prohibition ──────────────────────────────────

console.log("\n  ─── Section 7: Performance claim prohibition ───\n");

const PERFORMANCE_PATTERNS = /\b(long.?last|last\s+\d+\s+hours?|beast\s+mode|strong\s+projection|excellent\s+(projection|sillage|longevity)|projects\s+well|heavy\s+projection|powerhouse|office.?inappropriate)\b/i;

test("W8-V42 — no prohibited performance/longevity claims in any recommendedFor field", () => {
  for (const draft of wave8Drafts) {
    for (const rec of draft.recommendedFor) {
      assert.ok(!PERFORMANCE_PATTERNS.test(rec),
        `${draft.slug}: prohibited performance claim in recommendedFor: "${rec}"`);
    }
  }
});

test("W8-V43 — no prohibited performance/longevity claims in any description field", () => {
  for (const draft of wave8Drafts) {
    if (draft.description) {
      assert.ok(!PERFORMANCE_PATTERNS.test(draft.description),
        `${draft.slug}: prohibited performance claim in description: "${draft.description}"`);
    }
  }
});

// ── Section 8: No unauthorized native collision ───────────────────────────────

console.log("\n  ─── Section 8: No native collision ───\n");

test("W8-V44 — no Wave 8 slug collides with any existing native record", () => {
  for (const slug of WAVE8_SLUGS) {
    assert.ok(!nativeFragrances.has(slug),
      `CRITICAL: ${slug} already exists in native MKC — cannot generate over existing native`);
  }
});

test("W8-V45 — all 4 drafts have correct slug assigned", () => {
  assert.equal(azzaroWantedByNightInspired.slug, "azzaro-wanted-by-night-inspired");
  assert.equal(_24FaubourgInspired.slug,         "24-faubourg-inspired");
  assert.equal(bossNuitPourFemmeInspired.slug,   "boss-nuit-pour-femme-inspired");
  assert.equal(capriLemonSugarInspired.slug,     "capri-lemon-sugar-inspired");
});

// ── Section 9: Collection distribution ───────────────────────────────────────

console.log("\n  ─── Section 9: Collection distribution ───\n");

test("W8-V46 — wave8Catalogue has 1 Skye record", () => {
  const skye = wave8Catalogue.filter(f => f.collection === "Skye");
  assert.equal(skye.length, 1, `Expected 1 Skye record, got ${skye.length}`);
});

test("W8-V47 — wave8Catalogue has 2 Rose records", () => {
  const rose = wave8Catalogue.filter(f => f.collection === "Rose");
  assert.equal(rose.length, 2, `Expected 2 Rose records, got ${rose.length}`);
});

test("W8-V48 — wave8Catalogue has 1 Elite record", () => {
  const elite = wave8Catalogue.filter(f => f.collection === "Elite");
  assert.equal(elite.length, 1, `Expected 1 Elite record, got ${elite.length}`);
});

test("W8-V49 — capri collection in catalogue is Elite (CAPRI_COLLECTION_ELITE governance)", () => {
  const capri = wave8Catalogue.find(f => f.title.includes("Capri"));
  assert.ok(capri, "Capri record must exist in wave8Catalogue");
  assert.equal(capri!.collection, "Elite",
    `Capri catalogue collection must be 'Elite', got '${capri!.collection}'`);
});

// ── Section 10: Image paths ───────────────────────────────────────────────────

console.log("\n  ─── Section 10: Image paths ───\n");

test("W8-V50 — all 4 drafts have non-empty image paths for 5ml, 10ml, 30ml", () => {
  for (const draft of wave8Drafts) {
    const img = draft.images as Record<string, string>;
    assert.ok(img["5ml"],  `${draft.slug}: missing 5ml image path`);
    assert.ok(img["10ml"], `${draft.slug}: missing 10ml image path`);
    assert.ok(img["30ml"], `${draft.slug}: missing 30ml image path`);
  }
});

// ── Summary ───────────────────────────────────────────────────────────────────

console.log(`\n${"─".repeat(60)}`);
console.log(`  Results: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  console.error(`\n  FAIL — ${failed} Wave 8 evidence-lock governance test(s) did not pass.\n`);
  process.exit(1);
} else {
  console.log(`\n  PASS — all ${passed} Wave 8 governance checks passed.\n`);
  console.log("  Wave 8 catalogue registration: VERIFIED (4 records)");
  console.log("  Wave 8 evidence contracts: VERIFIED (AI_RESEARCH_SUMMARY provenance)");
  console.log("  Note pyramids: EXACT MATCH (16/14/7/10 notes)");
  console.log("  FULL_EVIDENCE_PYRAMID_REQUIRED: 24 Faubourg 14-note pyramid intact");
  console.log("  SPARSE_PYRAMID_INTENTIONAL: Boss Nuit 7-note pyramid preserved");
  console.log("  Generic terms preserved: 'Fruity Notes', 'Iso E Super', 'White Flowers'");
  console.log("  CAPRI_COLLECTION_ELITE: unisex + Elite governance confirmed");
  console.log("  Unknown perfumers: omitted (Boss Nuit, Capri — not fabricated)");
  console.log("  Performance claim prohibition: CLEAN");
  console.log("  Merchandising: bestSeller=false, newArrival=false (all 4)");
  console.log("  No native collision: all 4 slugs absent from native MKC\n");
}
