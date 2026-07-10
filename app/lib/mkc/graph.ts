/**
 * Maison Knowledge Catalogue — Relationship Graph Services
 *
 * Pure service layer for traversing the Fragrance Relationship Graph.
 *
 * Relationship data belongs to native records (app/lib/mkc/native/).
 * Relationship traversal belongs to this module.
 *
 * Services operate on a FragranceIndex — a slug-to-record map built once
 * by the consumer. No global state. No singleton. No catalogue imports.
 * Consumers own the lifecycle of the index.
 *
 * Usage:
 *   import { mkcCatalogue }                       from "@/app/lib/mkc/catalogue";
 *   import { buildIndex, getRelationshipSummary } from "@/app/lib/mkc/graph";
 *
 *   const index   = buildIndex(mkcCatalogue);
 *   const summary = getRelationshipSummary(record, index);
 *
 * getRelationshipSummary() is the preferred consumer entry point for
 * Concierge and product page contexts. Individual service functions are
 * available for narrower queries.
 *
 * NOT imported by the Next.js application in this sprint. Future consumers:
 *   EP21-P4 — Concierge Graph Integration
 *   EP21-P5 — Wardrobe Graph Analysis
 *   EP21-P6 — Similarity Graph Services
 *   EP21-P7 — Relationship Explorer UI
 */

import type { FragranceKnowledge } from "./types";

// ── Public types ──────────────────────────────────────────────────────────────

/** Slug-to-record map. Build once per consumer via buildIndex(). */
export type FragranceIndex = ReadonlyMap<string, FragranceKnowledge>;

/**
 * Structured summary of all relationship types for a fragrance record.
 * Preferred return type for consumers that need full relationship context.
 */
export interface RelationshipSummary {
  /** True when any relationship type has at least one connected record. */
  hasRelationships: boolean;
  /** Direct predecessor in this fragrance line, or null. */
  evolutionOf:      FragranceKnowledge | null;
  /** Fragrances that evolved FROM this record. */
  evolutions:       FragranceKnowledge[];
  /** Comparable alternatives for customers with different preferences. */
  alternatives:     FragranceKnowledge[];
  /** Fragrances recommended to own alongside this record. */
  wardrobePartners: FragranceKnowledge[];
  /** All connected records, deduplicated, ordered: ancestor → descendants → alternatives → partners. */
  connected:        FragranceKnowledge[];
  /** Total count of unique connected records across all relationship types. */
  totalConnections: number;
}

// ── Index factory ─────────────────────────────────────────────────────────────

/**
 * Builds a slug-indexed record map from a FragranceKnowledge array.
 *
 * Call once per consumer; reuse the result for all graph service calls.
 * Building the index is O(n); each service call is then O(1) per slug lookup.
 */
export function buildIndex(
  records: FragranceKnowledge[]
): Map<string, FragranceKnowledge> {
  return new Map(records.map(r => [r.slug, r]));
}

// ── Internal helpers ──────────────────────────────────────────────────────────

function resolveSlugs(
  slugs: string[] | undefined,
  index: FragranceIndex
): FragranceKnowledge[] {
  if (!slugs || slugs.length === 0) return [];
  const results: FragranceKnowledge[] = [];
  for (const slug of slugs) {
    const r = index.get(slug);
    if (r) results.push(r);
  }
  return results;
}

// ── Graph services ────────────────────────────────────────────────────────────

/**
 * Returns the direct predecessor of this fragrance in its evolution line,
 * or null if no evolutionOf relationship is defined or the slug does not
 * resolve in the provided index.
 */
export function getEvolution(
  record: FragranceKnowledge,
  index: FragranceIndex
): FragranceKnowledge | null {
  const slug = record.relationships?.evolutionOf;
  if (!slug) return null;
  return index.get(slug) ?? null;
}

