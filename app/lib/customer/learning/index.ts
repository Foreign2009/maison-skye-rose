/**
 * Customer Intelligence — Preference Learning Public Surface
 *
 * Single import point for all Preference Learning Framework consumers.
 *
 * Core types:
 *   PreferenceCandidate      — atomic interpreter output (type, value, confidence, polarity, signal)
 *   LearningContext          — context passed to every interpreter in a run
 *   LearningRule             — contract for future rule implementations (EP10.0-P5+)
 *   LearningMetrics          — measurement data from a learning run
 *   LearningResult           — discriminated union: success | failure
 *   LearningLogEntry         — single log entry structure
 *   AccumulatedPreference    — grouped candidates (type + value + polarity + count + confidence)
 *   ConflictResolution       — resolution outcome type
 *
 * Contract interfaces:
 *   LearningLoggerContract
 *   DecayPolicyContract
 *   ConflictPolicyContract
 *   ConfidenceCalculatorContract
 *   PreferenceAccumulatorContract
 *   PreferenceResolverContract
 *   LearningEngineConfig
 *
 * Base class:
 *   BaseInterpreter          — abstract class; extend to create a signal interpreter
 *
 * Concrete interpreter classes (placeholders — return [] until EP10.0-P5+):
 *   QuizInterpreter / ConciergeInterpreter / PurchaseInterpreter
 *   FavoriteInterpreter / CartInterpreter / SearchInterpreter
 *   ViewInterpreter / DiscoveryInterpreter
 *
 * Engine:
 *   LearningEngine           — class; run() owns the full lifecycle
 *   createDefaultLearningEngine — pre-wired with all 8 interpreters + default policies
 *
 * Default implementations (null / pass-through):
 *   createNullLogger         — no-op logger
 *   createNoDecayPolicy      — no-op decay (all signals retain full weight)
 *   createLatestWinsPolicy   — conflict resolution: most recent signal wins
 *   createMaxConfidenceCalculator — confidence: highest contributing signal wins
 *   createDefaultAccumulator — groups candidates by dimension + value + polarity
 *   createPassthroughResolver — returns first candidate from each group
 *
 * Metric helpers:
 *   createEmptyMetrics / buildMetrics
 */

// ── Core types ────────────────────────────────────────────────────────────────

export type { PreferenceCandidate }              from "./PreferenceCandidate";
export type { LearningContext }                  from "./LearningContext";
export type { LearningRule }                     from "./LearningRule";
export type { LearningMetrics }                  from "./LearningMetrics";
export type { LearningResult }                   from "./LearningResult";
export type { LearningLogEntry, LearningLoggerContract } from "./LearningLogger";
export type { DecayPolicyContract }              from "./DecayPolicy";
export type { ConflictResolution, ConflictPolicyContract } from "./ConflictPolicy";
export type { ConfidenceCalculatorContract }     from "./ConfidenceCalculator";
export type { AccumulatedPreference, PreferenceAccumulatorContract } from "./PreferenceAccumulator";
export type { PreferenceResolverContract }       from "./PreferenceResolver";
export type { LearningEngineConfig }             from "./LearningEngine";

// ── Base class ────────────────────────────────────────────────────────────────

export { BaseInterpreter }                       from "./BaseInterpreter";

// ── Concrete interpreters ─────────────────────────────────────────────────────

export {
  QuizInterpreter,
  ConciergeInterpreter,
  PurchaseInterpreter,
  FavoriteInterpreter,
  CartInterpreter,
  SearchInterpreter,
  ViewInterpreter,
  DiscoveryInterpreter,
}                                                from "./SignalInterpreter";

// ── Engine ────────────────────────────────────────────────────────────────────

export { LearningEngine, createDefaultLearningEngine } from "./LearningEngine";

// ── Default implementations ───────────────────────────────────────────────────

export { createNullLogger }                      from "./LearningLogger";
export { createNoDecayPolicy }                   from "./DecayPolicy";
export { createLatestWinsPolicy }                from "./ConflictPolicy";
export { createMaxConfidenceCalculator }         from "./ConfidenceCalculator";
export { createDefaultAccumulator }              from "./PreferenceAccumulator";
export { createPassthroughResolver }             from "./PreferenceResolver";

// ── Metric helpers ────────────────────────────────────────────────────────────

export { createEmptyMetrics, buildMetrics }      from "./LearningMetrics";
