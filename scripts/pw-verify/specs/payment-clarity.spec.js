/**
 * CHECKOUT-P11 — payment clarity (mobile 375px and desktop).
 *
 *  1.  Checkout explains EFT before Place Order; no "confirmed" claim; courier and collection
 *  2.  Place Order still submits the unchanged payload (server-checked totals) and opens the receipt
 *  3.  awaiting_payment receipt: "Has Been Received", payment outstanding, EFT steps, banking, WhatsApp proof
 *  4.  payment_confirmed / processing / dispatched / delivered: never described as unpaid
 *  5.  cancelled and unrecognised statuses: no payment request
 *  6.  FAQ describes the checkout + EFT journey and the separate WhatsApp option
 *
 * Every /api/orders request is intercepted: no order is created, nothing reaches a database,
 * no WhatsApp conversation is opened. Banking values come from the fictional config env.
 *
 * Run: npx playwright test --config scripts/pw-verify/playwright.payment-clarity.config.ts
 */

const { test, expect } = require('@playwright/test');
const fs   = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '../results/payment-clarity');
fs.mkdirSync(OUT, { recursive: true });

const TEST_REF = 'MSR-20261014-00001';
const FAKE_BANK = { name: 'Example Test Bank', account: '0000000000', branch: '000000' };
const PAYMENT_NOTE =
  "After placing your order, you'll receive our banking details, your order reference and the final amount due. " +
  "Use your order reference when making payment, then send your proof of payment via WhatsApp. " +
  "We'll process your order once payment has been verified.";
const ORDER_NOTE = 'Your order will be received when you select Place Order. Payment is still required before processing begins.';

// Waits for the receipt's entrance animations (up to 0.5s delay + 0.5s duration) before capturing.
const shot = async (page, name) => {
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUT, `${test.info().project.name}-${name}.png`), fullPage: true });
};

async function noHorizontalOverflow(page) {
  return page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);
}

async function blockOrderApi(page, receipt) {
  const posts = [];
  await page.route('**/api/orders', async (route) => {
    if (route.request().method() !== 'POST') return route.abort('blockedbyclient');
    posts.push(route.request().postDataJSON());
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, orderRef: TEST_REF }) });
  });
  await page.route(`**/api/orders/${TEST_REF}`, (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(receipt) }));
  return posts;
}

async function addOneThirtyMl(page) {
  await page.goto('/product/212-sexy-men-inspired', { waitUntil: 'networkidle' });
  await page.locator('button', { hasText: /^\s*30ml/ }).first().click();
  await page.getByRole('button', { name: 'Add To Cart' }).first().click();
  await page.waitForTimeout(800);
}

async function openReceipt(page, paymentStatus, province = 'Gauteng') {
  await blockOrderApi(page, { orderRef: TEST_REF, total: 430, paymentStatus, province });
  await page.goto(`/payment-success?ref=${TEST_REF}`, { waitUntil: 'networkidle' });
  await page.waitForSelector('text=R430.00', { timeout: 15_000 });
}

test.describe('Checkout — payment explained before Place Order', () => {
  test('courier: EFT note above Place Order; no premature confirmation; no overflow', async ({ page }) => {
    await blockOrderApi(page, {});
    await addOneThirtyMl(page);
    await page.goto('/checkout', { waitUntil: 'networkidle' });

    const note = page.getByTestId('checkout-payment-note');
    await expect(note).toBeVisible();
    await expect(note).toContainText('Payment by EFT');
    await expect(note).toContainText(PAYMENT_NOTE);
    await expect(page.getByTestId('checkout-order-note')).toHaveText(ORDER_NOTE);

    const noteBox = await note.boundingBox();
    const btnBox  = await page.getByRole('button', { name: 'Place Order' }).boundingBox();
    expect(noteBox.y + noteBox.height, 'EFT note sits above Place Order').toBeLessThanOrEqual(btnBox.y);

    const main = await page.locator('main').innerText();
    expect(main).not.toMatch(/confirmed the moment/i);
    expect(main).not.toMatch(/order is confirmed/i);
    expect(main, 'no banking details before ordering').not.toContain(FAKE_BANK.account);
    expect(main).not.toContain(FAKE_BANK.name);
    await expect(note.locator('input, button, [role="radio"]')).toHaveCount(0);

    await expect(page.locator('main')).toContainText(/Delivery\s*R100\.00/); // default area: Cape Town Metro
    expect(await noHorizontalOverflow(page)).toBe(true);
    await shot(page, 'checkout-courier');
  });

  test('collection: free collection row and collection note remain; EFT note present', async ({ page }) => {
    await blockOrderApi(page, {});
    await addOneThirtyMl(page);
    await page.goto('/checkout', { waitUntil: 'networkidle' });
    await page.locator('#checkout-province').selectOption({ label: 'Collection / Pickup' });
    await expect(page.getByText('Our team will confirm collection arrangements when they process your order.')).toBeVisible();
    await expect(page.locator('main')).toContainText(/Collection\s*FREE/);
    await expect(page.getByTestId('checkout-payment-note')).toBeVisible();
    expect(await noHorizontalOverflow(page)).toBe(true);
    await shot(page, 'checkout-collection');
  });

  test('Place Order submits the unchanged payload and opens the awaiting-payment receipt', async ({ page }) => {
    const posts = await blockOrderApi(page, { orderRef: TEST_REF, total: 430, paymentStatus: 'awaiting_payment', province: 'Gauteng' });
    await addOneThirtyMl(page);
    await page.goto('/checkout', { waitUntil: 'networkidle' });
    await page.locator('#checkout-name').fill('Test Customer');
    await page.locator('#checkout-phone').fill('0820000000');
    await page.locator('#checkout-address').fill('1 Example Street, Testville');
    await page.locator('#checkout-province').selectOption({ label: 'Gauteng' });
    await page.getByRole('button', { name: 'Place Order' }).click();
    await page.waitForURL(`**/payment-success?ref=${TEST_REF}`, { timeout: 20_000 });

    expect(posts).toHaveLength(1);
    const body = posts[0];
    expect(Object.keys(body).sort()).toEqual(['address', 'checkout_attempt_key', 'customer_name', 'items', 'phone', 'province', 'subtotal', 'delivery', 'total'].sort());
    expect([body.subtotal, body.delivery, body.total]).toEqual([250, 180, 430]);
    expect(body.items.map((i) => [i.id, i.size, i.quantity, i.price])).toEqual([['212-sexy-men-inspired', '30ml', 1, 250]]);
    await expect(page.getByRole('heading', { level: 1, name: /Has Been Received/ })).toBeVisible();
  });
});

