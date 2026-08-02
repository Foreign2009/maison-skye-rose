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
import { buildSignal }                      from "../signals/SignalBuilder";
import { addSignalToDevice }                from "../profile/DeviceProfile";
import type { SignalConfidence }            from "../signals/SignalConfidence";

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
 * Emit a search_query signal. Called by SearchOverlay on debounced user queries.
 */
export function recordSearch(query: string): void {
  if (!query.trim()) return;
  try {
    const { manager, deviceId } = getManager();
    const device   = manager.loadDevice(deviceId);
    const signaled = addSignalToDevice(device, buildSignal({
      source:     "search",
      type:       "search_query",
      payload:    { query: query.trim() },
      confidence: "MEDIUM",
    }));
    manager.saveDevice(signaled);
  } catch {
    // localStorage unavailable or unexpected error
  }
}

// ── Concierge intent ──────────────────────────────────────────────────────────

/**
 * Structured preference intent emitted by the AI Concierge on each turn.
 * Built from the delta between the previous and new ConversationProfile.
 * Consumed by ConciergeInterpreter via the LearningEngine signal pipeline.
 */
export interface ConciergeIntent {
  readonly preferredFamilies?:  { readonly values: readonly string[]; readonly confidence: SignalConfidence };
  readonly avoidedFamilies?:    { readonly values: readonly string[]; readonly confidence: SignalConfidence };
  readonly preferredOccasions?: { readonly values: readonly string[]; readonly confidence: SignalConfidence };
  readonly preferredSeasons?:   { readonly values: readonly string[]; readonly confidence: SignalConfidence };
  readonly preferredGender?:    { readonly value: "male" | "female" | "unisex"; readonly confidence: SignalConfidence };
}

/**
 * Emit concierge preference signals from an explicit customer conversation.
 * Caller supplies only the delta — new preferences not present in the prior turn.
 * Idempotent within the call: duplicate values in any field are deduplicated via Set.
 * Fire-and-forget: swallows all errors, never affects UI.
 */
export function recordConciergeIntent(intent: ConciergeIntent): void {
  const hasContent =
    (intent.preferredFamilies?.values.length  ?? 0) > 0 ||
    (intent.avoidedFamilies?.values.length    ?? 0) > 0 ||
    (intent.preferredOccasions?.values.length ?? 0) > 0 ||
    (intent.preferredSeasons?.values.length   ?? 0) > 0 ||
    intent.preferredGender !== undefined;
  if (!hasContent) return;

  try {
    const { manager, deviceId } = getManager();
    const device  = manager.loadDevice(deviceId);
    let   current = device;

    for (const family of new Set(intent.preferredFamilies?.values ?? [])) {
      current = addSignalToDevice(current, buildSignal({
        source:     "concierge",
        type:       "family_preference",
        payload:    { family },
        confidence: intent.preferredFamilies!.confidence,
      }));
    }

    for (const family of new Set(intent.avoidedFamilies?.values ?? [])) {
      current = addSignalToDevice(current, buildSignal({
        source:     "concierge",
        type:       "family_avoidance",
        payload:    { family },
        confidence: intent.avoidedFamilies!.confidence,
      }));
    }

    for (const occasion of new Set(intent.preferredOccasions?.values ?? [])) {
      current = addSignalToDevice(current, buildSignal({
        source:     "concierge",
        type:       "occasion_preference",
        payload:    { occasion },
        confidence: intent.preferredOccasions!.confidence,
      }));
    }

    for (const season of new Set(intent.preferredSeasons?.values ?? [])) {
      current = addSignalToDevice(current, buildSignal({
        source:     "concierge",
        type:       "season_preference",
        payload:    { season },
        confidence: intent.preferredSeasons!.confidence,
      }));
    }

    if (intent.preferredGender) {
      current = addSignalToDevice(current, buildSignal({
        source:     "concierge",
        type:       "gender_preference",
        payload:    { gender: intent.preferredGender.value },
        confidence: intent.preferredGender.confidence,
      }));
    }

    manager.saveDevice(current);
  } catch {
    // localStorage unavailable or unexpected error
  }
}

/**
 * Emit a discovery_path signal when a customer visits a Discover collection page.
 * Encodes the collection's top families, occasions, and seasons at LOW confidence.
 */
export function recordDiscoveryFilter(
  collectionId: string,
  families:     readonly string[],
  occasions:    readonly string[],
  seasons:      readonly string[],
): void {
  if (!collectionId) return;
  try {
    const { manager, deviceId } = getManager();
    const device   = manager.loadDevice(deviceId);
    const signaled = addSignalToDevice(device, buildSignal({
      source:     "discovery",
      type:       "discovery_path",
      payload:    { collectionId, families: [...families], occasions: [...occasions], seasons: [...seasons] },
      confidence: "LOW",
    }));
    manager.saveDevice(signaled);
  } catch {
    // localStorage unavailable or unexpected error
  }
}

/**
 * Emit a cart fragrance_engagement signal. Called on add-to-cart interactions.
 * Accepts a canonical slug or display title; title → slug resolution is handled internally.
 */
export function recordCart(slugOrTitle: string): void {
  try {
    const slug     = resolveSlug(slugOrTitle);
    const { manager, deviceId } = getManager();
    const device   = manager.loadDevice(deviceId);
    const signaled = addSignalToDevice(device, buildSignal({
      source:     "cart",
      type:       "fragrance_engagement",
      payload:    { slug, action: "cart_add" },
      confidence: "MEDIUM",
    }));
    manager.saveDevice(signaled);
  } catch {
    // localStorage unavailable or unexpected error
  }
}
