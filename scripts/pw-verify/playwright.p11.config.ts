import { defineConfig, devices } from "@playwright/test";

/**
 * CHECKOUT-P11 — Browser-managed receipt cookie verification.
 *
 * Purpose
 * ───────
 * Verifies the full browser cookie lifecycle for the receipt authentication
 * system using production order and receipt handlers, isolated in-memory
 * persistence, and a dummy signing secret.
 *
 * Two-server architecture (one browser origin)
 * ─────────────────────────────────────────────
 *   Port 3101  receipt-browser-server.ts (browser-facing combined server)
 *     • Handles POST /api/orders and GET /api/orders/:ref with in-memory
 *       persistence; returns real Set-Cookie headers that the browser stores.
 *     • Reverse-proxies everything else (pages, static assets) to Next.js.
 *   Port 3102  npm run dev (internal Next.js dev server)
 *     • Serves /payment-success and all Next.js pages and static assets.
 *     • Its own /api/orders routes are never reached — the browser only
 *       talks to port 3101, which intercepts those routes first.
 *
 * Cookie lifecycle
 * ────────────────
 * The browser receives Set-Cookie from a real HTTP server response on port 3101.
 * No page.request, context.addCookies, or manual Cookie headers are used.
 * The browser stores the HttpOnly SameSite=Strict cookie natively, and subsequent
 * same-origin fetches include it automatically.
 *
 * Signing secret isolation
 * ────────────────────────
 * ORDER_RECEIPT_SECRET for port 3101 (browser server): p11-browser-test-secret
 * ORDER_RECEIPT_SECRET for port 3102 (Next.js):        p11-nextjs-different-secret
 * The two values differ intentionally: if browser-server cookies ever reach
 * Next.js API routes (misconfiguration), they are rejected.
 *
 * Local HTTP limitation
 * ─────────────────────
 * NODE_ENV is not "production" so the Secure cookie attribute is absent.
 * Production HTTPS behaviour (Secure flag) is not exercised here.
 *
 * Run from repo root:
 *   npx playwright test --config scripts/pw-verify/playwright.p11.config.ts
 */

const BROWSER_PORT = 3101;
const NEXTJS_PORT  = 3102;

export default defineConfig({
  testDir:   "./specs",
  testMatch: "**/p11-*.spec.js",
  timeout:   90_000,
  retries:   0,
  workers:   1,
  reporter:  [["list"], ["json", { outputFile: "results/p11/pw-report.json" }]],
  outputDir: "results/p11/traces",

  use: {
    baseURL:        `http://localhost:${BROWSER_PORT}`,
    headless:       true,
    screenshot:     "only-on-failure",
    trace:          "on-first-retry",
    serviceWorkers: "block",
  },

  webServer: [
    // ── 1. Next.js dev server (internal) ───────────────────────────────────
    // Serves pages and static assets. The browser never talks to this port
    // directly — it reaches it via the reverse proxy on port 3101.
    // ORDER_RECEIPT_SECRET is intentionally different from the browser server's
    // secret so any accidentally-reached Next.js API routes reject our cookies.
    {
      command:             "npm run dev",
      url:                 `http://localhost:${NEXTJS_PORT}`,
      reuseExistingServer: false,
      timeout:             120_000,
      env: {
        PORT:                          `${NEXTJS_PORT}`,
        ORDER_RECEIPT_SECRET:          "p11-nextjs-different-secret",
        NEXT_PUBLIC_SUPABASE_URL:      "http://localhost:54321",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRFA0NiK7urfjjMvpL4luh9x2181Za7ua-ij-QfpuGg",
        SUPABASE_SERVICE_ROLE_KEY:     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hj04zWl196z2-SBcc",
        // Explicitly disable analytics — empty key causes providerInit to throw,
        // which is caught by safeCall, leaving analytics silently no-op.
        // The browser-level route allowlist blocks any analytics HTTP traffic
        // regardless; these env vars provide defence-in-depth at the server level.
        NEXT_PUBLIC_POSTHOG_KEY:         "",
        NEXT_PUBLIC_POSTHOG_HOST:        "",
        NEXT_TELEMETRY_DISABLED:         "1",
        NEXT_PUBLIC_BANK_NAME:           "FNB",
        NEXT_PUBLIC_BANK_ACCOUNT_NAME:   "Maison Skye and Rose",
        NEXT_PUBLIC_BANK_ACCOUNT_NUMBER: "63012345678",
        NEXT_PUBLIC_BANK_ACCOUNT_TYPE:   "Cheque",
        NEXT_PUBLIC_BANK_BRANCH_CODE:    "250655",
        NEXT_PUBLIC_WEBSITE_URL:         `http://localhost:${NEXTJS_PORT}`,
      },
    },
    // ── 2. Browser-facing combined server (port 3101) ──────────────────────
    // Handles the two receipt API routes in-memory and proxies everything else
    // to the Next.js dev server above.
    // Health probe at /api/health responds immediately (before Next.js is ready).
    // Playwright waits for BOTH servers before starting tests, so tests only run
    // when Next.js is also ready.
    {
      command:             "npx tsx receipt-browser-server.ts",
      url:                 `http://localhost:${BROWSER_PORT}/api/health`,
      reuseExistingServer: false,
      timeout:             30_000,
      env: {
        ORDER_RECEIPT_SECRET: "p11-browser-test-secret-local-only",
        BROWSER_PORT:         `${BROWSER_PORT}`,
        NEXTJS_PORT:          `${NEXTJS_PORT}`,
      },
    },
  ],

  projects: [
    {
      name: "receipt-browser-mobile",
      use:  { ...devices["iPhone 13 Mini"] },
    },
  ],
});
