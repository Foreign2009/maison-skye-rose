// @ts-check
/**
 * Dispatch WhatsApp handoff — end-to-end verification.
 *
 * Tests the two-step dispatch form (form → review → confirm),
 * validation (required fields, HTTPS URL), WA section derived from
 * saved DB fields, phone fallback, failed save behaviour, and mobile layout.
 *
 * Runs against a local dev server on port 3201 with synthetic orders served
 * by mock-supabase.js on port 54322. No production connections or writes.
 */

const { test, expect } = require("@playwright/test");
const { createHash }   = require("crypto");
const fs               = require("fs");
const path             = require("path");

const SS_DIR = path.resolve(__dirname, "../results/dispatch");
fs.mkdirSync(SS_DIR, { recursive: true });

const BASE = "http://localhost:3201";

// ── Synthetic refs used in this suite ─────────────────────────────────────────
// MSR-TEST-PWTEST-003  — processing, Nadia Olivier (dispatch flow target)
// MSR-TEST-PWTEST-004  — dispatched, Amara Dlamini, TCG987654 (reopen WA test)
// MSR-TEST-PWNOPH-001  — dispatched, Zara Botha, phone=INVALID (copy fallback)
// MSR-TEST-PWFAIL-00001 — processing, TestFail Customer (mock returns 500 on PATCH)

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
  await page.waitForFunction(
    () => {
      const btn = document.querySelector('[aria-label="Open navigation menu"]');
      return btn != null && Object.keys(btn).some(k => k.startsWith("__reactFiber"));
    },
    { timeout: 15_000 }
  );
}

/**
 * Returns a locator scoped to the visible detail panel.
 *
 * AdminConsole renders two DetailPanel instances: a desktop sidebar
 * (data-testid="detail-panel-desktop", visible at ≥1024px) and a mobile
 * bottom drawer (data-testid="detail-panel-mobile", visible at <1024px).
 * Both are in the DOM when an order is selected. Scoping locators through
 * the viewport-appropriate panel avoids Playwright strict-mode violations.
 */
function getPanel(page, viewportWidth) {
  return viewportWidth >= 1024
    ? page.locator('[data-testid="detail-panel-desktop"]')
    : page.locator('[data-testid="detail-panel-mobile"]');
}

// ── 1. Required fields validation ─────────────────────────────────────────────

test("dispatch form: Review button disabled without required fields", async ({ browser }) => {
  const ctx   = await makeContext(browser, { width: 1280, height: 800 });
  const page  = await ctx.newPage();
  const panel = getPanel(page, 1280);
  await gotoAdmin(page);

  // Open the processing order
  await page.getByText("MSR-TEST-PWTEST-003").first().click();
  await expect(
    page.getByText("MSR-TEST-PWTEST-003").nth(1),
    "order ref in detail panel"
  ).toBeVisible({ timeout: 10_000 });

  // Trigger dispatch flow
  await page.getByRole("button", { name: "Mark as Dispatched" }).click();
  await expect(panel.getByText("Dispatch Details"), "form visible").toBeVisible({ timeout: 5_000 });

  const reviewBtn = page.getByRole("button", { name: /Review/ });

  // Both fields empty → disabled
  await expect(reviewBtn, "disabled with no fields").toBeDisabled();

  // Courier name only → still disabled
  await panel.getByPlaceholder("e.g. The Courier Guy").fill("The Courier Guy");
  await expect(reviewBtn, "disabled without tracking number").toBeDisabled();

  // Add tracking number → enabled
  await panel.getByPlaceholder("e.g. SN123456789").fill("TCG-001");
  await expect(reviewBtn, "enabled with both required fields").toBeEnabled();

  // Clear courier name → disabled again
  await panel.getByPlaceholder("e.g. The Courier Guy").fill("");
  await expect(reviewBtn, "disabled after clearing courier name").toBeDisabled();

  // "Cancel" exact match avoids collision with the "Cancelled" status-filter button
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await ctx.close();
});

// ── 2. HTTPS URL validation ───────────────────────────────────────────────────

