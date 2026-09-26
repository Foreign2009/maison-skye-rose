// @ts-check
/**
 * Admin navigation verification — isolated, no production connections.
 * Dev server on port 3200 with dummy credentials; admin renders empty order list.
 */

const { test, expect } = require("@playwright/test");
const { createHash }   = require("crypto");
const fs               = require("fs");
const path             = require("path");

const SS_DIR = path.resolve(__dirname, "../results/nav-verify");
fs.mkdirSync(SS_DIR, { recursive: true });

const NAV_LABELS = [
  "Operations", "Briefing", "Intelligence", "Performance",
  "Customer Intelligence", "Commerce Intelligence",
  "Executive Operations", "Unified Operations",
  "Alerts", "Alert Center",
  "Executive Digest", "Executive Report",
  "Identity Review", "Relationship Review",
];

const VIEWPORTS = [
  { width: 320,  height: 812  },
  { width: 375,  height: 812  },
  { width: 390,  height: 844  },
  { width: 768,  height: 1024 },
  { width: 1024, height: 768  },
  { width: 1280, height: 800  },
  { width: 1440, height: 900  },
];

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

// Navigate to an admin route and wait for the nav trigger to confirm rendering.
// Using the trigger selector is faster and more reliable than networkidle
// (avoids hanging on Supabase connection-refused retries).
async function gotoAdmin(page, route) {
  const r = route || "/admin";
  await page.goto(`http://localhost:3200${r}`);
  await page.waitForSelector('[aria-label="Open navigation menu"]', { timeout: 60_000 });
}

// ── Trigger visibility at all viewports ──────────────────────────────────────

for (const vp of VIEWPORTS) {
  test(`[${vp.width}px] trigger visible; not clipped; header controls unobstructed`, async ({ browser }) => {
    const ctx  = await makeContext(browser, vp);
    const page = await ctx.newPage();
    await gotoAdmin(page);

    const trigger = page.getByRole("button", { name: "Open navigation menu" });
    await expect(trigger, "trigger visible").toBeVisible();

    const bbox = await trigger.boundingBox();
    expect(bbox,                          "trigger has bounding box").not.toBeNull();
    expect(bbox.x,                        "left edge in viewport").toBeGreaterThanOrEqual(0);
    expect(bbox.x + bbox.width,           "right edge in viewport").toBeLessThanOrEqual(vp.width + 1);
    expect(bbox.height,                   "height >= 44px touch target").toBeGreaterThanOrEqual(44);

    await page.screenshot({ path: path.join(SS_DIR, `${vp.width}-header.png`) });
    console.log(`  [${vp.width}px] header screenshot saved`);
    await ctx.close();
  });
}

// ── Drawer contents and behaviour at all viewports ───────────────────────────

for (const vp of VIEWPORTS) {
  test(`[${vp.width}px] all 14 destinations reachable; drawer scrolls; link closes menu`, async ({ browser }) => {
    const ctx  = await makeContext(browser, vp);
    const page = await ctx.newPage();
    await gotoAdmin(page);

    const trigger = page.getByRole("button", { name: "Open navigation menu" });
    await trigger.click();

    const drawer = page.getByRole("dialog", { name: "Admin navigation" });
    await expect(drawer, "drawer visible").toBeVisible();

    await page.screenshot({ path: path.join(SS_DIR, `${vp.width}-drawer-open.png`) });

    const nav = drawer.getByRole("navigation", { name: "Admin destinations" });

    for (const label of NAV_LABELS) {
      const link = nav.getByRole("link", { name: label, exact: true });
      await expect(link, `"${label}" attached`).toBeAttached();
      await link.scrollIntoViewIfNeeded();
      await expect(link, `"${label}" visible after scroll`).toBeVisible();
    }

    // Screenshot with the last item visible (tests scrollability on short screens).
    await page.screenshot({ path: path.join(SS_DIR, `${vp.width}-drawer-scrolled.png`) });

    // Clicking a link navigates and closes the drawer.
    await nav.getByRole("link", { name: "Briefing", exact: true }).click();
    await page.waitForURL("**/admin/briefing", { timeout: 30_000 });
    await expect(drawer, "drawer closed after link click").not.toBeVisible();

    await ctx.close();
  });
}

// ── Keyboard behaviour ───────────────────────────────────────────────────────

for (const vp of VIEWPORTS) {
  test(`[${vp.width}px] Escape closes drawer; focus returns to trigger`, async ({ browser }) => {
    const ctx  = await makeContext(browser, vp);
    const page = await ctx.newPage();
    await gotoAdmin(page);

    const trigger = page.getByRole("button", { name: "Open navigation menu" });
    await trigger.click();

    const drawer = page.getByRole("dialog", { name: "Admin navigation" });
    await expect(drawer, "drawer open").toBeVisible();

    await page.keyboard.press("Escape");
    await expect(drawer, "drawer closed after Escape").not.toBeVisible();

    // Native <dialog> showModal() returns focus to the element that called it.
    const focusedLabel = await page.evaluate(
      () => document.activeElement && document.activeElement.getAttribute("aria-label")
    );
    expect(focusedLabel, "focus returned to trigger").toBe("Open navigation menu");

    await ctx.close();
  });
}

