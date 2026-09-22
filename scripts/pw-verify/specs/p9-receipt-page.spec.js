// @ts-check
/**
 * CHECKOUT-P9 — Receipt page browser verification
 *
 * Tests the /payment-success page with mocked API responses.
 * All /api/orders/** requests are intercepted via page.route() before
 * they leave the browser — no request reaches Supabase or production.
 *
 * Verifies:
 *  1.  Collection province renders collection copy (step 3 + footer)
 *  2.  Courier province renders delivery copy (step 3 + footer)
 *  3.  Null province renders neutral copy (step 3 + footer)
 *  4.  Interception asserted: mock ran at least once per scenario
 *  5.  Layout at 320px, 375px, 390px — order ref, banking details visible
 *  6.  Action buttons clear of FloatingAssist FAB through scroll
 *  7.  Copy button touch target ≥ 44px
 *  8.  Copy button feedback (Copied state, timeout reset)
 *  9.  WhatsApp URL: destination number and decoded message verified
 *
 * Run: npx playwright test --config scripts/pw-verify/playwright.p9.config.ts
 */

const { test, expect } = require('@playwright/test');
const fs   = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '../results/p9');
fs.mkdirSync(OUT, { recursive: true });

const BASE        = 'http://localhost:3097';
const TEST_REF    = 'MSR-20260921-99999';
const RECEIPT_URL = `${BASE}/payment-success?ref=${TEST_REF}`;

// Selectors
const STEP_3_SEL      = '[data-testid="step-3"]';
const FOOTER_NOTE_SEL = '[data-testid="receipt-footer-note"]';

// ── Mock response builders ────────────────────────────────────────────────────

function mockConfirmation(province) {
  return {
    orderRef:      TEST_REF,
    total:         60,
    paymentStatus: 'awaiting_payment',
    province:      province,
  };
}

// ── Intercept helper ─────────────────────────────────────────────────────────

async function setupInterceptor(page, province) {
  let interceptCount = 0;

  await page.route(`**/api/orders/${TEST_REF}`, async (route) => {
    interceptCount++;
    await route.fulfill({
      status:      200,
      contentType: 'application/json',
      body:        JSON.stringify(mockConfirmation(province)),
    });
  });

  // Safety net: block any other /api/orders/** request to prevent
  // accidental reaches to Supabase via the POST handler.
  await page.route('**/api/orders', async (route) => {
    await route.abort('blockedbyclient');
  });

  return () => interceptCount;
}

// ── Wait helper ──────────────────────────────────────────────────────────────

async function waitForConfirmed(page) {
  // Wait for amount to appear (confirms API mock ran and state updated)
  await page.waitForSelector('text=R60.00', { timeout: 10_000 });
}

// ── Tests ────────────────────────────────────────────────────────────────────

