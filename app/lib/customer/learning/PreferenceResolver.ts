/**
 * Customer Intelligence — Preference Resolver
 *
 * Converts AccumulatedPreference groups into a final resolved set of
 * PreferenceCandidates — one representative per dimension + value pair.
 *
 * The resolver handles conflict resolution (same value, opposing polarity)
 * and selects a representative candidate from each group.
 *
 * createPassthroughResolver() is the safe default — it returns the first
 * candidate from each group without conflict handling.
 *
 * Integration points:
 *   LearningEngine        — calls resolve() after accumulation
 *   PreferenceAccumulator — produces AccumulatedPreference[] input
 *   ConflictPolicy        — injected into resolvers that handle conflicts
 */

import type { PreferenceCandidate }  from "./PreferenceCandidate";
import type { AccumulatedPreference } from "./PreferenceAccumulator";

export interface PreferenceResolverContract {
  resolve(
    accumulated: readonly AccumulatedPreference[],
  ): readonly PreferenceCandidate[];
}

/** Pass-through resolver — returns the first candidate from each group. No conflict handling. */
export function createPassthroughResolver(): PreferenceResolverContract {
  return {
    resolve(
      accumulated: readonly AccumulatedPreference[],
    ): readonly PreferenceCandidate[] {
      return accumulated
        .filter((a) => a.candidates.length > 0)
        .map((a) => a.candidates[0]);
    },
  };
}
