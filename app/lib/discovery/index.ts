/**
 * Maison Intelligence Layer — Public API
 *
 * app/lib/discovery/ is the platform Intelligence Layer: the shared foundation
 * for all fragrance and content discovery services across the repository.
 *
 * Current modules:
 *   types.ts            — shared interfaces and scored types
 *   weights.ts          — named scoring constants
 *   scoring.ts          — shared scoring helpers consumed by all engines
 *   similarityEngine.ts — product-to-product similarity
 *   collectionEngine.ts — dynamic collection generation from MKC
 *
 * Planned modules (reserved):
 *   searchRankingEngine.ts  — unified cross-entity search ranking
 *   personalizationEngine.ts — session and preference-aware ranking
 *   aiAdapter.ts            — embedding-based scoring adapter
 */

import { mkcCatalogue } from "../mkc/catalogue";
import { toRecommendationFragrance } from "../mkc/recommendationAdapter";
import { toDisplayFragrance } from "../mkc/displayAdapter";
import type { FragranceKnowledge } from "../mkc/types";
import type { Fragrance } from "../../data/types";
import type { DisplayFragrance } from "../knowledgeAdapter";

// ── Shared catalogue maps ─────────────────────────────────────────────────────
// Computed once at module level. Import from here instead of recomputing
// per component. Eliminates the duplicate maps in ProductDetail and Shop.

export const catalogueMaps = {
  bySlug: new Map<string, FragranceKnowledge>(
    mkcCatalogue.map((k) => [k.slug, k])
  ),
  byName: new Map<string, FragranceKnowledge>(
    mkcCatalogue.map((k) => [k.name, k])
  ),
  adapted: mkcCatalogue.map(toRecommendationFragrance),
  adaptedByName: new Map<string, Fragrance>(
    mkcCatalogue.map((k) => [k.name, toRecommendationFragrance(k)])
  ),
  display: mkcCatalogue.map(toDisplayFragrance),
  displayByName: new Map<string, DisplayFragrance>(
    mkcCatalogue.map((k) => [k.name, toDisplayFragrance(k)])
  ),
};

// ── Seasonal intelligence ─────────────────────────────────────────────────────
// Returns the current Southern Hemisphere season (South Africa).

export function getCurrentSeason(): "Spring" | "Summer" | "Autumn" | "Winter" {
  const month = new Date().getMonth() + 1; // 1–12
  if (month >= 3 && month <= 5) return "Autumn";
  if (month >= 6 && month <= 8) return "Winter";
  if (month >= 9 && month <= 11) return "Spring";
  return "Summer"; // December, January, February
}

// ── Engine exports ────────────────────────────────────────────────────────────

export { getSimilarFragrances }                            from "./similarityEngine";
export { generateCollection, getCollection, COLLECTION_SPECS } from "./collectionEngine";

// ── Type re-exports ───────────────────────────────────────────────────────────

export type {
  SimilarityResult,
  ScoredFragrance,
  ScoreBreakdown,
  CollectionSpec,
  CollectionFilter,
  CollectionBoost,
  SearchResult,
  SearchResultType,
  DiscoveryContext,
} from "./types";
