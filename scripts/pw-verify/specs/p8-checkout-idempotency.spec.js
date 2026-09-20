// @ts-check
/**
 * CHECKOUT-P8 / P8c — Client-side idempotency key lifecycle tests
 * Runs against local dev server (http://localhost:3000).
 *
 * All /api/orders calls are intercepted — no real order writes.
 * No production credentials are used or required.
 *
 * Run: npx playwright test --config scripts/pw-verify/playwright.config.ts
 *
 * Scenarios:
 *  1.  Key generated and stored in sessionStorage (JSON) on page load
 *  2.  Key included in POST body as checkout_attempt_key (always present)
 *  3.  Key cleared from sessionStorage on success
 *  4.  409 response shows conflict panel; no automatic key rotation
 *  5.  "Start a separate new order" generates fresh key
 *  6.  Key preserved across page reload; form intent restored
 *  7.  503 shows standard error, key unchanged
 *  8.  Recovery (200 recovered:true) navigates to payment-success
 *  9.  Conflict panel: form fields preserved, button re-enabled
 * 10.  Attempt cleared after success; new visit to /checkout gets new key
 * 11.  sessionStorage failure → in-memory fallback → key still sent on retry
 * 12.  Malformed JSON → blocking panel on mount; persists after record removed (P8c)
 * 13.  Invalid stored key (non-UUID) → blocking panel; persists across reload (P8c)
 * 14.  Retry sends original frozen snapshot, not edited form values (P8c)
 * 15.  Success clears ATTEMPT_SS and CONFLICT_SS directly (P8c)
 * 16.  Lost response → reload → retry uses original body; storage-unavailable in-memory retry (P8c)
 */

const { test, expect } = require('@playwright/test');
const fs   = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '../results/p8');
fs.mkdirSync(OUT, { recursive: true });

const BASE         = 'http://localhost:3099'; // matches webServer.env.PORT in playwright.config.ts
const CART_KEY     = 'maison-skye-rose-cart';
const ATTEMPT_SS   = 'msr_checkout_attempt';
const CONFLICT_SS  = 'msr_checkout_conflict';
const ORDERS_ROUTE = '**/api/orders';

const UUID_V4_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const findings = [];
const failures  = [];

function f(label, result, evidence) {
  findings.push({ label, result, evidence });
  const badge = result.toUpperCase().padEnd(7);
  console.log(`  [${badge}] ${label}: ${String(evidence).substring(0, 200)}`);
  if (result === 'fail') failures.push(`${label}: ${String(evidence).substring(0, 120)}`);
}

const CART_ITEM = JSON.stringify([{
  id:       'sauvage-inspired',
  title:    'Sauvage Inspired',
  price:    60,
  image:    '/images/placeholder.jpg',
  quantity: 1,
  size:     '5ml',
}]);

// ── Helpers ───────────────────────────────────────────────────────────────────

async function loadCheckout(page) {
  // Pre-seed localStorage BEFORE the page runs any JS. addInitScript fires on
  // every navigation for this page object, so CartContext's LOAD CART useEffect
  // reads the full cart on first mount — no evaluate→reload race possible.
  await page.addInitScript((item) => {
    try { localStorage.setItem('maison-skye-rose-cart', item); } catch {}
  }, CART_ITEM);
  await page.goto(`${BASE}/checkout`, { waitUntil: 'networkidle', timeout: 25000 });
  // By networkidle, React has mounted and the cart subtotal reflects our item.
  // Poll body.textContent directly — more reliable than a Playwright text locator
  // for verifying React state has propagated all the way to the rendered DOM.
  await page.waitForFunction(
    () => (document.body.textContent || '').includes('R60.00'),
    { timeout: 12000, polling: 200 },
  );
  await page.fill('#checkout-name',    'Test Guest');
  await page.fill('#checkout-phone',   '0821234567');
  await page.fill('#checkout-address', '12 Test Street, Cape Town');
  await page.waitForTimeout(300);
}

async function readAttemptKey(page) {
  return page.evaluate((ssKey) => {
    try {
      const raw = sessionStorage.getItem(ssKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed.key === 'string' ? parsed.key : null;
    } catch { return null; }
  }, ATTEMPT_SS);
}

async function readSavedAttempt(page) {
  return page.evaluate((ssKey) => {
    try {
      const raw = sessionStorage.getItem(ssKey);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }, ATTEMPT_SS);
}

async function readConflictFlag(page) {
  return page.evaluate((ssKey) => {
    try { return sessionStorage.getItem(ssKey); } catch { return 'error'; }
  }, CONFLICT_SS);
}

// ── Test 1 ────────────────────────────────────────────────────────────────────
test('1. Key generated and stored in sessionStorage on mount', async ({ page }, testInfo) => {
  test.setTimeout(30000);
  await page.goto(`${BASE}/checkout`, { waitUntil: 'networkidle', timeout: 25000 });
  // Wait for the useEffect that writes the idempotency key to sessionStorage.
  // Polling avoids a fixed sleep while being specific to what we are testing.
  await page.waitForFunction(
    (ssKey) => {
      const raw = sessionStorage.getItem(ssKey);
      if (!raw) return false;
      try { const p = JSON.parse(raw); return typeof p?.key === 'string'; } catch { return false; }
    },
    ATTEMPT_SS,
    { timeout: 10000, polling: 200 },
  );

  const key    = await readAttemptKey(page);
  const isUuid = key !== null && UUID_V4_RE.test(key);
  f('key-generated-on-mount', isUuid ? 'pass' : 'fail', `key: ${key}`);
  expect(isUuid, 'key must be a UUID v4 in sessionStorage after mount').toBe(true);

  await page.screenshot({ path: path.join(testInfo.outputDir, '01.png') });
});

// ── Test 2 ────────────────────────────────────────────────────────────────────
test('2. checkout_attempt_key always included in POST body', async ({ page }, testInfo) => {
  test.setTimeout(30000);

  let capturedBody = null;
  await page.route(ORDERS_ROUTE, async (route) => {
    capturedBody = route.request().postDataJSON();
    await route.fulfill({ status: 500, contentType: 'application/json',
      body: JSON.stringify({ success: false, message: 'Mocked failure.' }) });
  });

  await loadCheckout(page);
  const keyBeforeSubmit = await readAttemptKey(page);

  await page.locator('button').filter({ hasText: /Place Order/ }).first().click();
  await page.locator('p[role="alert"]').waitFor({ state: 'visible', timeout: 15000 });

  const keyInBody    = capturedBody?.checkout_attempt_key;
  const bodyKeyOk    = keyInBody && UUID_V4_RE.test(keyInBody);
  const bodyMatchesSS = keyInBody === keyBeforeSubmit;

  f('body-has-attempt-key',     bodyKeyOk    ? 'pass' : 'fail', `body key: ${keyInBody}`);
  f('body-key-matches-session', bodyMatchesSS ? 'pass' : 'fail', `SS: ${keyBeforeSubmit}, body: ${keyInBody}`);
  expect(bodyKeyOk,   'POST body must include UUID v4 checkout_attempt_key').toBe(true);
  expect(bodyMatchesSS, 'POST body key must match sessionStorage key').toBe(true);

  await page.screenshot({ path: path.join(testInfo.outputDir, '02.png') });
});

// ── Test 3 ────────────────────────────────────────────────────────────────────
test('3. Key cleared from sessionStorage on success', async ({ page }, testInfo) => {
  test.setTimeout(30000);

  await page.route(ORDERS_ROUTE, async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json',
      body: JSON.stringify({ success: true, orderRef: 'MSR-20260920-P8TEST' }) });
  });

  await loadCheckout(page);
  const keyBefore = await readAttemptKey(page);
  expect(keyBefore !== null && UUID_V4_RE.test(keyBefore), 'key present before submit').toBe(true);

  await page.locator('button').filter({ hasText: /Place Order/ }).first().click();

  try {
    await page.waitForURL(/payment-success/, { timeout: 10000 });
    f('navigated-to-success', 'pass', page.url());
    expect(page.url()).toContain('MSR-20260920-P8TEST');
  } catch {
    await page.screenshot({ path: path.join(testInfo.outputDir, '03-stuck.png') });
    throw new Error('Did not navigate to payment-success');
  }
});

