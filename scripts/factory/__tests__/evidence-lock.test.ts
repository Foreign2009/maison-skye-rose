/**
 * Evidence-Lock Composition Safeguards — Regression Tests
 *
 * EP-CAT-P3C-PREGEN: validates that evidence-lock mode preserves governed notes
 * and that normal mode validation enforcement is fully intact.
 *
 * Run: npx tsx scripts/factory/__tests__/evidence-lock.test.ts
 */

import assert from "node:assert/strict";
import { validateKnowledgeRecord } from "../../../app/lib/mkc/validator";
import { scaffold }                from "../scaffold";
import type { FragranceKnowledge } from "../../../app/lib/mkc/types";
import type { DisplayFragrance }   from "../../../app/lib/knowledgeAdapter";
import { peonyBlushSuedeInspired }  from "../drafts/peony-blush-suede-inspired";
import { goldOudInspired }          from "../drafts/gold-oud-inspired";
import { velvetRoseOudInspired }    from "../drafts/velvet-rose-oud-inspired";
import { englishPearFreesiaInspired } from "../drafts/english-pear-freesia-inspired";
import { oudBergamotInspired }      from "../drafts/oud-bergamot-inspired";

// ── Test harness ──────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void): void {
  try {
    fn();
    console.log(`  ✓  ${name}`);
    passed++;
  } catch (err) {
    const msg = err instanceof assert.AssertionError
      ? `${err.message}`
      : String(err);
    console.error(`  ✗  ${name}\n     ${msg}`);
    failed++;
  }
}

// ── Fixture builders ──────────────────────────────────────────────────────────

/**
 * Minimal passing FragranceKnowledge record.
 * name "Full Bloom Inspired" → slug "full-bloom-inspired" satisfies SLUG_FORMULA.
 */
function baseRecord(overrides: Partial<FragranceKnowledge> = {}): FragranceKnowledge {
  return {
    id:             "full-bloom-inspired",
    slug:           "full-bloom-inspired",
    brand:          "Maison Skye & Rose",
    name:           "full-bloom-inspired",
    collection:     "Rose",
    catalogVersion: "1.0",
    status:         "active",
    gender:         "female",
    family:         ["Floral"],
    scentCharacter: "Balanced Signature",
    projection:     "moderate",
    profile:        "Floral",
    season:         "Spring",
    notes: {
      top:   ["Bergamot", "Lemon"],
      heart: ["Rose", "Jasmine"],
      base:  ["Musk", "Sandalwood"],
    },
    mood:           "Romantic Feminine",
    vibe:           ["Romantic", "Elegant", "Feminine"],
    occasions:      ["Date Night", "Daily Wear"],
    seasons:        ["Spring"],
    signatureStyle: ["Elegant Floral"],
    recommendedFor: ["Romantic Evening", "Daily Elegance"],
    prices:         { "5ml": 200, "10ml": 350, "30ml": 900 },
    images:         { "5ml": "/img/5ml.jpg", "10ml": "/img/10ml.jpg", "30ml": "/img/30ml.jpg" },
    bestSeller:     false,
    newArrival:     false,
    subtitle:       "A floral fragrance",
    description:    "A test fragrance description.",
    sweetness:      2,
    freshness:      3,
    warmth:         2,
    intensity:      2,
    versatility:    3,
    popularity:     5,
    ...overrides,
  };
}

