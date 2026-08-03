import type { UnifiedCustomerProfile } from "./UnifiedCustomerProfile";

export function hasMeaningfulProfile(profile: UnifiedCustomerProfile): boolean {
  return (
    profile.signals.length > 0 ||
    profile.recentlyViewed.length > 0 ||
    profile.savedSlugs.length > 0 ||
    profile.lastQuizSlugs.length > 0
  );
}

// ── Profile Richness ────────────────────────────────────────────────────────────

/**
 * cold     — no meaningful customer information
 * passive  — browsing behaviour only; no expressed intent (recentlyViewed, no signals/saves/quiz)
 * emerging — explicit intent signal present: any learning signal, saved fragrances, or quiz history
 * rich     — established learned profile: signals >= 5 (HIGH confidence base in RecommendationConfidence)
 */
export type ProfileRichness = "cold" | "passive" | "emerging" | "rich";

export function getProfileRichness(profile: UnifiedCustomerProfile): ProfileRichness {
  const signalCount = profile.signals.length;
  const hasSaved    = profile.savedSlugs.length > 0;
  const hasQuiz     = profile.lastQuizSlugs.length > 0;
  const hasViewed   = profile.recentlyViewed.length > 0;

  if (signalCount >= 5)                         return "rich";
  if (signalCount >= 1 || hasSaved || hasQuiz)  return "emerging";
  if (hasViewed)                                return "passive";
  return "cold";
}
