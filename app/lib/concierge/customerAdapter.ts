/**
 * Maison Concierge — Customer Adapter
 *
 * Translation boundary between the Customer Intelligence Engine (CIE) and
 * the Concierge. Consumes stable CIE read models and produces a
 * ConciergeCustomerContext that the Concierge can use without interpreting
 * raw CustomerSignal objects.
 *
 * Chain: UnifiedCustomerProfile → CIE → ConciergeCustomerContext → Concierge
 *
 * Concierge modules must not import from customer/profile directly.
 * All customer data enters the Concierge through this adapter.
 *
 * Integration points:
 *   route.ts              — calls adaptCustomerProfile(), passes context to builders
 *   contextBuilder.ts     — builds CUSTOMER AWARENESS prompt section from context
 *   retrievalPlanner.ts   — checks hasSaved/hasRecentlyViewed for RE personalisation
 *   CustomerIntelligenceEngine — getCustomerJourney(), getCustomerPreferenceSummary()
 */

import type { UnifiedCustomerProfile } from "../customer/profile/UnifiedCustomerProfile";
import type { CustomerJourneyStage }   from "../customer/intelligence/CustomerJourney";
import {
  getCustomerJourney,
  getCustomerPreferenceSummary,
}                                      from "../customer/intelligence/CustomerIntelligenceEngine";

// ── Output type ────────────────────────────────────────────────────────────────

export interface ConciergeCustomerContext {
  readonly journeyStage:       CustomerJourneyStage;
  readonly hasSaved:           boolean;
  readonly hasRecentlyViewed:  boolean;
  readonly hasQuizResult:      boolean;
  readonly savedSlugs:         readonly string[];
  readonly recentlyViewed:     readonly string[];
  readonly lastQuizSlugs:      readonly string[];
  readonly preferredFamilies:  readonly string[];
  readonly preferredOccasions: readonly string[];
  readonly preferredSeasons:   readonly string[];
  readonly dominantGender:     "male" | "female" | "unisex" | null;
  readonly hasPreferences:     boolean;
  readonly signalCount:        number;
}

// ── Adapter ────────────────────────────────────────────────────────────────────

export function adaptCustomerProfile(
  profile: UnifiedCustomerProfile,
): ConciergeCustomerContext {
  const journey = getCustomerJourney(profile);
  const prefs   = getCustomerPreferenceSummary(profile);

  return {
    journeyStage:       journey.stage,
    hasSaved:           journey.hasSaved,
    hasRecentlyViewed:  journey.hasViewed,
    hasQuizResult:      journey.hasQuizResult,
    savedSlugs:         journey.savedSlugs,
    recentlyViewed:     journey.recentlyViewed,
    lastQuizSlugs:      journey.lastQuizSlugs,
    preferredFamilies:  prefs.preferredFamilies,
    preferredOccasions: prefs.preferredOccasions,
    preferredSeasons:   prefs.preferredSeasons,
    dominantGender:     prefs.dominantGender,
    hasPreferences:     prefs.hasPreferences,
    signalCount:        profile.signals.length,
  };
}
