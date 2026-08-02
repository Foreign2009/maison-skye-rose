/**
 * Personalised Recommendation Engine — Recommendation Context
 *
 * The complete input to recommend(). Carries the customer profile, the
 * chosen strategy, result limit, and optional call-site signals.
 *
 * excludeSlugs       — slugs to omit from candidates (e.g. already-in-cart)
 * currentSlug        — the fragrance currently on-screen; excluded from results
 *                      and used as the pivot for "similar" and "complementary" strategies
 * learnedPreferences — explicit preferences derived by the LearningEngine from
 *                      profile.signals (concierge, search, discovery, etc.).
 *                      Computed once by recommend() and merged into PreferenceScorer
 *                      so both WeightedRecommendationScorer and RecommendationReasonBuilder
 *                      benefit without further LearningEngine calls. Optional — absent for
 *                      cold-start customers with no signal history. (EP20-P4)
 *
 * limit clamps the final result slice. DEFAULT_RECOMMENDATION_LIMIT applies
 * when convenience wrappers are used without an explicit limit.
 *
 * Integration points:
 *   RecommendationEngine     — primary input to recommend()
 *   RecommendationFilter     — reads excludeSlugs + currentSlug for exclusion
 *   RecommendationScore      — reads profile + learnedPreferences for scoring signals
 *   RecommendationRanking    — reads strategy for sort behaviour
 *   RecommendationPipeline   — passed through every pipeline stage
 */

import type { UnifiedCustomerProfile } from "../profile/UnifiedCustomerProfile";
import type { RecommendationStrategy } from "./RecommendationStrategy";
import { DEFAULT_RECOMMENDATION_LIMIT } from "./RecommendationStrategy";

export interface LearnedPreferences {
  readonly preferredFamilies:  readonly string[];
  readonly preferredOccasions: readonly string[];
  readonly preferredSeasons:   readonly string[];
  readonly dominantGender:     string | null;
}

export interface RecommendationContext {
  readonly profile:             UnifiedCustomerProfile;
  readonly strategy:            RecommendationStrategy;
  readonly limit:               number;
  readonly excludeSlugs?:       readonly string[];
  readonly currentSlug?:        string;
  readonly learnedPreferences?: LearnedPreferences;
}

export function createContext(
  profile:  UnifiedCustomerProfile,
  strategy: RecommendationStrategy,
  options: {
    limit?:        number;
    excludeSlugs?: readonly string[];
    currentSlug?:  string;
  } = {},
): RecommendationContext {
  return {
    profile,
    strategy,
    limit:        options.limit        ?? DEFAULT_RECOMMENDATION_LIMIT,
    excludeSlugs: options.excludeSlugs ?? [],
    currentSlug:  options.currentSlug,
  };
}
