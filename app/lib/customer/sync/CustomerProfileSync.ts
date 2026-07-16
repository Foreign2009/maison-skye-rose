/**
 * Customer Intelligence — Customer Profile Sync
 *
 * Thin synchronisation layer between UI components and the Customer Platform.
 * UI components call a single function — this module owns device identity,
 * profile manager construction, and slug resolution.
 *
 * All functions are fire-and-forget:
 *   - Return void
 *   - Swallow all errors
 *   - Never affect UI behaviour
 *
 * Slug resolution contract:
 *   mkcNameToSlug maps display names ("Sauvage Inspired") → slugs ("sauvage-inspired").
 *   If the argument is already a slug (not found as a name), it is used as-is.
 *   This means both ProductDetail (slug) and ProductCard (title) can call the
 *   same function without knowledge of which format they hold.
 *
 * Integration points:
 *   ProductDetail.tsx — recordProductView(), toggleSavedProduct()
 *   ProductCard.tsx   — toggleSavedProduct()
 *   quiz/page.tsx     — owns its own persistence (P8.1); recordQuizResult() reserved
 */

import { createLocalStorageProfileStorage } from "../storage/localStorageProfileStorage";
import { createProfileManager }             from "../profile/CustomerProfileManager";
import { getOrCreateDeviceId }              from "../identity/DeviceIdentity";
import { mkcNameToSlug }                    from "../../mkc/catalogueLookup";

// ── Internal helpers ──────────────────────────────────────────────────────────

function getManager() {
  const storage  = createLocalStorageProfileStorage();
  const manager  = createProfileManager(storage);
  const deviceId = getOrCreateDeviceId();
  return { manager, deviceId };
}

function resolveSlug(slugOrTitle: string): string {
  return mkcNameToSlug.get(slugOrTitle) ?? slugOrTitle;
}

// ── Public API ─────────────────────────────────────────────────────────────────

/**
 * Record that the customer viewed a product.
 * Called by ProductDetail.tsx — slug is always canonical.
 */
export function recordProductView(slug: string): void {
  try {
    const { manager, deviceId } = getManager();
    manager.recordView(deviceId, slug);
  } catch {
    // localStorage unavailable or unexpected error
  }
}

/**
 * Toggle a saved / unsaved state in the DeviceProfile.
 * Accepts a canonical slug (ProductDetail) or a display title (ProductCard).
 * Title → slug resolution is handled internally.
 */
export function toggleSavedProduct(slugOrTitle: string): void {
  try {
    const slug = resolveSlug(slugOrTitle);
    const { manager, deviceId } = getManager();
    manager.toggleSaved(deviceId, slug);
  } catch {
    // localStorage unavailable or unexpected error
  }
}

/**
 * Reserved — quiz/page.tsx owns this path in P8.1.
 * Included here for API completeness as this layer evolves.
 */
export function recordQuizResult(
  _slugs: readonly string[],
): void {
  // Not yet wired — quiz/page.tsx uses CustomerProfileManager directly (P8.1)
}

/**
 * Reserved for future search signal emission.
 */
export function recordSearch(_query: string): void {
  // Not yet wired
}

/**
 * Reserved for future cart signal emission.
 */
export function recordCart(_slug: string): void {
  // Not yet wired
}
