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

const BASE         = "http://localhost:3201";
const MOCK_SUPABASE = "http://localhost:54322";

// ── Synthetic refs used in this suite ─────────────────────────────────────────
// MSR-TEST-PWTEST-003   — processing, Nadia Olivier (dispatch flow target)
// MSR-TEST-PWTEST-004   — dispatched, Amara Dlamini, TCG987654 (reopen WA test)
// MSR-TEST-PWNOPH-001   — dispatched, Zara Botha, phone=INVALID (copy fallback)
// MSR-TEST-PWFAIL-00001 — processing, mock returns 500 on PATCH (form validation tests)
// MSR-TEST-PWCOST-004   — processing, reserved for WA message exclusion test (test 12)
// MSR-TEST-PWCOST-005   — processing, reserved for server-action validation test (test 13)
// MSR-TEST-PWCOST-006   — processing, reserved for browser-reload persistence test (test 14)

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
  // .first() because courier name also appears in the handover confirmation label
  await expect(review.getByText(/The Courier Guy/).first()).toBeVisible();
  // .first() because the URL row also contains the tracking number as a substring
  await expect(review.getByText(/TCG-DISPATCH-001/).first()).toBeVisible();
  await expect(review.getByText(/Black Orchid Inspired/)).toBeVisible();

  // Test ← Back button: returns to form
  await page.getByRole("button", { name: /Back/ }).click();
  await expect(panel.getByText("Dispatch Details"), "form shown after Back").toBeVisible({ timeout: 5_000 });

  // Return to review and confirm
  await page.getByRole("button", { name: /Review/ }).click();
  await expect(panel.locator('[data-testid="dispatch-review"]')).toBeVisible({ timeout: 5_000 });

  // Handover checkbox must be checked before confirm is available
  const confirmBtn = review.getByRole("button", { name: "Confirm handover" });
  await expect(confirmBtn, "confirm disabled without handover checkbox").toBeDisabled();
  await review.getByRole("checkbox").check();
  await confirmBtn.click();

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
  await expect(
    panel.getByText("Confirm Dispatch", { exact: true }),
    "review heading visible"
  ).toBeVisible({ timeout: 5_000 });

  // Check handover checkbox (required gate) then click confirm — mock returns 500
  const failReview = panel.locator('[data-testid="dispatch-review"]');
  await failReview.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Confirm handover" }).click();

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

// ── 8. Handover checkbox: confirm gate ───────────────────────────────────────
// PWFAIL-00001 is always processing (500 on actual PATCH, never mutated by this test).

test("handover checkbox: confirm disabled until checked, resets after Back", async ({ browser }) => {
  const ctx   = await makeContext(browser, { width: 1280, height: 800 });
  const page  = await ctx.newPage();
  const panel = getPanel(page, 1280);
  await gotoAdmin(page);

  await page.getByText("MSR-TEST-PWFAIL-00001").first().click();
  await expect(page.getByText("MSR-TEST-PWFAIL-00001").nth(1)).toBeVisible({ timeout: 10_000 });

  await page.getByRole("button", { name: "Mark as Dispatched" }).click();
  await expect(panel.getByText("Dispatch Details")).toBeVisible({ timeout: 5_000 });

  // Fill required fields and advance to review
  await panel.getByPlaceholder("e.g. The Courier Guy").fill("PostNet");
  await panel.getByPlaceholder("e.g. SN123456789").fill("PN-HANDOVER-001");
  await page.getByRole("button", { name: /Review/ }).click();

  const review  = panel.locator('[data-testid="dispatch-review"]');
  await expect(review).toBeVisible({ timeout: 5_000 });

  const confirmBtn = review.getByRole("button", { name: "Confirm handover" });

  // Confirm blocked without checkbox
  await expect(confirmBtn, "confirm disabled without checkbox").toBeDisabled();

  // Check → enabled
  await review.getByRole("checkbox").check();
  await expect(confirmBtn, "confirm enabled after checkbox").toBeEnabled();

  // Uncheck → disabled again
  await review.getByRole("checkbox").uncheck();
  await expect(confirmBtn, "confirm disabled after uncheck").toBeDisabled();

  // Re-check, navigate Back — checkbox must reset on return to review
  await review.getByRole("checkbox").check();
  await page.getByRole("button", { name: /Back/ }).click();
  await expect(panel.getByText("Dispatch Details"), "form shown after Back").toBeVisible({ timeout: 5_000 });

  await page.getByRole("button", { name: /Review/ }).click();
  await expect(review).toBeVisible({ timeout: 5_000 });

  const checkbox = review.getByRole("checkbox");
  await expect(checkbox, "checkbox unchecked after Back/Review cycle").not.toBeChecked();
  await expect(confirmBtn, "confirm disabled after Back/Review cycle").toBeDisabled();

  await page.getByRole("button", { name: /Back/ }).click();
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await ctx.close();
});

