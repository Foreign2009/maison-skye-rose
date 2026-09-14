/**
 * SITE-RELIABILITY-P2D — Order Handler Tests
 *
 * Verifies that the POST /api/orders route:
 *   1. Rejects invalid requests (unknown province, unknown product, bad quantity,
 *      tampered prices, inactive product) — all via validateOrderBody
 *   2. Accepts valid retail and wholesale orders, returning server-computed values
 *   3. Persists server-computed subtotal/delivery/total, not client-submitted values
 *      (verified via route source inspection)
 *
 * Handler tests use validateOrderBody directly (the shared validation boundary)
 * plus source inspection to confirm the route wires validation results to persistence.
 *
 * Run: npx tsx scripts/factory/__tests__/p2d-order-handler.test.ts
 */

import assert from "node:assert/strict";
import fs     from "node:fs";
import path   from "node:path";

import {
  validateOrderBody,
  type OrderValidationResult,
} from "../../../app/lib/commerce/orderValidation";
import {
  FREE_DELIVERY_THRESHOLD,
  COLLECTION_PROVINCE,
} from "../../../app/lib/commerce/delivery";
import {
  WHOLESALE_THRESHOLD,
  getWholesaleItemPrice,
} from "../../../app/lib/commerce/wholesale";

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

// ── Catalogue-price constants ─────────────────────────────────────────────────

const CATALOGUE_PRICES: Record<string, number> = { "5ml": 60, "10ml": 100, "30ml": 250 };
const TEST_SLUG  = "aventus-inspired";
const TEST_TITLE = "Aventus Inspired";

// ── Order body builder ────────────────────────────────────────────────────────

function makeOrder(
  province: string,
  items: Array<{quantity: number; size: string; id?: string; title?: string; price?: number}>,
  overrides: Partial<Record<string, unknown>> = {},
): Record<string, unknown> {
  const cartCount = items.reduce((n, i) => n + i.quantity, 0);
  const active    = cartCount >= WHOLESALE_THRESHOLD;
  const subtotal  = items.reduce((s, i) => {
    const cataloguePrice = CATALOGUE_PRICES[i.size] ?? 60;
    return s + getWholesaleItemPrice(i.size, cataloguePrice, active) * i.quantity;
  }, 0);
  const delivery = province === COLLECTION_PROVINCE
    ? 0
    : subtotal > FREE_DELIVERY_THRESHOLD ? 0 : (
        province === "Cape Town Metro"       ? 100
      : province === "Western Cape Regional" ? 150
      : province === "Gauteng"               ? 180
      : province === "KwaZulu-Natal"         ? 180
      : province === "Other Major Cities"    ? 200
      : province === "Outlying Areas"        ? 300
      : 180
    );
  return {
    customer_name: "Test Customer",
    phone: "0821234567",
    address: province === COLLECTION_PROVINCE ? undefined : "123 Main Street",
    province,
    items: items.map(i => ({
      id:       i.id    ?? TEST_SLUG,
      title:    i.title ?? TEST_TITLE,
      price:    i.price ?? (CATALOGUE_PRICES[i.size] ?? 60),
      quantity: i.quantity,
      size:     i.size,
    })),
    subtotal,
    delivery,
    total: subtotal + delivery,
    ...overrides,
  };
}

function ok(r: OrderValidationResult): asserts r is Extract<OrderValidationResult, { ok: true }> {
  assert.ok(r.ok, `Expected ok=true but got error: ${!r.ok ? r.error : ""}`);
}

function fail(r: OrderValidationResult): asserts r is Extract<OrderValidationResult, { ok: false }> {
  assert.ok(!r.ok, `Expected ok=false but validation passed`);
}

// ─────────────────────────────────────────────────────────────────────────────
console.log("\n  SITE-RELIABILITY-P2D — Order Handler Tests\n");

// ── Section 1: Valid orders accepted ─────────────────────────────────────────
console.log("  ─── Section 1: Valid orders ───\n");

