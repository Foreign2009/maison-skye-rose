/**
 * Knowledge Lifecycle Manager — Report
 *
 * Builds the structured report and renders it to the terminal
 * or as JSON. Consumes pre-assembled job data only — no I/O.
 */

import type { LifecycleJob, LifecycleReason, LifecycleSeverity } from "./LifecycleJob";

// ── Report structure ──────────────────────────────────────────────────────────

export interface LifecycleReportData {
  generatedAt:    string;
  scannedRecords: number;
  scannedAt:      string;
  totalJobs:      number;
  resolvedJobs:   number;
  pendingJobs:    number;
  bySeverity:     Record<LifecycleSeverity, number>;
  byReason:       Partial<Record<LifecycleReason, number>>;
  byCollection:   { Skye: number; Rose: number; Elite: number };
  jobs:           LifecycleJob[];
  resolvedIds:    string[];
}

export function buildReport(
  jobs:         LifecycleJob[],
  resolvedIds:  Set<string>,
  scannedCount: number,
  scannedAt:    string,
): LifecycleReportData {
  const bySeverity: Record<LifecycleSeverity, number> = { critical: 0, warning: 0, info: 0 };
  const byReason:   Partial<Record<LifecycleReason, number>> = {};
  const byCollection = { Skye: 0, Rose: 0, Elite: 0 };
  let resolvedJobs = 0;

  for (const job of jobs) {
    bySeverity[job.severity]++;
    byReason[job.reason] = (byReason[job.reason] ?? 0) + 1;
    byCollection[job.collection]++;
    if (resolvedIds.has(job.id)) resolvedJobs++;
  }

  return {
    generatedAt:    new Date().toISOString(),
    scannedRecords: scannedCount,
    scannedAt,
    totalJobs:      jobs.length,
    resolvedJobs,
    pendingJobs:    jobs.length - resolvedJobs,
    bySeverity,
    byReason,
    byCollection,
    jobs,
    resolvedIds: [...resolvedIds],
  };
}

export function toJSON(report: LifecycleReportData): string {
  return JSON.stringify(report, null, 2);
}

// ── Terminal renderer ─────────────────────────────────────────────────────────

const SEP  = "═".repeat(62);
const DIV  = "─".repeat(62);

function severityIcon(s: LifecycleSeverity): string {
  if (s === "critical") return "🔴";
  if (s === "warning")  return "🟡";
  return "○";
}

function actionHint(action: string): string {
  if (action === "regenerate")  return "npm run mkc:factory -- <slug>  OR  npm run mkc:factory:batch";
  if (action === "re_review")   return "npm run mkc:review -- --start <slug>";
  if (action === "re_promote")  return "npm run mkc:promote -- --slug <slug>";
  if (action === "validate")    return "npm run mkc:validate";
  return action;
}

export function printReport(report: LifecycleReportData, resolvedIds: Set<string>): void {
  const ts     = new Date(report.generatedAt).toLocaleString();
  const scan   = report.scannedAt ? new Date(report.scannedAt).toLocaleString() : ts;
  const { bySeverity, byReason, byCollection } = report;

  console.log(`\n${SEP}`);
  console.log(`  Knowledge Lifecycle Manager`);
  console.log(`  Generated: ${ts}`);
  console.log(`${SEP}`);
  console.log(`  Scanned:  ${report.scannedRecords} supplier records   (${scan})`);
  console.log(`  Jobs:     ${report.totalJobs} detected   ${report.pendingJobs} pending   ${report.resolvedJobs} resolved`);
  console.log();
  console.log(`  🔴 Critical   ${String(bySeverity.critical).padStart(3)}    🟡 Warning   ${String(bySeverity.warning).padStart(3)}    ○ Info   ${String(bySeverity.info).padStart(3)}`);
  console.log(`  Skye   ${String(byCollection.Skye).padStart(3)}    Rose   ${String(byCollection.Rose).padStart(3)}    Elite   ${String(byCollection.Elite).padStart(3)}`);

  if (report.totalJobs === 0) {
    console.log(`\n  ✓  No lifecycle issues detected. Repository is healthy.\n${SEP}\n`);
    return;
  }

  // ── Group by reason for display ───────────────────────────────────────────

  // Critical section
  const criticalJobs = report.jobs.filter(j => j.severity === "critical" && !resolvedIds.has(j.id));
  if (criticalJobs.length > 0) {
    console.log(`\n  CRITICAL  (${criticalJobs.length})`);
    console.log(DIV);
    for (const job of criticalJobs) {
      console.log(`  🔴  ${job.reason.padEnd(24)}  ${job.name}`);
      console.log(`       ${job.details}`);
      console.log(`       Action: ${actionHint(job.recommendedAction)}`);
    }
  }

  // Warning section
  const warningJobs = report.jobs.filter(j => j.severity === "warning" && !resolvedIds.has(j.id));
  if (warningJobs.length > 0) {
    console.log(`\n  WARNING  (${warningJobs.length})`);
    console.log(DIV);
    for (const job of warningJobs) {
      console.log(`  🟡  ${job.reason.padEnd(24)}  ${job.name}`);
      console.log(`       ${job.details}`);
    }
  }

  // Info section — group missing_draft for conciseness
  const infoJobs = report.jobs.filter(j => j.severity === "info" && !resolvedIds.has(j.id));
  if (infoJobs.length > 0) {
    console.log(`\n  INFO  (${infoJobs.length})`);
    console.log(DIV);

    const missingDraft  = infoJobs.filter(j => j.reason === "missing_draft");
    const otherInfo     = infoJobs.filter(j => j.reason !== "missing_draft");

    for (const job of otherInfo) {
      console.log(`  ○  ${job.reason.padEnd(24)}  ${job.name}`);
      console.log(`       ${job.details}`);
    }

    if (missingDraft.length > 0) {
      const byCol = { Skye: 0, Rose: 0, Elite: 0 } as Record<string, number>;
      for (const j of missingDraft) byCol[j.collection]++;
      console.log(`  ○  missing_draft            ${missingDraft.length} records not yet generated`);
      console.log(`       Skye: ${byCol.Skye}  Rose: ${byCol.Rose}  Elite: ${byCol.Elite}`);
      console.log(`       Action: npm run mkc:factory:batch`);
    }
  }

  // Resolved section (collapsed)
  if (report.resolvedJobs > 0) {
    console.log(`\n  RESOLVED  (${report.resolvedJobs} — hidden)`);
    console.log(`  Run: npm run mkc:lifecycle -- --show-resolved  to display`);
  }

  // ── Reason summary ────────────────────────────────────────────────────────
  if (Object.keys(byReason).length > 0) {
    console.log(`\n  REASON BREAKDOWN`);
    console.log(DIV);
    for (const [reason, count] of Object.entries(byReason)) {
      console.log(`  ${String(count).padStart(4)}   ${reason}`);
    }
  }

  console.log(`\n${SEP}`);
  console.log(`  To resolve a job:  npm run mkc:lifecycle -- --resolve <slug>::<reason>`);
  console.log(`  JSON export:       npm run mkc:lifecycle -- --json`);
  console.log(`${SEP}\n`);
}
