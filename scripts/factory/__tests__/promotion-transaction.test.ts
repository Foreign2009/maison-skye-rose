/**
 * PromotionTransaction — Native Existence Guard Regression Tests
 *
 * PROMOTION-SAFETY-P1: verifies that PromotionTransaction blocks normal
 * promotion when a native MKC file already exists, and that --force
 * correctly bypasses the guard.
 *
 * Testability approach: Option C — shouldBlockNativeOverwrite() is a pure
 * exported helper that captures the guard decision. Tests cover:
 *
 *   Section A — Pure helper unit tests (PT-01, PT-02, PT-10)
 *   Section B — Code ordering proofs (PT-03, PT-06, PT-07, PT-08)
 *   Section C — Safe integration via review gate (PT-04, PT-05)
 *
 * PT-09 (rollback behavior) requires triggering a real post-write failure
 * inside a full transaction, which cannot be done safely without either
 * touching real native MKC files or a filesystem mock layer that does not
 * exist in this architecture. It is not implemented here per P1-7.
 *
 * Run: npx tsx scripts/factory/__tests__/promotion-transaction.test.ts
 */

import assert from "node:assert/strict";
import { readFileSync } from "fs";
import path from "path";

import { shouldBlockNativeOverwrite, promoteSingle } from "../promotion/PromotionTransaction";

// ── Test harness ──────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void | Promise<void>): void | Promise<void> {
  const result = (() => {
    try {
      const r = fn();
      if (r instanceof Promise) {
        return r.then(() => {
          console.log(`  ✓  ${name}`);
          passed++;
        }).catch(err => {
          const msg = err instanceof assert.AssertionError ? err.message : String(err);
          console.error(`  ✗  ${name}\n     ${msg}`);
          failed++;
        });
      }
      console.log(`  ✓  ${name}`);
      passed++;
    } catch (err) {
      const msg = err instanceof assert.AssertionError ? err.message : String(err);
      console.error(`  ✗  ${name}\n     ${msg}`);
      failed++;
    }
  })();
  return result;
}

// ── Section A: Pure guard helper ─────────────────────────────────────────────
// Tests the extracted shouldBlockNativeOverwrite() decision function.
// Proves PT-01, PT-02, and PT-10 semantics without filesystem access.

console.log("\nSection A — shouldBlockNativeOverwrite() pure guard logic\n");

test("PT-A-01 (PT-01 semantics): no native file, force=false — guard passes", () => {
  assert.equal(
    shouldBlockNativeOverwrite(false, false),
    false,
    "guard must not block when native file does not exist",
  );
});

test("PT-A-02 (PT-02 semantics): native exists, force=false — guard blocks", () => {
  assert.equal(
    shouldBlockNativeOverwrite(true, false),
    true,
    "guard must block when native file exists and force is false",
  );
});

test("PT-A-03 (PT-10 semantics): native exists, force=true — guard bypassed", () => {
  assert.equal(
    shouldBlockNativeOverwrite(true, true),
    false,
    "guard must not block when force=true, even if native file exists",
  );
});

test("PT-A-04: no native file, force=true — guard passes", () => {
  assert.equal(
    shouldBlockNativeOverwrite(false, true),
    false,
    "guard must not block when native file does not exist, regardless of force",
  );
});

// ── Section B: Code ordering proofs ──────────────────────────────────────────
// Reads PromotionTransaction.ts source to assert that the native existence
// guard appears before every mutation in the transaction sequence.
// Proves PT-03 (step 2 precedes guard), PT-06 (native write), PT-07 (index),
// PT-08 (registry/log).

console.log("\nSection B — code ordering: guard precedes all mutations\n");

const TX_SOURCE_PATH = path.join(
  process.cwd(),
  "scripts", "factory", "promotion", "PromotionTransaction.ts",
);

test("source file is readable", () => {
  const src = readFileSync(TX_SOURCE_PATH, "utf-8");
  assert.ok(src.length > 0, "PromotionTransaction.ts must be non-empty");
});

test("PT-B-01 (PT-08): guard precedes upsertPromotionRecord (registry mutation)", () => {
  const src = readFileSync(TX_SOURCE_PATH, "utf-8");
  const guardIdx  = src.indexOf("shouldBlockNativeOverwrite(existsSync(nativePath)");
  const upsertIdx = src.indexOf("upsertPromotionRecord(promotionRecord)");
  assert.ok(guardIdx > 0,  "guard call not found in source");
  assert.ok(upsertIdx > 0, "upsertPromotionRecord call not found in source");
  assert.ok(
    guardIdx < upsertIdx,
    `guard must appear before upsertPromotionRecord — guard@${guardIdx}, upsert@${upsertIdx}`,
  );
});