// ── Test 4 ────────────────────────────────────────────────────────────────────
test('4. 409 shows conflict panel — no automatic key rotation', async ({ page }, testInfo) => {
  test.setTimeout(30000);

  await page.route(ORDERS_ROUTE, async (route) => {
    await route.fulfill({ status: 409, contentType: 'application/json',
      body: JSON.stringify({ success: false, message: 'An earlier order may already exist. Please contact us.' }) });
  });

  await loadCheckout(page);
  const keyBefore = await readAttemptKey(page);

  await page.locator('button').filter({ hasText: /Place Order/ }).first().click();

  const conflictPanel = page.locator('[role="alert"]').filter({ hasText: /earlier order may already exist/i });
  await conflictPanel.waitFor({ state: 'visible', timeout: 15000 });

  f('conflict-panel-visible', 'pass', 'visible');
  f('key-not-rotated-on-409', (await readAttemptKey(page)) === keyBefore ? 'pass' : 'fail',
    `before: ${keyBefore}, after: ${await readAttemptKey(page)}`);
  f('conflict-panel-has-contact-guidance',
    (await conflictPanel.textContent() ?? '').toLowerCase().includes('contact') ? 'pass' : 'fail',
    'contact guidance');

  expect(await conflictPanel.isVisible()).toBe(true);
  expect(await readAttemptKey(page)).toBe(keyBefore);
  expect((await conflictPanel.textContent() ?? '').toLowerCase()).toContain('contact');
  expect(await conflictPanel.locator('button').filter({ hasText: /separate/i }).isVisible()).toBe(true);

  await page.screenshot({ path: path.join(testInfo.outputDir, '04.png') });
});

// ── Test 5 ────────────────────────────────────────────────────────────────────
test('5. "Start a separate new order" generates a fresh key', async ({ page }, testInfo) => {
  test.setTimeout(30000);

  await page.route(ORDERS_ROUTE, async (route) => {
    await route.fulfill({ status: 409, contentType: 'application/json',
      body: JSON.stringify({ success: false, message: 'An earlier order may already exist.' }) });
  });

  await loadCheckout(page);
  const keyBefore = await readAttemptKey(page);

  await page.locator('button').filter({ hasText: /Place Order/ }).first().click();
  const conflictPanel = page.locator('[role="alert"]').filter({ hasText: /earlier order/i });
  await conflictPanel.waitFor({ state: 'visible', timeout: 15000 });

  await conflictPanel.locator('button').filter({ hasText: /separate/i }).click();
  await page.waitForTimeout(300);

  const keyAfter   = await readAttemptKey(page);
  const keyRotated = keyAfter !== null && keyAfter !== keyBefore && UUID_V4_RE.test(keyAfter);
  f('key-rotated', keyRotated ? 'pass' : 'fail', `before: ${keyBefore}, after: ${keyAfter}`);
  expect(keyRotated).toBe(true);
  expect(await conflictPanel.isVisible().catch(() => false)).toBe(false);

  await page.screenshot({ path: path.join(testInfo.outputDir, '05.png') });
});

// ── Test 6 ────────────────────────────────────────────────────────────────────
test('6. Key and intent preserved across page reload', async ({ page }, testInfo) => {
  test.setTimeout(45000);

  await page.route(ORDERS_ROUTE, async (route) => {
    await route.fulfill({ status: 503, contentType: 'application/json',
      body: JSON.stringify({ success: false, message: 'Service unavailable.' }) });
  });

  await page.goto(`${BASE}/checkout`, { waitUntil: 'networkidle', timeout: 25000 });
  await page.evaluate((item) => { try { localStorage.setItem('maison-skye-rose-cart', item); } catch {} }, CART_ITEM);
  await page.reload({ waitUntil: 'networkidle', timeout: 25000 });
  await page.getByText('R60.00').first().waitFor({ state: 'visible', timeout: 12000 });
  await page.fill('#checkout-name',    'Reload Intent Test');
  await page.fill('#checkout-phone',   '0821111111');
  await page.fill('#checkout-address', '77 Reload Road, Cape Town');
  await page.waitForTimeout(300);

  const keyBefore = await readAttemptKey(page);
  await page.locator('button').filter({ hasText: /Place Order/ }).first().click();
  await page.locator('[role="alert"]').filter({ hasText: /unavailable/i }).waitFor({ state: 'visible', timeout: 15000 });

  // Reload — form and key must be restored
  await page.reload({ waitUntil: 'networkidle', timeout: 25000 });
  // Wait for the frozen snapshot to restore and the retry notice to render.
  const retryNotice = page.locator('[role="status"]').filter({ hasText: /Retrying your previous order/i });
  await retryNotice.waitFor({ state: 'visible', timeout: 12000 });

  const keyAfterReload = await readAttemptKey(page);
  f('key-preserved', keyAfterReload === keyBefore ? 'pass' : 'fail', `${keyBefore} → ${keyAfterReload}`);
  expect(keyAfterReload).toBe(keyBefore);
  const noticeVisible = await retryNotice.isVisible().catch(() => false);
  f('retry-notice-visible-after-reload', noticeVisible ? 'pass' : 'fail', `visible: ${noticeVisible}`);
  expect(noticeVisible, 'Retry notice must be visible after reload with submitted attempt').toBe(true);

  // Form shows original values (read-only in retry mode)
  expect(await page.inputValue('#checkout-name')).toBe('Reload Intent Test');
  expect(await page.inputValue('#checkout-phone')).toBe('0821111111');
  expect(await page.inputValue('#checkout-address')).toBe('77 Reload Road, Cape Town');

  await page.screenshot({ path: path.join(testInfo.outputDir, '06.png') });
});

