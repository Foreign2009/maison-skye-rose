/**
 * Maison Knowledge Catalogue — Knowledge Quality Intelligence
 *
 * Measures the REPOSITORY RICHNESS of each FragranceKnowledge record.
 *
 * IMPORTANT DISTINCTION
 * ─────────────────────
 * Knowledge Quality profiles describe how completely a record has been
 * authored in the MKC. They are repository maturity signals — NOT a measure
 * of how good or desirable a fragrance is. A "minimal" tier record may be an
 * excellent fragrance that has not yet received a full native authoring pass.
 *
 * Six richness dimensions are scored independently:
 *
 *   editorialCompleteness  — subtitle, description, signatureStyle, recommendedFor
 *   educationalRichness    — Academy articles, tags, learning path, categories
 *   relationshipRichness   — authored relationship connections in the graph
 *   discoveryReadiness     — vibe breadth, occasion depth, season coverage
 *   compositionDepth       — note pyramid note count beyond the minimum baseline
 *   commerceCompleteness   — price points and product image presence
 *
 * Consumers should prefer individual dimensions over overallScore wherever
 * they have a specific richness concern:
 *
 *   Discovery pages     → discoveryReadiness
 *   Concierge engine    → educationalRichness
 *   Product pages       → relationshipRichness
 *   Admin / reporting   → overallScore
 *
 * ARCHITECTURE OWNERSHIP
 * ──────────────────────
 *   FragranceKnowledge
 *          ↓
 *       Validator          (structural correctness — validator.ts)
 *          ↓
 *   Relationship Graph     (graph traversal — graph.ts)
 *          ↓
 *   Knowledge Quality      (repository richness — this module)
 *          ↓
 *      Consumers
 *
 * This module performs no validation and owns no fragrance content.
 * MKC remains the sole source of truth.
 *
 * PERFORMANCE
 * ───────────
 * MKC_INDEX is built once at module initialisation (O(n)).
 * QUALITY_MAP is computed once at module initialisation (O(n)).
 * All consumer lookups via getKnowledgeQuality() are O(1).
 * No per-render recalculation.
 *
 * FUTURE EVOLUTION (documented only — not in scope for EP25-P1)
 * ─────────────────────────────────────────────────────────────
 *   • Editorial review status (reviewed / draft / pending)
 *   • AI enrichment readiness flag (fields available for enrichment)
 *   • Localisation readiness (translatable fields present / absent)
 *   • Authoring confidence score (editorial team signal)
 *   • Review workflow integration (last-reviewed date, reviewer slug)
 *
 * EP25-P1 foundation.
 */

import { mkcCatalogue }                      from "./catalogue";
import { buildIndex, getRelationshipSummary } from "./graph";
import type { FragranceKnowledge }            from "./types";

// ── Public types ───────────────────────────────────────────────────────────────

/**
 * Repository maturity tier derived from the weighted overall score.
 *
 * Tiers reflect authoring completeness, not fragrance desirability.
 *
 *   rich     → overallScore ≥ 0.80 — fully authored, with relationships
 *   standard → overallScore ≥ 0.40 — fully authored, without relationships
 *   minimal  → overallScore < 0.40 — adapter-derived data only
 *
 * IMPORTANT: isNative ≠ rich. Tier is always computed from scored dimensions.
 * It is never inferred from catalogVersion. Future adapter improvements can
 * achieve higher tiers without any architectural changes to this module.
 */
export type KnowledgeQualityTier = "rich" | "standard" | "minimal";

/**
 * Repository richness profile for a single FragranceKnowledge record.
 *
 * Individual dimensions are the canonical outputs of this profile.
 * overallScore is a convenience metric for consumers that need a single
 * summary signal (e.g. admin dashboards). Prefer individual dimensions
 * whenever the consumer has a specific richness concern.
 */
export interface KnowledgeQualityProfile {
  // ── Scored dimensions (0.0–1.0 each) ────────────────────────────────────────
  /** subtitle + description + signatureStyle depth + recommendedFor depth */
  editorialCompleteness: number;
  /** Academy article IDs + education tags + learning path + Academy categories */
  educationalRichness:   number;
  /** Authored relationship connections via the Fragrance Relationship Graph */
  relationshipRichness:  number;
  /** Vibe breadth + occasion depth + season coverage */
  discoveryReadiness:    number;
  /** Note pyramid note count beyond the six-note minimum baseline */
  compositionDepth:      number;
  /** Price point presence + product image path presence */
  commerceCompleteness:  number;

  // ── Derived summary ──────────────────────────────────────────────────────────
  /**
   * Weighted average of all six dimensions.
   * Weights: editorial 25% · educational 25% · relationships 20% ·
   *          discovery 15% · composition 10% · commerce 5%.
   *
   * This is a convenience metric. Prefer individual dimensions when possible.
   */
  overallScore: number;
  /** Maturity tier derived from overallScore. Never inferred from isNative. */
  tier:         KnowledgeQualityTier;

  // ── Convenience flags ────────────────────────────────────────────────────────
  /**
   * True when catalogVersion is defined.
   *
   * isNative ≠ rich. Tier is always computed. A record can be native and
   * still score standard (no authored relationships). Future adapter
   * improvements may reach rich tier without being native.
   */
  isNative:              boolean;
  /** True when academyArticleIds is present and non-empty. */
  hasAcademyIntegration: boolean;
  /** True when at least one relationship connection is authored. */
  hasRelationships:      boolean;
  /** Total unique connections from all relationship types. */
  totalConnections:      number;
  /** Sum of top + heart + base note counts. */
  notePyramidDepth:      number;
}

// ── Scoring constants ──────────────────────────────────────────────────────────

