/**
 * Gender Propagation — Regression Tests
 *
 * CATALOGUE-FACTORY-GENDER-P1: validates that the evidence-preserving gender
 * design (Option A) propagates explicit staging overrides correctly while
 * leaving all collection-derived fallbacks unchanged.
 *
 * Run: npx tsx scripts/factory/__tests__/gender-propagation.test.ts
 */

import assert from "node:assert/strict";
import { adaptFragrance } from "../../../app/lib/knowledgeAdapter";
import type { DisplayFragrance } from "../../../app/lib/knowledgeAdapter";
import { wave6Catalogue }  from "../data/wave-6-catalogue";

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

function baseSkye(overrides: Partial<DisplayFragrance> = {}): DisplayFragrance {
  return {
    title:      "Test Skye Inspired",
    collection: "Skye",
    subtitle:   "A test fragrance",
    mood:       "Fresh Aromatic",
    profile:    "Aromatic Fresh",
    season:     "Spring",
    notes:      ["Bergamot", "Lavender", "Musk"],
    bestSeller: false,
    newArrival: false,
    prices:     { "5ml": 60, "10ml": 100, "30ml": 250 },
    images:     { "5ml": "/img/5ml.jpg", "10ml": "/img/10ml.jpg", "30ml": "/img/30ml.jpg" },
    ...overrides,
  };
}

function baseRose(overrides: Partial<DisplayFragrance> = {}): DisplayFragrance {
  return {
    title:      "Test Rose Inspired",
    collection: "Rose",
    subtitle:   "A test fragrance",
    mood:       "Romantic Feminine",
    profile:    "Floral",
    season:     "Spring",
    notes:      ["Bergamot", "Rose", "Musk"],
    bestSeller: false,
    newArrival: false,
    prices:     { "5ml": 60, "10ml": 100, "30ml": 250 },
    images:     { "5ml": "/img/5ml.jpg", "10ml": "/img/10ml.jpg", "30ml": "/img/30ml.jpg" },
    ...overrides,
  };
}

