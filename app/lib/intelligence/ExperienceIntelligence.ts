/**
 * Experience Intelligence — Shared Adapter (EP25.2)
 *
 * Canonical intelligence consumption layer for all customer-facing experiences.
 * Resolves the appropriate RE strategy for a given experience context,
 * delegates execution to the Recommendation Engine, builds contextual display
 * copy via buildRecommendationContext, and returns a canonical result model.
 *
 * No scoring. No recommendation logic. Orchestration only.
 *
 * Integration points (read-only — this module never mutates):
 *   RecommendationEngine         — RE strategy execution
 *   hasMeaningfulProfile         — personalised vs discovery resolution
 *   buildRecommendationContext   — contextual display copy
 *   UnifiedCustomerProfile       — customer intelligence input
 *
 * Supported experience types:
 *   shop, academy, discover, product, compare, quiz,
 *   favorites, recently_viewed, fragrance_profile, homepage, concierge
 *
 * Public API:
 *   getContextualRecommendations — primary orchestration entry point
 *   getRecommendations           — profile-adaptive convenience
 *   getDiscoveryRecommendations  — always-discovery convenience
 *   getRelatedRecommendations    — slug-based similar/complementary convenience
 */

import {
  recommendForProfile,
  recommendDiscovery,
  recommendSimilar,
  recommendComplementary,
} from "../customer/recommendations/RecommendationEngine";
import { createEmptyMetrics }       from "../customer/recommendations/RecommendationMetrics";
import { DEFAULT_RECOMMENDATION_LIMIT } from "../customer/recommendations/RecommendationStrategy";
import { hasMeaningfulProfile }     from "../customer/profile/profileUtils";
import type { UnifiedCustomerProfile }  from "../customer/profile/UnifiedCustomerProfile";
import type { RecommendationStrategy }  from "../customer/recommendations/RecommendationStrategy";
import type { Recommendation }          from "../customer/recommendations/Recommendation";
import type { RecommendationMetrics }   from "../customer/recommendations/RecommendationMetrics";
import {
  buildRecommendationContext,
  type PageType,
  type RecommendationDisplayContext,
} from "../adaptive/buildRecommendationContext";

// ── Experience context ────────────────────────────────────────────────────────

export type ExperienceType =
  | "shop"
  | "academy"
  | "discover"
  | "product"
  | "compare"
  | "quiz"
  | "favorites"
  | "recently_viewed"
  | "fragrance_profile"
  | "homepage"
  | "concierge";

export interface ExperienceOptions {
  readonly currentSlug?: string;          // required for product / compare / concierge (similar/complementary)
  readonly limit?:       number;
  readonly collection?:  string;          // forwarded to buildRecommendationContext for collection pages
  readonly seedSlugs?:   readonly string[]; // academy, discover — seeds synthetic profile for cold-start customers
}

// ── Result model ──────────────────────────────────────────────────────────────

export interface ExperienceIntelligenceResult {
  readonly experience:      ExperienceType;
  readonly strategy:        RecommendationStrategy;
  readonly isPersonalised:  boolean;
  readonly recommendations: readonly Recommendation[];
  readonly context:         RecommendationDisplayContext | null;
  readonly metrics:         RecommendationMetrics;
  readonly success:         boolean;
  readonly error?:          string;
}

// ── Strategy resolution ───────────────────────────────────────────────────────
// Maps each experience type + profile state to the appropriate RE strategy.
// No scoring is changed — this is purely a routing decision.

function resolveStrategy(
  experience: ExperienceType,
  profile:    UnifiedCustomerProfile,
  options:    ExperienceOptions,
): RecommendationStrategy {
  switch (experience) {
    case "product":   return "similar";
    case "compare":   return "complementary";
    case "discover":  return "discovery";
    case "concierge": return options.currentSlug
      ? "similar"
      : hasMeaningfulProfile(profile) ? "personalised" : "discovery";
    default:
      return hasMeaningfulProfile(profile) ? "personalised" : "discovery";
  }
}

// ── Page type mapping ─────────────────────────────────────────────────────────
// Connects experience types to buildRecommendationContext page types.
// Experiences not listed here have no contextual copy support yet —
// buildRecommendationContext will not be called for them.

const PAGE_TYPE_MAP: Readonly<Partial<Record<ExperienceType, PageType>>> = {
  favorites:          "favorites",
  recently_viewed:    "recently-viewed",
  fragrance_profile:  "fragrance-profile",
  homepage:           "homepage",
};