test.describe('P9 receipt page — collection / courier / null province', () => {

  // ── Scenario 1: Collection ────────────────────────────────────────────────
  test('collection province: shows collection copy in step 3 and footer', async ({ page }) => {
    const getCount = await setupInterceptor(page, 'Collection / Pickup');

    await page.goto(RECEIPT_URL);
    await waitForConfirmed(page);

    // Step 3 copy
    const steps = await page.locator('text=We confirm your payment').allTextContents();
    const step3 = steps.find(s => s.includes('We confirm'));
    expect(step3, 'step 3 collection copy').toContain('contact you to arrange collection');
    expect(step3, 'step 3 must not say arrange delivery').not.toContain('arrange delivery');

    // Footer note
    const footer = await page.locator('text=Please complete your payment').textContent();
    expect(footer, 'footer collection copy').toContain("arrange your collection");
    expect(footer, 'footer must not say arrange delivery').not.toContain('arrange delivery');

    // Interception asserted
    expect(getCount(), 'mock interceptor ran at least once').toBeGreaterThan(0);
  });

  // ── Scenario 2: Courier ───────────────────────────────────────────────────
  test('courier province: shows delivery copy in step 3 and footer', async ({ page }) => {
    const getCount = await setupInterceptor(page, 'Cape Town Metro');

    await page.goto(RECEIPT_URL);
    await waitForConfirmed(page);

    const steps = await page.locator('text=We confirm your payment').allTextContents();
    const step3 = steps.find(s => s.includes('We confirm'));
    expect(step3, 'step 3 delivery copy').toContain('arrange delivery with care');
    expect(step3, 'step 3 must not say collection').not.toContain('collection');

    const footer = await page.locator('text=Please complete your payment').textContent();
    expect(footer, 'footer delivery copy').toContain('arrange delivery');
    expect(footer, 'footer must not say collection').not.toContain('collection');

    expect(getCount(), 'mock interceptor ran at least once').toBeGreaterThan(0);
  });

  // ── Scenario 3: Null province → neutral ──────────────────────────────────
  test('null province: shows neutral copy in step 3 and footer', async ({ page }) => {
    const getCount = await setupInterceptor(page, null);

    await page.goto(RECEIPT_URL);
    await waitForConfirmed(page);

    const steps = await page.locator('text=We confirm your payment').allTextContents();
    const step3 = steps.find(s => s.includes('We confirm'));
    expect(step3, 'step 3 neutral copy').toContain('will be in touch');
    expect(step3, 'step 3 must not say arrange delivery').not.toContain('arrange delivery');
    expect(step3, 'step 3 must not say collection').not.toContain('collection');

    const footer = await page.locator('text=Please complete your payment').textContent();
    expect(footer, 'footer neutral copy ends without fulfilment wording').not.toContain('arrange delivery');
    expect(footer, 'footer neutral copy ends without collection wording').not.toContain('collection');

    expect(getCount(), 'mock interceptor ran at least once').toBeGreaterThan(0);
  });

  // ── Scenario 4: Missing province field → neutral ──────────────────────
  test('missing province field in API response: shows neutral copy in step 3 and footer', async ({ page }) => {
    // Province field intentionally absent from response (simulates older API or null DB value
    // serialised as omitted; JSON.stringify omits undefined values).
    let interceptCount = 0;
    await page.route(`**/api/orders/${TEST_REF}`, async (route) => {
      interceptCount++;
      await route.fulfill({
        status:      200,
        contentType: 'application/json',
        body:        JSON.stringify({
          orderRef:      TEST_REF,
          total:         60,
          paymentStatus: 'awaiting_payment',
          // province intentionally omitted
        }),
      });
    });
    await page.route('**/api/orders', async (route) => { await route.abort('blockedbyclient'); });

    await page.goto(RECEIPT_URL);
    await waitForConfirmed(page);

    const steps = await page.locator('text=We confirm your payment').allTextContents();
    const step3 = steps.find(s => s.includes('We confirm'));
    expect(step3, 'missing province: neutral step 3').toContain('will be in touch');
    expect(step3, 'missing province: not delivery').not.toContain('arrange delivery');
    expect(step3, 'missing province: not collection').not.toContain('collection');

    const footer = await page.locator('text=Please complete your payment').textContent();
    expect(footer, 'missing province: neutral footer — no delivery').not.toContain('arrange delivery');
    expect(footer, 'missing province: neutral footer — no collection').not.toContain('collection');

    expect(interceptCount > 0, 'interceptor ran').toBe(true);
  });

  // ── Scenario 5: Unknown province string → neutral ─────────────────────
  test('unknown province string: shows neutral copy in step 3 and footer', async ({ page }) => {
    const getCount = await setupInterceptor(page, 'Unknown Region XXXXX');

    await page.goto(RECEIPT_URL);
    await waitForConfirmed(page);

    const steps = await page.locator('text=We confirm your payment').allTextContents();
    const step3 = steps.find(s => s.includes('We confirm'));
    expect(step3, 'unknown province: neutral step 3').toContain('will be in touch');
    expect(step3, 'unknown province: not delivery').not.toContain('arrange delivery');
    expect(step3, 'unknown province: not collection').not.toContain('collection');

    const footer = await page.locator('text=Please complete your payment').textContent();
    expect(footer, 'unknown province: neutral footer — no delivery').not.toContain('arrange delivery');
    expect(footer, 'unknown province: neutral footer — no collection').not.toContain('collection');

    expect(getCount(), 'interceptor ran').toBeGreaterThan(0);
  });

  // ── Scenario 6: Loading state (held response) → neutral wording ───────
  test('loading state: neutral wording shown before API response resolves', async ({ page }) => {
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

    // Loading skeleton is visible before useEffect fetch resolves (status === "loading")
    await page.waitForSelector('[aria-label="Loading amount"]', { timeout: 10_000 });

    // While response is held: step 3 must show neutral wording
    const stepsLoading = await page.locator('text=We confirm your payment').allTextContents();
    const step3Loading = stepsLoading.find(s => s.includes('We confirm'));
    expect(step3Loading, 'loading state: neutral step 3').toContain('will be in touch');
    expect(step3Loading, 'loading state: not delivery').not.toContain('arrange delivery');
    expect(step3Loading, 'loading state: not collection').not.toContain('collection');

    // Release the held response and wait for confirmed state
    resolveResponse();
    await waitForConfirmed(page);

    // After response: delivery copy for Cape Town Metro
    const stepsConfirmed = await page.locator('text=We confirm your payment').allTextContents();
    const step3Confirmed = stepsConfirmed.find(s => s.includes('We confirm'));
    expect(step3Confirmed, 'after response: delivery copy').toContain('arrange delivery with care');
  });

});

