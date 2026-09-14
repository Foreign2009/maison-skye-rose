/**
 * SITE-RELIABILITY-P2B — Commerce Regression Tests
 *
 * Covers:
 *   - Catalogue price correctness (5ml/10ml/30ml per authorized rates)
 *   - Delivery module: DELIVERY_RATES, getDeliveryCharge(), isCollectionOrder(), ALL_PROVINCES
 *   - Wholesale module: WHOLESALE_THRESHOLD, isWholesaleActive(), getWholesaleItemPrice()
 *   - Rewards module: getNextReward(), getRewardMessage() against production tiers
 *   - Order validation: collection without address accepted; delivery without address rejected
 *   - MiniCart inline delivery calc (empty, wholesale, R2000, standard)
 *   - Checkout collection UI (imports, address guard, FREE display)
 *   - Projection filter removal from shop page
 *   - FAQ longevity claim corrected
 *   - MKC editorial claim corrections (8 records)
 *   - Testimonials.tsx suppressed (unverified provenance)
 *   - Reviews.tsx orphan confirmation
 *
 * POLICY-PENDING findings (documented here — not asserted as passing tests):
 *   FINDING-1: R2000 free delivery — MiniCart gives delivery=0 at subtotal ≥ R2000.
 *     Checkout always charges the province rate. Authority for the R2000 rule is
 *     unresolved pending founder confirmation.
 *   FINDING-2: Wholesale free delivery — MiniCart gives delivery=0 when wholesaleActive.
 *     Checkout always charges the province rate. These are two separate policies.
 *     Neither is confirmed in writing.
 *
 * Run: npx tsx scripts/factory/__tests__/p2a-commerce-regression.test.ts
 */

import assert from "node:assert/strict";
import fs     from "node:fs";
import path   from "node:path";

import { mkcCatalogue } from "../../../app/lib/mkc/catalogue";
import {
  DELIVERY_RATES,
  ALL_PROVINCES,
  getDeliveryCharge,
  isCollectionOrder,
  COLLECTION_PROVINCE,
} from "../../../app/lib/commerce/delivery";
import {
  WHOLESALE_THRESHOLD,
  isWholesaleActive,
  getWholesaleItemPrice,
} from "../../../app/lib/commerce/wholesale";
import {
  getNextReward,
  getRewardMessage,
} from "../../../app/lib/commerce/rewards";
import { validateOrderBody } from "../../../app/lib/commerce/orderValidation";

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

// ── Minimal valid order item ──────────────────────────────────────────────────

const SAMPLE_ITEM = { id: "test-1", title: "Test Fragrance", price: 60, quantity: 1, size: "5ml" };

// ─────────────────────────────────────────────────────────────────────────────
console.log("\n  SITE-RELIABILITY-P2B — Commerce Regression Tests\n");

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

// ── Section 2: Delivery module ───────────────────────────────────────────────
console.log("\n  ─── Section 2: Delivery module ───\n");

test("DELIVERY_RATES: Cape Town Metro = R100", () => {
  assert.equal(DELIVERY_RATES["Cape Town Metro"], 100);
});

test("DELIVERY_RATES: Western Cape Regional = R150", () => {
  assert.equal(DELIVERY_RATES["Western Cape Regional"], 150);
});

test("DELIVERY_RATES: Gauteng = R180", () => {
  assert.equal(DELIVERY_RATES["Gauteng"], 180);
});

test("DELIVERY_RATES: KwaZulu-Natal = R180", () => {
  assert.equal(DELIVERY_RATES["KwaZulu-Natal"], 180);
});

test("DELIVERY_RATES: Other Major Cities = R200", () => {
  assert.equal(DELIVERY_RATES["Other Major Cities"], 200);
});

test("DELIVERY_RATES: Outlying Areas = R300", () => {
  assert.equal(DELIVERY_RATES["Outlying Areas"], 300);
});

test("DELIVERY_RATES: Collection / Pickup = R0", () => {
  assert.equal(DELIVERY_RATES["Collection / Pickup"], 0);
});