// ── 9. Courier cost: optional field visible in form and review ────────────────

test("courier cost: optional field present in form, shown in review summary", async ({ browser }) => {
  const ctx   = await makeContext(browser, { width: 1280, height: 800 });
  const page  = await ctx.newPage();
  const panel = getPanel(page, 1280);
  await gotoAdmin(page);

  await page.getByText("MSR-TEST-PWFAIL-00001").first().click();
  await expect(page.getByText("MSR-TEST-PWFAIL-00001").nth(1)).toBeVisible({ timeout: 10_000 });

  await page.getByRole("button", { name: "Mark as Dispatched" }).click();
  await expect(panel.getByText("Dispatch Details")).toBeVisible({ timeout: 5_000 });

  // Courier cost field is present and optional (review still works without it)
  const costInput = panel.getByPlaceholder("e.g. 89.00");
  await expect(costInput, "courier cost field present in form").toBeVisible();

  // Fill required fields + cost, advance to review
  await panel.getByPlaceholder("e.g. The Courier Guy").fill("PostNet");
  await panel.getByPlaceholder("e.g. SN123456789").fill("PN-COST-001");
  await costInput.fill("95.50");

  await page.getByRole("button", { name: /Review/ }).click();
  const review = panel.locator('[data-testid="dispatch-review"]');
  await expect(review).toBeVisible({ timeout: 5_000 });

  // Cost should appear in the review summary
  await expect(review.getByText(/R 95\.50/), "cost shown in review summary").toBeVisible();

  // Cancel without dispatching
  await page.getByRole("button", { name: /Back/ }).click();
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await ctx.close();
});

// ── 11. Courier cost: out-of-range value blocks Review ───────────────────────
// Explicit client-side validation — the Review button must be disabled when
// the courier cost field contains a value outside 0–9999.99 or with more than
// two decimal places. Does not rely on browser form validation alone.

test("courier cost: out-of-range value disables Review and shows inline error", async ({ browser }) => {
  const ctx   = await makeContext(browser, { width: 1280, height: 800 });
  const page  = await ctx.newPage();
  const panel = getPanel(page, 1280);
  await gotoAdmin(page);

  await page.getByText("MSR-TEST-PWFAIL-00001").first().click();
  await expect(page.getByText("MSR-TEST-PWFAIL-00001").nth(1)).toBeVisible({ timeout: 10_000 });

  await page.getByRole("button", { name: "Mark as Dispatched" }).click();
  await expect(panel.getByText("Dispatch Details")).toBeVisible({ timeout: 5_000 });

  // Fill required fields so they don't mask the cost validation
  await panel.getByPlaceholder("e.g. The Courier Guy").fill("PostNet");
  await panel.getByPlaceholder("e.g. SN123456789").fill("PN-COST-OOR-001");

  const reviewBtn  = page.getByRole("button", { name: /Review/ });
  const costInput  = panel.getByPlaceholder("e.g. 89.00");
  const errorLabel = panel.getByText(/Must be 0–9999\.99/);

  // Required fields filled, no cost → Review enabled
  await expect(reviewBtn, "enabled before cost entered").toBeEnabled();

  // Over-range value → Review disabled, inline error shown
  await costInput.fill("10000");
  await expect(errorLabel, "inline error shown for 10000").toBeVisible({ timeout: 5_000 });
  await expect(reviewBtn, "Review disabled for 10000").toBeDisabled();

  // Three decimal places → Review disabled
  await costInput.fill("89.555");
  await expect(errorLabel, "inline error shown for 89.555").toBeVisible();
  await expect(reviewBtn, "Review disabled for 89.555").toBeDisabled();

  // Valid two-decimal value → error clears, Review enabled
  await costInput.fill("89.55");
  await expect(errorLabel, "error cleared for 89.55").not.toBeVisible();
  await expect(reviewBtn, "Review enabled for 89.55").toBeEnabled();

  // Clear cost entirely (optional) → still enabled
  await costInput.fill("");
  await expect(reviewBtn, "Review enabled with empty cost").toBeEnabled();

  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await ctx.close();
});

