/**
 * Customer Intelligence — Customer Statistics
 *
 * Raw counted metrics derived from a UnifiedCustomerProfile.
 * Single O(n) pass over profile.signals — no repeated iteration.
 *
 * All maps are keyed by the full SignalSource / SignalType / SignalConfidence
 * enum value and default to 0 for members with no signals, ensuring callers
 * never encounter missing keys.
 *
 * Integration points:
 *   CustomerIntelligenceEngine — computed once, shared with Affinity / Journey / Confidence builders
 *   CustomerAffinity           — derives dominant dimensions from these counts
 *   CustomerJourney            — checks source counts for stage derivation
 *   CustomerConfidence         — reads confidence distribution
 */

import type { CustomerReadModel }      from "./CustomerReadModel";
import type { UnifiedCustomerProfile } from "../profile/UnifiedCustomerProfile";
import type { SignalSource }           from "../signals/SignalSource";
import type { SignalType }             from "../signals/SignalType";
import type { SignalConfidence }       from "../signals/SignalConfidence";
import { SIGNAL_SOURCES }              from "../signals/SignalSource";
import { SIGNAL_TYPES }                from "../signals/SignalType";

export interface CustomerStatistics extends CustomerReadModel {
  readonly totalSignals:        number;
  readonly signalsBySource:     Readonly<Record<SignalSource, number>>;
  readonly signalsByType:       Readonly<Record<SignalType, number>>;
  readonly signalsByConfidence: Readonly<Record<SignalConfidence, number>>;
  readonly oldestSignalAt:      number | null;
  readonly newestSignalAt:      number | null;
  readonly recentlyViewedCount: number;
  readonly savedCount:          number;
  readonly quizResultCount:     number;
}

export function buildCustomerStatistics(
  customerId: string,
  profile:    UnifiedCustomerProfile,
  now:        number,
): CustomerStatistics {
  const bySource = Object.fromEntries(
    SIGNAL_SOURCES.map((s) => [s, 0]),
  ) as Record<SignalSource, number>;

  const byType = Object.fromEntries(
    SIGNAL_TYPES.map((t) => [t, 0]),
  ) as Record<SignalType, number>;

  const byConfidence: Record<SignalConfidence, number> = { HIGH: 0, MEDIUM: 0, LOW: 0 };

  let oldest: number | null = null;
  let newest: number | null = null;

  for (const signal of profile.signals) {
    bySource[signal.source]++;
    byType[signal.type]++;
    byConfidence[signal.confidence]++;
    if (oldest === null || signal.timestamp < oldest) oldest = signal.timestamp;
    if (newest === null || signal.timestamp > newest) newest = signal.timestamp;
  }

  return {
    customerId,
    generatedAt:          now,
    totalSignals:         profile.signals.length,
    signalsBySource:      bySource,
    signalsByType:        byType,
    signalsByConfidence:  byConfidence,
    oldestSignalAt:       oldest,
    newestSignalAt:       newest,
    recentlyViewedCount:  profile.recentlyViewed.length,
    savedCount:           profile.savedSlugs.length,
    quizResultCount:      profile.lastQuizSlugs.length,
  };
}
