// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — les-sables-roses-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-09-02T17:25:41.325Z
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

export const lesSablesRosesInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "les-sables-roses-inspired",
  slug          : "les-sables-roses-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Les Sables Roses Inspired",
  collection    : "Elite",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "unisex",
  family        : ["Floral"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral Oriental",
  season        : "Autumn",
  notes: {
    top:   ["Pink Pepper"],
    heart: ["Rose de Mai", "Turkish Rose"],
    base:  ["Sandalwood", "Oud", "Amber", "White Musk"],
  },
  notesEvidenceLocked: true,
  mood          : "Warm Rose Amber",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Warm",
    "Luxurious",
    "Sophisticated",
    "Sensual",
    "Elegant",
    "Confident",
  ],
  occasions     : ["Daily Wear", "Office", "Date Night", "Evening"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Warm Rose Luxury", "Unisex Floral Oriental", "Amber-Grounded Elegance"],
  recommendedFor: [
    "Anyone seeking a luxurious rose fragrance that transcends gender and works equally well in professional and intimate settings.",
    "Those who love warm amber and oud but want rose to lead the story with elegance rather than sweetness.",
    "Fragrance collectors building a signature autumn wardrobe that bridges office confidence and evening allure.",
    "People drawn to creamy, spiced florals who appreciate layered compositions that evolve on skin throughout the day.",
  ],

  // ── Merchandising ───────────────────────────────────────────────────────────
  prices: {
    "5ml":  60,
    "10ml": 100,
    "30ml": 250,
  },
  images: {
    "5ml":  "",  // FACTORY_ERROR: IMAGE_MISSING — image path for 5ml is required
    "10ml": "",  // FACTORY_ERROR: IMAGE_MISSING — image path for 10ml is required
    "30ml": "",  // FACTORY_ERROR: IMAGE_MISSING — image path for 30ml is required
  },
  bestSeller    : false,
  newArrival    : false,

  // ── Education ───────────────────────────────────────────────────────────────
  subtitle      : "Warm Rose Amber",
  description   : "Pink pepper ignites against a heart of layered rose—creamy, slightly spiced, utterly luxurious. Sandalwood and oud ground the composition in amber and white musk, creating a warm second skin that feels both intimate and mysteriously textured.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "what-makes-a-signature-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "floral-oriental",
    "rose",
    "sandalwood",
    "oud",
    "pink-pepper",
    "amber",
    "musk",
    "signature",
    "unisex",
    "autumn",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "what-makes-a-signature-scent"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 3,
  warmth        : 2,
  intensity     : 3,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["rose-oud-inspired", "rose-of-no-man's-land-inspired", "velvet-rose-oud-inspired"],
    wardrobePartners: ["baccarat-rouge-540-inspired", "oud-mood-inspired"],
  },
};
