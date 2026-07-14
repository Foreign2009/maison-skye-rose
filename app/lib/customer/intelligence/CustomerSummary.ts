/**
 * Customer Intelligence — Customer Summary
 *
 * Lightweight projection of a UnifiedCustomerProfile.
 * Suitable for UI surfaces and quick eligibility checks.
 *
 * hasPreferences is always false until EP10.0-P5+ interpreters produce candidates.
 *
 * Integration points:
 *   CustomerIntelligenceEngine — built by getCustomerSummary / getCustomerIntelligence
 *   CustomerInsights           — embedded as sub-component
 */

import type { CustomerReadModel }       from "./CustomerReadModel";
import type { UnifiedCustomerProfile }  from "../profile/UnifiedCustomerProfile";

export interface CustomerSummary extends CustomerReadModel {
  readonly tier:                "session" | "device" | "unified";
  readonly signalCount:         number;
  readonly hasPreferences:      boolean;
  readonly hasRecentlyViewed:   boolean;
  readonly hasSaved:            boolean;
  readonly hasQuizResult:       boolean;
  readonly recentlyViewedCount: number;
  readonly savedCount:          number;
  readonly lastActiveAt:        number | null;
}

export function buildCustomerSummary(
  customerId:     string,
  profile:        UnifiedCustomerProfile,
  now:            number,
  hasPreferences: boolean = false,
): CustomerSummary {
  return {
    customerId,
    generatedAt:          now,
    tier:                 profile.tier,
    signalCount:          profile.signals.length,
    hasPreferences,
    hasRecentlyViewed:    profile.recentlyViewed.length > 0,
    hasSaved:             profile.savedSlugs.length > 0,
    hasQuizResult:        profile.lastQuizSlugs.length > 0,
    recentlyViewedCount:  profile.recentlyViewed.length,
    savedCount:           profile.savedSlugs.length,
    lastActiveAt:         profile.lastActiveAt,
  };
}
