/**
 * Customer Intelligence — Customer Profile Manager
 *
 * Orchestrates the three-tier profile lifecycle.
 * Owns the session map (in-memory) and delegates persistence to
 * an injected ProfileStorage.
 *
 * Design:
 *   - Factory function pattern — mirrors KIE and concierge conventions
 *   - ProfileStorage is an injected interface; createNullStorage() is the
 *     safe default until localStorage is wired (future sprint)
 *   - All profile mutations are immutable — each operation returns a new object
 *   - endSession() merges session signals into the device profile before
 *     removing the session from memory
 *
 * Integration points:
 *   SessionProfile          — in-memory, tab-scoped session state
 *   DeviceProfile           — cross-session device state; persisted via storage
 *   UnifiedCustomerProfile  — merged read model; never persisted
 *   ProfileMerge            — merge logic
 *   ProfileSerializer       — device profile JSON round-trip
 */

import type { SessionProfile }          from "./SessionProfile";
import type { DeviceProfile }           from "./DeviceProfile";
import type { UnifiedCustomerProfile }  from "./UnifiedCustomerProfile";
import type { CustomerSignal }          from "../signals/CustomerSignal";
import { createSessionProfile, addSignalToSession } from "./SessionProfile";
import {
  createDeviceProfile,
  addSignalToDevice,
  addRecentlyViewed,
  toggleSavedSlug,
  setLastQuizSlugs,
} from "./DeviceProfile";
import { mergeSessionToDevice, mergeDeviceToUnified } from "./ProfileMerge";
import { serializeDeviceProfile, deserializeDeviceProfile } from "./ProfileSerializer";
import { buildSignal } from "../signals/SignalBuilder";

// ── Storage contract ──────────────────────────────────────────────────────────

export interface ProfileStorage {
  /** Load raw serialized data for a key. Returns null if not found. */
  load(key: string): string | null;
  /** Persist raw serialized data. */
  save(key: string, data: string): void;
  /** Remove persisted data for a key. */
  remove(key: string): void;
}

/** No-op storage — safe default until localStorage binding is implemented. */
export function createNullStorage(): ProfileStorage {
  return {
    load:   () => null,
    save:   () => undefined,
    remove: () => undefined,
  };
}

// ── Manager interface ─────────────────────────────────────────────────────────

export interface CustomerProfileManager {
  // ── Session tier ─────────────────────────────────────────────────────────────
  /** Create a new session profile and register it in the session map. */
  createSession(sessionId?: string): SessionProfile;
  /** Retrieve an active session, or null if not found. */
  getSession(sessionId: string): SessionProfile | null;
  /** Append a signal to a session. Returns the updated session or null if not found. */
  addSignal(sessionId: string, signal: CustomerSignal): SessionProfile | null;

  // ── Device tier ──────────────────────────────────────────────────────────────
  /** Load a device profile from storage, or create a new one if not found. */
  loadDevice(deviceId: string): DeviceProfile;
  /** Persist a device profile via the storage interface. */
  saveDevice(profile: DeviceProfile): void;
  /** Record a fragrance view and persist. Returns the updated device profile. */
  recordView(deviceId: string, slug: string): DeviceProfile;
  /** Toggle a fragrance save and persist. Returns the updated device profile. */
  toggleSaved(deviceId: string, slug: string): DeviceProfile;
  /** Record the latest quiz result slugs and persist. */
  recordQuizResult(deviceId: string, slugs: readonly string[]): DeviceProfile;

  // ── Unified read model ────────────────────────────────────────────────────────
  /** Compose a unified profile from session + optional device. Null if session not found. */
  getUnified(sessionId: string, deviceId?: string): UnifiedCustomerProfile | null;

  // ── Session lifecycle ─────────────────────────────────────────────────────────
  /** Merge session signals into the device profile, then remove the session. */
  endSession(sessionId: string, deviceId?: string): DeviceProfile | null;
  /** Remove a device profile from storage. */
  clearDevice(deviceId: string): void;
}

// ── Factory ───────────────────────────────────────────────────────────────────

const DEVICE_STORAGE_PREFIX = "msr_device_profile_";

export function createProfileManager(
  storage: ProfileStorage = createNullStorage(),
): CustomerProfileManager {
  const sessions = new Map<string, SessionProfile>();

  function storageKey(deviceId: string): string {
    return `${DEVICE_STORAGE_PREFIX}${deviceId}`;
  }

  function loadDevice(deviceId: string): DeviceProfile {
    const raw = storage.load(storageKey(deviceId));
    if (raw !== null) {
      const loaded = deserializeDeviceProfile(raw);
      if (loaded) return loaded;
    }
    return createDeviceProfile(deviceId);
  }

  function saveDevice(profile: DeviceProfile): void {
    storage.save(storageKey(profile.identity.deviceId), serializeDeviceProfile(profile));
  }

  return {
    createSession(sessionId?: string): SessionProfile {
      const profile = createSessionProfile(sessionId);
      sessions.set(profile.identity.sessionId, profile);
      return profile;
    },

    getSession(sessionId: string): SessionProfile | null {
      return sessions.get(sessionId) ?? null;
    },

    addSignal(sessionId: string, signal: CustomerSignal): SessionProfile | null {
      const session = sessions.get(sessionId);
      if (!session) return null;
      const updated = addSignalToSession(session, signal);
      sessions.set(sessionId, updated);
      return updated;
    },

    loadDevice,

    saveDevice,

    recordView(deviceId: string, slug: string): DeviceProfile {
      const device   = loadDevice(deviceId);
      const viewed   = addRecentlyViewed(device, slug);
      const signaled = addSignalToDevice(viewed, buildSignal({
        source:     "view",
        type:       "fragrance_engagement",
        payload:    { slug },
        confidence: "LOW",
      }));
      saveDevice(signaled);
      return signaled;
    },

    toggleSaved(deviceId: string, slug: string): DeviceProfile {
      const device   = loadDevice(deviceId);
      const isSaved  = device.savedSlugs.includes(slug);
      const toggled  = toggleSavedSlug(device, slug);
      const signaled = addSignalToDevice(toggled, buildSignal({
        source:     "favorite",
        type:       "fragrance_save",
        payload:    { slug, saved: !isSaved },
        confidence: "MEDIUM",
      }));
      saveDevice(signaled);
      return signaled;
    },

    recordQuizResult(deviceId: string, slugs: readonly string[]): DeviceProfile {
      const updated = setLastQuizSlugs(loadDevice(deviceId), slugs);
      saveDevice(updated);
      return updated;
    },

    getUnified(sessionId: string, deviceId?: string): UnifiedCustomerProfile | null {
      const session = sessions.get(sessionId);
      if (!session) return null;

      if (!deviceId) {
        return {
          tier:           "unified",
          identity:       session.identity,
          metadata:       session.metadata,
          signals:        session.signals,
          recentlyViewed: [],
          savedSlugs:     [],
          lastQuizSlugs:  [],
          lastActiveAt:   null,
        };
      }

      const device = loadDevice(deviceId);
      const merged = mergeSessionToDevice(session, device);
      return mergeDeviceToUnified(merged);
    },

    endSession(sessionId: string, deviceId?: string): DeviceProfile | null {
      const session = sessions.get(sessionId);
      sessions.delete(sessionId);

      if (!session || !deviceId) return null;

      const device = loadDevice(deviceId);
      const merged = mergeSessionToDevice(session, device);
      saveDevice(merged);
      return merged;
    },

    clearDevice(deviceId: string): void {
      storage.remove(storageKey(deviceId));
    },
  };
}
