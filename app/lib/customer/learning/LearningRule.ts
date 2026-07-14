/**
 * Customer Intelligence — Learning Rule
 *
 * Contract for a discrete rule applied during signal interpretation.
 * A rule maps a specific signal pattern to one or more PreferenceCandidates.
 *
 * Rules are the unit of business logic within an interpreter. They are not
 * yet implemented — this contract defines the interface that EP10.0-P5+
 * rule implementations must satisfy.
 *
 * Integration points:
 *   BaseInterpreter     — rules are applied within interpret()
 *   LearningContext     — rules receive full context for cross-signal reasoning
 *   PreferenceCandidate — rules produce candidates as output
 */

import type { SignalSource }        from "../signals/SignalSource";
import type { SignalType }          from "../signals/SignalType";
import type { CustomerSignal }      from "../signals/CustomerSignal";
import type { LearningContext }     from "./LearningContext";
import type { PreferenceCandidate } from "./PreferenceCandidate";

export interface LearningRule {
  /** Human-readable name for logging and diagnostics. */
  readonly name:     string;
  /** Signal source this rule applies to. */
  readonly source:   SignalSource;
  /** Preference dimensions this rule can produce candidates for. */
  readonly produces: readonly SignalType[];
  /** Apply the rule to a signal and return zero or more preference candidates. */
  apply(
    signal:  CustomerSignal,
    context: LearningContext,
  ): readonly PreferenceCandidate[];
}
