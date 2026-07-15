/**
 * Customer Intelligence — Device Identity
 *
 * Single source of truth for the device-scoped ID.
 * The ID is generated once per browser, persisted in localStorage, and
 * reused on every subsequent page load.
 *
 * Ownership: this module owns the storage key and the ID lifecycle.
 * No other module should write to DEVICE_ID_KEY or generate its own ID.
 *
 * Failure behaviour: if localStorage is unavailable (SSR, private browsing)
 * the function returns a fresh ephemeral ID — never throws.
 *
 * Integration points:
 *   ProfileIdentity.generateId() — ID generation (UUID v4 with fallback)
 *   CustomerProfileManager       — deviceId parameter for all device-tier operations
 *   quiz/page.tsx                — quiz signal + result persistence
 */

import { generateId } from "../profile/ProfileIdentity";

export const DEVICE_ID_KEY = "msr_device_id";

export function getOrCreateDeviceId(): string {
  try {
    const existing = localStorage.getItem(DEVICE_ID_KEY);
    if (existing) return existing;
    const next = generateId();
    localStorage.setItem(DEVICE_ID_KEY, next);
    return next;
  } catch {
    // localStorage unavailable — return ephemeral ID
    return generateId();
  }
}