// ── 12. WA dispatch message excludes courier cost ────────────────────────────
// After a successful dispatch with a courier cost, the WhatsApp message draft
// must not contain the cost value. Cost is internal-only.

test("WA dispatch message: courier cost not included in message after dispatch", async ({ browser }) => {
  const ctx   = await makeContext(browser, { width: 1280, height: 800 });
  const page  = await ctx.newPage();
  const panel = getPanel(page, 1280);
  await gotoAdmin(page);

  // PWCOST-004 is reserved for this browser test (not touched by dispatch-api.spec.js)
  await page.getByText("MSR-TEST-PWCOST-004").first().click();
  await expect(page.getByText("MSR-TEST-PWCOST-004").nth(1)).toBeVisible({ timeout: 10_000 });

  await page.getByRole("button", { name: "Mark as Dispatched" }).click();
  await expect(panel.getByText("Dispatch Details")).toBeVisible({ timeout: 5_000 });

  await panel.getByPlaceholder("e.g. The Courier Guy").fill("PostNet");
  await panel.getByPlaceholder("e.g. SN123456789").fill("PN-WA-COST-001");
  await panel.getByPlaceholder("e.g. 89.00").fill("89.50");

  await page.getByRole("button", { name: /Review/ }).click();
  const review = panel.locator('[data-testid="dispatch-review"]');
  await expect(review).toBeVisible({ timeout: 5_000 });

  await review.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Confirm handover" }).click();

  const notif = panel.locator('[data-testid="dispatch-notification-section"]');
  await expect(notif, "WA section appears after dispatch").toBeVisible({ timeout: 25_000 });

  // WA link href must not contain the cost in any form
  const waLink = page.getByRole("link", { name: /Open WhatsApp message/i });
  await expect(waLink, "WA link shown").toBeVisible();
  const href = await waLink.getAttribute("href") ?? "";
  const decoded = decodeURIComponent(href);
  expect(decoded, "WA message does not contain courier cost value").not.toContain("89.5");
  expect(decoded, "WA message does not contain R-cost pattern").not.toMatch(/R\s*89/);

  await ctx.close();
});

// ── 10. No duplicate dispatch: already-dispatched order has no dispatch button ─

test("already-dispatched order: no 'Mark as Dispatched' button shown", async ({ browser }) => {
  const ctx   = await makeContext(browser, { width: 1280, height: 800 });
  const page  = await ctx.newPage();
  const panel = getPanel(page, 1280);
  await gotoAdmin(page);

  // PWTEST-004 is already dispatched
  await page.getByText("MSR-TEST-PWTEST-004").first().click();
  await expect(page.getByText("MSR-TEST-PWTEST-004").nth(1)).toBeVisible({ timeout: 10_000 });

  // Dispatch button must not be present — order is already dispatched
  await expect(
    panel.getByRole("button", { name: "Mark as Dispatched" }),
    "no dispatch button for already-dispatched order"
  ).not.toBeVisible();

  // WA section visible confirms order is genuinely dispatched, not just loading
  await expect(
    panel.locator('[data-testid="dispatch-notification-section"]'),
    "WA section confirms dispatched state"
  ).toBeVisible({ timeout: 10_000 });

  await ctx.close();
});