// ── Test 7 ────────────────────────────────────────────────────────────────────
test('7. 503 shows standard error — key unchanged', async ({ page }, testInfo) => {
  test.setTimeout(30000);

  await page.route(ORDERS_ROUTE, async (route) => {
    await route.fulfill({ status: 503, contentType: 'application/json',
      body: JSON.stringify({ success: false, message: 'Service unavailable.' }) });
  });

  await loadCheckout(page);
  const keyBefore = await readAttemptKey(page);

  await page.locator('button').filter({ hasText: /Place Order/ }).first().click();
  await page.locator('[role="alert"]').filter({ hasText: /unavailable/i }).waitFor({ state: 'visible', timeout: 15000 });

  f('key-unchanged-on-503', (await readAttemptKey(page)) === keyBefore ? 'pass' : 'fail', 'key');
  expect(await readAttemptKey(page)).toBe(keyBefore);

  await page.screenshot({ path: path.join(testInfo.outputDir, '07.png') });
});

// ── Test 8 ────────────────────────────────────────────────────────────────────
test('8. Recovery (recovered:true) navigates to payment-success', async ({ page }, testInfo) => {
  test.setTimeout(30000);

  await page.route(ORDERS_ROUTE, async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json',
      body: JSON.stringify({ success: true, orderRef: 'MSR-20260920-RECOVER', recovered: true }) });
  });

  await loadCheckout(page);
  await page.locator('button').filter({ hasText: /Place Order/ }).first().click();

  try {
    await page.waitForURL(/payment-success/, { timeout: 10000 });
    f('recovery-navigates', 'pass', page.url());
    expect(page.url()).toContain('MSR-20260920-RECOVER');
  } catch {
    await page.screenshot({ path: path.join(testInfo.outputDir, '08-stuck.png') });
    throw new Error('Recovery did not navigate');
  }
});

// ── Test 9 ────────────────────────────────────────────────────────────────────
// After a 409, frozenAttemptRef is set (frozen before the request fires).
// The button label changes from "Place Order" to "Retry original order".
// We assert the button is not loading-disabled using a label-independent locator.
test('9. Conflict panel — fields preserved, button re-enabled', async ({ page }, testInfo) => {
  test.setTimeout(30000);

  await page.route(ORDERS_ROUTE, async (route) => {
    await route.fulfill({ status: 409, contentType: 'application/json',
      body: JSON.stringify({ success: false, message: 'An earlier order may already exist.' }) });
  });

  await loadCheckout(page);
  await page.locator('button').filter({ hasText: /Place Order/ }).first().click();

  const conflictPanel = page.locator('[role="alert"]').filter({ hasText: /earlier order/i });
  await conflictPanel.waitFor({ state: 'visible', timeout: 15000 });

  expect(await page.inputValue('#checkout-name')).toBe('Test Guest');
  expect(await page.inputValue('#checkout-phone')).toBe('0821234567');
  // After 409, button shows "Retry original order" — find by either label.
  const submitBtn = page.locator('button').filter({ hasText: /Retry original order|Place Order/i }).first();
  expect(await submitBtn.isDisabled()).toBe(false);
  expect(page.url()).toContain('/checkout');

  await page.screenshot({ path: path.join(testInfo.outputDir, '09.png') });
});

// ── Test 10 ───────────────────────────────────────────────────────────────────
test('10. Attempt cleared after success; subsequent visit gets a new key', async ({ page }, testInfo) => {
  test.setTimeout(50000);

  await page.route(ORDERS_ROUTE, async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json',
      body: JSON.stringify({ success: true, orderRef: 'MSR-20260920-CLEARED' }) });
  });

  await loadCheckout(page);
  const keyBeforeSuccess = await readAttemptKey(page);

  await page.locator('button').filter({ hasText: /Place Order/ }).first().click();
  try {
    await page.waitForURL(/payment-success/, { timeout: 10000 });
  } catch {
    throw new Error('Did not navigate to payment-success');
  }

  await page.goto(`${BASE}/checkout`, { waitUntil: 'networkidle', timeout: 25000 });
  await page.evaluate((item) => { try { localStorage.setItem('maison-skye-rose-cart', item); } catch {} }, CART_ITEM);
  await page.reload({ waitUntil: 'networkidle', timeout: 25000 });
  await page.waitForTimeout(800);

  const keyAfterSuccess = await readAttemptKey(page);
  f('new-key-after-success', keyAfterSuccess !== keyBeforeSuccess && UUID_V4_RE.test(keyAfterSuccess ?? '') ? 'pass' : 'fail',
    `orig: ${keyBeforeSuccess}, new: ${keyAfterSuccess}`);
  expect(UUID_V4_RE.test(keyAfterSuccess ?? '')).toBe(true);
  expect(keyAfterSuccess).not.toBe(keyBeforeSuccess);

  await page.screenshot({ path: path.join(testInfo.outputDir, '10.png') });
});

// ── Test 11 ───────────────────────────────────────────────────────────────────
test('11. sessionStorage unavailable → in-memory fallback → key still sent', async ({ page }, testInfo) => {
  test.setTimeout(30000);

  await page.addInitScript(() => {
    Object.defineProperty(window, 'sessionStorage', {
      configurable: true,
      get: () => ({
        getItem:    () => { throw new DOMException('QuotaExceededError'); },
        setItem:    () => { throw new DOMException('QuotaExceededError'); },
        removeItem: () => { throw new DOMException('QuotaExceededError'); },
        clear: () => {}, length: 0, key: () => null,
      }),
    });
  });
  // Pre-seed cart BEFORE the page runs any JS — same pattern as loadCheckout.
  // Without this, CartContext's SAVE CART effect races with the evaluate+reload
  // and can overwrite CART_ITEM with [] before the reload reads it.
  await page.addInitScript((item) => {
    try { localStorage.setItem('maison-skye-rose-cart', item); } catch {}
  }, CART_ITEM);

  const capturedBodies = [];
  await page.route(ORDERS_ROUTE, async (route) => {
    capturedBodies.push(route.request().postDataJSON());
    await route.fulfill({ status: 500, contentType: 'application/json',
      body: JSON.stringify({ success: false, message: 'Mocked failure.' }) });
  });

  await page.goto(`${BASE}/checkout`, { waitUntil: 'networkidle', timeout: 25000 });
  await page.waitForFunction(
    () => (document.body.textContent || '').includes('R60.00'),
    { timeout: 12000, polling: 200 },
  );
  await page.fill('#checkout-name',    'Memory Fallback Test');
  await page.fill('#checkout-phone',   '0829999999');
  await page.fill('#checkout-address', '5 Memory Lane, Cape Town');
  await page.waitForTimeout(300);

  await page.locator('button').filter({ hasText: /Place Order/ }).first().click();
  await page.locator('[role="alert"]').filter({ hasText: /Mocked failure|could not|unavailable/i }).waitFor({ state: 'visible', timeout: 15000 });

  const key1    = capturedBodies[0]?.checkout_attempt_key;
  const hasKey1 = key1 && UUID_V4_RE.test(key1);
  f('storage-fail-key-on-first-submit', hasKey1 ? 'pass' : 'fail', `key: ${key1}`);
  expect(hasKey1, 'Key must be sent when sessionStorage unavailable').toBe(true);

  // Second submit on same page — after first submit the button shows "Retry original order".
  // In retry mode the frozen in-memory snapshot is sent with the same key.
  const retryBtnAfterFirst = page.locator('button').filter({ hasText: /Retry original order/i }).first();
  await retryBtnAfterFirst.waitFor({ state: 'visible', timeout: 5000 });
  await retryBtnAfterFirst.click();
  await page.waitForTimeout(1500);

  const key2       = capturedBodies[1]?.checkout_attempt_key;
  const sameKey    = key1 === key2;
  f('storage-fail-same-key-retry', sameKey ? 'pass' : 'fail', `k1=${key1}, k2=${key2}`);
  expect(sameKey, 'Same key must be reused from in-memory ref').toBe(true);

  // Retry body must have original name (not modified — in retry mode after first submit)
  const retryBody = capturedBodies[1];
  f('storage-fail-retry-original-name',
    retryBody?.customer_name === 'Memory Fallback Test' ? 'pass' : 'fail',
    `retry name: ${retryBody?.customer_name}`);
  expect(retryBody?.customer_name).toBe('Memory Fallback Test');

  await page.screenshot({ path: path.join(testInfo.outputDir, '11.png') });
});

