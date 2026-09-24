// @ts-check
/**
 * CHECKOUT-P11 — Browser-managed receipt cookie verification.
 *
 * What these tests verify
 * ───────────────────────
 * Browser cookie lifecycle: the browser stores and sends the HttpOnly receipt
 * cookie automatically — no Playwright-level injection, no manually supplied
 * Cookie headers, no page.request.post().
 *
 * Labelling
 * ─────────
 * All order creation uses page.evaluate() to execute fetch() from the browser's
 * JavaScript context. This is browser API testing — it verifies the cookie
 * issuance and storage mechanics. It is NOT full checkout UI coverage.
 * The full checkout UI (form, cart, PayFast redirect) is outside P11.
 *
 * Architecture (from playwright.p11.config.ts)
 * ─────────────────────────────────────────────
 * Browser origin: http://localhost:3101 (receipt-browser-server.ts)
 *   POST /api/orders      → in-memory handleOrder   (issues Set-Cookie)
 *   GET  /api/orders/:ref → in-memory handleGetConfirmation
 *   /api/*                → 403 rejected at adapter (not proxied)
 *   *                     → reverse-proxied to Next.js dev server (port 3102)
 *
 * Network isolation
 * ─────────────────
 * Browser-level: isolateContext() installs a context.route() allowlist that
 * allows only http://localhost:3101 requests and aborts everything else
 * (Supabase, analytics, CDNs, any external host). Applied before any
 * navigation, including pre-warm pages and the fresh browser context in T4.
 * Service workers are blocked via serviceWorkers: "block" in the browser
 * context options — no SW can register or bypass route interception.
 *
 * Server-level: the browser server handles both receipt API routes entirely
 * in-memory — no network calls to Supabase or any external service. Unexpected
 * /api/* routes are rejected at the adapter with 403 and are never forwarded.
 * The Next.js dev server runs with dummy Supabase credentials (localhost:54321)
 * and an empty PostHog key (analytics silently disabled). Dummy credentials
 * prevent production data access but are not a network block — the
 * browser-level allowlist provides the actual network isolation for the browser.
 *
 * Local HTTP limitation
 * ─────────────────────
 * The Secure cookie attribute is absent (NODE_ENV !== "production").
 * These tests verify HttpOnly + SameSite=Strict cookie lifecycle on HTTP
 * localhost only. Production HTTPS behaviour (Secure flag) is not established
 * here. The historical production 401 cause remains unconfirmed.
 */

const { test, expect } = require("@playwright/test");

// ── Test order bodies ──────────────────────────────────────────────────────────
// Product: erba-pura-inspired, 5ml, R60 retail price.
// Prices are server-recomputed from the catalogue — client-submitted prices
// are validated but recalculated. These bodies must match the server's expected
// totals exactly (see orderValidation.ts).

// Courier order: Cape Town Metro — subtotal R60 + delivery R100 = R160 total.
const COURIER_ORDER = {
  customer_name: "P11 Test Guest",
  phone:         "0821234567",
  province:      "Cape Town Metro",
  address:       "1 Test Street, Cape Town, 8001",
  items: [
    { id: "erba-pura-inspired", title: "Erba Pura Inspired", quantity: 1, size: "5ml" },
  ],
  subtotal: 60,
  delivery: 100,
  total:    160,
};

// Collection order: Collection / Pickup — no delivery charge, R60 total.
const COLLECTION_ORDER = {
  customer_name: "P11 Test Guest",
  phone:         "0821234567",
  province:      "Collection / Pickup",
  // address omitted — not required for collection orders
  items: [
    { id: "erba-pura-inspired", title: "Erba Pura Inspired", quantity: 1, size: "5ml" },
  ],
  subtotal: 60,
  delivery: 0,
  total:    60,
};

