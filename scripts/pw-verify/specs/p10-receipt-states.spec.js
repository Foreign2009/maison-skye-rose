// @ts-check
/**
 * CHECKOUT-P10 — Receipt state browser verification
 *
 * Tests the /payment-success page across all receipt states with mocked API
 * responses. All /api/orders/** requests are intercepted via page.route()
 * before they leave the browser — no request reaches Supabase or production.
 *
 * Covers:
 *  1.  Loading state: held response — no premature confirmation or payment CTA
 *  2.  401 response — access-error heading; no confirmed-order claims
 *  3.  401 response — neutral support WhatsApp URL
 *  4.  Missing ref (no ?ref= param) — invalid-ref state
 *  5.  Invalid ref format — invalid-ref state
 *  6.  404 response — not-found state
 *  7.  500 server error — error state with Try-again button
 *  8.  Network error — error state with Try-again button
 *  9.  Retry: first GET fails (500), second succeeds — confirmed state reached
 * 10.  Confirmed collection receipt — P9 regression
 * 11.  Confirmed courier receipt — P9 regression
 * 12.  Error-state mobile layout at 320px — footer/actions not obscured by FAB
 * 13.  Error-state mobile layout at 390px — footer/actions not obscured by FAB
 * 14.  Reference A→B isolation (full-page navigation)
 * 15.  Retry: button hidden during loading — overlap not possible
 * 16.  Client-side nav: A confirmed → B held — no A data; purchase not premature
 * 17.  Client-side nav: A pending → B confirmed → release A late — B unchanged
 *
 * Run: npx playwright test --config scripts/pw-verify/playwright.p10.config.ts
 */

const { test, expect } = require('@playwright/test');
const fs   = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '../results/p10');
fs.mkdirSync(OUT, { recursive: true });

const BASE        = 'http://localhost:3098';
const TEST_REF    = 'MSR-20260921-99999';
const TEST_REF_B  = 'MSR-20260921-88888';
const RECEIPT_URL = `${BASE}/payment-success?ref=${TEST_REF}`;

// ── Mock builders ─────────────────────────────────────────────────────────────

function mockConfirmation(province) {
  return {
    orderRef:      TEST_REF,
    total:         60,
    paymentStatus: 'awaiting_payment',
    province,
  };
}

// ── Intercept helper ──────────────────────────────────────────────────────────

async function interceptWith(page, statusOrFn, bodyFn) {
  // statusOrFn: number (HTTP status) or function (route => void) for custom logic
  // bodyFn: optional — () => object (JSON body for success responses)
  let interceptCount = 0;

  if (typeof statusOrFn === 'function') {
    await page.route(`**/api/orders/${TEST_REF}`, async (route) => {
      interceptCount++;
      await statusOrFn(route);
    });
  } else {
    const status = statusOrFn;
    await page.route(`**/api/orders/${TEST_REF}`, async (route) => {
      interceptCount++;
      if (status >= 200 && status < 300 && bodyFn) {
        await route.fulfill({
          status,
          contentType: 'application/json',
          body: JSON.stringify(bodyFn()),
        });
      } else {
        await route.fulfill({
          status,
          contentType: 'application/json',
          body: JSON.stringify({ success: false, message: 'mocked error' }),
        });
      }
    });
  }

  // Block any stray POST to /api/orders to prevent accidental order creation
  await page.route('**/api/orders', async (route) => {
    await route.abort('blockedbyclient');
  });

  return () => interceptCount;
}

// ── Confirmed state helper ────────────────────────────────────────────────────

async function waitForConfirmed(page) {
  await page.waitForSelector('text=R60.00', { timeout: 10_000 });
}

// ── Tests ─────────────────────────────────────────────────────────────────────

