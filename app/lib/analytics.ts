/**
 * Analytics Service — Maison Skye & Rose
 *
 * Purpose:
 *   This module observes customer behaviour and reports it to an analytics provider.
 *   It never influences behaviour. Results flow one way: outward.
 *
 * Rules:
 *   - Analytics observes behaviour. It never influences it.
 *     No track call may alter application state, context, or UI.
 *
 *   - Failures are silent.
 *     Analytics exceptions never propagate to application code.
 *     A broken analytics layer must never degrade the customer experience.
 *
 *   - The Intelligence Layer must never import this module.
 *     recommendFragrances, intentParser, knowledgeAdapter, and explainability
 *     are pure functions. Observability lives at call sites in their consumers,
 *     not inside the library functions themselves.
 *
 *   - The provider integration point is the only location that references
 *     provider-specific APIs or environment variables.
 *     All other code in this module is provider-neutral.
 */

import posthog from "posthog-js";

// ── Module state ──────────────────────────────────────────────────────────────

let ready = false;

// ── Failure isolation ─────────────────────────────────────────────────────────

function safeCall(fn: () => void): void {
  try {
    fn();
  } catch {
    // Analytics failures are silent. Application behaviour is never affected.
  }
}

// ── PROVIDER INTEGRATION POINT ────────────────────────────────────────────────

function providerInit(sessionId: string): void {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) throw new Error("NEXT_PUBLIC_POSTHOG_KEY is not configured");
  posthog.init(key, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    autocapture: false,
    capture_pageview: false,
    capture_pageleave: false,
    disable_session_recording: true,
    bootstrap: { distinctID: sessionId },
  });
}

function providerCapture(eventName: string, properties: Record<string, unknown>): void {
  posthog.capture(eventName, properties);
}

// ── Public initialisation ─────────────────────────────────────────────────────

export function initAnalytics(sessionId: string): void {
  safeCall(() => {
    providerInit(sessionId);
    ready = true;
  });
}

// ── Event payload types ───────────────────────────────────────────────────────

export type DiscoveryPayload = {
  mode: 0 | 1 | 2;
  query?: string;
  gender?: string;
  occasion?: string;
  vibe?: string;
  family?: string;
  character?: string;
  resultCount: number;
};

export type DiscoveryFilterPayload = {
  filter: string;
  mode: 0 | 1 | 2;
  resultCount: number;
};

export type DiscoverySortPayload = {
  sortBy: string;
  mode: 0 | 1 | 2;
};

export type ConfidencePayload = {
  strength: "Perfect Match" | "Great Match";
  productTitle: string;
};

export type QuizAnswerPayload = {
  questionId: string;
  answer: string;
  completionCount: number;
};

export type QuizCompletedPayload = {
  answers: Record<string, string>;
};

export type QuizResultsPayload = {
  recommendedTitles: string[];
  resultCount: number;
};

export type QuizWhatsAppPayload = {
  ctaType: "help" | "results";
  productTitles?: string[];
};

export type AnalyticsSource =
  | "shop-mode-0"
  | "shop-mode-1"
  | "shop-mode-2"
  | "quiz"
  | "pdp-recommendation"
  | "recently-viewed"
  | "homepage-trending"
  | "homepage-new-arrivals"
  | "homepage-hidden-gems"
  | "homepage-seasonal"
  | "homepage-signature"
  | "homepage-moment"
  | "discover-collection"
  | "discover-seasonal"
  | "discover-hidden-gems"
  | "homepage-curated"
  | "best-sellers-recommendation"
  | "new-arrivals-recommendation"
  | "favorites-recommendation"
  | "recently-viewed-recommendation"
  | "compare-post-decision"
  | "compare-related"
  | "collection-skye-recommendation"
  | "collection-rose-recommendation"
  | "collection-elite-recommendation"
  | "quiz-continuation"
  | "character-journey-profile"
  | "shop-recommendation"
  | "profile-page-recommendation"
  | "discover-intelligence"
  | "academy-intelligence"
  | "minicart-favorites"
  | "minicart-recently-viewed"
  | "minicart-complete-collection"
  | "pdp-journey"
  | "pdp-collection";

export type ProductPayload = {
  title: string;
  slug?: string;
  collection?: "Skye" | "Rose" | "Elite";
  source?: AnalyticsSource;
  rank?: number;
};

export type CartPayload = {
  title: string;
  size: string;
  price: number;
  source?: "pdp" | "quick-add" | "buy-now" | "minicart";
  recommendationSource?: AnalyticsSource;
};

export type CartOpenedPayload = {
  source: "bag-icon" | "post-add";
};

export type CheckoutStartedPayload = {
  itemCount: number;
  cartTotal: number;
  deliveryMethod: string;
};

export type PaymentStartedPayload = {
  amount: number;
};

export type PaymentReturnPayload = {
  itemCount?: number;
};

export type WhatsAppCheckoutPayload = {
  itemCount: number;
  cartTotal: number;
};

// ── Internal capture helper ───────────────────────────────────────────────────

function capture(eventName: string, properties: Record<string, unknown>): void {
  if (!ready) return;
  safeCall(() => {
    providerCapture(eventName, properties);
  });
}

