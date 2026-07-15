/**
 * Recommendation Intelligence — Recommendation Trace
 *
 * Diagnostic record capturing the scoring inputs for a single recommendation.
 * Produced alongside reasons in RecommendationReasonBuilder for observability.
 *
 * Traces are not rendered to customers — they are for admin tooling,
 * debugging, and future A/B testing. They expose the raw scoring context
 * so engineers can audit why a fragrance ranked where it did.
 *
 * Fields:
 *   candidateSlug          — the fragrance being traced
 *   strategy               — which recommendation strategy was active
 *   scoreTotal             — final composite score (sum of weighted dimensions)
 *   profileScore           — preference dimension score (family, gender, occasion)
 *   catalogScore           — catalogue quality dimension score (quality, bestseller)
 *   relationScore          — relationship graph dimension score (graph connections)
 *   discoveryScore         — discovery novelty dimension score (novelty, new arrivals)
 *   profileSignalCount     — customer signal count at time of recommendation
 *   savedSlugsConsidered   — number of saved slugs used in scoring
 *   viewedSlugsConsidered  — number of recently viewed slugs used in scoring
 *   currentSlugPresent     — whether a currentSlug pivot was provided
 *   generatedAt            — Unix ms when this trace was built
 *
 * Integration points:
 *   RecommendationReasonBuilder — buildTrace() called once per candidate
 *   RecommendationExplanation   — embedded as sub-component
 */

import type { RecommendationCandidate } from "./RecommendationCandidate";
import type { RecommendationContext }   from "./RecommendationContext";
import type { RecommendationStrategy }  from "./RecommendationStrategy";

export interface RecommendationTrace {
  readonly candidateSlug:         string;
  readonly strategy:              RecommendationStrategy;
  readonly scoreTotal:            number;
  readonly profileScore:          number;
  readonly catalogScore:          number;
  readonly relationScore:         number;
  readonly discoveryScore:        number;
  readonly profileSignalCount:    number;
  readonly savedSlugsConsidered:  number;
  readonly viewedSlugsConsidered: number;
  readonly currentSlugPresent:    boolean;
  readonly generatedAt:           number;
}

export function buildTrace(
  candidate: RecommendationCandidate,
  context:   RecommendationContext,
  now:       number = Date.now(),
): RecommendationTrace {
  return {
    candidateSlug:         candidate.slug,
    strategy:              context.strategy,
    scoreTotal:            candidate.score.total,
    profileScore:          candidate.score.profile,
    catalogScore:          candidate.score.catalog,
    relationScore:         candidate.score.relation,
    discoveryScore:        candidate.score.discovery,
    profileSignalCount:    context.profile.signals.length,
    savedSlugsConsidered:  context.profile.savedSlugs.length,
    viewedSlugsConsidered: context.profile.recentlyViewed.length,
    currentSlugPresent:    context.currentSlug !== undefined,
    generatedAt:           now,
  };
}
