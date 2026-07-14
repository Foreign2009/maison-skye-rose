/**
 * Knowledge Intelligence Engine — Knowledge Collections
 *
 * Collection-level intelligence and aggregate metrics for the three Maison
 * catalogue collections: Skye, Rose, Elite.
 *
 * Owns no aggregation logic — all character signals are read from
 * collectionIntelligence.ts. Quality metrics are read from getAllQualityProfiles().
 * This module composes existing results into the CollectionInsights interface.
 *
 * Integration points:
 *   collectionIntelligence.ts — getCollectionIntelligence() (topFamilies, occasions, seasons)
 *   KnowledgeQuality          — getAllQualityProfiles() for aggregate metrics
 *   catalogue.ts              — mkcCatalogue filtered by collection
 *   KnowledgeSummary          — projection for per-fragrance summaries
 */

import type { FragranceKnowledge }     from "../mkc/types";
import type { CollectionIntelligence } from "../mkc/collectionIntelligence";
import type { KnowledgeQualityTier }   from "../mkc/knowledgeQuality";
import { getCollectionIntelligence }   from "../mkc/collectionIntelligence";
import { getAllQualityProfiles }        from "../mkc/knowledgeQuality";
import { mkcCatalogue }                from "../mkc/catalogue";
import { buildKnowledgeSummary, type KnowledgeSummary } from "./KnowledgeSummary";

// ── Public types ──────────────────────────────────────────────────────────────

export type MaisonCollection = "Skye" | "Rose" | "Elite";

export interface CollectionInsights {
  readonly collection:          MaisonCollection;
  readonly fragranceCount:      number;
  readonly nativeCount:         number;
  /** Ratio of native records to total records in this collection (0.0–1.0). */
  readonly nativeCoverage:      number;
  /** Average overallScore across all quality profiles in this collection. */
  readonly averageQuality:      number;
  /** Count of records at each quality tier within this collection. */
  readonly tierDistribution:    Readonly<Record<KnowledgeQualityTier, number>>;
  /** Dominant families, occasions, and seasons derived from this collection. */
  readonly intelligence:        CollectionIntelligence;
  /** All fragrance summaries in this collection, ordered by popularity desc. */
  readonly fragrances:          readonly KnowledgeSummary[];
}

// ── Module-level precomputation ───────────────────────────────────────────────
// Built once at initialisation. All getCollectionInsights() calls are O(1).

const ALL_PROFILES = getAllQualityProfiles();

function buildCollectionInsights(collection: MaisonCollection): CollectionInsights {
  const records = mkcCatalogue
    .filter((r) => r.collection === collection)
    .sort((a, b) => b.popularity - a.popularity);

  const nativeCount = records.filter((r) => r.catalogVersion !== undefined).length;

  const tierDistribution: Record<KnowledgeQualityTier, number> = {
    rich:     0,
    standard: 0,
    minimal:  0,
  };
  let qualitySum = 0;
  let profileCount = 0;

  for (const r of records) {
    const profile = ALL_PROFILES.get(r.slug);
    if (profile) {
      tierDistribution[profile.tier]++;
      qualitySum += profile.overallScore;
      profileCount++;
    }
  }

  return {
    collection,
    fragranceCount:   records.length,
    nativeCount,
    nativeCoverage:   records.length > 0 ? nativeCount / records.length : 0,
    averageQuality:   profileCount > 0
                        ? Math.round((qualitySum / profileCount) * 1000) / 1000
                        : 0,
    tierDistribution,
    intelligence:     getCollectionIntelligence(collection),
    fragrances:       records.map(buildKnowledgeSummary),
  };
}

const COLLECTION_INSIGHTS_MAP = new Map<MaisonCollection, CollectionInsights>([
  ["Skye",  buildCollectionInsights("Skye")],
  ["Rose",  buildCollectionInsights("Rose")],
  ["Elite", buildCollectionInsights("Elite")],
]);

// ── Public API ────────────────────────────────────────────────────────────────

export function getCollectionInsightsData(
  collection: MaisonCollection,
): CollectionInsights {
  return COLLECTION_INSIGHTS_MAP.get(collection)!;
}

export function getAllCollectionInsights(): readonly CollectionInsights[] {
  return Array.from(COLLECTION_INSIGHTS_MAP.values());
}