test("getDeliveryCharge returns province rate for known province", () => {
  assert.equal(getDeliveryCharge("Cape Town Metro"), 100);
  assert.equal(getDeliveryCharge("Outlying Areas"), 300);
  assert.equal(getDeliveryCharge("Collection / Pickup"), 0);
});

test("getDeliveryCharge returns R180 fallback for unknown province", () => {
  assert.equal(getDeliveryCharge("Unknown Province"), 180);
});

test("isCollectionOrder: 'Collection / Pickup' = true", () => {
  assert.equal(isCollectionOrder("Collection / Pickup"), true);
  assert.equal(isCollectionOrder(COLLECTION_PROVINCE), true);
});

test("isCollectionOrder: delivery provinces = false", () => {
  assert.equal(isCollectionOrder("Gauteng"), false);
  assert.equal(isCollectionOrder("Cape Town Metro"), false);
  assert.equal(isCollectionOrder(""), false);
});

test("ALL_PROVINCES includes Collection / Pickup (7 total)", () => {
  assert.ok(ALL_PROVINCES.includes("Collection / Pickup"), "Collection / Pickup missing from ALL_PROVINCES");
  assert.equal(ALL_PROVINCES.length, 7, `Expected 7 provinces, got ${ALL_PROVINCES.length}`);
});

// ── Section 3: Wholesale module ──────────────────────────────────────────────
console.log("\n  ─── Section 3: Wholesale module ───\n");

test("WHOLESALE_THRESHOLD = 10", () => {
  assert.equal(WHOLESALE_THRESHOLD, 10);
});

test("isWholesaleActive: cartCount 9 = false", () => {
  assert.equal(isWholesaleActive(9), false);
});

test("isWholesaleActive: cartCount 10 = true", () => {
  assert.equal(isWholesaleActive(10), true);
});

test("isWholesaleActive: cartCount 0 = false", () => {
  assert.equal(isWholesaleActive(0), false);
});

test("getWholesaleItemPrice: 5ml active = R48", () => {
  assert.equal(getWholesaleItemPrice("5ml", 60, true), 48);
});

test("getWholesaleItemPrice: 10ml active = R77", () => {
  assert.equal(getWholesaleItemPrice("10ml", 100, true), 77);
});

test("getWholesaleItemPrice: 30ml active = R180", () => {
  assert.equal(getWholesaleItemPrice("30ml", 250, true), 180);
});

test("getWholesaleItemPrice: returns retail price when not active", () => {
  assert.equal(getWholesaleItemPrice("5ml", 60, false), 60);
  assert.equal(getWholesaleItemPrice("10ml", 100, false), 100);
});

test("getWholesaleItemPrice: unknown size falls back to retail price", () => {
  assert.equal(getWholesaleItemPrice("50ml", 400, true), 400);
});

// ── Section 4: Rewards module ────────────────────────────────────────────────
console.log("\n  ─── Section 4: Rewards module ───\n");

test("getNextReward: R0 → next tier R400", () => {
  assert.deepEqual(getNextReward(0), { amount: 400, reward: "1 Free 5ml Sample" });
});

test("getNextReward: R399 → next tier R400", () => {
  assert.deepEqual(getNextReward(399), { amount: 400, reward: "1 Free 5ml Sample" });
});

test("getNextReward: R400 → next tier R700", () => {
  assert.deepEqual(getNextReward(400), { amount: 700, reward: "2 Free 5ml Samples" });
});

test("getNextReward: R699 → next tier R700", () => {
  assert.deepEqual(getNextReward(699), { amount: 700, reward: "2 Free 5ml Samples" });
});

test("getNextReward: R700 → next tier R1000", () => {
  assert.deepEqual(getNextReward(700), { amount: 1000, reward: "3 Free 5ml Samples" });
});

test("getNextReward: R999 → next tier R1000", () => {
  assert.deepEqual(getNextReward(999), { amount: 1000, reward: "3 Free 5ml Samples" });
});

