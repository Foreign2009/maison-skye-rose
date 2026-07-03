import type { DisplayFragrance } from "../knowledgeAdapter";
import type { FragranceKnowledge } from "./types";

/**
 * Projects a FragranceKnowledge record into the DisplayFragrance shape
 * consumed by UI components (ProductCard, ProductDetail, Shop, Collections, Quiz).
 *
 * No derivation. No enrichment. Direct field mapping only.
 */
export function toDisplayFragrance(knowledge: FragranceKnowledge): DisplayFragrance {
  return {
    title:      knowledge.name,
    collection: knowledge.collection,
    subtitle:   knowledge.subtitle ?? "",
    mood:       knowledge.mood,
    profile:    knowledge.profile,
    season:     knowledge.season,
    notes: [
      ...knowledge.notes.top,
      ...knowledge.notes.heart,
      ...knowledge.notes.base,
    ],
    bestSeller: knowledge.bestSeller,
    newArrival: knowledge.newArrival,
    prices:     knowledge.prices,
    images:     knowledge.images,
  };
}
