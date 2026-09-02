// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — angel-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-09-02T17:27:33.989Z
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

export const angelInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "angel-inspired",
  slug          : "angel-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Angel Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Gourmand"],
  scentCharacter: "Rich & Full-Bodied",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Gourmand Oriental",
  season        : "Autumn",
  notes: {
    top:   [
      "Melon",
      "Bergamot",
      "Coconut",
      "Cotton Candy",
      "Cassis",
    ],
    heart: [
      "Honey",
      "Apricot",
      "Blackberry",
      "Jasmine",
      "Lily of the Valley",
      "Red Berries",
    ],
    base:  [
      "Patchouli",
      "Chocolate",
      "Caramel",
      "Musk",
      "Vanilla",
      "Amber",
      "Sandalwood",
    ],
  },
  notesEvidenceLocked: true,
  mood          : "Sweet Patchouli Gourmand",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Sensual",
    "Sophisticated",
    "Warm",
    "Luxurious",
    "Mysterious",
    "Playful",
  ],
  occasions     : ["Date Night", "Evening", "Weekend", "Formal"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Luxe Gourmand Oriental", "Velvet Sweetness", "Dark Honey Elegance"],
  recommendedFor: [
    "Women seeking a signature gourmand that balances sweetness with sophisticated dark notes for evening wear",
    "Those who love honey, caramel, and patchouli and want a fragrance that feels like a luxurious treat",
    "Anyone drawn to voluptuous orientals who appreciates fruit-forward sweetness grounded in earthy, sensual base notes",
    "Fragrance collectors building an autumn and evening rotation who want a statement piece with depth",
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
  subtitle      : "Dark Honey Patchouli",
  description   : "A voluptuous embrace of honeyed stone fruit and dark patchouli, laced with whispers of caramel and sandalwood. Cotton candy brightness dissolves into a cocoa-dusted warmth that settles on skin like cashmere, amber and musk creating an enveloping sensuality beneath.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "choosing-your-season-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "gourmand",
    "oriental",
    "vanilla",
    "caramel",
    "chocolate",
    "honey",
    "patchouli",
    "autumn",
    "date-night",
    "versatile",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 4,
  freshness     : 2,
  warmth        : 2,
  intensity     : 3,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["hypnotic-poison-inspired", "black-opium-inspired", "love-don't-be-shy-inspired"],
    wardrobePartners: ["alien-inspired", "coco-mademoiselle-inspired"],
  },
};