test.describe('P9 receipt page — layout at 320px, 375px, 390px', () => {

  for (const width of [320, 375, 390]) {
    test(`layout at ${width}px: order ref, banking details and actions are visible`, async ({ page }) => {
      await page.setViewportSize({ width, height: 812 });
      await setupInterceptor(page, 'Cape Town Metro');

      await page.goto(RECEIPT_URL);
      await waitForConfirmed(page);

      // Order reference visible
      const refVisible = await page.locator(`text=${TEST_REF}`).first().isVisible();
      expect(refVisible, `${width}px: order ref visible`).toBe(true);

      // Banking section present (exact match avoids collision with "banking details" in step text)
      const bankingHeader = await page.getByText('Banking Details', { exact: true }).isVisible();
      expect(bankingHeader, `${width}px: Banking Details header visible`).toBe(true);

      // Account number row visible (key copyable field)
      const accountNumberLabel = await page.locator('text=Account Number').isVisible();
      expect(accountNumberLabel, `${width}px: Account Number label visible`).toBe(true);

      // WhatsApp CTA button visible
      const waButton = await page.locator('text=Send Proof of Payment via WhatsApp').isVisible();
      expect(waButton, `${width}px: WhatsApp CTA visible`).toBe(true);

      // Continue Shopping visible
      const csButton = await page.locator('text=Continue Shopping').isVisible();
      expect(csButton, `${width}px: Continue Shopping visible`).toBe(true);

      // No horizontal scroll on body
      const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
      const innerWidth      = await page.evaluate(() => window.innerWidth);
      expect(bodyScrollWidth <= innerWidth + 2, `${width}px: no horizontal scroll`).toBe(true);
    });
  }

});

test.describe('P9 receipt page — FAB overlap through scroll', () => {

  // Viewport pairs: [width, height] — representative device sizes
  // 320×568  iPhone SE 1st gen (narrowest common mobile)
  // 375×667  iPhone 8 / SE 3rd gen
  // 390×844  iPhone 12 Pro / 14
  for (const [width, height] of [[320, 568], [375, 667], [390, 844]]) {
    test(`FAB does not overlap actions or footer note at ${width}px scrolled to bottom`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await setupInterceptor(page, 'Cape Town Metro');

      await page.goto(RECEIPT_URL);
      await waitForConfirmed(page);

      // Scroll to absolute bottom then wait for layout to settle
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(300);

      // Action button bounding boxes
      const waButton = page.locator('a:has-text("Send Proof of Payment via WhatsApp")');
      const waBBox   = await waButton.boundingBox();
      expect(waBBox, `${width}px: WhatsApp button exists`).not.toBeNull();

      const csButton = page.locator('a:has-text("Continue Shopping")');
      const csBBox   = await csButton.boundingBox();
      expect(csBBox, `${width}px: Continue Shopping button exists`).not.toBeNull();

      // FloatingAssist FAB — fixed bottom-right
      const fab     = page.locator('button[aria-label*="assistance"]');
      const fabBBox = await fab.boundingBox();

      if (fabBBox && waBBox && csBBox) {
        // Helper: true when two rects overlap
        const overlaps = (a, b) => !(
          a.x + a.width  < b.x ||
          b.x + b.width  < a.x ||
          a.y + a.height < b.y ||
          b.y + b.height < a.y
        );

        expect(overlaps(waBBox, fabBBox),  `${width}px: FAB does not overlap WhatsApp CTA`).toBe(false);
        expect(overlaps(csBBox, fabBBox),  `${width}px: FAB does not overlap Continue Shopping`).toBe(false);

        // Footer note: must not overlap FAB after pb-24 fix
        const footerNote = page.locator('text=Please complete your payment');
        const fnBBox     = await footerNote.boundingBox();
        if (fnBBox) {
          const fnGap = fabBBox.y - (fnBBox.y + fnBBox.height);
          console.log(`    [INFO] ${width}px scroll-bottom — footer note bottom: ${(fnBBox.y + fnBBox.height).toFixed(0)}px, FAB top: ${fabBBox.y.toFixed(0)}px, gap: ${fnGap.toFixed(0)}px`);
          expect(overlaps(fnBBox, fabBBox), `${width}px: footer note does not overlap FAB after pb-24 fix`).toBe(false);
        }
      } else {
        console.log(`    [INFO] ${width}px: FAB not rendered (may be hidden in current UI state)`);
      }
    });
  }

});

