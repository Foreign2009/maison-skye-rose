/**
 * Knowledge Factory — Batch Report
 *
 * Builds and prints the structured batch completion report.
 *
 * Cost estimation uses Haiku 4.5 public rates (approximate):
 *   Input:  $0.80 per million tokens
 *   Output: $4.00 per million tokens
 */

import type { BatchFailure }    from "./FailureReport";
import type { ProgressSnapshot } from "./BatchProgress";

const INPUT_COST_PER_M  = 0.80;   // USD per 1M prompt tokens
const OUTPUT_COST_PER_M = 4.00;   // USD per 1M completion tokens

export interface ValidationSummary {
  pass:             number;
  passWithWarnings: number;
  fail:             number;
  unknown:          number;
}

export interface BatchReport {
  batchId:          string;
  startedAt:        string;
  completedAt:      string;
  durationMs:       number;
  total:            number;
  generated:        number;   // complete + degraded
  skipped:          number;
  failed:           number;
  tokenUsage: {
    promptTokens:     number;
    completionTokens: number;
    totalTokens:      number;
  };
  estimatedCostUsd:  number;
  validationSummary: ValidationSummary;
  failures:          BatchFailure[];
}

export interface BuildReportParams {
  batchId:           string;
  startedAt:         Date;
  completedAt:       Date;
  snapshot:          ProgressSnapshot;
  validationSummary: ValidationSummary;
  failures:          BatchFailure[];
}

export function buildReport(params: BuildReportParams): BatchReport {
  const { batchId, startedAt, completedAt, snapshot, validationSummary, failures } = params;
  const durationMs        = completedAt.getTime() - startedAt.getTime();
  const estimatedCostUsd  =
    (snapshot.promptTokens     * INPUT_COST_PER_M  +
     snapshot.completionTokens * OUTPUT_COST_PER_M) / 1_000_000;

  return {
    batchId,
    startedAt:       startedAt.toISOString(),
    completedAt:     completedAt.toISOString(),
    durationMs,
    total:           snapshot.total,
    generated:       snapshot.success,
    skipped:         snapshot.skipped,
    failed:          snapshot.failed,
    tokenUsage: {
      promptTokens:     snapshot.promptTokens,
      completionTokens: snapshot.completionTokens,
      totalTokens:      snapshot.totalTokens,
    },
    estimatedCostUsd,
    validationSummary,
    failures,
  };
}

export function printReport(report: BatchReport): void {
  const SEP  = "═".repeat(52);
  const dur  = fmtMs(report.durationMs);
  const cost = report.estimatedCostUsd.toFixed(2);
  const tok  = report.tokenUsage.totalTokens.toLocaleString();
  const vs   = report.validationSummary;

  console.log(`\n${SEP}`);
  console.log(`  Batch Report  —  ${report.batchId}`);
  console.log(SEP);
  console.log(`  Duration       ${dur}`);
  console.log(`  Processed      ${report.total}`);
  console.log(`  Generated      ${report.generated}`);
  console.log(`  Skipped        ${report.skipped}`);
  console.log(`  Failed         ${report.failed}`);
  console.log(`  Tokens         ${tok}  (prompt:${report.tokenUsage.promptTokens.toLocaleString()}  completion:${report.tokenUsage.completionTokens.toLocaleString()})`);
  console.log(`  Est. cost      ~$${cost}  (Haiku 4.5 rates, approximate)`);
  console.log(SEP);
  console.log(`  Validation     PASS:${vs.pass}  WARN:${vs.passWithWarnings}  FAIL:${vs.fail}  UNKNOWN:${vs.unknown}`);

  if (report.failures.length > 0) {
    console.log(`\n  Failed records:`);
    for (const f of report.failures) {
      console.log(`    ✗  ${f.slug.padEnd(44)} ${f.error}`);
    }
  }

  console.log(`${SEP}\n`);
}

function fmtMs(ms: number): string {
  if (ms < 1_000)      return `${ms}ms`;
  if (ms < 60_000)     return `${(ms / 1000).toFixed(1)}s`;
  const m = Math.floor(ms / 60_000);
  const s = Math.floor((ms % 60_000) / 1000);
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}
