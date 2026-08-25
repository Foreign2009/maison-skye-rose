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
  similar_to:          ["Compare these", "Show me another", "Find something fresher"],
  comparison:          ["Which is better for the office?", "Show me something different"],
  education:           ["Show fragrances in this family", "Teach me more"],
  occasion_search:     ["Find something subtler", "Show best sellers for this"],
  seasonal:            ["Show year-round options", "Find something warmer"],
  gift:                ["Is this good for her?", "Show luxury options"],
  general_discovery:   ["Help me find my signature scent", "Show best sellers"],
  clarification:       ["Tell me what I usually wear", "Shop by occasion"],
  anchored_refinement: ["Show me more in this direction", "Compare these", "Tell me more about this one"],
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
  const rawSlugs:    string[] = [];
  const articleSlugs: string[] = [];

  // Extract and strip [PRODUCT:slug] markers (captured but not yet validated)
  let content = rawContent.replace(PRODUCT_RE, (_, slug: string) => {
    if (!rawSlugs.includes(slug)) rawSlugs.push(slug);
    return "";
  });

  // Extract and strip [ARTICLE:slug] markers
  content = content.replace(ARTICLE_RE, (_, slug: string) => {
    if (!articleSlugs.includes(slug)) articleSlugs.push(slug);
    return "";
  });

  if (articleSlugs.length === 0 && retrieval.articles.length > 0) {
    retrieval.articles.slice(0, 2).forEach((a) => articleSlugs.push(a.slug));
  }

  // ── Product card resolution (EP-AI-C4 A2 fix) ────────────────────────────────
  // Product cards must refer only to fragrances actually in the current retrieval
  // context. Precedence (Founder-approved):
  //   1. Valid [PRODUCT:slug] markers restricted to current retrieval candidates
  //   2. Exact product-name matches in prose, restricted to current candidates
  //   3. Deterministic single candidate when retrieval holds exactly one fragrance
  //   4. No card — never render speculative or unvalidated product cards
  //
  // PROHIBITED: arbitrary first-N fallback, catalogue-wide matching, unknown slugs.

  const validFragranceSlugs = new Set(retrieval.fragrances.map((f) => f.slug));

  // Precedence 1: valid markers
  let finalSlugs: string[] = rawSlugs.filter((s) => validFragranceSlugs.has(s));

  if (finalSlugs.length === 0) {
    // Precedence 2: exact product-name match in prose (case-insensitive)
    // After marker stripping, fragrance names appear naturally in the content.
    const contentLower = content.toLowerCase();
    const nameMatched  = retrieval.fragrances
      .filter((f) => contentLower.includes(f.name.toLowerCase()))
      .map((f) => f.slug);

    if (nameMatched.length > 0) {
      finalSlugs = nameMatched;
    } else if (retrieval.fragrances.length === 1) {
      // Precedence 3: single deterministic candidate (single-best intent)
      finalSlugs = [retrieval.fragrances[0].slug];
    }
    // Precedence 4: no card (finalSlugs stays [])
  }

  const hasRecs             = retrieval.fragrances.length > 0;
  const followUpSuggestions = generateFollowUps(plan, intent, hasRecs).slice(0, 2);

  return {
    content:          content.replace(/\s{2,}/g, " ").trim(),
    recommendedSlugs: finalSlugs,
    articleSlugs,
    followUpSuggestions,
    intent,
  };
}
