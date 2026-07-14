/**
 * Knowledge Intelligence Engine — Public Exports
 *
 * Single import point for all intelligence layer consumers.
 *
 * Functions (import from KnowledgeIntelligence):
 *   getKnowledgeInsights(slug)           — full aggregate per-fragrance intelligence
 *   getKnowledgeSummary(slug)            — lightweight card/preview projection
 *   getRelatedKnowledge(slug)            — relationship graph data
 *   getDiscoveryJourney(slug)            — discovery readiness + similar + academy
 *   getCollectionInsights(collection)    — collection-level intelligence + metrics
 *   getKnowledgeRecommendations(options) — quiz recommendation results
 *   getRepositoryMetrics()               — repository-wide metrics
 *   getAllKnowledgeSummaries()           — all summaries (list views, sitemap)
 *   getAllCollections()                  — all three collection insights
 *
 * Types (import from the specialist module or re-exported here):
 *   KnowledgeInsights
 *   KnowledgeSummary
 *   KnowledgeRelationships
 *   KnowledgeDiscovery
 *   CollectionInsights
 *   MaisonCollection
 *   RecommendationOptions
 *   KnowledgeRecommendationResult
 *   KnowledgeMetrics
 */

// ── Functions ─────────────────────────────────────────────────────────────────

export {
  getKnowledgeInsights,
  getKnowledgeSummary,
  getRelatedKnowledge,
  getDiscoveryJourney,
  getCollectionInsights,
  getKnowledgeRecommendations,
  getKnowledgeMetrics,
  getAllKnowledgeSummaries,
  getAllCollections,
} from "./KnowledgeIntelligence";

// ── Types ─────────────────────────────────────────────────────────────────────

export type { KnowledgeInsights }              from "./KnowledgeInsights";
export type { KnowledgeSummary }               from "./KnowledgeSummary";
export type { KnowledgeRelationships }         from "./KnowledgeRelationships";
export type { KnowledgeDiscovery }             from "./KnowledgeDiscovery";
export type { CollectionInsights, MaisonCollection } from "./KnowledgeCollections";
export type { RecommendationOptions, KnowledgeRecommendationResult } from "./KnowledgeRecommendations";
export type { KnowledgeMetrics, DiscoveryReadinessDistribution }     from "./KnowledgeMetrics";
