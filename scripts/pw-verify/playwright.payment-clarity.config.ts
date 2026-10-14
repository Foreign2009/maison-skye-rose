import { defineConfig, devices } from "@playwright/test";

/**
 * CHECKOUT-P11 payment clarity verification.
 *
 * Checkout explains EFT before Place Order; the receipt wording follows the order's
 * payment status; the FAQ describes the real journey. Every /api/orders request is
 * intercepted in the browser — no order is created and no database is contacted.
 * Banking values below are fictional placeholders for display checks only.
 *
 * Run from repo root:
 *   npx playwright test --config scripts/pw-verify/playwright.payment-clarity.config.ts
 */

const TEST_PORT = 3105;

export default defineConfig({
  testDir:   "./specs",
  testMatch: "**/payment-clarity.spec.js",
  timeout:   90_000,
  retries:   0,
  workers:   1,
  reporter:  [["list"], ["json", { outputFile: "results/payment-clarity/pw-report.json" }]],
  outputDir: "results/payment-clarity/traces",

  use: {
    baseURL:    `http://localhost:${TEST_PORT}`,
    headless:   true,
    screenshot: "only-on-failure",
    trace:      "on-first-retry",
  },

  webServer: {
    command:             "npm run dev",
    url:                 `http://localhost:${TEST_PORT}`,
    reuseExistingServer: false,
    timeout:             120_000,
    env: {
      PORT:                            `${TEST_PORT}`,
      ORDER_RECEIPT_SECRET:            "payment-clarity-test-secret",
      NEXT_PUBLIC_SUPABASE_URL:        "http://localhost:54321",
      NEXT_PUBLIC_SUPABASE_ANON_KEY:   "placeholder-anon-key",
      SUPABASE_SERVICE_ROLE_KEY:       "placeholder-service-role-key",
      NEXT_PUBLIC_BANK_NAME:           "Example Test Bank",
      NEXT_PUBLIC_BANK_ACCOUNT_NAME:   "Example Account Holder",
      NEXT_PUBLIC_BANK_ACCOUNT_NUMBER: "0000000000",
      NEXT_PUBLIC_BANK_ACCOUNT_TYPE:   "Test Account",
      NEXT_PUBLIC_BANK_BRANCH_CODE:    "000000",
    },
  },

  projects: [
    { name: "mobile-375",  use: { ...devices["iPhone 13 Mini"], viewport: { width: 375, height: 812 } } },
    { name: "desktop",     use: { ...devices["Desktop Chrome"], viewport: { width: 1366, height: 900 } } },
  ],
});