// ── Track functions ───────────────────────────────────────────────────────────

export function trackDiscovery(payload: DiscoveryPayload): void {
  if (!ready) return;
  capture("discovery_mode", payload);
}

export function trackFilter(payload: DiscoveryFilterPayload): void {
  if (!ready) return;
  capture("filter_applied", payload);
}

export function trackSort(payload: DiscoverySortPayload): void {
  if (!ready) return;
  capture("sort_applied", payload);
}

export function trackConfidence(payload: ConfidencePayload): void {
  if (!ready) return;
  capture("confidence_label_shown", payload);
}

export function trackQuizAnswer(payload: QuizAnswerPayload): void {
  if (!ready) return;
  capture("quiz_answer_selected", payload);
}

export function trackQuizCompleted(payload: QuizCompletedPayload): void {
  if (!ready) return;
  capture("quiz_completed", payload);
}

export function trackQuizResults(payload: QuizResultsPayload): void {
  if (!ready) return;
  capture("quiz_results_shown", payload);
}

export function trackQuizWhatsApp(payload: QuizWhatsAppPayload): void {
  if (!ready) return;
  capture("quiz_whatsapp_clicked", payload);
}

export function trackProductView(payload: ProductPayload): void {
  if (!ready) return;
  capture("product_detail_viewed", payload);
}

export function trackProductClick(payload: ProductPayload): void {
  if (!ready) return;
  capture("product_clicked", payload);
}

export function trackAddToCart(payload: CartPayload): void {
  if (!ready) return;
  capture("add_to_cart", payload);
}

export function trackBuyNow(payload: CartPayload): void {
  if (!ready) return;
  capture("buy_now_clicked", payload);
}

export function trackCartOpened(payload: CartOpenedPayload): void {
  if (!ready) return;
  capture("cart_opened", payload);
}

export function trackCheckoutStarted(payload: CheckoutStartedPayload): void {
  if (!ready) return;
  capture("checkout_started", payload);
}

export function trackPaymentStarted(payload: PaymentStartedPayload): void {
  if (!ready) return;
  capture("payment_started", payload);
}

export function trackPaymentReturnSuccess(payload: PaymentReturnPayload): void {
  if (!ready) return;
  capture("payment_return_success", payload);
}

export function trackPaymentReturnCancelled(): void {
  if (!ready) return;
  capture("payment_return_cancelled", {});
}

export function trackWhatsAppCheckout(payload: WhatsAppCheckoutPayload): void {
  if (!ready) return;
  capture("whatsapp_checkout_started", payload);
}

// ── Search event payload types ────────────────────────────────────────────────

export type SearchOpenedPayload = {
  trigger: "keyboard-slash" | "keyboard-ctrl-k" | "navbar-icon";
};

export type SearchClosedPayload = {
  query: string;
};

export type SearchQueryPayload = {
  query: string;
};

export type SearchResultClickedPayload = {
  query: string;
  title: string;
  type:  string;
  href:  string;
};

export type SearchNoResultsPayload = {
  query: string;
};

export type SearchCategorySelectedPayload = {
  category: "fragrance" | "collection" | "article";
  query:    string;
};

// ── Search track functions ────────────────────────────────────────────────────

export function trackSearchOpened(payload: SearchOpenedPayload): void {
  if (!ready) return;
  capture("search_opened", payload);
}

export function trackSearchClosed(payload: SearchClosedPayload): void {
  if (!ready) return;
  capture("search_closed", payload);
}

export function trackSearchQuery(payload: SearchQueryPayload): void {
  if (!ready) return;
  capture("search_query", payload);
}

export function trackSearchResultClicked(payload: SearchResultClickedPayload): void {
  if (!ready) return;
  capture("search_result_clicked", payload);
}

export function trackSearchNoResults(payload: SearchNoResultsPayload): void {
  if (!ready) return;
  capture("search_no_results", payload);
}

export function trackSearchCategorySelected(payload: SearchCategorySelectedPayload): void {
  if (!ready) return;
  capture("search_category_selected", payload);
}

// ── AI Concierge event payload types ─────────────────────────────────────────

export type AiChatStartedPayload = {
  trigger:   "float-button" | "pdp" | "academy" | "discover" | "hero-cta" | "moment-cta" | "companion-cta" | "wardrobe";
  sessionId: string;
};

export type MomentSelectedPayload = {
  momentId: string;
};

export type AiQueryPayload = {
  query:     string;
  sessionId: string;
};

export type AiRecommendationPayload = {
  slugs:     string[];
  intent:    string;
  sessionId: string;
};

export type AiProductClickedPayload = {
  slug:      string;
  name:      string;
  sessionId: string;
};

export type AiArticleOpenedPayload = {
  slug:      string;
  title:     string;
  sessionId: string;
};

export type AiFollowupClickedPayload = {
  suggestion: string;
  sessionId:  string;
};

export type AiSessionCompletedPayload = {
  turnCount:  number;
  sessionId:  string;
};

// ── AI Concierge track functions ──────────────────────────────────────────────

