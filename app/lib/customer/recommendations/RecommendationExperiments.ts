/**
 * Recommendation Intelligence — Experiment Registry
 *
 * Canonical registry of recommendation experiments for Maison Skye & Rose.
 * All functions are pure and read-only — no recommendation routing is changed.
 *
 * An experiment becomes effective only when:
 *   1. Its status transitions to "active"
 *   2. Traffic routing is implemented at the call site
 *
 * Experiments in "draft" status are metadata only. isExperimentEnabled()
 * returns false for every draft experiment, ensuring recommendation
 * behaviour is identical before and after this module is loaded.
 *
 * Integration points:
 *   admin/RecommendationPerformanceDashboard — experiment registry display
 *   admin/intelligence/page.tsx             — frameworkImplemented: true
 *   ExperimentPromotion.ts                  — lifecycle stage source of truth
 *   RecommendationQuality.ts               — canonical thresholds for success criteria
 *
 * Adding a new experiment:
 *   1. Append an entry to EXPERIMENT_REGISTRY below.
 *   2. Keep status "draft" until traffic routing is implemented.
 *   3. successCriteria thresholds must reference QUALITY_THRESHOLDS constants.
 */

import type { ExperimentLifecycleStage } from "./ExperimentPromotion";
import type { RecommendationStrategy }   from "./RecommendationStrategy";
import {
  QUALITY_THRESHOLDS,
  type QualityMetricKey,
} from "./RecommendationQuality";

// ── Success criterion ─────────────────────────────────────────────────────────

export interface ExperimentSuccessCriterion {
  readonly metric:       QualityMetricKey;
  readonly threshold:    number;
  readonly targetBand:   "Excellent" | "Healthy";
  readonly description:  string;
}

// ── Experiment model ──────────────────────────────────────────────────────────

export interface RecommendationExperiment {
  readonly id:                string;
  readonly displayName:       string;
  readonly description:       string;
  readonly hypothesis:        string;
  readonly baselineStrategy:  RecommendationStrategy;
  readonly candidateStrategy: RecommendationStrategy;
  readonly status:            ExperimentLifecycleStage;
  readonly createdDate:       string;
  readonly owner:             string;
  readonly successCriteria:   readonly ExperimentSuccessCriterion[];
  readonly targetSurfaces:    readonly string[];
  readonly notes:             string;
}

// ── Registry ──────────────────────────────────────────────────────────────────
// All experiments start in "draft". No routing is active.
// Transition to "active" requires traffic routing implementation at the call site.

const EXPERIMENT_REGISTRY: readonly RecommendationExperiment[] = [
  {
    id:                "exp-028-001",
    displayName:       "Trending Discovery Activation",
    description:       "Replace the discovery strategy with trending on high-traffic discovery surfaces to determine whether popularity signals produce higher engagement than exploration signals for cold-start visitors.",
    hypothesis:        "Cold-start visitors on discovery pages respond to social proof (trending) more strongly than to exploration diversity (discovery), producing higher CTR.",
    baselineStrategy:  "discovery",
    candidateStrategy: "trending",
    status:            "draft",
    createdDate:       "2026-07-23",
    owner:             "EP28",
    successCriteria: [
      {
        metric:      "ctr",
        threshold:   QUALITY_THRESHOLDS.ctr.healthy,
        targetBand:  "Healthy",
        description: "Click-through rate reaches ≥ 8% on candidate surfaces",
      },
    ],
    targetSurfaces: [
      "discover-intelligence",
      "new-arrivals-recommendation",
    ],
    notes: "Requires minimum 14-day observation window. Run against cold-start (no quiz, no saved) visitor segment only.",
  },
  {
    id:                "exp-028-002",
    displayName:       "Complementary PDP Cross-Sell",
    description:       "Replace the similarity strategy with complementary on the PDP recommendation surface to determine whether wardrobe-partner framing increases add-to-cart rate versus fragrance-similarity framing.",
    hypothesis:        "Customers on a PDP are in intent mode — complementary recommendations (wardrobe partners) produce higher cart adds than similar recommendations because they address a different need.",
    baselineStrategy:  "similar",
    candidateStrategy: "complementary",
    status:            "draft",
    createdDate:       "2026-07-23",
    owner:             "EP28",
    successCriteria: [
      {
        metric:      "addToCartRate",
        threshold:   QUALITY_THRESHOLDS.addToCartRate.healthy,
        targetBand:  "Healthy",
        description: "Add-to-cart rate reaches ≥ 3% on the PDP recommendation surface",
      },
      {
        metric:      "ctr",
        threshold:   QUALITY_THRESHOLDS.ctr.needsAttention,
        targetBand:  "Healthy",
        description: "CTR does not fall below 3% (parity threshold with baseline)",
      },
    ],
    targetSurfaces: [
      "pdp-recommendation",
    ],
    notes: "Requires minimum 7-day observation window. Exclude similar_to_saved reason type comparison — complementary uses wardrobe_partner reasons which are not directly comparable.",
  },
];

// ── Public API ────────────────────────────────────────────────────────────────

export function listExperiments(): readonly RecommendationExperiment[] {
  return EXPERIMENT_REGISTRY;
}

export function getExperiment(id: string): RecommendationExperiment | null {
  return EXPERIMENT_REGISTRY.find((e) => e.id === id) ?? null;
}

export function isExperimentEnabled(id: string): boolean {
  const experiment = getExperiment(id);
  return experiment?.status === "active";
}

export function getBaselineStrategy(id: string): RecommendationStrategy | null {
  return getExperiment(id)?.baselineStrategy ?? null;
}

export function listActiveExperiments(): readonly RecommendationExperiment[] {
  return EXPERIMENT_REGISTRY.filter((e) => e.status === "active");
}

export function listByStatus(
  status: ExperimentLifecycleStage,
): readonly RecommendationExperiment[] {
  return EXPERIMENT_REGISTRY.filter((e) => e.status === status);
}