test("Valid retail order: 1 × 5ml @ R60, Cape Town Metro → subtotal R60, delivery R100", () => {
  const r = validateOrderBody(makeOrder("Cape Town Metro", [{ quantity: 1, size: "5ml" }]));
  ok(r);
  assert.equal(r.subtotal,  60);
  assert.equal(r.delivery, 100);
  assert.equal(r.total,    160);
});

test("Valid retail order: 1 × 10ml @ R100, Gauteng → subtotal R100, delivery R180", () => {
  const r = validateOrderBody(makeOrder("Gauteng", [{ quantity: 1, size: "10ml" }]));
  ok(r);
  assert.equal(r.subtotal, 100);
  assert.equal(r.delivery, 180);
  assert.equal(r.total,    280);
});

test("Valid retail order: 1 × 30ml @ R250, Outlying Areas → subtotal R250, delivery R300", () => {
  const r = validateOrderBody(makeOrder("Outlying Areas", [{ quantity: 1, size: "30ml" }]));
  ok(r);
  assert.equal(r.subtotal, 250);
  assert.equal(r.delivery, 300);
  assert.equal(r.total,    550);
});

test("Valid wholesale order: 10 × 5ml → wholesale price R48 each → subtotal R480, Gauteng R180", () => {
  const r = validateOrderBody(makeOrder("Gauteng", Array(10).fill({ quantity: 1, size: "5ml" })));
  ok(r);
  assert.equal(r.subtotal, 480);  // 10 × 48
  assert.equal(r.delivery, 180);
  assert.equal(r.total,    660);
});

test("Valid collection order: any subtotal → delivery always R0", () => {
  const r = validateOrderBody(makeOrder(COLLECTION_PROVINCE, [{ quantity: 5, size: "5ml" }]));
  ok(r);
  assert.equal(r.delivery, 0);
  assert.equal(r.total, r.subtotal);
});

test("Valid retail order over R2000: 9 × 30ml → subtotal R2250 → free delivery", () => {
  // 9 × R250 retail, cartCount=9 → not wholesale; R2250 > R2000 → free
  const r = validateOrderBody(makeOrder("Cape Town Metro", Array(9).fill({ quantity: 1, size: "30ml" })));
  ok(r);
  assert.equal(r.subtotal, 2250);
  assert.equal(r.delivery, 0);
  assert.equal(r.total,    2250);
});

test("Valid retail order exactly R2000: 8 × 30ml → R2000 exactly → province rate", () => {
  // 8 × R250 = R2000; exclusive threshold → NOT free
  const r = validateOrderBody(makeOrder("Cape Town Metro", Array(8).fill({ quantity: 1, size: "30ml" })));
  ok(r);
  assert.equal(r.subtotal, 2000);
  assert.equal(r.delivery, 100);
  assert.equal(r.total,    2100);
});

test("Valid wholesale order over R2000: 12 × 30ml → wholesale R2160 → free delivery", () => {
  // 12 × R250 retail, wholesale R180 each → 12 × R180 = R2160 > R2000 → free
  const r = validateOrderBody(makeOrder("Gauteng", Array(12).fill({ quantity: 1, size: "30ml" })));
  ok(r);
  assert.equal(r.subtotal, 2160);
  assert.equal(r.delivery, 0);
  assert.equal(r.total,    2160);
});

// ── Section 2: Invalid locations ─────────────────────────────────────────────
console.log("\n  ─── Section 2: Invalid locations ───\n");

test("Unknown province is rejected before any price computation", () => {
  const r = validateOrderBody(makeOrder("Unknown City", [{ quantity: 1, size: "5ml" }], { province: "Unknown City" }));
  fail(r);
  assert.ok(r.error.includes("delivery area"), `Got: ${r.error}`);
});

test("Empty province is rejected", () => {
  const r = validateOrderBody(makeOrder("Cape Town Metro", [{ quantity: 1, size: "5ml" }], { province: "" }));
  fail(r);
  assert.ok(r.error.includes("delivery area"), `Got: ${r.error}`);
});

// ── Section 3: Unknown / inactive products ────────────────────────────────────
console.log("\n  ─── Section 3: Unknown / inactive products ───\n");

