/**
 * Customer Intelligence — Signal Validator
 *
 * Validates a CustomerSignal against the canonical schema.
 * Returns structured results — never throws for normal validation failures.
 *
 * Use this when deserializing signals from external sources (localStorage,
 * API responses, postMessage). Signals produced by SignalBuilder are
 * structurally valid by construction.
 */

import { SIGNAL_SOURCES }      from "./SignalSource";
import { SIGNAL_TYPES }        from "./SignalType";
import { SIGNAL_CONFIDENCES }  from "./SignalConfidence";
import { CURRENT_SIGNAL_VERSION } from "./SignalVersion";

export interface ValidationResult {
  readonly valid:  boolean;
  readonly errors: readonly ValidationError[];
}

export interface ValidationError {
  readonly field:   string;
  readonly message: string;
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const FALLBACK_ID_PATTERN = /^signal-\d+-[a-z0-9]+$/;

export function validateSignal(signal: unknown): ValidationResult {
  if (!signal || typeof signal !== "object" || Array.isArray(signal)) {
    return {
      valid:  false,
      errors: [{ field: "signal", message: "Signal must be a non-null object" }],
    };
  }

  const errors: ValidationError[] = [];
  const s = signal as Record<string, unknown>;

  // id — UUID v4 or stable fallback format
  if (typeof s.id !== "string" || s.id.length === 0) {
    errors.push({ field: "id", message: "id must be a non-empty string" });
  } else if (!UUID_PATTERN.test(s.id) && !FALLBACK_ID_PATTERN.test(s.id)) {
    errors.push({ field: "id", message: "id must be a valid UUID v4 or signal-{ts}-{rand} format" });
  }

  // version
  if (s.version !== CURRENT_SIGNAL_VERSION) {
    errors.push({
      field:   "version",
      message: `version must be ${CURRENT_SIGNAL_VERSION}; found ${String(s.version)}`,
    });
  }

  // source
  if (!SIGNAL_SOURCES.includes(s.source as never)) {
    errors.push({
      field:   "source",
      message: `source must be one of: ${SIGNAL_SOURCES.join(", ")}`,
    });
  }

  // type
  if (!SIGNAL_TYPES.includes(s.type as never)) {
    errors.push({
      field:   "type",
      message: `type must be one of: ${SIGNAL_TYPES.join(", ")}`,
    });
  }

  // confidence
  if (!SIGNAL_CONFIDENCES.includes(s.confidence as never)) {
    errors.push({
      field:   "confidence",
      message: `confidence must be one of: ${SIGNAL_CONFIDENCES.join(", ")}`,
    });
  }

  // timestamp
  if (
    typeof s.timestamp !== "number" ||
    !Number.isFinite(s.timestamp) ||
    s.timestamp <= 0
  ) {
    errors.push({
      field:   "timestamp",
      message: "timestamp must be a positive finite Unix millisecond value",
    });
  }

  // payload — must be a plain non-null, non-array object
  if (
    !s.payload ||
    typeof s.payload !== "object" ||
    Array.isArray(s.payload)
  ) {
    errors.push({ field: "payload", message: "payload must be a non-null, non-array object" });
  }

  return { valid: errors.length === 0, errors };
}
