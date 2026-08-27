/**
 * Maison Concierge — Conversation Planner
 *
 * Analyses the latest customer message together with the ConversationState
 * to decide what kind of response this turn requires, before the Retrieval
 * Planner runs. This avoids unnecessary catalogue lookups and enables the
 * assistant to maintain context across turns.
 */

import type { ConversationIntent, ConversationState } from "./types";
import { NONE_OF_THOSE_SIGNALS } from "./rejectionDetector";
import { computeProfileCompleteness } from "./profileCompletenessEngine";

// ── Plan types ────────────────────────────────────────────────────────────────

export type ConversationAction =
  | "new_search"
  | "clarification"
  | "comparison"
  | "reuse_cached"
  | "academy_lookup"
  | "follow_up"
  | "refinement"
  | "alternative_exploration"
  | "anchored_refinement";

export interface ConversationPlan {
  action:                      ConversationAction;
  reason:                      string;
  requiresRetrieval:           boolean;
  requiresComparison:          boolean;
  requiresClarification:       boolean;
  reuseRecommendations:        boolean;
  nextIntent:                  ConversationIntent;
  // EP-AI-C5: set when question fatigue gate fires — hybrid recommend + one question
  consultationReadinessQuestion?: string;
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

// Alternative exploration signals — curiosity-driven, no profile change (EP18-P2)
// Fires before reference-back and refinement when a ConsultationPlan is active.
const ALTERNATIVE_EXPLORATION_PATTERNS = [
  // Generic — customer wants to see a different option
  "show another", "show me another", "another option", "another one",
  "more options", "what else", "anything else", "other options",
  "see another", "show me something else",
  // Rejection without avoidance — not convinced but not avoiding
  "doesn't suit me", "don't think this suits", "not quite right",
  "not quite what i", "not for me", "not really me",
  "not sure about this", "something else",
  // Character and direction exploration
  "fresher option", "warmer option", "lighter option",
  "another direction", "a different direction", "different interpretation",
  "something different",
  // Role-specific exploration
  "another fresh", "another warm", "another evening", "another travel",
  "another formal", "another daily", "another signature",
  "different option for", "alternative for",
  // Intelligence direction exploration
  "less sweet", "less heavy", "less intense", "less dark",
  "softer", "subtler",
];

// Refinement signals — preference updates against an active consultation (EP18-P1)
const REFINEMENT_PATTERNS = [
  "i don't like", "i dont like", "not a fan of", "i hate",
  "too heavy", "too sweet", "too strong", "too light", "too dark", "too intense",
  "something different", "swap", "replace", "change the",
  "fresher option", "warmer option", "lighter option",
  "less sweet", "less heavy", "less intense", "less dark",
  "more fresh", "more warm", "more light", "more balanced",
  "without vanilla", "without oud", "without musk",
  "cheaper", "more affordable", "less expensive", "within my budget",
  "budget has changed", "updated my budget", "more to spend",
];

// Simple pronouns that are reference-back without other context
const PRONOUN_PATTERNS = ["why?", "which?", "really?", "both?", "them?", "this?"];

// Intelligence direction signals — governed MKC numeric dimensions (EP-AI-C4)
// Covers all patterns in DIRECTION_MAP in retrievalPlanner. When combined with a
// reference signal (REFERENCE_PATTERNS / ordinal / state.selectedSlug), these
// trigger anchored_refinement before reuse_cached. Stand-alone (no anchor context)
// they fall through to alternative_exploration or new_search.
// Deferred (no governed field): "elegant", "sophisticated", "better for office/date".
const ANCHORED_DIRECTION_SIGNALS = [
  // freshness
  "fresher", "more fresh", "airier", "more airy", "less fresh",
  // sweetness
  "less sweet", "less sweetness", "drier", "more dry", "sweeter", "more sweet", "more sweetness",
  // warmth
  "warmer", "more warm", "more warmth", "richer", "more rich", "cooler", "less warm", "less warmth",
  // intensity
  "more intense", "more intensity", "bolder", "stronger", "more powerful",
  "less intense", "less intensity", "lighter", "softer", "subtler",
];

// ── Discovery signal detection ────────────────────────────────────────────────
//
// Returns true when the message contains at least one actionable discovery
// signal. Messages with any recognisable signal are sufficient to begin
// recommending without a clarifying question. Only ask when the missing
// information would materially improve the recommendation (Refinement 1).

function hasDiscoverySignal(q: string): boolean {
  // Fragrance families, character descriptors, finish styles
  if (/\b(woody|floral|citrus|aquatic|fresh|amber|spicy|vanilla|oud|leather|musk|gourmand|aromatic|fruity|rose|powdery|sweet|warm|light|airy|deep|intense|rich|clean|crisp)\b/.test(q)) return true;
  // Seasons
  if (/\b(summer|winter|spring|autumn|fall)\b/.test(q)) return true;
  // Gender cues
  if (/\b(men|man|male|masculine|women|woman|female|feminine|unisex)\b/.test(q)) return true;
  // Occasions and contexts
  if (/\b(office|work|date|wedding|evening|daily|casual|vacation|holiday|gym|beach|formal|night)\b/.test(q)) return true;
  // Gift context (specific enough to guide retrieval)
  if (/\b(gift|present|partner|friend|mother|father|husband|wife|boyfriend|girlfriend)\b/.test(q) ||
      /\bfor (him|her|them)\b/.test(q)) return true;
  // Similarity / duplication intent
  if (/\b(similar|inspired|dupe|clone|alternative|reminds me|smells like)\b/.test(q) ||
      /\blike \b/.test(q)) return true;
  // Comparison intent
  if (/\b(compare|versus)\b/.test(q) || /\bvs\.?\b/.test(q)) return true;
  // Lifestyle and vibe descriptors
  if (/\b(luxury|confident|powerful|sexy|professional|elegant|playful|mysterious|romantic|bold|sophisticated|modern|wealthy|subtle|unique|signature)\b/.test(q)) return true;
  return false;
}

// ── Ordinal reference detection ───────────────────────────────────────────────

function detectOrdinalReference(q: string): number {
  if (/(the )?first( one)?/.test(q))  return 1;
  if (/(the )?second( one)?/.test(q)) return 2;
  if (/(the )?third( one)?/.test(q))  return 3;
  if (/\boption\s+(1|one|2|two|3|three)\b/.test(q)) return 1;
  if (/\bnumber\s+(1|one|2|two|3|three)\b/.test(q)) return 1;
  if (/\bthe\s+last\s+(one|option|fragrance)?\b/.test(q)) return 1;
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

  // ── 1.5 Anchored refinement — reference + direction signal (EP-AI-C4) ──────────
  // "Like the first one but fresher", "the second but less sweet", "something similar but warmer"
  // Fires when the message contains both a reference to a prior recommendation (or an
  // active selectedSlug) AND an intelligence direction signal. Takes precedence over
  // alternative_exploration and reuse_cached because a direction implies fresh retrieval
  // is needed against a specific intelligence dimension. Direction is deterministic only
  // for governed MKC fields — see ANCHORED_DIRECTION_SIGNALS and DIRECTION_MAP.
  const hasDirectionSignal = ANCHORED_DIRECTION_SIGNALS.some((p) => q.includes(p));
  const hasReferenceSignal = hasPreviousRecs && (
    REFERENCE_PATTERNS.some((p) => q.includes(p)) ||
    detectOrdinalReference(q) > 0
  );
  const isNoneOfThose = NONE_OF_THOSE_SIGNALS.some((s) => q.includes(s));
  if (hasDirectionSignal && (hasReferenceSignal || !!state.selectedSlug) && !isNoneOfThose) {
    return {
      action:                "anchored_refinement",
      reason:                "Guest requested a directional variation relative to a reference fragrance",
      requiresRetrieval:     true,
      requiresComparison:    false,
      requiresClarification: false,
      reuseRecommendations:  false,
      nextIntent:            "anchored_refinement",
    };
  }

  // ── 2. Alternative exploration — curiosity against active consultation (EP18-P2)
  // Must fire before reference-back so "show another" routes to exploration
  // (not reuse_cached) when a ConsultationPlan is active.
  if (state.consultationPlan &&
      ALTERNATIVE_EXPLORATION_PATTERNS.some((p) => q.includes(p))) {
    return {
      action:                "alternative_exploration",
      reason:                "Customer wants to explore an alternative for an active consultation role",
      requiresRetrieval:     true,
      requiresComparison:    false,
      requiresClarification: false,
      reuseRecommendations:  false,
      nextIntent:            "general_discovery",
    };
  }

  // ── 2.5 Rejection — "none of those", "none of these" (EP-AI-C4-P0) ──────────
  // Must fire BEFORE the reference-back check so that rejection phrases
  // containing "those" / "these" are not misclassified as reuse_cached.
  // route.ts step 0a (detectRejections) merges lastRecommendationSlugs into
  // rejectedSlugs before planRetrieval runs, preventing re-surfacing of
  // rejected candidates via the hard rejection filter.
  if (NONE_OF_THOSE_SIGNALS.some((s) => q.includes(s))) {
    return {
      action:                "new_search",
      reason:                "Guest rejected all previous recommendations — fresh retrieval required",
      requiresRetrieval:     true,
      requiresComparison:    false,
      requiresClarification: false,
      reuseRecommendations:  false,
      nextIntent:            "general_discovery",
    };
  }

  // ── 3. Reference-back — "the first one", "show another", ordinal ────────────
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

  // ── 4. Education — "what is", "explain", "teach me" ─────────────────────────
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

  // ── 5. Refinement — preference update against active consultation (EP18-P1) ───
  if (state.consultationPlan &&
      REFINEMENT_PATTERNS.some((p) => q.includes(p))) {
    return {
      action:                "refinement",
      reason:                "Preference update against active consultation plan",
      requiresRetrieval:     true,
      requiresComparison:    false,
      requiresClarification: false,
      reuseRecommendations:  false,
      nextIntent:            "general_discovery",
    };
  }

  // ── 6. Clarification needed — first turn with no discoverable signals ─────────
  // Use signal-based detection rather than word count so that short but
  // signal-rich messages ("Fresh and woody") proceed to search while longer
  // but signal-free messages ("I need a new fragrance") ask one question.
  const isUnclear = !hasTurns && !hasPreviousRecs && !hasDiscoverySignal(q);

  if (isUnclear) {
    return {
      action:                "clarification",
      reason:                "No actionable discovery signal — ask one clarifying question",
      requiresRetrieval:     false,
      requiresComparison:    false,
      requiresClarification: true,
      reuseRecommendations:  false,
      nextIntent:            "clarification",
    };
  }

  // ── 6.5 Question fatigue gate (EP-AI-C5) ────────────────────────────────────
  // After 2 explicit clarification turns, stop withholding recommendations and
  // instead use a hybrid approach: retrieve candidates AND embed one targeted
  // question in context. Profile must be LOW completeness and the message must
  // not carry enough signal to skip the gate entirely.
  // NOTE: isUnclear already returned "clarification" above if this is turn 1
  // with no signals — this gate only fires on subsequent low-signal turns.
  const clarificationCount = state.clarificationTurnCount ?? 0;
  const readiness          = hasTurns ? computeProfileCompleteness(state.profile) : null;
  const profileIsLow       = readiness?.level === "LOW";
  const questionFatigueGate = hasTurns && !hasPreviousRecs && profileIsLow &&
    !hasDiscoverySignal(q) && clarificationCount < 2;

  if (questionFatigueGate && readiness?.clarificationFocus) {
    return {
      action:                      "new_search",
      reason:                      "Profile still LOW — hybrid: retrieve candidates and include one targeted question",
      requiresRetrieval:           true,
      requiresComparison:          false,
      requiresClarification:       false,
      reuseRecommendations:        false,
      nextIntent:                  "general_discovery",
      consultationReadinessQuestion: readiness.clarificationFocus,
    };
  }

  // ── 7. Default — new search ──────────────────────────────────────────────────
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
