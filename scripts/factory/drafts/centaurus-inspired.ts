// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — centaurus-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-22T18:54:15.577Z
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

import type { FragranceKnowledge } from "../../../app/lib/mkc/types";

export const centaurusInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "centaurus-inspired",
  slug          : "centaurus-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Centaurus Inspired",
  collection    : "Elite",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "unisex",
  family        : ["Spicy"],
  scentCharacter: "Rich & Full-Bodied",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Oriental Spicy",
  season        : "Autumn",
  notes: {
    top:   ["Pink Pepper", "Cinnamon", "Cardamom"],
    heart: ["Sandalwood", "Jasmine", "Heliotrope"],
    base:  ["Patchouli", "Tonka Bean", "Bourbon Vanilla"],
  },
  notesEvidenceLocked: true,
  mood          : "Warm Spicy Oriental",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Warm",
    "Sophisticated",
    "Sensual",
    "Mysterious",
    "Elegant",
    "Bold",
  ],
  occasions     : ["Office", "Date Night", "Evening", "Weekend"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Spiced Amber Elegance", "Oriental Warmth", "Creamy Spice Statement"],
  recommendedFor: [
    "Anyone seeking a warm, spiced signature that bridges day and evening without compromise.",
    "Those who love Oriental fragrances but want green spice and creamy florals instead of pure sweetness.",
    "Date night and social wearers who need a fragrance with presence, depth, and sensual warmth.",
    "Fragrance collectors building a seasonal wardrobe who want autumn's richness in a single, versatile bottle.",
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
  subtitle      : "Spiced Amber",
  description   : "Pink pepper and cinnamon ignite with cardamom's green bite, opening onto a creamy bed of sandalwood and jasmine warmed by heliotrope's powdered softness. Patchouli and tonka bean anchor the composition in dark amber and vanilla, creating a fragrance that moves between spice and skin-like warmth.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "choosing-your-season-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "spicy",
    "oriental",
    "pink-pepper",
    "cinnamon",
    "cardamom",
    "sandalwood",
    "patchouli",
    "tonka-bean",
    "vanilla",
    "rich",
    "full-bodied",
    "autumn",
    "unisex",
    "office",
    "date-night",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 2,
  warmth        : 4,
  intensity     : 3,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["spicebomb-extreme-inspired", "tobacco-vanille-inspired", "amen-fantasm-inspired"],
    wardrobePartners: ["baccarat-rouge-540-inspired", "oud-mood-inspired"],
  },
};