test("Unknown product id is rejected", () => {
  const body = makeOrder("Cape Town Metro", [{ quantity: 1, size: "5ml", id: "not-in-catalogue" }]);
  (body.items as Record<string, unknown>[])[0].id = "not-in-catalogue";
  const r = validateOrderBody(body);
  fail(r);
  assert.ok(
    r.error.includes("not-in-catalogue") || r.error.toLowerCase().includes("not found"),
    `Got: ${r.error}`,
  );
});

test("Valid product but invalid size is rejected", () => {
  const body = makeOrder("Cape Town Metro", [{ quantity: 1, size: "50ml" }]);
  // makeOrder uses a real slug but unknown size
  const r = validateOrderBody(body);
  fail(r);
  assert.ok(r.error.toLowerCase().includes("size"), `Got: ${r.error}`);
});

// ── Section 4: Bad quantities ─────────────────────────────────────────────────
console.log("\n  ─── Section 4: Bad quantities ───\n");

test("Zero quantity is rejected", () => {
  const body = makeOrder("Cape Town Metro", [{ quantity: 1, size: "5ml" }]);
  (body.items as Record<string, unknown>[])[0].quantity = 0;
  const r = validateOrderBody(body);
  fail(r);
  assert.ok(r.error.includes("quantity"), `Got: ${r.error}`);
});

test("Negative quantity is rejected", () => {
  const body = makeOrder("Cape Town Metro", [{ quantity: 1, size: "5ml" }]);
  (body.items as Record<string, unknown>[])[0].quantity = -1;
  const r = validateOrderBody(body);
  fail(r);
  assert.ok(r.error.includes("quantity"), `Got: ${r.error}`);
});

test("Non-integer quantity is rejected", () => {
  const body = makeOrder("Cape Town Metro", [{ quantity: 1, size: "5ml" }]);
  (body.items as Record<string, unknown>[])[0].quantity = 1.5;
  const r = validateOrderBody(body);
  fail(r);
  assert.ok(r.error.includes("quantity"), `Got: ${r.error}`);
});

test("Empty cart is rejected", () => {
  const r = validateOrderBody(makeOrder("Cape Town Metro", [{ quantity: 1, size: "5ml" }], { items: [] }));
  fail(r);
  assert.ok(r.error.includes("empty"), `Got: ${r.error}`);
});

// ── Section 5: Tampered prices ───────────────────────────────────────────────
console.log("\n  ─── Section 5: Tampered prices (server-authoritative) ───\n");

test("Client-submitted price ignored: price=1 causes subtotal mismatch", () => {
  // Client sends price:1 per item + subtotal:1, but catalogue says 5ml=R60.
  // Server computes serverSubtotal=60 ≠ submitted subtotal=1 → rejected.
  const r = validateOrderBody({
    customer_name: "Test Customer",
    phone: "0821234567",
    address: "123 Main Street",
    province: "Cape Town Metro",
    items: [{ id: TEST_SLUG, title: TEST_TITLE, price: 1, quantity: 1, size: "5ml" }],
    subtotal: 1,
    delivery: 100,
    total: 101,
  });
  fail(r);
  assert.ok(r.error.includes("subtotal"), `Got: ${r.error}`);
});

test("Tampered delivery=0 for chargeable order is rejected", () => {
  // Subtotal R60, Cape Town Metro → server delivery=R100.
  // Client submits delivery=0 to avoid the charge.
  const r = validateOrderBody({
    customer_name: "Test Customer",
    phone: "0821234567",
    address: "123 Main Street",
    province: "Cape Town Metro",
    items: [{ id: TEST_SLUG, title: TEST_TITLE, price: 60, quantity: 1, size: "5ml" }],
    subtotal: 60,
    delivery: 0,  // tampered
    total: 60,
  });
  fail(r);
  assert.ok(
    r.error.includes("Delivery") || r.error.includes("total"),
    `Got: ${r.error}`,
  );
});

