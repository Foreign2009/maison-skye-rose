// @ts-check
/**
 * P3 browser acceptance — ProductCard navigation (P3D).
 *
 * ProductCard image and heading links must point at authoritative catalogue
 * slugs. The governed Capri exception must open /product/capri-lemon-sugar-inspired
 * from every surface; unaffected fragrances keep their existing URLs; the
 * historical title-derived Capri URL stays unresolved (no redirect exists).
 *
 * The catalogue slug set is read (read-only) from the `slug:` declarations in
 * app/lib/mkc/native/*.ts. No order request is expected in this spec: any
 * /api/* or external request fails the test.
 *
 * Recommendation-driven surfaces are not forced: when Capri is not surfaced,
 * the Capri-specific test is reported as SKIPPED "NOT EXERCISED" — never a pass.
 *
 * Run only via: scripts/pw-verify/playwright.p3-acceptance.config.ts
 */

const fs   = require("fs");
const path = require("path");
const base = require("@playwright/test");
const { expect } = base;

// ── Network guard (installed before the first navigation of every test) ──────

const APP_ORIGIN = "http://127.0.0.1:3110";

const test = base.test.extend({
  net: [async ({ context }, use) => {
    const net = { unexpected: [] };
    await context.route("**/*", async (route) => {
      const req = route.request();
      let url;
      try { url = new URL(req.url()); } catch {
        net.unexpected.push(`UNPARSEABLE ${req.url()}`);
        return route.abort("blockedbyclient");
      }
      if (url.origin !== APP_ORIGIN) {
        net.unexpected.push(`EXTERNAL ${req.method()} ${url.origin}${url.pathname}`);
        return route.abort("blockedbyclient");
      }
      if (url.pathname.startsWith("/api/")) {
        net.unexpected.push(`UNEXPECTED API ${req.method()} ${url.pathname}`);
        return route.abort("blockedbyclient");
      }
      return route.continue();
    });
    await use(net);
    expect(net.unexpected, "no unexpected, unmocked or external requests").toEqual([]);
  }, { auto: true }],
});

// ── Catalogue identities (read-only) ─────────────────────────────────────────

const NATIVE_DIR = path.resolve(__dirname, "../../../app/lib/mkc/native");
const CATALOGUE_SLUGS = new Set(
  fs.readdirSync(NATIVE_DIR)
    .filter((f) => f.endsWith(".ts") && f !== "index.ts")
    .map((f) => fs.readFileSync(path.join(NATIVE_DIR, f), "utf-8").match(/^\s*slug\s*:\s*"([^"]+)"/m)?.[1])
    .filter(Boolean),
);

const CAPRI   = { name: "Capri In a Bottle Lemon Sugar | 14 Inspired", slug: "capri-lemon-sugar-inspired" };
const ELITE_CONTROL = { name: "Angels Share Inspired", slug: "angels-share-inspired" };
const SHOP_CONTROL  = { name: "Sauvage Inspired", slug: "sauvage-inspired" };
const CAPRI_LEGACY_PATH = "/product/capri-in-a-bottle-lemon-sugar-%7C-14-inspired";

const FAV_KEY = "maison-skye-rose-favorites";
const CAPRI_FAVOURITE = {
  title: CAPRI.name, subtitle: "", mood: "", profile: "", season: [], notes: [],
  prices: { "5ml": 60, "10ml": 100, "30ml": 250 },
  images: { "5ml": "/images/elite-5ml.png", "10ml": "/images/elite-10ml.png", "30ml": "/images/glass-elite-30ml.png" },
  image: "/images/elite-10ml.png", bestSeller: false, newArrival: false,
};

// ── Helpers ──────────────────────────────────────────────────────────────────

// ProductCard root: the nearest ancestor holding both the image and Quick Add
// (the inner content wrapper holds Quick Add but not the image link).
// `scope` (default: the whole page) limits the search to one page region.
const cardFor = (page, title, scope = page) =>
  scope.getByRole("heading", { level: 3, name: title, exact: true })
    .locator("xpath=ancestor::div[.//img and .//button[normalize-space()='Quick Add']][1]");

const hrefsIn = (locator) => locator.locator("a").evaluateAll((as) => as.map((a) => a.getAttribute("href")));

async function productHrefsOnPage(page) {
  return page.locator('a[href^="/product/"]').evaluateAll((as) => as.map((a) => a.getAttribute("href")));
}