test.describe('P10 receipt states — loading and error states', () => {

  // ── 1. Loading: held response ──────────────────────────────────────────────
  test('loading state: no confirmation heading, banking details or payment CTA while response is held', async ({ page }) => {
    let resolveResponse;
    const holdPromise = new Promise(r => { resolveResponse = r; });

    await page.route(`**/api/orders/${TEST_REF}`, async (route) => {
      await holdPromise;
      await route.fulfill({
        status:      200,
        contentType: 'application/json',
        body:        JSON.stringify(mockConfirmation('Cape Town Metro')),
      });
    });
    await page.route('**/api/orders', async (route) => { await route.abort('blockedbyclient'); });

    await page.goto(RECEIPT_URL);

    // Wait for loading indicator to confirm the page rendered in loading state
    await page.waitForSelector('[aria-label="Loading order details"]', { timeout: 10_000 });

    // Loading message must appear
    await expect(page.locator('text=Loading your order details')).toBeVisible();

    // None of these must be present while loading
    await expect(page.locator('h1:has-text("Is Confirmed")')).not.toBeVisible();
    await expect(page.locator('text="Banking Details"')).not.toBeVisible();
    await expect(page.locator('text=Send Proof of Payment via WhatsApp')).not.toBeVisible();
    await expect(page.locator('text=What Happens Next')).not.toBeVisible();

    // Release and verify confirmed state loads correctly
    resolveResponse();
    await waitForConfirmed(page);
    await expect(page.locator('h1:has-text("Is Confirmed")')).toBeVisible();
  });

  // ── 2. 401: no confirmed-order claims ──────────────────────────────────────
  test('401 response: access-error heading; no order-confirmed claims or payment instructions', async ({ page }) => {
    const getCount = await interceptWith(page, 401);

    await page.goto(RECEIPT_URL);

    // Access-error heading must appear
    await expect(
      page.locator("text=We couldn't verify access to this receipt.")
    ).toBeVisible({ timeout: 10_000 });

    // No confirmed-order claims
    await expect(page.locator('h1:has-text("Is Confirmed")')).not.toBeVisible();

    // No payment instructions
    await expect(page.locator('text="Banking Details"')).not.toBeVisible();
    await expect(page.locator('text=What Happens Next')).not.toBeVisible();
    await expect(page.locator('text=Amount Due')).not.toBeVisible();

    // No proof-of-payment CTA
    await expect(page.locator('text=Send Proof of Payment via WhatsApp')).not.toBeVisible();

    // Support CTA is present
    await expect(page.locator('text=Contact us about this order')).toBeVisible();

    expect(getCount(), 'interceptor ran').toBeGreaterThan(0);
  });

  // ── 3. 401: neutral support URL ───────────────────────────────────────────
  test('401 response: WhatsApp support URL is neutral and contains reference', async ({ page }) => {
    await interceptWith(page, 401);
    await page.goto(RECEIPT_URL);

    await expect(
      page.locator("text=We couldn't verify access to this receipt.")
    ).toBeVisible({ timeout: 10_000 });

    const contactLink = page.locator('a:has-text("Contact us about this order")');
    const href = await contactLink.getAttribute('href');

    expect(typeof href === 'string', 'contact link has href').toBe(true);
    expect(href, 'contact link uses WhatsApp').toContain('wa.me/27696863952');

    const url      = new URL(href);
    const msgText  = url.searchParams.get('text') ?? '';

    // Message must not claim the order is confirmed, placed or paid
    expect(msgText, 'contact message: no "placed an order" claim').not.toContain('placed an order');
    expect(msgText, 'contact message: no "proof of payment" claim').not.toContain('proof of payment');
    expect(msgText, 'contact message: no amount').not.toMatch(/R\d+/);

    // Validated reference may be included as context
    expect(msgText, 'contact message: contains reference').toContain(TEST_REF);

    console.log(`    [INFO] 401 contact message preview: ${msgText.substring(0, 150)}`);
  });

  // ── 4. Missing ref ─────────────────────────────────────────────────────────
  test('missing ref (?ref= absent): shows invalid-ref state', async ({ page }) => {
    // No interceptor needed — invalid ref skips the fetch
    await page.route('**/api/orders', async (route) => { await route.abort('blockedbyclient'); });

    await page.goto(`${BASE}/payment-success`);

    await expect(
      page.locator("text=This doesn't look like a valid receipt link.")
    ).toBeVisible({ timeout: 10_000 });

    await expect(page.locator('h1:has-text("Is Confirmed")')).not.toBeVisible();
    await expect(page.locator('text="Banking Details"')).not.toBeVisible();
    await expect(page.locator('text=Send Proof of Payment via WhatsApp')).not.toBeVisible();
  });

  // ── 5. Invalid ref format ──────────────────────────────────────────────────
  test('invalid ref format: shows invalid-ref state', async ({ page }) => {
    await page.route('**/api/orders/**', async (route) => { await route.abort('blockedbyclient'); });
    await page.route('**/api/orders',    async (route) => { await route.abort('blockedbyclient'); });

    await page.goto(`${BASE}/payment-success?ref=NOTAREF`);

    await expect(
      page.locator("text=This doesn't look like a valid receipt link.")
    ).toBeVisible({ timeout: 10_000 });

    await expect(page.locator('h1:has-text("Is Confirmed")')).not.toBeVisible();
  });

  // ── 6. 404: not-found state ────────────────────────────────────────────────
  test('404 response: shows not-found state', async ({ page }) => {
    const getCount = await interceptWith(page, 404);

    await page.goto(RECEIPT_URL);

    await expect(
      page.locator("text=We couldn't find this receipt.")
    ).toBeVisible({ timeout: 10_000 });

    await expect(page.locator('h1:has-text("Is Confirmed")')).not.toBeVisible();
    await expect(page.locator('text="Banking Details"')).not.toBeVisible();

    expect(getCount(), 'interceptor ran').toBeGreaterThan(0);
  });

  // ── 7. 500 server error ────────────────────────────────────────────────────
  test('500 response: shows error state with Try-again button', async ({ page }) => {
    const getCount = await interceptWith(page, 500);

    await page.goto(RECEIPT_URL);

    await expect(
      page.locator("text=We couldn't load your order details.")
    ).toBeVisible({ timeout: 10_000 });

    await expect(page.locator('button:has-text("Try again")')).toBeVisible();

    // No order-confirmed claims or payment instructions
    await expect(page.locator('h1:has-text("Is Confirmed")')).not.toBeVisible();
    await expect(page.locator('text="Banking Details"')).not.toBeVisible();
    await expect(page.locator('text=Send Proof of Payment via WhatsApp')).not.toBeVisible();

    expect(getCount(), 'interceptor ran').toBeGreaterThan(0);
  });

  // ── 8. Network error ──────────────────────────────────────────────────────
  test('network error: shows error state with Try-again button', async ({ page }) => {
    let interceptCount = 0;
    await page.route(`**/api/orders/${TEST_REF}`, async (route) => {
      interceptCount++;
      await route.abort('failed');
    });
    await page.route('**/api/orders', async (route) => { await route.abort('blockedbyclient'); });

    await page.goto(RECEIPT_URL);

    await expect(
      page.locator("text=We couldn't load your order details.")
    ).toBeVisible({ timeout: 10_000 });

    await expect(page.locator('button:has-text("Try again")')).toBeVisible();
    await expect(page.locator('h1:has-text("Is Confirmed")')).not.toBeVisible();

    expect(interceptCount > 0, 'interceptor ran').toBe(true);
  });

  // ── 9. Retry: first call fails, second succeeds ────────────────────────────
  test('retry: GET fails with 500 then succeeds — confirmed state reached', async ({ page }) => {
    let callCount = 0;
    await page.route(`**/api/orders/${TEST_REF}`, async (route) => {
      callCount++;
      if (callCount === 1) {
        await route.fulfill({
          status:      500,
          contentType: 'application/json',
          body:        JSON.stringify({ success: false }),
        });
      } else {
        await route.fulfill({
          status:      200,
          contentType: 'application/json',
          body:        JSON.stringify(mockConfirmation('Cape Town Metro')),
        });
      }
    });
    await page.route('**/api/orders', async (route) => { await route.abort('blockedbyclient'); });

    await page.goto(RECEIPT_URL);

    // First call fails — error state appears
    await expect(
      page.locator("text=We couldn't load your order details.")
    ).toBeVisible({ timeout: 10_000 });

    const retryBtn = page.locator('button:has-text("Try again")');
    await expect(retryBtn).toBeVisible();

    // Click retry — second call succeeds
    await retryBtn.click();

    // Loading state appears briefly, then confirmed state
    await waitForConfirmed(page);
    await expect(page.locator('h1:has-text("Is Confirmed")')).toBeVisible();
    await expect(page.locator('text="Banking Details"')).toBeVisible();

    expect(callCount, 'two API calls made (fail + retry)').toBe(2);
  });

});

