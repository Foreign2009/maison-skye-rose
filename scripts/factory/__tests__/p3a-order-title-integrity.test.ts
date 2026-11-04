// Must be set before any call that reaches getReceiptSecret().
process.env.ORDER_RECEIPT_SECRET = "test-p3a-secret";

/**
 * L-RESUME-P3A - Order item title integrity
 *
 * Stored order-item titles come from the authoritative catalogue name
 * (product.name), never from the client-supplied title. The client title is
 * still shape-checked for request compatibility. Pricing, wholesale, delivery
 * and idempotent recovery are unchanged.
 *
 * Deterministic data, mocked database: no Supabase, no network.
 *
 * Run: npx tsx scripts/factory/__tests__/p3a-order-title-integrity.test.ts
 */

import assert from "node:assert/strict";
import { handleOrder, type OrderDb } from "../../../app/api/orders/route";
import { validateOrderBody } from "../../../app/lib/commerce/orderValidation";
import { COLLECTION_PROVINCE, FREE_DELIVERY_THRESHOLD } from "../../../app/lib/commerce/delivery";
import { WHOLESALE_THRESHOLD } from "../../../app/lib/commerce/wholesale";
import { mkcCatalogue } from "../../../app/lib/mkc/catalogue";

// -- Harness -------------------------------------------------------------------

let passed = 0;
let failed = 0;
const pending: Promise<void>[] = [];

function test(name: string, fn: () => void | Promise<void>): void {
  pending.push((async () => {
    try {
      await fn();
      console.log(`  PASS  ${name}`);
      passed++;
    } catch (err) {
      const msg = err instanceof assert.AssertionError ? err.message : String(err);
      console.error(`  FAIL  ${name}\n        ${msg}`);
      failed++;
    }
  })());
}

// -- Fixtures ------------------------------------------------------------------

const TEST_SLUG = "aventus-inspired";
const PRODUCT   = mkcCatalogue.find((k) => k.slug === TEST_SLUG);
if (!PRODUCT) throw new Error(`fixture product ${TEST_SLUG} missing from catalogue`);
const CANONICAL_NAME = PRODUCT.name;

const RETAIL:    Record<string, number> = { "5ml": 60, "10ml": 100, "30ml": 250 };
const WHOLESALE: Record<string, number> = { "5ml": 48, "10ml": 77,  "30ml": 180 };
const RATES:     Record<string, number> = {
  "Cape Town Metro": 100, "Western Cape Regional": 150, "Gauteng": 180,
  "KwaZulu-Natal": 180, "Other Major Cities": 200, "Outlying Areas": 300,
};

const FORGED_TITLE  = "FREE BOTTLE - forged client title";
const RETRY_KEY     = "3f2b8c4e-9a1d-4e7f-8b2c-1d4e5f6a7b8c"; // valid UUID v4

type Line = { quantity: number; size: string; id?: string; title?: string | null };

// Builds a body whose submitted totals match the expected (unchanged) rules.
function makeBody(province: string, lines: Line[], extra: Record<string, unknown> = {}): Record<string, unknown> {
  const count    = lines.reduce((n, l) => n + l.quantity, 0);
  const table    = count >= 10 ? WHOLESALE : RETAIL;
  const subtotal = lines.reduce((s, l) => s + table[l.size] * l.quantity, 0);
  const delivery = province === COLLECTION_PROVINCE ? 0 : subtotal > 2000 ? 0 : RATES[province];
  return {
    customer_name: "Test Customer",
    phone:         "0821234567",
    address:       province === COLLECTION_PROVINCE ? undefined : "123 Main Street",
    province,
    items: lines.map((l) => {
      const item: Record<string, unknown> = {
        id: l.id ?? TEST_SLUG, price: RETAIL[l.size], quantity: l.quantity, size: l.size,
      };
      if (l.title !== null) item.title = l.title ?? CANONICAL_NAME;
      return item;
    }),
    subtotal,
    delivery,
    total: subtotal + delivery,
    ...extra,
  };
}

// In-memory OrderDb with idempotency lookup, mirroring the production adapter shape.
function makeMemoryDb(): { db: OrderDb; rows: Record<string, unknown>[] } {
  const rows: Record<string, unknown>[] = [];
  const db: OrderDb = {
    insertOrder: async (row) => { rows.push(row); return { error: null }; },
    findByIdempotencyKey: async (key) => {
      const r = rows.find((x) => x.idempotency_key === key);
      return {
        data: r ? { order_ref: r.order_ref as string, payload_fingerprint: (r.payload_fingerprint as string | null) ?? null } : null,
        error: null,
      };
    },
  };
  return { db, rows };
}

async function json(r: Response): Promise<Record<string, unknown>> {
  return JSON.parse(await r.text()) as Record<string, unknown>;
}

// -- Rule constants unchanged --------------------------------------------------

test("T0 rule constants unchanged (threshold 10, free delivery strictly over 2000)", () => {
  assert.equal(WHOLESALE_THRESHOLD, 10);
  assert.equal(FREE_DELIVERY_THRESHOLD, 2000);
  assert.deepEqual(PRODUCT.prices, { "5ml": 60, "10ml": 100, "30ml": 250 });
});

// -- validateOrderBody ---------------------------------------------------------

test("T1 forged client title is replaced by the catalogue name; price unchanged", () => {
  const v = validateOrderBody(makeBody("Cape Town Metro", [{ quantity: 1, size: "5ml", title: FORGED_TITLE }]));
  assert.equal(v.ok, true);
  if (!v.ok) return;
  assert.equal(v.items[0].title, CANONICAL_NAME);
  assert.notEqual(v.items[0].title, FORGED_TITLE);
  assert.equal(v.items[0].price, 60);
  assert.equal(v.subtotal, 60);
  assert.equal(v.delivery, 100);
  assert.equal(v.total, 160);
});

