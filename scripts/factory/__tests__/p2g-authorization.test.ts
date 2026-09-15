// Must be set before any import that calls getReceiptSecret() at call time.
process.env.ORDER_RECEIPT_SECRET = "p2g-test-secret";
process.env.ADMIN_SECRET = "p2g-admin-secret";

/**
 * SITE-RELIABILITY-P2G — Authorization Tests
 *
 * Verifies that GET /api/orders/[ref] enforces receipt-credential authorization:
 *
 *   1. Reference alone (no token) → 401
 *   2. Absent, malformed, forged, and expired credentials → 401
 *   3. Cross-order credential (token for A used with B) → 401
 *   4. Valid credential → 200 with permitted fields only
 *   5. Cache-Control: private, no-store on confirmed responses
 *   6. Response fields contain only { orderRef, total, paymentStatus }
 *   7. POST sets an HttpOnly receipt cookie on success
 *   8. Missing ORDER_RECEIPT_SECRET → 503 before any DB insert
 *   9. Admin PATCH not affected — customer receipt does not grant admin access
 *  10. Anonymous PATCH → 401
 *  11. Malformed JSON → 400 (client error, not 500)
 *
 * Run: npx tsx scripts/factory/__tests__/p2g-authorization.test.ts
 */

import assert from "node:assert/strict";

import {
  handleGetConfirmation,
  PATCH,
  type ConfirmationDb,
} from "../../../app/api/orders/[ref]/route";

import {
  handleOrder,
  POST,
  type OrderDb,
} from "../../../app/api/orders/route";

import {
  signReceiptToken,
  RECEIPT_EXPIRY_SECONDS,
} from "../../../app/lib/receiptToken";

import {
  COLLECTION_PROVINCE,
} from "../../../app/lib/commerce/delivery";

// ── Harness ───────────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;
const tests: Array<() => Promise<void>> = [];

function it(name: string, fn: () => void | Promise<void>): void {
  tests.push(async () => {
    try {
      const r = fn();
      if (r && typeof (r as Promise<void>).then === "function") await r;
      console.log(`  ✓  ${name}`);
      passed++;
    } catch (err) {
      const msg = err instanceof assert.AssertionError ? err.message : String(err);
      console.error(`  ✗  ${name}\n     ${msg}`);
      failed++;
    }
  });
}

async function parseResponse(r: Response): Promise<Record<string, unknown>> {
  return JSON.parse(await r.text()) as Record<string, unknown>;
}

// ── Mock DB ───────────────────────────────────────────────────────────────────

type StoredOrder = { order_ref: string; total: number; payment_status: string };

function makeConfirmationDb(store: StoredOrder | null, fail = false): ConfirmationDb {
  return {
    getOrderConfirmation: async () => {
      if (fail) return { data: null, error: new Error("DB error") };
      return { data: store, error: null };
    },
  };
}

function makeOrderDb(fail = false): { db: OrderDb; called(): boolean } {
  let wasCalled = false;
  return {
    db: {
      insertOrder: async (r) => {
        wasCalled = true;
        void r;
        if (fail) return { error: new Error("insert failed") };
        return { error: null };
      },
    },
    called: () => wasCalled,
  };
}

function makeOrderBody(): Record<string, unknown> {
  return {
    customer_name: "Test Customer",
    phone:         "0821234567",
    address:       "123 Main Street",
    province:      "Cape Town Metro",
    items: [{ id: "aventus-inspired", title: "Aventus Inspired", price: 60, quantity: 1, size: "5ml" }],
    subtotal: 60,
    delivery: 100,
    total:    160,
  };
}

// ── Forge helpers (inline — does not export internal key util) ────────────────

async function makeHmacKey(secret: string, usage: "sign" | "verify"): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    [usage],
  );
}

async function forgeToken(ref: string, overrides: {
  secret?: string;
  purpose?: string;
  expOffset?: number;
}): Promise<string> {
  const secret = overrides.secret ?? "p2g-test-secret";
  const payload = {
    ref,
    purpose: overrides.purpose ?? "confirm",
    exp: Math.floor(Date.now() / 1000) + (overrides.expOffset ?? RECEIPT_EXPIRY_SECONDS),
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const key = await makeHmacKey(secret, "sign");
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payloadB64));
  return `${payloadB64}.${Buffer.from(sig).toString("base64url")}`;
}

// ─────────────────────────────────────────────────────────────────────────────
console.log("\n  SITE-RELIABILITY-P2G — Authorization Tests\n");

const TEST_REF  = "MSR-20260914-55555";
const TEST_REF2 = "MSR-20260914-66666";
const STORED    = { order_ref: TEST_REF, total: 250, payment_status: "awaiting_payment" };

