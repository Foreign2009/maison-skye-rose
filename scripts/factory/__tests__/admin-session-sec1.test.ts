/**
 * SEC-1 — Shared admin session validator: fail-closed authentication tests.
 *
 * Exercises the real validator, every admin page and every privileged server action.
 * next/headers, next/navigation and next/cache are replaced by in-memory fakes, and
 * every data source a page or action could reach (Supabase admin client, analytics
 * queries, editorial services and repositories, the orders API fetch) is replaced by
 * a counting spy. Nothing connects to Supabase, PostHog or the network, and editorial
 * ledger files are never written (fs writes under app/lib/identity are refused).
 *
 *   V   validator: missing/empty secret, missing/forged/malformed/truncated/uppercase
 *       tokens, legacy-session compatibility, per-secret tokens
 *   P   all seventeen admin pages: missing/empty secret and forged cookies fail closed
 *       with zero protected reads; a valid session still reaches the data layer
 *   F   /admin/fulfilment delegated chain: page → loadFulfilment → shared
 *       isValidAdminSessionToken → fetchOrders (INT-1)
 *   A   order actions: unauthorised calls return Unauthorized with zero DB/API calls
 *   I   identity + relationship actions: unauthorised calls throw before any service
 *       or ledger repository is constructed; valid sessions still reach the service
 *   L   login/logout: cookie name, value derivation and attributes unchanged
 *   S   static: one token derivation in app/, every page and action module uses it
 *       directly, or (only /admin/fulfilment) through a verified delegation chain
 *
 * Run: npx tsx scripts/factory/__tests__/admin-session-sec1.test.ts
 */

import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const Module = require("node:module") as {
  _load: (request: string, parent: unknown, isMain: boolean) => unknown;
  _resolveFilename: (request: string, parent: unknown, isMain: boolean) => string;
};

const ROOT = path.resolve(__dirname, "../../..");
const COOKIE = "msr-ops-session";
const SECRET = "sec1-synthetic-admin-secret";

// The pre-SEC-1 derivation, reproduced independently: sessions issued before SEC-1
// must remain valid, and the empty-secret token is the forgery SEC-1 closes.
const legacyToken = (secret: string | undefined) =>
  createHash("sha256").update((secret ?? "") + "msr-ops-v1").digest("hex");
const FORGED = legacyToken("");
const VALID = legacyToken(SECRET);

// ── Harness ───────────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;
const tests: Array<() => Promise<void>> = [];

function it(name: string, fn: () => void | Promise<void>): void {
  tests.push(async () => {
    try {
      await fn();
      console.log(`  ✓  ${name}`);
      passed++;
    } catch (err) {
      const msg = err instanceof assert.AssertionError ? err.message : String(err);
      console.error(`  ✗  ${name}\n     ${msg}`);
      failed++;
    }
  });
}

// Section headings print in run order, not registration order.
const section = (title: string) => tests.push(async () => { console.log(`\n${title}`); });

// ── Fakes and spies ───────────────────────────────────────────────────────────

const calls = {
  supabaseAdmin: 0, dbFrom: 0, analytics: 0, ordersApiFetch: 0,
  editorialRepo: 0, editorialService: 0, editorialMethod: 0, editorialFileRead: 0,
  relationshipRepo: 0, relationshipService: 0, relationshipMethod: 0,
  ledgerWriteAttempt: 0, revalidate: 0, sharedValidator: 0,
};
type CallKey = keyof typeof calls;
const PROTECTED: CallKey[] = [
  "supabaseAdmin", "dbFrom", "analytics", "ordersApiFetch",
  "editorialRepo", "editorialService", "editorialMethod", "editorialFileRead",
  "relationshipRepo", "relationshipService", "relationshipMethod", "ledgerWriteAttempt",
];
const protectedCount = () => PROTECTED.reduce((n, k) => n + calls[k], 0);
const resetCalls = () => { for (const k of Object.keys(calls) as CallKey[]) calls[k] = 0; };

const jar = new Map<string, string>();
const cookieSets: Array<{ name: string; value: string; options: Record<string, unknown> }> = [];
const cookieDeletes: Array<Record<string, unknown>> = [];
const fakeCookieStore = {
  get: (name: string) => (jar.has(name) ? { name, value: jar.get(name)! } : undefined),
  set: (name: string, value: string, options: Record<string, unknown>) => { cookieSets.push({ name, value, options }); },
  delete: (options: Record<string, unknown>) => { cookieDeletes.push(options); },
};

