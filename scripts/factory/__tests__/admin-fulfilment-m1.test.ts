/**
 * Admin Fulfilment M1 — read-only dashboard logic and access checks.
 *
 * Covers the session check (before any query, fail-closed without
 * ADMIN_SECRET), SOP V2.1 reminder boundaries on a fixed clock, South African
 * display time, PayFast ITN history detection, WhatsApp reminder links and
 * filters, plus static checks that the new files contain no write, payment or
 * messaging operations.
 *
 * Run: npx tsx scripts/factory/__tests__/admin-fulfilment-m1.test.ts
 */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import {
  buildReminderLink,
  buildReminderMessage,
  formatAge,
  formatSaDateTime,
  formatTotal,
  fulfilmentMethod,
  hasPayfastItnHistory,
  matchesFilter,
  reminderStage,
  toSaWhatsAppNumber,
  type FulfilmentOrder,
} from "../../../app/lib/admin/fulfilment";
import { FULFILMENT_COLUMNS, loadFulfilment } from "../../../app/admin/fulfilment/loadFulfilment";
import { isValidAdminSessionToken } from "../../../app/lib/admin/session";

const ROOT = path.resolve(__dirname, "../../..");
let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); console.log(`  ✓  ${name}`); passed++; }
  catch (e: any) { console.log(`  ✗  ${name}\n     ${e.message}`); failed++; }
}

const SECRET = "m1-synthetic-admin-secret";
const token = (s: string) => createHash("sha256").update(s + "msr-ops-v1").digest("hex");
const NOW = Date.parse("2026-10-24T10:00:00.000Z");
const hoursAgo = (h: number) => new Date(NOW - h * 3_600_000).toISOString();

function order(over: Partial<FulfilmentOrder> = {}): FulfilmentOrder {
  return {
    order_ref: "MSR-20261024-12345", customer_name: "Synthetic Guest", phone: "0820000001",
    province: "Gauteng", total: 430, payment_status: "awaiting_payment",
    status_history: [], created_at: hoursAgo(1), ...over,
  };
}

function spyFetch(result: { data: unknown[] | null; error: { message: string } | null } = { data: [order()], error: null }) {
  const calls = { n: 0 };
  return { calls, fetchOrders: async () => { calls.n++; return result; } };
}

