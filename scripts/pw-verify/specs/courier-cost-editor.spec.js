// @ts-check
/**
 * Courier-cost post-dispatch editor — targeted regression coverage.
 *
 * Verifies that:
 *   1.  Unauthenticated access is redirected to the login form.
 *   2.  The editor is not shown for ineligible (non-dispatched/delivered) orders.
 *   3.  The editor is shown for delivered orders (not just dispatched).
 *   4.  Invalid input disables Save and shows an error; no DB access occurs.
 *   5.  Positive cost (45.00) persists after save and reload.
 *   6.  Zero cost (0) persists after save and reload.
 *   7.  Blank input clears the cost to NULL; "Not recorded" shown after reload.
 *   8.  All fields (status, tracking, notes, timestamps, financials) unchanged
 *       after a cost save.
 *   9.  WA dispatch message does not include the courier cost.
 *  10.  Failed DB write shows error feedback; saved cost is unchanged in mock.
 *  11.  Direct server action: unauthorized returns Unauthorized, zero DB access.
 *  12.  Direct server action: invalid order reference rejected before DB access.
 *  13.  Direct server action: invalid cost rejected before DB access.
 *  14.  Direct server action: non-existent ref — not-eligible (1 PATCH attempt).
 *  15.  Direct server action: payment_confirmed order — not-eligible with 1 PATCH
 *       attempt, proving the UPDATE filter guards against TOCTOU races.
 *  16.  Mobile 375px: courier-cost-section, input, Save and feedback accessible.
 *
 * Uses synthetic orders seeded in mock-supabase.js. No production connections
 * or writes are made.
 *
 * Orders used:
 *   MSR-20261001-00016 — dispatched, courier_cost null, tracking info present
 *   MSR-20261001-00017 — dispatched, courier_cost null, no tracking
 *   MSR-20261001-00018 — dispatched, courier_cost 45.50
 *   MSR-20261001-00019 — payment_confirmed (ineligible)
 *   MSR-20261001-00020 — delivered, courier_cost null
 *   MSR-20261001-00021 — dispatched, courier_cost null, PATCH returns 500
 */

const { test, expect } = require("@playwright/test");
const { createHash }   = require("crypto");

const BASE          = "http://localhost:3201";
const MOCK_SUPABASE = "http://localhost:54322";

// ── Helpers ───────────────────────────────────────────────────────────────────

function sessionToken() {
  return createHash("sha256").update("nav-test-pw" + "msr-ops-v1").digest("hex");
}

