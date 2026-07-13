/**
 * Knowledge Lifecycle Manager — Job Types
 *
 * All shared types for the Lifecycle Manager.
 * No business logic lives here.
 */

export type LifecycleReason =
  | "factory_version_drift"
  | "prompt_version_drift"
  | "rejected_review"
  | "needs_regeneration"
  | "failed_promotion"
  | "failed_generation"
  | "missing_draft"
  | "missing_discovery"
  | "missing_relationships"
  | "missing_education"
  | "validation_regression";

export type LifecycleSeverity = "critical" | "warning" | "info";

export type LifecycleAction =
  | "regenerate"
  | "re_review"
  | "re_promote"
  | "validate";

export interface LifecycleJob {
  id:                string;   // deterministic: "${slug}::${reason}"
  slug:              string;
  name:              string;
  collection:        "Skye" | "Rose" | "Elite";
  reason:            LifecycleReason;
  severity:          LifecycleSeverity;
  recommendedAction: LifecycleAction;
  detectedAt:        string;
  details:           string;
}

// ── Derived metadata ──────────────────────────────────────────────────────────

export const SEVERITY_ORDER: Record<LifecycleSeverity, number> = {
  critical: 0,
  warning:  1,
  info:     2,
};

export const REASON_SEVERITY: Record<LifecycleReason, LifecycleSeverity> = {
  rejected_review:       "critical",
  needs_regeneration:    "critical",
  failed_promotion:      "critical",
  failed_generation:     "critical",
  validation_regression: "critical",
  factory_version_drift: "warning",
  prompt_version_drift:  "warning",
  missing_discovery:     "info",
  missing_relationships: "info",
  missing_education:     "info",
  missing_draft:         "info",
};

export const REASON_ACTION: Record<LifecycleReason, LifecycleAction> = {
  rejected_review:       "re_review",
  needs_regeneration:    "regenerate",
  failed_promotion:      "re_promote",
  failed_generation:     "regenerate",
  validation_regression: "validate",
  factory_version_drift: "regenerate",
  prompt_version_drift:  "regenerate",
  missing_discovery:     "regenerate",
  missing_relationships: "regenerate",
  missing_education:     "regenerate",
  missing_draft:         "regenerate",
};

// ── Reason groupings ──────────────────────────────────────────────────────────

export const STALE_REASONS: Set<LifecycleReason> = new Set([
  "factory_version_drift",
  "prompt_version_drift",
]);

export const FAILED_REASONS: Set<LifecycleReason> = new Set([
  "failed_generation",
  "failed_promotion",
  "validation_regression",
]);

export const REJECTED_REASONS: Set<LifecycleReason> = new Set([
  "rejected_review",
  "needs_regeneration",
]);
