/**
 * Executive Report Delta — Builder (EP40-P1)
 *
 * Pure function. Accepts ExecutiveReportComparison and classifies each entry
 * into an immutable ExecutiveReportDeltaEntry.
 * No analytics queries. No business calculations. No persistence. No side effects.
 *
 * Classification rules:
 *   isFirstRecord === true                                    → state = "initial"
 *   previous?.headline.text === current.headline.text         → state = "unchanged"
 *   otherwise                                                 → state = "changed"
 *
 *   entry.generatedAt ← comparison.generatedAt
 *   Delta.generatedAt ← new Date().toISOString()
 *
 * Integration points:
 *   ExecutiveReportComparisonTypes.ts — input types
 *   ExecutiveReportDeltaTypes.ts      — output types
 */

import type { ExecutiveReportComparison } from "./ExecutiveReportComparisonTypes";
import type {
  ExecutiveReportDelta,
  ExecutiveReportDeltaEntry,
  ExecutiveReportDeltaState,
} from "./ExecutiveReportDeltaTypes";

// ── Classifier ────────────────────────────────────────────────────────────────

function classifyDeltaState(
  isFirstRecord: boolean,
  currentHeadline: string,
  previousHeadline: string | undefined,
): ExecutiveReportDeltaState {
  if (isFirstRecord) return "initial";
  if (previousHeadline === currentHeadline) return "unchanged";
  return "changed";
}

// ── Builder ───────────────────────────────────────────────────────────────────

export function buildExecutiveReportDelta(
  comparison: ExecutiveReportComparison,
): ExecutiveReportDelta {
  const records: ExecutiveReportDeltaEntry[] = comparison.records.map(
    (entry): ExecutiveReportDeltaEntry => ({
      comparison:  entry,
      state:       classifyDeltaState(
        entry.isFirstRecord,
        entry.current.headline.text,
        entry.previous?.headline.text,
      ),
      generatedAt: entry.generatedAt,
    }),
  );

  return {
    records,
    generatedAt: new Date().toISOString(),
  };
}