class RedirectSignal extends Error { constructor(readonly url: string) { super(`redirect:${url}`); } }
class NotFoundSignal extends Error { constructor() { super("notFound"); } }

// A chainable, awaitable stand-in for the Supabase query builder.
function fakeQuery(): unknown {
  const result = { data: [{ order_ref: "MSR-20260101-00001" }], error: null };
  const proxy: unknown = new Proxy(function () {}, {
    get: (_t, prop) => (prop === "then" ? (res: (v: unknown) => void) => res(result) : () => proxy),
    apply: () => proxy,
  });
  return proxy;
}
const fakeDb = { from: () => { calls.dbFrom++; return fakeQuery(); } };

// Any method call on a spied service is counted and returns a successful result.
function spyService(methodKey: CallKey) {
  return new Proxy({}, {
    get: (_t, prop) => {
      if (prop === "then") return undefined;
      return () => { calls[methodKey]++; return prop === "getIdentityReview" || prop === "getReviewUnit" ? null : { success: true }; };
    },
  });
}

const resolved = (rel: string) => path.join(ROOT, rel).toLowerCase();
const MOCKS: Array<[string, (real: () => Record<string, unknown>) => unknown]> = [
  ["node_modules/next/headers.js", (real) => ({ ...real(), cookies: async () => fakeCookieStore })],
  ["node_modules/next/navigation.js", (real) => ({
    ...real(),
    redirect: (url: string) => { throw new RedirectSignal(url); },
    notFound: () => { throw new NotFoundSignal(); },
  })],
  ["node_modules/next/cache.js", (real) => ({ ...real(), revalidatePath: () => { calls.revalidate++; } })],
  [resolved("app/lib/supabaseAdmin.ts"), () => ({ getSupabaseAdmin: () => { calls.supabaseAdmin++; return fakeDb; } })],
  // Counts calls made through the shared validator's export, so delegation to it is observable.
  [resolved("app/lib/admin/session.ts"), (real) => {
    const mod = real() as typeof import("../../../app/lib/admin/session");
    return {
      ...mod,
      isValidAdminSessionToken: (secret: string | undefined, token: string | undefined) => {
        calls.sharedValidator++;
        return mod.isValidAdminSessionToken(secret, token);
      },
    };
  }],
  ...["recommendationAnalytics", "customerAnalytics", "commerceAnalytics"].map((name): [string, (real: () => Record<string, unknown>) => unknown] => [
    resolved(`app/lib/analytics/${name}.ts`),
    (real) => {
      const mod = real();
      const out: Record<string, unknown> = { ...mod };
      for (const key of Object.keys(mod)) if (key.startsWith("query")) out[key] = async () => { calls.analytics++; return {}; };
      return out;
    },
  ]),
  [resolved("app/lib/identity/editorial/index.ts"), (real) => ({
    ...real(),
    createProductionRepository: () => { calls.editorialRepo++; return {}; },
    IdentityEditorialService: function IdentityEditorialService() { calls.editorialService++; return spyService("editorialMethod"); },
  })],
  [resolved("app/lib/identity/editorial/relationship/persistence.ts"), (real) => ({
    ...real(),
    createProductionQueueRepository: () => { calls.relationshipRepo++; return {}; },
    createProductionLedgerRepository: () => { calls.relationshipRepo++; return {}; },
  })],
  [resolved("app/lib/identity/editorial/relationship/RelationshipEditorialService.ts"), () => ({
    RelationshipEditorialService: function RelationshipEditorialService() { calls.relationshipService++; return spyService("relationshipMethod"); },
  })],
];

const originalLoad = Module._load;
Module._load = function (request: string, parent: unknown, isMain: boolean) {
  let filename: string;
  try { filename = Module._resolveFilename(request, parent, isMain); } catch { return originalLoad.call(this, request, parent, isMain); }
  const key = filename.replace(/\\/g, "/").toLowerCase();
  for (const [suffix, make] of MOCKS) {
    if (key.endsWith(suffix.replace(/\\/g, "/").toLowerCase())) {
      return make(() => originalLoad.call(this, request, parent, isMain) as Record<string, unknown>);
    }
  }
  return originalLoad.call(this, request, parent, isMain);
};

