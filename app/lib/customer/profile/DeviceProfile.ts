/**
 * Customer Intelligence — Device Profile
 *
 * Long-lived, cross-session, device-scoped profile tier.
 * Backed by ProfileStorage (localStorage in production — wired in a later sprint).
 * Mutations return new objects — DeviceProfile is immutable.
 *
 * The identity subtype guarantees deviceId is always a string,
 * eliminating non-null assertions in ProfileSerializer and CustomerProfileManager.
 */

import type { CustomerProfile } from "./CustomerProfile";
import type { CustomerSignal }  from "../signals/CustomerSignal";
import { generateId }           from "./ProfileIdentity";
import { createProfileMetadata, touchMetadata } from "./ProfileMetadata";

const MAX_RECENTLY_VIEWED = 50;

export interface DeviceProfile extends CustomerProfile {
  readonly tier:           "device";
  readonly signals:        readonly CustomerSignal[];
  /** Fragrance slugs, newest-first, capped at 50. */
  readonly recentlyViewed: readonly string[];
  /** Saved / favourited fragrance slugs. */
  readonly savedSlugs:     readonly string[];
  /** Slugs returned by the last quiz result for this device. */
  readonly lastQuizSlugs:  readonly string[];
  readonly lastActiveAt:   number;
  /** deviceId is guaranteed present on device-tier profiles. */
  readonly identity: {
    readonly sessionId?:  string;
    readonly deviceId:    string;
    readonly accountId?:  string;
  };
}

export function createDeviceProfile(deviceId?: string): DeviceProfile {
  const now = Date.now();
  return {
    tier:           "device",
    identity:       { deviceId: deviceId ?? generateId() },
    metadata:       createProfileMetadata(now),
    signals:        [],
    recentlyViewed: [],
    savedSlugs:     [],
    lastQuizSlugs:  [],
    lastActiveAt:   now,
  };
}

export function addSignalToDevice(
  profile: DeviceProfile,
  signal:  CustomerSignal,
): DeviceProfile {
  return {
    ...profile,
    signals:      [...profile.signals, signal],
    lastActiveAt: Date.now(),
    metadata:     touchMetadata(profile.metadata),
  };
}

export function addRecentlyViewed(
  profile: DeviceProfile,
  slug:    string,
): DeviceProfile {
  const filtered = profile.recentlyViewed.filter((s) => s !== slug);
  const updated  = [slug, ...filtered].slice(0, MAX_RECENTLY_VIEWED);
  return {
    ...profile,
    recentlyViewed: updated,
    lastActiveAt:   Date.now(),
    metadata:       touchMetadata(profile.metadata),
  };
}

export function toggleSavedSlug(
  profile: DeviceProfile,
  slug:    string,
): DeviceProfile {
  const isSaved = profile.savedSlugs.includes(slug);
  const updated = isSaved
    ? profile.savedSlugs.filter((s) => s !== slug)
    : [...profile.savedSlugs, slug];
  return {
    ...profile,
    savedSlugs: updated,
    metadata:   touchMetadata(profile.metadata),
  };
}

export function setLastQuizSlugs(
  profile: DeviceProfile,
  slugs:   readonly string[],
): DeviceProfile {
  return {
    ...profile,
    lastQuizSlugs: slugs,
    lastActiveAt:  Date.now(),
    metadata:      touchMetadata(profile.metadata),
  };
}
