/**
 * SITE-RELIABILITY-P2C — Commerce Regression Tests
 *
 * Covers:
 *   - Catalogue price correctness (5ml/10ml/30ml per authorized rates)
 *   - Delivery module: DELIVERY_RATES, FREE_DELIVERY_THRESHOLD, computeDelivery(),
 *     getDeliveryCharge(), isCollectionOrder(), ALL_PROVINCES
 *   - Wholesale module: WHOLESALE_THRESHOLD, isWholesaleActive(), getWholesaleItemPrice()
 *   - Rewards module: getNextReward(), getRewardMessage() — confirmed R2000+ threshold
 *   - Order validation (server-side): delivery recomputed from items; tampered payloads
 *     rejected; retail-above-R2000-but-wholesale-below charged; collection always accepted
 *   - MiniCart: delivery calc uses FREE_DELIVERY_THRESHOLD (>), no wholesale exception
 *   - Checkout: local DELIVERY_RATES removed, imports computeDelivery
 *   - Projection filter removal, FAQ claim corrections, MKC corrections, Testimonials
 *
 * Founder decision D11 (2026-09-14): "orders over R2000 is free"
 *   - Threshold: subtotal > 2000 (strictly greater than; R2000.00 does not qualify)
 *   - Collection / Pickup: always R0
 *   - Wholesale eligibility alone does NOT grant free delivery
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
  FREE_DELIVERY_THRESHOLD,
  getDeliveryCharge,
  computeDelivery,
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

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Build a valid courier order body for a given province + retail item set. */
function courierOrder(
  province: string,
  items: Array<{price: number; quantity: number; size: string; id?: string; title?: string}>,
): Record<string, unknown> {
  const cartCount = items.reduce((n, i) => n + i.quantity, 0);
  const active = cartCount >= WHOLESALE_THRESHOLD;
  const subtotal = items.reduce(
    (s, i) => s + getWholesaleItemPrice(i.size, i.price, active) * i.quantity, 0
  );
  const delivery = computeDelivery(province, subtotal);
  return {
    customer_name: "Test Customer",
    phone: "0821234567",
    address: province === COLLECTION_PROVINCE ? undefined : "123 Main Street",
    province,
    items: items.map((i, idx) => ({
      id: i.id ?? `item-${idx}`,
      title: i.title ?? `Fragrance ${idx}`,
      price: i.price,
      quantity: i.quantity,
      size: i.size,
    })),
    subtotal,
    delivery,
    total: subtotal + delivery,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
console.log("\n  SITE-RELIABILITY-P2C — Commerce Regression Tests\n");

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
  assert.equal(min, 60);
});

// ── Section 2: Delivery module ───────────────────────────────────────────────
console.log("\n  ─── Section 2: Delivery module ───\n");

test("DELIVERY_RATES: Cape Town Metro = R100", () => { assert.equal(DELIVERY_RATES["Cape Town Metro"], 100); });
test("DELIVERY_RATES: Western Cape Regional = R150", () => { assert.equal(DELIVERY_RATES["Western Cape Regional"], 150); });
test("DELIVERY_RATES: Gauteng = R180", () => { assert.equal(DELIVERY_RATES["Gauteng"], 180); });
test("DELIVERY_RATES: KwaZulu-Natal = R180", () => { assert.equal(DELIVERY_RATES["KwaZulu-Natal"], 180); });
test("DELIVERY_RATES: Other Major Cities = R200", () => { assert.equal(DELIVERY_RATES["Other Major Cities"], 200); });
test("DELIVERY_RATES: Outlying Areas = R300", () => { assert.equal(DELIVERY_RATES["Outlying Areas"], 300); });
test("DELIVERY_RATES: Collection / Pickup = R0", () => { assert.equal(DELIVERY_RATES["Collection / Pickup"], 0); });

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
  assert.equal(isCollectionOrder(""), false);
});

test("ALL_PROVINCES includes Collection / Pickup (7 total)", () => {
  assert.ok(ALL_PROVINCES.includes("Collection / Pickup"));
  assert.equal(ALL_PROVINCES.length, 7);
});

test("FREE_DELIVERY_THRESHOLD = 2000", () => {
  assert.equal(FREE_DELIVERY_THRESHOLD, 2000);
});

