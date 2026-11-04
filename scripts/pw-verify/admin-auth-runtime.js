// @ts-check
/**
 * Admin authentication runtime check (SEC-1 / INT-1) — local only.
 *
 * Runs a built app with `next start` under three ADMIN_SECRET configurations
 * (synthetic value, empty, missing) and proves, against the real runtime:
 *
 *   1. Every admin route fails closed for no cookie and for the forged
 *      empty-secret token sha256("msr-ops-v1"): /admin shows the login form,
 *      every other route redirects to /admin (as a 3xx or as Next's streamed
 *      redirect, because app/loading.tsx makes pages stream), and no
 *      authenticated content appears.
 *   2. The counting database mock receives zero requests while unauthorised.
 *   3. A legitimate session still reaches every route.
 *   4. Identity and relationship mutations cannot be invoked with a forged
 *      session when ADMIN_SECRET is missing. Genuine Server Action requests are
 *      captured in a browser with a valid session and aborted before they reach
 *      the server; a positive control replays each one with a valid session and
 *      a blank actor, which the service rejects before any file I/O; the
 *      original requests are then replayed with a forged and with no cookie
 *      after restarting with ADMIN_SECRET missing.
 *
 * Isolation: the server runs from a sandbox copy of the built app, so editorial
 * ledger files are only ever read or written inside the sandbox; the app
 * directory's ledgers are fingerprinted before and after and must not change.
 * The app must have been built with NEXT_PUBLIC_SUPABASE_URL pointing at
 * http://127.0.0.1:<mock-port>; any supabase.co reference in the build aborts the
 * run. Outbound traffic is routed to a dead proxy and all credentials are
 * synthetic.
 *
 * Build first (from the app directory), e.g.:
 *   NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54399 NEXT_PUBLIC_WEBSITE_URL=http://127.0.0.1:3112 \
 *   SUPABASE_SERVICE_ROLE_KEY=synthetic npm run build
 *
 * Run:
 *   node scripts/pw-verify/admin-auth-runtime.js [--app-dir DIR] [--port 3114] [--mock-port 54399]
 *        [--sandbox DIR] [--results DIR] [--expect-vulnerable]
 *
 * Negative control (original 06e71ed): export it to a scratch directory
 * (git archive 06e71ed | tar -x -C <dir>), run `npm ci --offline` and the build
 * there, then run this script from INT-1 with --app-dir <dir> --expect-vulnerable.
 * It passes only if the forged cookie IS accepted there. Never point it at a
 * protected worktree.
 */

const { spawn } = require("child_process");
const crypto = require("crypto");
const fs = require("fs");
const os = require("os");
const path = require("path");

// ── Options ───────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : fallback;
};
const REPO = path.resolve(__dirname, "../..");
const APP_DIR = path.resolve(opt("app-dir", REPO));
const PORT = Number(opt("port", "3114"));
const MOCK_PORT = Number(opt("mock-port", "54399"));
const SANDBOX = path.resolve(opt("sandbox", path.join(os.tmpdir(), `msr-admin-auth-runtime-${PORT}`)));
const RESULTS = path.resolve(opt("results", path.join(REPO, "scripts", "pw-verify", "results", "admin-auth-runtime")));
const EXPECT_VULNERABLE = args.includes("--expect-vulnerable");
const LABEL = EXPECT_VULNERABLE ? "baseline-negative-control" : "integration";

const BASE = `http://127.0.0.1:${PORT}`;
const MOCK = `http://127.0.0.1:${MOCK_PORT}`;
const COOKIE = "msr-ops-session";
const SECRET = "admin-auth-runtime-synthetic-secret";
const token = (s) => crypto.createHash("sha256").update(s + "msr-ops-v1").digest("hex");
const VALID = token(SECRET);
const FORGED = token("");
const SANDBOX_MARKER = ".admin-auth-runtime-sandbox";

