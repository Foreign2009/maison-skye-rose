// @ts-check
/**
 * UI-1 — storefront floating assistance controls (FloatingAssist) are absent
 * from the admin console and unchanged on the storefront.
 *
 * Runs against a local production server on 127.0.0.1:3112 backed by the
 * read-only synthetic mock (fulfilment-m1-mock.js, 127.0.0.1:54399), started
 * with ADMIN_SECRET=m1-synthetic-admin-secret. Tests A–D and F install a
 * page-level guard before their first navigation, so every request from that page
 * to another origin is aborted and recorded. Test E opens a WhatsApp popup, which a
 * page-level guard cannot cover, so it installs a context-wide guard first and
 * proves the popup's wa.me navigation was intercepted and aborted. Opening a wa.me
 * link never sends a message by itself; with the guard, the WhatsApp service is not
 * contacted at all.
 *
 * Screenshots go to results/ui1-floating-assist/screenshots unless UI1_SHOTS is set.
 *
 * Negative control: run this spec unchanged against a build without the UI-1
 * change (INT-1); the admin-absence checks must then fail — see the config header.
 */
const { test, expect } = require("@playwright/test");
const crypto = require("crypto");
const path = require("path");

const APP = "http://127.0.0.1:3112";
const SECRET = process.env.M1_ADMIN_SECRET || "m1-synthetic-admin-secret";
const SESSION = crypto.createHash("sha256").update(SECRET + "msr-ops-v1").digest("hex");
const SHOTS = process.env.UI1_SHOTS || path.join(__dirname, "..", "results", "ui1-floating-assist", "screenshots");
const WHATSAPP = "https://wa.me/27502154734";

// FloatingAssist's own containers (desktop pills / mobile FAB), distinct from the
// separate FloatingWhatsApp pill that some collection pages render themselves.
const FA_DESKTOP = 'div[class*="bottom-5 right-5 z-[9999] flex-col"]';
const FA_MOBILE = 'div[class*="bottom-5 right-4 z-[9999]"]';
const ASSIST_LABELS = ["Get assistance", "Close assistance menu", "Ask the Maison Concierge", "Chat with us on WhatsApp"];

// /admin/briefing is not used: it reads every order's line items, which the
// synthetic fulfilment mock (eight M1 columns only) does not provide.
const ADMIN_ROUTES = ["/admin", "/admin/fulfilment", "/admin/operations", "/admin/identity", "/admin/identity/relationships"];
const STOREFRONT_ROUTES = ["/", "/shop", "/collections/skye", "/collections/rose", "/academy"];
const WIDTHS = [320, 375, 1280];

/** @param {import("@playwright/test").Page} page */
async function guard(page, external) {
  await page.route("**/*", (route) => {
    const u = new URL(route.request().url());
    if (u.origin !== APP) { external.push(u.href); return route.abort("blockedbyclient"); }
    return route.continue();
  });
}
const signIn = (context) => context.addCookies([{ name: "msr-ops-session", value: SESSION, domain: "127.0.0.1", path: "/admin", httpOnly: true, sameSite: "Lax" }]);
const settle = (page) => page.waitForLoadState("networkidle");

/** Number of rendered storefront assistance controls (FloatingAssist containers or any control with its labels). */
async function assistControlCount(page) {
  return page.evaluate(({ desktop, mobile, labels }) => {
    const containers = document.querySelectorAll(`${desktop}, ${mobile}`).length;
    const labelled = [...document.querySelectorAll("[aria-label]")].filter((el) => labels.includes(el.getAttribute("aria-label") || "")).length;
    return containers + labelled;
  }, { desktop: FA_DESKTOP, mobile: FA_MOBILE, labels: ASSIST_LABELS });
}

/** Fixed-position elements whose box intersects the given element (i.e. could cover it). */
async function fixedOverlaps(locator) {
  return locator.evaluate((target) => {
    const t = target.getBoundingClientRect();
    return [...document.querySelectorAll("body *")].filter((el) => {
      if (el === target || el.contains(target) || target.contains(el)) return false;
      const cs = getComputedStyle(el);
      if (cs.position !== "fixed" || cs.display === "none" || cs.visibility === "hidden") return false;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return false;
      return r.left < t.right && r.right > t.left && r.top < t.bottom && r.bottom > t.top;
    }).map((el) => `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)}`);
  });
}

test.describe.configure({ mode: "serial" });

// ── Admin: controls absent ─────────────────────────────────────────────────────