test("computeDelivery: collection always R0 regardless of subtotal", () => {
  assert.equal(computeDelivery("Collection / Pickup", 0), 0);
  assert.equal(computeDelivery("Collection / Pickup", 500), 0);
  assert.equal(computeDelivery("Collection / Pickup", 2001), 0);
  assert.equal(computeDelivery("Collection / Pickup", 5000), 0);
});

test("computeDelivery: exactly R2000 is NOT free (exclusive threshold)", () => {
  assert.equal(computeDelivery("Cape Town Metro", 2000), 100, "R2000 exactly should charge province rate");
});

test("computeDelivery: R1999.99 is charged at province rate", () => {
  assert.equal(computeDelivery("Cape Town Metro", 1999.99), 100);
});

test("computeDelivery: R2000.01 is free", () => {
  assert.equal(computeDelivery("Cape Town Metro", 2000.01), 0);
});

test("computeDelivery: subtotal strictly > R2000 gives R0 for any province", () => {
  assert.equal(computeDelivery("Cape Town Metro", 2001), 0);
  assert.equal(computeDelivery("Gauteng", 2001), 0);
  assert.equal(computeDelivery("Outlying Areas", 3000), 0);
});

test("computeDelivery: unknown province charges R180 fallback when below threshold", () => {
  assert.equal(computeDelivery("Unknown Province", 1000), 180);
});

test("computeDelivery: unknown province gives R0 when above threshold", () => {
  assert.equal(computeDelivery("Unknown Province", 2001), 0);
});

// ── Section 3: Wholesale module ──────────────────────────────────────────────
console.log("\n  ─── Section 3: Wholesale module ───\n");

test("WHOLESALE_THRESHOLD = 10", () => { assert.equal(WHOLESALE_THRESHOLD, 10); });
test("isWholesaleActive: cartCount 9 = false", () => { assert.equal(isWholesaleActive(9), false); });
test("isWholesaleActive: cartCount 10 = true", () => { assert.equal(isWholesaleActive(10), true); });
test("isWholesaleActive: cartCount 0 = false", () => { assert.equal(isWholesaleActive(0), false); });
test("getWholesaleItemPrice: 5ml active = R48", () => { assert.equal(getWholesaleItemPrice("5ml", 60, true), 48); });
test("getWholesaleItemPrice: 10ml active = R77", () => { assert.equal(getWholesaleItemPrice("10ml", 100, true), 77); });
test("getWholesaleItemPrice: 30ml active = R180", () => { assert.equal(getWholesaleItemPrice("30ml", 250, true), 180); });
test("getWholesaleItemPrice: returns retail price when not active", () => {
  assert.equal(getWholesaleItemPrice("5ml", 60, false), 60);
});
test("getWholesaleItemPrice: unknown size falls back to retail price", () => {
  assert.equal(getWholesaleItemPrice("50ml", 400, true), 400);
});

// ── Section 4: Rewards module ────────────────────────────────────────────────
console.log("\n  ─── Section 4: Rewards module ───\n");

test("getNextReward: R0 → next tier R400", () => { assert.deepEqual(getNextReward(0), { amount: 400, reward: "1 Free 5ml Sample" }); });
test("getNextReward: R399 → next tier R400", () => { assert.deepEqual(getNextReward(399), { amount: 400, reward: "1 Free 5ml Sample" }); });
test("getNextReward: R400 → next tier R700", () => { assert.deepEqual(getNextReward(400), { amount: 700, reward: "2 Free 5ml Samples" }); });
test("getNextReward: R700 → next tier R1000", () => { assert.deepEqual(getNextReward(700), { amount: 1000, reward: "3 Free 5ml Samples" }); });
test("getNextReward: R1000 → next tier R1500", () => { assert.deepEqual(getNextReward(1000), { amount: 1500, reward: "Discovery Set (5 × 5ml)" }); });
test("getNextReward: R1500 → null", () => { assert.equal(getNextReward(1500), null); });
test("getNextReward: R2000 → null", () => { assert.equal(getNextReward(2000), null); });

