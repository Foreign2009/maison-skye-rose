// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — vanilla-28-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-07-13T18:31:08.102Z
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

export const vanilla28Inspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "vanilla-28-inspired",
  slug          : "vanilla-28-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Vanilla 28 Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Vanilla", "Amber"],
  scentCharacter: "Rich & Long Wearing",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Vanilla Amber",
  season        : "Winter",
  notes: {
    top:   ["Vanilla Extract", "Pink Pepper"],
    heart: ["Brown Sugar", "Tonka Bean"],
    base:  ["Amber", "Sandalwood"],
  },
  mood          : "Comforting and luxurious.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Warm",
    "Luxurious",
    "Sensual",
    "Comforting",
    "Elegant",
    "Magnetic",
  ],
  occasions     : ["Date Night", "Evening", "Weekend", "Casual"],
  seasons       : ["Winter", "Autumn"],
  signatureStyle: ["Creamy Warmth", "Modern Comfort Luxury", "Sophisticated Vanilla"],
  recommendedFor: [
    "Women seeking a creamy, comforting signature for intimate evenings and cooler months.",
    "Anyone who loves vanilla and amber but wants depth, spice, and sophistication over simple sweetness.",
    "Those drawn to luxurious, skin-scent fragrances that feel like cashmere against the body.",
    "Women building a winter collection who want one fragrance that bridges everyday comfort and special occasion allure.",
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
  subtitle      : "Creamy Warmth",
  description   : "Opens with vanilla extract and pink pepper—warm spice meeting creamy sweetness. Brown sugar and tonka bean deepen into a honeyed heart, while amber and sandalwood settle into skin like cashmere against bare warmth. A fragrance that feels like indulgence without excess.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "vanilla",
    "amber",
    "tonka-bean",
    "warm",
    "rich",
    "long-wearing",
    "winter",
    "date-night",
    "gourmand",
    "sandalwood",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 4,
  freshness     : 1,
  warmth        : 4,
  intensity     : 4,
  versatility   : 2,
  popularity    : 10,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["9pm-inspired", "le-male-elixir-inspired"],
    wardrobePartners: ["baccarat-rouge-540-inspired"],
  },
};