test.describe('Receipt — wording follows payment status', () => {
  test('awaiting_payment: received, payment outstanding, EFT steps, banking and WhatsApp proof', async ({ page }) => {
    await openReceipt(page, 'awaiting_payment');
    await expect(page.getByRole('heading', { level: 1, name: /Your Order\s*Has Been Received/ })).toBeVisible();
    await expect(page.getByText('Order Received', { exact: true })).toBeVisible();
    await expect(page.getByTestId('receipt-state-mark')).toHaveAttribute('data-state', 'received');
    await expect(page.getByTestId('receipt-payment-status')).toHaveText('Payment status: Awaiting payment');
    await expect(page.getByText(/Payment is still outstanding/)).toBeVisible();
    await expect(page.getByText('What Happens Next')).toBeVisible();
    await expect(page.getByText('Complete your EFT using the banking details below.')).toBeVisible();
    await expect(page.getByText('Amount Due')).toBeVisible();
    await expect(page.getByText('Banking Details', { exact: true })).toBeVisible();
    await expect(page.getByText(FAKE_BANK.account)).toBeVisible();
    await expect(page.getByRole('button', { name: `Copy ${FAKE_BANK.account}` })).toBeVisible();
    await expect(page.getByRole('button', { name: `Copy ${TEST_REF}` }).first()).toBeVisible();

    const wa = page.locator('a:has-text("Send Proof of Payment via WhatsApp")');
    await expect(wa).toBeVisible();
    const href = decodeURIComponent(await wa.getAttribute('href'));
    expect(href).toContain(`Order Reference: ${TEST_REF}`);
    expect(href).toContain('Amount: R430.00');

    const footer = page.getByTestId('receipt-footer-note');
    await expect(footer).toHaveText("Please complete your payment within 24 hours. Once your payment has been verified, we'll be in touch to arrange delivery.");
    const text = await page.locator('main').innerText();
    expect(text).not.toMatch(/Is Confirmed|Order Confirmed|secure your order/);
    expect(await noHorizontalOverflow(page)).toBe(true);
    await shot(page, 'receipt-awaiting-payment');
  });

  const UNPAID_WORDING = ['Awaiting payment', 'Amount Due', 'Payment is still outstanding', 'Complete your EFT', 'Banking Details', 'Send Proof of Payment', 'Please complete your payment'];

  // [status, province, status label, exact message, phrases the stage must never claim]
  const LIFECYCLE = [
    ['payment_confirmed', 'Collection / Pickup', 'Payment verified',
      "Thank you — your payment has been confirmed and your order will now move into preparation. We'll be in touch to arrange your collection.",
      [/dispatched/i, /delivered/i, /being prepared/i]],
    ['payment_confirmed', 'Gauteng', 'Payment verified',
      "Thank you — your payment has been confirmed and your order will now move into preparation. We'll be in touch to arrange delivery.",
      [/dispatched/i, /delivered/i, /being prepared/i]],
    ['processing', 'Gauteng', 'Payment verified · Being prepared',
      "Thank you — your payment has been verified and your order is being prepared. We'll be in touch to arrange delivery.",
      [/dispatched/i, /delivered/i]],
    ['processing', 'Collection / Pickup', 'Payment verified · Being prepared',
      "Thank you — your payment has been verified and your order is being prepared. We'll be in touch to arrange your collection.",
      [/dispatched/i, /delivered/i]],
    ['dispatched', 'Gauteng', 'Payment verified · Dispatched',
      'Thank you — your payment has been verified and your order has been dispatched. If you have any questions about your order, please contact us.',
      [/arrange delivery/i, /arrange your collection/i, /being prepared/i, /move into preparation/i, /tracking/i, /recorded as delivered/i]],
    ['delivered', 'Gauteng', 'Payment verified · Delivered',
      "Thank you — your payment has been verified and your order is recorded as delivered. If anything isn't right, please contact us.",
      [/arrange delivery/i, /arrange your collection/i, /being prepared/i, /move into preparation/i, /has been dispatched/i]],
  ];

  for (const [status, province, label, message, never] of LIFECYCLE) {
    const where = province === 'Collection / Pickup' ? 'collection' : 'courier';
    test(`${status} (${where}): accurate stage wording, payment never shown as outstanding`, async ({ page }) => {
      await openReceipt(page, status, province);
      await expect(page.getByTestId('receipt-state-mark')).toHaveAttribute('data-state', 'received');
      await expect(page.getByTestId('receipt-payment-status')).toHaveText(`Payment status: ${label}`);
      await expect(page.getByText(message, { exact: true })).toBeVisible();
      await expect(page.getByText('Order Total')).toBeVisible();
      const text = await page.locator('main').innerText();
      const intro = message;
      for (const re of never) expect(intro, `${status} message must not match ${re}`).not.toMatch(re);
      for (const unpaid of UNPAID_WORDING) expect(text, `${status} must not say "${unpaid}"`).not.toContain(unpaid);
      expect(text).not.toContain(FAKE_BANK.account);
      await expect(page.locator('a:has-text("Contact us about this order")')).toBeVisible();
      expect(await noHorizontalOverflow(page)).toBe(true);
      if (where === 'courier' || status === 'payment_confirmed') await shot(page, `receipt-${status}-${where}`);
    });
  }

  test('cancelled: neutral mark (no green tick), cancelled heading, support guidance, no payment request', async ({ page }) => {
    await openReceipt(page, 'cancelled');
    const mark = page.getByTestId('receipt-state-mark');
    await expect(mark).toHaveAttribute('data-state', 'neutral');
    await expect(mark).not.toContainText('✓');
    expect(await mark.evaluate((el) => getComputedStyle(el).backgroundColor), 'not the green success circle').not.toBe('rgb(223, 246, 228)');
    await expect(page.getByText('Order Cancelled', { exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { level: 1, name: /This Order\s*Has Been Cancelled/ })).toBeVisible();
    await expect(page.getByText('Order Received', { exact: true })).toHaveCount(0);
    await expect(page.getByTestId('receipt-payment-status')).toHaveText('Payment status: Cancelled');
    await expect(page.getByText('This order has been cancelled. If you have already paid, or believe this is a mistake, please contact us.')).toBeVisible();
    const text = await page.locator('main').innerText();
    for (const unpaid of UNPAID_WORDING) expect(text, `cancelled must not say "${unpaid}"`).not.toContain(unpaid);
    expect(text).not.toContain(FAKE_BANK.account);
    await expect(page.locator('a:has-text("Contact us about this order")')).toBeVisible();
    expect(await noHorizontalOverflow(page)).toBe(true);
    await shot(page, 'receipt-cancelled');
  });

  test('unrecognised status: neutral, asks to contact us, infers nothing about payment', async ({ page }) => {
    await openReceipt(page, 'on_hold_unrecognised');
    await expect(page.getByTestId('receipt-state-mark')).toHaveAttribute('data-state', 'neutral');
    await expect(page.getByTestId('receipt-payment-status')).toHaveText('Payment status: Please contact us');
    await expect(page.getByText("We couldn't confirm the payment status of this order. Please contact us before making a payment.")).toBeVisible();
    const text = await page.locator('main').innerText();
    for (const claim of [...UNPAID_WORDING, 'Payment verified', 'has been verified', 'Cancelled']) expect(text, `unknown must not say "${claim}"`).not.toContain(claim);
    await expect(page.locator('a:has-text("Contact us about this order")')).toBeVisible();
  });
});

test.describe('FAQ — order journey', () => {
  test('describes checkout, EFT, proof via WhatsApp, and the separate WhatsApp option', async ({ page }) => {
    await page.goto('/faq', { waitUntil: 'networkidle' });
    const text = await page.locator('body').innerText();
    expect(text).toContain("Add your fragrances to your cart and select Checkout. Enter your details and place your order. You'll receive our banking details and an order reference for EFT payment, then you can send your proof of payment via WhatsApp. We'll confirm payment before processing your order.");
    expect(text).toContain('select Order via WhatsApp in your cart and our team will help you complete your order personally.');
    expect(text).not.toContain('complete checkout through WhatsApp');
  });
});
