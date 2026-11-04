// @ts-check
/**
 * P3 browser acceptance — checkout recovery (P3C-Retry), order-title
 * independence (P3A) and commercial smoke checks.
 *
 * Every /api/orders POST and /api/orders/<ref> GET is answered by an in-test
 * mock; nothing reaches the server's order handler or any database. Any other
 * /api/* request, any request to another origin, and any unmocked order call
 * is aborted and fails the test. All customer data is synthetic.
 *
 * Mocked responses prove CLIENT behaviour only. Server-side pricing, title
 * canonicalisation and idempotency are covered by the existing tsx suites
 * (p2a, p2d, p2e, p3a); nothing here validates server financial authority.
 *
 * Run only via: scripts/pw-verify/playwright.p3-acceptance.config.ts
 */

const base = require("@playwright/test");
const { expect } = base;

// ── Network guard (installed before the first navigation of every test) ──────

const APP_ORIGIN = "http://127.0.0.1:3110";

const test = base.test.extend({
  net: [async ({ context }, use) => {
    const net = {
      unexpected:  [],
      orderPosts:  [],
      receiptGets: [],
      onOrder:     null, // (n, body) => { status, json } | { status, body, contentType } | { abort: true }, optional delayMs
      onReceipt:   null, // (ref) => { status, json }
    };
    await context.route("**/*", async (route) => {
      const req = route.request();
      let url;
      try { url = new URL(req.url()); } catch {
        net.unexpected.push(`UNPARSEABLE ${req.url()}`);
        return route.abort("blockedbyclient");
      }
      if (url.origin !== APP_ORIGIN) {
        net.unexpected.push(`EXTERNAL ${req.method()} ${url.origin}${url.pathname}`);
        return route.abort("blockedbyclient");
      }
      if (url.pathname === "/api/orders") {
        if (req.method() !== "POST") {
          net.unexpected.push(`UNEXPECTED ${req.method()} /api/orders`);
          return route.abort("blockedbyclient");
        }
        let body = null;
        try { body = JSON.parse(req.postData() ?? ""); } catch { /* recorded as null */ }
        net.orderPosts.push(body);
        const reply = net.onOrder ? net.onOrder(net.orderPosts.length, body) : null;
        if (!reply) {
          net.unexpected.push(`UNMOCKED POST /api/orders #${net.orderPosts.length}`);
          return route.abort("blockedbyclient");
        }
        if (reply.delayMs) await new Promise((r) => setTimeout(r, reply.delayMs));
        if (reply.abort) return route.abort("failed");
        return route.fulfill({
          status:      reply.status,
          contentType: reply.contentType ?? "application/json",
          body:        reply.json !== undefined ? JSON.stringify(reply.json) : reply.body,
        });
      }
      if (url.pathname.startsWith("/api/orders/")) {
        const ref = decodeURIComponent(url.pathname.slice("/api/orders/".length));
        net.receiptGets.push(ref);
        const reply = req.method() === "GET" && net.onReceipt ? net.onReceipt(ref) : null;
        if (!reply) {
          net.unexpected.push(`UNMOCKED ${req.method()} /api/orders/${ref}`);
          return route.abort("blockedbyclient");
        }
        return route.fulfill({ status: reply.status, contentType: "application/json", body: JSON.stringify(reply.json) });
      }
      if (url.pathname.startsWith("/api/")) {
        net.unexpected.push(`UNEXPECTED API ${req.method()} ${url.pathname}`);
        return route.abort("blockedbyclient");
      }
      return route.continue();
    });
    await use(net);
    expect(net.unexpected, "no unexpected, unmocked or external requests").toEqual([]);
  }, { auto: true }],
});

// ── Synthetic fixtures ───────────────────────────────────────────────────────

const ATTEMPT_SS = "msr_checkout_attempt";
const CART_KEY   = "maison-skye-rose-cart";
const UUID_V4_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const CAPRI_NAME   = "Capri In a Bottle Lemon Sugar | 14 Inspired";
const CAPRI_SLUG   = "capri-lemon-sugar-inspired";
const CAPRI_LEGACY = "capri-in-a-bottle-lemon-sugar-|-14-inspired";
const SAUVAGE      = { id: "sauvage-inspired", title: "Sauvage Inspired" };

