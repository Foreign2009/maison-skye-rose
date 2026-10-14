/**
 * ADMIN-P1 — admin login and Sign Out session behaviour (mock Supabase, fictional secret).
 *
 *  1.  Unauthenticated /admin shows the login form, never the console
 *  2.  Wrong access code fails and issues no session cookie
 *  3.  Correct access code issues msr-ops-session (path /admin, HttpOnly) and opens the console
 *  4.  Sign Out removes the session cookie; /admin requires login again (revisit and refresh)
 *  5.  Browser Back after Sign Out does not restore access: a reload shows the login form
 *  6.  Sign Out leaves unrelated cookies (other names / other paths) untouched
 *  7.  After Sign Out, the previous browser session cannot save order notes (no DB write)
 *  8.  After Sign Out, the previous browser session cannot change an order's status (no DB write)
 *
 * ADMIN-P2 — privileged server actions verify the admin session themselves:
 *  P2-A  Replayed Confirm Payment / Cancel Order requests with no session: zero DB reads and writes
 *  P2-B  Replayed Save Notes request with no session: zero DB writes
 *  P2-D  Replays carrying an invalid session cookie: zero DB reads and writes
 *  P2-E  A valid session still saves notes
 *  P2-F  Cancel Order keeps its confirmation step; confirming cancels; the order then offers no actions
 *  P2-G  Confirm Payment is offered only inside an authenticated console
 *
 * Replays capture the browser's own server-action request (blocked before it reaches the server)
 * and resend it without the session — the same request an attacker would need.
 *
 * Run: npx playwright test --config scripts/pw-verify/playwright.admin-logout.config.ts
 */

const { test, expect, request } = require('@playwright/test');

const BASE        = 'http://localhost:3201';
const MOCK        = 'http://127.0.0.1:54322';
const SECRET      = 'nav-test-pw';            // fictional — matches start-focused.js
const SEARCH      = 'input[placeholder="Search by name, reference, or phone…"]';
const NOTES_ORDER = 'MSR-TEST-PWNTE-001';

const sessionCookie = async (ctx) => (await ctx.cookies(`${BASE}/admin`)).find((c) => c.name === 'msr-ops-session');

async function signIn(page, code = SECRET) {
  await page.goto(`${BASE}/admin`, { waitUntil: 'networkidle' });
  await page.locator('#admin-pass').fill(code);
  await page.getByRole('button', { name: 'Sign In' }).click();
  // The login server action redirects; wait for its outcome (console or error), not just network idle.
  await page.locator(SEARCH).or(page.getByText('Incorrect access code. Please try again.')).first().waitFor({ timeout: 60_000 });
}

async function signOut(page) {
  await page.getByRole('button', { name: 'Sign Out' }).first().click();
  await page.locator('#admin-pass').waitFor({ timeout: 60_000 }).catch(() => {});
  await page.waitForTimeout(500);
}

const consoleVisible = async (page) => (await page.locator(SEARCH).count()) > 0;
const loginVisible   = async (page) => (await page.locator('#admin-pass').count()) > 0;

const STATUS_ORDER = 'MSR-TEST-PWTEST-001';   // the mock order in awaiting_payment

const mockCounts = async () => ({
  writes: (await (await fetch(`${MOCK}/mock/patch-count`)).json()).count,
  reads:  (await (await fetch(`${MOCK}/mock/select-count`)).json()).count,
});
const resetCounts = () => fetch(`${MOCK}/mock/reset-count`).then((r) => r.json());

async function selectOrder(page, ref) {
  await page.locator(SEARCH).fill(ref);
  await page.waitForTimeout(500);
  await page.locator('button, li, [role="button"]').filter({ hasText: ref }).first().click();
  await page.waitForTimeout(500);
}