test("getRewardMessage: below R400 = empty string", () => {
  assert.equal(getRewardMessage(0), "");
  assert.equal(getRewardMessage(399), "");
});
test("getRewardMessage: R400 → '1 Free 5ml Sample'", () => {
  assert.ok(getRewardMessage(400).includes("1 Free 5ml Sample"));
});
test("getRewardMessage: R1500 → Discovery Set (no free delivery)", () => {
  const msg = getRewardMessage(1500);
  assert.ok(msg.includes("Discovery Set"));
  assert.ok(!msg.includes("Free Delivery"), "R1500 should not include free delivery");
});
test("getRewardMessage: exactly R2000 does NOT include Free Delivery (exclusive threshold)", () => {
  const msg = getRewardMessage(2000);
  assert.ok(!msg.includes("Free Delivery"), "R2000 exactly should not claim free delivery");
  assert.ok(msg.includes("Discovery Set"), "R2000 still earns Discovery Set reward");
});
test("getRewardMessage: R2001 includes Free Delivery", () => {
  assert.ok(getRewardMessage(2001).includes("Free Delivery"));
});
test("getRewardMessage: R2000.01 includes Free Delivery", () => {
  assert.ok(getRewardMessage(2000.01).includes("Free Delivery"));
});

// ── Section 5: Order validation ──────────────────────────────────────────────
console.log("\n  ─── Section 5: Order validation (server-side) ───\n");

test("validateOrderBody: valid retail courier order returns null", () => {
  const body = courierOrder("Cape Town Metro", [{ price: 60, quantity: 1, size: "5ml" }]);
  assert.equal(validateOrderBody(body), null);
});

test("validateOrderBody: collection without address returns null (accepted)", () => {
  const body = courierOrder("Collection / Pickup", [{ price: 60, quantity: 1, size: "5ml" }]);
  assert.equal(validateOrderBody(body), null);
});

test("validateOrderBody: collection at any subtotal always delivery=0", () => {
  const body = courierOrder("Collection / Pickup", [{ price: 60, quantity: 40, size: "5ml" }]);
  assert.equal((body.delivery as number), 0, "Collection should have delivery=0");
  assert.equal(validateOrderBody(body), null);
});

test("validateOrderBody: delivery without address is rejected", () => {
  const body: Record<string, unknown> = {
    ...courierOrder("Cape Town Metro", [{ price: 60, quantity: 1, size: "5ml" }]),
    address: undefined,
  };
  const err = validateOrderBody(body);
  assert.ok(err !== null && err.includes("address"), `Expected address error, got: ${err}`);
});

test("validateOrderBody: unknown province is rejected", () => {
  const body = { ...courierOrder("Cape Town Metro", [{ price: 60, quantity: 1, size: "5ml" }]), province: "Fake Province" };
  const err = validateOrderBody(body);
  assert.ok(err !== null && err.includes("delivery area"), `Expected province error, got: ${err}`);
});

test("validateOrderBody: tampered delivery=0 for chargeable order is rejected", () => {
  // Subtotal R60, province Cape Town Metro → server computes delivery=R100
  // Client tampers delivery=0 to avoid the charge
  const body = {
    customer_name: "Test Customer",
    phone: "0821234567",
    address: "123 Main Street",
    province: "Cape Town Metro",
    items: [{ id: "t1", title: "F", price: 60, quantity: 1, size: "5ml" }],
    subtotal: 60,
    delivery: 0, // tampered
    total: 60,
  };
  const err = validateOrderBody(body);
  assert.ok(err !== null, "Tampered delivery=0 should be rejected");
  assert.ok(
    err!.includes("Delivery") || err!.includes("total"),
    `Expected delivery mismatch error, got: ${err}`,
  );
});

test("validateOrderBody: retail subtotal R2001 → free delivery (server agrees)", () => {
  // 34 items × R60 retail = R2040 — but cartCount=34 → wholesaleActive → R48 each
  // wholesale subtotal = 34 × 48 = R1632 → NOT free (below R2000)
  // Need a scenario without wholesale: single large-price item
  const body = courierOrder("Cape Town Metro", [{ price: 2001, quantity: 1, size: "unknown-size" }]);
  assert.equal((body.delivery as number), 0, "Subtotal R2001 > threshold, delivery should be free");
  assert.equal(validateOrderBody(body), null);
});

test("validateOrderBody: retail subtotal exactly R2000 → NOT free (province rate charged)", () => {
  const body = courierOrder("Cape Town Metro", [{ price: 2000, quantity: 1, size: "unknown-size" }]);
  assert.equal((body.delivery as number), 100, "Subtotal R2000 exactly should NOT be free");
  assert.equal(validateOrderBody(body), null);
});

