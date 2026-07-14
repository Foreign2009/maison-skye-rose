/**
 * Customer Intelligence — Preference Candidate
 *
 * Atomic output unit of every SignalInterpreter.
 * A candidate represents a single preference signal extracted from a CustomerSignal.
 * Candidates are intermediate — they are accumulated and resolved by the
 * LearningEngine before contributing to the customer preference model.
 *
 * Integration points:
 *   BaseInterpreter       — produces candidates via interpret()
 *   PreferenceAccumulator — groups candidates by dimension + value + polarity
 *   PreferenceResolver    — resolves grouped candidates to a final set
 */

import type { SignalType }       from "../signals/SignalType";
import type { SignalConfidence } from "../signals/SignalConfidence";
import type { CustomerSignal }   from "../signals/CustomerSignal";

export interface PreferenceCandidate {
  /** The preference dimension this candidate addresses. */
  readonly type:       SignalType;
  /** The dimension value, e.g. "Woody" for family_preference. */
  readonly value:      string;
  /** Confidence tier inherited from the source signal. */
  readonly confidence: SignalConfidence;
  /** The signal that produced this candidate — enables full provenance tracing. */
  readonly signal:     CustomerSignal;
  /** true = preference (like); false = avoidance (dislike). */
  readonly positive:   boolean;
  /** Optional interpreter-specific diagnostic context. */
  readonly context?:   Readonly<Record<string, unknown>>;
}
