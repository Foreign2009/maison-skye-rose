/**
 * Customer Intelligence — Confidence Calculator
 *
 * Contract for deriving a SignalConfidence from a set of PreferenceCandidates
 * that share the same dimension value. Used by PreferenceAccumulator to assign
 * a confidence tier to each accumulated group.
 *
 * Business rules for confidence compositing (e.g. two MEDIUM → HIGH) belong
 * to EP10.0-P5+. createMaxConfidenceCalculator() is the safe default.
 */

import type { SignalConfidence }    from "../signals/SignalConfidence";
import type { PreferenceCandidate } from "./PreferenceCandidate";

export interface ConfidenceCalculatorContract {
  /**
   * Derive a single SignalConfidence from a set of candidates
   * that share the same dimension value.
   */
  calculate(candidates: readonly PreferenceCandidate[]): SignalConfidence;
}

const CONFIDENCE_RANK: Readonly<Record<SignalConfidence, number>> = {
  HIGH:   2,
  MEDIUM: 1,
  LOW:    0,
};

/** Maximum-wins: the single strongest contributing signal determines the tier. */
export function createMaxConfidenceCalculator(): ConfidenceCalculatorContract {
  return {
    calculate(candidates: readonly PreferenceCandidate[]): SignalConfidence {
      if (candidates.length === 0) return "LOW";
      return candidates.reduce<SignalConfidence>(
        (best, c) =>
          CONFIDENCE_RANK[c.confidence] > CONFIDENCE_RANK[best]
            ? c.confidence
            : best,
        "LOW",
      );
    },
  };
}
