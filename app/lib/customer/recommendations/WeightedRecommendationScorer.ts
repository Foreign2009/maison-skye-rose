/**
 * Recommendation Intelligence — Weighted Recommendation Scorer
 *
 * Implements RecommendationScorerContract with real intelligence.
 * Replaces the placeholder createUniformScorer() from EP10.0-P5.
 *
 * Architecture:
 *   1. buildPreferenceProfile() — O(m) once per call, not per candidate
 *   2. buildConnectionSets()   — O(n×k) once per call, not per candidate
 *   3. scoreProfile()          — O(1) per candidate
 *   4. scoreRelation()         — O(1) per candidate (set membership)
 *   5. scoreDiscovery()        — O(1) per candidate
 *   6. scoreCatalog()          — O(1) per candidate (inline)
 *   7. apply strategy weights  — O(1) per candidate
 *
 * Strategy-aware dimension weights:
 *   personalised:   profile 0.50, catalog 0.20, relation 0.20, discovery 0.10
 *   similar:        profile 0.20, catalog 0.15, relation 0.50, discovery 0.15
 *   complementary:  profile 0.15, catalog 0.15, relation 0.55, discovery 0.15
 *   discovery:      profile 0.20, catalog 0.20, relation 0.20, discovery 0.40
 *   trending:       profile 0.10, catalog 0.60, relation 0.10, discovery 0.20
 *
 * Catalog dimension (inline — no external module needed):
 *   bestSeller     → +0.40
 *   featured       → +0.25
 *   qualityTier:
 *     "rich"       → +0.25
 *     "standard"   → +0.15
 *     "minimal"    → +0.05
 *   newArrival     → +0.10
 *   clamped to 1.0
 *
 * Candidates are immutable — each stage returns new objects with updated scores.
 *
 * Integration points:
 *   RecommendationPipeline      — createDefaultPipeline() uses createWeightedScorer()
 *   RecommendationScorerContract — implements score()
 *   PreferenceScorer             — buildPreferenceProfile() + scoreProfile()
 *   RelationshipScorer           — buildConnectionSets() + scoreRelation()
 *   DiscoveryScorer              — scoreDiscovery()
 *   RecommendationStrategy       — dimension weights keyed by strategy
 */

import type { RecommendationScorerContract } from "./RecommendationScore";
import type { RecommendationCandidate }      from "./RecommendationCandidate";
import type { RecommendationContext }        from "./RecommendationContext";
import type { RecommendationStrategy }       from "./RecommendationStrategy";
import type { RecommendationScore }          from "./RecommendationScore";
import { buildPreferenceProfile, scoreProfile }  from "./PreferenceScorer";
import { buildConnectionSets,   scoreRelation }  from "./RelationshipScorer";
import { scoreDiscovery }                         from "./DiscoveryScorer";

// ── Strategy dimension weights ────────────────────────────────────────────────

interface DimensionWeights {
  readonly profile:   number;
  readonly catalog:   number;
  readonly relation:  number;
  readonly discovery: number;
}

const STRATEGY_WEIGHTS: Readonly<Record<RecommendationStrategy, DimensionWeights>> = {
  personalised:  { profile: 0.50, catalog: 0.20, relation: 0.20, discovery: 0.10 },
  similar:       { profile: 0.20, catalog: 0.15, relation: 0.50, discovery: 0.15 },
  complementary: { profile: 0.15, catalog: 0.15, relation: 0.55, discovery: 0.15 },
  discovery:     { profile: 0.20, catalog: 0.20, relation: 0.20, discovery: 0.40 },
  trending:      { profile: 0.10, catalog: 0.60, relation: 0.10, discovery: 0.20 },
};

// ── Catalog dimension scorer (inline) ────────────────────────────────────────

function scoreCatalog(candidate: RecommendationCandidate): number {
  const { summary } = candidate;
  let score = 0;

  if (summary.bestSeller)                     score += 0.40;
  if (summary.featured)                       score += 0.25;
  if      (summary.qualityTier === "rich")    score += 0.25;
  else if (summary.qualityTier === "standard")score += 0.15;
  else if (summary.qualityTier === "minimal") score += 0.05;
  if (summary.newArrival)                     score += 0.10;

  return Math.min(score, 1.0);
}

// ── Score composition ─────────────────────────────────────────────────────────

function composeScore(
  profileDim:   number,
  catalogDim:   number,
  relationDim:  number,
  discoveryDim: number,
  weights:      DimensionWeights,
): RecommendationScore {
  const total =
    profileDim   * weights.profile   +
    catalogDim   * weights.catalog   +
    relationDim  * weights.relation  +
    discoveryDim * weights.discovery;

  return {
    profile:   Math.round(profileDim   * 1000) / 1000,
    catalog:   Math.round(catalogDim   * 1000) / 1000,
    relation:  Math.round(relationDim  * 1000) / 1000,
    discovery: Math.round(discoveryDim * 1000) / 1000,
    total:     Math.round(total        * 1000) / 1000,
  };
}

// ── Scorer implementation ─────────────────────────────────────────────────────

export function createWeightedScorer(): RecommendationScorerContract {
  return {
    score(
      candidates: readonly RecommendationCandidate[],
      context:    RecommendationContext,
    ): readonly RecommendationCandidate[] {
      const weights      = STRATEGY_WEIGHTS[context.strategy];
      const prefProfile  = buildPreferenceProfile(context);
      const connSets     = buildConnectionSets(context);

      return candidates.map((candidate) => {
        const profileDim   = scoreProfile(candidate, prefProfile);
        const catalogDim   = scoreCatalog(candidate);
        const relationDim  = scoreRelation(candidate, connSets);
        const discoveryDim = scoreDiscovery(candidate, context);

        const score = composeScore(profileDim, catalogDim, relationDim, discoveryDim, weights);

        return { ...candidate, score };
      });
    },
  };
}
