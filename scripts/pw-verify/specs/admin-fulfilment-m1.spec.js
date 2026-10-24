// @ts-check
/**
 * Admin Fulfilment M1 — browser checks against an isolated local production
 * build backed by the read-only synthetic mock (fulfilment-m1-mock.js).
 *
 * The browser may only reach the local app; any other origin is aborted and
 * recorded, so WhatsApp links are never followed. No order is changed: the
 * mock refuses and counts every non-GET request.
 */
const { test, expect } = require("@playwright/test");
const crypto = require("crypto");
const path = require("path");

const APP = "http://127.0.0.1:3112";
const MOCK = "http://127.0.0.1:54399";
const SECRET = process.env.M1_ADMIN_SECRET || "m1-synthetic-admin-secret";
const SESSION = crypto.createHash("sha256").update(SECRET + "msr-ops-v1").digest("hex");
const SHOTS = path.join(__dirname, "..", "results", "admin-fulfilment-m1", "screenshots");

const counts = async (request) => (await request.get(`${MOCK}/mock/counts`)).json();
const setMode = async (request, m) => expect((await request.get(`${MOCK}/mock/mode/${m}`)).ok()).toBeTruthy();

/** @param {import("@playwright/test").Page} page */
async function guard(page, external) {
  await page.route("**/*", (route) => {
    const u = new URL(route.request().url());
    if (u.origin !== APP) { external.push(u.href); return route.abort("blockedbyclient"); }
    return route.continue();
  });
}

async function signIn(context, value = SESSION) {
  await context.addCookies([{ name: "msr-ops-session", value, domain: "127.0.0.1", path: "/admin", httpOnly: true, sameSite: "Lax" }]);
}

const card = (page, ref) => page.locator(`li[data-order-ref="${ref}"]`);

test.describe.configure({ mode: "serial" });

test.beforeAll(async ({ request }) => { await setMode(request, "normal"); });

test("A unauthenticated request redirects to the admin login and performs no order query", async ({ page, request }) => {
  const external = [];
  await guard(page, external);
  const before = await counts(request);
  await page.goto(`${APP}/admin/fulfilment`);
  await expect(page).toHaveURL(`${APP}/admin`);
  await expect(page.getByLabel("Access Code")).toBeVisible();
  await expect(page.locator("li[data-order-ref]")).toHaveCount(0);
  const after = await counts(request);
  expect(after.get - before.get).toBe(0);
  expect(external).toEqual([]);
});

test("A forged session cookie is rejected without any order query", async ({ page, context, request }) => {
  const external = [];
  await guard(page, external);
  await signIn(context, crypto.createHash("sha256").update("msr-ops-v1").digest("hex"));
  const before = await counts(request);
  await page.goto(`${APP}/admin/fulfilment`);
  await expect(page).toHaveURL(`${APP}/admin`);
  expect((await counts(request)).get - before.get).toBe(0);
  const html = await page.content();
  expect(html).not.toContain("MSR-M1TEST");
});

