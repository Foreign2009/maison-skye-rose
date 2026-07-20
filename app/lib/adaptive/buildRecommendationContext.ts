/**
 * Contextual Recommendation Copy Builder — EP22.3
 *
 * Pure helper that derives contextual section copy (label, heading, body)
 * for recommendation surfaces based on the current page and customer profile.
 *
 * Rules:
 *   - Never alters recommendation ranking or selection.
 *   - Only adapts: label, heading, editorial body copy.
 *   - Returns null for cold-start customers → calling component falls back
 *     to its existing static strings unchanged.
 *   - No new scoring algorithms. Reuses existing PreferenceScorer signals.
 *
 * Signal priority:
 *   1. quizCharacter — explicit quiz answer (character_preference signal)
 *   2. quizFamily    — explicit quiz answer (family_preference signal)
 *   3. broadFamily   — first family from buildPreferenceProfile (saves → quiz slugs → viewed)
 *
 * Integration points:
 *   IntelligenceSection — receives RecommendationDisplayContext as optional prop
 *   CuratedForYou       — calls this helper with its own profile
 *   Collection pages    — call this helper, pass result to IntelligenceSection
 */

import { buildPreferenceProfile } from "../customer/recommendations/PreferenceScorer";
import { createContext }          from "../customer/recommendations/RecommendationContext";
import { hasMeaningfulProfile }   from "../customer/profile/profileUtils";
import type { UnifiedCustomerProfile } from "../customer/profile/UnifiedCustomerProfile";

// ── Public types ──────────────────────────────────────────────────────────────

export type PageType =
  | "collection"         // /collections/skye, /rose, /elite
  | "best-sellers"       // /best-sellers
  | "new-arrivals"       // /new-arrivals
  | "fragrance-profile"  // /fragrance-profile
  | "recently-viewed"    // /recently-viewed
  | "homepage"           // / (CuratedForYou)
  | "favorites";         // /favorites

export interface RecommendationDisplayContext {
  readonly label:   string;
  readonly heading: string;
  readonly body:    string;
}

// ── Helper ────────────────────────────────────────────────────────────────────

function extractString(payload: Readonly<Record<string, unknown>>, key: string): string | null {
  const v = payload[key];
  return typeof v === "string" ? v : null;
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Derives contextual recommendation section copy for the given page and customer.
 *
 * Returns null when:
 *   - profile is null or cold-start (hasMeaningfulProfile = false)
 *   - no character or family signal is derivable
 *
 * Null signals the caller to use existing static strings unchanged.
 */
export function buildRecommendationContext(
  page:    PageType,
  profile: UnifiedCustomerProfile | null,
  opts?:   { collection?: string },
): RecommendationDisplayContext | null {
  if (!profile || !hasMeaningfulProfile(profile)) return null;

  // Extract quiz signals — explicit, high-confidence preference answers
  const quizSignals     = profile.signals.filter((s) => s.source === "quiz");
  const characterSignal = quizSignals.find((s) => s.type === "character_preference");
  const familySignal    = quizSignals.find((s) => s.type === "family_preference");

  const quizCharacter = characterSignal ? extractString(characterSignal.payload, "character") : null;
  const quizFamily    = familySignal    ? extractString(familySignal.payload,    "family")    : null;

  // Broad family preference — derived from saves + quiz result slugs + viewed
  const prefProfile = buildPreferenceProfile(createContext(profile, "personalised"));
  const broadFamily = prefProfile.preferredFamilies.size > 0
    ? [...prefProfile.preferredFamilies][0]
    : null;

  // Best available family signal: explicit quiz answer wins over behavioural inference
  const topFamily = quizFamily ?? broadFamily;

  // Nothing useful to say — let caller use existing static strings
  if (!quizCharacter && !topFamily) return null;

  switch (page) {

    case "collection": {
      if (!topFamily) return null;
      const collection = opts?.collection;
      return {
        label:   "Selected For You",
        heading: `More In Your ${topFamily} Style`,
        body: collection
          ? `Selected from the ${collection} range to complement the ${topFamily} direction of your Maison journey.`
          : `Selected to complement the ${topFamily} direction of your Maison journey.`,
      };
    }

    case "best-sellers": {
      if (!topFamily) return null;
      return {
        label:   "Selected For You",
        heading: "Best Sellers In Your Style",
        body:    `The most loved Maison fragrances — selected to match the ${topFamily} preferences you have expressed.`,
      };
    }

    case "new-arrivals": {
      if (quizCharacter) {
        return {
          label:   "Selected For You",
          heading: "New Arrivals For Your Maison Character",
          body:    `New additions selected to continue the ${quizCharacter} direction of your Maison journey.`,
        };
      }
      if (topFamily) {
        return {
          label:   "Selected For You",
          heading: "New In Your Style",
          body:    `New arrivals selected to match the ${topFamily} preferences you have been exploring.`,
        };
      }
      return null;
    }

    case "fragrance-profile": {
      if (quizCharacter) {
        return {
          label:   "Selected For You",
          heading: "Selected For Your Maison Character",
          body:    `Fragrances chosen to complement your ${quizCharacter} character — selected from across the Maison collection.`,
        };
      }
      return {
        label:   "Selected For You",
        heading: "Selected For Your Style",
        body:    `Selected from across the Maison collection to match the ${topFamily} direction of your journey.`,
      };
    }

    case "recently-viewed": {
      if (topFamily) {
        return {
          label:   "Continue Your Journey",
          heading: `Continue Your ${topFamily} Discovery`,
          body:    `Selected to complement the fragrances you have already explored — following the ${topFamily} direction of your journey.`,
        };
      }
      return {
        label:   "Continue Your Journey",
        heading: "Continue Your Journey",
        body:    `Selected to complement the fragrances you have explored — aligned with your ${quizCharacter} character.`,
      };
    }

    case "homepage": {
      if (quizCharacter && topFamily) {
        return {
          label:   "Curated For You",
          heading: `Selected For Your ${quizCharacter} Character`,
          body:    `A selection built around your ${topFamily} preferences and the ${quizCharacter} character you have expressed.`,
        };
      }
      if (quizCharacter) {
        return {
          label:   "Curated For You",
          heading: `Selected For Your ${quizCharacter} Character`,
          body:    `A selection aligned with the ${quizCharacter} character you have expressed across the Maison collection.`,
        };
      }
      return {
        label:   "Curated For You",
        heading: "Selected For Your Fragrance Profile",
        body:    `A selection built around the ${topFamily} style you have been exploring.`,
      };
    }

    case "favorites": {
      if (!topFamily) return null;
      return {
        label:   "Selected For You",
        heading: `More In Your ${topFamily} Style`,
        body:    `Selected to complement the pieces you have saved — chosen for the ${topFamily} direction of your collection.`,
      };
    }

    default:
      return null;
  }
}