test("validateOrderBody: wholesale subtotal > R2000 → free delivery", () => {
  // 10 items × R48 wholesale = R480 — not enough
  // Need wholesale subtotal > R2000: 10 × R180 wholesale (30ml items)
  // But 10 × R250 retail, wholesale R180 → 10 × R180 = R1800 still below
  // 12 × R180 = R2160 → free
  const body = courierOrder("Gauteng", Array(12).fill({ price: 250, quantity: 1, size: "30ml" }));
  const sub = body.subtotal as number;
  assert.ok(sub > FREE_DELIVERY_THRESHOLD, `Wholesale subtotal ${sub} should exceed threshold`);
  assert.equal((body.delivery as number), 0, "Wholesale subtotal > R2000 should be free");
  assert.equal(validateOrderBody(body), null);
});

test("validateOrderBody: retail list-price above R2000 but wholesale-priced subtotal below it — charged", () => {
  // Retail: 35 × R60 = R2100 (above R2000)
  // Wholesale: 35 × R48 = R1680 (below R2000) → delivery NOT free
  const items = Array(35).fill({ price: 60, quantity: 1, size: "5ml" });
  const body = courierOrder("Cape Town Metro", items);
  const sub = body.subtotal as number;
  assert.ok(sub <= FREE_DELIVERY_THRESHOLD, `Wholesale subtotal ${sub} should be below threshold`);
  assert.ok((body.delivery as number) > 0, "Should be charged — wholesale subtotal below R2000");
  assert.equal(validateOrderBody(body), null);
});

test("validateOrderBody: wholesale eligibility alone does not grant free delivery", () => {
  // 10 items at R60 retail → wholesale R48 → subtotal R480 — well below R2000
  const body = courierOrder("Outlying Areas", Array(10).fill({ price: 60, quantity: 1, size: "5ml" }));
  assert.equal((body.delivery as number), 300, "Wholesale orders below R2000 should pay province rate");
  assert.equal(validateOrderBody(body), null);
});

test("validateOrderBody: empty cart rejected", () => {
  const body = { ...courierOrder("Cape Town Metro", [{ price: 60, quantity: 1, size: "5ml" }]), items: [] };
  const err = validateOrderBody(body);
  assert.ok(err !== null && err.includes("empty"), `Expected empty cart error, got: ${err}`);
});

// ── Section 6: MiniCart delivery logic ───────────────────────────────────────
console.log("\n  ─── Section 6: MiniCart delivery logic ───\n");

const miniCartSrc = readSource("app/components/MiniCart.tsx");

test("MiniCart: imports FREE_DELIVERY_THRESHOLD from delivery module", () => {
  assert.ok(
    miniCartSrc.includes("FREE_DELIVERY_THRESHOLD") && miniCartSrc.includes("commerce/delivery"),
    "MiniCart does not import FREE_DELIVERY_THRESHOLD from commerce/delivery",
  );
});

test("MiniCart: imports getNextReward and getRewardMessage from rewards module", () => {
  assert.ok(miniCartSrc.includes("getNextReward") && miniCartSrc.includes("getRewardMessage"));
});

test("MiniCart delivery: uses > FREE_DELIVERY_THRESHOLD (exclusive — D11 compliant)", () => {
  assert.ok(
    miniCartSrc.includes("subtotal > FREE_DELIVERY_THRESHOLD"),
    "MiniCart delivery should use > FREE_DELIVERY_THRESHOLD (not >= 2000)",
  );
});

test("MiniCart delivery: no longer grants wholesale free delivery", () => {
  assert.ok(
    !miniCartSrc.includes("wholesaleActive\n      ? 0") && !miniCartSrc.includes("wholesaleActive ? 0\n"),
    "MiniCart still has wholesaleActive free delivery — should be removed per D11",
  );
});

test("MiniCart: '✓ Free Delivery Included' removed from Wholesale panel", () => {
  assert.ok(
    !miniCartSrc.includes("Free Delivery Included"),
    "Wholesale panel still shows 'Free Delivery Included' — removed per D11",
  );
});

test("MiniCart delivery: empty cart guard present", () => {
  assert.ok(miniCartSrc.includes("!cart || cart.length === 0"));
});

test("MiniCart delivery: standard fallback is 100 (unknown province)", () => {
  assert.ok(miniCartSrc.includes(": 100;"));
});

