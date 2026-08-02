/**
 * Customer Intelligence — Confidence Calculator
 *
 * Contract for deriving a SignalConfidence from a set of PreferenceCandidates
 * that share the same dimension value. Used by PreferenceAccumulator to assign
 * a confidence tier to each accumulated group.
 *
 * Two implementations are provided:
 *   createMaxConfidenceCalculator()      — single strongest signal wins (safe default)
 *   createCompositingCalculator()        — accumulated weight sum; multiple weak
 *                                          signals compound into a stronger tier (EP20-P3)
 *
 * Compositing thresholds (derived from CONFIDENCE_WEIGHT in SignalConfidence.ts):
 *   sum >= 1.0 → HIGH
 *   sum >= 0.6 → MEDIUM
 *   otherwise  → LOW
 */

import type { SignalConfidence }    from "../signals/SignalConfidence";
import type { PreferenceCandidate } from "./PreferenceCandidate";
import { CONFIDENCE_WEIGHT }        from "../signals/SignalConfidence";

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

/**
 * Compositing calculator: sums CONFIDENCE_WEIGHT across all contributing
 * candidates and promotes the group tier when independent signals accumulate.
 * Two MEDIUM signals (0.6 + 0.6 = 1.2) resolve to HIGH.
 * Two LOW signals (0.3 + 0.3 = 0.6) resolve to MEDIUM.
 */
export function createCompositingCalculator(): ConfidenceCalculatorContract {
  return {
    calculate(candidates: readonly PreferenceCandidate[]): SignalConfidence {
      if (candidates.length === 0) return "LOW";
      const sum = candidates.reduce((acc, c) => acc + CONFIDENCE_WEIGHT[c.confidence], 0);
      if (sum >= 1.0) return "HIGH";
      if (sum >= 0.6) return "MEDIUM";
      return "LOW";
    },
  };
}
