/**
 * EP-CLAIMS-P1 — Claim-Surface Governance Tests
 *
 * Verifies that product-specific projection/sillage values are not
 * presented to customers as factual performance promises.
 *
 * Covers: ProductDetail, ComparisonView, contextBuilder, safetyGuard.
 *
 * Run: npx tsx scripts/factory/__tests__/claim-surface.test.ts
 */

import assert from "node:assert/strict";
import fs     from "node:fs";
import path   from "node:path";

import { validateResponse, buildSystemPrompt } from "../../../app/lib/concierge/safetyGuard";
import { nativeFragrances }                    from "../../../app/lib/mkc/native/index";

// ── Harness ───────────────────────────────────────────────────────────────────

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

// ── Helpers ───────────────────────────────────────────────────────────────────

const PROJECT_ROOT = path.resolve(__dirname, "../../..");

function readSource(relPath: string): string {
  return fs.readFileSync(path.join(PROJECT_ROOT, relPath), "utf8");
}

// ─────────────────────────────────────────────────────────────────────────────
console.log("\n  EP-CLAIMS-P1 — Claim-Surface Governance Tests\n");

// ── Section 1: ProductDetail customer surface ─────────────────────────────────
console.log("  ─── Section 1: ProductDetail customer surface ───\n");

test("ProductDetail does not render a product-specific Sillage value", () => {
  const src = readSource("app/components/ProductDetail.tsx");
  assert.ok(
    !src.includes("PROJECTION_LABELS"),
    "PROJECTION_LABELS still present in ProductDetail.tsx",
  );
  assert.ok(
    !src.includes(">Sillage<") && !src.includes("Sillage\n") && !src.match(/Sillage[\s\S]{0,20}projection/),
    "Sillage heading still rendered in ProductDetail.tsx",
  );
  assert.ok(
    !src.includes("knowledge.projection"),
    "knowledge.projection still rendered in ProductDetail.tsx",
  );
});

test("ProductDetail grid adjusts cleanly after Sillage removal (md:grid-cols-4)", () => {
  const src = readSource("app/components/ProductDetail.tsx");
  assert.ok(
    src.includes("md:grid-cols-4"),
    "Expected md:grid-cols-4 in Quick Facts grid after Sillage removal",
  );
  assert.ok(
    !src.includes("md:grid-cols-5"),
    "Stale md:grid-cols-5 still present in ProductDetail.tsx",
  );
});

// ── Section 2: ComparisonView customer surface ───────────────────────────────
console.log("\n  ─── Section 2: ComparisonView customer surface ───\n");

test("ComparisonView does not render a product-specific Sillage or Projection value", () => {
  const src = readSource("app/components/ComparisonView.tsx");
  assert.ok(
    !src.includes("PROJECTION_LABELS"),
    "PROJECTION_LABELS still present in ComparisonView.tsx",
  );
  assert.ok(
    !src.includes('title="Projection"'),
    'SectionCard title="Projection" still present in ComparisonView.tsx',
  );
  assert.ok(
    !src.includes("projection.a") && !src.includes("projection.b"),
    "projection.a / projection.b still rendered in ComparisonView.tsx",
  );
});

// ── Section 3: Concierge context ──────────────────────────────────────────────
console.log("\n  ─── Section 3: Concierge context ───\n");

test("contextBuilder does not expose product projection in LLM context string", () => {
  const src = readSource("app/lib/concierge/contextBuilder.ts");
  assert.ok(
    !src.includes("Projection: ${k.projection}"),
    "Projection field still present in contextBuilder fragrance section",
  );
  assert.ok(
    !src.includes("| Projection:"),
    "| Projection: pipe-delimited field still in contextBuilder",
  );
});

// ── Section 4: Safety guard — validateResponse ────────────────────────────────
console.log("\n  ─── Section 4: Safety guard — validateResponse ───\n");

test('safetyGuard rejects: "This fragrance has strong projection"', () => {
  assert.strictEqual(
    validateResponse("This fragrance has strong projection."),
    false,
    "Should reject product-specific projection claim",
  );
});