// ── Section 7: Checkout collection UI ────────────────────────────────────────
console.log("\n  ─── Section 7: Checkout UI ───\n");

const checkoutSrc = readSource("app/checkout/page.tsx");

test("Checkout: imports COLLECTION_PROVINCE and computeDelivery from commerce/delivery", () => {
  assert.ok(
    checkoutSrc.includes("COLLECTION_PROVINCE") &&
    checkoutSrc.includes("computeDelivery") &&
    checkoutSrc.includes("commerce/delivery"),
    "Checkout does not import computeDelivery from commerce/delivery",
  );
});

test("Checkout: uses cartTotal (wholesale-aware) as subtotal", () => {
  assert.ok(
    checkoutSrc.includes("cartTotal") && checkoutSrc.includes("subtotal = cartTotal"),
    "Checkout should use cartTotal (wholesale-adjusted) as subtotal",
  );
});

test("Checkout: local DELIVERY_RATES removed", () => {
  assert.ok(!checkoutSrc.includes("const DELIVERY_RATES"), "Checkout still has local DELIVERY_RATES");
});

test("Checkout: address field hidden when collection selected", () => {
  assert.ok(checkoutSrc.includes("!isCollection && ("));
});

test("Checkout: address validation skipped for collection", () => {
  assert.ok(checkoutSrc.includes("!isCollection && !address.trim()"));
});

test("Checkout: delivery amount shows FREE when delivery === 0", () => {
  assert.ok(
    checkoutSrc.includes("delivery === 0 ? \"FREE\""),
    "Checkout should show FREE when delivery === 0 (covers collection AND R2000+)",
  );
});

// ── Section 8: Delivery page and FAQ wording ──────────────────────────────────
console.log("\n  ─── Section 8: Customer-facing wording ───\n");

test("delivery/page.tsx: includes approved free-delivery statement", () => {
  const deliverySrc = readSource("app/delivery/page.tsx");
  assert.ok(
    deliverySrc.includes("Free delivery on orders over R2000"),
    "Delivery page missing 'Free delivery on orders over R2000'",
  );
});

test("delivery/page.tsx: collection always free statement present", () => {
  const deliverySrc = readSource("app/delivery/page.tsx");
  assert.ok(
    deliverySrc.toLowerCase().includes("collection") && deliverySrc.toLowerCase().includes("always free"),
    "Delivery page missing 'Collection / Pickup is always free' statement",
  );
});

test("faq/page.tsx: includes approved free-delivery statement", () => {
  const faqSrc = readSource("app/faq/page.tsx");
  assert.ok(
    faqSrc.includes("Free delivery on orders over R2000"),
    "FAQ missing 'Free delivery on orders over R2000'",
  );
});

test("No surface claims R750 free delivery", () => {
  const surfaces = [
    "app/components/MiniCart.tsx",
    "app/checkout/page.tsx",
    "app/delivery/page.tsx",
    "app/faq/page.tsx",
  ];
  for (const f of surfaces) {
    const src = readSource(f);
    assert.ok(!src.includes("R750"), `${f} contains prohibited R750 free delivery reference`);
  }
});

// ── Section 9: Projection filter removal ─────────────────────────────────────
console.log("\n  ─── Section 9: Projection filter removal ───\n");

const shopSrc = readSource("app/shop/page.tsx");
test("shop/page.tsx: CATALOGUE_PROJECTIONS removed", () => { assert.ok(!shopSrc.includes("CATALOGUE_PROJECTIONS")); });
test("shop/page.tsx: selectedProjection removed", () => { assert.ok(!shopSrc.includes("selectedProjection")); });
test("shop/page.tsx: PROJECTION_ORDER removed", () => { assert.ok(!shopSrc.includes("PROJECTION_ORDER")); });
test("native records: projection field preserved in at least one record", () => {
  const src = readSource("app/lib/mkc/native/invictus-inspired.ts");
  assert.ok(src.includes('projection:     "strong"'));
});

// ── Section 10: FAQ and editorial claim corrections ───────────────────────────
console.log("\n  ─── Section 10: FAQ and editorial claim corrections ───\n");

const faqSrc = readSource("app/faq/page.tsx");
test("FAQ: '6 to 12 hours' removed", () => { assert.ok(!faqSrc.includes("6 to 12 hours")); });
test("FAQ: disclaimer text present", () => { assert.ok(faqSrc.includes("We do not guarantee a specific wear time")); });

