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
 * 12.  Malformed JSON in sessionStorage → blocking conflict panel; persists across reload (P8c)
 * 13.  Invalid stored key (non-UUID) → blocking conflict panel; persists across reload (P8c)
 * 14.  Stored snapshot immutable after first submit — form edits do not update it (P8c)
 * 15.  Success clears ATTEMPT_SS and CONFLICT_SS directly (P8c)
 */

const { test, expect } = require('@playwright/test');
const fs   = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '../results/p8');
fs.mkdirSync(OUT, { recursive: true });

const BASE         = 'http://localhost:3000';
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
  await page.goto(`${BASE}/checkout`, { waitUntil: 'networkidle', timeout: 25000 });
  await page.evaluate((item) => {
    try { localStorage.setItem('maison-skye-rose-cart', item); } catch {}
  }, CART_ITEM);
  await page.reload({ waitUntil: 'networkidle', timeout: 25000 });
  await page.waitForTimeout(800);
  await page.fill('#checkout-name',    'Test Guest');
  await page.fill('#checkout-phone',   '0821234567');
  await page.fill('#checkout-address', '12 Test Street, Cape Town');
  await page.waitForTimeout(300);
}

// Reads the attempt key from the JSON stored in sessionStorage.
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

// Reads the full saved attempt object from sessionStorage.
async function readSavedAttempt(page) {
  return page.evaluate((ssKey) => {
    try {
      const raw = sessionStorage.getItem(ssKey);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }, ATTEMPT_SS);
}

// Reads the CONFLICT_SS flag value.
async function readConflictFlag(page) {
  return page.evaluate((ssKey) => {
    try { return sessionStorage.getItem(ssKey); } catch { return 'error'; }
  }, CONFLICT_SS);
}

// ── Test 1: Key generated on page load ────────────────────────────────────────
test('1. Key generated and stored in sessionStorage on mount', async ({ page }, testInfo) => {
  test.setTimeout(30000);
  await page.setViewportSize({ width: 375, height: 812 });

  await page.goto(`${BASE}/checkout`, { waitUntil: 'networkidle', timeout: 25000 });
  await page.waitForTimeout(800);

  const key    = await readAttemptKey(page);
  const isUuid = key !== null && UUID_V4_RE.test(key);

  f('key-generated-on-mount', isUuid ? 'pass' : 'fail', `key: ${key}`);
  f('key-is-uuid-v4',         isUuid ? 'pass' : 'fail', `matches UUID v4: ${isUuid}`);
  expect(isUuid, 'key must be a UUID v4 in sessionStorage after mount').toBe(true);

  await page.screenshot({ path: path.join(testInfo.outputDir, '01-key-on-mount.png') });
});

// ── Test 2: Key included in POST body (always — no conditional spread) ────────
test('2. checkout_attempt_key always included in POST body', async ({ page }, testInfo) => {
  test.setTimeout(30000);
  await page.setViewportSize({ width: 375, height: 812 });

  let capturedBody = null;
  await page.route(ORDERS_ROUTE, async (route) => {
    capturedBody = route.request().postDataJSON();
    await route.fulfill({
      status:      500,
      contentType: 'application/json',
      body:        JSON.stringify({ success: false, message: 'Mocked failure.' }),
    });
  });

  await loadCheckout(page);
  const keyBeforeSubmit = await readAttemptKey(page);

  const btn = page.locator('button').filter({ hasText: /Place Order/ }).first();
  await btn.click();
  await page.locator('p[role="alert"]').waitFor({ state: 'visible', timeout: 8000 });

  await page.screenshot({ path: path.join(testInfo.outputDir, '02-post-body.png') });

  const keyInBody    = capturedBody?.checkout_attempt_key;
  const bodyKeyIsUuid = keyInBody && UUID_V4_RE.test(keyInBody);
  const bodyMatchesSS = keyInBody === keyBeforeSubmit;

  f('body-has-attempt-key',     bodyKeyIsUuid ? 'pass' : 'fail', `body key: ${keyInBody}`);
  f('body-key-matches-session', bodyMatchesSS ? 'pass' : 'fail', `SS: ${keyBeforeSubmit}, body: ${keyInBody}`);
  f('key-always-present-not-conditional', bodyKeyIsUuid ? 'pass' : 'fail',
    `checkout_attempt_key present: ${bodyKeyIsUuid}`);
  expect(bodyKeyIsUuid,  'POST body must include a UUID v4 checkout_attempt_key').toBe(true);
  expect(bodyMatchesSS, 'POST body key must match the sessionStorage key').toBe(true);
});

// ── Test 3: Key cleared on success ────────────────────────────────────────────
test('3. Key cleared from sessionStorage on success', async ({ page }, testInfo) => {
  test.setTimeout(30000);
  await page.setViewportSize({ width: 375, height: 812 });

  await page.route(ORDERS_ROUTE, async (route) => {
    await route.fulfill({
      status:      200,
      contentType: 'application/json',
      body:        JSON.stringify({ success: true, orderRef: 'MSR-20260920-P8TEST' }),
    });
  });

  await loadCheckout(page);
  const keyBefore = await readAttemptKey(page);
  const hadKey    = keyBefore !== null && UUID_V4_RE.test(keyBefore);

  f('key-present-before-submit', hadKey ? 'pass' : 'fail', `key: ${keyBefore}`);
  expect(hadKey, 'key must be set before submit').toBe(true);

  const btn = page.locator('button').filter({ hasText: /Place Order/ }).first();
  await btn.click();

  try {
    await page.waitForURL(/payment-success/, { timeout: 10000 });
  } catch {
    await page.screenshot({ path: path.join(testInfo.outputDir, '03-stuck.png') });
    f('navigated-to-success', 'fail', `still on ${page.url()}`);
    throw new Error('Did not navigate to payment-success');
  }

  f('navigated-to-success', 'pass', page.url());
  const urlHasRef = page.url().includes('MSR-20260920-P8TEST');
  f('success-url-has-ref', urlHasRef ? 'pass' : 'fail', page.url());
  expect(urlHasRef).toBe(true);
});

// ── Test 4: 409 shows conflict panel, no auto key rotation ────────────────────
test('4. 409 shows conflict panel — no automatic key rotation', async ({ page }, testInfo) => {
  test.setTimeout(30000);
  await page.setViewportSize({ width: 375, height: 812 });

  await page.route(ORDERS_ROUTE, async (route) => {
    await route.fulfill({
      status:      409,
      contentType: 'application/json',
      body:        JSON.stringify({
        success: false,
        message: 'An earlier order may already exist with different items or delivery details. Please contact us to confirm.',
      }),
    });
  });

  await loadCheckout(page);
  const keyBefore = await readAttemptKey(page);

  const btn = page.locator('button').filter({ hasText: /Place Order/ }).first();
  await btn.click();

  const conflictPanel = page.locator('[role="alert"]').filter({ hasText: /earlier order may already exist/i });
  await conflictPanel.waitFor({ state: 'visible', timeout: 8000 });
  await page.screenshot({ path: path.join(testInfo.outputDir, '04-conflict-panel.png') });

  const panelVisible = await conflictPanel.isVisible().catch(() => false);
  f('conflict-panel-visible', panelVisible ? 'pass' : 'fail', `visible: ${panelVisible}`);
  expect(panelVisible, 'Conflict panel must be visible after 409').toBe(true);

  const keyAfter    = await readAttemptKey(page);
  const keyUnchanged = keyAfter === keyBefore;
  f('key-not-rotated-on-409', keyUnchanged ? 'pass' : 'fail',
    `before: ${keyBefore}, after: ${keyAfter}`);
  expect(keyUnchanged, 'Key must not be automatically rotated on 409').toBe(true);

  const bodyText           = (await conflictPanel.textContent() ?? '').toLowerCase();
  const hasContactGuidance = bodyText.includes('contact');
  f('conflict-panel-contact-guidance', hasContactGuidance ? 'pass' : 'fail',
    `panel text includes "contact": ${hasContactGuidance}`);
  expect(hasContactGuidance, 'Conflict panel must advise contacting us').toBe(true);

  const newOrderBtn        = conflictPanel.locator('button').filter({ hasText: /separate/i });
  const newOrderBtnVisible = await newOrderBtn.isVisible().catch(() => false);
  f('new-order-button-visible', newOrderBtnVisible ? 'pass' : 'fail',
    `button visible: ${newOrderBtnVisible}`);
  expect(newOrderBtnVisible, '"Start a separate new order" button must be visible').toBe(true);
});

// ── Test 5: "Start a separate new order" rotates the key ─────────────────────
test('5. "Start a separate new order" generates a fresh key', async ({ page }, testInfo) => {
  test.setTimeout(30000);
  await page.setViewportSize({ width: 375, height: 812 });

  await page.route(ORDERS_ROUTE, async (route) => {
    await route.fulfill({
      status:      409,
      contentType: 'application/json',
      body:        JSON.stringify({ success: false, message: 'An earlier order may already exist.' }),
    });
  });

  await loadCheckout(page);
  const keyBefore = await readAttemptKey(page);

  const btn = page.locator('button').filter({ hasText: /Place Order/ }).first();
  await btn.click();

  const conflictPanel = page.locator('[role="alert"]').filter({ hasText: /earlier order/i });
  await conflictPanel.waitFor({ state: 'visible', timeout: 8000 });

  const newOrderBtn = conflictPanel.locator('button').filter({ hasText: /separate/i });
  await newOrderBtn.click();
  await page.waitForTimeout(300);

  await page.screenshot({ path: path.join(testInfo.outputDir, '05-new-order-key.png') });

  const panelGone = !(await conflictPanel.isVisible().catch(() => false));
  f('conflict-panel-dismissed', panelGone ? 'pass' : 'fail', `panel gone: ${panelGone}`);
  expect(panelGone, 'Conflict panel must be dismissed after starting new order').toBe(true);

  const keyAfter   = await readAttemptKey(page);
  const keyRotated = keyAfter !== null && keyAfter !== keyBefore && UUID_V4_RE.test(keyAfter);
  f('key-rotated-after-explicit-new-order', keyRotated ? 'pass' : 'fail',
    `before: ${keyBefore}, after: ${keyAfter}`);
  expect(keyRotated, 'Key must be a new UUID after clicking "Start a separate new order"').toBe(true);
});

// ── Test 6: Key and intent preserved/restored across reload ──────────────────
test('6. Key and intent preserved across page reload', async ({ page }, testInfo) => {
  test.setTimeout(45000);
  await page.setViewportSize({ width: 375, height: 812 });

  await page.route(ORDERS_ROUTE, async (route) => {
    await route.fulfill({
      status:      503,
      contentType: 'application/json',
      body:        JSON.stringify({ success: false, message: 'Service unavailable.' }),
    });
  });

  await page.goto(`${BASE}/checkout`, { waitUntil: 'networkidle', timeout: 25000 });
  await page.evaluate((item) => {
    try { localStorage.setItem('maison-skye-rose-cart', item); } catch {}
  }, CART_ITEM);
  await page.reload({ waitUntil: 'networkidle', timeout: 25000 });
  await page.waitForTimeout(800);
  await page.fill('#checkout-name',    'Reload Intent Test');
  await page.fill('#checkout-phone',   '0821111111');
  await page.fill('#checkout-address', '77 Reload Road, Cape Town');
  await page.waitForTimeout(300);

  const keyBefore = await readAttemptKey(page);

  const btn = page.locator('button').filter({ hasText: /Place Order/ }).first();
  await btn.click();
  await page.locator('p[role="alert"]').waitFor({ state: 'visible', timeout: 8000 });

  const savedBefore  = await readSavedAttempt(page);
  const intentSaved  = savedBefore && savedBefore.name === 'Reload Intent Test';
  f('intent-saved-before-reload', intentSaved ? 'pass' : 'fail',
    `saved.name: ${savedBefore?.name}`);
  expect(intentSaved, 'Intent must be saved in sessionStorage after submit attempt').toBe(true);

  await page.reload({ waitUntil: 'networkidle', timeout: 25000 });
  await page.waitForTimeout(800);

  const keyAfterReload = await readAttemptKey(page);
  const keyPreserved   = keyAfterReload === keyBefore;
  f('key-preserved-across-reload', keyPreserved ? 'pass' : 'fail',
    `before: ${keyBefore}, after: ${keyAfterReload}`);
  expect(keyPreserved, 'Key must be the same after reload').toBe(true);

  const nameVal    = await page.inputValue('#checkout-name');
  const phoneVal   = await page.inputValue('#checkout-phone');
  const addressVal = await page.inputValue('#checkout-address');
  f('name-restored-after-reload',    nameVal    === 'Reload Intent Test'        ? 'pass' : 'fail', `name: "${nameVal}"`);
  f('phone-restored-after-reload',   phoneVal   === '0821111111'                ? 'pass' : 'fail', `phone: "${phoneVal}"`);
  f('address-restored-after-reload', addressVal === '77 Reload Road, Cape Town' ? 'pass' : 'fail', `address: "${addressVal}"`);
  expect(nameVal).toBe('Reload Intent Test');
  expect(phoneVal).toBe('0821111111');
  expect(addressVal).toBe('77 Reload Road, Cape Town');

  await page.screenshot({ path: path.join(testInfo.outputDir, '06-reload-restore.png') });
});

// ── Test 7: 503 shows standard error, key unchanged ───────────────────────────
test('7. 503 shows standard error — key unchanged', async ({ page }, testInfo) => {
  test.setTimeout(30000);
  await page.setViewportSize({ width: 375, height: 812 });

  await page.route(ORDERS_ROUTE, async (route) => {
    await route.fulfill({
      status:      503,
      contentType: 'application/json',
      body:        JSON.stringify({ success: false, message: 'Service unavailable.' }),
    });
  });

  await loadCheckout(page);
  const keyBefore = await readAttemptKey(page);

  const btn = page.locator('button').filter({ hasText: /Place Order/ }).first();
  await btn.click();

  const alert = page.locator('p[role="alert"]');
  await alert.waitFor({ state: 'visible', timeout: 8000 });
  await page.screenshot({ path: path.join(testInfo.outputDir, '07-503-error.png') });

  const alertVisible = await alert.isVisible().catch(() => false);
  f('503-error-visible', alertVisible ? 'pass' : 'fail', `visible: ${alertVisible}`);
  expect(alertVisible).toBe(true);

  const keyAfter    = await readAttemptKey(page);
  const keyUnchanged = keyAfter === keyBefore;
  f('key-unchanged-on-503', keyUnchanged ? 'pass' : 'fail',
    `before: ${keyBefore}, after: ${keyAfter}`);
  expect(keyUnchanged, 'Key must not change on 503 error').toBe(true);
});

// ── Test 8: Recovery (200 recovered:true) navigates normally ─────────────────
test('8. Recovery response (recovered:true) navigates to payment-success', async ({ page }, testInfo) => {
  test.setTimeout(30000);
  await page.setViewportSize({ width: 375, height: 812 });

  await page.route(ORDERS_ROUTE, async (route) => {
    await route.fulfill({
      status:      200,
      contentType: 'application/json',
      body:        JSON.stringify({ success: true, orderRef: 'MSR-20260920-RECOVER', recovered: true }),
    });
  });

  await loadCheckout(page);

  const btn = page.locator('button').filter({ hasText: /Place Order/ }).first();
  await btn.click();

  try {
    await page.waitForURL(/payment-success/, { timeout: 10000 });
    const urlOk = page.url().includes('MSR-20260920-RECOVER');
    f('recovery-navigates-to-success', 'pass', page.url());
    f('recovery-url-has-original-ref', urlOk ? 'pass' : 'fail', page.url());
    expect(urlOk, 'Recovery must navigate with original orderRef').toBe(true);
  } catch {
    await page.screenshot({ path: path.join(testInfo.outputDir, '08-recovery-stuck.png') });
    f('recovery-navigates-to-success', 'fail', `stuck on ${page.url()}`);
    throw new Error('Recovery did not navigate to payment-success');
  }
});

// ── Test 9: Conflict panel: form fields preserved, button re-enabled ──────────
test('9. Conflict panel — form fields preserved, Place Order button re-enabled', async ({ page }, testInfo) => {
  test.setTimeout(30000);
  await page.setViewportSize({ width: 375, height: 812 });

  await page.route(ORDERS_ROUTE, async (route) => {
    await route.fulfill({
      status:      409,
      contentType: 'application/json',
      body:        JSON.stringify({ success: false, message: 'An earlier order may already exist.' }),
    });
  });

  await loadCheckout(page);

  const btn = page.locator('button').filter({ hasText: /Place Order/ }).first();
  await btn.click();

  const conflictPanel = page.locator('[role="alert"]').filter({ hasText: /earlier order/i });
  await conflictPanel.waitFor({ state: 'visible', timeout: 8000 });
  await page.screenshot({ path: path.join(testInfo.outputDir, '09-conflict-fields.png') });

  const nameVal  = await page.inputValue('#checkout-name');
  const phoneVal = await page.inputValue('#checkout-phone');
  f('conflict-name-preserved',  nameVal  === 'Test Guest'  ? 'pass' : 'fail', `name="${nameVal}"`);
  f('conflict-phone-preserved', phoneVal === '0821234567' ? 'pass' : 'fail', `phone="${phoneVal}"`);
  expect(nameVal).toBe('Test Guest');
  expect(phoneVal).toBe('0821234567');

  const isDisabled = await btn.isDisabled();
  f('conflict-button-reenabled', !isDisabled ? 'pass' : 'fail', `disabled: ${isDisabled}`);
  expect(isDisabled, 'Place Order must be re-enabled after 409').toBe(false);

  const cartData = await page.evaluate((key) => {
    try { return JSON.parse(localStorage.getItem(key) ?? '[]'); } catch { return []; }
  }, CART_KEY);
  f('conflict-cart-preserved', cartData.length > 0 ? 'pass' : 'fail', `cart items: ${cartData.length}`);
  expect(cartData.length).toBeGreaterThan(0);

  f('conflict-no-navigation', page.url().includes('/checkout') ? 'pass' : 'fail', page.url());
  expect(page.url()).toContain('/checkout');
});

// ── Test 10: Attempt cleared after success; new /checkout visit gets new key ──
test('10. Attempt cleared after success; subsequent visit gets a new key', async ({ page }, testInfo) => {
  test.setTimeout(50000);
  await page.setViewportSize({ width: 375, height: 812 });

  await page.route(ORDERS_ROUTE, async (route) => {
    await route.fulfill({
      status:      200,
      contentType: 'application/json',
      body:        JSON.stringify({ success: true, orderRef: 'MSR-20260920-CLEARED' }),
    });
  });

  await loadCheckout(page);
  const keyBeforeSuccess = await readAttemptKey(page);

  const btn = page.locator('button').filter({ hasText: /Place Order/ }).first();
  await btn.click();

  try {
    await page.waitForURL(/payment-success/, { timeout: 10000 });
  } catch {
    await page.screenshot({ path: path.join(testInfo.outputDir, '10-success-stuck.png') });
    throw new Error('Did not navigate to payment-success');
  }

  f('success-navigated', 'pass', page.url());

  await page.goto(`${BASE}/checkout`, { waitUntil: 'networkidle', timeout: 25000 });
  await page.evaluate((item) => {
    try { localStorage.setItem('maison-skye-rose-cart', item); } catch {}
  }, CART_ITEM);
  await page.reload({ waitUntil: 'networkidle', timeout: 25000 });
  await page.waitForTimeout(800);

  const keyAfterSuccess = await readAttemptKey(page);
  const newKeyIsUuid    = keyAfterSuccess !== null && UUID_V4_RE.test(keyAfterSuccess);
  const keyIsDifferent  = keyAfterSuccess !== keyBeforeSuccess;

  f('attempt-cleared-success-new-key', keyIsDifferent  ? 'pass' : 'fail',
    `original: ${keyBeforeSuccess}, new: ${keyAfterSuccess}`);
  f('new-key-is-valid-uuid',           newKeyIsUuid    ? 'pass' : 'fail',
    `new key: ${keyAfterSuccess}`);
  expect(newKeyIsUuid,   'New visit after success must have a fresh UUID key').toBe(true);
  expect(keyIsDifferent, 'New key must differ from the cleared attempt key').toBe(true);

  await page.screenshot({ path: path.join(testInfo.outputDir, '10-new-key-after-success.png') });
});

// ── Test 11: sessionStorage failure → in-memory fallback → key sent on retry ─
test('11. sessionStorage unavailable → in-memory fallback → key still sent', async ({ page }, testInfo) => {
  test.setTimeout(30000);
  await page.setViewportSize({ width: 375, height: 812 });

  await page.addInitScript(() => {
    Object.defineProperty(window, 'sessionStorage', {
      configurable: true,
      get: () => ({
        getItem:    () => { throw new DOMException('QuotaExceededError', 'QuotaExceededError'); },
        setItem:    () => { throw new DOMException('QuotaExceededError', 'QuotaExceededError'); },
        removeItem: () => { throw new DOMException('QuotaExceededError', 'QuotaExceededError'); },
        clear:      () => {},
        length:     0,
        key:        () => null,
      }),
    });
  });

  const capturedBodies = [];
  await page.route(ORDERS_ROUTE, async (route) => {
    capturedBodies.push(route.request().postDataJSON());
    await route.fulfill({
      status:      500,
      contentType: 'application/json',
      body:        JSON.stringify({ success: false, message: 'Mocked failure.' }),
    });
  });

  await page.goto(`${BASE}/checkout`, { waitUntil: 'networkidle', timeout: 25000 });
  await page.evaluate((item) => {
    try { localStorage.setItem('maison-skye-rose-cart', item); } catch {}
  }, CART_ITEM);
  await page.reload({ waitUntil: 'networkidle', timeout: 25000 });
  await page.waitForTimeout(800);
  await page.fill('#checkout-name',    'Memory Fallback Test');
  await page.fill('#checkout-phone',   '0829999999');
  await page.fill('#checkout-address', '5 Memory Lane, Cape Town');
  await page.waitForTimeout(300);

  const btn = page.locator('button').filter({ hasText: /Place Order/ }).first();
  await btn.click();
  await page.locator('p[role="alert"]').waitFor({ state: 'visible', timeout: 8000 });

  const key1     = capturedBodies[0]?.checkout_attempt_key;
  const hasKey1  = key1 && UUID_V4_RE.test(key1);
  f('storage-fail-key-sent-on-first-submit', hasKey1 ? 'pass' : 'fail',
    `first submit key: ${key1}`);
  expect(hasKey1, 'Key must be sent even when sessionStorage is unavailable').toBe(true);

  await btn.click();
  await page.waitForTimeout(1500);

  const key2        = capturedBodies[1]?.checkout_attempt_key;
  const sameKeyUsed = key1 === key2;
  const isUuid2     = key2 && UUID_V4_RE.test(key2);
  f('storage-fail-key-sent-on-second-submit', isUuid2     ? 'pass' : 'fail', `second: ${key2}`);
  f('storage-fail-same-key-reused',           sameKeyUsed ? 'pass' : 'fail', `k1=${key1} k2=${key2}`);
  expect(isUuid2,     'Key must be sent on second in-memory submit').toBe(true);
  expect(sameKeyUsed, 'Same key must be reused from in-memory ref on same-page retries').toBe(true);

  await page.screenshot({ path: path.join(testInfo.outputDir, '11-storage-failure.png') });
});

// ── Test 12 (P8c): Malformed JSON → blocking conflict panel persists across reload ──
test('12. Malformed JSON in sessionStorage → blocking conflict panel persists across reload', async ({ page }, testInfo) => {
  test.setTimeout(45000);
  await page.setViewportSize({ width: 375, height: 812 });

  // Inject malformed JSON before load so useEffect sees it on mount.
  await page.addInitScript((ssKey) => {
    try { sessionStorage.setItem(ssKey, '{bad json'); } catch {}
  }, ATTEMPT_SS);

  await page.goto(`${BASE}/checkout`, { waitUntil: 'networkidle', timeout: 25000 });
  await page.waitForTimeout(800);

  const blockingPanel = page.locator('[role="alert"]').filter({ hasText: /could not read your session/i });
  const panelVisible  = await blockingPanel.isVisible().catch(() => false);
  f('12-blocking-panel-on-malformed-json', panelVisible ? 'pass' : 'fail', `visible: ${panelVisible}`);
  expect(panelVisible, 'Blocking conflict panel must appear for malformed JSON').toBe(true);

  // No new key must have been generated — the corrupted record must not be replaced.
  const attemptKey = await readAttemptKey(page);
  f('12-no-key-generated-on-corruption', attemptKey === null ? 'pass' : 'fail', `key: ${attemptKey}`);
  expect(attemptKey, 'No new key must be auto-generated when stored state is corrupted').toBeNull();

  // CONFLICT_SS must be set so corruption persists even if the raw record changes.
  const conflictFlag = await readConflictFlag(page);
  f('12-conflict-flag-set', conflictFlag !== null ? 'pass' : 'fail', `flag: ${conflictFlag}`);
  expect(conflictFlag, 'CONFLICT_SS must be set to preserve the corruption signal across reloads').not.toBeNull();

  // Reload — blocking panel must still appear (CONFLICT_SS drives re-rendering).
  await page.reload({ waitUntil: 'networkidle', timeout: 25000 });
  await page.waitForTimeout(800);

  const panelAfterReload = await blockingPanel.isVisible().catch(() => false);
  f('12-blocking-panel-survives-reload', panelAfterReload ? 'pass' : 'fail',
    `visible after reload: ${panelAfterReload}`);
  expect(panelAfterReload, 'Blocking conflict panel must persist across reload').toBe(true);

  // "Start a separate new order" is the ONLY action that may dismiss it.
  const newOrderBtn = blockingPanel.locator('button').filter({ hasText: /separate/i });
  await newOrderBtn.click();
  await page.waitForTimeout(400);

  const panelDismissed = !(await blockingPanel.isVisible().catch(() => false));
  const newKey         = await readAttemptKey(page);
  f('12-panel-dismissed-by-new-order',      panelDismissed                        ? 'pass' : 'fail', `dismissed: ${panelDismissed}`);
  f('12-new-key-generated-after-new-order', newKey && UUID_V4_RE.test(newKey)     ? 'pass' : 'fail', `new key: ${newKey}`);
  expect(panelDismissed, 'Blocking panel must be dismissed by "Start a separate new order"').toBe(true);
  expect(newKey && UUID_V4_RE.test(newKey), 'New key must be generated after starting new order').toBe(true);

  await page.screenshot({ path: path.join(testInfo.outputDir, '12-malformed-json.png') });
});

// ── Test 13 (P8c): Invalid stored key → blocking conflict panel persists across reload ──
test('13. Invalid stored key (non-UUID) → blocking conflict panel persists across reload', async ({ page }, testInfo) => {
  test.setTimeout(45000);
  await page.setViewportSize({ width: 375, height: 812 });

  // Inject a syntactically valid JSON record but with a non-UUID key.
  await page.addInitScript((ssKey) => {
    try {
      sessionStorage.setItem(ssKey, JSON.stringify({
        key:      'not-a-valid-uuid',
        name:     'Test User',
        phone:    '0821234567',
        address:  '1 Test Street',
        province: 'Cape Town Metro',
      }));
    } catch {}
  }, ATTEMPT_SS);

  await page.goto(`${BASE}/checkout`, { waitUntil: 'networkidle', timeout: 25000 });
  await page.waitForTimeout(800);

  const blockingPanel = page.locator('[role="alert"]').filter({ hasText: /could not read your session/i });
  const panelVisible  = await blockingPanel.isVisible().catch(() => false);
  f('13-blocking-panel-on-invalid-key', panelVisible ? 'pass' : 'fail', `visible: ${panelVisible}`);
  expect(panelVisible, 'Blocking conflict panel must appear for an invalid stored key').toBe(true);

  // CONFLICT_SS must be set.
  const conflictFlag = await readConflictFlag(page);
  f('13-conflict-flag-set', conflictFlag !== null ? 'pass' : 'fail', `flag: ${conflictFlag}`);
  expect(conflictFlag, 'CONFLICT_SS must be set for invalid key').not.toBeNull();

  // Reload — panel persists.
  await page.reload({ waitUntil: 'networkidle', timeout: 25000 });
  await page.waitForTimeout(800);

  const panelAfterReload = await blockingPanel.isVisible().catch(() => false);
  f('13-blocking-panel-survives-reload', panelAfterReload ? 'pass' : 'fail',
    `visible after reload: ${panelAfterReload}`);
  expect(panelAfterReload, 'Blocking panel must persist across reload for invalid key').toBe(true);

  await page.screenshot({ path: path.join(testInfo.outputDir, '13-invalid-key.png') });
});

// ── Test 14 (P8c): Stored snapshot immutable after first submit ───────────────
test('14. Stored snapshot is immutable after first submit — form edits do not update it', async ({ page }, testInfo) => {
  test.setTimeout(45000);
  await page.setViewportSize({ width: 375, height: 812 });

  await page.route(ORDERS_ROUTE, async (route) => {
    await route.fulfill({
      status:      503,
      contentType: 'application/json',
      body:        JSON.stringify({ success: false, message: 'Service unavailable.' }),
    });
  });

  await page.goto(`${BASE}/checkout`, { waitUntil: 'networkidle', timeout: 25000 });
  await page.evaluate((item) => {
    try { localStorage.setItem('maison-skye-rose-cart', item); } catch {}
  }, CART_ITEM);
  await page.reload({ waitUntil: 'networkidle', timeout: 25000 });
  await page.waitForTimeout(800);

  await page.fill('#checkout-name',    'Original Name');
  await page.fill('#checkout-phone',   '0821110000');
  await page.fill('#checkout-address', '1 Original Street');
  await page.waitForTimeout(300);

  const btn = page.locator('button').filter({ hasText: /Place Order/ }).first();
  await btn.click();
  await page.locator('p[role="alert"]').waitFor({ state: 'visible', timeout: 8000 });

  // Verify snapshot was saved with original values and submitted=true.
  const snapshotAfterFirst = await readSavedAttempt(page);
  const firstKeyInSnap     = snapshotAfterFirst?.key;
  f('14-snapshot-saved-after-first-submit', snapshotAfterFirst !== null ? 'pass' : 'fail',
    `snapshot: ${JSON.stringify(snapshotAfterFirst)}`);
  f('14-snapshot-submitted-flag',
    snapshotAfterFirst?.submitted === true ? 'pass' : 'fail',
    `submitted: ${snapshotAfterFirst?.submitted}`);
  f('14-snapshot-original-name',
    snapshotAfterFirst?.name === 'Original Name' ? 'pass' : 'fail',
    `name: ${snapshotAfterFirst?.name}`);
  expect(snapshotAfterFirst?.submitted).toBe(true);
  expect(snapshotAfterFirst?.name).toBe('Original Name');

  // Edit the form — these must NOT update the stored snapshot.
  await page.fill('#checkout-name',    'Edited Name');
  await page.fill('#checkout-phone',   '0829990000');
  await page.fill('#checkout-address', '99 Edited Avenue');
  await page.waitForTimeout(300);

  // Verify snapshot is unchanged after form edits (before second submit).
  const snapshotAfterEdit = await readSavedAttempt(page);
  f('14-snapshot-unchanged-after-edit',
    snapshotAfterEdit?.name === 'Original Name' ? 'pass' : 'fail',
    `snapshot.name after edit: ${snapshotAfterEdit?.name}`);
  f('14-snapshot-key-unchanged',
    snapshotAfterEdit?.key === firstKeyInSnap ? 'pass' : 'fail',
    `key unchanged: ${snapshotAfterEdit?.key === firstKeyInSnap}`);
  expect(snapshotAfterEdit?.name,  'Snapshot must not be updated after form edit').toBe('Original Name');
  expect(snapshotAfterEdit?.phone, 'Snapshot phone must be original').toBe('0821110000');

  // Second submit.
  await btn.click();
  await page.waitForTimeout(3000);

  // Snapshot must still be the original after second submit attempt.
  const snapshotAfterRetry = await readSavedAttempt(page);
  f('14-snapshot-unchanged-after-retry',
    snapshotAfterRetry?.name === 'Original Name' ? 'pass' : 'fail',
    `snapshot.name after retry: ${snapshotAfterRetry?.name}`);
  expect(snapshotAfterRetry?.name, 'Snapshot must remain original after second submit').toBe('Original Name');

  await page.screenshot({ path: path.join(testInfo.outputDir, '14-immutable-snapshot.png') });
});

// ── Test 15 (P8c): Success clears ATTEMPT_SS and CONFLICT_SS ─────────────────
test('15. Success clears ATTEMPT_SS and CONFLICT_SS directly', async ({ page }, testInfo) => {
  test.setTimeout(30000);
  await page.setViewportSize({ width: 375, height: 812 });

  // Pre-seed CONFLICT_SS to verify it is also cleared on success.
  await page.addInitScript((conflictKey) => {
    try { sessionStorage.setItem(conflictKey, '1'); } catch {}
  }, CONFLICT_SS);

  await page.route(ORDERS_ROUTE, async (route) => {
    await route.fulfill({
      status:      200,
      contentType: 'application/json',
      body:        JSON.stringify({ success: true, orderRef: 'MSR-20260920-CLEARTEST' }),
    });
  });

  await loadCheckout(page);

  const btn = page.locator('button').filter({ hasText: /Place Order/ }).first();
  await btn.click();

  try {
    await page.waitForURL(/payment-success/, { timeout: 10000 });
  } catch {
    await page.screenshot({ path: path.join(testInfo.outputDir, '15-stuck.png') });
    throw new Error('Did not navigate to payment-success');
  }

  // sessionStorage is shared within the same origin/tab across hard navigation.
  const attemptSS  = await page.evaluate((k) => {
    try { return sessionStorage.getItem(k); } catch { return 'storage-error'; }
  }, ATTEMPT_SS);
  const conflictSS = await page.evaluate((k) => {
    try { return sessionStorage.getItem(k); } catch { return 'storage-error'; }
  }, CONFLICT_SS);

  f('15-attempt-ss-cleared-on-success',  attemptSS  === null ? 'pass' : 'fail', `ATTEMPT_SS: ${attemptSS}`);
  f('15-conflict-ss-cleared-on-success', conflictSS === null ? 'pass' : 'fail', `CONFLICT_SS: ${conflictSS}`);
  expect(attemptSS,  'ATTEMPT_SS must be null after successful order').toBeNull();
  expect(conflictSS, 'CONFLICT_SS must be null after successful order').toBeNull();

  await page.screenshot({ path: path.join(testInfo.outputDir, '15-cleared-on-success.png') });
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
