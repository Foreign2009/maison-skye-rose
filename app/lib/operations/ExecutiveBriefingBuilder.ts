/**
 * Executive Briefing — Builder (EP33-P3)
 *
 * Pure function. Accepts ExecutiveOperationsReport and projects it into
 * an immutable ExecutiveBriefing. No new analytics queries. No new
 * calculations. No scoring. No thresholds.
 *
 * Observation generation rules:
 *   Platform:  one observation from summary.platformStatus (always present)
 *   Domain:    one observation per section where status !== "operational"
 *   Priority:  categorical mapping from ExecutiveStatus — not a score
 *
 * Integration points:
 *   ExecutiveOperationsTypes.ts  — input type
 *   ExecutiveBriefingTypes.ts    — output types
 */

import type { ExecutiveOperationsReport, ExecutiveStatus } from "./ExecutiveOperationsTypes";
import type {
  ExecutiveBriefing,
  ExecutiveBriefingSection,
  ExecutiveObservation,
} from "./ExecutiveBriefingTypes";

// ── Observation generators ────────────────────────────────────────────────────

function buildPlatformObservation(
  status:             ExecutiveStatus,
  activeIntelligence: number,
  totalDomains:       number,
): ExecutiveObservation {
  switch (status) {
    case "attention-required":
      return {
        text:     "Platform requires immediate attention across one or more intelligence domains.",
        priority: "high",
      };
    case "monitoring":
      return {
        text:     "Platform intelligence systems are under monitoring.",
        priority: "medium",
      };
    case "offline":
      return {
        text:     `Analytics unavailable across all ${totalDomains} intelligence domains.`,
        priority: "low",
      };
    case "operational":
      return {
        text:     `All ${activeIntelligence} of ${totalDomains} intelligence domains are operational.`,
        priority: "low",
      };
  }
}

function buildDomainObservations(
  sections: readonly ExecutiveBriefingSection[],
): ExecutiveObservation[] {
  const obs: ExecutiveObservation[] = [];
  for (const s of sections) {
    if (s.status === "operational") continue;
    switch (s.status) {
      case "attention-required":
        obs.push({ text: `${s.domain} domain requires immediate attention.`, priority: "high" });
        break;
      case "monitoring":
        obs.push({ text: `${s.domain} domain is under monitoring.`, priority: "medium" });
        break;
      case "offline":
        obs.push({ text: `${s.domain} domain analytics are unavailable.`, priority: "low" });
        break;
    }
  }
  return obs;
}

// ── Builder ───────────────────────────────────────────────────────────────────

export function buildExecutiveBriefing(
  report: ExecutiveOperationsReport,
): ExecutiveBriefing {

  // Pure field projection — no recalculation
  const sections: readonly ExecutiveBriefingSection[] = report.sections.map((s) => ({
    domain:             s.domain,
    status:             s.status,
    headline:           s.headline,
    keyMetric:          s.keyMetric,
    analyticsAvailable: s.analyticsAvailable,
  }));

  const platformObs  = buildPlatformObservation(
    report.summary.platformStatus,
    report.summary.activeIntelligence,
    report.summary.totalDomains,
  );
  const domainObs    = buildDomainObservations(sections);
  const observations: readonly ExecutiveObservation[] = [platformObs, ...domainObs];

  return {
    platformStatus:     report.summary.platformStatus,
    platformHeadline:   report.summary.headline,
    activeIntelligence: report.summary.activeIntelligence,
    totalDomains:       report.summary.totalDomains,
    sections,
    observations,
    analyticsAvailable: report.analyticsAvailable,
    generatedAt:        report.generatedAt,
  };
}