const DIMENSION_WEIGHTS = {
  editorial:    0.25,
  educational:  0.25,
  relationship: 0.20,
  discovery:    0.15,
  composition:  0.10,
  commerce:     0.05,
} as const;

const TIER_THRESHOLDS = {
  rich:     0.80,
  standard: 0.40,
} as const;

// ── Dimension scorers (each returns 0.0–1.0) ──────────────────────────────────

function scoreEditorial(r: FragranceKnowledge): number {
  let score = 0;
  if (r.description)                        score += 0.50; // authored description — native only
  if (r.subtitle)                           score += 0.20;
  if ((r.signatureStyle?.length ?? 0) >= 2) score += 0.15;
  if ((r.recommendedFor?.length  ?? 0) >= 2) score += 0.15;
  return score;
}

function scoreEducational(r: FragranceKnowledge): number {
  let score = 0;
  if ((r.academyArticleIds?.length ?? 0) > 0) score += 0.40;
  if ((r.educationTags?.length     ?? 0) > 0) score += 0.30;
  if ((r.learningPath?.length      ?? 0) > 0) score += 0.20;
  if ((r.academyCategories?.length ?? 0) > 0) score += 0.10;
  return score;
}

function scoreRelationship(totalConnections: number): number {
  if (totalConnections >= 2) return 1.00;
  if (totalConnections === 1) return 0.50;
  return 0;
}

function scoreDiscovery(r: FragranceKnowledge): number {
  let score = 0;
  if ((r.vibe?.length     ?? 0) >= 3) score += 0.40;
  if ((r.occasions?.length ?? 0) >= 2) score += 0.30;
  if ((r.seasons?.length   ?? 0) >= 2) score += 0.30;
  return score;
}

function scoreComposition(r: FragranceKnowledge): number {
  const total = (r.notes.top?.length ?? 0)
              + (r.notes.heart?.length ?? 0)
              + (r.notes.base?.length ?? 0);
  // Linear scale: 6 notes (minimum) → 0.0, 12+ notes → 1.0
  return Math.min(Math.max((total - 6) / 6, 0), 1);
}

function scoreCommerce(r: FragranceKnowledge): number {
  let score = 0;
  const p = r.prices;
  if (p?.["5ml"] > 0 && p["10ml"] > 0 && p["30ml"] > 0) score += 0.50;
  const i = r.images;
  if (i?.["5ml"] && i["10ml"] && i["30ml"]) score += 0.50;
  return score;
}

function deriveTier(overallScore: number): KnowledgeQualityTier {
  if (overallScore >= TIER_THRESHOLDS.rich)     return "rich";
  if (overallScore >= TIER_THRESHOLDS.standard) return "standard";
  return "minimal";
}

// ── Profile computation ────────────────────────────────────────────────────────

function computeQualityProfile(
  record: FragranceKnowledge,
): KnowledgeQualityProfile {
  const summary = getRelationshipSummary(record, MKC_INDEX);

  const editorialCompleteness = scoreEditorial(record);
  const educationalRichness   = scoreEducational(record);
  const relationshipRichness  = scoreRelationship(summary.totalConnections);
  const discoveryReadiness    = scoreDiscovery(record);
  const compositionDepth      = scoreComposition(record);
  const commerceCompleteness  = scoreCommerce(record);

  const overallScore =
    editorialCompleteness * DIMENSION_WEIGHTS.editorial    +
    educationalRichness   * DIMENSION_WEIGHTS.educational  +
    relationshipRichness  * DIMENSION_WEIGHTS.relationship +
    discoveryReadiness    * DIMENSION_WEIGHTS.discovery    +
    compositionDepth      * DIMENSION_WEIGHTS.composition  +
    commerceCompleteness  * DIMENSION_WEIGHTS.commerce;

  return {
    editorialCompleteness,
    educationalRichness,
    relationshipRichness,
    discoveryReadiness,
    compositionDepth,
    commerceCompleteness,
    overallScore:          Math.round(overallScore * 1000) / 1000,
    tier:                  deriveTier(overallScore),
    isNative:              record.catalogVersion !== undefined,
    hasAcademyIntegration: (record.academyArticleIds?.length ?? 0) > 0,
    hasRelationships:      summary.hasRelationships,
    totalConnections:      summary.totalConnections,
    notePyramidDepth:      (record.notes.top?.length ?? 0)
                         + (record.notes.heart?.length ?? 0)
                         + (record.notes.base?.length ?? 0),
  };
}

// ── Module-level precomputation ────────────────────────────────────────────────
// MKC_INDEX built once (O(n)). QUALITY_MAP computed once (O(n)).
// All getKnowledgeQuality() calls are O(1) thereafter.

const MKC_INDEX = buildIndex(mkcCatalogue);

const QUALITY_MAP = new Map<string, KnowledgeQualityProfile>(
  mkcCatalogue.map((record) => [record.slug, computeQualityProfile(record)])
);

// ── Public API ─────────────────────────────────────────────────────────────────

/**
 * Returns the precomputed KnowledgeQualityProfile for a fragrance slug,
 * or undefined if the slug is not found in the catalogue.
 *
 * O(1) lookup. Safe to call from any server or client context.
 */
export function getKnowledgeQuality(slug: string): KnowledgeQualityProfile | undefined {
  return QUALITY_MAP.get(slug);
}

/**
 * Returns all precomputed profiles, keyed by slug.
 *
 * Intended for admin tooling and reporting consumers that need the full
 * distribution. Discovery and product page consumers should use
 * getKnowledgeQuality() for single-record lookups.
 */
export function getAllQualityProfiles(): ReadonlyMap<string, KnowledgeQualityProfile> {
  return QUALITY_MAP;
}
