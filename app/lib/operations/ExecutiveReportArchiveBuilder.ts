/**
 * Executive Report Archive — Builder (EP37-P1)
 *
 * Pure function. Accepts ExecutiveReport and projects it into an immutable
 * ExecutiveReportArchive. No analytics queries. No business calculations.
 * No duplicated calculations. No persistence. No side effects.
 *
 * All fields are direct projections from the report:
 *   headline           ← report.headline (direct reference)
 *   overallStatus      ← report.overallStatus
 *   executiveSummary   ← report.executiveSummary
 *   entries            ← report.sections mapped 1-to-1, each annotated with
 *                        sequence (1-based positional index, not a calculation)
 *   analyticsAvailable ← report.analyticsAvailable
 *   generatedAt        ← report.generatedAt
 *
 * Integration points:
 *   ExecutiveReportTypes.ts        — input type
 *   ExecutiveReportArchiveTypes.ts — output types
 */

import type { ExecutiveReport }                from "./ExecutiveReportTypes";
import type {
  ExecutiveReportArchive,
  ExecutiveReportArchiveEntry,
} from "./ExecutiveReportArchiveTypes";

// ── Entries builder ───────────────────────────────────────────────────────────

function buildEntries(report: ExecutiveReport): readonly ExecutiveReportArchiveEntry[] {
  return report.sections.map((section, i): ExecutiveReportArchiveEntry => ({
    title:    section.title,
    body:     section.body,
    category: section.category,
    alertId:  section.alertId,
    sequence: i + 1,
  }));
}

// ── Builder ───────────────────────────────────────────────────────────────────

export function buildExecutiveReportArchive(
  report: ExecutiveReport,
): ExecutiveReportArchive {
  return {
    headline:           report.headline,
    overallStatus:      report.overallStatus,
    executiveSummary:   report.executiveSummary,
    entries:            buildEntries(report),
    analyticsAvailable: report.analyticsAvailable,
    generatedAt:        report.generatedAt,
  };
}
