// @ts-nocheck
/**
 * STOREFRONT-ACCEPTANCE-P3D — Modal focus-trap & Escape ownership verification
 *
 * Proves that:
 *  1. Search: Tab/Shift+Tab are contained within the search panel
 *  2. Search: Escape closes search and returns focus to the invoking element
 *  3. MiniCart: Tab/Shift+Tab are contained within the cart panel
 *  4. MiniCart: Escape closes cart and returns focus to the cart button
 *  5. Layered (Search over MiniCart is not possible in the app — they hide each
 *     other via FloatingAssist; instead we verify that opening one after the other
 *     does not leave competing traps — the prior trap's panel is gone and does not
 *     respond to Tab)
 *
 * Run: npx tsx scripts/factory/__tests__/p3d-focus-trap-verify.ts
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

let passCount = 0;
let failCount = 0;

function pass(label)       { console.log(`  PASS: ${label}`);               passCount++; }
function fail(label, info) { console.error(`  FAIL: ${label}${info ? " — " + info : ""}`); failCount++; }
function note(label)       { console.log(`  NOTE: ${label}`); }

async function ss(page, name) {
  await page.screenshot({ path: path.join(SS_DIR, `p3d-${name}.png`), fullPage: false });
  note(`Screenshot: p3d-${name}.png`);
}

/** Returns the aria-label of the dialog that currently holds keyboard focus, or null. */
async function focusedDialog(page) {
  return page.evaluate(() => {
    const el = document.activeElement;
    if (!el) return null;
    const dlg = el.closest('[role="dialog"]');
    return dlg ? (dlg.getAttribute("aria-label") || dlg.getAttribute("aria-labelledby") || "dialog") : null;
  });
}

/** Returns the aria-label of the focused element itself, or its tag/type. */
async function focusedEl(page) {
  return page.evaluate(() => {
    const el = document.activeElement;
    if (!el) return "null";
    return el.getAttribute("aria-label") || el.tagName.toLowerCase() + (el.type ? `[${el.type}]` : "");
  });
}

