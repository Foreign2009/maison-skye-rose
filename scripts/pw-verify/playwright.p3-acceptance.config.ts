import path from "node:path";
import { defineConfig, devices } from "@playwright/test";

/**
 * P3 browser acceptance — P3A order titles, P3C cart identity, P3C-Retry
 * checkout recovery and P3D product links.
 *
 * Starts a dedicated `next dev` on port 3110. Every sensitive environment
 * variable is pinned to a placeholder or empty value so nothing is inherited
 * from the shell; the worktree has no .env.local. Each spec also installs a
 * network guard before its first navigation: only this local app is reachable,
 * /api/orders and /api/orders/<ref> are always answered by in-test mocks,
 * and any other /api/* or external request is aborted and fails the test.
 * PayFast is never configured. No order, payment, database write or
 * analytics event can leave the browser.
 *
 * The server binds to the explicit IPv4 loopback address only (`next dev`
 * defaults to 0.0.0.0, and `localhost` bound [::1] alone). 127.0.0.1 is the
 * exact origin the spec network guards allow.
 *
 * MSR_P3_PHASE (required: e2, e2r1, e2r2, e2r3, e2r4, e2r5, e3, e3r1, e3r2 or e3r3) selects the execution phase. Reports,
 * screenshots and traces go to scripts/pw-verify/results/p3-acceptance/<phase>/
 * and are retained for review. E1 evidence directly under p3-acceptance/ is
 * never written to by a phase run.
 *
 * Run from repo root (separately authorised execution gate only), e.g. PowerShell:
 *   $env:MSR_P3_PHASE = "e2"; npx --no-install playwright test --config scripts/pw-verify/playwright.p3-acceptance.config.ts
 */

// e2r1: E2 rerun after the C1 selector fix; e2r2: rerun on explicit IPv4 loopback;
// e2r3: rerun with checkout readiness waits; e2r4: rerun gated on the Elite
// collection route; e2r5: rerun after the checkout release-render fix. Each phase
// writes to its own folder, so earlier evidence stays intact. e3r1: E3 rerun with
// N4 scoped to the saved-favourites grid; e3r2: also N5 scoped to the viewed grid;
// e3r3: E3 rerun after e3r2 was blocked by the Elite readiness gate (D-ROUTE).
const PHASES = ["e2", "e2r1", "e2r2", "e2r3", "e2r4", "e2r5", "e3", "e3r1", "e3r2", "e3r3"] as const;
type Phase = (typeof PHASES)[number];

function requirePhase(value: string | undefined): Phase {
  if (!PHASES.includes(value as Phase)) {
    const received = value === undefined ? "nothing" : JSON.stringify(value);
    throw new Error(`MSR_P3_PHASE must be exactly one of: ${PHASES.join(", ")} (received ${received}).`);
  }
  return value as Phase;
}

const PHASE     = requirePhase(process.env.MSR_P3_PHASE);
const TEST_PORT = 3110;
const TEST_HOST = "127.0.0.1";
const OUTPUT    = `results/p3-acceptance/${PHASE}`;

export default defineConfig({
  testDir:   "./specs",
  testMatch: ["**/p3-nav.spec.js", "**/p3-cart.spec.js", "**/p3-checkout-recovery.spec.js"],
  timeout:   120_000,
  expect:    { timeout: 15_000 },
  retries:   0,
  workers:   1,
  fullyParallel: false,
  reporter:  [
    ["list"],
    ["json", { outputFile: `${OUTPUT}/report.json` }],
    ["html", { outputFolder: `${OUTPUT}/html`, open: "never" }],
  ],
  outputDir: `${OUTPUT}/artifacts`,
  use: {
    baseURL:           `http://${TEST_HOST}:${TEST_PORT}`,
    headless:          true,
    serviceWorkers:    "block",
    screenshot:        "only-on-failure",
    trace:             "retain-on-failure",
    navigationTimeout: 90_000,
  },
  webServer: {
    command:             `npm run dev -- --hostname ${TEST_HOST}`,
    cwd:                 path.resolve(__dirname, "../.."),
    // Ready only once a storefront route resolves: Playwright accepts 200-403,
    // so a dev-server route miss (404) on the Elite collection blocks the run.
    url:                 `http://${TEST_HOST}:${TEST_PORT}/collections/elite`,
    reuseExistingServer: false,
    timeout:             240_000,
    stdout:              "pipe",
    stderr:              "pipe",
    env: {
      PORT:                            `${TEST_PORT}`,
      NEXT_TELEMETRY_DISABLED:         "1",
      NEXT_PUBLIC_WEBSITE_URL:         `http://${TEST_HOST}:${TEST_PORT}`,
      // Placeholders only. Supabase is unreachable; order routes are mocked in-browser.
      NEXT_PUBLIC_SUPABASE_URL:        "http://localhost:54321",
      NEXT_PUBLIC_SUPABASE_ANON_KEY:   "p3-acceptance-placeholder-anon-key",
      SUPABASE_SERVICE_ROLE_KEY:       "p3-acceptance-placeholder-service-role-key",
      ORDER_RECEIPT_SECRET:            "p3-acceptance-placeholder-receipt-secret",
      ADMIN_SECRET:                    "p3-acceptance-placeholder-admin-secret",
      // Fictional banking details for display only.
      NEXT_PUBLIC_BANK_NAME:           "Example Test Bank",
      NEXT_PUBLIC_BANK_ACCOUNT_NAME:   "Example Account Holder",
      NEXT_PUBLIC_BANK_ACCOUNT_NUMBER: "0000000000",
      NEXT_PUBLIC_BANK_ACCOUNT_TYPE:   "Test Account",
      NEXT_PUBLIC_BANK_BRANCH_CODE:    "000000",
      // Analytics disabled: an empty key leaves posthog uninitialised.
      NEXT_PUBLIC_POSTHOG_KEY:         "",
      NEXT_PUBLIC_POSTHOG_HOST:        "",
      POSTHOG_PERSONAL_API_KEY:        "",
      POSTHOG_PROJECT_ID:              "",
      // PayFast stays ON HOLD: never configured for this suite.
      PAYFAST_ENV:                     "",
      PAYFAST_MERCHANT_ID:             "",
      PAYFAST_MERCHANT_KEY:            "",
      PAYFAST_PASSPHRASE:              "",
      NEXT_PUBLIC_PAYFAST_MERCHANT_ID:  "",
      NEXT_PUBLIC_PAYFAST_MERCHANT_KEY: "",
      NEXT_PUBLIC_PAYFAST_PASSPHRASE:   "",
      // Concierge model access is not part of this suite.
      ANTHROPIC_API_KEY:               "",
      CLAUDE_CONCIERGE_MODEL:          "",
    },
  },
  projects: [
    {
      name: "mobile-375",
      use:  { ...devices["iPhone 13 Mini"], browserName: "webkit", viewport: { width: 375, height: 812 } },
    },
    {
      name: "desktop",
      use:  { ...devices["Desktop Chrome"], browserName: "chromium", viewport: { width: 1366, height: 900 } },
    },
  ],
});
