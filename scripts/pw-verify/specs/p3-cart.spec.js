// @ts-check
/**
 * P3 browser acceptance — cart identity (P3C).
 *
 * Cart lines must carry authoritative catalogue slugs. Adds through
 * QuickAddModal and MiniCart, legacy Capri cart migration on load, reload
 * idempotence, unknown-ID preservation and canonical IDs in the checkout POST.
 *
 * Storage is synthetic and seeded per test in a fresh browser context. The
 * only order request (C7) is answered by an in-test mock. Any other /api/*
 * request, unmocked order call or external request fails the test.
 *
 * Run only via: scripts/pw-verify/playwright.p3-acceptance.config.ts
 */

const base = require("@playwright/test");
const { expect } = base;

// ── Network guard (installed before the first navigation of every test) ──────

const APP_ORIGIN = "http://127.0.0.1:3110";

const test = base.test.extend({
  net: [async ({ context }, use) => {
    const net = { unexpected: [], orderPosts: [], onOrder: null };
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
      if (url.pathname === "/api/orders" && req.method() === "POST") {
        let body = null;
        try { body = JSON.parse(req.postData() ?? ""); } catch { /* recorded as null */ }
        net.orderPosts.push(body);
        const reply = net.onOrder ? net.onOrder(net.orderPosts.length, body) : null;
        if (!reply) {
          net.unexpected.push(`UNMOCKED POST /api/orders #${net.orderPosts.length}`);
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

const CART_KEY = "maison-skye-rose-cart";
const FAV_KEY  = "maison-skye-rose-favorites";
const RV_KEY   = "recentlyViewed";

const CAPRI_NAME   = "Capri In a Bottle Lemon Sugar | 14 Inspired";
const CAPRI_SLUG   = "capri-lemon-sugar-inspired";
const CAPRI_LEGACY = "capri-in-a-bottle-lemon-sugar-|-14-inspired";
const CAPRI_PRICES = { "5ml": 60, "10ml": 100, "30ml": 250 };
const CAPRI_IMAGES = { "5ml": "/images/elite-5ml.png", "10ml": "/images/elite-10ml.png", "30ml": "/images/glass-elite-30ml.png" };
const SAUVAGE      = { id: "sauvage-inspired", title: "Sauvage Inspired" };
const UNKNOWN      = { id: "synthetic-unknown-fragrance", title: "Synthetic Unknown Fragrance" };

const line = (id, title, size, quantity, image = CAPRI_IMAGES[size]) =>
  ({ id, title, price: CAPRI_PRICES[size], image, quantity, size });

// Shape written by ProductCard's favourite toggle; values from the Capri record.
const CAPRI_FAVOURITE = {
  title: CAPRI_NAME, subtitle: "", mood: "", profile: "", season: [], notes: [],
  prices: CAPRI_PRICES, images: CAPRI_IMAGES, image: CAPRI_IMAGES["10ml"],
  bestSeller: false, newArrival: false,
};

// ── Helpers ──────────────────────────────────────────────────────────────────

async function seed(page, local) {
  await page.goto("/robots.txt");
  await page.evaluate((entries) => {
    localStorage.clear();
    sessionStorage.clear();
    for (const [k, v] of entries) localStorage.setItem(k, JSON.stringify(v));
  }, Object.entries(local));
}

const readCart = (page) => page.evaluate((k) => JSON.parse(localStorage.getItem(k) ?? "null"), CART_KEY);
const summary  = (cart) => (cart ?? []).map((l) => `${l.id}|${l.size}|${l.quantity}`);

// ProductCard root: the nearest ancestor holding both the image and Quick Add.
const cardFor = (page, title) =>
  page.getByRole("heading", { level: 3, name: title, exact: true })
    .locator("xpath=ancestor::div[.//img and .//button[normalize-space()='Quick Add']][1]");

async function openMiniCartRecommendations(page) {
  await page.getByRole("button", { name: "Open Cart" }).click();
  const cart = page.getByRole("dialog", { name: "Shopping cart" });
  await expect(cart).toBeVisible();
  await cart.getByRole("button", { name: /You May Also Like/ }).click();
  return cart;
}

const section = (dialog, heading) =>
  dialog.locator(`xpath=.//p[normalize-space()='${heading}']/parent::div`);

const addFromRow = (scope, title) =>
  scope.getByRole("heading", { level: 4, name: title, exact: true })
    .locator("xpath=ancestor::div[.//button][1]")
    .getByRole("button", { name: "+ Add 5ml" });

// ── C: cart identity ─────────────────────────────────────────────────────────

test("C1 QuickAddModal adds Capri 5ml with the canonical ID; retail prices shown", async ({ page }) => {
  await seed(page, { [CART_KEY]: [] });
  await page.goto("/collections/elite");
  await cardFor(page, CAPRI_NAME).getByRole("button", { name: "Quick Add" }).click();
  const dialog = page.getByRole("dialog", { name: CAPRI_NAME });
  await expect(dialog).toBeVisible();
  // Each price is scoped to its own size button: the selected total repeats the 5ml price.
  for (const [size, price] of [["5ml", "R 60.00"], ["10ml", "R 100.00"], ["30ml", "R 250.00"]]) {
    await expect(dialog.getByRole("button", { name: new RegExp(`^${size}\\b`) })).toContainText(price);
  }

  await dialog.getByRole("button", { name: "Add To Cart" }).click();
  await expect.poll(async () => summary(await readCart(page))).toEqual([`${CAPRI_SLUG}|5ml|1`]);
  const [stored] = await readCart(page);
  expect(stored).toMatchObject({ id: CAPRI_SLUG, title: CAPRI_NAME, price: 60, size: "5ml", quantity: 1 });
});

test("C2 QuickAddModal keeps the chosen bottle size and quantity", async ({ page }) => {
  await seed(page, { [CART_KEY]: [] });
  await page.goto("/collections/elite");
  await cardFor(page, CAPRI_NAME).getByRole("button", { name: "Quick Add" }).click();
  const dialog = page.getByRole("dialog", { name: CAPRI_NAME });
  await dialog.getByRole("button", { name: /^10ml/ }).click();
  await dialog.getByRole("button", { name: "+", exact: true }).click();
  await dialog.getByRole("button", { name: "Add To Cart" }).click();
  await expect.poll(async () => summary(await readCart(page))).toEqual([`${CAPRI_SLUG}|10ml|2`]);
  expect((await readCart(page))[0].price).toBe(100);
});

test("C3 MiniCart 'From Your Favorites' adds Capri with the canonical ID", async ({ page }) => {
  await seed(page, { [CART_KEY]: [line(SAUVAGE.id, SAUVAGE.title, "10ml", 1, "/images/blue-10ml.png")], [FAV_KEY]: [CAPRI_FAVOURITE] });
  await page.goto("/shop");
  const dialog = await openMiniCartRecommendations(page);
  await addFromRow(section(dialog, "From Your Favorites"), CAPRI_NAME).click();
  await expect.poll(async () => summary(await readCart(page)))
    .toEqual([`${SAUVAGE.id}|10ml|1`, `${CAPRI_SLUG}|5ml|1`]);
});

test("C4 MiniCart 'Recently Viewed' adds Capri with the canonical ID", async ({ page }) => {
  await seed(page, { [CART_KEY]: [line(SAUVAGE.id, SAUVAGE.title, "10ml", 1, "/images/blue-10ml.png")], [RV_KEY]: [{ title: CAPRI_NAME }] });
  await page.goto("/shop");
  const dialog = await openMiniCartRecommendations(page);
  await addFromRow(section(dialog, "Recently Viewed"), CAPRI_NAME).click();
  await expect.poll(async () => summary(await readCart(page)))
    .toEqual([`${SAUVAGE.id}|10ml|1`, `${CAPRI_SLUG}|5ml|1`]);
});

test("C5 legacy Capri lines migrate and merge; unrelated lines preserved; reload is idempotent", async ({ page }) => {
  const seeded = [
    line(CAPRI_LEGACY, CAPRI_NAME, "5ml", 2),
    line(SAUVAGE.id, SAUVAGE.title, "10ml", 1, "/images/blue-10ml.png"),
    line(CAPRI_SLUG, CAPRI_NAME, "5ml", 1),
    line(CAPRI_LEGACY, CAPRI_NAME, "30ml", 1),
  ];
  await seed(page, { [CART_KEY]: seeded });
  await page.goto("/shop");
  const expected = [`${CAPRI_SLUG}|5ml|3`, `${SAUVAGE.id}|10ml|1`, `${CAPRI_SLUG}|30ml|1`];
  await expect.poll(async () => summary(await readCart(page))).toEqual(expected);
  const migrated = await readCart(page);
  expect(migrated[0]).toMatchObject({ id: CAPRI_SLUG, title: CAPRI_NAME, price: 60, size: "5ml", quantity: 3 });
  expect(migrated[1]).toEqual(seeded[1]);

  await page.reload();
  await page.waitForLoadState("networkidle");
  expect(await readCart(page)).toEqual(migrated);
});

test("C6 unknown cart IDs are preserved unchanged, never remapped", async ({ page }) => {
  const unknownLine = line(UNKNOWN.id, UNKNOWN.title, "5ml", 1, "/images/blue-5ml.png");
  await seed(page, { [CART_KEY]: [unknownLine, line(CAPRI_LEGACY, CAPRI_NAME, "10ml", 1)] });
  await page.goto("/shop");
  await expect.poll(async () => summary(await readCart(page)))
    .toEqual([`${UNKNOWN.id}|5ml|1`, `${CAPRI_SLUG}|10ml|1`]);
  expect((await readCart(page))[0]).toEqual(unknownLine);
});

test("C7 checkout submits canonical IDs after migration; unknown IDs pass through for the server to reject", async ({ page, net }) => {
  net.onOrder = () => ({ status: 400, json: { success: false, message: `Product not found: ${UNKNOWN.id}` } });
  await seed(page, { [CART_KEY]: [line(CAPRI_LEGACY, CAPRI_NAME, "5ml", 2), line(UNKNOWN.id, UNKNOWN.title, "5ml", 1, "/images/blue-5ml.png")] });
  await page.goto("/checkout");
  // Checkout is interactive once its mount effect has run (effects run after
  // hydration). seed() cleared sessionStorage, and only that effect writes the
  // attempt key before any user action, so the key cannot be stale.
  await expect.poll(() => page.evaluate((k) => sessionStorage.getItem(k), "msr_checkout_attempt")).not.toBeNull();
  await page.fill("#checkout-name", "Synthetic Guest");
  await page.fill("#checkout-phone", "0820000004");
  await page.fill("#checkout-address", "4 Synthetic Lane, Cape Town");
  await page.getByRole("button", { name: "Place Order", exact: true }).click();
  await expect.poll(() => net.orderPosts.length).toBe(1);
  expect(net.orderPosts[0].items.map((i) => `${i.id}|${i.size}|${i.quantity}`))
    .toEqual([`${CAPRI_SLUG}|5ml|2`, `${UNKNOWN.id}|5ml|1`]);
});
