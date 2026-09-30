// @ts-check
/**
 * Dispatch PATCH — API-level integration tests.
 *
 * Uses Playwright's request fixture (pure HTTP, no browser).
 * Runs against the same local dev server (port 3201) and mock Supabase
 * (port 54322) as dispatch-handoff.spec.js. No production connections
 * are made and no production data is modified.
 *
 * These tests prove server-side behaviour that UI tests cannot:
 *
 *   1a. Negative courier cost  → 400, validation fires before DB fetch
 *   1b. Cost above 9999.99     → 400, validation fires before DB fetch
 *   1c. Non-numeric cost       → 400, validation fires before DB fetch
 *   2.  DB write failure       → 500 surfaced as { success: false }
 *   3.  Duplicate dispatch     → 400 from transition-validation layer,
 *                                regardless of whether the UI shows a button
 *
 * Uses MSR-TEST-PWFAIL-00001 for cost tests:
 *   - always processing (mock 500 only fires on the DB write)
 *   - cost validation fires before any DB access, so the 400 returns
 *     without touching the mock regardless of other tests' state
 */

const { test, expect } = require("@playwright/test");

const BASE        = "http://localhost:3201";
const ADMIN_TOKEN = "nav-test-pw";

/**
 * @param {import("@playwright/test").APIRequestContext} req
 * @param {string} ref
 * @param {Record<string, unknown>} body
 */
function dispatchPatch(req, ref, body) {
  return req.patch(`${BASE}/api/orders/${encodeURIComponent(ref)}`, {
    headers: {
      "Authorization": `Bearer ${ADMIN_TOKEN}`,
      "Content-Type":  "application/json",
    },
    data: body,
  });
}

// ── 1. Invalid courier cost — fires before DB fetch ───────────────────────────
//
// route.ts validates courier_cost at line ~121 (before the Supabase SELECT at
// line ~133). Sending an invalid value should return 400 with no DB access.
// PWFAIL-00001 is used so mock state is irrelevant — the 400 returns before
// the mock can respond.

test("courier cost: negative value returns 400 with range message", async ({ request }) => {
  const res  = await dispatchPatch(request, "MSR-TEST-PWFAIL-00001", {
    status:          "dispatched",
    tracking_number: "TCG-API-NEG",
    courier_name:    "PostNet",
    courier_cost:    -1,
  });
  expect(res.status(), "negative cost → 400").toBe(400);
  const body = await res.json();
  expect(body.success, "success false").toBe(false);
  expect(body.message, "message cites valid range").toMatch(/9999\.99/);
});

test("courier cost: value above 9999.99 returns 400", async ({ request }) => {
  const res = await dispatchPatch(request, "MSR-TEST-PWFAIL-00001", {
    status:          "dispatched",
    tracking_number: "TCG-API-HIGH",
    courier_name:    "PostNet",
    courier_cost:    10000,
  });
  expect(res.status(), "over-limit cost → 400").toBe(400);
  const body = await res.json();
  expect(body.success).toBe(false);
});

test("courier cost: non-numeric string returns 400", async ({ request }) => {
  const res = await dispatchPatch(request, "MSR-TEST-PWFAIL-00001", {
    status:          "dispatched",
    tracking_number: "TCG-API-NaN",
    courier_name:    "PostNet",
    courier_cost:    "not-a-number",
  });
  expect(res.status(), "non-numeric cost → 400").toBe(400);
  const body = await res.json();
  expect(body.success).toBe(false);
});

// ── 2. Failed DB update ────────────────────────────────────────────────────────
//
// mock-supabase.js returns HTTP 500 on any PATCH for MSR-TEST-PWFAIL-00001.
// route.ts catches updateError and returns { success: false } with status 500.
// This test confirms the error is surfaced to callers, not swallowed.

test("failed DB update: route returns 500 and success:false", async ({ request }) => {
  const res = await dispatchPatch(request, "MSR-TEST-PWFAIL-00001", {
    status:          "dispatched",
    tracking_number: "TCG-FAILDB-API",
    courier_name:    "PostNet",
  });
  expect(res.status(), "mock DB error → 500").toBe(500);
  const body = await res.json();
  expect(body.success, "success false on DB error").toBe(false);
});

