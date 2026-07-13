/**
 * Knowledge Operations Dashboard — Renderer
 *
 * Converts DashboardData into a human-readable terminal dashboard.
 * No data fetching — receives pre-assembled DashboardData only.
 *
 * Layout:
 *   ╔══ HEADER ══╗
 *   ║ HEALTH INDICATORS
 *   ║ FACTORY
 *   ║ BATCH
 *   ║ REVIEW QUEUE
 *   ║ PROMOTION
 *   ║ REPOSITORY
 *   ║ OPERATIONS
 *   ║ PROGRESS
 *   ╚═════════════╝
 */

import type { DashboardData, HealthIndicator, HealthStatus, ProducerSuccessRate } from "./DashboardMetrics";

// ── Formatting ────────────────────────────────────────────────────────────────

const WIDE  = 66;
const SEP   = "═".repeat(WIDE);
const DIV   = "─".repeat(WIDE);
const THIN  = "·".repeat(WIDE);

function col(label: string, value: string | number, note = ""): string {
  const l = String(label).padEnd(28);
  const v = String(value).padStart(8);
  return `  ${l} ${v}${note ? `   ${note}` : ""}`;
}

function twoCol(
  l1: string, v1: string | number,
  l2: string, v2: string | number,
): string {
  const a = `${String(l1).padEnd(16)} ${String(v1).padStart(5)}`;
  const b = `${String(l2).padEnd(16)} ${String(v2).padStart(5)}`;
  return `  ${a}    ${b}`;
}

function fmtMs(ms: number | null): string {
  if (ms === null) return "—";
  if (ms < 1_000)      return `${ms}ms`;
  if (ms < 60_000)     return `${(ms / 1000).toFixed(1)}s`;
  const m = Math.floor(ms / 60_000);
  const s = Math.floor((ms % 60_000) / 1000);
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString();
}

function fmtCost(usd: number): string {
  if (usd < 0.01) return `< $0.01`;
  return `~$${usd.toFixed(2)}`;
}

function fmtTokens(n: number): string {
  if (n === 0) return "—";
  return n.toLocaleString();
}

// ── Health ────────────────────────────────────────────────────────────────────

function healthIcon(status: HealthStatus): string {
  if (status === "healthy")  return "🟢";
  if (status === "warning")  return "🟡";
  return "🔴";
}

function healthLabel(status: HealthStatus): string {
  if (status === "healthy")  return "Healthy";
  if (status === "warning")  return "Warning";
  return "Critical";
}

function renderHealth(h: HealthIndicator): string {
  const icon   = healthIcon(h.status);
  const label  = healthLabel(h.status);
  const detail = h.reasons.length > 0 ? `  — ${h.reasons[0]}` : "";
  return `  ${icon} ${h.label.padEnd(12)} ${label}${detail}`;
}

// ── Producer rates ────────────────────────────────────────────────────────────

function renderProducerRate(rate: ProducerSuccessRate): string {
  if (rate.total === 0) return `  ${rate.name.padEnd(16)} —`;
  const pct   = (rate.successRate * 100).toFixed(0).padStart(3);
  const stats = `pass:${rate.pass}  deg:${rate.degraded}  fail:${rate.fail}`;
  return `  ${rate.name.padEnd(16)} ${pct}%   ${stats}`;
}

// ── Progress bars ─────────────────────────────────────────────────────────────

function renderProgressBar(label: string, bar: string, pct: number, current: number, total: number): string {
  const pctStr     = `${pct.toFixed(1)}%`.padStart(6);
  const countStr   = `(${current}/${total})`;
  return `  ${label.padEnd(20)} ${bar} ${pctStr}  ${countStr}`;
}

// ── Main renderer ─────────────────────────────────────────────────────────────

