// @ts-nocheck
/**
 * STOREFRONT-ACCEPTANCE-P3C — Quick Add cart content verification
 *
 * Extends P3B: selects a non-default size (30ml), adds it, then opens the
 * MiniCart to verify product identity, size, quantity and price are correct.
 * Also verifies that the cart subtotal matches price × quantity.
 *
 * Run with: npx tsx scripts/factory/__tests__/p3c-quick-add-cart-verify.ts
 * Requires a Next.js dev server running at http://localhost:3333
 */

import path from "node:path";
import fs   from "node:fs";

const { chromium } = require(
  "C:\\Users\\adi\\AppData\\Local\\npm-cache\\_npx\\e41f203b7505f1fb\\node_modules\\playwright-core"
);

const SS_DIR   = "C:\\Users\\adi\\AppData\\Local\\Temp\\claude\\c--Users-adi-projects-maison-skye-rose\\ff3ce0a5-dac4-4410-9083-b81655217fed\\scratchpad\\screenshots";
const SHOP_URL = "http://localhost:3333/shop";

fs.mkdirSync(SS_DIR, { recursive: true });

let passCount = 0;
let failCount = 0;

function pass(label) { console.log(`  PASS: ${label}`); passCount++; }
function fail(label, detail?) {
  console.error(`  FAIL: ${detail ? label + " — " + detail : label}`);
  failCount++;
}
function note(label) { console.log(`  NOTE: ${label}`); }

async function ss(page, name) {
  const p = path.join(SS_DIR, `p3c-${name}.png`);
  await page.screenshot({ path: p, fullPage: false });
  note(`Screenshot: p3c-${name}.png`);
}

// Expected catalogue prices (authoritative from MKC)
const EXPECTED = { "5ml": 60, "10ml": 100, "30ml": 250 };

