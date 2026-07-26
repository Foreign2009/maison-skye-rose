/**
 * Operations Alert Briefing — Builder (EP34-P4)
 *
 * Pure function. Accepts OperationsAlertReport and projects it into an
 * immutable AlertBriefing. No analytics queries. No business calculations.
 * No duplicated calculations. No persistence. No side effects.
 *
 * overallStatus derivation (categorical, no scoring):
 *   criticalCount > 0                          → "critical"
 *   activeCount > 0 (no critical)              → "high"
 *   any alert has status === "monitoring"       → "medium"
 *   all resolved                               → "low"
 *
 * headline derivation (from counts and analyticsAvailable only):
 *   !analyticsAvailable → offline notice
 *   criticalCount > 0   → critical attention required
 *   activeCount > 0     → active monitoring notice
 *   all resolved        → all clear
 *
 * Observations reference existing alerts via alertId.
 * Observation text is synthesized from origin + status + severity —
 * it does not copy alert.summary.
 *
 * Integration points:
 *   OperationsAlertTypes.ts         — input type
 *   OperationsAlertBriefingTypes.ts — output types
 */

import type { OperationsAlertReport, AlertSeverity } from "./OperationsAlertTypes";
import type {
  AlertBriefing,
  AlertHeadline,
  AlertObservation,
} from "./OperationsAlertBriefingTypes";

// ── Overall status derivation ─────────────────────────────────────────────────

function deriveOverallStatus(report: OperationsAlertReport): AlertSeverity {
  if (report.criticalCount > 0) return "critical";
  if (report.activeCount   > 0) return "high";
  if (report.alerts.some((a) => a.status === "monitoring")) return "medium";
  return "low";
}

// ── Headline builder ──────────────────────────────────────────────────────────

function buildHeadline(
  report:        OperationsAlertReport,
  overallStatus: AlertSeverity,
): AlertHeadline {
  if (!report.analyticsAvailable) {
    return {
      text:   "Analytics unavailable — alert state based on offline domain status.",
      status: overallStatus,
    };
  }

  if (report.criticalCount > 0) {
    const n   = report.criticalCount;
    const pl  = n === 1;
    return {
      text:   `${n} critical alert${pl ? "" : "s"} require${pl ? "s" : ""} immediate attention.`,
      status: overallStatus,
    };
  }

  if (report.activeCount > 0) {
    const n  = report.activeCount;
    return {
      text:   `${n} active alert${n === 1 ? "" : "s"} under monitoring.`,
      status: overallStatus,
    };
  }

  return {
    text:   "All operational alerts resolved.",
    status: overallStatus,
  };
}

// ── Observation builder ───────────────────────────────────────────────────────

function buildObservations(report: OperationsAlertReport): readonly AlertObservation[] {
  return report.alerts
    .filter((a) => a.status !== "resolved")
    .map((a): AlertObservation => ({
      text:     `${a.origin} reports ${a.status} status at ${a.severity} severity.`,
      category: a.category,
      alertId:  a.id,
    }));
}

// ── Builder ───────────────────────────────────────────────────────────────────

export function buildOperationsAlertBriefing(
  report: OperationsAlertReport,
): AlertBriefing {
  const overallStatus = deriveOverallStatus(report);

  return {
    headline:           buildHeadline(report, overallStatus),
    overallStatus,
    activeAlerts:       report.activeCount,
    criticalAlerts:     report.criticalCount,
    observations:       buildObservations(report),
    analyticsAvailable: report.analyticsAvailable,
    generatedAt:        report.generatedAt,
  };
}
