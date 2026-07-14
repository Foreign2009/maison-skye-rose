/**
 * Customer Intelligence — Signal Builder
 *
 * Sole creation path for CustomerSignal objects.
 * Owns ID generation and timestamp defaulting.
 *
 * No validation is performed here — call SignalValidator if you need
 * to verify a signal produced from an external source.
 */

import type { CustomerSignal } from "./CustomerSignal";
import type { SignalSource }   from "./SignalSource";
import type { SignalType }     from "./SignalType";
import type { SignalConfidence } from "./SignalConfidence";
import type { SignalMetadata } from "./SignalMetadata";
import { CURRENT_SIGNAL_VERSION } from "./SignalVersion";

export interface BuildSignalOptions {
  readonly source:     SignalSource;
  readonly type:       SignalType;
  readonly payload:    Record<string, unknown>;
  readonly confidence: SignalConfidence;
  readonly metadata?:  SignalMetadata;
  /** Defaults to Date.now(). Override only in tests or backfill scenarios. */
  readonly timestamp?: number;
}

export function buildSignal(options: BuildSignalOptions): CustomerSignal {
  return {
    id:         generateSignalId(),
    version:    CURRENT_SIGNAL_VERSION,
    source:     options.source,
    type:       options.type,
    payload:    options.payload,
    confidence: options.confidence,
    timestamp:  options.timestamp ?? Date.now(),
    metadata:   options.metadata,
  };
}

function generateSignalId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  // Fallback for environments where crypto.randomUUID is unavailable.
  return `signal-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}