// ── Section 1: Credential requirement ────────────────────────────────────────
console.log("  ─── Section 1: Credential requirement ───\n");

it("ref alone (no token) → 401, DB not accessed", async () => {
  let dbCalled = false;
  const db: ConfirmationDb = {
    getOrderConfirmation: async () => { dbCalled = true; return { data: null, error: null }; },
  };
  const res = await handleGetConfirmation(TEST_REF, null, db);
  assert.equal(res.status, 401);
  assert.ok(!dbCalled, "DB must not be called when no credential presented");
});

it("empty-string token → 401", async () => {
  const db = makeConfirmationDb(STORED);
  const res = await handleGetConfirmation(TEST_REF, "", db);
  assert.equal(res.status, 401);
});

// ── Section 2: Absent / malformed / forged / expired ─────────────────────────
console.log("  ─── Section 2: Absent / malformed / forged / expired credential ───\n");

it("single-segment token (no dot) → 401", async () => {
  const db = makeConfirmationDb(STORED);
  const res = await handleGetConfirmation(TEST_REF, "notadottoken", db);
  assert.equal(res.status, 401);
});

it("three-segment token (extra dot) → 401", async () => {
  const db = makeConfirmationDb(STORED);
  const res = await handleGetConfirmation(TEST_REF, "aaa.bbb.ccc", db);
  assert.equal(res.status, 401);
});

it("valid structure but invalid base64url signature → 401", async () => {
  const db = makeConfirmationDb(STORED);
  const validPayload = Buffer.from(
    JSON.stringify({ ref: TEST_REF, purpose: "confirm", exp: Math.floor(Date.now() / 1000) + 3600 }),
  ).toString("base64url");
  const res = await handleGetConfirmation(TEST_REF, `${validPayload}.invalidsig!!!`, db);
  assert.equal(res.status, 401);
});

it("forged token (signed with wrong secret) → 401", async () => {
  const db    = makeConfirmationDb(STORED);
  const token = await forgeToken(TEST_REF, { secret: "attacker-secret" });
  const res   = await handleGetConfirmation(TEST_REF, token, db);
  assert.equal(res.status, 401);
});

it("expired token (exp in the past) → 401", async () => {
  const db    = makeConfirmationDb(STORED);
  // Signed with correct key but already expired
  const token = await forgeToken(TEST_REF, { expOffset: -1 });
  const res   = await handleGetConfirmation(TEST_REF, token, db);
  assert.equal(res.status, 401);
});

it("token with wrong purpose → 401", async () => {
  const db    = makeConfirmationDb(STORED);
  const token = await forgeToken(TEST_REF, { purpose: "admin" });
  const res   = await handleGetConfirmation(TEST_REF, token, db);
  assert.equal(res.status, 401);
});

it("401 response body does not expose token details or internal error", async () => {
  const db    = makeConfirmationDb(STORED);
  const token = await forgeToken(TEST_REF, { secret: "wrong" });
  const res   = await handleGetConfirmation(TEST_REF, token, db);
  const json  = await parseResponse(res);
  assert.equal(json.success, false);
  assert.equal(json.message, "Unauthorized.", "401 must return generic Unauthorized message");
});

// ── Section 3: Cross-order denial ────────────────────────────────────────────
console.log("  ─── Section 3: Cross-order denial ───\n");

it("token issued for ref A cannot authorize ref B → 401", async () => {
  const tokenForA = await signReceiptToken(TEST_REF);
  const dbForB    = makeConfirmationDb({ order_ref: TEST_REF2, total: 999, payment_status: "awaiting_payment" });
  const res = await handleGetConfirmation(TEST_REF2, tokenForA, dbForB);
  assert.equal(res.status, 401, "Token bound to A must not authorize B");
});

it("token issued for ref B does authorize ref B → 200", async () => {
  const tokenForB = await signReceiptToken(TEST_REF2);
  const dbForB    = makeConfirmationDb({ order_ref: TEST_REF2, total: 999, payment_status: "awaiting_payment" });
  const res = await handleGetConfirmation(TEST_REF2, tokenForB, dbForB);
  assert.equal(res.status, 200, "Token bound to B must authorize B");
});

it("DB not accessed when cross-order token is rejected", async () => {
  let dbCalled = false;
  const db: ConfirmationDb = {
    getOrderConfirmation: async () => { dbCalled = true; return { data: null, error: null }; },
  };
  const tokenForA = await signReceiptToken(TEST_REF);
  await handleGetConfirmation(TEST_REF2, tokenForA, db);
  assert.ok(!dbCalled, "DB must not be reached when credential is rejected");
});

