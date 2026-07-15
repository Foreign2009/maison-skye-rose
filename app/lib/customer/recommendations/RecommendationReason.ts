/**
 * Personalised Recommendation Engine — Recommendation Reason
 *
 * A single human-readable explanation for why a fragrance was recommended.
 * Reasons are produced by the RecommendationExplainer and attached to every
 * Recommendation in the result.
 *
 * All reasons carry a weight (0–1) representing their relative contribution
 * to the recommendation decision. Placeholder explainers emit weight 0.
 *
 * RecommendationReasonType governs which class of signal drove the reason:
 *   family_match       — shared fragrance family with profile preference
 *   occasion_match     — shared occasion with profile preference
 *   season_match       — shared season with profile preference
 *   similar_to_viewed  — similar to a recently viewed fragrance
 *   similar_to_saved   — similar to a saved fragrance
 *   wardrobe_partner   — graph-defined wardrobe partner
 *   quiz_match         — matches quiz result signal
 *   collection_affinity — customer shows affinity for this collection
 *   discovery_pathway  — connected via a guided discovery pathway
 *   popularity         — high popularity within the catalogue
 *   relationship_graph — general graph connection
 *
 * Integration points:
 *   Recommendation             — includes readonly RecommendationReason[]
 *   RecommendationCandidate    — staging slot before explanation
 *   RecommendationExplainer    — produces these from candidates + context
 */

export type RecommendationReasonType =
  | "family_match"
  | "occasion_match"
  | "season_match"
  | "similar_to_viewed"
  | "similar_to_saved"
  | "wardrobe_partner"
  | "quiz_match"
  | "collection_affinity"
  | "discovery_pathway"
  | "popularity"
  | "relationship_graph";

export interface RecommendationReason {
  readonly type:        RecommendationReasonType;
  readonly description: string;
  readonly weight:      number;
}