test('safetyGuard rejects: "This fragrance has moderate projection"', () => {
  assert.strictEqual(
    validateResponse("This one has moderate projection and excellent sillage."),
    false,
    "Should reject moderate projection claim",
  );
});

test('safetyGuard rejects: "This is beast mode"', () => {
  assert.strictEqual(
    validateResponse("This fragrance is beast mode — it fills a room."),
    false,
    "Should reject beast mode claim",
  );
});

test('safetyGuard rejects: "This lasts eight hours"', () => {
  assert.strictEqual(
    validateResponse("This fragrance lasts eight hours on skin."),
    false,
    "Should reject specific hours longevity claim",
  );
});

test('safetyGuard rejects: "This guarantees all-day wear"', () => {
  assert.strictEqual(
    validateResponse("This guarantees all-day wear with full projection."),
    false,
    "Should reject guarantee + wear-time claim",
  );
});

test('safetyGuard rejects: "lasts all day"', () => {
  assert.strictEqual(
    validateResponse("It lasts all day and projects beautifully."),
    false,
    "Should reject lasts all day claim",
  );
});

// ── Section 5: Safety guard — educational content permitted ───────────────────
console.log("\n  ─── Section 5: General education — must remain permitted ───\n");

test("safetyGuard permits general fragrance education about projection variation", () => {
  const educational = "Projection varies with skin chemistry, environment, and application. Drier skin tends to hold fragrance for a shorter time, while oilier skin often extends longevity. These outcomes depend on factors specific to each wearer.";
  assert.strictEqual(
    validateResponse(educational),
    true,
    "General fragrance education about projection variation should not be blocked",
  );
});

test("safetyGuard permits suggesting fragrance families without performance claims", () => {
  const rec = "Based on your preference for bold, smoky fragrances, Azzaro Wanted By Night Inspired is worth exploring — it combines tobacco, leather, and cedar for a rich evening character.";
  assert.strictEqual(
    validateResponse(rec),
    true,
    "Character-based recommendation without performance claims should pass",
  );
});

test("safetyGuard permits comparative fragrance description without performance promise", () => {
  const comp = "Both fragrances share a woody, aromatic profile and are well-suited for autumn and winter wear.";
  assert.strictEqual(
    validateResponse(comp),
    true,
    "Comparative description without performance promises should pass",
  );
});

// ── Section 6: Safety guard — system prompt contains updated restrictions ─────
console.log("\n  ─── Section 6: Safety guard — system prompt restrictions ───\n");

test("buildSystemPrompt includes restriction on specific projection level statements", () => {
  const prompt = buildSystemPrompt("");
  assert.ok(
    prompt.includes("soft, moderate, or strong projection"),
    "System prompt should explicitly prohibit stating specific projection levels",
  );
});

test("buildSystemPrompt includes beast mode restriction", () => {
  const prompt = buildSystemPrompt("");
  assert.ok(
    prompt.includes("beast mode"),
    "System prompt should explicitly prohibit beast mode claims",
  );
});

// ── Section 7: Wave 8 evidence locks remain intact ───────────────────────────
console.log("\n  ─── Section 7: Wave 8 factual lock integrity ───\n");

const WAVE8_SLUGS = [
  "azzaro-wanted-by-night-inspired",
  "24-faubourg-inspired",
  "boss-nuit-pour-femme-inspired",
  "capri-lemon-sugar-inspired",
];

test("all 4 Wave 8 records absent from native MKC", () => {
  for (const slug of WAVE8_SLUGS) {
    assert.ok(
      !nativeFragrances.has(slug),
      `Wave 8 record unexpectedly found in native MKC: ${slug}`,
    );
  }
});

// ── Results ───────────────────────────────────────────────────────────────────

console.log("\n" + "─".repeat(60));
console.log(`  Results: ${passed} passed, ${failed} failed`);
if (failed === 0) {
  console.log("\n  PASS — all claim-surface governance checks passed.\n");
} else {
  console.log("\n  FAIL — claim-surface governance violations detected.\n");
  process.exit(1);
}