// ── 13. updateStatusAction: invalid cost validated server-side — zero mock PATCH calls
//
// Proves that updateStatusAction's pre-flight validation fires BEFORE its
// internal server-side fetch to /api/orders/[ref].
//
// Method: React 18 prevents onClick from firing on disabled buttons even
// when triggered programmatically (React checks fiber.memoizedProps.disabled
// before dispatching synthetic events). The browser UI therefore cannot be
// used to reach updateStatusAction with invalid cost — the UI guard works.
//
// Instead this test calls updateStatusAction directly by:
//   1. Loading the admin page to obtain the server action ID from the
//      compiled client bundle (Next.js embeds it as a createServerReference hash)
//   2. POSTing to the server action endpoint with the invalid cost in React's
//      server-action text/plain encoding
//   3. Verifying the response contains the validation error (action returned early)
//   4. Reading the mock PATCH counter to verify zero DB accesses (action never
//      called fetch, so the PATCH route and mock were never reached)
//
// This directly exercises updateStatusAction — not the PATCH route — and is
// a different code path from the dispatch-api.spec.js type-rejection tests.

test("updateStatusAction: invalid cost '1e-7' validated server-side — zero mock PATCH calls", async ({ browser, request }) => {
  // Reset mock PATCH counter first.
  const resetRes = await request.get(`${MOCK_SUPABASE}/mock/reset-count`);
  expect(resetRes.ok(), "reset-count ok").toBe(true);

  // ── Step 1: Capture the live updateStatusAction ID from a real browser dispatch ──
  // The action ID is a runtime value set by the dev server (Turbopack IDs differ
  // from the webpack build). Intercept the POST /admin the browser makes during a
  // real dispatch and capture the Next-Action header from it.
  //
  // PWFAIL-00001 is used: the mock returns 500 on PATCH, so the order stays
  // Processing after this capture dispatch — it is not permanently mutated.

  const ctx   = await makeContext(browser, { width: 1280, height: 800 });
  const page  = await ctx.newPage();
  const panel = getPanel(page, 1280);

  /** @type {string | null} */
  let capturedActionId = null;
  await page.route(`${BASE}/admin`, async (route, interceptedReq) => {
    if (interceptedReq.method() === "POST" && !capturedActionId) {
      const headers = interceptedReq.headers();
      if (headers["next-action"]) capturedActionId = headers["next-action"];
    }
    await route.continue();
  });

  await gotoAdmin(page);
  await page.getByText("MSR-TEST-PWFAIL-00001").first().click();
  await expect(page.getByText("MSR-TEST-PWFAIL-00001").nth(1)).toBeVisible({ timeout: 10_000 });

  await page.getByRole("button", { name: "Mark as Dispatched" }).click();
  await expect(panel.getByText("Dispatch Details")).toBeVisible({ timeout: 5_000 });
  await panel.getByPlaceholder("e.g. The Courier Guy").fill("PostNet");
  await panel.getByPlaceholder("e.g. SN123456789").fill("PN-ID-CAPTURE");
  await page.getByRole("button", { name: /Review/ }).click();
  const reviewPanel = panel.locator('[data-testid="dispatch-review"]');
  await expect(reviewPanel).toBeVisible({ timeout: 5_000 });
  await reviewPanel.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Confirm handover" }).click();
  // Wait for the error feedback (mock returns 500 for PWFAIL so action returns failure)
  await expect(panel.getByText(/Failed to update order|Update failed|Failed to connect/i)).toBeVisible({ timeout: 10_000 });
  await ctx.close();

  expect(capturedActionId, "captured Next-Action ID from browser dispatch").toBeTruthy();
  const actionId = /** @type {string} */ (capturedActionId);

  // ── Step 2: Reset counter; POST to server action with invalid cost ──────────
  await request.get(`${MOCK_SUPABASE}/mock/reset-count`);

  // React flight encoding: arguments array; undefined → "$undefined"
  // Arguments: (ref, status, note, trackingNumber, courierName, trackingUrl, courierCost)
  const body = JSON.stringify([
    "MSR-TEST-PWCOST-005", "dispatched",
    "$undefined", "PN-SA-INVALID", "PostNet", "$undefined",
    "1e-7",  // invalid — fails toFixed(2) check in updateStatusAction
  ]);

  const adminToken = createHash("sha256").update("nav-test-pw" + "msr-ops-v1").digest("hex");
  const actionRes  = await request.post(`${BASE}/admin`, {
    headers: {
      "Next-Action":            actionId,
      "Content-Type":           "text/plain;charset=UTF-8",
      "Cookie":                 `msr-ops-session=${adminToken}`,
      "Next-Router-State-Tree": JSON.stringify(["",[["children","__PAGE__",["__PAGE__",{"page":"/admin"}]]],"",null,true]),
    },
    data: body,
  });

  // Response is an RSC stream. The server action's return value
  // ({ success: false, message: "Courier cost must be a number…" }) is
  // embedded as text in the stream.
  const responseText = await actionRes.text();
  const containsError = responseText.includes("Courier cost must be a number")
    || responseText.includes("two decimal places");

  expect(containsError, "RSC stream contains validation error for 1e-7").toBe(true);

  // ── Step 3: Verify both mock counters are 0 ──────────────────────────────
  // The RSC stream containing the validation error proves updateStatusAction
  // returned early from its pre-flight check. patchCallCount = 0 proves the
  // mock PATCH handler was not reached. selectCallCount = 0 proves the mock
  // SELECT handler was not reached. Together these confirm no server-side
  // fetch to /api/orders/[ref] was made (fetch would trigger both SELECT and
  // PATCH on a valid request, but neither reached the mock here).
  const patchRes  = await request.get(`${MOCK_SUPABASE}/mock/patch-count`);
  const selectRes = await request.get(`${MOCK_SUPABASE}/mock/select-count`);
  expect((await patchRes.json()).count,  "mock PATCH handler not reached").toBe(0);
  expect((await selectRes.json()).count, "mock SELECT handler not reached").toBe(0);
});

