import { defineConfig } from "@playwright/test";

/**
 * Dispatch WhatsApp handoff verification suite.
 *
 * Tests the two-step dispatch form, WA notification section,
 * phone fallback, failed save behaviour, and mobile layout.
 *
 * Uses the same start-focused.js infrastructure as the focused suite:
 * mock-supabase.js on port 54322, next dev on port 3201.
 * No production connections are made.
 */

export default defineConfig({
  testDir:   "./specs",
  testMatch: ["**/dispatch-api.spec.js", "**/dispatch-handoff.spec.js", "**/dispatch-notes.spec.js"],
  timeout:   120_000,
  retries:   0,
  workers:   1,
  reporter:  [["list"]],
  outputDir: "results/dispatch",

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