(async () => {
  console.log("\nA. Authentication and data protection");
  await test("A1 no session cookie → unauthorized", async () => {
    const s = spyFetch();
    assert.deepEqual(await loadFulfilment({ adminSecret: SECRET, sessionCookie: undefined, fetchOrders: s.fetchOrders }), { kind: "unauthorized" });
  });
  await test("A2 unauthenticated request performs zero database queries", async () => {
    const s = spyFetch();
    await loadFulfilment({ adminSecret: SECRET, sessionCookie: undefined, fetchOrders: s.fetchOrders });
    await loadFulfilment({ adminSecret: SECRET, sessionCookie: "forged", fetchOrders: s.fetchOrders });
    assert.equal(s.calls.n, 0);
  });
  await test("A3 missing ADMIN_SECRET fails closed, even with the token computable from an empty secret", async () => {
    const s = spyFetch();
    for (const secret of [undefined, ""]) {
      const r = await loadFulfilment({ adminSecret: secret, sessionCookie: token(""), fetchOrders: s.fetchOrders });
      assert.equal(r.kind, "unauthorized");
    }
    assert.equal(s.calls.n, 0);
    assert.equal(isValidAdminSessionToken(undefined, token("")), false);
    assert.equal(isValidAdminSessionToken("", token("")), false);
  });
  await test("A4 invalid or wrong-secret session receives no order data", async () => {
    const s = spyFetch();
    for (const cookie of ["", "x", token("other-secret"), token(SECRET) + "0", token(SECRET).toUpperCase()]) {
      const r = await loadFulfilment({ adminSecret: SECRET, sessionCookie: cookie, fetchOrders: s.fetchOrders });
      assert.equal(r.kind, "unauthorized");
      assert.ok(!("orders" in r));
    }
    assert.equal(s.calls.n, 0);
  });
  await test("A4b valid session loads orders with exactly one read", async () => {
    const s = spyFetch();
    const r = await loadFulfilment({ adminSecret: SECRET, sessionCookie: token(SECRET), fetchOrders: s.fetchOrders });
    assert.equal(r.kind, "ok");
    assert.equal(s.calls.n, 1);
  });
  await test("A4c database error or exception → safe error state without data", async () => {
    const e1 = await loadFulfilment({ adminSecret: SECRET, sessionCookie: token(SECRET), fetchOrders: async () => ({ data: null, error: { message: "boom" } }) });
    const e2 = await loadFulfilment({ adminSecret: SECRET, sessionCookie: token(SECRET), fetchOrders: async () => { throw new Error("network"); } });
    assert.deepEqual(e1, { kind: "error" });
    assert.deepEqual(e2, { kind: "error" });
  });
  await test("A4d query selects only the fields the dashboard shows", () => {
    assert.equal(FULFILMENT_COLUMNS, "order_ref, customer_name, phone, province, total, payment_status, status_history, created_at");
  });

  const NEW_FILES = [
    "app/lib/admin/fulfilment.ts",
    "app/admin/fulfilment/loadFulfilment.ts",
    "app/admin/fulfilment/page.tsx",
    "app/admin/fulfilment/FulfilmentDashboard.tsx",
    "app/admin/fulfilment/loading.tsx",
    "app/admin/fulfilment/error.tsx",
  ];
  const strip = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
  const src = Object.fromEntries(NEW_FILES.map((f) => [f, strip(readFileSync(path.join(ROOT, f), "utf8"))]));

  await test("A5 client-side files never import the service-role client or read secret env vars", () => {
    for (const f of ["app/admin/fulfilment/FulfilmentDashboard.tsx", "app/lib/admin/fulfilment.ts", "app/admin/fulfilment/error.tsx", "app/admin/fulfilment/loading.tsx"]) {
      assert.doesNotMatch(src[f], /supabaseAdmin|getSupabaseAdmin|SUPABASE_SERVICE_ROLE_KEY|ADMIN_SECRET|process\.env/, f);
    }
    assert.match(src["app/admin/fulfilment/FulfilmentDashboard.tsx"], /^"use client";/);
    assert.doesNotMatch(src["app/admin/fulfilment/page.tsx"], /"use client"/);
  });
  await test("A6 no write operations, server actions or outbound requests in new files", () => {
    for (const f of NEW_FILES) {
      // crypto hashing (createHash(...).update(...)) is not a database write
      const code = src[f].replace(/createHash\([^)]*\)\s*\.update\(/g, "");
      assert.doesNotMatch(code, /\.(insert|update|upsert|delete|rpc)\s*\(/, f);
      assert.doesNotMatch(src[f], /"use server"/, f);
      assert.doesNotMatch(src[f], /\bfetch\s*\(|method:\s*["'](POST|PATCH|PUT|DELETE)/, f);
    }
  });
  await test("A6b the only database chain is a read: .from(\"orders\").select(...).order(...)", () => {
    const page = src["app/admin/fulfilment/page.tsx"];
    assert.equal((page.match(/\.from\(/g) ?? []).length, 1);
    assert.match(page, /\.from\("orders"\)\s*\.select\(FULFILMENT_COLUMNS\)\s*\.order\("created_at", \{ ascending: false \}\)/);
  });

  console.log("\nB. Reminder boundaries (fixed clock)");
  const cases: [number, string][] = [[23, "none"], [24, "friendly"], [47, "friendly"], [48, "final"], [71, "final"], [72, "review"], [100, "review"]];
  for (const [h, expected] of cases) {
    await test(`B awaiting_payment at ${h}h → ${expected}`, () => assert.equal(reminderStage("awaiting_payment", hoursAgo(h), NOW), expected));
  }
  await test("B boundaries are exact (23h59m59s → none, 24h → friendly, 71h59m59s → final, 72h → review)", () => {
    assert.equal(reminderStage("awaiting_payment", new Date(NOW - (24 * 3_600_000 - 1000)).toISOString(), NOW), "none");
    assert.equal(reminderStage("awaiting_payment", new Date(NOW - 72 * 3_600_000 + 1000).toISOString(), NOW), "final");
  });
  for (const status of ["payment_confirmed", "processing", "dispatched", "delivered", "cancelled"]) {
    await test(`B ${status} at 100h → no reminder action`, () => assert.equal(reminderStage(status, hoursAgo(100), NOW), "not_applicable"));
  }
  await test("B missing or invalid created_at → unknown_age (never guessed)", () => {
    for (const ts of [null, undefined, "", "not-a-date"]) assert.equal(reminderStage("awaiting_payment", ts as any, NOW), "unknown_age");
    assert.equal(formatAge(null, NOW), null);
    assert.equal(formatSaDateTime("nope"), null);
  });
  await test("B displayed time is South African regardless of machine time zone", () => {
    const shown = formatSaDateTime("2026-10-24T22:30:00.000Z")!;
    assert.match(shown, /25 Oct 2026/);
    assert.match(shown, /00:30/);
  });
  await test("B stage calculation uses absolute instants (offset-equivalent inputs agree)", () => {
    const a = reminderStage("awaiting_payment", "2026-10-23T10:00:00.000Z", NOW);
    const b = reminderStage("awaiting_payment", "2026-10-23T12:00:00+02:00", NOW);
    assert.equal(a, "friendly");
    assert.equal(a, b);
  });
  await test("B age labels", () => {
    assert.equal(formatAge(hoursAgo(5), NOW), "5h");
    assert.equal(formatAge(hoursAgo(74), NOW), "3d 2h");
    assert.equal(formatAge(hoursAgo(48), NOW), "2d");
  });

  console.log("\nC. PayFast ITN history warning");
  await test("C1 a PayFast ITN history entry produces the warning", () => {
    assert.equal(hasPayfastItnHistory([{ status: "payment_confirmed", changed_at: hoursAgo(2), note: "PayFast ITN: COMPLETE" }]), true);
    assert.equal(hasPayfastItnHistory([{ status: "cancelled", changed_at: hoursAgo(2), note: "PayFast ITN: FAILED" }]), true);
  });
  await test("C2 no false warning without that indication", () => {
    assert.equal(hasPayfastItnHistory([{ status: "payment_confirmed", changed_at: hoursAgo(2), note: "EFT confirmed by team" }]), false);
    assert.equal(hasPayfastItnHistory([{ status: "awaiting_payment", changed_at: hoursAgo(2), note: "Order placed" }]), false);
    assert.equal(hasPayfastItnHistory([{ note: "Customer mentioned PayFast ITN earlier" }]), false);
    for (const h of [null, undefined, {}, "PayFast ITN", [null], [{ note: 5 }]]) assert.equal(hasPayfastItnHistory(h), false);
  });
  await test("C3 nothing claims bank verification", () => {
    for (const f of NEW_FILES) assert.doesNotMatch(src[f], /bank[\s-]?verified|verified by bank|funds verified/i, f);
  });
  await test("C4 no PayFast processing introduced; PayFast routes untouched", () => {
    for (const f of NEW_FILES) assert.doesNotMatch(src[f], /createHash\(\s*["']md5|payfast\.co\.za|\/api\/payfast|PAYFAST_/i, f);
  });

  console.log("\nD. WhatsApp handoff");
  const o24 = order({ order_ref: "MSR-20261023-11111", created_at: hoursAgo(25), total: 430 });
  await test("D1 friendly message contains the order reference and stored total", () => {
    const m = buildReminderMessage("friendly", o24);
    assert.match(m, /MSR-20261023-11111/);
    assert.match(m, /R430\.00/);
    assert.match(m, /friendly reminder/i);
  });
  await test("D2 final message contains the order reference", () => {
    const m = buildReminderMessage("final", o24);
    assert.match(m, /MSR-20261023-11111/);
    assert.match(m, /final reminder/i);
  });
  await test("D2b messages never claim payment verification, deadlines or cancellation", () => {
    for (const k of ["friendly", "final"] as const) {
      const m = buildReminderMessage(k, o24);
      assert.doesNotMatch(m, /verified|confirmed your payment|cancel|deadline|within \d+ (hours|days)/i);
    }
  });
  await test("D2c messages state only what the order record shows, never a bank-account fact", () => {
    for (const k of ["friendly", "final"] as const) {
      const m = buildReminderMessage(k, o24);
      assert.match(m, /our order records still show your EFT payment of R430\.00 as awaiting confirmation/i);
      assert.doesNotMatch(m, /reflect|not (been )?received|hasn't (arrived|come through)|our (bank|account) (shows|has)|outstanding/i);
      assert.match(m, /proof of payment/i);
    }
  });
  await test("D3/D4 South African mobile formatting and validation", () => {
    const ok: [string, string][] = [["0820000001", "27820000001"], ["082 000 0001", "27820000001"], ["+27 82 000 0001", "27820000001"],
      ["27820000001", "27820000001"], ["072-123-4567", "27721234567"], ["0612345678", "27612345678"]];
    for (const [input, expected] of ok) assert.equal(toSaWhatsAppNumber(input), expected, input);
    for (const bad of [null, undefined, "", "12345", "0211234567", "0512345678", "08200000011", "082000000", "+44 7700 900123", "abc"]) {
      assert.equal(toSaWhatsAppNumber(bad as any), null, String(bad));
    }
  });
  await test("D3b malformed phone disables the link with an explanation", () => {
    const r = buildReminderLink("friendly", order({ phone: "0211234567" }));
    assert.equal(r.ok, false);
    if (!r.ok) assert.match(r.reason, /South African mobile/);
  });
  await test("D3c valid link targets wa.me with the formatted number and encoded draft", () => {
    const r = buildReminderLink("final", o24);
    assert.equal(r.ok, true);
    if (r.ok) {
      assert.match(r.href, /^https:\/\/wa\.me\/27820000001\?text=/);
      assert.match(decodeURIComponent(r.href.split("text=")[1]), /MSR-20261023-11111/);
    }
  });
  await test("D5/D8 WhatsApp opens only from an explicit link; nothing opens or sends automatically", () => {
    const ui = src["app/admin/fulfilment/FulfilmentDashboard.tsx"];
    assert.doesNotMatch(ui, /window\.open|location\.(href|assign|replace)|useEffect/);
    assert.match(ui, /<a\s[\s\S]*?href=\{link\.href\}[\s\S]*?target="_blank"/);
  });
  await test("D6/D7 no reminder event or status write exists (covered by A6) and no record wording", () => {
    const ui = src["app/admin/fulfilment/FulfilmentDashboard.tsx"];
    assert.match(ui, /Nothing is sent or recorded/);
    assert.doesNotMatch(ui, /mark (as )?sent|reminder sent|record reminder/i);
  });
  await test("D9 at 72 hours only a manual review indicator is offered (no reminder or cancel action)", () => {
    assert.equal(reminderStage("awaiting_payment", hoursAgo(72), NOW), "review");
    const ui = src["app/admin/fulfilment/FulfilmentDashboard.tsx"];
    assert.match(ui, /stage === "friendly" && <ReminderAction/);
    assert.match(ui, /stage === "final" && <ReminderAction/);
    assert.doesNotMatch(ui, /stage === "review" && <ReminderAction/);
    assert.match(ui, /nothing is cancelled automatically/);
    assert.doesNotMatch(ui, /cancelOrder|updateStatusAction/);
  });

  console.log("\nE. Presentation logic");
  const set: FulfilmentOrder[] = [
    order({ order_ref: "A", created_at: hoursAgo(1) }),
    order({ order_ref: "B", created_at: hoursAgo(30) }),
    order({ order_ref: "C", created_at: hoursAgo(50) }),
    order({ order_ref: "D", created_at: hoursAgo(80) }),
    order({ order_ref: "E", payment_status: "payment_confirmed", created_at: hoursAgo(80) }),
    order({ order_ref: "F", payment_status: "cancelled", created_at: hoursAgo(80) }),
  ];
  const refs = (f: any) => set.filter((o) => matchesFilter(o, f, NOW)).map((o) => o.order_ref).join("");
  await test("E filters", () => {
    assert.equal(refs("all"), "ABCDEF");
    assert.equal(refs("awaiting_payment"), "ABCD");
    assert.equal(refs("reminders_due"), "BC");
    assert.equal(refs("cancellation_review"), "D");
    assert.equal(refs("payment_confirmed"), "E");
    assert.equal(refs("cancelled"), "F");
    assert.equal(refs("delivered"), "");
  });
  await test("E stored totals shown as stored, never inferred", () => {
    assert.equal(formatTotal(430), "R430.00");
    assert.equal(formatTotal(2250), "R2250.00");
    assert.equal(formatTotal(null), null);
    assert.equal(formatTotal(NaN), null);
  });
  await test("E fulfilment method read from stored province", () => {
    assert.deepEqual(fulfilmentMethod("Collection / Pickup"), { kind: "collection" });
    assert.deepEqual(fulfilmentMethod("Gauteng"), { kind: "courier", province: "Gauteng" });
    assert.deepEqual(fulfilmentMethod(null), { kind: "unknown" });
  });

  console.log(`\n${passed + failed} checks  |  ${passed} passed  |  ${failed} failed`);
  process.exit(failed ? 1 : 0);
})();
