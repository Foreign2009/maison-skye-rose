/**
 * P11 receipt browser test server — port 3101.
 *
 * Architecture
 * ─────────────
 * This server runs on port 3101 (the only origin the browser ever sees).
 * It intercepts the two receipt API routes — handling them with in-memory
 * persistence and a test-only signing secret — then reverse-proxies
 * everything else (pages, static assets, Next.js chunks) to the Next.js
 * dev server on port 3102 (internal; never accessed directly by the browser).
 *
 *   POST /api/orders           → handleOrder (in-memory)
 *   GET  /api/orders/:ref      → handleGetConfirmation (in-memory)
 *   GET  /api/health           → 200 "ok" (Playwright readiness probe)
 *   *                          → reverse-proxied to Next.js (port 3102)
 *
 * Why reverse proxy instead of page.route()
 * ─────────────────────────────────────────
 * A real HTTP server response on port 3101 issues Set-Cookie headers that
 * the browser stores natively — no Playwright-level injection required.
 *
 * Cookie lifecycle
 * ────────────────
 * 1. Browser JS (page.evaluate) POSTs to /api/orders on port 3101.
 * 2. Server signs a receipt token and returns Set-Cookie in the HTTP response.
 * 3. Browser stores the HttpOnly cookie for http://localhost:3101.
 * 4. Browser navigates to /payment-success?ref=… (proxied from Next.js).
 * 5. React component calls fetch('/api/orders/${ref}') — same origin.
 * 6. Browser automatically includes the HttpOnly cookie.
 * 7. Server extracts token from Cookie header and validates via production handler.
 *
 * Local HTTP limitation
 * ─────────────────────
 * NODE_ENV is not "production" so the Secure cookie attribute is absent.
 * These tests verify HttpOnly + SameSite=Strict cookie lifecycle on HTTP
 * localhost only. Production behaviour with the Secure flag requires HTTPS
 * and is not exercised here.
 *
 * Isolation
 * ─────────
 * No requests reach Supabase or any production system.
 * The signing secret (ORDER_RECEIPT_SECRET) is set to a test-only value by
 * the Playwright config before this process starts — it is different from
 * the value given to the Next.js dev server (port 3102) so that cookies
 * signed by this server are rejected if Next.js routes are accidentally reached.
 */

// ORDER_RECEIPT_SECRET must be set before production modules are imported,
// as some read it at call time and fail if absent.
// The Playwright webServer env block sets this; the fallback guards direct runs.
if (!process.env.ORDER_RECEIPT_SECRET) {
  process.env.ORDER_RECEIPT_SECRET = "p11-browser-test-secret-local-only";
}

import http from "node:http";
import type { AddressInfo } from "node:net";
import { handleOrder, type OrderDb }                     from "../../app/api/orders/route";
import { handleGetConfirmation, type ConfirmationDb }    from "../../app/api/orders/[ref]/route";

const BROWSER_PORT = parseInt(process.env.BROWSER_PORT ?? "3101", 10);
const NEXTJS_PORT  = parseInt(process.env.NEXTJS_PORT  ?? "3102", 10);

// ── In-memory order store ──────────────────────────────────────────────────────

interface StoredOrder {
  order_ref:      string;
  total:          number;
  payment_status: string;
  province:       string | null;
  [key: string]:  unknown;
}

const orderStore = new Map<string, StoredOrder>();

function makeOrderDb(): OrderDb {
  return {
    insertOrder: async (row: Record<string, unknown>) => {
      orderStore.set(row.order_ref as string, row as StoredOrder);
      return { error: null };
    },
    // findByIdempotencyKey omitted intentionally:
    // test order bodies do not include checkout_attempt_key, so the
    // idempotency path in handleOrder is never reached.
  };
}

