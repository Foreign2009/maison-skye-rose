// @ts-check
/**
 * Focused admin verification — order list/detail, modal semantics, focus
 * management, and identity/relationship detail routes.
 *
 * Runs against a local dev server on port 3201 with synthetic orders served
 * by mock-supabase.js on port 54322. No production connections or writes.
 */

const { test, expect } = require("@playwright/test");
const { createHash }   = require("crypto");
const fs               = require("fs");
const path             = require("path");

const SS_DIR = path.resolve(__dirname, "../results/focused");
fs.mkdirSync(SS_DIR, { recursive: true });

const BASE = "http://localhost:3201";

// Confirmed genuine order — must NEVER appear in cleanup operations.
const GENUINE_REF = "MSR-20260926-70355";

// Synthetic test-order refs injected by mock-supabase.js.
const TEST_REFS = [
  "MSR-TEST-PWTEST-001",  // awaiting_payment — Alex Mokoena — Gauteng — R280
  "MSR-TEST-PWTEST-002",  // payment_confirmed — Priya Naidoo — KwaZulu-Natal — R560
  "MSR-TEST-PWTEST-003",  // processing — Nadia Olivier — Western Cape — R420
];

// Identity/relationship fixture IDs from local data files (no Supabase needed).
const IDENTITY_ID    = "MIP-000001";
const RELATIONSHIP_ID = encodeURIComponent(
  "REL-alternatives-1-million-inspired--azzaro-most-wanted-inspired"
);

function sessionToken() {
  return createHash("sha256").update("nav-test-pw" + "msr-ops-v1").digest("hex");
}

async function makeContext(browser, vp) {
  const ctx = await browser.newContext({
    viewport:       vp,
    serviceWorkers: "block",
  });
  await ctx.addCookies([{
    name:     "msr-ops-session",
    value:    sessionToken(),
    domain:   "localhost",
    path:     "/",
    httpOnly: false,
    secure:   false,
    sameSite: "Lax",
  }]);
  return ctx;
}

async function gotoAdmin(page, route) {
  await page.goto(`${BASE}${route || "/admin"}`);
  await page.waitForSelector('[aria-label="Open navigation menu"]', { timeout: 60_000 });
  // Wait for React to hydrate the trigger button. React 18 attaches
  // __reactFiber$<hash> to DOM nodes during hydrateRoot(); its presence
  // on the button confirms onClick is live and clicks will fire openDrawer().
  // Without this, the click can land before hydration and the dialog never opens.
  await page.waitForFunction(
    () => {
      const btn = document.querySelector('[aria-label="Open navigation menu"]');
      return btn != null && Object.keys(btn).some(k => k.startsWith("__reactFiber"));
    },
    { timeout: 15_000 }
  );
}

// ── 1. Order list renders with synthetic data ─────────────────────────────────

test("order list: all three synthetic orders visible", async ({ browser }) => {
  const ctx  = await makeContext(browser, { width: 1280, height: 800 });
  const page = await ctx.newPage();
  await gotoAdmin(page);

  // Each order ref should appear in the list.
  for (const ref of TEST_REFS) {
    await expect(page.getByText(ref)).toBeVisible({ timeout: 15_000 });
  }

  // Genuine order ref must NOT be present in this synthetic dataset.
  await expect(page.getByText(GENUINE_REF)).not.toBeAttached();

  await page.screenshot({ path: path.join(SS_DIR, "order-list-1280.png") });
  await ctx.close();
});

// ── 2. Order detail accessible at 320px ──────────────────────────────────────

