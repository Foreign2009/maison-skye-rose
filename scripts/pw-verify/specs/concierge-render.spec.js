// @ts-check
/**
 * Concierge Response Text — Browser Rendering Verification
 *
 * MOCKED RENDERING VERIFICATION — NOT A LIVE MODEL TEST.
 *
 * Intercepts POST /api/concierge with deterministic responses pre-computed
 * from the patched planResponse + formatResponse pipeline. No LLM is called.
 * Anthropic credentials are replaced in the webServer env.
 *
 * Asserts against the real Next.js Concierge UI (ConciergePanel + ConciergeMessage):
 *
 *   A. Single product, bold marker
 *      - Bubble text: canonical name, no [PRODUCT: marker, no orphaned ****
 *      - Product card: correct name and /product/{slug} href
 *
 *   B. Two products, both bold markers
 *      - Both product names in bubble text
 *      - Two cards with correct hrefs
 *
 *   C. Article marker + product
 *      - Article title in bubble text, no [ARTICLE: marker
 *      - Article card: correct title and /academy/{slug} href
 *      - Product name in bubble text, product card present
 *
 *   D. Mixed-marker order — non-bold before bold, cardTarget=1
 *      - First-mentioned product (non-bold) selected
 *      - One card rendered; it is the first-mentioned product
 *
 * Run:
 *   npx playwright test --config scripts/pw-verify/playwright.concierge-render.config.ts
 */

const { test, expect } = require('@playwright/test');
const fs   = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '../results/concierge-render');
fs.mkdirSync(OUT, { recursive: true });

const FIXTURES_PATH = path.join(__dirname, '../fixtures/concierge-render.json');
const FIXTURES      = JSON.parse(fs.readFileSync(FIXTURES_PATH, 'utf8'));

const BASE = 'http://localhost:3103';

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Opens the Concierge panel on the home page using the desktop floating button,
 * sets up the route interceptor, sends a message, and returns the panel locator.
 *
 * @param {import('@playwright/test').Page} page
 * @param {object} fixtureResponse  The JSON to return for POST /api/concierge
 * @param {string} messageText      The text to type into the message input
 * @returns {Promise<import('@playwright/test').Locator>} The dialog locator
 */
async function openAndSendMessage(page, fixtureResponse, messageText) {
  let interceptCount = 0;

  // Intercept BEFORE navigation so the route handler is registered early.
  await page.route('**/api/concierge', async (route) => {
    if (route.request().method() !== 'POST') {
      await route.continue();
      return;
    }
    interceptCount++;
    await route.fulfill({
      status:      200,
      contentType: 'application/json',
      body:        JSON.stringify(fixtureResponse),
    });
  });

  await page.goto(BASE);

  // Open concierge via desktop floating button
  const triggerBtn = page.getByRole('button', { name: 'Ask the Maison Concierge' });
  await expect(triggerBtn).toBeVisible({ timeout: 15_000 });
  await triggerBtn.click();

  const dialog = page.getByRole('dialog', { name: 'Maison Concierge' });
  await expect(dialog).toBeVisible({ timeout: 5_000 });

  // Type message and send
  const textarea = dialog.getByRole('textbox', { name: 'Message' });
  await textarea.fill(messageText);
  await dialog.getByRole('button', { name: 'Send' }).click();

  // Wait for the loading state to clear (bubble appears)
  // The loading indicator is three dots; wait for it to disappear then a bubble appears.
  await page.waitForFunction(() => {
    const dots = document.querySelector('.animate-bounce');
    return !dots;
  }, null, { timeout: 10_000 });

  // Ensure intercept ran
  expect(interceptCount).toBeGreaterThanOrEqual(1);

  return dialog;
}

// ── Scenario A: single product, bold marker ──────────────────────────────────