/** Minimal DisplayFragrance for scaffold tests. */
function baseDisplay(overrides: Partial<DisplayFragrance> = {}): DisplayFragrance {
  return {
    title:      "Bloom Test Inspired",
    collection: "Rose",
    subtitle:   "A test fragrance",
    mood:       "Romantic Feminine",
    profile:    "Floral",
    season:     "Spring",
    notes:      ["Bergamot", "Rose", "Musk"],
    bestSeller: false,
    newArrival: false,
    prices:     { "5ml": 200, "10ml": 350, "30ml": 900 },
    images:     { "5ml": "/img/5ml.jpg", "10ml": "/img/10ml.jpg", "30ml": "/img/30ml.jpg" },
    ...overrides,
  };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

console.log("\nEP-CAT-P3C — Evidence-Lock Regression Tests\n");

// TEST 1: Normal mode still enforces existing composition requirements.
test("TEST 1 — Normal mode enforces ≥ 2 notes per tier", () => {
  const record = baseRecord({
    notes: { top: ["Bergamot"], heart: ["Rose", "Jasmine"], base: ["Musk", "Sandalwood"] },
  });
  const result = validateKnowledgeRecord(record);
  const codes  = result.errors.map(e => e.code);
  assert.ok(codes.includes("NOTES_TOP_MIN"),
    `Expected NOTES_TOP_MIN error for 1 top note; got codes: ${codes.join(", ")}`);
  assert.equal(result.status, "FAIL");
});

// TEST 2: Evidence-lock accepts empty authoritative top tier.
test("TEST 2 — Evidence-lock accepts empty top tier (no NOTES_TOP_MIN)", () => {
  const record = baseRecord({
    notes:               { top: [], heart: ["Tuberose", "Jasmine Sambac", "Jasmine Bud", "Rangoon Creeper", "Orris Root"], base: [] },
    notesEvidenceLocked: true,
  });
  const result = validateKnowledgeRecord(record);
  const codes  = result.errors.map(e => e.code);
  assert.ok(!codes.includes("NOTES_TOP_MIN"),
    `Expected no NOTES_TOP_MIN for evidence-locked empty top; got: ${codes.join(", ")}`);
});

// TEST 3: Evidence-lock accepts empty authoritative base tier.
test("TEST 3 — Evidence-lock accepts empty base tier (no NOTES_BASE_MIN)", () => {
  const record = baseRecord({
    notes:               { top: [], heart: ["Tuberose", "Jasmine Sambac", "Jasmine Bud", "Rangoon Creeper", "Orris Root"], base: [] },
    notesEvidenceLocked: true,
  });
  const result = validateKnowledgeRecord(record);
  const codes  = result.errors.map(e => e.code);
  assert.ok(!codes.includes("NOTES_BASE_MIN"),
    `Expected no NOTES_BASE_MIN for evidence-locked empty base; got: ${codes.join(", ")}`);
});

// TEST 4: Evidence-lock accepts one-note tiers.
test("TEST 4 — Evidence-lock accepts one-note tiers (no NOTES_*_MIN)", () => {
  const record = baseRecord({
    notes:               { top: ["Herbal Notes"], heart: ["Pear"], base: ["Physcool®"] },
    notesEvidenceLocked: true,
  });
  const result = validateKnowledgeRecord(record);
  const tierMinCodes = result.errors.map(e => e.code).filter(c =>
    c === "NOTES_TOP_MIN" || c === "NOTES_HEART_MIN" || c === "NOTES_BASE_MIN",
  );
  assert.equal(tierMinCodes.length, 0,
    `Expected no tier-min errors for evidence-locked 1-per-tier notes; got: ${tierMinCodes.join(", ")}`);
});

// TEST 5: Scaffold preserves notesStructured exactly.
test("TEST 5 — Scaffold preserves notesStructured top/heart/base exactly", () => {
  const display = baseDisplay({
    notes:               ["Tuberose", "Jasmine Sambac", "Jasmine Bud", "Rangoon Creeper", "Orris Root"],
    notesEvidenceLocked: true,
    notesStructured:     { top: [], heart: ["Tuberose","Jasmine Sambac","Jasmine Bud","Rangoon Creeper","Orris Root"], base: [] },
  });
  const { record } = scaffold(display);
  assert.deepEqual(record.notes.top,   [], "top should be empty array");
  assert.deepEqual(record.notes.heart, ["Tuberose","Jasmine Sambac","Jasmine Bud","Rangoon Creeper","Orris Root"]);
  assert.deepEqual(record.notes.base,  [], "base should be empty array");
  assert.equal(record.notesEvidenceLocked, true, "notesEvidenceLocked should propagate to scaffold record");
});

// TEST 6: Scaffold does not redistribute notes between tiers.
test("TEST 6 — Scaffold does not redistribute notes between tiers", () => {
  const display = baseDisplay({
    notes:               ["Herbal Notes", "Pear", "Physcool®"],
    notesEvidenceLocked: true,
    notesStructured:     { top: ["Herbal Notes"], heart: ["Pear"], base: ["Physcool®"] },
  });
  const { record } = scaffold(display);
  assert.deepEqual(record.notes.top,   ["Herbal Notes"], "top should contain exactly the governed evidence");
  assert.deepEqual(record.notes.heart, ["Pear"],         "heart should contain exactly the governed evidence");
  assert.deepEqual(record.notes.base,  ["Physcool®"],    "base should contain exactly the governed evidence — Physcool® preserved verbatim");
});

// TEST 7: Gucci Bloom acceptance fixture.
test("TEST 7 — Gucci Bloom: unordered bouquet passes evidence-lock validation", () => {
  const record = baseRecord({
    name:                "gucci-bloom-inspired",
    id:                  "gucci-bloom-inspired",
    slug:                "gucci-bloom-inspired",
    notes:               { top: [], heart: ["Tuberose","Jasmine Sambac","Jasmine Bud","Rangoon Creeper","Orris Root"], base: [] },
    notesEvidenceLocked: true,
  });
  const result = validateKnowledgeRecord(record);
  const tierMinCodes = result.errors.map(e => e.code).filter(c =>
    c === "NOTES_TOP_MIN" || c === "NOTES_HEART_MIN" || c === "NOTES_BASE_MIN",
  );
  assert.equal(tierMinCodes.length, 0,
    `Gucci Bloom: expected no tier-min errors; got: ${tierMinCodes.join(", ")}`);
  // Verify no invented notes — heart contains exactly the 5 canonical ingredients
  assert.deepEqual(
    [...record.notes.heart].sort(),
    ["Jasmine Bud","Jasmine Sambac","Orris Root","Rangoon Creeper","Tuberose"],
    "Gucci Bloom heart notes must be exactly the 5 canonical ingredients",
  );
  assert.deepEqual(record.notes.top,  [], "Gucci Bloom: top must remain empty");
  assert.deepEqual(record.notes.base, [], "Gucci Bloom: base must remain empty");
});

// TEST 8: H24 Herbes Vives acceptance fixture.
test("TEST 8 — H24 Herbes Vives: sparse 1-per-tier passes evidence-lock validation", () => {
  const record = baseRecord({
    name:                "h24-herbes-vives-inspired",
    id:                  "h24-herbes-vives-inspired",
    slug:                "h24-herbes-vives-inspired",
    notes:               { top: ["Herbal Notes"], heart: ["Pear"], base: ["Physcool®"] },
    notesEvidenceLocked: true,
  });
  const result = validateKnowledgeRecord(record);
  const tierMinCodes = result.errors.map(e => e.code).filter(c =>
    c === "NOTES_TOP_MIN" || c === "NOTES_HEART_MIN" || c === "NOTES_BASE_MIN",
  );
  assert.equal(tierMinCodes.length, 0,
    `H24 Herbes Vives: expected no tier-min errors; got: ${tierMinCodes.join(", ")}`);
  // Verify Physcool® is preserved verbatim as evidence-backed proprietary molecule
  assert.ok(record.notes.base.includes("Physcool®"),
    "H24: Physcool® must be preserved verbatim — it is a registered Hermès molecule");
});

// TEST 9: Evidence-lock does not bypass unrelated validation failures.
test("TEST 9 — Evidence-lock does not bypass unrelated validation failures", () => {
  const record = baseRecord({
    notes:               { top: [], heart: ["Rose", "Jasmine"], base: [] },
    notesEvidenceLocked: true,
    family:              [],  // FAMILY_EMPTY error — unrelated to evidence-lock
  });
  const result = validateKnowledgeRecord(record);
  const codes  = result.errors.map(e => e.code);
  assert.ok(codes.includes("FAMILY_EMPTY"),
    `Expected FAMILY_EMPTY error to still fire on evidence-locked record; got: ${codes.join(", ")}`);
  assert.equal(result.status, "FAIL",
    "Evidence-locked record with empty family must still FAIL validation");
  // And tier-min errors must NOT appear (they were exempted)
  assert.ok(!codes.includes("NOTES_TOP_MIN"),  "NOTES_TOP_MIN must not appear (evidence-locked)");
  assert.ok(!codes.includes("NOTES_BASE_MIN"),  "NOTES_BASE_MIN must not appear (evidence-locked)");
});

// TEST 10: Editorial governance (DESCRIPTION_REQUIRED) is untouched by evidence-lock.
test("TEST 10 — Editorial governance intact: DESCRIPTION_REQUIRED still fires on evidence-locked records", () => {
  const record = baseRecord({
    notes:               { top: [], heart: ["Rose", "Jasmine"], base: [] },
    notesEvidenceLocked: true,
    description:         undefined,  // Remove the description
  });
  const result = validateKnowledgeRecord(record);
  const codes  = result.errors.map(e => e.code);
  assert.ok(codes.includes("DESCRIPTION_REQUIRED"),
    `Expected DESCRIPTION_REQUIRED to still fire on evidence-locked records without description; got: ${codes.join(", ")}`);
});

// ── EP-CAT-P3C-R4: Note identity preservation tests ──────────────────────────
// Governing principle: EVIDENCE > MODEL KNOWLEDGE.
// AI generation may NOT add, remove, rename, or rearrange governed note evidence.

// TEST 11: Evidence-lock preserves exact note count per tier — no additions possible.
test("TEST 11 — Evidence-lock: no notes can be added to any governed tier", () => {
  const governed = {
    top:   ["Bergamot"],
    heart: ["Rose", "Jasmine"],
    base:  ["Musk"],
  };
  const display = baseDisplay({
    notes:               [...governed.top, ...governed.heart, ...governed.base],
    notesEvidenceLocked: true,
    notesStructured:     governed,
  });
  const { record } = scaffold(display);
  assert.equal(record.notes.top.length,   1, `top must have exactly 1 note; got ${record.notes.top.length}`);
  assert.equal(record.notes.heart.length, 2, `heart must have exactly 2 notes; got ${record.notes.heart.length}`);
  assert.equal(record.notes.base.length,  1, `base must have exactly 1 note; got ${record.notes.base.length}`);
});

// TEST 12: Evidence-lock preserves exact note identities — no removals, no renames.
test("TEST 12 — Evidence-lock: exact note identities preserved (no removals, no renames)", () => {
  const governed = {
    top:   ["Sicilian Citrus"],
    heart: ["White Peony", "Honeysuckle"],
    base:  ["Sandalwood", "Ambrette"],
  };
  const display = baseDisplay({
    notes:               [...governed.top, ...governed.heart, ...governed.base],
    notesEvidenceLocked: true,
    notesStructured:     governed,
  });
  const { record } = scaffold(display);
  assert.deepEqual(record.notes.top,   governed.top,   "top notes must match governed identities exactly");
  assert.deepEqual(record.notes.heart, governed.heart, "heart notes must match governed identities exactly");
  assert.deepEqual(record.notes.base,  governed.base,  "base notes must match governed identities exactly");
});

// TEST 13: Evidence-lock preserves specificity — "Jasmine" must not be broadened or
// narrowed (e.g. renamed to "Jasmine Sambac") without Founder approval.
test("TEST 13 — Evidence-lock: note specificity cannot be altered (no AI rename)", () => {
  const governed = {
    top:   ["Sicilian Lemon"],
    heart: ["Jasmine", "White Rose"],  // "Jasmine" not "Jasmine Sambac"; "White Rose" not "Rose"
    base:  ["Cedar"],                  // "Cedar" not "Cedarwood"
  };
  const display = baseDisplay({
    notes:               [...governed.top, ...governed.heart, ...governed.base],
    notesEvidenceLocked: true,
    notesStructured:     governed,
  });
  const { record } = scaffold(display);
  assert.ok(record.notes.heart.includes("Jasmine"),
    `"Jasmine" must be preserved verbatim — must NOT be renamed to "Jasmine Sambac"`);
  assert.ok(!record.notes.heart.includes("Jasmine Sambac"),
    `"Jasmine Sambac" must not appear — it is an AI rename of governed "Jasmine"`);
  assert.ok(record.notes.heart.includes("White Rose"),
    `"White Rose" must be preserved verbatim — must NOT be broadened to "Rose"`);
  assert.ok(record.notes.base.includes("Cedar"),
    `"Cedar" must be preserved verbatim — must NOT be renamed to "Cedarwood"`);
});

// TEST 14: Light Blue governed evidence preserved exactly — full fixture.
// Validates the R3 regression case: governed Bellflower/Bamboo/White Rose were
// wrongly dropped; Bergamot/Pink Grapefruit/Lily of the Valley were wrongly added.
test("TEST 14 — Light Blue: exact governed evidence preserved (R3 regression fixture)", () => {
  const lightBlue = {
    top:   ["Sicilian Lemon", "Apple", "Cedar", "Bellflower"],
    heart: ["Bamboo", "Jasmine", "White Rose"],
    base:  ["Cedar", "Musk", "Amber"],  // Cedar cross-tier: verified in both top and base
  };
  const display = baseDisplay({
    title:               "Light Blue Inspired",
    collection:          "Rose",
    notes:               ["Sicilian Lemon", "Apple", "Cedar", "Bellflower", "Bamboo", "Jasmine", "White Rose", "Musk", "Amber"],
    notesEvidenceLocked: true,
    notesStructured:     lightBlue,
  });
  const { record } = scaffold(display);
  assert.deepEqual(record.notes.top,   lightBlue.top,   "Light Blue top notes must match governed evidence exactly");
  assert.deepEqual(record.notes.heart, lightBlue.heart, "Light Blue heart notes must match governed evidence exactly");
  assert.deepEqual(record.notes.base,  lightBlue.base,  "Light Blue base notes must match governed evidence exactly");
  // Cedar cross-tier: must appear in both top and base
  assert.ok(record.notes.top.includes("Cedar"),  "Cedar must appear in top (research evidence)");
  assert.ok(record.notes.base.includes("Cedar"), "Cedar must appear in base (research evidence, cross-tier)");
  // Governed notes dropped in R3 must now be present
  assert.ok(record.notes.top.includes("Bellflower"),   "Bellflower must be in top — was wrongly dropped by R3 AI");
  assert.ok(record.notes.heart.includes("Bamboo"),     "Bamboo must be in heart — was wrongly dropped by R3 AI");
  assert.ok(record.notes.heart.includes("White Rose"), "White Rose must be in heart — was wrongly dropped by R3 AI");
  // AI-invented additions from R3 must NOT appear
  const allNotes = [...record.notes.top, ...record.notes.heart, ...record.notes.base];
  assert.ok(!allNotes.includes("Bergamot"),           "Bergamot must NOT appear — AI addition in R3");
  assert.ok(!allNotes.includes("Pink Grapefruit"),    "Pink Grapefruit must NOT appear — AI addition in R3");
  assert.ok(!allNotes.includes("Green Apple"),        "Green Apple must NOT appear — AI rename in R3");
  assert.ok(!allNotes.includes("Lily of the Valley"), "Lily of the Valley must NOT appear — AI addition in R3");
  assert.ok(!allNotes.includes("Jasmine Sambac"),     "Jasmine Sambac must NOT appear — AI rename in R3");
  assert.ok(!allNotes.includes("Cedarwood"),          "Cedarwood must NOT appear — AI rename in R3");
  assert.ok(!allNotes.includes("White Musk"),         "White Musk must NOT appear — AI rename in R3");
});

// TEST 15: Non-evidence-locked scaffold does NOT set notesEvidenceLocked — CompositionProducer
// pathway (normal mode) remains intact for entries without governed note evidence.
test("TEST 15 — Non-evidence-locked scaffold preserves CompositionProducer pathway", () => {
  const display = baseDisplay({
    notes: ["Bergamot", "Rose", "Musk"],
    // notesEvidenceLocked intentionally absent
  });
  const { record } = scaffold(display);
  assert.notEqual(record.notesEvidenceLocked, true,
    "Non-locked scaffold must NOT set notesEvidenceLocked — CompositionProducer preCheck must pass for this record");
});

// ── EP-CAT-P4C: Wave 2 UNORDERED_GOVERNED_NOTES regression tests ─────────────
// These tests guard the five Wave 2 Jo Malone London / unordered-bouquet entries.
// The UNORDERED_GOVERNED_NOTES pattern:
//   notes=[all], notesStructured={ top:[], heart:[...all], base:[] }, notesEvidenceLocked:true
// This is a TRANSPORT CONVENTION — heartNotes[] does NOT assert that these notes
// are semantically "heart tier". These tests enforce that the pipeline cannot:
//   - enrich notes from the transport heart[] into a fabricated pyramid
//   - add notes not present in the governed set
//   - redistribute notes into top or base tiers
//   - silently promote the transport heart[] to a semantic tier assertion

// TEST 16: UNORDERED_GOVERNED_NOTES — scaffold preserves empty top and base exactly.
test("TEST 16 — Wave 2 UNORDERED: scaffold preserves empty top[] and base[] (no tier invention)", () => {
  // Peony & Blush Suede fixture — Jo Malone London, unordered bouquet
  const display = baseDisplay({
    title:               "Peony Blush Suede Inspired",
    collection:          "Elite",
    notes:               ["Red Apple", "Peony", "Rose", "Jasmine", "Carnation", "Suede"],
    notesEvidenceLocked: true,
    notesStructured: {
      top:   [],
      heart: ["Red Apple", "Peony", "Rose", "Jasmine", "Carnation", "Suede"],
      base:  [],
    },
  });
  const { record } = scaffold(display);
  assert.deepEqual(record.notes.top,  [], "UNORDERED top must remain empty — no top-note invention");
  assert.deepEqual(record.notes.base, [], "UNORDERED base must remain empty — no base-note invention");
});

// TEST 17: UNORDERED_GOVERNED_NOTES — heart[] note identities survive scaffold exactly.
test("TEST 17 — Wave 2 UNORDERED: governed note identities survive scaffold byte-for-byte", () => {
  const governed = ["Red Apple", "Peony", "Rose", "Jasmine", "Carnation", "Suede"];
  const display = baseDisplay({
    title:               "Peony Blush Suede Inspired",
    collection:          "Elite",
    notes:               governed,
    notesEvidenceLocked: true,
    notesStructured:     { top: [], heart: governed, base: [] },
  });
  const { record } = scaffold(display);
  assert.deepEqual(record.notes.heart, governed,
    "UNORDERED heart notes must be byte-for-byte identical to the governed evidence");
  assert.equal(record.notes.heart.length, 6,
    `UNORDERED heart must have exactly 6 notes (got ${record.notes.heart.length}) — no notes added`);
});

// TEST 18: UNORDERED_GOVERNED_NOTES — validation passes (no tier-min errors).
test("TEST 18 — Wave 2 UNORDERED: validation accepts empty top/base tiers (no tier-min errors)", () => {
  const record = baseRecord({
    name:                "peony-blush-suede-inspired",
    id:                  "peony-blush-suede-inspired",
    slug:                "peony-blush-suede-inspired",
    notes:               { top: [], heart: ["Red Apple", "Peony", "Rose", "Jasmine", "Carnation", "Suede"], base: [] },
    notesEvidenceLocked: true,
  });
  const result = validateKnowledgeRecord(record);
  const tierMinCodes = result.errors.map(e => e.code).filter(c =>
    c === "NOTES_TOP_MIN" || c === "NOTES_HEART_MIN" || c === "NOTES_BASE_MIN",
  );
  assert.equal(tierMinCodes.length, 0,
    `UNORDERED entry must pass validation without tier-min errors; got: ${tierMinCodes.join(", ")}`);
});

// TEST 19: UNORDERED_GOVERNED_NOTES — notes cannot be redistributed into a pyramid.
// The factory must never split heart[] transport into top/heart/base.
test("TEST 19 — Wave 2 UNORDERED: notes cannot be redistributed from transport heart[] into pyramid", () => {
  const governed = ["Damask Rose", "Agarwood (Oud)", "Praline", "Clove"];
  const display = baseDisplay({
    title:               "Velvet Rose Oud Inspired",
    collection:          "Elite",
    notes:               governed,
    notesEvidenceLocked: true,
    notesStructured:     { top: [], heart: governed, base: [] },
  });
  const { record } = scaffold(display);
  // All 4 notes must remain in heart; none may have been redistributed
  assert.deepEqual(record.notes.top,   [],      "Redistribution guard: top must be empty []");
  assert.deepEqual(record.notes.base,  [],      "Redistribution guard: base must be empty []");
  assert.equal(record.notes.heart.length, 4,
    `Redistribution guard: all 4 notes must remain in heart (got ${record.notes.heart.length})`);
  // Ensure Agarwood (Oud) — a likely "base note" by convention — has not been moved
  // (if deepEqual(base, []) passed above, base is already empty — includes check redundant)
  assert.ok(record.notes.heart.includes("Agarwood (Oud)"),
    "Agarwood (Oud) must NOT be moved to base — it is a transport convention in heart[], not a semantic tier claim");
});

// TEST 20: UNORDERED_GOVERNED_NOTES — notes cannot be enriched with AI-inferred additions.
// Even if a note like "Bergamot" is well-known for a fragrance, it must not be added
// unless it appears in the governed evidence set.
test("TEST 20 — Wave 2 UNORDERED: no notes can be added to the governed set (no enrichment)", () => {
  const governed = ["Agarwood (Oud)", "Bergamot", "Virginia Cedar", "Orange", "Amalfi Lemon"];
  const display = baseDisplay({
    title:               "Oud Bergamot Inspired",
    collection:          "Elite",
    notes:               governed,
    notesEvidenceLocked: true,
    notesStructured:     { top: [], heart: governed, base: [] },
  });
  const { record } = scaffold(display);
  const allNotes = [...record.notes.top, ...record.notes.heart, ...record.notes.base];
  // Total notes must not exceed the governed set
  assert.equal(allNotes.length, 5,
    `Total notes must be exactly 5 (the governed set); got ${allNotes.length} — enrichment is prohibited`);
  // Each governed note must appear in the result
  for (const note of governed) {
    assert.ok(allNotes.includes(note), `Governed note "${note}" must be present — not removed`);
  }
});

// TEST 21: UNORDERED_GOVERNED_NOTES — English Pear & Freesia (8-note bouquet).
// Verifies the largest UNORDERED set is preserved without invention.
test("TEST 21 — Wave 2 UNORDERED: English Pear & Freesia 8-note bouquet preserved exactly", () => {
  const governed = ["Pear", "Melon", "Freesia", "Rose", "Musk", "Amber", "Patchouli", "Rhubarb"];
  const display = baseDisplay({
    title:               "English Pear Freesia Inspired",
    collection:          "Elite",
    notes:               governed,
    notesEvidenceLocked: true,
    notesStructured:     { top: [], heart: governed, base: [] },
  });
  const { record } = scaffold(display);
  assert.deepEqual(record.notes.top,  [], "English Pear & Freesia top must be empty (unordered)");
  assert.deepEqual(record.notes.base, [], "English Pear & Freesia base must be empty (unordered)");
  assert.deepEqual(
    [...record.notes.heart].sort(),
    [...governed].sort(),
    "English Pear & Freesia: all 8 governed notes must survive scaffold exactly",
  );
});

// TEST 22: Wave 2 sparse structured entry — Boss Bottled Elixir 2-2-2 preserved.
// (Not UNORDERED; standard pyramid with small tiers.)
test("TEST 22 — Wave 2 SPARSE structured: Boss Bottled Elixir 2-2-2 preserved exactly", () => {
  const display = baseDisplay({
    title:               "Boss Bottled Elixir Inspired",
    collection:          "Skye",
    notes:               ["Frankincense", "Cardamom", "Patchouli", "Vetiver", "Labdanum", "Cedar"],
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Frankincense", "Cardamom"],
      heart: ["Patchouli", "Vetiver"],
      base:  ["Labdanum", "Cedar"],
    },
  });
  const { record } = scaffold(display);
  assert.deepEqual(record.notes.top,   ["Frankincense", "Cardamom"], "Boss Bottled Elixir top preserved");
  assert.deepEqual(record.notes.heart, ["Patchouli", "Vetiver"],     "Boss Bottled Elixir heart preserved");
  assert.deepEqual(record.notes.base,  ["Labdanum", "Cedar"],        "Boss Bottled Elixir base preserved");
});

