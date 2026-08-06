/**
 * Maison Knowledge Catalogue — Product Default Resolvers
 *
 * Central source of truth for default values of the multi-category foundation
 * fields introduced in EP2-P7D.
 *
 * All 93 existing FragranceKnowledge records omit category and
 * availabilityStatus — these helpers apply backward-compatible defaults
 * so no native record requires editing and no consumer scatters ?? expressions.
 *
 * Defaults:
 *   category            → "fragrance"
 *   availabilityStatus  → "online"
 *
 * Do not duplicate these defaults anywhere else in the codebase.
 */

import type { ProductCategory, GuestAvailabilityStatus } from "./types";

// ── Minimal shape accepted by the resolvers ───────────────────────────────────
// Accepts any object that may carry the optional fields.
// Does not require a full FragranceKnowledge to avoid coupling.

interface WithCategory {
  category?: ProductCategory;
}

interface WithAvailabilityStatus {
  availabilityStatus?: GuestAvailabilityStatus;
}

// ── Public resolvers ──────────────────────────────────────────────────────────

export function getProductCategory(record: WithCategory): ProductCategory {
  return record.category ?? "fragrance";
}

export function getGuestAvailabilityStatus(
  record: WithAvailabilityStatus
): GuestAvailabilityStatus {
  return record.availabilityStatus ?? "online";
}