// ── Seeded profile synthesis ──────────────────────────────────────────────────
// For cold-start customers on academy and discover experiences, inject seed
// slugs as lastQuizSlugs so the RE's PreferenceScorer can extract
// family/occasion/season preferences from those records and score accordingly.
// Returning customers (hasMeaningfulProfile = true) are never affected —
// their real profile is always used as-is.

function buildSeededProfile(
  profile: UnifiedCustomerProfile,
  seeds:   readonly string[],
): UnifiedCustomerProfile {
  if (hasMeaningfulProfile(profile) || seeds.length === 0) return profile;
  return { ...profile, lastQuizSlugs: seeds };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildEmptyResult(
  experience: ExperienceType,
  strategy:   RecommendationStrategy,
  error?:     string,
): ExperienceIntelligenceResult {
  return {
    experience,
    strategy,
    isPersonalised:  false,
    recommendations: [],
    context:         null,
    metrics:         createEmptyMetrics(strategy),
    success:         error === undefined,
    ...(error !== undefined && { error }),
  };
}

function runEngine(
  strategy: RecommendationStrategy,
  profile:  UnifiedCustomerProfile,
  options:  ExperienceOptions,
) {
  const limit = options.limit ?? DEFAULT_RECOMMENDATION_LIMIT;

  switch (strategy) {
    case "similar":
      return options.currentSlug
        ? recommendSimilar(options.currentSlug, profile, limit)
        : null;

    case "complementary":
      return options.currentSlug
        ? recommendComplementary(options.currentSlug, profile, limit)
        : null;

    case "discovery":
      return recommendDiscovery(profile, limit);

    default:
      return recommendForProfile(profile, limit);
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Primary orchestration entry point.
 *
 * Resolves the RE strategy for the given experience and profile state,
 * executes the engine, builds contextual display copy where available,
 * and returns a canonical ExperienceIntelligenceResult.
 *
 * Does not change scoring, strategy behaviour, or recommendation ordering.
 */
export function getContextualRecommendations(
  experience: ExperienceType,
  profile:    UnifiedCustomerProfile,
  options:    ExperienceOptions = {},
): ExperienceIntelligenceResult {
  const usesSeeding = (experience === "academy" || experience === "discover") && options.seedSlugs;
  const effectiveProfile = usesSeeding
    ? buildSeededProfile(profile, options.seedSlugs!)
    : profile;

  const strategy       = resolveStrategy(experience, effectiveProfile, options);
  const isPersonalised = strategy === "personalised";

  const reResult = runEngine(strategy, effectiveProfile, options);

  if (!reResult) {
    return buildEmptyResult(
      experience,
      strategy,
      "currentSlug is required for similar and complementary strategies",
    );
  }

  if (!reResult.success) {
    return buildEmptyResult(experience, strategy, reResult.error);
  }

  const pageType = PAGE_TYPE_MAP[experience] ?? null;
  const context  = pageType
    ? buildRecommendationContext(pageType, effectiveProfile, { collection: options.collection })
    : null;

  return {
    experience,
    strategy,
    isPersonalised,
    recommendations: reResult.recommendations,
    context,
    metrics:         reResult.metrics,
    success:         true,
  };
}

/**
 * Profile-adaptive convenience.
 *
 * Uses personalised strategy when the customer has meaningful signals,
 * discovery otherwise. Suitable for general recommendation surfaces
 * where the experience type is not the primary concern.
 */
export function getRecommendations(
  profile: UnifiedCustomerProfile,
  options: ExperienceOptions = {},
): ExperienceIntelligenceResult {
  return getContextualRecommendations("homepage", profile, options);
}

/**
 * Always-discovery convenience.
 *
 * Ignores profile personalisation state. Suitable for exploration surfaces
 * where diversity is preferred over personalisation, or when a cold-start
 * experience is explicitly desired.
 */
export function getDiscoveryRecommendations(
  profile: UnifiedCustomerProfile,
  options: ExperienceOptions = {},
): ExperienceIntelligenceResult {
  return getContextualRecommendations("discover", profile, options);
}

/**
 * Slug-based convenience.
 *
 * Resolves similar (product, concierge) or complementary (compare) strategy
 * based on experience type. currentSlug is required — returns an empty result
 * with an error if omitted.
 */
export function getRelatedRecommendations(
  slug:       string,
  experience: "product" | "compare" | "concierge",
  profile:    UnifiedCustomerProfile,
  options:    ExperienceOptions = {},
): ExperienceIntelligenceResult {
  return getContextualRecommendations(experience, profile, { ...options, currentSlug: slug });
}
