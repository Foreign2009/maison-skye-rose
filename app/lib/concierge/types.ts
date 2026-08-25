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
  | "clarification"
  | "anchored_refinement";

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
  // Living consultation plan — evolves with each refinement, never persisted (EP18-P1)
  consultationPlan?:        ConsultationPlan;
}

// ── Conversation profile (EP17-P2) ────────────────────────────────────────────

export type ProfileConfidence = "HIGH" | "MEDIUM" | "LOW";

// Collection planning (EP17-P4)
export type CollectionType =
  | "Starter"
  | "Signature"
  | "Business"
  | "Travel"
  | "Seasonal"
  | "Minimal"
  | "Luxury"
  | "Custom";

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

  // Explicitly rejected product slugs — session-scoped hard exclusions (EP-AI-C3)
  // Populated by rejectionDetector when guest names a specific product to exclude
  // or says "none of those". Never persisted beyond the session.
  rejectedSlugs?:      string[];

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

  // Collection planning — session-scoped intent (EP17-P4)
  collectionType?: ProfileField<CollectionType>;
  collectionSize?: ProfileField<number>;
}

// ── Consultation plan (EP18-P1) ───────────────────────────────────────────────

export interface ConsultationRole {
  position:  number;
  character: string;   // scentCharacter — targeted retrieval key
  title:     string;   // e.g. "Evening Character"
  slug:      string;   // Currently assigned fragrance slug
  name:      string;   // Currently assigned fragrance display name
}

export interface ConsultationPlan {
  type:  CollectionType | "Discovery";
  label: string;
  roles: ConsultationRole[];
}

export interface RefinementState {
  affectedRoles:    ConsultationRole[];
  reason:           string;
  budgetRefinement: boolean;
}

// ── Alternative exploration (EP18-P2) ─────────────────────────────────────────

export interface ExplorationTarget {
  role:              ConsultationRole;
  characterPref?:    string;
  intelligenceHint?: { dimension: string; direction: "more" | "less" };
  reason:            string;
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
  profile?:          ConversationProfile;
  consultationPlan?: ConsultationPlan;
}

export interface FormattedResponse {
  content:             string;
  fragrances:          FormattedFragrance[];
  articles:            FormattedArticle[];
  followUpSuggestions: string[];
  intent:              string;
  sessionUpdates?:     SessionUpdates;
}
