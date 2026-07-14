/**
 * Customer Intelligence — Preference Accumulator
 *
 * Groups PreferenceCandidates by dimension + value + polarity and counts
 * how many independent signals support each preference.
 *
 * The accumulator is purely structural: it does not compute weights, apply
 * decay, or resolve conflicts — those belong to later lifecycle steps.
 * A ConfidenceCalculator is injected to derive group confidence.
 *
 * Integration points:
 *   LearningEngine           — calls accumulate() after interpretation
 *   PreferenceResolver       — consumes AccumulatedPreference[]
 *   ConfidenceCalculator     — injected for group confidence derivation
 */

import type { SignalType }          from "../signals/SignalType";
import type { SignalConfidence }     from "../signals/SignalConfidence";
import type { PreferenceCandidate } from "./PreferenceCandidate";
import type { ConfidenceCalculatorContract } from "./ConfidenceCalculator";
import { createMaxConfidenceCalculator }     from "./ConfidenceCalculator";

export interface AccumulatedPreference {
  readonly type:       SignalType;
  readonly value:      string;
  readonly positive:   boolean;
  /** All contributing candidates for this group. */
  readonly candidates: readonly PreferenceCandidate[];
  /** Number of independent signals in this group. */
  readonly count:      number;
  /** Confidence derived by the injected ConfidenceCalculator. */
  readonly confidence: SignalConfidence;
}

export interface PreferenceAccumulatorContract {
  accumulate(
    candidates: readonly PreferenceCandidate[],
  ): readonly AccumulatedPreference[];
}

export function createDefaultAccumulator(
  calculator: ConfidenceCalculatorContract = createMaxConfidenceCalculator(),
): PreferenceAccumulatorContract {
  return {
    accumulate(
      candidates: readonly PreferenceCandidate[],
    ): readonly AccumulatedPreference[] {
      const groups = new Map<string, PreferenceCandidate[]>();

      for (const candidate of candidates) {
        const key   = `${candidate.type}:${candidate.value}:${String(candidate.positive)}`;
        const group = groups.get(key) ?? [];
        group.push(candidate);
        groups.set(key, group);
      }

      const result: AccumulatedPreference[] = [];
      for (const group of groups.values()) {
        result.push({
          type:       group[0].type,
          value:      group[0].value,
          positive:   group[0].positive,
          candidates: group,
          count:      group.length,
          confidence: calculator.calculate(group),
        });
      }

      return result;
    },
  };
}
