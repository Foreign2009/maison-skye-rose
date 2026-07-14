/**
 * Customer Intelligence — Signal Confidence
 *
 * Confidence tier for a CustomerSignal.
 *
 * Rules:
 *   HIGH   — explicit customer statement (quiz answer, spoken preference, purchase)
 *   MEDIUM — strong behavioral signal (search query, cart add, save/favorite)
 *   LOW    — weak behavioral signal (PDP view, discovery path visit)
 *
 * Compounding: multiple LOW signals for the same dimension accumulate into MEDIUM;
 * multiple MEDIUM into HIGH. PreferenceLearningEngine owns this logic.
 */

export type SignalConfidence = "HIGH" | "MEDIUM" | "LOW";

export const SIGNAL_CONFIDENCES: readonly SignalConfidence[] = [
  "HIGH",
  "MEDIUM",
  "LOW",
] as const;

export const CONFIDENCE_WEIGHT: Readonly<Record<SignalConfidence, number>> = {
  HIGH:   1.0,
  MEDIUM: 0.6,
  LOW:    0.3,
};
