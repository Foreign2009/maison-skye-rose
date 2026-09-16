// @ts-nocheck
/**
 * STOREFRONT-ACCEPTANCE-P3C — Visual evidence screenshots
 * Captures mobile/desktop views of: homepage + floating controls,
 * shop filters + product cards, Quick Add modal, cart content.
 *
 * Run: npx tsx scripts/factory/__tests__/p3c-visual-evidence.ts
 * Requires: Next.js dev server at http://localhost:3333
 */

import path from "node:path";
import fs   from "node:fs";

const { chromium } = require(
  "C:\\Users\\adi\\AppData\\Local\\npm-cache\\_npx\\e41f203b7505f1fb\\node_modules\\playwright-core"
);

const SS_DIR = "C:\\Users\\adi\\AppData\\Local\\Temp\\claude\\c--Users-adi-projects-maison-skye-rose\\ff3ce0a5-dac4-4410-9083-b81655217fed\\scratchpad\\screenshots";
const BASE   = "http://localhost:3333";
fs.mkdirSync(SS_DIR, { recursive: true });

function note(label) { console.log(`  ${label}`); }
async function ss(page, name) {
  const p = path.join(SS_DIR, `evidence-${name}.png`);
  await page.screenshot({ path: p, fullPage: false });
  note(`Saved: evidence-${name}.png`);
}

async function main() {
  console.log("\n=== P3C VISUAL EVIDENCE CAPTURE ===\n");
  const browser = await chromium.launch({ headless: true });

  // ── MOBILE 375px ──────────────────────────────────────────────────────────
  {
    const ctx  = await browser.newContext({ viewport: { width: 375, height: 812 } });
    const page = await ctx.newPage();

    // Homepage + floating controls
    await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2000);
    await ss(page, "mobile-01-homepage");

    // Scroll to show floating controls
    await page.evaluate(() => window.scrollTo(0, 300));
    await page.waitForTimeout(500);
    await ss(page, "mobile-02-homepage-floating-controls");

    // Shop: filters + product cards (at top — compact filter row visible)
    await page.goto(`${BASE}/shop`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);
    await ss(page, "mobile-03-shop-top");

    // Scroll to show product cards
    await page.evaluate(() => window.scrollTo(0, 400));
    await page.waitForTimeout(400);
    await ss(page, "mobile-04-shop-product-cards");

    // Quick Add modal
    const qaBtn = page.locator('button:has-text("Quick Add")').first();
    if (await qaBtn.count() > 0) {
      await qaBtn.scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);
      await qaBtn.click();
      await page.waitForTimeout(600);
      await ss(page, "mobile-05-quick-add-modal");
      await page.keyboard.press("Escape");
      await page.waitForTimeout(400);
    }

    // Academy landing
    await page.goto(`${BASE}/academy`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1200);
    await ss(page, "mobile-06-academy-landing");

    await ctx.close();
    note("\nMobile screenshots done.");
  }

  // ── DESKTOP 1280px ────────────────────────────────────────────────────────
  {
    const ctx  = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await ctx.newPage();

    // Homepage + floating controls
    await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2000);
    await ss(page, "desktop-01-homepage");

    // Shop: top (hero + filter rows)
    await page.goto(`${BASE}/shop`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);
    await ss(page, "desktop-02-shop-top");

    // Shop: scroll to show product grid
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(400);
    await ss(page, "desktop-03-shop-product-cards");

    // Shop: show "More Filters" toggle
    await page.evaluate(() => window.scrollTo(0, 250));
    await page.waitForTimeout(300);
    await ss(page, "desktop-04-shop-filters-collapsed");

    // Click "More Filters" toggle to expand
    const moreBtn = page.locator('button:has-text("More Filters")').first();
    if (await moreBtn.count() > 0) {
      await moreBtn.click();
      await page.waitForTimeout(400);
      await ss(page, "desktop-05-shop-filters-expanded");
    }

    // Quick Add modal
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(400);
    const qaBtn = page.locator('button:has-text("Quick Add")').first();
    if (await qaBtn.count() > 0) {
      await qaBtn.scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);
      await qaBtn.click();
      await page.waitForTimeout(600);
      await ss(page, "desktop-06-quick-add-modal");
      await page.keyboard.press("Escape");
      await page.waitForTimeout(400);
    }

    // Academy landing
    await page.goto(`${BASE}/academy`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1200);
    await ss(page, "desktop-07-academy-landing");

    await ctx.close();
    note("\nDesktop screenshots done.");
  }

  await browser.close();

  console.log(`\nAll screenshots saved to:\n${SS_DIR}\n`);
}

main().catch(e => {
  console.error("FATAL:", e instanceof Error ? e.stack : String(e));
  process.exit(1);
});
