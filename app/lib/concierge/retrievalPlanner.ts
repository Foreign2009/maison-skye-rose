/**
 * Maison Concierge — Retrieval Planner
 *
 * Maps a resolved intent to a RetrievalContext containing the fragrances and
 * Academy articles most relevant to the customer's query. Never accesses raw
 * catalogue data directly — uses the discovery layer and search engine.
 */

import { getSimilarFragrances, getCollection, catalogueMaps, COLLECTION_SPECS } from "../discovery";
import { recommendAcademyArticles } from "../academy/recommendAcademyArticles";
import { academyCatalogue } from "../academy/catalogue";
import { mkcCatalogue } from "../mkc/catalogue";
import { search } from "../search/searchEngine";
import { buildSearchIndex } from "../search/indexBuilder";
import type { SearchIndex } from "../search/types";
import type { FragranceKnowledge } from "../mkc/types";
import type { AcademyArticle } from "../academy/types";
import type { ConversationContext, ConversationState } from "./types";
import type { ResolvedIntent } from "./intentResolver";
import type { RetrievalContext } from "./contextBuilder";

// ── Search index singleton (rebuilt once per server process) ──────────────────

let _searchIndex: SearchIndex | null = null;
function getSearchIndex(): SearchIndex {
  if (!_searchIndex) _searchIndex = buildSearchIndex();
  return _searchIndex;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function articlesBySlug(slugs: (string | undefined)[]): AcademyArticle[] {
  return slugs
    .filter((s): s is string => !!s)
    .map((slug) => academyCatalogue.find((a) => a.slug === slug))
    .filter((a): a is AcademyArticle => !!a);
}

function fragrancesByQuery(rawQuery: string, limit = 5): FragranceKnowledge[] {
  const groups = search(rawQuery, getSearchIndex());
  const fragGroup = groups.find((g) => g.type === "fragrance");
  if (!fragGroup) return [];
  return fragGroup.matches
    .map((m) => catalogueMaps.bySlug.get(m.document.slug))
    .filter((k): k is FragranceKnowledge => !!k)
    .slice(0, limit);
}

function articlesFromSearch(rawQuery: string, limit = 2): AcademyArticle[] {
  const groups = search(rawQuery, getSearchIndex());
  const artGroup = groups.find((g) => g.type === "article");
  if (!artGroup) return [];
  return artGroup.matches
    .map((m) => academyCatalogue.find((a) => a.slug === m.document.slug))
    .filter((a): a is AcademyArticle => !!a)
    .slice(0, limit);
}

// ── Public API ────────────────────────────────────────────────────────────────

export function planRetrieval(
  resolved: ResolvedIntent,
  context: ConversationContext
): RetrievalContext {
  const { intent, signals, entitySlug, compareSlug } = resolved;

  let fragrances:     FragranceKnowledge[] = [];
  let articles:       AcademyArticle[]     = [];
  let collectionName: string | undefined;

  const sourceKnowledge = entitySlug ? catalogueMaps.bySlug.get(entitySlug) : undefined;

  switch (intent) {

    case "similar_to": {
      if (sourceKnowledge) {
        fragrances = getSimilarFragrances(sourceKnowledge, { count: 5, excludeSlug: sourceKnowledge.slug })
          .map((r) => r.fragrance);
        articles = recommendAcademyArticles(sourceKnowledge, 2);
      } else {
        fragrances = getCollection("trending").slice(0, 4);
      }
      break;
    }

    case "comparison": {
      const slugsToCompare = compareSlug.length >= 2
        ? compareSlug
        : [entitySlug, context.compareSlug?.[0]].filter(Boolean) as string[];

      fragrances = slugsToCompare
        .map((slug) => catalogueMaps.bySlug.get(slug))
        .filter((k): k is FragranceKnowledge => !!k);

      if (fragrances.length >= 2) {
        const additional = getSimilarFragrances(fragrances[0], { count: 3, excludeSlug: fragrances[0].slug })
          .map((r) => r.fragrance)
          .filter((f) => !fragrances.find((x) => x.slug === f.slug));
        fragrances = [...fragrances, ...additional];
      }
      break;
    }

    case "education": {
      if (sourceKnowledge) {
        articles   = recommendAcademyArticles(sourceKnowledge, 4);
        fragrances = getSimilarFragrances(sourceKnowledge, { count: 3 }).map((r) => r.fragrance);
      } else {
        const topic = context.learningTopic ?? signals.family ?? "fragrance";
        articles   = articlesFromSearch(topic, 4);
        fragrances = fragrancesByQuery(topic, 3);
      }
      break;
    }

    case "occasion_search": {
      const occasion = signals.occasion ?? context.occasion ?? "";
      fragrances = fragrancesByQuery(occasion, 5);

      const matchedSpec = COLLECTION_SPECS.find((s) =>
        s.tags.some((t) => t.toLowerCase().includes(occasion.toLowerCase())) ||
        s.name.toLowerCase().includes(occasion.toLowerCase())
      );
      if (matchedSpec) {
        const collectionFragrances = getCollection(matchedSpec.id).slice(0, 5);
        if (fragrances.length === 0) fragrances = collectionFragrances;
        collectionName = matchedSpec.name;
      }
      break;
    }

    case "seasonal": {
      // Determine season from signals or current hemisphere season
      const seasonKeywords: Record<string, string> = {
        summer: "Summer", winter: "Winter", spring: "Spring", autumn: "Autumn", fall: "Autumn",
      };
      let season = "All Season";
      for (const [kw, val] of Object.entries(seasonKeywords)) {
        if (resolved.signals.occasion?.toLowerCase().includes(kw) ||
            (typeof context.season === "string" && context.season.toLowerCase() === kw)) {
          season = val;
          break;
        }
      }

      fragrances = mkcCatalogue
        .filter((k) => k.season === season || k.season === "All Season")
        .sort((a, b) => {
          if (a.bestSeller && !b.bestSeller) return -1;
          if (!a.bestSeller && b.bestSeller)  return 1;
          return b.popularity - a.popularity;
        })
        .slice(0, 5);

      articles = articlesBySlug(["choosing-your-season-scent"]);
      break;
    }

    case "gift": {
      fragrances = [
        ...getCollection("trending").slice(0, 3),
      ];
      // Supplement with bestsellers if trending is small
      if (fragrances.length < 3) {
        const additional = mkcCatalogue
          .filter((k) => k.bestSeller && !fragrances.find((f) => f.slug === k.slug))
          .slice(0, 3 - fragrances.length);
        fragrances = [...fragrances, ...additional];
      }
      articles = articlesBySlug(["what-makes-a-signature-scent"]);
      break;
    }

    default: { // general_discovery | clarification
      const rawQuery = [signals.family, signals.occasion, signals.vibe, context.learningTopic]
        .filter(Boolean)
        .join(" ");

      if (rawQuery) {
        fragrances = fragrancesByQuery(rawQuery, 5);
        articles   = articlesFromSearch(rawQuery, 2);
      } else {
        fragrances = getCollection("trending").slice(0, 4);
      }
      break;
    }
  }

  // Always surface the source fragrance when it exists
  if (sourceKnowledge && !fragrances.find((f) => f.slug === sourceKnowledge.slug)) {
    fragrances = [sourceKnowledge, ...fragrances].slice(0, 6);
  }

  return { fragrances, articles, collectionName };
}

/**
 * Reconstructs a RetrievalContext from cached ConversationState without
 * performing a new catalogue search. Used when ConversationPlanner returns
 * reuseRecommendations = true.
 */
export function buildCachedRetrieval(state: ConversationState): RetrievalContext {
  const fragrances = (state.lastRecommendationSlugs ?? [])
    .map((slug) => catalogueMaps.bySlug.get(slug))
    .filter((k): k is FragranceKnowledge => !!k);

  const articles = state.lastArticleSlug
    ? [academyCatalogue.find((a) => a.slug === state.lastArticleSlug)].filter(
        (a): a is AcademyArticle => !!a
      )
    : [];

  return { fragrances, articles, collectionName: state.lastCollection };
}