// Captures the server-action request a click produces, blocking it so it never reaches the server.
async function captureBlockedAction(page, bodyIncludes, trigger) {
  let cap = null;
  const handler = async (route) => {
    const r = route.request();
    const h = r.headers();
    if (r.method() === 'POST' && h['next-action'] && (r.postData() || '').includes(bodyIncludes)) {
      cap = { url: r.url(), body: r.postData(), headers: { 'next-action': h['next-action'], 'content-type': h['content-type'], accept: h['accept'] || 'text/x-component', 'next-router-state-tree': h['next-router-state-tree'] } };
      return route.abort();
    }
    return route.continue();
  };
  await page.route('**/admin**', handler);
  await trigger();
  await expect.poll(() => cap !== null, { timeout: 15_000 }).toBe(true);
  await page.unroute('**/admin**', handler);
  return cap;
}

// Resends a captured action from a fresh client: no cookies, or only the given Cookie header.
async function replay(cap, cookieHeader) {
  await resetCounts();
  const api = await request.newContext(cookieHeader ? { extraHTTPHeaders: { cookie: cookieHeader } } : {});
  const headers = Object.fromEntries(Object.entries(cap.headers).filter(([, v]) => v));
  const res = await api.post(cap.url, { headers, data: cap.body });
  const text = await res.text();
  await api.dispose();
  await new Promise((r) => setTimeout(r, 1500));
  return { status: res.status(), unauthorized: text.includes('Unauthorized'), ...(await mockCounts()) };
}

async function openPending(page, label) {
  await page.locator('button:visible', { hasText: new RegExp(`^${label}$`) }).first().click();
}

