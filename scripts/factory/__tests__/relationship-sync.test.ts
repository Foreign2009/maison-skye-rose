/**
 * RelationshipSynchronizer — Regression Tests
 *
 * EP-CAT-P3C-R18: validates Case A multi-line array fix in addSlugToRelationshipField.
 * Covers single-line, multi-line (with/without trailing comma), empty arrays,
 * duplicate prevention, and the exact hypnotic-poison-inspired failure scenario.
 *
 * Run: npx tsx scripts/factory/__tests__/relationship-sync.test.ts
 */

import assert from "node:assert/strict";
import { addSlugToRelationshipField } from "../graph/RelationshipSynchronizer";

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

// ── Fixtures ──────────────────────────────────────────────────────────────────

const SINGLE_LINE_ALT = `import type { FragranceKnowledge } from "../types";

export const testFrag = {
  id: "test-inspired",

  // ── Relationships ─────────────────────────────────────────────────────────────
  relationships: {
    alternatives: ["a-slug", "b-slug"],
    wardrobePartners: ["c-slug"],
  },

  // ── Intelligence
  sweetness: 3,
};
`;

const MULTI_LINE_ALT = `import type { FragranceKnowledge } from "../types";

export const testFrag = {
  id: "test-inspired",

  // ── Relationships ─────────────────────────────────────────────────────────────
  relationships: {
    alternatives: [
      "a-slug",
      "b-slug",
    ],
    wardrobePartners: ["c-slug"],
  },

  // ── Intelligence
  sweetness: 3,
};
`;

const SINGLE_LINE_WP = `import type { FragranceKnowledge } from "../types";

export const testFrag = {
  id: "test-inspired",

  // ── Relationships ─────────────────────────────────────────────────────────────
  relationships: {
    alternatives: ["c-slug"],
    wardrobePartners: ["a-slug"],
  },

  // ── Intelligence
  sweetness: 3,
};
`;

const MULTI_LINE_WP = `import type { FragranceKnowledge } from "../types";

export const testFrag = {
  id: "test-inspired",

  // ── Relationships ─────────────────────────────────────────────────────────────
  relationships: {
    alternatives: ["c-slug"],
    wardrobePartners: [
      "a-slug",
      "b-slug",
    ],
  },

  // ── Intelligence
  sweetness: 3,
};
`;

const EMPTY_ALT = `import type { FragranceKnowledge } from "../types";

export const testFrag = {
  id: "test-inspired",

  // ── Relationships ─────────────────────────────────────────────────────────────
  relationships: {
    alternatives: [],
  },

  // ── Intelligence
  sweetness: 3,
};
`;

// Exact structural replica of hypnotic-poison-inspired.ts relationships block
const HYPNOTIC_POISON_FIXTURE = `import type { FragranceKnowledge } from "../types";

export const hypnoticPoisonInspired = {
  id: "hypnotic-poison-inspired",

  // ── Relationships ─────────────────────────────────────────────────────────────
  relationships: {
    alternatives: [
      "black-opium-inspired",
      "delina-exclusif-inspired",
      "la-vie-est-belle-inspired",
      "love-don't-be-shy-inspired",
      "poison-girl-inspired",
    ],
    wardrobePartners: ["delina-inspired", "baccarat-rouge-540-inspired"],
  },

  // ── Intelligence
  sweetness: 4,
};
`;

// Multi-line array where last element has no trailing comma (non-standard)
const MULTI_LINE_NO_TRAILING_COMMA = `import type { FragranceKnowledge } from "../types";

export const testFrag = {
  id: "test-inspired",

  // ── Relationships ─────────────────────────────────────────────────────────────
  relationships: {
    alternatives: [
      "a-slug",
      "b-slug"
    ],
  },

  // ── Intelligence
  sweetness: 3,
};
`;

// ── Tests ─────────────────────────────────────────────────────────────────────

console.log("\nRelationshipSynchronizer — addSlugToRelationshipField\n");

test("TEST 1 — single-line alternatives: appends slug inline", () => {
  const result = addSlugToRelationshipField(SINGLE_LINE_ALT, "alternatives", "new-slug");
  assert.ok(result !== null, "expected non-null result");
  assert.ok(
    result.includes(`alternatives: ["a-slug", "b-slug", "new-slug"]`),
    "slug not appended correctly to single-line array",
  );
});

test("TEST 2 — multi-line alternatives: adds slug as new indented line", () => {
  const result = addSlugToRelationshipField(MULTI_LINE_ALT, "alternatives", "new-slug");
  assert.ok(result !== null, "expected non-null result");
  assert.ok(result.includes('"new-slug",'), "new slug missing from result");
  assert.ok(!result.includes(",\n    ,"), "double-comma sparse-array hole detected");
});

