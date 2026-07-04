// TODO: Future Academy Search should reuse this scoring engine.

import type { FragranceKnowledge } from "../mkc/types";
import type { AcademyArticle } from "./types";
import { ARTICLE_REGISTRY, type ArticleRegistryEntry } from "./registry";
import { academyCatalogue } from "./catalogue";

// ── Scoring constants ─────────────────────────────────────────────────────────

const UNIVERSAL_SCORE = 30;          // Article is relevant regardless of fragrance type
const UNIVERSAL_FAMILY_SCORE = 20;   // Article covers all families (families = [])
const UNIVERSAL_OCCASION_SCORE = 15; // Article covers all occasions (occasions = [])
const FAMILY_MATCH_SCORE = 10;       // Per matched family between article and fragrance
const OCCASION_MATCH_SCORE = 10;     // Per matched occasion between article and fragrance
const SEASON_MATCH_SCORE = 15;       // Seasonal article matches a season-specific fragrance
const EXPLICIT_ARTICLE_SCORE = 50;   // Fragrance explicitly names this article in academyArticleIds

// ── Internal scorer ───────────────────────────────────────────────────────────

function scoreEntry(
  entry: ArticleRegistryEntry,
  knowledge: FragranceKnowledge
): number {
  let score = 0;

  if (entry.universalRelevance) {
    score += UNIVERSAL_SCORE;
  }

  if (entry.families.length === 0) {
    score += UNIVERSAL_FAMILY_SCORE;
  } else {
    for (const family of knowledge.family) {
      if (entry.families.includes(family)) {
        score += FAMILY_MATCH_SCORE;
      }
    }
  }

  if (entry.occasions.length === 0) {
    score += UNIVERSAL_OCCASION_SCORE;
  } else {
    const fragOccasions = knowledge.occasions.map((o) => o.toLowerCase());
    for (const articleOccasion of entry.occasions) {
      if (fragOccasions.includes(articleOccasion)) {
        score += OCCASION_MATCH_SCORE;
      }
    }
  }

  const isSeasonSpecific = knowledge.season.toLowerCase() !== "all season";
  if (entry.seasonal && isSeasonSpecific) {
    score += SEASON_MATCH_SCORE;
  }

  if (knowledge.academyArticleIds?.includes(entry.slug)) {
    score += EXPLICIT_ARTICLE_SCORE;
  }

  return score;
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Deterministic recommendation engine.
 *
 * Scores every article in the Academy Registry against a FragranceKnowledge
 * object and returns the top-scored articles resolved from the catalogue.
 *
 * Scoring factors (in descending weight):
 *   1. EXPLICIT_ARTICLE_SCORE — fragrance.academyArticleIds override
 *   2. UNIVERSAL_SCORE        — article is broadly relevant
 *   3. UNIVERSAL_FAMILY_SCORE — article covers all fragrance families
 *   4. SEASON_MATCH_SCORE     — seasonal article + season-specific fragrance
 *   5. UNIVERSAL_OCCASION_SCORE — article covers all occasions
 *   6. FAMILY_MATCH_SCORE     — per matched family
 *   7. OCCASION_MATCH_SCORE   — per matched occasion
 */
export function recommendAcademyArticles(
  knowledge: FragranceKnowledge,
  count = 4
): AcademyArticle[] {
  const ranked = ARTICLE_REGISTRY
    .map((entry) => ({ entry, score: scoreEntry(entry, knowledge) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count);

  return ranked
    .map(({ entry }) => academyCatalogue.find((a) => a.slug === entry.slug))
    .filter((a): a is AcademyArticle => a !== undefined);
}
