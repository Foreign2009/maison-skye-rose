/**
 * CHECKOUT-P9 — Receipt GET handler: mocked unit tests
 *
 * Tests handleGetConfirmation directly with an in-process mock ConfirmationDb.
 * No network calls, no Supabase access, no Playwright, no dev server required.
 * Labeled as mocked unit tests — not real integration evidence.
 *
 * Run: npx tsx scripts/integration/p9-receipt-handler.ts
 */

import {
  handleGetConfirmation,
  type ConfirmationDb,
} from "../../app/api/orders/[ref]/route";
import {
  signReceiptToken,
  verifyReceiptToken,
} from "../../app/lib/receiptToken";

// ── Test infrastructure ─────────────────────────────────────────────────────

const findings: Array<{ label: string; result: string; evidence: string }> = [];
const failures:  string[] = [];

function f(label: string, result: "pass" | "fail", evidence: string) {
  findings.push({ label, result, evidence });
  const badge = result.toUpperCase().padEnd(4);
  console.log(`  [${badge}] ${label}: ${evidence}`);
  if (result === "fail") failures.push(`${label}: ${evidence}`);
}

function expect<T>(actual: T, label: string) {
  return {
    toBe(expected: T) {
      const ok = actual === expected;
      f(label, ok ? "pass" : "fail", ok ? String(actual) : `got ${String(actual)}, want ${String(expected)}`);
    },
    toContain(fragment: string) {
      const ok = String(actual).includes(fragment);
      f(label, ok ? "pass" : "fail", ok ? `contains "${fragment}"` : `"${String(actual)}" missing "${fragment}"`);
    },
    toBeTruthy() {
      const ok = !!actual;
      f(label, ok ? "pass" : "fail", ok ? String(actual) : `falsy: ${String(actual)}`);
    },
    toBeNull() {
      const ok = actual === null;
      f(label, ok ? "pass" : "fail", ok ? "null" : `got ${String(actual)}`);
    },
  };
}

// ── Token setup ─────────────────────────────────────────────────────────────

// Use a fixed test secret — never the production value.
process.env.ORDER_RECEIPT_SECRET = "p9-unit-test-secret-not-production";

const TEST_REF = "MSR-20260921-99999";

// ── Mock factories ──────────────────────────────────────────────────────────

function makeDb(
  data: { order_ref: string; total: number; payment_status: string; province: string | null } | null,
  error: unknown = null,
): ConfirmationDb {
  return {
    getOrderConfirmation: async () => ({ data, error }),
  };
}

// ── Tests ───────────────────────────────────────────────────────────────────

