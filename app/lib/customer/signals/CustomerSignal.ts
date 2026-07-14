/**
 * Customer Intelligence — Customer Signal
 *
 * Canonical immutable event model for all customer preference intelligence.
 * Every piece of customer intent — explicit or behavioural — is represented
 * as a CustomerSignal before being processed by the PreferenceLearningEngine.
 *
 * Signals are write-once. No field may be mutated after creation.
 * SignalBuilder is the sole creation path.
 *
 * Integration points:
 *   SignalBuilder    — sole factory; owns ID generation and timestamp
 *   SignalValidator  — validates structure and enum membership
 *   SignalSerializer — JSON round-trip
 *   SignalRegistry   — registration contract
 */

import type { SignalSource }     from "./SignalSource";
import type { SignalType }       from "./SignalType";
import type { SignalConfidence } from "./SignalConfidence";
import type { SignalVersion }    from "./SignalVersion";
import type { SignalMetadata }   from "./SignalMetadata";

export interface CustomerSignal {
  /** UUID v4 (or stable fallback). Globally unique per signal. */
  readonly id:         string;
  /** Schema version — supports future migration branching. */
  readonly version:    SignalVersion;
  /** Which surface emitted this signal. */
  readonly source:     SignalSource;
  /** What preference dimension this signal describes. */
  readonly type:       SignalType;
  /** Signal-specific data. Shape is defined by source + type combination. */
  readonly payload:    Readonly<Record<string, unknown>>;
  /** How reliable this signal is for preference inference. */
  readonly confidence: SignalConfidence;
  /** Unix milliseconds at creation time. */
  readonly timestamp:  number;
  /** Optional attribution and debugging context. */
  readonly metadata?:  SignalMetadata;
}
