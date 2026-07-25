/**
 * Customer Behaviour — Report Builder (EP31-P1)
 *
 * Pure function. Accepts CustomerAnalyticsResult | null and a
 * SignalCalibrationReport and returns a CustomerBehaviourReport.
 *
 * No arithmetic beyond conversion rate derivation: count[n] / count[n-1].
 * Null propagation is explicit — never divides by null or zero.
 *
 * Integration points:
 *   customerAnalytics.ts         — CustomerAnalyticsResult input
 *   SignalCalibration.ts         — SignalCalibrationReport input
 *   CustomerBehaviourTypes.ts    — output types
 *   admin/CustomerIntelligenceDashboard — consumed via page.tsx (EP31-P4)
 */

import type { CustomerAnalyticsResult } from "../../analytics/customerAnalytics";
import type { SignalCalibrationReport }  from "../signals/SignalCalibration";
import type {
  CustomerBehaviourReport,
  DiscoveryBreakdown,
  EngagementMetrics,
  FunnelStep,
  FunnelStageKey,
} from "./CustomerBehaviourTypes";

// ── Funnel stage definitions ──────────────────────────────────────────────────
// Ordered from top (widest) to bottom (narrowest) of the funnel.

interface FunnelStageDefinition {
  readonly stage:       FunnelStageKey;
  readonly label:       string;
  readonly description: string;
  readonly event:       string;
}

const FUNNEL_STAGES: readonly FunnelStageDefinition[] = [
  {
    stage:       "discovery",
    label:       "Product Discovery",
    description: "Customer visited a product detail page",
    event:       "product_detail_viewed",
  },
  {
    stage:       "quiz",
    label:       "Quiz Completion",
    description: "Customer completed the fragrance quiz",
    event:       "quiz_completed",
  },
  {
    stage:       "favourited",
    label:       "Saved a Fragrance",
    description: "Customer added a fragrance to favourites",
    event:       "favourite_toggled",
  },
  {
    stage:       "cart",
    label:       "Added to Cart",
    description: "Customer added a fragrance to the cart",
    event:       "add_to_cart",
  },
  {
    stage:       "checkout",
    label:       "Checkout Started",
    description: "Customer initiated the checkout flow",
    event:       "checkout_started",
  },
  {
    stage:       "purchase",
    label:       "Purchase Completed",
    description: "Customer completed a payment",
    event:       "payment_return_success",
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function safeRate(numerator: number | null, denominator: number | null): number | null {
  if (numerator === null || denominator === null || denominator === 0) return null;
  return Math.round((numerator / denominator) * 10_000) / 10_000;
}

function countForStage(
  stage:     FunnelStageKey,
  analytics: CustomerAnalyticsResult,
): number | null {
  switch (stage) {
    case "discovery":  return analytics.productDetailViews;
    case "quiz":       return analytics.quizCompletions;
    case "favourited": return analytics.favouritesAdded;
    case "cart":       return analytics.cartAdds;
    case "checkout":   return analytics.checkoutsStarted;
    case "purchase":   return analytics.purchaseCompletions;
  }
}

// ── Builders ──────────────────────────────────────────────────────────────────

function buildFunnelSteps(analytics: CustomerAnalyticsResult | null): readonly FunnelStep[] {
  const steps: FunnelStep[] = [];
  let previousCount: number | null = null;

  for (const def of FUNNEL_STAGES) {
    const count = analytics ? countForStage(def.stage, analytics) : null;
    const conversionFromPrevious = safeRate(count, previousCount);
    const dropOffRate            = conversionFromPrevious !== null
      ? Math.round((1 - conversionFromPrevious) * 10_000) / 10_000
      : null;

    steps.push({
      stage:                  def.stage,
      label:                  def.label,
      description:            def.description,
      event:                  def.event,
      count,
      conversionFromPrevious,
      dropOffRate,
    });

    previousCount = count;
  }

  return steps;
}

function buildDiscoveryBreakdown(analytics: CustomerAnalyticsResult | null): DiscoveryBreakdown {
  if (!analytics) {
    return {
      productDetailViews:    null,
      quizCompletions:       null,
      aiChatSessions:        null,
      discoveryModeBrowse:   null,
      discoveryModeAI:       null,
      discoveryModeCharacter: null,
      totalDiscoveryEvents:  null,
    };
  }

  const {
    productDetailViews,
    quizCompletions,
    aiChatSessions,
    discoveryModeBrowse,
    discoveryModeAI,
    discoveryModeCharacter,
  } = analytics;

  const totalDiscoveryEvents =
    (productDetailViews ?? 0) + (discoveryModeBrowse ?? 0) +
    (discoveryModeAI ?? 0) + (discoveryModeCharacter ?? 0) > 0
    ? (productDetailViews ?? 0) + (discoveryModeBrowse ?? 0) +
      (discoveryModeAI ?? 0) + (discoveryModeCharacter ?? 0)
    : null;

  return {
    productDetailViews,
    quizCompletions,
    aiChatSessions,
    discoveryModeBrowse,
    discoveryModeAI,
    discoveryModeCharacter,
    totalDiscoveryEvents,
  };
}

function buildEngagementMetrics(analytics: CustomerAnalyticsResult | null): EngagementMetrics {
  if (!analytics) {
    return {
      favouritesAdded:     null,
      cartAdds:            null,
      checkoutsStarted:    null,
      purchaseCompletions: null,
      quizCompletions:     null,
    };
  }
  return {
    favouritesAdded:     analytics.favouritesAdded,
    cartAdds:            analytics.cartAdds,
    checkoutsStarted:    analytics.checkoutsStarted,
    purchaseCompletions: analytics.purchaseCompletions,
    quizCompletions:     analytics.quizCompletions,
  };
}

// ── Public API ────────────────────────────────────────────────────────────────

export function buildCustomerBehaviourReport(
  analytics: CustomerAnalyticsResult | null,
  signals:   SignalCalibrationReport,
): CustomerBehaviourReport {
  return {
    funnelSteps:         buildFunnelSteps(analytics),
    discoveryBreakdown:  buildDiscoveryBreakdown(analytics),
    engagementMetrics:   buildEngagementMetrics(analytics),
    signalHealth:        signals,
    analyticsAvailable:  analytics !== null,
    analyticsWindowDays: analytics?.windowDays ?? 30,
    generatedAt:         new Date().toISOString(),
  };
}
