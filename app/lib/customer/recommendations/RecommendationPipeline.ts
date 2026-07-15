/**
 * Personalised Recommendation Engine — Recommendation Pipeline
 *
 * Concrete lifecycle orchestrator for the recommendation flow.
 * Mirrors the LearningEngine / BaseProducer template method pattern.
 *
 * Non-overridable lifecycle (run()):
 *   1. filter   — removes ineligible candidates (exclusion list, current slug)
 *   2. score    — computes composite score per candidate (placeholder: zero)
 *   3. rank     — sorts by score.total descending (placeholder: pool order)
 *   4. explain  — attaches RecommendationReasons per candidate (placeholder: [])
 *   5. assign   — promotes ranked candidates to Recommendation with rank numbers
 *   6. slice    — limits output to context.limit
 *
 * All four pipeline stages are injected as contracts — the pipeline owns no
 * business logic. Add heuristics by replacing the default implementations
 * in EP10.0-P6+ without touching this class.
 *
 * PipelineMetrics contains pool/filtered/returned counts and is used by
 * RecommendationEngine to build RecommendationMetrics.
 *
 * Integration points:
 *   RecommendationEngine   — instantiates and calls via createDefaultPipeline()
 *   RecommendationFilter   — stage 1 contract
 *   RecommendationScore    — stage 2 contract (RecommendationScorerContract)
 *   RecommendationRanking  — stage 3 contract
 *   RecommendationExplainer — stage 4 contract
 *   RecommendationCandidate — inter-stage type
 *   Recommendation          — produced in the assign step
 *   RecommendationContext   — passed through all stages
 */

import type { RecommendationCandidate }  from "./RecommendationCandidate";
import type { RecommendationContext }    from "./RecommendationContext";
import type { Recommendation }           from "./Recommendation";
import type { RecommendationFilterContract }   from "./RecommendationFilter";
import type { RecommendationScorerContract }   from "./RecommendationScore";
import type { RecommendationRankingContract }  from "./RecommendationRanking";
import type { RecommendationExplainerContract } from "./RecommendationExplainer";
import { createExclusionFilter }   from "./RecommendationFilter";
import { createScoreRanker }       from "./RecommendationRanking";
import { createWeightedScorer }    from "./WeightedRecommendationScorer";
import { createReasonBuilder }     from "./RecommendationReasonBuilder";

// ── Pipeline config ────────────────────────────────────────────────────────────

export interface PipelineConfig {
  readonly filter:    RecommendationFilterContract;
  readonly scorer:    RecommendationScorerContract;
  readonly ranker:    RecommendationRankingContract;
  readonly explainer: RecommendationExplainerContract;
}

// ── Pipeline metrics (internal) ───────────────────────────────────────────────

export interface PipelineRunMetrics {
  readonly poolSize:      number;
  readonly filteredSize:  number;
  readonly returnedSize:  number;
}

// ── Pipeline result ────────────────────────────────────────────────────────────

export interface PipelineRunResult {
  readonly recommendations: readonly Recommendation[];
  readonly runMetrics:      PipelineRunMetrics;
}

// ── Pipeline class ─────────────────────────────────────────────────────────────

export class RecommendationPipeline {
  private readonly filter:    RecommendationFilterContract;
  private readonly scorer:    RecommendationScorerContract;
  private readonly ranker:    RecommendationRankingContract;
  private readonly explainer: RecommendationExplainerContract;

  constructor(config: PipelineConfig) {
    this.filter    = config.filter;
    this.scorer    = config.scorer;
    this.ranker    = config.ranker;
    this.explainer = config.explainer;
  }

  run(
    pool:    readonly RecommendationCandidate[],
    context: RecommendationContext,
  ): PipelineRunResult {
    const poolSize = pool.length;

    // ── 1. Filter ─────────────────────────────────────────────────────────────
    const filtered    = this.filter.filter(pool, context);
    const filteredSize = filtered.length;

    // ── 2. Score ──────────────────────────────────────────────────────────────
    const scored = this.scorer.score(filtered, context);

    // ── 3. Rank ───────────────────────────────────────────────────────────────
    const ranked = this.ranker.rank(scored, context);

    // ── 4. Explain + Assign rank + Slice ──────────────────────────────────────
    const recommendations: Recommendation[] = ranked
      .slice(0, context.limit)
      .map((candidate, index) => ({
        rank:    index + 1,
        slug:    candidate.slug,
        summary: candidate.summary,
        score:   candidate.score,
        reasons: this.explainer.explain(candidate, context),
      }));

    return {
      recommendations,
      runMetrics: {
        poolSize,
        filteredSize,
        returnedSize: recommendations.length,
      },
    };
  }
}

// ── Default pipeline factory ───────────────────────────────────────────────────

export function createDefaultPipeline(overrides: Partial<PipelineConfig> = {}): RecommendationPipeline {
  return new RecommendationPipeline({
    filter:    overrides.filter    ?? createExclusionFilter(),
    scorer:    overrides.scorer    ?? createWeightedScorer(),
    ranker:    overrides.ranker    ?? createScoreRanker(),
    explainer: overrides.explainer ?? createReasonBuilder(),
  });
}
