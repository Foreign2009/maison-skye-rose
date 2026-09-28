// @ts-check
/**
 * WhatsApp destination verification.
 *
 * Uses Playwright's request fixture (pure HTTP, no browser) to fetch
 * server-rendered HTML for static pages and assert that every WhatsApp
 * link points to 27502154734.
 *
 * Also asserts link behaviour:
 *   - Bare links (contact "Message Us", FAQ, Delivery) must NOT carry a
 *     ?text= parameter — they open a blank chat.
 *   - Prefilled links must carry their expected ?text= payload.
 *
 * Runs against the local dev server (port 3201, same as dispatch suite).
 * No production connections are made and no production data is modified.
 */

const { test, expect } = require("@playwright/test");

const BASE    = "http://localhost:3201";
const NUMBER  = "27502154734";

async function fetchHtml(request, path) {
  const res = await request.get(`${BASE}${path}`);
  expect(res.status(), `GET ${path} → 200`).toBe(200);
  return res.text();
}

/** Extract all href values whose content starts with https://wa.me/ */
function extractWaHrefs(html) {
  const matches = [...html.matchAll(/href="(https:\/\/wa\.me\/[^"]+)"/g)];
  return matches.map(m => m[1]);
}

// ── 1. Brand config: new number present, old number absent ───────────────────

test("brand.ts exports new WA number and not the old one", async ({ request }) => {
  // The brand number propagates into every SSR'd page. We verify it via the
  // contact page which renders the number in a <p> tag as well as in hrefs.
  const html = await fetchHtml(request, "/contact");

  expect(html, "new number present in page HTML").toContain(NUMBER);
  expect(html, "old number absent from page HTML").not.toContain("27696863952");
});

// ── 2. Contact page ──────────────────────────────────────────────────────────

test("contact page: 'Message Us' is a bare WA link (no ?text=)", async ({ request }) => {
  const html  = await fetchHtml(request, "/contact");
  const hrefs = extractWaHrefs(html);

  expect(hrefs.length, "at least one WA link on contact page").toBeGreaterThanOrEqual(1);

  // All WA links must target the new number
  for (const href of hrefs) {
    expect(href, `link targets new number: ${href}`).toContain(NUMBER);
    expect(href, `old number absent: ${href}`).not.toContain("27696863952");
  }

  // At least one bare link (no ?text=) must be present for "Message Us"
  const bareLinks = hrefs.filter(h => !h.includes("?text="));
  expect(bareLinks.length, "at least one bare WA link for 'Message Us'").toBeGreaterThanOrEqual(1);

  // At least one prefilled link must be present for "Request A Fragrance"
  const prefilledLinks = hrefs.filter(h => h.includes("?text="));
  expect(prefilledLinks.length, "at least one prefilled WA link for 'Request A Fragrance'").toBeGreaterThanOrEqual(1);

  // The prefilled link carries the fragrance enquiry opener
  const fragranceLink = prefilledLinks.find(h => h.includes("fragrance"));
  expect(fragranceLink, "prefilled link has fragrance enquiry text").toBeTruthy();
});

test("contact page: display number shows new number", async ({ request }) => {
  const html = await fetchHtml(request, "/contact");
  expect(html, "new formatted number in display text").toContain("+27 50 215 4734");
  expect(html, "old formatted number absent from display text").not.toContain("+27 69 686 3952");
});

// ── 3. FAQ page ──────────────────────────────────────────────────────────────

test("FAQ page: 'Chat On WhatsApp' is a bare WA link (no ?text=)", async ({ request }) => {
  const html  = await fetchHtml(request, "/faq");
  const hrefs = extractWaHrefs(html);

  expect(hrefs.length, "at least one WA link on FAQ page").toBeGreaterThanOrEqual(1);

  for (const href of hrefs) {
    expect(href, `link targets new number: ${href}`).toContain(NUMBER);
  }

  const bareLinks = hrefs.filter(h => !h.includes("?text="));
  expect(bareLinks.length, "FAQ Chat On WhatsApp is bare (no ?text=)").toBeGreaterThanOrEqual(1);
});

// ── 4. Delivery page ─────────────────────────────────────────────────────────

test("delivery page: 'Chat On WhatsApp' is a bare WA link (no ?text=)", async ({ request }) => {
  const html  = await fetchHtml(request, "/delivery");
  const hrefs = extractWaHrefs(html);

  expect(hrefs.length, "at least one WA link on delivery page").toBeGreaterThanOrEqual(1);

  for (const href of hrefs) {
    expect(href, `link targets new number: ${href}`).toContain(NUMBER);
  }

  const bareLinks = hrefs.filter(h => !h.includes("?text="));
  expect(bareLinks.length, "Delivery Chat On WhatsApp is bare (no ?text=)").toBeGreaterThanOrEqual(1);
});

// ── 5. Terms and Privacy: display number updated ─────────────────────────────

test("terms page: display number shows new number", async ({ request }) => {
  const html = await fetchHtml(request, "/terms");
  expect(html, "new number in terms page").toContain("+27 50 215 4734");
  expect(html, "old number absent from terms page").not.toContain("+27 69 686 3952");
});