test('A: single product — canonical name in bubble, no marker, correct card', async ({ page }) => {
  const fixture = FIXTURES.scenarioA;
  // fixture.content: "I'd recommend Wood Sage Sea Salt Inspired — it has a coastal, mineral freshness."
  // fixture.fragrances[0].href: /product/wood-sage-sea-salt-inspired

  const dialog = await openAndSendMessage(page, fixture, 'Something coastal and mineral?');

  // Assert bubble text
  const bubble = dialog.locator('.rounded-tl-sm').last();
  await expect(bubble).toBeVisible({ timeout: 5_000 });

  const bubbleText = await bubble.textContent();

  expect(bubbleText, 'Canonical name present in bubble').toContain('Wood Sage Sea Salt Inspired');
  expect(bubbleText, 'No [PRODUCT: marker in bubble').not.toContain('[PRODUCT:');
  expect(bubbleText, 'No orphaned **** in bubble').not.toContain('****');

  // Assert product card link
  const card = dialog.locator('a[href="/product/wood-sage-sea-salt-inspired"]');
  await expect(card, 'Product card link present').toBeVisible();

  const cardText = await card.textContent();
  expect(cardText, 'Product card name matches').toContain('Wood Sage Sea Salt Inspired');
});

// ── Scenario B: two products, bold markers ────────────────────────────────────

test('B: two products — both names in bubble, two cards with correct hrefs', async ({ page }) => {
  const fixture = FIXTURES.scenarioB;
  // fixture.content: "Two great options: Wood Sage Sea Salt Inspired for freshness and Sauvage Inspired for bold presence."
  // fixture.fragrances[0].href: /product/wood-sage-sea-salt-inspired
  // fixture.fragrances[1].href: /product/sauvage-inspired

  const dialog = await openAndSendMessage(page, fixture, 'Give me two options — fresh or bold?');

  const bubble = dialog.locator('.rounded-tl-sm').last();
  await expect(bubble).toBeVisible({ timeout: 5_000 });

  const bubbleText = await bubble.textContent();

  expect(bubbleText, 'First product name in bubble').toContain('Wood Sage Sea Salt Inspired');
  expect(bubbleText, 'Second product name in bubble').toContain('Sauvage Inspired');
  expect(bubbleText, 'No [PRODUCT: marker').not.toContain('[PRODUCT:');
  expect(bubbleText, 'No orphaned ****').not.toContain('****');

  const card1 = dialog.locator('a[href="/product/wood-sage-sea-salt-inspired"]');
  const card2 = dialog.locator('a[href="/product/sauvage-inspired"]');
  await expect(card1, 'First product card present').toBeVisible();
  await expect(card2, 'Second product card present').toBeVisible();
});

// ── Scenario C: article marker + product ─────────────────────────────────────

test('C: article marker — title in bubble, no marker, article card with correct href', async ({ page }) => {
  const fixture = FIXTURES.scenarioC;
  // fixture.content: "You might find The Note Pyramid Explained helpful. For your profile I'd suggest Wood Sage Sea Salt Inspired."
  // fixture.articles[0].href: /academy/the-note-pyramid-explained
  // fixture.fragrances[0].href: /product/wood-sage-sea-salt-inspired

  const dialog = await openAndSendMessage(page, fixture, 'How do fragrances evolve over time?');

  const bubble = dialog.locator('.rounded-tl-sm').last();
  await expect(bubble).toBeVisible({ timeout: 5_000 });

  const bubbleText = await bubble.textContent();

  expect(bubbleText, 'Article title in bubble').toContain('The Note Pyramid Explained');
  expect(bubbleText, 'No [ARTICLE: marker').not.toContain('[ARTICLE:');
  expect(bubbleText, 'Product name also in bubble').toContain('Wood Sage Sea Salt Inspired');
  expect(bubbleText, 'No [PRODUCT: marker').not.toContain('[PRODUCT:');
  expect(bubbleText, 'No orphaned ****').not.toContain('****');

  const articleCard = dialog.locator('a[href="/academy/the-note-pyramid-explained"]');
  await expect(articleCard, 'Article card link present').toBeVisible();

  const articleCardText = await articleCard.textContent();
  expect(articleCardText, 'Article card title correct').toContain('The Note Pyramid Explained');

  const productCard = dialog.locator('a[href="/product/wood-sage-sea-salt-inspired"]');
  await expect(productCard, 'Product card present').toBeVisible();
});

// ── Scenario E: two paragraphs (LF separator) render as distinct blocks ──────

