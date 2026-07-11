/**
 * Maison Knowledge Catalogue — Collection Intelligence
 *
 * Derives collection-level character from existing MKC data via frequency
 * aggregation. Results reflect dominant tendencies across all records in a
 * collection, not absolute rules. As native record coverage increases,
 * the intelligence naturally becomes richer without any change to this module.
 *
 * MKC remains the sole source of truth.
 * Collection pages consume precomputed exports — no per-render catalogue scans.
 *
 * EP22-P4 foundation. Future extension points:
 *   - Representative native fragrances per collection
 *   - Collection editorial overviews
 *   - Academy article cross-references
 *   - Seasonal collection insights
 *   - Relationship-driven exploration
 */

import { mkcCatalogue } from "./catalogue";
import type { FragranceKnowledge } from "./types";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CollectionIntelligence {
  /** Top fragrance families by frequency across the collection. */
  topFamilies:  string[];
  /** Top occasions by frequency across the collection. */
  topOccasions: string[];
  /** Top season values by frequency across the collection. */
  topSeasons:   string[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function countFrequency(items: string[]): Map<string, number> {
  const freq = new Map<string, number>();
  for (const item of items) {
    freq.set(item, (freq.get(item) ?? 0) + 1);
  }
  return freq;
}

function topByFrequency(freq: Map<string, number>, limit: number): string[] {
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([item]) => item);
}

// ── Aggregation ───────────────────────────────────────────────────────────────

export function getCollectionIntelligence(
  collection: FragranceKnowledge["collection"]
): CollectionIntelligence {
  const records = mkcCatalogue.filter((k) => k.collection === collection);

  return {
    topFamilies:  topByFrequency(countFrequency(records.flatMap((r) => r.family)),   4),
    topOccasions: topByFrequency(countFrequency(records.flatMap((r) => r.occasions)), 4),
    topSeasons:   topByFrequency(countFrequency(records.map((r) => r.season)),        3),
  };
}

// ── Precomputed exports ───────────────────────────────────────────────────────
// Collection pages import these constants directly (Refinement 7).
// No per-render aggregation.

export const SKYE_INTELLIGENCE  = getCollectionIntelligence("Skye");
export const ROSE_INTELLIGENCE  = getCollectionIntelligence("Rose");
export const ELITE_INTELLIGENCE = getCollectionIntelligence("Elite");
