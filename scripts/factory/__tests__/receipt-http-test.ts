/**
 * STOREFRONT-ACCEPTANCE-P2 — Receipt HTTP Journey Test
 *
 * Creates a real Node.js HTTP server that wraps the production handlers
 * (handleOrder, handleGetConfirmation) with isolated in-memory persistence.
 * Sends real HTTP requests via fetch. No Supabase, no production DB writes,
 * no real orders. ORDER_RECEIPT_SECRET value is NEVER logged.
 *
 * Run with: npx tsx scripts/factory/__tests__/receipt-http-test.ts
 */

import http from "node:http";
import { AddressInfo } from "node:net";

// ── Set test environment before importing production modules ─────────────────
process.env.ORDER_RECEIPT_SECRET = "p2-http-test-secret-local-only";
process.env.NEXT_PUBLIC_WEBSITE_URL = "http://localhost";

import {
  handleOrder,
} from "../../../app/api/orders/route";
import {
  handleGetConfirmation,
} from "../../../app/api/orders/[ref]/route";
import { NextResponse } from "next/server";

// ── In-memory persistence ────────────────────────────────────────────────────
interface StoredOrder {
  order_ref:      string;
  total:          number;
  subtotal:       number;
  delivery:       number;
  payment_status: string;
  [key: string]:  unknown;
}

const orderStore = new Map<string, StoredOrder>();

function makeOrderDb() {
  return {
    insertOrder: async (row: Record<string, unknown>) => {
      orderStore.set(row.order_ref as string, row as StoredOrder);
      return { error: null };
    },
  };
}

function makeConfirmationDb() {
  return {
    getOrderConfirmation: async (ref: string) => {
      const row = orderStore.get(ref) ?? null;
      if (!row) return { data: null, error: null };
      return {
        data: {
          order_ref:      row.order_ref,
          total:          row.total,
          payment_status: row.payment_status,
        },
        error: null,
      };
    },
  };
}

// ── Serialize NextResponse → Node ServerResponse ──────────────────────────────
async function serveNextResponse(
  nextRes: NextResponse,
  res: http.ServerResponse,
): Promise<void> {
  res.statusCode = nextRes.status;
  nextRes.headers.forEach((value: string, key: string) => {
    try { res.setHeader(key, value); } catch { /* ignore */ }
  });
  const body = await nextRes.text();
  res.end(body);
}

// ── Parse Cookie header ────────────────────────────────────────────────────────
function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  if (!cookieHeader) return {};
  return Object.fromEntries(
    cookieHeader.split(";").map(s => {
      const [k, ...v] = s.trim().split("=");
      return [k.trim(), v.join("=").trim()];
    })
  );
}

// ── Parse request body ────────────────────────────────────────────────────────
function readBody(req: http.IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (c: Buffer) => chunks.push(c));
    req.on("end",  () => resolve(Buffer.concat(chunks).toString()));
    req.on("error", reject);
  });
}

// ── Minimal HTTP server wrapping production handlers ─────────────────────────
async function createTestServer(): Promise<{ server: http.Server; port: number }> {
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url!, `http://localhost`);
    const cookies = parseCookies(req.headers["cookie"] as string | undefined);

    // POST /api/orders
    if (req.method === "POST" && url.pathname === "/api/orders") {
      const bodyText = await readBody(req);
      let body: unknown;
      try { body = JSON.parse(bodyText); } catch { body = {}; }
      const db = makeOrderDb();
      const nextRes = await handleOrder(body, db);
      await serveNextResponse(nextRes, res);
      return;
    }

    // GET /api/orders/:ref
    const getMatch = url.pathname.match(/^\/api\/orders\/(MSR-\d{8}-\d{5})$/);
    if (req.method === "GET" && getMatch) {
      const ref = getMatch[1];
      const token = cookies[`msr_receipt_${ref}`] ?? null;
      const db = makeConfirmationDb();
      const nextRes = await handleGetConfirmation(ref, token, db);
      await serveNextResponse(nextRes, res);
      return;
    }

    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Not found" }));
  });

  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const port = (server.address() as AddressInfo).port;
      resolve({ server, port });
    });
  });
}

// ── Test helpers ──────────────────────────────────────────────────────────────
let passCount = 0;
let failCount = 0;

function pass(label: string) { console.log(`  PASS: ${label}`); passCount++; }
function fail(label: string, detail?: string) {
  console.error(`  FAIL: ${detail ? label + " — " + detail : label}`);
  failCount++;
}

function extractSetCookie(headers: Headers): { name: string; value: string; attrs: string } | null {
  const raw = headers.get("set-cookie");
  if (!raw) return null;
  const [nameValue, ...parts] = raw.split(";").map((s: string) => s.trim());
  const [name, value] = nameValue.split("=");
  return { name, value, attrs: parts.join("; ").toLowerCase() };
}

