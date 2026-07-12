/**
 * Knowledge Factory — Scaffold
 *
 * Derives all deterministic structural fields from a DisplayFragrance.
 * Produces the base FragranceKnowledge that AI producers will enrich in P2.
 *
 * Reuses adaptFragrance() from knowledgeAdapter without modification.
 * Follows the same mapping pattern as hydrateFromDisplay() in catalogue.ts.
 *
 * Deterministic fields (no AI): identity, classification, composition structure,
 *   merchandising, intelligence approximations.
 * Placeholder fields (await AI): description, expanded notes, vibe enrichment,
 *   recommendedFor, academy fields.
 */

import { adaptFragrance }    from "../../app/lib/knowledgeAdapter";
import type { DisplayFragrance } from "../../app/lib/knowledgeAdapter";
import type { FragranceKnowledge } from "../../app/lib/mkc/types";
import type { ScaffoldResult }     from "./types";
import { deriveSlug }              from "./intake";

export function scaffold(f: DisplayFragrance): ScaffoldResult {
  let degraded = false;
  let adapted: ReturnType<typeof adaptFragrance>;

  try {
    adapted = adaptFragrance(f);
  } catch {
    degraded = true;
    // Fallback: build minimal record from raw DisplayFragrance fields only
    return { record: buildMinimalRecord(f), degraded: true };
  }

  const slug = deriveSlug(f.title);

  // ── Compose notes ───────────────────────────────────────────────────────────
  // Follows hydrateFromDisplay() pattern from catalogue.ts:
  //   top   → adapted.notes.top  (note at index 0)
  //   heart → adapted.notes.heart (note at index 1)
  //   base  → f.notes.slice(2)   (all remaining notes — lossless for multi-note entries)
  //
  // Result is typically [1, 1, 1] per tier from the supplier catalogue.
  // The Composition Producer (P2) will enrich these to the required minimum of 2 per tier.
  const notesTop   = adapted.notes.top.length   > 0 ? adapted.notes.top   : [];
  const notesHeart = adapted.notes.heart.length > 0 ? adapted.notes.heart : [];
  const notesBase  = f.notes.slice(2).length    > 0 ? f.notes.slice(2)    : [];

  const record: FragranceKnowledge = {

    // ── Identity ──────────────────────────────────────────────────────────────
    id:             slug,
    slug,
    brand:          "Maison Skye & Rose",
    name:           f.title,
    collection:     f.collection,
    catalogVersion: "1.0",
    status:         "active",

    // ── Classification ────────────────────────────────────────────────────────
    // All deterministic — derived from profile vocabulary matching.
    gender:         adapted.gender,
    family:         adapted.family,
    scentCharacter: adapted.scentCharacter,
    projection:     adapted.projection,

    // ── Composition ───────────────────────────────────────────────────────────
    // profile, season, mood copied verbatim. Notes are seeded from the catalogue
    // (1 per tier). The validator will flag NOTES_*_MIN until P2 enriches them.
    profile: f.profile,
    season:  f.season,
    notes: {
      top:   notesTop,
      heart: notesHeart,
      base:  notesBase,
    },
    mood: f.mood,

    // ── Discovery ─────────────────────────────────────────────────────────────
    // vibe: extracted from mood vocabulary — may be empty or below minimum.
    // occasions, seasons: derived from season lookup table (deterministic).
    // signatureStyle: catalogue subtitle used as initial value.
    // recommendedFor: empty — requires P2 AI enrichment.
    vibe:           adapted.vibe,
    occasions:      adapted.occasions,
    seasons:        adapted.seasons,
    signatureStyle: adapted.signatureStyle,
    recommendedFor: adapted.recommendedFor,  // always [] from adaptFragrance

    // ── Merchandising ─────────────────────────────────────────────────────────
    // Authoritative — copied directly from supplier catalogue.
    prices:     f.prices,
    images:     f.images,
    bestSeller: f.bestSeller,
    newArrival: f.newArrival,

    // ── Education ─────────────────────────────────────────────────────────────
    // subtitle copied from catalogue subtitle (passes validator subtitle check).
    // description omitted — optional field, validator will flag as DESCRIPTION_REQUIRED.
    // Academy fields omitted — require P2 AI enrichment.
    subtitle: f.subtitle,

    // ── Intelligence ──────────────────────────────────────────────────────────
    // All deterministic approximations from knowledgeAdapter.
    sweetness:   adapted.sweetness,
    freshness:   adapted.freshness,
    warmth:      adapted.warmth,
    intensity:   adapted.intensity,
    versatility: adapted.versatility,
    popularity:  adapted.popularity,
  };

  return { record, degraded };
}

// ── Fallback ───────────────────────────────────────────────────────────────────

function buildMinimalRecord(f: DisplayFragrance): FragranceKnowledge {
  const slug = deriveSlug(f.title);

  return {
    id:             slug,
    slug,
    brand:          "Maison Skye & Rose",
    name:           f.title,
    collection:     f.collection,
    catalogVersion: "1.0",
    status:         "active",

    gender:         f.collection === "Skye" ? "male" : f.collection === "Rose" ? "female" : "unisex",
    family:         [],
    scentCharacter: "Balanced Signature",
    projection:     "moderate",

    profile: f.profile,
    season:  f.season,
    notes: { top: [], heart: [], base: f.notes.slice(2) },
    mood:    f.mood,

    vibe:           [],
    occasions:      ["Daily Wear"],
    seasons:        ["Spring", "Summer", "Autumn", "Winter"],
    signatureStyle: [f.subtitle],
    recommendedFor: [],

    prices:     f.prices,
    images:     f.images,
    bestSeller: f.bestSeller,
    newArrival: f.newArrival,

    subtitle: f.subtitle,

    sweetness:   2,
    freshness:   2,
    warmth:      2,
    intensity:   3,
    versatility: 3,
    popularity:  f.bestSeller ? 10 : 5,
  };
}
