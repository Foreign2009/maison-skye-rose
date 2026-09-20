/**
 * P8 Orders HTTP Integration Tests — local Supabase stack
 * ────────────────────────────────────────────────────────────────────────────
 * Starts an isolated Next.js dev server on port 3098 pointed exclusively at
 * local Supabase (127.0.0.1:54321) and a test-only ORDER_RECEIPT_SECRET.
 * All five verification scenarios are exercised via real HTTP fetch() calls
 * against the production POST /api/orders and GET /api/orders/[ref] handlers.
 *
 * No database adapter injection.
 * No mocked routes.
 * No duplicated signing or fingerprint logic.
 * Tokens and cookies come exclusively from server HTTP responses.
 *
 * Prerequisites:
 *   npx supabase start
 *   npx tsx scripts/integration/bootstrap-local.ts
 *
 * Usage:
 *   npx tsx scripts/integration/p8-orders-integration.ts
 *
 * Verified scenarios
 * ──────────────────
 * 1. Concurrent same-key POSTs → same orderRef, exactly one DB row,
 *    one response fresh + one response recovered.
 * 2. Retry after discarding successful response → recovered:true, same
 *    orderRef, exactly one DB row.
 * 3. Receipt cookie from POST authenticates the real receipt GET (200)
 *    and returns correct order data.
 * 4. Missing cookie → 401; tampered token → 401; valid token for a
 *    different orderRef → 401.  (Tokens obtained from real POST responses —
 *    no signing duplication.)
 * 5. Anonymous Supabase client cannot SELECT an existing order row
 *    (database RLS enforced).
 *
 * Safety guard
 * ─────────────
 * The script refuses to run unless local Supabase is reachable at
 * http://127.0.0.1:54321.  LOCAL_URL is hardcoded to that address; it can
 * never accidentally point at the production database.
 *
 * Limitations (documented)
 * ─────────────────────────
 * - ORDER_RECEIPT_SECRET is a test-only value ("p8-integration-test-secret"),
 *   never the production secret.
 * - Local schema id column is BIGSERIAL; production may use UUID.
 *   All routes key on order_ref (TEXT UNIQUE) — type difference is irrelevant.
 * - T8 browser-suite timeout (commit dbc6233): single occurrence during a run
 *   with Supabase containers active; cause UNCONFIRMED (likely resource
 *   contention); second run passed 20/20; not a confirmed defect.
 * - Browser suite tests (dbc6233) exercise the checkout UI via Playwright and
 *   are separate coverage — not a superset of these HTTP route tests.
 * - The concurrent check (scenario 1) may hit either the pre-insert recovery
 *   path (sequential execution) or the post-insert unique-constraint path
 *   (true race).  Both paths produce the same assertions: same ref, one row,
 *   one fresh + one recovered.
 */

import { spawn, type ChildProcess } from "child_process";
import { execSync }                  from "child_process";
import { createClient }              from "@supabase/supabase-js";
import { randomUUID }                from "crypto";

// ── Local stack constants (demo keys — never production values) ───────────────

const LOCAL_URL =         "http://127.0.0.1:54321";
const LOCAL_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
  "eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9." +
  "CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0";
const LOCAL_SERVICE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
  "eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0." +
  "EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU";
const TEST_RECEIPT_SECRET = "p8-integration-test-secret";

const PORT = 3098;
const BASE = `http://localhost:${PORT}`;

// Admin client (service_role): row count checks and cleanup only.
const admin = createClient(LOCAL_URL, LOCAL_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Anon client: used exclusively in the RLS denial check (scenario 5).
const anon = createClient(LOCAL_URL, LOCAL_ANON_KEY, {
  auth: { persistSession: false },
});

// ── Order payload ─────────────────────────────────────────────────────────────
//
// acqua-di-gio-parfum-inspired, size 5ml → R60 retail (cartCount 1 < wholesale
// threshold 10).  Cape Town Metro delivery → R100.
// Server recomputes totals from catalogue; submission must match exactly.

const FIXTURE_ITEM = {
  id:       "acqua-di-gio-parfum-inspired",
  title:    "Acqua Di Gio Parfum Inspired",
  quantity: 1,
  size:     "5ml",
  price:    60,
};

function orderPayload(key: string): Record<string, unknown> {
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
  };
}

// ── Result types ──────────────────────────────────────────────────────────────

type Pass = { ok: true };
type Fail = { ok: false; reason: string };
type Result = Pass | Fail;

const pass = (): Pass => ({ ok: true });
const fail = (reason: string): Fail => ({ ok: false, reason });

// ── Helpers ───────────────────────────────────────────────────────────────────

