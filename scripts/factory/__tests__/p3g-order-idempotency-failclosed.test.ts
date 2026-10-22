// Must be set before any call that reaches getReceiptSecret().
process.env.ORDER_RECEIPT_SECRET = "test-p3g-secret";

/**
 * L-RESUME-P3G - Order idempotency fail-closed paths (G1/G2)
 *
 * Drives the real handleOrder() with an injected in-memory OrderDb and checks
 * the keyed-request branches that must fail closed:
 *   - 409 when an existing order's intent cannot be verified or differs
 *     (pre-insert check, and after a concurrent idempotency_key conflict);
 *   - 503 when the idempotency lookup is unavailable, errors or throws
 *     (pre-insert check, and the race-recovery lookup).
 * Each failure case asserts the exact status and message, no receipt cookie,
 * no order reference or recovery flag, no disclosure of the committed order,
 * no extra insert, and an unchanged committed order. Positive controls prove
 * the same harness accepts new orders and genuine idempotent retries.
 *
 * Deterministic data, in-memory database: no Supabase, no network, no server.
 *
 * Run: npx tsx scripts/factory/__tests__/p3g-order-idempotency-failclosed.test.ts
 */

import assert from "node:assert/strict";
import { handleOrder, type OrderDb } from "../../../app/api/orders/route";
import { extractFingerprintInputs, computePayloadFingerprint } from "../../../app/lib/commerce/idempotency";
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

const KEY           = "7c1e2d3f-4a5b-4c6d-8e7f-9a0b1c2d3e4f"; // valid UUID v4, lower case
const COMMITTED_REF = "MSR-20261021-11111";                    // synthetic, never a real order
const RACE_REF      = "MSR-20261021-22222";                    // synthetic, never a real order

const MSG_UNAVAILABLE = "Service unavailable.";
const MSG_UNVERIFIED  = "An order with this reference may already exist. Please contact us to confirm before placing a new order.";
const MSG_DIFFERENT   = "An earlier order may already exist with different items or delivery details. " +
                        "Please contact us to confirm before placing a separate order.";
const MSG_SAVE_FAILED = "We could not save your order. Please try again.";

// Valid retail body: 1 x 5ml @ R60, Cape Town Metro (R100 delivery).
function makeBody(quantity = 1): Record<string, unknown> {
  const subtotal = 60 * quantity;
  const delivery = subtotal > 2000 ? 0 : 100;
  return {
    customer_name:        "Synthetic Customer",
    phone:                "0820000010",
    address:              "10 Synthetic Street, Cape Town",
    province:             "Cape Town Metro",
    items:                [{ id: TEST_SLUG, title: PRODUCT!.name, price: 60, quantity, size: "5ml" }],
    subtotal,
    delivery,
    total:                subtotal + delivery,
    checkout_attempt_key: KEY,
  };
}

// Fingerprint exactly as the production handler computes it.
function fingerprintOf(body: Record<string, unknown>): string {
  const inputs = extractFingerprintInputs(body);
  if (!inputs) throw new Error("fixture body has no fingerprint inputs");
  return computePayloadFingerprint(inputs);
}

type Row = Record<string, unknown>;
type Lookup = { data: { order_ref: string; payload_fingerprint: string | null } | null; error: unknown };

function committedRow(fingerprint: string | null): Row {
  return { order_ref: COMMITTED_REF, idempotency_key: KEY, payload_fingerprint: fingerprint, total: 160 };
}

// In-memory OrderDb (production adapter shape) with call tracking.
function memoryDb(seed: Row[] = []) {
  const t = { lookups: 0, inserts: 0, rows: [...seed] };
  const db: OrderDb = {
    insertOrder: async (row) => { t.inserts++; t.rows.push(row); return { error: null }; },
    findByIdempotencyKey: async (key): Promise<Lookup> => {
      t.lookups++;
      const r = t.rows.find((x) => x.idempotency_key === key);
      return {
        data: r ? { order_ref: r.order_ref as string, payload_fingerprint: (r.payload_fingerprint as string | null) ?? null } : null,
        error: null,
      };
    },
  };
  return { db, t };
}

