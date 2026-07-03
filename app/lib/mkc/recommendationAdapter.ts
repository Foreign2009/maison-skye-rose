import type { Fragrance } from "../../data/types";
import type { FragranceKnowledge } from "./types";

/**
 * Projects a FragranceKnowledge record into the Fragrance shape
 * consumed by the Recommendation Engine (recommendFragrances).
 *
 * No derivation. No enrichment. Direct field mapping only.
 * images["10ml"] is used as the single representative image,
 * matching the behaviour of the existing knowledgeAdapter.
 */
export function toRecommendationFragrance(knowledge: FragranceKnowledge): Fragrance {
  return {
    id:             knowledge.id,
    name:           knowledge.name,
    brand:          knowledge.brand,
    gender:         knowledge.gender,
    family:         knowledge.family,
    notes:          knowledge.notes,
    vibe:           knowledge.vibe,
    occasions:      knowledge.occasions,
    seasons:        knowledge.seasons,
    scentCharacter: knowledge.scentCharacter,
    projection:     knowledge.projection,
    signatureStyle: knowledge.signatureStyle,
    recommendedFor: knowledge.recommendedFor,
    sweetness:      knowledge.sweetness,
    freshness:      knowledge.freshness,
    warmth:         knowledge.warmth,
    intensity:      knowledge.intensity,
    versatility:    knowledge.versatility,
    popularity:     knowledge.popularity,
    image:          knowledge.images["10ml"],
    featured:       knowledge.featured,
    bestSeller:     knowledge.bestSeller,
    newArrival:     knowledge.newArrival,
    collection:     knowledge.collection,
  };
}
