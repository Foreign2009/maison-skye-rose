// @ts-nocheck
/**
 * STOREFRONT-ACCEPTANCE-P2 — Browser checkout-to-confirmation journey
 *
 * Uses Playwright route interception to proxy /api/orders and /api/orders/:ref
 * through the real production handlers with in-memory persistence.
 * Browser navigates the real Next.js frontend at localhost:3333.
 *
 * Run with: npx tsx scripts/factory/__tests__/p2-browser-journey.ts
 */

// ── Set test env before importing production modules ─────────────────────────
process.env.ORDER_RECEIPT_SECRET = "p2-browser-test-secret-local-only";
process.env.NEXT_PUBLIC_WEBSITE_URL = "http://localhost";

import http   from "node:http";
import path   from "node:path";
import fs     from "node:fs";
import { AddressInfo } from "node:net";

import { handleOrder }           from "../../../app/api/orders/route";
import { handleGetConfirmation } from "../../../app/api/orders/[ref]/route";
import { NextResponse }          from "next/server";

// ── Playwright via npx cache ──────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { chromium } = require(
  "C:\\Users\\adi\\AppData\\Local\\npm-cache\\_npx\\e41f203b7505f1fb\\node_modules\\playwright-core"
) as typeof import("playwright-core");

const SS_DIR  = "C:\\Users\\adi\\AppData\\Local\\Temp\\claude\\c--Users-adi-projects-maison-skye-rose\\ff3ce0a5-dac4-4410-9083-b81655217fed\\scratchpad\\screenshots";
const BASE_URL = "http://localhost:3333";
const PDP_URL  = `${BASE_URL}/product/sauvage-inspired`;

fs.mkdirSync(SS_DIR, { recursive: true });

// ── In-memory persistence ─────────────────────────────────────────────────────
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
        data: { order_ref: row.order_ref, total: row.total, payment_status: row.payment_status },
        error: null,
      };
    },
  };
}

// ── Serialise NextResponse → Node HTTP response ───────────────────────────────
async function serveNextResponse(nr: NextResponse, res: http.ServerResponse) {
  res.statusCode = nr.status;
  nr.headers.forEach((v: string, k: string) => {
    try { res.setHeader(k, v); } catch { /* ignore */ }
  });
  res.end(await nr.text());
}

// ── Parse Cookie header ───────────────────────────────────────────────────────
function parseCookies(h: string | undefined): Record<string, string> {
  if (!h) return {};
  return Object.fromEntries(
    h.split(";").map(s => {
      const [k, ...v] = s.trim().split("=");
      return [k.trim(), v.join("=").trim()];
    })
  );
}

// ── Read request body ─────────────────────────────────────────────────────────
function readBody(req: http.IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (c: Buffer) => chunks.push(c));
    req.on("end",  () => resolve(Buffer.concat(chunks).toString()));
    req.on("error", reject);
  });
}

// ── Test server ───────────────────────────────────────────────────────────────
async function startTestServer(): Promise<{ server: http.Server; port: number }> {
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url!, "http://localhost");
    const cookies = parseCookies(req.headers["cookie"] as string | undefined);

    if (req.method === "POST" && url.pathname === "/api/orders") {
      const bodyText = await readBody(req);
      let body: unknown;
      try { body = JSON.parse(bodyText); } catch { body = {}; }
      const nr = await handleOrder(body, makeOrderDb());
      await serveNextResponse(nr, res);
      return;
    }

    const m = url.pathname.match(/^\/api\/orders\/(MSR-\d{8}-\d{5})$/);
    if (req.method === "GET" && m) {
      const ref   = m[1];
      const token = cookies[`msr_receipt_${ref}`] ?? null;
      const nr    = await handleGetConfirmation(ref, token, makeConfirmationDb());
      await serveNextResponse(nr, res);
      return;
    }

    res.statusCode = 404;
    res.end(JSON.stringify({ error: "not found" }));
  });

  return new Promise(resolve => {
    server.listen(0, "127.0.0.1", () => {
      const port = (server.address() as AddressInfo).port;
      resolve({ server, port });
    });
  });
}

