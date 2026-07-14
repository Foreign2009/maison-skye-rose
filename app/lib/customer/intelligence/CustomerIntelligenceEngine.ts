/**
 * Customer Intelligence Engine (CIE)
 *
 * Stateless orchestration module. All public functions are pure — same inputs
 * produce the same outputs, no stored state, no side effects.
 *
 * Architectural contrast with the Knowledge Intelligence Engine (KIE):
 *   KIE  — module-level CATALOGUE_INDEX precomputed once (static data)
 *   CIE  — no module-level state; profiles are dynamic, per-customer
 *
 * Computation is performed inside each function call. Each builder
 * receives a shared `now` timestamp so sub-objects within one call
 * carry a consistent generatedAt value.
 *
 * Public API:
 *   getCustomerSummary          — lightweight projection
 *   getCustomerStatistics       — raw counted metrics
 *   getCustomerAffinity         — dominant source / type
 *   getCustomerJourney          — journey stage + profile flags
 *   getCustomerConfidence       — confidence distribution
 *   getCustomerPreferenceSummary — learned preferences (empty until EP10.0-P5+)
 *   getCustomerIntelligence     — medium-weight: summary + journey + affinity
 *   getCustomerInsights         — full aggregate including synthesised insights
 *
 * Integration points:
 *   UnifiedCustomerProfile — sole input to all public functions
 *   LearningEngine         — run() wired for preference extraction (candidates empty until P5+)
 *   CustomerLookup         — deriveCustomerId used on every call
 */

import type { UnifiedCustomerProfile }    from "../profile/UnifiedCustomerProfile";
import type { CustomerIntelligence }      from "./CustomerIntelligence";
import type { CustomerSummary }           from "./CustomerSummary";
import type { CustomerInsights }          from "./CustomerInsights";
import type { CustomerAffinity }          from "./CustomerAffinity";
import type { CustomerJourney }           from "./CustomerJourney";
import type { CustomerJourneyStage }      from "./CustomerJourney";
import type { CustomerStatistics }        from "./CustomerStatistics";
import type { CustomerConfidence }        from "./CustomerConfidence";
import type { CustomerPreferenceSummary } from "./CustomerPreferenceSummary";
import type { CustomerInsight }           from "./CustomerInsight";
import { buildCustomerSummary }           from "./CustomerSummary";
import { buildCustomerStatistics }        from "./CustomerStatistics";
import { buildCustomerAffinity }          from "./CustomerAffinity";
import { buildCustomerJourney }           from "./CustomerJourney";
import { buildCustomerConfidence }        from "./CustomerConfidence";
import { buildCustomerPreferenceSummary } from "./CustomerPreferenceSummary";
import { deriveCustomerId }               from "./CustomerLookup";
import { createDefaultLearningEngine }    from "../learning/LearningEngine";

// ── Internal helpers ───────────────────────────────────────────────────────────

function runPreferenceLearning(
  profile: UnifiedCustomerProfile,
  now:     number,
) {
  const engine   = createDefaultLearningEngine();
  const result   = engine.run(profile.signals, {
    batchSignals: profile.signals,
    runAt:        now,
  });
  return result.success ? result.candidates : [];
}

function deriveInsights(
  journey:    CustomerJourney,
  stats:      CustomerStatistics,
  confidence: CustomerConfidence,
): readonly CustomerInsight[] {
  const insights: CustomerInsight[] = [];

  const stageDescriptions: Record<CustomerJourneyStage, string> = {
    new:        "Customer has not yet interacted with the catalogue",
    exploring:  "Customer is actively browsing and discovering fragrances",
    engaged:    "Customer has expressed clear intent — saved, quizzed, or added to cart",
    converting: "Customer has completed a purchase",
  };

  insights.push({
    type:                   "journey_stage",
    description:            stageDescriptions[journey.stage],
    confidence:             journey.hasSignals ? "MEDIUM" : "LOW",
    supportingSignalCount:  stats.totalSignals,
  });

  if (stats.totalSignals > 0) {
    const richness =
      stats.totalSignals >= 10 ? "rich" :
      stats.totalSignals >= 3  ? "moderate" :
      "early";
    insights.push({
      type:                   "signal_richness",
      description:            `Signal data is ${richness} — ${stats.totalSignals} signal${stats.totalSignals === 1 ? "" : "s"} collected`,
      confidence:             confidence.overallConfidence,
      supportingSignalCount:  stats.totalSignals,
    });
  }

  if (journey.hasViewed || journey.hasSaved) {
    const viewCount = stats.recentlyViewedCount;
    insights.push({
      type:                   "engagement_depth",
      description:            `Customer has viewed ${viewCount} fragrance${viewCount === 1 ? "" : "s"}${journey.hasSaved ? " and saved favourites" : ""}`,
      confidence:             "MEDIUM",
      supportingSignalCount:  viewCount,
    });
  }

  return insights;
}