// Concurrent-commit simulation: the pre-insert lookup sees no order, the insert
// then hits the idempotency_key unique constraint (another request committed
// first), and the race-recovery lookup answers with `second`. The losing insert
// is never persisted.
const IDEMPOTENCY_CONFLICT = {
  code:    "23505",
  details: `Key (idempotency_key)=(${KEY}) already exists.`,
  message: 'duplicate key value violates unique constraint "orders_idempotency_key_key"',
};

function raceDb(second: () => Promise<Lookup>, insertError: unknown = IDEMPOTENCY_CONFLICT) {
  const t = { lookups: 0, inserts: 0, rows: [] as Row[] };
  const db: OrderDb = {
    insertOrder: async () => { t.inserts++; return { error: insertError }; },
    findByIdempotencyKey: async (): Promise<Lookup> => {
      t.lookups++;
      return t.lookups === 1 ? { data: null, error: null } : second();
    },
  };
  return { db, t };
}

// A fail-closed response: exact status and message, nothing that would let the
// client treat the request as a placed or recovered order.
async function expectFailClosed(res: Response, status: number, message: string): Promise<void> {
  assert.equal(res.status, status, "status");
  assert.equal(res.headers.get("set-cookie") ?? "", "", "no receipt cookie");
  const text = await res.text();
  const body = JSON.parse(text) as Record<string, unknown>;
  assert.equal(body.success, false, "success flag");
  assert.equal(body.message, message, "message");
  assert.equal(body.orderRef, undefined, "no order reference");
  assert.equal(body.recovered, undefined, "no recovery flag");
  for (const ref of [COMMITTED_REF, RACE_REF]) assert.ok(!text.includes(ref), `does not disclose ${ref}`);
  assert.ok(!text.includes("msr_receipt_"), "no receipt token");
}

async function json(res: Response): Promise<Record<string, unknown>> {
  return JSON.parse(await res.text()) as Record<string, unknown>;
}

// -- 409: pre-insert check (route.ts :186-212) --------------------------------

test("C409-A existing key, stored fingerprint missing -> 409 unverified, no insert (:194)", async () => {
  const { db, t } = memoryDb([committedRow(null)]);
  const before = JSON.stringify(t.rows);
  await expectFailClosed(await handleOrder(makeBody(), db), 409, MSG_UNVERIFIED);
  assert.equal(t.lookups, 1);
  assert.equal(t.inserts, 0);
  assert.equal(JSON.stringify(t.rows), before, "committed order unchanged");
});

test("C409-B existing key, request fingerprint inputs unverifiable -> 409 unverified, no insert (:194)", async () => {
  const { db, t } = memoryDb([committedRow(fingerprintOf(makeBody()))]);
  const before = JSON.stringify(t.rows);
  const unverifiable = { ...makeBody(), items: [] }; // extractFingerprintInputs -> null
  await expectFailClosed(await handleOrder(unverifiable, db), 409, MSG_UNVERIFIED);
  assert.equal(t.lookups, 1);
  assert.equal(t.inserts, 0);
  assert.equal(JSON.stringify(t.rows), before, "committed order unchanged");
});

test("C409-C existing key, different payload fingerprint -> 409 different, no insert (:210)", async () => {
  const { db, t } = memoryDb([committedRow(fingerprintOf(makeBody(2)))]);
  const before = JSON.stringify(t.rows);
  await expectFailClosed(await handleOrder(makeBody(1), db), 409, MSG_DIFFERENT);
  assert.equal(t.lookups, 1);
  assert.equal(t.inserts, 0);
  assert.equal(JSON.stringify(t.rows), before, "committed order unchanged");
});

// -- 409: after an insert conflict (route.ts :324-347) -------------------------

test("C409-D insert-conflict race, committed row has different fingerprint -> 409 different (:345)", async () => {
  const { db, t } = raceDb(async () => ({ data: { order_ref: RACE_REF, payload_fingerprint: fingerprintOf(makeBody(2)) }, error: null }));
  await expectFailClosed(await handleOrder(makeBody(1), db), 409, MSG_DIFFERENT);
  assert.equal(t.inserts, 1, "only the conflicting insert attempt");
  assert.equal(t.lookups, 2, "pre-insert + race recovery lookups");
  assert.equal(t.rows.length, 0, "no duplicate persisted");
});