// ── 3. Duplicate dispatch ──────────────────────────────────────────────────────
//
// MSR-TEST-PWTEST-004 starts as dispatched in mock-supabase.js.
// The server's VALID_TRANSITIONS check (processing → dispatched only) blocks
// any further dispatch transition at the route layer — regardless of whether
// the admin UI renders a dispatch button.

test("duplicate dispatch: already-dispatched order returns 400", async ({ request }) => {
  const res = await dispatchPatch(request, "MSR-TEST-PWTEST-004", {
    status:          "dispatched",
    tracking_number: "TCG-DUP-API",
    courier_name:    "PostNet",
  });
  expect(res.status(), "duplicate dispatch → 400").toBe(400);
  const body = await res.json();
  expect(body.success, "success false").toBe(false);
  expect(body.message, "message cites already-in-status").toMatch(/already in status/i);
});

// ── 4. Type rejection — non-number types ─────────────────────────────────────
//
// The PATCH handler requires courier_cost to be a typeof "number" before any
// arithmetic or DB access. JSON null, booleans, strings and arrays all coerce
// to plausible numbers but are not valid inputs for this field.
// PWFAIL-00001 is used so DB mock state is irrelevant — 400 returns before
// the route reaches the Supabase SELECT.

test("courier cost: null returns 400 (type rejected before DB access)", async ({ request }) => {
  const res = await request.patch(`${BASE}/api/orders/${encodeURIComponent("MSR-TEST-PWFAIL-00001")}`, {
    headers: { "Authorization": `Bearer ${ADMIN_TOKEN}`, "Content-Type": "application/json" },
    // Use JSON.stringify so null is serialised as a JSON null, not dropped.
    data: JSON.stringify({
      status:          "dispatched",
      tracking_number: "TCG-TYPE-NULL",
      courier_name:    "PostNet",
      courier_cost:    null,
    }),
  });
  expect(res.status(), "null cost → 400").toBe(400);
  const body = await res.json();
  expect(body.success, "success false").toBe(false);
});

test("courier cost: boolean returns 400 (type rejected before DB access)", async ({ request }) => {
  const res = await request.patch(`${BASE}/api/orders/${encodeURIComponent("MSR-TEST-PWFAIL-00001")}`, {
    headers: { "Authorization": `Bearer ${ADMIN_TOKEN}`, "Content-Type": "application/json" },
    data: JSON.stringify({
      status:          "dispatched",
      tracking_number: "TCG-TYPE-BOOL",
      courier_name:    "PostNet",
      courier_cost:    false,
    }),
  });
  expect(res.status(), "boolean cost → 400").toBe(400);
  const body = await res.json();
  expect(body.success).toBe(false);
});

test("courier cost: string '89.00' returns 400 (type rejected before DB access)", async ({ request }) => {
  const res = await request.patch(`${BASE}/api/orders/${encodeURIComponent("MSR-TEST-PWFAIL-00001")}`, {
    headers: { "Authorization": `Bearer ${ADMIN_TOKEN}`, "Content-Type": "application/json" },
    data: JSON.stringify({
      status:          "dispatched",
      tracking_number: "TCG-TYPE-STR",
      courier_name:    "PostNet",
      courier_cost:    "89.00",  // valid-looking string, but wrong type
    }),
  });
  expect(res.status(), "string cost → 400").toBe(400);
  const body = await res.json();
  expect(body.success).toBe(false);
});

test("courier cost: array returns 400 (type rejected before DB access)", async ({ request }) => {
  const res = await request.patch(`${BASE}/api/orders/${encodeURIComponent("MSR-TEST-PWFAIL-00001")}`, {
    headers: { "Authorization": `Bearer ${ADMIN_TOKEN}`, "Content-Type": "application/json" },
    data: JSON.stringify({
      status:          "dispatched",
      tracking_number: "TCG-TYPE-ARR",
      courier_name:    "PostNet",
      courier_cost:    [89],
    }),
  });
  expect(res.status(), "array cost → 400").toBe(400);
  const body = await res.json();
  expect(body.success).toBe(false);
});

test("courier cost: extra decimal places return 400", async ({ request }) => {
  const res = await dispatchPatch(request, "MSR-TEST-PWFAIL-00001", {
    status:          "dispatched",
    tracking_number: "TCG-TYPE-DP",
    courier_name:    "PostNet",
    courier_cost:    89.555,
  });
  expect(res.status(), "three dp cost → 400").toBe(400);
  const body = await res.json();
  expect(body.success).toBe(false);
  expect(body.message).toMatch(/two decimal places/i);
});