test("dispatch form: invalid tracking URL blocks Review", async ({ browser }) => {
  const ctx   = await makeContext(browser, { width: 1280, height: 800 });
  const page  = await ctx.newPage();
  const panel = getPanel(page, 1280);
  await gotoAdmin(page);

  await page.getByText("MSR-TEST-PWTEST-003").first().click();
  await expect(page.getByText("MSR-TEST-PWTEST-003").nth(1)).toBeVisible({ timeout: 10_000 });

  await page.getByRole("button", { name: "Mark as Dispatched" }).click();
  await expect(panel.getByText("Dispatch Details")).toBeVisible({ timeout: 5_000 });

  // Fill required fields
  await panel.getByPlaceholder("e.g. The Courier Guy").fill("The Courier Guy");
  await panel.getByPlaceholder("e.g. SN123456789").fill("TCG-001");

  const reviewBtn = page.getByRole("button", { name: /Review/ });
  await expect(reviewBtn, "enabled before invalid URL entered").toBeEnabled();

  // Enter an http:// URL (not https://)
  await panel.getByPlaceholder("https://track.example.com/…").fill("http://not-secure.example.com");

  // Error message and blocked Review
  await expect(
    panel.getByText("Must be a valid https:// URL"),
    "validation error shown"
  ).toBeVisible({ timeout: 5_000 });
  await expect(reviewBtn, "Review blocked by invalid URL").toBeDisabled();

  // Fix to valid https:// URL — error clears, Review re-enabled
  await panel.getByPlaceholder("https://track.example.com/…").fill("https://track.example.com/TCG-001");
  await expect(
    panel.getByText("Must be a valid https:// URL"),
    "validation error cleared"
  ).not.toBeVisible();
  await expect(reviewBtn, "Review enabled with valid https URL").toBeEnabled();

  // Clear URL entirely (optional field allowed empty) — still enabled
  await panel.getByPlaceholder("https://track.example.com/…").fill("");
  await expect(reviewBtn, "Review enabled with empty optional URL").toBeEnabled();

  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await ctx.close();
});

// ── 3. Successful dispatch: form → review → confirm → WA section ──────────────

test("successful dispatch: two-step flow → WA section with correct content", async ({ browser }) => {
  const ctx   = await makeContext(browser, { width: 1280, height: 800 });
  const page  = await ctx.newPage();
  const panel = getPanel(page, 1280);
  await gotoAdmin(page);

  await page.getByText("MSR-TEST-PWTEST-003").first().click();
  await expect(page.getByText("MSR-TEST-PWTEST-003").nth(1)).toBeVisible({ timeout: 10_000 });

  await page.getByRole("button", { name: "Mark as Dispatched" }).click();
  await expect(panel.getByText("Dispatch Details")).toBeVisible({ timeout: 5_000 });

  // Fill the dispatch form
  await panel.getByPlaceholder("e.g. The Courier Guy").fill("The Courier Guy");
  await panel.getByPlaceholder("e.g. SN123456789").fill("TCG-DISPATCH-001");
  await panel.getByPlaceholder("https://track.example.com/…").fill(
    "https://track.thecourierguy.co.za/TCG-DISPATCH-001"
  );

  // Advance to review step
  await page.getByRole("button", { name: /Review/ }).click();

  // Review screen: verify all details present. Scope to the review container
  // to avoid matching the same text in the hidden PackingSlip.
  const review = panel.locator('[data-testid="dispatch-review"]');
  await expect(review, "review container visible").toBeVisible({ timeout: 5_000 });
  await expect(review.getByText("Confirm Dispatch", { exact: true })).toBeVisible();
  await expect(review.getByText("MSR-TEST-PWTEST-003")).toBeVisible();
  await expect(review.getByText(/Nadia Olivier/)).toBeVisible();
  await expect(review.getByText(/The Courier Guy/)).toBeVisible();
  // .first() because the URL row also contains the tracking number as a substring
  await expect(review.getByText(/TCG-DISPATCH-001/).first()).toBeVisible();
  await expect(review.getByText(/Black Orchid Inspired/)).toBeVisible();

  // Test ← Back button: returns to form
  await page.getByRole("button", { name: /Back/ }).click();
  await expect(panel.getByText("Dispatch Details"), "form shown after Back").toBeVisible({ timeout: 5_000 });

  // Return to review and confirm
  await page.getByRole("button", { name: /Review/ }).click();
  await expect(panel.locator('[data-testid="dispatch-review"]')).toBeVisible({ timeout: 5_000 });
  await page.getByRole("button", { name: "Confirm dispatch" }).click();

  // WA section should appear after save + router.refresh()
  const notif = panel.locator('[data-testid="dispatch-notification-section"]');
  await expect(
    notif,
    "WA section appears after successful dispatch"
  ).toBeVisible({ timeout: 25_000 });

  // Dispatch notification details visible in UI (scoped to notification section)
  await expect(notif.getByText(/The Courier Guy/)).toBeVisible();
  // .first() because the tracking number also appears in the URL row within the same section
  await expect(notif.getByText(/TCG-DISPATCH-001/).first()).toBeVisible();

  // WA link (valid phone)
  const waLink = page.getByRole("link", { name: /Open WhatsApp message/i });
  await expect(waLink, "WA link shown for valid phone").toBeVisible();

  // WA link encodes courier name, tracking number and order ref
  const href = await waLink.getAttribute("href");
  expect(href, "WA link encodes courier name").toContain("The%20Courier%20Guy");
  expect(href, "WA link encodes tracking number").toContain("TCG-DISPATCH-001");
  expect(href, "WA link encodes order ref").toContain("MSR-TEST-PWTEST-003");
  expect(href, "WA link encodes tracking URL").toContain("track.thecourierguy.co.za");

  // Success feedback
  await expect(panel.getByText("Order updated successfully.")).toBeVisible();

  await page.screenshot({ path: path.join(SS_DIR, "dispatch-success-1280.png") });
  await ctx.close();
});