test('E: two paragraphs (LF) — each paragraph renders as a distinct visible block', async ({ page }) => {
  const fixture = FIXTURES.scenarioE;
  // fixture.content has \n\n (LF paragraph break) between two sentences.
  // ConciergeMessage splits on \r?\n\n and wraps each in <span class="block">.
  // Both paragraphs must be visible and vertically separated (distinct bounding boxes).

  const dialog = await openAndSendMessage(page, fixture, 'Tell me about Wood Sage Sea Salt?');

  const bubble = dialog.locator('.rounded-tl-sm').last();
  await expect(bubble).toBeVisible({ timeout: 5_000 });

  // Both paragraph texts must appear
  const bubbleText = await bubble.textContent();
  expect(bubbleText, 'First paragraph text present').toContain('coastal, mineral fragrance');
  expect(bubbleText, 'Second paragraph text present').toContain('sea-spray freshness');

  // Paragraph spans: ConciergeMessage renders each \n\n-separated block as span.block
  const paragraphSpans = bubble.locator('span.block');
  await expect(paragraphSpans, 'Two block spans rendered').toHaveCount(2);

  // Verify they are vertically separated — each span has its own bounding box
  const box0 = await paragraphSpans.nth(0).boundingBox();
  const box1 = await paragraphSpans.nth(1).boundingBox();
  expect(box0, 'First paragraph bounding box exists').not.toBeNull();
  expect(box1, 'Second paragraph bounding box exists').not.toBeNull();
  expect(box1.y, 'Second paragraph starts below first paragraph').toBeGreaterThan(box0.y);
});

// ── Scenario F: two paragraphs (CRLF separator) render as distinct blocks ────

test('F: two paragraphs (CRLF) — CRLF separator normalised; paragraphs render as distinct blocks', async ({ page }) => {
  const fixture = FIXTURES.scenarioF;
  // fixture.content has \r\n\r\n (CRLF paragraph break). ConciergeMessage splits on \r?\n\n.
  // Must render identically to LF case — CRLF must not prevent paragraph splitting.

  const dialog = await openAndSendMessage(page, fixture, 'Tell me more about this fragrance?');

  const bubble = dialog.locator('.rounded-tl-sm').last();
  await expect(bubble).toBeVisible({ timeout: 5_000 });

  const bubbleText = await bubble.textContent();
  expect(bubbleText, 'First paragraph text present (CRLF case)').toContain('coastal, mineral fragrance');
  expect(bubbleText, 'Second paragraph text present (CRLF case)').toContain('sea-spray freshness');

  const paragraphSpans = bubble.locator('span.block');
  await expect(paragraphSpans, 'Two block spans rendered (CRLF case)').toHaveCount(2);

  const box0 = await paragraphSpans.nth(0).boundingBox();
  const box1 = await paragraphSpans.nth(1).boundingBox();
  expect(box0, 'First paragraph bounding box exists (CRLF case)').not.toBeNull();
  expect(box1, 'Second paragraph bounding box exists (CRLF case)').not.toBeNull();
  expect(box1.y, 'Second paragraph starts below first (CRLF case)').toBeGreaterThan(box0.y);
});

// ── Scenario G: flat single-paragraph text renders without spurious blocks ───

test('G: flat text — single paragraph renders as one block, text preserved', async ({ page }) => {
  const fixture = FIXTURES.scenarioG;
  // No \n\n in content — the split produces a single element.
  // Must render without any extra spacing or missing text.

  const dialog = await openAndSendMessage(page, fixture, 'Give me a brief description?');

  const bubble = dialog.locator('.rounded-tl-sm').last();
  await expect(bubble).toBeVisible({ timeout: 5_000 });

  const bubbleText = await bubble.textContent();
  expect(bubbleText, 'Single paragraph text fully present').toContain('coastal, mineral fragrance');
  expect(bubbleText, 'No partial text — full sentence present').toContain('ideal for warmer months');

  const paragraphSpans = bubble.locator('span.block');
  await expect(paragraphSpans, 'Exactly one block span for flat text').toHaveCount(1);
});

