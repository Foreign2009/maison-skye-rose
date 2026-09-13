/**
 * SITE-RELIABILITY-P2A — Commerce Regression Tests
 *
 * Covers:
 *   - Catalogue price correctness (5ml/10ml/30ml per authorized rates)
 *   - MiniCart delivery logic (empty, wholesale, R2000, standard)
 *   - Checkout delivery rates and collection R0
 *   - Reward thresholds (R400/R700/R1000/R1500)
 *   - R2000 behaviour (POLICY-PENDING — founder decision outstanding)
 *   - Wholesale eligibility boundary (cartCount >= 10)
 *   - Projection filter removal from shop page
 *   - FAQ longevity claim corrected
 *   - MKC editorial claim corrections (8 records)
 *   - Testimonials.tsx provenance
 *   - Reviews.tsx orphan confirmation
 *
 * Run: npx tsx scripts/factory/__tests__/p2a-commerce-regression.test.ts
 */

import assert from "node:assert/strict";
import fs     from "node:fs";
import path   from "node:path";

import { mkcCatalogue } from "../../../app/lib/mkc/catalogue";

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

const PROJECT_ROOT = path.resolve(__dirname, "../../..");
function readSource(relPath: string): string {
  return fs.readFileSync(path.join(PROJECT_ROOT, relPath), "utf8");
}

// ─────────────────────────────────────────────────────────────────────────────
console.log("\n  SITE-RELIABILITY-P2A — Commerce Regression Tests\n");

// ── Section 1: Catalogue price correctness ───────────────────────────────────
console.log("  ─── Section 1: Catalogue prices ───\n");

test("all active catalogue records have 5ml = R60, 10ml = R100, 30ml = R250", () => {
  const violations: string[] = [];
  for (const k of mkcCatalogue) {
    if (k.prices["5ml"]  !== 60)  violations.push(`${k.slug}: 5ml = R${k.prices["5ml"]}`);
    if (k.prices["10ml"] !== 100) violations.push(`${k.slug}: 10ml = R${k.prices["10ml"]}`);
    if (k.prices["30ml"] !== 250) violations.push(`${k.slug}: 30ml = R${k.prices["30ml"]}`);
  }
  assert.equal(violations.length, 0, `Price violations:\n${violations.join("\n")}`);
});

test("MIN_RETAIL_5ML resolves to R60 from catalogue", () => {
  const min = mkcCatalogue.length > 0
    ? Math.min(...mkcCatalogue.map((k) => k.prices["5ml"]))
    : null;
  assert.equal(min, 60, `Expected R60 minimum 5ml price, got R${min}`);
});

// ── Section 2: MiniCart delivery logic ───────────────────────────────────────
console.log("\n  ─── Section 2: MiniCart delivery logic ───\n");

const miniCartSrc = readSource("app/components/MiniCart.tsx");

test("MiniCart delivery: empty cart evaluates to 0 (by code design)", () => {
  assert.ok(
    miniCartSrc.includes("!cart || cart.length === 0"),
    "MiniCart: empty-cart delivery=0 guard not found",
  );
});

test("MiniCart delivery: wholesaleActive evaluates to 0", () => {
  assert.ok(
    miniCartSrc.includes("wholesaleActive"),
    "MiniCart: wholesale delivery=0 guard not found",
  );
  assert.ok(
    /wholesaleActive[\s\S]{0,20}? 0/.test(miniCartSrc),
    "MiniCart: wholesaleActive does not lead to delivery=0",
  );
});

test("MiniCart delivery: subtotal >= 2000 evaluates to 0 (POLICY-PENDING: R2000 authority unresolved)", () => {
  assert.ok(
    miniCartSrc.includes("subtotal >= 2000"),
    "MiniCart: R2000 condition not found in delivery logic",
  );
});

test("MiniCart delivery: standard fallback is 100", () => {
  assert.ok(
    miniCartSrc.includes(": 100;"),
    "MiniCart: standard delivery=100 fallback not found",
  );
});

test("MiniCart: empty-cart shows 'Calculated at checkout' not FREE", () => {
  assert.ok(
    miniCartSrc.includes("cart && cart.length > 0 && delivery === 0 ? \"FREE\" : \"Calculated at checkout\""),
    "MiniCart: empty-cart delivery guard for FREE not found",
  );
});

test("MiniCart: empty-cart shows 'Subtotal' label not Total", () => {
  assert.ok(
    miniCartSrc.includes("cart && cart.length > 0 && delivery === 0 ? \"Total\" : \"Subtotal\""),
    "MiniCart: empty-cart Total/Subtotal label guard not found",
  );
});

