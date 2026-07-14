// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — libre-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-07-13T18:28:44.827Z
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

import type { FragranceKnowledge } from "../types";

export const libreInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "libre-inspired",
  slug          : "libre-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Libre Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Floral", "Amber"],
  scentCharacter: "Rich & Long Wearing",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral Amber",
  season        : "All Season",
  notes: {
    top:   ["Lavender", "Bergamot", "Pink Pepper"],
    heart: ["Orange Blossom", "Rose Absolute", "Jasmine Sambac"],
    base:  ["Vanilla", "Amber", "Musk"],
  },
  mood          : "Bold and sophisticated.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Sophisticated",
    "Bold",
    "Confident",
    "Magnetic",
    "Warm",
    "Elegant",
  ],
  occasions     : ["Daily Wear", "Office", "Evening", "Date Night"],
  seasons       : ["Spring", "Summer", "Autumn", "Winter"],
  signatureStyle: ["Confident Luxury", "Modern Floral Amber", "Radiant Audacity"],
  recommendedFor: [
    "Women who want a signature fragrance that commands attention without apology, balancing floral beauty with amber warmth.",
    "Those seeking an all-season fragrance that works equally well in the office and at evening events, projecting quiet confidence.",
    "Anyone looking for a rich, long-wearing floral that evolves throughout the day without fading into the background.",
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
  subtitle      : "Radiant Audacity",
  description   : "Lavender and pink pepper ignite with brightness, then settle into a lush heart of rose absolute and orange blossom that blooms with quiet intensity. Vanilla and amber anchor the composition, creating a warm, skin-close base that feels both sensual and restrained.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "what-makes-a-signature-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "floral-amber",
    "rose",
    "orange-blossom",
    "jasmine",
    "vanilla",
    "amber",
    "musk",
    "sophisticated",
    "bold",
    "long-wearing",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 3,
  freshness     : 3,
  warmth        : 4,
  intensity     : 3,
  versatility   : 5,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["delina-inspired"],
    wardrobePartners: ["baccarat-rouge-540-inspired"],
  },
};
