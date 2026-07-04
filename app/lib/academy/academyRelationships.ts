import { ARTICLE_REGISTRY, type ArticleRegistryEntry, type AcademyDifficulty } from "./registry";
import type { AcademyArticle } from "./types";
import { academyCatalogue } from "./catalogue";
import { mkcCatalogue } from "../mkc/catalogue";
import type { FragranceKnowledge } from "../mkc/types";

// ── Relationship map ──────────────────────────────────────────────────────────

export interface AcademyRelationshipMap {
  byFamily:     Map<string, ArticleRegistryEntry[]>;
  byOccasion:   Map<string, ArticleRegistryEntry[]>;
  byTopic:      Map<string, ArticleRegistryEntry[]>;
  byTag:        Map<string, ArticleRegistryEntry[]>;
  byDifficulty: Map<AcademyDifficulty, ArticleRegistryEntry[]>;
}

function buildRelationshipMap(): AcademyRelationshipMap {
  const byFamily     = new Map<string, ArticleRegistryEntry[]>();
  const byOccasion   = new Map<string, ArticleRegistryEntry[]>();
  const byTopic      = new Map<string, ArticleRegistryEntry[]>();
  const byTag        = new Map<string, ArticleRegistryEntry[]>();
  const byDifficulty = new Map<AcademyDifficulty, ArticleRegistryEntry[]>();

  for (const entry of ARTICLE_REGISTRY) {
    for (const family of entry.families) {
      if (!byFamily.has(family)) byFamily.set(family, []);
      byFamily.get(family)!.push(entry);
    }

    for (const occasion of entry.occasions) {
      if (!byOccasion.has(occasion)) byOccasion.set(occasion, []);
      byOccasion.get(occasion)!.push(entry);
    }

    for (const topic of entry.topics) {
      if (!byTopic.has(topic)) byTopic.set(topic, []);
      byTopic.get(topic)!.push(entry);
    }

    for (const tag of entry.educationTags) {
      if (!byTag.has(tag)) byTag.set(tag, []);
      byTag.get(tag)!.push(entry);
    }

    if (!byDifficulty.has(entry.difficulty)) byDifficulty.set(entry.difficulty, []);
    byDifficulty.get(entry.difficulty)!.push(entry);
  }

  return { byFamily, byOccasion, byTopic, byTag, byDifficulty };
}

const RELATIONSHIP_MAP = buildRelationshipMap();

// ── Lookup helpers ────────────────────────────────────────────────────────────

function dedupe(entries: ArticleRegistryEntry[]): ArticleRegistryEntry[] {
  const seen = new Set<string>();
  return entries.filter((e) => {
    if (seen.has(e.slug)) return false;
    seen.add(e.slug);
    return true;
  });
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Returns all articles relevant to a fragrance family, including universal
 * articles (families = []) that apply regardless of family.
 */
export function getArticlesForFamily(family: string): ArticleRegistryEntry[] {
  const exact = RELATIONSHIP_MAP.byFamily.get(family) ?? [];
  const universal = ARTICLE_REGISTRY.filter((e) => e.families.length === 0);
  return dedupe([...exact, ...universal]);
}

/**
 * Returns all articles relevant to an occasion, including universal articles
 * (occasions = []) that apply regardless of occasion.
 */
export function getArticlesForOccasion(occasion: string): ArticleRegistryEntry[] {
  const key = occasion.toLowerCase();
  const exact = RELATIONSHIP_MAP.byOccasion.get(key) ?? [];
  const universal = ARTICLE_REGISTRY.filter((e) => e.occasions.length === 0);
  return dedupe([...exact, ...universal]);
}

/**
 * Returns all articles matching a topic keyword (exact lowercase match).
 */
export function getArticlesForTopic(topic: string): ArticleRegistryEntry[] {
  return RELATIONSHIP_MAP.byTopic.get(topic.toLowerCase()) ?? [];
}

/**
 * Returns all articles at a given difficulty level.
 */
export function getArticlesForDifficulty(
  difficulty: AcademyDifficulty
): ArticleRegistryEntry[] {
  return RELATIONSHIP_MAP.byDifficulty.get(difficulty) ?? [];
}

/**
 * Returns fragrances whose MKC family intersects with the article's families.
 * For universal articles (families = []) returns the full catalogue.
 */
export function getFragrancesForArticle(slug: string): FragranceKnowledge[] {
  const entry = ARTICLE_REGISTRY.find((e) => e.slug === slug);
  if (!entry) return [];
  if (entry.families.length === 0) return mkcCatalogue;
  return mkcCatalogue.filter((f) =>
    f.family.some((fam) => entry.families.includes(fam))
  );
}

/**
 * Returns the unique MKC collection names for fragrances related to this article.
 */
export function getCollectionsForArticle(slug: string): string[] {
  const fragrances = getFragrancesForArticle(slug);
  return [...new Set(fragrances.map((f) => f.collection))];
}

/**
 * Returns the resolved AcademyArticle objects for entries returned by any
 * registry lookup function.
 */
export function resolveArticles(entries: ArticleRegistryEntry[]): AcademyArticle[] {
  return entries
    .map((e) => academyCatalogue.find((a) => a.slug === e.slug))
    .filter((a): a is AcademyArticle => a !== undefined);
}