// Editorial data is read from the filesystem: count reads, refuse every write.
const IDENTITY_DATA = path.join(ROOT, "app", "lib", "identity").toLowerCase();
const underIdentity = (p: unknown) => typeof p === "string" && path.resolve(p).toLowerCase().startsWith(IDENTITY_DATA);
const realReadFileSync = fs.readFileSync;
(fs as { readFileSync: unknown }).readFileSync = function (p: unknown, ...rest: unknown[]) {
  if (underIdentity(p) && String(p).endsWith(".json")) calls.editorialFileRead++;
  return (realReadFileSync as (...a: unknown[]) => unknown)(p, ...rest);
};
for (const name of ["writeFileSync", "renameSync", "appendFileSync"] as const) {
  const real = fs[name] as (...a: unknown[]) => unknown;
  (fs as Record<string, unknown>)[name] = function (p: unknown, ...rest: unknown[]) {
    if (underIdentity(p)) { calls.ledgerWriteAttempt++; throw new Error(`SEC-1 test refused ledger write: ${String(p)}`); }
    return real(p, ...rest);
  };
}

globalThis.fetch = (async (input: unknown) => {
  if (String(input).includes("/api/orders/")) calls.ordersApiFetch++;
  return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json" } });
}) as typeof fetch;

// ── Scenario helpers ──────────────────────────────────────────────────────────

type Env = { label: string; secret: string | undefined };
const ENV_MISSING: Env = { label: "ADMIN_SECRET missing", secret: undefined };
const ENV_EMPTY:   Env = { label: "ADMIN_SECRET empty",   secret: "" };
const ENV_VALID:   Env = { label: "ADMIN_SECRET set",     secret: SECRET };

function setScene(env: Env, cookie: string | undefined): void {
  if (env.secret === undefined) delete process.env.ADMIN_SECRET; else process.env.ADMIN_SECRET = env.secret;
  jar.clear();
  if (cookie !== undefined) jar.set(COOKIE, cookie);
  cookieSets.length = 0;
  cookieDeletes.length = 0;
  resetCalls();
}

const ATTACKS: Array<{ env: Env; cookie: string | undefined; label: string }> = [
  { env: ENV_MISSING, cookie: undefined, label: "missing secret, no cookie" },
  { env: ENV_MISSING, cookie: FORGED,    label: "missing secret, forged empty-secret cookie" },
  { env: ENV_EMPTY,   cookie: undefined, label: "empty secret, no cookie" },
  { env: ENV_EMPTY,   cookie: FORGED,    label: "empty secret, forged empty-secret cookie" },
  { env: ENV_VALID,   cookie: undefined, label: "valid secret, no cookie" },
  { env: ENV_VALID,   cookie: FORGED,    label: "valid secret, forged empty-secret cookie" },
  { env: ENV_VALID,   cookie: legacyToken("some-other-secret"), label: "valid secret, token for another secret" },
  { env: ENV_VALID,   cookie: VALID.slice(0, 32), label: "valid secret, truncated token" },
  { env: ENV_VALID,   cookie: VALID.toUpperCase(), label: "valid secret, uppercase token" },
  { env: ENV_VALID,   cookie: "not-a-session", label: "valid secret, malformed token" },
];

function textOf(node: unknown): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join(" ");
  const props = (node as { props?: { children?: unknown } }).props;
  return props ? textOf(props.children) : "";
}

// ── Load modules under test (after mocks are installed) ───────────────────────

// eslint-disable-next-line @typescript-eslint/no-require-imports
const session = require(path.join(ROOT, "app/lib/admin/session.ts")) as typeof import("../../../app/lib/admin/session");

function findPages(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...findPages(full));
    else if (entry.name === "page.tsx") out.push(full);
  }
  return out.sort();
}
const PAGE_FILES = findPages(path.join(ROOT, "app", "admin"));
const route = (file: string) => "/" + path.relative(path.join(ROOT, "app"), path.dirname(file)).replace(/\\/g, "/");
// Pages that authenticate through a dependency-injected loader instead of calling
// hasAdminSession() themselves. Each one must pass the delegation checks (F, S2b);
// it is never exempt from the page attack tests (P).
const DELEGATED_PAGES = ["/admin/fulfilment"];