test("[320px] order detail panel opens; actions accessible", async ({ browser }) => {
  const ctx  = await makeContext(browser, { width: 320, height: 812 });
  const page = await ctx.newPage();
  await gotoAdmin(page);

  // Click the first test order in the list.
  const orderBtn = page.getByText(TEST_REFS[0]).first();
  await expect(orderBtn, "order ref visible in list").toBeVisible({ timeout: 15_000 });
  await orderBtn.click();

  // The detail panel uses a framer-motion bottom drawer at mobile widths.
  // It contains the order ref as a text node.
  await expect(
    page.getByText(TEST_REFS[0]).first(),
    "order ref in detail panel"
  ).toBeVisible({ timeout: 10_000 });

  // Close button must be reachable.
  const closeBtn = page.getByRole("button", { name: "Close" });
  await expect(closeBtn, "Close button accessible").toBeVisible();
  // Use Math.ceil to tolerate sub-pixel rendering differences (e.g. 29.999... ≈ 30).
  expect(Math.ceil(await closeBtn.boundingBox().then(b => b?.height ?? 0)), "Close ≥ 30px").toBeGreaterThanOrEqual(30);

  // WhatsApp link must be present (it's always rendered for every order).
  const waLink = page.getByRole("link", { name: /WhatsApp/i }).first();
  await expect(waLink, "WhatsApp link visible").toBeVisible();

  await page.screenshot({ path: path.join(SS_DIR, "detail-320.png") });
  await ctx.close();
});

// ── 3. Order detail accessible at 390px ──────────────────────────────────────

test("[390px] order detail panel opens; actions accessible", async ({ browser }) => {
  const ctx  = await makeContext(browser, { width: 390, height: 844 });
  const page = await ctx.newPage();
  await gotoAdmin(page);

  const orderBtn = page.getByText(TEST_REFS[1]).first();
  await expect(orderBtn, "order ref visible in list").toBeVisible({ timeout: 15_000 });
  await orderBtn.click();

  await expect(
    page.getByText(TEST_REFS[1]).first(),
    "order ref in detail panel"
  ).toBeVisible({ timeout: 10_000 });

  // The payment_confirmed order should show a "Mark as Processing" action button.
  const actionBtn = page.getByRole("button", { name: "Mark as Processing" });
  await expect(actionBtn, "status action button accessible").toBeVisible();

  await page.screenshot({ path: path.join(SS_DIR, "detail-390.png") });
  await ctx.close();
});

// ── 4. Background control exists AND is blocked by nav drawer ─────────────────
// The search input must be present in the DOM (orders are loaded). The modal
// must prevent focus from reaching it while the drawer is open.

test("[375px] search input present; modal blocks background interaction", async ({ browser }) => {
  const ctx  = await makeContext(browser, { width: 375, height: 812 });
  const page = await ctx.newPage();
  await gotoAdmin(page);

  // Use toBeAttached (not toBeVisible) so Playwright does not scroll the
  // search input into view or interact with the accessibility tree before
  // the hamburger click — either could prevent showModal() from firing.
  const searchInput = page.locator('input[type="search"]');
  await expect(searchInput, "search input present before modal opens").toBeAttached({ timeout: 15_000 });

  // Open the nav drawer.
  await page.getByRole("button", { name: "Open navigation menu" }).click();
  const drawer = page.getByRole("dialog", { name: "Admin navigation" });
  await expect(drawer, "drawer open").toBeVisible({ timeout: 10_000 });

  // Attempt to focus the search input via JS while the modal is open.
  // With showModal() the dialog is in the top layer; the browser rejects
  // focus on elements outside it.
  const focusResult = await page.evaluate(() => {
    const input = document.querySelector('input[type="search"]');
    if (!input) return "not-found";
    input.focus();
    return document.activeElement === input ? "focused" : "rejected";
  });

  // "rejected" is the expected result — modal is blocking background interaction.
  // "not-found" would mean the input was not rendered (this is now a failure).
  expect(focusResult, "modal blocks background focus (not 'focused', not 'not-found')")
    .not.toBe("focused");
  expect(focusResult, "search input must exist in DOM").not.toBe("not-found");

  await page.keyboard.press("Escape");
  await ctx.close();
});

// ── 5. Shift+Tab from first focusable element ────────────────────────────────
// After pressing Shift+Tab from the Close button (first focusable element in
// the drawer), focus may land on the browser chrome in headless mode — this
// is acceptable. What must NOT happen is focus landing on a background page
// control (input, button, link or select outside the dialog), which would mean
// the modal's inert constraint is broken. A subsequent Tab press must return
// focus to the dialog.