test("C409-E insert-conflict race, committed row has no fingerprint -> 409 unverified (:334)", async () => {
  const { db, t } = raceDb(async () => ({ data: { order_ref: RACE_REF, payload_fingerprint: null }, error: null }));
  await expectFailClosed(await handleOrder(makeBody(), db), 409, MSG_UNVERIFIED);
  assert.equal(t.inserts, 1, "only the conflicting insert attempt");
  assert.equal(t.lookups, 2);
  assert.equal(t.rows.length, 0, "no duplicate persisted");
});

// -- 503: pre-insert check (route.ts :149-178), before any insert ---------------

test("C503-A keyed request, findByIdempotencyKey unavailable -> 503, no insert (:154)", async () => {
  let inserts = 0;
  const db: OrderDb = { insertOrder: async () => { inserts++; return { error: null }; } };
  await expectFailClosed(await handleOrder(makeBody(), db), 503, MSG_UNAVAILABLE);
  assert.equal(inserts, 0);
});

test("C503-B pre-insert lookup returns an error -> 503, no insert (:176)", async () => {
  let inserts = 0, lookups = 0;
  const db: OrderDb = {
    insertOrder: async () => { inserts++; return { error: null }; },
    findByIdempotencyKey: async () => { lookups++; return { data: null, error: { code: "PGRST000", message: "synthetic lookup error" } }; },
  };
  await expectFailClosed(await handleOrder(makeBody(), db), 503, MSG_UNAVAILABLE);
  assert.equal(lookups, 1);
  assert.equal(inserts, 0);
});

test("C503-C pre-insert lookup throws -> 503, no insert (:168)", async () => {
  let inserts = 0, lookups = 0;
  const db: OrderDb = {
    insertOrder: async () => { inserts++; return { error: null }; },
    findByIdempotencyKey: async () => { lookups++; throw new Error("synthetic lookup failure"); },
  };
  await expectFailClosed(await handleOrder(makeBody(), db), 503, MSG_UNAVAILABLE);
  assert.equal(lookups, 1);
  assert.equal(inserts, 0);
});

// -- 503: race-recovery lookup after an insert conflict (route.ts :294-322) -----

test("C503-D race-recovery lookup returns an error -> 503 (:320)", async () => {
  const { db, t } = raceDb(async () => ({ data: null, error: { code: "PGRST000", message: "synthetic race lookup error" } }));
  await expectFailClosed(await handleOrder(makeBody(), db), 503, MSG_UNAVAILABLE);
  assert.equal(t.inserts, 1, "only the conflicting insert attempt");
  assert.equal(t.lookups, 2);
  assert.equal(t.rows.length, 0, "no duplicate persisted");
});

test("C503-E race-recovery lookup throws -> 503 (:312)", async () => {
  const { db, t } = raceDb(async () => { throw new Error("synthetic race lookup failure"); });
  await expectFailClosed(await handleOrder(makeBody(), db), 503, MSG_UNAVAILABLE);
  assert.equal(t.inserts, 1, "only the conflicting insert attempt");
  assert.equal(t.lookups, 2);
  assert.equal(t.rows.length, 0, "no duplicate persisted");
});

test("C503-F1 race-recovery lookup finds no committed row -> 503 (:320)", async () => {
  const { db, t } = raceDb(async () => ({ data: null, error: null }));
  await expectFailClosed(await handleOrder(makeBody(), db), 503, MSG_UNAVAILABLE);
  assert.equal(t.inserts, 1, "only the conflicting insert attempt");
  assert.equal(t.lookups, 2);
  assert.equal(t.rows.length, 0, "no duplicate persisted");
});

