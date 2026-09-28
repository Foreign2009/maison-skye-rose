import { defineConfig } from "@playwright/test";

/**
 * WhatsApp destination verification suite.
 *
 * Fetches server-rendered HTML for static pages and asserts that all
 * WA links point to the current business number (27502154734) and that
 * bare vs. prefilled link behaviour is preserved.
 *
 * Uses the same start-focused.js infrastructure as the dispatch suite:
 * mock-supabase.js on port 54322, next dev on port 3201.
 * No production connections are made.
 */

export default defineConfig({
  testDir:   "./specs",
  testMatch: "**/wa-destinations.spec.js",
  timeout:   60_000,
  retries:   0,
  workers:   1,
  reporter:  [["list"]],
  outputDir: "results/wa",

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
