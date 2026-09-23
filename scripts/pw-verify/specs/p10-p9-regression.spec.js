// @ts-check
/**
 * P9 confirmed-state regression — run against P10 dev server (port 3098)
 *
 * This is the P9 receipt-page suite re-targeted at the P10 implementation.
 * All P9 assertions are preserved except Scenario 6 (loading state), which
 * is updated to reflect the deliberate P10 change: the page now shows an
 * explicit loading indicator during fetch, with no confirmed-state content
 * until the API responds. The P9 behaviour was to show a skeleton with
 * neutral step-3 copy while loading; P10 suppresses all confirmed content.
 *
 * Run: npx playwright test --config scripts/pw-verify/playwright.p10-p9reg.config.ts
 */

const { test, expect } = require('@playwright/test');
const fs   = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '../results/p10-p9reg');
fs.mkdirSync(OUT, { recursive: true });

// PORT 3098 — P10 dev server (distinct from P9's 3097)
const BASE        = 'http://localhost:3098';
const TEST_REF    = 'MSR-20260921-99999';
const RECEIPT_URL = `${BASE}/payment-success?ref=${TEST_REF}`;

function mockConfirmation(province) {
  return {
    orderRef:      TEST_REF,
    total:         60,
    paymentStatus: 'awaiting_payment',
    province,
  };
}

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
  await page.route('**/api/orders', async (route) => { await route.abort('blockedbyclient'); });
  return () => interceptCount;
}

async function waitForConfirmed(page) {
  await page.waitForSelector('text=R60.00', { timeout: 10_000 });
}

// ── Province / fulfilment copy ───────────────────────────────────────────────

test.describe('P9 regression — collection / courier / null province', () => {

  test('collection province: shows collection copy in step 3 and footer', async ({ page }) => {
    const getCount = await setupInterceptor(page, 'Collection / Pickup');
    await page.goto(RECEIPT_URL);
    await waitForConfirmed(page);

    const steps = await page.locator('text=We confirm your payment').allTextContents();
    const step3 = steps.find(s => s.includes('We confirm'));
    expect(step3, 'step 3 collection copy').toContain('contact you to arrange collection');
    expect(step3, 'step 3 must not say arrange delivery').not.toContain('arrange delivery');

    const footer = await page.locator('text=Please complete your payment').textContent();
    expect(footer, 'footer collection copy').toContain("arrange your collection");
    expect(footer, 'footer must not say arrange delivery').not.toContain('arrange delivery');

    expect(getCount(), 'mock interceptor ran at least once').toBeGreaterThan(0);
  });

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
    expect(footer, 'footer neutral — no delivery').not.toContain('arrange delivery');
    expect(footer, 'footer neutral — no collection').not.toContain('collection');

    expect(getCount(), 'mock interceptor ran at least once').toBeGreaterThan(0);
  });

  test('missing province field: shows neutral copy in step 3 and footer', async ({ page }) => {
    let interceptCount = 0;
    await page.route(`**/api/orders/${TEST_REF}`, async (route) => {
      interceptCount++;
      await route.fulfill({
        status:      200,
        contentType: 'application/json',
        body:        JSON.stringify({ orderRef: TEST_REF, total: 60, paymentStatus: 'awaiting_payment' }),
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

  // P10 change: loading state now shows an explicit loading indicator rather
  // than neutral confirmed-state skeleton copy. Only this test is updated;
  // all confirmed-state assertions below are unchanged from P9.
  test('loading state: loading indicator shown; confirmed content absent until API responds', async ({ page }) => {
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

    // P10: loading state — explicit indicator, no confirmed content
    await page.waitForSelector('[aria-label="Loading order details"]', { timeout: 10_000 });
    await expect(page.locator('text=Loading your order details')).toBeVisible();

    // P10: no confirmed-state content shown during loading
    await expect(page.locator('text=We confirm your payment')).not.toBeVisible();
    await expect(page.locator('text="Banking Details"')).not.toBeVisible();
    await expect(page.locator('text=Send Proof of Payment via WhatsApp')).not.toBeVisible();

    // Release → confirmed with delivery copy (Cape Town Metro)
    resolveResponse();
    await waitForConfirmed(page);

    const stepsConfirmed = await page.locator('text=We confirm your payment').allTextContents();
    const step3Confirmed = stepsConfirmed.find(s => s.includes('We confirm'));
    expect(step3Confirmed, 'after response: delivery copy').toContain('arrange delivery with care');
  });

});

// ── Layout ───────────────────────────────────────────────────────────────────

test.describe('P9 regression — layout at 320px, 375px, 390px', () => {

  for (const width of [320, 375, 390]) {
    test(`layout at ${width}px: order ref, banking details and actions visible`, async ({ page }) => {
      await page.setViewportSize({ width, height: 812 });
      await setupInterceptor(page, 'Cape Town Metro');

      await page.goto(RECEIPT_URL);
      await waitForConfirmed(page);

      const refVisible = await page.locator(`text=${TEST_REF}`).first().isVisible();
      expect(refVisible, `${width}px: order ref visible`).toBe(true);

      const bankingHeader = await page.getByText('Banking Details', { exact: true }).isVisible();
      expect(bankingHeader, `${width}px: Banking Details header visible`).toBe(true);

      const accountNumberLabel = await page.locator('text=Account Number').isVisible();
      expect(accountNumberLabel, `${width}px: Account Number label visible`).toBe(true);

      const waButton = await page.locator('text=Send Proof of Payment via WhatsApp').isVisible();
      expect(waButton, `${width}px: WhatsApp CTA visible`).toBe(true);

      const csButton = await page.locator('text=Continue Shopping').isVisible();
      expect(csButton, `${width}px: Continue Shopping visible`).toBe(true);

      const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
      const innerWidth      = await page.evaluate(() => window.innerWidth);
      expect(bodyScrollWidth <= innerWidth + 2, `${width}px: no horizontal scroll`).toBe(true);
    });
  }

});

// ── FAB overlap ───────────────────────────────────────────────────────────────

test.describe('P9 regression — FAB overlap through scroll', () => {

  for (const [width, height] of [[320, 568], [375, 667], [390, 844]]) {
    test(`FAB does not overlap actions or footer note at ${width}px scrolled to bottom`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await setupInterceptor(page, 'Cape Town Metro');

      await page.goto(RECEIPT_URL);
      await waitForConfirmed(page);

      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(300);

      const waButton = page.locator('a:has-text("Send Proof of Payment via WhatsApp")');
      const waBBox   = await waButton.boundingBox();
      expect(waBBox, `${width}px: WhatsApp button exists`).not.toBeNull();

      const csButton = page.locator('a:has-text("Continue Shopping")');
      const csBBox   = await csButton.boundingBox();
      expect(csBBox, `${width}px: Continue Shopping button exists`).not.toBeNull();

      const fab     = page.locator('button[aria-label*="assistance"]');
      const fabBBox = await fab.boundingBox();

      if (fabBBox && waBBox && csBBox) {
        const overlaps = (a, b) => !(
          a.x + a.width  < b.x ||
          b.x + b.width  < a.x ||
          a.y + a.height < b.y ||
          b.y + b.height < a.y
        );
        expect(overlaps(waBBox, fabBBox),  `${width}px: FAB does not overlap WhatsApp CTA`).toBe(false);
        expect(overlaps(csBBox, fabBBox),  `${width}px: FAB does not overlap Continue Shopping`).toBe(false);

        const footerNote = page.locator('text=Please complete your payment');
        const fnBBox     = await footerNote.boundingBox();
        if (fnBBox) {
          // gap is between footer note bottom edge and FAB top edge
          const fnGap = fabBBox.y - (fnBBox.y + fnBBox.height);
          console.log(`    [INFO] ${width}px — footer note gap from FAB: ${fnGap.toFixed(0)}px`);
          expect(overlaps(fnBBox, fabBBox), `${width}px: footer note does not overlap FAB`).toBe(false);
        }
      } else {
        console.log(`    [INFO] ${width}px: FAB not rendered`);
      }
    });
  }

});

// ── Copy buttons ──────────────────────────────────────────────────────────────

test.describe('P9 regression — copy button behaviour', () => {

  test('copy button touch target height ≥ 44px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await setupInterceptor(page, 'Cape Town Metro');

    await page.goto(RECEIPT_URL);
    await waitForConfirmed(page);

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

    const refRow = page.locator('text=Payment Reference').locator('..');
    await refRow.scrollIntoViewIfNeeded();

    const copyBtn = page.locator(`[aria-label="Copy ${TEST_REF}"]`).first();
    await page.context().grantPermissions(['clipboard-read']);

    await copyBtn.click();
    await expect(copyBtn).toContainText('Copied', { timeout: 2000 });

    await page.waitForTimeout(2200);
    await expect(copyBtn).toContainText('Copy');

    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText, 'clipboard contains order ref').toBe(TEST_REF);
  });

  test('account number copy button writes account number to clipboard', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await setupInterceptor(page, 'Cape Town Metro');

    await page.goto(RECEIPT_URL);
    await waitForConfirmed(page);

    await page.context().grantPermissions(['clipboard-read']);

    const acctBtn = page.locator('[aria-label="Copy 63012345678"]');
    await acctBtn.scrollIntoViewIfNeeded();
    await acctBtn.click();
    await expect(acctBtn).toContainText('Copied', { timeout: 2000 });

    const clipValue = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipValue, 'clipboard contains account number').toBe('63012345678');
  });

});