// ── 4. Already-dispatched order: WA section visible on page load ───────────────

test("dispatched order: WA section visible from saved DB fields on page load", async ({ browser }) => {
  const ctx   = await makeContext(browser, { width: 1280, height: 800 });
  const page  = await ctx.newPage();
  const panel = getPanel(page, 1280);
  await gotoAdmin(page);

  // Open the pre-dispatched synthetic order
  await page.getByText("MSR-TEST-PWTEST-004").first().click();
  await expect(page.getByText("MSR-TEST-PWTEST-004").nth(1)).toBeVisible({ timeout: 10_000 });

  // WA section should show immediately (no dispatch needed).
  // Scope to the notification section to avoid matching the hidden PackingSlip.
  const notif = panel.locator('[data-testid="dispatch-notification-section"]');
  await expect(
    notif,
    "WA section visible for already-dispatched order"
  ).toBeVisible({ timeout: 10_000 });

  await expect(notif.getByText(/The Courier Guy/)).toBeVisible();
  // .first() because the tracking number also appears in the URL row within the same section
  await expect(notif.getByText(/TCG987654/).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /Open WhatsApp message/i })).toBeVisible();

  // Navigate away and back — WA section persists (derived from saved DB fields)
  await page.getByText("MSR-TEST-PWTEST-001").first().click();
  await page.getByText("MSR-TEST-PWTEST-004").first().click();

  await expect(
    panel.locator('[data-testid="dispatch-notification-section"]'),
    "WA section re-appears after re-selecting the order"
  ).toBeVisible({ timeout: 10_000 });

  await page.screenshot({ path: path.join(SS_DIR, "dispatch-reopen-1280.png") });
  await ctx.close();
});

// ── 5. Phone fallback: Copy button when phone is invalid ──────────────────────

test("dispatched order with invalid phone: Copy button shown instead of WA link", async ({ browser }) => {
  const ctx   = await makeContext(browser, { width: 1280, height: 800 });
  const page  = await ctx.newPage();
  const panel = getPanel(page, 1280);
  await gotoAdmin(page);

  // Open the dispatched order with an invalid phone number
  await page.getByText("MSR-TEST-PWNOPH-001").first().click();
  await expect(page.getByText("MSR-TEST-PWNOPH-001").nth(1)).toBeVisible({ timeout: 10_000 });

  const notif = panel.locator('[data-testid="dispatch-notification-section"]');
  await expect(notif, "dispatch section present").toBeVisible({ timeout: 10_000 });

  // No WA link for invalid phone
  await expect(
    page.getByRole("link", { name: /Open WhatsApp message/i }),
    "no WA link for invalid phone"
  ).not.toBeVisible();

  // Phone fallback message and Copy button
  await expect(
    notif.getByText("Phone number not available for WhatsApp"),
    "phone fallback text shown"
  ).toBeVisible();

  await expect(
    page.getByRole("button", { name: /Copy dispatch message/i }),
    "Copy dispatch message button visible"
  ).toBeVisible();

  await page.screenshot({ path: path.join(SS_DIR, "dispatch-phone-fallback-1280.png") });
  await ctx.close();
});