// ── Shared helper: isolate a browser context to the local test origin ─────────
// Installs a context-level route allowlist that allows only http://localhost:3101
// requests and aborts everything else. Blocks service worker registration so no
// SW can bypass route interception. Must be called before any navigation.
async function isolateContext(ctx) {
  // HTTP-level allowlist: only the local test origin is permitted.
  // Supabase, analytics providers, CDNs and all external hosts are blocked.
  // context.route() handles HTTP(S) requests only; WebSocket connections are
  // intercepted separately via context.routeWebSocket() below.
  await ctx.route(/.*/, (route) => {
    const url = route.request().url();
    const isLocal =
      url.startsWith("http://localhost:3101/") ||
      url.startsWith("http://127.0.0.1:3101/") ||
      url === "http://localhost:3101" ||
      url === "http://127.0.0.1:3101";
    if (isLocal) {
      route.continue();
    } else {
      route.abort("blockedbyclient");
    }
  });

  // WebSocket-level allowlist: allow only the local HMR WebSocket connection
  // (ws://localhost:3101 — proxied to Next.js by the browser server).
  // External WebSocket connections are closed without connecting upstream.
  // URL is parsed and validated: exact origin match, no credentials, ws: only.
  await ctx.routeWebSocket(/.*/, (ws) => {
    let allowed = false;
    try {
      const u = new URL(ws.url());
      if (!u.username && !u.password && u.protocol === "ws:") {
        const h = u.hostname;
        const p = u.port;
        allowed = (h === "localhost" || h === "127.0.0.1") && p === "3101";
      }
    } catch {
      // Malformed URL — reject.
    }
    if (allowed) {
      ws.connectToServer();
    } else {
      ws.close();
    }
  });

  // Service workers are blocked via serviceWorkers: "block" in the browser
  // context options — no addInitScript monkey-patch needed.
}

// ── Shared helper: establish same-origin context for page.evaluate() calls ────
// Navigate to /api/health — an instant response from the browser server itself
// (no Next.js compilation). This puts the browser at http://localhost:3101 so
// same-origin fetch() calls work from page.evaluate(). The health endpoint
// responds in <1ms regardless of Next.js compilation state.
async function gotoBaseOrigin(page) {
  await page.goto("/api/health");
}

// ── Shared helper: issue an order from browser JS and return the result ────────
// Same-origin fetch from page.evaluate — the browser stores the HttpOnly
// Set-Cookie header automatically. Never uses page.request.post() or manually
// supplied cookies.
async function browserPost(page, orderBody) {
  return page.evaluate(async (body) => {
    const r = await fetch("/api/orders", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(body),
    });
    const data = await r.json();
    return { status: r.status, data };
  }, orderBody);
}

// ── Pre-warm: compile /payment-success before any test runs ───────────────────
// On first load, Next.js dev compiles the page on demand (10-30s).
// Pre-warming compiles and caches all chunks so the first test navigation
// serves them quickly without compilation delay.
// isolateContext() is applied to the warm context before any navigation.
test.beforeAll(async ({ browser }) => {
  const ctx = await browser.newContext({ serviceWorkers: "block" });
  await isolateContext(ctx);
  const warmPage = await ctx.newPage();
  await warmPage.goto("/payment-success", { timeout: 90_000 });
  await ctx.close();
  console.log("[P11] Pre-warm complete — Next.js chunks compiled and cached.");
});

