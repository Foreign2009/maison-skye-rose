/**
 * Maison Concierge — Response Planner
 *
 * Interprets raw LLM output: extracts [PRODUCT:slug] and [ARTICLE:slug] markers,
 * falls back to retrieval context when the model omits markers, and generates
 * contextual follow-up suggestions based on the ConversationPlan.
 *
 * EP15-P2: planResponse now accepts ConversationPlan for richer follow-ups.
 */

import type { ConversationIntent, ConversationProfile } from "./types";
import type { RetrievalContext }   from "./contextBuilder";
import type { ConversationPlan }   from "./conversationPlanner";

// ── Marker patterns ───────────────────────────────────────────────────────────

const PRODUCT_RE = /\[PRODUCT:([a-z0-9-]+)\]/g;
const ARTICLE_RE = /\[ARTICLE:([a-z0-9-]+)\]/g;

// ── Contextual follow-up generation ──────────────────────────────────────────

// ── Static follow-up pools ────────────────────────────────────────────────────
// Baseline suggestions per intent. Profile-safe filtering runs at generation
// time — suggestions that would propose avoided or rejected directions are
// removed before the slice. Deterministic only: no additional LLM call.

const STATIC_FOLLOW_UPS: Record<ConversationIntent, string[]> = {
  similar_to:          ["Compare these", "Show me another option", "Find something fresher"],
  comparison:          ["Show me something different", "Which is better for evenings?"],
  education:           ["Show fragrances in this family", "Teach me more"],
  occasion_search:     ["Find something subtler", "Show best sellers for this occasion"],
  seasonal:            ["Show year-round options", "Find something for cooler weather"],
  gift:                ["Show luxury gift options", "Find something for daily wear"],
  general_discovery:   ["Help me find my signature scent", "Show best sellers"],
  clarification:       ["Shop by occasion", "Help me explore families"],
  anchored_refinement: ["Show me more in this direction", "Compare these two", "Tell me more about this one"],
};

// Follow-up phrases that could inadvertently propose a direction the guest
// explicitly dislikes. We filter these out when we can detect a conflict.
const DIRECTION_KEYWORDS: Array<{ phrase: string; families: string[]; vibes: string[] }> = [
  { phrase: "something warmer",      families: ["oriental", "amber", "woody"], vibes: ["warm"] },
  { phrase: "for cooler weather",    families: ["oriental", "amber"],          vibes: ["warm", "cosy"] },
  { phrase: "luxury gift options",   families: [],                             vibes: [] },
  { phrase: "show best sellers",     families: [],                             vibes: [] },
  { phrase: "find something fresher",families: ["citrus", "aquatic", "green"], vibes: ["fresh"] },
  { phrase: "shop by occasion",      families: [],                             vibes: [] },
];

function isSuggestionSafe(
  suggestion:      string,
  avoidedFamilies: string[],
  avoidedNotes:    string[],
): boolean {
  const s = suggestion.toLowerCase();
  for (const { phrase, families } of DIRECTION_KEYWORDS) {
    if (s.includes(phrase.toLowerCase()) && families.length > 0) {
      if (families.some((fam) =>
        avoidedFamilies.some((af) => af.toLowerCase().includes(fam) || fam.includes(af.toLowerCase()))
      )) return false;
    }
  }
  // Crude note check: if the suggestion mentions a note the guest avoids
  for (const note of avoidedNotes) {
    if (note.length > 3 && s.includes(note.toLowerCase())) return false;
  }
  return true;
}

function generateFollowUps(
  plan:    ConversationPlan,
  intent:  ConversationIntent,
  hasRecs: boolean,
  profile?: ConversationProfile,
): string[] {
  const avoidedFamilies = (profile?.avoidedFamilies?.value ?? []).map((f) => f.toLowerCase());
  const avoidedNotes    = (profile?.avoidedNotes?.value    ?? []).map((n) => n.toLowerCase());

  const filter = (suggestions: string[]): string[] =>
    suggestions
      .filter((s) => isSuggestionSafe(s, avoidedFamilies, avoidedNotes))
      .slice(0, 2);

  // Clarification turns — minimal, focused
  if (plan.requiresClarification) {
    return filter(["Shop by occasion", "Help me explore families"]);
  }

  // Comparison just completed — profile-neutral post-comparison suggestions
  if (plan.requiresComparison) {
    return filter(["Show me something different", "Find gifts", "Show best sellers"]);
  }

  // Cache-reuse path — customer already has recommendations
  if (plan.reuseRecommendations && hasRecs) {
    return filter(["Compare these", "Show me another option", "Teach me more"]);
  }

  // Education completed
  if (plan.nextIntent === "education" || intent === "education") {
    return filter(["Show fragrances in this family", "Teach me more", "Find gifts"]);
  }

  // Consultation readiness gate fired — suggest discovery alternatives
  if (plan.consultationReadinessQuestion) {
    return filter(["Show me what's popular", "Help me explore by occasion"]);
  }

  // Generic selection based on intent
  const pool = STATIC_FOLLOW_UPS[intent] ?? STATIC_FOLLOW_UPS.general_discovery;
  return filter(pool);
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
  plan:       ConversationPlan,
  profile?:   ConversationProfile,
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
  const followUpSuggestions = generateFollowUps(plan, intent, hasRecs, profile).slice(0, 2);

  return {
    content:          content.replace(/\s{2,}/g, " ").trim(),
    recommendedSlugs: finalSlugs,
    articleSlugs,
    followUpSuggestions,
    intent,
  };
}
