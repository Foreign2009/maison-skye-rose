/**
 * Search Index Builder
 *
 * Constructs the unified SearchIndex from three MKC-sourced catalogues:
 *   1. mkcCatalogue       → 93 fragrance documents
 *   2. COLLECTION_SPECS   → 10 discovery collection documents
 *   3. academyCatalogue   → 6 academy article documents
 *
 * buildSearchIndex() is pure TypeScript. No runtime fetching. No async.
 * Call it once — the result is held in a module-level singleton in useSearch.ts.
 */

import type { FragranceKnowledge } from "../mkc/types";
import type { CollectionSpec } from "../discovery/types";
import type { AcademyArticle } from "../academy/types";
import type { ArticleRegistryEntry } from "../academy/registry";
import { mkcCatalogue } from "../mkc/catalogue";
import { COLLECTION_SPECS } from "../discovery";
import { academyCatalogue } from "../academy/catalogue";
import { ARTICLE_REGISTRY } from "../academy/registry";
import { getCategoryMeta } from "../academy/categories";
import { computeWardrobe } from "../mkc/wardrobeEngine";
import type { SearchDocument, SearchIndex } from "./types";

// ── Utilities ─────────────────────────────────────────────────────────────────

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .split(/[\s,./\-_]+/)
    .filter((t) => t.length > 1);
}

function dedup(arr: string[]): string[] {
  return [...new Set(arr.filter(Boolean))];
}

// ── Fragrance projector ───────────────────────────────────────────────────────

function fragranceToDocument(k: FragranceKnowledge): SearchDocument {
  const allNotes = [...k.notes.top, ...k.notes.heart, ...k.notes.base];
  const keywords = dedup(
    [
      ...k.family,
      ...k.occasions,
      ...k.vibe,
      ...allNotes,
      k.mood,
      k.collection,
      k.scentCharacter,
      k.season,
      k.brand,
      ...(k.educationTags ?? []),
    ].map((s) => s.toLowerCase())
  );

  const searchWeight = k.bestSeller
    ? 100
    : (k.featured ?? false)
    ? 80
    : 50 + Math.round((k.popularity ?? 0) / 2);

  return {
    id:          `fragrance:${k.slug}`,
    type:        "fragrance",
    slug:        k.slug,
    title:       k.name,
    subtitle:    k.subtitle,
    description: k.profile,
    image:       k.images["10ml"],
    titleTokens: tokenize(k.name),
    keywords,
    family:      k.family,
    notes:       allNotes,
    occasions:   k.occasions,
    season:      k.season,
    wardrobeRole: computeWardrobe(k).wardrobeRole,
    popularity:  k.popularity,
    searchWeight,
    href:        `/product/${k.slug}`,
  };
}

// ── Collection projector ──────────────────────────────────────────────────────

function collectionToDocument(spec: CollectionSpec): SearchDocument {
  const keywords = dedup(spec.tags.map((t) => t.toLowerCase()));

  return {
    id:          `collection:${spec.id}`,
    type:        "collection",
    slug:        spec.id,
    title:       spec.name,
    subtitle:    spec.description,
    description: spec.tags.join(" · "),
    image:       spec.icon,
    titleTokens: tokenize(spec.name),
    keywords,
    searchWeight: spec.featured ? 80 : 60,
    href:         `/discover/${spec.id}`,
  };
}

// ── Article projector ─────────────────────────────────────────────────────────

function articleToDocument(
  article: AcademyArticle,
  entry: ArticleRegistryEntry | undefined
): SearchDocument {
  const categoryMeta = getCategoryMeta(article.category);
  const keywords = dedup(
    [
      ...(entry?.keywords ?? []),
      ...(entry?.educationTags ?? []),
      ...(entry?.topics ?? []),
      article.category.toLowerCase(),
    ].map((s) => s.toLowerCase())
  );

  return {
    id:           `article:${article.slug}`,
    type:         "article",
    slug:         article.slug,
    title:        article.title,
    subtitle:     article.subtitle,
    description:  article.excerpt,
    image:        categoryMeta?.icon,
    titleTokens:  tokenize(article.title),
    keywords,
    category:     article.category,
    educationTags: entry?.educationTags,
    topics:       entry?.topics,
    readTime:     article.readTime,
    searchWeight: entry?.relevanceScore ?? 50,
    href:         `/academy/${article.slug}`,
  };
}

// ── Public API ────────────────────────────────────────────────────────────────

export function buildSearchIndex(): SearchIndex {
  const documents: SearchDocument[] = [
    ...mkcCatalogue.map(fragranceToDocument),
    ...COLLECTION_SPECS.map(collectionToDocument),
    ...academyCatalogue.map((article) => {
      const entry = ARTICLE_REGISTRY.find((r) => r.slug === article.slug);
      return articleToDocument(article, entry);
    }),
  ];

  return {
    version:     1,
    generatedAt: new Date().toISOString(),
    documents,
  };
}