const RETAIL = { "5ml": 60, "10ml": 100, "30ml": 250 };
const FRIENDLY_400 = "We couldn't process that order. Please review your bag and details, then try again.";
const CONNECTION_ERROR = "A connection error occurred.";
const SYNTHETIC_REF = "MSR-20261019-00001";

const line = (id, title, size, quantity, image = "/images/elite-5ml.png") =>
  ({ id, title, price: RETAIL[size], image, quantity, size });

const FROZEN_KEY = "11111111-1111-4111-8111-111111111111";

const frozenAttempt = (items, overrides = {}) => {
  const subtotal = items.reduce((t, i) => t + i.price * i.quantity, 0);
  return {
    key: FROZEN_KEY, name: "Synthetic Guest", phone: "0820000001",
    address: "1 Synthetic Street, Cape Town", province: "Cape Town Metro",
    items, subtotal, delivery: 100, total: subtotal + 100, submitted: true,
    ...overrides,
  };
};

// ── Helpers ──────────────────────────────────────────────────────────────────

// Seeds storage on the app origin, then opens checkout. Storage is seeded once,
// so a later page.reload() observes what the app itself persisted.
async function openCheckout(page, { cart = [], attempt } = {}) {
  await page.goto("/robots.txt");
  await page.evaluate(({ cartKey, cart, attemptKey, attempt }) => {
    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem(cartKey, JSON.stringify(cart));
    if (attempt) sessionStorage.setItem(attemptKey, JSON.stringify(attempt));
  }, { cartKey: CART_KEY, cart, attemptKey: ATTEMPT_SS, attempt: attempt ?? null });
  await page.goto("/checkout");
  await expect(page.getByRole("button", { name: /^(Place Order|Retry original order)$/ })).toBeVisible();
  // Wait until checkout's mount effect has run (effects run after hydration).
  // Storage was cleared above, so neither signal can predate this page.
  if (attempt) {
    // A seeded key exists before navigation, so only a submitted attempt is
    // supported: its retry button is client-only (the server cannot read storage).
    if (attempt.submitted !== true) throw new Error("openCheckout: seeded attempts must be submitted");
    await expect(retryButton(page)).toBeVisible();
  } else {
    // Only the mount effect writes the attempt key before any user action.
    await expect.poll(() => page.evaluate((k) => sessionStorage.getItem(k), ATTEMPT_SS)).not.toBeNull();
  }
}

const readAttempt = (page) =>
  page.evaluate((k) => JSON.parse(sessionStorage.getItem(k) ?? "null"), ATTEMPT_SS);

const placeOrderButton = (page) => page.getByRole("button", { name: "Place Order", exact: true });
const retryButton      = (page) => page.getByRole("button", { name: "Retry original order", exact: true });
const retryBanner      = (page) => page.getByText("Retrying your previous order", { exact: true });

async function fillFreshForm(page, { name = "Synthetic Guest", phone = "0820000002", address = "2 Synthetic Road, Cape Town" } = {}) {
  await page.fill("#checkout-name", name);
  await page.fill("#checkout-phone", phone);
  if (await page.locator("#checkout-address").count()) await page.fill("#checkout-address", address);
}

// Order-summary value next to a label ("Subtotal", "Delivery", "Collection", "Total").
const summaryValue = (page, label) =>
  page.locator("xpath=//p[normalize-space()='Order Summary']/parent::div")
    .locator(`xpath=.//span[normalize-space()='${label}']/following-sibling::span[1]`);

const ids = (body) => (body?.items ?? []).map((i) => `${i.id}|${i.size}|${i.quantity}`);

const reply503 = { status: 503, json: { success: false, message: "Synthetic 503 — test response" } };

// ── R: checkout recovery (P3C-Retry) ─────────────────────────────────────────

