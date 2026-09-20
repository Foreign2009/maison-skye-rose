import { defineConfig, devices } from "@playwright/test";

/**
 * Checkout idempotency end-to-end verification suite.
 *
 * The webServer block below starts a FRESH Next.js dev instance on port 3099
 * with ALL Supabase/secret environment variables replaced by local placeholders.
 * This ensures no production credentials are reachable even if a route handler
 * is accidentally missing from a test.
 *
 * Run from repo root:
 *   npx playwright test --config scripts/pw-verify/playwright.config.ts
 *
 * Browser prerequisites (first run only):
 *   npx playwright install
 *
 * The suite does NOT require a manually started dev server — Playwright starts
 * and stops the isolated server automatically.
 */

const TEST_PORT = 3099;

export default defineConfig({
  testDir:             "./specs",
  testMatch:           "**/*.spec.js",
  timeout:             60_000,
  retries:             0,
  workers:             1,
  reporter:            [["list"], ["json", { outputFile: "results/p8/pw-report.json" }]],
  outputDir:           "results/p8/traces",

  use: {
    baseURL:    `http://localhost:${TEST_PORT}`,
    headless:   true,
    screenshot: "only-on-failure",
    trace:      "on-first-retry",
  },

  webServer: {
    // Start a dedicated test server that REPLACES all Supabase and secret
    // environment variables with non-production placeholders. The PORT env
    // var is respected by Next.js; --port is not needed on the command line.
    command:             "npm run dev",
    url:                 `http://localhost:${TEST_PORT}`,
    reuseExistingServer: false,
    timeout:             120_000,
    env: {
      PORT:                          `${TEST_PORT}`,
      ORDER_RECEIPT_SECRET:          "p8-test-secret-local",
      // Supabase URL and keys are replaced with local-stack placeholders.
      // All /api/orders calls are also intercepted by route handlers, so
      // these values are never actually contacted during the test run.
      NEXT_PUBLIC_SUPABASE_URL:      "http://localhost:54321",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRFA0NiK7urfjjMvpL4luh9x2181Za7ua-ij-QfpuGg",
      SUPABASE_SERVICE_ROLE_KEY:     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hj04zWl196z2-SBcc",
    },
  },

  projects: [
    {
      name: "checkout-mobile",
      use:  { ...devices["iPhone 13 Mini"] },
    },
  ],
});