test.describe('P10 receipt states — P9 confirmed-state regression', () => {

  // ── 10. Collection receipt ─────────────────────────────────────────────────
  test('confirmed collection receipt: shows collection copy (P9 regression)', async ({ page }) => {
    const getCount = await interceptWith(page, 200, () => mockConfirmation('Collection / Pickup'));
    await page.goto(RECEIPT_URL);
    await waitForConfirmed(page);

    await expect(page.locator('h1:has-text("Is Confirmed")')).toBeVisible();
    await expect(page.locator('text="Banking Details"')).toBeVisible();

    const steps = await page.locator('text=We confirm your payment').allTextContents();
    const step3 = steps.find(s => s.includes('We confirm'));
    expect(step3, 'step 3: collection copy').toContain('contact you to arrange collection');
    expect(step3, 'step 3: not delivery').not.toContain('arrange delivery');

    const footer = await page.locator('text=Please complete your payment').textContent();
    expect(footer, 'footer: collection').toContain('arrange your collection');

    expect(getCount(), 'interceptor ran').toBeGreaterThan(0);
  });

  // ── 11. Courier receipt ────────────────────────────────────────────────────
  test('confirmed courier receipt: shows delivery copy (P9 regression)', async ({ page }) => {
    const getCount = await interceptWith(page, 200, () => mockConfirmation('Cape Town Metro'));
    await page.goto(RECEIPT_URL);
    await waitForConfirmed(page);

    await expect(page.locator('h1:has-text("Is Confirmed")')).toBeVisible();

    const steps = await page.locator('text=We confirm your payment').allTextContents();
    const step3 = steps.find(s => s.includes('We confirm'));
    expect(step3, 'step 3: delivery copy').toContain('arrange delivery with care');
    expect(step3, 'step 3: not collection').not.toContain('collection');

    const footer = await page.locator('text=Please complete your payment').textContent();
    expect(footer, 'footer: delivery').toContain('arrange delivery');

    expect(getCount(), 'interceptor ran').toBeGreaterThan(0);
  });

});

