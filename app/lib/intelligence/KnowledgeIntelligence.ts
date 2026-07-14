/**
 * Knowledge Intelligence Engine — Orchestration Layer
 *
 * KnowledgeIntelligence is the canonical read layer for all future customer
 * experiences. No feature should query multiple intelligence systems directly —
 * everything flows through these functions.
 *
 * This module owns orchestration only. It delegates all computation to the
 * specialist modules in this directory. It performs no scoring, no aggregation,
 * and no business logic of its own.
 *
 * Architecture ownership:
 *   KnowledgeIntelligence  ← orchestration (this module)
 *   KnowledgeInsights      ← per-fragrance aggregate intelligence
 *   KnowledgeSummary       ← lightweight card/preview projection
 *   KnowledgeRelationships ← normalized relationship graph data
 *   KnowledgeDiscovery     ← discovery readiness, similar, academy
 *   KnowledgeCollections   ← collection-level intelligence + metrics
 *   KnowledgeRecommendations ← recommendation engine bridge
 *   KnowledgeMetrics       ← repository-wide intelligence metrics
 *
 * Integration points (consumed transitively via specialist modules):
 *   MKC Catalogue, Knowledge Quality, Relationship Graph,
 *   Collection Intelligence, Discovery Intelligence, Discovery Progression,
 *   Similarity Engine, Recommendation Engine, Academy Articles,
 *   Merchandising.
 */

import { mkcCatalogue }          from "../mkc/catalogue";
import { buildKnowledgeInsights, type KnowledgeInsights }               from "./KnowledgeInsights";
import { buildKnowledgeSummary, type KnowledgeSummary }                 from "./KnowledgeSummary";
import { buildKnowledgeRelationships, type KnowledgeRelationships }     from "./KnowledgeRelationships";
import { buildKnowledgeDiscovery, type KnowledgeDiscovery }             from "./KnowledgeDiscovery";
import { getCollectionInsightsData, getAllCollectionInsights, type CollectionInsights, type MaisonCollection } from "./KnowledgeCollections";
import { buildKnowledgeRecommendations, type RecommendationOptions, type KnowledgeRecommendationResult } from "./KnowledgeRecommendations";
import { getKnowledgeMetrics as _getKnowledgeMetrics, type KnowledgeMetrics } from "./KnowledgeMetrics";

// ── Module-level catalogue index (O(n) once) ──────────────────────────────────

const CATALOGUE_INDEX = new Map(mkcCatalogue.map((r) => [r.slug, r]));

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Returns the full aggregate intelligence object for a fragrance.
 * Includes quality profile, relationship graph, discovery data, and academy.
 * Primary consumer: product detail pages, concierge engine.
 */
export function getKnowledgeInsights(slug: string): KnowledgeInsights | null {
  const record = CATALOGUE_INDEX.get(slug);
  return record ? buildKnowledgeInsights(record) : null;
}

/**
 * Returns the lightweight summary projection for a fragrance.
 * Primary consumer: product cards, list views, search results.
 */
export function getKnowledgeSummary(slug: string): KnowledgeSummary | null {
  const record = CATALOGUE_INDEX.get(slug);
  return record ? buildKnowledgeSummary(record) : null;
}

/**
 * Returns normalized relationship data for a fragrance.
 * Alternatives, wardrobe partners, and evolutions as KnowledgeSummary objects.
 * Primary consumer: "You may also like" and "Complete your wardrobe" sections.
 */
export function getRelatedKnowledge(slug: string): KnowledgeRelationships | null {
  const record = CATALOGUE_INDEX.get(slug);
  return record ? buildKnowledgeRelationships(record) : null;
}

/**
 * Returns the discovery journey object for a fragrance.
 * Includes discovery readiness score, similar fragrances, and academy articles.
 * Primary consumer: discovery pages, quiz result pages.
 */
export function getDiscoveryJourney(slug: string): KnowledgeDiscovery | null {
  const record = CATALOGUE_INDEX.get(slug);
  return record ? buildKnowledgeDiscovery(record) : null;
}

/**
 * Returns collection-level intelligence and aggregate metrics.
 * Primary consumer: collection pages, navigation, admin reporting.
 */
export function getCollectionInsights(collection: MaisonCollection): CollectionInsights {
  return getCollectionInsightsData(collection);
}

/**
 * Returns recommendation results for a set of quiz answers, bridging the
 * Recommendation Engine into the Intelligence layer via KnowledgeSummary.
 * Primary consumer: fragrance quiz result pages.
 */
export function getKnowledgeRecommendations(
  options: RecommendationOptions,
): KnowledgeRecommendationResult {
  return buildKnowledgeRecommendations(options);
}

/**
 * Returns repository-wide intelligence metrics.
 * Primary consumer: admin dashboards, operational reporting.
 */
export function getKnowledgeMetrics(): KnowledgeMetrics {
  return _getKnowledgeMetrics();
}

// ── Catalogue convenience helpers ─────────────────────────────────────────────

/**
 * Returns KnowledgeSummary for every fragrance in the catalogue.
 * Useful for list views, search indexing, and sitemap generation.
 */
export function getAllKnowledgeSummaries(): readonly KnowledgeSummary[] {
  return mkcCatalogue.map(buildKnowledgeSummary);
}

/**
 * Returns CollectionInsights for all three Maison collections.
 */
export function getAllCollections(): readonly CollectionInsights[] {
  return getAllCollectionInsights();
}