type PageFn = (props: Record<string, unknown>) => Promise<unknown>;
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pages = PAGE_FILES.map((file) => ({ route: route(file), render: (require(file) as { default: PageFn }).default }));
const pageProps = () => ({
  params: Promise.resolve({ id: "sec1-test-identity", reviewId: "sec1-test-review" }),
  searchParams: Promise.resolve({}),
});

type Result = { kind: "redirect"; url: string } | { kind: "notFound" } | { kind: "rendered"; value: unknown } | { kind: "error"; error: unknown };
async function renderPage(render: PageFn): Promise<Result> {
  try { return { kind: "rendered", value: await render(pageProps()) }; }
  catch (err) {
    if (err instanceof RedirectSignal) return { kind: "redirect", url: err.url };
    if (err instanceof NotFoundSignal) return { kind: "notFound" };
    return { kind: "error", error: err };
  }
}

// eslint-disable-next-line @typescript-eslint/no-require-imports
const fulfilmentLoader = require(path.join(ROOT, "app/admin/fulfilment/loadFulfilment.ts")) as typeof import("../../../app/admin/fulfilment/loadFulfilment");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const orderActions = require(path.join(ROOT, "app/admin/actions.ts")) as typeof import("../../../app/admin/actions");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const identityActions = require(path.join(ROOT, "app/admin/identity/actions.ts")) as Record<string, (input: unknown) => Promise<unknown>>;
// eslint-disable-next-line @typescript-eslint/no-require-imports
const relationshipActions = require(path.join(ROOT, "app/admin/identity/relationships/actions.ts")) as Record<string, (input: unknown) => Promise<unknown>>;

// ── V. Validator ──────────────────────────────────────────────────────────────

section("V. Shared validator");

const v = session.isValidAdminSessionToken;
it("V1 missing ADMIN_SECRET rejects every cookie, including the forged empty-secret token", () => {
  assert.equal(v(undefined, undefined), false);
  assert.equal(v(undefined, FORGED), false);
  assert.equal(v(undefined, VALID), false);
});
it("V2 empty ADMIN_SECRET rejects every cookie, including the forged empty-secret token", () => {
  assert.equal(v("", undefined), false);
  assert.equal(v("", FORGED), false);
  assert.equal(v("", ""), false);
});
it("V3 missing or empty session cookie is rejected", () => {
  assert.equal(v(SECRET, undefined), false);
  assert.equal(v(SECRET, ""), false);
});
it("V4 forged empty-secret token is rejected under a configured secret", () => {
  assert.equal(v(SECRET, FORGED), false);
});
it("V5 incorrect, malformed, truncated, padded and uppercase tokens are rejected", () => {
  for (const bad of [
    legacyToken("wrong-secret"), "not-a-session", VALID.slice(0, 63), VALID.slice(0, 32),
    VALID + "0", ` ${VALID}`, `${VALID} `, VALID.toUpperCase(), "g".repeat(64), SECRET,
  ]) {
    assert.equal(v(SECRET, bad), false, `accepted ${JSON.stringify(bad.slice(0, 20))}…`);
  }
});
it("V6 valid secret with the matching existing (pre-SEC-1) session token is accepted", () => {
  assert.equal(v(SECRET, VALID), true);
  assert.equal(session.computeAdminSessionToken(SECRET), VALID);
});
it("V7 different secrets produce different tokens; one secret's token fails under another", () => {
  const a = session.computeAdminSessionToken("secret-a");
  const b = session.computeAdminSessionToken("secret-b");
  assert.notEqual(a, b);
  assert.equal(v("secret-a", a), true);
  assert.equal(v("secret-b", a), false);
  assert.equal(v("secret-a", b), false);
});
it("V8 hasAdminSession reads the msr-ops-session cookie and fails closed", async () => {
  assert.equal(session.ADMIN_SESSION_COOKIE, COOKIE);
  for (const a of ATTACKS) {
    setScene(a.env, a.cookie);
    assert.equal(await session.hasAdminSession(), false, a.label);
  }
  setScene(ENV_VALID, VALID);
  assert.equal(await session.hasAdminSession(), true);
});

// ── P. Pages ──────────────────────────────────────────────────────────────────

section("P. Admin pages");

it("P0 inventory: seventeen admin pages — sixteen check directly, only /admin/fulfilment delegates", () => {
  assert.equal(pages.length, 17, pages.map((p) => p.route).join(", "));
  assert.deepEqual(pages.filter((p) => DELEGATED_PAGES.includes(p.route)).map((p) => p.route), DELEGATED_PAGES);
});