// ── T1: Courier order — cookie issued by browser POST, receipt renders ─────────
test("T1: courier order — browser POST issues receipt cookie; receipt renders server-confirmed amount and delivery wording", async ({ page }) => {
  await isolateContext(page.context());
  await gotoBaseOrigin(page);

  // Browser-initiated POST (same-origin fetch from page.evaluate).
  // The in-memory server signs a receipt token and returns Set-Cookie.
  // The browser stores this HttpOnly cookie for http://localhost:3101.
  const result = await browserPost(page, COURIER_ORDER);

  expect(result.status, "POST /api/orders → 200").toBe(200);
  expect(result.data.orderRef, "response includes orderRef").toMatch(/^MSR-\d{8}-\d{5}$/);

  const orderRef = result.data.orderRef;

  // Read-only cookie assertions: the receipt cookie must be stored and HttpOnly.
  // Cookie values are never printed or injected.
  {
    const jar = await page.context().cookies(["http://localhost:3101/"]);
    const c   = jar.find(co => co.name === `msr_receipt_${orderRef}`);
    expect(c,           `receipt cookie msr_receipt_${orderRef} stored`).toBeDefined();
    expect(c?.httpOnly, "receipt cookie is HttpOnly").toBe(true);
  }

  // Navigate to the actual /payment-success React page.
  // React calls fetch('/api/orders/${ref}') client-side.
  // The browser automatically includes the HttpOnly cookie — no page.evaluate needed.
  await page.goto(`/payment-success?ref=${orderRef}`);
  await page.waitForSelector("h1:has-text(\"Is Confirmed\")", { timeout: 45_000 });
  await expect(page.locator("text=R160.00")).toBeVisible();
  // Use exact text match — "banking details" (lowercase) also appears in the
  // "What Happens Next" step text, causing an ambiguous locator in strict mode.
  await expect(page.getByText("Banking Details", { exact: true })).toBeVisible();
  await expect(page.locator("text=Send Proof of Payment via WhatsApp")).toBeVisible();

  const bodyText = await page.textContent("body");
  expect(bodyText, "delivery wording present").toContain("arrange delivery with care");
  expect(bodyText, "collection wording absent").not.toContain("contact you to arrange collection");

  console.log(`T1 PASS: courier receipt ${orderRef} — R160.00, delivery wording confirmed`);
});

// ── T2: Page reload retains receipt access ────────────────────────────────────
test("T2: page reload retains receipt access (browser resends stored cookie)", async ({ page }) => {
  await isolateContext(page.context());
  await gotoBaseOrigin(page);

  const result = await browserPost(page, COURIER_ORDER);
  expect(result.status, "POST /api/orders → 200").toBe(200);
  const orderRef = result.data.orderRef;

  // Cookie assertion: issued and HttpOnly after POST.
  {
    const jar = await page.context().cookies(["http://localhost:3101/"]);
    const c   = jar.find(co => co.name === `msr_receipt_${orderRef}`);
    expect(c,           `receipt cookie msr_receipt_${orderRef} stored`).toBeDefined();
    expect(c?.httpOnly, "receipt cookie is HttpOnly").toBe(true);
  }

  await page.goto(`/payment-success?ref=${orderRef}`);
  await page.waitForSelector("h1:has-text(\"Is Confirmed\")", { timeout: 45_000 });

  // Reload — browser resends the stored cookie for the same origin.
  await page.reload();
  await page.waitForSelector("h1:has-text(\"Is Confirmed\")", { timeout: 45_000 });
  await expect(page.locator("text=R160.00")).toBeVisible();

  console.log(`T2 PASS: receipt ${orderRef} accessible after page reload`);
});

// ── T3: Collection order — collection wording ────────────────────────────────
test("T3: collection order — receipt renders server-confirmed amount and collection wording", async ({ page }) => {
  await isolateContext(page.context());
  await gotoBaseOrigin(page);

  const result = await browserPost(page, COLLECTION_ORDER);
  expect(result.status, "POST /api/orders → 200").toBe(200);
  const orderRef = result.data.orderRef;

  // Cookie assertion: issued and HttpOnly after POST.
  {
    const jar = await page.context().cookies(["http://localhost:3101/"]);
    const c   = jar.find(co => co.name === `msr_receipt_${orderRef}`);
    expect(c,           `receipt cookie msr_receipt_${orderRef} stored`).toBeDefined();
    expect(c?.httpOnly, "receipt cookie is HttpOnly").toBe(true);
  }

  await page.goto(`/payment-success?ref=${orderRef}`);
  await page.waitForSelector("h1:has-text(\"Is Confirmed\")", { timeout: 45_000 });
  await expect(page.locator("text=R60.00")).toBeVisible();

  const bodyText = await page.textContent("body");
  expect(bodyText, "collection wording present").toContain("contact you to arrange collection");
  expect(bodyText, "delivery wording absent").not.toContain("arrange delivery with care");

  console.log(`T3 PASS: collection receipt ${orderRef} — R60.00, collection wording confirmed`);
});

