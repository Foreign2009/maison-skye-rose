/**
 * Knowledge Intelligence Engine — Knowledge Relationships
 *
 * Normalized, immutable relationship data derived from the Relationship Graph.
 * All graph traversal goes through graph.ts — this module adds no traversal logic.
 *
 * Returns KnowledgeSummary projections of related records rather than raw
 * FragranceKnowledge objects, ensuring consumers work with a consistent
 * lightweight type across the intelligence layer.
 *
 * Integration points:
 *   graph.ts            — getRelationshipSummary(), buildIndex()
 *   catalogue.ts        — source for the FragranceIndex
 *   KnowledgeSummary    — projection applied to all related records
 */

import type { FragranceKnowledge }    from "../mkc/types";
import { buildIndex, getRelationshipSummary } from "../mkc/graph";
import { mkcCatalogue }               from "../mkc/catalogue";
import { buildKnowledgeSummary, type KnowledgeSummary } from "./KnowledgeSummary";

// ── Module-level index (O(n) once, O(1) per lookup) ──────────────────────────

const CATALOGUE_INDEX = buildIndex(mkcCatalogue);

// ── Public types ──────────────────────────────────────────────────────────────

export interface KnowledgeRelationships {
  readonly slug:             string;
  readonly hasRelationships: boolean;
  readonly totalConnections: number;
  readonly evolutionOf:      KnowledgeSummary | null;
  readonly evolutions:       readonly KnowledgeSummary[];
  readonly alternatives:     readonly KnowledgeSummary[];
  readonly wardrobePartners: readonly KnowledgeSummary[];
  readonly allConnected:     readonly KnowledgeSummary[];
}

// ── Factory ───────────────────────────────────────────────────────────────────

function toSummaries(records: FragranceKnowledge[]): KnowledgeSummary[] {
  return records.map(buildKnowledgeSummary);
}

export function buildKnowledgeRelationships(
  record: FragranceKnowledge,
): KnowledgeRelationships {
  const summary = getRelationshipSummary(record, CATALOGUE_INDEX);
  return {
    slug:             record.slug,
    hasRelationships: summary.hasRelationships,
    totalConnections: summary.totalConnections,
    evolutionOf:      summary.evolutionOf ? buildKnowledgeSummary(summary.evolutionOf) : null,
    evolutions:       toSummaries(summary.evolutions),
    alternatives:     toSummaries(summary.alternatives),
    wardrobePartners: toSummaries(summary.wardrobePartners),
    allConnected:     toSummaries(summary.connected),
  };
}
