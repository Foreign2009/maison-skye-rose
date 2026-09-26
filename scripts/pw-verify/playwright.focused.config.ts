import { defineConfig } from "@playwright/test";

/**
 * Focused admin verification — synthetic orders, order detail, modal behaviour.
 *
 * Uses start-focused.js which runs mock-supabase.js on port 54322 and
 * next dev on port 3201. No production connections are made.
 */

export default defineConfig({
  testDir:   "./specs",
  testMatch: "**/focused-order-nav.spec.js",
  timeout:   120_000,
  retries:   0,
  workers:   1,
  reporter:  [["list"]],
  outputDir: "results/focused",

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