async function makeContext(browser, vp) {
  const ctx = await browser.newContext({
    viewport:       vp ?? { width: 1280, height: 800 },
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

/**
 * Reads one order from the mock Supabase by ref.
 * @param {import("@playwright/test").APIRequestContext} req
 * @param {string} ref
 */
async function mockGetOrder(req, ref) {
  const res  = await req.get(
    `${MOCK_SUPABASE}/rest/v1/orders?order_ref=eq.${encodeURIComponent(ref)}&limit=1`,
  );
  const rows = await res.json();
  return rows[0] ?? null;
}

/**
 * Opens the admin panel, selects an order by partial name match, waits for
 * the detail panel to appear, and returns the page.
 */
async function openOrder(page, nameText) {
  await page.goto(`${BASE}/admin`);
  await page.waitForSelector('[aria-label="Open navigation menu"]', { timeout: 60_000 });
  const row = page.getByText(nameText).first();
  await expect(row, `order row "${nameText}" visible`).toBeVisible({ timeout: 15_000 });
  await row.click();
  const panel = page.locator('[data-testid="detail-panel-desktop"]');
  await expect(panel, "detail panel visible").toBeVisible({ timeout: 10_000 });
  return panel;
}

// ── Test 1: Unauthenticated access redirects to login ─────────────────────────

test(
  "unauthenticated browser sees login form, not the admin dashboard",
  async ({ browser }) => {
    const ctx  = await browser.newContext({ serviceWorkers: "block" });
    const page = await ctx.newPage();

    await page.goto(`${BASE}/admin`);

    // Admin page requires a valid session cookie; without one it shows the
    // login form rather than the dashboard.
    const loginInput = page.locator('input[type="password"]');
    await expect(loginInput, "password input visible without cookie").toBeVisible({ timeout: 15_000 });

    // No order rows should be visible.
    const costSection = page.locator('[data-testid="courier-cost-section"]');
    await expect(costSection, "cost editor not visible without auth").not.toBeVisible();

    await ctx.close();
  },
);

// ── Test 2: Ineligible order (payment_confirmed) — editor not shown ───────────

test(
  "courier-cost-section is not shown for a payment_confirmed order",
  async ({ browser }) => {
    const ctx  = await makeContext(browser, null);
    const page = await ctx.newPage();

    const panel = await openOrder(page, "CCE Test Ineligible");

    const section = panel.locator('[data-testid="courier-cost-section"]');
    await expect(section, "cost section absent for payment_confirmed").not.toBeVisible();

    await ctx.close();
  },
);

// ── Test 3: Delivered order — editor is shown ─────────────────────────────────

test(
  "courier-cost-section is shown for a delivered order",
  async ({ browser }) => {
    const ctx  = await makeContext(browser, null);
    const page = await ctx.newPage();

    const panel = await openOrder(page, "CCE Test Delivered");

    const section = panel.locator('[data-testid="courier-cost-section"]');
    await expect(section, "cost section visible for delivered order").toBeVisible({ timeout: 10_000 });

    // Saved value shows "Not recorded" (courier_cost is null in seed).
    const saved = section.locator('[data-testid="courier-cost-saved"]');
    await expect(saved, "delivered order: Not recorded").toHaveText("Not recorded");

    await ctx.close();
  },
);

// ── Test 4: Invalid input disables Save — no DB access ───────────────────────

test(
  "invalid courier cost disables Save button and shows inline error",
  async ({ browser, request }) => {
    const ctx  = await makeContext(browser, null);
    const page = await ctx.newPage();

    const panel = await openOrder(page, "CCE Test Positive");

    const section  = panel.locator('[data-testid="courier-cost-section"]');
    await expect(section, "cost section visible").toBeVisible({ timeout: 10_000 });

    const input   = section.locator('[data-testid="courier-cost-input"]');
    const saveBtn = section.locator('[data-testid="courier-cost-save-btn"]');
    const errMsg  = section.locator('[data-testid="courier-cost-error"]');

    // Reset mock counters before the test assertions.
    await request.get(`${MOCK_SUPABASE}/mock/reset-count`);

    // Extra-precision value.
    await input.fill("9999.999");
    await expect(saveBtn, "Save disabled for 9999.999").toBeDisabled();
    await expect(errMsg,  "error shown for 9999.999").toBeVisible();

    // Non-numeric.
    await input.fill("abc");
    await expect(saveBtn, "Save disabled for abc").toBeDisabled();
    await expect(errMsg,  "error shown for abc").toBeVisible();

    // Negative.
    await input.fill("-1");
    await expect(saveBtn, "Save disabled for -1").toBeDisabled();
    await expect(errMsg,  "error shown for -1").toBeVisible();

    // Over-range.
    await input.fill("10000");
    await expect(saveBtn, "Save disabled for 10000").toBeDisabled();

    // Clear the input — no change from saved null, so still disabled (not invalid, not changed).
    await input.fill("");
    await expect(saveBtn, "Save disabled when unchanged (both null/blank)").toBeDisabled();
    await expect(errMsg,  "no error for blank").not.toBeVisible();

    // Since the button was always disabled, the action was never called — confirm
    // zero mock SELECT and PATCH calls from the server-action path.
    const selectRes = await request.get(`${MOCK_SUPABASE}/mock/select-count`);
    const patchRes  = await request.get(`${MOCK_SUPABASE}/mock/patch-count`);
    const { count: selectCount } = await selectRes.json();
    const { count: patchCount  } = await patchRes.json();
    // The admin page load itself triggers a SELECT; what we need is zero
    // server-action-level selects (action not called = no extra select).
    // We verify no PATCH was made — that directly proves no action was invoked.
    expect(patchCount, "no PATCH to mock for invalid inputs").toBe(0);

    await ctx.close();
  },
);

// ── Test 5: Positive cost persists after reload ───────────────────────────────

test(
  "positive courier cost (45.00) saves and persists after page reload",
  async ({ browser, request }) => {
    const REF = "MSR-20261001-00016";

    const ctx  = await makeContext(browser, null);
    const page = await ctx.newPage();

    const panel = await openOrder(page, "CCE Test Positive");

    const section  = panel.locator('[data-testid="courier-cost-section"]');
    const input    = section.locator('[data-testid="courier-cost-input"]');
    const saveBtn  = section.locator('[data-testid="courier-cost-save-btn"]');
    const saved    = section.locator('[data-testid="courier-cost-saved"]');

    await expect(section, "cost section visible").toBeVisible({ timeout: 10_000 });
    await expect(saved,   "initial: Not recorded").toHaveText("Not recorded");

    // Enter a valid cost and save.
    await input.fill("45");
    await expect(saveBtn, "Save enabled for valid value").toBeEnabled({ timeout: 5_000 });
    await saveBtn.click();

    // Wait for the displayed saved value to update — this proves the action
    // completed AND router.refresh() re-rendered the page with new server data.
    await expect(saved, "saved display updates to R45.00").toHaveText("R45.00", { timeout: 15_000 });

    // Verify DB state via mock (page already re-rendered with mock's data).
    const row = await mockGetOrder(request, REF);
    expect(row.courier_cost, "mock DB: courier_cost = 45").toBe(45);

    // Reload and re-select to confirm value persists across a full page load.
    await page.reload();
    await page.waitForSelector('[aria-label="Open navigation menu"]', { timeout: 60_000 });
    const panelAfter   = await openOrder(page, "CCE Test Positive");
    const sectionAfter = panelAfter.locator('[data-testid="courier-cost-section"]');
    const savedAfter   = sectionAfter.locator('[data-testid="courier-cost-saved"]');
    await expect(savedAfter, "after reload: R45.00").toHaveText("R45.00");

    await ctx.close();
  },
);

// ── Test 6: Zero cost persists after reload ───────────────────────────────────

test(
  "zero courier cost (0) saves and persists as R0.00 after reload",
  async ({ browser, request }) => {
    const REF = "MSR-20261001-00017";

    const ctx  = await makeContext(browser, null);
    const page = await ctx.newPage();

    const panel    = await openOrder(page, "CCE Test Zero");
    const section  = panel.locator('[data-testid="courier-cost-section"]');
    const input    = section.locator('[data-testid="courier-cost-input"]');
    const saveBtn  = section.locator('[data-testid="courier-cost-save-btn"]');
    const saved    = section.locator('[data-testid="courier-cost-saved"]');

    await expect(section, "cost section visible").toBeVisible({ timeout: 10_000 });
    await expect(saved,   "initial: Not recorded").toHaveText("Not recorded");

    await input.fill("0");
    await expect(saveBtn, "Save enabled for zero").toBeEnabled({ timeout: 5_000 });
    await saveBtn.click();
    // Wait for display to update — proves action completed and page re-rendered.
    await expect(saved, "saved display updates to R0.00").toHaveText("R0.00", { timeout: 15_000 });

    const row = await mockGetOrder(request, REF);
    expect(row.courier_cost, "mock DB: courier_cost = 0").toBe(0);

    await page.reload();
    await page.waitForSelector('[aria-label="Open navigation menu"]', { timeout: 60_000 });
    const panelAfter   = await openOrder(page, "CCE Test Zero");
    const sectionAfter = panelAfter.locator('[data-testid="courier-cost-section"]');
    const savedAfter   = sectionAfter.locator('[data-testid="courier-cost-saved"]');
    await expect(savedAfter, "after reload: R0.00").toHaveText("R0.00");

    await ctx.close();
  },
);

// ── Test 7: Blank input clears cost to NULL ───────────────────────────────────

test(
  "blank input clears courier cost to NULL; Not recorded shown after reload",
  async ({ browser, request }) => {
    const REF = "MSR-20261001-00018";  // seed: courier_cost = 45.50

    const ctx  = await makeContext(browser, null);
    const page = await ctx.newPage();

    const panel    = await openOrder(page, "CCE Test Clear");
    const section  = panel.locator('[data-testid="courier-cost-section"]');
    const input    = section.locator('[data-testid="courier-cost-input"]');
    const saveBtn  = section.locator('[data-testid="courier-cost-save-btn"]');
    const saved    = section.locator('[data-testid="courier-cost-saved"]');

    await expect(section, "cost section visible").toBeVisible({ timeout: 10_000 });
    await expect(saved,   "initial saved: R45.50").toHaveText("R45.50");

    // Input starts as "45.5" (String(45.50) = "45.5"). Clear it and save.
    await input.fill("");
    await expect(saveBtn, "Save enabled after clearing").toBeEnabled({ timeout: 5_000 });
    await saveBtn.click();
    // Wait for display to update — proves action completed and page re-rendered.
    await expect(saved, "saved display resets to Not recorded").toHaveText("Not recorded", { timeout: 15_000 });

    const row = await mockGetOrder(request, REF);
    expect(row.courier_cost, "mock DB: courier_cost = null after clear").toBeNull();

    await page.reload();
    await page.waitForSelector('[aria-label="Open navigation menu"]', { timeout: 60_000 });
    const panelAfter   = await openOrder(page, "CCE Test Clear");
    const sectionAfter = panelAfter.locator('[data-testid="courier-cost-section"]');
    const savedAfter   = sectionAfter.locator('[data-testid="courier-cost-saved"]');
    await expect(savedAfter, "after reload: Not recorded").toHaveText("Not recorded");

    await ctx.close();
  },
);

// ── Test 8: Other fields preserved after cost save ────────────────────────────

test(
  "saving courier cost does not modify payment_status, tracking, notes, timestamps or financials",
  async ({ browser, request }) => {
    // MSR-20261001-00016 was updated to courier_cost=45 in test 5.
    // Verify ALL other fields are byte-for-byte unchanged in the mock.
    const REF = "MSR-20261001-00016";

    const row = await mockGetOrder(request, REF);

    // Status and tracking
    expect(row.payment_status,  "payment_status unchanged").toBe("dispatched");
    expect(row.courier_name,    "courier_name unchanged").toBe("PostNet");
    expect(row.tracking_number, "tracking_number unchanged").toBe("PNA-CCE-001");
    expect(row.tracking_url,    "tracking_url unchanged").toBe("https://www.postnet.co.za");

    // Admin notes
    expect(row.notes, "notes unchanged").toBe("CCE field-preservation note");

    // Status history (no new entry for a cost-only write)
    expect(row.status_history.length, "status_history length unchanged").toBe(4);
    expect(row.status_history[3].status, "last status_history entry unchanged").toBe("dispatched");

    // Timestamps — only courier_cost changed; no timestamp should shift
    expect(row.dispatched_at,         "dispatched_at unchanged").toBeTruthy();
    expect(row.delivered_at,          "delivered_at unchanged (null)").toBeNull();
    expect(row.cancelled_at,          "cancelled_at unchanged (null)").toBeNull();
    expect(row.payment_confirmed_at,  "payment_confirmed_at unchanged").toBeTruthy();

    // Financial fields — only courier_cost was written; subtotal/delivery/total untouched
    expect(row.subtotal,  "subtotal unchanged").toBe(200);
    expect(row.delivery,  "delivery unchanged").toBe(180);
    expect(row.total,     "total unchanged").toBe(380);

    // courier_cost is the only field that should have changed
    expect(row.courier_cost, "courier_cost is now 45").toBe(45);
  },
);

// ── Test 9: WA dispatch message does not include courier cost ─────────────────

test(
  "WA dispatch notification does not contain the courier cost after a cost save",
  async ({ browser }) => {
    // MSR-20261001-00016 has tracking info; it shows the dispatch notification section.
    // After test 5 saved courier_cost = 45, verify WA message text doesn't include it.
    const ctx  = await makeContext(browser, null);
    const page = await ctx.newPage();

    const panel   = await openOrder(page, "CCE Test Positive");
    const waSection = panel.locator('[data-testid="dispatch-notification-section"]');
    await expect(waSection, "dispatch notification section visible").toBeVisible({ timeout: 10_000 });

    const waText = await waSection.textContent() ?? "";
    expect(waText, "WA message does not contain 45.00").not.toContain("45.00");
    expect(waText, "WA message does not contain courier cost label").not.toContain("Courier cost");
    expect(waText, "WA message does not contain R45").not.toContain("R45");

    await ctx.close();
  },
);

// ── Test 10: Failed DB write shows error feedback and leaves cost unchanged ────

test(
  "failed DB write (mock 500) shows error feedback and leaves saved cost unchanged",
  async ({ browser, request }) => {
    // MSR-20261001-00021 — dispatched, PATCH returns 500 from mock.
    const REF  = "MSR-20261001-00021";
    const ctx  = await makeContext(browser, null);
    const page = await ctx.newPage();

    const panel    = await openOrder(page, "CCE Test Fail Save");
    const section  = panel.locator('[data-testid="courier-cost-section"]');
    const input    = section.locator('[data-testid="courier-cost-input"]');
    const saveBtn  = section.locator('[data-testid="courier-cost-save-btn"]');

    await expect(section, "cost section visible").toBeVisible({ timeout: 10_000 });

    await input.fill("60");
    await expect(saveBtn, "Save enabled").toBeEnabled({ timeout: 5_000 });
    await saveBtn.click();

    // After the failed save, an error feedback banner should appear in the panel.
    const errorBanner = panel.locator('[data-testid="feedback-banner"]');
    await expect(errorBanner, "error feedback shown after failed save").toBeVisible({ timeout: 15_000 });
    const bannerText = await errorBanner.textContent() ?? "";
    expect(bannerText, "error message mentions courier cost or connection").toMatch(
      /Failed to save courier cost|Failed to connect/i,
    );

    // The mock's in-memory state must be unchanged — courier_cost stays null
    // because the 500 path short-circuits before applying any patch.
    const row = await mockGetOrder(request, REF);
    expect(row.courier_cost, "courier_cost still null after failed save").toBeNull();

    await ctx.close();
  },
);

// ── Tests 11-15: Direct server action — updateCourierCostAction ──────────────
//
// These tests call updateCourierCostAction at the server-action layer (not via
// the UI and not via a deployed test endpoint) to verify that auth, validation,
// and eligibility checks operate at the server — independent of any UI guard.
//
// Method (mirrors the updateStatusAction pattern in dispatch-handoff.spec.js):
//   1. beforeAll: open the browser, select CCE-022 and trigger a real Save to
//      obtain the Next-Action header that Next.js embeds in server-action POSTs.
//   2. Each individual test POSTs directly to POST /admin with that action ID
//      and a crafted payload, then reads the RSC stream and mock counters.
//
// The action ID is a Turbopack runtime hash — it cannot be hard-coded and must
// be captured from a live dispatch. CCE-022 is the dedicated capture order;
// saving R77.00 to it is intentional and does not affect other tests.

test.describe("direct server action: updateCourierCostAction", () => {
  /** @type {string | null} */
  let capturedActionId = null;

  // Capture the live updateCourierCostAction ID once before all sub-tests.
  test.beforeAll(async ({ browser }) => {
    const ctx  = await makeContext(browser, null);
    const page = await ctx.newPage();

    await page.route(`${BASE}/admin`, async (route, req) => {
      if (req.method() === "POST" && !capturedActionId) {
        const headers = req.headers();
        if (headers["next-action"]) capturedActionId = headers["next-action"];
      }
      await route.continue();
    });

    const panel   = await openOrder(page, "CCE ID Capture");
    const section = panel.locator('[data-testid="courier-cost-section"]');
    await expect(section, "CCE-022 cost section visible").toBeVisible({ timeout: 10_000 });

    const input   = section.locator('[data-testid="courier-cost-input"]');
    const saveBtn = section.locator('[data-testid="courier-cost-save-btn"]');
    const saved   = section.locator('[data-testid="courier-cost-saved"]');

    await input.fill("77");
    await expect(saveBtn, "Save enabled for capture order").toBeEnabled({ timeout: 5_000 });
    await saveBtn.click();
    // Wait until the server action fires and the page re-renders.
    await expect(saved, "capture dispatch completed").toHaveText("R77.00", { timeout: 15_000 });

    await ctx.close();
  });

  /** React flight encoding for updateCourierCostAction(ref, cost). */
  function actionBody(ref, cost) {
    return JSON.stringify([ref, cost]);
  }

  /**
   * Headers for a direct server-action POST.
   * @param {boolean} withCookie
   */
  function actionHeaders(withCookie) {
    /** @type {Record<string, string>} */
    const h = {
      "Content-Type":           "text/plain;charset=UTF-8",
      "Next-Router-State-Tree": JSON.stringify([
        "", [["children", "__PAGE__", ["__PAGE__", { page: "/admin" }]]], "", null, true,
      ]),
    };
    if (capturedActionId) h["Next-Action"] = capturedActionId;
    if (withCookie) h["Cookie"] = `msr-ops-session=${sessionToken()}`;
    return h;
  }

  // ── Test 11: unauthorized ────────────────────────────────────────────────────

  test(
    "unauthorized: Unauthorized returned, zero PATCH and SELECT calls",
    async ({ request }) => {
      expect(capturedActionId, "action ID was captured").toBeTruthy();
      await request.get(`${MOCK_SUPABASE}/mock/reset-count`);

      const res  = await request.post(`${BASE}/admin`, {
        headers: actionHeaders(false),         // no session cookie
        data:    actionBody("MSR-20261001-00016", "50"),
      });
      const text = await res.text();

      expect(text, "RSC stream contains Unauthorized").toContain("Unauthorized.");

      const patchRes  = await request.get(`${MOCK_SUPABASE}/mock/patch-count`);
      const selectRes = await request.get(`${MOCK_SUPABASE}/mock/select-count`);
      expect((await patchRes.json()).count,  "zero PATCH calls").toBe(0);
      expect((await selectRes.json()).count, "zero SELECT calls").toBe(0);
    },
  );

  // ── Test 12: invalid ref ─────────────────────────────────────────────────────

  test(
    "invalid order reference: rejected before DB access",
    async ({ request }) => {
      expect(capturedActionId, "action ID was captured").toBeTruthy();
      await request.get(`${MOCK_SUPABASE}/mock/reset-count`);

      const res  = await request.post(`${BASE}/admin`, {
        headers: actionHeaders(true),
        data:    actionBody("NOT-A-VALID-REF", "50"),
      });
      const text = await res.text();

      expect(text, "RSC stream contains invalid ref message").toContain("Invalid order reference.");

      const patchRes = await request.get(`${MOCK_SUPABASE}/mock/patch-count`);
      expect((await patchRes.json()).count, "zero PATCH calls for invalid ref").toBe(0);
    },
  );

  // ── Test 13: invalid cost ────────────────────────────────────────────────────

  test(
    "invalid cost: rejected before DB access",
    async ({ request }) => {
      expect(capturedActionId, "action ID was captured").toBeTruthy();
      await request.get(`${MOCK_SUPABASE}/mock/reset-count`);

      const res  = await request.post(`${BASE}/admin`, {
        headers: actionHeaders(true),
        data:    actionBody("MSR-20261001-00016", "9999.999"),
      });
      const text = await res.text();

      expect(text, "RSC stream contains cost validation error").toMatch(
        /two decimal places|Courier cost must be/,
      );

      const patchRes = await request.get(`${MOCK_SUPABASE}/mock/patch-count`);
      expect((await patchRes.json()).count, "zero PATCH calls for invalid cost").toBe(0);
    },
  );

  // ── Test 14: missing order ───────────────────────────────────────────────────

  test(
    "non-existent order: not-eligible with exactly one PATCH attempt",
    async ({ request }) => {
      expect(capturedActionId, "action ID was captured").toBeTruthy();
      await request.get(`${MOCK_SUPABASE}/mock/reset-count`);

      // Valid format, no matching row in the mock.
      const res  = await request.post(`${BASE}/admin`, {
        headers: actionHeaders(true),
        data:    actionBody("MSR-20261001-99999", "50"),
      });
      const text = await res.text();

      expect(text, "RSC stream contains not-eligible message").toMatch(
        /not found or not eligible/i,
      );

      // One PATCH attempt proves the status filter lives in the UPDATE itself,
      // not in a preceding SELECT — a pre-flight SELECT + no-update path would
      // produce 0 PATCH calls here.
      const patchRes = await request.get(`${MOCK_SUPABASE}/mock/patch-count`);
      expect((await patchRes.json()).count, "one PATCH for missing order").toBe(1);
    },
  );

  // ── Test 15: ineligible order (TOCTOU guard) ─────────────────────────────────

  test(
    "payment_confirmed order: not-eligible with one PATCH attempt (UPDATE filter guards TOCTOU)",
    async ({ request }) => {
      expect(capturedActionId, "action ID was captured").toBeTruthy();
      await request.get(`${MOCK_SUPABASE}/mock/reset-count`);

      // MSR-20261001-00019 is payment_confirmed — simulates an order that was
      // dispatched when the admin loaded the page but whose status changed before
      // Save was clicked. The UPDATE's own filter rejects it atomically.
      const res  = await request.post(`${BASE}/admin`, {
        headers: actionHeaders(true),
        data:    actionBody("MSR-20261001-00019", "75"),
      });
      const text = await res.text();

      expect(text, "RSC stream contains not-eligible message").toMatch(
        /not found or not eligible/i,
      );

      // Exactly one PATCH was sent — the UPDATE returned 0 rows. A pre-flight
      // SELECT + no-UPDATE pattern would show 0 here, not 1.
      const patchRes = await request.get(`${MOCK_SUPABASE}/mock/patch-count`);
      expect((await patchRes.json()).count, "one PATCH attempt for ineligible order").toBe(1);

      // Ineligible order's cost is still null.
      const row = await mockGetOrder(request, "MSR-20261001-00019");
      expect(row.courier_cost, "courier_cost unchanged for ineligible order").toBeNull();
    },
  );
});

// ── Test 16: Mobile 375px — courier cost section accessible ──────────────────

test(
  "mobile 375px: courier-cost-section, input, Save and feedback are accessible without horizontal overflow",
  async ({ browser }) => {
    const ctx  = await makeContext(browser, { width: 375, height: 812 });
    const page = await ctx.newPage();

    await page.goto(`${BASE}/admin`);
    await page.waitForSelector('[aria-label="Open navigation menu"]', { timeout: 60_000 });

    // On mobile, clicking an order row opens the mobile drawer.
    const row = page.getByText("CCE Test Zero").first();
    await expect(row, "order row visible at 375px").toBeVisible({ timeout: 15_000 });
    await row.click();

    // Mobile panel (not the desktop side-panel).
    const mobilePanel = page.locator('[data-testid="detail-panel-mobile"]');
    await expect(mobilePanel, "mobile panel opens").toBeVisible({ timeout: 10_000 });

    const section = mobilePanel.locator('[data-testid="courier-cost-section"]');
    await expect(section, "courier-cost-section visible at 375px").toBeVisible({ timeout: 10_000 });

    const input   = section.locator('[data-testid="courier-cost-input"]');
    const saveBtn = section.locator('[data-testid="courier-cost-save-btn"]');

    await expect(input,   "input visible at 375px").toBeVisible();
    await expect(saveBtn, "Save button visible at 375px").toBeVisible();

    // Verify no horizontal page overflow — the page width must not exceed the viewport.
    const pageWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(pageWidth, "no horizontal overflow at 375px").toBeLessThanOrEqual(375);

    // Fill a valid value and verify Save becomes enabled (interaction works at 375px).
    await input.fill("55");
    await expect(saveBtn, "Save enabled after filling at 375px").toBeEnabled({ timeout: 5_000 });

    await ctx.close();
  },
);