const ROUTES = [
  "/admin", "/admin/operations", "/admin/briefing", "/admin/alerts", "/admin/alert-center",
  "/admin/intelligence", "/admin/recommendation-performance", "/admin/customer-intelligence",
  "/admin/commerce-intelligence", "/admin/executive-operations", "/admin/executive-digest",
  "/admin/executive-report", "/admin/identity", "/admin/identity/int1-runtime-unknown-id",
  "/admin/identity/relationships", "/admin/identity/relationships/int1-runtime-unknown-review",
  "/admin/fulfilment",
];
const DYNAMIC_ROUTES = new Set(["/admin/identity/int1-runtime-unknown-id", "/admin/identity/relationships/int1-runtime-unknown-review"]);
const ADDED_IN_INTEGRATION = new Set(["/admin/fulfilment"]);

// Content that only an authenticated admin view renders.
const AUTHENTICATED_MARKERS = [
  /Sign Out/i, /Search by name, reference, or phone/i, /Suggested next action/i,
  /No website orders yet/i, /Request More Research/i, /Defer for Later/i, /MSR-\d{8}-\d{5}/,
];
const STREAMED_REDIRECT = /<meta id="__next-page-redirect" http-equiv="refresh" content="\d+;url=\/admin"\/>/;
const REDIRECT_DIGEST = /NEXT_REDIRECT;(replace|push);\/admin;30[78];/;

// ── Reporting ─────────────────────────────────────────────────────────────────