for (const width of [320, 375, 1280]) {
  test(`B dashboard content, stages and handoff at ${width}px`, async ({ page, context }) => {
    const external = [];
    await guard(page, external);
    await page.setViewportSize({ width, height: width === 1280 ? 900 : 800 });
    await signIn(context);
    await page.goto(`${APP}/admin/fulfilment`);
    await expect(page.getByRole("heading", { name: "Fulfilment" })).toBeVisible();
    await expect(page.locator("li[data-order-ref]")).toHaveCount(17);

    const stage = async (ref) => (await card(page, ref).locator("section[aria-label='Suggested next action'] p").nth(1).innerText()).trim();
    expect(await stage("MSR-M1TEST-0001")).toBe("No reminder due");
    expect(await stage("MSR-M1TEST-0023")).toBe("No reminder due");
    expect(await stage("MSR-M1TEST-0024")).toBe("Friendly reminder due");
    expect(await stage("MSR-M1TEST-0047")).toBe("Friendly reminder due");
    expect(await stage("MSR-M1TEST-0048")).toBe("Final reminder due");
    expect(await stage("MSR-M1TEST-0071")).toBe("Final reminder due");
    expect(await stage("MSR-M1TEST-0072")).toBe("Manual cancellation review");
    expect(await stage("MSR-M1TEST-0120")).toBe("Manual cancellation review");
    expect(await stage("MSR-M1TEST-NODT")).toBe("Age unavailable");
    for (const ref of ["MSR-M1TEST-ITN1", "MSR-M1TEST-PAID", "MSR-M1TEST-PROC", "MSR-M1TEST-DISP", "MSR-M1TEST-DELV", "MSR-M1TEST-CANC"]) {
      await expect(card(page, ref).locator("section[aria-label='Suggested next action']")).toHaveCount(0);
    }

    // WhatsApp links only where a reminder is due and the number is a valid SA mobile
    const friendly = card(page, "MSR-M1TEST-0024").getByRole("link", { name: "Open friendly reminder in WhatsApp" });
    await expect(friendly).toHaveAttribute("target", "_blank");
    const href = await friendly.getAttribute("href");
    expect(href).toMatch(/^https:\/\/wa\.me\/27820000124\?text=/);
    const text = decodeURIComponent(href.split("text=")[1]);
    expect(text).toContain("MSR-M1TEST-0024");
    expect(text).toContain("R2180.00");
    expect(text).toMatch(/our order records still show your EFT payment of R2180\.00 as awaiting confirmation/i);
    await expect(card(page, "MSR-M1TEST-0047").getByRole("link", { name: /friendly reminder/ })).toHaveAttribute("href", /wa\.me\/27720000147/);
    await expect(card(page, "MSR-M1TEST-0048").getByRole("link", { name: "Open final reminder in WhatsApp" })).toHaveAttribute("href", /wa\.me\/27720000148/);
    await expect(card(page, "MSR-M1TEST-0072").getByRole("link")).toHaveCount(0);
    await expect(card(page, "MSR-M1TEST-0072")).toContainText("nothing is cancelled automatically");
    await expect(card(page, "MSR-M1TEST-0001").getByRole("link")).toHaveCount(0);
    await expect(card(page, "MSR-M1TEST-LAND").getByRole("link")).toHaveCount(0);
    await expect(card(page, "MSR-M1TEST-LAND")).toContainText("No valid South African mobile number");
    await expect(card(page, "MSR-M1TEST-NOPH")).toContainText("No valid South African mobile number");

    // Stored data shown as stored
    await expect(card(page, "MSR-M1TEST-0048")).toContainText("Collection");
    await expect(card(page, "MSR-M1TEST-0071")).toContainText("Courier — Outlying Areas");
    await expect(card(page, "MSR-M1TEST-0072")).toContainText("R1848.00");
    await expect(card(page, "MSR-M1TEST-NODT")).toContainText("Date not recorded");

    // PayFast ITN warning only where the history shows it; never a bank-verified claim
    await expect(card(page, "MSR-M1TEST-ITN1").getByRole("alert")).toContainText("PayFast ITN");
    await expect(card(page, "MSR-M1TEST-PAID").getByRole("alert")).toHaveCount(0);
    await expect(page.locator("body")).not.toContainText(/bank[\s-]?verified/i);

    // Layout: no horizontal overflow; interactive targets at least 44px tall
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    const small = await page.evaluate(() => [...document.querySelectorAll("header button, main a, main button")]
      .filter((el) => { const r = el.getBoundingClientRect(); return r.width > 0 && (r.height < 44 || r.width < 44); })
      .map((el) => `${el.textContent?.trim().slice(0, 30)} ${Math.round(el.getBoundingClientRect().width)}x${Math.round(el.getBoundingClientRect().height)}`));
    expect(small).toEqual([]);

    await page.screenshot({ path: path.join(SHOTS, `fulfilment-${width}.png`), fullPage: true });
    expect(external).toEqual([]);
  });
}

