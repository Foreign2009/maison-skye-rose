/**
 * Recommendation Intelligence — Explanation Templates
 *
 * Rule-based text templates for every RecommendationReasonType.
 * All templates are deterministic — same inputs produce the same output.
 * No LLMs, no AI prompts.
 *
 * Each template is a function accepting an optional context string (e.g.
 * a family name, fragrance name, or collection name) and returning a
 * human-readable sentence. Templates degrade gracefully when no context
 * is supplied.
 *
 * Integration points:
 *   RecommendationReasonBuilder — sole consumer; calls templates per matched signal
 *   RecommendationReasonType    — template record is keyed by reason type
 */

import type { RecommendationReasonType } from "./RecommendationReason";

export type TemplateFn = (context?: string) => string;

export const EXPLANATION_TEMPLATES: Readonly<Record<RecommendationReasonType, TemplateFn>> = {
  family_match:       (f)  => f  ? `Matches your interest in ${f} fragrances`                    : "Matches your fragrance family preferences",
  occasion_match:     (o)  => o  ? `Suited for ${o} occasions you've explored`                   : "Matches occasions you prefer",
  season_match:       (s)  => s  ? `Works well in ${s}, a season you favour`                     : "Suits your preferred seasons",
  similar_to_viewed:  (n)  => n  ? `Similar to ${n}, which you recently viewed`                  : "Similar to fragrances you've browsed",
  similar_to_saved:   (n)  => n  ? `Similar to ${n}, which you've saved`                         : "Similar to fragrances you've saved",
  wardrobe_partner:   (n)  => n  ? `A natural wardrobe companion to ${n}`                        : "Complements your saved fragrances",
  quiz_match:         ()   =>      "Aligns with your fragrance quiz results",
  collection_affinity:(c)  => c  ? `From the ${c} collection, which matches your preferences`   : "From a collection that suits your profile",
  discovery_pathway:  ()   =>      "A new direction that complements your taste",
  popularity:         ()   =>      "A customer favourite in our catalogue",
  relationship_graph: ()   =>      "Connected to fragrances in your collection",
};
