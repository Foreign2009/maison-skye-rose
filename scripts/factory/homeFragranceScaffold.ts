/**
 * Knowledge Factory — Home Fragrance Scaffold
 *
 * Derives all truthful deterministic fields from a HomeFragranceIntake.
 * Returns a HomeFragranceScaffoldResult whose record is a fully typed
 * HomeFragranceKnowledge — the canonical boundary for home fragrance records.
 *
 * Architectural boundary (EP4-P2R / EP4-P3A):
 *   FragranceKnowledge cannot honestly represent home fragrance because it
 *   carries fragrance-specific required fields (collection, gender, projection,
 *   scentCharacter, prices/images keyed "5ml"/"10ml"/"30ml") that have no
 *   truthful home fragrance equivalents.
 *
 *   HomeFragranceKnowledge is the honest boundary. Discovery arrays (vibe,
 *   seasons, signatureStyle, recommendedFor) are initialised empty here and
 *   enriched by HomeFragranceDiscoveryProducer in EP4-P4.
 *
 * No AI generation occurs in this scaffolder.
 */

import type { HomeFragranceIntake }        from "./types";
import type { HomeFragranceScaffoldResult } from "./types";
import type { HomeFragranceKnowledge }     from "../../app/lib/mkc/homeFragranceTypes";
import { deriveSlug }                      from "./core/deriveSlug";

export function scaffoldHomeFragrance(intake: HomeFragranceIntake): HomeFragranceScaffoldResult {
  const slug = deriveSlug(intake.title);

  const record: HomeFragranceKnowledge = {
    // ── Identity ──────────────────────────────────────────────────────────────
    id:          slug,
    slug,
    brand:       "Maison Skye & Rose",
    name:        intake.title,
    category:    "home-fragrance",
    productType: intake.productType,
    range:       intake.range,

    // ── Composition ───────────────────────────────────────────────────────────
    profile: intake.profile,
    season:  intake.season,
    mood:    intake.mood,
    notes: {
      // Seed the pyramid from intake notes.
      // CompositionProducer (EP4-P3C) enriches to ≥ 2 per tier.
      top:   intake.notes.slice(0, 1),
      heart: intake.notes.slice(1, 2),
      base:  intake.notes.slice(2),
    },

    // ── Editorial ─────────────────────────────────────────────────────────────
    subtitle: intake.subtitle,
    // description: absent until EditorialProducer runs (EP4-P3C)

    // ── Discovery ─────────────────────────────────────────────────────────────
    // Initialised empty. HomeFragranceDiscoveryProducer populates in EP4-P4.
    vibe:           [],
    seasons:        [],
    signatureStyle: [],
    recommendedFor: [],

    // ── Merchandising ─────────────────────────────────────────────────────────
    prices:     intake.prices,
    images:     intake.images,
    bestSeller: intake.bestSeller,
    newArrival: intake.newArrival,
  };

  return { record, degraded: false };
}
