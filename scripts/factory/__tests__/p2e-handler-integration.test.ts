// Must be set before any import that calls getReceiptSecret() at call time.
process.env.ORDER_RECEIPT_SECRET = "test-p2e-secret";

/**
 * SITE-RELIABILITY-P2E — Handler Integration Tests
 *
 * Invokes the real handleOrder() function with a mocked database client
 * (no Supabase, no network). Verifies:
 *
 *   1. Valid retail and wholesale orders produce 200 with correct response shape.
 *   2. Invalid location, unknown product, and tampered prices are rejected
 *      before any DB write (400).
 *   3. The captured DB insert arguments carry server-computed financial values
 *      and normalized (effective) item prices, not raw client-submitted prices.
 *   4. A wholesale order stores wholesale prices per item, not retail prices.
 *   5. A DB failure produces a 500 response.
 *   6. Collection orders store an empty address string.
 *
 * Run: npx tsx scripts/factory/__tests__/p2e-handler-integration.test.ts
 */

import assert from "node:assert/strict";

// handleOrder and OrderDb are exported from the route for testing.
// Supabase is NOT imported by the module when handleOrder is called directly —
// the lazy import() inside POST is never triggered.
import {
  handleOrder,
  type OrderDb,
} from "../../../app/api/orders/route";

import {
  COLLECTION_PROVINCE,
  FREE_DELIVERY_THRESHOLD,
} from "../../../app/lib/commerce/delivery";
import {
  WHOLESALE_THRESHOLD,
  getWholesaleItemPrice,
} from "../../../app/lib/commerce/wholesale";

// ── Harness ───────────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void | Promise<void>): void {
  const result = (() => {
    try {
      const r = fn();
      if (r && typeof (r as Promise<void>).then === "function") {
        return (r as Promise<void>)
          .then(() => { console.log(`  ✓  ${name}`); passed++; })
          .catch((err: unknown) => {
            const msg = err instanceof assert.AssertionError ? err.message : String(err);
            console.error(`  ✗  ${name}\n     ${msg}`);
            failed++;
          });
      }
      console.log(`  ✓  ${name}`);
      passed++;
      return Promise.resolve();
    } catch (err) {
      const msg = err instanceof assert.AssertionError ? err.message : String(err);
      console.error(`  ✗  ${name}\n     ${msg}`);
      failed++;
      return Promise.resolve();
    }
  })();
  return result as unknown as void;
}

// ── Mock DB factory ───────────────────────────────────────────────────────────

type CapturedRow = Record<string, unknown>;

function makeMockDb(opts: { fail?: boolean } = {}): {
  db: OrderDb;
  getCapture(): CapturedRow | null;
  getCalls(): number;
} {
  let capturedRow: CapturedRow | null = null;
  let calls = 0;
  const db: OrderDb = {
    insertOrder: async (row) => {
      calls++;
      capturedRow = row as CapturedRow;
      if (opts.fail) return { error: new Error("DB write failed") };
      return { error: null };
    },
  };
  return {
    db,
    getCapture: () => capturedRow,
    getCalls:   () => calls,
  };
}

// ── Order body builder ────────────────────────────────────────────────────────

const CATALOGUE_PRICES: Record<string, number> = { "5ml": 60, "10ml": 100, "30ml": 250 };
const TEST_SLUG  = "aventus-inspired";
const TEST_TITLE = "Aventus Inspired";