// ── Public API ─────────────────────────────────────────────────────────────────

export function getCustomerSummary(
  profile: UnifiedCustomerProfile,
): CustomerSummary {
  const now        = Date.now();
  const customerId = deriveCustomerId(profile);
  return buildCustomerSummary(customerId, profile, now);
}

export function getCustomerStatistics(
  profile: UnifiedCustomerProfile,
): CustomerStatistics {
  const now        = Date.now();
  const customerId = deriveCustomerId(profile);
  return buildCustomerStatistics(customerId, profile, now);
}

export function getCustomerAffinity(
  profile: UnifiedCustomerProfile,
): CustomerAffinity {
  const now        = Date.now();
  const customerId = deriveCustomerId(profile);
  const stats      = buildCustomerStatistics(customerId, profile, now);
  return buildCustomerAffinity(customerId, stats, now);
}

export function getCustomerJourney(
  profile: UnifiedCustomerProfile,
): CustomerJourney {
  const now        = Date.now();
  const customerId = deriveCustomerId(profile);
  const stats      = buildCustomerStatistics(customerId, profile, now);
  return buildCustomerJourney(customerId, profile, stats, now);
}

export function getCustomerConfidence(
  profile: UnifiedCustomerProfile,
): CustomerConfidence {
  const now        = Date.now();
  const customerId = deriveCustomerId(profile);
  const stats      = buildCustomerStatistics(customerId, profile, now);
  return buildCustomerConfidence(customerId, stats, now);
}

export function getCustomerPreferenceSummary(
  profile: UnifiedCustomerProfile,
): CustomerPreferenceSummary {
  const now        = Date.now();
  const customerId = deriveCustomerId(profile);
  const candidates = runPreferenceLearning(profile, now);
  return buildCustomerPreferenceSummary(customerId, candidates, now);
}

export function getCustomerIntelligence(
  profile: UnifiedCustomerProfile,
): CustomerIntelligence {
  const now        = Date.now();
  const customerId = deriveCustomerId(profile);
  const stats      = buildCustomerStatistics(customerId, profile, now);

  return {
    customerId,
    generatedAt: now,
    summary:     buildCustomerSummary(customerId, profile, now),
    journey:     buildCustomerJourney(customerId, profile, stats, now),
    affinity:    buildCustomerAffinity(customerId, stats, now),
  };
}

export function getCustomerInsights(
  profile: UnifiedCustomerProfile,
): CustomerInsights {
  const now        = Date.now();
  const customerId = deriveCustomerId(profile);

  // Single stats pass shared across all builders
  const stats      = buildCustomerStatistics(customerId, profile, now);
  const affinity   = buildCustomerAffinity(customerId, stats, now);
  const journey    = buildCustomerJourney(customerId, profile, stats, now);
  const confidence = buildCustomerConfidence(customerId, stats, now);

  // Preference learning — candidates empty until EP10.0-P5+ interpreter rules are added
  const candidates  = runPreferenceLearning(profile, now);
  const preferences = buildCustomerPreferenceSummary(customerId, candidates, now);

  const summary  = buildCustomerSummary(customerId, profile, now, preferences.hasPreferences);
  const insights = deriveInsights(journey, stats, confidence);

  return {
    customerId,
    generatedAt: now,
    summary,
    preferences,
    affinity,
    journey,
    confidence,
    insights,
  };
}
