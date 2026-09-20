/**
 * CHECKOUT-P8 — Unit tests for idempotency logic
 *
 * Run with: npx tsx scripts/factory/__tests__/p8-idempotency.ts
 *
 * Tests handleOrder() with a mock OrderDb — no real Supabase connection.
 * All scenarios listed in the P8 spec are covered.
 *
 * DATABASE CONCURRENCY: The unique-constraint behaviour under true concurrent
 * load is NOT verified here.  The concurrent-conflict test (T14) mocks the
 * database returning a 23505 error to confirm the code path executes
 * correctly, but this does not prove atomicity.  Mark: UNVERIFIED (DB
 * concurrency) — requires a disposable local PostgreSQL instance.
 *
 * SECURITY NOTE: ORDER_RECEIPT_SECRET is set to an in-process test value
 * only.  No production credential is read or written.
 */

// ── Polyfill / test environment ──────────────────────────────────────────────

// Provide ORDER_RECEIPT_SECRET for receipt token signing in tests.
process.env.ORDER_RECEIPT_SECRET =
  "p8-unit-test-secret-never-used-in-production-32!";

// ── Imports ───────────────────────────────────────────────────────────────────

import { handleOrder, type OrderDb } from "@/app/api/orders/route";
import {
  computePayloadFingerprint,
  extractFingerprintInputs,
  validateIdempotencyKey,
} from "@/app/lib/commerce/idempotency";
import {
  signReceiptToken,
  verifyReceiptToken,
} from "@/app/lib/receiptToken";

// verifyReceiptToken signature: (token: string, expectedRef: string) → throws on failure

// ── Harness ───────────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;
const failures: string[] = [];

function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  return Promise.resolve()
    .then(fn)
    .then(() => {
      passed++;
      console.log(`  [PASS] ${name}`);
    })
    .catch((err: unknown) => {
      failed++;
      const msg = err instanceof Error ? err.message : String(err);
      failures.push(`${name}: ${msg}`);
      console.log(`  [FAIL] ${name}: ${msg}`);
    });
}

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

