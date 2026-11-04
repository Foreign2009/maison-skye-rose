/**
 * L-RESUME-P3C-Retry - Checkout recovery from a definitive HTTP 400
 *
 * /api/orders returns every 400 before insert, and keyed requests are looked
 * up before validation, so a 400 proves no order exists for the attempt key.
 * Checkout must then release the frozen attempt (new key, submitted: false,
 * frozen snapshot cleared) so the shopper can correct the bag or details and
 * submit manually. Every uncertain outcome (409, 5xx, network, parse failure)
 * must keep the original key and frozen payload.
 *
 * ALL checks here are SUPPLEMENTARY STATIC source checks of
 * app/checkout/page.tsx. The logic lives inside a React client component and
 * cannot be invoked without rendering it. These checks prove the wiring is
 * present in source; they do NOT prove runtime browser behaviour. Browser
 * acceptance with mocked /api/orders responses is a separate, later step.
 *
 * Deterministic; no network, no database, no storage access.
 *
 * Run: npx tsx scripts/factory/__tests__/p3c-retry-recovery.test.ts
 */

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void): void {
  try {
    fn();
    console.log(`  PASS  ${name}`);
    passed++;
  } catch (err) {
    const msg = err instanceof assert.AssertionError ? err.message : String(err);
    console.error(`  FAIL  ${name}\n        ${msg}`);
    failed++;
  }
}

// -- Source helpers ------------------------------------------------------------

const SRC = fs.readFileSync(path.resolve("app/checkout/page.tsx"), "utf-8").replace(/\r\n/g, "\n");

const FRIENDLY_400 = "We couldn't process that order. Please review your bag and details, then try again.";
const BRANCH_400 = "} else if (orderResponse.status === 400 && orderData.success === false) {";
const BRANCH_409 = "} else if (orderResponse.status === 409) {";

function count(haystack: string, needle: string): number {
  return haystack.split(needle).length - 1;
}

// Returns the text from `marker` (which must end with "{") to its matching "}".
// Naive brace counting; adequate for this file, whose strings and template
// literals contain balanced braces.
function block(source: string, marker: string): string {
  const start = source.indexOf(marker);
  assert.ok(start >= 0, `marker not found: ${marker}`);
  let depth = 0;
  for (let i = start + marker.length - 1; i < source.length; i++) {
    if (source[i] === "{") depth++;
    else if (source[i] === "}" && --depth === 0) return source.slice(start, i + 1);
  }
  throw new Error(`unbalanced block: ${marker}`);
}

// Text between two markers (first occurrence of `to` after `from`).
function between(source: string, from: string, to: string): string {
  const start = source.indexOf(from);
  assert.ok(start >= 0, `marker not found: ${from}`);
  const end = source.indexOf(to, start + from.length);
  assert.ok(end > start, `end marker not found after ${from}: ${to}`);
  return source.slice(start, end);
}

const releaseFn = block(SRC, "function releaseAttempt(): void {");
const startNewFn = block(SRC, "function handleStartNewOrder(): void {");
const clearFn = block(SRC, "function clearSavedAttempt(): void {");
const payment = block(SRC, "const handlePayment = async () => {");

const branch409 = between(payment, BRANCH_409, BRANCH_400);
const branch400 = between(payment, BRANCH_400, "} else {");
const branchElse = between(payment, BRANCH_400, "} catch {").slice(branch400.length);
const branchCatch = between(payment, "    } catch {\n      setOrderError(", "} finally {");

// Calls that would clear the cart, change form values, submit or navigate.
const FORBIDDEN_SIDE_EFFECTS = [
  "clearCart(", "setCart(", "setName(", "setPhone(", "setAddress(", "setProvince(",
  "fetch(", "handlePayment(", "window.location", "router.",
];

// -- R: releaseAttempt helper --------------------------------------------------

console.log("\nR - releaseAttempt helper [STATIC]");

test("R1 [STATIC] releaseAttempt is defined once, locally, and not exported", () => {
  assert.equal(count(SRC, "function releaseAttempt("), 1);
  assert.ok(!/export\s+(function\s+)?releaseAttempt/.test(SRC));
});