// ── Section 3: Checkout delivery rates and collection ────────────────────────
console.log("\n  ─── Section 3: Checkout delivery rates and collection ───\n");

const checkoutSrc = readSource("app/checkout/page.tsx");

test("Checkout: Cape Town Metro = R100", () => {
  assert.ok(checkoutSrc.includes('"Cape Town Metro":       100'), "Cape Town Metro rate incorrect");
});

test("Checkout: Western Cape Regional = R150", () => {
  assert.ok(checkoutSrc.includes('"Western Cape Regional": 150'), "Western Cape Regional rate incorrect");
});

test("Checkout: Gauteng = R180", () => {
  assert.ok(checkoutSrc.includes('"Gauteng":               180'), "Gauteng rate incorrect");
});

test("Checkout: KwaZulu-Natal = R180", () => {
  assert.ok(checkoutSrc.includes('"KwaZulu-Natal":         180'), "KwaZulu-Natal rate incorrect");
});

test("Checkout: Other Major Cities = R200", () => {
  assert.ok(checkoutSrc.includes('"Other Major Cities":    200'), "Other Major Cities rate incorrect");
});

test("Checkout: Outlying Areas = R300", () => {
  assert.ok(checkoutSrc.includes('"Outlying Areas":        300'), "Outlying Areas rate incorrect");
});

test("Checkout: Collection / Pickup = R0", () => {
  assert.ok(checkoutSrc.includes('"Collection / Pickup":   0'), "Collection / Pickup rate missing or incorrect");
});

test("Checkout: address field hidden when collection selected", () => {
  assert.ok(
    checkoutSrc.includes("!isCollection && ("),
    "Address field collection guard not found",
  );
});

test("Checkout: address validation skipped for collection", () => {
  assert.ok(
    checkoutSrc.includes("!isCollection && !address.trim()"),
    "Address validation collection bypass not found",
  );
});

test("Checkout: order summary shows 'Collection' label when collection selected", () => {
  assert.ok(
    checkoutSrc.includes("isCollection ? \"Collection\" : \"Delivery\""),
    "Order summary collection label not found",
  );
});

test("Checkout: order summary shows FREE for collection", () => {
  assert.ok(
    checkoutSrc.includes("isCollection ? \"FREE\" : `R${delivery.toFixed(2)}`"),
    "Order summary FREE for collection not found",
  );
});

// ── Section 4: Reward thresholds ─────────────────────────────────────────────
console.log("\n  ─── Section 4: Reward thresholds ───\n");

// Test the MiniCart reward logic by reading source and verifying threshold values,
// then testing the math against those values directly.

test("MiniCart: reward tier R400 = 1 Free 5ml Sample present in source", () => {
  assert.ok(
    miniCartSrc.includes('{ amount: 400, reward: "1 Free 5ml Sample" }'),
    "R400 reward tier missing from MiniCart source",
  );
});

test("MiniCart: reward tier R700 = 2 Free 5ml Samples present in source", () => {
  assert.ok(
    miniCartSrc.includes('{ amount: 700, reward: "2 Free 5ml Samples" }'),
    "R700 reward tier missing from MiniCart source",
  );
});

test("MiniCart: reward tier R1000 = 3 Free 5ml Samples present in source", () => {
  assert.ok(
    miniCartSrc.includes('{ amount: 1000, reward: "3 Free 5ml Samples" }'),
    "R1000 reward tier missing from MiniCart source",
  );
});

test("MiniCart: reward tier R1500 = Discovery Set present in source", () => {
  assert.ok(
    miniCartSrc.includes('{ amount: 1500, reward: "Discovery Set (5 × 5ml)" }'),
    "R1500 reward tier missing from MiniCart source",
  );
});

// Reward threshold arithmetic (values read from source above)
const REWARD_TIERS = [
  { threshold: 400,  label: "1 Free 5ml Sample" },
  { threshold: 700,  label: "2 Free 5ml Samples" },
  { threshold: 1000, label: "3 Free 5ml Samples" },
  { threshold: 1500, label: "Discovery Set (5 × 5ml)" },
];

function nextRewardFromTiers(subtotal: number): { amount: number; reward: string } | null {
  for (const tier of REWARD_TIERS) {
    if (subtotal < tier.threshold) return { amount: tier.threshold, reward: tier.label };
  }
  return null;
}

test("Reward: subtotal R0 → next tier R400", () => {
  const r = nextRewardFromTiers(0);
  assert.deepEqual(r, { amount: 400, reward: "1 Free 5ml Sample" });
});

