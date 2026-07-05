/**
 * Maison Concierge — Response Planner
 *
 * Interprets raw LLM output: extracts [PRODUCT:slug] and [ARTICLE:slug] markers,
 * falls back to retrieval context when the model omits markers, and generates
 * contextual follow-up suggestions based on the ConversationPlan.
 *
 * EP15-P2: planResponse now accepts ConversationPlan for richer follow-ups.
 */

import type { ConversationIntent } from "./types";
import type { RetrievalContext }   from "./contextBuilder";
import type { ConversationPlan }   from "./conversationPlanner";

// ── Marker patterns ───────────────────────────────────────────────────────────

const PRODUCT_RE = /\[PRODUCT:([a-z0-9-]+)\]/g;
const ARTICLE_RE = /\[ARTICLE:([a-z0-9-]+)\]/g;

// ── Contextual follow-up generation ──────────────────────────────────────────

const STATIC_FOLLOW_UPS: Record<ConversationIntent, string[]> = {
  similar_to:        ["Compare these", "Show me another", "Find something fresher"],
  comparison:        ["Which is better for the office?", "Show me something different"],
  education:         ["Show fragrances in this family", "Teach me more"],
  occasion_search:   ["Find something subtler", "Show best sellers for this"],
  seasonal:          ["Show year-round options", "Find something warmer"],
  gift:              ["Is this good for her?", "Show luxury options"],
  general_discovery: ["Help me find my signature scent", "Show best sellers"],
  clarification:     ["Tell me what I usually wear", "Shop by occasion"],
};

function generateFollowUps(
  plan:    ConversationPlan,
  intent:  ConversationIntent,
  hasRecs: boolean
): string[] {
  // Clarification turns — minimal, focused
  if (plan.requiresClarification) {
    return ["Tell me what you usually enjoy.", "Shop by occasion"];
  }

  // Comparison just completed
  if (plan.requiresComparison) {
    return ["Show me something different", "Find gifts", "Show best sellers"];
  }

  // Cache-reuse path — customer already has recommendations
  if (plan.reuseRecommendations && hasRecs) {
    return ["Compare these", "Show me another", "Teach me more"];
  }

  // Education completed
  if (plan.nextIntent === "education" || intent === "education") {
    return ["Show fragrances in this family", "Teach me more", "Find gifts"];
  }

  // Generic selection based on intent
  const pool = STATIC_FOLLOW_UPS[intent] ?? STATIC_FOLLOW_UPS.general_discovery;
  return pool.slice(0, 2);
}

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
  intent:     ConversationIntent,
  retrieval:  RetrievalContext,
  plan:       ConversationPlan
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
  const filteredSlugs       = recommendedSlugs.filter((s) => validFragranceSlugs.has(s));
  const finalSlugs          = filteredSlugs.length > 0 ? filteredSlugs : recommendedSlugs.slice(0, 3);

  const hasRecs            = retrieval.fragrances.length > 0;
  const followUpSuggestions = generateFollowUps(plan, intent, hasRecs).slice(0, 2);

  return {
    content:          content.replace(/\s{2,}/g, " ").trim(),
    recommendedSlugs: finalSlugs,
    articleSlugs,
    followUpSuggestions,
    intent,
  };
}