function assertEqual<T>(actual: T, expected: T, label: string): void {
  if (actual !== expected) {
    throw new Error(`${label} — expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

// ── Mock factories ────────────────────────────────────────────────────────────

const KEY_1          = "11111111-1111-4111-8111-111111111111";
const KEY_2          = "22222222-2222-4222-8222-222222222222";
const KEY_1_UPPER    = "11111111-1111-4111-8111-111111111111".toUpperCase();
const KEY_1_MIXED    = "11111111-1111-4111-8111-111111111111"
                         .split("").map((c, i) => i % 2 ? c.toUpperCase() : c).join("");

// Minimal valid order body that passes validateOrderBody.
// Prices must match catalogue — uses 'sauvage-inspired' 5ml = R60.
const VALID_BODY = {
  customer_name: "Jane Smith",
  phone:         "0821234567",
  address:       "12 Test St, Cape Town",
  province:      "Cape Town Metro",
  items: [{ id: "sauvage-inspired", title: "Sauvage Inspired", price: 60, quantity: 1, size: "5ml" }],
  subtotal: 60,
  delivery: 100,
  total:    160,
};

function fingerprint(body: Record<string, unknown>): string {
  const inputs = extractFingerprintInputs(body);
  if (!inputs) throw new Error("extractFingerprintInputs returned null for VALID_BODY");
  return computePayloadFingerprint(inputs);
}

// Mock that succeeds on insert with no existing order.
function makeSuccessDb(): OrderDb & { insertCalls: number } {
  let insertCalls = 0;
  return {
    get insertCalls() { return insertCalls; },
    insertOrder: async () => { insertCalls++; return { error: null }; },
    findByIdempotencyKey: async () => ({ data: null, error: null }),
  };
}

// Mock with an existing order matching the given fingerprint.
function makeRecoveryDb(orderRef: string, fp: string): OrderDb & { insertCalls: number } {
  let insertCalls = 0;
  return {
    get insertCalls() { return insertCalls; },
    insertOrder: async () => { insertCalls++; return { error: null }; },
    findByIdempotencyKey: async () => ({
      data:  { order_ref: orderRef, payload_fingerprint: fp },
      error: null,
    }),
  };
}

// Mock that simulates a concurrent unique-constraint violation on insert,
// then returns the committed row on the post-conflict lookup.
function makeConcurrentConflictDb(orderRef: string, fp: string): OrderDb {
  let insertCalled = false;
  return {
    insertOrder: async () => {
      insertCalled = true;
      return {
        error: {
          code:    "23505",
          message: "duplicate key value violates unique constraint idempotency_key",
          details: "Key (idempotency_key)=(uuid) already exists.",
        },
      };
    },
    findByIdempotencyKey: async () => {
      // First call (pre-insert check): no row found.
      // Second call (post-conflict recovery): row found.
      if (!insertCalled) return { data: null, error: null };
      return {
        data:  { order_ref: orderRef, payload_fingerprint: fp },
        error: null,
      };
    },
  };
}

// Mock that returns an error from findByIdempotencyKey.
function makeLookupErrorDb(): OrderDb & { insertCalls: number } {
  let insertCalls = 0;
  return {
    get insertCalls() { return insertCalls; },
    insertOrder: async () => { insertCalls++; return { error: null }; },
    findByIdempotencyKey: async () => ({
      data:  null,
      error: new Error("Simulated DB lookup error"),
    }),
  };
}

// Mock where findByIdempotencyKey throws.
function makeLookupThrowDb(): OrderDb {
  return {
    insertOrder: async () => ({ error: null }),
    findByIdempotencyKey: async () => {
      throw new Error("Simulated lookup exception");
    },
  };
}

// Mock with no findByIdempotencyKey method.
function makeLegacyDb(): OrderDb {
  return {
    insertOrder: async () => ({ error: null }),
    // no findByIdempotencyKey
  };
}

// Mock that returns a non-idempotency unique constraint violation.
function makeOtherUniqueViolationDb(): OrderDb {
  return {
    insertOrder: async () => ({
      error: {
        code:    "23505",
        message: "duplicate key value violates unique constraint orders_order_ref_key",
        details: "Key (order_ref)=(MSR-20260920-12345) already exists.",
      },
    }),
    findByIdempotencyKey: async () => ({ data: null, error: null }),
  };
}

// Mock that fails insert with a non-constraint error.
function makeInsertFailDb(): OrderDb {
  return {
    insertOrder: async () => ({ error: new Error("network timeout") }),
    findByIdempotencyKey: async () => ({ data: null, error: null }),
  };
}

// Mock with mismatched fingerprint — simulates changed intent.
function makeMismatchDb(orderRef: string): OrderDb & { insertCalls: number } {
  let insertCalls = 0;
  return {
    get insertCalls() { return insertCalls; },
    insertOrder: async () => { insertCalls++; return { error: null }; },
    findByIdempotencyKey: async () => ({
      data:  { order_ref: orderRef, payload_fingerprint: "000000000000dead0000000000000000000000000000000000000000000000ff" },
      error: null,
    }),
  };
}

// ── Helper: extract JSON from a NextResponse ──────────────────────────────────

async function json(r: Response): Promise<Record<string, unknown>> {
  return r.json() as Promise<Record<string, unknown>>;
}

// ── Tests ─────────────────────────────────────────────────────────────────────

async function main() {

// T01: Legacy client (no key) — normal insert succeeds.
await test("T01 legacy client (no key) — insert succeeds → 200", async () => {
  const body = { ...VALID_BODY };  // no checkout_attempt_key
  const r = await handleOrder(body, makeSuccessDb());
  const d = await json(r);
  assertEqual(r.status, 200, "status");
  assertEqual(d.success as boolean, true, "success");
  assert(typeof d.orderRef === "string", "orderRef is string");
  assertEqual(d.recovered as boolean | undefined, undefined, "not a recovery");
});

// T02: Keyed new order — insert succeeds.
await test("T02 keyed new order — insert succeeds → 200", async () => {
  const body = { ...VALID_BODY, checkout_attempt_key: KEY_1 };
  const r = await handleOrder(body, makeSuccessDb());
  const d = await json(r);
  assertEqual(r.status, 200, "status");
  assertEqual(d.success as boolean, true, "success");
  assert(typeof d.orderRef === "string", "orderRef present");
  assertEqual(d.recovered as boolean | undefined, undefined, "not a recovery");
});

// T03: Retry recovery — same key, same fingerprint → 200 recovered.
await test("T03 retry recovery — same key, same fingerprint → 200 recovered", async () => {
  const fp = fingerprint(VALID_BODY);
  const db = makeRecoveryDb("MSR-TEST-99001", fp);
  const body = { ...VALID_BODY, checkout_attempt_key: KEY_1 };
  const r = await handleOrder(body, db);
  const d = await json(r);
  assertEqual(r.status, 200, "status");
  assertEqual(d.success as boolean, true, "success");
  assertEqual(d.orderRef as string, "MSR-TEST-99001", "original orderRef");
  assertEqual(d.recovered as boolean, true, "recovered flag");
  assertEqual(db.insertCalls, 0, "ZERO insertOrder calls on recovery");
});

// T04: Changed customer name → 409.
await test("T04 changed name → 409", async () => {
  const fp = fingerprint(VALID_BODY);
  const db = makeRecoveryDb("MSR-TEST-99002", fp);
  const body = { ...VALID_BODY, customer_name: "John Different", checkout_attempt_key: KEY_1 };
  const r = await handleOrder(body, db);
  assertEqual(r.status, 409, "status");
  const d = await json(r);
  assertEqual(d.success as boolean, false, "success=false");
  assertEqual(db.insertCalls, 0, "ZERO insertOrder calls on mismatch");
});

// T05: Changed phone → 409.
await test("T05 changed phone → 409", async () => {
  const fp = fingerprint(VALID_BODY);
  const db = makeRecoveryDb("MSR-TEST-99003", fp);
  const body = { ...VALID_BODY, phone: "0831234567", checkout_attempt_key: KEY_1 };
  const r = await handleOrder(body, db);
  assertEqual(r.status, 409, "status");
  assertEqual(db.insertCalls, 0, "ZERO insertOrder calls on phone mismatch");
});

// T06: Changed address → 409.
await test("T06 changed address → 409", async () => {
  const fp = fingerprint(VALID_BODY);
  const db = makeRecoveryDb("MSR-TEST-99004", fp);
  const body = { ...VALID_BODY, address: "99 New Road, Durban", checkout_attempt_key: KEY_1 };
  const r = await handleOrder(body, db);
  assertEqual(r.status, 409, "status");
  assertEqual(db.insertCalls, 0, "ZERO insertOrder calls on address mismatch");
});

// T07: Changed province → 409.
await test("T07 changed province → 409", async () => {
  const fp = fingerprint(VALID_BODY);
  const db = makeRecoveryDb("MSR-TEST-99005", fp);
  const body = {
    ...VALID_BODY,
    province:  "Gauteng",
    delivery:  180,
    total:     240,
    checkout_attempt_key: KEY_1,
  };
  const r = await handleOrder(body, db);
  assertEqual(r.status, 409, "status");
  assertEqual(db.insertCalls, 0, "ZERO insertOrder calls on province mismatch");
});

// T08: Changed items → 409.
await test("T08 changed items → 409", async () => {
  const fp = fingerprint(VALID_BODY);
  const db = makeRecoveryDb("MSR-TEST-99006", fp);
  const body = {
    ...VALID_BODY,
    items: [
      { id: "sauvage-inspired", title: "Sauvage Inspired", price: 60, quantity: 2, size: "5ml" },
    ],
    subtotal: 120,
    total:    220,
    checkout_attempt_key: KEY_1,
  };
  const r = await handleOrder(body, db);
  assertEqual(r.status, 409, "status");
  assertEqual(db.insertCalls, 0, "ZERO insertOrder calls on items mismatch");
});

// T09: Price change recovery — same intent, different catalogue prices.
// The recovery path bypasses validateOrderBody so this returns 200 even
// though the submitted totals would now fail server-side price revalidation.
await test("T09 price change recovery — same fingerprint, wrong totals → 200 recovered", async () => {
  const fp = fingerprint(VALID_BODY);
  const db = makeRecoveryDb("MSR-TEST-99007", fp);
  // Submit with the original totals even if prices have hypothetically changed.
  // The recovery path returns before validateOrderBody is called.
  const body = {
    ...VALID_BODY,
    // Deliberately mismatched totals to prove validateOrderBody is skipped.
    subtotal: 999,
    total:    1099,
    checkout_attempt_key: KEY_1,
  };
  const r = await handleOrder(body, db);
  const d = await json(r);
  assertEqual(r.status, 200, "status");
  assertEqual(d.recovered as boolean, true, "recovered");
  assertEqual(d.orderRef as string, "MSR-TEST-99007", "original orderRef");
  assertEqual(db.insertCalls, 0, "ZERO insertOrder calls on recovery");
});

// T10: Invalid supplied key → 400.
await test("T10 invalid key (not UUID v4) → 400", async () => {
  const body = { ...VALID_BODY, checkout_attempt_key: "not-a-uuid" };
  const r = await handleOrder(body, makeSuccessDb());
  assertEqual(r.status, 400, "status");
  const d = await json(r);
  assertEqual(d.success as boolean, false, "success=false");
  assert(
    (d.message as string).toLowerCase().includes("invalid") ||
    (d.message as string).toLowerCase().includes("key"),
    "message mentions key",
  );
});

// T10b: Empty-string key → 400.
await test("T10b empty string key → 400", async () => {
  const body = { ...VALID_BODY, checkout_attempt_key: "" };
  const r = await handleOrder(body, makeSuccessDb());
  assertEqual(r.status, 400, "status");
});

// T10c: Numeric key → 400.
await test("T10c numeric key → 400", async () => {
  const body = { ...VALID_BODY, checkout_attempt_key: 12345 };
  const r = await handleOrder(body, makeSuccessDb());
  assertEqual(r.status, 400, "status");
});

// T11: Lookup returns an error object → 503.
await test("T11 lookup error → 503", async () => {
  const db = makeLookupErrorDb();
  const body = { ...VALID_BODY, checkout_attempt_key: KEY_1 };
  const r = await handleOrder(body, db);
  assertEqual(r.status, 503, "status");
  assertEqual(db.insertCalls, 0, "ZERO insertOrder calls on lookup failure");
});

// T12: Lookup throws → 503.
await test("T12 lookup throws → 503", async () => {
  const body = { ...VALID_BODY, checkout_attempt_key: KEY_1 };
  const r = await handleOrder(body, makeLookupThrowDb());
  assertEqual(r.status, 503, "status");
});

// T13: findByIdempotencyKey missing on adapter with a keyed request → 503.
await test("T13 no findByIdempotencyKey + keyed request → 503", async () => {
  const body = { ...VALID_BODY, checkout_attempt_key: KEY_1 };
  const r = await handleOrder(body, makeLegacyDb());
  assertEqual(r.status, 503, "status");
});

// T14: Concurrent conflict on insert (23505 on idempotency_key) → recovery.
// NOTE: this tests the code path only — actual DB-level atomicity is
// UNVERIFIED (requires a disposable local PostgreSQL instance).
await test("T14 concurrent idempotency conflict on insert → recovery [CODE PATH ONLY]", async () => {
  const fp = fingerprint(VALID_BODY);
  const db = makeConcurrentConflictDb("MSR-TEST-99008", fp);
  const body = { ...VALID_BODY, checkout_attempt_key: KEY_1 };
  const r = await handleOrder(body, db);
  const d = await json(r);
  assertEqual(r.status, 200, "status");
  assertEqual(d.recovered as boolean, true, "recovered");
  assertEqual(d.orderRef as string, "MSR-TEST-99008", "orderRef from race winner");
});

// T15: Non-idempotency unique constraint on insert → 500.
await test("T15 non-idempotency unique violation → 500", async () => {
  const body = { ...VALID_BODY, checkout_attempt_key: KEY_1 };
  const db = makeOtherUniqueViolationDb();
  const r = await handleOrder(body, db);
  assertEqual(r.status, 500, "status");
});

// T16: Pre-save insert failure (non-constraint) → 500; retry valid.
// Verifies that a failed insert (no row written) returns 500 and does not
// permanently block retries.  A subsequent retry (new call to handleOrder
// with the same key and no committed row) proceeds to insert again.
await test("T16 insert fails (non-constraint) → 500; retry proceeds normally", async () => {
  const body = { ...VALID_BODY, checkout_attempt_key: KEY_1 };
  const firstDb = makeInsertFailDb();
  const r1 = await handleOrder(body, firstDb);
  assertEqual(r1.status, 500, "first attempt status");

  // On retry, no row was committed so findByIdempotencyKey returns null → fresh insert.
  const retryDb = makeSuccessDb();
  const r2 = await handleOrder(body, retryDb);
  const d2 = await json(r2);
  assertEqual(r2.status, 200, "retry status");
  assertEqual(d2.success as boolean, true, "retry success");
});

// T17: Explicit null key → 400 (not legacy path).
// Only an OMITTED field (undefined) qualifies for the legacy path.
// An explicit null is an invalid supplied value and must be rejected.
await test("T17 explicit null key → invalid → 400", async () => {
  const body = { ...VALID_BODY, checkout_attempt_key: null };
  const r = await handleOrder(body, makeLegacyDb());
  assertEqual(r.status, 400, "status");
  const d = await json(r);
  assertEqual(d.success as boolean, false, "success=false");
});

// T18: Absent key (undefined, field not present) → legacy path.
await test("T18 absent key (field not present) → legacy path → 200", async () => {
  const body: Record<string, unknown> = { ...VALID_BODY };
  delete body.checkout_attempt_key;
  const r = await handleOrder(body, makeLegacyDb());
  const d = await json(r);
  assertEqual(r.status, 200, "status");
  assertEqual(d.success as boolean, true, "success");
});

// T19: Uppercase / mixed-case UUID → normalized to lowercase → matched as recovery.
// The client may send uppercase UUIDs (crypto.randomUUID() is spec-lowercase
// but the behaviour is implementation-defined). The server normalizes before
// lookup so a stored lowercase key matches.
await test("T19 uppercase UUID normalized to lowercase → recovery succeeds", async () => {
  const fp = fingerprint(VALID_BODY);
  // Store a lowercase key, submit uppercase — must still match.
  const db = makeRecoveryDb("MSR-TEST-99009", fp);
  const body = { ...VALID_BODY, checkout_attempt_key: KEY_1_UPPER };
  const r = await handleOrder(body, db);
  const d = await json(r);
  assertEqual(r.status, 200, "status");
  assertEqual(d.recovered as boolean, true, "recovered after uppercase normalization");
  assertEqual(d.orderRef as string, "MSR-TEST-99009", "original orderRef");
  assertEqual(db.insertCalls, 0, "ZERO insertOrder calls after normalization");
});

// T20: Mismatch intent with recovery db → 409, ZERO inserts.
await test("T20 mismatch fingerprint → 409, zero insertOrder calls", async () => {
  const db = makeMismatchDb("MSR-TEST-99010");
  const body = { ...VALID_BODY, checkout_attempt_key: KEY_1 };
  const r = await handleOrder(body, db);
  assertEqual(r.status, 409, "status");
  assertEqual(db.insertCalls, 0, "ZERO insertOrder calls on mismatch");
});

// T21: Recovery path — ZERO insertOrder calls (confirmed via instrumented mock).
await test("T21 recovery path — confirmed zero insertOrder calls", async () => {
  const fp = fingerprint(VALID_BODY);
  const db = makeRecoveryDb("MSR-TEST-99011", fp);
  const body = { ...VALID_BODY, checkout_attempt_key: KEY_1 };
  await handleOrder(body, db);
  assertEqual(db.insertCalls, 0, "insertOrder must NOT be called on recovery");
});

// T22: Lookup failure → 503, ZERO insertOrder calls.
await test("T22 lookup failure → 503, zero insertOrder calls", async () => {
  const db = makeLookupErrorDb();
  const body = { ...VALID_BODY, checkout_attempt_key: KEY_1 };
  const r = await handleOrder(body, db);
  assertEqual(r.status, 503, "status");
  assertEqual(db.insertCalls, 0, "insertOrder must NOT be called when lookup fails");
});

// ── Fingerprint unit tests ────────────────────────────────────────────────────

await test("FP01 same inputs produce same fingerprint", () => {
  const fp1 = fingerprint(VALID_BODY);
  const fp2 = fingerprint(VALID_BODY);
  assertEqual(fp1, fp2, "fingerprints equal");
});

await test("FP02 item order does not affect fingerprint", () => {
  const body1 = {
    ...VALID_BODY,
    items: [
      { id: "a-product", title: "A", price: 60, quantity: 1, size: "5ml" },
      { id: "b-product", title: "B", price: 77, quantity: 1, size: "10ml" },
    ],
  };
  const body2 = {
    ...VALID_BODY,
    items: [
      { id: "b-product", title: "B", price: 77, quantity: 1, size: "10ml" },
      { id: "a-product", title: "A", price: 60, quantity: 1, size: "5ml" },
    ],
  };
  const fp1 = fingerprint(body1);
  const fp2 = fingerprint(body2);
  assertEqual(fp1, fp2, "order-independent fingerprint");
});

await test("FP03 duplicate line items merged before fingerprinting (KI-04)", () => {
  const body1 = {
    ...VALID_BODY,
    items: [
      { id: "sauvage-inspired", title: "S", price: 60, quantity: 1, size: "5ml" },
      { id: "sauvage-inspired", title: "S", price: 60, quantity: 1, size: "5ml" },
    ],
  };
  const body2 = {
    ...VALID_BODY,
    items: [
      { id: "sauvage-inspired", title: "S", price: 60, quantity: 2, size: "5ml" },
    ],
  };
  const fp1 = fingerprint(body1);
  const fp2 = fingerprint(body2);
  assertEqual(fp1, fp2, "merged fingerprint equals single-line fingerprint");
});

await test("FP04 price change does not affect fingerprint", () => {
  const body1 = { ...VALID_BODY, subtotal: 60,  total: 160 };
  const body2 = { ...VALID_BODY, subtotal: 999, total: 1099 };  // hypothetically repriced
  const fp1 = fingerprint(body1);
  const fp2 = fingerprint(body2);
  assertEqual(fp1, fp2, "price-independent fingerprint");
});

await test("FP05 phone digits-only normalisation", () => {
  const body1 = { ...VALID_BODY, phone: "082 123 4567" };
  const body2 = { ...VALID_BODY, phone: "0821234567" };
  const body3 = { ...VALID_BODY, phone: "082-123-4567" };
  const fp1 = fingerprint(body1);
  const fp2 = fingerprint(body2);
  const fp3 = fingerprint(body3);
  assertEqual(fp1, fp2, "space-stripped phone");
  assertEqual(fp1, fp3, "hyphen-stripped phone");
});

await test("FP06 name case-insensitive normalisation", () => {
  const body1 = { ...VALID_BODY, customer_name: "Jane Smith" };
  const body2 = { ...VALID_BODY, customer_name: "JANE SMITH" };
  const body3 = { ...VALID_BODY, customer_name: "  jane smith  " };
  const fp1 = fingerprint(body1);
  const fp2 = fingerprint(body2);
  const fp3 = fingerprint(body3);
  assertEqual(fp1, fp2, "case-normalised name");
  assertEqual(fp1, fp3, "trimmed name");
});

await test("FP07 address case-insensitive normalisation", () => {
  const body1 = { ...VALID_BODY, address: "12 Test St, Cape Town" };
  const body2 = { ...VALID_BODY, address: "12 TEST ST, CAPE TOWN" };
  const fp1 = fingerprint(body1);
  const fp2 = fingerprint(body2);
  assertEqual(fp1, fp2, "case-normalised address");
});

// ── validateIdempotencyKey unit tests ─────────────────────────────────────────

await test("VK01 valid UUID v4 → { valid: true }", () => {
  const r = validateIdempotencyKey(KEY_1);
  assert(r.valid === true, "valid");
});

await test("VK02 undefined → { valid: false, absent: true }", () => {
  const r = validateIdempotencyKey(undefined);
  assert(!r.valid && r.absent === true, "absent");
});

// Gap 3: only undefined is "absent"; explicit null is invalid → 400.
await test("VK03 null → { valid: false, absent: false } (invalid, not absent)", () => {
  const r = validateIdempotencyKey(null);
  assert(!r.valid && r.absent === false, "null must be invalid (absent:false), not absent (absent:true)");
});

await test("VK04 empty string → { valid: false, absent: false }", () => {
  const r = validateIdempotencyKey("");
  assert(!r.valid && !r.absent, "invalid, not absent");
});

await test("VK05 UUID v1 (not v4) → invalid", () => {
  const uuidV1 = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
  const r = validateIdempotencyKey(uuidV1);
  assert(!r.valid && !r.absent, "v1 rejected");
});

await test("VK06 number → { valid: false, absent: false }", () => {
  const r = validateIdempotencyKey(42);
  assert(!r.valid && !r.absent, "non-string rejected");
});

await test("VK07 uppercase UUID → valid, key normalized to lowercase", () => {
  const r = validateIdempotencyKey(KEY_1_UPPER);
  assert(r.valid === true, "uppercase UUID is valid");
  if (r.valid) {
    assertEqual(r.key, KEY_1.toLowerCase(), "key normalized to lowercase");
  }
});

await test("VK08 mixed-case UUID → valid, key normalized to lowercase", () => {
  const r = validateIdempotencyKey(KEY_1_MIXED);
  assert(r.valid === true, "mixed-case UUID is valid");
  if (r.valid) {
    assertEqual(r.key, KEY_1.toLowerCase(), "key normalized to lowercase");
  }
});

// ── Receipt token tests ───────────────────────────────────────────────────────

await test("RT01 signed receipt token verifies successfully", async () => {
  const ref = "MSR-TEST-RCPT-01";
  const token = await signReceiptToken(ref);
  assert(typeof token === "string" && token.length > 0, "token is a non-empty string");
  // verifyReceiptToken throws on failure — must NOT throw for correct token.
  await verifyReceiptToken(token, ref);
});

await test("RT02 receipt token for wrong ref does not verify", async () => {
  const ref = "MSR-TEST-RCPT-02";
  const token = await signReceiptToken(ref);
  let threw = false;
  try { await verifyReceiptToken(token, "MSR-TEST-RCPT-WRONG"); } catch { threw = true; }
  assert(threw, "token must throw for a different ref");
});

await test("RT03 tampered token does not verify", async () => {
  const ref = "MSR-TEST-RCPT-03";
  const token = await signReceiptToken(ref);
  const tampered = token.slice(0, -4) + "dead";
  let threw = false;
  try { await verifyReceiptToken(tampered, ref); } catch { threw = true; }
  assert(threw, "tampered token must throw");
});

await test("RT04 missing / empty token does not verify", async () => {
  const ref = "MSR-TEST-RCPT-04";
  let threw1 = false;
  let threw2 = false;
  try { await verifyReceiptToken("", ref); } catch { threw1 = true; }
  try { await verifyReceiptToken(null as unknown as string, ref); } catch { threw2 = true; }
  assert(threw1, "empty token must throw");
  assert(threw2, "null token must throw");
});

// ── Summary ───────────────────────────────────────────────────────────────────

  const total = passed + failed;
  console.log(`\n  P8 Unit Tests: ${passed}/${total} passed${failed > 0 ? `, ${failed} failed` : ""}`);
  if (failures.length > 0) {
    console.log("  Failures:");
    for (const f of failures) console.log(`    • ${f}`);
    process.exit(1);
  } else {
    console.log("  All checks passed.");
    console.log("\n  UNVERIFIED: DB-level concurrent unique constraint enforcement (T14 is code-path");
    console.log("  only — requires a disposable local PostgreSQL instance to verify atomicity).");
    console.log("  UNVERIFIED: SUPABASE_SERVICE_ROLE_KEY not present in .env.local — admin lookup");
    console.log("  in the production POST adapter untested in this environment.");
  }

} // end main

main().catch((err) => { console.error(err); process.exit(1); });