test.describe("R — checkout recovery after a definitive HTTP 400", () => {
  test("R1+R2 frozen legacy-Capri attempt: 400 releases it; next manual submit uses canonical cart and a fresh key", async ({ page, net }) => {
    net.onOrder = (n) => n === 1
      ? { status: 400, json: { success: false, message: `Product not found: ${CAPRI_LEGACY}` } }
      : { status: 200, json: { success: true, orderRef: SYNTHETIC_REF } };
    net.onReceipt = () => ({ status: 200, json: { orderRef: SYNTHETIC_REF, total: 160, paymentStatus: "awaiting_payment", province: "Cape Town Metro" } });

    await openCheckout(page, {
      cart:    [line(CAPRI_LEGACY, CAPRI_NAME, "5ml", 1)],
      attempt: frozenAttempt([line(CAPRI_LEGACY, CAPRI_NAME, "5ml", 1)]),
    });
    await expect(retryBanner(page)).toBeVisible();
    await expect(page.locator("#checkout-name")).toHaveAttribute("readonly", "");

    await retryButton(page).click();
    await expect.poll(() => net.orderPosts.length).toBe(1);
    expect(net.orderPosts[0].checkout_attempt_key).toBe(FROZEN_KEY);
    expect(ids(net.orderPosts[0])).toEqual([`${CAPRI_LEGACY}|5ml|1`]);

    await expect(page.getByRole("alert").filter({ hasText: FRIENDLY_400 })).toBeVisible();
    await expect(page.getByText("Product not found")).toHaveCount(0);
    await expect(retryBanner(page)).toHaveCount(0);
    await expect(placeOrderButton(page)).toBeVisible();
    await expect(page.locator("#checkout-name")).not.toHaveAttribute("readonly", "");
    await expect(page.locator("#checkout-name")).toHaveValue("Synthetic Guest");

    const released = await readAttempt(page);
    expect(released.submitted).toBe(false);
    expect(released.key).toMatch(UUID_V4_RE);
    expect(released.key).not.toBe(FROZEN_KEY);
    expect(released.items).toEqual([]);

    // The cart itself was already migrated by P3C.
    const cart = await page.evaluate((k) => JSON.parse(localStorage.getItem(k)), CART_KEY);
    expect(cart.map((l) => l.id)).toEqual([CAPRI_SLUG]);

    // R2: manual resubmission.
    await placeOrderButton(page).click();
    await expect.poll(() => net.orderPosts.length).toBe(2);
    const second = net.orderPosts[1];
    expect(second.checkout_attempt_key).toBe(released.key);
    expect(ids(second)).toEqual([`${CAPRI_SLUG}|5ml|1`]);
    expect(second.customer_name).toBe("Synthetic Guest");
    expect(second.phone).toBe("0820000001");
    await page.waitForURL(`**/payment-success?ref=${SYNTHETIC_REF}`);
  });

  test("R3 fresh submission rejected with 400: corrected form value is sent under a new key", async ({ page, net }) => {
    net.onOrder = (n) => n === 1 ? { status: 400, json: { success: false, message: "Invalid phone" } } : reply503;
    await openCheckout(page, { cart: [line(SAUVAGE.id, SAUVAGE.title, "10ml", 1, "/images/blue-10ml.png")] });
    await fillFreshForm(page, { phone: "0820000003" });
    await placeOrderButton(page).click();
    await expect.poll(() => net.orderPosts.length).toBe(1);
    await expect(page.getByRole("alert").filter({ hasText: FRIENDLY_400 })).toBeVisible();
    const firstKey = net.orderPosts[0].checkout_attempt_key;

    await page.fill("#checkout-phone", "0829999999");
    await placeOrderButton(page).click();
    await expect.poll(() => net.orderPosts.length).toBe(2);
    expect(net.orderPosts[1].phone).toBe("0829999999");
    expect(net.orderPosts[1].checkout_attempt_key).toMatch(UUID_V4_RE);
    expect(net.orderPosts[1].checkout_attempt_key).not.toBe(firstKey);
  });

  test("R4 HTTP 409 keeps the conflict state and the original key", async ({ page, net }) => {
    net.onOrder = () => ({ status: 409, json: { success: false, message: "Synthetic conflict" } });
    const attempt = frozenAttempt([line(CAPRI_SLUG, CAPRI_NAME, "5ml", 1)]);
    await openCheckout(page, { cart: attempt.items, attempt });
    await retryButton(page).click();
    await expect.poll(() => net.orderPosts.length).toBe(1);
    await expect(page.getByText("An earlier order may already exist.", { exact: true })).toBeVisible();
    const kept = await readAttempt(page);
    expect(kept.key).toBe(FROZEN_KEY);
    expect(kept.submitted).toBe(true);
    expect(kept.items).toEqual(attempt.items);
  });

  for (const status of [500, 503]) {
    test(`R${status === 500 ? 5 : 6} HTTP ${status} keeps the frozen attempt; a manual retry resends the same key and payload`, async ({ page, net }) => {
      net.onOrder = () => ({ status, json: { success: false, message: `Synthetic ${status} — test response` } });
      const attempt = frozenAttempt([line(CAPRI_SLUG, CAPRI_NAME, "10ml", 2)]);
      await openCheckout(page, { cart: attempt.items, attempt });
      await retryButton(page).click();
      await expect.poll(() => net.orderPosts.length).toBe(1);
      await expect(page.getByText(`Synthetic ${status} — test response`)).toBeVisible();
      await expect(retryButton(page)).toBeVisible();
      expect((await readAttempt(page)).key).toBe(FROZEN_KEY);
      expect((await readAttempt(page)).submitted).toBe(true);

      await retryButton(page).click();
      await expect.poll(() => net.orderPosts.length).toBe(2);
      expect(net.orderPosts[1]).toEqual(net.orderPosts[0]);
    });
  }

  test("R7 network interruption keeps the frozen attempt", async ({ page, net }) => {
    net.onOrder = () => ({ abort: true });
    const attempt = frozenAttempt([line(CAPRI_SLUG, CAPRI_NAME, "5ml", 1)]);
    await openCheckout(page, { cart: attempt.items, attempt });
    await retryButton(page).click();
    await expect.poll(() => net.orderPosts.length).toBe(1);
    await expect(page.getByText(CONNECTION_ERROR)).toBeVisible();
    const kept = await readAttempt(page);
    expect(kept.key).toBe(FROZEN_KEY);
    expect(kept.submitted).toBe(true);
    await expect(retryBanner(page)).toBeVisible();
  });

  test("R8 HTTP 400 with a non-JSON body keeps the frozen attempt", async ({ page, net }) => {
    net.onOrder = () => ({ status: 400, contentType: "text/html", body: "<html><body>Synthetic Bad Request</body></html>" });
    const attempt = frozenAttempt([line(CAPRI_LEGACY, CAPRI_NAME, "5ml", 1)]);
    await openCheckout(page, { cart: attempt.items, attempt });
    await retryButton(page).click();
    await expect.poll(() => net.orderPosts.length).toBe(1);
    await expect(page.getByText(CONNECTION_ERROR)).toBeVisible();
    await expect(page.getByText(FRIENDLY_400)).toHaveCount(0);
    expect((await readAttempt(page)).key).toBe(FROZEN_KEY);
    expect((await readAttempt(page)).submitted).toBe(true);
  });

  test("R9 HTTP 400 with success:true does not trigger rejection recovery", async ({ page, net }) => {
    net.onOrder = () => ({ status: 400, json: { success: true, message: "Synthetic contradictory 400" } });
    const attempt = frozenAttempt([line(CAPRI_SLUG, CAPRI_NAME, "5ml", 1)]);
    await openCheckout(page, { cart: attempt.items, attempt });
    await retryButton(page).click();
    await expect.poll(() => net.orderPosts.length).toBe(1);
    await expect(page.getByText("Synthetic contradictory 400")).toBeVisible();
    await expect(page.getByText(FRIENDLY_400)).toHaveCount(0);
    expect((await readAttempt(page)).key).toBe(FROZEN_KEY);
    expect((await readAttempt(page)).submitted).toBe(true);
  });

  test("R10 reload after a definitive rejection stays out of retry mode", async ({ page, net }) => {
    net.onOrder = () => ({ status: 400, json: { success: false, message: "Synthetic rejection" } });
    const attempt = frozenAttempt([line(CAPRI_LEGACY, CAPRI_NAME, "5ml", 1)]);
    await openCheckout(page, { cart: attempt.items, attempt });
    await retryButton(page).click();
    await expect(page.getByText(FRIENDLY_400)).toBeVisible();
    const released = await readAttempt(page);

    await page.reload();
    await expect(placeOrderButton(page)).toBeVisible();
    await expect(retryBanner(page)).toHaveCount(0);
    const restored = await readAttempt(page);
    expect(restored.key).toBe(released.key);
    expect(restored.submitted).toBe(false);
    expect(net.orderPosts.length).toBe(1);
  });

  test("R11 no automatic resubmission after a 400 (3 s quiet period, justified)", async ({ page, net }) => {
    net.onOrder = () => ({ status: 400, json: { success: false, message: "Synthetic rejection" } });
    const attempt = frozenAttempt([line(CAPRI_LEGACY, CAPRI_NAME, "5ml", 1)]);
    await openCheckout(page, { cart: attempt.items, attempt });
    await retryButton(page).click();
    await expect(page.getByText(FRIENDLY_400)).toBeVisible();
    // Fixed wait is deliberate: it proves that no request follows on its own.
    await page.waitForTimeout(3_000);
    expect(net.orderPosts.length).toBe(1);
  });

  test("R12 an in-flight request cannot be reset; its outcome governs the attempt", async ({ page, net }) => {
    net.onOrder = () => ({ ...reply503, delayMs: 4_000 });
    const attempt = frozenAttempt([line(CAPRI_SLUG, CAPRI_NAME, "5ml", 1)]);
    await openCheckout(page, { cart: attempt.items, attempt });
    await retryButton(page).click();
    const startNew = page.getByRole("button", { name: "Start a separate new order instead" });
    await expect(page.getByRole("button", { name: "Retrying Order..." })).toBeDisabled();
    await expect(startNew).toBeDisabled();
    expect((await readAttempt(page)).key).toBe(FROZEN_KEY);
    await expect(page.getByText("Synthetic 503 — test response")).toBeVisible({ timeout: 15_000 });
    expect((await readAttempt(page)).key).toBe(FROZEN_KEY);
    expect(net.orderPosts.length).toBe(1);
  });

  test("R13 user-initiated separate new order rotates the key and leaves retry mode", async ({ page, net }) => {
    net.onOrder = () => reply503;
    const attempt = frozenAttempt([line(CAPRI_SLUG, CAPRI_NAME, "5ml", 1)]);
    await openCheckout(page, { cart: [line(SAUVAGE.id, SAUVAGE.title, "5ml", 2, "/images/blue-5ml.png")], attempt });
    await page.getByRole("button", { name: "Start a separate new order instead" }).click();
    await expect(retryBanner(page)).toHaveCount(0);
    const fresh = await readAttempt(page);
    expect(fresh.key).toMatch(UUID_V4_RE);
    expect(fresh.key).not.toBe(FROZEN_KEY);
    expect(fresh.submitted).toBe(false);
    expect(net.orderPosts.length).toBe(0);

    await placeOrderButton(page).click();
    await expect.poll(() => net.orderPosts.length).toBe(1);
    expect(net.orderPosts[0].checkout_attempt_key).toBe(fresh.key);
    expect(ids(net.orderPosts[0])).toEqual([`${SAUVAGE.id}|5ml|2`]);
  });
});