for (const width of WIDTHS) {
  test(`A admin routes render no floating assistance controls at ${width}px`, async ({ page, context }) => {
    const external = [];
    await guard(page, external);
    await page.setViewportSize({ width, height: 800 });
    // Unauthenticated login page first, then the authenticated console.
    await page.goto(`${APP}/admin`);
    await settle(page);
    await expect(page.getByLabel("Access Code")).toBeVisible();
    expect(await assistControlCount(page), "login page").toBe(0);
    await signIn(context);
    for (const route of ADMIN_ROUTES) {
      await page.goto(APP + route);
      await settle(page);
      await expect(page.getByRole("button", { name: "Sign Out" }).first()).toBeVisible();
      expect(await assistControlCount(page), route).toBe(0);
    }
    expect(external).toEqual([]);
  });
}

for (const width of WIDTHS) {
  test(`B fulfilment content is fully visible and usable at ${width}px`, async ({ page, context }) => {
    const external = [];
    await guard(page, external);
    await page.setViewportSize({ width, height: 800 });
    await signIn(context);
    await page.goto(`${APP}/admin/fulfilment`);
    await settle(page);
    const cards = page.locator("li[data-order-ref]");
    await expect(cards).toHaveCount(17);

    // Every stored total: inside the viewport horizontally and covered by no fixed element.
    const totals = page.locator('li[data-order-ref] [aria-label="Stored order total"]');
    const n = await totals.count();
    expect(n).toBe(17);
    for (let i = 0; i < n; i++) {
      const total = totals.nth(i);
      await total.scrollIntoViewIfNeeded();
      const box = await total.boundingBox();
      expect(box, `total ${i}`).not.toBeNull();
      if (!box) continue;
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width);
      expect(await fixedOverlaps(total), `total ${i} covered`).toEqual([]);
      // The topmost element at the total's corners is the total itself.
      const topmost = await total.evaluate((el) => {
        const r = el.getBoundingClientRect();
        return [[r.left + 1, r.top + 1], [r.right - 1, r.top + 1], [r.left + 1, r.bottom - 1], [r.right - 1, r.bottom - 1]]
          .every(([x, y]) => { const hit = document.elementFromPoint(x, y); return !!hit && (hit === el || el.contains(hit)); });
      });
      expect(topmost, `total ${i} not topmost at its corners`).toBe(true);
    }

    // Reference, name, status and total stay readable; reminder action reachable.
    const card = page.locator('li[data-order-ref="MSR-M1TEST-0024"]');
    await expect(card).toContainText("MSR-M1TEST-0024");
    await expect(card).toContainText("Synthetic Friendly");
    await expect(card).toContainText("R2180.00");
    await expect(card).toContainText(/awaiting payment/i);
    const reminder = card.getByRole("link", { name: "Open friendly reminder in WhatsApp" });
    await reminder.scrollIntoViewIfNeeded();
    await expect(reminder).toBeVisible();
    expect(await fixedOverlaps(reminder)).toEqual([]);

    // Filters still work.
    await page.getByRole("button", { name: /^Reminders due/ }).click();
    await expect(page.locator("li[data-order-ref]")).toHaveCount(6);
    await page.getByRole("button", { name: /^All orders/ }).click();
    await expect(page.locator("li[data-order-ref]")).toHaveCount(17);

    // No horizontal scrolling.
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: path.join(SHOTS, `admin-fulfilment-${width}.png`), fullPage: true });
    expect(external).toEqual([]);
  });
}

test("C admin navigation and keyboard access still work, with no controls after client-side navigation", async ({ page, context }) => {
  const external = [];
  await guard(page, external);
  await page.setViewportSize({ width: 375, height: 800 });
  await signIn(context);
  await page.goto(`${APP}/admin/fulfilment`);
  await settle(page);
  // Keyboard: filters reachable and operable.
  const awaiting = page.getByRole("button", { name: /^Awaiting payment/ });
  await awaiting.focus();
  await page.keyboard.press("Enter");
  await expect(awaiting).toHaveAttribute("aria-pressed", "true");
  // Client-side navigation through the admin menu.
  await page.getByRole("button", { name: "Open navigation menu" }).click();
  await page.getByRole("navigation", { name: "Admin destinations" }).getByRole("link", { name: "Identity Review" }).click();
  await page.waitForURL(`${APP}/admin/identity`);
  await settle(page);
  expect(await assistControlCount(page)).toBe(0);
  await page.getByRole("button", { name: "Open navigation menu" }).click();
  await page.getByRole("navigation", { name: "Admin destinations" }).getByRole("link", { name: "Fulfilment" }).click();
  await page.waitForURL(`${APP}/admin/fulfilment`);
  await settle(page);
  await expect(page.locator("li[data-order-ref]")).toHaveCount(17);
  expect(await assistControlCount(page)).toBe(0);
  expect(external).toEqual([]);
});

