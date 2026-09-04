// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — bianco-latte-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-07-13T18:31:01.084Z
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

export const biancoLatteInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "bianco-latte-inspired",
  slug          : "bianco-latte-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Bianco Latte Inspired",
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
    top:   ["Bergamot", "Cardamom", "Milk Accord"],
    heart: ["Vanilla Absolute", "Tonka Bean", "Heliotrope"],
    base:  ["Caramel Absolute", "Sandalwood", "Musk Ambrettolide"],
  },
  mood          : "Sweet and addictive.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Warm",
    "Sensual",
    "Elegant",
    "Cozy",
    "Addictive",
    "Luxurious",
  ],
  occasions     : ["Date Night", "Evening", "Winter Evenings", "Casual"],
  seasons       : ["Winter", "Autumn"],
  signatureStyle: ["Creamy Gourmand", "Warm Sophistication", "Sensual Comfort"],
  recommendedFor: [
    "Women seeking a sensual, creamy signature for intimate evenings and cooler months.",
    "Those who love gourmand fragrances but want sophistication over pure sweetness.",
    "Anyone looking for a cozy, long-wearing fragrance that feels like a warm embrace.",
    "Women who appreciate vanilla and caramel as a luxurious foundation for their scent wardrobe.",
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
  subtitle      : "Warm Comfort",
  description   : "Bergamot and cardamom open onto a creamy envelope of vanilla absolute and tonka, softened by heliotrope's powdery warmth. Caramel and sandalwood settle into skin like the closing notes of something deeply indulgent—comforting without surrender.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-wear-fragrance"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "gourmand",
    "vanilla",
    "tonka-bean",
    "caramel",
    "warm",
    "creamy",
    "winter",
    "date-night",
    "long-wearing",
    "sensual",
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
    alternatives:     ["love-don't-be-shy-inspired", "la-vie-est-belle-inspired", "devotion-inspired", "attrape-reves-inspired"],
    wardrobePartners: ["delina-inspired"],
  },
};