test.describe('P10 receipt states — error-state mobile layout', () => {

  // ── 12–13. Error layout at 320px and 390px ─────────────────────────────────
  // Checks that error-state actions and footer text clear the FloatingAssist FAB
  // when scrolled to the bottom of the page.
  for (const [width, height] of [[320, 568], [390, 844]]) {
    test(`401 error layout at ${width}px: actions visible and not obscured by FAB`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await interceptWith(page, 401);

      await page.goto(RECEIPT_URL);

      await expect(
        page.locator("text=We couldn't verify access to this receipt.")
      ).toBeVisible({ timeout: 10_000 });

      // Scroll to absolute bottom
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(300);

      // Action buttons must exist and be visible
      const contactBtn = page.locator('a:has-text("Contact us about this order")');
      const shopBtn    = page.locator('a:has-text("Continue Shopping")');
      await expect(contactBtn).toBeVisible();
      await expect(shopBtn).toBeVisible();

      // FAB overlap check
      const fab     = page.locator('button[aria-label*="assistance"]');
      const fabBBox = await fab.boundingBox();

      if (fabBBox) {
        const contactBBox = await contactBtn.boundingBox();
        const shopBBox    = await shopBtn.boundingBox();

        const overlaps = (a, b) => !(
          a.x + a.width  < b.x ||
          b.x + b.width  < a.x ||
          a.y + a.height < b.y ||
          b.y + b.height < a.y
        );

        if (contactBBox) {
          expect(overlaps(contactBBox, fabBBox), `${width}px: Contact button does not overlap FAB`).toBe(false);
        }
        if (shopBBox) {
          expect(overlaps(shopBBox, fabBBox), `${width}px: Continue Shopping does not overlap FAB`).toBe(false);
        }

        // Heading must also be clear of FAB (it is scrolled above viewport, so gap should be fine)
        const heading = page.locator("text=We couldn't verify access to this receipt.").first();
        const headBBox = await heading.boundingBox();
        if (headBBox && headBBox.y + headBBox.height > 0) {
          const headGap = fabBBox.y - (headBBox.y + headBBox.height);
          // This gap is heading-to-FAB clearance, not action-button gap.
          console.log(`    [INFO] ${width}px — heading clearance from FAB: ${headGap.toFixed(0)}px`);
        }
      } else {
        console.log(`    [INFO] ${width}px: FAB not rendered in current UI state`);
      }
    });
  }

});

