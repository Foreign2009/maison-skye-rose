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
  // Conversational memory — updated after each turn (EP15-P2)
  selectedSlug?:            string;
  comparisonSlugs?:         string[];
  lastArticleSlug?:         string;
  lastCollection?:          string;
  // Structured consultation profile — session-scoped, never persisted (EP17-P2)
  profile?:                 ConversationProfile;
}

// ── Conversation profile (EP17-P2) ────────────────────────────────────────────

export type ProfileConfidence = "HIGH" | "MEDIUM" | "LOW";

export interface ProfileField<T> {
  value:      T;
  confidence: ProfileConfidence;
}

export interface ConversationProfile {
  // Scent preferences — additive unless genuinely contradicted (Refinement 1)
  preferredFamilies?:  ProfileField<string[]>;
  avoidedFamilies?:    ProfileField<string[]>;
  preferredNotes?:     ProfileField<string[]>;
  avoidedNotes?:       ProfileField<string[]>;

  // Context preferences
  preferredOccasions?: ProfileField<string[]>;
  preferredSeasons?:   ProfileField<string[]>;
  preferredGender?:    ProfileField<"male" | "female" | "unisex">;

  // Shopping intent — scalar, newest wins
  shoppingIntent?:  ProfileField<"self" | "gift">;
  shoppingFor?:     ProfileField<string>;
  recipientGender?: ProfileField<"male" | "female" | "unisex">;

  // Commerce
  budget?: ProfileField<number>;

  // Wardrobe context — highest value field for wardrobe intelligence (Refinement 3)
  existingCollection?: ProfileField<string[]>;
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

export interface SessionUpdates {
  selectedSlug?:    string;
  comparisonSlugs?: string[];
  lastArticleSlug?: string;
  lastCollection?:  string;
  profile?:         ConversationProfile;
}

export interface FormattedResponse {
  content:             string;
  fragrances:          FormattedFragrance[];
  articles:            FormattedArticle[];
  followUpSuggestions: string[];
  intent:              string;
  sessionUpdates?:     SessionUpdates;
}
