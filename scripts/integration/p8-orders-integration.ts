/**
 * P8 Orders Integration Tests
 * ────────────────────────────────────────────────────────────────────────────
 * Exercises the actual handleOrder and handleGetConfirmation route handlers
 * against a real local Supabase stack (port 54321).
 *
 * Run:  npx supabase start   (once; images already cached)
 *       npx tsx scripts/integration/p8-orders-integration.ts
 *
 * What this tests
 * ───────────────
 * 1. Concurrent same-key POSTs: both calls receive the same order reference
 *    and exactly one row is written to the database.
 *
 * 2. Lost-response recovery: a second POST with the same key and identical
 *    payload returns success:true, recovered:true, with the original ref.
 *    The database still contains exactly one row.
 *
 * 3. Receipt GET:
 *    a. Valid receipt cookie issued by POST → 200 with correct order data.
 *    b. Missing cookie → 401.
 *    c. Tampered signature → 401.
 *    d. Valid cookie for a different order ref → 401.
 *
 * 4. RLS denial: anon Supabase client cannot SELECT an existing order row.
 *    Unexpected DB or connection errors fail the check explicitly.
 *
 * Deviations from production (documented)
 * ────────────────────────────────────────
 * - ORDER_RECEIPT_SECRET is a test-only value; never the production secret.
 * - insertOrder uses the admin client (bypasses RLS) so the local INSERT
 *   policy assumption does not affect handler-level test validity.
 *   The integration test still exercises the full handleOrder validation,
 *   idempotency-key deduplication, fingerprint computation, and receipt-
 *   signing paths via the actual application code.
 * - Local schema uses BIGSERIAL id; production may use UUID.
 *   The id column is unused by all API routes (order_ref is the key).
 *
 * Product fixture
 * ───────────────
 * Uses acqua-di-gio-parfum-inspired (5ml, R60 retail) + Cape Town Metro
 * delivery (R100) = R160 total.  These values must match catalogue prices
 * because validateOrderBody recomputes server-side and rejects mismatches.
 */

// ── Env vars: must be set BEFORE any app module is dynamically imported ──────
// All relevant app modules read these lazily (at call time, not load time).
// Dynamic imports inside main() guarantee this ordering even in CJS mode.

const LOCAL_URL         = "http://127.0.0.1:54321";
const LOCAL_ANON_KEY    =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
  "eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9." +
  "CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0";
const LOCAL_SERVICE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
  "eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0." +
  "EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU";

process.env.ORDER_RECEIPT_SECRET          = "p8-integration-test-secret";
process.env.NEXT_PUBLIC_SUPABASE_URL      = LOCAL_URL;
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = LOCAL_ANON_KEY;
process.env.SUPABASE_SERVICE_ROLE_KEY     = LOCAL_SERVICE_KEY;

// ── Static imports that do NOT read env vars at load time ────────────────────
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { randomUUID }                         from "crypto";

// TypeScript-only: erased at runtime, no module loading.
import type { OrderDb }        from "@/app/api/orders/route";
import type { ConfirmationDb } from "@/app/api/orders/[ref]/route";

// ── Test payload constants ────────────────────────────────────────────────────

// One item: acqua-di-gio-parfum-inspired 5ml → R60 (retail, cartCount=1 < wholesale threshold 10)
// Cape Town Metro delivery → R100.  Server-recomputed total must be R160.
const FIXTURE_ITEM = {
  id:       "acqua-di-gio-parfum-inspired",
  title:    "Acqua Di Gio Parfum Inspired",
  quantity: 1,
  size:     "5ml",
  price:    60,   // client-submitted price (server ignores this; recomputes from catalogue)
};

function orderPayload(key: string, overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    customer_name:        "Integration Tester",
    phone:                "0821234567",
    address:              "1 Integration Road, Cape Town",
    province:             "Cape Town Metro",
    items:                [FIXTURE_ITEM],
    subtotal:             60,
    delivery:             100,
    total:                160,
    checkout_attempt_key: key,
    ...overrides,
  };
}

// ── Supabase clients ──────────────────────────────────────────────────────────

