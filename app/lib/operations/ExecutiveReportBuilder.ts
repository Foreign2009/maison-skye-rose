/**
 * Executive Report — Builder (EP36-P1)
 *
 * Pure function. Accepts ExecutiveOperationsDigest and projects it into an
 * immutable ExecutiveReport. No analytics queries. No business calculations.
 * No duplicated calculations. No persistence. No side effects.
 *
 * All fields are direct projections from the digest:
 *   headline       ← digest.headline (text + overallStatus)
 *   overallStatus  ← digest.overallStatus
 *   executiveSummary ← digest.summary
 *   sections       ← digest.keyObservations (1-to-1, no new intelligence)
 *   analyticsAvailable ← digest.analyticsAvailable
 *   generatedAt    ← digest.generatedAt
 *
 * Integration points:
 *   ExecutiveOperationsDigestTypes.ts — input type
 *   ExecutiveReportTypes.ts           — output types
 */

import type { ExecutiveOperationsDigest } from "./ExecutiveOperationsDigestTypes";
import type {
  ExecutiveReport,
  ExecutiveReportHeadline,
  ExecutiveReportSection,
} from "./ExecutiveReportTypes";

// ── Headline builder ──────────────────────────────────────────────────────────

function buildHeadline(digest: ExecutiveOperationsDigest): ExecutiveReportHeadline {
  return {
    text:          digest.headline.text,
    overallStatus: digest.headline.overallStatus,
  };
}

// ── Sections builder ──────────────────────────────────────────────────────────

function buildSections(digest: ExecutiveOperationsDigest): readonly ExecutiveReportSection[] {
  return digest.keyObservations.map((obs): ExecutiveReportSection => ({
    title:    obs.title,
    body:     obs.body,
    category: obs.category,
    alertId:  obs.alertId,
  }));
}

// ── Builder ───────────────────────────────────────────────────────────────────

export function buildExecutiveReport(
  digest: ExecutiveOperationsDigest,
): ExecutiveReport {
  return {
    headline:           buildHeadline(digest),
    overallStatus:      digest.overallStatus,
    executiveSummary:   digest.summary,
    sections:           buildSections(digest),
    analyticsAvailable: digest.analyticsAvailable,
    generatedAt:        digest.generatedAt,
  };
}