function baseElite(overrides: Partial<DisplayFragrance> = {}): DisplayFragrance {
  return {
    title:      "Test Elite Inspired",
    collection: "Elite",
    subtitle:   "A test fragrance",
    mood:       "Rich Oriental",
    profile:    "Oriental Woody",
    season:     "Autumn",
    notes:      ["Saffron", "Oud", "Sandalwood"],
    bestSeller: false,
    newArrival: false,
    prices:     { "5ml": 60, "10ml": 100, "30ml": 250 },
    images:     { "5ml": "/img/5ml.jpg", "10ml": "/img/10ml.jpg", "30ml": "/img/30ml.jpg" },
    ...overrides,
  };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

console.log("\nCATALOGUE-FACTORY-GENDER-P1 — Gender Propagation Regression Tests\n");

// TEST 1: Skye without explicit gender → male (collection fallback)
test("TEST 1 — Skye without explicit gender produces male", () => {
  const result = adaptFragrance(baseSkye());
  assert.strictEqual(result.gender, "male",
    `Expected Skye fallback gender=male; got: ${result.gender}`);
});

// TEST 2: Rose without explicit gender → female (collection fallback)
test("TEST 2 — Rose without explicit gender produces female", () => {
  const result = adaptFragrance(baseRose());
  assert.strictEqual(result.gender, "female",
    `Expected Rose fallback gender=female; got: ${result.gender}`);
});

// TEST 3: Elite without explicit gender → unisex (collection fallback)
test("TEST 3 — Elite without explicit gender produces unisex", () => {
  const result = adaptFragrance(baseElite());
  assert.strictEqual(result.gender, "unisex",
    `Expected Elite fallback gender=unisex; got: ${result.gender}`);
});

// TEST 4: Elite + explicit female → female (the Matière Noire scenario)
test("TEST 4 — Elite + explicit gender=female produces female (override wins)", () => {
  const result = adaptFragrance(baseElite({ gender: "female" }));
  assert.strictEqual(result.gender, "female",
    `Expected Elite+female override gender=female; got: ${result.gender}`);
});

// TEST 5: Elite + explicit male → male
test("TEST 5 — Elite + explicit gender=male produces male (override wins)", () => {
  const result = adaptFragrance(baseElite({ gender: "male" }));
  assert.strictEqual(result.gender, "male",
    `Expected Elite+male override gender=male; got: ${result.gender}`);
});

// TEST 6: Elite + explicit unisex → unisex (explicit field respected even when same as fallback)
test("TEST 6 — Elite + explicit gender=unisex produces unisex (explicit field respected)", () => {
  const result = adaptFragrance(baseElite({ gender: "unisex" }));
  assert.strictEqual(result.gender, "unisex",
    `Expected Elite+unisex override gender=unisex; got: ${result.gender}`);
});

// TEST 7: Rose + explicit male → male (cross-collection override)
test("TEST 7 — Rose + explicit gender=male produces male (override beats Rose fallback)", () => {
  const result = adaptFragrance(baseRose({ gender: "male" }));
  assert.strictEqual(result.gender, "male",
    `Expected Rose+male override gender=male; got: ${result.gender}`);
});

// TEST 8: Skye + explicit unisex → unisex (cross-collection override)
test("TEST 8 — Skye + explicit gender=unisex produces unisex (override beats Skye fallback)", () => {
  const result = adaptFragrance(baseSkye({ gender: "unisex" }));
  assert.strictEqual(result.gender, "unisex",
    `Expected Skye+unisex override gender=unisex; got: ${result.gender}`);
});

// TEST 9: Wave 6 Matière Noire staging record carries explicit gender=female
test("TEST 9 — Wave 6 matiere-noire-inspired staging record has gender=female", () => {
  const record = wave6Catalogue.find(f =>
    f.title.toLowerCase().replace(/\s+/g, "-") === "matiere-noire-inspired"
  );
  assert.ok(record !== undefined,
    "matiere-noire-inspired not found in wave6Catalogue");
  assert.strictEqual(record.gender, "female",
    `Expected wave-6-catalogue matiere-noire gender=female; got: ${record.gender}`);
});

// TEST 10: adaptFragrance(Wave 6 Matière Noire) produces gender=female
test("TEST 10 — adaptFragrance(Wave 6 matiere-noire-inspired) produces gender=female", () => {
  const record = wave6Catalogue.find(f =>
    f.title.toLowerCase().replace(/\s+/g, "-") === "matiere-noire-inspired"
  );
  assert.ok(record !== undefined,
    "matiere-noire-inspired not found in wave6Catalogue");
  const adapted = adaptFragrance(record);
  assert.strictEqual(adapted.gender, "female",
    `Expected adaptFragrance(matiere-noire) gender=female; got: ${adapted.gender}`);
});

// TEST 11: Records without explicit gender field: collection fallback is identical (backward compatibility).
// Proves this episode does not alter production behaviour for records that carry no gender field.
test("TEST 11 — Records without gender field produce identical collection-derived fallback (backward compat)", () => {
  // Fixtures intentionally carry no gender property — matching production catalogue shape
  const skyeRecord  = baseSkye();
  const roseRecord  = baseRose();
  const eliteRecord = baseElite();

  // Verify the fixtures genuinely lack the field
  assert.strictEqual(skyeRecord.gender,  undefined, "Skye fixture must not have gender field set");
  assert.strictEqual(roseRecord.gender,  undefined, "Rose fixture must not have gender field set");
  assert.strictEqual(eliteRecord.gender, undefined, "Elite fixture must not have gender field set");

  // Verify fallback produces the pre-change LEGACY_GENDER result exactly
  assert.strictEqual(adaptFragrance(skyeRecord).gender,  "male",   "Skye fallback must remain male");
  assert.strictEqual(adaptFragrance(roseRecord).gender,  "female", "Rose fallback must remain female");
  assert.strictEqual(adaptFragrance(eliteRecord).gender, "unisex", "Elite fallback must remain unisex");
});

// ── Summary ────────────────────────────────────────────────────────────────────

console.log(`\n${"─".repeat(56)}`);
console.log(`  Results: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  console.error(`\n  FAIL — ${failed} test(s) did not pass.\n`);
  process.exit(1);
} else {
  console.log(`\n  PASS — all ${passed} gender propagation regression tests passed.\n`);
}