// ── Storefront: controls present and unchanged ────────────────────────────────

for (const width of [375, 1280]) {
  test(`D storefront routes keep the floating assistance controls at ${width}px`, async ({ page }) => {
    const external = [];
    await guard(page, external);
    await page.setViewportSize({ width, height: 800 });
    for (const route of STOREFRONT_ROUTES) {
      await page.goto(APP + route);
      await settle(page);
      if (width < 768) {
        const fab = page.locator(FA_MOBILE).getByRole("button", { name: "Get assistance" });
        await expect(fab, route).toBeVisible();
        const box = await fab.boundingBox();
        expect(box && box.width >= 44 && box.height >= 44, `${route} FAB touch target`).toBe(true);
        await fab.click();
        await expect(page.locator(FA_MOBILE).getByRole("button", { name: "Ask the Maison Concierge" }), route).toBeVisible();
        await expect(page.locator(FA_MOBILE).getByRole("link", { name: "Chat with us on WhatsApp" }), route).toHaveAttribute("href", new RegExp(`^${WHATSAPP}`));
        await page.locator(FA_MOBILE).getByRole("button", { name: "Close assistance menu" }).click();
        await expect(page.locator(FA_MOBILE).getByRole("button", { name: "Ask the Maison Concierge" })).toHaveCount(0);
      } else {
        await expect(page.locator(FA_DESKTOP).getByRole("button", { name: "Ask the Maison Concierge" }), route).toBeVisible();
        const wa = page.locator(FA_DESKTOP).getByRole("link", { name: "Chat with us on WhatsApp" });
        await expect(wa, route).toBeVisible();
        await expect(wa).toHaveAttribute("href", new RegExp(`^${WHATSAPP}`));
        await expect(wa).toHaveAttribute("target", "_blank");
        await expect(wa).toHaveAttribute("rel", "noopener noreferrer");
      }
      if (route === "/") await page.screenshot({ path: path.join(SHOTS, `storefront-home-${width}.png`) });
    }
    expect(external.filter((u) => u.startsWith("https://wa.me"))).toEqual([]);
  });
}