// ── 14. Browser reload: dispatched cost persists after page.reload() ──────────
//
// The existing dispatch-api.spec.js persistence tests use pure HTTP (no browser):
// dispatchPatch() → getMockOrder(). That proves the mock stores the value but
// does not exercise a real browser reload. This test does both:
//
//   1. Dispatch via the browser UI (updateStatusAction → route → mock PATCH)
//   2. page.reload() — Next.js re-renders, re-fetches from mock
//   3. Verify: dispatch-notification visible (status persisted), no dispatch
//      button (order cannot be re-dispatched), and mock state confirms cost
//
// The cost cannot be read from the UI (courier_cost is internal-only and not
// rendered in the dispatch notification section). Mock state query is the
// accurate verification channel.

test("browser reload: dispatch with positive cost — state and cost persist after page.reload()", async ({ browser, request }) => {
  const ctx   = await makeContext(browser, { width: 1280, height: 800 });
  const page  = await ctx.newPage();
  const panel = getPanel(page, 1280);
  await gotoAdmin(page);

  // PWCOST-006: processing order reserved for this test
  await page.getByText("MSR-TEST-PWCOST-006").first().click();
  await expect(page.getByText("MSR-TEST-PWCOST-006").nth(1)).toBeVisible({ timeout: 10_000 });

  await page.getByRole("button", { name: "Mark as Dispatched" }).click();
  await expect(panel.getByText("Dispatch Details")).toBeVisible({ timeout: 5_000 });

  await panel.getByPlaceholder("e.g. The Courier Guy").fill("PostNet");
  await panel.getByPlaceholder("e.g. SN123456789").fill("PN-RELOAD-001");
  await panel.getByPlaceholder("e.g. 89.00").fill("89.50");

  await page.getByRole("button", { name: /Review/ }).click();
  const review = panel.locator('[data-testid="dispatch-review"]');
  await expect(review).toBeVisible({ timeout: 5_000 });
  await review.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Confirm handover" }).click();

  // Wait for dispatch to complete — dispatch notification section appears
  const notif = panel.locator('[data-testid="dispatch-notification-section"]');
  await expect(notif, "dispatch succeeded — WA section visible").toBeVisible({ timeout: 25_000 });

  // ── Real browser reload ──────────────────────────────────────────────────────
  // Next.js re-renders server components, re-fetches orders from mock. The mock
  // merges orderPatches (applied by the PATCH above) into the base order, so the
  // order is returned as dispatched with courier_cost = 89.5.
  await page.reload();
  await page.waitForSelector('[aria-label="Open navigation menu"]', { timeout: 30_000 });

  // Re-select the order — selectedRef resets on reload
  await page.getByText("MSR-TEST-PWCOST-006").first().click();
  await expect(page.getByText("MSR-TEST-PWCOST-006").nth(1)).toBeVisible({ timeout: 10_000 });

  // Dispatched state persisted: WA section is visible immediately (no dispatch needed)
  await expect(
    panel.locator('[data-testid="dispatch-notification-section"]'),
    "WA section visible after reload — dispatched state persisted"
  ).toBeVisible({ timeout: 10_000 });

  // No dispatch button — order cannot be dispatched again after reload
  await expect(
    panel.getByRole("button", { name: "Mark as Dispatched" }),
    "no dispatch button after reload"
  ).not.toBeVisible();

  // Verify persisted cost via mock state query.
  // courier_cost is internal-only and not rendered in the dispatch notification
  // section, so mock state is the correct verification channel.
  const orderRes = await request.get(
    `${MOCK_SUPABASE}/rest/v1/orders?order_ref=eq.MSR-TEST-PWCOST-006`
  );
  const [order] = await orderRes.json();
  expect(
    order.courier_cost,
    "courier_cost persists as 89.5 in mock after browser reload"
  ).toBe(89.5);

  await ctx.close();
});

