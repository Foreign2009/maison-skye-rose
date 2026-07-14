/**
 * Customer Intelligence — Signal Registry
 *
 * Contract interface for signal registration and lookup.
 * Implementations (localStorage, in-memory, Supabase) are provided
 * by CustomerProfileManager in EP10.0-P2.
 *
 * The null implementation is a safe default until persistence is wired.
 */

import type { CustomerSignal } from "./CustomerSignal";
import type { SignalSource }   from "./SignalSource";
import type { SignalType }     from "./SignalType";

export interface SignalRegistryContract {
  /** Persist a signal. Implementations must be idempotent on signal.id. */
  register(signal: CustomerSignal): void;
  /** Retrieve all signals from a specific source. */
  getBySource(source: SignalSource): readonly CustomerSignal[];
  /** Retrieve all signals of a specific type. */
  getByType(type: SignalType): readonly CustomerSignal[];
  /** Retrieve all registered signals in insertion order. */
  getAll(): readonly CustomerSignal[];
  /** Remove all signals. */
  clear(): void;
}

/** No-op registry — safe default until CustomerProfileManager provides a real implementation. */
export function createNullRegistry(): SignalRegistryContract {
  return {
    register:    () => undefined,
    getBySource: () => [],
    getByType:   () => [],
    getAll:      () => [],
    clear:       () => undefined,
  };
}
