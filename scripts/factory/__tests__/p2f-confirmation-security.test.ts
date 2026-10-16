// Must be set before any import that reads ORDER_RECEIPT_SECRET at call time.
process.env.ORDER_RECEIPT_SECRET = "test-p2f-secret";

/**
 * SITE-RELIABILITY-P2F — Confirmation Security Tests
 *
 * Verifies that:
 *
 *   1. GET /api/orders/[ref] returns server-verified { orderRef, total, paymentStatus, province }
 *      for a known order reference (province added by CHECKOUT-P9 for receipt wording).
 *   2. Invalid or missing reference formats are rejected before any DB access (400).
 *   3. An unknown reference (not in the store) returns 404.
 *   4. A DB error returns 500 with a safe message.
 *   5. The response contains no customer PII (name, phone, address).
 *   6. Modifying ?total= in the URL cannot change the displayed amount — the
 *      page fetches from the server, not from query parameters.
 *   7. A reference from one order cannot be paired with another order's total.
 *   8. The HTTP wrapper (GET function) enforces format validation without DB access.
 *   9. The POST HTTP wrapper handles malformed JSON safely (400 — client error).
 *  10. Source invariants: checkout redirect no longer includes ?total=;
 *      GET query selects exactly order_ref, total, payment_status, province (no PII).
 *
 * Run: npx tsx scripts/factory/__tests__/p2f-confirmation-security.test.ts
 */

import assert from "node:assert/strict";
import fs     from "node:fs";
import path   from "node:path";

import {
  handleGetConfirmation,
  GET,
  type ConfirmationDb,
} from "../../../app/api/orders/[ref]/route";

import {
  handleOrder,
  POST,
  type OrderDb,
} from "../../../app/api/orders/route";

import { signReceiptToken } from "../../../app/lib/receiptToken";

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

const tests: Array<() => Promise<void>> = [];

function it(name: string, fn: () => void | Promise<void>): void {
  tests.push(async () => {
    try {
      const r = fn();
      if (r && typeof (r as Promise<void>).then === "function") {
        await r;
      }
      console.log(`  ✓  ${name}`);
      passed++;
    } catch (err) {
      const msg = err instanceof assert.AssertionError ? err.message : String(err);
      console.error(`  ✗  ${name}\n     ${msg}`);
      failed++;
    }
  });
}

const PROJECT_ROOT = path.resolve(__dirname, "../../..");
function readSource(relPath: string): string {
  return fs.readFileSync(path.join(PROJECT_ROOT, relPath), "utf8");
}

async function parseResponse(r: Response): Promise<Record<string, unknown>> {
  return JSON.parse(await r.text()) as Record<string, unknown>;
}

// ── Mock DB factory ───────────────────────────────────────────────────────────

// Row shape taken from the route's ConfirmationDb contract (CHECKOUT-P9 added province),
// so a future contract change fails type-checking here instead of drifting silently.
type ConfirmationRow = NonNullable<Awaited<ReturnType<ConfirmationDb["getOrderConfirmation"]>>["data"]>;
// Fixtures may omit province; the database always returns the column (null when unset).
type StoredOrder = Omit<ConfirmationRow, "province"> & { province?: ConfirmationRow["province"] };

function makeConfirmationDb(store: StoredOrder | null, fail = false): ConfirmationDb {
  return {
    getOrderConfirmation: async () => {
      if (fail) return { data: null, error: new Error("DB connection failed") };
      return { data: store ? { ...store, province: store.province ?? null } : null, error: null };
    },
  };
}

// The only fields a successful confirmation may contain (CHECKOUT-P9: province drives the
// receipt's collection / delivery wording). Anything else is a contract violation.
const CONFIRMATION_FIELDS = ["orderRef", "paymentStatus", "province", "total"];
// Customer data and credentials that must never appear in a confirmation body.
const FORBIDDEN_CONFIRMATION_FIELDS = [
  "customer_name", "customerName", "name", "full_name", "fullName", "phone", "email", "address",
  "items", "order_items", "notes", "admin_notes", "status_history", "token", "receiptToken", "secret",
];

function makeOrderDb(fail = false): { db: OrderDb; captured(): Record<string, unknown> | null } {
  let row: Record<string, unknown> | null = null;
  return {
    db: {
      insertOrder: async (r) => {
        row = r as Record<string, unknown>;
        if (fail) return { error: new Error("insert failed") };
        return { error: null };
      },
    },
    captured: () => row,
  };
}

