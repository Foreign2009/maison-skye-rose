/**
 * Maison Intelligence Layer — Discovery Graph
 *
 * Owns collection-to-collection navigation.
 *
 * Ownership boundary:
 *   Discovery Intelligence (discoveryIntelligence.ts) → collection character understanding
 *   This module                                       → collection-to-collection connections
 *
 * The Discovery Graph consumes CollectionProfile from Discovery Intelligence —
 * a single well-defined public representation — rather than reconstructing
 * collection intelligence independently (EP24-P3, Refinements 1 + 2).
 *
 * Scoring model (editorial heuristics, not mathematical truth):
 *   Shared top families   → +2 per match  (primary character signal)
 *   Shared top occasions  → +2 per match  (functional alignment)
 *   Shared specific season → +1 per match  (contextual affinity;
 *                            "All Season" excluded — too common to discriminate)
 *
 * Weights reflect editorial judgement: fragrance character and functional
 * occasion are the strongest indicators of journey adjacency. Seasonal
 * affinity is real but weaker because many collections are all-season.
 * Future tuning should be expected as collection coverage grows.
 *
 * EP24-P3 foundation. Future extension points:
 *   - Journey topic similarity weighting (topic overlap as a signal)
 *   - Representative fragrance graph overlap (cross-collection graph traversal)
 *   - Authored override connections (editorial curation overriding computed score)
 *   - Directed progression scoring (beginner → intermediate → advanced)
 */

import type { CollectionSpec }    from "./types";
import type { CollectionProfile } from "./discoveryIntelligence";
import { COLLECTION_SPECS }       from "./collectionEngine";
import { getCollectionProfile }   from "./discoveryIntelligence";

// ── Scoring ───────────────────────────────────────────────────────────────────
// Scores two collections by dimensional overlap using the editorial heuristics
// documented in the module header. Higher score = stronger journey adjacency.

function scoreConnection(
  profileA: CollectionProfile,
  profileB: CollectionProfile
): number {
  const familiesB  = new Set(profileB.dimensions.topFamilies);
  const occasionsB = new Set(profileB.dimensions.topOccasions);
  const seasonsB   = new Set(
    profileB.dimensions.topSeasons.filter((s) => s !== "All Season")
  );

  let score = 0;
  for (const f of profileA.dimensions.topFamilies)
    if (familiesB.has(f)) score += 2;
  for (const o of profileA.dimensions.topOccasions)
    if (occasionsB.has(o)) score += 2;
  for (const s of profileA.dimensions.topSeasons)
    if (s !== "All Season" && seasonsB.has(s)) score += 1;

  return score;
}

// ── Graph construction ────────────────────────────────────────────────────────

function computeConnectedCollections(id: string): CollectionSpec[] {
  const spec    = COLLECTION_SPECS.find((s) => s.id === id);
  // Editorial collections use authored relatedMomentIds — skip.
  if (!spec || spec.editorial) return [];

  const profile = getCollectionProfile(id);
  if (!profile) return [];

  return COLLECTION_SPECS
    .filter((other) => other.id !== id)
    .map((other) => {
      const otherProfile = getCollectionProfile(other.id);
      if (!otherProfile) return { spec: other, score: 0 };
      return { spec: other, score: scoreConnection(profile, otherProfile) };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map(({ spec: other }) => other);
}

// ── Precomputed connections map ───────────────────────────────────────────────
// Built once at module initialisation — O(1) page lookups thereafter.
// getCollectionProfile() is safe to call here: discoveryIntelligence.ts
// fully initialises (including PROFILE_MAP) before this module-level
// code executes, because Node resolves imports before running module bodies.

const CONNECTED_MAP = new Map<string, CollectionSpec[]>(
  COLLECTION_SPECS.map((spec) => [spec.id, computeConnectedCollections(spec.id)])
);

export function getConnectedCollections(id: string): CollectionSpec[] {
  return CONNECTED_MAP.get(id) ?? [];
}
