// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — coach-floral-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-16T18:50:02.439Z
// Factory version:   0.5.0
// Prompt versions:   EditorialProducer@1.1.0  RelationshipProducer@1.0.0  EducationProducer@1.0.0  DiscoveryProducer@1.0.0
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

import type { FragranceKnowledge } from "../types";

export const coachFloralInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "coach-floral-inspired",
  slug          : "coach-floral-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Coach Floral Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Floral", "Woody"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral Woody",
  season        : "Spring",
  notes: {
    top:   ["Citrus", "Pink Peppercorn", "Pineapple Sorbet"],
    heart: ["Rose Tea", "Jasmine Sambac", "Gardenia"],
    base:  ["Creamy Wood", "Patchouli", "Musk"],
  },
  mood          : "Feminine Floral Fresh",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Feminine",
    "Fresh",
    "Elegant",
    "Soft",
    "Sophisticated",
  ],
  occasions     : ["Daily Wear", "Office", "Weekend", "Wedding"],
  seasons       : ["Spring", "Summer"],
  signatureStyle: ["Luminous Floral", "Balanced Feminine", "Softly Spiced Rose"],
  recommendedFor: [
    "Women seeking a luminous rose fragrance that balances floral romance with everyday wearability",
    "Those who love fresh florals with subtle spice and creamy warmth without heaviness",
    "Anyone building a signature spring fragrance that works for both daily moments and special occasions",
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
  subtitle      : "Luminous Floral Softness",
  description   : "Pink peppercorn and pineapple sorbet open with brightness, then dissolve into a heart of rose tea and jasmine sambac—luminous and gently spiced. Creamy wood and musk ground the composition, creating a feminine floral that feels both airy and anchored.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "floral",
    "rose",
    "jasmine",
    "woody",
    "patchouli",
    "signature-scent",
    "spring",
    "feminine",
    "daily-wear",
    "balanced",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 3,
  warmth        : 3,
  intensity     : 2,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["delina-inspired", "chance-eau-tendre-inspired", "mon-paris-inspired"],
    wardrobePartners: ["alien-inspired", "flowerbomb-inspired"],
  },
};
