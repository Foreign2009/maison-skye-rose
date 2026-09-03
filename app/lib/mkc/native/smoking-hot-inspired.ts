// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — smoking-hot-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-09-02T17:25:27.053Z
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

export const smokingHotInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "smoking-hot-inspired",
  slug          : "smoking-hot-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Smoking Hot Inspired",
  collection    : "Elite",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "unisex",
  family        : ["Tobacco", "Woody"],
  scentCharacter: "Deep & Intense",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Woody Tobacco",
  season        : "Autumn",
  notes: {
    top:   ["Apple", "Red Apple"],
    heart: ["Tobacco", "Birch"],
    base:  ["Leather", "Vetiver", "Guaiac Wood", "Styrax"],
  },
  notesEvidenceLocked: true,
  mood          : "Smoky Tobacco Apple",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Contemplative",
    "Smoky",
    "Intense",
    "Refined",
    "Mysterious",
    "Warm",
  ],
  occasions     : ["Office", "Date Night", "Evening", "Weekend"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Woody Tobacco Introspection", "Sophisticated Smokiness", "Leather & Leaf"],
  recommendedFor: [
    "Anyone seeking an introspective autumn signature that smells like a thoughtful evening by the fire",
    "Those drawn to tobacco and leather who want depth without sweetness or synthetic smoothness",
    "Men and women building a sophisticated office wardrobe who appreciate a fragrance with intellectual character",
    "Fragrance collectors who recognize Smoking Hot as a modern classic and want its contemplative soul",
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
  subtitle      : "Autumn Introspection",
  description   : "A contemplative composition that opens with crisp red apple before yielding to the warm, slightly bitter character of tobacco leaf and birch. Leather and vetiver anchor the base, creating a woody, smoke-tinged finish that feels more introspective than indulgent.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "choosing-your-season-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "tobacco",
    "woody",
    "leather",
    "vetiver",
    "autumn",
    "unisex",
    "office",
    "deep",
    "intense",
    "guaiac-wood",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 1,
  warmth        : 4,
  intensity     : 3,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["spicebomb-extreme-inspired", "tobacco-vanille-inspired"],
    wardrobePartners: ["bleu-de-chanel-l'exclusif-inspired"],
  },
};