// ── Section 4: Valid credential → 200 ────────────────────────────────────────
console.log("  ─── Section 4: Valid credential → 200 ───\n");

it("valid token → 200 with correct fields", async () => {
  const token = await signReceiptToken(TEST_REF);
  const db    = makeConfirmationDb(STORED);
  const res   = await handleGetConfirmation(TEST_REF, token, db);
  assert.equal(res.status, 200);
  const json  = await parseResponse(res);
  assert.equal(json.orderRef,      TEST_REF);
  assert.equal(json.total,         250);
  assert.equal(json.paymentStatus, "awaiting_payment");
});

it("valid token within lifetime continues to work (token not invalidated on first use)", async () => {
  const token = await signReceiptToken(TEST_REF);
  const db1   = makeConfirmationDb(STORED);
  const db2   = makeConfirmationDb(STORED);
  const res1  = await handleGetConfirmation(TEST_REF, token, db1);
  const res2  = await handleGetConfirmation(TEST_REF, token, db2);
  assert.equal(res1.status, 200, "First use must succeed");
  assert.equal(res2.status, 200, "Second use within lifetime must succeed");
});

// ── Section 5: Cache-Control ──────────────────────────────────────────────────
console.log("  ─── Section 5: Cache-Control ───\n");

it("200 confirmation response has Cache-Control: private, no-store", async () => {
  const token = await signReceiptToken(TEST_REF);
  const db    = makeConfirmationDb(STORED);
  const res   = await handleGetConfirmation(TEST_REF, token, db);
  assert.equal(res.status, 200);
  assert.equal(res.headers.get("Cache-Control"), "private, no-store");
});

it("401 response does not set Cache-Control: private, no-store", async () => {
  const db  = makeConfirmationDb(STORED);
  const res = await handleGetConfirmation(TEST_REF, null, db);
  assert.equal(res.status, 401);
  // 401 responses need not be private — they carry no order data
  const cc = res.headers.get("Cache-Control");
  assert.ok(cc !== "private, no-store", "401 must not carry the confirmed-order cache header");
});

// ── Section 6: Response field restriction ────────────────────────────────────
console.log("  ─── Section 6: Response field restriction ───\n");

it("200 response contains only { orderRef, total, paymentStatus } — no extra fields", async () => {
  const token = await signReceiptToken(TEST_REF);
  const db    = makeConfirmationDb(STORED);
  const res   = await handleGetConfirmation(TEST_REF, token, db);
  const json  = await parseResponse(res);
  const allowed = new Set(["orderRef", "total", "paymentStatus"]);
  for (const key of Object.keys(json)) {
    assert.ok(allowed.has(key), `Unexpected field in 200 response: "${key}"`);
  }
});

it("200 response contains no customer PII", async () => {
  const token = await signReceiptToken(TEST_REF);
  const db    = makeConfirmationDb({ ...STORED, order_ref: TEST_REF });
  const res   = await handleGetConfirmation(TEST_REF, token, db);
  const json  = await parseResponse(res);
  assert.ok(!("customer_name" in json), "Must not expose customer_name");
  assert.ok(!("phone"         in json), "Must not expose phone");
  assert.ok(!("address"       in json), "Must not expose address");
});

// ── Section 7: Receipt issuance ───────────────────────────────────────────────
console.log("  ─── Section 7: POST issues HttpOnly receipt cookie ───\n");

it("successful order POST sets a Set-Cookie header for the receipt token", async () => {
  const { db } = makeOrderDb();
  const body   = makeOrderBody();
  const res    = await handleOrder(body, db);
  assert.equal(res.status, 200);
  const json   = await parseResponse(res);
  assert.ok(json.success, "POST must succeed");
  const ref    = json.orderRef as string;
  assert.ok(ref.startsWith("MSR-"), "orderRef must match format");

  // NextResponse exposes Set-Cookie via the headers map.
  const setCookie = res.headers.get("set-cookie") ?? "";
  assert.ok(
    setCookie.includes(`msr_receipt_${ref}`),
    `Set-Cookie must contain msr_receipt_${ref}. Got: ${setCookie}`,
  );
  assert.ok(setCookie.toLowerCase().includes("httponly"), "Cookie must be HttpOnly");
  assert.ok(setCookie.toLowerCase().includes("samesite=strict"), "Cookie must be SameSite=Strict");
});

it("receipt cookie name is bound to the exact order reference", async () => {
  const { db } = makeOrderDb();
  const res  = await handleOrder(makeOrderBody(), db);
  const json = await parseResponse(res);
  const ref  = json.orderRef as string;
  const setCookie = res.headers.get("set-cookie") ?? "";
  // The cookie name must embed the specific ref — generic names leak across orders.
  assert.ok(
    setCookie.includes(`msr_receipt_${ref}=`),
    `Cookie name must embed the order ref. Got: ${setCookie}`,
  );
});