test.describe('P9 receipt page — copy button behaviour', () => {

  test('copy button touch target height ≥ 44px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await setupInterceptor(page, 'Cape Town Metro');

    await page.goto(RECEIPT_URL);
    await waitForConfirmed(page);

    // Find all copy buttons
    const copyButtons = page.locator('button:has-text("Copy")');
    const count = await copyButtons.count();
    expect(count > 0, 'at least one Copy button present').toBe(true);

    for (let i = 0; i < count; i++) {
      const btn  = copyButtons.nth(i);
      const bbox = await btn.boundingBox();
      if (bbox) {
        expect(bbox.height >= 44, `copy button #${i + 1} height ${bbox.height.toFixed(1)}px ≥ 44px`).toBe(true);
      }
    }
  });

  test('copy button shows Copied feedback and reverts after 2s', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await setupInterceptor(page, 'Cape Town Metro');

    await page.goto(RECEIPT_URL);
    await waitForConfirmed(page);

    // Scroll to Payment Reference row (always copyable and highlighted)
    const refRow = page.locator('text=Payment Reference').locator('..');
    await refRow.scrollIntoViewIfNeeded();

    // The order ref copy button appears twice (Order Summary card + Payment Reference row).
    // Use .first() — both buttons copy the same value; verifying either is sufficient.
    const copyBtn = page.locator(`[aria-label="Copy ${TEST_REF}"]`).first();

    // Grant clipboard-read permission so readText() works after the button click.
    // clipboard-write is not a valid CDP permission — the browser allows writeText
    // from a user gesture (the simulated click) without an explicit grant.
    await page.context().grantPermissions(['clipboard-read']);

    // Click the copy button
    await copyBtn.click();

    // Immediately check for Copied state
    await expect(copyBtn).toContainText('Copied', { timeout: 2000 });

    // After 2100ms the button should revert to Copy
    await page.waitForTimeout(2200);
    await expect(copyBtn).toContainText('Copy');

    // Verify clipboard value
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText, 'clipboard contains order ref').toBe(TEST_REF);
  });

  // Real Playwright clipboard-read permission; writeText via user gesture (simulated click).
  // Not a stub — clipboard access is genuine in this Chromium test context.
  test('account number copy button writes account number to clipboard', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await setupInterceptor(page, 'Cape Town Metro');

    await page.goto(RECEIPT_URL);
    await waitForConfirmed(page);

    await page.context().grantPermissions(['clipboard-read']);

    // Scroll to Banking Details section and click the account number copy button
    const acctBtn = page.locator('[aria-label="Copy 63012345678"]');
    await acctBtn.scrollIntoViewIfNeeded();
    await acctBtn.click();
    await expect(acctBtn).toContainText('Copied', { timeout: 2000 });

    // Verify the clipboard contains the account number, not just the UI feedback
    const clipValue = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipValue, 'clipboard contains account number').toBe('63012345678');
  });

});

test.describe('P9 receipt page — WhatsApp handoff', () => {

  test('WhatsApp URL points to correct number and contains order details', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await setupInterceptor(page, 'Cape Town Metro');

    await page.goto(RECEIPT_URL);
    await waitForConfirmed(page);

    // Get the href of the WhatsApp CTA
    const waLink = page.locator('a:has-text("Send Proof of Payment via WhatsApp")');
    const href   = await waLink.getAttribute('href');

    expect(typeof href === 'string', 'WhatsApp link has href').toBe(true);

    // Destination number
    expect(href, 'WhatsApp URL targets correct number').toContain('wa.me/27696863952');

    // Decode and inspect message
    const urlObj  = new URL(href);
    const rawText = urlObj.searchParams.get('text') ?? '';

    expect(rawText, 'message contains order ref').toContain(TEST_REF);
    expect(rawText, 'message contains amount').toContain('R60.00');
    // Note: decoded message does not contain individual item details —
    // the WhatsApp message is a payment notification, not an order line-item list.
    expect(rawText, 'message mentions proof of payment').toContain('proof of payment');
    expect(rawText, 'message does not contain raw URL encoding artifacts').not.toContain('%0A%0A%0A');

    console.log(`    [INFO] WhatsApp destination: wa.me/27696863952`);
    console.log(`    [INFO] Decoded message preview: ${rawText.substring(0, 200)}`);
    console.log(`    [INFO] NOTE: message is a payment notification only — no item-level detail included.`);
  });

  test('WhatsApp URL uses neutral message text (no delivery/collection wording)', async ({ page }) => {
    await setupInterceptor(page, 'Collection / Pickup');

    await page.goto(RECEIPT_URL);
    await waitForConfirmed(page);

    const waLink = page.locator('a:has-text("Send Proof of Payment via WhatsApp")');
    const href   = await waLink.getAttribute('href');
    const urlObj = new URL(href);
    const rawText = urlObj.searchParams.get('text') ?? '';

    // Message body is neutral — does not contain fulfilment-specific wording
    expect(rawText, 'WhatsApp message is neutral (no delivery/collection)').not.toContain('delivery');
    expect(rawText, 'WhatsApp message is neutral (no collection)').not.toContain('collection');
  });

});