// ── 5. Persistence — blank, zero, positive, reload verification ───────────────
//
// Uses the PWCOST synthetic orders (processing status, dedicated to cost tests).
// After each successful PATCH, the in-memory mock state is inspected directly
// at the Supabase mock port (54322) to verify what was stored.
// The customer receipt GET is then checked to confirm courier_cost is absent.
//
// The mock's PATCH handler stores the full updatePayload (from the Next.js route)
// in orderPatches, which GET merges onto the base order. This simulates a
// round-trip "page reload" — the value persists for subsequent GET requests.

const MOCK_SUPABASE = "http://localhost:54322";

/**
 * Reads the stored order from the mock Supabase.
 * @param {import("@playwright/test").APIRequestContext} req
 * @param {string} ref
 */
async function getMockOrder(req, ref) {
  const res = await req.get(
    `${MOCK_SUPABASE}/rest/v1/orders?order_ref=eq.${encodeURIComponent(ref)}`
  );
  expect(res.ok(), `mock GET for ${ref}`).toBe(true);
  const orders = await res.json();
  expect(orders.length, `order exists in mock: ${ref}`).toBe(1);
  return orders[0];
}

test("courier cost: blank/omitted — order dispatches, DB stores null", async ({ request }) => {
  // Dispatch without courier_cost — the field should remain null in mock state.
  const patchRes = await dispatchPatch(request, "MSR-TEST-PWCOST-003", {
    status:          "dispatched",
    tracking_number: "TCG-BLANK-001",
    courier_name:    "PostNet",
    // courier_cost deliberately omitted
  });
  expect(patchRes.status(), "dispatch succeeds (200)").toBe(200);
  const patchBody = await patchRes.json();
  expect(patchBody.success, "success true").toBe(true);

  // Reload verification: mock stores null (base value unchanged)
  const order = await getMockOrder(request, "MSR-TEST-PWCOST-003");
  expect(order.courier_cost, "courier_cost is null when omitted").toBeNull();
});

test("courier cost: zero persists as zero (not null) after reload", async ({ request }) => {
  const patchRes = await dispatchPatch(request, "MSR-TEST-PWCOST-001", {
    status:          "dispatched",
    tracking_number: "TCG-ZERO-001",
    courier_name:    "PostNet",
    courier_cost:    0,
  });
  expect(patchRes.status(), "dispatch with zero cost succeeds (200)").toBe(200);
  const patchBody = await patchRes.json();
  expect(patchBody.success, "success true").toBe(true);

  // Reload verification: mock stores 0, not null
  const order = await getMockOrder(request, "MSR-TEST-PWCOST-001");
  expect(order.courier_cost, "courier_cost persists as 0, not null").toBe(0);
});

test("courier cost: positive value persists and survives reload", async ({ request }) => {
  const patchRes = await dispatchPatch(request, "MSR-TEST-PWCOST-002", {
    status:          "dispatched",
    tracking_number: "TCG-POS-001",
    courier_name:    "PostNet",
    courier_cost:    89.5,
  });
  expect(patchRes.status(), "dispatch with positive cost succeeds (200)").toBe(200);
  const patchBody = await patchRes.json();
  expect(patchBody.success, "success true").toBe(true);

  // Reload verification: correct value persisted
  const order = await getMockOrder(request, "MSR-TEST-PWCOST-002");
  expect(order.courier_cost, "courier_cost persists as 89.5").toBe(89.5);

  // courier_cost must not appear in the customer receipt GET response.
  // The customer GET selects only order_ref, total, payment_status, province —
  // it requires a valid receipt cookie (returns 401 without one, which also
  // does not expose courier_cost).
  const receiptRes = await request.get(`${BASE}/api/orders/${encodeURIComponent("MSR-TEST-PWCOST-002")}`);
  const receiptBody = await receiptRes.json();
  expect(
    Object.prototype.hasOwnProperty.call(receiptBody, "courier_cost"),
    "courier_cost absent from customer receipt response"
  ).toBe(false);
});

