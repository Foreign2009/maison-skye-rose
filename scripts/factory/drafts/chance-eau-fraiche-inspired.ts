// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — chance-eau-fraiche-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-07-13T18:30:09.333Z
// Factory version:   0.5.0
// Prompt versions:   CompositionProducer@1.0.0  EditorialProducer@1.0.0  RelationshipProducer@1.0.0  EducationProducer@1.0.0  DiscoveryProducer@1.0.0
// Validation status: PASS  [0 error(s), 0 warning(s)]
// Projected KQ tier: (not available — requires Intelligence Producer)
// ─────────────────────────────────────────────────────────────────
// REVIEW CHECKLIST
//   □ Notes pyramid verified (≥ 2 per tier, no cross-tier duplicates)
//   □ Description reviewed in Maison editorial voice
//   □ Vibe tags meet minimum of 3 (from approved vocabulary)
//   □ recommendedFor has minimum of 2 persona statements
//   □ All FACTORY_ERROR markers resolved
//   □ All FACTORY_WARN markers reviewed
//   □ Relationship suggestions reviewed (see footer)
//   □ npm run mkc:validate passes before promotion
// ═════════════════════════════════════════════════════════════════

import type { FragranceKnowledge } from "../../../app/lib/mkc/types";

export const chanceEauFraicheInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "chance-eau-fraiche-inspired",
  slug          : "chance-eau-fraiche-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Chance Eau Fraiche Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Floral", "Fresh"],
  scentCharacter: "Fresh & Light",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Fresh Floral",
  season        : "Summer",
  notes: {
    top:   ["Bergamot", "Pink Grapefruit", "Yuzu"],
    heart: ["Jasmine Sambac", "Peony", "Lily of the Valley"],
    base:  ["Teakwood", "White Musk", "Ambroxan"],
  },
  mood          : "Clean and sophisticated.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Fresh",
    "Sophisticated",
    "Clean",
    "Delicate",
    "Bright",
    "Elegant",
  ],
  occasions     : [
    "Daily Wear",
    "Office",
    "Casual",
    "Vacation",
    "Weekend",
  ],
  seasons       : ["Spring", "Summer"],
  signatureStyle: ["Fresh Elegance", "Luminous Floral", "Sophisticated Lightness"],
  recommendedFor: [
    "Women seeking a luminous daily fragrance that feels like morning freshness without heaviness or drama",
    "Those who love florals but prefer restraint—delicate peony and jasmine over bold perfume presence",
    "Anyone looking for a summer signature that works from office to vacation without needing to reapply",
  ],

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
  bestSeller    : false,
  newArrival    : false,

  // ── Education ───────────────────────────────────────────────────────────────
  subtitle      : "Luminous Restraint",
  description   : "Opens with bright bergamot and pink grapefruit that feel like morning light on skin. The heart unfolds into jasmine and peony—luminous florals that breathe rather than announce—before settling into a whisper of teakwood and white musk that lingers clean and intimate.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-wear-fragrance"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "floral",
    "fresh",
    "citrus",
    "jasmine",
    "peony",
    "lily-of-the-valley",
    "summer",
    "light",
    "clean",
    "sophisticated",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 1,
  freshness     : 5,
  warmth        : 1,
  intensity     : 2,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships (not populated) ───────────────────────────────────────────
  // Re-run the factory with an ANTHROPIC_API_KEY to generate relationship suggestions.
  //
  // To implement manually, add a relationships block:
  //   relationships: {
  //     alternatives:     [],  // slugs of comparable alternatives — must be symmetric
  //     wardrobePartners: [],  // slugs to own alongside this — must be symmetric
  //   },
  //
  // IMPORTANT: All relationship fields require reciprocal entries in referenced records.
};