function expectAllCanonical(hrefs, where) {
  for (const href of hrefs) {
    const slug = href.replace(/^\/product\//, "").split(/[?#]/)[0];
    expect(CATALOGUE_SLUGS.has(slug), `${where}: ${href} is a catalogue slug`).toBe(true);
  }
  expect(hrefs.filter((h) => h.includes("capri-in-a-bottle")), `${where}: no title-derived Capri href`).toEqual([]);
}

async function shopSearch(page, term, title) {
  await page.goto("/shop");
  await page.getByPlaceholder("Search by name, note, mood or profile...").fill(term);
  await expect(page.getByRole("heading", { level: 3, name: title, exact: true })).toBeVisible();
}

// Checks a card's two links, follows one, and verifies the product page.
async function followCardLink(page, { name, slug }, which, scope = page) {
  const card = cardFor(page, name, scope);
  await expect(card).toHaveCount(1);
  expect(await hrefsIn(card)).toEqual([`/product/${slug}`, `/product/${slug}`]);
  const link = card.locator("a").nth(which === "image" ? 0 : 1);
  await link.click();
  await page.waitForURL(`**/product/${slug}`);
  expect(new URL(page.url()).pathname).toBe(`/product/${slug}`);
  await expect(page.getByRole("heading", { level: 1, name })).toBeVisible();
}

// ── N: ProductCard navigation ────────────────────────────────────────────────

for (const which of ["image", "heading"]) {
  test(`N1 Elite: Capri ${which} link opens the canonical product page`, async ({ page }) => {
    await page.goto("/collections/elite");
    expectAllCanonical(await productHrefsOnPage(page), "/collections/elite");
    await followCardLink(page, CAPRI, which);
  });

  test(`N2 Shop: Capri ${which} link opens the canonical product page`, async ({ page }) => {
    await shopSearch(page, "Capri", CAPRI.name);
    expectAllCanonical(await productHrefsOnPage(page), "/shop (search: Capri)");
    await followCardLink(page, CAPRI, which);
  });
}

test("N3 control fragrances keep their existing URLs (Elite and Shop)", async ({ page }) => {
  await page.goto("/collections/elite");
  await followCardLink(page, ELITE_CONTROL, "image");
  await shopSearch(page, "Sauvage", SHOP_CONTROL.name);
  await followCardLink(page, SHOP_CONTROL, "heading");
});

test("N4 Favourites: saved Capri links to the canonical product page", async ({ page }) => {
  await page.goto("/robots.txt");
  await page.evaluate(([k, v]) => { localStorage.clear(); localStorage.setItem(k, JSON.stringify(v)); }, [FAV_KEY, [CAPRI_FAVOURITE]]);
  await page.goto("/favorites");
  // Saved favourites only: the page also recommends Capri in a later section.
  // The saved grid's section is the one holding this (unique) sub-banner.
  const savedGrid = page.locator("section").filter({
    has: page.getByText("Save fragrances you love — each save helps personalise your Maison recommendations.", { exact: true }),
  });
  await expect(savedGrid).toHaveCount(1);
  await followCardLink(page, CAPRI, "heading", savedGrid);
});

test("N5 Recently Viewed: Capri viewed via a card links back canonically", async ({ page }) => {
  await page.goto("/collections/elite");
  await followCardLink(page, CAPRI, "image"); // records recentlyViewed through the real card
  await page.goto("/recently-viewed");
  // Viewed fragrances only: the page also recommends Capri in a later section.
  // The viewed grid's section is the one holding this (unique) sub-banner.
  const viewedGrid = page.locator("section").filter({
    has: page.getByText("Every fragrance you explore refines your Maison recommendations.", { exact: true }),
  });
  await expect(viewedGrid).toHaveCount(1);
  await followCardLink(page, CAPRI, "heading", viewedGrid);
});

async function discoverCollectionPaths(page) {
  await page.goto("/discover");
  const hrefs = await page.locator('a[href^="/discover/"]').evaluateAll((as) => as.map((a) => a.getAttribute("href")));
  return [...new Set(hrefs.filter((h) => /^\/discover\/[^/?#]+$/.test(h) && h !== "/discover/character-journey"))];
}

test("N6 discovery collection grids link only to catalogue slugs", async ({ page }) => {
  test.setTimeout(600_000);
  const paths = await discoverCollectionPaths(page);
  expect(paths.length, "discover collections found").toBeGreaterThan(0);
  for (const p of paths) {
    await page.goto(p);
    const hrefs = await productHrefsOnPage(page);
    expect(hrefs.length, `${p}: product links rendered`).toBeGreaterThan(0);
    expectAllCanonical(hrefs, p);
  }
});

test("N7 discovery grid Capri card (only if surfaced)", async ({ page }) => {
  test.setTimeout(600_000);
  const paths = await discoverCollectionPaths(page);
  let found = null;
  for (const p of paths) {
    await page.goto(p);
    if (await cardFor(page, CAPRI.name).count()) { found = p; break; }
  }
  test.skip(found === null, `NOT EXERCISED: Capri is not surfaced in any of ${paths.length} discover collection grids`);
  await followCardLink(page, CAPRI, "heading");
});

test("N8 compare page: related-grid and comparison links are canonical", async ({ page }) => {
  await page.goto(`/compare?a=${CAPRI.slug}&b=${ELITE_CONTROL.slug}`);
  const hrefs = await productHrefsOnPage(page);
  expect(hrefs.length, "compare page product links rendered").toBeGreaterThan(0);
  expectAllCanonical(hrefs, "/compare");
  expect(hrefs, "compare page links to canonical Capri").toContain(`/product/${CAPRI.slug}`);
});

test("N9 historical title-derived Capri URL remains unresolved (404, no redirect)", async ({ page }) => {
  const response = await page.goto(CAPRI_LEGACY_PATH);
  expect(response?.status()).toBe(404);
  expect(new URL(page.url()).pathname).toBe(CAPRI_LEGACY_PATH);
});

test("N10 keyboard focus order: favourite, image link, heading link, Quick Add, Learn More", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium",
    "WebKit skips links on Tab by default (Safari keyboard setting); focus order is verified in desktop Chromium");
  await shopSearch(page, "Capri", CAPRI.name);
  const card = cardFor(page, CAPRI.name);
  await card.locator("button").first().focus();
  const active = () => page.evaluate(() => {
    const el = document.activeElement;
    return { tag: el?.tagName, href: el?.getAttribute("href"), text: el?.textContent?.trim(), label: el?.getAttribute("aria-label"), hasH3: !!el?.querySelector("h3"), hasImg: !!el?.querySelector("img") };
  });
  await page.keyboard.press("Tab");
  expect(await active()).toMatchObject({ tag: "A", href: `/product/${CAPRI.slug}`, hasImg: true });
  await page.keyboard.press("Tab");
  expect(await active()).toMatchObject({ tag: "A", href: `/product/${CAPRI.slug}`, hasH3: true });
  await page.keyboard.press("Tab");
  expect(await active()).toMatchObject({ tag: "BUTTON", text: "Quick Add" });
  await page.keyboard.press("Tab");
  expect(await active()).toMatchObject({ tag: "BUTTON", label: `Learn more about ${CAPRI.name}` });
});

test("N11 mobile touch targets on the Capri card", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-375", "Touch-target check runs in the mobile-375 project");
  await page.goto("/collections/elite");
  const card = cardFor(page, CAPRI.name);
  await card.scrollIntoViewIfNeeded();
  const box = async (loc) => { const b = await loc.boundingBox(); return { w: Math.round(b?.width ?? 0), h: Math.round(b?.height ?? 0) }; };

  // Asserted: the P3D image link and the favourite toggle.
  const image = await box(card.locator("a").nth(0));
  const heart = await box(card.locator("button").first());
  expect(image.w, "image link width").toBeGreaterThanOrEqual(44);
  expect(image.h, "image link height").toBeGreaterThanOrEqual(44);
  expect(heart.w, "favourite width").toBeGreaterThanOrEqual(44);
  expect(heart.h, "favourite height").toBeGreaterThanOrEqual(44);

  // Recorded, not asserted: pre-existing control sizes that P3D did not change.
  const heading  = await box(card.locator("a").nth(1));
  const quickAdd = await box(card.getByRole("button", { name: "Quick Add" }));
  testInfo.annotations.push({ type: "measurement (pre-existing, not asserted)",
    description: `heading link ${heading.w}x${heading.h}px; Quick Add ${quickAdd.w}x${quickAdd.h}px` });
});
