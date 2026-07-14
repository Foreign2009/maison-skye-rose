/**
 * Customer Intelligence — Profile Merge
 *
 * Merge contracts and implementations for the three profile tiers.
 *
 * Merge direction:
 *   session → device   (mergeSessionToDevice)
 *   device  → unified  (mergeDeviceToUnified)
 *   unified → account  (future — Phase 4)
 *
 * Signals are deduplicated by id — merging the same session into the
 * same device twice produces no duplicate signals.
 */

import type { SessionProfile }          from "./SessionProfile";
import type { DeviceProfile }           from "./DeviceProfile";
import type { UnifiedCustomerProfile }  from "./UnifiedCustomerProfile";
import type { CustomerSignal }          from "../signals/CustomerSignal";
import { touchMetadata }                from "./ProfileMetadata";

export function mergeSessionToDevice(
  session: SessionProfile,
  device:  DeviceProfile,
): DeviceProfile {
  const merged = deduplicateSignals([...device.signals, ...session.signals]);
  return {
    ...device,
    signals:      merged,
    lastActiveAt: Date.now(),
    metadata:     touchMetadata(device.metadata),
  };
}

export function mergeDeviceToUnified(
  device: DeviceProfile,
): UnifiedCustomerProfile {
  return {
    tier:           "unified",
    identity:       device.identity,
    metadata:       device.metadata,
    signals:        device.signals,
    recentlyViewed: device.recentlyViewed,
    savedSlugs:     device.savedSlugs,
    lastQuizSlugs:  device.lastQuizSlugs,
    lastActiveAt:   device.lastActiveAt,
  };
}

function deduplicateSignals(
  signals: readonly CustomerSignal[],
): readonly CustomerSignal[] {
  const seen = new Set<string>();
  return signals.filter((s) => {
    if (seen.has(s.id)) return false;
    seen.add(s.id);
    return true;
  });
}