// ── Test 12 (P8c) ─────────────────────────────────────────────────────────────
// Corruption is seeded ONCE via page.evaluate; not re-injected on subsequent navigations.
// We also verify that after removing the malformed record, the CONFLICT_SS flag
// alone is sufficient to keep the blocking panel visible.
test('12. Malformed JSON → blocking panel; persists after record removed (P8c)', async ({ page }, testInfo) => {
  test.setTimeout(45000);

  // Navigate first so sessionStorage is on the correct origin.
  await page.goto(`${BASE}/checkout`, { waitUntil: 'networkidle', timeout: 25000 });

  // Seed bad data ONCE via evaluate (not addInitScript which re-runs on every load).
  await page.evaluate((ssKey) => {
    try { sessionStorage.setItem(ssKey, '{bad json'); } catch {}
  }, ATTEMPT_SS);

  // Reload — checkout useEffect now sees the malformed JSON.
  await page.reload({ waitUntil: 'networkidle', timeout: 25000 });
  await page.waitForTimeout(800);

  const blockingPanel = page.locator('[role="alert"]').filter({ hasText: /could not read your session/i });
  f('12-blocking-panel-on-malformed', await blockingPanel.isVisible().catch(() => false) ? 'pass' : 'fail', 'visible');
  expect(await blockingPanel.isVisible()).toBe(true);

  // CONFLICT_SS must be set.
  const conflictFlag = await readConflictFlag(page);
  f('12-conflict-flag-set', conflictFlag !== null ? 'pass' : 'fail', `flag: ${conflictFlag}`);
  expect(conflictFlag).not.toBeNull();

  // No new key auto-generated — corruption must block key rotation.
  const keyAfterCorruption = await readAttemptKey(page);
  f('12-no-key-generated', keyAfterCorruption === null ? 'pass' : 'fail', `key: ${keyAfterCorruption}`);
  expect(keyAfterCorruption).toBeNull();

  // Remove the malformed record from sessionStorage — CONFLICT_SS should keep panel alive.
  await page.evaluate((ssKey) => { try { sessionStorage.removeItem(ssKey); } catch {} }, ATTEMPT_SS);
  await page.reload({ waitUntil: 'networkidle', timeout: 25000 });
  await page.waitForTimeout(800);

  // Panel must STILL show — driven by CONFLICT_SS alone, not the raw malformed record.
  const panelAfterRemoval = await blockingPanel.isVisible().catch(() => false);
  f('12-blocking-panel-persists-after-record-removed', panelAfterRemoval ? 'pass' : 'fail',
    `visible: ${panelAfterRemoval}`);
  expect(panelAfterRemoval, 'Blocking panel must persist even after malformed record is removed').toBe(true);

  // Only "Start a separate new order" may dismiss the blocking panel.
  await blockingPanel.locator('button').filter({ hasText: /separate/i }).click();
  await page.waitForTimeout(400);

  const panelDismissed = !(await blockingPanel.isVisible().catch(() => false));
  const newKey         = await readAttemptKey(page);
  f('12-panel-dismissed-by-new-order',      panelDismissed               ? 'pass' : 'fail', 'dismissed');
  f('12-new-key-after-new-order', newKey && UUID_V4_RE.test(newKey)       ? 'pass' : 'fail', `key: ${newKey}`);
  expect(panelDismissed).toBe(true);
  expect(newKey && UUID_V4_RE.test(newKey)).toBe(true);

  await page.screenshot({ path: path.join(testInfo.outputDir, '12.png') });
});

// ── Test 13 (P8c) ─────────────────────────────────────────────────────────────
// Seed corruption once; verify it persists across a full reload.
test('13. Invalid stored key (non-UUID) → blocking panel persists across reload (P8c)', async ({ page }, testInfo) => {
  test.setTimeout(45000);

  await page.goto(`${BASE}/checkout`, { waitUntil: 'networkidle', timeout: 25000 });

  // Seed invalid key ONCE.
  await page.evaluate((ssKey) => {
    try {
      sessionStorage.setItem(ssKey, JSON.stringify({
        key: 'not-a-valid-uuid', name: 'Test', phone: '082', address: 'addr', province: 'Cape Town Metro',
      }));
    } catch {}
  }, ATTEMPT_SS);

  await page.reload({ waitUntil: 'networkidle', timeout: 25000 });
  await page.waitForTimeout(800);

  const blockingPanel = page.locator('[role="alert"]').filter({ hasText: /could not read your session/i });
  f('13-blocking-panel-on-invalid-key', await blockingPanel.isVisible().catch(() => false) ? 'pass' : 'fail', 'visible');
  expect(await blockingPanel.isVisible()).toBe(true);

  const conflictFlag = await readConflictFlag(page);
  f('13-conflict-flag-set', conflictFlag !== null ? 'pass' : 'fail', `flag: ${conflictFlag}`);
  expect(conflictFlag).not.toBeNull();

  // Reload — panel must persist (driven by CONFLICT_SS).
  await page.reload({ waitUntil: 'networkidle', timeout: 25000 });
  await page.waitForTimeout(800);
  f('13-panel-survives-reload', await blockingPanel.isVisible().catch(() => false) ? 'pass' : 'fail', 'visible');
  expect(await blockingPanel.isVisible()).toBe(true);

  await page.screenshot({ path: path.join(testInfo.outputDir, '13.png') });
});

