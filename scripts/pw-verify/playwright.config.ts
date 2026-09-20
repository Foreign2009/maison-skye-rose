import { defineConfig, devices } from "@playwright/test";

/**
 * Checkout idempotency end-to-end verification suite.
 *
 * Prerequisites:
 *   - Local dev server running at http://localhost:3000 (npm run dev)
 *   - npx playwright install chromium  (first run only)
 *
 * Run from repo root:
 *   npx playwright test --config scripts/pw-verify/playwright.config.ts
 *
 * Environment:
 *   No production credentials required.  All /api/orders calls are
 *   intercepted by Playwright route handlers — no real DB writes occur.
 */
export default defineConfig({
  testDir:             "./specs",
  testMatch:           "**/*.spec.js",
  timeout:             60_000,
  retries:             0,
  workers:             1,
  reporter:            [["list"], ["json", { outputFile: "results/p8/pw-report.json" }]],
  outputDir:           "results/p8/traces",

  use: {
    baseURL:       "http://localhost:3000",
    headless:      true,
    screenshot:    "only-on-failure",
    trace:         "on-first-retry",
    launchOptions: {},
  },

  projects: [
    {
      name:  "checkout-mobile",
      use:   { ...devices["iPhone 13 Mini"] },
    },
  ],

  // Dev server is assumed to be already running.
  // Start it with: npm run dev
});