test("TEST 3 — single-line wardrobePartners: appends slug inline", () => {
  const result = addSlugToRelationshipField(SINGLE_LINE_WP, "wardrobePartners", "new-slug");
  assert.ok(result !== null, "expected non-null result");
  assert.ok(
    result.includes(`wardrobePartners: ["a-slug", "new-slug"]`),
    "slug not appended correctly to wardrobePartners",
  );
});

test("TEST 4 — multi-line wardrobePartners: adds slug as new indented line", () => {
  const result = addSlugToRelationshipField(MULTI_LINE_WP, "wardrobePartners", "new-slug");
  assert.ok(result !== null, "expected non-null result");
  assert.ok(result.includes('"new-slug",'), "new slug missing from result");
  assert.ok(!result.includes(",\n    ,"), "double-comma sparse-array hole detected");
});

test("TEST 5 — duplicate slug: returns null, no modification made", () => {
  const result = addSlugToRelationshipField(SINGLE_LINE_ALT, "alternatives", "a-slug");
  assert.equal(result, null, "expected null for already-present slug");
});

test("TEST 6 — empty array: inserts slug as first element", () => {
  const result = addSlugToRelationshipField(EMPTY_ALT, "alternatives", "new-slug");
  assert.ok(result !== null, "expected non-null result");
  assert.ok(
    result.includes(`alternatives: ["new-slug"]`),
    "slug not inserted into empty array",
  );
});

test("TEST 7 — multi-line with trailing comma: element indented correctly before closing bracket", () => {
  const result = addSlugToRelationshipField(MULTI_LINE_ALT, "alternatives", "d-slug");
  assert.ok(result !== null, "expected non-null result");
  // New element must appear on its own line with element-level indentation (6 spaces),
  // followed by a trailing comma, then the closing bracket on its own line (4 spaces).
  assert.ok(
    result.includes('\n      "d-slug",\n    ]'),
    "new element not indented correctly (expected 6-space element + 4-space closing bracket)",
  );
});

test("TEST 8 — multi-line without trailing comma: fallback produces no sparse-array hole", () => {
  const result = addSlugToRelationshipField(MULTI_LINE_NO_TRAILING_COMMA, "alternatives", "new-slug");
  assert.ok(result !== null, "expected non-null result");
  assert.ok(!result.includes("undefined"), "result contains 'undefined'");
  assert.ok(!/,\s*,/.test(result), "double-comma (sparse-array hole) detected in fallback result");
});

test("TEST 9 — hypnotic-poison-inspired fixture: black-opium-over-red-inspired added", () => {
  const result = addSlugToRelationshipField(
    HYPNOTIC_POISON_FIXTURE,
    "alternatives",
    "black-opium-over-red-inspired",
  );
  assert.ok(result !== null, "expected non-null result");
  assert.ok(
    result.includes('"black-opium-over-red-inspired"'),
    "target slug not found in result",
  );
});

test("TEST 10 — hypnotic-poison-inspired fixture: result contains no 'undefined' string", () => {
  const result = addSlugToRelationshipField(
    HYPNOTIC_POISON_FIXTURE,
    "alternatives",
    "black-opium-over-red-inspired",
  );
  assert.ok(result !== null, "expected non-null result");
  assert.ok(!result.includes("undefined"), "result contains 'undefined' — sparse array hole present");
});

test("TEST 11 — hypnotic-poison-inspired fixture: no double commas in result", () => {
  const result = addSlugToRelationshipField(
    HYPNOTIC_POISON_FIXTURE,
    "alternatives",
    "black-opium-over-red-inspired",
  );
  assert.ok(result !== null, "expected non-null result");
  assert.ok(
    !/,\s*,/.test(result),
    "double-comma (sparse-array hole) detected in result",
  );
});

test("TEST 12 — only targeted field modified; other fields unchanged", () => {
  const result = addSlugToRelationshipField(SINGLE_LINE_ALT, "alternatives", "new-slug");
  assert.ok(result !== null, "expected non-null result");
  assert.ok(
    result.includes(`wardrobePartners: ["c-slug"]`),
    "wardrobePartners was unexpectedly modified",
  );
  assert.ok(
    result.includes(`alternatives: ["a-slug", "b-slug", "new-slug"]`),
    "alternatives not updated",
  );
});

// ── Summary ───────────────────────────────────────────────────────────────────

console.log(`\n${passed + failed} tests: ${passed} PASS, ${failed} FAIL\n`);
if (failed > 0) process.exit(1);
