// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — eden-sparkling-lychee-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-19T18:37:37.022Z
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

export const edenSparklingLycheeInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "eden-sparkling-lychee-inspired",
  slug          : "eden-sparkling-lychee-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Eden Sparkling Lychee Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Floral", "Fruity"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral Fruity",
  season        : "Summer",
  notes: {
    top:   ["Litchi", "Black Currant", "Red Apple", "Italian Lemon"],
    heart: ["Violet", "Rose", "Jasmine Sambac"],
    base:  [
      "Sugar",
      "Vanilla Absolute",
      "Musk",
      "Amber",
      "Sandalwood",
      "Cedar",
    ],
  },
  notesEvidenceLocked: true,
  mood          : "Playful Fruity Sweet",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Playful",
    "Bright",
    "Fresh",
    "Delicate",
    "Youthful",
    "Romantic",
  ],
  occasions     : ["Daily Wear", "Vacation", "Weekend", "Casual"],
  seasons       : ["Summer"],
  signatureStyle: ["Playful Floral Fruity", "Summer Radiance", "Balanced Sweet Florals"],
  recommendedFor: [
    "Women seeking a radiant summer fragrance that balances playful fruit with sophisticated floral elegance",
    "Those who love lychee and berry fruits but want them softened by rose and violet rather than amplified",
    "Anyone looking for a balanced, approachable signature that works equally well for vacation, daily wear, and warm-weather social moments",
    "Fragrance lovers who appreciate delicate florals enhanced by sparkling fruit and subtle sweetness without heaviness",
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
  subtitle      : "Radiant Sweetness",
  description   : "Lychee and black currant burst open with Italian lemon's bright snap, then settle into a heart of violet and rose that feels both delicate and alive. Sugar and vanilla absolute warm the base, while musk and sandalwood create a skin-close finish that's sweetly sensual without heaviness.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "floral-fruity",
    "lychee",
    "rose",
    "jasmine",
    "violet",
    "fruity",
    "summer",
    "playful",
    "daily-wear",
    "signature-scent",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 3,
  warmth        : 2,
  intensity     : 2,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["delina-inspired", "very-good-girl-inspired", "chance-eau-tendre-inspired"],
    wardrobePartners: ["alien-inspired", "hypnotic-poison-inspired"],
  },
};
