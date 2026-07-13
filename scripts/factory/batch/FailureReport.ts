/**
 * Knowledge Factory — Failure Report
 *
 * Data structure for individual batch failures and formatting helpers.
 */

export interface BatchFailure {
  slug:       string;
  name:       string;
  error:      string;
  attempts:   number;
  durationMs: number;
  timestamp:  string;
}

export function formatFailureList(failures: BatchFailure[]): string {
  if (failures.length === 0) return "  (none)";
  return failures
    .map(f => `  ✗  ${f.slug.padEnd(44)} ${f.error}`)
    .join("\n");
}
