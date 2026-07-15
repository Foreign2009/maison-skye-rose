/**
 * Recommendation Intelligence — Relationship Scorer
 *
 * Computes the relation dimension score for a recommendation candidate.
 * Score range: 0–1. Zero when no currentSlug is provided or no graph
 * connections exist between the pivot and candidate.
 *
 * Signal sources:
 *   currentSlug — the fragrance currently on-screen; acts as the graph pivot
 *   profile.savedSlugs     — saved fragrances used as secondary pivots
 *   profile.recentlyViewed — viewed fragrances used as tertiary pivots
 *
 * Scoring formula (additive, clamped to 1.0):
 *   wardrobe partner of currentSlug — +0.55 (strongest relation signal)
 *   alternative of currentSlug      — +0.45
 *   evolution of / from currentSlug — +0.35
 *   any graph connection currentSlug — +0.20
 *   wardrobe partner of saved slug  — +0.25 per slug, max 0.40
 *   any connection to saved slug    — +0.10 per slug, max 0.20
 *   any connection to viewed slug   — +0.05 per slug, max 0.10
 *
 * ConnectionSets is computed once per recommend() call and passed to
 * scoreRelation() for each candidate — no redundant index traversals.
 *
 * Module-level graph index: O(n) once at startup, O(1) per lookup.
 *
 * Integration points:
 *   WeightedRecommendationScorer — calls buildConnectionSets() + scoreRelation()
 *   RecommendationReasonBuilder  — calls buildConnectionSets() for reason derivation
 *   mkcCatalogue / graph.ts      — source for relationship traversal
 */

import { mkcCatalogue }          from "../../mkc/catalogue";
import { buildIndex, getConnectedFragrances, getWardrobePartners, getAlternatives } from "../../mkc/graph";
import type { FragranceIndex }   from "../../mkc/graph";
import type { RecommendationCandidate } from "./RecommendationCandidate";
import type { RecommendationContext }   from "./RecommendationContext";

// ── Module-level graph index (O(n) once) ──────────────────────────────────────

const GRAPH_INDEX: FragranceIndex = buildIndex(mkcCatalogue as any);

// ── Connection set types ──────────────────────────────────────────────────────

export interface ConnectionSets {
  readonly wardrobeOfPivot:    ReadonlySet<string>;
  readonly alternativesOfPivot: ReadonlySet<string>;
  readonly allConnectedPivot:  ReadonlySet<string>;
  readonly wardrobeOfSaved:    ReadonlySet<string>;
  readonly allConnectedSaved:  ReadonlySet<string>;
  readonly allConnectedViewed: ReadonlySet<string>;
  readonly hasPivot:           boolean;
}

function toSlugs(records: { slug: string }[]): Set<string> {
  return new Set(records.map((r) => r.slug));
}

function unionSlugs(slugs: readonly string[], getConnected: (slug: string) => Set<string>): Set<string> {
  const result = new Set<string>();
  for (const slug of slugs) {
    for (const s of getConnected(slug)) result.add(s);
  }
  return result;
}

// ── Public API ────────────────────────────────────────────────────────────────

export function buildConnectionSets(context: RecommendationContext): ConnectionSets {
  const { profile, currentSlug } = context;
  const hasPivot = currentSlug !== undefined;

  const pivotRecord = currentSlug ? GRAPH_INDEX.get(currentSlug) : undefined;

  const wardrobeOfPivot = pivotRecord
    ? toSlugs(getWardrobePartners(pivotRecord, GRAPH_INDEX))
    : new Set<string>();

  const alternativesOfPivot = pivotRecord
    ? toSlugs(getAlternatives(pivotRecord, GRAPH_INDEX))
    : new Set<string>();

  const allConnectedPivot = pivotRecord
    ? toSlugs(getConnectedFragrances(pivotRecord, GRAPH_INDEX))
    : new Set<string>();

  const wardrobeOfSaved = unionSlugs(profile.savedSlugs, (slug) => {
    const r = GRAPH_INDEX.get(slug);
    return r ? toSlugs(getWardrobePartners(r, GRAPH_INDEX)) : new Set();
  });

  const allConnectedSaved = unionSlugs(profile.savedSlugs, (slug) => {
    const r = GRAPH_INDEX.get(slug);
    return r ? toSlugs(getConnectedFragrances(r, GRAPH_INDEX)) : new Set();
  });

  const allConnectedViewed = unionSlugs(profile.recentlyViewed, (slug) => {
    const r = GRAPH_INDEX.get(slug);
    return r ? toSlugs(getConnectedFragrances(r, GRAPH_INDEX)) : new Set();
  });

  return {
    wardrobeOfPivot,
    alternativesOfPivot,
    allConnectedPivot,
    wardrobeOfSaved,
    allConnectedSaved,
    allConnectedViewed,
    hasPivot,
  };
}

export function scoreRelation(
  candidate:      RecommendationCandidate,
  connectionSets: ConnectionSets,
): number {
  const { slug } = candidate;
  let score = 0;

  if (connectionSets.hasPivot) {
    if (connectionSets.wardrobeOfPivot.has(slug))    score += 0.55;
    else if (connectionSets.alternativesOfPivot.has(slug)) score += 0.45;
    else if (connectionSets.allConnectedPivot.has(slug))   score += 0.20;
  }

  // Saved slug connections (secondary pivots, max 0.40 wardrobe / 0.20 general)
  let savedWardrobeCredit = 0;
  let savedConnectionCredit = 0;
  if (connectionSets.wardrobeOfSaved.has(slug))    savedWardrobeCredit    = Math.min(savedWardrobeCredit    + 0.25, 0.40);
  if (connectionSets.allConnectedSaved.has(slug))  savedConnectionCredit  = Math.min(savedConnectionCredit  + 0.10, 0.20);
  score += savedWardrobeCredit + savedConnectionCredit;

  // Viewed slug connections (tertiary pivots, max 0.10)
  if (connectionSets.allConnectedViewed.has(slug)) score += Math.min(0.05, 0.10);

  return Math.min(score, 1.0);
}

export { GRAPH_INDEX };
