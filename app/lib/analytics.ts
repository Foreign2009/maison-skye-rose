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
  | "homepage-hidden-gems"
  | "homepage-seasonal"
  | "homepage-signature"
  | "discover-collection"
  | "discover-seasonal"
  | "discover-hidden-gems";

export type ProductPayload = {
  title: string;
  collection?: "Skye" | "Rose" | "Elite";
  source?: AnalyticsSource;
  rank?: number;
};

export type CartPayload = {
  title: string;
  size: string;
  price: number;
  source?: "pdp" | "quick-add" | "buy-now" | "minicart";
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
  trigger:   "float-button" | "pdp" | "academy" | "discover";
  sessionId: string;
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