// ── A: order-title independence (P3A, client side only) ──────────────────────

test("A1 [CLIENT ONLY] success flow does not rely on the client-supplied title", async ({ page, net }) => {
  // LIMITATION: no customer-facing page renders server-returned item titles
  // (the receipt shows total, payment status and province only). This test
  // therefore proves the client neither needs nor displays an authoritative
  // title; backend canonicalisation is proven by p3a-order-title-integrity.
  const WRONG_TITLE = "Synthetic Client Title Not In Catalogue";
  net.onOrder = () => ({ status: 200, json: { success: true, orderRef: SYNTHETIC_REF } });
  net.onReceipt = (ref) => ({ status: 200, json: { orderRef: ref, total: 160, paymentStatus: "awaiting_payment", province: "Cape Town Metro" } });

  await openCheckout(page, { cart: [line(CAPRI_SLUG, WRONG_TITLE, "5ml", 1)] });
  await fillFreshForm(page);
  await placeOrderButton(page).click();
  await expect.poll(() => net.orderPosts.length).toBe(1);
  expect(net.orderPosts[0].items[0].id).toBe(CAPRI_SLUG);
  await page.waitForURL(`**/payment-success?ref=${SYNTHETIC_REF}`);
  await expect.poll(() => net.receiptGets).toEqual([SYNTHETIC_REF]);
  await expect(page.getByText("R160.00").first()).toBeVisible();
  // Visible text only: the closed MiniCart dialog stays in the DOM.
  await expect(page.getByText(WRONG_TITLE).filter({ visible: true })).toHaveCount(0);
});