for (const page of pages) {
  it(`P ${page.route} fails closed for all ${ATTACKS.length} attack scenarios with zero protected reads`, async () => {
    for (const a of ATTACKS) {
      setScene(a.env, a.cookie);
      const r = await renderPage(page.render);
      assert.equal(protectedCount(), 0, `${a.label}: protected calls ${JSON.stringify(calls)}`);
      if (page.route === "/admin") {
        assert.equal(r.kind, "rendered", `${a.label}: ${r.kind}`);
        const text = textOf((r as { value: unknown }).value);
        assert.match(text, /Access Code/, `${a.label}: login form not shown`);
        assert.match(text, /Sign In/);
      } else {
        assert.deepEqual(r.kind === "redirect" ? r.url : r, "/admin", `${a.label}: expected redirect to /admin`);
      }
    }
  });

  it(`P ${page.route} with a valid session reaches its data layer`, async () => {
    setScene(ENV_VALID, VALID);
    const r = await renderPage(page.render);
    assert.ok(!(r.kind === "redirect"), `redirected to ${(r as { url?: string }).url}`);
    assert.ok(protectedCount() > 0, `no data source reached: ${JSON.stringify(calls)}`);
  });
}

// ── F. /admin/fulfilment delegated authentication chain ───────────────────────

section("F. /admin/fulfilment delegated chain");

function spyFetchOrders() {
  const spy = { n: 0 };
  const fetchOrders = async () => { spy.n++; return { data: [], error: null }; };
  return { spy, fetchOrders };
}

it("F1 loadFulfilment consults the shared validator and never runs fetchOrders for any attack", async () => {
  for (const a of ATTACKS) {
    setScene(a.env, a.cookie);
    const { spy, fetchOrders } = spyFetchOrders();
    const r = await fulfilmentLoader.loadFulfilment({ adminSecret: a.env.secret, sessionCookie: a.cookie, fetchOrders });
    assert.deepEqual(r, { kind: "unauthorized" }, a.label);
    assert.equal(calls.sharedValidator, 1, `${a.label}: shared validator not consulted exactly once`);
    assert.equal(spy.n, 0, `${a.label}: fetchOrders ran`);
  }
});
it("F2 loadFulfilment with a valid session runs exactly one authorised read after the shared validator", async () => {
  setScene(ENV_VALID, VALID);
  const { spy, fetchOrders } = spyFetchOrders();
  const r = await fulfilmentLoader.loadFulfilment({ adminSecret: SECRET, sessionCookie: VALID, fetchOrders });
  assert.deepEqual(r, { kind: "ok", orders: [] });
  assert.equal(calls.sharedValidator, 1);
  assert.equal(spy.n, 1);
});
it("F3 /admin/fulfilment page passes the request's secret and session cookie through the chain", async () => {
  const page = pages.find((p) => p.route === "/admin/fulfilment");
  assert.ok(page, "/admin/fulfilment page not found");
  for (const a of ATTACKS) {
    setScene(a.env, a.cookie);
    const r = await renderPage(page.render);
    assert.equal(r.kind === "redirect" ? r.url : r.kind, "/admin", a.label);
    assert.equal(calls.sharedValidator, 1, `${a.label}: page did not reach the shared validator`);
    assert.equal(calls.supabaseAdmin + calls.dbFrom, 0, `${a.label}: order read attempted`);
  }
  setScene(ENV_VALID, VALID);
  const r = await renderPage(page.render);
  assert.equal(r.kind, "rendered");
  assert.equal(calls.sharedValidator, 1);
  assert.equal(calls.dbFrom, 1, "valid session should perform exactly one orders read");
});

// ── A. Order-management actions ───────────────────────────────────────────────

section("A. Order-management actions");

const ORDER_REF = "MSR-20260101-00001";
const orderCalls: Array<[string, () => Promise<{ success: boolean; message?: string }>]> = [
  ["updateStatusAction", () => orderActions.updateStatusAction(ORDER_REF, "payment_confirmed", "sec1 test")],
  ["updateNotesAction", () => orderActions.updateNotesAction(ORDER_REF, "sec1 test note")],
  ["updateCourierCostAction", () => orderActions.updateCourierCostAction(ORDER_REF, "85.00")],
];

