// @ts-check
/**
 * Starts mock-supabase.js then npm run dev for the focused Playwright tests.
 *
 * Runs mock Supabase on port 54322; Next.js on port 3201.
 * Both processes share this process's stdio so Playwright's webServer
 * startup-log scanning works on the combined output.
 *
 * No production credentials are used. NEXT_PUBLIC_SUPABASE_URL is
 * pointed at the local mock server (http://127.0.0.1:54322).
 */

const { spawn } = require("child_process");
const path      = require("path");

const ROOT = path.resolve(__dirname, "../..");

function run(cmd, args, env) {
  return spawn(cmd, args, {
    cwd:   ROOT,
    env:   { ...process.env, ...env },
    stdio: "inherit",
    shell: process.platform === "win32",
  });
}

// ── Start mock Supabase ───────────────────────────────────────────────────────

const mock = run("node", [path.join(__dirname, "mock-supabase.js")], {
  MOCK_SUPABASE_PORT: "54322",
});

mock.on("error", err => {
  console.error("[start-focused] Failed to start mock-supabase:", err.message);
  process.exit(1);
});

// Give the mock server 300ms to start, then launch Next.js.
setTimeout(() => {
  const dev = run("npm", ["run", "dev"], {
    PORT:                          "3201",
    ADMIN_SECRET:                  "nav-test-pw",
    NEXT_PUBLIC_SUPABASE_URL:      "http://127.0.0.1:54322",
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
    NEXT_PUBLIC_WEBSITE_URL:         "http://localhost:3201",
  });

  dev.on("error", err => {
    console.error("[start-focused] Failed to start Next.js:", err.message);
    mock.kill();
    process.exit(1);
  });

  // On parent exit, clean up both children.
  function cleanup() {
    try { dev.kill("SIGTERM");  } catch (_) {}
    try { mock.kill("SIGTERM"); } catch (_) {}
  }
  process.on("exit",    cleanup);
  process.on("SIGTERM", () => { cleanup(); process.exit(0); });
  process.on("SIGINT",  () => { cleanup(); process.exit(0); });
}, 300);