// ── K: commercial smoke checks (client-displayed totals) ────────────────────
// Totals below are what checkout DISPLAYS and SENDS. The server recomputes and
// validates them (p2a/p2d); the mocked 503 here validates nothing server-side.

const KCASES = [
  { id: "K1", desc: "9 units: retail, no wholesale", province: "Cape Town Metro",
    cart: [line(SAUVAGE.id, SAUVAGE.title, "5ml", 9, "/images/blue-5ml.png")],
    subtotal: 540, delivery: 100 },
  { id: "K2", desc: "10 units across products and sizes: wholesale R48/R77/R180", province: "Cape Town Metro",
    cart: [line(SAUVAGE.id, SAUVAGE.title, "5ml", 4, "/images/blue-5ml.png"), line(CAPRI_SLUG, CAPRI_NAME, "10ml", 3), line(CAPRI_SLUG, CAPRI_NAME, "30ml", 3)],
    subtotal: 4 * 48 + 3 * 77 + 3 * 180, delivery: 100 },
  { id: "K3", desc: "collection is free", province: "Collection / Pickup",
    cart: [line(CAPRI_SLUG, CAPRI_NAME, "30ml", 1)],
    subtotal: 250, delivery: 0 },
  { id: "K4", desc: "exactly R2000 after wholesale is charged", province: "Cape Town Metro",
    cart: [line(CAPRI_SLUG, CAPRI_NAME, "30ml", 7), line(CAPRI_SLUG, CAPRI_NAME, "10ml", 4), line(SAUVAGE.id, SAUVAGE.title, "5ml", 9, "/images/blue-5ml.png")],
    subtotal: 2000, delivery: 100 },
  { id: "K5", desc: "strictly above R2000 after wholesale is free", province: "Cape Town Metro",
    cart: [line(CAPRI_SLUG, CAPRI_NAME, "30ml", 7), line(CAPRI_SLUG, CAPRI_NAME, "10ml", 4), line(SAUVAGE.id, SAUVAGE.title, "5ml", 10, "/images/blue-5ml.png")],
    subtotal: 2048, delivery: 0 },
  { id: "K6", desc: "R2750 retail but R1980 after wholesale is charged", province: "Cape Town Metro",
    cart: [line(CAPRI_SLUG, CAPRI_NAME, "30ml", 11)],
    subtotal: 1980, delivery: 100 },
];

test.describe("K — commercial smoke checks", () => {
  for (const k of KCASES) {
    test(`${k.id} ${k.desc}`, async ({ page, net }) => {
      net.onOrder = () => reply503;
      await openCheckout(page, { cart: k.cart });
      await page.selectOption("#checkout-province", k.province);
      const deliveryLabel = k.province === "Collection / Pickup" ? "Collection" : "Delivery";
      await expect(summaryValue(page, "Subtotal")).toHaveText(`R${k.subtotal.toFixed(2)}`);
      await expect(summaryValue(page, deliveryLabel)).toHaveText(k.delivery === 0 ? "FREE" : `R${k.delivery.toFixed(2)}`);
      await expect(summaryValue(page, "Total")).toHaveText(`R${(k.subtotal + k.delivery).toFixed(2)}`);

      await fillFreshForm(page);
      await placeOrderButton(page).click();
      await expect.poll(() => net.orderPosts.length).toBe(1);
      const sent = net.orderPosts[0];
      expect([sent.subtotal, sent.delivery, sent.total]).toEqual([k.subtotal, k.delivery, k.subtotal + k.delivery]);
      expect(sent.province).toBe(k.province);
    });
  }
});
