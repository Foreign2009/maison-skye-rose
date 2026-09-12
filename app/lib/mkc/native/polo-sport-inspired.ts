// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — polo-sport-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-09-11T18:51:51.187Z
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

export const poloSportInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "polo-sport-inspired",
  slug          : "polo-sport-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Polo Sport Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Aromatic", "Aquatic"],
  scentCharacter: "Fresh & Light",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Aromatic Aquatic",
  season        : "Summer",
  notes: {
    top:   [
      "Mint",
      "Lavender",
      "Bergamot",
      "Lemon",
      "Mandarin Orange",
      "Aldehydes",
      "Artemisia",
      "Neroli",
      "Pineapple",
    ],
    heart: [
      "Seagrass",
      "Ginger",
      "Jasmine",
      "Geranium",
      "Cyclamen",
      "Rose",
      "Brazilian Rosewood",
    ],
    base:  [
      "Musk",
      "Sandalwood",
      "Cedar",
      "Guaiac Wood",
      "Amber",
    ],
  },
  notesEvidenceLocked: true,
  mood          : "Fresh Energetic",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Energetic",
    "Fresh",
    "Bright",
    "Confident",
    "Playful",
  ],
  occasions     : [
    "Daily Wear",
    "Casual",
    "Weekend",
    "Vacation",
    "Travel",
  ],
  seasons       : ["Summer", "Spring"],
  signatureStyle: ["Fresh Aquatic Sport", "Aquatic Velocity", "Summer Energy"],
  recommendedFor: [
    "Men seeking a vibrant summer signature that energizes without overwhelming—perfect for beach days, casual outings, and warm-weather adventures.",
    "Those who love fresh aquatics with a sporty edge and want a fragrance that feels as alive as the season itself.",
    "Active men who want a fresh aquatic signature that carries through beach days, casual outings, and warm-weather adventures.",
    "Fragrance explorers drawn to aromatic brightness and the clean energy of mint and seagrass over traditional sweetness.",
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
  subtitle      : "Fresh Velocity",
  description   : "Mint and lavender open with crystalline brightness, then shift into a lush heart of seagrass and ginger that feels both aquatic and alive. Sandalwood and musk ground the composition with quiet warmth, creating a fragrance that moves from invigorating to intimate.",
  academyArticleIds: ["guide-to-fragrance-families", "choosing-your-season-scent", "how-to-wear-fragrance"],
  academyCategories: ["fragrance-families", "occasions-and-style"],
  educationTags : [
    "aromatic",
    "aquatic",
    "fresh",
    "mint",
    "citrus",
    "summer",
    "energetic",
    "seagrass",
    "musk",
    "daily-wear",
  ],
  learningPath  : ["guide-to-fragrance-families", "choosing-your-season-scent", "how-to-wear-fragrance"],

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
    alternatives:     ["aqua-di-gio-inspired", "invictus-inspired", "bvlgari-aqua-inspired"],
    wardrobePartners: ["sauvage-inspired", "eros-inspired", "polo-black-inspired"],
  },
};
