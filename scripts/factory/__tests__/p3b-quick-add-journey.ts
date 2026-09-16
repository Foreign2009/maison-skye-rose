// @ts-nocheck
/**
 * STOREFRONT-ACCEPTANCE-P3B — Quick Add browser journey
 *
 * Verifies the actual QuickAddModal (not MiniCart) by targeting
 * [role="dialog"][aria-labelledby] which is the aria pattern set on the
 * QuickAddModal inner panel after the P3B accessibility fixes.
 *
 * Run with: npx tsx scripts/factory/__tests__/p3b-quick-add-journey.ts
 * Requires a Next.js dev server running at http://localhost:3333
 */

import path from "node:path";
import fs   from "node:fs";

const { chromium } = require(
  "C:\\Users\\adi\\AppData\\Local\\npm-cache\\_npx\\e41f203b7505f1fb\\node_modules\\playwright-core"
);

const SS_DIR  = "C:\\Users\\adi\\AppData\\Local\\Temp\\claude\\c--Users-adi-projects-maison-skye-rose\\ff3ce0a5-dac4-4410-9083-b81655217fed\\scratchpad\\screenshots";
const SHOP_URL = "http://localhost:3333/shop";

fs.mkdirSync(SS_DIR, { recursive: true });

let passCount = 0;
let failCount = 0;

function pass(label) { console.log(`  PASS: ${label}`); passCount++; }
function fail(label, detail) {
  console.error(`  FAIL: ${detail ? label + " — " + detail : label}`);
  failCount++;
}
function note(label) { console.log(`  NOTE: ${label}`); }

async function ss(page, name) {
  const p = path.join(SS_DIR, `p3b-qa-${name}.png`);
  await page.screenshot({ path: p, fullPage: false });
  note(`Screenshot: p3b-qa-${name}.png`);
}