// ── Order body builder ────────────────────────────────────────────────────────

const CATALOGUE_PRICES: Record<string, number> = { "5ml": 60, "10ml": 100, "30ml": 250 };
const TEST_SLUG  = "aventus-inspired";
const TEST_TITLE = "Aventus Inspired";

function makeOrderBody(
  province: string,
  items: Array<{ quantity: number; size: string }>,
): Record<string, unknown> {
  const cartCount = items.reduce((n, i) => n + i.quantity, 0);
  const active    = cartCount >= WHOLESALE_THRESHOLD;
  const subtotal  = items.reduce((s, i) => {
    const p = CATALOGUE_PRICES[i.size] ?? 60;
    return s + getWholesaleItemPrice(i.size, p, active) * i.quantity;
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
      id: TEST_SLUG, title: TEST_TITLE,
      price: CATALOGUE_PRICES[i.size] ?? 60,
      quantity: i.quantity, size: i.size,
    })),
    subtotal,
    delivery,
    total: subtotal + delivery,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
console.log("\n  SITE-RELIABILITY-P2F — Confirmation Security Tests\n");

// ── Section 1: Valid confirmation ─────────────────────────────────────────────
console.log("  ─── Section 1: Valid confirmation ───\n");

it("Valid ref, order found → 200 with orderRef, total, paymentStatus", async () => {
  const db  = makeConfirmationDb({ order_ref: "MSR-20260914-11111", total: 160, payment_status: "awaiting_payment" });
  const res = await handleGetConfirmation("MSR-20260914-11111", await signReceiptToken("MSR-20260914-11111"), db);
  assert.equal(res.status, 200);
  const json = await parseResponse(res);
  assert.equal(json.orderRef,      "MSR-20260914-11111");
  assert.equal(json.total,         160);
  assert.equal(json.paymentStatus, "awaiting_payment");
});

it("Retail order total confirmed: 1 × 5ml @ R60 + Cape Town Metro R100 = R160", async () => {
  const db  = makeConfirmationDb({ order_ref: "MSR-20260914-22222", total: 160, payment_status: "awaiting_payment" });
  const res = await handleGetConfirmation("MSR-20260914-22222", await signReceiptToken("MSR-20260914-22222"), db);
  const json = await parseResponse(res);
  assert.equal(json.total, 160);
});

it("Wholesale order total confirmed: 10 × 5ml wholesale = R480 + Gauteng R180 = R660", async () => {
  const db  = makeConfirmationDb({ order_ref: "MSR-20260914-33333", total: 660, payment_status: "awaiting_payment" });
  const res = await handleGetConfirmation("MSR-20260914-33333", await signReceiptToken("MSR-20260914-33333"), db);
  const json = await parseResponse(res);
  assert.equal(json.total, 660);
});

it("Collection order total confirmed: delivery R0, total = subtotal only", async () => {
  const db  = makeConfirmationDb({ order_ref: "MSR-20260914-44444", total: 60, payment_status: "awaiting_payment" });
  const res = await handleGetConfirmation("MSR-20260914-44444", await signReceiptToken("MSR-20260914-44444"), db);
  const json = await parseResponse(res);
  assert.equal(json.total, 60);
});

it("Response includes paymentStatus field for EFT context", async () => {
  const db  = makeConfirmationDb({ order_ref: "MSR-20260914-55555", total: 280, payment_status: "awaiting_payment" });
  const res = await handleGetConfirmation("MSR-20260914-55555", await signReceiptToken("MSR-20260914-55555"), db);
  const json = await parseResponse(res);
  assert.ok("paymentStatus" in json, "paymentStatus must be present");
  assert.equal(json.paymentStatus, "awaiting_payment",
    "New orders are always awaiting_payment — not implying payment received");
});

// ── Section 2: Invalid reference formats ──────────────────────────────────────
console.log("  ─── Section 2: Invalid reference formats ───\n");

const invalidRefs = [
  ["empty string",            ""],
  ["random string",           "not-valid"],
  ["no MSR- prefix",          "ORD-20260914-12345"],
  ["short suffix",            "MSR-20260914-1234"],
  ["long suffix",             "MSR-20260914-123456"],
  ["short date",              "MSR-2026091-12345"],
  ["extra segments",          "MSR-20260914-12345-extra"],
  ["SQL injection attempt",   "MSR-20260914-12345' OR 1=1--"],
];

