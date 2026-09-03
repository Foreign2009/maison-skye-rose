// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — the-one-pour-femme-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-09-02T17:27:21.357Z
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

export const theOnePourFemmeInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "the-one-pour-femme-inspired",
  slug          : "the-one-pour-femme-inspired",
  brand         : "Maison Skye & Rose",
  name          : "The One Pour Femme Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Floral"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Oriental Floral",
  season        : "Autumn",
  notes: {
    top:   ["Litchi", "Mandarin Orange", "Bergamot", "Peach"],
    heart: ["Lily", "Jasmine", "Lily of the Valley"],
    base:  ["Musk", "Vetiver", "Amber"],
  },
  notesEvidenceLocked: true,
  mood          : "Soft Floral Oriental",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Soft",
    "Luminous",
    "Sophisticated",
    "Warm",
    "Delicate",
    "Elegant",
  ],
  occasions     : ["Daily Wear", "Office", "Date Night", "Weekend"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Soft Floral Oriental", "Luminous Signature", "Creamy Elegance"],
  recommendedFor: [
    "Women seeking a soft, luminous signature fragrance that bridges professional elegance and romantic occasions",
    "Those who love creamy floral orientals with enough restraint to wear daily without overwhelming a room",
    "Anyone drawn to mandarin and jasmine combinations who wants sophisticated warmth rather than heavy sweetness",
    "Women building a layering wardrobe who want a foundational soft floral to pair with bolder statement scents",
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
  subtitle      : "Creamy Floral Oriental",
  description   : "Mandarin and litchi open with luminous warmth, giving way to a heart of jasmine and lily that feels both creamy and translucent. Amber and musk create a soft, skin-close base that settles into something intimate and unhurried.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "what-makes-a-signature-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "oriental-floral",
    "lily",
    "jasmine",
    "musk",
    "amber",
    "signature-scent",
    "layering",
    "date-night",
    "office",
    "autumn",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

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
    alternatives:     ["delina-inspired", "mon-paris-inspired", "very-good-girl-inspired"],
    wardrobePartners: ["baccarat-rouge-540-inspired"],
  },
};