async function run() {
  console.log("\nCHECKOUT-P9 — Receipt handler: mocked unit tests\n");

  // ── T1: Missing token → 401 ──────────────────────────────────────────────
  {
    const db = makeDb({ order_ref: TEST_REF, total: 60, payment_status: "awaiting_payment", province: "Cape Town Metro" });
    const res = await handleGetConfirmation(TEST_REF, null, db);
    expect(res.status, "T1: missing token → 401").toBe(401);
  }

  // ── T2: Invalid token string → 401 ──────────────────────────────────────
  {
    const db = makeDb({ order_ref: TEST_REF, total: 60, payment_status: "awaiting_payment", province: "Cape Town Metro" });
    const res = await handleGetConfirmation(TEST_REF, "not-a-valid-token", db);
    expect(res.status, "T2: invalid token → 401").toBe(401);
  }

  // ── T3: Token for wrong ref → 401 ───────────────────────────────────────
  {
    const wrongToken = await signReceiptToken("MSR-20260921-00001");
    const db = makeDb({ order_ref: TEST_REF, total: 60, payment_status: "awaiting_payment", province: "Cape Town Metro" });
    const res = await handleGetConfirmation(TEST_REF, wrongToken, db);
    expect(res.status, "T3: token for wrong ref → 401").toBe(401);
  }

  // ── T4: Invalid ref format → 400 ────────────────────────────────────────
  {
    const token = await signReceiptToken("bad-ref");
    const db = makeDb(null);
    const res = await handleGetConfirmation("bad-ref", token, db);
    expect(res.status, "T4: bad ref format → 400").toBe(400);
  }

  // ── T5: Valid token, order not found → 404 ──────────────────────────────
  {
    const token = await signReceiptToken(TEST_REF);
    const db = makeDb(null);
    const res = await handleGetConfirmation(TEST_REF, token, db);
    expect(res.status, "T5: order not found → 404").toBe(404);
  }

  // ── T6: DB error → 500 ──────────────────────────────────────────────────
  {
    const token = await signReceiptToken(TEST_REF);
    const db = makeDb(null, new Error("connection refused"));
    const res = await handleGetConfirmation(TEST_REF, token, db);
    expect(res.status, "T6: DB error → 500").toBe(500);
  }

  // ── T7: Courier province included in response ────────────────────────────
  {
    const token = await signReceiptToken(TEST_REF);
    const db = makeDb({
      order_ref: TEST_REF, total: 220, payment_status: "awaiting_payment",
      province: "Cape Town Metro",
    });
    const res = await handleGetConfirmation(TEST_REF, token, db);
    expect(res.status, "T7: courier order → 200").toBe(200);
    const body = await res.json() as Record<string, unknown>;
    expect(body.province, "T7: province in response body").toBe("Cape Town Metro");
    expect(body.total, "T7: total in response body").toBe(220);
    expect(body.orderRef, "T7: orderRef in response body").toBe(TEST_REF);
  }

  // ── T8: Collection province included in response ─────────────────────────
  {
    const token = await signReceiptToken(TEST_REF);
    const db = makeDb({
      order_ref: TEST_REF, total: 60, payment_status: "awaiting_payment",
      province: "Collection / Pickup",
    });
    const res = await handleGetConfirmation(TEST_REF, token, db);
    expect(res.status, "T8: collection order → 200").toBe(200);
    const body = await res.json() as Record<string, unknown>;
    expect(body.province, "T8: collection province in response").toBe("Collection / Pickup");
  }

  // ── T9: Null province → null in response (not omitted) ──────────────────
  {
    const token = await signReceiptToken(TEST_REF);
    const db = makeDb({
      order_ref: TEST_REF, total: 60, payment_status: "awaiting_payment",
      province: null,
    });
    const res = await handleGetConfirmation(TEST_REF, token, db);
    expect(res.status, "T9: null province → 200").toBe(200);
    const body = await res.json() as Record<string, unknown>;
    expect(body.province, "T9: null province returned as null").toBeNull();
  }

  // ── T10: Cache-Control header present ───────────────────────────────────
  {
    const token = await signReceiptToken(TEST_REF);
    const db = makeDb({
      order_ref: TEST_REF, total: 60, payment_status: "awaiting_payment",
      province: "Gauteng",
    });
    const res = await handleGetConfirmation(TEST_REF, token, db);
    const cc = res.headers.get("Cache-Control") ?? "";
    expect(cc, "T10: Cache-Control private, no-store").toContain("private");
  }

  // ── T11: Token verification round-trip ──────────────────────────────────
  {
    const token = await signReceiptToken(TEST_REF);
    let verified = false;
    try {
      await verifyReceiptToken(token, TEST_REF);
      verified = true;
    } catch { /* noop */ }
    f("T11: receipt token round-trip verify", verified ? "pass" : "fail", verified ? "ok" : "verifyReceiptToken threw");
  }

  // ── T12: Null province (DB has no value) → null returned, not omitted ───
  {
    const token = await signReceiptToken(TEST_REF);
    const db = makeDb({
      order_ref: TEST_REF, total: 60, payment_status: "awaiting_payment",
      province: null,
    });
    const res = await handleGetConfirmation(TEST_REF, token, db);
    expect(res.status, "T12: null province DB value → 200").toBe(200);
    const body = await res.json() as Record<string, unknown>;
    // Province must be null so the receipt page falls back to neutral wording
    expect(body.province, "T12: null province returned as null (not omitted)").toBeNull();
  }

  // ── T13: Unrecognised province string passed through as-is ───────────────
  {
    const token = await signReceiptToken(TEST_REF);
    const db = makeDb({
      order_ref: TEST_REF, total: 60, payment_status: "awaiting_payment",
      province: "Unknown Region XXXXX",
    });
    const res = await handleGetConfirmation(TEST_REF, token, db);
    expect(res.status, "T13: unknown province string → 200").toBe(200);
    const body = await res.json() as Record<string, unknown>;
    // Handler passes the raw value through; getFulfilmentMode on the page returns "unknown"
    expect(body.province, "T13: unrecognised province passed through").toBe("Unknown Region XXXXX");
  }

  // ── Summary ──────────────────────────────────────────────────────────────
  const pass = findings.filter(r => r.result === "pass").length;
  const fail = findings.filter(r => r.result === "fail").length;

  console.log(`\n──────────────────────────────────────────────`);
  console.log(`MOCKED UNIT TESTS: ${pass}/${findings.length} passed  |  ${fail} failed`);
  console.log(`NOTE: These are in-process mocked tests. No DB or network was accessed.`);

  if (failures.length > 0) {
    console.log(`\nFAILURES:`);
    failures.forEach(f => console.log(`  ✗ ${f}`));
    process.exit(1);
  } else {
    console.log(`\nAll handler unit tests passed.`);
  }
}

run().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