test.describe('Admin session — login and Sign Out', () => {
  test('1. unauthenticated /admin shows the login form only', async ({ page }) => {
    await page.goto(`${BASE}/admin`, { waitUntil: 'networkidle' });
    expect(await loginVisible(page)).toBe(true);
    expect(await consoleVisible(page)).toBe(false);
  });

  test('2. wrong access code fails and sets no session cookie', async ({ page, context }) => {
    await signIn(page, 'definitely-not-the-code');
    await expect(page.getByText('Incorrect access code. Please try again.')).toBeVisible();
    expect(await consoleVisible(page)).toBe(false);
    expect(!!(await sessionCookie(context)), 'no session cookie after a wrong code').toBe(false);
  });

  test('3. correct access code issues an HttpOnly /admin session and opens the console', async ({ page, context }) => {
    await signIn(page);
    const c = await sessionCookie(context);
    expect(c, 'session cookie issued').toBeTruthy();
    expect(c.path).toBe('/admin');
    expect(c.httpOnly).toBe(true);
    expect(await consoleVisible(page)).toBe(true);
  });

  test('4. Sign Out removes the session; revisit and refresh require login', async ({ page, context }) => {
    await signIn(page);
    expect(await consoleVisible(page)).toBe(true);
    await signOut(page);
    expect(!!(await sessionCookie(context)), 'session cookie removed by Sign Out').toBe(false);
    await page.goto(`${BASE}/admin`, { waitUntil: 'networkidle' });
    expect(await loginVisible(page)).toBe(true);
    expect(await consoleVisible(page)).toBe(false);
    await page.reload({ waitUntil: 'networkidle' });
    expect(await loginVisible(page)).toBe(true);
    expect(await consoleVisible(page)).toBe(false);
  });

  test('5. Back after Sign Out does not restore access once the page reloads', async ({ page }) => {
    await signIn(page);
    await page.goto(`${BASE}/admin?view=after-login`, { waitUntil: 'networkidle' });
    await signOut(page);
    await page.goBack({ waitUntil: 'networkidle' }).catch(() => {});
    await page.reload({ waitUntil: 'networkidle' });
    expect(await loginVisible(page)).toBe(true);
    expect(await consoleVisible(page)).toBe(false);
  });

  test('6. Sign Out leaves unrelated cookies untouched', async ({ page, context }) => {
    await context.addCookies([
      { name: 'msr_receipt_MSR-20260101-00001', value: 'unrelated-receipt', domain: 'localhost', path: '/', httpOnly: true, sameSite: 'Strict' },
      { name: 'unrelated-admin-pref', value: 'keep-me', domain: 'localhost', path: '/admin', sameSite: 'Lax' },
    ]);
    await signIn(page);
    await signOut(page);
    const names = (await context.cookies(`${BASE}/admin`)).map((c) => c.name).concat((await context.cookies(BASE)).map((c) => c.name));
    expect(names).toContain('msr_receipt_MSR-20260101-00001');
    expect(names).toContain('unrelated-admin-pref');
    expect(names).not.toContain('msr-ops-session');
  });

  test('7. after Sign Out the previous browser session cannot save order notes', async ({ page }) => {
    await signIn(page);
    await page.locator(SEARCH).fill(NOTES_ORDER);
    await page.waitForTimeout(500);
    await page.locator('button, li, [role="button"]').filter({ hasText: NOTES_ORDER }).first().click();
    // The console renders desktop and mobile detail panels; use the visible one.
    const notes = page.locator('textarea[placeholder="Private notes about this order…"]:visible').first();
    await expect(notes).toBeVisible();

    // A second tab of the same browser signs out; the first tab still shows the console.
    const other = await page.context().newPage();
    await other.goto(`${BASE}/admin`, { waitUntil: 'networkidle' });
    await signOut(other);
    await other.close();

    await (await fetch(`${MOCK}/mock/reset-count`)).json();
    await notes.fill('ADMIN-P1 post-logout write attempt');
    await page.locator('button:visible', { hasText: /^Save Notes$/ }).first().click();
    await page.waitForTimeout(2500);
    const { count } = await (await fetch(`${MOCK}/mock/patch-count`)).json();
    expect(count, 'no order write after Sign Out').toBe(0);
  });

  test('8. after Sign Out the previous browser session cannot change an order status', async ({ page }) => {
    await signIn(page);
    await selectOrder(page, STATUS_ORDER);
    const other = await page.context().newPage();
    await other.goto(`${BASE}/admin`, { waitUntil: 'networkidle' });
    await signOut(other);
    await other.close();

    await resetCounts();
    await openPending(page, 'Cancel Order');
    await page.locator('button:visible', { hasText: /^Confirm$/ }).first().click();
    await page.waitForTimeout(2500);
    expect((await mockCounts()).writes, 'no status write after Sign Out').toBe(0);
    const row = (await (await fetch(`${MOCK}/rest/v1/orders?order_ref=eq.${STATUS_ORDER}`)).json())[0];
    expect(row.payment_status).toBe('awaiting_payment');
  });
});