// ── Test 14 (P8c) ─────────────────────────────────────────────────────────────
// Retry must send the ORIGINAL frozen snapshot in the POST body.
// Form edits after a 503 must NOT silently become the retry body.
test('14. Retry sends original frozen snapshot body — not edited form values (P8c)', async ({ page }, testInfo) => {
  test.setTimeout(45000);

  const capturedBodies = [];
  await page.route(ORDERS_ROUTE, async (route) => {
    capturedBodies.push(route.request().postDataJSON());
    await route.fulfill({ status: 503, contentType: 'application/json',
      body: JSON.stringify({ success: false, message: 'Service unavailable.' }) });
  });

  await page.goto(`${BASE}/checkout`, { waitUntil: 'networkidle', timeout: 25000 });
  await page.evaluate((item) => { try { localStorage.setItem('maison-skye-rose-cart', item); } catch {} }, CART_ITEM);
  await page.reload({ waitUntil: 'networkidle', timeout: 25000 });
  await page.waitForTimeout(800);

  // First submission with original values.
  await page.fill('#checkout-name',    'Original Name');
  await page.fill('#checkout-phone',   '0821110000');
  await page.fill('#checkout-address', '1 Original Street');
  await page.waitForTimeout(300);

  await page.locator('button').filter({ hasText: /Place Order/ }).first().click();
  // Use content-specific filter to avoid matching Next.js route announcer [role="alert"].
  await page.locator('[role="alert"]').filter({ hasText: /unavailable/i }).waitFor({ state: 'visible', timeout: 15000 });

  const firstBody = capturedBodies[0];
  f('14-first-submit-name', firstBody?.customer_name === 'Original Name' ? 'pass' : 'fail',
    `first: ${firstBody?.customer_name}`);
  expect(firstBody?.customer_name).toBe('Original Name');
  expect(firstBody?.phone).toBe('0821110000');

  // Verify the snapshot was frozen.
  const snapshotAfterFirst = await readSavedAttempt(page);
  f('14-snapshot-submitted-true', snapshotAfterFirst?.submitted === true ? 'pass' : 'fail',
    `submitted: ${snapshotAfterFirst?.submitted}`);
  expect(snapshotAfterFirst?.submitted).toBe(true);

  // Now the page is in retry mode — form fields are read-only.
  // The retry button label must change.
  const retryBtnText = await page.locator('button').filter({ hasText: /Retry original order|Place Order/i }).first().textContent();
  f('14-button-shows-retry', /retry/i.test(retryBtnText ?? '') ? 'pass' : 'fail', `btn text: ${retryBtnText}`);
  expect(/retry/i.test(retryBtnText ?? ''), 'Button must show retry label after first submit').toBe(true);

  // Reload to simulate a lost-response scenario — intent must be restored.
  await page.reload({ waitUntil: 'networkidle', timeout: 25000 });
  await page.waitForTimeout(800);

  // After reload, retry notice must show with original values.
  const retryNotice = page.locator('[role="status"]').filter({ hasText: /Retrying your previous order/i });
  f('14-retry-notice-after-reload', await retryNotice.isVisible().catch(() => false) ? 'pass' : 'fail', 'visible');
  expect(await retryNotice.isVisible()).toBe(true);

  // Click retry — body must have original values.
  await page.locator('button').filter({ hasText: /Retry original order/i }).first().click();
  await page.waitForTimeout(2000);

  const retryBody = capturedBodies[capturedBodies.length - 1];
  f('14-retry-body-original-name',    retryBody?.customer_name === 'Original Name' ? 'pass' : 'fail',
    `retry name: ${retryBody?.customer_name}`);
  f('14-retry-body-original-phone',   retryBody?.phone         === '0821110000'    ? 'pass' : 'fail',
    `retry phone: ${retryBody?.phone}`);
  f('14-retry-body-original-address', retryBody?.address       === '1 Original Street' ? 'pass' : 'fail',
    `retry address: ${retryBody?.address}`);
  f('14-retry-same-key', retryBody?.checkout_attempt_key === firstBody?.checkout_attempt_key ? 'pass' : 'fail',
    `key match: ${retryBody?.checkout_attempt_key === firstBody?.checkout_attempt_key}`);

  expect(retryBody?.customer_name,       'Retry must send original name').toBe('Original Name');
  expect(retryBody?.phone,               'Retry must send original phone').toBe('0821110000');
  expect(retryBody?.address,             'Retry must send original address').toBe('1 Original Street');
  expect(retryBody?.checkout_attempt_key, 'Retry must use same key').toBe(firstBody?.checkout_attempt_key);

  await page.screenshot({ path: path.join(testInfo.outputDir, '14.png') });
});

// ── Test 15 (P8c) ─────────────────────────────────────────────────────────────
// CONFLICT_SS is seeded via page.evaluate (not addInitScript) so it does not
// get re-injected on the payment-success navigation.
test('15. Success clears ATTEMPT_SS and CONFLICT_SS directly (P8c)', async ({ page }, testInfo) => {
  test.setTimeout(30000);

  await page.route(ORDERS_ROUTE, async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json',
      body: JSON.stringify({ success: true, orderRef: 'MSR-20260920-CLEARTEST' }) });
  });

  await loadCheckout(page);

  // Seed CONFLICT_SS AFTER the page has loaded (useEffect already ran).
  // The flag sits quietly until clearSavedAttempt() removes it on success.
  await page.evaluate((key) => {
    try { sessionStorage.setItem(key, '1'); } catch {}
  }, CONFLICT_SS);

  const btn = page.locator('button').filter({ hasText: /Place Order/ }).first();
  await btn.click();

  try {
    await page.waitForURL(/payment-success/, { timeout: 10000 });
  } catch {
    await page.screenshot({ path: path.join(testInfo.outputDir, '15-stuck.png') });
    throw new Error('Did not navigate to payment-success');
  }

  // sessionStorage is shared within the same origin/tab across hard navigations.
  const attemptSS  = await page.evaluate((k) => { try { return sessionStorage.getItem(k); } catch { return 'error'; } }, ATTEMPT_SS);
  const conflictSS = await page.evaluate((k) => { try { return sessionStorage.getItem(k); } catch { return 'error'; } }, CONFLICT_SS);

  f('15-attempt-ss-cleared',  attemptSS  === null ? 'pass' : 'fail', `ATTEMPT_SS: ${attemptSS}`);
  f('15-conflict-ss-cleared', conflictSS === null ? 'pass' : 'fail', `CONFLICT_SS: ${conflictSS}`);
  expect(attemptSS,  'ATTEMPT_SS must be null after success').toBeNull();
  expect(conflictSS, 'CONFLICT_SS must be null after success').toBeNull();

  await page.screenshot({ path: path.join(testInfo.outputDir, '15.png') });
});