function postOrder(key: string): Promise<Response> {
  return fetch(`${BASE}/api/orders`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(orderPayload(key)),
  });
}

/**
 * Extracts a named cookie value from a Set-Cookie response header.
 * Uses getSetCookie() on Node 20+ for multi-value header safety.
 */
function extractCookieValue(response: Response, cookieName: string): string | null {
  const headers = response.headers as unknown as Record<string, unknown>;
  const cookieHeaders: string[] =
    typeof headers.getSetCookie === "function"
      ? (headers as { getSetCookie(): string[] }).getSetCookie()
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

/** Flips one character in the HMAC signature to produce an invalid token. */
function tamperToken(token: string): string {
  const lastDot = token.lastIndexOf(".");
  if (lastDot === -1) return token + "X";
  const sig     = token.slice(lastDot + 1);
  const flipped = sig.slice(0, -1) + (sig.endsWith("A") ? "B" : "A");
  return token.slice(0, lastDot + 1) + flipped;
}

async function rowCountByRef(ref: string): Promise<number> {
  const { data } = await admin
    .from("orders")
    .select("order_ref")
    .eq("order_ref", ref);
  return data?.length ?? 0;
}

async function deleteByRef(ref: string): Promise<void> {
  await admin.from("orders").delete().eq("order_ref", ref);
}

// ── Safety guard ──────────────────────────────────────────────────────────────

async function guardLocalOnly(): Promise<void> {
  // LOCAL_URL is hardcoded to 127.0.0.1 — this guard also catches the case
  // where someone edits the constant to point at a remote host.
  if (!LOCAL_URL.includes("127.0.0.1") && !LOCAL_URL.includes("localhost")) {
    throw new Error(
      `SAFETY: LOCAL_URL is not a local address (${LOCAL_URL}). Refusing to run.`,
    );
  }
  try {
    const resp = await fetch(`${LOCAL_URL}/health`);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  } catch (e) {
    throw new Error(
      `Local Supabase is not running at ${LOCAL_URL}.\n` +
      `Run:  npx supabase start\n` +
      `Then: npx tsx scripts/integration/bootstrap-local.ts\n` +
      String(e),
    );
  }
}

// ── Dev server lifecycle ──────────────────────────────────────────────────────

function spawnDevServer(): ChildProcess {
  const env: Record<string, string | undefined> = { ...process.env };
  // Remove any production credentials from the test server's environment.
  delete env.ADMIN_SECRET;
  delete env.PAYFAST_MERCHANT_ID;
  delete env.PAYFAST_MERCHANT_KEY;
  delete env.PAYFAST_PASSPHRASE;
  // Point exclusively at local Supabase with a test-only secret.
  env.PORT                          = String(PORT);
  env.NEXT_PUBLIC_SUPABASE_URL      = LOCAL_URL;
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY = LOCAL_ANON_KEY;
  env.SUPABASE_SERVICE_ROLE_KEY     = LOCAL_SERVICE_KEY;
  env.ORDER_RECEIPT_SECRET          = TEST_RECEIPT_SECRET;
  env.NEXT_TELEMETRY_DISABLED       = "1";

  return spawn("npm", ["run", "dev"], {
    env: env as NodeJS.ProcessEnv,
    stdio:    "pipe",
    cwd:      process.cwd(),
    detached: false,
    shell:    process.platform === "win32",
  });
}

async function waitForServer(timeoutMs = 120_000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      await fetch(BASE, { signal: AbortSignal.timeout(10_000) });
      return;
    } catch {
      await new Promise(r => setTimeout(r, 2_000));
    }
  }
  throw new Error(
    `Dev server at ${BASE} was not ready within ${timeoutMs / 1000}s`,
  );
}

function killServer(proc: ChildProcess): void {
  if (process.platform === "win32" && proc.pid) {
    try {
      execSync(`taskkill /F /T /PID ${proc.pid}`, { stdio: "ignore" });
    } catch { /* already exited */ }
  } else {
    try { proc.kill("SIGTERM"); } catch { /* ignore */ }
  }
}

// ── Scenario 1: Concurrent same-key POSTs ────────────────────────────────────

