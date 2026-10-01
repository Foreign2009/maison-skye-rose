// @ts-check
/**
 * Admin-notes regression — targeted coverage for fix/preserve-admin-notes.
 *
 * Verifies that:
 *   1. A status-transition PATCH does not overwrite orders.notes.
 *   2. The transition note is stored in status_history and survives reload.
 *   3. updateNotesAction writes orders.notes without touching status_history.
 *   4. The customer receipt GET response contains no notes field.
 *   5. The WA dispatch draft does not contain the admin note text.
 *
 * Uses synthetic orders MSR-TEST-PWNTE-001 and MSR-TEST-PWNTE-002 seeded in
 * mock-supabase.js. No production connections or writes are made.
 *
 * Tests 1–3 are executed. Tests 4–5 combine executed assertions with code
 * inspection; those sections are labelled accordingly.
 */

const { test, expect } = require("@playwright/test");
const { createHash }   = require("crypto");

const BASE          = "http://localhost:3201";
const MOCK_SUPABASE = "http://localhost:54322";
const ADMIN_TOKEN   = "nav-test-pw";

// ── Helpers ───────────────────────────────────────────────────────────────────

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

/**
 * Direct PATCH to the Next.js API — bypasses the UI.
 * @param {import("@playwright/test").APIRequestContext} req
 * @param {string} ref
 * @param {Record<string, unknown>} body
 */
function apiPatch(req, ref, body) {
  return req.patch(`${BASE}/api/orders/${encodeURIComponent(ref)}`, {
    headers: {
      "Authorization": `Bearer ${ADMIN_TOKEN}`,
      "Content-Type":  "application/json",
    },
    data: body,
  });
}

/**
 * Reads one order from the mock Supabase by ref.
 * Returns the raw DB row reflecting current in-memory patch state.
 * @param {import("@playwright/test").APIRequestContext} req
 * @param {string} ref
 */
async function mockGetOrder(req, ref) {
  const res = await req.get(
    `${MOCK_SUPABASE}/rest/v1/orders?order_ref=eq.${encodeURIComponent(ref)}&limit=1`
  );
  const rows = await res.json();
  return rows[0] ?? null;
}

// ── Test 1 + 2: status transition preserves orders.notes; note lands in status_history ───

test(
  "status-transition PATCH does not overwrite orders.notes; transition note stored in status_history",
  async ({ request }) => {
    const REF           = "MSR-TEST-PWNTE-001";
    const ORIGINAL_NOTE = "Pre-existing admin note — must survive dispatch";
    const TRANSITION    = "Dispatching — transition note only";

    // Confirm seed state: notes present, processing.
    const before = await mockGetOrder(request, REF);
    expect(before, "order found in mock").not.toBeNull();
    expect(before.notes,          "seed: notes intact before PATCH").toBe(ORIGINAL_NOTE);
    expect(before.payment_status, "seed: status is processing").toBe("processing");
    const historyLenBefore = before.status_history.length;

    // PATCH via Next.js API with a transition note.
    const patchRes = await apiPatch(request, REF, {
      status:          "dispatched",
      note:            TRANSITION,
      tracking_number: "PN-NOTES-001",
      courier_name:    "PostNet",
      tracking_url:    "https://www.postnet.co.za/tracker",
    });
    expect(patchRes.status(), "PATCH returns 200").toBe(200);
    const patchBody = await patchRes.json();
    expect(patchBody.success, "PATCH success").toBe(true);

    // Re-fetch from mock: orders.notes must be unchanged.
    const after = await mockGetOrder(request, REF);
    expect(after.notes, "orders.notes unchanged after status transition").toBe(ORIGINAL_NOTE);

    // status_history must have grown by exactly one entry.
    expect(
      after.status_history.length,
      "status_history grew by 1"
    ).toBe(historyLenBefore + 1);

    // The new entry must carry the transition note.
    const lastEntry = after.status_history[after.status_history.length - 1];
    expect(lastEntry.status, "new entry: status = dispatched").toBe("dispatched");
    expect(lastEntry.note,   "new entry: note = transition note text").toBe(TRANSITION);
  }
);

// ── Test 3: updateNotesAction saves orders.notes and does not touch status_history ───

