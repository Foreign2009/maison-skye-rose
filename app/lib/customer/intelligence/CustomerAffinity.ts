/**
 * Customer Intelligence — Customer Affinity
 *
 * Derived from CustomerStatistics — no direct access to the profile.
 * Identifies the dominant signal source and most-signalled type so
 * experience surfaces can adapt without re-counting signals.
 *
 * dominantSource / mostSignalledType are null when no signals exist.
 *
 * Integration points:
 *   CustomerIntelligenceEngine — built from pre-computed CustomerStatistics
 *   CustomerInsights / CustomerIntelligence — embedded as sub-component
 */

import type { CustomerReadModel }   from "./CustomerReadModel";
import type { CustomerStatistics }  from "./CustomerStatistics";
import type { SignalSource }        from "../signals/SignalSource";
import type { SignalType }          from "../signals/SignalType";
import type { SignalConfidence }    from "../signals/SignalConfidence";

export interface CustomerAffinity extends CustomerReadModel {
  readonly signalsBySource:     Readonly<Record<SignalSource, number>>;
  readonly signalsByType:       Readonly<Record<SignalType, number>>;
  readonly signalsByConfidence: Readonly<Record<SignalConfidence, number>>;
  readonly dominantSource:      SignalSource | null;
  readonly mostSignalledType:   SignalType | null;
}

export function buildCustomerAffinity(
  customerId: string,
  stats:      CustomerStatistics,
  now:        number,
): CustomerAffinity {
  let dominantSource: SignalSource | null = null;
  let maxSourceCount = 0;
  for (const [source, count] of Object.entries(stats.signalsBySource) as Array<[SignalSource, number]>) {
    if (count > maxSourceCount) {
      maxSourceCount = count;
      dominantSource = source;
    }
  }

  let mostSignalledType: SignalType | null = null;
  let maxTypeCount = 0;
  for (const [type, count] of Object.entries(stats.signalsByType) as Array<[SignalType, number]>) {
    if (count > maxTypeCount) {
      maxTypeCount = count;
      mostSignalledType = type;
    }
  }

  return {
    customerId,
    generatedAt:          now,
    signalsBySource:      stats.signalsBySource,
    signalsByType:        stats.signalsByType,
    signalsByConfidence:  stats.signalsByConfidence,
    dominantSource:       maxSourceCount > 0 ? dominantSource : null,
    mostSignalledType:    maxTypeCount > 0 ? mostSignalledType : null,
  };
}
