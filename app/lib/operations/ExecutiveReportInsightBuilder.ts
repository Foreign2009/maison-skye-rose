/**
 * Executive Report Insight — Builder (EP41-P1)
 *
 * Pure function. Accepts ExecutiveReportDelta and classifies each entry
 * into an immutable ExecutiveReportInsightEntry.
 * No analytics queries. No business calculations. No persistence. No side effects.
 *
 * Classification rules:
 *   delta.state === "initial"   → state = "new"
 *   delta.state === "unchanged" → state = "stable"
 *   delta.state === "changed"   → state = "updated"
 *
 *   entry.generatedAt ← delta.generatedAt
 *   Insight.generatedAt ← new Date().toISOString()
 *
 * Integration points:
 *   ExecutiveReportDeltaTypes.ts   — input types
 *   ExecutiveReportInsightTypes.ts — output types
 */

import type { ExecutiveReportDelta } from "./ExecutiveReportDeltaTypes";
import type {
  ExecutiveReportInsight,
  ExecutiveReportInsightEntry,
  ExecutiveReportInsightState,
} from "./ExecutiveReportInsightTypes";

// ── Classifier ────────────────────────────────────────────────────────────────

function classifyInsightState(
  deltaState: "initial" | "unchanged" | "changed",
): ExecutiveReportInsightState {
  if (deltaState === "initial")   return "new";
  if (deltaState === "unchanged") return "stable";
  return "updated";
}

// ── Builder ───────────────────────────────────────────────────────────────────

export function buildExecutiveReportInsight(
  delta: ExecutiveReportDelta,
): ExecutiveReportInsight {
  const records: ExecutiveReportInsightEntry[] = delta.records.map(
    (entry): ExecutiveReportInsightEntry => ({
      delta:       entry,
      state:       classifyInsightState(entry.state),
      generatedAt: entry.generatedAt,
    }),
  );

  return {
    records,
    generatedAt: new Date().toISOString(),
  };
}
