/**
 * Customer Intelligence — Base Interpreter
 *
 * Abstract class that all signal interpreters extend.
 * Mirrors BaseProducer from the Knowledge Factory — the template method
 * pattern ensures concrete interpreters override only interpret().
 *
 * canInterpret() is concrete — defaults to source match. Override to add
 * signal type or payload filtering without touching the lifecycle.
 *
 * interpret() is abstract — concrete classes own signal extraction.
 * It must be pure: no I/O, no side effects, no stored state.
 *
 * Integration points:
 *   LearningEngine    — holds a registry of BaseInterpreter instances
 *   SignalInterpreter — 8 concrete placeholder implementations
 *   LearningContext   — passed to interpret() on every invocation
 *   PreferenceCandidate — return type of interpret()
 */

import type { CustomerSignal }      from "../signals/CustomerSignal";
import type { SignalSource }        from "../signals/SignalSource";
import type { LearningContext }     from "./LearningContext";
import type { PreferenceCandidate } from "./PreferenceCandidate";

export abstract class BaseInterpreter {
  /** Source surface this interpreter handles. */
  abstract readonly source: SignalSource;

  /**
   * Returns true when this interpreter should process the signal.
   * Default: source match only.
   * Override to add type-level or payload-level filtering.
   */
  canInterpret(signal: CustomerSignal): boolean {
    return signal.source === this.source;
  }

  /**
   * Extract preference candidates from a signal.
   * Concrete interpreters override only this method.
   * Must be pure — no I/O, no side effects, no stored state.
   */
  abstract interpret(
    signal:  CustomerSignal,
    context: LearningContext,
  ): readonly PreferenceCandidate[];
}