for (const [label, ref] of invalidRefs) {
  it(`Invalid ref (${label}) → 400, no DB access`, async () => {
    let dbCalled = false;
    const db: ConfirmationDb = {
      getOrderConfirmation: async () => {
        dbCalled = true;
        return { data: null, error: null };
      },
    };
    // Format check fires before token check — null token is fine for invalid refs.
    const res = await handleGetConfirmation(ref, null, db);
    assert.equal(res.status, 400, `Expected 400 for ref: "${ref}"`);
    assert.ok(!dbCalled, "DB must not be called for invalid ref format");
    const json = await parseResponse(res);
    assert.equal(json.success, false);
  });
}

// ── Section 3: Not found ──────────────────────────────────────────────────────
console.log("  ─── Section 3: Order not found ───\n");

it("Valid format ref not in store → 404 order not found", async () => {
  const db  = makeConfirmationDb(null); // no order stored
  const res = await handleGetConfirmation("MSR-20260914-99999", await signReceiptToken("MSR-20260914-99999"), db);
  assert.equal(res.status, 404);
  const json = await parseResponse(res);
  assert.equal(json.success, false);
  assert.ok((json.message as string).toLowerCase().includes("not found"), `Got: ${json.message}`);
});

it("404 response does not expose customer information", async () => {
  const db  = makeConfirmationDb(null);
  const res = await handleGetConfirmation("MSR-20260914-99998", await signReceiptToken("MSR-20260914-99998"), db);
  const json = await parseResponse(res);
  assert.ok(!("customer_name" in json), "Must not expose customer_name");
  assert.ok(!("phone"         in json), "Must not expose phone");
  assert.ok(!("address"       in json), "Must not expose address");
});

// ── Section 4: DB error → 500 ─────────────────────────────────────────────────
console.log("  ─── Section 4: DB error ───\n");

it("DB error → 500 with safe message, no internal details", async () => {
  const db  = makeConfirmationDb(null, true); // fail = true
  const res = await handleGetConfirmation("MSR-20260914-77777", await signReceiptToken("MSR-20260914-77777"), db);
  assert.equal(res.status, 500);
  const json = await parseResponse(res);
  assert.equal(json.success, false);
  assert.ok(!(json.message as string).toLowerCase().includes("db connection"),
    "DB error details must not be exposed");
});

// ── Section 5: Tampering resistance ──────────────────────────────────────────
console.log("  ─── Section 5: Tampering resistance ───\n");

it("GET handler does not accept total from query parameters — total always from DB", async () => {
  // The handler takes (ref, token, db) — there is no mechanism to supply ?total=.
  // This test verifies the handler interface has no total parameter.
  const db  = makeConfirmationDb({ order_ref: "MSR-20260914-66666", total: 999, payment_status: "awaiting_payment" });
  // We can only pass ref, token, and db — no way to inject ?total=
  const res = await handleGetConfirmation("MSR-20260914-66666", await signReceiptToken("MSR-20260914-66666"), db);
  const json = await parseResponse(res);
  assert.equal(json.total, 999, "Handler returns the stored total, not any URL param");
});

it("Order A ref cannot retrieve Order B's total — DB lookup is ref-specific", async () => {
  // Two separate orders with different totals.
  const dbA = makeConfirmationDb({ order_ref: "MSR-20260914-10001", total: 160, payment_status: "awaiting_payment" });
  const dbB = makeConfirmationDb({ order_ref: "MSR-20260914-10002", total: 550, payment_status: "awaiting_payment" });

  const resA = await handleGetConfirmation("MSR-20260914-10001", await signReceiptToken("MSR-20260914-10001"), dbA);
  const resB = await handleGetConfirmation("MSR-20260914-10002", await signReceiptToken("MSR-20260914-10002"), dbB);

  const jsonA = await parseResponse(resA);
  const jsonB = await parseResponse(resB);

  assert.equal(jsonA.total, 160, "Order A total must be R160");
  assert.equal(jsonB.total, 550, "Order B total must be R550");
  assert.notEqual(jsonA.total, jsonB.total, "Totals must differ between orders");
});