test("getNextReward: R1000 → next tier R1500", () => {
  assert.deepEqual(getNextReward(1000), { amount: 1500, reward: "Discovery Set (5 × 5ml)" });
});

test("getNextReward: R1499 → next tier R1500", () => {
  assert.deepEqual(getNextReward(1499), { amount: 1500, reward: "Discovery Set (5 × 5ml)" });
});

test("getNextReward: R1500 → null (all tiers unlocked)", () => {
  assert.equal(getNextReward(1500), null);
});

test("getNextReward: R2000 → null (all tiers unlocked)", () => {
  assert.equal(getNextReward(2000), null);
});

test("getRewardMessage: below R400 = empty string", () => {
  assert.equal(getRewardMessage(0), "");
  assert.equal(getRewardMessage(399), "");
});

test("getRewardMessage: R400 → '1 Free 5ml Sample'", () => {
  assert.ok(getRewardMessage(400).includes("1 Free 5ml Sample"));
});

test("getRewardMessage: R700 → '2 Free 5ml Samples'", () => {
  assert.ok(getRewardMessage(700).includes("2 Free 5ml Samples"));
});

test("getRewardMessage: R1000 → '3 Free 5ml Samples'", () => {
  assert.ok(getRewardMessage(1000).includes("3 Free 5ml Samples"));
});

test("getRewardMessage: R1500 → Discovery Set", () => {
  assert.ok(getRewardMessage(1500).includes("Discovery Set"));
});

// POLICY-PENDING FINDING-1: R2000 includes Free Delivery in MiniCart preview only.
// Authority for this rule is unresolved. Document; do not assert as requirement.
test("[POLICY-PENDING] getRewardMessage: R2000 includes Free Delivery string", () => {
  assert.ok(
    getRewardMessage(2000).includes("Free Delivery"),
    "R2000 reward message does not include Free Delivery — rewards.ts may have changed",
  );
});

// ── Section 5: Order validation (pure function — no DB) ──────────────────────
console.log("\n  ─── Section 5: Order validation ───\n");

test("validateOrderBody: valid delivery order returns null", () => {
  const body = {
    customer_name: "Test Customer",
    phone: "0821234567",
    address: "123 Main Street, Cape Town",
    province: "Cape Town Metro",
    items: [SAMPLE_ITEM],
    subtotal: 60,
    delivery: 100,
    total: 160,
  };
  assert.equal(validateOrderBody(body), null);
});

test("validateOrderBody: collection without address returns null (accepted)", () => {
  const body = {
    customer_name: "Test Customer",
    phone: "0821234567",
    province: "Collection / Pickup",
    items: [SAMPLE_ITEM],
    subtotal: 60,
    delivery: 0,
    total: 60,
  };
  assert.equal(validateOrderBody(body), null, "Collection order without address should be accepted");
});

test("validateOrderBody: delivery without address is rejected", () => {
  const body = {
    customer_name: "Test Customer",
    phone: "0821234567",
    province: "Cape Town Metro",
    items: [SAMPLE_ITEM],
    subtotal: 60,
    delivery: 100,
    total: 160,
  };
  const err = validateOrderBody(body);
  assert.ok(err !== null, "Delivery order without address should be rejected");
  assert.ok(err!.includes("address"), `Expected address error, got: ${err}`);
});

test("validateOrderBody: 'Collection / Pickup' province is valid", () => {
  const body = {
    customer_name: "Test Customer",
    phone: "0821234567",
    province: "Collection / Pickup",
    items: [SAMPLE_ITEM],
    subtotal: 60,
    delivery: 0,
    total: 60,
  };
  const err = validateOrderBody(body);
  assert.ok(
    err === null || !err.includes("delivery area"),
    `Collection / Pickup should be a valid province, got: ${err}`,
  );
});

test("validateOrderBody: unknown province is rejected", () => {
  const body = {
    customer_name: "Test Customer",
    phone: "0821234567",
    address: "123 Main St",
    province: "Fake Province",
    items: [SAMPLE_ITEM],
    subtotal: 60,
    delivery: 100,
    total: 160,
  };
  const err = validateOrderBody(body);
  assert.ok(err !== null, "Unknown province should be rejected");
  assert.ok(err!.includes("delivery area"), `Expected province error, got: ${err}`);
});

