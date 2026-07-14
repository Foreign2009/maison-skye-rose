/**
 * Knowledge Intelligence Engine — Knowledge Recommendations
 *
 * Bridges the existing Recommendation Engine with the Intelligence layer.
 * All scoring logic lives in recommendFragrances.ts — this module adapts
 * its inputs and outputs to Intelligence layer types.
 *
 * The Recommendation Engine operates on the Fragrance type (data/types.ts).
 * This module handles the conversion:
 *   mkcCatalogue → Fragrance[] (via toRecommendationFragrance)
 *   RecommendationResults → KnowledgeRecommendationResult (via KnowledgeSummary)
 *
 * Integration points:
 *   recommendFragrances.ts      — scoring engine
 *   recommendationAdapter.ts    — MKC → Fragrance projection
 *   catalogue.ts                — mkcCatalogue
 *   KnowledgeSummary            — output projection
 */

import type { FragranceKnowledge }    from "../mkc/types";
import { mkcCatalogue }               from "../mkc/catalogue";
import { toRecommendationFragrance }  from "../mkc/recommendationAdapter";
import { recommendFragrances, type QuizAnswers } from "../recommendFragrances";
import { buildKnowledgeSummary, type KnowledgeSummary } from "./KnowledgeSummary";

// ── Public types ──────────────────────────────────────────────────────────────

export type RecommendationOptions = QuizAnswers;

export interface KnowledgeRecommendationResult {
  readonly bestMatch:     KnowledgeSummary | null;
  readonly similar:       readonly KnowledgeSummary[];
  readonly luxuryUpgrade: KnowledgeSummary | null;
  readonly hiddenGem:     KnowledgeSummary | null;
}

// ── Module-level precomputed pool ─────────────────────────────────────────────
// Built once at initialisation. recommendFragrances() receives this on every call.

const RECOMMENDATION_POOL = mkcCatalogue.map(toRecommendationFragrance);

// Reverse-map Fragrance id → FragranceKnowledge for output projection.
const CATALOGUE_BY_ID = new Map<string, FragranceKnowledge>(
  mkcCatalogue.map((r) => [r.id, r]),
);

function toSummaryById(id: string | undefined): KnowledgeSummary | null {
  if (!id) return null;
  const record = CATALOGUE_BY_ID.get(id);
  return record ? buildKnowledgeSummary(record) : null;
}

// ── Public API ────────────────────────────────────────────────────────────────

export function buildKnowledgeRecommendations(
  options: RecommendationOptions,
): KnowledgeRecommendationResult {
  const results = recommendFragrances(RECOMMENDATION_POOL, options);

  return {
    bestMatch:     toSummaryById(results.bestMatch?.id),
    similar:       results.similarMatches
                     .map((f) => toSummaryById(f.id))
                     .filter((s): s is KnowledgeSummary => s !== null),
    luxuryUpgrade: toSummaryById(results.luxuryUpgrade?.id),
    hiddenGem:     toSummaryById(results.hiddenGem?.id),
  };
}