test("E Ask Maison opens the existing Concierge; the WhatsApp popup is requested and its wa.me navigation is intercepted and aborted", async ({ page, context }) => {
  // Context-wide guard, installed before any navigation, so it also covers pages the
  // context opens later (the WhatsApp popup). Only the local app may continue.
  /** @type {{ url: string, navigation: boolean, owner: "original-page" | "other-page" | "frame-not-created" }[]} */
  const aborted = [];
  /** @type {string[]} */
  const continued = [];
  await context.route("**/*", async (route) => {
    const req = route.request();
    if (new URL(req.url()).origin === APP) { continued.push(req.url()); return route.continue(); }
    // A popup's first navigation is routed before its frame exists, so frame() throws.
    /** @type {"original-page" | "other-page" | "frame-not-created"} */
    let owner = "frame-not-created";
    try { owner = req.frame().page() === page ? "original-page" : "other-page"; } catch { /* popup not attached yet */ }
    aborted.push({ url: req.url(), navigation: req.isNavigationRequest(), owner });
    return route.abort("blockedbyclient");
  });
  // Independent observers: every request the context issues, how each failed, and
  // any external response (there must be none).
  /** @type {string[]} */
  const externalRequests = [];
  /** @type {{ url: string, error: string }[]} */
  const externalFailures = [];
  /** @type {string[]} */
  const externalResponses = [];
  const isExternal = (url) => /^https?:/.test(url) && new URL(url).origin !== APP;
  context.on("request", (req) => { if (isExternal(req.url())) externalRequests.push(req.url()); });
  context.on("requestfailed", (req) => { if (isExternal(req.url())) externalFailures.push({ url: req.url(), error: req.failure()?.errorText || "" }); });
  context.on("response", (res) => { if (isExternal(res.url())) externalResponses.push(res.url()); });

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(`${APP}/shop`);
  await settle(page);
  await page.locator(FA_DESKTOP).getByRole("button", { name: "Ask the Maison Concierge" }).click();
  await expect(page.getByRole("dialog", { name: "Maison Concierge" })).toBeVisible();
  expect(await page.locator(FA_DESKTOP).count(), "controls step aside while the Concierge is open (existing behaviour)").toBe(0);
  await page.getByRole("dialog", { name: "Maison Concierge" }).getByRole("button", { name: "Close" }).click();
  await expect(page.locator(FA_DESKTOP).getByRole("button", { name: "Ask the Maison Concierge" })).toBeVisible();
  // WhatsApp: the link keeps its destination and new-tab behaviour…
  const wa = page.locator(FA_DESKTOP).getByRole("link", { name: "Chat with us on WhatsApp" });
  await expect(wa).toHaveAttribute("href", new RegExp(`^${WHATSAPP}`));
  await expect(wa).toHaveAttribute("target", "_blank");
  await expect(wa).toHaveAttribute("rel", "noopener noreferrer");
  const href = await wa.getAttribute("href");

  // …clicking it requests a popup, whose wa.me navigation must reach the guard and be aborted.
  const popupPromise = context.waitForEvent("page");
  await wa.click();
  const popup = await popupPromise;
  await expect.poll(() => externalFailures.some((f) => f.url === href), { message: "wa.me navigation never failed" }).toBe(true);

  const waAborted = aborted.filter((a) => a.url === href);
  expect(waAborted, "the popup's wa.me navigation was intercepted by the context guard").toHaveLength(1);
  expect(waAborted[0].navigation, "intercepted request is the popup's top-level navigation").toBe(true);
  expect(waAborted[0].owner, "intercepted navigation is not the original page's (it is the new popup's)").not.toBe("original-page");
  expect(page.url(), "the original page never navigated to wa.me").toBe(`${APP}/shop`);
  // It failed because the guard aborted it (blockedbyclient), not for any other reason.
  expect(externalFailures.filter((f) => f.url === href)).toEqual([{ url: href, error: "net::ERR_BLOCKED_BY_CLIENT" }]);
  // No external request bypassed the guard, and none received a response.
  expect([...new Set(externalRequests)].sort(), "every external request was routed through the guard").toEqual([...new Set(aborted.map((a) => a.url))].sort());
  expect(externalFailures.every((f) => f.error === "net::ERR_BLOCKED_BY_CLIENT"), JSON.stringify(externalFailures)).toBe(true);
  expect(externalResponses, "no external response was received").toEqual([]);
  expect(continued.length, "the local app was reached through the guard").toBeGreaterThan(0);
  expect(continued.filter((u) => new URL(u).origin !== APP), "the guard let only the local app through").toEqual([]);

  await popup.close();
  await expect(page).toHaveURL(`${APP}/shop`);
  test.info().annotations.push({ type: "t1-interception", description: JSON.stringify({ href, aborted, externalFailures, externalResponses }) });
});

test("F storefront ⇄ admin client-side pathname transitions remove and restore the controls", async ({ page, context }) => {
  const external = [];
  await guard(page, external);
  await page.setViewportSize({ width: 375, height: 800 });
  await signIn(context);
  await page.goto(`${APP}/`);
  await settle(page);
  const fab = page.locator(FA_MOBILE).getByRole("button", { name: "Get assistance" });
  await expect(fab).toBeVisible();
  // Expand the menu, then move into the admin namespace without a page load.
  await fab.click();
  await expect(page.locator(FA_MOBILE).getByRole("button", { name: "Ask the Maison Concierge" })).toBeVisible();
  const docId = await page.evaluate(() => { (window).__ui1Doc = Math.random(); return (window).__ui1Doc; });
  await page.evaluate(() => window.history.pushState(null, "", "/admin/fulfilment"));
  await expect.poll(() => assistControlCount(page)).toBe(0);
  await page.evaluate(() => window.history.pushState(null, "", "/"));
  await expect(page.locator(FA_MOBILE).getByRole("button", { name: "Get assistance" })).toBeVisible();
  // Collapsed on return: the expanded menu does not reappear.
  await expect(page.locator(FA_MOBILE).getByRole("button", { name: "Ask the Maison Concierge" })).toHaveCount(0);
  expect(await page.evaluate(() => (window).__ui1Doc), "transitions must not reload the document").toBe(docId);
  // Client-side Link navigation within the storefront keeps the controls.
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.locator('nav a[href="/shop"]').first().click();
  await page.waitForURL(`${APP}/shop`);
  await settle(page);
  await expect(page.locator(FA_DESKTOP).getByRole("button", { name: "Ask the Maison Concierge" })).toBeVisible();
  expect(await page.evaluate(() => (window).__ui1Doc), "Link navigation must not reload the document").toBe(docId);
  expect(external.filter((u) => u.startsWith("https://wa.me"))).toEqual([]);
});