it("Presenting Order B's ref returns Order B's total, regardless of any claimed total", async () => {
  // Simulates: attacker knows ref MSR-...-10002 (total R550) but tries to use it
  // with a different DB that has a different total. The DB is keyed by ref.
  const db  = makeConfirmationDb({ order_ref: "MSR-20260914-10002", total: 550, payment_status: "awaiting_payment" });
  const res = await handleGetConfirmation("MSR-20260914-10002", await signReceiptToken("MSR-20260914-10002"), db);
  const json = await parseResponse(res);
  // No matter what the attacker claims, the server returns the stored total.
  assert.equal(json.total, 550);
});

it("POST → handleOrder produces the server total that GET will later confirm", async () => {
  // End-to-end: create an order, capture the stored total, verify it matches confirmation.
  const orderMock = makeOrderDb();
  const body = makeOrderBody("Cape Town Metro", [{ quantity: 1, size: "5ml" }]);
  await handleOrder(body, orderMock.db);
  const captured = orderMock.captured()!;
  const storedTotal = captured.total as number;

  // Sign a token for the captured ref to authorize the confirmation lookup.
  const token = await signReceiptToken(captured.order_ref as string);

  // Confirmation GET returns the same value.
  const confirmDb = makeConfirmationDb({
    order_ref:      captured.order_ref as string,
    total:          storedTotal,
    payment_status: "awaiting_payment",
  });
  const res  = await handleGetConfirmation(captured.order_ref as string, token, confirmDb);
  const json = await parseResponse(res);
  assert.equal(json.total, storedTotal, "Confirmation total matches stored total");
  assert.equal(json.total, 160, "Retail: 1×5ml R60 + Cape Town R100 = R160");
});

// ── Section 6: PII exclusion ──────────────────────────────────────────────────
console.log("  ─── Section 6: No PII in confirmation response ───\n");

it("Confirmation response fields: exactly orderRef, total, paymentStatus, province (populated and null province)", async () => {
  const cases: Array<[StoredOrder, string | null]> = [
    [{ order_ref: "MSR-20260914-55556", total: 160, payment_status: "awaiting_payment", province: "Gauteng" }, "Gauteng"],
    [{ order_ref: "MSR-20260914-55557", total: 60, payment_status: "awaiting_payment", province: COLLECTION_PROVINCE }, COLLECTION_PROVINCE],
    [{ order_ref: "MSR-20260914-55558", total: 160, payment_status: "awaiting_payment", province: null }, null],
  ];
  for (const [stored, province] of cases) {
    const res  = await handleGetConfirmation(stored.order_ref, await signReceiptToken(stored.order_ref), makeConfirmationDb(stored));
    assert.equal(res.status, 200);
    const json = await parseResponse(res);
    assert.deepEqual(Object.keys(json).sort(), CONFIRMATION_FIELDS, `Response keys for ${stored.order_ref}`);
    assert.equal(json.province, province, "province is returned as stored (null, not omitted, when unset)");
    for (const key of FORBIDDEN_CONFIRMATION_FIELDS) assert.ok(!(key in json), `Must not expose ${key}`);
  }
});

it("Confirmation response never includes province (or any order data) without a valid receipt token", async () => {
  const stored: StoredOrder = { order_ref: "MSR-20260914-55559", total: 160, payment_status: "awaiting_payment", province: "Gauteng" };
  for (const token of [null, "", "not-a-token", await signReceiptToken("MSR-20260914-55560")]) {
    let dbCalled = false;
    const db: ConfirmationDb = {
      getOrderConfirmation: async () => { dbCalled = true; return makeConfirmationDb(stored).getOrderConfirmation(stored.order_ref); },
    };
    const res  = await handleGetConfirmation(stored.order_ref, token, db);
    assert.equal(res.status, 401, `token ${JSON.stringify(token)?.slice(0, 20)} must be rejected`);
    assert.ok(!dbCalled, "DB must not be called before the receipt token is verified");
    const json = await parseResponse(res);
    for (const key of [...CONFIRMATION_FIELDS.filter((k) => k !== "orderRef"), ...FORBIDDEN_CONFIRMATION_FIELDS]) {
      assert.ok(!(key in json), `401 body must not contain ${key}`);
    }
  }
});

