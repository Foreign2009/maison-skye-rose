/**
 * Executive Report History — Builder (EP38-P1)
 *
 * Pure function. Accepts a readonly array of ExecutiveReportArchive and projects
 * each into an immutable ExecutiveReportHistoryEntry.
 * No analytics queries. No business calculations. No persistence. No side effects.
 *
 * All entry fields are direct projections from each archive:
 *   headline         ← archive.headline (direct reference)
 *   overallStatus    ← archive.overallStatus
 *   executiveSummary ← archive.executiveSummary
 *   generatedAt      ← archive.generatedAt
 *   entryCount       ← archive.entries.length (structural count only)
 *   archive          ← archive (direct reference)
 *
 * History.generatedAt is set to new Date().toISOString() at build time.
 *
 * Integration points:
 *   ExecutiveReportArchiveTypes.ts  — input type
 *   ExecutiveReportHistoryTypes.ts  — output types
 */

import type { ExecutiveReportArchive }        from "./ExecutiveReportArchiveTypes";
import type {
  ExecutiveReportHistory,
  ExecutiveReportHistoryEntry,
} from "./ExecutiveReportHistoryTypes";

// ── Builder ───────────────────────────────────────────────────────────────────

export function buildExecutiveReportHistory(
  archives: readonly ExecutiveReportArchive[],
): ExecutiveReportHistory {
  const records: ExecutiveReportHistoryEntry[] = archives.map(
    (archive): ExecutiveReportHistoryEntry => ({
      headline:         archive.headline,
      overallStatus:    archive.overallStatus,
      executiveSummary: archive.executiveSummary,
      generatedAt:      archive.generatedAt,
      entryCount:       archive.entries.length,
      archive,
    }),
  );

  return {
    records,
    generatedAt: new Date().toISOString(),
  };
}
