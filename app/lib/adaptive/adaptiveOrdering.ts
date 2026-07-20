/**
 * Adaptive Collection Ordering — EP22.1
 *
 * Lightweight ordering layer that reorders a pre-filtered, pre-sorted
 * FragranceKnowledge array to surface items that best match the customer's
 * existing Fragrance Profile.
 *
 * Architecture:
 *   Existing catalogue (filtered + sorted)
 *     ↓
 *   applyAdaptiveOrdering (this module)
 *     ↓
 *   Rendered grid
 *
 * Ordering tiers (evaluated in priority order):
 *   1. bestSeller flag    — maintains existing merchandising tier separation
 *   2. Affinity score     — derived via PreferenceScorer (family + gender + occasion + season)
 *   3. Popularity         — existing merchandising signal as tiebreaker
 *   4. Original index     — stable; preserves pre-existing catalogue order within equal scores
 *
 * Fallback:
 *   Returns the input array (spread copy) unchanged when:
 *     - profile is null (SSR, localStorage unavailable)
 *     - hasMeaningfulProfile returns false (cold-start customer)
 *     - prefProfile.hasSignals is false (no usable signals derived)
 *   Cold-start customers receive the existing default ordering.
 *
 * Integration points:
 *   PreferenceScorer    — buildPreferenceProfile, scoreProfile, getSummaryForSlug (existing engine)
 *   createContext       — wraps UnifiedCustomerProfile into RecommendationContext
 *   hasMeaningfulProfile — cold-start gate
 *   FragranceKnowledge  — source type for all collection arrays
 */

import {
  buildPreferenceProfile,
  scoreProfile,
  getSummaryForSlug,
} from "../customer/recommendations/PreferenceScorer";
import { createZeroScore }    from "../customer/recommendations/RecommendationScore";
import { createContext }      from "../customer/recommendations/RecommendationContext";
import { hasMeaningfulProfile } from "../customer/profile/profileUtils";
import type { FragranceKnowledge }    from "../mkc/types";
import type { UnifiedCustomerProfile } from "../customer/profile/UnifiedCustomerProfile";

export function applyAdaptiveOrdering(
  items:   readonly FragranceKnowledge[],
  profile: UnifiedCustomerProfile | null,
): FragranceKnowledge[] {
  // Cold-start fallback: no profile or no meaningful activity
  if (!profile || !hasMeaningfulProfile(profile)) return [...items];

  // Derive preference profile using the existing PreferenceScorer
  const context     = createContext(profile, "personalised");
  const prefProfile = buildPreferenceProfile(context);

  // No usable signals derived — return default order
  if (!prefProfile.hasSignals) return [...items];

  // Score each item; original index preserved for stable tiebreaking
  const scored = items.map((item, originalIndex) => {
    const summary      = getSummaryForSlug(item.slug);
    const affinityScore = summary
      ? scoreProfile(
          { slug: item.slug, summary, score: createZeroScore(), reasons: [] },
          prefProfile,
        )
      : 0;
    return { item, originalIndex, affinityScore };
  });

  return scored
    .sort((a, b) => {
      // Tier 1: bestSeller flag — preserves existing merchandising separation
      if (a.item.bestSeller !== b.item.bestSeller) return a.item.bestSeller ? -1 : 1;
      // Tier 2: affinity score — personalisation signal (higher is better)
      if (b.affinityScore !== a.affinityScore) return b.affinityScore - a.affinityScore;
      // Tier 3: popularity — existing merchandising signal
      if (b.item.popularity !== a.item.popularity) return b.item.popularity - a.item.popularity;
      // Tier 4: stable — preserve pre-existing catalogue order
      return a.originalIndex - b.originalIndex;
    })
    .map((s) => s.item);
}