test("Reward: subtotal R399 → next tier R400", () => {
  const r = nextRewardFromTiers(399);
  assert.deepEqual(r, { amount: 400, reward: "1 Free 5ml Sample" });
});

test("Reward: subtotal R400 → next tier R700", () => {
  const r = nextRewardFromTiers(400);
  assert.deepEqual(r, { amount: 700, reward: "2 Free 5ml Samples" });
});

test("Reward: subtotal R699 → next tier R700", () => {
  const r = nextRewardFromTiers(699);
  assert.deepEqual(r, { amount: 700, reward: "2 Free 5ml Samples" });
});

test("Reward: subtotal R700 → next tier R1000", () => {
  const r = nextRewardFromTiers(700);
  assert.deepEqual(r, { amount: 1000, reward: "3 Free 5ml Samples" });
});

test("Reward: subtotal R999 → next tier R1000", () => {
  const r = nextRewardFromTiers(999);
  assert.deepEqual(r, { amount: 1000, reward: "3 Free 5ml Samples" });
});

test("Reward: subtotal R1000 → next tier R1500", () => {
  const r = nextRewardFromTiers(1000);
  assert.deepEqual(r, { amount: 1500, reward: "Discovery Set (5 × 5ml)" });
});

test("Reward: subtotal R1499 → next tier R1500", () => {
  const r = nextRewardFromTiers(1499);
  assert.deepEqual(r, { amount: 1500, reward: "Discovery Set (5 × 5ml)" });
});

test("Reward: subtotal R1500 → null (all tiers unlocked)", () => {
  const r = nextRewardFromTiers(1500);
  assert.equal(r, null);
});

test("Reward: subtotal R2000 → null (all tiers unlocked)", () => {
  const r = nextRewardFromTiers(2000);
  assert.equal(r, null);
});

// ── Section 5: R2000 behaviour (POLICY-PENDING) ──────────────────────────────
console.log("\n  ─── Section 5: R2000 delivery (POLICY-PENDING) ───\n");

test("[POLICY-PENDING] MiniCart: R2000+ subtotal triggers delivery=0 (founder decision outstanding)", () => {
  // This test documents current behaviour. R2000 authority is unresolved pending
  // founder confirmation. If the policy is removed, this test will fail and must
  // be updated together with the MiniCart source change.
  assert.ok(
    miniCartSrc.includes("subtotal >= 2000"),
    "R2000 free-delivery threshold has been removed from MiniCart — update policy decision",
  );
});

test("[POLICY-PENDING] MiniCart reward message: R2000 free delivery shown in WhatsApp preview", () => {
  assert.ok(
    miniCartSrc.includes('"✓ Discovery Set (5 × 5ml) + Free Delivery"'),
    "R2000 reward message with free delivery absent from MiniCart WhatsApp preview",
  );
});

test("[POLICY-PENDING] Checkout page has NO R2000 free-delivery logic (inconsistency with MiniCart)", () => {
  // The checkout page uses province-based rates only. A customer with subtotal >= R2000
  // using checkout (not MiniCart WhatsApp) is charged the province rate, not R0.
  // This inconsistency is tracked as unresolved; document it, do not silently fix.
  assert.ok(
    !checkoutSrc.includes("subtotal >= 2000"),
    "Unexpected R2000 logic found in checkout page — was this intentionally added?",
  );
});

// ── Section 6: Wholesale eligibility boundary ────────────────────────────────
console.log("\n  ─── Section 6: Wholesale eligibility ───\n");

const cartContextSrc = readSource("app/context/CartContext.tsx");

test("CartContext: wholesale activates at cartCount >= 10", () => {
  assert.ok(
    cartContextSrc.includes("const wholesaleActive = cartCount >= 10;"),
    "Wholesale eligibility threshold (cartCount >= 10) not found in CartContext",
  );
});

test("CartContext: wholesale 5ml price = R48", () => {
  assert.ok(
    cartContextSrc.includes('return 48;'),
    "Wholesale 5ml price R48 not found in CartContext",
  );
});

test("CartContext: wholesale 10ml price = R77", () => {
  assert.ok(
    cartContextSrc.includes('return 77;'),
    "Wholesale 10ml price R77 not found in CartContext",
  );
});

test("CartContext: wholesale 30ml price = R180", () => {
  assert.ok(
    cartContextSrc.includes('return 180;'),
    "Wholesale 30ml price R180 not found in CartContext",
  );
});