function makeConfirmationDb(): ConfirmationDb {
  return {
    getOrderConfirmation: async (ref: string) => {
      const row = orderStore.get(ref);
      if (!row) return { data: null, error: null };
      return {
        data: {
          order_ref:      row.order_ref,
          total:          row.total,
          payment_status: row.payment_status,
          province:       row.province,
        },
        error: null,
      };
    },
  };
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function parseCookies(header: string | undefined): Record<string, string> {
  if (!header) return {};
  return Object.fromEntries(
    header.split(";").map(s => {
      const idx = s.indexOf("=");
      if (idx < 0) return [s.trim(), ""];
      return [s.slice(0, idx).trim(), s.slice(idx + 1).trim()];
    })
  );
}

function readBody(req: http.IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data",  (c: Buffer) => chunks.push(c));
    req.on("end",   () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

async function serveNextResponse(
  nextRes: Awaited<ReturnType<typeof handleGetConfirmation>>,
  res:     http.ServerResponse,
): Promise<void> {
  res.statusCode = nextRes.status;

  // getSetCookie() returns each Set-Cookie value as a separate array entry,
  // preserving multiple distinct cookie headers intact.
  const setCookies: string[] = (nextRes.headers as unknown as { getSetCookie(): string[] }).getSetCookie();

  nextRes.headers.forEach((value: string, key: string) => {
    // set-cookie is handled via getSetCookie() above — skip here.
    if (key.toLowerCase() !== "set-cookie") {
      try { res.setHeader(key, value); } catch { /* skip read-only headers */ }
    }
  });

  if (setCookies.length > 0) res.setHeader("Set-Cookie", setCookies);
  const body = await nextRes.arrayBuffer();
  res.end(Buffer.from(body));
}

// ── Reverse proxy to Next.js ───────────────────────────────────────────────────

function proxyToNextJs(req: http.IncomingMessage, res: http.ServerResponse): void {
  const opts: http.RequestOptions = {
    hostname: "127.0.0.1",
    port:     NEXTJS_PORT,
    path:     req.url ?? "/",
    method:   req.method ?? "GET",
    headers:  { ...req.headers, host: `localhost:${NEXTJS_PORT}` },
  };

  const proxyReq = http.request(opts, (proxyRes) => {
    res.writeHead(
      proxyRes.statusCode ?? 502,
      proxyRes.headers as http.OutgoingHttpHeaders,
    );
    proxyRes.pipe(res, { end: true });
  });

  proxyReq.on("error", () => {
    if (!res.headersSent) {
      res.writeHead(502, { "Content-Type": "text/plain" });
    }
    res.end("Bad Gateway — Next.js dev server unreachable");
  });

  req.pipe(proxyReq, { end: true });
}

// ── HTTP server ────────────────────────────────────────────────────────────────

const server = http.createServer(async (req, res) => {
  try {
    await handleRequest(req, res);
  } catch (err) {
    console.error("[P11] Unhandled handler error:", err);
    if (!res.headersSent) {
      res.writeHead(500, { "Content-Type": "text/plain" });
    }
    if (!res.writableEnded) res.end("Internal Server Error");
  }
});

async function handleRequest(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
  const rawUrl    = req.url ?? "/";
  const url       = new URL(rawUrl, `http://127.0.0.1`);
  const pathname  = url.pathname;
  const cookies   = parseCookies(req.headers["cookie"] as string | undefined);
  const method    = (req.method ?? "GET").toUpperCase();

  // Log every request except health and static assets to trace live traffic.
  if (pathname !== "/api/health" && !pathname.startsWith("/_next/static")) {
    console.log(`[P11 TRACE] ${method} ${pathname} cookies=${Object.keys(cookies).join(",") || "(none)"}`);
  }

  // ── Health check (Playwright webServer readiness probe) ───────────────────
  if (method === "GET" && pathname === "/api/health") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("ok");
    return;
  }

  // ── POST /api/orders — handled in-memory; returns real Set-Cookie header ──
  if (method === "POST" && pathname === "/api/orders") {
    const bodyText = await readBody(req);
    let body: unknown;
    try   { body = JSON.parse(bodyText); }
    catch { body = {}; }
    const nextRes = await handleOrder(body, makeOrderDb());
    await serveNextResponse(nextRes, res);
    return;
  }

  // ── GET /api/orders/:ref — handled in-memory; validates HttpOnly cookie ───
  const refMatch = pathname.match(/^\/api\/orders\/(MSR-\d{8}-\d{5})$/);
  if (method === "GET" && refMatch) {
    const ref   = refMatch[1];
    const token = cookies[`msr_receipt_${ref}`] ?? null;
    const nextRes = await handleGetConfirmation(ref, token, makeConfirmationDb());
    await serveNextResponse(nextRes, res);
    return;
  }

  // ── Unexpected /api/* — reject at the adapter ────────────────────────────
  // Any /api/ path not handled above is rejected here and never forwarded
  // to the Next.js dev server. Even with dummy Supabase credentials, the
  // Next.js dev server would still execute application API route handlers
  // that may attempt network calls before db operations fail. Rejecting at
  // the adapter layer prevents those handlers from running at all.
  if (pathname.startsWith("/api/")) {
    res.writeHead(403, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not handled by P11 adapter", path: pathname }));
    return;
  }

  // ── Everything else → Next.js dev server ─────────────────────────────────
  proxyToNextJs(req, res);
}

// WebSocket upgrade — proxy to Next.js dev server.
// Turbopack's HMR client and next-devtools establish WebSocket connections
// to the browser's origin (port 3101). Proxying the upgrade to Next.js
// (port 3102) allows HMR to connect normally. Without this proxy, HMR
// WebSocket connections would fail; adding the proxy resolved the test suite
// (tests that previously timed out now pass in 4–6s per test). The exact
// mechanism by which the refused WebSocket caused the stalling was not
// directly observed — only the correlation between proxy and passing tests.
server.on("upgrade", (req, socket, head) => {
  const proxyReq = http.request({
    hostname: "127.0.0.1",
    port:     NEXTJS_PORT,
    path:     req.url ?? "/",
    method:   req.method ?? "GET",
    headers:  { ...req.headers, host: `localhost:${NEXTJS_PORT}` },
  });
  proxyReq.on("upgrade", (proxyRes, proxySocket, proxyHead) => {
    let upgradeHeader = `HTTP/1.1 ${proxyRes.statusCode ?? 101} ${proxyRes.statusMessage ?? "Switching Protocols"}\r\n`;
    Object.entries(proxyRes.headers).forEach(([k, v]) => {
      if (Array.isArray(v)) {
        v.forEach(val => { upgradeHeader += `${k}: ${val}\r\n`; });
      } else if (v !== undefined) {
        upgradeHeader += `${k}: ${v}\r\n`;
      }
    });
    upgradeHeader += "\r\n";
    socket.write(upgradeHeader);
    if (proxyHead && proxyHead.length > 0) proxySocket.unshift(proxyHead);
    proxySocket.pipe(socket);
    socket.pipe(proxySocket);
    proxySocket.on("error", () => socket.destroy());
    socket.on("error", () => proxySocket.destroy());
  });
  proxyReq.on("error", () => {
    if (!socket.destroyed) {
      socket.write("HTTP/1.1 502 Bad Gateway\r\n\r\n");
      socket.destroy();
    }
  });
  proxyReq.end();
});

server.listen(BROWSER_PORT, "127.0.0.1", () => {
  const addr = server.address() as AddressInfo;
  console.log(`[P11] browser server → http://127.0.0.1:${addr.port}`);
  console.log(`[P11]   POST /api/orders            → in-memory handleOrder`);
  console.log(`[P11]   GET  /api/orders/:ref       → in-memory handleGetConfirmation`);
  console.log(`[P11]   *                           → proxy → http://127.0.0.1:${NEXTJS_PORT}`);
  console.log(`[P11] ORDER_RECEIPT_SECRET set:     ${!!process.env.ORDER_RECEIPT_SECRET}`);
});