for (const [name, call] of orderCalls) {
  it(`A ${name} refuses all attack scenarios with zero DB and orders-API calls`, async () => {
    for (const a of ATTACKS) {
      setScene(a.env, a.cookie);
      const res = await call();
      assert.equal(res.success, false, a.label);
      assert.match(res.message ?? "", /Unauthorized|Server misconfiguration/, a.label);
      assert.equal(protectedCount(), 0, `${a.label}: ${JSON.stringify(calls)}`);
    }
  });
  it(`A ${name} still succeeds with a valid session`, async () => {
    setScene(ENV_VALID, VALID);
    const res = await call();
    assert.equal(res.success, true, res.message);
    assert.ok(protectedCount() > 0);
  });
}

// ── I. Identity and relationship editorial actions ────────────────────────────

section("I. Identity and relationship actions");

const editorialModules: Array<[string, Record<string, (input: unknown) => Promise<unknown>>, number]> = [
  ["identity", identityActions, 7],
  ["relationship", relationshipActions, 3],
];

for (const [label, mod, expected] of editorialModules) {
  const names = Object.keys(mod).filter((k) => typeof mod[k] === "function");
  it(`I ${label}: ${expected} exported actions found`, () => {
    assert.equal(names.length, expected, names.join(", "));
  });
  for (const name of names) {
    it(`I ${label}.${name} throws Unauthorized before any service or ledger repository exists`, async () => {
      for (const a of ATTACKS) {
        setScene(a.env, a.cookie);
        await assert.rejects(mod[name]({}), /Unauthorized: admin authentication required/, a.label);
        assert.equal(protectedCount(), 0, `${a.label}: ${JSON.stringify(calls)}`);
        assert.equal(calls.revalidate, 0, a.label);
      }
    });
    it(`I ${label}.${name} reaches the editorial service with a valid session (no ledger file written)`, async () => {
      setScene(ENV_VALID, VALID);
      await mod[name]({});
      const method = label === "identity" ? calls.editorialMethod : calls.relationshipMethod;
      assert.equal(method, 1);
      assert.equal(calls.ledgerWriteAttempt, 0);
    });
  }
}

// ── L. Login and logout compatibility ─────────────────────────────────────────

section("L. Login and logout");

const form = (password: string) => { const f = new FormData(); f.set("password", password); return f; };
async function redirectOf(fn: () => Promise<unknown>): Promise<string> {
  try { await fn(); } catch (err) { if (err instanceof RedirectSignal) return err.url; throw err; }
  throw new Error("expected a redirect");
}

it("L1 correct password issues the unchanged session cookie (name, value, attributes)", async () => {
  setScene(ENV_VALID, undefined);
  assert.equal(await redirectOf(() => orderActions.loginAction(form(SECRET))), "/admin");
  assert.equal(cookieSets.length, 1);
  const { name, value, options } = cookieSets[0];
  assert.equal(name, COOKIE);
  assert.equal(value, VALID, "token derivation changed — existing sessions would be invalidated");
  assert.deepEqual(options, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 60 * 60 * 8, path: "/admin" });
});
it("L2 the issued cookie is accepted by the shared validator", () => {
  assert.equal(v(SECRET, cookieSets[0]?.value ?? ""), true);
});
it("L3 wrong password, missing secret and empty secret all refuse login without a cookie", async () => {
  for (const [env, pw] of [[ENV_VALID, "wrong"], [ENV_MISSING, ""], [ENV_EMPTY, ""], [ENV_MISSING, "anything"]] as const) {
    setScene(env, undefined);
    assert.equal(await redirectOf(() => orderActions.loginAction(form(pw))), "/admin?error=invalid", env.label);
    assert.equal(cookieSets.length, 0, env.label);
  }
});
it("L4 logout deletes msr-ops-session on path /admin and redirects, as before", async () => {
  setScene(ENV_VALID, VALID);
  assert.equal(await redirectOf(() => orderActions.logoutAction()), "/admin");
  assert.deepEqual(cookieDeletes, [{ name: COOKIE, path: "/admin", httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" }]);
  assert.equal(protectedCount(), 0);
});

// ── S. Static guarantees ──────────────────────────────────────────────────────

section("S. Static checks");

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    return e.isDirectory() ? walk(full) : /\.(ts|tsx)$/.test(e.name) ? [full] : [];
  });
}
const appFiles = walk(path.join(ROOT, "app"));
const read = (f: string) => realReadFileSync(f, "utf8") as string;

