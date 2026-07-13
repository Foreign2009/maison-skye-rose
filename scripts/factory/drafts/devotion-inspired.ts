// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — devotion-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-07-13T18:31:04.689Z
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

export const devotionInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "devotion-inspired",
  slug          : "devotion-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Devotion Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Vanilla", "Citrus"],
  scentCharacter: "Fresh & Light",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Vanilla Citrus",
  season        : "Winter",
  notes: {
    top:   ["Lemon", "Pink Pepper", "Galbanum"],
    heart: ["Vanilla Absolute", "Turkish Rose Absolute", "Tonka Bean"],
    base:  ["Rum Extract", "Sandalwood", "Amber Resin"],
  },
  mood          : "Warm and joyful.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Warm",
    "Joyful",
    "Elegant",
    "Soft",
    "Romantic",
    "Sophisticated",
  ],
  occasions     : ["Date Night", "Evening", "Weekend"],
  seasons       : ["Winter", "Autumn"],
  signatureStyle: ["Warm Vanilla Rose", "Creamy Citrus", "Intimate Dessert"],
  recommendedFor: [
    "Women seeking a warm vanilla fragrance that feels both fresh and indulgent for intimate winter evenings",
    "Those who love rose and citrus together and want a signature that bridges bright and creamy comfort",
    "Anyone drawn to fragrances with gourmand warmth but prefer a light, moderate sillage over heavy sweetness",
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
  subtitle      : "Warmth and Rose",
  description   : "A radiant warmth opens with bright lemon and pink pepper, immediately softened by creamy vanilla absolute and Turkish rose. The base settles into amber and sandalwood, touched with rum's honeyed richness—a fragrance that feels like joy held close to skin.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-wear-fragrance"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "vanilla",
    "citrus",
    "lemon",
    "rose",
    "tonka-bean",
    "warm",
    "winter",
    "date-night",
    "fresh-and-light",
    "amber",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 4,
  freshness     : 5,
  warmth        : 4,
  intensity     : 4,
  versatility   : 2,
  popularity    : 5,

  // ── Relationships (not populated) ───────────────────────────────────────────
  // Re-run the factory with an ANTHROPIC_API_KEY to generate relationship suggestions.
  //
  // To implement manually, add a relationships block:
  //   relationships: {
  //     alternatives:     [],  // slugs of comparable alternatives — must be symmetric
  //     wardrobePartners: [],  // slugs to own alongside this — must be symmetric
  //   },
  //
  // IMPORTANT: All relationship fields require reciprocal entries in referenced records.
};