// TEST 23: Wave 2 branded molecules — Montblanc Explorer symbols survive scaffold.
test("TEST 23 — Wave 2: Montblanc Explorer branded molecule names survive scaffold verbatim", () => {
  const display = baseDisplay({
    title:               "Montblanc Explorer Inspired",
    collection:          "Skye",
    notes:               ["OrPur® Bergamot", "French Sage", "Pink Pepper", "OrPur® Vetiver", "Skin", "Patchouli", "Cocoa", "Ambrofix™", "Akigalawood®"],
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["OrPur® Bergamot", "French Sage", "Pink Pepper"],
      heart: ["OrPur® Vetiver", "Skin"],
      base:  ["Patchouli", "Cocoa", "Ambrofix™", "Akigalawood®"],
    },
  });
  const { record } = scaffold(display);
  const allNotes = [...record.notes.top, ...record.notes.heart, ...record.notes.base];
  assert.ok(allNotes.includes("OrPur® Bergamot"),  "OrPur® Bergamot must survive scaffold verbatim");
  assert.ok(allNotes.includes("OrPur® Vetiver"),   "OrPur® Vetiver must survive scaffold verbatim");
  assert.ok(allNotes.includes("Ambrofix™"),         "Ambrofix™ must survive scaffold verbatim");
  assert.ok(allNotes.includes("Akigalawood®"),      "Akigalawood® must survive scaffold verbatim");
});