test("privacy page: display number shows new number", async ({ request }) => {
  const html = await fetchHtml(request, "/privacy");
  expect(html, "new number in privacy page").toContain("+27 50 215 4734");
  expect(html, "old number absent from privacy page").not.toContain("+27 69 686 3952");
});

// ── 6. Wholesale page: display number updated ────────────────────────────────

test("wholesale page: display number shows new number", async ({ request }) => {
  const html = await fetchHtml(request, "/wholesale");
  expect(html, "new formatted number in wholesale page").toContain("+27 50 215 4734");
  expect(html, "old formatted number absent from wholesale page").not.toContain("+27 69 686 3952");
});

// ── 7. Old number absent site-wide (static pages) ────────────────────────────

test("old number absent from all audited static pages", async ({ request }) => {
  const pages = ["/contact", "/faq", "/delivery", "/terms", "/privacy", "/wholesale"];

  for (const path of pages) {
    const html = await fetchHtml(request, path);
    expect(html, `old number absent from ${path}`).not.toContain("27696863952");
    expect(html, `old formatted number absent from ${path}`).not.toContain("69 686 3952");
  }
});

// ── 8. Wholesale: intercepted window.open URL contains new number ─────────────
//
// The wholesale form builds the WA URL in JS and calls window.open — no <a>
// tag is rendered. We intercept window.open via page.evaluate to capture the
// generated URL and assert its destination.

test("wholesale: window.open receives new WA number in URL", async ({ browser }) => {
  const ctx  = await browser.newContext();
  const page = await ctx.newPage();

  await page.goto(`${BASE}/wholesale`);

  // Intercept window.open before the button is clicked
  await page.evaluate(() => {
    window.__capturedWaUrl = null;
    const origOpen = window.open;
    window.open = (url, ...rest) => {
      if (typeof url === "string" && url.includes("wa.me")) {
        window.__capturedWaUrl = url;
        return null; // prevent actual navigation
      }
      return origOpen(url, ...rest);
    };
  });

  // Fill the minimum required fields and click submit
  await page.fill('input[placeholder="Business Name"]',   "Test Boutique");
  await page.fill('input[placeholder="Contact Person"]',  "Test Person");
  await page.fill('input[placeholder="Phone Number"]',    "0811234567");
  await page.fill('input[placeholder="Email Address"]',   "test@example.com");
  await page.fill('input[placeholder="City / Province"]', "Cape Town");
  await page.fill('input[placeholder="Business Type"]',   "Boutique");
  await page.fill('input[placeholder="Estimated Monthly Volume"]', "50 units");

  await page.click('button:has-text("Submit Application")');

  const captured = await page.evaluate(() => window.__capturedWaUrl);
  expect(captured, "window.open was called with a WA URL").toBeTruthy();
  expect(captured, "wholesale WA URL targets new number").toContain(`wa.me/${NUMBER}`);
  expect(captured, "wholesale WA URL does not contain old number").not.toContain("27696863952");

  // Message content
  const url     = new URL(captured);
  const msgText = url.searchParams.get("text") ?? "";
  expect(msgText, "message contains business name").toContain("Test Boutique");
  expect(msgText, "message is wholesale application").toContain("WHOLESALE APPLICATION");

  await ctx.close();
});

// ── 9. Quiz: WA link hrefs rendered in the results panel use new number ───────
//
// The quiz renders two WA links once any answer is given:
//   - bare "Need Help Choosing?" (no ?text=)
//   - prefilled "Send My Results To WhatsApp" (includes matched titles)
//
// Clicking one answer is enough — recommendFragrances() produces results as
// soon as answers is non-empty.

test("quiz results: both WA links target new number with correct behaviour", async ({ browser }) => {
  const ctx  = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();

  await page.goto(`${BASE}/quiz`);

  // Wait for the quiz to mount — first question heading is always visible
  await expect(
    page.getByText("Who are you shopping for?"),
    "quiz first question visible"
  ).toBeVisible({ timeout: 15_000 });

  // Click "Male" — the first option of the first question.
  // This is enough to populate recommended[] and render the WA links.
  await page.getByRole("button", { name: "Male", exact: true }).click();

  // Wait for the WA links to appear
  const helpLink    = page.getByRole("link", { name: "Need Help Choosing?" });
  const resultsLink = page.getByRole("link", { name: "Send My Results To WhatsApp" });

  await expect(helpLink,    "bare WA link visible").toBeVisible({ timeout: 10_000 });
  await expect(resultsLink, "prefilled WA link visible").toBeVisible({ timeout: 10_000 });

  const bareHref      = await helpLink.getAttribute("href");
  const prefilledHref = await resultsLink.getAttribute("href");

  expect(bareHref,      "quiz bare WA link targets new number").toContain(`wa.me/${NUMBER}`);
  expect(bareHref,      "quiz bare WA link has no ?text=").not.toContain("?text=");
  expect(prefilledHref, "quiz prefilled WA link targets new number").toContain(`wa.me/${NUMBER}`);
  expect(prefilledHref, "quiz prefilled WA link has ?text=").toContain("?text=");
  expect(prefilledHref, "old number absent from prefilled link").not.toContain("27696863952");

  // Prefilled message should contain quiz results context (top match title)
  const msgText = new URL(prefilledHref).searchParams.get("text") ?? "";
  expect(msgText, "prefilled message contains Top Match label").toContain("Top Match");

  await ctx.close();
});
