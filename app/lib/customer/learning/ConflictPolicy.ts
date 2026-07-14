/**
 * Customer Intelligence — Conflict Policy
 *
 * Contract for resolving contradicting preference candidates.
 * A conflict occurs when a customer's signals express both preference and
 * avoidance for the same dimension value (e.g. "I like Woody" and
 * "Avoid Woody" inferred from different signals).
 *
 * Business rules for conflict resolution belong to EP10.0-P5+.
 * createLatestWinsPolicy() is the safe default — the most recent signal wins.
 */

import type { PreferenceCandidate } from "./PreferenceCandidate";

export type ConflictResolution =
  | "prefer_positive"
  | "prefer_negative"
  | "prefer_latest"
  | "prefer_highest_confidence";

export interface ConflictPolicyContract {
  /**
   * Resolve a conflict between positive and negative candidates
   * that share the same dimension value.
   */
  resolve(
    positive: readonly PreferenceCandidate[],
    negative: readonly PreferenceCandidate[],
  ): ConflictResolution;
}

/** Latest-wins: the most recently signalled polarity takes precedence. */
export function createLatestWinsPolicy(): ConflictPolicyContract {
  return {
    resolve(
      positive: readonly PreferenceCandidate[],
      negative: readonly PreferenceCandidate[],
    ): ConflictResolution {
      const latestPositive = positive.reduce(
        (max, c) => Math.max(max, c.signal.timestamp),
        0,
      );
      const latestNegative = negative.reduce(
        (max, c) => Math.max(max, c.signal.timestamp),
        0,
      );
      return latestNegative > latestPositive ? "prefer_negative" : "prefer_positive";
    },
  };
}