// ── UNORDERED semantic regression helper ─────────────────────────────────────
// Checks that a committed UNORDERED_GOVERNED_NOTES draft's customer-facing copy
// contains no temporal note-sequencing or tier language.
// Must be defined before any test that calls it (harness executes fn() immediately).

const UNORDERED_SEQUENCING_PATTERNS: Array<[RegExp, string]> = [
  [/\bopens with\b/i,    "opens with"],
  [/\bopen into\b/i,     "open into"],
  [/\bopening\b/i,       "opening (olfactory)"],
  [/\bstarts with\b/i,   "starts with"],
  [/\bfollowed by\b/i,   "followed by"],
  [/\bgives way to\b/i,  "gives way to"],
  [/\bsettles into\b/i,  "settles into"],
  [/\bdries down\b/i,    "dries down"],
  [/\bdrydown\b/i,       "drydown"],
  [/\bfinishes with\b/i, "finishes with"],
  [/\bthen\b/i,          "then (temporal connector)"],
  [/\bunfolds\b/i,       "unfolds (temporal development)"],
  [/\bfloral heart\b/i,  "floral heart (tier claim)"],
  [/\boud heart\b/i,     "oud heart (tier claim)"],
  [/\bdark heart\b/i,    "dark heart (tier claim)"],
  [/\bheart of\b/i,      "heart of (tier claim)"],
  [/\bbase of\b/i,       "base of (tier claim)"],
];