function makeOrderBody(
  province: string,
  items: Array<{ quantity: number; size: string; id?: string; title?: string; price?: number }>,
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
    phone:         "0821234567",
    address:       province === COLLECTION_PROVINCE ? undefined : "123 Main Street",
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

// ── Helper: parse NextResponse JSON ──────────────────────────────────────────

async function parseResponse(r: Response): Promise<Record<string, unknown>> {
  const text = await r.text();
  return JSON.parse(text) as Record<string, unknown>;
}

// ── Tests ─────────────────────────────────────────────────────────────────────

const tests: Array<() => Promise<void>> = [];

function it(name: string, fn: () => Promise<void>): void {
  tests.push(async () => {
    try {
      await fn();
      console.log(`  ✓  ${name}`);
      passed++;
    } catch (err) {
      const msg = err instanceof assert.AssertionError ? err.message : String(err);
      console.error(`  ✗  ${name}\n     ${msg}`);
      failed++;
    }
  });
}

// ── Section 1: Valid retail order ────────────────────────────────────────────
console.log("\n  SITE-RELIABILITY-P2E — Handler Integration Tests\n");
console.log("  ─── Section 1: Valid retail order ───\n");

it("Retail order: 1 × 5ml → 200, response has success:true and orderRef", async () => {
  const { db } = makeMockDb();
  const body = makeOrderBody("Cape Town Metro", [{ quantity: 1, size: "5ml" }]);
  const res  = await handleOrder(body, db);
  assert.equal(res.status, 200);
  const json = await parseResponse(res);
  assert.equal(json.success, true);
  assert.ok(typeof json.orderRef === "string" && (json.orderRef as string).startsWith("MSR-"), `orderRef: ${json.orderRef}`);
});

it("Retail order: insert row carries server-computed subtotal/delivery/total", async () => {
  const mock = makeMockDb();
  const body = makeOrderBody("Cape Town Metro", [{ quantity: 1, size: "5ml" }]);
  await handleOrder(body, mock.db);
  const row = mock.getCapture();
  assert.ok(row, "DB insert was not called");
  assert.equal(row!.subtotal,  60,  `subtotal: ${row!.subtotal}`);
  assert.equal(row!.delivery,  100, `delivery: ${row!.delivery}`);
  assert.equal(row!.total,     160, `total: ${row!.total}`);
});

it("Retail order: insert row items use retail price (not tampered client price)", async () => {
  const mock = makeMockDb();
  // Client submits price:1 per item but server must use catalogue price R60.
  const body = makeOrderBody("Cape Town Metro", [{ quantity: 1, size: "5ml", price: 1 }]);
  // Adjust to have correct subtotal so validation passes — only item.price is misleading.
  await handleOrder(body, mock.db);
  const row = mock.getCapture();
  assert.ok(row, "DB insert was not called");
  const items = row!.items as Array<Record<string, unknown>>;
  assert.equal(items[0].price, 60, `Persisted item price should be catalogue R60, got ${items[0].price}`);
});

// ── Section 2: Valid wholesale order ─────────────────────────────────────────
console.log("  ─── Section 2: Valid wholesale order ───\n");

it("Wholesale order: 10 × 5ml → 200, items.price = wholesale R48 (not retail R60)", async () => {
  const mock = makeMockDb();
  const body = makeOrderBody("Gauteng", Array(10).fill({ quantity: 1, size: "5ml" }));
  const res  = await handleOrder(body, mock.db);
  assert.equal(res.status, 200);
  const row = mock.getCapture();
  assert.ok(row, "DB insert was not called");
  const items = row!.items as Array<Record<string, unknown>>;
  assert.ok(items.length === 10, `Expected 10 items, got ${items.length}`);
  for (const item of items) {
    assert.equal(item.price, 48, `Wholesale 5ml should be R48, got ${item.price}`);
  }
});

it("Wholesale order: insert row subtotal = wholesale prices, not retail", async () => {
  const mock = makeMockDb();
  const body = makeOrderBody("Gauteng", Array(10).fill({ quantity: 1, size: "5ml" }));
  await handleOrder(body, mock.db);
  const row = mock.getCapture();
  assert.ok(row, "DB insert was not called");
  // 10 × R48 = R480 wholesale, not 10 × R60 = R600 retail
  assert.equal(row!.subtotal, 480, `Wholesale subtotal should be R480, got ${row!.subtotal}`);
  assert.equal(row!.delivery, 180);
  assert.equal(row!.total,    660);
});

it("Wholesale order: insert items have correct quantity and size", async () => {
  const mock = makeMockDb();
  const body = makeOrderBody("Gauteng", [
    { quantity: 3, size: "5ml" },
    { quantity: 3, size: "5ml" },
    { quantity: 4, size: "5ml" },
  ]);
  await handleOrder(body, mock.db);
  const row = mock.getCapture();
  assert.ok(row, "DB insert was not called");
  const items = row!.items as Array<Record<string, unknown>>;
  const totalQty = items.reduce((n, i) => n + (i.quantity as number), 0);
  assert.equal(totalQty, 10, `Expected total quantity 10, got ${totalQty}`);
  for (const item of items) {
    assert.equal(item.size, "5ml");
    assert.equal(item.price, 48);
  }
});

// ── Section 3: Invalid requests rejected before DB write ─────────────────────
console.log("  ─── Section 3: Invalid requests — no DB write ───\n");

it("Invalid province → 400, DB not called", async () => {
  const mock = makeMockDb();
  const body = makeOrderBody("Cape Town Metro", [{ quantity: 1, size: "5ml" }], { province: "Faketown" });
  const res  = await handleOrder(body, mock.db);
  assert.equal(res.status, 400);
  assert.equal(mock.getCalls(), 0, "DB should not be called for invalid province");
  const json = await parseResponse(res);
  assert.equal(json.success, false);
  assert.ok(typeof json.message === "string");
});

it("Unknown product id → 400, DB not called", async () => {
  const mock = makeMockDb();
  const body = makeOrderBody("Cape Town Metro", [{ quantity: 1, size: "5ml", id: "no-such-fragrance" }]);
  (body.items as Record<string, unknown>[])[0].id = "no-such-fragrance";
  const res  = await handleOrder(body, mock.db);
  assert.equal(res.status, 400);
  assert.equal(mock.getCalls(), 0, "DB should not be called for unknown product");
});

it("Tampered subtotal → 400, DB not called", async () => {
  const mock = makeMockDb();
  const body = makeOrderBody("Cape Town Metro", [{ quantity: 1, size: "5ml" }]);
  (body as Record<string, unknown>).subtotal = 1; // tampered
  (body as Record<string, unknown>).total    = 101;
  const res  = await handleOrder(body, mock.db);
  assert.equal(res.status, 400);
  assert.equal(mock.getCalls(), 0, "DB should not be called for tampered price");
});

it("Tampered delivery=0 for chargeable order → 400, DB not called", async () => {
  const mock = makeMockDb();
  const body = makeOrderBody("Cape Town Metro", [{ quantity: 1, size: "5ml" }]);
  (body as Record<string, unknown>).delivery = 0; // tampered
  (body as Record<string, unknown>).total    = 60;
  const res  = await handleOrder(body, mock.db);
  assert.equal(res.status, 400);
  assert.equal(mock.getCalls(), 0);
});

it("Empty cart → 400, DB not called", async () => {
  const mock = makeMockDb();
  const body = makeOrderBody("Cape Town Metro", [{ quantity: 1, size: "5ml" }], { items: [] });
  const res  = await handleOrder(body, mock.db);
  assert.equal(res.status, 400);
  assert.equal(mock.getCalls(), 0);
});

// ── Section 4: DB failure ─────────────────────────────────────────────────────
console.log("  ─── Section 4: DB failure ───\n");

it("DB write failure → 500 with safe user-facing message", async () => {
  const mock = makeMockDb({ fail: true });
  const body = makeOrderBody("Cape Town Metro", [{ quantity: 1, size: "5ml" }]);
  const res  = await handleOrder(body, mock.db);
  assert.equal(res.status, 500);
  const json = await parseResponse(res);
  assert.equal(json.success, false);
  assert.ok(typeof json.message === "string");
  // Must not leak DB error details to client
  assert.ok(!(json.message as string).toLowerCase().includes("db write"), `Message leaked: ${json.message}`);
});

it("DB failure: insert was still called once (the attempt happened)", async () => {
  const mock = makeMockDb({ fail: true });
  const body = makeOrderBody("Gauteng", [{ quantity: 1, size: "10ml" }]);
  await handleOrder(body, mock.db);
  assert.equal(mock.getCalls(), 1, "insert should have been attempted once even on failure");
});

// ── Section 5: Collection order ───────────────────────────────────────────────
console.log("  ─── Section 5: Collection order ───\n");

it("Collection order: delivery=0, address stored as empty string", async () => {
  const mock = makeMockDb();
  const body = makeOrderBody(COLLECTION_PROVINCE, [{ quantity: 1, size: "5ml" }]);
  const res  = await handleOrder(body, mock.db);
  assert.equal(res.status, 200);
  const row = mock.getCapture();
  assert.ok(row, "DB insert was not called");
  assert.equal(row!.delivery, 0,  `delivery: ${row!.delivery}`);
  assert.equal(row!.address,  "", `address: "${row!.address}"`);
});

// ── Section 6: Insert row fields ──────────────────────────────────────────────
console.log("  ─── Section 6: Insert row shape ───\n");

it("Insert row includes order_ref, customer_name, phone, province, payment_status", async () => {
  const mock = makeMockDb();
  const body = makeOrderBody("Gauteng", [{ quantity: 1, size: "10ml" }]);
  await handleOrder(body, mock.db);
  const row = mock.getCapture()!;
  assert.ok(typeof row.order_ref === "string" && (row.order_ref as string).startsWith("MSR-"));
  assert.equal(row.customer_name,   "Test Customer");
  assert.equal(row.phone,           "0821234567");
  assert.equal(row.province,        "Gauteng");
  assert.equal(row.payment_status,  "awaiting_payment");
  assert.equal(row.vat,             0);
});

it("Insert row items carry id, title, size, quantity fields alongside normalized price", async () => {
  const mock = makeMockDb();
  const body = makeOrderBody("Cape Town Metro", [{ quantity: 2, size: "10ml" }]);
  await handleOrder(body, mock.db);
  const row   = mock.getCapture()!;
  const items = row.items as Array<Record<string, unknown>>;
  assert.equal(items.length, 1);
  assert.equal(items[0].id,       TEST_SLUG);
  assert.equal(items[0].title,    TEST_TITLE);
  assert.equal(items[0].size,     "10ml");
  assert.equal(items[0].quantity, 2);
  assert.equal(items[0].price,    100);  // retail R100 for 10ml
});

it("Insert row subtotal for free-delivery order = server subtotal (>R2000)", async () => {
  // 9 × 30ml @ R250 = R2250 > R2000 → free delivery
  const mock = makeMockDb();
  const body = makeOrderBody("Cape Town Metro", Array(9).fill({ quantity: 1, size: "30ml" }));
  await handleOrder(body, mock.db);
  const row = mock.getCapture()!;
  assert.equal(row.subtotal, 2250);
  assert.equal(row.delivery, 0);
  assert.equal(row.total,    2250);
});

// ── Run all tests ─────────────────────────────────────────────────────────────

(async () => {
  for (const t of tests) await t();

  console.log("\n" + "─".repeat(60));
  console.log(`  Results: ${passed} passed, ${failed} failed`);
  if (failed === 0) {
    console.log("\n  PASS — all P2E handler integration checks passed.\n");
  } else {
    console.log("\n  FAIL — P2E handler integration violations detected.\n");
    process.exit(1);
  }
})();