test("E filters show the expected orders and counts", async ({ page, context }) => {
  const external = [];
  await guard(page, external);
  await page.setViewportSize({ width: 1280, height: 900 });
  await signIn(context);
  await page.goto(`${APP}/admin/fulfilment`);
  const expectations = [
    ["All orders", 17], ["Awaiting payment", 11], ["Reminders due", 6], ["Cancellation review", 2],
    ["Payment Confirmed", 2], ["Processing", 1], ["Dispatched", 1], ["Delivered", 1], ["Cancelled", 1],
  ];
  for (const [label, n] of expectations) {
    const btn = page.getByRole("button", { name: new RegExp(`^${label} \\(${n}\\)$`) });
    await btn.click();
    await expect(btn).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("li[data-order-ref]")).toHaveCount(n);
  }
  await page.getByRole("button", { name: /^Reminders due/ }).click();
  const refs = await page.locator("li[data-order-ref]").evaluateAll((els) => els.map((e) => e.getAttribute("data-order-ref")).sort());
  expect(refs).toEqual(["MSR-M1TEST-0024", "MSR-M1TEST-0047", "MSR-M1TEST-0048", "MSR-M1TEST-0071", "MSR-M1TEST-LAND", "MSR-M1TEST-NOPH"]);
  expect(external).toEqual([]);
});

test("E keyboard: filters operate with Enter/Space and WhatsApp links are focusable without auto-opening", async ({ page, context }) => {
  const external = [];
  await guard(page, external);
  await signIn(context);
  await page.goto(`${APP}/admin/fulfilment`);
  const awaiting = page.getByRole("button", { name: /^Awaiting payment/ });
  await awaiting.focus();
  await page.keyboard.press("Enter");
  await expect(awaiting).toHaveAttribute("aria-pressed", "true");
  const review = page.getByRole("button", { name: /^Cancellation review/ });
  await review.focus();
  await page.keyboard.press("Space");
  await expect(review).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: /^All orders/ }).click();
  const link = card(page, "MSR-M1TEST-0024").getByRole("link", { name: /friendly reminder/ });
  await link.focus();
  await expect(link).toBeFocused();
  expect(external).toEqual([]); // nothing opened WhatsApp on its own
});

test("E navigation: Fulfilment appears in the admin menu and the back link returns to Operations", async ({ page, context }) => {
  await guard(page, []);
  await page.setViewportSize({ width: 375, height: 800 });
  await signIn(context);
  await page.goto(`${APP}/admin/fulfilment`);
  await page.getByRole("button", { name: "Open navigation menu" }).click();
  const navLink = page.getByRole("navigation", { name: "Admin destinations" }).getByRole("link", { name: "Fulfilment" });
  await expect(navLink).toHaveAttribute("aria-current", "page");
  await page.getByRole("button", { name: "Close navigation menu" }).click();
  await expect(page.getByRole("link", { name: "← Back to Operations" })).toHaveAttribute("href", "/admin");
});

test("E empty and error states", async ({ page, context, request }) => {
  await guard(page, []);
  await signIn(context);
  await setMode(request, "empty");
  await page.goto(`${APP}/admin/fulfilment`);
  await expect(page.getByText("No website orders yet.")).toBeVisible();
  await setMode(request, "error");
  await page.goto(`${APP}/admin/fulfilment`);
  // scoped to <main>: Next.js always renders an empty role="alert" route announcer
  await expect(page.locator("main").getByRole("alert")).toContainText("Orders could not be loaded");
  await expect(page.locator("body")).not.toContainText("synthetic failure");
  await setMode(request, "normal");
});

test("Z read-only: the mock received zero non-GET requests during the whole run", async ({ request }) => {
  const c = await counts(request);
  expect(c.nonGet).toBe(0);
  expect(c.get).toBeGreaterThan(0);
});
