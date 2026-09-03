// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — myrrh-tonka-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-09-02T17:24:46.795Z
// Factory version:   0.5.0
// Prompt versions:   EditorialProducer@1.1.0  RelationshipProducer@1.0.0  EducationProducer@1.0.0  DiscoveryProducer@1.0.0
// Validation status: FAIL  [3 error(s), 0 warning(s)]
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

export const myrrhTonkaInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "myrrh-tonka-inspired",
  slug          : "myrrh-tonka-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Myrrh Tonka Inspired",
  collection    : "Elite",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "unisex",
  family        : ["Amber"],
  scentCharacter: "Rich & Full-Bodied",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Oriental Amber",
  season        : "Autumn",
  notes: {
    top:   [],
    heart: [
      "Myrrh",
      "Tonka Bean",
      "Lavender",
      "Almond",
      "Vanilla",
      "Benzoin",
      "Amber",
    ],
    base:  [],
  },
  notesEvidenceLocked: true,
  mood          : "Warm Amber Balsamic",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Warm",
    "Sophisticated",
    "Sensual",
    "Elegant",
    "Luxurious",
    "Mature",
  ],
  occasions     : ["Office", "Date Night", "Evening", "Casual"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Resinous Warmth", "Creamy Amber", "Luxe Balsamic"],
  recommendedFor: [
    "Anyone seeking a warm, creamy amber that feels like a second skin for cooler evenings and intimate occasions.",
    "Those who love Oriental fragrances but prefer resinous depth and balsamic warmth over heavy spice.",
    "Fragrance collectors building an amber wardrobe who want a tonka-forward alternative to sweeter or more powdery options.",
    "Men and women who appreciate sophisticated vanilla and benzoin as the heart of luxury, not a supporting note.",
  ],

  // ── Merchandising ───────────────────────────────────────────────────────────
  prices: {
    "5ml":  60,
    "10ml": 100,
    "30ml": 250,
  },
  images: {
    "5ml":  "/images/blue-5ml.png",
    "10ml": "/images/blue-10ml.png",
    "30ml": "/images/glass-blue-30ml.png",
  },
  bestSeller    : false,
  newArrival    : false,

  // ── Education ───────────────────────────────────────────────────────────────
  subtitle      : "Resinous Warmth",
  description   : "Myrrh opens with a balsamic warmth, grounded in tonka's creamy sweetness and the resinous depth of amber. Lavender and almond soften the edges, while benzoin and vanilla create a luxurious, skin-like embrace that unfolds with quiet intensity.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "how-to-wear-fragrance"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "amber",
    "oriental",
    "myrrh",
    "tonka-bean",
    "vanilla",
    "benzoin",
    "rich",
    "full-bodied",
    "unisex",
    "layering",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 3,
  freshness     : 2,
  warmth        : 4,
  intensity     : 3,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["arabians-tonka-inspired", "baccarat-rouge-540-inspired"],
    wardrobePartners: ["spicebomb-extreme-inspired", "tom-ford-noir-inspired"],
  },
};
