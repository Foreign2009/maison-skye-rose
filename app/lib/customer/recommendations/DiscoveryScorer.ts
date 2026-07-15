/**
 * Recommendation Intelligence — Discovery Scorer
 *
 * Computes the discovery dimension score for a recommendation candidate.
 * Score range: 0–1. Rewards novelty, catalogue quality, and new arrivals
 * for customers who benefit from exploration (few behavioural signals).
 *
 * Signals scored:
 *   discoveryReadiness — KnowledgeQualityProfile score (0–1) from MKC
 *   qualityTier        — "rich" | "standard" | "minimal" (quality ordering)
 *   newArrival         — explicit new arrival flag
 *   hasRelationships   — graph-connected records surface more discovery paths
 *   cold-start bonus   — amplified when customer has no profile signals
 *
 * Scoring formula (additive, clamped to 1.0):
 *   discoveryReadiness score × 0.50   — primary discovery signal
 *   qualityTier bonus:
 *     "rich"     → +0.25
 *     "standard" → +0.15
 *     "minimal"  → +0.05
 *   newArrival   → +0.15
 *   hasRelationships → +0.10
 *
 * Cold-start amplification:
 *   When profile has no signals and no saved/viewed items, discovery score
 *   is multiplied by 1.30 (clamped to 1.0) so catalogue quality drives
 *   ranking in the absence of profile signals.
 *
 * Integration points:
 *   WeightedRecommendationScorer — calls scoreDiscovery() per candidate
 *   RecommendationContext        — reads profile for cold-start detection
 *   KnowledgeSummary             — reads discoveryReadiness, qualityTier, etc.
 */

import type { RecommendationCandidate } from "./RecommendationCandidate";
import type { RecommendationContext }   from "./RecommendationContext";

export function scoreDiscovery(
  candidate: RecommendationCandidate,
  context:   RecommendationContext,
): number {
  const { summary } = candidate;
  const { profile }  = context;

  let score = 0;

  // Primary discovery signal from catalogue quality profiling
  score += summary.discoveryReadiness * 0.50;

  // Quality tier bonus
  if      (summary.qualityTier === "rich")     score += 0.25;
  else if (summary.qualityTier === "standard") score += 0.15;
  else if (summary.qualityTier === "minimal")  score += 0.05;

  // New arrival boost
  if (summary.newArrival) score += 0.15;

  // Graph-connected items have richer discovery paths
  if (summary.hasRelationships) score += 0.10;

  // Cold-start amplification: no signals anywhere → discovery drives ranking
  const isColdStart =
    profile.signals.length === 0 &&
    profile.savedSlugs.length === 0 &&
    profile.recentlyViewed.length === 0 &&
    profile.lastQuizSlugs.length === 0;

  if (isColdStart) score *= 1.30;

  return Math.min(score, 1.0);
}