// ── Scenario H: comparison paragraphs — 3 candidates + follow-up ─────────────
//
// Verifies that ConciergeMessage renders a deterministic comparison response
// (3 candidate rows + 1 follow-up, separated by \n\n) as 4 distinct <span class="block">
// elements — one per paragraph — with each candidate name in the correct span
// and the follow-up text in the last span.
//
// This is a browser-rendering verification (not a string-split formatting check).
// The mocked API response carries pre-computed content from buildDeterministicComparisonResponse.

test('H: comparison paragraphs — 3 candidate rows + follow-up render as 4 distinct block spans', async ({ page }) => {
  const fixture = FIXTURES.scenarioH;
  // content: "Sauvage Inspired: ...\n\nTerre d'Hermes Inspired: ...\n\nOud Wood Inspired: ...\n\nWhich of these fits what you had in mind?"

  const dialog = await openAndSendMessage(page, fixture, 'Compare these three fragrances?');

  const bubble = dialog.locator('.rounded-tl-sm').last();
  await expect(bubble).toBeVisible({ timeout: 5_000 });

  // 4 block spans: one per \n\n-separated paragraph
  const paragraphSpans = bubble.locator('span.block');
  await expect(paragraphSpans, '4 block spans rendered (3 candidate rows + 1 follow-up)').toHaveCount(4);

  // Each candidate name appears in its own span (in order)
  const span0 = paragraphSpans.nth(0);
  const span1 = paragraphSpans.nth(1);
  const span2 = paragraphSpans.nth(2);
  const span3 = paragraphSpans.nth(3);

  await expect(span0, 'First span: Sauvage Inspired').toContainText('Sauvage Inspired');
  await expect(span1, 'Second span: Terre d\'Hermes Inspired').toContainText("Terre d'Hermes Inspired");
  await expect(span2, 'Third span: Oud Wood Inspired').toContainText('Oud Wood Inspired');
  await expect(span3, 'Fourth span: follow-up question').toContainText('Which of these fits what you had in mind?');

  // Vertically ordered: each span starts below the previous one
  const box0 = await span0.boundingBox();
  const box1 = await span1.boundingBox();
  const box2 = await span2.boundingBox();
  const box3 = await span3.boundingBox();
  expect(box0, 'span 0 bounding box exists').not.toBeNull();
  expect(box1.y, 'span 1 starts below span 0').toBeGreaterThan(box0.y);
  expect(box2.y, 'span 2 starts below span 1').toBeGreaterThan(box1.y);
  expect(box3.y, 'span 3 starts below span 2').toBeGreaterThan(box2.y);
});

// ── Scenario D: mixed-marker order, cardTarget=1 ─────────────────────────────

test('D: mixed-marker order — first-mentioned (non-bold) selected at cardTarget=1', async ({ page }) => {
  const fixture = FIXTURES.scenarioD;
  // fixture.content: "I'd suggest Wood Sage Sea Salt Inspired for everyday and Sauvage Inspired for special occasions."
  // fixture.fragrances[0]: wood-sage-sea-salt-inspired (first mentioned in text)
  // cardTarget=1 → only one card

  const dialog = await openAndSendMessage(page, fixture, 'Something for everyday and one for events?');

  const bubble = dialog.locator('.rounded-tl-sm').last();
  await expect(bubble).toBeVisible({ timeout: 5_000 });

  const bubbleText = await bubble.textContent();

  expect(bubbleText, 'First product name in bubble').toContain('Wood Sage Sea Salt Inspired');
  expect(bubbleText, 'Second product name in bubble').toContain('Sauvage Inspired');
  expect(bubbleText, 'No markers in bubble').not.toContain('[PRODUCT:');

  // Only one card — and it is the FIRST-MENTIONED product (non-bold)
  const card1 = dialog.locator('a[href="/product/wood-sage-sea-salt-inspired"]');
  const card2 = dialog.locator('a[href="/product/sauvage-inspired"]');
  await expect(card1, 'First-mentioned product card present (cardTarget=1)').toBeVisible();
  await expect(card2, 'Second product card NOT present (cardTarget=1 cap)').not.toBeVisible();
});
