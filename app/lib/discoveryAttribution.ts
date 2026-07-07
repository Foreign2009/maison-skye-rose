/**
 * Discovery Attribution — Maison Skye & Rose
 *
 * Lightweight, privacy-aligned attribution that connects the last deliberate
 * discovery entry point in a browsing session to completed orders.
 *
 * Design principles:
 *   - sessionStorage only: automatically cleared when the tab closes.
 *     No cross-session or cross-device tracking.
 *   - No query strings, no PII, no customer session identity.
 *   - Represents the last discovery surface visited before checkout —
 *     editorial intelligence, not marketing attribution.
 *   - All storage calls are wrapped in try/catch; sessionStorage is
 *     unavailable in some private browsing and restricted contexts.
 */

const ATTRIBUTION_KEY = "msr_discovery";

// ── Types ─────────────────────────────────────────────────────────────────────

export type DiscoverySource =
  | "discover-moment"  // Customer visited a /discover/[id] page
  | "quiz"             // Customer completed the Scent Finder quiz
  | "concierge"        // reserved — implementation deferred
  | "shop-curated"     // reserved — implementation deferred
  | "search";          // reserved — implementation deferred

export interface DiscoveryAttribution {
  source:    DiscoverySource;
  momentId?: string;   // populated only when source = "discover-moment"
  setAt:     number;   // Unix ms timestamp — set in the browser via useEffect
}

// ── Public API ────────────────────────────────────────────────────────────────

export function setDiscoveryAttribution(
  attribution: Omit<DiscoveryAttribution, "setAt">,
): void {
  try {
    const value: DiscoveryAttribution = { ...attribution, setAt: Date.now() };
    sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(value));
  } catch {
    // sessionStorage unavailable — silent fail; order creation is unaffected.
  }
}

export function getDiscoveryAttribution(): DiscoveryAttribution | null {
  try {
    const raw = sessionStorage.getItem(ATTRIBUTION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DiscoveryAttribution;
  } catch {
    return null;
  }
}

export function clearDiscoveryAttribution(): void {
  try {
    sessionStorage.removeItem(ATTRIBUTION_KEY);
  } catch {
    // silent
  }
}

// ── Validation (used server-side in the orders API) ───────────────────────────

const VALID_SOURCES: DiscoverySource[] = [
  "discover-moment",
  "quiz",
  "concierge",
  "shop-curated",
  "search",
];

export function validateDiscoveryAttribution(
  value: unknown,
): DiscoveryAttribution | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Record<string, unknown>;

  if (typeof v.source !== "string") return null;
  if (!VALID_SOURCES.includes(v.source as DiscoverySource)) return null;
  if (typeof v.setAt !== "number") return null;

  const attribution: DiscoveryAttribution = {
    source: v.source as DiscoverySource,
    setAt:  v.setAt,
  };

  if (v.source === "discover-moment" && typeof v.momentId === "string" && v.momentId) {
    attribution.momentId = v.momentId.slice(0, 64); // sanity cap
  }

  return attribution;
}