// ── 15. Browser reload: zero cost persists as 0 (not null) after page.reload() ─
//
// Complements test 14 (positive cost). Zero is a valid cost (courier included
// in order; no separate charge). The mock must store 0 as a numeric value, not
// null — otherwise callers cannot distinguish "free shipping" from "cost not set".
//
// Uses PWCOST-007: processing order reserved for this test.

test("browser reload: dispatch with zero cost — persists as 0 (not null) after page.reload()", async ({ browser, request }) => {
  const ctx   = await makeContext(browser, { width: 1280, height: 800 });
  const page  = await ctx.newPage();
  const panel = getPanel(page, 1280);
  await gotoAdmin(page);

  // PWCOST-007: processing order reserved for this test
  await page.getByText("MSR-TEST-PWCOST-007").first().click();
  await expect(page.getByText("MSR-TEST-PWCOST-007").nth(1)).toBeVisible({ timeout: 10_000 });

  await page.getByRole("button", { name: "Mark as Dispatched" }).click();
  await expect(panel.getByText("Dispatch Details")).toBeVisible({ timeout: 5_000 });

  await panel.getByPlaceholder("e.g. The Courier Guy").fill("PostNet");
  await panel.getByPlaceholder("e.g. SN123456789").fill("PN-ZERO-001");
  await panel.getByPlaceholder("e.g. 89.00").fill("0");

  await page.getByRole("button", { name: /Review/ }).click();
  const review = panel.locator('[data-testid="dispatch-review"]');
  await expect(review).toBeVisible({ timeout: 5_000 });
  await review.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Confirm handover" }).click();

  // Wait for dispatch to complete
  const notif = panel.locator('[data-testid="dispatch-notification-section"]');
  await expect(notif, "dispatch succeeded — WA section visible").toBeVisible({ timeout: 25_000 });

  // ── Real browser reload ──────────────────────────────────────────────────────
  await page.reload();
  await page.waitForSelector('[aria-label="Open navigation menu"]', { timeout: 30_000 });

  await page.getByText("MSR-TEST-PWCOST-007").first().click();
  await expect(page.getByText("MSR-TEST-PWCOST-007").nth(1)).toBeVisible({ timeout: 10_000 });

  // Dispatched state persisted after reload
  await expect(
    panel.locator('[data-testid="dispatch-notification-section"]'),
    "WA section visible after reload — dispatched state persisted"
  ).toBeVisible({ timeout: 10_000 });

  await expect(
    panel.getByRole("button", { name: "Mark as Dispatched" }),
    "no dispatch button after reload"
  ).not.toBeVisible();

  // Verify zero cost stored as 0, not null. courier_cost is internal-only and
  // not rendered in the UI, so mock state is the correct verification channel.
  const orderRes = await request.get(
    `${MOCK_SUPABASE}/rest/v1/orders?order_ref=eq.MSR-TEST-PWCOST-007`
  );
  const [order] = await orderRes.json();
  expect(
    order.courier_cost,
    "courier_cost persists as 0 (not null) in mock after browser reload"
  ).toBe(0);

  await ctx.close();
});