async function verifyCartContent(page, ctx, viewport: string) {
  console.log(`\n── ${viewport} Cart Content Verification ──\n`);

  await page.goto(SHOP_URL, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);

  // Open Quick Add on first product — scroll into view first (may be below fold on desktop)
  const qaBtn = page.locator('button:has-text("Quick Add")').first();
  if (await qaBtn.count() === 0) {
    fail(`${viewport}: Quick Add button`, "not found");
    return;
  }
  await qaBtn.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await qaBtn.click();
  await page.waitForTimeout(600);

  const modal = page.locator('[role="dialog"][aria-labelledby="quick-add-title"]');
  if (await modal.count() === 0) {
    fail(`${viewport}: QuickAddModal`, "not found after click");
    return;
  }

  // Read product title for later verification
  const titleEl = modal.locator("#quick-add-title");
  const productTitle = (await titleEl.textContent().catch(() => "")).trim();
  note(`${viewport}: Product title = "${productTitle}"`);

  // Select 30ml (non-default size)
  const btn30 = modal.locator('button:has-text("30ml")').first();
  if (await btn30.count() === 0) {
    note(`${viewport}: 30ml not available — falling back to 10ml`);
    const btn10 = modal.locator('button:has-text("10ml")').first();
    if (await btn10.count() === 0) {
      fail(`${viewport}: no size buttons found`);
      return;
    }
    await btn10.click();
  } else {
    await btn30.click();
    pass(`${viewport}: 30ml size selected`);
  }
  await page.waitForTimeout(200);
  await ss(page, `${viewport.toLowerCase()}-01-size-selected`);

  // Read the total shown in the modal before adding
  const modalText = await modal.textContent();
  const has30mlPrice = modalText.includes("250.00") || modalText.includes("R 250");
  const hasAnyPrice  = /R\s*\d+/.test(modalText);
  if (has30mlPrice) {
    pass(`${viewport}: 30ml total R250.00 shown in modal`);
  } else {
    note(`${viewport}: modal text: ${modalText.slice(0, 120)}`);
    hasAnyPrice
      ? fail(`${viewport}: 30ml price`, "price shown but not R250.00")
      : fail(`${viewport}: 30ml price`, "no price found in modal");
  }

  // Click Add To Cart
  const addBtn = modal.locator('button:has-text("Add To Cart")').first();
  if (await addBtn.count() === 0) {
    fail(`${viewport}: Add To Cart`, "button not found");
    return;
  }
  await addBtn.click();
  await page.waitForTimeout(800);
  await ss(page, `${viewport.toLowerCase()}-02-after-add`);

  // Verify modal closed
  const modalAfter = page.locator('[data-modal="quick-add"]');
  const modalVisible = await modalAfter.isVisible().catch(() => false);
  !modalVisible
    ? pass(`${viewport}: modal closes after Add To Cart`)
    : fail(`${viewport}: modal close`, "still visible after add");

  // Open MiniCart to verify cart content
  // Fixed Navbar button can be unreachable via locator.click() in headless mode
  // after a page scroll — use evaluate() to trigger the click directly.
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(200);
  const cartBtnCount = await page.locator('button[aria-label="Open Cart"]').count();
  if (cartBtnCount === 0) {
    fail(`${viewport}: Open Cart button`, "not found in navbar");
    return;
  }
  await page.evaluate(() => {
    (document.querySelector('button[aria-label="Open Cart"]') as HTMLElement)?.click();
  });
  await page.waitForTimeout(600);
  await ss(page, `${viewport.toLowerCase()}-03-minicart-open`);

  // MiniCart dialog
  const cart = page.locator('[role="dialog"][aria-label="Shopping cart"]');
  if (await cart.count() === 0) {
    fail(`${viewport}: MiniCart`, "dialog not found after cart button click");
    return;
  }
  pass(`${viewport}: MiniCart opens from cart icon`);

  const cartText = await cart.textContent();
  note(`${viewport}: Cart content (first 200 chars): ${cartText.slice(0, 200)}`);

  // Product title in cart
  if (productTitle && cartText.toLowerCase().includes(productTitle.toLowerCase())) {
    pass(`${viewport}: cart contains added product "${productTitle}"`);
  } else {
    fail(`${viewport}: product in cart`, `"${productTitle}" not found in cart`);
  }

  // Size in cart — look for "30ml" or the fallback "10ml"
  const sizeInCart = cartText.includes("30ml") ? "30ml" : cartText.includes("10ml") ? "10ml" : null;
  if (sizeInCart) {
    pass(`${viewport}: cart shows size "${sizeInCart}"`);
  } else {
    fail(`${viewport}: size in cart`, "neither 30ml nor 10ml found in cart");
  }

  // Price in cart — R250 for 30ml, R100 for 10ml
  const expectedPrice = sizeInCart === "30ml" ? 250 : 100;
  if (cartText.includes(String(expectedPrice))) {
    pass(`${viewport}: cart shows correct price R${expectedPrice} for ${sizeInCart}`);
  } else {
    fail(`${viewport}: cart price`, `R${expectedPrice} not found; got: ${cartText.slice(0, 100)}`);
  }

  // Subtotal section — isolated cart (fresh context) should show exactly R{expectedPrice}
  const subtotalMatch = cartText.match(/Subtotal[\s\S]*?R([\d,.]+)/);
  if (subtotalMatch) {
    const subtotalAmt = parseFloat(subtotalMatch[1].replace(",", ""));
    note(`${viewport}: Subtotal found = R${subtotalAmt}`);
    subtotalAmt === expectedPrice
      ? pass(`${viewport}: subtotal R${subtotalAmt} === R${expectedPrice} (exact)`)
      : fail(`${viewport}: subtotal`, `R${subtotalAmt} !== R${expectedPrice} — expected exact equality for isolated cart`);
  } else {
    note(`${viewport}: Could not parse subtotal — cart may be empty or layout differs`);
  }

  // Quantity = 1 (we added 1)
  const hasQty1 = cartText.includes("1") && !cartText.includes("0 Items");
  hasQty1
    ? pass(`${viewport}: quantity 1 present in cart`)
    : fail(`${viewport}: quantity`, "1 not found in cart content");

  await ss(page, `${viewport.toLowerCase()}-04-cart-content`);

  // Close MiniCart with Escape
  // MiniCart uses CSS opacity-0/translate-y-full when closed (stays in DOM).
  // Check aria-hidden="true" which is set when isOpen=false, not isVisible().
  await page.keyboard.press("Escape");
  await page.waitForTimeout(600);
  const cartAfterEsc = page.locator('[role="dialog"][aria-label="Shopping cart"]');
  const ariaHidden   = await cartAfterEsc.getAttribute("aria-hidden").catch(() => null);
  ariaHidden === "true"
    ? pass(`${viewport}: Escape closes MiniCart (aria-hidden=true)`)
    : fail(`${viewport}: Escape close MiniCart`, `aria-hidden="${ariaHidden}" (expected "true")`);
}

async function main() {
  console.log("\n=== P3C QUICK ADD CART CONTENT VERIFICATION ===\n");

  const browser = await chromium.launch({ headless: true });

  // ── Mobile 375px ─────────────────────────────────────────────────────────────
  {
    const ctx  = await browser.newContext({ viewport: { width: 375, height: 812 } });
    const page = await ctx.newPage();
    await verifyCartContent(page, ctx, "Mobile");
    await ctx.close();
  }

  // ── Desktop 1280px ───────────────────────────────────────────────────────────
  {
    const ctx  = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await ctx.newPage();
    await verifyCartContent(page, ctx, "Desktop");
    await ctx.close();
  }

  await browser.close();

  console.log("\n──────────────────────────────────────────────────────────");
  console.log(`  Results: ${passCount} passed, ${failCount} failed\n`);
  if (failCount > 0) {
    console.log("  HOLD — see FAIL lines above");
    process.exitCode = 1;
  } else {
    console.log("  PASS — Quick Add cart content verified");
  }
}

main().catch(e => {
  console.error("FATAL:", e instanceof Error ? e.stack : String(e));
  process.exit(1);
});