export function renderDashboard(data: DashboardData): void {
  const ts = new Date(data.generatedAt).toLocaleString();

  // ── Header ────────────────────────────────────────────────────────────────
  console.log(`\n${SEP}`);
  console.log(`  Knowledge Factory — Operations Dashboard`);
  console.log(`  ${ts}`);
  console.log(`${SEP}`);

  // ── System health ─────────────────────────────────────────────────────────
  const { health } = data;
  const oi = healthIcon(health.overall.status);
  const ol = healthLabel(health.overall.status);
  console.log(`\n  SYSTEM HEALTH          ${oi} ${ol}`);
  console.log(DIV);
  console.log(renderHealth(health.factory));
  console.log(renderHealth(health.review));
  console.log(renderHealth(health.promotion));
  console.log(renderHealth(health.repository));
  if (health.overall.reasons.length > 0) {
    console.log();
    for (const r of health.overall.reasons) {
      console.log(`    ⚠  ${r}`);
    }
  }

  // ── Factory ───────────────────────────────────────────────────────────────
  const { factory } = data;
  console.log(`\n  FACTORY`);
  console.log(DIV);
  console.log(col("Version",        factory.factoryVersion));
  console.log(col("Producer Stack", factory.producerStack.join("  ")));
  console.log(col("Last Run",       fmtDate(factory.lastRunAt)));
  if (factory.lastRunSlug) {
    console.log(col("  Slug",        factory.lastRunSlug));
    console.log(col("  Duration",    fmtMs(factory.lastRunDurationMs)));
  }
  console.log(col("Total Drafts",   factory.totalDrafts));
  console.log(col("Pending Drafts", factory.pendingDrafts, "(not yet in review queue)"));

  // ── Batch ─────────────────────────────────────────────────────────────────
  const { batch } = data;
  console.log(`\n  BATCH`);
  console.log(DIV);
  if (batch.totalBatches === 0) {
    console.log(`  No batch runs recorded.`);
  } else {
    console.log(col("Total Batches",  batch.totalBatches));
    console.log(col("Last Batch",     fmtDate(batch.lastBatchAt)));
    console.log(col("  Generated",    batch.lastBatchGenerated ?? "—"));
    console.log(col("  Failed",       batch.lastBatchFailed    ?? "—"));
    console.log(col("  Duration",     fmtMs(batch.lastBatchDurationMs)));
    console.log(col("  Est. Cost",    fmtCost(batch.lastBatchCostUsd ?? 0)));
  }

  // ── Review queue ──────────────────────────────────────────────────────────
  const { review } = data;
  console.log(`\n  REVIEW QUEUE           Total: ${review.total}`);
  console.log(DIV);
  console.log(twoCol("Pending",    review.pending,            "In Review",       review.inReview));
  console.log(twoCol("Approved",   review.approved,           "Rejected",        review.rejected));
  console.log(twoCol("Needs Regen",review.needsRegeneration,  "Open Notes",      review.withOpenNotes));

  // ── Promotion ─────────────────────────────────────────────────────────────
  const { promotion } = data;
  console.log(`\n  PROMOTION`);
  console.log(DIV);
  console.log(twoCol("Ready",      promotion.ready,      "Promoted",    promotion.promoted));
  console.log(twoCol("Failed",     promotion.failed,     "Rolled Back", promotion.rolledBack));
  if (promotion.inProgress > 0) {
    console.log(col("In Progress", promotion.inProgress));
  }
  if (promotion.recentSlugs.length > 0) {
    console.log(`\n  Recently Promoted:`);
    for (const s of promotion.recentSlugs) {
      console.log(`    ✓  ${s}`);
    }
  }

  // ── Repository ────────────────────────────────────────────────────────────
  const { validation, coverage } = data;
  console.log(`\n  REPOSITORY`);
  console.log(DIV);
  console.log(`  Validation           (${validation.total} native records)`);
  console.log(twoCol("PASS",           validation.pass,             "Warnings",  validation.passWithWarnings));
  console.log(twoCol("FAIL",           validation.fail,             "Total",     validation.total));
  console.log();
  console.log(`  Coverage`);
  console.log(col("Native Records",  `${coverage.nativeRecords}`,   `(${coverage.nativePct.toFixed(1)}% of supplier catalogue)`));
  console.log(col("Adapter Records", `${coverage.adapterRecords}`));
  console.log(col("Total Supplier",  `${coverage.totalSupplier}`));
  console.log(col("Remaining",       `${coverage.remaining}`));

  // ── Operations ────────────────────────────────────────────────────────────
  const { operations } = data;
  console.log(`\n  OPERATIONS`);
  console.log(DIV);
  console.log(col("Average Runtime",    fmtMs(operations.averageRuntimeMs)));
  console.log(col("Average Tokens",     fmtTokens(Math.round(operations.averageTotalTokens ?? 0))));
  console.log(col("Total Tokens",       fmtTokens(operations.totalTokens)));
  console.log(col("Estimated Cost",     fmtCost(operations.totalEstimatedCostUsd),  "(Haiku 4.5 rates, approximate)"));

  if (operations.producerRates.some(r => r.total > 0)) {
    console.log(`\n  Producer Success Rates`);
    console.log(THIN);
    for (const rate of operations.producerRates) {
      console.log(renderProducerRate(rate));
    }
  }

  // ── Progress bars ─────────────────────────────────────────────────────────
  console.log(`\n  PROGRESS`);
  console.log(DIV);
  for (const bar of data.progress) {
    console.log(renderProgressBar(bar.label, bar.bar, bar.pct, bar.current, bar.total));
  }

  console.log(`\n${SEP}`);
  console.log(`  Run: npm run mkc:dashboard -- --json   for machine-readable output`);
  console.log(`${SEP}\n`);
}
