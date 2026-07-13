/**
 * Knowledge Factory — Promotion Pipeline CLI
 *
 * Usage:
 *   npm run mkc:promote -- --queue
 *   npm run mkc:promote -- --slug <slug> --operator <name>
 *   npm run mkc:promote -- --all --operator <name>
 *   npm run mkc:promote:report
 *
 * Flags:
 *   --queue              Show approved records awaiting promotion
 *   --slug <slug>        Promote a single slug
 *   --all                Promote all approved records not yet promoted
 *   --operator <name>    Operator name (required for promote actions)
 *   --force              Re-promote even if already marked as promoted
 *   --report             Print promotion report (also: mkc:promote:report)
 *   --log                Print the last 50 promotion log entries
 */

import { promoteSingle } from "./PromotionTransaction";
import { printPromotionQueue } from "./PromotionQueue";
import { buildPromotionReport, printPromotionReport } from "./PromotionReport";
import { readPromotionLog } from "./PromotionLogger";
import { getByStatus as getReviewByStatus } from "../review/ReviewRegistry";
import { findPromotionRecord } from "./PromotionRegistry";

// ── Arg parsing ───────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const has  = (flag: string): boolean => args.includes(flag);
const get  = (flag: string): string | undefined => {
  const idx = args.indexOf(flag);
  return idx >= 0 ? args[idx + 1] : undefined;
};

const slug     = get("--slug");
const operator = get("--operator") ?? "cli";
const force    = has("--force");

// ── Route ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  if (has("--report") || args[0] === "--report") {
    const report = buildPromotionReport();
    printPromotionReport(report);
    return;
  }

  if (has("--log")) {
    const entries = readPromotionLog().slice(-50);
    if (entries.length === 0) {
      console.log("[promote] No log entries yet.");
      return;
    }
    console.log(`\n  Promotion Log  (last ${entries.length})`);
    console.log("─".repeat(62));
    for (const e of entries) {
      const ts = new Date(e.timestamp).toLocaleString();
      console.log(`  ${ts}  ${e.action.padEnd(26)}  ${e.slug}`);
      if (e.details) console.log(`       ${e.details}`);
    }
    console.log();
    return;
  }

  if (has("--queue") || args.length === 0) {
    printPromotionQueue();
    return;
  }

  if (has("--slug") && slug) {
    console.log(`\n[promote] Promoting ${slug}  operator:${operator}\n`);
    const result = await promoteSingle(slug, operator, force);
    printResult(result);
    process.exit(result.outcome === "promoted" ? 0 : 1);
    return;
  }

  if (has("--all")) {
    const approved = getReviewByStatus("approved");
    const toPromote = approved.filter(r => {
      if (force) return true;
      const p = findPromotionRecord(r.slug);
      return p?.status !== "promoted";
    });

    if (toPromote.length === 0) {
      console.log("[promote] No records ready for promotion.");
      return;
    }

    console.log(`\n[promote] Promoting ${toPromote.length} record(s)  operator:${operator}\n`);
    let ok = 0;
    let fail = 0;
    for (const r of toPromote) {
      console.log(`  → ${r.name}  (${r.slug})`);
      const result = await promoteSingle(r.slug, operator, force);
      printResult(result);
      if (result.outcome === "promoted") ok++;
      else fail++;
    }

    console.log(`\n[promote] Complete — ${ok} promoted, ${fail} failed\n`);
    process.exit(fail > 0 ? 1 : 0);
    return;
  }

  printUsage();
}

function printResult(result: Awaited<ReturnType<typeof promoteSingle>>): void {
  const icon = result.outcome === "promoted" ? "✓" : "✗";
  const dur  = result.durationMs < 60_000
    ? `${(result.durationMs / 1000).toFixed(1)}s`
    : `${(result.durationMs / 60_000).toFixed(1)}m`;
  console.log(`  ${icon}  ${result.outcome.padEnd(20)}  ${result.slug}  (${dur})`);
  console.log(`     ${result.message}`);
  if (result.error) console.log(`     Error: ${result.error}`);
  if (result.nativePath) console.log(`     Native: ${result.nativePath}`);
  if (result.validationStatus) console.log(`     Validation: ${result.validationStatus}`);
  if (result.buildResult) console.log(`     Build: ${result.buildResult}`);
  console.log();
}

function printUsage(): void {
  console.log(`
Promotion Pipeline CLI

  npm run mkc:promote -- --queue
  npm run mkc:promote -- --slug <slug> --operator <name>
  npm run mkc:promote -- --all --operator <name> [--force]
  npm run mkc:promote:report
  npm run mkc:promote -- --log
`);
}

main().catch(err => {
  console.error("[promote] Fatal error:", err instanceof Error ? err.message : err);
  process.exit(1);
});
