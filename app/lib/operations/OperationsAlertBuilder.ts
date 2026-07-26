/**
 * Operations Alert Engine — Builder (EP34-P1)
 *
 * Pure function. Accepts ExecutiveOperationsReport and projects it into
 * an immutable OperationsAlertReport. No analytics queries. No business
 * calculations. No scoring. No thresholds. No side effects.
 *
 * Always produces 4 alerts (deterministic):
 *   1. Platform Summary     — from summary.platformStatus
 *   2. Recommendation Domain — from sections[0]
 *   3. Customer Domain       — from sections[1]
 *   4. Commerce Domain       — from sections[2]
 *
 * Integration points:
 *   ExecutiveOperationsTypes.ts — input types
 *   OperationsAlertTypes.ts     — output types
 */

import type {
  ExecutiveOperationsReport,
  ExecutiveSection,
  ExecutiveStatus,
} from "./ExecutiveOperationsTypes";
import type {
  AlertCategory,
  AlertSeverity,
  AlertStatus,
  OperationsAlert,
  OperationsAlertReport,
} from "./OperationsAlertTypes";

// ── Categorical derivations ───────────────────────────────────────────────────

function severityFrom(status: ExecutiveStatus): AlertSeverity {
  switch (status) {
    case "attention-required": return "critical";
    case "offline":            return "high";
    case "monitoring":         return "medium";
    case "operational":        return "low";
  }
}

function alertStatusFrom(status: ExecutiveStatus): AlertStatus {
  switch (status) {
    case "attention-required": return "active";
    case "offline":            return "active";
    case "monitoring":         return "monitoring";
    case "operational":        return "resolved";
  }
}

function categoryFromDomain(domain: string): AlertCategory {
  switch (domain.toLowerCase()) {
    case "recommendation": return "recommendation";
    case "customer":       return "customer";
    case "commerce":       return "commerce";
    default:               return "operations";
  }
}

// ── Alert constructors ────────────────────────────────────────────────────────

function buildPlatformAlert(
  report: ExecutiveOperationsReport,
): OperationsAlert {
  const { summary, generatedAt } = report;
  return {
    id:          "platform-summary",
    title:       "Platform Status",
    summary:     summary.headline,
    severity:    severityFrom(summary.platformStatus),
    category:    "platform",
    origin:      "Platform Summary",
    status:      alertStatusFrom(summary.platformStatus),
    generatedAt,
  };
}

function buildDomainAlert(
  section:     ExecutiveSection,
  generatedAt: string,
): OperationsAlert {
  return {
    id:          `domain-${section.domain.toLowerCase()}`,
    title:       `${section.domain} Domain`,
    summary:     section.headline,
    severity:    severityFrom(section.status),
    category:    categoryFromDomain(section.domain),
    origin:      `${section.domain} Domain`,
    status:      alertStatusFrom(section.status),
    generatedAt,
  };
}

// ── Builder ───────────────────────────────────────────────────────────────────

export function buildOperationsAlertReport(
  operations: ExecutiveOperationsReport,
): OperationsAlertReport {

  const platformAlert = buildPlatformAlert(operations);
  const domainAlerts  = operations.sections.map((s) =>
    buildDomainAlert(s, operations.generatedAt),
  );

  const alerts: readonly OperationsAlert[] = [platformAlert, ...domainAlerts];

  return {
    alerts,
    activeCount:        alerts.filter((a) => a.status   === "active").length,
    criticalCount:      alerts.filter((a) => a.severity === "critical").length,
    analyticsAvailable: operations.analyticsAvailable,
    generatedAt:        operations.generatedAt,
  };
}
