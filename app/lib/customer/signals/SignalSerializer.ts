/**
 * Customer Intelligence — Signal Serializer
 *
 * JSON round-trip for CustomerSignal and collections of signals.
 * Validation is applied on deserialization — invalid signals are silently
 * dropped rather than propagated as errors.
 */

import type { CustomerSignal } from "./CustomerSignal";
import { validateSignal }      from "./SignalValidator";

export function serializeSignal(signal: CustomerSignal): string {
  return JSON.stringify(signal);
}

export function deserializeSignal(json: string): CustomerSignal | null {
  try {
    const parsed = JSON.parse(json) as unknown;
    const result = validateSignal(parsed);
    if (!result.valid) return null;
    return parsed as CustomerSignal;
  } catch {
    return null;
  }
}

export function serializeSignals(signals: readonly CustomerSignal[]): string {
  return JSON.stringify(signals);
}

export function deserializeSignals(json: string): readonly CustomerSignal[] {
  try {
    const parsed = JSON.parse(json) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is CustomerSignal => validateSignal(item).valid,
    );
  } catch {
    return [];
  }
}
