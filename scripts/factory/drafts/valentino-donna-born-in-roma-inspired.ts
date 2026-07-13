// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — valentino-donna-born-in-roma-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-07-13T18:30:12.523Z
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

export const valentinoDonnaBornInRomaInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "valentino-donna-born-in-roma-inspired",
  slug          : "valentino-donna-born-in-roma-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Valentino Donna Born In Roma Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Floral", "Amber"],
  scentCharacter: "Rich & Long Wearing",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Amber Floral",
  season        : "All Season",
  notes: {
    top:   ["Blackcurrant", "Bergamot", "Pink Pepper"],
    heart: ["Jasmine Absolute", "Tuberose", "Amber Accord"],
    base:  ["Vanilla Bourbon", "Sandalwood", "Musk"],
  },
  mood          : "Elegant and bold.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Elegant",
    "Bold",
    "Sophisticated",
    "Sensual",
    "Magnetic",
    "Confident",
  ],
  occasions     : ["Daily Wear", "Office", "Evening", "Date Night"],
  seasons       : ["Spring", "Summer", "Autumn", "Winter"],
  signatureStyle: ["Modern Couture", "Velvet Intensity", "Sophisticated Power"],
  recommendedFor: [
    "Women seeking a signature fragrance that commands attention in the office and beyond with effortless sophistication.",
    "Those who want creamy floral depth with amber warmth — not airy or delicate, but rich and unapologetically present.",
    "Anyone building a refined collection who values long-wearing elegance that evolves beautifully from morning to evening.",
    "Women drawn to the sensual comfort of vanilla and sandalwood wrapped in jasmine and tuberose intensity.",
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
  subtitle      : "Velvet Intensity",
  description   : "Blackcurrant and pink pepper ignite with a flash of bergamot, then yield to a creamy heart of jasmine and tuberose that blooms against warm amber. Vanilla bourbon and sandalwood settle into a sensual, powdered base—elegant and deliberately bold.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "how-to-wear-fragrance"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "amber-floral",
    "jasmine",
    "tuberose",
    "vanilla",
    "sandalwood",
    "bold",
    "long-wearing",
    "office-wear",
    "elegant",
    "layering",
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
    alternatives:     ["baccarat-rouge-540-inspired"],
    wardrobePartners: ["valentino-uomo-born-in-roma-inspired"],
  },
};