test.describe('ADMIN-P2 — privileged server actions require an admin session', () => {
  test('P2-A / P2-D: Confirm Payment and Cancel Order replays without a valid session do nothing', async ({ page }) => {
    await signIn(page);
    await selectOrder(page, STATUS_ORDER);
    await openPending(page, 'Confirm Payment');
    const confirmPayment = await captureBlockedAction(page, 'payment_confirmed',
      () => page.locator('button:visible', { hasText: /^Confirm$/ }).first().click());

    await page.reload({ waitUntil: 'networkidle' });
    await selectOrder(page, STATUS_ORDER);
    await openPending(page, 'Cancel Order');
    const cancelOrder = await captureBlockedAction(page, 'cancelled',
      () => page.locator('button:visible', { hasText: /^Confirm$/ }).first().click());

    for (const [name, cap] of [['Confirm Payment', confirmPayment], ['Cancel Order', cancelOrder]]) {
      for (const [label, cookie] of [['no cookie', null], ['invalid cookie', 'msr-ops-session=not-a-valid-session'], ['wrong-secret token', 'msr-ops-session=0000000000000000000000000000000000000000000000000000000000000000']]) {
        const r = await replay(cap, cookie);
        expect(r.writes, `${name} (${label}): DB writes`).toBe(0);
        expect(r.reads, `${name} (${label}): DB reads`).toBe(0);
        expect(r.unauthorized, `${name} (${label}): Unauthorized response`).toBe(true);
      }
    }
    const row = (await (await fetch(`${MOCK}/rest/v1/orders?order_ref=eq.${STATUS_ORDER}`)).json())[0];
    expect(row.payment_status, 'order untouched by every replay').toBe('awaiting_payment');
  });

  test('P2-B / P2-D: Save Notes replays without a valid session do nothing', async ({ page }) => {
    await signIn(page);
    await selectOrder(page, NOTES_ORDER);
    await page.locator('textarea[placeholder="Private notes about this order…"]:visible').first().fill('ADMIN-P2 replay probe');
    const saveNotes = await captureBlockedAction(page, 'ADMIN-P2 replay probe',
      () => page.locator('button:visible', { hasText: /^Save Notes$/ }).first().click());
    for (const [label, cookie] of [['no cookie', null], ['invalid cookie', 'msr-ops-session=not-a-valid-session']]) {
      const r = await replay(saveNotes, cookie);
      expect(r.writes, `Save Notes (${label}): DB writes`).toBe(0);
      expect(r.unauthorized, `Save Notes (${label}): Unauthorized response`).toBe(true);
    }
  });

  test('P2-G: Confirm Payment is offered only inside an authenticated console', async ({ page, browser }) => {
    const anon = await (await browser.newContext()).newPage();
    await anon.goto(`${BASE}/admin`, { waitUntil: 'networkidle' });
    expect(await anon.locator('button', { hasText: /^Confirm Payment$/ }).count()).toBe(0);
    expect(await loginVisible(anon)).toBe(true);
    await anon.context().close();

    await signIn(page);
    await selectOrder(page, STATUS_ORDER);
    await expect(page.locator('button:visible', { hasText: /^Confirm Payment$/ }).first()).toBeVisible();
    await expect(page.locator('button:visible', { hasText: /^Cancel Order$/ }).first()).toBeVisible();
  });

  test('P2-E: a valid session still saves order notes', async ({ page }) => {
    await signIn(page);
    await selectOrder(page, NOTES_ORDER);
    await resetCounts();
    await page.locator('textarea[placeholder="Private notes about this order…"]:visible').first().fill('ADMIN-P2 authorised note');
    await page.locator('button:visible', { hasText: /^Save Notes$/ }).first().click();
    await expect.poll(async () => (await mockCounts()).writes, { timeout: 15_000 }).toBeGreaterThan(0);
  });

  test('P2-F: Cancel Order keeps its confirmation step and still works for an admin', async ({ page }) => {
    await signIn(page);
    await selectOrder(page, STATUS_ORDER);
    await resetCounts();
    await openPending(page, 'Cancel Order');
    await expect(page.locator('button:visible', { hasText: /^Confirm$/ }).first()).toBeVisible();
    await page.locator('button:visible', { hasText: /^Cancel$/ }).first().click();   // dismiss the confirmation
    await page.waitForTimeout(1000);
    expect((await mockCounts()).writes, 'dismissing the confirmation writes nothing').toBe(0);

    await openPending(page, 'Cancel Order');
    await page.locator('button:visible', { hasText: /^Confirm$/ }).first().click();
    await expect.poll(async () => (await mockCounts()).writes, { timeout: 15_000 }).toBeGreaterThan(0);
    const row = (await (await fetch(`${MOCK}/rest/v1/orders?order_ref=eq.${STATUS_ORDER}`)).json())[0];
    expect(row.payment_status).toBe('cancelled');

    await page.reload({ waitUntil: 'networkidle' });
    await selectOrder(page, STATUS_ORDER);
    expect(await page.locator('button:visible', { hasText: /^(Confirm Payment|Cancel Order)$/ }).count(), 'cancelled order offers no further actions').toBe(0);
  });
});
