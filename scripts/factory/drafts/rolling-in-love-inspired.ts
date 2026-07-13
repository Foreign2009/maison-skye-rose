// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — rolling-in-love-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-07-13T18:30:43.336Z
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

export const rollingInLoveInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "rolling-in-love-inspired",
  slug          : "rolling-in-love-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Rolling In Love Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Gourmand", "Floral"],
  scentCharacter: "Rich & Long Wearing",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Almond Floral",
  season        : "All Season",
  notes: {
    top:   ["Almond", "Bergamot", "Pink Pepper"],
    heart: ["Iris Absolute", "Rose Absolute", "Heliotrope"],
    base:  ["Vanilla", "Sandalwood", "Amber"],
  },
  mood          : "Soft and luxurious.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Soft",
    "Luxurious",
    "Romantic",
    "Warm",
    "Elegant",
    "Feminine",
  ],
  occasions     : [
    "Daily Wear",
    "Office",
    "Date Night",
    "Weekend",
    "Evening",
  ],
  seasons       : ["Spring", "Summer", "Autumn", "Winter"],
  signatureStyle: ["Modern Romance", "Soft Luxury", "Almond Floral Gourmand"],
  recommendedFor: [
    "Women seeking a signature fragrance that layers soft femininity with gourmand comfort for everyday wear.",
    "Those who love rose and almond together and want a long-wearing fragrance that feels both luxurious and approachable.",
    "Anyone looking for a modern romantic choice that works equally well in the office, on a date, or at weekend leisure.",
    "Fragrance collectors building a layering wardrobe who value iris and vanilla depth over linear simplicity.",
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
  subtitle      : "Soft Luminescence",
  description   : "Almond and bergamot open into a luminous heart of rose and iris, where heliotrope adds a whisper of powder and warmth. Vanilla and sandalwood settle into amber, creating a fragrance that feels both intimate and radiant—soft enough for skin, complex enough for memory.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "how-to-wear-fragrance"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "almond",
    "rose",
    "floral",
    "gourmand",
    "iris",
    "vanilla",
    "amber",
    "layering",
    "office-wear",
    "everyday",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "how-to-wear-fragrance"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 4,
  freshness     : 3,
  warmth        : 2,
  intensity     : 3,
  versatility   : 5,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["delina-inspired"],
    wardrobePartners: ["layton-inspired"],
  },
};
