// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — light-blue-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-16T16:33:23.117Z
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

export const lightBlueInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "light-blue-inspired",
  slug          : "light-blue-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Light Blue Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Aquatic", "Floral"],
  scentCharacter: "Fresh & Light",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral Aquatic",
  season        : "Summer",
  notes: {
    top:   ["Sicilian Lemon", "Apple", "Cedar", "Bellflower"],
    heart: ["Bamboo", "Jasmine", "White Rose"],
    base:  ["Cedar", "Musk", "Amber"],
  },
  mood          : "Fresh Citrus Clean",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Fresh",
    "Clean",
    "Bright",
    "Luminous",
    "Youthful",
    "Modern",
  ],
  occasions     : ["Daily Wear", "Vacation", "Weekend", "Casual"],
  seasons       : ["Spring", "Summer"],
  signatureStyle: ["Fresh Floral Aquatic", "Sunlit Everyday", "Clean Citrus Elegance"],
  recommendedFor: [
    "Women seeking a fresh, uncomplicated fragrance for everyday wear and warm-weather adventures",
    "Anyone who loves citrus florals and wants something luminous without heaviness",
    "Those building a summer capsule who need a clean, versatile signature",
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
  subtitle      : "Sunlit Clarity",
  description   : "Sicilian lemon and apple open into a luminous floral heart of jasmine and white rose, grounded by cedar and musk. Clean, immediate, unfussy—a fragrance that tastes like sunlight on skin.",
  academyArticleIds: ["guide-to-fragrance-families", "choosing-your-season-scent", "the-note-pyramid-explained", "how-to-wear-fragrance"],
  academyCategories: ["fragrance-families", "occasions-and-style", "the-note-pyramid"],
  educationTags : [
    "aquatic",
    "floral",
    "jasmine",
    "white-rose",
    "fresh",
    "light",
    "citrus",
    "summer",
    "clean",
    "daily-wear",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-wear-fragrance"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 1,
  freshness     : 5,
  warmth        : 1,
  intensity     : 2,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["coco-mademoiselle-inspired", "chance-eau-fraiche-inspired", "yellow-diamond-inspired", "fig-lotus-flower-inspired", "omnia-crystalline-inspired", "ck-one-inspired", "dylan-blue-pour-femme-inspired"],
    wardrobePartners: ["alien-inspired", "flowerbomb-inspired", "dkny-be-delicious-green-inspired"],
  },
};
