"use client";

/**
 * Customer Intelligence — useUnifiedCustomerProfile
 *
 * Client-side hook that assembles a UnifiedCustomerProfile from all available
 * browser state. Separates data assembly from intelligence consumption.
 *
 * Sources merged (in priority order):
 *   DeviceProfile    — signals + lastQuizSlugs (written by quiz, P8.1)
 *   FavoritesContext — savedSlugs (legacy title store → resolved via mkcNameToSlug)
 *   localStorage     — recentlyViewed (legacy title store → resolved via mkcNameToSlug)
 *
 * Note: DeviceProfile.recentlyViewed and DeviceProfile.savedSlugs are currently
 * empty because view/save events are not yet wired to the Device Platform.
 * This hook bridges that gap by reading the legacy localStorage keys and resolving
 * titles to canonical mkcCatalogue slugs — the same pattern as Concierge P7 server-side.
 *
 * Responsibilities (owned by this hook):
 *   ✓ DeviceProfile loading
 *   ✓ Favorites resolution
 *   ✓ Recently-viewed resolution
 *   ✓ UnifiedCustomerProfile assembly
 *
 * NOT responsible for (caller's concern):
 *   ✗ CIE calls (getCustomerJourney, getCustomerInsights, etc.)
 *   ✗ Recommendation Engine calls
 *   ✗ Rendering
 *
 * Integration points:
 *   CustomerProfileManager       — loadDevice() reads DeviceProfile
 *   localStorageProfileStorage   — ProfileStorage implementation
 *   DeviceIdentity               — getOrCreateDeviceId()
 *   FavoritesContext             — favorites titles
 *   mkcNameToSlug                — title → canonical slug resolution
 */

import { useState, useEffect, useMemo } from "react";
import type { UnifiedCustomerProfile }  from "../profile/UnifiedCustomerProfile";
import type { DeviceProfile }           from "../profile/DeviceProfile";
import { createLocalStorageProfileStorage } from "../storage/localStorageProfileStorage";
import { createProfileManager }         from "../profile/CustomerProfileManager";
import { createProfileMetadata }        from "../profile/ProfileMetadata";
import { getOrCreateDeviceId }          from "../identity/DeviceIdentity";
import { mkcNameToSlug }                from "../../mkc/catalogueLookup";
import { useFavorites }                 from "../../../context/FavoritesContext";

// ── Public types ──────────────────────────────────────────────────────────────

export interface UnifiedCustomerProfileState {
  /** Assembled profile. null while SSR or before localStorage has been read. */
  readonly profile: UnifiedCustomerProfile | null;
  /** true once the useEffect has run and all browser sources have been read. */
  readonly isReady: boolean;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useUnifiedCustomerProfile(): UnifiedCustomerProfileState {
  const { favorites } = useFavorites();
  const [device, setDevice] = useState<DeviceProfile | null>(null);
  const [viewedTitles, setViewedTitles] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // DeviceProfile — signals + lastQuizSlugs (quiz P8.1 populated)
    try {
      const storage  = createLocalStorageProfileStorage();
      const manager  = createProfileManager(storage);
      const deviceId = getOrCreateDeviceId();
      setDevice(manager.loadDevice(deviceId));
    } catch {
      // localStorage unavailable — device remains null; signals and quiz slugs omitted
    }

    // Legacy recentlyViewed titles — ProductCard.saveRecentlyViewed() stores
    // { title, subtitle, ... } objects; extract titles for slug resolution
    try {
      const raw = JSON.parse(localStorage.getItem("recentlyViewed") ?? "[]");
      const titles = (Array.isArray(raw) ? raw : [])
        .map((item: unknown) =>
          item && typeof item === "object" && "title" in item
            ? String((item as Record<string, unknown>).title)
            : ""
        )
        .filter(Boolean);
      setViewedTitles(titles);
    } catch {
      // localStorage unavailable — recentlyViewed remains empty
    }

    setIsReady(true);
  }, []);

  const profile = useMemo((): UnifiedCustomerProfile | null => {
    if (!isReady) return null;

    // Resolve legacy title stores to canonical mkcCatalogue slugs
    const recentlyViewed = viewedTitles
      .map((title) => mkcNameToSlug.get(title))
      .filter((s): s is string => s !== undefined);

    const savedSlugs = favorites
      .map((f) => mkcNameToSlug.get(f.title))
      .filter((s): s is string => s !== undefined);

    if (!device) {
      // localStorage unavailable — assemble minimal profile from FavoritesContext only
      return {
        tier:           "unified",
        identity:       {},
        metadata:       createProfileMetadata(),
        signals:        [],
        recentlyViewed,
        savedSlugs,
        lastQuizSlugs:  [],
        lastActiveAt:   null,
      };
    }

    // Merge DeviceProfile (signals + quiz slugs) with browser-resolved slug arrays
    return {
      tier:           "unified",
      identity:       device.identity,
      metadata:       device.metadata,
      signals:        device.signals,
      recentlyViewed,
      savedSlugs,
      lastQuizSlugs:  device.lastQuizSlugs,
      lastActiveAt:   device.lastActiveAt,
    };
  }, [isReady, device, viewedTitles, favorites]);

  return { profile, isReady };
}