test("validateOrderBody: empty cart is rejected", () => {
  const body = {
    customer_name: "Test Customer",
    phone: "0821234567",
    address: "123 Main St",
    province: "Cape Town Metro",
    items: [],
    subtotal: 60,
    delivery: 100,
    total: 160,
  };
  const err = validateOrderBody(body);
  assert.ok(err !== null && err.includes("empty"), `Expected empty cart error, got: ${err}`);
});

test("validateOrderBody: mismatched total is rejected", () => {
  const body = {
    customer_name: "Test Customer",
    phone: "0821234567",
    address: "123 Main St",
    province: "Cape Town Metro",
    items: [SAMPLE_ITEM],
    subtotal: 60,
    delivery: 100,
    total: 999,
  };
  const err = validateOrderBody(body);
  assert.ok(err !== null && err.includes("total"), `Expected total mismatch error, got: ${err}`);
});

test("validateOrderBody: collection order with delivery=0 total matches", () => {
  const body = {
    customer_name: "Test Customer",
    phone: "0821234567",
    province: "Collection / Pickup",
    items: [SAMPLE_ITEM],
    subtotal: 60,
    delivery: 0,
    total: 60,
  };
  assert.equal(validateOrderBody(body), null, "Collection order total check should pass when delivery=0");
});

// ── Section 6: MiniCart delivery inline logic ────────────────────────────────
console.log("\n  ─── Section 6: MiniCart delivery logic (inline) ───\n");

const miniCartSrc = readSource("app/components/MiniCart.tsx");

test("MiniCart: imports getNextReward from rewards module", () => {
  assert.ok(
    miniCartSrc.includes("getNextReward") && miniCartSrc.includes("commerce/rewards"),
    "MiniCart does not import getNextReward from commerce/rewards",
  );
});

test("MiniCart: imports getRewardMessage from rewards module", () => {
  assert.ok(
    miniCartSrc.includes("getRewardMessage") && miniCartSrc.includes("commerce/rewards"),
    "MiniCart does not import getRewardMessage from commerce/rewards",
  );
});

test("MiniCart delivery: empty cart evaluates to 0 (by code design)", () => {
  assert.ok(
    miniCartSrc.includes("!cart || cart.length === 0"),
    "MiniCart: empty-cart delivery=0 guard not found",
  );
});

test("MiniCart delivery: wholesaleActive evaluates to 0 (POLICY-PENDING FINDING-2)", () => {
  assert.ok(
    /wholesaleActive[\s\S]{0,20}? 0/.test(miniCartSrc),
    "MiniCart: wholesaleActive does not lead to delivery=0",
  );
});

