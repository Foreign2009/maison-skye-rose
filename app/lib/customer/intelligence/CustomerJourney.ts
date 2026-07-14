/**
 * Customer Intelligence — Customer Journey
 *
 * Describes where the customer is in their discovery journey based on observed
 * behaviour. Stages are hierarchical and mutually exclusive.
 *
 * Stage derivation rules (evaluated in priority order):
 *   "converting" — any purchase signal or source
 *   "engaged"    — any saved, quiz, or cart signal/source
 *   "exploring"  — any view, search, or discovery signal/source
 *   "new"        — no signals, no viewed, no saved
 *
 * Integration points:
 *   CustomerIntelligenceEngine — built from profile + pre-computed CustomerStatistics
 *   CustomerInsights / CustomerIntelligence — embedded as sub-component
 */

import type { CustomerReadModel }      from "./CustomerReadModel";
import type { UnifiedCustomerProfile } from "../profile/UnifiedCustomerProfile";
import type { CustomerStatistics }     from "./CustomerStatistics";

export type CustomerJourneyStage = "new" | "exploring" | "engaged" | "converting";

export interface CustomerJourney extends CustomerReadModel {
  readonly stage:          CustomerJourneyStage;
  readonly hasSignals:     boolean;
  readonly hasViewed:      boolean;
  readonly hasSaved:       boolean;
  readonly hasQuizResult:  boolean;
  readonly hasPurchased:   boolean;
  readonly recentlyViewed: readonly string[];
  readonly savedSlugs:     readonly string[];
  readonly lastQuizSlugs:  readonly string[];
  readonly lastActiveAt:   number | null;
}

export function buildCustomerJourney(
  customerId: string,
  profile:    UnifiedCustomerProfile,
  stats:      CustomerStatistics,
  now:        number,
): CustomerJourney {
  const hasViewed    = profile.recentlyViewed.length > 0 || stats.signalsBySource["view"] > 0;
  const hasSaved     = profile.savedSlugs.length > 0 || stats.signalsBySource["favorite"] > 0;
  const hasCart      = stats.signalsBySource["cart"] > 0;
  const hasPurchased = stats.signalsBySource["purchase"] > 0;
  const hasQuizResult =
    profile.lastQuizSlugs.length > 0 || stats.signalsBySource["quiz"] > 0;
  const hasSearch    = stats.signalsBySource["search"] > 0;
  const hasDiscovery = stats.signalsBySource["discovery"] > 0;

  let stage: CustomerJourneyStage = "new";
  if (hasPurchased) {
    stage = "converting";
  } else if (hasSaved || hasQuizResult || hasCart) {
    stage = "engaged";
  } else if (hasViewed || hasSearch || hasDiscovery) {
    stage = "exploring";
  }

  return {
    customerId,
    generatedAt:     now,
    stage,
    hasSignals:      profile.signals.length > 0,
    hasViewed,
    hasSaved,
    hasQuizResult,
    hasPurchased,
    recentlyViewed:  profile.recentlyViewed,
    savedSlugs:      profile.savedSlugs,
    lastQuizSlugs:   profile.lastQuizSlugs,
    lastActiveAt:    profile.lastActiveAt,
  };
}