async function main() {
  console.log("\n=== P3B QUICK ADD BROWSER JOURNEY ===\n");

  const browser = await chromium.launch({ headless: true });

  // ── Mobile (375px) ───────────────────────────────────────────────────────────
  {
    const ctx  = await browser.newContext({ viewport: { width: 375, height: 812 } });
    const page = await ctx.newPage();

    console.log("── Mobile 375px ──\n");
    await page.goto(SHOP_URL, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);
    await ss(page, "01-mobile-shop");

    // Open Quick Add on first product card
    const qaBtn = page.locator('button:has-text("Quick Add")').first();
    const qaBtnCount = await qaBtn.count();
    note(`Quick Add buttons found: ${qaBtnCount}`);

    if (qaBtnCount === 0) {
      fail("Mobile: Quick Add button visible", "no 'Quick Add' buttons found on shop page");
    } else {
      await qaBtn.click();
      await page.waitForTimeout(600);
      await ss(page, "02-mobile-modal-open");

      // Verify the actual QuickAddModal opened (not MiniCart)
      // QuickAddModal sets role="dialog" aria-labelledby="quick-add-title"
      const modal = page.locator('[role="dialog"][aria-labelledby="quick-add-title"]');
      const modalCount = await modal.count();

      if (modalCount > 0) {
        pass("Mobile: QuickAddModal opened (not MiniCart)");

        // Verify product title is present
        const titleEl = modal.locator("#quick-add-title");
        const titleText = await titleEl.textContent().catch(() => "");
        note(`Product title in modal: "${titleText}"`);
        titleText
          ? pass(`Mobile: product title visible — "${titleText}"`)
          : fail("Mobile: product title", "not found in modal");

        // ── Price verification per size ─────────────────────────────────────
        // Catalogue prices: 5ml=R60, 10ml=R100, 30ml=R250
        const expectedPrices = { "5ml": "60.00", "10ml": "100.00", "30ml": "250.00" };
        const sizeBtns = modal.locator("button").filter({ hasText: /ml/ });
        const sizeBtnCount = await sizeBtns.count();
        note(`Size buttons found: ${sizeBtnCount}`);

        for (const [size, expectedPrice] of Object.entries(expectedPrices)) {
          const btn = modal.locator(`button:has-text("${size}")`).first();
          if (await btn.count() === 0) {
            note(`Size ${size} not available for this product — skipping`);
            continue;
          }
          await btn.click();
          await page.waitForTimeout(200);
          // Price displayed as "R XX.XX" somewhere in the modal
          const modalText = await modal.textContent();
          const priceVisible = modalText.includes(expectedPrice) || modalText.includes(`R ${expectedPrice}`);
          priceVisible
            ? pass(`Mobile: ${size} price R${expectedPrice} displayed correctly`)
            : fail(`Mobile: ${size} price`, `R${expectedPrice} not found in modal (got: ${modalText.slice(0, 100)})`);
        }

        await ss(page, "03-mobile-size-selected");

        // ── Add to cart ─────────────────────────────────────────────────────
        // Select 10ml to add
        const btn10ml = modal.locator('button:has-text("10ml")').first();
        if (await btn10ml.count() > 0) await btn10ml.click();
        await page.waitForTimeout(200);

        const addBtn = modal.locator('button:has-text("Add To Cart")').first();
        if (await addBtn.count() > 0) {
          await addBtn.click();
          await page.waitForTimeout(600);
          await ss(page, "04-mobile-after-add");

          // Modal should be closed after add
          const modalAfterAdd = page.locator('[data-modal="quick-add"]');
          const modalVisible = await modalAfterAdd.isVisible().catch(() => false);
          !modalVisible
            ? pass("Mobile: modal closes after Add To Cart")
            : fail("Mobile: modal close after add", "modal still visible");

          // Cart icon should show item count
          const cartBadge = page.locator('[aria-label="Open Cart"] span, button[aria-label="Open Cart"] span');
          const badgeText = await cartBadge.textContent().catch(() => "0");
          note(`Cart badge after add: "${badgeText}"`);
          parseInt(badgeText || "0") > 0
            ? pass("Mobile: cart badge incremented after Quick Add")
            : fail("Mobile: cart badge", "count did not increment");

        } else {
          fail("Mobile: Add To Cart button", "not found in modal");
        }

        // ── Test Cancel / Escape dismissal ──────────────────────────────────
        // Open modal again for Escape test
        const qaBtn2 = page.locator('button:has-text("Quick Add")').first();
        if (await qaBtn2.count() > 0) {
          await qaBtn2.click();
          await page.waitForTimeout(600);

          const modal2 = page.locator('[data-modal="quick-add"]');
          const modal2Visible = await modal2.isVisible().catch(() => false);

          if (modal2Visible) {
            await page.keyboard.press("Escape");
            await page.waitForTimeout(400);
            await ss(page, "05-mobile-after-escape");

            const modal2AfterEsc = page.locator('[data-modal="quick-add"]');
            const modal2VisAfterEsc = await modal2AfterEsc.isVisible().catch(() => false);
            !modal2VisAfterEsc
              ? pass("Mobile: Escape dismisses QuickAddModal")
              : fail("Mobile: Escape dismissal", "modal still visible after Escape");
          } else {
            note("Mobile: Could not re-open modal for Escape test — skipping");
          }
        }

      } else {
        fail("Mobile: QuickAddModal opened", `[role="dialog"][aria-labelledby="quick-add-title"] not found; found ${await page.locator('[role="dialog"]').count()} dialog(s)`);
        // Dump dialog roles found
        const dialogs = await page.locator('[role="dialog"]').evaluateAll(els =>
          els.map(el => `${el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || '?'} | ${el.className.slice(0, 60)}`)
        );
        note(`Dialogs found: ${JSON.stringify(dialogs)}`);
      }
    }

    await ctx.close();
  }

  // ── Desktop (1280px) ─────────────────────────────────────────────────────────
  {
    const ctx  = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await ctx.newPage();

    console.log("\n── Desktop 1280px ──\n");
    await page.goto(SHOP_URL, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);
    await ss(page, "06-desktop-shop");

    const qaBtn = page.locator('button:has-text("Quick Add")').first();
    if (await qaBtn.count() === 0) {
      fail("Desktop: Quick Add button", "not found");
    } else {
      await qaBtn.click();
      await page.waitForTimeout(600);
      await ss(page, "07-desktop-modal-open");

      const modal = page.locator('[role="dialog"][aria-labelledby="quick-add-title"]');
      if (await modal.count() > 0) {
        pass("Desktop: QuickAddModal opened by role and aria-labelledby");

        // Verify Cancel button closes modal
        const cancelBtn = modal.locator('button:has-text("Cancel")').first();
        if (await cancelBtn.count() > 0) {
          await cancelBtn.click();
          await page.waitForTimeout(400);
          const modalAfterCancel = page.locator('[data-modal="quick-add"]');
          !(await modalAfterCancel.isVisible().catch(() => false))
            ? pass("Desktop: Cancel button closes QuickAddModal")
            : fail("Desktop: Cancel button", "modal still visible after Cancel");
        }

        // Focus trap: open modal and check that Escape closes only it (not MiniCart)
        await qaBtn.click();
        await page.waitForTimeout(600);
        await page.keyboard.press("Escape");
        await page.waitForTimeout(400);
        const modalAfterEsc = page.locator('[data-modal="quick-add"]');
        !(await modalAfterEsc.isVisible().catch(() => false))
          ? pass("Desktop: Escape closes QuickAddModal")
          : fail("Desktop: Escape", "QuickAddModal still visible");

      } else {
        fail("Desktop: QuickAddModal", `[role="dialog"][aria-labelledby] not found`);
      }
    }

    await ctx.close();
  }

  await browser.close();

  console.log("\n──────────────────────────────────────────────────────────");
  console.log(`  Results: ${passCount} passed, ${failCount} failed\n`);
  if (failCount > 0) {
    console.log("  HOLD — see FAIL lines above");
    process.exitCode = 1;
  } else {
    console.log("  PASS — Quick Add journey complete");
  }
}

main().catch(e => {
  console.error("FATAL:", e instanceof Error ? e.stack : String(e));
  process.exit(1);
});