test("PT-B-02 (PT-06): guard precedes writeFileSync(nativePath...) (native file write)", () => {
  const src = readFileSync(TX_SOURCE_PATH, "utf-8");
  const guardIdx      = src.indexOf("shouldBlockNativeOverwrite(existsSync(nativePath)");
  const writeNativeIdx = src.indexOf("writeFileSync(nativePath, nativeContent");
  assert.ok(guardIdx > 0,       "guard call not found in source");
  assert.ok(writeNativeIdx > 0, "writeFileSync(nativePath...) call not found in source");
  assert.ok(
    guardIdx < writeNativeIdx,
    `guard must appear before writeFileSync(nativePath...) — guard@${guardIdx}, write@${writeNativeIdx}`,
  );
});

test("PT-B-03 (PT-07): guard precedes addToIndex (index mutation)", () => {
  const src = readFileSync(TX_SOURCE_PATH, "utf-8");
  const guardIdx    = src.indexOf("shouldBlockNativeOverwrite(existsSync(nativePath)");
  const addIndexIdx = src.indexOf("addToIndex(slug, symbol)");
  assert.ok(guardIdx > 0,    "guard call not found in source");
  assert.ok(addIndexIdx > 0, "addToIndex call not found in source");
  assert.ok(
    guardIdx < addIndexIdx,
    `guard must appear before addToIndex — guard@${guardIdx}, addIndex@${addIndexIdx}`,
  );
});

test("PT-B-04 (PT-08): guard precedes logPromotionAction('promotion_started') (log mutation)", () => {
  const src = readFileSync(TX_SOURCE_PATH, "utf-8");
  const guardIdx   = src.indexOf("shouldBlockNativeOverwrite(existsSync(nativePath)");
  const logStartIdx = src.indexOf(`logPromotionAction("promotion_started"`);
  assert.ok(guardIdx > 0,    "guard call not found in source");
  assert.ok(logStartIdx > 0, "logPromotionAction('promotion_started') call not found in source");
  assert.ok(
    guardIdx < logStartIdx,
    `guard must appear before logPromotionAction("promotion_started") — guard@${guardIdx}, log@${logStartIdx}`,
  );
});

test("PT-B-05 (PT-03): already_promoted check (step 2) precedes native existence guard (step 4.5)", () => {
  const src = readFileSync(TX_SOURCE_PATH, "utf-8");
  const alreadyPromotedIdx = src.indexOf(`"already_promoted"`);
  const guardIdx           = src.indexOf("shouldBlockNativeOverwrite(existsSync(nativePath)");
  assert.ok(alreadyPromotedIdx > 0, '"already_promoted" string not found in source');
  assert.ok(guardIdx > 0,           "guard call not found in source");
  assert.ok(
    alreadyPromotedIdx < guardIdx,
    `step 2 (already_promoted) must precede step 4.5 (native guard) — ` +
    `already_promoted@${alreadyPromotedIdx}, guard@${guardIdx}`,
  );
});

// ── Section C: Safe integration tests ────────────────────────────────────────
// Calls promoteSingle() with slugs that are NOT approved in the review queue.
// Step 1 (review gate) returns review_required — a pure read-only operation.
// Zero promotion registry, log, history, native file, or index mutations occur.

console.log("\nSection C — safe integration: review gate blocks before native guard\n");

test("PT-C-01 (PT-04): needs_regeneration slug returns review_required before guard", async () => {
  // bianco-latte-inspired is confirmed needs_regeneration in review-queue.json.
  // Step 1 reads the review queue and returns immediately — no mutations possible.
  const result = await promoteSingle("bianco-latte-inspired", "automated-test", false);
  assert.equal(
    result.outcome,
    "review_required",
    `expected review_required, got ${result.outcome}: ${result.message}`,
  );
  assert.equal(result.nativePath, null, "nativePath must be null for a review-blocked result");
  assert.equal(result.buildResult, null, "buildResult must be null for a review-blocked result");
});

test("PT-C-02 (PT-05): slug absent from review queue returns review_required before guard", async () => {
  // A slug with no review queue entry never reaches the native guard.
  const result = await promoteSingle("__nonexistent-test-slug__", "automated-test", false);
  assert.equal(
    result.outcome,
    "review_required",
    `expected review_required, got ${result.outcome}: ${result.message}`,
  );
  assert.equal(result.nativePath, null, "nativePath must be null for a review-blocked result");
});

// ── Summary ───────────────────────────────────────────────────────────────────

// Allow async tests to settle before printing
setImmediate(() => {
  // Small delay to let any pending promise microtasks resolve
  setTimeout(() => {
    console.log(`\n${passed + failed} tests: ${passed} PASS, ${failed} FAIL`);
    console.log();
    if (failed > 0) process.exit(1);
  }, 100);
});
