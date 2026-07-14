/**
 * Knowledge Intelligence Engine — Knowledge Insights
 *
 * Canonical aggregate intelligence object for a single fragrance.
 * The richest object in the intelligence layer — product detail pages
 * and deep concierge contexts are the primary consumers.
 *
 * KnowledgeInsights composes all other intelligence modules into a single
 * typed interface. It performs no scoring and owns no business logic.
 *
 * Integration points:
 *   KnowledgeSummary       — lightweight identity + quality fields
 *   KnowledgeRelationships — graph traversal data
 *   KnowledgeDiscovery     — discovery readiness, similar fragrances, academy
 *   KnowledgeQuality       — full quality profile
 *   FragranceKnowledge     — raw record for consumers that need it
 */

import type { FragranceKnowledge }      from "../mkc/types";
import type { KnowledgeQualityProfile } from "../mkc/knowledgeQuality";
import { getKnowledgeQuality }          from "../mkc/knowledgeQuality";
import { buildKnowledgeSummary, type KnowledgeSummary }         from "./KnowledgeSummary";
import { buildKnowledgeRelationships, type KnowledgeRelationships } from "./KnowledgeRelationships";
import { buildKnowledgeDiscovery, type KnowledgeDiscovery }         from "./KnowledgeDiscovery";

// ── Public types ──────────────────────────────────────────────────────────────

export interface KnowledgeInsights {
  /** Canonical slug — primary key for all lookups. */
  readonly slug:          string;
  /** Raw MKC record. Exposed for consumers that need fields not in summary. */
  readonly record:        Readonly<FragranceKnowledge>;
  /** Lightweight projection for rendering identity, pricing, and quality tier. */
  readonly summary:       KnowledgeSummary;
  /** Relationship graph data: alternatives, wardrobe partners, evolutions. */
  readonly relationships: KnowledgeRelationships;
  /** Discovery readiness, similar fragrances, occasions, academy articles. */
  readonly discovery:     KnowledgeDiscovery;
  /** Full quality profile — all six dimensions + tier + convenience flags. */
  readonly quality:       KnowledgeQualityProfile | null;
}

// ── Factory ───────────────────────────────────────────────────────────────────

export function buildKnowledgeInsights(record: FragranceKnowledge): KnowledgeInsights {
  return {
    slug:          record.slug,
    record,
    summary:       buildKnowledgeSummary(record),
    relationships: buildKnowledgeRelationships(record),
    discovery:     buildKnowledgeDiscovery(record),
    quality:       getKnowledgeQuality(record.slug) ?? null,
  };
}
