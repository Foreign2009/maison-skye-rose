// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — leather-malaki-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-09-11T18:52:38.824Z
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

export const leatherMalakiInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "leather-malaki-inspired",
  slug          : "leather-malaki-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Leather Malaki Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Leather", "Woody"],
  scentCharacter: "Deep & Intense",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Leather Woody",
  season        : "Autumn",
  notes: {
    top:   ["Bergamot", "Black Pepper"],
    heart: ["Alaskan Cedar", "Cypress", "Spicy Notes"],
    base:  ["Leather", "Labdanum", "Mineral Notes", "Amber"],
  },
  notesEvidenceLocked: true,
  mood          : "Dry Smoky Leather Mineral",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Intense",
    "Sophisticated",
    "Mysterious",
    "Warm",
    "Mature",
    "Bold",
  ],
  occasions     : ["Office", "Date Night", "Evening", "Formal"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Dry Smoky Leather", "Woody Masculine Depth", "Mineral Cedar Elegance"],
  recommendedFor: [
    "Men who gravitate toward leather and woody fragrances and want something sophisticated for professional and evening settings.",
    "Those seeking a deep, mineral-driven leather that feels aged and smoky rather than soft or animalic.",
    "Anyone drawn to spiced, complex compositions that evolve from bright bergamot into leather and amber.",
    "Fragrance enthusiasts building a collection around woody and leather signatures for autumn and cooler months.",
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
  subtitle      : "Dry Smoky Leather",
  description   : "Black pepper and bergamot ignite against the mineral breath of cypress and Alaskan cedar, grounding into a leather that smells of smoke and aged hide. Labdanum and amber anchor the composition with a dry, almost ashy warmth—a fragrance that tastes like stone and tastes like time.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "how-to-wear-fragrance"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "leather",
    "woody",
    "amber",
    "cedar",
    "spicy",
    "deep",
    "intense",
    "masculine",
    "autumn",
    "office",
    "layering",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "how-to-wear-fragrance"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 1,
  warmth        : 3,
  intensity     : 3,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["ombre-leather-inspired", "spicebomb-dark-leather-inspired"],
    wardrobePartners: ["sauvage-elixir-inspired"],
  },
};