const momentSrc = readSource("app/lib/discovery/momentContent.ts");
test("momentContent: 'all-day presence' removed", () => { assert.ok(!momentSrc.includes("all-day presence")); });

// ── Section 11: MKC native corrections ────────────────────────────────────────
console.log("\n  ─── Section 11: MKC native claim corrections ───\n");

const NATIVE_CORRECTIONS = [
  { file: "app/lib/mkc/native/layton-inspired.ts",            prohibitedPhrase: "stops conversations" },
  { file: "app/lib/mkc/native/spicebomb-extreme-inspired.ts", prohibitedPhrase: "announces its presence from across the room" },
  { file: "app/lib/mkc/native/ultra-male-inspired.ts",        prohibitedPhrase: "turns heads and demands attention" },
  { file: "app/lib/mkc/native/god-of-fire-inspired.ts",       prohibitedPhrase: "announces itself with a confidence that turns heads" },
  { file: "app/lib/mkc/native/le-male-elixir-inspired.ts",    prohibitedPhrase: "announces itself before you speak" },
  { file: "app/lib/mkc/native/libre-le-parfum-inspired.ts",   prohibitedPhrase: "demands attention—radiant without softness" },
  { file: "app/lib/mkc/native/hypnotic-poison-inspired.ts",   prohibitedPhrase: "announces itself" },
  { file: "app/lib/mkc/native/invictus-inspired.ts",          prohibitedPhrase: "Invictus Inspired announces itself" },
];

for (const { file, prohibitedPhrase } of NATIVE_CORRECTIONS) {
  test(`MKC native: ${prohibitedPhrase.slice(0, 40)}… removed`, () => {
    const src = readSource(file);
    assert.ok(!src.includes(prohibitedPhrase), `Prohibited phrase in ${file}`);
  });
}

// ── Section 12: Draft synchronization ────────────────────────────────────────
console.log("\n  ─── Section 12: Draft synchronization ───\n");

test("libre-le-parfum-inspired draft: 'demands attention' removed", () => {
  const src = readSource("scripts/factory/drafts/libre-le-parfum-inspired.ts");
  assert.ok(!src.includes("demands attention—radiant without softness"));
  assert.ok(src.includes("radiant authority"));
});

test("hypnotic-poison-inspired draft: no prohibited phrases", () => {
  const src = readSource("scripts/factory/drafts/hypnotic-poison-inspired.ts");
  assert.ok(!src.includes("announces itself"));
  assert.ok(!src.includes("trail that stays"));
});

// ── Section 13: Testimonials ─────────────────────────────────────────────────
console.log("\n  ─── Section 13: Testimonials ───\n");

test("Reviews.tsx: orphaned — not imported from app/page.tsx", () => {
  assert.ok(!readSource("app/page.tsx").includes("Reviews"));
});

test("Reviews.tsx: Aaliyah entry removed", () => {
  const src = readSource("app/components/Reviews.tsx");
  assert.ok(!src.includes("Aaliyah"));
  assert.ok(!src.includes("Lasted all day"));
});

test("Testimonials.tsx: imported on homepage", () => {
  assert.ok(readSource("app/page.tsx").includes("Testimonials"));
});

test("Testimonials.tsx: reviews array is empty (suppressed)", () => {
  const src = readSource("app/components/Testimonials.tsx");
  assert.ok(
    src.includes("reviews: { location: string; review: string }[] = []"),
    "Testimonials reviews array is not empty",
  );
});

test("Testimonials.tsx: no longevity claims", () => {
  const src = readSource("app/components/Testimonials.tsx").toLowerCase();
  for (const phrase of ["lasted all day", "lasts", "hours", "longevity", "6 to 12"]) {
    assert.ok(!src.includes(phrase), `Longevity phrase in Testimonials.tsx: "${phrase}"`);
  }
});

// ── Results ───────────────────────────────────────────────────────────────────

console.log("\n" + "─".repeat(60));
console.log(`  Results: ${passed} passed, ${failed} failed`);
if (failed === 0) {
  console.log("\n  PASS — all P2C commerce regression checks passed.\n");
} else {
  console.log("\n  FAIL — regression violations detected.\n");
  process.exit(1);
}
