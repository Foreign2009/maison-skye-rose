import { defineConfig } from "@playwright/test";

/**
 * Admin navigation verification — isolated, no production connections.
 *
 * Dev server on port 3200 with dummy ADMIN_SECRET and dummy Supabase credentials.
 * Admin renders with empty order list (Supabase localhost:54321 connection refused).
 */

export default defineConfig({
  testDir:   "./specs",
  testMatch: "**/nav-verify.spec.js",
  timeout:   120_000,
  retries:   0,
  workers:   1,
  reporter:  [["list"]],
  outputDir: "results/nav-verify",

  use: {
    headless:   true,
    screenshot: "only-on-failure",
    trace:      "off",
  },

  webServer: {
    command:             "npm run dev",
    url:                 "http://localhost:3200/robots.txt",
    reuseExistingServer: false,
    timeout:             120_000,
    env: {
      PORT:                          "3200",
      ADMIN_SECRET:                  "nav-test-pw",
      NEXT_PUBLIC_SUPABASE_URL:      "http://localhost:54321",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRFA0NiK7urfjjMvpL4luh9x2181Za7ua-ij-QfpuGg",
      SUPABASE_SERVICE_ROLE_KEY:     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hj04zWl196z2-SBcc",
      NEXT_PUBLIC_POSTHOG_KEY:         "",
      NEXT_PUBLIC_POSTHOG_HOST:        "",
      NEXT_TELEMETRY_DISABLED:         "1",
      NEXT_PUBLIC_BANK_NAME:           "Test",
      NEXT_PUBLIC_BANK_ACCOUNT_NAME:   "Test",
      NEXT_PUBLIC_BANK_ACCOUNT_NUMBER: "000000",
      NEXT_PUBLIC_BANK_ACCOUNT_TYPE:   "Cheque",
      NEXT_PUBLIC_BANK_BRANCH_CODE:    "000000",
      NEXT_PUBLIC_WEBSITE_URL:         "http://localhost:3200",
    },
  },
});