test("T2 normal client title yields the same stored catalogue name and totals", () => {
  const v = validateOrderBody(makeBody("Cape Town Metro", [{ quantity: 2, size: "5ml" }]));
  assert.equal(v.ok, true);
  if (!v.ok) return;
  assert.equal(v.items[0].title, CANONICAL_NAME);
  assert.equal(v.subtotal, 120);
  assert.equal(v.delivery, 100);
  assert.equal(v.total, 220);
});

test("T3 unknown product slug is rejected", () => {
  const v = validateOrderBody(makeBody("Cape Town Metro", [{ quantity: 1, size: "5ml", id: "no-such-product-inspired" }]));
  assert.equal(v.ok, false);
  if (v.ok) return;
  assert.match(v.error, /^Product not found/);
});

test("T4 empty or missing client title keeps the existing rejection", () => {
  for (const title of ["", null]) {
    const v = validateOrderBody(makeBody("Cape Town Metro", [{ quantity: 1, size: "5ml", title }]));
    assert.equal(v.ok, false, `title=${JSON.stringify(title)}`);
    if (v.ok) return;
    assert.equal(v.error, "Invalid cart item.");
  }
});

// -- handleOrder with mocked database ------------------------------------------

test("T5 order handler stores the canonical name and server totals", async () => {
  const { db, rows } = makeMemoryDb();
  const r = await handleOrder(makeBody("Gauteng", [{ quantity: 3, size: "10ml", title: FORGED_TITLE }]), db);
  assert.equal(r.status, 200);
  assert.equal((await json(r)).success, true);
  assert.equal(rows.length, 1);
  const items = rows[0].items as Array<Record<string, unknown>>;
  assert.equal(items[0].title, CANONICAL_NAME);
  assert.equal(items[0].price, 100);
  assert.equal(rows[0].subtotal, 300);
  assert.equal(rows[0].delivery, 180);
  assert.equal(rows[0].total, 480);
});

test("T6 collection is free; courier charged at exactly 2000, free above 2000", () => {
  const col = validateOrderBody(makeBody(COLLECTION_PROVINCE, [{ quantity: 1, size: "5ml" }]));
  assert.equal(col.ok, true);
  if (col.ok) { assert.equal(col.delivery, 0); assert.equal(col.total, 60); }

  const at2000 = validateOrderBody(makeBody("Cape Town Metro", [{ quantity: 8, size: "30ml" }]));
  assert.equal(at2000.ok, true);
  if (at2000.ok) { assert.equal(at2000.subtotal, 2000); assert.equal(at2000.delivery, 100); assert.equal(at2000.total, 2100); }

  const over = validateOrderBody(makeBody("Cape Town Metro", [{ quantity: 9, size: "30ml" }]));
  assert.equal(over.ok, true);
  if (over.ok) { assert.equal(over.subtotal, 2250); assert.equal(over.delivery, 0); }
});

test("T7 wholesale activates at 10 units with unchanged prices", () => {
  const nine = validateOrderBody(makeBody("Cape Town Metro", [{ quantity: 9, size: "5ml" }]));
  assert.equal(nine.ok, true);
  if (nine.ok) { assert.equal(nine.items[0].price, 60); assert.equal(nine.subtotal, 540); }

  const ten = validateOrderBody(makeBody("Cape Town Metro", [{ quantity: 10, size: "5ml" }]));
  assert.equal(ten.ok, true);
  if (ten.ok) { assert.equal(ten.items[0].price, 48); assert.equal(ten.subtotal, 480); assert.equal(ten.items[0].title, CANONICAL_NAME); }

  const mixed = validateOrderBody(makeBody("Cape Town Metro", [{ quantity: 5, size: "5ml" }, { quantity: 5, size: "10ml" }]));
  assert.equal(mixed.ok, true);
  if (mixed.ok) { assert.equal(mixed.subtotal, 5 * 48 + 5 * 77); }
});

// -- Idempotent recovery -------------------------------------------------------

test("T8 same key, same body: idempotent recovery unchanged", async () => {
  const { db, rows } = makeMemoryDb();
  const body = makeBody("Cape Town Metro", [{ quantity: 1, size: "5ml" }], { checkout_attempt_key: RETRY_KEY });
  const first = await json(await handleOrder(body, db));
  assert.equal(first.success, true);
  const second = await json(await handleOrder(body, db));
  assert.equal(second.success, true);
  assert.equal(second.recovered, true);
  assert.equal(second.orderRef, first.orderRef);
  assert.equal(rows.length, 1);
});

test("T9 same key, different client title: recovers the original order (title not fingerprinted)", async () => {
  const { db, rows } = makeMemoryDb();
  const first = await json(await handleOrder(
    makeBody("Cape Town Metro", [{ quantity: 1, size: "5ml" }], { checkout_attempt_key: RETRY_KEY }), db));
  assert.equal(first.success, true);
  const retry = await json(await handleOrder(
    makeBody("Cape Town Metro", [{ quantity: 1, size: "5ml", title: FORGED_TITLE }], { checkout_attempt_key: RETRY_KEY }), db));
  assert.equal(retry.success, true);
  assert.equal(retry.recovered, true);
  assert.equal(retry.orderRef, first.orderRef);
  assert.equal(rows.length, 1);
  assert.equal((rows[0].items as Array<Record<string, unknown>>)[0].title, CANONICAL_NAME);
});

Promise.all(pending).then(() => {
  console.log(`\n${passed + failed} checks  |  ${passed} passed  |  ${failed} failed`);
  process.exit(failed ? 1 : 0);
});