// ── WhatsApp handoff ──────────────────────────────────────────────────────────

test.describe('P9 regression — WhatsApp handoff', () => {

  test('WhatsApp URL points to correct number and contains order details', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await setupInterceptor(page, 'Cape Town Metro');

    await page.goto(RECEIPT_URL);
    await waitForConfirmed(page);

    const waLink = page.locator('a:has-text("Send Proof of Payment via WhatsApp")');
    const href   = await waLink.getAttribute('href');
    expect(typeof href === 'string', 'WhatsApp link has href').toBe(true);

    expect(href, 'WhatsApp URL targets correct number').toContain('wa.me/27696863952');

    const urlObj  = new URL(href);
    const rawText = urlObj.searchParams.get('text') ?? '';
    expect(rawText, 'message contains order ref').toContain(TEST_REF);
    expect(rawText, 'message contains amount').toContain('R60.00');
    expect(rawText, 'message mentions proof of payment').toContain('proof of payment');
    expect(rawText, 'no raw URL encoding artifacts').not.toContain('%0A%0A%0A');

    console.log(`    [INFO] WhatsApp destination: wa.me/27696863952`);
    console.log(`    [INFO] Decoded message preview: ${rawText.substring(0, 200)}`);
  });

  test('WhatsApp URL uses neutral message (no delivery/collection wording)', async ({ page }) => {
    await setupInterceptor(page, 'Collection / Pickup');
    await page.goto(RECEIPT_URL);
    await waitForConfirmed(page);

    const waLink = page.locator('a:has-text("Send Proof of Payment via WhatsApp")');
    const href   = await waLink.getAttribute('href');
    const rawText = new URL(href).searchParams.get('text') ?? '';
    expect(rawText, 'WhatsApp message is neutral — no delivery').not.toContain('delivery');
    expect(rawText, 'WhatsApp message is neutral — no collection').not.toContain('collection');
  });

});
