import { defineConfig } from "@playwright/test";

/**
 * Admin Fulfilment M1 browser checks.
 *
 * Expects an isolated local production server on 127.0.0.1:3112 built with
 * NEXT_PUBLIC_SUPABASE_URL pointing at fulfilment-m1-mock.js (127.0.0.1:54399),
 * both started separately with synthetic environment values only. No
 * production services are contacted and nothing is written.
 *
 * Run from repo root:
 *   npx --no-install playwright test --config scripts/pw-verify/playwright.admin-fulfilment-m1.config.ts
 */
export default defineConfig({
  testDir:   "./specs",
  testMatch: ["**/admin-fulfilment-m1.spec.js"],
  timeout:   60_000,
  retries:   0,
  workers:   1,
  reporter:  [["list"], ["json", { outputFile: "results/admin-fulfilment-m1/report.json" }]],
  outputDir: "results/admin-fulfilment-m1/artifacts",
  use: {
    headless:       true,
    serviceWorkers: "block",
    screenshot:     "only-on-failure",
    trace:          "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
});
