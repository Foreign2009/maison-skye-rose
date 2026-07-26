/**
 * Executive Operations Digest — Builder (EP35-P1)
 *
 * Pure function. Accepts AlertBriefing and projects it into an immutable
 * ExecutiveOperationsDigest. No analytics queries. No business calculations.
 * No duplicated calculations. No persistence. No side effects.
 *
 * headline derivation (categorical from overallStatus):
 *   "critical" → executive attention required
 *   "high"     → monitoring recommended
 *   "medium"   → active monitoring
 *   "low"      → operations nominal
 *
 * summary derivation (from counts and analyticsAvailable only):
 *   !analyticsAvailable → offline notice
 *   criticalAlerts > 0  → critical escalation summary
 *   activeAlerts > 0    → active monitoring summary
 *   all resolved        → all clear
 *
 * keyObservations: pure projection of AlertBriefing.observations.
 * No new intelligence introduced. alertId is a reference pointer only.
 *
 * Integration points:
 *   OperationsAlertBriefingTypes.ts    — input type
 *   ExecutiveOperationsDigestTypes.ts  — output types
 */

import type { AlertBriefing }            from "./OperationsAlertBriefingTypes";
import type { AlertCategory, AlertSeverity } from "./OperationsAlertTypes";
import type {
  ExecutiveDigestHeadline,
  ExecutiveDigestSection,
  ExecutiveOperationsDigest,
} from "./ExecutiveOperationsDigestTypes";

// ── Headline label map ────────────────────────────────────────────────────────

const DIGEST_HEADLINES: Record<AlertSeverity, string> = {
  "critical": "Executive attention required — critical platform alerts active.",
  "high":     "Platform monitoring recommended — active alerts require review.",
  "medium":   "Platform intelligence systems under active monitoring.",
  "low":      "Platform operations nominal — all alerts resolved.",
};

// ── Category title map ────────────────────────────────────────────────────────

const CATEGORY_TITLES: Record<AlertCategory, string> = {
  "platform":       "Platform Status",
  "recommendation": "Recommendation Intelligence",
  "customer":       "Customer Intelligence",
  "commerce":       "Commerce Intelligence",
  "operations":     "Operations",
};

// ── Headline builder ──────────────────────────────────────────────────────────

function buildHeadline(briefing: AlertBriefing): ExecutiveDigestHeadline {
  return {
    text:          DIGEST_HEADLINES[briefing.overallStatus],
    overallStatus: briefing.overallStatus,
  };
}

// ── Summary builder ───────────────────────────────────────────────────────────

function buildSummary(briefing: AlertBriefing): string {
  if (!briefing.analyticsAvailable) {
    return "Analytics unavailable across intelligence domains. Alert state reflects offline platform status only.";
  }

  if (briefing.criticalAlerts > 0) {
    const n     = briefing.criticalAlerts;
    const extra = briefing.activeAlerts - n;
    const base  = `${n} critical alert${n === 1 ? "" : "s"} require${n === 1 ? "s" : ""} immediate executive attention.`;
    if (extra > 0) {
      return `${base} ${extra} additional active alert${extra === 1 ? "" : "s"} are under review.`;
    }
    return base;
  }

  if (briefing.activeAlerts > 0) {
    const n = briefing.activeAlerts;
    return `${n} active alert${n === 1 ? "" : "s"} are under monitoring. No critical escalations at this time.`;
  }

  return "All platform alerts resolved. Intelligence domains operating normally.";
}

// ── Key observations builder ──────────────────────────────────────────────────

function buildKeyObservations(briefing: AlertBriefing): readonly ExecutiveDigestSection[] {
  return briefing.observations.map((obs): ExecutiveDigestSection => ({
    title:    CATEGORY_TITLES[obs.category],
    body:     obs.text,
    category: obs.category,
    alertId:  obs.alertId,
  }));
}

// ── Builder ───────────────────────────────────────────────────────────────────

export function buildExecutiveOperationsDigest(
  briefing: AlertBriefing,
): ExecutiveOperationsDigest {
  return {
    headline:           buildHeadline(briefing),
    overallStatus:      briefing.overallStatus,
    summary:            buildSummary(briefing),
    keyObservations:    buildKeyObservations(briefing),
    analyticsAvailable: briefing.analyticsAvailable,
    generatedAt:        briefing.generatedAt,
  };
}