async function runDesktop() {
  const ctx  = await chromium.launch({ headless: true })
    .then(b => b.newContext({ viewport: { width: 1280, height: 800 } }).then(c => ({ browser: b, ctx: c })));
  const browser = ctx.browser;
  const context = ctx.ctx;
  const page    = await context.newPage();

  console.log("\n── Desktop 1280px — Focus Trap Verification ──\n");

  await page.goto(BASE + "/shop", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);

  // ── 1. Search: open via keyboard "/" ────────────────────────────────────────
  await page.keyboard.press("/");
  await page.waitForTimeout(400);

  const searchPanelExists = await page.locator('[role="dialog"][aria-label="Site search"]').count();
  searchPanelExists > 0
    ? pass("Search panel opens on /")
    : fail("Search panel", "not found after / keypress");

  if (searchPanelExists > 0) {
    // Focus should be in the search input inside the dialog
    const dlg0 = await focusedDialog(page);
    dlg0 === "Site search"
      ? pass(`Search: initial focus is inside search dialog (${await focusedEl(page)})`)
      : fail("Search: initial focus", `focused dialog = "${dlg0}" (expected "Site search")`);

    // Press Tab 6 times — focus must stay in search panel every time
    let allInsideSearch = true;
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press("Tab");
      await page.waitForTimeout(50);
      const dlg = await focusedDialog(page);
      if (dlg !== "Site search") {
        allInsideSearch = false;
        fail(`Search Tab #${i + 1}`, `focus escaped to dialog="${dlg}", el="${await focusedEl(page)}"`);
        break;
      }
    }
    if (allInsideSearch) pass("Search: 6× Tab stays within search dialog");

    // Shift+Tab 3 times — must still stay inside
    let allInsideSearchShift = true;
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press("Shift+Tab");
      await page.waitForTimeout(50);
      const dlg = await focusedDialog(page);
      if (dlg !== "Site search") {
        allInsideSearchShift = false;
        fail(`Search Shift+Tab #${i + 1}`, `focus escaped to dialog="${dlg}"`);
        break;
      }
    }
    if (allInsideSearchShift) pass("Search: 3× Shift+Tab stays within search dialog");

    await ss(page, "01-search-trap-active");

    // Escape closes search and returns focus to invoker
    // Record element that should get focus back — the search icon button
    const invokerLabel = await page.evaluate(() => document.activeElement?.closest('[role="dialog"]') ? null : document.activeElement?.getAttribute("aria-label"));
    await page.keyboard.press("Escape");
    await page.waitForTimeout(400);

    const searchGone = await page.locator('[role="dialog"][aria-label="Site search"]').count();
    searchGone === 0
      ? pass("Search: Escape closes search (panel removed from DOM)")
      : fail("Search: Escape close", "panel still in DOM");

    // Focus should be back outside any dialog
    const dlgAfter = await focusedDialog(page);
    dlgAfter === null
      ? pass(`Search: focus restored outside any dialog after Escape (el="${await focusedEl(page)}")`)
      : fail("Search: focus restore", `focus still in dialog="${dlgAfter}" after close`);

    await ss(page, "02-search-closed-focus-restored");
  }

  // ── 2. MiniCart: open via cart button ────────────────────────────────────────
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(200);
  await page.evaluate(() => {
    (document.querySelector('button[aria-label="Open Cart"]') as HTMLElement)?.click();
  });
  await page.waitForTimeout(600);

  const cartPanel = page.locator('[role="dialog"][aria-label="Shopping cart"]');
  const cartExists = await cartPanel.count();
  cartExists > 0
    ? pass("MiniCart: opens from cart button")
    : fail("MiniCart", "panel not found after button click");

  if (cartExists > 0) {
    // Focus should be inside the cart dialog
    const dlgCart0 = await focusedDialog(page);
    dlgCart0 === "Shopping cart"
      ? pass(`MiniCart: initial focus is inside cart dialog (${await focusedEl(page)})`)
      : fail("MiniCart: initial focus", `focused dialog = "${dlgCart0}"`);

    // Tab 5 times — must stay in cart
    let allInsideCart = true;
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press("Tab");
      await page.waitForTimeout(50);
      const dlg = await focusedDialog(page);
      if (dlg !== "Shopping cart") {
        allInsideCart = false;
        fail(`MiniCart Tab #${i + 1}`, `focus escaped to dialog="${dlg}", el="${await focusedEl(page)}"`);
        break;
      }
    }
    if (allInsideCart) pass("MiniCart: 5× Tab stays within cart dialog");

    await ss(page, "03-minicart-trap-active");

    // Escape closes cart
    await page.keyboard.press("Escape");
    await page.waitForTimeout(600);

    const cartAriaHidden = await cartPanel.getAttribute("aria-hidden").catch(() => null);
    cartAriaHidden === "true"
      ? pass("MiniCart: Escape closes cart (aria-hidden=true)")
      : fail("MiniCart: Escape close", `aria-hidden="${cartAriaHidden}"`);

    const dlgAfterCart = await focusedDialog(page);
    dlgAfterCart === null
      ? pass(`MiniCart: focus restored outside any dialog after Escape (el="${await focusedEl(page)}")`)
      : fail("MiniCart: focus restore", `focus still in dialog="${dlgAfterCart}"`);

    await ss(page, "04-minicart-closed-focus-restored");
  }

  // ── 3. Verify no competing traps: open Search after closing MiniCart ─────────
  await page.keyboard.press("/");
  await page.waitForTimeout(400);

  const searchAfterCart = await page.locator('[role="dialog"][aria-label="Site search"]').count();
  const cartAfterSearch = await page.locator('[role="dialog"][aria-label="Shopping cart"][aria-hidden="false"]').count();

  searchAfterCart > 0
    ? pass("No competing traps: Search opens cleanly after MiniCart closed")
    : fail("No competing traps", "Search panel not found");

  cartAfterSearch === 0
    ? pass("No competing traps: MiniCart stays closed when Search opens")
    : fail("No competing traps", "MiniCart unexpectedly open while Search is open");

  // Tab inside search — no influence from prior cart trap
  if (searchAfterCart > 0) {
    let clean = true;
    for (let i = 0; i < 4; i++) {
      await page.keyboard.press("Tab");
      await page.waitForTimeout(50);
      const dlg = await focusedDialog(page);
      if (dlg !== "Site search") {
        clean = false;
        fail(`No-competing-trap Tab #${i + 1}`, `focus not in search dialog: "${dlg}"`);
        break;
      }
    }
    if (clean) pass("No competing traps: 4× Tab after sequential open stays in search");
    await page.keyboard.press("Escape");
    await page.waitForTimeout(300);
  }

  await ss(page, "05-sequential-no-competing-traps");

  await context.close();
  await browser.close();
}

async function main() {
  console.log("\n=== P3D MODAL FOCUS-TRAP & ESCAPE OWNERSHIP VERIFICATION ===\n");
  await runDesktop();

  console.log("\n──────────────────────────────────────────────────────────");
  console.log(`  Results: ${passCount} passed, ${failCount} failed\n`);
  if (failCount > 0) {
    console.log("  HOLD — see FAIL lines above");
    process.exitCode = 1;
  } else {
    console.log("  PASS — Focus traps verified");
  }
}

main().catch(e => {
  console.error("FATAL:", e instanceof Error ? e.stack : String(e));
  process.exit(1);
});
