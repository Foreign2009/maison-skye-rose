/**
 * Customer Intelligence — Signal Calibration
 *
 * Static analysis of signal utilization across the recommendation system.
 * Encodes which signal sources and types actually influence scoring and
 * reason generation, making implicit architecture explicitly observable.
 *
 * buildSignalCalibrationReport() is a pure, zero-argument function.
 * It reads no customer data. Output is deterministic per codebase state.
 *
 * Integration points:
 *   admin/intelligence/page.tsx   — calls buildSignalCalibrationReport()
 *   admin/IntelligenceDashboard   — renders SignalIntelligenceSection
 *   PreferenceScorer              — source of utilization facts (not imported)
 *   RecommendationReasonBuilder   — source of reason type facts (not imported)
 */

import type { SignalSource } from "./SignalSource";
import type { SignalType }   from "./SignalType";

// ── Status taxonomy ───────────────────────────────────────────────────────────

// active:      emits signals + full scoring and/or reason path
// partial:     emits signals; scoring or reason path is missing or limited
// placeholder: reserved; no emission path implemented
// dead:        type defined; no scoring or reason consumer exists

export type SignalUtilizationStatus = "active" | "partial" | "placeholder" | "dead";

// ── Per-source health ─────────────────────────────────────────────────────────

export interface SignalSourceHealth {
  readonly source:             SignalSource;
  readonly status:             SignalUtilizationStatus;
  readonly usedInScoring:      boolean;
  readonly usedInReasons:      boolean;
  readonly enabledReasonTypes: readonly string[];
  readonly scoringPath:        string;
  readonly description:        string;
}

// ── Per-type health ───────────────────────────────────────────────────────────

export interface SignalTypeHealth {
  readonly type:            SignalType;
  readonly status:          SignalUtilizationStatus;
  readonly usedInScoring:   boolean;
  readonly usedInReasons:   boolean;
  readonly scoresDimension: string | null;
  readonly description:     string;
}

// ── Calibration report ────────────────────────────────────────────────────────

export interface SignalCalibrationReport {
  readonly generatedAt:          string;
  readonly sourceHealth:         readonly SignalSourceHealth[];
  readonly typeHealth:           readonly SignalTypeHealth[];
  readonly activeSources:        readonly SignalSource[];
  readonly unusedSources:        readonly SignalSource[];
  readonly activeTypes:          readonly SignalType[];
  readonly deadTypes:            readonly SignalType[];
  readonly confidenceWeightUsed: boolean;
  readonly signalsArrayConsumed: boolean;
}

// ── Static knowledge tables ───────────────────────────────────────────────────
// Derived by reading PreferenceScorer.ts and RecommendationReasonBuilder.ts.
// Update these tables when signal consumption changes.

const SIGNAL_SOURCE_HEALTH: readonly SignalSourceHealth[] = [
  {
    source:             "quiz",
    status:             "active",
    usedInScoring:      true,
    usedInReasons:      true,
    enabledReasonTypes: ["quiz_match", "family_match", "occasion_match", "season_match"],
    scoringPath:        "quiz → lastQuizSlugs → PreferenceScorer (all dimensions)",
    description:        "Quiz answers populate lastQuizSlugs — drives family, occasion, season, and gender scoring across all profile dimensions.",
  },
  {
    source:             "favorite",
    status:             "active",
    usedInScoring:      true,
    usedInReasons:      true,
    enabledReasonTypes: ["similar_to_saved", "family_match", "collection_affinity", "wardrobe_partner"],
    scoringPath:        "favorite → savedSlugs → PreferenceScorer (all dimensions)",
    description:        "Saved fragrances populate savedSlugs — primary intent signal, drives all profile scoring dimensions.",
  },
  {
    source:             "view",
    status:             "partial",
    usedInScoring:      true,
    usedInReasons:      true,
    enabledReasonTypes: ["similar_to_viewed", "family_match"],
    scoringPath:        "view → recentlyViewed → broadSlugs (families only)",
    description:        "Viewed fragrances enter broadSlugs alongside savedSlugs and lastQuizSlugs. Contributes to family scoring only — not occasions, seasons, or gender.",
  },
  {
    source:             "cart",
    status:             "partial",
    usedInScoring:      false,
    usedInReasons:      false,
    enabledReasonTypes: [],
    scoringPath:        "cart → signals[] — no PreferenceScorer path",
    description:        "Cart signals are captured into profile.signals[] but PreferenceScorer reads only slug arrays. Cart adds have no scoring or reason effect.",
  },
  {
    source:             "search",
    status:             "partial",
    usedInScoring:      false,
    usedInReasons:      false,
    enabledReasonTypes: [],
    scoringPath:        "search → signals[] — search_query type not consumed",
    description:        "Search query signals are captured but the search_query signal type has no path into PreferenceScorer or RecommendationReasonBuilder.",
  },
  {
    source:             "concierge",
    status:             "placeholder",
    usedInScoring:      false,
    usedInReasons:      false,
    enabledReasonTypes: [],
    scoringPath:        "no emission path",
    description:        "Concierge source reserved — no signal emission path implemented.",
  },
  {
    source:             "purchase",
    status:             "placeholder",
    usedInScoring:      false,
    usedInReasons:      false,
    enabledReasonTypes: [],
    scoringPath:        "no emission path",
    description:        "Purchase source reserved — no emission path implemented. CONFIDENCE_WEIGHT defines HIGH tier for future use.",
  },
  {
    source:             "discovery",
    status:             "placeholder",
    usedInScoring:      false,
    usedInReasons:      false,
    enabledReasonTypes: [],
    scoringPath:        "no emission path",
    description:        "Discovery source reserved — no signal emission path implemented.",
  },
];

