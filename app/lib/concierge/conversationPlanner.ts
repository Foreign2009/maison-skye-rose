/**
 * Maison Concierge — Conversation Planner
 *
 * Analyses the latest customer message together with the ConversationState
 * to decide what kind of response this turn requires, before the Retrieval
 * Planner runs. This avoids unnecessary catalogue lookups and enables the
 * assistant to maintain context across turns.
 */

import type { ConversationIntent, ConversationState } from "./types";

// ── Plan types ────────────────────────────────────────────────────────────────

export type ConversationAction =
  | "new_search"
  | "clarification"
  | "comparison"
  | "reuse_cached"
  | "academy_lookup"
  | "follow_up";

export interface ConversationPlan {
  action:                ConversationAction;
  reason:                string;
  requiresRetrieval:     boolean;
  requiresComparison:    boolean;
  requiresClarification: boolean;
  reuseRecommendations:  boolean;
  nextIntent:            ConversationIntent;
}

// ── Pattern sets ──────────────────────────────────────────────────────────────

const REFERENCE_PATTERNS = [
  "the first",  "the second",  "first one",  "second one",
  "that one",   "those",       "this one",   "these ones",
  "show another", "show me another", "another option", "another one",
  "more options", "what else",  "anything else",
  "tell me more about", "more about",
  "the one you", "that last",  "the previous",
];

const COMPARISON_PATTERNS = [
  "compare them", "compare these", "compare both", "compare the two",
  " vs ",  "versus", "versus the", "first vs", "second vs",
  "which is better", "which should i", "which one should",
  "difference between them", "how are they different", "what's the difference",
  "which would you recommend between",
];

const EDUCATION_PATTERNS = [
  "what is ", "what are ", "explain ", "teach me", "how does ", "why does ",
  "tell me about ", "how do ", "what makes ", "what's the difference between",
];

// Simple pronouns that are reference-back without other context
const PRONOUN_PATTERNS = ["why?", "which?", "really?", "both?", "them?", "this?"];

// ── Ordinal reference detection ───────────────────────────────────────────────

function detectOrdinalReference(q: string): number {
  if (/(the )?first( one)?/.test(q))  return 1;
  if (/(the )?second( one)?/.test(q)) return 2;
  if (/(the )?third( one)?/.test(q))  return 3;
  return 0;
}

// ── Last assistant intent ─────────────────────────────────────────────────────

function getPreviousIntent(state: ConversationState): ConversationIntent {
  const lastAssistant = [...state.turns].reverse().find((t) => t.role === "assistant");
  return lastAssistant?.intent ?? "general_discovery";
}

// ── Public API ────────────────────────────────────────────────────────────────

export function planConversation(
  message:  string,
  state:    ConversationState
): ConversationPlan {
  const q              = message.toLowerCase().trim();
  const hasTurns       = state.turns.length > 0;
  const hasPreviousRecs = (state.lastRecommendationSlugs ?? []).length > 0;
  const previousIntent  = getPreviousIntent(state);

  // ── 1. Comparison — highest priority ────────────────────────────────────────
  if (COMPARISON_PATTERNS.some((p) => q.includes(p))) {
    // If we have cached recs, compare without new retrieval
    if (hasPreviousRecs) {
      return {
        action:                "comparison",
        reason:                "Explicit comparison request against cached recommendations",
        requiresRetrieval:     false,
        requiresComparison:    true,
        requiresClarification: false,
        reuseRecommendations:  true,
        nextIntent:            "comparison",
      };
    }
    // If no cached recs, we need retrieval first
    return {
      action:                "comparison",
      reason:                "Comparison request — fetching fragrances to compare",
      requiresRetrieval:     true,
      requiresComparison:    true,
      requiresClarification: false,
      reuseRecommendations:  false,
      nextIntent:            "comparison",
    };
  }

  // ── 2. Reference-back — "the first one", "show another", ordinal ────────────
  const isReferenceBack = hasPreviousRecs && (
    REFERENCE_PATTERNS.some((p) => q.includes(p)) ||
    PRONOUN_PATTERNS.includes(q) ||
    detectOrdinalReference(q) > 0
  );

  if (isReferenceBack) {
    return {
      action:                "reuse_cached",
      reason:                "Customer refers to previous recommendations",
      requiresRetrieval:     false,
      requiresComparison:    false,
      requiresClarification: false,
      reuseRecommendations:  true,
      nextIntent:            previousIntent,
    };
  }

  // ── 3. Education — "what is", "explain", "teach me" ─────────────────────────
  if (EDUCATION_PATTERNS.some((p) => q.includes(p))) {
    return {
      action:                "academy_lookup",
      reason:                "Customer is asking an educational question",
      requiresRetrieval:     true,
      requiresComparison:    false,
      requiresClarification: false,
      reuseRecommendations:  false,
      nextIntent:            "education",
    };
  }

  // ── 4. Clarification needed — very short, no prior context ──────────────────
  const wordCount  = q.split(/\s+/).filter(Boolean).length;
  const isUnclear  = wordCount <= 2 && !hasTurns;

  if (isUnclear) {
    return {
      action:                "clarification",
      reason:                "Message too short to determine intent",
      requiresRetrieval:     false,
      requiresComparison:    false,
      requiresClarification: true,
      reuseRecommendations:  false,
      nextIntent:            "clarification",
    };
  }

  // ── 5. Default — new search ──────────────────────────────────────────────────
  return {
    action:                "new_search",
    reason:                "New customer query requiring retrieval",
    requiresRetrieval:     true,
    requiresComparison:    false,
    requiresClarification: false,
    reuseRecommendations:  false,
    nextIntent:            "general_discovery", // intentResolver will refine this
  };
}
