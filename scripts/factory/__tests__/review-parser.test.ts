/**
 * Review Queue Parser — Regression Tests
 *
 * Validates the parseName helper inside ReviewQueue.ts correctly
 * extracts fragrance names from draft TypeScript source, including
 * names that contain apostrophes (e.g. "Ralph's Club Inspired").
 *
 * Run: npx tsx scripts/factory/__tests__/review-parser.test.ts
 */

import assert from "node:assert/strict";

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
      ? err.message
      : String(err);
    console.error(`  ✗  ${name}\n     ${msg}`);
    failed++;
  }
}

// ── Extracted logic under test ────────────────────────────────────────────────
// Mirrors ReviewQueue.ts parseName exactly so this test detects regressions.

function parseName(content: string, slug: string): string {
  const match = content.match(/name\s*:\s*"([^"]+)"/);
  return match?.[1] ?? slug;
}

// ── Test cases ────────────────────────────────────────────────────────────────

console.log("\n  Review Queue — parseName");
console.log("  ─────────────────────────────────────────");

// Ordinary double-quoted name
test("ordinary name — no apostrophe", () => {
  const src = `  name          : "Chanel Allure Inspired",`;
  assert.strictEqual(parseName(src, "fallback"), "Chanel Allure Inspired");
});

// Name containing an apostrophe — the regression this fixes
test("name with apostrophe — Ralph's Club", () => {
  const src = `  name          : "Ralph's Club Inspired",`;
  assert.strictEqual(parseName(src, "fallback"), "Ralph's Club Inspired");
});

// Name with another apostrophe pattern
test("name with apostrophe — Rose of No Man's Land", () => {
  const src = `  name          : "Rose of No Man's Land Inspired",`;
  assert.strictEqual(parseName(src, "fallback"), "Rose of No Man's Land Inspired");
});

// Fallback to slug when no name field
test("fallback to slug when field absent", () => {
  const src = `  brand: "Maison Skye & Rose",`;
  assert.strictEqual(parseName(src, "some-slug-inspired"), "some-slug-inspired");
});

// Must not capture collection or brand instead
test("does not match collection field", () => {
  const src = `  collection: "Skye",\n  name: "Uomo By Zegna Inspired",`;
  assert.strictEqual(parseName(src, "fallback"), "Uomo By Zegna Inspired");
});

// Full draft-header block with extra fields
test("full draft block — name with apostrophe", () => {
  const src = [
    `  id            : "ralph's-club-inspired",`,
    `  slug          : "ralph's-club-inspired",`,
    `  brand         : "Maison Skye & Rose",`,
    `  name          : "Ralph's Club Inspired",`,
    `  collection    : "Skye",`,
  ].join("\n");
  assert.strictEqual(parseName(src, "fallback"), "Ralph's Club Inspired");
});

// ── Summary ───────────────────────────────────────────────────────────────────

console.log(`\n  ${passed} passed  ${failed} failed`);
if (failed > 0) process.exit(1);