// Admin client: service_role key, bypasses RLS.
// Used for insertOrder (matches the anon INSERT policy assumption in the base
// migration) and for findByIdempotencyKey (matches production which uses admin).
// Also used for cleanup and for the confirmation DB adapter.
const admin = createClient(LOCAL_URL, LOCAL_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Anon client: used only in the RLS denial check (check 4).
const anon = createClient(LOCAL_URL, LOCAL_ANON_KEY, {
  auth: { persistSession: false },
});

// ── DB adapters ───────────────────────────────────────────────────────────────

function makeOrderDb(db: SupabaseClient): OrderDb {
  return {
    insertOrder: async (row) => db.from("orders").insert([row]),
    findByIdempotencyKey: async (key) => {
      const result = await db
        .from("orders")
        .select("order_ref, payload_fingerprint")
        .eq("idempotency_key", key)
        .maybeSingle();
      return result as {
        data: { order_ref: string; payload_fingerprint: string | null } | null;
        error: unknown;
      };
    },
  };
}

function makeConfirmationDb(db: SupabaseClient): ConfirmationDb {
  return {
    getOrderConfirmation: async (ref) => {
      const { data, error } = await db
        .from("orders")
        .select("order_ref, total, payment_status")
        .eq("order_ref", ref)
        .maybeSingle();
      return {
        data: data as { order_ref: string; total: number; payment_status: string } | null,
        error,
      };
    },
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

type Pass = { ok: true };
type Fail = { ok: false; reason: string };
type Result = Pass | Fail;

const pass = (): Pass => ({ ok: true });
const fail = (reason: string): Fail => ({ ok: false, reason });

async function jsonBody(r: Response): Promise<Record<string, unknown>> {
  try   { return await r.clone().json() as Record<string, unknown>; }
  catch { return {}; }
}

/**
 * Extracts the receipt token value from the Set-Cookie header of a POST
 * response.  NextResponse.cookies.set() writes a Set-Cookie header; this
 * parses out the value for the named cookie.
 */
function extractReceiptToken(response: Response, orderRef: string): string | null {
  const cookieName = `msr_receipt_${orderRef}`;
  // Use getSetCookie() (Node 20+) for multi-value safety; fall back to get().
  const cookieHeaders: string[] =
    typeof (response.headers as Record<string, unknown>).getSetCookie === "function"
      ? (response.headers as unknown as { getSetCookie(): string[] }).getSetCookie()
      : [response.headers.get("set-cookie") ?? ""].filter(Boolean);

  for (const header of cookieHeaders) {
    const prefix = `${cookieName}=`;
    const idx    = header.indexOf(prefix);
    if (idx === -1) continue;
    const start = idx + prefix.length;
    const end   = header.indexOf(";", start);
    return end === -1 ? header.slice(start) : header.slice(start, end);
  }
  return null;
}

/** Flip one character in the HMAC signature to produce an invalid token. */
function tamperToken(token: string): string {
  const lastDot = token.lastIndexOf(".");
  if (lastDot === -1) return token + "X";
  const sig     = token.slice(lastDot + 1);
  const flipped = sig.slice(0, -1) + (sig.endsWith("A") ? "B" : "A");
  return token.slice(0, lastDot + 1) + flipped;
}

async function rowCount(key: string): Promise<number> {
  const { data } = await admin
    .from("orders")
    .select("order_ref")
    .eq("idempotency_key", key);
  return data?.length ?? 0;
}

async function deleteByKey(key: string): Promise<void> {
  await admin.from("orders").delete().eq("idempotency_key", key);
}

async function deleteByRef(ref: string): Promise<void> {
  await admin.from("orders").delete().eq("order_ref", ref);
}

// ── Check 1: Concurrent same-key POSTs ───────────────────────────────────────

async function check1_concurrent(
  handleOrder: typeof import("@/app/api/orders/route").handleOrder,
): Promise<Result> {
  const key = randomUUID();
  const db  = makeOrderDb(admin);

  try {
    const [r1, r2] = await Promise.all([
      handleOrder(orderPayload(key), db),
      handleOrder(orderPayload(key), db),
    ]);

    const [b1, b2] = await Promise.all([jsonBody(r1), jsonBody(r2)]);

    // Both responses must be HTTP 200 with success:true
    if (r1.status !== 200) return fail(`r1 status ${r1.status}: ${b1.message}`);
    if (r2.status !== 200) return fail(`r2 status ${r2.status}: ${b2.message}`);
    if (!b1.success)       return fail(`r1 success=false: ${b1.message}`);
    if (!b2.success)       return fail(`r2 success=false: ${b2.message}`);

    // Both must return the same orderRef
    const ref1 = b1.orderRef as string | undefined;
    const ref2 = b2.orderRef as string | undefined;
    if (!ref1 || !ref2)      return fail(`Missing orderRef (r1=${ref1}, r2=${ref2})`);
    if (ref1 !== ref2)        return fail(`orderRef mismatch: ${ref1} vs ${ref2}`);

    // Exactly one DB row
    const count = await rowCount(key);
    if (count !== 1)          return fail(`DB row count = ${count}, expected 1`);

    // One response is fresh (no recovered flag), one is a race-recovery
    const freshCount     = [b1, b2].filter(b => !b.recovered).length;
    const recoveredCount = [b1, b2].filter(b =>  b.recovered).length;
    if (freshCount !== 1 || recoveredCount !== 1)
      return fail(`Expected 1 fresh + 1 recovered; got fresh=${freshCount} recovered=${recoveredCount}`);

    return pass();
  } finally {
    await deleteByKey(key);
  }
}

// ── Check 2: Lost-response recovery ──────────────────────────────────────────

async function check2_recovery(
  handleOrder: typeof import("@/app/api/orders/route").handleOrder,
): Promise<Result> {
  const key = randomUUID();
  const db  = makeOrderDb(admin);

  try {
    // First POST: committed, response "lost"
    const r1 = await handleOrder(orderPayload(key), db);
    const b1 = await jsonBody(r1);
    if (r1.status !== 200 || !b1.success) return fail(`First POST failed ${r1.status}: ${b1.message}`);

    const originalRef = b1.orderRef as string;

    // Second POST: same key, same payload → recovery
    const r2 = await handleOrder(orderPayload(key), db);
    const b2 = await jsonBody(r2);
    if (r2.status !== 200) return fail(`Recovery POST status ${r2.status}: ${b2.message}`);
    if (!b2.success)       return fail(`Recovery POST success=false: ${b2.message}`);
    if (!b2.recovered)     return fail(`Recovery POST missing recovered:true (got ${JSON.stringify(b2)})`);
    if (b2.orderRef !== originalRef)
      return fail(`Recovery returned different ref: ${b2.orderRef} vs original ${originalRef}`);

    // DB still has exactly one row
    const count = await rowCount(key);
    if (count !== 1) return fail(`DB row count after recovery = ${count}, expected 1`);

    return pass();
  } finally {
    await deleteByKey(key);
  }
}

// ── Check 3: Receipt GET ──────────────────────────────────────────────────────

async function check3_receipt(
  handleOrder:         typeof import("@/app/api/orders/route").handleOrder,
  handleGetConfirmation: typeof import("@/app/api/orders/[ref]/route").handleGetConfirmation,
  signReceiptToken:    typeof import("@/app/lib/receiptToken").signReceiptToken,
): Promise<Result> {
  const key       = randomUUID();
  const orderDb   = makeOrderDb(admin);
  const confirmDb = makeConfirmationDb(admin);

  try {
    // Successful POST → extract receipt cookie
    const postResp = await handleOrder(orderPayload(key), orderDb);
    const postBody = await jsonBody(postResp);
    if (postResp.status !== 200 || !postBody.success)
      return fail(`Setup POST failed ${postResp.status}: ${postBody.message}`);

    const ref   = postBody.orderRef as string;
    const token = extractReceiptToken(postResp, ref);
    if (!token) return fail(`No receipt cookie in POST response for ref ${ref}`);

    // 3a: Valid token → 200 with correct data
    const getValid = await handleGetConfirmation(ref, token, confirmDb);
    if (getValid.status !== 200) {
      const b = await jsonBody(getValid);
      return fail(`Valid receipt GET returned ${getValid.status}: ${b.message}`);
    }
    const validData = await jsonBody(getValid);
    if (validData.orderRef !== ref)    return fail(`orderRef mismatch: ${validData.orderRef}`);
    if (Number(validData.total) !== 160) return fail(`total ${validData.total}, expected 160`);
    if (validData.paymentStatus !== "awaiting_payment")
      return fail(`paymentStatus: ${validData.paymentStatus}`);

    // 3b: Missing token → 401
    const getMissing = await handleGetConfirmation(ref, null, confirmDb);
    if (getMissing.status !== 401)
      return fail(`Missing token: expected 401, got ${getMissing.status}`);

    // 3c: Tampered signature → 401
    const getTampered = await handleGetConfirmation(ref, tamperToken(token), confirmDb);
    if (getTampered.status !== 401)
      return fail(`Tampered token: expected 401, got ${getTampered.status}`);

    // 3d: Valid token for a different (non-existent) ref → 401
    const otherRef   = `MSR-00000000-99999`;
    const otherToken = await signReceiptToken(otherRef);
    const getWrong   = await handleGetConfirmation(ref, otherToken, confirmDb);
    if (getWrong.status !== 401)
      return fail(`Wrong-order token: expected 401, got ${getWrong.status}`);

    return pass();
  } finally {
    await deleteByKey(key);
  }
}

// ── Check 4: RLS denial ───────────────────────────────────────────────────────

async function check4_rls(handleOrder: typeof import("@/app/api/orders/route").handleOrder): Promise<Result> {
  // Insert a known row directly via admin
  const ref = `MSR-${new Date().toISOString().slice(0,10).replace(/-/g,"")}` +
               `-${Math.floor(10000 + Math.random() * 90000)}`;
  const { error: insertErr } = await admin.from("orders").insert([{
    order_ref:      ref,
    customer_name:  "RLS Test",
    phone:          "0821234567",
    address:        "RLS Road",
    province:       "Cape Town Metro",
    items:          [],
    subtotal:       0,
    vat:            0,
    delivery:       0,
    total:          0,
    payment_status: "awaiting_payment",
    status_history: [],
  }]);
  if (insertErr) return fail(`Setup insert failed: ${insertErr.message}`);

  try {
    // Anon client SELECT — RLS should return zero rows (no public SELECT policy)
    const { data, error } = await anon
      .from("orders")
      .select("order_ref")
      .eq("order_ref", ref);

    if (error) {
      // A permission error is also acceptable and confirms denial
      const code = (error as Record<string, unknown>).code;
      if (code === "42501" || code === "PGRST301") return pass();
      // Any OTHER error is unexpected — fail explicitly
      return fail(`Unexpected anon query error: code=${code} message=${error.message}`);
    }

    if (data && data.length > 0)
      return fail(`Anon client returned ${data.length} row(s) — RLS not enforced`);

    // data === [] — row was silently filtered by RLS
    return pass();
  } finally {
    await deleteByRef(ref);
  }
}

// ── Runner ────────────────────────────────────────────────────────────────────

async function main() {
  // Dynamic imports: guarantee env vars are set before app modules load.
  // This is belt-and-suspenders — all reads are lazy anyway, but the explicit
  // ordering removes any ambiguity for modules that might change in future.
  const { handleOrder }            = await import("@/app/api/orders/route");
  const { handleGetConfirmation }  = await import("@/app/api/orders/[ref]/route");
  const { signReceiptToken }       = await import("@/app/lib/receiptToken");

  const checks: Array<[string, () => Promise<Result>]> = [
    [
      "1. Concurrent same-key POSTs → same ref, one DB row",
      () => check1_concurrent(handleOrder),
    ],
    [
      "2. Lost-response recovery → recovered:true, original ref, one DB row",
      () => check2_recovery(handleOrder),
    ],
    [
      "3. Receipt GET → valid 200 / missing 401 / tampered 401 / wrong-ref 401",
      () => check3_receipt(handleOrder, handleGetConfirmation, signReceiptToken),
    ],
    [
      "4. RLS denial → anon client cannot SELECT existing order",
      () => check4_rls(handleOrder),
    ],
  ];

  let allPassed = true;
  console.log("\nP8 Orders Integration — local Supabase (http://127.0.0.1:54321)\n");
  console.log("─".repeat(72));

  for (const [label, fn] of checks) {
    let result: Result;
    try {
      result = await fn();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      result = fail(`Unexpected throw: ${msg}`);
    }
    if (result.ok) {
      console.log(`  PASS  ${label}`);
    } else {
      console.log(`  FAIL  ${label}`);
      console.log(`        Reason: ${result.reason}`);
      allPassed = false;
    }
  }

  console.log("─".repeat(72));
  if (allPassed) {
    console.log("\nAll 4 checks passed.\n");
  } else {
    console.log("\nSome checks FAILED — see above.\n");
  }

  process.exit(allPassed ? 0 : 1);
}

main().catch(e => {
  console.error("\nFatal:", e instanceof Error ? e.message : String(e));
  process.exit(1);
});