const SIGNAL_TYPE_HEALTH: readonly SignalTypeHealth[] = [
  {
    type:            "family_preference",
    status:          "active",
    usedInScoring:   true,
    usedInReasons:   true,
    scoresDimension: "families",
    description:     "Quiz-derived family signal — populates lastQuizSlugs, contributes to all profile dimensions.",
  },
  {
    type:            "character_preference",
    status:          "active",
    usedInScoring:   true,
    usedInReasons:   true,
    scoresDimension: "families",
    description:     "Quiz-derived character signal — contributes via lastQuizSlugs to family and related scoring.",
  },
  {
    type:            "occasion_preference",
    status:          "active",
    usedInScoring:   true,
    usedInReasons:   true,
    scoresDimension: "occasions",
    description:     "Quiz-derived occasion signal — drives occasion scoring and occasion_match reason generation.",
  },
  {
    type:            "season_preference",
    status:          "active",
    usedInScoring:   true,
    usedInReasons:   true,
    scoresDimension: "seasons",
    description:     "Quiz-derived season signal — drives season scoring and season_match reason generation.",
  },
  {
    type:            "gender_preference",
    status:          "active",
    usedInScoring:   true,
    usedInReasons:   false,
    scoresDimension: "gender",
    description:     "Quiz-derived gender signal — drives gender scoring. No dedicated reason type; match is reflected in profile score only.",
  },
  {
    type:            "fragrance_save",
    status:          "active",
    usedInScoring:   true,
    usedInReasons:   true,
    scoresDimension: "families, occasions, seasons, gender",
    description:     "Favorite action — primary intent signal via savedSlugs, drives all profile dimensions and most reason types.",
  },
  {
    type:            "fragrance_engagement",
    status:          "active",
    usedInScoring:   true,
    usedInReasons:   true,
    scoresDimension: "families",
    description:     "View action — supplementary signal via recentlyViewed, contributes to family scoring and similar_to_viewed reasons only.",
  },
  {
    type:            "search_query",
    status:          "dead",
    usedInScoring:   false,
    usedInReasons:   false,
    scoresDimension: null,
    description:     "Search signals captured — no scoring consumer. Candidate for future search-intent preference weighting.",
  },
  {
    type:            "fragrance_purchase",
    status:          "dead",
    usedInScoring:   false,
    usedInReasons:   false,
    scoresDimension: null,
    description:     "Purchase type defined with HIGH confidence tier — no emission path or scoring consumer yet implemented.",
  },
  {
    type:            "family_avoidance",
    status:          "dead",
    usedInScoring:   false,
    usedInReasons:   false,
    scoresDimension: null,
    description:     "Avoidance signal captured — avoidance scoring is not modelled in PreferenceScorer or scoring weights.",
  },
  {
    type:            "note_preference",
    status:          "dead",
    usedInScoring:   false,
    usedInReasons:   false,
    scoresDimension: null,
    description:     "Note-level preference captured — no note dimension in PreferenceScorer. Family is the finest scoring granularity.",
  },
  {
    type:            "note_avoidance",
    status:          "dead",
    usedInScoring:   false,
    usedInReasons:   false,
    scoresDimension: null,
    description:     "Note avoidance captured — avoidance scoring not modelled. No avoidance dimension exists.",
  },
  {
    type:            "budget_preference",
    status:          "dead",
    usedInScoring:   false,
    usedInReasons:   false,
    scoresDimension: null,
    description:     "Budget preference captured — no price-based scoring dimension in PreferenceScorer or WeightedRecommendationScorer.",
  },
  {
    type:            "collection_affinity",
    status:          "dead",
    usedInScoring:   false,
    usedInReasons:   false,
    scoresDimension: null,
    description:     "Signal captured — but the collection_affinity reason is derived directly from savedSlugs counting, making this signal redundant.",
  },
  {
    type:            "discovery_path",
    status:          "dead",
    usedInScoring:   false,
    usedInReasons:   false,
    scoresDimension: null,
    description:     "Discovery path signal captured — the discovery_pathway reason fires on strategy === 'discovery' + catalogue score, not on this signal.",
  },
];

// ── Public API ────────────────────────────────────────────────────────────────

export function buildSignalCalibrationReport(): SignalCalibrationReport {
  const activeSources = SIGNAL_SOURCE_HEALTH
    .filter((e) => e.usedInScoring || e.usedInReasons)
    .map((e) => e.source);

  const unusedSources = SIGNAL_SOURCE_HEALTH
    .filter((e) => !e.usedInScoring && !e.usedInReasons)
    .map((e) => e.source);

  const activeTypes = SIGNAL_TYPE_HEALTH
    .filter((e) => e.usedInScoring || e.usedInReasons)
    .map((e) => e.type);

  const deadTypes = SIGNAL_TYPE_HEALTH
    .filter((e) => !e.usedInScoring && !e.usedInReasons)
    .map((e) => e.type);

  return {
    generatedAt:          new Date().toISOString(),
    sourceHealth:         SIGNAL_SOURCE_HEALTH,
    typeHealth:           SIGNAL_TYPE_HEALTH,
    activeSources,
    unusedSources,
    activeTypes,
    deadTypes,
    confidenceWeightUsed: false,
    signalsArrayConsumed: false,
  };
}