test(
  "updateNotesAction saves orders.notes without modifying status_history",
  async ({ browser }) => {
    const REF        = "MSR-TEST-PWNTE-002";
    const SAVED_NOTE = "Admin sticky note saved via UI";

    const ctx  = await makeContext(browser, { width: 1280, height: 800 });
    const page = await ctx.newPage();

    // Navigate to admin.
    await page.goto(`${BASE}/admin`);
    await page.waitForSelector('[aria-label="Open navigation menu"]', { timeout: 60_000 });

    // Select the PWNTE-002 order.
    const orderRow = page.getByText("Notes Test Edit").first();
    await expect(orderRow, "order row visible").toBeVisible({ timeout: 15_000 });
    await orderRow.click();

    // Identify the detail panel (desktop).
    const panel = page.locator('[data-testid="detail-panel-desktop"]');
    await expect(panel, "detail panel visible").toBeVisible({ timeout: 10_000 });

    // Record status_history entry count before saving the note (from the Timeline section).
    const timelineEntries = panel.locator(".mt-3.space-y-3 > div");
    const historyCountBefore = await timelineEntries.count();
    expect(historyCountBefore, "status_history has 3 entries before note save").toBe(3);

    // Find the notes textarea and type a note.
    const textarea = panel.locator('textarea[placeholder="Private notes about this order…"]');
    await expect(textarea, "notes textarea visible").toBeVisible();
    await textarea.fill(SAVED_NOTE);

    // Click Save Notes.
    const saveBtn = panel.getByRole("button", { name: "Save Notes" });
    await expect(saveBtn, "Save Notes button enabled").toBeEnabled({ timeout: 5_000 });
    await saveBtn.click();

    // Wait for the success state (button returns to disabled = no pending changes).
    await expect(saveBtn, "Save Notes button disabled after save").toBeDisabled({ timeout: 10_000 });

    // Reload and re-select the order to simulate a full page reload.
    await page.reload();
    await page.waitForSelector('[aria-label="Open navigation menu"]', { timeout: 60_000 });

    const orderRowAfter = page.getByText("Notes Test Edit").first();
    await expect(orderRowAfter, "order row visible after reload").toBeVisible({ timeout: 15_000 });
    await orderRowAfter.click();

    const panelAfter = page.locator('[data-testid="detail-panel-desktop"]');
    await expect(panelAfter, "detail panel visible after reload").toBeVisible({ timeout: 10_000 });

    // The textarea must contain the saved note.
    const textareaAfter = panelAfter.locator('textarea[placeholder="Private notes about this order…"]');
    await expect(textareaAfter, "textarea shows saved note after reload").toHaveValue(SAVED_NOTE);

    // status_history entry count must be unchanged.
    const timelineEntriesAfter = panelAfter.locator(".mt-3.space-y-3 > div");
    const historyCountAfter = await timelineEntriesAfter.count();
    expect(historyCountAfter, "status_history unchanged after note save").toBe(historyCountBefore);

    await ctx.close();
  }
);

// ── Test 4: customer receipt GET excludes notes (executed + code inspection) ───

test(
  "customer receipt GET returns 401 without a valid receipt cookie and exposes no notes field",
  async ({ request }) => {
    // MSR-TEST-PWNTE-001 does not match the route's REF_FORMAT (/^MSR-\d{8}-\d{5}$/)
    // so the handler returns 400 before checking the cookie.
    // A valid-format ref with no cookie reaches the token check and returns 401.
    // Use MSR-20260101-00001 (valid format, non-existent in mock) to reach the
    // 401 path and confirm the error body exposes no notes or status_history.
    const res = await request.get(`${BASE}/api/orders/MSR-20260101-00001`);
    expect(res.status(), "unauthenticated receipt GET returns 401").toBe(401);
    const body = await res.json();
    expect(body).not.toHaveProperty("notes",          "notes absent from 401 response");
    expect(body).not.toHaveProperty("status_history", "status_history absent from 401 response");

    // Code inspection: the authenticated path at route.ts:320–325 returns only
    // { orderRef, total, paymentStatus, province }. Neither orders.notes nor
    // status_history is included in that response object.
    // This is verified by inspection; no runtime assertion is possible here
    // without a valid signed receipt token.
  }
);

// ── Test 5: WA dispatch draft does not contain admin note text ────────────────
// PWNTE-001 was dispatched in test 1. Its WA notification section should be
// visible. The admin note text must not appear in the assembled WA message.

test(
  "WA dispatch notification does not contain admin note text or transition note",
  async ({ browser }) => {
    const REF           = "MSR-TEST-PWNTE-001";
    const ORIGINAL_NOTE = "Pre-existing admin note — must survive dispatch";
    const TRANSITION    = "Dispatching — transition note only";

    const ctx  = await makeContext(browser, { width: 1280, height: 800 });
    const page = await ctx.newPage();

    await page.goto(`${BASE}/admin`);
    await page.waitForSelector('[aria-label="Open navigation menu"]', { timeout: 60_000 });

    // Select PWNTE-001 (now dispatched from test 1).
    const orderRow = page.getByText("Notes Test Dispatch").first();
    await expect(orderRow, "order row visible").toBeVisible({ timeout: 15_000 });
    await orderRow.click();

    const panel = page.locator('[data-testid="detail-panel-desktop"]');
    await expect(panel, "detail panel visible").toBeVisible({ timeout: 10_000 });

    // The WA notification section is visible for dispatched orders.
    const waSection = panel.locator('[data-testid="dispatch-notification-section"]');
    await expect(waSection, "WA notification section visible for dispatched order").toBeVisible({ timeout: 10_000 });

    // The assembled WA message must not contain either note string.
    const waSectionText = await waSection.textContent();
    expect(
      waSectionText,
      "WA draft does not contain the pre-existing admin note"
    ).not.toContain(ORIGINAL_NOTE);
    expect(
      waSectionText,
      "WA draft does not contain the transition note"
    ).not.toContain(TRANSITION);

    await ctx.close();
  }
);