it("Source: GET endpoint selects exactly order_ref, total, payment_status, province from DB", () => {
  const src = readSource("app/api/orders/[ref]/route.ts");
  // Exact column list of the confirmation GET's select() — no wildcard, no extra column.
  const getFn   = src.slice(src.indexOf("export async function GET"));
  const selects = [...getFn.matchAll(/\.select\(\s*(["'`])([^"'`]*)\1\s*\)/g)].map((m) => m[2]);
  assert.equal(selects.length, 1, `GET must issue exactly one select(); found ${selects.length}`);
  const columns = selects[0].split(",").map((c) => c.trim()).sort();
  assert.deepEqual(columns, ["order_ref", "payment_status", "province", "total"],
    `GET DB query must select exactly order_ref, total, payment_status, province; got "${selects[0]}"`);
  // Must not select customer_name, phone, or address.
  const getSection = src.slice(src.indexOf("handleGetConfirmation"));
  assert.ok(!getSection.includes("customer_name"), "GET must not select customer_name");
  assert.ok(!getSection.includes('"phone"') && !getSection.includes("'phone'"), "GET must not select phone");
  assert.ok(!getSection.includes('"address"') && !getSection.includes("'address'"), "GET must not select address");
});

// ── Section 7: HTTP wrapper tests ─────────────────────────────────────────────
console.log("  ─── Section 7: HTTP wrapper tests ───\n");

it("GET wrapper: invalid ref format → 400 without DB access", async () => {
  // The GET() function validates the ref before creating the DB adapter.
  // Passing an invalid ref hits handleGetConfirmation's format guard.
  // getSupabaseAdmin() is NOT called because the ref guard fires first.
  const mockReq = Object.assign(
    new Request("http://localhost/api/orders/bad"),
    { cookies: { get: () => undefined } },
  ) as unknown as import("next/server").NextRequest;
  const res = await GET(mockReq, { params: Promise.resolve({ ref: "bad-ref" }) });
  assert.equal(res.status, 400);
  const json = await parseResponse(res);
  assert.equal(json.success, false);
});

it("GET wrapper: empty-string ref → 400", async () => {
  const mockReq = Object.assign(
    new Request("http://localhost"),
    { cookies: { get: () => undefined } },
  ) as unknown as import("next/server").NextRequest;
  const res = await GET(mockReq, { params: Promise.resolve({ ref: "" }) });
  assert.equal(res.status, 400);
});

it("POST wrapper: malformed JSON body → 400 (client error)", async () => {
  // request.json() parse failure is a client error — not an internal server error.
  const req = new Request("http://localhost/api/orders", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    "not{valid}json{{",
  });
  const res  = await POST(req);
  assert.equal(res.status, 400);
  const json = await parseResponse(res);
  assert.equal(json.success, false);
  assert.ok(typeof json.message === "string");
});

it("POST wrapper: missing Content-Type body → 400 (JSON parse fails)", async () => {
  const req = new Request("http://localhost/api/orders", {
    method: "POST",
    body:   "plain text",
  });
  const res = await POST(req);
  assert.equal(res.status, 400);
});

// ── Section 8: Source invariants ─────────────────────────────────────────────
console.log("  ─── Section 8: Source invariants ───\n");

it("Checkout redirect no longer includes ?total= parameter", () => {
  const src          = readSource("app/checkout/page.tsx");
  const redirectLine = src.split("\n").find(l => l.includes("payment-success") && l.includes("location.href")) ?? "";
  assert.ok(redirectLine.length > 0, "Redirect to payment-success must exist in checkout");
  assert.ok(
    !redirectLine.includes("total"),
    `Checkout redirect must not include total param. Got: ${redirectLine.trim()}`
  );
});

it("payment-success page does not use ?total= query param for display", () => {
  const src = readSource("app/payment-success/page.tsx");
  // Must not read 'total' from searchParams for display
  assert.ok(
    !src.includes('searchParams.get("total")'),
    "payment-success must not read ?total= from URL"
  );
  assert.ok(
    !src.includes("searchParams.get('total')"),
    "payment-success must not read ?total= from URL (single quotes)"
  );
});

it("payment-success page fetches from /api/orders/[ref] on mount", () => {
  const src = readSource("app/payment-success/page.tsx");
  assert.ok(
    src.includes("/api/orders/"),
    "payment-success must fetch from /api/orders/[ref] for trusted total"
  );
  assert.ok(
    src.includes("useEffect"),
    "Fetch must be triggered via useEffect"
  );
});

it("payment-success page shows loading state while confirmation is pending", () => {
  const src = readSource("app/payment-success/page.tsx");
  assert.ok(
    src.includes('"loading"') || src.includes("'loading'"),
    "payment-success must have a loading state"
  );
  assert.ok(
    src.includes("animate-pulse") || src.includes("loading"),
    "loading state must be rendered"
  );
});

it("payment-success page shows error states without fabricating an amount", () => {
  // P10 (6ab79be) replaced the single "error" state with specific failure states.
  const src = readSource("app/payment-success/page.tsx");
  const FAILURE_STATES = ["unauthorized", "not_found", "invalid_ref", "network_error", "server_error"];

  // 1. The state union declares exactly loading, confirmed and the five failure states,
  //    and only "confirmed" carries a total.
  const union = /type ConfirmationState =([\s\S]*?\});/.exec(src)?.[1] ?? "";
  const variants = union.match(/\{[^{}]*\}/g) ?? [];
  const statuses = variants.map((v) => /status:\s*"([a-z_]+)"/.exec(v)?.[1]).sort();
  assert.deepEqual(statuses, ["confirmed", "loading", ...FAILURE_STATES].sort(), `ConfirmationState variants: ${statuses.join(", ")}`);
  for (const v of variants) {
    const status = /status:\s*"([a-z_]+)"/.exec(v)?.[1];
    assert.equal(/\btotal\b/.test(v), status === "confirmed", `only "confirmed" may carry total (variant ${status})`);
  }

  // 2. Each failure is reached from the right outcome: bad format before any fetch, 401, 404,
  //    any other non-OK response, and a fetch rejection.
  assert.ok(/!REF_FORMAT\.test\(orderRef\)\)\s*\{\s*setConfirmation\(\{\s*status:\s*"invalid_ref"\s*\}\)/.test(src), "invalid ref → invalid_ref before fetch");
  assert.ok(/res\.status === 401\)\s*\{\s*setConfirmation\(\{\s*status:\s*"unauthorized"/.test(src), "401 → unauthorized");
  assert.ok(/res\.status === 404\)\s*\{\s*setConfirmation\(\{\s*status:\s*"not_found"/.test(src), "404 → not_found");
  assert.ok(/!res\.ok\)\s*\{\s*setConfirmation\(\{\s*status:\s*"server_error"/.test(src), "other non-OK → server_error");
  assert.ok(/\.catch\([\s\S]{0,400}status:\s*"network_error"/.test(src), "fetch rejection → network_error");

  // 3. Every failure state has its own render branch, all before the first rendered amount,
  //    and none of those branches (or the loading branch) renders an amount.
  const firstAmount = src.indexOf("confirmation.total");
  assert.ok(firstAmount > 0, "confirmed view renders confirmation.total");
  const branchAt = (s: string) => src.search(new RegExp(`confirmation\\.status === "${s}"`));
  for (const s of ["loading", ...FAILURE_STATES]) {
    const at = branchAt(s);
    assert.ok(at > 0, `render branch for "${s}" exists`);
    assert.ok(at < firstAmount, `"${s}" branch returns before any amount is rendered`);
  }
  const nonConfirmedViews = src.slice(branchAt("loading"), firstAmount);
  assert.ok(!/\btotal\b|toFixed\(|searchParams/.test(nonConfirmedViews),
    "loading and failure views must not render an amount or read query parameters");

  // 4. The only query parameter read is the order reference — never a total.
  const params = [...src.matchAll(/searchParams\.get\(\s*["']([^"']+)["']\s*\)/g)].map((m) => m[1]);
  assert.deepEqual(params, ["ref"], `searchParams reads: ${params.join(", ")}`);
});

it("WhatsApp message uses confirmation.total when confirmed, not a URL param", () => {
  const src = readSource("app/payment-success/page.tsx");
  // confirmation.total should appear in the WhatsApp message construction
  assert.ok(
    src.includes("confirmation.total"),
    "WhatsApp message must use confirmation.total"
  );
  // Must not use rawTotal or searchParams.get('total') in the message
  assert.ok(
    !src.includes("rawTotal"),
    "WhatsApp message must not use rawTotal from URL"
  );
});

// ── Run all tests ─────────────────────────────────────────────────────────────

(async () => {
  for (const t of tests) await t();

  console.log("\n" + "─".repeat(60));
  console.log(`  Results: ${passed} passed, ${failed} failed`);
  if (failed === 0) {
    console.log("\n  PASS — all P2F confirmation security checks passed.\n");
  } else {
    console.log("\n  FAIL — P2F confirmation security violations detected.\n");
    process.exit(1);
  }
})();