const report = { label: LABEL, appDir: APP_DIR, sandbox: SANDBOX, startedAt: new Date().toISOString(), checks: [], phases: {} };
let failures = 0;
function check(name, ok, detail = "") {
  report.checks.push({ name, ok, detail });
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? `  — ${detail}` : ""}`);
}
const note = (msg) => console.log(`      ${msg}`);

// ── Guards ────────────────────────────────────────────────────────────────────

function walkFiles(dir, filter) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walkFiles(full, filter));
    else if (!filter || filter(full)) out.push(full);
  }
  return out;
}

const isDevOrCache = (f) => {
  const rel = path.relative(path.join(APP_DIR, ".next"), f).split(path.sep);
  return rel[0] === "dev" || rel[0] === "cache";
};

function assertLocalBuild() {
  if (!fs.existsSync(path.join(APP_DIR, ".next", "BUILD_ID"))) throw new Error(`no production build in ${APP_DIR}/.next — build first`);
  // Only the production output that `next start` serves; .next/dev (left by `next dev`) holds
  // unminified library source whose doc comments mention example *.supabase.co hosts.
  const files = walkFiles(path.join(APP_DIR, ".next"), (f) => /\.(js|json|html|rsc)$/.test(f) && !isDevOrCache(f));
  let loopback = false;
  for (const f of files) {
    const text = fs.readFileSync(f, "utf8");
    if (/[a-z0-9-]+\.supabase\.co/i.test(text)) throw new Error(`build references a Supabase host (${path.relative(APP_DIR, f)}); rebuild against the local mock`);
    if (text.includes(`127.0.0.1:${MOCK_PORT}`)) loopback = true;
  }
  if (!loopback) throw new Error(`build does not reference the local mock 127.0.0.1:${MOCK_PORT}; rebuild with NEXT_PUBLIC_SUPABASE_URL=${MOCK}`);
}

const identityData = (root) => path.join(root, "app", "lib", "identity", "data");
function ledgerFingerprint(root) {
  const h = crypto.createHash("sha256");
  for (const f of walkFiles(identityData(root)).sort()) {
    h.update(path.relative(root, f).replace(/\\/g, "/"));
    h.update(fs.readFileSync(f));
  }
  return h.digest("hex").slice(0, 16);
}

// ── Sandbox ───────────────────────────────────────────────────────────────────

function removeSandbox() {
  if (!fs.existsSync(SANDBOX)) return;
  if (!fs.existsSync(path.join(SANDBOX, SANDBOX_MARKER))) throw new Error(`refusing to delete ${SANDBOX}: not a sandbox created by this script`);
  const nm = path.join(SANDBOX, "node_modules");
  if (fs.existsSync(nm) && fs.lstatSync(nm).isSymbolicLink()) fs.rmdirSync(nm); // removes the junction, never its target
  fs.rmSync(SANDBOX, { recursive: true, force: true });
}

const inside = (child, parent) => {
  const rel = path.relative(parent, child);
  return rel === "" || (!rel.startsWith("..") && !path.isAbsolute(rel));
};

function createSandbox() {
  // The sandbox is deleted recursively later, so it must never overlap the app or this repository.
  for (const dir of [APP_DIR, REPO]) {
    if (inside(SANDBOX, dir) || inside(dir, SANDBOX)) throw new Error(`sandbox ${SANDBOX} overlaps ${dir}; choose a separate directory`);
  }
  removeSandbox();
  fs.mkdirSync(SANDBOX, { recursive: true });
  fs.writeFileSync(path.join(SANDBOX, SANDBOX_MARKER), "created by scripts/pw-verify/admin-auth-runtime.js\n");
  const skip = new Set(["node_modules", ".git"]);
  for (const e of fs.readdirSync(APP_DIR, { withFileTypes: true })) {
    // next start loads .env* from its working directory: never carry local secrets into the sandbox.
    if (skip.has(e.name) || e.name.startsWith(".env")) continue;
    fs.cpSync(path.join(APP_DIR, e.name), path.join(SANDBOX, e.name), {
      recursive: true,
      filter: (src) => !src.includes(`${path.sep}.next${path.sep}cache`) && !src.includes(`${path.sep}.next${path.sep}dev`)
        && !src.includes(`${path.sep}pw-verify${path.sep}results`),
    });
  }
  fs.symlinkSync(path.join(APP_DIR, "node_modules"), path.join(SANDBOX, "node_modules"), "junction");
  const envFiles = fs.readdirSync(SANDBOX).filter((n) => n.startsWith(".env"));
  if (envFiles.length) throw new Error(`sandbox contains environment files: ${envFiles.join(", ")}`);
}

// ── Processes ─────────────────────────────────────────────────────────────────

/** @type {import("child_process").ChildProcess[]} */
const children = [];

function serverEnv(secret) {
  const env = { ...process.env };
  for (const k of Object.keys(env)) {
    if (/ADMIN_SECRET|SUPABASE|PAYFAST|POSTHOG|RESEND|OPENAI|ANTHROPIC|RECEIPT|BANK_/i.test(k)) delete env[k];
  }
  Object.assign(env, {
    NODE_ENV: "production",
    NEXT_TELEMETRY_DISABLED: "1",
    NODE_USE_ENV_PROXY: "1",
    HTTP_PROXY: "http://127.0.0.1:9",
    HTTPS_PROXY: "http://127.0.0.1:9",
    NO_PROXY: "127.0.0.1,localhost",
    NEXT_PUBLIC_SUPABASE_URL: MOCK,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "admin-auth-runtime-synthetic-anon",
    SUPABASE_SERVICE_ROLE_KEY: "admin-auth-runtime-synthetic-service",
    ORDER_RECEIPT_SECRET: "admin-auth-runtime-synthetic-receipt",
    NEXT_PUBLIC_WEBSITE_URL: BASE,
  });
  if (secret !== undefined) env.ADMIN_SECRET = secret;
  return env;
}

function startMock() {
  const child = spawn(process.execPath, [path.join(__dirname, "admin-auth-mock.js"), String(MOCK_PORT)], { stdio: "ignore" });
  children.push(child);
  return child;
}

async function startServer(secret, logName) {
  const log = { text: "" };
  const child = spawn(process.execPath, [path.join(APP_DIR, "node_modules", "next", "dist", "bin", "next"), "start", "-H", "127.0.0.1", "-p", String(PORT)], {
    cwd: SANDBOX,
    env: serverEnv(secret),
    stdio: ["ignore", "pipe", "pipe"],
  });
  children.push(child);
  child.stdout?.on("data", (d) => { log.text += d; });
  child.stderr?.on("data", (d) => { log.text += d; });
  for (let i = 0; i < 120; i++) {
    try { if ((await fetch(`${BASE}/robots.txt`)).ok) return { child, log, logName }; } catch { /* starting */ }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`server did not start:\n${log.text.slice(-2000)}`);
}

async function stopServer(server) {
  fs.writeFileSync(path.join(RESULTS, `${LABEL}-${server.logName}.log`), server.log.text);
  if (server.child.exitCode !== null) return;
  await new Promise((resolve) => { server.child.once("exit", resolve); server.child.kill(); });
}

const mockTotal = async () => (await (await fetch(`${MOCK}/__count`)).json()).total;

// ── HTTP sweep ────────────────────────────────────────────────────────────────

async function get(route, cookie) {
  const res = await fetch(BASE + route, { redirect: "manual", headers: cookie ? { cookie: `${COOKIE}=${cookie}` } : {} });
  return { status: res.status, location: res.headers.get("location") || "", body: await res.text() };
}

function failsClosed(route, r) {
  if (AUTHENTICATED_MARKERS.some((m) => m.test(r.body))) return false;
  if (route === "/admin") return r.status === 200 && /Access Code/.test(r.body);
  const headerRedirect = [302, 303, 307, 308].includes(r.status) && /\/admin$/.test(r.location);
  const streamedRedirect = r.status === 200 && STREAMED_REDIRECT.test(r.body) && REDIRECT_DIGEST.test(r.body);
  return headerRedirect || streamedRedirect;
}

async function unauthorisedSweep(phase) {
  const before = await mockTotal();
  let accepted = 0;
  for (const route of ROUTES) {
    for (const [label, cookie] of [["no cookie", undefined], ["forged empty-secret cookie", FORGED]]) {
      const r = await get(route, cookie);
      if (r.status === 404 && EXPECT_VULNERABLE && ADDED_IN_INTEGRATION.has(route)) { note(`${phase} | ${route} absent in this build (404)`); continue; }
      const closed = failsClosed(route, r);
      if (!closed) accepted++;
      if (EXPECT_VULNERABLE) note(`${phase} | ${label.padEnd(26)} | ${route} -> ${r.status} ${closed ? "fail-closed" : "ACCEPTED"}`);
      else check(`${phase} | ${label.padEnd(26)} | ${route}`, closed, `${r.status}${r.location ? ` → ${r.location}` : STREAMED_REDIRECT.test(r.body) ? " streamed redirect → /admin" : ""}`);
    }
  }
  const dbRequests = (await mockTotal()) - before;
  report.phases[phase] = { ...(report.phases[phase] || {}), unauthorisedAccepted: accepted, unauthorisedDbRequests: dbRequests };
  if (!EXPECT_VULNERABLE) check(`${phase} | database requests during unauthorised sweep`, dbRequests === 0, `${dbRequests}`);
  return { accepted, dbRequests };
}

async function validSweep(phase) {
  const before = await mockTotal();
  for (const route of ROUTES) {
    const r = await get(route, VALID);
    if (r.status === 404 && EXPECT_VULNERABLE && ADDED_IN_INTEGRATION.has(route)) continue;
    const redirected = STREAMED_REDIRECT.test(r.body) || [302, 303, 307, 308].includes(r.status);
    let ok = !redirected && (r.status === 200 || (r.status === 404 && DYNAMIC_ROUTES.has(route)));
    if (route === "/admin") ok = ok && /Search by name, reference, or phone/i.test(r.body);
    if (route === "/admin/fulfilment") ok = ok && /No website orders yet/i.test(r.body);
    check(`${phase} | valid session reaches ${route}`, ok, `${r.status}${r.status === 404 ? " (not found after authentication — unknown synthetic ID)" : ""}`);
  }
  const dbRequests = (await mockTotal()) - before;
  check(`${phase} | valid session reads from the (mock) database`, dbRequests > 0, `${dbRequests} requests`);
}

// ── Server Action capture and replay ──────────────────────────────────────────

const ACTIONS = [
  {
    name: "identity.requestMoreResearchAction",
    listPath: "/admin/identity",
    linkPattern: /^\/admin\/identity\/(?!relationships)[^/]+$/,
    openLabel: "Request More Research",
    submitLabel: "Return to Candidate",
    actorPlaceholder: "e.g. admin@maison, your initials, or a session label",
    reasonPlaceholder: "What additional research is needed?",
  },
  {
    name: "relationship.deferRelationshipAction",
    listPath: "/admin/identity/relationships",
    linkPattern: /^\/admin\/identity\/relationships\/[^/]+$/,
    openLabel: "Defer for Later",
    submitLabel: "Defer Unit",
    actorPlaceholder: "e.g. founder, your initials, or session label",
    reasonPlaceholder: "Why is this pair being deferred?",
  },
];
const REPLAY_ACTOR = "int1-runtime-replay";

async function captureActions() {
  const { chromium } = require("@playwright/test");
  const browser = await chromium.launch({ headless: true });
  const captured = [];
  try {
    const context = await browser.newContext();
    await context.addCookies([{ name: COOKIE, value: VALID, domain: "127.0.0.1", path: "/admin", httpOnly: true, sameSite: "Lax" }]);
    const page = await context.newPage();
    await page.route("**/*", (route) => (new URL(route.request().url()).origin === BASE ? route.continue() : route.abort()));
    for (const action of ACTIONS) {
      await page.goto(BASE + action.listPath, { waitUntil: "networkidle" });
      const hrefs = [...new Set(await page.locator("a[href]").evaluateAll((as) => as.map((a) => a.getAttribute("href") || "")))]
        .filter((h) => action.linkPattern.test(h));
      let found = null;
      for (const href of hrefs.slice(0, 60)) {
        await page.goto(BASE + href, { waitUntil: "networkidle" });
        const open = page.getByRole("button", { name: action.openLabel });
        if ((await open.count()) === 0 || !(await open.first().isEnabled())) continue;
        await open.first().click();
        await page.locator(`[placeholder="${action.actorPlaceholder}"]`).fill(REPLAY_ACTOR);
        await page.locator(`[placeholder="${action.reasonPlaceholder}"]`).fill("INT-1 synthetic runtime replay; must never be written");
        let request = null;
        const target = new URL(BASE + href).pathname;
        const handler = async (route) => {
          const req = route.request();
          if (req.method() === "POST" && req.headers()["next-action"]) {
            request = { url: req.url(), headers: req.headers(), body: req.postData() || "" };
            return route.abort(); // never reaches the server
          }
          return route.continue();
        };
        await page.route((url) => url.pathname === target, handler);
        await page.getByRole("button", { name: action.submitLabel }).click();
        for (let i = 0; i < 100 && !request; i++) await page.waitForTimeout(100);
        await page.unroute((url) => url.pathname === target, handler);
        if (request) { found = { ...action, href, request }; break; }
      }
      check(`capture | genuine ${action.name} request captured and aborted before reaching the server`, !!found, found ? `${found.href} (action ${found.request.headers["next-action"].slice(0, 12)}…)` : `no eligible record among ${hrefs.length}`);
      if (found) captured.push(found);
    }
  } finally {
    await browser.close();
  }
  return captured;
}

async function replay(cap, cookie, body) {
  const headers = {};
  for (const [k, v] of Object.entries(cap.request.headers)) {
    if (!/^(cookie|host|content-length|connection|accept-encoding)$/i.test(k)) headers[k] = v;
  }
  if (cookie) headers.cookie = `${COOKIE}=${cookie}`;
  const res = await fetch(cap.request.url, { method: "POST", headers, body: body ?? cap.request.body });
  return { status: res.status, text: await res.text() };
}

const UNAUTHORIZED_LOG = /Unauthorized: admin authentication required/g;
const countUnauthorizedLogs = (server) => (server.log.text.match(UNAUTHORIZED_LOG) || []).length;

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  fs.mkdirSync(RESULTS, { recursive: true });
  console.log(`admin-auth-runtime (${LABEL})\n  app: ${APP_DIR}\n  sandbox: ${SANDBOX}\n  server: ${BASE}  mock: ${MOCK}\n`);
  assertLocalBuild();
  createSandbox();
  startMock();
  for (let i = 0; i < 40; i++) { try { await mockTotal(); break; } catch { await new Promise((r) => setTimeout(r, 250)); } }

  const genuineBefore = ledgerFingerprint(APP_DIR);
  const sandboxBefore = ledgerFingerprint(SANDBOX);
  report.ledgers = { genuineBefore, sandboxBefore };

  // Phase 1 — configured secret: fail-closed sweep, valid sessions, capture + positive control.
  let captured = [];
  {
    const server = await startServer(SECRET, "configured-secret");
    try {
      console.log("\n== ADMIN_SECRET configured (synthetic)");
      await unauthorisedSweep("configured-secret");
      if (!EXPECT_VULNERABLE) await validSweep("configured-secret");
      captured = await captureActions();
      for (const cap of captured) {
        const blankActor = cap.request.body.replace(`"actor":"${REPLAY_ACTOR}"`, `"actor":"   "`);
        const swapped = blankActor !== cap.request.body;
        const r = swapped ? await replay(cap, VALID, blankActor) : { status: 0, text: "" };
        check(`positive control | ${cap.name} replayed with a valid session reaches the action (blank actor → invalid-input, no write)`,
          swapped && r.status === 200 && /invalid-input/.test(r.text) && /Actor \(reviewer name\) is required/.test(r.text),
          swapped ? `${r.status}` : "actor field not found in captured body");
      }
      check("positive control | sandbox ledgers unchanged after valid-session controls", ledgerFingerprint(SANDBOX) === sandboxBefore);
    } finally {
      await stopServer(server);
    }
  }

  // Phase 2 — empty secret.
  {
    const server = await startServer("", "empty-secret");
    try {
      console.log("\n== ADMIN_SECRET empty");
      const r = await unauthorisedSweep("empty-secret");
      if (EXPECT_VULNERABLE) check("negative control | empty secret: forged cookie accepted by the original build", r.accepted > 0, `${r.accepted} route(s) accepted`);
    } finally {
      await stopServer(server);
    }
  }

  // Phase 3 — missing secret: sweep + replay captured mutations with forged / no cookie.
  {
    const server = await startServer(undefined, "missing-secret");
    try {
      console.log("\n== ADMIN_SECRET missing");
      const r = await unauthorisedSweep("missing-secret");
      if (EXPECT_VULNERABLE) check("negative control | missing secret: forged cookie accepted by the original build", r.accepted > 0, `${r.accepted} route(s) accepted`);
      const replays = [];
      for (const cap of captured) {
        for (const [label, cookie] of [["forged empty-secret cookie", FORGED], ["no cookie", undefined]]) {
          const logsBefore = countUnauthorizedLogs(server);
          const before = ledgerFingerprint(SANDBOX);
          const res = await replay(cap, cookie);
          await new Promise((r2) => setTimeout(r2, 300));
          const changed = ledgerFingerprint(SANDBOX) !== before;
          const succeeded = /"success":true/.test(res.text);
          const refusedInLog = countUnauthorizedLogs(server) > logsBefore;
          replays.push({ action: cap.name, cookie: label, status: res.status, succeeded, ledgerChanged: changed, refusedInLog });
          if (EXPECT_VULNERABLE) note(`replay ${cap.name} | ${label} -> ${res.status} success=${succeeded} ledgerChanged=${changed}`);
          else check(`replay | ${cap.name} | ${label} | missing secret`, !succeeded && !changed && refusedInLog,
            `${res.status}, success=${succeeded}, sandbox ledger changed=${changed}, "Unauthorized" logged=${refusedInLog}`);
        }
      }
      report.replays = replays;
      if (EXPECT_VULNERABLE) {
        const forged = replays.filter((x) => x.cookie.startsWith("forged"));
        check("negative control | forged-cookie mutation executed by the original build (sandbox ledger only)", forged.some((x) => x.succeeded || x.ledgerChanged),
          forged.map((x) => `${x.action}: success=${x.succeeded} changed=${x.ledgerChanged}`).join("; "));
      }
      const dbAfter = await mockTotal();
      report.mockTotalAtEnd = dbAfter;
    } finally {
      await stopServer(server);
    }
  }

  const genuineAfter = ledgerFingerprint(APP_DIR);
  report.ledgers.genuineAfter = genuineAfter;
  check("isolation | app directory's editorial ledgers unchanged (all writes confined to the sandbox)", genuineAfter === genuineBefore, `${genuineBefore} → ${genuineAfter}`);
}

main()
  .catch((err) => { failures++; console.error(`\nERROR: ${err instanceof Error ? err.stack : err}`); })
  .finally(() => {
    for (const c of children) { try { c.kill(); } catch { /* already stopped */ } }
    try { removeSandbox(); } catch (err) { console.error(String(err)); }
    report.finishedAt = new Date().toISOString();
    report.passed = report.checks.filter((c) => c.ok).length;
    report.failed = failures;
    try { fs.writeFileSync(path.join(RESULTS, `${LABEL}-report.json`), JSON.stringify(report, null, 2)); } catch { /* results dir unavailable */ }
    console.log(`\n${LABEL}: ${report.passed} passed, ${failures} failed`);
    process.exitCode = failures ? 1 : 0;
  });
