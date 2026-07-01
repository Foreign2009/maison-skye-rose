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
//
// No provider is currently configured.
//
// When a provider is formally selected:
//   1. Install the provider SDK:          npm install <provider-package>
//   2. Add provider-specific env vars to  .env.local  (use the provider's own key name)
//   3. Import the provider at the top of this file
//   4. Replace providerInit() with the provider's initialisation call
//   5. Replace providerCapture() with the provider's event capture call
//
// Timestamps are provider responsibility. Do not add client timestamps to properties.
//
// ─────────────────────────────────────────────────────────────────────────────

function providerInit(_sessionId: string): void {
  // Replace with: provider.init(process.env.NEXT_PUBLIC_PROVIDER_KEY!, { ... });
  // Replace with: provider.identify(_sessionId);
}

function providerCapture(_eventName: string, _properties: Record<string, unknown>): void {
  // Replace with: provider.capture(_eventName, _properties);
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
  | "recently-viewed";

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