function assertNoUnorderedSequencing(
  draft: { description?: string; subtitle?: string; recommendedFor?: string[] },
  slug: string,
): void {
  const fields: string[] = [
    draft.description ?? "",
    draft.subtitle    ?? "",
    ...(draft.recommendedFor ?? []),
  ];
  const combined = fields.join(" ");
  const violations: string[] = [];
  for (const [pattern, label] of UNORDERED_SEQUENCING_PATTERNS) {
    if (pattern.test(combined)) violations.push(label);
  }
  assert.equal(violations.length, 0,
    `${slug}: UNORDERED draft must not contain sequencing/tier language; found: ${violations.join(", ")}`);
}

// TEST 24: UNORDERED semantic regression — Peony & Blush Suede customer-facing copy must
// not assert or imply temporal note sequence. For UNORDERED_GOVERNED_NOTES we know only
// that governed notes are present — not which appear first, develop, or dry down.
// Imports the actual committed pilot draft so future copy regressions are caught.
test("TEST 24 — Wave 2 UNORDERED: peony draft customer copy free of unsupported note-sequencing language", () => {
  assertNoUnorderedSequencing(peonyBlushSuedeInspired, "peony-blush-suede-inspired");
});

// TEST 25-28: UNORDERED semantic regression for Batch 1 Ep-CAT-P4E UNORDERED records.
// Imports committed pilot/batch drafts; a future regeneration regression will be caught here.

test("TEST 25 — Wave 2 UNORDERED: gold-oud draft customer copy free of sequencing language", () => {
  assertNoUnorderedSequencing(goldOudInspired, "gold-oud-inspired");
});

test("TEST 26 — Wave 2 UNORDERED: velvet-rose-oud draft customer copy free of sequencing language", () => {
  assertNoUnorderedSequencing(velvetRoseOudInspired, "velvet-rose-oud-inspired");
});

test("TEST 27 — Wave 2 UNORDERED: english-pear-freesia draft customer copy free of sequencing language", () => {
  assertNoUnorderedSequencing(englishPearFreesiaInspired, "english-pear-freesia-inspired");
});

test("TEST 28 — Wave 2 UNORDERED: oud-bergamot draft customer copy free of sequencing language", () => {
  assertNoUnorderedSequencing(oudBergamotInspired, "oud-bergamot-inspired");
});

// ── Summary ───────────────────────────────────────────────────────────────────

console.log(`\n${"─".repeat(56)}`);
console.log(`  Results: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  console.error(`\n  FAIL — ${failed} test(s) did not pass.\n`);
  process.exit(1);
} else {
  console.log(`\n  PASS — all ${passed} evidence-lock regression tests passed.\n`);
}