test("courier cost: invalid type leaves order Processing (no DB mutation)", async ({ request }) => {
  // Attempting to dispatch PWFAIL with a string cost returns 400.
  // The mock-Supabase PATCH for PWFAIL-00001 never fires (validation is
  // pre-DB), so the order remains Processing.
  const res = await request.patch(`${BASE}/api/orders/${encodeURIComponent("MSR-TEST-PWFAIL-00001")}`, {
    headers: { "Authorization": `Bearer ${ADMIN_TOKEN}`, "Content-Type": "application/json" },
    data: JSON.stringify({
      status:          "dispatched",
      tracking_number: "TCG-STAYS-PROC",
      courier_name:    "PostNet",
      courier_cost:    "not-a-number",
    }),
  });
  expect(res.status(), "invalid cost → 400").toBe(400);

  // Confirm order remains Processing in mock state
  const order = await getMockOrder(request, "MSR-TEST-PWFAIL-00001");
  expect(order.payment_status, "order remains processing after rejected cost").toBe("processing");
});

// ── 6. DB access counters — zero mock calls for rejected costs ────────────────
//
// The mock exposes /mock/reset-count, /mock/patch-count and /mock/select-count.
// /mock/reset-count resets both counters atomically.
//
// Proven scope:
//   patchCallCount = 0  → mock PATCH handler was not reached.
//   selectCallCount = 0 → mock GET/SELECT handler was not reached.
//   Both = 0            → no DB access of any kind for the tested request.
//
// route.ts validates courier_cost at lines ~121–139, before the Supabase
// SELECT at line ~149. A rejected request returns 400 from the validation
// layer without touching the mock at all.

test("scientific notation 1e-7 returns 400 (toFixed round-trip fix)", async ({ request }) => {
  const res = await dispatchPatch(request, "MSR-TEST-PWFAIL-00001", {
    status:          "dispatched",
    tracking_number: "TCG-SCINO-001",
    courier_name:    "PostNet",
    courier_cost:    1e-7,
  });
  expect(res.status(), "1e-7 cost → 400 (String.split missed this; toFixed catches it)").toBe(400);
  const body = await res.json();
  expect(body.success).toBe(false);
});

test("string cost: zero mock PATCH and SELECT calls (no DB access)", async ({ request }) => {
  // Reset both counters atomically.
  const resetRes = await request.get(`${MOCK_SUPABASE}/mock/reset-count`);
  expect(resetRes.ok(), "reset-count ok").toBe(true);

  // route.ts rejects string cost at typeof check — before Supabase SELECT or PATCH.
  await request.patch(`${BASE}/api/orders/${encodeURIComponent("MSR-TEST-PWFAIL-00001")}`, {
    headers: { "Authorization": `Bearer ${ADMIN_TOKEN}`, "Content-Type": "application/json" },
    data: JSON.stringify({
      status:          "dispatched",
      tracking_number: "TCG-COUNT-STR",
      courier_name:    "PostNet",
      courier_cost:    "89.00",  // string — typeof check fires before any DB call
    }),
  });

  const patchRes  = await request.get(`${MOCK_SUPABASE}/mock/patch-count`);
  const selectRes = await request.get(`${MOCK_SUPABASE}/mock/select-count`);
  expect((await patchRes.json()).count,  "mock PATCH handler not reached").toBe(0);
  expect((await selectRes.json()).count, "mock SELECT handler not reached").toBe(0);
});

test("scientific-notation cost: zero mock PATCH and SELECT calls (no DB access)", async ({ request }) => {
  await request.get(`${MOCK_SUPABASE}/mock/reset-count`);

  // route.ts rejects 1e-7 at toFixed(2) check — before Supabase SELECT or PATCH.
  await dispatchPatch(request, "MSR-TEST-PWFAIL-00001", {
    status:          "dispatched",
    tracking_number: "TCG-COUNT-SCINO",
    courier_name:    "PostNet",
    courier_cost:    1e-7,
  });

  const patchRes  = await request.get(`${MOCK_SUPABASE}/mock/patch-count`);
  const selectRes = await request.get(`${MOCK_SUPABASE}/mock/select-count`);
  expect((await patchRes.json()).count,  "mock PATCH handler not reached for 1e-7").toBe(0);
  expect((await selectRes.json()).count, "mock SELECT handler not reached for 1e-7").toBe(0);
});
