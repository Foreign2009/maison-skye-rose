// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — miss-dior-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-07-12T19:15:13.206Z
// Factory version:   0.1.0
// Prompt versions:   (none — P1 structural scaffold only)
// Validation status: FAIL  [5 error(s), 3 warning(s)]
// Projected KQ tier: (not available — requires P2 enrichment)
// ─────────────────────────────────────────────────────────────────
// REVIEW CHECKLIST
//   □ Notes pyramid verified against reference fragrance (≥ 2 notes per tier)
//   □ Description added in Maison editorial voice (2–4 sentences)
//   □ Vibe tags meet minimum of 3 (from approved vocabulary)
//   □ recommendedFor has minimum of 2 persona statements
//   □ All FACTORY_ERROR markers resolved
//   □ All FACTORY_WARN markers reviewed
//   □ Relationship suggestions reviewed (see footer)
//   □ npm run mkc:validate passes before promotion
// ═════════════════════════════════════════════════════════════════

import type { FragranceKnowledge } from "../../../app/lib/mkc/types";

export const missDiorInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "miss-dior-inspired",
  slug          : "miss-dior-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Miss Dior Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Floral"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral",
  season        : "Spring",
  notes: {
    top:   ["Rose"],  // FACTORY_ERROR: NOTES_TOP_MIN — minimum 2 top notes required (found 1)
    heart: ["Peony"],  // FACTORY_ERROR: NOTES_HEART_MIN — minimum 2 heart notes required (found 1)
    base:  ["Vanilla"],  // FACTORY_ERROR: NOTES_BASE_MIN — minimum 2 base notes required (found 1)
  },
  mood          : "Elegant feminine florals with playful luxury.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : ["Feminine", "Elegant", "Playful", "Luxury"],
  occasions     : ["Daily Wear", "Wedding"],
  seasons       : ["Spring"],
  signatureStyle: ["Soft Luxury"],
  recommendedFor: [],  // FACTORY_ERROR: RECOMMENDED_FOR_MIN — minimum 2 recommendedFor values required (found 0)

  // ── Merchandising ───────────────────────────────────────────────────────────
  prices: {
    "5ml":  60,
    "10ml": 100,
    "30ml": 250,
  },
  images: {
    "5ml":  "/images/pink-5ml.png",
    "10ml": "/images/pink-10ml.png",
    "30ml": "/images/glass-pink-30ml.png",
  },
  bestSeller    : true,
  newArrival    : false,

  // ── Education ───────────────────────────────────────────────────────────────
  subtitle      : "Soft Luxury",
  // description:  (not set — required, will be authored in P2)
  //  // FACTORY_ERROR: DESCRIPTION_REQUIRED — description is required for all native records
  // academyArticleIds: (not set — will be linked in P2)  // FACTORY_WARN: ACADEMY_ARTICLES_NOT_LINKED — no academy articles linked — academy article boost (+50) will not apply

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 3,
  warmth        : 2,
  intensity     : 2,
  versatility   : 3,
  popularity    : 10,

  // ── FACTORY: Relationship Suggestions (P1 — not populated) ──────────────────
  // Relationship suggestions require the Relationship Producer (P3 AI enrichment).
  // They will appear here after re-running the factory with P3 active.
  //
  // To implement manually, add a relationships block:
  //   relationships: {
  //     alternatives:     [],  // slugs of comparable alternatives — must be symmetric
  //     wardrobePartners: [],  // slugs to own alongside this — must be symmetric
  //     evolutionOf:      "",  // predecessor slug if this is a line evolution
  //     evolutions:       [],  // successor slugs that evolved from this
  //   },
  //
  // IMPORTANT: All relationship fields require reciprocal entries in the
  // referenced records. Run npm run mkc:validate to verify integrity.
};
