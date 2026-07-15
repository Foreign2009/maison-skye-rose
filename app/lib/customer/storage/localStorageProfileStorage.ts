/**
 * Customer Intelligence — localStorage Profile Storage
 *
 * Implements ProfileStorage backed by the browser's localStorage.
 * Every operation is guarded against unavailability (SSR, private browsing,
 * storage quota exceeded) — failures are swallowed silently so the
 * CustomerProfileManager degrades gracefully to in-memory-only behaviour.
 *
 * Usage:
 *   import { createLocalStorageProfileStorage } from "./localStorageProfileStorage";
 *   const manager = createProfileManager(createLocalStorageProfileStorage());
 */

import type { ProfileStorage } from "../profile/CustomerProfileManager";

export function createLocalStorageProfileStorage(): ProfileStorage {
  return {
    load(key: string): string | null {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    },

    save(key: string, data: string): void {
      try {
        localStorage.setItem(key, data);
      } catch {
        // Quota exceeded or storage unavailable — degrade gracefully
      }
    },

    remove(key: string): void {
      try {
        localStorage.removeItem(key);
      } catch {
        // Ignore
      }
    },
  };
}
