/**
 * Knowledge Factory — Home Fragrance Scaffold
 *
 * Derives all deterministic structural fields from a HomeFragranceIntake.
 * Returns a FragranceKnowledge-shaped record seeded with home fragrance conventions.
 *
 * Notes on current limitations (EP4-P2 foundation):
 *
 *   collection — typed "Skye" | "Rose" | "Elite" on FragranceKnowledge. Home fragrance
 *     ranges will be formally named in EP4-P3; "Elite" is used as the scaffold default.
 *
 *   prices / images — FragranceKnowledge uses the "5ml"/"10ml"/"30ml" shape. Home
 *     fragrance sizes differ (e.g., "150g", "100ml"). Placeholder shape is used here;
 *     a dedicated HomeFragranceKnowledge type resolves this constraint in a future episode.
 *
 * No AI generation occurs in this scaffolder. Discovery, relationships, and education
 * fields are empty and await producer enrichment in EP4-P3.
 */

import type { FragranceKnowledge } from "../../app/lib/mkc/types";
import type { HomeFragranceIntake, ScaffoldResult } from "./types";
import { deriveSlug }               from "./core/deriveSlug";

export function scaffoldHomeFragrance(intake: HomeFragranceIntake): ScaffoldResult {
  const slug = deriveSlug(intake.title);

  const record: FragranceKnowledge = {

    // ── Identity ──────────────────────────────────────────────────────────────
    id:             slug,
    slug,
    brand:          "Maison Skye & Rose",
    name:           intake.title,
    collection:     "Elite",          // scaffold default — home ranges defined in EP4-P3
    catalogVersion: "1.0",
    status:         "active",
    category:       "home-fragrance",

    // ── Classification ────────────────────────────────────────────────────────
    // Home fragrance is ambient: gender → unisex; character and projection use
    // neutral defaults pending AI enrichment in EP4-P3.
    gender:         "unisex",
    family:         [],
    scentCharacter: "Balanced Signature",
    projection:     "moderate",

    // ── Composition ───────────────────────────────────────────────────────────
    // Notes seeded from the catalogue array (1 per tier, matching the fragrance
    // scaffold convention). CompositionProducer will enrich in EP4-P3.
    profile: intake.profile,
    season:  intake.season,
    notes: {
      top:   intake.notes.slice(0, 1),
      heart: intake.notes.slice(1, 2),
      base:  intake.notes.slice(2),
    },
    mood: intake.mood,

    // ── Discovery ─────────────────────────────────────────────────────────────
    // All empty — require DiscoveryProducer enrichment in EP4-P3.
    vibe:           [],
    occasions:      [],
    seasons:        [],
    signatureStyle: intake.subtitle ? [intake.subtitle] : [],
    recommendedFor: [],

    // ── Merchandising ─────────────────────────────────────────────────────────
    // Placeholder size labels — home fragrance pricing uses different units
    // (e.g., "150g" for candles, "100ml" for sprays/diffusers). The actual
    // HomeFragranceIntake prices are available on the intake record; this shape
    // satisfies the FragranceKnowledge type contract for EP4-P2.
    prices:     { "5ml": 0, "10ml": 0, "30ml": 0 },
    images:     { "5ml": "", "10ml": "", "30ml": "" },
    bestSeller: intake.bestSeller,
    newArrival: intake.newArrival,

    // ── Education ─────────────────────────────────────────────────────────────
    subtitle: intake.subtitle,

    // ── Intelligence ──────────────────────────────────────────────────────────
    // Neutral defaults — will be enriched by DiscoveryProducer in EP4-P3.
    sweetness:   2,
    freshness:   2,
    warmth:      3,
    intensity:   2,
    versatility: 3,
    popularity:  intake.bestSeller ? 10 : 5,
  };

  return { record, degraded: false };
}