// ── T4: Fresh browser context — access-error UI, no confirmation content ──────
test("T4: fresh browser context without receipt cookie — access-error UI, no confirmation claim, banking, or payment CTA", async ({ page, browser }) => {
  await isolateContext(page.context());
  await gotoBaseOrigin(page);

  // Issue order in the original context — confirm access.
  const result = await browserPost(page, COURIER_ORDER);
  expect(result.status, "POST /api/orders → 200").toBe(200);
  const orderRef = result.data.orderRef;

  await page.goto(`/payment-success?ref=${orderRef}`);
  await page.waitForSelector("h1:has-text(\"Is Confirmed\")", { timeout: 45_000 });

  // Open a fresh browser context — no cookies carried over.
  // isolateContext() is applied before any navigation.
  const freshCtx  = await browser.newContext({ serviceWorkers: "block" });
  await isolateContext(freshCtx);
  const freshPage = await freshCtx.newPage();

  await freshPage.goto(`/payment-success?ref=${orderRef}`);

  // Expect the unauthorized (access-error) state.
  await freshPage.waitForSelector(
    "h1:has-text(\"We couldn't verify access to this receipt.\")",
    { timeout: 45_000 },
  );

  // No confirmation content should be present.
  await expect(freshPage.locator("h1:has-text(\"Is Confirmed\")")).not.toBeVisible();
  await expect(freshPage.getByText("Banking Details", { exact: true })).not.toBeVisible();
  await expect(freshPage.locator("text=Send Proof of Payment via WhatsApp")).not.toBeVisible();
  await expect(freshPage.locator("text=R160.00")).not.toBeVisible();

  await freshCtx.close();

  console.log(`T4 PASS: fresh context → access-error for ${orderRef}; no confirmation content`);
});

// ── T5: Two orders in the same browser — both accessible ─────────────────────
test("T5: two orders in the same browser context — each receipt independently accessible via its own cookie", async ({ page }) => {
  await isolateContext(page.context());
  await gotoBaseOrigin(page);

  // POST order A (courier — R160.00).
  const resultA = await browserPost(page, COURIER_ORDER);
  expect(resultA.status, "POST order A → 200").toBe(200);
  const refA = resultA.data.orderRef;

  // POST order B (collection — R60.00) in the same browser context.
  // Both cookies are now stored for http://localhost:3101.
  const resultB = await browserPost(page, COLLECTION_ORDER);
  expect(resultB.status, "POST order B → 200").toBe(200);
  const refB = resultB.data.orderRef;

  expect(refA, "order refs are distinct").not.toBe(refB);

  // Both per-reference cookies must coexist in the same cookie jar.
  // Values are never printed.
  {
    const jar = await page.context().cookies(["http://localhost:3101/"]);
    const cA  = jar.find(co => co.name === `msr_receipt_${refA}`);
    const cB  = jar.find(co => co.name === `msr_receipt_${refB}`);
    expect(cA,           `cookie for order A (${refA}) stored`).toBeDefined();
    expect(cA?.httpOnly, "order A cookie is HttpOnly").toBe(true);
    expect(cB,           `cookie for order B (${refB}) stored`).toBeDefined();
    expect(cB?.httpOnly, "order B cookie is HttpOnly").toBe(true);
  }

  // Access receipt A — browser sends msr_receipt_${refA} automatically.
  await page.goto(`/payment-success?ref=${refA}`);
  await page.waitForSelector("h1:has-text(\"Is Confirmed\")", { timeout: 45_000 });
  await expect(page.locator("text=R160.00")).toBeVisible();

  const bodyA = await page.textContent("body");
  expect(bodyA, "order A: delivery wording").toContain("arrange delivery with care");

  // Access receipt B — browser sends msr_receipt_${refB} automatically.
  await page.goto(`/payment-success?ref=${refB}`);
  await page.waitForSelector("h1:has-text(\"Is Confirmed\")", { timeout: 45_000 });
  await expect(page.locator("text=R60.00")).toBeVisible();

  const bodyB = await page.textContent("body");
  expect(bodyB, "order B: collection wording").toContain("contact you to arrange collection");

  console.log(`T5 PASS: both receipts accessible — ${refA} (R160.00 delivery) and ${refB} (R60.00 collection)`);
});
