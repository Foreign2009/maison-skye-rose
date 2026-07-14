/**
 * Customer Intelligence — Signals Public Surface
 *
 * Single import point for all CustomerSignal consumers.
 *
 * Types:
 *   CustomerSignal       — canonical immutable signal interface
 *   SignalSource         — source surface enumeration
 *   SignalType           — preference dimension enumeration
 *   SignalConfidence     — HIGH / MEDIUM / LOW confidence tier
 *   SignalVersion        — schema version literal type
 *   SignalMetadata       — optional attribution context
 *   BuildSignalOptions   — SignalBuilder input
 *   ValidationResult     — SignalValidator output
 *   ValidationError      — single validation failure
 *   SignalRegistryContract — storage contract interface
 *
 * Constants:
 *   SIGNAL_SOURCES       — runtime array for validation
 *   SIGNAL_TYPES         — runtime array for validation
 *   SIGNAL_CONFIDENCES   — runtime array for validation
 *   CONFIDENCE_WEIGHT    — numeric weight per confidence tier
 *   CURRENT_SIGNAL_VERSION
 *
 * Functions:
 *   buildSignal          — sole creation path
 *   validateSignal       — structured validation
 *   serializeSignal      — JSON serialization
 *   deserializeSignal    — JSON deserialization + validation
 *   serializeSignals     — serialize a collection
 *   deserializeSignals   — deserialize a collection, dropping invalid entries
 *   createNullRegistry   — no-op registry safe default
 */

// ── Types ─────────────────────────────────────────────────────────────────────

export type { CustomerSignal }        from "./CustomerSignal";
export type { SignalSource }          from "./SignalSource";
export type { SignalType }            from "./SignalType";
export type { SignalConfidence }      from "./SignalConfidence";
export type { SignalVersion }         from "./SignalVersion";
export type { SignalMetadata }        from "./SignalMetadata";
export type { BuildSignalOptions }    from "./SignalBuilder";
export type { ValidationResult, ValidationError } from "./SignalValidator";
export type { SignalRegistryContract } from "./SignalRegistry";

// ── Constants ─────────────────────────────────────────────────────────────────

export { SIGNAL_SOURCES }            from "./SignalSource";
export { SIGNAL_TYPES }              from "./SignalType";
export { SIGNAL_CONFIDENCES, CONFIDENCE_WEIGHT } from "./SignalConfidence";
export { CURRENT_SIGNAL_VERSION }    from "./SignalVersion";

// ── Functions ─────────────────────────────────────────────────────────────────

export { buildSignal }               from "./SignalBuilder";
export { validateSignal }            from "./SignalValidator";
export {
  serializeSignal,
  deserializeSignal,
  serializeSignals,
  deserializeSignals,
}                                    from "./SignalSerializer";
export { createNullRegistry }        from "./SignalRegistry";
