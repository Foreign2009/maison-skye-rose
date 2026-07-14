/**
 * Knowledge Intelligence Engine — Knowledge Summary
 *
 * Lightweight, immutable projection of a FragranceKnowledge record,
 * suitable for cards, previews, lists, and any surface that does not
 * require the full FragranceInsights object.
 *
 * KnowledgeSummary is always derived from the canonical FragranceKnowledge
 * record and never stores redundant computed values. Consumers that need
 * deep intelligence should use getKnowledgeInsights() instead.
 *
 * Integration points:
 *   FragranceKnowledge  — source of truth for all fields
 *   KnowledgeQuality    — quality tier and discovery readiness score
 *   Merchandising       — lifestyle bullet points
 */

import type { FragranceKnowledge } from "../mkc/types";
import type { KnowledgeQualityTier } from "../mkc/knowledgeQuality";
import { getKnowledgeQuality } from "../mkc/knowledgeQuality";
import { generateWhyYoullLikeIt } from "../mkc/merchandising";

// ── Public types ──────────────────────────────────────────────────────────────

export interface KnowledgeSummary {
  readonly slug:             string;
  readonly name:             string;
  readonly collection:       "Skye" | "Rose" | "Elite";
  readonly subtitle:         string | null;
  readonly description:      string | null;
  readonly scentCharacter:   string;
  readonly projection:       "soft" | "moderate" | "strong";
  readonly family:           readonly string[];
  readonly occasions:        readonly string[];
  readonly seasons:          readonly string[];
  readonly vibe:             readonly string[];
  readonly gender:           "male" | "female" | "unisex";
  readonly bestSeller:       boolean;
  readonly newArrival:       boolean;
  readonly featured:         boolean;
  readonly isNative:         boolean;
  readonly qualityTier:      KnowledgeQualityTier | null;
  readonly discoveryReadiness: number;
  readonly hasRelationships: boolean;
  readonly prices:           Readonly<{ "5ml": number; "10ml": number; "30ml": number }>;
  readonly images:           Readonly<{ "5ml": string; "10ml": string; "30ml": string }>;
  readonly whyYoullLikeIt:  readonly [string, string, string];
}

// ── Factory ───────────────────────────────────────────────────────────────────

export function buildKnowledgeSummary(record: FragranceKnowledge): KnowledgeSummary {
  const quality = getKnowledgeQuality(record.slug);
  return {
    slug:               record.slug,
    name:               record.name,
    collection:         record.collection,
    subtitle:           record.subtitle ?? null,
    description:        record.description ?? null,
    scentCharacter:     record.scentCharacter,
    projection:         record.projection,
    family:             record.family,
    occasions:          record.occasions,
    seasons:            record.seasons,
    vibe:               record.vibe,
    gender:             record.gender,
    bestSeller:         record.bestSeller,
    newArrival:         record.newArrival,
    featured:           record.featured ?? false,
    isNative:           record.catalogVersion !== undefined,
    qualityTier:        quality?.tier ?? null,
    discoveryReadiness: quality?.discoveryReadiness ?? 0,
    hasRelationships:   quality?.hasRelationships ?? false,
    prices:             record.prices,
    images:             record.images,
    whyYoullLikeIt:     generateWhyYoullLikeIt(record),
  };
}
