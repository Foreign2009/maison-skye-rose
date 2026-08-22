// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — chanel-no-5-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-22T18:49:27.414Z
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

export const chanelNo5Inspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "chanel-no-5-inspired",
  slug          : "chanel-no-5-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Chanel No 5 Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Floral"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral Aldehyde",
  season        : "Year-Round",
  notes: {
    top:   [
      "Aldehydes",
      "Ylang-Ylang",
      "Neroli",
      "Bergamot",
      "Peach",
    ],
    heart: ["May Rose", "Jasmine", "Iris", "Lily of the Valley"],
    base:  [
      "Sandalwood",
      "Vetiver",
      "Oakmoss",
      "Patchouli",
      "Vanilla",
    ],
  },
  notesEvidenceLocked: true,
  mood          : "Powdery Floral Classic",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Elegant",
    "Sophisticated",
    "Feminine",
    "Soft",
    "Romantic",
    "Luxury",
  ],
  occasions     : [
    "Daily Wear",
    "Office",
    "Date Night",
    "Evening",
    "Formal",
  ],
  seasons       : ["Spring", "Summer", "Autumn", "Winter"],
  signatureStyle: ["Powdery Floral Elegance", "Classic Signature", "Refined Femininity"],
  recommendedFor: [
    "Women seeking a timeless floral signature that bridges elegance and intimacy across all occasions.",
    "Those drawn to powdery, classic florals with sophistication rather than sweetness or intensity.",
    "Anyone building a fragrance wardrobe who wants one refined rose-jasmine scent that transcends seasons and dress codes.",
    "Women who appreciate balanced, wearable florals that whisper rather than shout.",
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
  subtitle      : "Powdery Floral Elegance",
  description   : "Aldehydes open with a whisper of peach and neroli, their soapy luminescence framing a heart of May rose and jasmine. Iris and lily of the valley soften the floral core into something powdery and intimate, while sandalwood and vetiver ground the composition with quiet warmth.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "fragrance-fundamentals"],
  educationTags : [
    "floral-aldehyde",
    "rose",
    "jasmine",
    "aldehydes",
    "iris",
    "signature-scent",
    "balanced",
    "year-round",
    "elegant",
    "daily-wear",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],

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
    alternatives:     ["j'adore-inspired", "miss-dior-inspired", "coco-mademoiselle-inspired"],
    wardrobePartners: ["black-opium-inspired", "hypnotic-poison-inspired"],
  },
};
