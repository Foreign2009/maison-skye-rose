import { defineConfig } from "@playwright/test";

/**
 * UI-1 floating assistance controls on admin vs storefront routes.
 *
 * Expects an isolated local production server on 127.0.0.1:3112 built with
 * NEXT_PUBLIC_SUPABASE_URL pointing at fulfilment-m1-mock.js (127.0.0.1:54399),
 * started with ADMIN_SECRET=m1-synthetic-admin-secret and synthetic values only
 * (the same setup as playwright.admin-fulfilment-m1.config.ts).
 *
 * Run from repo root:
 *   npx --no-install playwright test --config scripts/pw-verify/playwright.ui1-floating-assist.config.ts
 *
 * Negative control: serve a build without the UI-1 change (e.g. INT-1) the same
 * way; tests A, B (320/375) and F must then fail.
 */
export default defineConfig({
  testDir:   "./specs",
  testMatch: ["**/ui1-floating-assist.spec.js"],
  timeout:   120_000,
  retries:   0,
  workers:   1,
  reporter:  [["list"], ["json", { outputFile: process.env.UI1_REPORT || "results/ui1-floating-assist/report.json" }]],
  outputDir: "results/ui1-floating-assist/artifacts",
  use: {
    headless:       true,
    serviceWorkers: "block",
    screenshot:     "only-on-failure",
    trace:          "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
});
