/**
 * Recommendation Attribution — Maison Skye & Rose
 *
 * Lightweight, privacy-aligned attribution that connects the most recent
 * recommendation-driven add-to-cart interaction to checkout initiation.
 *
 * Design mirrors discoveryAttribution.ts:
 *   - sessionStorage only: cleared when the tab closes.
 *   - No PII. No cross-session or cross-device tracking.
 *   - Overwritten on each recommendation add-to-cart; last interaction wins.
 *   - All storage calls are wrapped in try/catch; sessionStorage is
 *     unavailable in some private browsing and restricted contexts.
 */

import type { AnalyticsSource } from "./analytics";

const ATTRIBUTION_KEY = "msr_rec_attribution";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface RecommendationAttribution {
  surface: AnalyticsSource;
  slug?:   string;
  setAt:   number;
}

// ── Public API ────────────────────────────────────────────────────────────────

export function setRecommendationAttribution(
  attribution: Omit<RecommendationAttribution, "setAt">,
): void {
  try {
    const value: RecommendationAttribution = { ...attribution, setAt: Date.now() };
    sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(value));
  } catch {
    // sessionStorage unavailable — silent fail; checkout is unaffected.
  }
}

export function getRecommendationAttribution(): RecommendationAttribution | null {
  try {
    const raw = sessionStorage.getItem(ATTRIBUTION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as RecommendationAttribution;
  } catch {
    return null;
  }
}

export function clearRecommendationAttribution(): void {
  try {
    sessionStorage.removeItem(ATTRIBUTION_KEY);
  } catch {
    // silent
  }
}