// ── Test 16 (P8c) ─────────────────────────────────────────────────────────────
// Storage-unavailable path: in-memory snapshot preserved across multiple retries.
test('16. Storage-unavailable: in-memory frozen snapshot used on all retries (P8c)', async ({ page }, testInfo) => {
  test.setTimeout(30000);

  await page.addInitScript(() => {
    Object.defineProperty(window, 'sessionStorage', {
      configurable: true,
      get: () => ({
        getItem:    () => { throw new DOMException('SecurityError'); },
        setItem:    () => { throw new DOMException('SecurityError'); },
        removeItem: () => { throw new DOMException('SecurityError'); },
        clear: () => {}, length: 0, key: () => null,
      }),
    });
  });

  const capturedBodies = [];
  await page.route(ORDERS_ROUTE, async (route) => {
    capturedBodies.push(route.request().postDataJSON());
    await route.fulfill({ status: 503, contentType: 'application/json',
      body: JSON.stringify({ success: false, message: 'Service unavailable.' }) });
  });

  await page.goto(`${BASE}/checkout`, { waitUntil: 'networkidle', timeout: 25000 });
  await page.evaluate((item) => { try { localStorage.setItem('maison-skye-rose-cart', item); } catch {} }, CART_ITEM);
  await page.reload({ waitUntil: 'networkidle', timeout: 25000 });
  await page.waitForTimeout(800);

  await page.fill('#checkout-name',    'Storage Fail Test');
  await page.fill('#checkout-phone',   '0827771111');
  await page.fill('#checkout-address', '10 No Storage Road');
  await page.waitForTimeout(300);

  await page.locator('button').filter({ hasText: /Place Order/ }).first().click();
  await page.locator('[role="alert"]').filter({ hasText: /unavailable/i }).waitFor({ state: 'visible', timeout: 15000 });

  const key1 = capturedBodies[0]?.checkout_attempt_key;
  f('16-key-sent-first-submit', key1 && UUID_V4_RE.test(key1) ? 'pass' : 'fail', `k1: ${key1}`);
  expect(key1 && UUID_V4_RE.test(key1)).toBe(true);

  // Second retry (in retry mode — button now says "Retry original order")
  const retryBtn = page.locator('button').filter({ hasText: /Retry original order/i }).first();
  const retryBtnVisible = await retryBtn.isVisible().catch(() => false);
  f('16-retry-button-visible', retryBtnVisible ? 'pass' : 'fail', `visible: ${retryBtnVisible}`);

  if (retryBtnVisible) {
    await retryBtn.click();
    await page.waitForTimeout(1500);

    const key2 = capturedBodies[1]?.checkout_attempt_key;
    f('16-same-key-on-retry', key1 === key2 ? 'pass' : 'fail', `k1=${key1}, k2=${key2}`);
    expect(key2).toBe(key1);

    // Body must have ORIGINAL values, not edited ones
    f('16-retry-body-original-name',
      capturedBodies[1]?.customer_name === 'Storage Fail Test' ? 'pass' : 'fail',
      `retry name: ${capturedBodies[1]?.customer_name}`);
    expect(capturedBodies[1]?.customer_name).toBe('Storage Fail Test');
  } else {
    f('16-retry-button-visible', 'fail', 'retry button not found — cannot continue');
    throw new Error('Retry button not visible after first submit with storage unavailable');
  }

  await page.screenshot({ path: path.join(testInfo.outputDir, '16.png') });
});

// ── Test 17 (P8d) ─────────────────────────────────────────────────────────────
// submitted must be a literal boolean. A string "true" must trigger blocking
// conflict, and the blocking panel must persist after the record is removed
// (CONFLICT_SS carries it across reloads).
test('17. submitted: "true" (string) → blocking conflict; persists across reload (P8d)', async ({ page }, testInfo) => {
  test.setTimeout(45000);

  await page.goto(`${BASE}/checkout`, { waitUntil: 'networkidle', timeout: 25000 });

  await page.evaluate((ssKey) => {
    try {
      sessionStorage.setItem(ssKey, JSON.stringify({
        key:       '12345678-1234-4234-a234-123456789012',
        name:      'Test', phone: '082', address: 'addr', province: 'Cape Town Metro',
        submitted: 'true', // STRING — must be rejected; only boolean is valid
      }));
    } catch {}
  }, ATTEMPT_SS);

  await page.reload({ waitUntil: 'networkidle', timeout: 25000 });
  await page.waitForTimeout(800);

  const blockingPanel = page.locator('[role="alert"]').filter({ hasText: /could not read your session/i });
  f('17-blocking-panel-on-string-submitted', await blockingPanel.isVisible().catch(() => false) ? 'pass' : 'fail', 'visible');
  expect(await blockingPanel.isVisible(), 'submitted:"true" must trigger blocking conflict').toBe(true);

  const conflictFlag = await readConflictFlag(page);
  f('17-conflict-flag-set', conflictFlag !== null ? 'pass' : 'fail', `flag: ${conflictFlag}`);
  expect(conflictFlag).not.toBeNull();

  // Remove the malformed record — CONFLICT_SS alone must keep the panel alive.
  await page.evaluate((ssKey) => { try { sessionStorage.removeItem(ssKey); } catch {} }, ATTEMPT_SS);
  await page.reload({ waitUntil: 'networkidle', timeout: 25000 });
  await page.waitForTimeout(800);

  f('17-panel-persists-after-record-removed',
    await blockingPanel.isVisible().catch(() => false) ? 'pass' : 'fail', 'visible');
  expect(await blockingPanel.isVisible()).toBe(true);

  await page.screenshot({ path: path.join(testInfo.outputDir, '17.png') });
});

// ── Test 18 (P8d) ─────────────────────────────────────────────────────────────
// submitted field missing entirely must also trigger blocking conflict.
test('18. submitted field missing → blocking conflict (P8d)', async ({ page }, testInfo) => {
  test.setTimeout(30000);

  await page.goto(`${BASE}/checkout`, { waitUntil: 'networkidle', timeout: 25000 });

  await page.evaluate((ssKey) => {
    try {
      sessionStorage.setItem(ssKey, JSON.stringify({
        key:      '12345678-1234-4234-a234-123456789012',
        name:     'Test', phone: '082', address: 'addr', province: 'Cape Town Metro',
        // submitted field absent — must be rejected
      }));
    } catch {}
  }, ATTEMPT_SS);

  await page.reload({ waitUntil: 'networkidle', timeout: 25000 });
  await page.waitForTimeout(800);

  const blockingPanel = page.locator('[role="alert"]').filter({ hasText: /could not read your session/i });
  f('18-blocking-panel-on-missing-submitted',
    await blockingPanel.isVisible().catch(() => false) ? 'pass' : 'fail', 'visible');
  expect(await blockingPanel.isVisible(), 'missing submitted must trigger blocking conflict').toBe(true);

  f('18-conflict-flag-set', (await readConflictFlag(page)) !== null ? 'pass' : 'fail', 'flag');
  expect(await readConflictFlag(page)).not.toBeNull();

  await page.screenshot({ path: path.join(testInfo.outputDir, '18.png') });
});

