// @ts-nocheck
/**
 * STOREFRONT-ACCEPTANCE-P3C — Academy navigation browser check
 * Run with: npx tsx scripts/factory/__tests__/p3c-academy-verify.ts
 * Requires: Next.js dev server at http://localhost:3333
 */

import path from "node:path";
import fs   from "node:fs";

const { chromium } = require(
  "C:\\Users\\adi\\AppData\\Local\\npm-cache\\_npx\\e41f203b7505f1fb\\node_modules\\playwright-core"
);

const SS_DIR = "C:\\Users\\adi\\AppData\\Local\\Temp\\claude\\c--Users-adi-projects-maison-skye-rose\\ff3ce0a5-dac4-4410-9083-b81655217fed\\scratchpad\\screenshots";
fs.mkdirSync(SS_DIR, { recursive: true });

let passCount = 0;
let failCount = 0;

function pass(label) { console.log(`  PASS: ${label}`); passCount++; }
function fail(label, detail?) { console.error(`  FAIL: ${detail ? label + " — " + detail : label}`); failCount++; }
function note(label) { console.log(`  NOTE: ${label}`); }
async function ss(page, name) {
  await page.screenshot({ path: path.join(SS_DIR, `p3c-academy-${name}.png`), fullPage: false });
  note(`Screenshot: p3c-academy-${name}.png`);
}

async function main() {
  console.log("\n=== P3C ACADEMY NAVIGATION BROWSER CHECK ===\n");
  const browser = await chromium.launch({ headless: true });

  for (const [label, width, height] of [["Mobile", 375, 812], ["Desktop", 1280, 800]]) {
    const ctx  = await browser.newContext({ viewport: { width, height } });
    const page = await ctx.newPage();
    const W    = label;

    console.log(`\n── ${W} ${width}px ──\n`);

    // ── /academy landing ────────────────────────────────────────────────────
    await page.goto("http://localhost:3333/academy", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);
    await ss(page, `${W.toLowerCase()}-01-academy-landing`);

    // Navbar present
    const nav = page.locator("nav").first();
    (await nav.count()) > 0
      ? pass(`${W}: Navbar rendered on /academy`)
      : fail(`${W}: Navbar on /academy`, "no <nav> found");

    // No disabled search input
    const disabledSearch = page.locator('input[disabled]');
    (await disabledSearch.count()) === 0
      ? pass(`${W}: disabled search input removed`)
      : fail(`${W}: disabled search`, `${await disabledSearch.count()} disabled input(s) still present`);

    // Home link in breadcrumbs
    const homeLink = page.locator('a[href="/"]').first();
    (await homeLink.count()) > 0
      ? pass(`${W}: Home link accessible on /academy`)
      : fail(`${W}: Home link`, "no a[href='/'] found on academy page");

    // Page content h1 clears the fixed Navbar.
    // Navbar is inside <main> and has its own brand h1 inside a <header> link.
    // Use section h1 to target page-content headings only.
    const pageH1 = page.locator("section h1").first();
    if (await pageH1.count() > 0) {
      const box = await pageH1.boundingBox();
      note(`${W}: /academy section h1 bounding box top = ${box?.y}`);
      box && box.y > 60
        ? pass(`${W}: /academy page heading clears Navbar (top=${Math.round(box.y)}px)`)
        : fail(`${W}: /academy page heading overlap`, `top=${box?.y}, may be behind fixed Navbar`);
    }

    // ── /academy first article ─────────────────────────────────────────────
    const articleLink = page.locator('a[href^="/academy/"]').first();
    if (await articleLink.count() > 0) {
      const href = await articleLink.getAttribute("href");
      await page.goto(`http://localhost:3333${href}`, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(1000);
      await ss(page, `${W.toLowerCase()}-02-article`);

      const navOnArticle = page.locator("nav").first();
      (await navOnArticle.count()) > 0
        ? pass(`${W}: Navbar on article page ${href}`)
        : fail(`${W}: Navbar on article page`, "no <nav>");

      // Breadcrumb Home link
      const homeBreadcrumb = page.locator('a[href="/"]').first();
      (await homeBreadcrumb.count()) > 0
        ? pass(`${W}: Home breadcrumb on article page`)
        : fail(`${W}: Home breadcrumb`, "not found");

      // Academy breadcrumb
      const academyBreadcrumb = page.locator('a[href="/academy"]').first();
      (await academyBreadcrumb.count()) > 0
        ? pass(`${W}: Academy breadcrumb links back to /academy`)
        : fail(`${W}: Academy breadcrumb`, "not found");

      // Article heading not behind Navbar — use section h1 to skip Navbar brand h1
      const articleH1 = page.locator("section h1").first();
      if (await articleH1.count() > 0) {
        const box = await articleH1.boundingBox();
        note(`${W}: article main h1 bounding box top = ${box?.y}`);
        box && box.y > 60
          ? pass(`${W}: article heading clears Navbar (top=${Math.round(box.y)}px)`)
          : fail(`${W}: article heading overlap`, `top=${box?.y}`);
      }
    }

    // ── /academy/category first category ──────────────────────────────────
    await page.goto("http://localhost:3333/academy", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(800);
    const catLink = page.locator('a[href^="/academy/category/"]').first();
    if (await catLink.count() > 0) {
      const catHref = await catLink.getAttribute("href");
      await page.goto(`http://localhost:3333${catHref}`, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(1000);
      await ss(page, `${W.toLowerCase()}-03-category`);

      const navOnCat = page.locator("nav").first();
      (await navOnCat.count()) > 0
        ? pass(`${W}: Navbar on category page ${catHref}`)
        : fail(`${W}: Navbar on category page`, "no <nav>");

      const homeBcCat = page.locator('a[href="/"]').first();
      (await homeBcCat.count()) > 0
        ? pass(`${W}: Home breadcrumb on category page`)
        : fail(`${W}: Home breadcrumb on category page`, "not found");
    }

    await ctx.close();
  }

  await browser.close();

  console.log("\n──────────────────────────────────────────────────────────");
  console.log(`  Results: ${passCount} passed, ${failCount} failed\n`);
  if (failCount > 0) {
    console.log("  HOLD — see FAIL lines");
    process.exitCode = 1;
  } else {
    console.log("  PASS — Academy navigation verified");
  }
}

main().catch(e => {
  console.error("FATAL:", e instanceof Error ? e.stack : String(e));
  process.exit(1);
});