// ── 6. Failed save: error feedback, no WA section ────────────────────────────

test("failed save: error feedback shown, dispatch notification not shown", async ({ browser }) => {
  const ctx   = await makeContext(browser, { width: 1280, height: 800 });
  const page  = await ctx.newPage();
  const panel = getPanel(page, 1280);
  await gotoAdmin(page);

  // Open the fail-trigger order (mock returns 500 for PATCH on this ref)
  await page.getByText("MSR-TEST-PWFAIL-00001").first().click();
  await expect(page.getByText("MSR-TEST-PWFAIL-00001").nth(1)).toBeVisible({ timeout: 10_000 });

  await page.getByRole("button", { name: "Mark as Dispatched" }).click();
  await expect(panel.getByText("Dispatch Details")).toBeVisible({ timeout: 5_000 });

  await panel.getByPlaceholder("e.g. The Courier Guy").fill("FastShip");
  await panel.getByPlaceholder("e.g. SN123456789").fill("FS-FAIL-001");

  await page.getByRole("button", { name: /Review/ }).click();
  // "Confirm Dispatch" exact match avoids collision with the "Confirm dispatch" button
  await expect(
    panel.getByText("Confirm Dispatch", { exact: true }),
    "review heading visible"
  ).toBeVisible({ timeout: 5_000 });

  await page.getByRole("button", { name: "Confirm dispatch" }).click();

  // Error feedback must appear (API returns 500 → updateStatusAction returns failure)
  await expect(
    panel.getByText(/Failed to update order|Update failed/i),
    "error feedback visible after failed save"
  ).toBeVisible({ timeout: 25_000 });

  // No dispatch notification — order remains processing (save failed)
  await expect(
    panel.locator('[data-testid="dispatch-notification-section"]'),
    "no dispatch notification after failed save"
  ).not.toBeVisible();

  await page.screenshot({ path: path.join(SS_DIR, "dispatch-failed-save-1280.png") });
  await ctx.close();
});

// ── 7. Mobile layout at 375px ────────────────────────────────────────────────

test("[375px] dispatch notification visible in mobile drawer; form accessible", async ({ browser }) => {
  const ctx   = await makeContext(browser, { width: 375, height: 812 });
  const page  = await ctx.newPage();
  const panel = getPanel(page, 375);
  await gotoAdmin(page);

  // Already-dispatched order: WA section visible in bottom drawer
  await page.getByText("MSR-TEST-PWTEST-004").first().click();
  const notif = panel.locator('[data-testid="dispatch-notification-section"]');
  await expect(notif, "WA section visible in mobile drawer").toBeVisible({ timeout: 15_000 });
  await expect(
    page.getByRole("link", { name: /Open WhatsApp message/i }),
    "WA link accessible on mobile"
  ).toBeVisible();

  // Close this order and open a processing order (PWFAIL stays processing even after failed save)
  await page.getByRole("button", { name: "Close" }).first().click();

  await page.getByText("MSR-TEST-PWFAIL-00001").first().click();
  await expect(page.getByText("MSR-TEST-PWFAIL-00001").first()).toBeVisible({ timeout: 10_000 });

  // "Mark as Dispatched" button accessible and meets minimum height
  const dispatchBtn = page.getByRole("button", { name: "Mark as Dispatched" });
  await expect(dispatchBtn, "dispatch button accessible on mobile").toBeVisible({ timeout: 10_000 });
  const box = await dispatchBtn.boundingBox();
  expect(
    Math.ceil(box?.height ?? 0),
    "dispatch button ≥ 30px height on mobile"
  ).toBeGreaterThanOrEqual(30);

  // Dispatch form opens and inputs accessible
  await dispatchBtn.click();
  await expect(panel.getByText("Dispatch Details"), "dispatch form opens on mobile").toBeVisible({ timeout: 5_000 });

  const courierInput = panel.getByPlaceholder("e.g. The Courier Guy");
  await expect(courierInput, "courier input accessible").toBeVisible();
  const inputBox = await courierInput.boundingBox();
  expect(
    Math.ceil(inputBox?.height ?? 0),
    "courier input ≥ 30px height"
  ).toBeGreaterThanOrEqual(30);

  await page.screenshot({ path: path.join(SS_DIR, "dispatch-mobile-375.png") });
  await ctx.close();
});