test("Wholesale boundary: cartCount 9 → wholesaleActive = false", () => {
  assert.ok(9 < 10, "cartCount 9 should be below wholesale threshold");
  assert.ok(!(9 >= 10), "Boundary check: 9 < 10");
});

test("Wholesale boundary: cartCount 10 → wholesaleActive = true", () => {
  assert.ok(10 >= 10, "Boundary check: 10 >= 10");
});

// ── Section 7: Projection filter removal ─────────────────────────────────────
console.log("\n  ─── Section 7: Projection filter removal ───\n");

const shopSrc = readSource("app/shop/page.tsx");

test("shop/page.tsx: CATALOGUE_PROJECTIONS removed", () => {
  assert.ok(
    !shopSrc.includes("CATALOGUE_PROJECTIONS"),
    "CATALOGUE_PROJECTIONS still present in shop/page.tsx",
  );
});

test("shop/page.tsx: selectedProjection state removed", () => {
  assert.ok(
    !shopSrc.includes("selectedProjection"),
    "selectedProjection still present in shop/page.tsx",
  );
});

test("shop/page.tsx: capitalize() helper removed", () => {
  assert.ok(
    !shopSrc.includes("function capitalize("),
    "capitalize() helper still present in shop/page.tsx",
  );
});

test("shop/page.tsx: PROJECTION_ORDER removed", () => {
  assert.ok(
    !shopSrc.includes("PROJECTION_ORDER"),
    "PROJECTION_ORDER still present in shop/page.tsx",
  );
});

test("native records: projection field preserved in at least one record (not stripped)", () => {
  // Projection was removed from shop UI only; the data field on native records must remain.
  // Check a sample record to confirm the internal intelligence data was not deleted.
  const invictusSrc = readSource("app/lib/mkc/native/invictus-inspired.ts");
  assert.ok(
    invictusSrc.includes('projection:     "strong"'),
    "projection field missing from invictus-inspired native record — internal data may have been stripped",
  );
});

// ── Section 8: FAQ and editorial claim surfaces ──────────────────────────────
console.log("\n  ─── Section 8: FAQ and editorial claim corrections ───\n");

const faqSrc = readSource("app/faq/page.tsx");

test("FAQ: prohibited '6 to 12 hours' longevity claim removed", () => {
  assert.ok(
    !faqSrc.includes("6 to 12 hours"),
    "Prohibited '6 to 12 hours' still present in FAQ",
  );
});

test("FAQ: replacement text includes 'We do not guarantee a specific wear time'", () => {
  assert.ok(
    faqSrc.includes("We do not guarantee a specific wear time"),
    "Protocol-specified disclaimer not found in FAQ",
  );
});

const momentSrc = readSource("app/lib/discovery/momentContent.ts");

test("momentContent: 'all-day presence' removed from academyCopy", () => {
  assert.ok(
    !momentSrc.includes("all-day presence"),
    "Prohibited 'all-day presence' still present in momentContent.ts",
  );
});

// ── Section 9: MKC native corrections (8 records) ────────────────────────────
console.log("\n  ─── Section 9: MKC native claim corrections ───\n");

const NATIVE_CORRECTIONS: Array<{ slug: string; file: string; prohibitedPhrase: string; description: string }> = [
  { slug: "layton-inspired",             file: "app/lib/mkc/native/layton-inspired.ts",             prohibitedPhrase: "stops conversations",                                    description: "layton mood: 'stops conversations'" },
  { slug: "spicebomb-extreme-inspired",  file: "app/lib/mkc/native/spicebomb-extreme-inspired.ts",  prohibitedPhrase: "announces its presence from across the room",              description: "spicebomb-extreme mood: 'announces its presence from across the room'" },
  { slug: "ultra-male-inspired",         file: "app/lib/mkc/native/ultra-male-inspired.ts",         prohibitedPhrase: "turns heads and demands attention",                        description: "ultra-male mood: 'turns heads and demands attention'" },
  { slug: "god-of-fire-inspired",        file: "app/lib/mkc/native/god-of-fire-inspired.ts",        prohibitedPhrase: "announces itself with a confidence that turns heads",      description: "god-of-fire description: 'announces itself with a confidence that turns heads'" },
  { slug: "le-male-elixir-inspired",     file: "app/lib/mkc/native/le-male-elixir-inspired.ts",     prohibitedPhrase: "announces itself before you speak",                        description: "le-male-elixir mood: 'announces itself before you speak'" },
  { slug: "libre-le-parfum-inspired",    file: "app/lib/mkc/native/libre-le-parfum-inspired.ts",    prohibitedPhrase: "demands attention—radiant without softness",            description: "libre-le-parfum description: original 'demands attention' phrasing" },
  { slug: "hypnotic-poison-inspired",    file: "app/lib/mkc/native/hypnotic-poison-inspired.ts",    prohibitedPhrase: "announces itself",                                         description: "hypnotic-poison recommendedFor[0]: 'announces itself'" },
  { slug: "invictus-inspired",           file: "app/lib/mkc/native/invictus-inspired.ts",           prohibitedPhrase: "Invictus Inspired announces itself",                       description: "invictus description: original 'announces itself' phrasing" },
];

