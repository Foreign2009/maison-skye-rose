/**
 * Dry-Run Regression Tests
 *
 * CATALOGUE-WAVE7-P4: proves the --dry-run CLI contract is correctly wired
 * from argument parsing through pipeline execution.
 *
 * Run: npx tsx scripts/factory/__tests__/dry-run.test.ts
 */

import assert from "node:assert/strict";
import { readFileSync, existsSync } from "fs";
import path from "path";
import { run }              from "../orchestrator";
import { GenerationEngine } from "../core/GenerationEngine";
import { readLog }          from "../metrics/factoryLogger";

// ── Test harness ──────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void | Promise<void>): void {
  Promise.resolve().then(() => fn()).then(() => {
    console.log(`  ✓ ${name}`);
    passed++;
  }).catch((err: unknown) => {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err instanceof Error ? err.message : String(err)}`);
    failed++;
  });
}

// ── A: Source inspection — arg parsing ───────────────────────────────────────

console.log("\n── A: Source inspection ────────────────────────────────────────");

const INDEX_PATH = path.join(process.cwd(), "scripts", "factory", "index.ts");
const indexSrc   = readFileSync(INDEX_PATH, "utf-8");

test("index.ts parses --dry-run from argv", () => {
  assert.ok(
    indexSrc.includes(`args.includes("--dry-run")`),
    'Expected `args.includes("--dry-run")` in index.ts',
  );
});

test("index.ts does not hardcode dryRun: false in run() call", () => {
  assert.ok(
    !indexSrc.includes("dryRun: false"),
    "Expected no `dryRun: false` literal in index.ts run() invocation",
  );
});

test("index.ts propagates dryRun variable to run()", () => {
  assert.ok(
    indexSrc.includes("run({ slug, force, dryRun })"),
    'Expected `run({ slug, force, dryRun })` in index.ts',
  );
});

// ── B: GenerationEngine — dry-run returns without network call ───────────────

console.log("\n── B: GenerationEngine dry-run ─────────────────────────────────");

test("GenerationEngine.generate returns dry_run status when dryRun: true", async () => {
  const engine = new GenerationEngine({
    defaultProvider:      "test",
    providers:            {},
    producers:            {},
    maxSessionTokens:     100_000,
    maxProducerTokens:    4_000,
    dryRun:               true,
    logLevel:             "silent",
    logProducerArtifacts: false,
    generationTimeout:    5_000,
    producerTimeout:      5_000,
    maxAttempts:          1,
    backoffStrategy:      "linear",
    backoffBaseMs:        0,
  });

  const response = await engine.generate({
    producerName:  "test",
    promptName:    "test",
    promptVersion: "0.0.0",
    providerName:  "test",
    modelId:       "test",
    systemPrompt:  "test",
    userMessage:   "test",
    temperature:    0,
    maxTokens:      100,
    expectedFormat: "json",
    correlationId:  "dry-run-test",
    metadata:       {},
  });

  assert.equal(response.status, "dry_run", `Expected status "dry_run" but got "${response.status}"`);
  assert.equal(response.content, "", "Expected empty content for dry-run");
  assert.equal(response.confidence, 0, "Expected confidence 0 for dry-run");
});

// ── C: Runtime — dry-run does not write to factory-log.json ─────────────────

console.log("\n── C: Runtime dry-run does not pollute factory-log ────────────");

test("run({ dryRun: true }) does not append a new entry to factory-log.json", async () => {
  const logBefore = readLog();
  const countBefore = logBefore.runs.length;

  const result = await run({
    slug:    "polo-sport-inspired",
    force:   true,
    dryRun:  true,
    silent:  true,
  });

  // run() must still succeed (complete or degraded) — dry-run is not an error
  assert.ok(
    result.status === "complete" || result.status === "degraded",
    `Expected status "complete" or "degraded" but got "${result.status}"`,
  );

  const logAfter = readLog();
  assert.equal(
    logAfter.runs.length,
    countBefore,
    `factory-log.json grew from ${countBefore} to ${logAfter.runs.length} entries — dry-run must not log`,
  );
});

// ── Summary ───────────────────────────────────────────────────────────────────

setImmediate(() => {
  console.log(`\n── Results ─────────────────────────────────────────────────────`);
  console.log(`   Passed: ${passed}`);
  console.log(`   Failed: ${failed}`);
  if (failed > 0) {
    console.error("\nFAILURES PRESENT\n");
    process.exit(1);
  } else {
    console.log("\nALL PASS\n");
  }
});
