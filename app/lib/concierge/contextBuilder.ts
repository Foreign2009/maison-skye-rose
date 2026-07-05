/**
 * Maison Concierge — Context Builder
 *
 * Converts retrieval results into structured prompt sections.
 * Returns an array of labelled sections rather than one concatenated string
 * so the API route can control assembly and token budgeting.
 */

import type { FragranceKnowledge } from "../mkc/types";
import type { AcademyArticle } from "../academy/types";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface RetrievalContext {
  fragrances:     FragranceKnowledge[];
  articles:       AcademyArticle[];
  collectionName?: string;
}

export interface PromptSection {
  label:   string;
  content: string;
}

export interface BuiltContext {
  sections:       PromptSection[];
  tokenEstimate:  number;
}

// ── Section builders ──────────────────────────────────────────────────────────

function buildFragranceSection(fragrances: FragranceKnowledge[]): PromptSection {
  const content = fragrances
    .map(
      (k, i) =>
        `${i + 1}. ${k.name} [slug: ${k.slug}]
   Family: ${k.family.join(", ")} | Season: ${k.season} | Character: ${k.scentCharacter} | Projection: ${k.projection}
   Occasions: ${k.occasions.join(", ")}
   Top: ${k.notes.top.join(", ")}
   Heart: ${k.notes.heart.join(", ")}
   Base: ${k.notes.base.join(", ")}
   Profile: ${k.profile}${k.bestSeller ? "\n   [Best Seller]" : ""}${k.newArrival ? "\n   [New Arrival]" : ""}`
    )
    .join("\n\n");

  return { label: "FRAGRANCES IN CONTEXT", content };
}

function buildArticleSection(articles: AcademyArticle[]): PromptSection {
  const content = articles
    .map(
      (a, i) =>
        `${i + 1}. "${a.title}" [slug: ${a.slug}]
   Category: ${a.category} | Read time: ${a.readTime} min
   ${a.excerpt}`
    )
    .join("\n\n");

  return { label: "ACADEMY ARTICLES IN CONTEXT", content };
}

// ── Public API ────────────────────────────────────────────────────────────────

export function buildContext(retrieval: RetrievalContext): BuiltContext {
  const sections: PromptSection[] = [];

  if (retrieval.fragrances.length > 0) {
    sections.push(buildFragranceSection(retrieval.fragrances));
  }

  if (retrieval.collectionName) {
    sections.push({ label: "FEATURED COLLECTION", content: retrieval.collectionName });
  }

  if (retrieval.articles.length > 0) {
    sections.push(buildArticleSection(retrieval.articles));
  }

  const fullText      = sections.map((s) => `=== ${s.label} ===\n${s.content}`).join("\n\n");
  const tokenEstimate = Math.ceil(fullText.length / 4);

  return { sections, tokenEstimate };
}

export function renderContext(built: BuiltContext): string {
  return built.sections
    .filter((s) => s.label && s.content)
    .map((s) => `=== ${s.label} ===\n${s.content}`)
    .join("\n\n");
}
