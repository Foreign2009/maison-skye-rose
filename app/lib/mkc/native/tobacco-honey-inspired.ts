// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — tobacco-honey-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-09-07T18:25:43.259Z
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

export const tobaccoHoneyInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "tobacco-honey-inspired",
  slug          : "tobacco-honey-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Tobacco Honey Inspired",
  collection    : "Elite",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "unisex",
  family        : ["Spicy"],
  scentCharacter: "Rich & Full-Bodied",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Oriental Spicy",
  season        : "Autumn",
  notes: {
    top:   ["Honey", "Cloves", "Anise"],
    heart: ["Tobacco", "Vanilla", "Tonka Bean", "Sesame"],
    base:  ["Agarwood", "Sandalwood"],
  },
  notesEvidenceLocked: true,
  mood          : "Smoky Honey Tobacco",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Warm",
    "Sophisticated",
    "Sensual",
    "Mysterious",
    "Mature",
    "Luxurious",
  ],
  occasions     : ["Date Night", "Evening", "Weekend", "Formal"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Smoky Amber Warmth", "Oriental Spice", "Honeyed Tobacco"],
  recommendedFor: [
    "Anyone seeking a warm, full-bodied fragrance that bridges sweetness and smokiness for evening occasions and intimate settings.",
    "Those who love tobacco and amber fragrances but want honey's softening warmth rather than leather's edge.",
    "Fragrance collectors building an autumn and winter wardrobe who appreciate oriental spice with restraint and sophistication.",
    "Men and women drawn to honeyed vanilla bases who want depth, character, and a touch of smoky intrigue.",
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
  subtitle      : "Smoky Amber Warmth",
  description   : "Honey and cloves open with a whisper of anise, then give way to tobacco leaf warmed by vanilla and tonka bean. Agarwood and sandalwood anchor the composition in smoke and soft spice, creating a fragrance that feels both intimate and deliberate.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "choosing-your-season-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "oriental-spicy",
    "tobacco",
    "honey",
    "vanilla",
    "tonka",
    "agarwood",
    "sandalwood",
    "warm",
    "autumn",
    "office",
    "date-night",
    "unisex",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 2,
  warmth        : 4,
  intensity     : 3,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["spicebomb-extreme-inspired", "tobacco-vanille-inspired", "naxos-inspired"],
    wardrobePartners: ["oud-mood-inspired", "baccarat-rouge-540-inspired"],
  },
};
