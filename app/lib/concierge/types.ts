/**
 * Maison Concierge — Shared Type Definitions
 *
 * All types shared between the AI library layer, API route, context, and UI.
 * Client components import FormattedFragrance / FormattedArticle from here
 * to avoid pulling catalogue data into the client bundle.
 */

// ── Conversation model ────────────────────────────────────────────────────────

export type ConversationIntent =
  | "similar_to"
  | "comparison"
  | "education"
  | "occasion_search"
  | "seasonal"
  | "gift"
  | "general_discovery"
  | "clarification";

export interface ConversationContext {
  mentionedSlug?:   string;
  compareSlug?:     string[];
  preferredFamily?: string[];
  preferredNotes?:  string[];
  occasion?:        string;
  season?:          string;
  gender?:          "male" | "female" | "unisex";
  learningTopic?:   string;
  giftContext?:     boolean;
}

export interface ConversationTurn {
  role:            "user" | "assistant";
  content:         string;
  timestamp:       number;
  intent?:         ConversationIntent;
  retrievedSlugs?: string[];
}

export interface ConversationState {
  sessionId:                string;
  turns:                    ConversationTurn[];
  context:                  ConversationContext;
  lastRecommendationSlugs?: string[];
}

// ── UI-safe response types (no catalogue data) ────────────────────────────────

export interface FormattedFragrance {
  slug:      string;
  name:      string;
  subtitle?: string;
  family:    string[];
  image:     string;
  price:     number;
  href:      string;
}

export interface FormattedArticle {
  slug:     string;
  title:    string;
  category: string;
  readTime: number;
  excerpt:  string;
  href:     string;
}

export interface FormattedResponse {
  content:             string;
  fragrances:          FormattedFragrance[];
  articles:            FormattedArticle[];
  followUpSuggestions: string[];
  intent:              string;
}
