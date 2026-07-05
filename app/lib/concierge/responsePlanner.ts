/**
 * Maison Concierge — Response Planner
 *
 * Interprets raw LLM output: extracts [PRODUCT:slug] and [ARTICLE:slug] markers,
 * falls back to retrieval context when the model omits markers, and selects
 * contextual follow-up suggestions.
 */

import type { ConversationIntent } from "./types";
import type { RetrievalContext } from "./contextBuilder";

// ── Marker patterns ───────────────────────────────────────────────────────────

const PRODUCT_RE = /\[PRODUCT:([a-z0-9-]+)\]/g;
const ARTICLE_RE = /\[ARTICLE:([a-z0-9-]+)\]/g;

// ── Follow-up suggestions by intent ──────────────────────────────────────────

const FOLLOW_UPS: Record<ConversationIntent, string[]> = {
  similar_to:        ["Would you like something more intense?", "Shall I explore a different family?"],
  comparison:        ["Which feels closer to what you're looking for?", "Want me to explain the key difference?"],
  education:         ["Would you like to see fragrances in this family?", "Shall I recommend an article to start with?"],
  occasion_search:   ["Would you prefer something subtler or more impactful?", "Shall I filter by a specific family?"],
  seasonal:          ["Would you like year-round options too?", "Shall I show bestsellers for this season?"],
  gift:              ["Is this for a man, woman, or anyone?", "What's the occasion for the gift?"],
  general_discovery: ["Would you like to try our Scent Finder quiz?", "Tell me more about what you usually enjoy."],
  clarification:     ["What scent families do you typically enjoy?", "What occasions would you wear this for?"],
};

// ── Public types ──────────────────────────────────────────────────────────────

export interface PlannedResponse {
  content:             string;
  recommendedSlugs:    string[];
  articleSlugs:        string[];
  followUpSuggestions: string[];
  intent:              ConversationIntent;
}

// ── Public API ────────────────────────────────────────────────────────────────

export function planResponse(
  rawContent: string,
  intent: ConversationIntent,
  retrieval: RetrievalContext
): PlannedResponse {
  const recommendedSlugs: string[] = [];
  const articleSlugs:     string[] = [];

  // Extract and strip [PRODUCT:slug] markers
  let content = rawContent.replace(PRODUCT_RE, (_, slug: string) => {
    if (!recommendedSlugs.includes(slug)) recommendedSlugs.push(slug);
    return "";
  });

  // Extract and strip [ARTICLE:slug] markers
  content = content.replace(ARTICLE_RE, (_, slug: string) => {
    if (!articleSlugs.includes(slug)) articleSlugs.push(slug);
    return "";
  });

  // Fall back to retrieval context when model omits markers
  if (recommendedSlugs.length === 0) {
    retrieval.fragrances.slice(0, 3).forEach((f) => recommendedSlugs.push(f.slug));
  }
  if (articleSlugs.length === 0 && retrieval.articles.length > 0) {
    retrieval.articles.slice(0, 2).forEach((a) => articleSlugs.push(a.slug));
  }

  // Validate recommended slugs exist in retrieval context
  const validFragranceSlugs = new Set(retrieval.fragrances.map((f) => f.slug));
  const filteredSlugs = recommendedSlugs.filter((s) => validFragranceSlugs.has(s));
  const finalSlugs = filteredSlugs.length > 0 ? filteredSlugs : recommendedSlugs.slice(0, 3);

  const followUpSuggestions = (FOLLOW_UPS[intent] ?? FOLLOW_UPS.general_discovery).slice(0, 2);

  return {
    content: content.replace(/\s{2,}/g, " ").trim(),
    recommendedSlugs: finalSlugs,
    articleSlugs,
    followUpSuggestions,
    intent,
  };
}
