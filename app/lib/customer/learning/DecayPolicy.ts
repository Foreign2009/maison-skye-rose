/**
 * Customer Intelligence — Decay Policy
 *
 * Contract for time-based signal weight decay.
 * Older signals may contribute less to preference accumulation than recent
 * signals of the same dimension. Business rules for decay (recency half-life,
 * source-specific decay rates, etc.) belong to EP10.0-P5+.
 *
 * createNoDecayPolicy() is the safe default — all signals retain full weight.
 */

export interface DecayPolicyContract {
  /**
   * Returns a decay factor in [0.0, 1.0] for a signal at the given timestamp.
   * 1.0 = no decay (full weight retained).
   * 0.0 = fully decayed (signal contributes nothing).
   * now defaults to Date.now() when absent.
   */
  decayFactor(signalTimestamp: number, now?: number): number;
}

/** No-op policy — all signals retain full weight regardless of age. */
export function createNoDecayPolicy(): DecayPolicyContract {
  return {
    decayFactor: () => 1.0,
  };
}