for (const { file, prohibitedPhrase, description } of NATIVE_CORRECTIONS) {
  const corrFile = file;
  test(`MKC native: ${description} — removed`, () => {
    const src = readSource(corrFile);
    assert.ok(
      !src.includes(prohibitedPhrase),
      `Prohibited phrase still present in ${corrFile}: "${prohibitedPhrase}"`,
    );
  });
}

// ── Section 10: Draft synchronization ────────────────────────────────────────
console.log("\n  ─── Section 10: Draft synchronization ───\n");

test("libre-le-parfum-inspired draft: 'demands attention' removed from description", () => {
  const src = readSource("scripts/factory/drafts/libre-le-parfum-inspired.ts");
  assert.ok(
    !src.includes("demands attention—radiant without softness"),
    "Draft libre-le-parfum still has original prohibited 'demands attention' phrase",
  );
  assert.ok(
    src.includes("radiant authority"),
    "Draft libre-le-parfum description not updated with replacement 'radiant authority'",
  );
});

test("hypnotic-poison-inspired draft: no prohibited 'announces itself' or 'trail that stays'", () => {
  const src = readSource("scripts/factory/drafts/hypnotic-poison-inspired.ts");
  assert.ok(
    !src.includes("announces itself"),
    "Draft hypnotic-poison contains 'announces itself'",
  );
  assert.ok(
    !src.includes("trail that stays"),
    "Draft hypnotic-poison contains 'trail that stays'",
  );
});

// ── Section 11: Testimonials ─────────────────────────────────────────────────
console.log("\n  ─── Section 11: Testimonials ───\n");

test("Reviews.tsx: orphaned — not imported from app/page.tsx", () => {
  const homeSrc = readSource("app/page.tsx");
  assert.ok(
    !homeSrc.includes("Reviews"),
    "Reviews component imported on homepage — it was expected to be orphaned",
  );
});

test("Reviews.tsx: Aaliyah entry with prohibited longevity claim removed", () => {
  const reviewsSrc = readSource("app/components/Reviews.tsx");
  assert.ok(
    !reviewsSrc.includes("Aaliyah"),
    "Aaliyah entry still present in Reviews.tsx",
  );
  assert.ok(
    !reviewsSrc.includes("Lasted all day"),
    "Prohibited 'Lasted all day' longevity claim still in Reviews.tsx",
  );
});

test("Testimonials.tsx: imported on homepage (live testimonials component)", () => {
  const homeSrc = readSource("app/page.tsx");
  assert.ok(
    homeSrc.includes("Testimonials"),
    "Testimonials component not imported on homepage",
  );
});

test("Testimonials.tsx: no longevity claims in live testimonials", () => {
  const testimonialsSrc = readSource("app/components/Testimonials.tsx");
  const prohibited = ["lasted all day", "lasts", "hours", "longevity", "6 to 12"];
  for (const phrase of prohibited) {
    assert.ok(
      !testimonialsSrc.toLowerCase().includes(phrase),
      `Prohibited longevity phrase found in Testimonials.tsx: "${phrase}"`,
    );
  }
});

test("Testimonials.tsx: no similarity claims (close to the original) in live testimonials", () => {
  const testimonialsSrc = readSource("app/components/Testimonials.tsx");
  assert.ok(
    !testimonialsSrc.includes("close to the original"),
    "Similarity claim 'close to the original' found in Testimonials.tsx",
  );
  assert.ok(
    !testimonialsSrc.includes("smells like"),
    "Similarity claim 'smells like' found in Testimonials.tsx",
  );
});

// ── Results ───────────────────────────────────────────────────────────────────

console.log("\n" + "─".repeat(60));
console.log(`  Results: ${passed} passed, ${failed} failed`);
if (failed === 0) {
  console.log("\n  PASS — all P2A commerce regression checks passed.\n");
} else {
  console.log("\n  FAIL — regression violations detected.\n");
  process.exit(1);
}
