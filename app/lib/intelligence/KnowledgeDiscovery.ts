/**
 * Knowledge Intelligence Engine — Knowledge Discovery
 *
 * Aggregates discovery readiness, progression data, and discovery metadata
 * for a single fragrance into one canonical object.
 *
 * Owns no computation: all scores are read from KnowledgeQuality; all
 * similarity is delegated to similarityEngine; all academy content is
 * delegated to recommendAcademyArticles. This module composes, not calculates.
 *
 * Integration points:
 *   KnowledgeQuality          — discoveryReadiness score
 *   similarityEngine.ts       — getSimilarFragrances()
 *   recommendAcademyArticles  — academy article recommendations
 *   KnowledgeSummary          — projection for similar fragrances
 */

import type { FragranceKnowledge } from "../mkc/types";
import type { AcademyArticle }     from "../academy/types";
import { getKnowledgeQuality }     from "../mkc/knowledgeQuality";
import { getSimilarFragrances }    from "../discovery/similarityEngine";
import { recommendAcademyArticles } from "../academy/recommendAcademyArticles";
import { buildKnowledgeSummary, type KnowledgeSummary } from "./KnowledgeSummary";

// ── Public types ──────────────────────────────────────────────────────────────

export interface KnowledgeDiscovery {
  readonly slug:                string;
  readonly discoveryReadiness:  number;
  readonly vibe:                readonly string[];
  readonly occasions:           readonly string[];
  readonly seasons:             readonly string[];
  readonly signatureStyle:      readonly string[];
  readonly recommendedFor:      readonly string[];
  readonly similarFragrances:   readonly KnowledgeSummary[];
  readonly academyArticles:     readonly AcademyArticle[];
}

// ── Factory ───────────────────────────────────────────────────────────────────

export function buildKnowledgeDiscovery(
  record: FragranceKnowledge,
  similarCount:  number = 3,
  academyCount:  number = 4,
): KnowledgeDiscovery {
  const quality    = getKnowledgeQuality(record.slug);
  const similar    = getSimilarFragrances(record, { excludeSlug: record.slug, count: similarCount });
  const articles   = recommendAcademyArticles(record, academyCount);

  return {
    slug:               record.slug,
    discoveryReadiness: quality?.discoveryReadiness ?? 0,
    vibe:               record.vibe,
    occasions:          record.occasions,
    seasons:            record.seasons,
    signatureStyle:     record.signatureStyle,
    recommendedFor:     record.recommendedFor,
    similarFragrances:  similar.map((r) => buildKnowledgeSummary(r.fragrance)),
    academyArticles:    articles,
  };
}
