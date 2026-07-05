/**
 * Maison Concierge — Response Formatter
 *
 * Converts a PlannedResponse into UI-safe FormattedResponse by resolving slugs
 * against the MKC and Academy catalogues. Contains no business logic —
 * decisions belong in responsePlanner.ts.
 */

import type { PlannedResponse } from "./responsePlanner";
import type { FormattedFragrance, FormattedArticle, FormattedResponse } from "./types";
import type { FragranceKnowledge } from "../mkc/types";
import type { AcademyArticle } from "../academy/types";
import { mkcCatalogue } from "../mkc/catalogue";
import { academyCatalogue } from "../academy/catalogue";

// ── Formatters ────────────────────────────────────────────────────────────────

function formatFragrance(k: FragranceKnowledge): FormattedFragrance {
  return {
    slug:     k.slug,
    name:     k.name,
    subtitle: k.subtitle,
    family:   k.family,
    image:    k.images["10ml"],
    price:    k.prices["10ml"],
    href:     `/product/${k.slug}`,
  };
}

function formatArticle(a: AcademyArticle): FormattedArticle {
  return {
    slug:     a.slug,
    title:    a.title,
    category: a.category,
    readTime: a.readTime,
    excerpt:  a.excerpt,
    href:     `/academy/${a.slug}`,
  };
}

// ── Public API ────────────────────────────────────────────────────────────────

export function formatResponse(planned: PlannedResponse): FormattedResponse {
  const fragrances = planned.recommendedSlugs
    .map((slug) => mkcCatalogue.find((k) => k.slug === slug))
    .filter((k): k is FragranceKnowledge => !!k)
    .map(formatFragrance);

  const articles = planned.articleSlugs
    .map((slug) => academyCatalogue.find((a) => a.slug === slug))
    .filter((a): a is AcademyArticle => !!a)
    .map(formatArticle);

  return {
    content:             planned.content,
    fragrances,
    articles,
    followUpSuggestions: planned.followUpSuggestions,
    intent:              planned.intent,
  };
}
