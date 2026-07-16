// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — kayali-vanilla-28-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-07-13T18:29:22.982Z
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

import type { FragranceKnowledge } from "../types";

export const kayaliVanilla28Inspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "kayali-vanilla-28-inspired",
  slug          : "kayali-vanilla-28-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Kayali Vanilla 28 Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Gourmand", "Vanilla"],
  scentCharacter: "Rich & Long Wearing",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Vanilla Gourmand",
  season        : "Winter",
  notes: {
    top:   ["Vanilla Bourbon", "Pink Pepper"],
    heart: ["Tonka Bean Absolute", "Rose Absolute"],
    base:  ["Amber Resin", "Sandalwood"],
  },
  mood          : "Warm and delicious.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Warm",
    "Sensual",
    "Luxurious",
    "Elegant",
    "Delicate",
    "Sophisticated",
  ],
  occasions     : ["Date Night", "Evening", "Weekend"],
  seasons       : ["Winter", "Autumn"],
  signatureStyle: ["Sophisticated Gourmand", "Creamy Warmth", "Luxury Vanilla"],
  recommendedFor: [
    "Women seeking a luxurious vanilla fragrance that feels indulgent without being overly sweet or childish",
    "Those who love gourmand scents with a sophisticated rose and amber foundation for evening wear",
    "Anyone looking for a signature winter fragrance that combines creamy warmth with subtle spice and elegance",
    "Women who want a sensual, long-wearing fragrance for date nights and intimate winter occasions",
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
  subtitle      : "Creamy Warmth",
  description   : "Vanilla Bourbon and pink pepper open with gentle spice, surrendering immediately to a creamy heart of tonka bean and rose absolute—a pairing that tastes as much as it smells. Amber resin and sandalwood anchor the composition in warm skin, creating a fragrance that feels like a whispered indulgence rather than a shout.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "choosing-your-season-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "vanilla",
    "gourmand",
    "tonka-bean",
    "rose",
    "amber",
    "sandalwood",
    "warm",
    "winter",
    "date-night",
    "layering",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 4,
  freshness     : 1,
  warmth        : 4,
  intensity     : 4,
  versatility   : 2,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["delina-inspired", "hypnotic-poison-inspired"],
    wardrobePartners: ["baccarat-rouge-540-inspired"],
  },
};
