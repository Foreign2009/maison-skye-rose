import { defineConfig } from "@playwright/test";

/**
 * ADMIN-P1 — admin login / Sign Out session verification.
 *
 * Reuses start-focused.js: mock Supabase on 54322 and Next.js dev on 3201 with the
 * fictional ADMIN_SECRET "nav-test-pw". No production service or credential is used.
 *
 * Run from repo root:
 *   npx playwright test --config scripts/pw-verify/playwright.admin-logout.config.ts
 */

export default defineConfig({
  testDir:   "./specs",
  testMatch: "**/admin-logout.spec.js",
  timeout:   120_000,
  retries:   0,
  workers:   1,
  reporter:  [["list"]],
  outputDir: "results/admin-logout",

  use: {
    headless:   true,
    screenshot: "only-on-failure",
    trace:      "off",
  },

  webServer: {
    command:             "node start-focused.js",
    url:                 "http://localhost:3201/robots.txt",
    reuseExistingServer: false,
    timeout:             150_000,
    stdout:              "pipe",
    stderr:              "pipe",
  },
});