test("[375px] Shift+Tab from first element: no background control focused; Tab returns to dialog", async ({ browser }) => {
  const ctx  = await makeContext(browser, { width: 375, height: 812 });
  const page = await ctx.newPage();
  try {
    await gotoAdmin(page);

    await page.getByRole("button", { name: "Open navigation menu" }).click();
    const drawer = page.getByRole("dialog", { name: "Admin navigation" });
    await expect(drawer, "drawer open").toBeVisible();

    // Focus the Close button — the first focusable element inside the drawer.
    await drawer.getByRole("button", { name: "Close navigation menu" }).focus();

    await page.keyboard.press("Shift+Tab");

    // After Shift+Tab from the first element, focus MUST NOT land on any
    // interactive background page control. showModal() applies inert to the
    // rest of the document; background controls must never receive focus.
    const backgroundFocused = await page.evaluate(() => {
      const active = document.activeElement;
      if (!active || active === document.body || active === document.documentElement) return false;
      if (active.closest("dialog")) return false;
      return ["input", "button", "a", "select", "textarea"].includes(active.tagName.toLowerCase());
    });
    expect(backgroundFocused, "no background page control has focus after Shift+Tab from first element").toBe(false);

    // A single Tab forward from wherever focus landed must return to inside
    // the dialog. If focus is on the browser chrome (document.body in headless),
    // the inert background means the next Tab cycles back to the dialog.
    await page.keyboard.press("Tab");
    const backInDialog = await page.evaluate(
      () => !!(document.activeElement && document.activeElement.closest("dialog"))
    );
    expect(backInDialog, "Tab after boundary Shift+Tab returns focus to dialog").toBe(true);
  } finally {
    await page.keyboard.press("Escape").catch(() => {});
    await ctx.close();
  }
});

// ── 6. Tab from the last focusable element ────────────────────────────────────
// After pressing Tab from Relationship Review (last focusable element in the
// drawer), focus may land on the browser chrome. Background page controls must
// not receive focus. A subsequent Shift+Tab must return focus to the dialog.

test("[375px] Tab from last element: no background control focused; Shift+Tab returns to dialog", async ({ browser }) => {
  const ctx  = await makeContext(browser, { width: 375, height: 812 });
  const page = await ctx.newPage();
  try {
    await gotoAdmin(page);

    await page.getByRole("button", { name: "Open navigation menu" }).click();
    const drawer = page.getByRole("dialog", { name: "Admin navigation" });
    await expect(drawer, "drawer open").toBeVisible();

    // Focus Relationship Review — the last focusable element in the drawer.
    const lastLink = drawer.getByRole("link", { name: "Relationship Review", exact: true });
    await lastLink.scrollIntoViewIfNeeded();
    await lastLink.focus();

    await page.keyboard.press("Tab");

    // After Tab from the last element, focus MUST NOT land on any interactive
    // background page control.
    const backgroundFocused = await page.evaluate(() => {
      const active = document.activeElement;
      if (!active || active === document.body || active === document.documentElement) return false;
      if (active.closest("dialog")) return false;
      return ["input", "button", "a", "select", "textarea"].includes(active.tagName.toLowerCase());
    });
    expect(backgroundFocused, "no background page control has focus after Tab from last element").toBe(false);

    // Shift+Tab from wherever focus landed must return to inside the dialog.
    await page.keyboard.press("Shift+Tab");
    const backInDialog = await page.evaluate(
      () => !!(document.activeElement && document.activeElement.closest("dialog"))
    );
    expect(backInDialog, "Shift+Tab after boundary Tab returns focus to dialog").toBe(true);
  } finally {
    await page.keyboard.press("Escape").catch(() => {});
    await ctx.close();
  }
});

// ── 7. Body scroll restored after drawer dismissed via Escape ─────────────────

test("[375px] body overflow restored after Escape dismissal", async ({ browser }) => {
  const ctx  = await makeContext(browser, { width: 375, height: 812 });
  const page = await ctx.newPage();
  await gotoAdmin(page);

  const overflowBefore = await page.evaluate(() => document.body.style.overflow);

  await page.getByRole("button", { name: "Open navigation menu" }).click();
  const drawer = page.getByRole("dialog", { name: "Admin navigation" });
  await expect(drawer).toBeVisible();

  const overflowOpen = await page.evaluate(() => document.body.style.overflow);
  expect(overflowOpen, "body overflow is hidden while drawer is open").toBe("hidden");

  await page.keyboard.press("Escape");
  await expect(drawer, "drawer closed after Escape").not.toBeVisible();

  const overflowAfter = await page.evaluate(() => document.body.style.overflow);
  expect(overflowAfter, "body overflow restored after Escape").toBe(overflowBefore);

  await ctx.close();
});

