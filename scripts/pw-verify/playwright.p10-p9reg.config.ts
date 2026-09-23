import { defineConfig, devices } from "@playwright/test";

/**
 * P9 receipt regression — run against the P10 dev server (port 3098).
 *
 * Verifies that the P10 implementation preserves all P9 confirmed-state
 * assertions: collection/courier/neutral province copy, clipboard behaviour,
 * layout at 320/375/390px, FAB overlap, and WhatsApp handoff.
 *
 * The only P9 test updated here is the loading-state scenario, which changed
 * in P10: the page now shows an explicit loading indicator rather than
 * neutral confirmed-state skeleton copy.
 *
 * Run from repo root:
 *   npx playwright test --config scripts/pw-verify/playwright.p10-p9reg.config.ts
 */

const TEST_PORT = 3098;

export default defineConfig({
  testDir:   "./specs",
  testMatch: "**/p10-p9-regression.spec.js",
  timeout:   90_000,
  retries:   0,
  workers:   1,
  reporter:  [["list"], ["json", { outputFile: "results/p10-p9reg/pw-report.json" }]],
  outputDir: "results/p10-p9reg/traces",

  use: {
    baseURL:    `http://localhost:${TEST_PORT}`,
    headless:   true,
    screenshot: "only-on-failure",
    trace:      "on-first-retry",
  },

  webServer: {
    command:             "npm run dev",
    url:                 `http://localhost:${TEST_PORT}`,
    reuseExistingServer: true,
    timeout:             120_000,
    env: {
      PORT:                          `${TEST_PORT}`,
      ORDER_RECEIPT_SECRET:          "p10-test-secret-local",
      NEXT_PUBLIC_SUPABASE_URL:      "http://localhost:54321",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRFA0NiK7urfjjMvpL4luh9x2181Za7ua-ij-QfpuGg",
      SUPABASE_SERVICE_ROLE_KEY:     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hj04zWl196z2-SBcc",
      NEXT_PUBLIC_BANK_NAME:           "FNB",
      NEXT_PUBLIC_BANK_ACCOUNT_NAME:   "Maison Skye and Rose",
      NEXT_PUBLIC_BANK_ACCOUNT_NUMBER: "63012345678",
      NEXT_PUBLIC_BANK_ACCOUNT_TYPE:   "Cheque",
      NEXT_PUBLIC_BANK_BRANCH_CODE:    "250655",
    },
  },

  projects: [
    {
      name: "receipt-mobile",
      use:  { ...devices["iPhone 13 Mini"] },
    },
  ],
});