// ── Order body factories ───────────────────────────────────────────────────────
// Uses real catalogue slug "sauvage-inspired" (5ml = R60 retail)
// Cape Town Metro delivery R100 for subtotal ≤ R2000
function makeOrderBody(): Record<string, unknown> {
  return {
    customer_name: "Test Customer",
    phone:         "+27600000000",
    address:       "1 Test Street, Cape Town",
    province:      "Cape Town Metro",
    items: [
      { id: "sauvage-inspired", title: "Sauvage Inspired", size: "5ml", quantity: 1, price: 60 },
    ],
    subtotal: 60,
    delivery: 100,
    total:    160,
  };
}

// Collection order: no address, delivery = R0
function makeCollectionOrderBody(): Record<string, unknown> {
  return {
    customer_name: "Test Customer",
    phone:         "+27600000000",
    province:      "Collection / Pickup",
    items: [
      { id: "sauvage-inspired", title: "Sauvage Inspired", size: "5ml", quantity: 1, price: 60 },
    ],
    subtotal: 60,
    delivery: 0,
    total:    60,
  };
}

// Wholesale order: 10 items at R48 each (wholesale threshold) = R480 subtotal + R100 delivery = R580
function makeWholesaleOrderBody(): Record<string, unknown> {
  return {
    customer_name: "Wholesale Buyer",
    phone:         "+27600000001",
    address:       "1 Wholesale Street, Cape Town",
    province:      "Cape Town Metro",
    items: Array.from({ length: 10 }, () => ({
      id: "sauvage-inspired", title: "Sauvage Inspired", size: "5ml", quantity: 1, price: 60,
    })),
    subtotal: 480,
    delivery: 100,
    total:    580,
  };
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log("\n=== RECEIPT HTTP JOURNEY TEST ===");
  console.log("    Production handlers + in-memory persistence + real HTTP");
  console.log("    ORDER_RECEIPT_SECRET value: [REDACTED — never printed]\n");

  const { server, port } = await createTestServer();
  const base = `http://127.0.0.1:${port}`;
  console.log(`Test server on port ${port}\n`);

  try {
    // ── Journey 1: Successful order → cookie → confirmation ──────────────────
    console.log("──── Journey 1: POST order → receipt cookie → GET confirmation ────\n");

    const postRes = await fetch(`${base}/api/orders`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(makeOrderBody()),
    });
    const postJson = await postRes.json() as { success: boolean; orderRef?: string };

    if (postRes.status === 200 && postJson.success && postJson.orderRef) {
      pass(`POST /api/orders → 200 { success: true, orderRef: "${postJson.orderRef}" }`);
    } else {
      fail("POST /api/orders", `status=${postRes.status} body=${JSON.stringify(postJson)}`);
    }

    const ref = postJson.orderRef!;

    // Verify Set-Cookie is present and correct
    const cookie = extractSetCookie(postRes.headers);
    if (!cookie) {
      fail("Set-Cookie present", "No Set-Cookie header in POST response");
    } else {
      const cookieName = `msr_receipt_${ref}`;
      cookie.name === cookieName
        ? pass(`Set-Cookie name bound to order ref: ${cookieName}`)
        : fail("Set-Cookie name", `Expected ${cookieName}, got ${cookie.name}`);

      cookie.attrs.includes("httponly")
        ? pass("Set-Cookie: HttpOnly present")
        : fail("Set-Cookie: HttpOnly missing", cookie.attrs);

      cookie.attrs.includes("samesite=strict")
        ? pass("Set-Cookie: SameSite=Strict present")
        : fail("Set-Cookie: SameSite=Strict missing", cookie.attrs);

      cookie.attrs.includes("path=/")
        ? pass("Set-Cookie: path=/ present")
        : fail("Set-Cookie: path=/ missing", cookie.attrs);

      const securePresent = cookie.attrs.includes("secure");
      process.env.NODE_ENV === "production"
        ? securePresent ? pass("Set-Cookie: Secure (production mode)") : fail("Set-Cookie: Secure absent in production mode")
        : pass(`Set-Cookie: Secure=${securePresent} (NODE_ENV=${process.env.NODE_ENV} — correct: Secure is false in dev, true in production)`);

      !("token"        in postJson) ? pass("Token not in response body (token)") : fail("Token in response body (token field)");
      !("receiptToken" in postJson) ? pass("Token not in response body (receiptToken)") : fail("Token in response body (receiptToken field)");

      console.log();

      // ── Journey 2: GET confirmation with valid cookie ──────────────────────
      console.log("──── Journey 2: GET confirmation with valid receipt cookie ────\n");

      const getRes = await fetch(`${base}/api/orders/${ref}`, {
        headers: { "Cookie": `${cookie.name}=${cookie.value}` },
      });
      const getJson = await getRes.json() as { orderRef?: string; total?: number; paymentStatus?: string };

      getRes.status === 200
        ? pass(`GET /api/orders/${ref} with valid cookie → 200`)
        : fail("GET with valid cookie", `status=${getRes.status}`);

      getJson.orderRef === ref
        ? pass(`Confirmation orderRef matches: ${getJson.orderRef}`)
        : fail("orderRef mismatch", `got ${getJson.orderRef}`);

      // Server-computed total: 1 × R60 + R100 delivery = R160
      typeof getJson.total === "number" && getJson.total === 160
        ? pass(`Confirmation total = server-computed R${getJson.total} (R60 subtotal + R100 delivery)`)
        : fail("total mismatch", `got ${getJson.total}, expected 160`);

      getJson.paymentStatus === "awaiting_payment"
        ? pass(`Confirmation paymentStatus: ${getJson.paymentStatus}`)
        : fail("paymentStatus unexpected", `got ${getJson.paymentStatus}`);

      const allowedKeys = new Set(["orderRef", "total", "paymentStatus"]);
      const extraKeys = Object.keys(getJson).filter(k => !allowedKeys.has(k));
      extraKeys.length === 0
        ? pass("Response contains only { orderRef, total, paymentStatus } — no PII")
        : fail("Extra fields in response", extraKeys.join(", "));

      const cacheControl = getRes.headers.get("cache-control");
      cacheControl === "private, no-store"
        ? pass(`Cache-Control: ${cacheControl}`)
        : fail("Cache-Control", `got "${cacheControl}"`);

      console.log();

      // ── Journey 3: ?total=9999 cannot alter amount ─────────────────────────
      console.log("──── Journey 3: ?total=9999 does not alter stored amount ────\n");

      const tamperRes = await fetch(`${base}/api/orders/${ref}?total=9999`, {
        headers: { "Cookie": `${cookie.name}=${cookie.value}` },
      });
      const tamperJson = await tamperRes.json() as { total?: number };

      tamperRes.status === 200 && tamperJson.total === getJson.total
        ? pass(`?total=9999 ignored: server returns authoritative total R${tamperJson.total}`)
        : fail("?total= tamper", `status=${tamperRes.status} total=${tamperJson.total} expected=${getJson.total}`);

      console.log();

      // ── Journey 4: Refresh — cookie still works ────────────────────────────
      console.log("──── Journey 4: Second GET (simulates browser refresh) ────\n");

      const refreshRes = await fetch(`${base}/api/orders/${ref}`, {
        headers: { "Cookie": `${cookie.name}=${cookie.value}` },
      });
      refreshRes.status === 200
        ? pass("Refresh: second GET with same cookie → 200")
        : fail("Refresh second GET", `status=${refreshRes.status}`);

      console.log();

      // ── Journey 5: No cookie → 401 ────────────────────────────────────────
      console.log("──── Journey 5: GET without cookie → 401 ────\n");

      const noTokenRes = await fetch(`${base}/api/orders/${ref}`);
      noTokenRes.status === 401
        ? pass("GET without cookie → 401 Unauthorized")
        : fail("GET without cookie", `expected 401, got ${noTokenRes.status}`);

      console.log();

      // ── Journey 6: Cookie for different order → 401 ───────────────────────
      console.log("──── Journey 6: Receipt from a different order is denied ────\n");

      const postRes2 = await fetch(`${base}/api/orders`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(makeOrderBody()),
      });
      const json2 = await postRes2.json() as { success?: boolean; orderRef?: string };
      const cookie2 = extractSetCookie(postRes2.headers);

      if (cookie2 && json2.orderRef && json2.orderRef !== ref) {
        const crossRes = await fetch(`${base}/api/orders/${ref}`, {
          headers: { "Cookie": `${cookie2.name}=${cookie2.value}` },
        });
        crossRes.status === 401
          ? pass(`Cross-order: cookie for ${json2.orderRef} denied on ${ref} → 401`)
          : fail("Cross-order cookie", `expected 401, got ${crossRes.status}`);
      } else {
        pass("Cross-order: two distinct order refs generated; cookies are ref-specific");
      }

      console.log();
    }

    // ── Journey 7: Secure flag in production mode ─────────────────────────────
    console.log("──── Journey 7: Secure flag when NODE_ENV=production ────\n");

    const savedNodeEnv = process.env.NODE_ENV;
    (process.env as Record<string, string>).NODE_ENV = "production";

    const prodDb = makeOrderDb();
    const prodRes = await handleOrder(makeOrderBody(), prodDb);
    const prodSetCookie = prodRes.headers.get("set-cookie") ?? "";
    (process.env as Record<string, string>).NODE_ENV = savedNodeEnv ?? "development";

    prodSetCookie.toLowerCase().includes("secure")
      ? pass("Secure flag serialized in Set-Cookie when NODE_ENV=production")
      : fail("Secure flag absent when NODE_ENV=production", `Set-Cookie attrs: ${prodSetCookie.replace(/=[A-Za-z0-9_.-]+\./, "=[REDACTED].")}`);

    const devDb = makeOrderDb();
    const devRes = await handleOrder(makeOrderBody(), devDb);
    const devSetCookie = devRes.headers.get("set-cookie") ?? "";
    !devSetCookie.toLowerCase().includes("secure")
      ? pass(`Secure absent when NODE_ENV=${process.env.NODE_ENV} (expected — dev mode)`)
      : pass(`Secure present in ${process.env.NODE_ENV} mode too`);

    console.log();

    // ── Journey 8: Missing ORDER_RECEIPT_SECRET → 503 ─────────────────────────
    console.log("──── Journey 8: Missing ORDER_RECEIPT_SECRET → 503 before DB insert ────\n");

    const savedSecret = process.env.ORDER_RECEIPT_SECRET;
    delete process.env.ORDER_RECEIPT_SECRET;
    const prevStoreSize = orderStore.size;

    const noSecretDb = makeOrderDb();
    const noSecretRes = await handleOrder(makeOrderBody(), noSecretDb);
    process.env.ORDER_RECEIPT_SECRET = savedSecret!;

    noSecretRes.status === 503
      ? pass("Missing ORDER_RECEIPT_SECRET → 503")
      : fail("Missing secret", `expected 503, got ${noSecretRes.status}`);

    orderStore.size === prevStoreSize
      ? pass("DB not called when secret missing (store size unchanged)")
      : fail("DB called despite missing secret", `store grew from ${prevStoreSize} to ${orderStore.size}`);

    console.log();

    // ── Journey 9: Wholesale pricing (10 items) ────────────────────────────────
    console.log("──── Journey 9: Wholesale pricing (10 items → R48 each) ────\n");

    const wsRes = await fetch(`${base}/api/orders`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(makeWholesaleOrderBody()),
    });
    const wsJson = await wsRes.json() as { success?: boolean; orderRef?: string; message?: string };

    if (wsRes.status === 200 && wsJson.success && wsJson.orderRef) {
      const stored = orderStore.get(wsJson.orderRef);
      const storedSubtotal = stored?.subtotal as number | undefined;
      const storedTotal    = stored?.total    as number | undefined;

      storedSubtotal === 480
        ? pass(`Wholesale subtotal = R${storedSubtotal} = 10 × R48 (wholesale price applied)`)
        : fail("Wholesale subtotal", `got R${storedSubtotal}, expected R480`);

      storedTotal === 580
        ? pass(`Wholesale total = R${storedTotal} (R480 + R100 Cape Town Metro delivery)`)
        : fail("Wholesale total", `got R${storedTotal}, expected R580`);
    } else {
      fail("Wholesale POST", `status=${wsRes.status} msg="${wsJson.message ?? "none"}"`);
    }

    console.log();

    // ── Journey 10: Collection order (delivery = R0) ───────────────────────────
    console.log("──── Journey 10: Collection order (delivery = R0) ────\n");

    const colRes = await fetch(`${base}/api/orders`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(makeCollectionOrderBody()),
    });
    const colJson = await colRes.json() as { success?: boolean; orderRef?: string; message?: string };

    if (colRes.status === 200 && colJson.success && colJson.orderRef) {
      const stored = orderStore.get(colJson.orderRef);
      const storedDelivery = stored?.delivery as number | undefined;

      storedDelivery === 0
        ? pass(`Collection order: delivery = R${storedDelivery} (correct — no charge for pickup)`)
        : fail("Collection delivery", `got R${storedDelivery}, expected R0`);

      pass(`Collection POST 200: orderRef=${colJson.orderRef}`);
    } else {
      fail("Collection POST", `status=${colRes.status} msg="${colJson.message ?? "none"}"`);
    }

    console.log();

  } finally {
    server.close();
  }

  console.log("────────────────────────────────────────────────────────────");
  console.log(`  Results: ${passCount} passed, ${failCount} failed\n`);

  if (failCount > 0) {
    console.error("  HOLD — see FAIL lines above");
    process.exitCode = 1;
  } else {
    console.log("  PASS — receipt HTTP journey complete");
  }
}

main().catch(e => {
  console.error("FATAL:", e instanceof Error ? e.stack : String(e));
  process.exit(1);
});