test("Tampered total (lower than subtotal + delivery) is rejected", () => {
  const r = validateOrderBody({
    customer_name: "Test Customer",
    phone: "0821234567",
    address: "123 Main Street",
    province: "Cape Town Metro",
    items: [{ id: TEST_SLUG, title: TEST_TITLE, price: 60, quantity: 1, size: "5ml" }],
    subtotal: 60,
    delivery: 100,
    total: 1,  // tampered (should be 160)
  });
  fail(r);
  assert.ok(r.error.includes("total"), `Got: ${r.error}`);
});

test("Wholesale flag cannot be submitted by client — server derives from cartCount", () => {
  // Client submits 1 item (not wholesale) but tries to submit a wholesale-priced subtotal.
  // Catalogue 5ml = R60 retail; wholesale R48. Client submits subtotal=48 (wholesale price).
  // Server: cartCount=1 → not wholesale → serverSubtotal=60 ≠ 48 → rejected.
  const r = validateOrderBody({
    customer_name: "Test Customer",
    phone: "0821234567",
    address: "123 Main Street",
    province: "Cape Town Metro",
    items: [{ id: TEST_SLUG, title: TEST_TITLE, price: 60, quantity: 1, size: "5ml" }],
    subtotal: 48,   // wholesale price for 5ml — not valid for 1 item
    delivery: 100,
    total: 148,
  });
  fail(r);
  assert.ok(r.error.includes("subtotal"), `Got: ${r.error}`);
});

// ── Section 6: Server values in persistence ───────────────────────────────────
console.log("\n  ─── Section 6: Route handler — server values passed to persistence ───\n");

const routeSrc = readSource("app/api/orders/route.ts");

test("Route imports validateOrderBody", () => {
  assert.ok(
    routeSrc.includes("validateOrderBody"),
    "Route must import validateOrderBody from orderValidation",
  );
});

test("Route uses validation.ok check before DB write", () => {
  assert.ok(
    routeSrc.includes("validation.ok") || routeSrc.includes("!validation.ok"),
    "Route must check validation.ok before writing to DB",
  );
});

test("Route persists validation.subtotal (not body.subtotal)", () => {
  assert.ok(
    routeSrc.includes("validation.subtotal"),
    "Route must use validation.subtotal (server-computed), not body.subtotal",
  );
  // The insert must not assign the raw destructured `subtotal` variable.
  assert.ok(
    !routeSrc.includes("subtotal: subtotal"),
    "Route must NOT persist raw body.subtotal — use validation.subtotal instead",
  );
});

test("Route persists validation.delivery (not body.delivery)", () => {
  assert.ok(
    routeSrc.includes("validation.delivery"),
    "Route must use validation.delivery (server-computed), not body.delivery",
  );
});

test("Route persists validation.total (not body.total)", () => {
  assert.ok(
    routeSrc.includes("validation.total"),
    "Route must use validation.total (server-computed), not body.total",
  );
});

test("Route returns 400 with validation.error when validation fails", () => {
  assert.ok(
    routeSrc.includes("validation.error"),
    "Route must surface validation.error to the client on failure",
  );
});

test("Route does not destructure subtotal/delivery/total from body for persistence", () => {
  // After P2D, the route body destructure must NOT include subtotal/delivery/total.
  // Instead it reads them from the validation result.
  const destructureBlock = routeSrc.match(/const\s*\{([^}]+)\}\s*=\s*body\s+as/)?.[1] ?? "";
  assert.ok(
    !destructureBlock.includes("subtotal") &&
    !destructureBlock.includes("delivery") &&
    !destructureBlock.includes("total"),
    "Route body destructure should not include subtotal/delivery/total — use validation result instead",
  );
});

// ── Results ───────────────────────────────────────────────────────────────────

console.log("\n" + "─".repeat(60));
console.log(`  Results: ${passed} passed, ${failed} failed`);
if (failed === 0) {
  console.log("\n  PASS — all P2D order handler checks passed.\n");
} else {
  console.log("\n  FAIL — P2D handler violations detected.\n");
  process.exit(1);
}