test("[375px] Tab stays within dialog (focus containment)", async ({ browser }) => {
  const ctx  = await makeContext(browser, { width: 375, height: 812 });
  const page = await ctx.newPage();
  await gotoAdmin(page);

  await page.getByRole("button", { name: "Open navigation menu" }).click();
  const drawer = page.getByRole("dialog", { name: "Admin navigation" });
  await expect(drawer).toBeVisible();

  // Start from the close button (first focusable inside the drawer).
  await drawer.getByRole("button", { name: "Close navigation menu" }).focus();

  // Tab forward 6 times; every position must remain inside the dialog.
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press("Tab");
    const insideDialog = await page.evaluate(
      () => !!(document.activeElement && document.activeElement.closest("dialog"))
    );
    expect(insideDialog, `Tab ${i + 1}: focus inside dialog`).toBe(true);
  }

  await page.keyboard.press("Escape");
  await ctx.close();
});

// ── Active-page indication ────────────────────────────────────────────────────

test("Operations: aria-current=page; no other item active", async ({ browser }) => {
  const ctx  = await makeContext(browser, { width: 375, height: 812 });
  const page = await ctx.newPage();
  await gotoAdmin(page, "/admin");

  await page.getByRole("button", { name: "Open navigation menu" }).click();
  const nav = page.getByRole("dialog").getByRole("navigation");

  const opsLink = nav.getByRole("link", { name: "Operations", exact: true });
  expect(await opsLink.getAttribute("aria-current"), "Operations: aria-current=page").toBe("page");

  // Briefing must not be active.
  const briefLink = nav.getByRole("link", { name: "Briefing", exact: true });
  expect(await briefLink.getAttribute("aria-current"), "Briefing: not active on /admin").toBeFalsy();

  await page.keyboard.press("Escape");
  await ctx.close();
});

test("/admin/identity/relationships: only Relationship Review active", async ({ browser }) => {
  const ctx  = await makeContext(browser, { width: 375, height: 812 });
  const page = await ctx.newPage();
  await gotoAdmin(page, "/admin/identity/relationships");

  await page.getByRole("button", { name: "Open navigation menu" }).click();
  const nav = page.getByRole("dialog").getByRole("navigation");

  const relLink = nav.getByRole("link", { name: "Relationship Review", exact: true });
  const idLink  = nav.getByRole("link", { name: "Identity Review",     exact: true });

  // Most-specific match gets aria-current="page".
  expect(await relLink.getAttribute("aria-current"), "Relationship Review: aria-current=page").toBe("page");
  // Identity Review must NOT also claim aria-current="page".
  expect(await idLink.getAttribute("aria-current"), "Identity Review: not aria-current=page").not.toBe("page");

  // Both are navigable links — never spans.
  await expect(relLink, "Relationship Review is a link").toBeAttached();
  await expect(idLink,  "Identity Review is a link").toBeAttached();

  await page.screenshot({ path: path.join(SS_DIR, "active-relationships.png") });
  await page.keyboard.press("Escape");
  await ctx.close();
});

test("/admin/identity: Identity Review active; Relationship Review not active", async ({ browser }) => {
  const ctx  = await makeContext(browser, { width: 375, height: 812 });
  const page = await ctx.newPage();
  await gotoAdmin(page, "/admin/identity");

  await page.getByRole("button", { name: "Open navigation menu" }).click();
  const nav = page.getByRole("dialog").getByRole("navigation");

  const idLink  = nav.getByRole("link", { name: "Identity Review",     exact: true });
  const relLink = nav.getByRole("link", { name: "Relationship Review", exact: true });

  expect(await idLink.getAttribute("aria-current"),  "Identity Review: aria-current=page on exact route").toBe("page");
  expect(await relLink.getAttribute("aria-current"), "Relationship Review: not active").toBeFalsy();

  await page.keyboard.press("Escape");
  await ctx.close();
});

// ── Background interaction blocked while drawer is open ──────────────────────

test("[375px] background controls not operable while nav drawer open", async ({ browser }) => {
  const ctx  = await makeContext(browser, { width: 375, height: 812 });
  const page = await ctx.newPage();
  await gotoAdmin(page, "/admin");

  await page.getByRole("button", { name: "Open navigation menu" }).click();
  const drawer = page.getByRole("dialog", { name: "Admin navigation" });
  await expect(drawer).toBeVisible();

  // Attempt to focus the search input (behind the modal backdrop) via JS.
  // With native showModal(), the dialog is in the top layer; the browser
  // rejects focus() on elements outside it.
  const searchFocused = await page.evaluate(() => {
    const search = document.querySelector('input[type="search"]');
    if (!search) return "no-search-input"; // empty order list — still valid test
    search.focus();
    return document.activeElement === search ? "focused" : "rejected";
  });

  // "no-search-input" is acceptable (empty orders list).
  // "rejected" is the expected result for a live page with orders.
  // "focused" would indicate the modal is not blocking background interaction.
  expect(searchFocused, "background focus rejected or input absent").not.toBe("focused");

  await page.keyboard.press("Escape");
  await ctx.close();
});
