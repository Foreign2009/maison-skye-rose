/**
 * Recommendation Intelligence — Recommendation Confidence
 *
 * Calculates how much the engine can trust a recommendation given the
 * available profile signal depth and the candidate's composite score.
 *
 * Confidence is NOT a measure of fragrance desirability.
 * It reflects the certainty of the recommendation decision based on
 * the richness of the customer profile.
 *
 * Calculation:
 *   1. Base score from profile signal count (cold-start → 0.15, rich → 0.85)
 *   2. Blend with candidate's score.total (70% base / 30% score quality)
 *   3. Derive level: HIGH ≥ 0.65, MEDIUM ≥ 0.35, LOW < 0.35
 *
 * Integration points:
 *   RecommendationReasonBuilder — called once per candidate in explain step
 *   RecommendationExplanation   — embedded as sub-component
 *   RecommendationCandidate     — reads score.total for blend
 *   RecommendationContext       — reads profile.signals.length + behavioural flags
 */

import type { RecommendationCandidate } from "./RecommendationCandidate";
import type { RecommendationContext }   from "./RecommendationContext";

export type ConfidenceLevel = "HIGH" | "MEDIUM" | "LOW";

export interface RecommendationConfidence {
  readonly level:   ConfidenceLevel;
  readonly score:   number;
  readonly signals: number;
  readonly reason:  string;
}

export function calculateConfidence(
  candidate: RecommendationCandidate,
  context:   RecommendationContext,
): RecommendationConfidence {
  const { profile }  = context;
  const signalCount  = profile.signals.length;
  const hasViewed    = profile.recentlyViewed.length > 0;
  const hasSaved     = profile.savedSlugs.length > 0;

  // Base score from profile signal richness
  let base: number;
  if      (signalCount >= 10) base = 0.85;
  else if (signalCount >= 5)  base = 0.65;
  else if (signalCount >= 1)  base = 0.45;
  else if (hasSaved || hasViewed) base = 0.35;
  else base = 0.15; // cold start

  // Blend with candidate score quality (weaker signal, validates the base)
  const blended = base * 0.70 + candidate.score.total * 0.30;
  const score   = Math.round(Math.min(blended, 1.0) * 1000) / 1000;

  const level: ConfidenceLevel =
    score >= 0.65 ? "HIGH"   :
    score >= 0.35 ? "MEDIUM" :
    "LOW";

  const reason =
    level === "HIGH"   ? `${signalCount} signals — strong profile match`                          :
    level === "MEDIUM" && signalCount > 0
                       ? `${signalCount} signal${signalCount === 1 ? "" : "s"} — moderate profile match` :
    hasSaved || hasViewed
                       ? "Early behaviour observed — building profile"                              :
    "No profile signals — catalogue quality ordering";

  return { level, score, signals: signalCount, reason };
}