async function check1_concurrent(): Promise<Result> {
  const key          = randomUUID();
  const cleanupRefs  = new Set<string>();

  try {
    const [r1, r2] = await Promise.all([postOrder(key), postOrder(key)]);
    const [b1, b2] = await Promise.all([
      r1.json() as Promise<Record<string, unknown>>,
      r2.json() as Promise<Record<string, unknown>>,
    ]);

    // Collect all returned refs for cleanup before any assertion.
    if (typeof b1.orderRef === "string") cleanupRefs.add(b1.orderRef);
    if (typeof b2.orderRef === "string") cleanupRefs.add(b2.orderRef);

    if (r1.status !== 200) return fail(`r1 HTTP ${r1.status}: ${b1.message}`);
    if (r2.status !== 200) return fail(`r2 HTTP ${r2.status}: ${b2.message}`);
    if (!b1.success)       return fail(`r1 success=false: ${b1.message}`);
    if (!b2.success)       return fail(`r2 success=false: ${b2.message}`);

    const ref1 = b1.orderRef as string | undefined;
    const ref2 = b2.orderRef as string | undefined;
    if (!ref1 || !ref2) return fail(`Missing orderRef (r1=${ref1} r2=${ref2})`);
    if (ref1 !== ref2)   return fail(`orderRef mismatch: ${ref1} vs ${ref2}`);

    const count = await rowCountByRef(ref1);
    if (count !== 1) return fail(`DB row count ${count} for ref ${ref1} — expected 1`);

    const freshCount     = [b1, b2].filter(b => !b.recovered).length;
    const recoveredCount = [b1, b2].filter(b =>  b.recovered).length;
    if (freshCount !== 1 || recoveredCount !== 1)
      return fail(
        `Expected 1 fresh + 1 recovered; got fresh=${freshCount} recovered=${recoveredCount}`,
      );

    return pass();
  } finally {
    for (const ref of cleanupRefs) await deleteByRef(ref);
  }
}

// ── Scenario 2: Lost-response recovery ───────────────────────────────────────

async function check2_recovery(): Promise<Result> {
  const key = randomUUID();
  let ref   = "";

  try {
    const r1 = await postOrder(key);
    const b1 = await r1.json() as Record<string, unknown>;
    if (r1.status !== 200 || !b1.success)
      return fail(`First POST failed HTTP ${r1.status}: ${b1.message}`);

    ref = b1.orderRef as string;

    const r2 = await postOrder(key);
    const b2 = await r2.json() as Record<string, unknown>;

    if (r2.status !== 200)       return fail(`Recovery POST HTTP ${r2.status}: ${b2.message}`);
    if (!b2.success)             return fail(`Recovery POST success=false: ${b2.message}`);
    if (!b2.recovered)           return fail(`Recovery POST missing recovered:true (body=${JSON.stringify(b2)})`);
    if (b2.orderRef !== ref)     return fail(`Recovery returned different ref: ${b2.orderRef} vs original ${ref}`);

    const count = await rowCountByRef(ref);
    if (count !== 1) return fail(`DB row count after recovery ${count} — expected 1`);

    return pass();
  } finally {
    if (ref) await deleteByRef(ref);
  }
}

// ── Scenarios 3 & 4: Receipt GET — valid and invalid cookies ─────────────────

async function check3_receipt(): Promise<Result> {
  const keyA = randomUUID();
  const keyB = randomUUID();
  let refA = "";
  let refB = "";

  try {
    // Order A — used for all cookie validation tests.
    const postA = await postOrder(keyA);
    const bodyA = await postA.json() as Record<string, unknown>;
    if (postA.status !== 200 || !bodyA.success)
      return fail(`Setup POST A failed HTTP ${postA.status}: ${bodyA.message}`);
    refA = bodyA.orderRef as string;

    const tokenA = extractCookieValue(postA, `msr_receipt_${refA}`);
    if (!tokenA) return fail(`No receipt cookie in POST A response for ref ${refA}`);

    // Scenario 3: Valid cookie → 200 with correct order data.
    const getValid = await fetch(`${BASE}/api/orders/${refA}`, {
      headers: { Cookie: `msr_receipt_${refA}=${tokenA}` },
    });
    const validData = await getValid.json() as Record<string, unknown>;
    if (getValid.status !== 200)
      return fail(`Valid receipt GET → HTTP ${getValid.status}: ${JSON.stringify(validData)}`);
    if (validData.orderRef !== refA)
      return fail(`orderRef mismatch: got ${validData.orderRef} expected ${refA}`);
    if (Number(validData.total) !== 160)
      return fail(`total ${validData.total} — expected 160`);
    if (validData.paymentStatus !== "awaiting_payment")
      return fail(`paymentStatus: ${validData.paymentStatus}`);

    // Scenario 4a: Missing cookie → 401.
    const getMissing = await fetch(`${BASE}/api/orders/${refA}`);
    if (getMissing.status !== 401)
      return fail(`Missing cookie → HTTP ${getMissing.status} — expected 401`);

    // Scenario 4b: Tampered signature → 401.
    const getTampered = await fetch(`${BASE}/api/orders/${refA}`, {
      headers: { Cookie: `msr_receipt_${refA}=${tamperToken(tokenA)}` },
    });
    if (getTampered.status !== 401)
      return fail(`Tampered token → HTTP ${getTampered.status} — expected 401`);

    // Scenario 4c: Valid token for a different orderRef → 401.
    // Create Order B to obtain a real token from the server — no signing duplication.
    const postB = await postOrder(keyB);
    const bodyB = await postB.json() as Record<string, unknown>;
    if (postB.status !== 200 || !bodyB.success)
      return fail(`Setup POST B failed HTTP ${postB.status}: ${bodyB.message}`);
    refB = bodyB.orderRef as string;

    const tokenB = extractCookieValue(postB, `msr_receipt_${refB}`);
    if (!tokenB) return fail(`No receipt cookie in POST B response for ref ${refB}`);

    // tokenB is signed for refB; using it against refA must be 401.
    const getWrongRef = await fetch(`${BASE}/api/orders/${refA}`, {
      headers: { Cookie: `msr_receipt_${refA}=${tokenB}` },
    });
    if (getWrongRef.status !== 401)
      return fail(`Wrong-ref token → HTTP ${getWrongRef.status} — expected 401`);

    return pass();
  } finally {
    if (refA) await deleteByRef(refA);
    if (refB) await deleteByRef(refB);
  }
}

