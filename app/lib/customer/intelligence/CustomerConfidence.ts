/**
 * Customer Intelligence — Customer Confidence
 *
 * Assesses how much the intelligence layer can trust the signal data.
 * Derived from CustomerStatistics — no direct profile access.
 *
 * overallConfidence rules:
 *   HIGH   — HIGH signals outnumber MEDIUM and LOW individually
 *   MEDIUM — MEDIUM signals are present and >= HIGH count
 *   LOW    — no signals, or LOW signals dominate
 *
 * reliableSignalRatio = (HIGH + MEDIUM) / totalSignals, rounded to 3 d.p.
 * Returns 0 when totalSignals is 0.
 *
 * Integration points:
 *   CustomerIntelligenceEngine — built from pre-computed CustomerStatistics
 *   CustomerInsights           — embedded as sub-component; informs insight generation
 */

import type { CustomerReadModel }  from "./CustomerReadModel";
import type { CustomerStatistics } from "./CustomerStatistics";
import type { SignalConfidence }   from "../signals/SignalConfidence";

export interface CustomerConfidence extends CustomerReadModel {
  readonly overallConfidence:   SignalConfidence;
  readonly distribution:        Readonly<Record<SignalConfidence, number>>;
  readonly totalSignals:        number;
  readonly reliableSignalRatio: number;
}

export function buildCustomerConfidence(
  customerId: string,
  stats:      CustomerStatistics,
  now:        number,
): CustomerConfidence {
  const { HIGH, MEDIUM, LOW } = stats.signalsByConfidence;
  const total = stats.totalSignals;
  const reliableSignalRatio =
    total > 0 ? Math.round(((HIGH + MEDIUM) / total) * 1000) / 1000 : 0;

  let overallConfidence: SignalConfidence = "LOW";
  if (total > 0) {
    if (HIGH > MEDIUM && HIGH > LOW) {
      overallConfidence = "HIGH";
    } else if (MEDIUM >= HIGH && MEDIUM > 0) {
      overallConfidence = "MEDIUM";
    }
  }

  return {
    customerId,
    generatedAt:          now,
    overallConfidence,
    distribution:         stats.signalsByConfidence,
    totalSignals:         total,
    reliableSignalRatio,
  };
}
