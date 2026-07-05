/**
 * Search Engine
 *
 * Scores SearchDocuments against a free-text query and returns grouped results.
 *
 * Ranking strategy:
 *   1. Pre-computed searchWeight  — base score from source metadata (bestSeller, featured, relevanceScore)
 *   2. Title matching             — exact > prefix > contains > token prefix
 *   3. Keyword matching           — flat keyword array from all source fields
 *   4. Intent signal boosting     — parseIntent() extracts family/occasion/vibe signals (fragrances only)
 *   5. Subtitle and description   — lower-weight text search
 *   6. Popularity normalisation   — popularity contributes fractionally to fragrance scores
 *
 * TODO: Replace token-based scoring with fuzzy matching (e.g. Levenshtein distance)
 * to handle typos and partial inputs. SearchDocument and SearchGroup contracts are
 * stable; only scoreDocument() would change when this is introduced.
 */

import { parseIntent } from "../intentParser";
import type {
  SearchDocument,
  SearchIndex,
  SearchMatch,
  SearchGroup,
  SearchQuery,
  RetrievalDocument,
} from "./types";

// ── Constants ─────────────────────────────────────────────────────────────────

const GROUP_LABELS: Record<string, string> = {
  fragrance:  "Fragrances",
  collection: "Collections",
  article:    "Learn",
};

const MAX_PER_GROUP: Record<string, number> = {
  fragrance:  8,
  collection: 4,
  article:    4,
};

const TYPE_ORDER = ["fragrance", "collection", "article"] as const;

// ── Query builder ─────────────────────────────────────────────────────────────

function buildQuery(raw: string): SearchQuery {
  const normalized = raw.toLowerCase().trim();
  const tokens = normalized
    .split(/[\s,./\-_]+/)
    .filter((t) => t.length > 1);
  return { raw, normalized, tokens };
}

// ── Scoring ───────────────────────────────────────────────────────────────────

function scoreBase(
  doc: SearchDocument,
  query: SearchQuery
): { score: number; matchedFields: string[] } {
  const matchedFields: string[] = [];
  let score = doc.searchWeight;
  const q = query.normalized;

  if (!q) return { score, matchedFields };

  // Title matching — highest weight
  const titleLower = doc.title.toLowerCase();
  if (titleLower === q) {
    score += 200;
    matchedFields.push("title:exact");
  } else if (titleLower.startsWith(q)) {
    score += 120;
    matchedFields.push("title:prefix");
  } else if (titleLower.includes(q)) {
    score += 80;
    matchedFields.push("title:contains");
  }

  // Title token prefix matching
  let titleTokenHit = false;
  for (const token of query.tokens) {
    if (token.length < 2) continue;
    if (doc.titleTokens.some((t) => t.startsWith(token))) {
      score += 30;
      titleTokenHit = true;
    }
  }
  if (titleTokenHit) matchedFields.push("title:token");

  // Keyword matching
  let kwHits = 0;
  for (const token of query.tokens) {
    if (token.length < 2) continue;
    if (
      doc.keywords.some(
        (k) => k === token || k.startsWith(token) || k.includes(token)
      )
    ) {
      score += 20;
      kwHits++;
    }
  }
  if (kwHits > 0) matchedFields.push("keywords");

  // Subtitle matching
  if (doc.subtitle) {
    const subLower = doc.subtitle.toLowerCase();
    if (subLower.includes(q)) {
      score += 15;
      matchedFields.push("subtitle");
    } else {
      for (const token of query.tokens) {
        if (token.length > 2 && subLower.includes(token)) {
          score += 8;
          if (!matchedFields.includes("subtitle")) matchedFields.push("subtitle");
          break;
        }
      }
    }
  }

  // Description matching
  if (doc.description) {
    const descLower = doc.description.toLowerCase();
    for (const token of query.tokens) {
      if (token.length > 2 && descLower.includes(token)) {
        score += 6;
        if (!matchedFields.includes("description")) matchedFields.push("description");
        break;
      }
    }
  }

  // Topic matching (articles)
  if (doc.topics && doc.topics.length > 0) {
    for (const topic of doc.topics) {
      const topicLower = topic.toLowerCase();
      if (topicLower.includes(q) || q.includes(topicLower)) {
        score += 15;
        if (!matchedFields.includes("topics")) matchedFields.push("topics");
      }
    }
  }

  return { score, matchedFields };
}