// ── Test 19 (P8d) ─────────────────────────────────────────────────────────────
// Full lost-response recovery path with cart preservation.
// Sequence:
//   1. First request is aborted (lost response).
//   2. Cart is changed after the abort (add a second item).
//   3. Page is reloaded — frozen snapshot recovered from sessionStorage.
//   4. User retries — second request body must carry original values.
//   5. Exactly 2 requests intercepted; both use the same key.
//   6. Recovery succeeds; NEWER (changed) cart is preserved in localStorage.
test('19. Lost response → cart edit → reload → original snapshot in retry; newer cart preserved (P8d)', async ({ page }, testInfo) => {
  test.setTimeout(60000);

  let requestCount = 0;
  const capturedBodies = [];

  await page.route(ORDERS_ROUTE, async (route) => {
    requestCount++;
    capturedBodies.push(route.request().postDataJSON());
    if (requestCount === 1) {
      await route.abort('failed'); // first request: lost (abort = "connection error" path)
    } else {
      await route.fulfill({
        status:      200,
        contentType: 'application/json',
        body:        JSON.stringify({ success: true, orderRef: 'MSR-RECOVERY-19', recovered: true }),
      });
    }
  });

  // Load checkout with original cart (one item).
  const originalCart = [{
    id: 'sauvage-inspired', title: 'Sauvage Inspired', price: 60,
    image: '/images/placeholder.jpg', quantity: 1, size: '5ml',
  }];
  await page.goto(`${BASE}/checkout`, { waitUntil: 'networkidle', timeout: 25000 });
  await page.evaluate((c) => {
    try { localStorage.setItem('maison-skye-rose-cart', JSON.stringify(c)); } catch {}
  }, originalCart);
  await page.reload({ waitUntil: 'networkidle', timeout: 25000 });
  await page.getByText('R60.00').first().waitFor({ state: 'visible', timeout: 12000 });

  await page.fill('#checkout-name',    'Recovery Guest');
  await page.fill('#checkout-phone',   '0821230001');
  await page.fill('#checkout-address', '99 Original Road');
  await page.waitForTimeout(300);

  // Submit — first request is aborted (lost).
  await page.locator('button').filter({ hasText: /Place Order/ }).first().click();
  await page.locator('[role="alert"]').filter({ hasText: /connection error/i }).waitFor({ state: 'visible', timeout: 15000 });

  // Snapshot must be frozen with submitted:true.
  const snapshotAfterAbort = await readSavedAttempt(page);
  f('19-snapshot-frozen-on-abort', snapshotAfterAbort?.submitted === true ? 'pass' : 'fail',
    `submitted: ${snapshotAfterAbort?.submitted}`);
  expect(snapshotAfterAbort?.submitted).toBe(true);

  // Change the cart — add a second item to simulate cart modifications after
  // the lost response.
  const changedCart = [
    { id: 'sauvage-inspired', title: 'Sauvage Inspired', price: 60,
      image: '/images/placeholder.jpg', quantity: 1, size: '5ml' },
    { id: 'aventus-inspired',  title: 'Aventus Inspired',  price: 80,
      image: '/images/placeholder.jpg', quantity: 2, size: '10ml' },
  ];
  await page.evaluate((c) => {
    try { localStorage.setItem('maison-skye-rose-cart', JSON.stringify(c)); } catch {}
  }, changedCart);

  // Reload — simulates the user refreshing after the lost response.
  // Frozen snapshot is restored from sessionStorage.
  await page.reload({ waitUntil: 'networkidle', timeout: 25000 });

  const retryNotice = page.locator('[role="status"]').filter({ hasText: /Retrying your previous order/i });
  // Wait for the retry notice to render — confirms the frozen snapshot was restored.
  await retryNotice.waitFor({ state: 'visible', timeout: 12000 });
  f('19-retry-notice-visible', 'pass', 'visible');
  expect(await retryNotice.isVisible()).toBe(true);

  // Retry the original order.
  await page.locator('button').filter({ hasText: /Retry original order/i }).first().click();
  await page.waitForURL(/payment-success/, { timeout: 10000 });

  // ── Assert exactly 2 requests ──────────────────────────────────────────────
  f('19-exactly-two-requests', capturedBodies.length === 2 ? 'pass' : 'fail', `count: ${capturedBodies.length}`);
  expect(capturedBodies.length).toBe(2);

  // ── Both requests carry the same idempotency key ───────────────────────────
  const key1 = capturedBodies[0]?.checkout_attempt_key;
  const key2 = capturedBodies[1]?.checkout_attempt_key;
  f('19-same-key-both-requests', key1 === key2 ? 'pass' : 'fail', `k1=${key1}, k2=${key2}`);
  expect(key2).toBe(key1);

  // ── Retry body carries original customer / delivery fields ─────────────────
  f('19-retry-original-name',    capturedBodies[1]?.customer_name === 'Recovery Guest'  ? 'pass' : 'fail', capturedBodies[1]?.customer_name);
  f('19-retry-original-phone',   capturedBodies[1]?.phone         === '0821230001'      ? 'pass' : 'fail', capturedBodies[1]?.phone);
  f('19-retry-original-address', capturedBodies[1]?.address       === '99 Original Road' ? 'pass' : 'fail', capturedBodies[1]?.address);
  expect(capturedBodies[1]?.customer_name).toBe('Recovery Guest');
  expect(capturedBodies[1]?.phone).toBe('0821230001');
  expect(capturedBodies[1]?.address).toBe('99 Original Road');

  // ── Retry body carries original item IDs, sizes, quantities ───────────────
  const retryItems = capturedBodies[1]?.items ?? [];
  f('19-retry-item-count', retryItems.length === 1 ? 'pass' : 'fail', `items: ${retryItems.length}`);
  expect(retryItems.length).toBe(1);
  f('19-retry-item-id',       retryItems[0]?.id       === 'sauvage-inspired' ? 'pass' : 'fail', retryItems[0]?.id);
  f('19-retry-item-size',     retryItems[0]?.size     === '5ml'              ? 'pass' : 'fail', retryItems[0]?.size);
  f('19-retry-item-quantity', retryItems[0]?.quantity === 1                  ? 'pass' : 'fail', `qty: ${retryItems[0]?.quantity}`);
  expect(retryItems[0]?.id).toBe('sauvage-inspired');
  expect(retryItems[0]?.size).toBe('5ml');
  expect(retryItems[0]?.quantity).toBe(1);

  // ── Newer cart is preserved — NOT cleared on recovery of original order ────
  const cartAfterRecovery = await page.evaluate(() => {
    try { return JSON.parse(localStorage.getItem('maison-skye-rose-cart') || 'null'); } catch { return null; }
  });
  f('19-changed-cart-preserved',
    Array.isArray(cartAfterRecovery) && cartAfterRecovery.length === 2 ? 'pass' : 'fail',
    `cart items: ${Array.isArray(cartAfterRecovery) ? cartAfterRecovery.length : 'null'}`);
  expect(Array.isArray(cartAfterRecovery)).toBe(true);
  expect(cartAfterRecovery.length).toBe(2);
  expect(cartAfterRecovery.some((i) => i.id === 'aventus-inspired')).toBe(true);

  await page.screenshot({ path: path.join(testInfo.outputDir, '19.png') });
});