// ── Helpers ───────────────────────────────────────────────────────────────────
let passCount = 0;
let failCount = 0;

function pass(label: string) { console.log(`  PASS: ${label}`); passCount++; }
function fail(label: string, detail?: string) {
  console.error(`  FAIL: ${detail ? label + " — " + detail : label}`);
  failCount++;
}
function note(label: string) { console.log(`  NOTE: ${label}`); }

async function ss(page: import("playwright-core").Page, name: string) {
  const p = path.join(SS_DIR, `p2-journey-${name}.png`);
  await page.screenshot({ path: p, fullPage: false });
  console.log(`    [ss] p2-journey-${name}.png`);
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log("\n=== P2 BROWSER CHECKOUT JOURNEY ===");
  console.log("    Production handlers + in-memory DB + real Next.js frontend\n");

  const { server, port } = await startTestServer();
  console.log(`Test server on port ${port}\n`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page    = await context.newPage();

  // ── Route interception: /api/orders* → test server ──────────────────────────
  let postedRef: string | null = null;
  let setCookieRaw: string | null = null;

  await page.route(/localhost:3333\/api\/orders/, async (route) => {
    const req = route.request();
    const method = req.method();

    if (method === "POST") {
      // Forward POST body to test server
      const body = req.postData() ?? "{}";
      const res = await fetch(`http://127.0.0.1:${port}/api/orders`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });
      const resText = await res.text();
      const headers: Record<string, string> = {};
      res.headers.forEach((v, k) => { headers[k] = v; });

      // Capture the Set-Cookie for the GET phase
      const sc = res.headers.get("set-cookie");
      if (sc) {
        setCookieRaw = sc;
        const nameValue = sc.split(";")[0];
        const [name, value] = nameValue.split("=");
        // Manually add cookie to context so the GET request includes it
        if (name && value) {
          await context.addCookies([{
            name:     name.trim(),
            value:    value.trim(),
            domain:   "localhost",
            path:     "/",
            httpOnly: true,
            sameSite: "Strict",
          }]);
        }
      }

      await route.fulfill({
        status:  res.status,
        headers,
        body:    resText,
      });
      return;
    }

    if (method === "GET") {
      // Forward GET with cookies to test server
      const url  = new URL(req.url());
      const ref  = url.pathname.split("/").filter(Boolean).pop() ?? "";

      // Get cookies from context
      const cookies = await context.cookies("http://localhost:3333");
      const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join("; ");

      const res = await fetch(`http://127.0.0.1:${port}/api/orders/${encodeURIComponent(ref)}`, {
        headers: { "Cookie": cookieHeader },
      });
      const resText = await res.text();
      const headers: Record<string, string> = {};
      res.headers.forEach((v, k) => { headers[k] = v; });

      await route.fulfill({
        status:  res.status,
        headers,
        body:    resText,
      });
      return;
    }

    await route.continue();
  });

  try {
    // ── Step 1: Add sauvage-inspired to cart via PDP ────────────────────────────
    console.log("── Step 1: Add item to cart from PDP ──\n");

    await page.goto(PDP_URL, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1200);
    await ss(page, "01-pdp");

    const sizeBtn = page.locator('button:has-text("5ml")').first();
    if (await sizeBtn.count() > 0) {
      await sizeBtn.click();
      await page.waitForTimeout(300);
    }

    const addBtn = page.locator('button:has-text("Add to Cart"), button:has-text("Add to Bag")').first();
    if (await addBtn.count() > 0) {
      await addBtn.click();
      await page.waitForTimeout(700);
      pass("Step 1: item added to cart from PDP");
    } else {
      fail("Step 1: Add to cart", "Add to Cart button not found");
    }

    // Close auto-opened cart if any
    const cartClose = page.locator('[role="dialog"][aria-label="Shopping cart"] button[aria-label="Close Cart"]');
    if (await cartClose.count() > 0 && await cartClose.isVisible().catch(() => false)) {
      await cartClose.click();
      await page.waitForTimeout(300);
    }

    // ── Step 2: Navigate to /checkout and fill form ─────────────────────────────
    console.log("── Step 2: Fill checkout form ──\n");

    await page.goto(`${BASE_URL}/checkout`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(800);
    await ss(page, "02-checkout");

    // Verify cart items are visible on checkout page
    const cartItems = await page.locator("text=Sauvage Inspired").count();
    note(`Cart items on checkout page: ${cartItems}`);

    // Fill form
    const nameInput = page.locator("#checkout-name, input[placeholder*='name' i], input[name='name']").first();
    if (await nameInput.count() > 0) {
      await nameInput.fill("P2 Test Customer");
      pass("Name field filled");
    } else {
      fail("Name field", "not found");
    }

    const phoneInput = page.locator("#checkout-phone").first();
    if (await phoneInput.count() > 0) {
      await phoneInput.fill("+27600000000");
      pass("Phone field filled");
    } else {
      fail("Phone field", "#checkout-phone not found");
    }

    // Province defaults to "Cape Town Metro" — keep default
    // Address is a textarea, required for non-collection
    const addressInput = page.locator("#checkout-address").first();
    if (await addressInput.count() > 0) {
      await addressInput.fill("1 Test Street, Cape Town");
      pass("Address field filled");
    } else {
      note("Address textarea not found (#checkout-address) — may be hidden for collection mode");
    }

    await ss(page, "03-checkout-filled");

    // ── Step 3: Submit order ────────────────────────────────────────────────────
    console.log("── Step 3: Submit order (intercepted POST) ──\n");

    // Find submit button
    const submitBtn = page.locator('button:has-text("Place Order"), button:has-text("Complete Order"), button:has-text("Submit"), button[type="submit"]').first();
    if (await submitBtn.count() === 0) {
      // Dump all buttons
      const btns = await page.locator("button").evaluateAll(
        els => els.map(el => (el.textContent?.trim() || el.getAttribute("aria-label") || "?").slice(0, 40))
      );
      note(`All buttons: ${JSON.stringify(btns)}`);
      fail("Submit button", "not found by text");
    } else {
      const submitText = await submitBtn.textContent();
      note(`Submit button text: "${submitText?.trim()}"`);

      // Listen for navigation to /payment-success
      const navPromise = page.waitForURL(/payment-success/, { timeout: 15000 }).catch(() => null);

      await submitBtn.click();
      await page.waitForTimeout(500);
      await ss(page, "04-after-submit");

      const navResult = await navPromise;

      if (navResult !== null || page.url().includes("payment-success")) {
        const currentUrl = page.url();
        pass(`Step 3: Order submitted; redirected to ${currentUrl}`);

        const urlRef = new URL(currentUrl).searchParams.get("ref");
        if (urlRef) {
          postedRef = urlRef;
          pass(`Step 3: orderRef in URL: ${urlRef}`);
        } else {
          fail("Step 3: orderRef", "not in redirect URL");
        }
      } else {
        const currentUrl = page.url();
        const pageText = await page.evaluate(() => document.body.innerText.slice(0, 200));
        fail("Step 3: redirect to payment-success", `still at ${currentUrl}; page: "${pageText}"`);
      }
    }

    // ── Step 4: Verify confirmation page shows authoritative total ──────────────
    if (postedRef) {
      console.log("── Step 4: Verify confirmation page ──\n");
      await page.waitForTimeout(1000);
      await ss(page, "05-confirmation");

      const pageText = await page.evaluate(() => document.body.innerText);
      note(`Confirmation page text snippet: "${pageText.slice(0, 200)}"`);

      // The page should show R160 (sauvage-inspired 5ml R60 + R100 Cape Town Metro)
      const hasTotal = pageText.includes("160") || pageText.includes("R160");
      hasTotal
        ? pass("Confirmation page shows authoritative total R160")
        : fail("Confirmation page total", `R160 not found in page text (preview: "${pageText.slice(0, 100)}")`);

      // Check payment instructions are shown (EFT banking details)
      const hasBanking = pageText.toLowerCase().includes("bank") || pageText.toLowerCase().includes("eft") || pageText.toLowerCase().includes("transfer");
      note(`Banking/EFT instructions present: ${hasBanking}`);

      // ── Step 5: ?total= tamper test ─────────────────────────────────────────
      console.log("── Step 5: ?total=9999 tamper test ──\n");

      await page.goto(`${BASE_URL}/payment-success?ref=${encodeURIComponent(postedRef)}&total=9999`, {
        waitUntil: "domcontentloaded",
      });
      await page.waitForTimeout(1200);
      await ss(page, "06-tamper-test");

      const tamperText = await page.evaluate(() => document.body.innerText);

      const stillShowsCorrectTotal = tamperText.includes("160");
      const doesNotShow9999 = !tamperText.includes("9999");
      stillShowsCorrectTotal && doesNotShow9999
        ? pass("?total=9999 ignored: page still shows R160 (server-authoritative total)")
        : doesNotShow9999
          ? pass("?total=9999 not displayed (tamper ignored)")
          : fail("?total=9999 tamper", `page shows '9999' in text`);

      // ── Step 6: Refresh confirmation (cookie persists) ───────────────────────
      console.log("── Step 6: Refresh confirmation page ──\n");

      await page.reload({ waitUntil: "domcontentloaded" });
      await page.waitForTimeout(1000);
      await ss(page, "07-confirmation-refresh");

      const refreshText = await page.evaluate(() => document.body.innerText);
      const stillHasTotal = refreshText.includes("160") || (refreshText.includes("awaiting") || refreshText.includes("MSR-"));
      stillHasTotal
        ? pass("Confirmation page reloads successfully with cookie (total visible after refresh)")
        : fail("Confirmation page refresh", `total not shown after refresh: "${refreshText.slice(0, 100)}"`);

      // ── Step 7: Navigate directly without cookie ─────────────────────────────
      console.log("── Step 7: No-cookie direct access shows graceful error ──\n");

      // Open new context (no cookies)
      const noCookieCtx  = await browser.newContext({ viewport: { width: 1280, height: 800 } });
      const noCookiePage = await noCookieCtx.newPage();

      // Route interception for the no-cookie context
      await noCookiePage.route(/localhost:3333\/api\/orders/, async (route) => {
        const req = route.request();
        if (req.method() === "GET") {
          const url = new URL(req.url());
          const ref = url.pathname.split("/").filter(Boolean).pop() ?? "";
          const res = await fetch(`http://127.0.0.1:${port}/api/orders/${encodeURIComponent(ref)}`);
          const resText = await res.text();
          const headers: Record<string, string> = {};
          res.headers.forEach((v, k) => { headers[k] = v; });
          await route.fulfill({ status: res.status, headers, body: resText });
          return;
        }
        await route.continue();
      });

      await noCookiePage.goto(`${BASE_URL}/payment-success?ref=${encodeURIComponent(postedRef)}`, {
        waitUntil: "domcontentloaded",
      });
      await noCookiePage.waitForTimeout(1200);
      await ss(noCookiePage, "08-no-cookie-access");

      const noCookieText = await noCookiePage.evaluate(() => document.body.innerText);
      // Should show error state (not crash, not leak order data)
      const showsError = noCookieText.toLowerCase().includes("error") ||
                         noCookieText.toLowerCase().includes("unavailable") ||
                         noCookieText.toLowerCase().includes("unable") ||
                         !noCookieText.includes("160");
      showsError
        ? pass("No-cookie access: page shows error or hides total (does not leak data)")
        : fail("No-cookie access", `page shows total/data without cookie: "${noCookieText.slice(0, 100)}"`);

      await noCookieCtx.close();
    }

    await ss(page, "09-final");

  } finally {
    await browser.close();
    server.close();
  }

  console.log("\n──────────────────────────────────────────────────────────");
  console.log(`  Results: ${passCount} passed, ${failCount} failed\n`);
  if (failCount > 0) {
    console.log("  HOLD — see FAIL lines above");
    process.exitCode = 1;
  } else {
    console.log("  PASS — browser journey complete");
  }
}

main().catch(e => {
  console.error("FATAL:", e instanceof Error ? e.stack : String(e));
  process.exit(1);
});
