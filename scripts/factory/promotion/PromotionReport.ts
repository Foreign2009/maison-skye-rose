/**
 * Knowledge Factory — Promotion Report
 *
 * Summary statistics and history for the Promotion Pipeline.
 */

import { getAllPromotionRecords } from "./PromotionRegistry";
import { getHistory } from "./PromotionHistory";

const SEP = "═".repeat(62);
const DIV = "─".repeat(62);

export interface PromotionReport {
  generatedAt:   string;
  total:         number;
  promoted:      number;
  inProgress:    number;
  failed:        number;
  rolledBack:    number;
  recentHistory: ReturnType<typeof getHistory>;
}

export function buildPromotionReport(): PromotionReport {
  const records = getAllPromotionRecords();
  return {
    generatedAt: new Date().toISOString(),
    total:       records.length,
    promoted:    records.filter(r => r.status === "promoted").length,
    inProgress:  records.filter(r => r.status === "in_progress").length,
    failed:      records.filter(r => r.status === "failed").length,
    rolledBack:  records.filter(r => r.status === "rolled_back").length,
    recentHistory: getHistory().slice(0, 20),
  };
}

export function printPromotionReport(report: PromotionReport): void {
  console.log(`\n${SEP}`);
  console.log(`  Promotion Pipeline Report`);
  console.log(`  Generated: ${new Date(report.generatedAt).toLocaleString()}`);
  console.log(`${SEP}`);
  console.log(`  Promoted      ${String(report.promoted).padStart(3)}`);
  console.log(`  In Progress   ${String(report.inProgress).padStart(3)}`);
  console.log(`  Failed        ${String(report.failed).padStart(3)}`);
  console.log(`  Rolled Back   ${String(report.rolledBack).padStart(3)}`);
  console.log(`  Total         ${String(report.total).padStart(3)}`);
  console.log(`${SEP}`);

  const history = report.recentHistory;
  if (history.length === 0) {
    console.log(`\n  No promotion history yet.`);
  } else {
    console.log(`\n  RECENT HISTORY  (last ${history.length})`);
    console.log(DIV);
    for (const e of history) {
      const icon = e.outcome === "promoted" ? "✓" : e.outcome === "rolled_back" ? "↺" : "✗";
      const date = new Date(e.completedAt).toLocaleDateString();
      const dur  = e.durationMs < 60_000
        ? `${(e.durationMs / 1000).toFixed(1)}s`
        : `${(e.durationMs / 60_000).toFixed(1)}m`;
      const val  = e.validationStatus ?? "—";
      console.log(`  ${icon}  ${e.name.padEnd(40)}  ${date}  ${dur.padStart(6)}  ${val}`);
      if (e.error) console.log(`       Error: ${e.error}`);
    }
  }

  const promoted = getAllPromotionRecords().filter(r => r.status === "promoted");
  if (promoted.length > 0) {
    console.log(`\n  PROMOTED RECORDS`);
    console.log(DIV);
    for (const r of promoted) {
      const date = r.completedAt ? new Date(r.completedAt).toLocaleDateString() : "—";
      const val  = r.validationStatus ?? "—";
      console.log(`  ✓  ${r.name.padEnd(40)}  ${date}  ${val}`);
    }
  }

  console.log(`\n${SEP}\n`);
}