export function trackAiChatStarted(payload: AiChatStartedPayload): void {
  if (!ready) return;
  capture("ai_chat_started", payload);
}

export function trackAiQuery(payload: AiQueryPayload): void {
  if (!ready) return;
  capture("ai_query", payload);
}

export function trackAiRecommendation(payload: AiRecommendationPayload): void {
  if (!ready) return;
  capture("ai_recommendation", payload);
}

export function trackAiProductClicked(payload: AiProductClickedPayload): void {
  if (!ready) return;
  capture("ai_product_clicked", payload);
}

export function trackAiArticleOpened(payload: AiArticleOpenedPayload): void {
  if (!ready) return;
  capture("ai_article_opened", payload);
}

export function trackAiFollowupClicked(payload: AiFollowupClickedPayload): void {
  if (!ready) return;
  capture("ai_followup_clicked", payload);
}

export function trackAiSessionCompleted(payload: AiSessionCompletedPayload): void {
  if (!ready) return;
  capture("ai_session_completed", payload);
}

// ── AI Concierge conversation events (EP15-P2) ────────────────────────────────

export type AiClarificationPayload = {
  sessionId:  string;
  turnDepth:  number;
};

export type AiRecommendationReusedPayload = {
  slugs:     string[];
  sessionId: string;
};

export type AiComparisonStartedPayload = {
  slugs:     string[];
  sessionId: string;
};

export type AiConversationDepthPayload = {
  turnDepth:  number;
  sessionId:  string;
};

export function trackAiClarification(payload: AiClarificationPayload): void {
  if (!ready) return;
  capture("ai_clarification", payload);
}

export function trackAiRecommendationReused(payload: AiRecommendationReusedPayload): void {
  if (!ready) return;
  capture("ai_recommendation_reused", payload);
}

export function trackAiComparisonStarted(payload: AiComparisonStartedPayload): void {
  if (!ready) return;
  capture("ai_comparison_started", payload);
}

export function trackAiConversationDepth(payload: AiConversationDepthPayload): void {
  if (!ready) return;
  capture("ai_conversation_depth", payload);
}

// ── Discover by Moment events ─────────────────────────────────────────────────

export function trackMomentSelected(payload: MomentSelectedPayload): void {
  if (!ready) return;
  capture("moment_selected", payload);
}

// ── Recommendation feedback events ────────────────────────────────────────────
//
// Impression anchor: recommendation_set_shown fires once when a recommendation
// set is first rendered. Downstream product_clicked events carry source + rank
// which PostHog can join back to the impression via the slugs[] array.
//
// strategy and surface are plain strings to avoid importing Recommendation
// Engine internals into the analytics module.

export type RecommendationShownPayload = {
  strategy:          string;
  surface:           AnalyticsSource;
  count:             number;
  slugs:             string[];
  isPersonalised:    boolean;
  processingTimeMs?: number;
};

export function trackRecommendationShown(payload: RecommendationShownPayload): void {
  if (!ready) return;
  capture("recommendation_set_shown", payload);
}

// ── ExperienceIntelligence analytics ──────────────────────────────────────────
//
// Canonical event for all ExperienceIntelligence consumers.
// Fires once per render when recommendations are first shown.
// Parallel to recommendation_set_shown but carries cross-experience context.

export type ExperienceProfileType = "personalised" | "seeded" | "discovery";

export type ExperienceIntelligenceShownPayload = {
  experience:          string;           // ExperienceType e.g. "academy", "discover"
  strategy:            string;           // RE strategy e.g. "personalised", "discovery"
  profileType:         ExperienceProfileType; // data source that drove the result
  seeded:              boolean;          // true when cold-start seeds were injected
  recommendationCount: number;           // count of rendered recommendations
  slugs:               string[];         // rendered slugs — join key for PostHog funnels
  renderSource:        AnalyticsSource;  // surface identifier
  processingTimeMs?:   number;           // RE processing time from result metrics
};

export function trackExperienceIntelligenceShown(
  payload: ExperienceIntelligenceShownPayload,
): void {
  if (!ready) return;
  capture("experience_intelligence_shown", payload);
}

// ── Cart recommendation observability ─────────────────────────────────────────
// Fires when the MiniCart "You May Also Like" panel is expanded and at least
// one recommendation is visible. Three behavioural sections are measured
// independently so each strategy's contribution is queryable separately.

export type CartRecommendationsShownPayload = {
  fromFavoritesCount:          number;
  recentlyViewedCount:         number;
  completeYourCollectionCount: number;
  totalCount:                  number;
  renderSource:                "minicart";
};

export function trackCartRecommendationsShown(
  payload: CartRecommendationsShownPayload,
): void {
  if (!ready) return;
  capture("cart_recommendations_shown", payload);
}

// ── Favourite preference signals ───────────────────────────────────────────────
// Fires when a customer adds or removes a product from favourites.
// source identifies the surface where the heart was clicked.

export type FavouriteToggledPayload = {
  title:   string;
  slug?:   string;
  source?: AnalyticsSource;
  action:  "add" | "remove";
};

export function trackFavouriteToggled(payload: FavouriteToggledPayload): void {
  if (!ready) return;
  capture("favourite_toggled", payload);
}
