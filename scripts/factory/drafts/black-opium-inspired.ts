// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — black-opium-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-07-13T18:28:52.705Z
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

export const blackOpiumInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "black-opium-inspired",
  slug          : "black-opium-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Black Opium Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Gourmand", "Vanilla"],
  scentCharacter: "Rich & Long Wearing",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Vanilla Coffee",
  season        : "Winter",
  notes: {
    top:   ["Espresso", "Pink Pepper", "Bergamot"],
    heart: ["Madagascar Vanilla", "Red Rose Absolute", "Tonka Bean"],
    base:  ["Sandalwood", "Amber Gris", "Musk"],
  },
  mood          : "Warm and addictive.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Sensual",
    "Warm",
    "Addictive",
    "Sophisticated",
    "Mysterious",
    "Luxe",
  ],
  occasions     : ["Date Night", "Evening", "Weekend"],
  seasons       : ["Winter", "Autumn"],
  signatureStyle: ["Dark Seduction", "Gourmand Elegance", "Velvet Noir"],
  recommendedFor: [
    "Women seeking a sensual evening signature that balances gourmand warmth with sophisticated florals.",
    "Those drawn to coffee and vanilla who want depth, longevity, and a whisper of danger.",
    "Anyone building a winter collection who craves rich, addictive scents for intimate occasions.",
    "Women who pair fragrance with velvet, leather, and late-night moments.",
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
  subtitle      : "Velvet Night",
  description   : "Espresso and pink pepper ignite on skin, yielding to a heart of red rose and Madagascar vanilla that lingers with the warmth of tonka and sandalwood. Sensual without surrender, addictive without apology—a fragrance that wraps around you like velvet in darkness.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "choosing-your-season-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "gourmand",
    "vanilla",
    "coffee",
    "rose",
    "tonka",
    "amber",
    "winter",
    "date-night",
    "rich",
    "long-wearing",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 4,
  freshness     : 1,
  warmth        : 4,
  intensity     : 4,
  versatility   : 2,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["ultra-male-inspired", "layton-inspired"],
    wardrobePartners: ["delina-inspired"],
  },
};
