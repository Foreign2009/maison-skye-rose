/**
 * Customer Intelligence — Profile Metadata
 *
 * Timestamps and version carried by every profile tier.
 * touchMetadata returns a new object with updatedAt refreshed —
 * profiles are immutable; every mutation returns a new copy.
 */

import type { ProfileVersion }      from "./ProfileVersion";
import { CURRENT_PROFILE_VERSION } from "./ProfileVersion";

export interface ProfileMetadata {
  readonly version:   ProfileVersion;
  readonly createdAt: number;
  readonly updatedAt: number;
}

export function createProfileMetadata(now: number = Date.now()): ProfileMetadata {
  return {
    version:   CURRENT_PROFILE_VERSION,
    createdAt: now,
    updatedAt: now,
  };
}

export function touchMetadata(metadata: ProfileMetadata): ProfileMetadata {
  return { ...metadata, updatedAt: Date.now() };
}