// ── Scenario 5: RLS denial ────────────────────────────────────────────────────

async function check5_rls(): Promise<Result> {
  const key = randomUUID();
  let ref   = "";

  try {
    // Create an order via the real HTTP POST (uses production anon client internally).
    const postResp = await postOrder(key);
    const postBody = await postResp.json() as Record<string, unknown>;
    if (postResp.status !== 200 || !postBody.success)
      return fail(`Setup POST failed HTTP ${postResp.status}: ${postBody.message}`);
    ref = postBody.orderRef as string;

    // The anon Supabase client must not be able to SELECT this order.
    const { data, error } = await anon
      .from("orders")
      .select("order_ref")
      .eq("order_ref", ref);

    if (error) {
      // A permission error explicitly confirms RLS enforcement.
      if (error.code === "42501" || error.code === "PGRST301") return pass();
      // Any other error is unexpected — fail explicitly rather than masking it.
      return fail(
        `Unexpected anon query error: code=${error.code} message=${error.message}`,
      );
    }

    if (data && data.length > 0)
      return fail(`Anon client returned ${data.length} row(s) — RLS not enforced`);

    // data === [] — row silently filtered by RLS. Expected behaviour.
    return pass();
  } finally {
    if (ref) await deleteByRef(ref);
  }
}

// ── Runner ────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  await guardLocalOnly();

  console.log(
    "\nP8 Orders HTTP Integration — local Supabase (http://127.0.0.1:54321)\n",
  );
  console.log(`Starting Next.js dev server on port ${PORT} with local credentials…`);

  const server = spawnDevServer();
  let serverStopped = false;

  server.on("exit", code => {
    if (!serverStopped) {
      console.error(`\nDev server exited unexpectedly (code ${code})`);
    }
  });

  try {
    await waitForServer();
    console.log(`Dev server ready at ${BASE}\n`);
    console.log("─".repeat(72));

    const checks: Array<[string, () => Promise<Result>]> = [
      [
        "1. Concurrent same-key POSTs → same ref, 1 DB row, fresh+recovered",
        check1_concurrent,
      ],
      [
        "2. Lost-response recovery → recovered:true, original ref, 1 DB row",
        check2_recovery,
      ],
      [
        "3. Valid receipt cookie → GET 200 with correct order data",
        check3_receipt,
      ],
      [
        "5. RLS denial → anon Supabase client cannot SELECT existing order",
        check5_rls,
      ],
    ];

    let allPassed = true;
    for (const [label, fn] of checks) {
      let result: Result;
      try {
        result = await fn();
      } catch (e) {
        result = fail(`Unexpected throw: ${e instanceof Error ? e.message : String(e)}`);
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
    console.log(
      allPassed
        ? "\nAll 4 checks passed (scenarios 1–4 + 5).\n"
        : "\nSome checks FAILED — see above.\n",
    );

    process.exitCode = allPassed ? 0 : 1;

  } finally {
    serverStopped = true;
    console.log("Stopping dev server…");
    killServer(server);
  }
}

main().catch(e => {
  console.error("\nFatal:", e instanceof Error ? e.message : String(e));
  process.exit(1);
});