test("C503-F2 [DEFENSIVE] lookup capability lost before race recovery -> 503 (:298)", async () => {
  // Not reachable with a stable adapter (the pre-insert check at :150 runs first);
  // simulated by an adapter that drops the method while inserting.
  let inserts = 0, lookups = 0;
  const db: OrderDb = {
    insertOrder: async () => { inserts++; delete db.findByIdempotencyKey; return { error: IDEMPOTENCY_CONFLICT }; },
    findByIdempotencyKey: async () => { lookups++; return { data: null, error: null }; },
  };
  await expectFailClosed(await handleOrder(makeBody(), db), 503, MSG_UNAVAILABLE);
  assert.equal(inserts, 1);
  assert.equal(lookups, 1, "pre-insert lookup only");
});

// -- Boundary: unrelated unique violation is not treated as an idempotency race -

test("B1 keyed insert hits a non-idempotency 23505 -> 500 save failure, no race recovery (:354-359)", async () => {
  const orderRefConflict = { code: "23505", details: "Key (order_ref)=(MSR-x) already exists.", message: 'duplicate key value violates unique constraint "orders_order_ref_key"' };
  const { db, t } = raceDb(async () => ({ data: { order_ref: RACE_REF, payload_fingerprint: fingerprintOf(makeBody()) }, error: null }), orderRefConflict);
  await expectFailClosed(await handleOrder(makeBody(), db), 500, MSG_SAVE_FAILED);
  assert.equal(t.inserts, 1);
  assert.equal(t.lookups, 1, "no race-recovery lookup");
});

// -- Positive controls ---------------------------------------------------------

test("P1 new keyed order succeeds and stores canonical data with its fingerprint", async () => {
  const { db, t } = memoryDb();
  const body = makeBody();
  const res = await handleOrder(body, db);
  assert.equal(res.status, 200);
  const out = await json(res);
  assert.equal(out.success, true);
  assert.match(String(out.orderRef), /^MSR-\d{8}-\d{5}$/);
  assert.ok((res.headers.get("set-cookie") ?? "").includes(`msr_receipt_${out.orderRef}=`), "receipt cookie set");
  assert.equal(t.lookups, 1);
  assert.equal(t.inserts, 1);
  const row = t.rows[0];
  assert.equal(row.order_ref, out.orderRef);
  assert.equal(row.idempotency_key, KEY);
  assert.equal(row.payload_fingerprint, fingerprintOf(body));
  const item = (row.items as Array<Record<string, unknown>>)[0];
  assert.equal(item.id, TEST_SLUG);
  assert.equal(item.title, PRODUCT.name);
  assert.equal(item.price, 60);
  assert.deepEqual([row.subtotal, row.delivery, row.total], [60, 100, 160]);
});

test("P2 matching retry with the same key recovers the original order without a new insert", async () => {
  const { db, t } = memoryDb();
  const first = await json(await handleOrder(makeBody(), db));
  const res = await handleOrder(makeBody(), db);
  assert.equal(res.status, 200);
  const retry = await json(res);
  assert.equal(retry.success, true);
  assert.equal(retry.recovered, true);
  assert.equal(retry.orderRef, first.orderRef);
  assert.equal(t.inserts, 1, "no duplicate insert");
  assert.equal(t.rows.length, 1);
});

test("P3 insert-conflict race with matching fingerprint recovers the committed order (:349)", async () => {
  const { db, t } = raceDb(async () => ({ data: { order_ref: RACE_REF, payload_fingerprint: fingerprintOf(makeBody()) }, error: null }));
  const res = await handleOrder(makeBody(), db);
  assert.equal(res.status, 200);
  const out = await json(res);
  assert.equal(out.success, true);
  assert.equal(out.recovered, true);
  assert.equal(out.orderRef, RACE_REF);
  assert.ok((res.headers.get("set-cookie") ?? "").includes(`msr_receipt_${RACE_REF}=`), "receipt for the committed order");
  assert.equal(t.inserts, 1, "only the conflicting insert attempt");
  assert.equal(t.rows.length, 0, "no duplicate persisted");
});

Promise.all(pending).then(() => {
  console.log(`\n${passed + failed} checks  |  ${passed} passed  |  ${failed} failed`);
  process.exit(failed ? 1 : 0);
});
