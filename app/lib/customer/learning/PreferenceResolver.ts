/**
 * Customer Intelligence — Preference Resolver
 *
 * Converts AccumulatedPreference groups into a final resolved set of
 * PreferenceCandidates — one representative per dimension + value pair.
 *
 * The resolver handles conflict resolution (same value, opposing polarity)
 * and selects a representative candidate from each group.
 *
 * Two implementations are provided:
 *   createPassthroughResolver()  — returns the first candidate from each group;
 *                                  discards the accumulated confidence (safe default)
 *   createAccumulatedResolver()  — returns the first candidate with confidence
 *                                  replaced by the group-level accumulated value (EP20-P3)
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

/**
 * Accumulated resolver — returns the first candidate from each group with
 * confidence replaced by the group-level accumulated confidence.
 * All other fields (type, value, positive, signal, context) are preserved.
 */
export function createAccumulatedResolver(): PreferenceResolverContract {
  return {
    resolve(
      accumulated: readonly AccumulatedPreference[],
    ): readonly PreferenceCandidate[] {
      return accumulated
        .filter((a) => a.candidates.length > 0)
        .map((a) => ({ ...a.candidates[0], confidence: a.confidence }));
    },
  };
}
