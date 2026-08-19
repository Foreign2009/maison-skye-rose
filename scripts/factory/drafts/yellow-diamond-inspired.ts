// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — yellow-diamond-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-19T18:37:11.745Z
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

export const yellowDiamondInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "yellow-diamond-inspired",
  slug          : "yellow-diamond-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Yellow Diamond Inspired",
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
  season        : "Spring",
  notes: {
    top:   ["Amalfi Lemon", "Pear", "Bergamot", "Neroli"],
    heart: ["Mimosa", "Freesia", "Water Lily", "African Orange Flower"],
    base:  ["Musk", "Guaiac Wood", "Amber"],
  },
  notesEvidenceLocked: true,
  mood          : "Fresh Citrus Floral",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Fresh",
    "Bright",
    "Elegant",
    "Clean",
    "Sophisticated",
    "Feminine",
  ],
  occasions     : [
    "Daily Wear",
    "Office",
    "Weekend",
    "Wedding",
    "Casual",
  ],
  seasons       : ["Spring", "Summer"],
  signatureStyle: ["Luminous Floral Aquatic", "Fresh Citrus Elegance", "Radiant Spring Signature"],
  recommendedFor: [
    "Women seeking a luminous, wearable signature that bridges professional and social occasions with effortless radiance",
    "Those who love fresh citrus and delicate florals without sweetness, preferring aquatic clarity and restraint",
    "Anyone looking for a spring essential that feels both uplifting and sophisticated, suitable for daily wear through evening",
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
  subtitle      : "Radiant Spring Light",
  description   : "Amalfi lemon and neroli open into a sunlit heart of mimosa and freesia, where water lily adds a cool, aquatic whisper. Guaiac wood and amber anchor the composition with subtle warmth, creating a fragrance that feels both effervescent and grounded.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "choosing-your-season-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "aquatic",
    "floral",
    "freesia",
    "water-lily",
    "citrus",
    "fresh",
    "light",
    "spring",
    "daily-wear",
    "wedding",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-layer-fragrances"],

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
    alternatives:     ["light-blue-inspired", "omnia-green-jade-inspired"],
    wardrobePartners: ["creed-green-irish-tweed-inspired"],
  },
};
