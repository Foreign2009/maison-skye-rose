// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — hypnotic-poison-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-07-13T18:30:32.214Z
// Factory version:   0.5.0
// Prompt versions:   CompositionProducer@1.0.0  EditorialProducer@1.0.0  RelationshipProducer@1.0.0  EducationProducer@1.0.0  DiscoveryProducer@1.0.0
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

import type { FragranceKnowledge } from "../../../app/lib/mkc/types";

export const hypnoticPoisonInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "hypnotic-poison-inspired",
  slug          : "hypnotic-poison-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Hypnotic Poison Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Gourmand"],
  scentCharacter: "Rich & Long Wearing",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Gourmand",
  season        : "Winter",
  notes: {
    top:   ["Vanilla", "Bergamot", "Pink Pepper"],
    heart: ["Almond", "Tonka Bean", "Rose Absolute"],
    base:  ["Jasmine", "Sandalwood", "Amber"],
  },
  mood          : "Deep and addictive.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Sensual",
    "Mysterious",
    "Warm",
    "Magnetic",
    "Elegant",
    "Addictive",
  ],
  occasions     : ["Date Night", "Evening", "Weekend"],
  seasons       : ["Winter", "Autumn"],
  signatureStyle: ["Dark Vanilla", "Creamy Seduction", "Sophisticated Gourmand"],
  recommendedFor: [
    "Women seeking a sensual signature fragrance that balances creamy gourmand warmth with sophisticated florals for intimate evenings",
    "Those who love vanilla and almond but want depth, elegance, and staying power rather than pure sweetness",
    "Anyone drawn to rich, addictive fragrances that create a memorable presence without being overpowering",
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
  bestSeller    : true,
  newArrival    : false,

  // ── Education ───────────────────────────────────────────────────────────────
  subtitle      : "Creamy Seduction",
  description   : "Vanilla opens warm and slightly spiced, giving way to a creamy almond heart wrapped in rose absolute—sensual without sweetness. Sandalwood and amber anchor the composition, creating a fragrance that feels both intimate and enveloping, the kind you return to again and again.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-wear-fragrance"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "gourmand",
    "vanilla",
    "almond",
    "tonka-bean",
    "rose",
    "amber",
    "winter",
    "date-night",
    "sensual",
    "sweet",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 4,
  freshness     : 2,
  warmth        : 2,
  intensity     : 4,
  versatility   : 2,
  popularity    : 10,

  // ── Relationships ───────────────────────────────────────────────────────────
  relationships: {
    alternatives:     ["black-opium-inspired", "delina-exclusif-inspired", "la-vie-est-belle-inspired", "love-don't-be-shy-inspired", "poison-girl-inspired", "black-opium-over-red-inspired", "khamrah-inspired", "very-good-girl-elixir-inspired", "dark-vanilla-inspired", "changing-constance-inspired", "angel-inspired"],
    wardrobePartners: ["delina-inspired", "baccarat-rouge-540-inspired", "gucci-bamboo-inspired", "eden-sparkling-lychee-inspired", "chanel-no-5-inspired", "creed-delphinus-inspired", "ange-ou-demon-inspired"],
  },
};
