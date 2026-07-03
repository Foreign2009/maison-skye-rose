/**
 * Maison Knowledge Catalogue — Hydrated Catalogue
 *
 * Exports mkcCatalogue as the single MKC data source.
 *
 * MIGRATION BOOTSTRAP NOTE
 * ────────────────────────
 * hydrateFromDisplay() currently uses adaptFragrance() from knowledgeAdapter
 * to derive Classification, Discovery, and Intelligence fields. This is a
 * temporary bridge during the incremental MKC migration.
 *
 * Target architecture (no adaptFragrance dependency):
 *
 *   Raw Catalogue (skye.ts / rose.ts / elite.ts)
 *           ↓
 *   Maison Knowledge Catalogue (FragranceKnowledge[])
 *           ↓                           ↓
 *   Display Adapter             Recommendation Adapter
 *           ↓                           ↓
 *   DisplayFragrance              Fragrance
 *           ↓                           ↓
 *         UI              Recommendation Engine
 *
 * Once the raw catalogue files are migrated to native FragranceKnowledge
 * format, this file will export the catalogue directly without adaptation.
 * The adaptFragrance() call and hydrateFromDisplay() function will be removed.
 */

import { adaptFragrance, DisplayFragrance } from "../knowledgeAdapter";
import { fragrances } from "../../data/fragrances";
import type { FragranceKnowledge } from "./types";

function hydrateFromDisplay(f: DisplayFragrance): FragranceKnowledge {
  const adapted = adaptFragrance(f);

  return {
    // ── Identity ────────────────────────────────────────────────────────────────
    id:         adapted.id,
    slug:       adapted.id,
    brand:      adapted.brand,
    name:       f.title,
    collection: f.collection,

    // ── Classification ──────────────────────────────────────────────────────────
    gender:         adapted.gender,
    family:         adapted.family,
    scentCharacter: adapted.scentCharacter,
    projection:     adapted.projection,

    // ── Composition ─────────────────────────────────────────────────────────────
    profile: f.profile,
    season:  f.season,
    notes: {
      top:   adapted.notes.top,
      heart: adapted.notes.heart,
      // slice(2) captures notes[2] and any notes beyond index 2, ensuring
      // the round-trip via toDisplayFragrance is lossless for all catalogue
      // entries regardless of how many notes they contain.
      base:  f.notes.slice(2),
    },
    mood: f.mood,

    // ── Discovery ───────────────────────────────────────────────────────────────
    vibe:           adapted.vibe,
    occasions:      adapted.occasions,
    seasons:        adapted.seasons,
    signatureStyle: adapted.signatureStyle,
    recommendedFor: adapted.recommendedFor,

    // ── Merchandising ───────────────────────────────────────────────────────────
    prices:     f.prices,
    images:     f.images,
    bestSeller: f.bestSeller,
    newArrival: f.newArrival,
    featured:   adapted.featured,

    // ── Education ───────────────────────────────────────────────────────────────
    subtitle: f.subtitle,

    // ── Intelligence ────────────────────────────────────────────────────────────
    sweetness:   adapted.sweetness,
    freshness:   adapted.freshness,
    warmth:      adapted.warmth,
    intensity:   adapted.intensity,
    versatility: adapted.versatility,
    popularity:  adapted.popularity,
  };
}

export const mkcCatalogue: FragranceKnowledge[] =
  (fragrances as DisplayFragrance[]).map(hydrateFromDisplay);