function applyIntentBoosts(
  doc: SearchDocument,
  query: SearchQuery,
  base: { score: number; matchedFields: string[] }
): { score: number; matchedFields: string[] } {
  if (doc.type !== "fragrance") return base;

  let { score } = base;
  const matchedFields = [...base.matchedFields];
  const signals = parseIntent(query.normalized);

  if (
    signals.family &&
    doc.family?.some(
      (f) => f.toLowerCase() === signals.family!.toLowerCase()
    )
  ) {
    score += 35;
    matchedFields.push("family:intent");
  }

  if (
    signals.occasion &&
    doc.occasions?.some((o) =>
      o.toLowerCase().includes(signals.occasion!.toLowerCase())
    )
  ) {
    score += 30;
    matchedFields.push("occasion:intent");
  }

  if (
    signals.vibe &&
    doc.keywords.some((k) => k.includes(signals.vibe!.toLowerCase()))
  ) {
    score += 20;
    matchedFields.push("vibe:intent");
  }

  // Popularity contributes fractionally to avoid dominating the score
  if (doc.popularity) {
    score += doc.popularity * 0.2;
  }

  return { score, matchedFields };
}

// ── Empty state ───────────────────────────────────────────────────────────────

function buildEmptyGroups(index: SearchIndex): SearchGroup[] {
  const topFragrances = index.documents
    .filter((d) => d.type === "fragrance")
    .sort((a, b) => b.searchWeight - a.searchWeight)
    .slice(0, 4);

  const topCollections = index.documents
    .filter((d) => d.type === "collection")
    .sort((a, b) => b.searchWeight - a.searchWeight)
    .slice(0, 3);

  const topArticles = index.documents
    .filter((d) => d.type === "article")
    .sort((a, b) => b.searchWeight - a.searchWeight)
    .slice(0, 2);

  function toMatches(docs: SearchDocument[]): SearchMatch[] {
    return docs.map((d) => ({
      document:      d,
      score:         d.searchWeight,
      matchedFields: [],
    }));
  }

  const groups: SearchGroup[] = [
    {
      type:       "fragrance" as const,
      label:      GROUP_LABELS.fragrance,
      matches:    toMatches(topFragrances),
      totalCount: topFragrances.length,
    },
    {
      type:       "collection" as const,
      label:      GROUP_LABELS.collection,
      matches:    toMatches(topCollections),
      totalCount: topCollections.length,
    },
    {
      type:       "article" as const,
      label:      GROUP_LABELS.article,
      matches:    toMatches(topArticles),
      totalCount: topArticles.length,
    },
  ];
  return groups.filter((g) => g.matches.length > 0);
}

// ── Public API ────────────────────────────────────────────────────────────────

export function search(raw: string, index: SearchIndex): SearchGroup[] {
  const query = buildQuery(raw);

  if (!query.normalized) {
    return buildEmptyGroups(index);
  }

  const scored: SearchMatch[] = index.documents
    .map((doc) => {
      const base  = scoreBase(doc, query);
      const final = applyIntentBoosts(doc, query, base);
      return {
        document:      doc,
        score:         final.score,
        matchedFields: final.matchedFields,
      };
    })
    .filter((m) => m.score > m.document.searchWeight); // must beat baseline

  const byType = new Map<string, SearchMatch[]>();
  for (const match of scored) {
    const t = match.document.type;
    if (!byType.has(t)) byType.set(t, []);
    byType.get(t)!.push(match);
  }

  const groups: SearchGroup[] = [];
  for (const type of TYPE_ORDER) {
    const all     = byType.get(type) ?? [];
    const limited = all.sort((a, b) => b.score - a.score).slice(0, MAX_PER_GROUP[type]);

    if (limited.length > 0) {
      groups.push({
        type,
        label:      GROUP_LABELS[type],
        matches:    limited,
        totalCount: all.length,
      });
    }
  }

  return groups;
}

export function toRetrievalDocuments(groups: SearchGroup[]): RetrievalDocument[] {
  return groups.flatMap((g) =>
    g.matches.map((m) => ({
      id:             m.document.id,
      type:           m.document.type,
      title:          m.document.title,
      slug:           m.document.slug,
      href:           m.document.href,
      relevanceScore: m.score,
      metadata: {
        family:    m.document.family,
        notes:     m.document.notes,
        occasions: m.document.occasions,
        category:  m.document.category,
        keywords:  m.document.keywords,
      },
    }))
  );
}