it("POST does not include the token in the JSON body", async () => {
  const { db } = makeOrderDb();
  const res  = await handleOrder(makeOrderBody(), db);
  const json = await parseResponse(res);
  assert.ok(!("token"       in json), "JSON body must not contain token");
  assert.ok(!("receiptToken" in json), "JSON body must not contain receiptToken");
  assert.ok(!("credential"  in json), "JSON body must not contain credential");
});

// ── Section 8: Missing signing config → 503 before insert ────────────────────
console.log("  ─── Section 8: Missing signing config → 503 ───\n");

it("missing ORDER_RECEIPT_SECRET → 503 before DB insert", async () => {
  const saved = process.env.ORDER_RECEIPT_SECRET;
  delete process.env.ORDER_RECEIPT_SECRET;

  const mock = makeOrderDb();
  const res  = await handleOrder(makeOrderBody(), mock.db);
  assert.equal(res.status, 503, "Must return 503 when signing secret is absent");
  assert.ok(!mock.called(), "DB must not be called when receipt secret is missing");

  const json = await parseResponse(res);
  assert.equal(json.success, false);

  process.env.ORDER_RECEIPT_SECRET = saved;
});

it("empty ORDER_RECEIPT_SECRET → 503 before DB insert", async () => {
  const saved = process.env.ORDER_RECEIPT_SECRET;
  process.env.ORDER_RECEIPT_SECRET = "   ";

  const mock = makeOrderDb();
  const res  = await handleOrder(makeOrderBody(), mock.db);
  assert.equal(res.status, 503);
  assert.ok(!mock.called(), "DB must not be called when receipt secret is blank");

  process.env.ORDER_RECEIPT_SECRET = saved;
});

// ── Section 9: Admin isolation ────────────────────────────────────────────────
console.log("  ─── Section 9: Admin isolation ───\n");

it("customer receipt cookie alone → PATCH returns 401 (does not grant admin access)", async () => {
  // ADMIN_SECRET is set; request has a customer receipt cookie but no Bearer header.
  const customerToken = await signReceiptToken(TEST_REF);
  const req = new Request(`http://localhost/api/orders/${TEST_REF}`, {
    method:  "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Cookie":       `msr_receipt_${TEST_REF}=${customerToken}`,
    },
    body: JSON.stringify({ status: "paid" }),
  });
  const res = await PATCH(
    req as unknown as import("next/server").NextRequest,
    { params: Promise.resolve({ ref: TEST_REF }) },
  );
  assert.equal(res.status, 401, "Customer receipt must not grant PATCH access");
});

it("anonymous PATCH (no auth, no cookie) → 401", async () => {
  const req = new Request(`http://localhost/api/orders/${TEST_REF}`, {
    method:  "PATCH",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ status: "paid" }),
  });
  const res = await PATCH(
    req as unknown as import("next/server").NextRequest,
    { params: Promise.resolve({ ref: TEST_REF }) },
  );
  assert.equal(res.status, 401);
});

it("wrong Bearer token → 401", async () => {
  const req = new Request(`http://localhost/api/orders/${TEST_REF}`, {
    method:  "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer wrong-secret",
    },
    body: JSON.stringify({ status: "paid" }),
  });
  const res = await PATCH(
    req as unknown as import("next/server").NextRequest,
    { params: Promise.resolve({ ref: TEST_REF }) },
  );
  assert.equal(res.status, 401);
});

// ── Section 10: Malformed JSON → 400 ─────────────────────────────────────────
console.log("  ─── Section 10: Malformed JSON → 400 ───\n");

it("POST with malformed JSON body → 400 (client error, not 500)", async () => {
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

it("POST with no Content-Type and plain body → 400", async () => {
  const req = new Request("http://localhost/api/orders", {
    method: "POST",
    body:   "plain text body",
  });
  const res = await POST(req);
  assert.equal(res.status, 400);
});

it("POST with empty body → 400", async () => {
  const req = new Request("http://localhost/api/orders", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    "",
  });
  const res = await POST(req);
  assert.equal(res.status, 400);
});

// ── Run all tests ─────────────────────────────────────────────────────────────

(async () => {
  for (const t of tests) await t();

  console.log("\n" + "─".repeat(60));
  console.log(`  Results: ${passed} passed, ${failed} failed`);
  if (failed === 0) {
    console.log("\n  PASS — all P2G authorization checks passed.\n");
  } else {
    console.log("\n  FAIL — P2G authorization violations detected.\n");
    process.exit(1);
  }
})();