/**
 * Returns the full ancestor chain for this fragrance, ordered from the
 * oldest ancestor to the immediate predecessor. Does not include the record
 * itself.
 *
 * Traversal terminates when no further evolutionOf exists, when a slug
 * does not resolve in the index, or when a visited slug is encountered
 * (circular reference guard). Safe to call on any record including those
 * with no relationships.
 *
 * Example: Sauvage Elixir → [Sauvage Inspired]
 * Example: Sauvage Inspired → []
 */
export function getEvolutionChain(
  record: FragranceKnowledge,
  index: FragranceIndex
): FragranceKnowledge[] {
  const chain: FragranceKnowledge[] = [];
  const visited = new Set<string>([record.slug]);
  let current = record;

  while (current.relationships?.evolutionOf) {
    const slug = current.relationships.evolutionOf;
    if (visited.has(slug)) break; // circular reference guard
    const ancestor = index.get(slug);
    if (!ancestor) break;         // unresolved slug — degrade gracefully
    chain.unshift(ancestor);      // prepend so oldest ancestor is first
    visited.add(slug);
    current = ancestor;
  }

  return chain;
}

/**
 * Returns all fragrance records that evolved FROM this record.
 * Returns [] when no evolutions are defined or no slugs resolve.
 */
export function getEvolutions(
  record: FragranceKnowledge,
  index: FragranceIndex
): FragranceKnowledge[] {
  return resolveSlugs(record.relationships?.evolutions, index);
}

/**
 * Returns all fragrance records that serve as alternatives to this record —
 * comparable fragrances that serve a similar role via a different route.
 * Returns [] when no alternatives are defined or no slugs resolve.
 */
export function getAlternatives(
  record: FragranceKnowledge,
  index: FragranceIndex
): FragranceKnowledge[] {
  return resolveSlugs(record.relationships?.alternatives, index);
}

/**
 * Returns all fragrance records recommended to own alongside this record.
 * Returns [] when no wardrobe partners are defined or no slugs resolve.
 */
export function getWardrobePartners(
  record: FragranceKnowledge,
  index: FragranceIndex
): FragranceKnowledge[] {
  return resolveSlugs(record.relationships?.wardrobePartners, index);
}

/**
 * Returns all fragrance records connected to this record by any relationship
 * type, deduplicated by slug. Ordering: ancestor → descendants → alternatives
 * → wardrobe partners.
 *
 * Returns [] for records with no relationships field.
 */
export function getConnectedFragrances(
  record: FragranceKnowledge,
  index: FragranceIndex
): FragranceKnowledge[] {
  const rel = record.relationships;
  if (!rel) return [];

  const seen = new Set<string>();
  const result: FragranceKnowledge[] = [];

  const orderedSlugs: string[] = [
    ...(rel.evolutionOf      ? [rel.evolutionOf]    : []),
    ...(rel.evolutions       ?? []),
    ...(rel.alternatives     ?? []),
    ...(rel.wardrobePartners ?? []),
  ];

  for (const slug of orderedSlugs) {
    if (!seen.has(slug)) {
      const r = index.get(slug);
      if (r) {
        seen.add(slug);
        result.push(r);
      }
    }
  }

  return result;
}

/**
 * Returns a structured summary of all relationship types for a record.
 *
 * This is the preferred consumer entry point. Concierge, product pages,
 * and wardrobe analysis should call this rather than composing individual
 * graph functions, unless a narrower query is needed.
 *
 * All fields return typed, non-undefined values. Records with no
 * relationships field return a summary with hasRelationships: false and
 * empty collections.
 */
export function getRelationshipSummary(
  record: FragranceKnowledge,
  index: FragranceIndex
): RelationshipSummary {
  const evolutionOf      = getEvolution(record, index);
  const evolutions       = getEvolutions(record, index);
  const alternatives     = getAlternatives(record, index);
  const wardrobePartners = getWardrobePartners(record, index);
  const connected        = getConnectedFragrances(record, index);

  return {
    hasRelationships: connected.length > 0,
    evolutionOf,
    evolutions,
    alternatives,
    wardrobePartners,
    connected,
    totalConnections: connected.length,
  };
}