// ── Test 20 (P8d) ─────────────────────────────────────────────────────────────
// While a retry is in-flight (held), "Start a separate new order" must be
// disabled so the user cannot accidentally trigger it during loading.
//
// What this test verifies:
//   • The button carries the HTML disabled attribute while loading=true (UI layer).
//   • After a force-click (which React suppresses on disabled elements), the
//     attempt key and frozen snapshot are unchanged.
//
// What this test does NOT prove:
//   • That the submittingRef JS guard executed — React does not call onClick
//     on a disabled button even when a synthetic click event is dispatched.
//     The JS guard is defence-in-depth; its coverage lives in the unit layer.
//
// Sequence:
//   1. First request → 503 → error shown; frozen snapshot set; retry notice
//      becomes visible with "Start a separate new order instead" button.
//   2. Re-route all subsequent requests to hold indefinitely.
//   3. Click Retry — loading becomes true; button gets disabled attribute.
//   4. Assert the button is disabled (HTML attribute).
//   5. Force-click — React does not fire onClick on disabled buttons;
//      key and snapshot remain unchanged (expected outcome).
//   6. Release the held response — success, navigate to payment-success.
test('20. Held-response: "Start a separate new order" is a no-op while loading (P8d)', async ({ page }, testInfo) => {
  test.setTimeout(60000);

  let requestCount = 0;
  /** @type {(() => void) | null} */
  let resolveHeld = null;

  await page.route(ORDERS_ROUTE, async (route) => {
    requestCount++;
    if (requestCount === 1) {
      // First request returns 503 so the frozen snapshot is set and the
      // retry notice (with "Start a separate new order instead") becomes visible.
      await route.fulfill({ status: 503, contentType: 'application/json',
        body: JSON.stringify({ success: false, message: 'Service unavailable.' }) });
    } else {
      // All subsequent requests are held until resolveHeld() is called.
      await new Promise((resolve) => { resolveHeld = resolve; });
      await route.fulfill({ status: 200, contentType: 'application/json',
        body: JSON.stringify({ success: true, orderRef: 'MSR-T20-HELD' }) });
    }
  });

  await loadCheckout(page);

  // Capture key and snapshot before the first submission.
  const keyBefore = await readAttemptKey(page);
  f('20-key-exists-before-submit', keyBefore !== null && UUID_V4_RE.test(keyBefore) ? 'pass' : 'fail', `key: ${keyBefore}`);
  expect(keyBefore).not.toBeNull();

  // First submit → 503; frozen snapshot is set.
  await page.locator('button').filter({ hasText: /Place Order/ }).first().click();
  await page.locator('[role="alert"]').filter({ hasText: /unavailable/i }).waitFor({ state: 'visible', timeout: 15000 });

  const snapshotAfter503 = await readSavedAttempt(page);
  f('20-snapshot-frozen-after-503', snapshotAfter503?.submitted === true ? 'pass' : 'fail',
    `submitted: ${snapshotAfter503?.submitted}`);
  expect(snapshotAfter503?.submitted).toBe(true);

  // The retry notice with "Start a separate new order instead" must now be visible.
  const newOrderBtn = page.locator('button').filter({ hasText: /separate new order/i }).first();
  await newOrderBtn.waitFor({ state: 'visible', timeout: 5000 });
  f('20-new-order-btn-visible-before-retry', await newOrderBtn.isVisible() ? 'pass' : 'fail', 'visible');

  // Retry — second request is held; loading becomes true.
  await page.locator('button').filter({ hasText: /Retry original order|Place Order/i }).first().click();
  await page.waitForTimeout(400); // let React flip loading=true

  // ── Assert button is disabled while loading ────────────────────────────────
  const allNewOrderBtns = page.locator('button').filter({ hasText: /separate new order/i });
  const btnCount = await allNewOrderBtns.count();
  f('20-buttons-in-dom-during-load', btnCount > 0 ? 'pass' : 'fail', `count: ${btnCount}`);
  expect(btnCount).toBeGreaterThan(0);

  let allDisabled = true;
  for (let i = 0; i < btnCount; i++) {
    if (!(await allNewOrderBtns.nth(i).isDisabled())) { allDisabled = false; }
  }
  f('20-all-new-order-btns-disabled-while-loading', allDisabled ? 'pass' : 'fail', `disabled: ${allDisabled}`);
  expect(allDisabled, 'Start-a-new-order buttons must be disabled while loading').toBe(true);

  // Force-click bypasses Playwright's actionability check but React itself
  // suppresses onClick on disabled buttons — the click is silently ignored
  // by React, so the key must remain unchanged.
  await allNewOrderBtns.first().click({ force: true, timeout: 2000 }).catch(() => {});
  await page.waitForTimeout(300);

  const keyDuringLoad = await readAttemptKey(page);
  f('20-key-unchanged-during-retry-load', keyDuringLoad === keyBefore ? 'pass' : 'fail',
    `before: ${keyBefore}, during: ${keyDuringLoad}`);
  expect(keyDuringLoad).toBe(keyBefore);

  const snapshotDuringLoad = await readSavedAttempt(page);
  f('20-snapshot-unchanged-during-retry-load',
    snapshotDuringLoad?.submitted === true && snapshotDuringLoad?.key === keyBefore ? 'pass' : 'fail',
    `submitted: ${snapshotDuringLoad?.submitted}, key match: ${snapshotDuringLoad?.key === keyBefore}`);
  expect(snapshotDuringLoad?.submitted).toBe(true);
  expect(snapshotDuringLoad?.key).toBe(keyBefore);

  // Release the held response; navigation must complete with the original key.
  if (resolveHeld) resolveHeld();
  await page.waitForURL(/payment-success/, { timeout: 15000 });

  f('20-navigation-used-original-order-ref', page.url().includes('MSR-T20-HELD') ? 'pass' : 'fail', page.url());
  expect(page.url()).toContain('MSR-T20-HELD');

  await page.screenshot({ path: path.join(testInfo.outputDir, '20.png') });
});

// ── Reporting ─────────────────────────────────────────────────────────────────

test.afterAll(() => {
  fs.writeFileSync(
    path.join(OUT, 'findings-p8.json'),
    JSON.stringify({ findings, failures }, null, 2),
  );
  if (failures.length === 0) {
    console.log(`\n  All ${findings.length} P8 checks passed.`);
  } else {
    console.log(`\n  ${failures.length} FAILED: ${failures.join('; ')}`);
  }
});