test("R2 [STATIC] releaseAttempt persists a fresh key with submitted: false", () => {
  assert.match(releaseFn, /const newKey = crypto\.randomUUID\(\);/);
  assert.match(releaseFn, /writeSavedAttempt\(\{\s*key: newKey,/);
  assert.match(releaseFn, /submitted: false/);
  assert.ok(!releaseFn.includes("submitted: true"));
});

test("R3 [STATIC] releaseAttempt clears the in-memory frozen snapshot", () => {
  assert.ok(releaseFn.includes("frozenAttemptRef.current = null;"));
});

test("R4 [STATIC] retry mode is derived from frozenAttemptRef, so R3 ends it", () => {
  assert.ok(payment.includes("const inRetryMode = frozenAttemptRef.current !== null;"));
});

test("R5 [STATIC] releaseAttempt clears conflict indicators", () => {
  for (const call of ["setShowConflictPanel(false);", "setShowBlockingConflict(false);", 'setOrderError("");']) {
    assert.ok(releaseFn.includes(call), `missing ${call}`);
  }
});

test("R6 [STATIC] releaseAttempt keeps current form values in the fresh attempt", () => {
  assert.match(releaseFn, /key: newKey, name, phone, address, province,/);
});

test("R7 [STATIC] releaseAttempt never clears the cart, edits the form, submits or navigates", () => {
  for (const s of FORBIDDEN_SIDE_EFFECTS) assert.ok(!releaseFn.includes(s), `releaseAttempt contains ${s}`);
});

test("R8 [STATIC] user-initiated reset keeps its in-flight guard before releasing", () => {
  const guard = startNewFn.indexOf("if (submittingRef.current) return;");
  const release = startNewFn.indexOf("releaseAttempt();");
  assert.ok(guard >= 0, "guard missing");
  assert.ok(release > guard, "releaseAttempt must follow the guard");
});

test("R9 [STATIC] clearSavedAttempt is unchanged: storage and key only", () => {
  assert.ok(clearFn.includes("attemptKeyRef.current = null;"));
  assert.ok(!clearFn.includes("frozenAttemptRef"));
  assert.ok(!clearFn.includes("releaseAttempt"));
});

// -- B: handlePayment response branches ----------------------------------------

console.log("\nB - handlePayment response branches [STATIC]");

test("B1 [STATIC] exactly one 400 branch, requiring status 400 AND success === false", () => {
  assert.equal(count(payment, BRANCH_400), 1);
  assert.equal(count(payment, "orderResponse.status === 400"), 1);
});

test("B2 [STATIC] branch order: success, 409, 400, then the generic else", () => {
  const success = payment.indexOf("if (orderData.success && orderData.orderRef) {");
  const c409 = payment.indexOf(BRANCH_409);
  const c400 = payment.indexOf(BRANCH_400);
  assert.ok(success >= 0 && success < c409 && c409 < c400, "unexpected branch order");
  assert.ok(branchElse.startsWith("} else {"), "generic else must follow the 400 branch");
});

test("B3 [STATIC] the body is parsed inside try before branching (parse failure -> catch)", () => {
  const tryAt = payment.indexOf("    try {\n");
  const parseAt = payment.indexOf("await orderResponse.json()");
  assert.ok(tryAt >= 0 && tryAt < parseAt && parseAt < payment.indexOf(BRANCH_400));
});

test("B4 [STATIC] the 400 branch invokes the full releaseAttempt helper", () => {
  assert.equal(count(branch400, "releaseAttempt();"), 1);
  assert.ok(!branch400.includes("handleStartNewOrder"), "must not call the guarded reset");
  assert.ok(!branch400.includes("clearSavedAttempt"), "clearSavedAttempt alone does not end retry mode");
});

test("B5 [STATIC] the friendly message is set after the release", () => {
  const release = branch400.indexOf("releaseAttempt();");
  const message = branch400.indexOf(FRIENDLY_400);
  assert.ok(message > release, "setOrderError must follow releaseAttempt (which clears orderError)");
  assert.ok(!branch400.includes("orderData.message"), "server message is not shown on this path");
});

test("B6 [STATIC] the 400 branch never resubmits, clears the cart, edits the form or navigates", () => {
  for (const s of FORBIDDEN_SIDE_EFFECTS) assert.ok(!branch400.includes(s), `400 branch contains ${s}`);
});

test("B7 [STATIC] 409 keeps the attempt and shows the conflict panel", () => {
  assert.ok(branch409.includes("setShowConflictPanel(true);"));
  assert.ok(!branch409.includes("releaseAttempt"));
  assert.ok(!branch409.includes("clearSavedAttempt"));
});

test("B8 [STATIC] generic else (500, 503, other) keeps the attempt", () => {
  assert.ok(branchElse.includes("setOrderError("));
  assert.ok(!branchElse.includes("releaseAttempt"));
  assert.ok(!branchElse.includes("clearSavedAttempt"));
  assert.ok(!branchElse.includes("frozenAttemptRef.current = null"));
});

test("B9 [STATIC] network and parse failures (catch) keep the attempt", () => {
  assert.ok(branchCatch.includes("Your order may have been placed"));
  assert.ok(!branchCatch.includes("releaseAttempt"));
  assert.ok(!branchCatch.includes("clearSavedAttempt"));
  assert.ok(!branchCatch.includes("frozenAttemptRef.current = null"));
});

test("B10 [STATIC] releaseAttempt has exactly two callers: user reset and the 400 branch", () => {
  assert.equal(count(SRC, "releaseAttempt();"), 2);
  assert.equal(count(startNewFn, "releaseAttempt();"), 1);
  assert.equal(count(branch400, "releaseAttempt();"), 1);
});

test("B11 [STATIC] handlePayment sends exactly one request (no automatic resubmission)", () => {
  assert.equal(count(payment, "fetch("), 1);
  assert.equal(count(payment, "handlePayment("), 0);
});

test("B12 [STATIC] a fresh submission uses the live cart and form, not a stale snapshot", () => {
  const fresh = between(payment, "// First submission: freeze the intent now", "const orderResponse");
  assert.match(fresh, /items:\s+cart,/);
  assert.match(fresh, /customer_name:\s+name,/);
});

console.log(`\n${passed + failed} checks  |  ${passed} passed  |  ${failed} failed`);
process.exit(failed ? 1 : 0);
