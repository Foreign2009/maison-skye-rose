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

// ── Summary ───────────────────────────────────────────────────────────────────

console.log(`\n${"─".repeat(56)}`);
console.log(`  Results: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  console.error(`\n  FAIL — ${failed} test(s) did not pass.\n`);
  process.exit(1);
} else {
  console.log(`\n  PASS — all ${passed} evidence-lock regression tests passed.\n`);
}