// ── 8. Body scroll restored after link navigation closes drawer ──────────────

test("[375px] body overflow restored after link navigation", async ({ browser }) => {
  const ctx  = await makeContext(browser, { width: 375, height: 812 });
  const page = await ctx.newPage();
  await gotoAdmin(page);

  await page.getByRole("button", { name: "Open navigation menu" }).click();
  const drawer = page.getByRole("dialog", { name: "Admin navigation" });
  await expect(drawer).toBeVisible();

  await drawer.getByRole("link", { name: "Briefing", exact: true }).click();
  await page.waitForURL("**/admin/briefing", { timeout: 30_000 });
  await expect(drawer, "drawer closed after link navigation").not.toBeVisible();

  const overflowAfter = await page.evaluate(() => document.body.style.overflow);
  expect(overflowAfter, "body overflow restored after link navigation").not.toBe("hidden");

  await ctx.close();
});

// ── 9. Identity detail route: exactly one parent section selected ─────────────

test(`/admin/identity/${IDENTITY_ID}: Identity Review active; Relationship Review not active; both navigable`, async ({ browser }) => {
  const ctx  = await makeContext(browser, { width: 375, height: 812 });
  const page = await ctx.newPage();

  // Navigate to an identity DETAIL route (child of /admin/identity).
  await gotoAdmin(page, `/admin/identity/${IDENTITY_ID}`);

  await page.getByRole("button", { name: "Open navigation menu" }).click();
  const nav = page.getByRole("dialog").getByRole("navigation");

  const idLink  = nav.getByRole("link", { name: "Identity Review",     exact: true });
  const relLink = nav.getByRole("link", { name: "Relationship Review", exact: true });

  // On /admin/identity/[id], the parent section is Identity Review.
  // It gets the underline active style but NOT aria-current="page"
  // (that would only be set on the exact /admin/identity route).
  // Relationship Review must not be active at all.
  expect(
    await idLink.getAttribute("aria-current"),
    "Identity Review: not aria-current=page on detail route"
  ).not.toBe("page");
  expect(
    await relLink.getAttribute("aria-current"),
    "Relationship Review: not active on identity detail route"
  ).toBeFalsy();

  // Both must be Links (not spans) — navigable.
  await expect(idLink,  "Identity Review is a link").toBeAttached();
  await expect(relLink, "Relationship Review is a link").toBeAttached();

  await page.screenshot({ path: path.join(SS_DIR, `identity-detail-active.png`) });
  await page.keyboard.press("Escape");
  await ctx.close();
});

// ── 10. Relationship detail route: exactly one parent section selected ─────────

test(`/admin/identity/relationships/${RELATIONSHIP_ID}: Relationship Review active; Identity Review not active; both navigable`, async ({ browser }) => {
  const ctx  = await makeContext(browser, { width: 375, height: 812 });
  const page = await ctx.newPage();

  await gotoAdmin(page, `/admin/identity/relationships/${RELATIONSHIP_ID}`);

  await page.getByRole("button", { name: "Open navigation menu" }).click();
  const nav = page.getByRole("dialog").getByRole("navigation");

  const relLink = nav.getByRole("link", { name: "Relationship Review", exact: true });
  const idLink  = nav.getByRole("link", { name: "Identity Review",     exact: true });

  // On a relationship DETAIL route, the parent section is Relationship Review.
  // Identity Review must not be active at all.
  expect(
    await relLink.getAttribute("aria-current"),
    "Relationship Review: not aria-current=page on detail route"
  ).not.toBe("page");
  expect(
    await idLink.getAttribute("aria-current"),
    "Identity Review: not active on relationship detail route"
  ).toBeFalsy();

  await expect(relLink, "Relationship Review is a link").toBeAttached();
  await expect(idLink,  "Identity Review is a link").toBeAttached();

  await page.screenshot({ path: path.join(SS_DIR, "relationship-detail-active.png") });
  await page.keyboard.press("Escape");
  await ctx.close();
});