test.describe('P10 receipt states — reference binding and replay prevention', () => {

  // ── 14. Reference A→B isolation ───────────────────────────────────────────
  // Full-page navigation (the production path when a user changes the URL).
  // Verifies no data from ref A appears once the browser is on ref B.
  test('reference change: ref-A confirmed then ref-B held — no ref-A data or payment CTA under ref-B', async ({ page }) => {
    // Ref A: responds immediately (R60.00, Cape Town Metro)
    await page.route(`**/api/orders/${TEST_REF}`, async (route) => {
      await route.fulfill({
        status:      200,
        contentType: 'application/json',
        body:        JSON.stringify({ orderRef: TEST_REF, total: 60, paymentStatus: 'awaiting_payment', province: 'Cape Town Metro' }),
      });
    });

    // Ref B: response held
    let resolveB;
    const holdB = new Promise(r => { resolveB = r; });
    await page.route(`**/api/orders/${TEST_REF_B}`, async (route) => {
      await holdB;
      await route.fulfill({
        status:      200,
        contentType: 'application/json',
        body:        JSON.stringify({ orderRef: TEST_REF_B, total: 99, paymentStatus: 'awaiting_payment', province: null }),
      });
    });
    await page.route('**/api/orders', async (route) => { await route.abort('blockedbyclient'); });

    // Step 1: load ref A — confirmed
    await page.goto(`${BASE}/payment-success?ref=${TEST_REF}`);
    await page.waitForSelector('text=R60.00', { timeout: 10_000 });
    await expect(page.locator('h1:has-text("Is Confirmed")')).toBeVisible();

    // Step 2: navigate to ref B (held) — loading state
    await page.goto(`${BASE}/payment-success?ref=${TEST_REF_B}`);
    await page.waitForSelector('[aria-label="Loading order details"]', { timeout: 10_000 });

    // While ref B is loading: no ref-A data or payment CTA
    await expect(page.locator('text=R60.00')).not.toBeVisible();
    await expect(page.locator('text=Send Proof of Payment via WhatsApp')).not.toBeVisible();
    await expect(page.locator(`text=${TEST_REF}`)).not.toBeVisible();
    await expect(page.locator('h1:has-text("Is Confirmed")')).not.toBeVisible();

    // Release ref B → confirmed with ref-B data
    resolveB();
    await page.waitForSelector('text=R99.00', { timeout: 10_000 });
    await expect(page.locator('h1:has-text("Is Confirmed")')).toBeVisible();
    await expect(page.locator(`text=${TEST_REF_B}`).first()).toBeVisible();
  });

  // ── Helper: client-side navigate without a full page reload ──────────────
  // Plants window.__navSentinel = true before navigating. A full page reload
  // wipes window entirely; the sentinel surviving after waitForURL is the
  // proof that this is a genuine SPA transition, not a document reload.
  //
  // Mechanism: history.pushState changes the URL without reloading, then a
  // synthetic PopStateEvent causes Next.js App Router's popstate handler
  // (app-router.tsx) to re-navigate to the current location client-side.
  // When Next.js receives a popstate with null state it falls through to
  // router.navigate(location.pathname + location.search), which updates the
  // AppRouter context, re-renders useSearchParams consumers, and triggers the
  // key={orderRef} remount — all without a document reload.
  //
  // Why not an anchor click: programmatically created <a> elements clicked
  // from page.evaluate() in WebKit do not bubble to Next.js's interceptor and
  // cause a full page reload instead.
  async function clientNav(page, href) {
    await page.evaluate(() => { window.__navSentinel = true; });
    await page.evaluate((h) => {
      const url = new URL(h, window.location.origin);
      history.pushState(null, '', url.pathname + url.search);
      window.dispatchEvent(new PopStateEvent('popstate', { state: null }));
    }, href);
  }

  // ── 16. Client-side nav: A confirmed → B held ─────────────────────────────
  // key={orderRef} ensures the component remounts on ref change so no A
  // state (amount, fulfilment, payment CTA) can appear under B. Also verifies
  // recordPurchase is not called for B's pending key before B's own
  // confirmation succeeds.
  test('client-side nav: A confirmed → B held — no A data; purchase not fired before B confirms', async ({ page }) => {
    // Ref A: responds immediately (R60.00, Cape Town Metro)
    await page.route(`**/api/orders/${TEST_REF}`, async (route) => {
      await route.fulfill({
        status:      200,
        contentType: 'application/json',
        body:        JSON.stringify({ orderRef: TEST_REF, total: 60, paymentStatus: 'awaiting_payment', province: 'Cape Town Metro' }),
      });
    });

    // Ref B: held until released
    let resolveBFn;
    const holdB = new Promise(r => { resolveBFn = r; });
    await page.route(`**/api/orders/${TEST_REF_B}`, async (route) => {
      await holdB;
      await route.fulfill({
        status:      200,
        contentType: 'application/json',
        body:        JSON.stringify({ orderRef: TEST_REF_B, total: 99, paymentStatus: 'awaiting_payment', province: null }),
      });
    });
    await page.route('**/api/orders', async (route) => { await route.abort('blockedbyclient'); });

    // Step 1: full load of ref A → confirmed
    await page.goto(`${BASE}/payment-success?ref=${TEST_REF}`);
    await page.waitForSelector('text=R60.00', { timeout: 10_000 });
    await expect(page.locator('h1:has-text("Is Confirmed")')).toBeVisible();

    // Set a pending-purchase marker for B in localStorage (simulates a real checkout)
    await page.evaluate(([ref, val]) => {
      try { localStorage.setItem(`msr_purchase_pending_${ref}`, val); } catch {}
    }, [TEST_REF_B, JSON.stringify(['test-slug-b'])]);

    // Step 2: client-side navigate to ref B (response held)
    await clientNav(page, `/payment-success?ref=${TEST_REF_B}`);
    await page.waitForURL(`**?ref=${TEST_REF_B}`, { timeout: 10_000 });

    // Sentinel must survive: proves no page reload occurred
    const sentinelAfterNav16 = await page.evaluate(() => window.__navSentinel);
    expect(sentinelAfterNav16, 'SPA navigation: document not reloaded (sentinel survived)').toBe(true);

    await page.waitForSelector('[aria-label="Loading order details"]', { timeout: 10_000 });

    // While B is loading: no A data visible
    await expect(page.locator('text=R60.00')).not.toBeVisible();
    await expect(page.locator('text=Send Proof of Payment via WhatsApp')).not.toBeVisible();
    await expect(page.locator(`text=${TEST_REF}`)).not.toBeVisible();
    await expect(page.locator('h1:has-text("Is Confirmed")')).not.toBeVisible();

    // recordPurchase must not have fired yet — B's pending key still in localStorage
    const keyDuringLoad = await page.evaluate((ref) => {
      try { return localStorage.getItem(`msr_purchase_pending_${ref}`); } catch { return null; }
    }, TEST_REF_B);
    expect(keyDuringLoad, 'B pending key present — purchase not yet recorded').not.toBeNull();

    // Step 3: release B → confirmed
    resolveBFn();
    await page.waitForSelector('text=R99.00', { timeout: 10_000 });
    await expect(page.locator('h1:has-text("Is Confirmed")')).toBeVisible();
    await expect(page.locator(`text=${TEST_REF_B}`).first()).toBeVisible();

    // After B confirms: recordPurchase fires, pending key is removed
    await page.waitForFunction((ref) => {
      try { return localStorage.getItem(`msr_purchase_pending_${ref}`) === null; } catch { return false; }
    }, TEST_REF_B, { timeout: 5_000 });
    const keyAfterConfirm = await page.evaluate((ref) => {
      try { return localStorage.getItem(`msr_purchase_pending_${ref}`); } catch { return 'not-null'; }
    }, TEST_REF_B);
    expect(keyAfterConfirm, 'B pending key removed after confirmation').toBeNull();
  });

  // ── 17. Client-side nav: late A response cannot overwrite B ───────────────
  // A's fetch is pending when the user navigates client-side to B. key={orderRef}
  // unmounts A's instance (cleanup: stale=true + abort). B confirms quickly.
  // Releasing A's response late must not change B's confirmed state.
  test('client-side nav: A pending → B confirmed → release A late — B state unchanged', async ({ page }) => {
    let resolveAFn;
    const holdA = new Promise(r => { resolveAFn = r; });
    let aCallCount = 0;

    // Ref A: held (pending in-flight when navigation happens)
    await page.route(`**/api/orders/${TEST_REF}`, async (route) => {
      aCallCount++;
      await holdA;
      // This fulfill runs after B is already confirmed and A's component is unmounted.
      await route.fulfill({
        status:      200,
        contentType: 'application/json',
        body:        JSON.stringify({ orderRef: TEST_REF, total: 60, paymentStatus: 'awaiting_payment', province: 'Cape Town Metro' }),
      });
    });

    // Ref B: responds immediately with distinct amount
    await page.route(`**/api/orders/${TEST_REF_B}`, async (route) => {
      await route.fulfill({
        status:      200,
        contentType: 'application/json',
        body:        JSON.stringify({ orderRef: TEST_REF_B, total: 99, paymentStatus: 'awaiting_payment', province: null }),
      });
    });
    await page.route('**/api/orders', async (route) => { await route.abort('blockedbyclient'); });

    // Step 1: load ref A — stays in loading state (A is held).
    // waitForRequest ensures the route handler has been called (and is blocking
    // on holdA) before we assert aCallCount — the loading indicator can appear
    // before the fetch fires, so checking the count after waitForSelector alone
    // would be a race.
    await page.goto(`${BASE}/payment-success?ref=${TEST_REF}`);
    await page.waitForRequest(`**/api/orders/${TEST_REF}`, { timeout: 10_000 });
    await page.waitForSelector('[aria-label="Loading order details"]', { timeout: 10_000 });
    expect(aCallCount, 'A fetched once').toBe(1);

    // Step 2: client-side navigate to B while A is still pending
    await clientNav(page, `/payment-success?ref=${TEST_REF_B}`);
    await page.waitForURL(`**?ref=${TEST_REF_B}`, { timeout: 10_000 });

    // Sentinel must survive: proves no page reload occurred
    const sentinelAfterNav17 = await page.evaluate(() => window.__navSentinel);
    expect(sentinelAfterNav17, 'SPA navigation: document not reloaded (sentinel survived)').toBe(true);

    // B responds immediately → confirmed
    await page.waitForSelector('text=R99.00', { timeout: 10_000 });
    await expect(page.locator('h1:has-text("Is Confirmed")')).toBeVisible();
    await expect(page.locator(`text=${TEST_REF_B}`).first()).toBeVisible();

    // Step 3: release A's late response (stale + abort discard it)
    resolveAFn();
    await page.waitForTimeout(400);

    // B's confirmed state must be unchanged
    await expect(page.locator('text=R99.00')).toBeVisible();
    await expect(page.locator('text=R60.00')).not.toBeVisible();
    await expect(page.locator(`text=${TEST_REF_B}`).first()).toBeVisible();
    await expect(page.locator(`text=${TEST_REF}`)).not.toBeVisible();
    expect(page.url(), 'URL is still ref-B').toContain(TEST_REF_B);
  });

  // ── 15. Retry overlap prevention ─────────────────────────────────────────
  // Verifies the retry button is hidden during loading so repeated activation
  // cannot start overlapping receipt requests.
  test('retry: button hidden during loading — repeated activation not possible', async ({ page }) => {
    let callCount = 0;
    let resolveRetry;
    const holdRetry = new Promise(r => { resolveRetry = r; });

    await page.route(`**/api/orders/${TEST_REF}`, async (route) => {
      callCount++;
      if (callCount === 1) {
        await route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ success: false }) });
      } else {
        await holdRetry;
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockConfirmation('Cape Town Metro')) });
      }
    });
    await page.route('**/api/orders', async (route) => { await route.abort('blockedbyclient'); });

    await page.goto(RECEIPT_URL);

    // Error state — retry button visible
    await expect(page.locator("text=We couldn't load your order details.")).toBeVisible({ timeout: 10_000 });
    const retryBtn = page.locator('button:has-text("Try again")');
    await expect(retryBtn).toBeVisible();

    // Click retry — loading state appears
    await retryBtn.click();
    await page.waitForSelector('[aria-label="Loading order details"]', { timeout: 5_000 });

    // Retry button must not be visible during loading (cannot trigger overlap)
    await expect(retryBtn).not.toBeVisible();

    // Release retry response → confirmed
    resolveRetry();
    await waitForConfirmed(page);
    await expect(page.locator('h1:has-text("Is Confirmed")')).toBeVisible();

    expect(callCount, 'two total calls: initial 500 + one retry').toBe(2);
  });

});