it("S1 the session salt and token derivation exist only in app/lib/admin/session.ts", () => {
  const holders = appFiles.filter((f) => read(f).includes("msr-ops-v1")).map((f) => path.relative(ROOT, f).replace(/\\/g, "/"));
  assert.deepEqual(holders, ["app/lib/admin/session.ts"]);
  const local = appFiles.filter((f) => /function computeSessionToken|async function hasAdminSession|function isValidAdminSession\b|function sessionTokenFor/.test(read(f)) && !f.endsWith(path.join("admin", "session.ts")));
  assert.deepEqual(local, []);
  const constantTime = appFiles.filter((f) => read(f).includes("timingSafeEqual")).map((f) => path.relative(ROOT, f).replace(/\\/g, "/"));
  assert.deepEqual(constantTime, ["app/lib/admin/session.ts"], "a second session comparison exists");
});
it("S2 every directly-checking admin page imports the shared validator and none compares the cookie itself", () => {
  const direct = PAGE_FILES.filter((f) => !DELEGATED_PAGES.includes(route(f)));
  assert.equal(direct.length, 16);
  for (const f of direct) {
    const src = read(f);
    assert.match(src, /import \{ hasAdminSession \}\s+from "@\/app\/lib\/admin\/session";/, f);
    assert.match(src, /await hasAdminSession\(\)/, f);
    assert.doesNotMatch(src, /msr-ops-session|ADMIN_SECRET|createHash/, f);
  }
});
it("S2b /admin/fulfilment delegates to the shared validator before its only order read", () => {
  const strip = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
  const page = strip(read(path.join(ROOT, "app/admin/fulfilment/page.tsx")));
  assert.match(page, /import \{ ADMIN_SESSION_COOKIE \} from "\.\.\/\.\.\/lib\/admin\/session";/);
  assert.match(page, /adminSecret:\s+process\.env\.ADMIN_SECRET,/);
  assert.match(page, /sessionCookie: cookieStore\.get\(ADMIN_SESSION_COOKIE\)\?\.value,/);
  assert.match(page, /if \(result\.kind === "unauthorized"\) redirect\("\/admin"\);/);
  assert.equal((page.match(/getSupabaseAdmin\(\)/g) ?? []).length, 1, "the order read must live only inside fetchOrders");
  assert.match(page, /fetchOrders:\s+async \(\) =>\s+getSupabaseAdmin\(\)/);
  assert.doesNotMatch(page, /msr-ops-session|msr-ops-v1|createHash|timingSafeEqual/);

  const loader = strip(read(path.join(ROOT, "app/admin/fulfilment/loadFulfilment.ts")));
  assert.match(loader, /import \{ isValidAdminSessionToken \} from "\.\.\/\.\.\/lib\/admin\/session";/);
  const check = loader.indexOf('if (!isValidAdminSessionToken(deps.adminSecret, deps.sessionCookie)) return { kind: "unauthorized" };');
  const read1 = loader.indexOf("deps.fetchOrders(");
  assert.ok(check > 0 && read1 > check, "the shared check must precede fetchOrders");
  assert.equal((loader.match(/deps\.fetchOrders\(/g) ?? []).length, 1);
  assert.doesNotMatch(loader, /msr-ops|createHash|timingSafeEqual|from "crypto"/);
});
it("S3 every privileged action module uses the shared validator", () => {
  for (const rel of ["app/admin/actions.ts", "app/admin/identity/actions.ts", "app/admin/identity/relationships/actions.ts"]) {
    const src = read(path.join(ROOT, rel));
    assert.match(src, /hasAdminSession/, rel);
    assert.doesNotMatch(src, /createHash|session !== |=== computeSessionToken/, rel);
  }
});
it("S4 the session module is never imported by a client component", () => {
  const clients = appFiles.filter((f) => /^\s*["']use client["']/.test(read(f)) && read(f).includes("lib/admin/session"));
  assert.deepEqual(clients, []);
});

// ── Run ───────────────────────────────────────────────────────────────────────

(async () => {
  for (const t of tests) await t();
  console.log(`\n${passed} passed, ${failed} failed (${passed + failed} checks)`);
  if (failed > 0) process.exit(1);
})();
