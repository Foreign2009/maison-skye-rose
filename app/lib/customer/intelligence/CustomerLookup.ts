/**
 * Customer Intelligence — Customer Lookup
 *
 * Pure utility functions for querying a UnifiedCustomerProfile's signal set.
 * No state, no caching — each call operates on the provided profile.
 *
 * deriveCustomerId resolves the most stable available identifier following the
 * three-tier priority: session → device → account → "anonymous".
 *
 * Integration points:
 *   CustomerIntelligenceEngine — uses deriveCustomerId on every public API call
 *   CustomerIndex              — complementary index utility for batch lookups
 */

import type { UnifiedCustomerProfile } from "../profile/UnifiedCustomerProfile";
import type { CustomerSignal }         from "../signals/CustomerSignal";
import type { SignalSource }           from "../signals/SignalSource";
import type { SignalType }             from "../signals/SignalType";

export function deriveCustomerId(
  profile: { readonly identity: { readonly sessionId?: string; readonly deviceId?: string; readonly accountId?: string } },
): string {
  return (
    profile.identity.sessionId ??
    profile.identity.deviceId ??
    profile.identity.accountId ??
    "anonymous"
  );
}

export function lookupSignalsBySource(
  profile: UnifiedCustomerProfile,
  source:  SignalSource,
): readonly CustomerSignal[] {
  return profile.signals.filter((s) => s.source === source);
}

export function lookupSignalsByType(
  profile: UnifiedCustomerProfile,
  type:    SignalType,
): readonly CustomerSignal[] {
  return profile.signals.filter((s) => s.type === type);
}

export function lookupRecentSignals(
  profile: UnifiedCustomerProfile,
  limit:   number,
): readonly CustomerSignal[] {
  return [...profile.signals]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit);
}

export function lookupHighConfidenceSignals(
  profile: UnifiedCustomerProfile,
): readonly CustomerSignal[] {
  return profile.signals.filter((s) => s.confidence === "HIGH");
}