test("MiniCart delivery: subtotal >= 2000 evaluates to 0 (POLICY-PENDING FINDING-1)", () => {
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

// ── Section 7: Checkout collection UI ────────────────────────────────────────
console.log("\n  ─── Section 7: Checkout collection UI ───\n");

const checkoutSrc = readSource("app/checkout/page.tsx");

test("Checkout: imports COLLECTION_PROVINCE from commerce/delivery", () => {
  assert.ok(
    checkoutSrc.includes("COLLECTION_PROVINCE") && checkoutSrc.includes("commerce/delivery"),
    "Checkout does not import COLLECTION_PROVINCE from commerce/delivery",
  );
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
    checkoutSrc.includes("isCollection ? \"FREE\""),
    "Order summary FREE for collection not found",
  );
});

test("Checkout: local DELIVERY_RATES removed (rates come from delivery module)", () => {
  assert.ok(
    !checkoutSrc.includes("const DELIVERY_RATES"),
    "Checkout still has local DELIVERY_RATES — should import from commerce/delivery",
  );
});

// ── Section 8: Projection filter removal ─────────────────────────────────────
console.log("\n  ─── Section 8: Projection filter removal ───\n");

const shopSrc = readSource("app/shop/page.tsx");

test("shop/page.tsx: CATALOGUE_PROJECTIONS removed", () => {
  assert.ok(!shopSrc.includes("CATALOGUE_PROJECTIONS"), "CATALOGUE_PROJECTIONS still present in shop/page.tsx");
});

test("shop/page.tsx: selectedProjection state removed", () => {
  assert.ok(!shopSrc.includes("selectedProjection"), "selectedProjection still present in shop/page.tsx");
});

test("shop/page.tsx: capitalize() helper removed", () => {
  assert.ok(!shopSrc.includes("function capitalize("), "capitalize() helper still present in shop/page.tsx");
});

test("shop/page.tsx: PROJECTION_ORDER removed", () => {
  assert.ok(!shopSrc.includes("PROJECTION_ORDER"), "PROJECTION_ORDER still present in shop/page.tsx");
});

test("native records: projection field preserved in at least one record (not stripped)", () => {
  const invictusSrc = readSource("app/lib/mkc/native/invictus-inspired.ts");
  assert.ok(
    invictusSrc.includes('projection:     "strong"'),
    "projection field missing from invictus-inspired native record",
  );
});

// ── Section 9: FAQ and editorial claim corrections ───────────────────────────
console.log("\n  ─── Section 9: FAQ and editorial claim corrections ───\n");

const faqSrc = readSource("app/faq/page.tsx");

test("FAQ: prohibited '6 to 12 hours' longevity claim removed", () => {
  assert.ok(!faqSrc.includes("6 to 12 hours"), "Prohibited '6 to 12 hours' still present in FAQ");
});

test("FAQ: replacement text includes 'We do not guarantee a specific wear time'", () => {
  assert.ok(
    faqSrc.includes("We do not guarantee a specific wear time"),
    "Protocol-specified disclaimer not found in FAQ",
  );
});

const momentSrc = readSource("app/lib/discovery/momentContent.ts");

test("momentContent: 'all-day presence' removed from academyCopy", () => {
  assert.ok(!momentSrc.includes("all-day presence"), "Prohibited 'all-day presence' still present in momentContent.ts");
});

// ── Section 10: MKC native corrections (8 records) ───────────────────────────
console.log("\n  ─── Section 10: MKC native claim corrections ───\n");

const NATIVE_CORRECTIONS: Array<{ file: string; prohibitedPhrase: string; description: string }> = [
  { file: "app/lib/mkc/native/layton-inspired.ts",             prohibitedPhrase: "stops conversations",                               description: "layton mood: 'stops conversations'" },
  { file: "app/lib/mkc/native/spicebomb-extreme-inspired.ts",  prohibitedPhrase: "announces its presence from across the room",       description: "spicebomb-extreme mood: 'announces its presence from across the room'" },
  { file: "app/lib/mkc/native/ultra-male-inspired.ts",         prohibitedPhrase: "turns heads and demands attention",                 description: "ultra-male mood: 'turns heads and demands attention'" },
  { file: "app/lib/mkc/native/god-of-fire-inspired.ts",        prohibitedPhrase: "announces itself with a confidence that turns heads", description: "god-of-fire description: 'announces itself with a confidence that turns heads'" },
  { file: "app/lib/mkc/native/le-male-elixir-inspired.ts",     prohibitedPhrase: "announces itself before you speak",                 description: "le-male-elixir mood: 'announces itself before you speak'" },
  { file: "app/lib/mkc/native/libre-le-parfum-inspired.ts",    prohibitedPhrase: "demands attention—radiant without softness",   description: "libre-le-parfum description: original 'demands attention' phrasing" },
  { file: "app/lib/mkc/native/hypnotic-poison-inspired.ts",    prohibitedPhrase: "announces itself",                                  description: "hypnotic-poison recommendedFor[0]: 'announces itself'" },
  { file: "app/lib/mkc/native/invictus-inspired.ts",           prohibitedPhrase: "Invictus Inspired announces itself",                description: "invictus description: original 'announces itself' phrasing" },
];

for (const { file, prohibitedPhrase, description } of NATIVE_CORRECTIONS) {
  test(`MKC native: ${description} — removed`, () => {
    const src = readSource(file);
    assert.ok(
      !src.includes(prohibitedPhrase),
      `Prohibited phrase still present in ${file}: "${prohibitedPhrase}"`,
    );
  });
}

// ── Section 11: Draft synchronization ────────────────────────────────────────
console.log("\n  ─── Section 11: Draft synchronization ───\n");

test("libre-le-parfum-inspired draft: 'demands attention' removed from description", () => {
  const src = readSource("scripts/factory/drafts/libre-le-parfum-inspired.ts");
  assert.ok(!src.includes("demands attention—radiant without softness"), "Draft libre-le-parfum still has original prohibited phrase");
  assert.ok(src.includes("radiant authority"), "Draft libre-le-parfum description not updated with 'radiant authority'");
});

test("hypnotic-poison-inspired draft: no prohibited phrases", () => {
  const src = readSource("scripts/factory/drafts/hypnotic-poison-inspired.ts");
  assert.ok(!src.includes("announces itself"), "Draft hypnotic-poison contains 'announces itself'");
  assert.ok(!src.includes("trail that stays"), "Draft hypnotic-poison contains 'trail that stays'");
});

// ── Section 12: Testimonials ─────────────────────────────────────────────────
console.log("\n  ─── Section 12: Testimonials ───\n");

test("Reviews.tsx: orphaned — not imported from app/page.tsx", () => {
  const homeSrc = readSource("app/page.tsx");
  assert.ok(!homeSrc.includes("Reviews"), "Reviews component imported on homepage — expected to be orphaned");
});

test("Reviews.tsx: Aaliyah entry with prohibited longevity claim removed", () => {
  const reviewsSrc = readSource("app/components/Reviews.tsx");
  assert.ok(!reviewsSrc.includes("Aaliyah"), "Aaliyah entry still present in Reviews.tsx");
  assert.ok(!reviewsSrc.includes("Lasted all day"), "Prohibited 'Lasted all day' longevity claim still in Reviews.tsx");
});

test("Testimonials.tsx: imported on homepage", () => {
  const homeSrc = readSource("app/page.tsx");
  assert.ok(homeSrc.includes("Testimonials"), "Testimonials component not imported on homepage");
});

test("Testimonials.tsx: reviews array is empty (suppressed pending provenance verification)", () => {
  const testimonialsSrc = readSource("app/components/Testimonials.tsx");
  assert.ok(
    testimonialsSrc.includes("reviews: { location: string; review: string }[] = []"),
    "Testimonials reviews array is not empty — unverified testimonials may be live",
  );
});

test("Testimonials.tsx: no longevity claims", () => {
  const testimonialsSrc = readSource("app/components/Testimonials.tsx");
  const prohibited = ["lasted all day", "lasts", "hours", "longevity", "6 to 12"];
  for (const phrase of prohibited) {
    assert.ok(
      !testimonialsSrc.toLowerCase().includes(phrase),
      `Prohibited longevity phrase in Testimonials.tsx: "${phrase}"`,
    );
  }
});

test("Testimonials.tsx: no similarity claims", () => {
  const testimonialsSrc = readSource("app/components/Testimonials.tsx");
  assert.ok(!testimonialsSrc.includes("close to the original"), "Similarity claim 'close to the original' in Testimonials.tsx");
  assert.ok(!testimonialsSrc.includes("smells like"), "Similarity claim 'smells like' in Testimonials.tsx");
});

// ── Results ───────────────────────────────────────────────────────────────────

console.log("\n" + "─".repeat(60));
console.log(`  Results: ${passed} passed, ${failed} failed`);
if (failed === 0) {
  console.log("\n  PASS — all P2B commerce regression checks passed.\n");
} else {
  console.log("\n  FAIL — regression violations detected.\n");
  process.exit(1);
}
