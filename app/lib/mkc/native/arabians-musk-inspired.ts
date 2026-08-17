// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — arabians-musk-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-16T18:48:20.685Z
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

export const arabiansMuskInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "arabians-musk-inspired",
  slug          : "arabians-musk-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Arabians Musk Inspired",
  collection    : "Elite",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "unisex",
  family        : ["Gourmand", "Floral"],
  scentCharacter: "Rich & Full-Bodied",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Oriental Floral Gourmand",
  season        : "Winter",
  notes: {
    top:   ["Honey", "Bergamot"],
    heart: ["Dates", "Orange Blossom"],
    base:  ["Musk", "Vanilla", "Tonka Bean", "Sugar"],
  },
  mood          : "Sweet Oriental Musky",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Warm",
    "Sensual",
    "Luxury",
    "Sophisticated",
    "Romantic",
    "Magnetic",
  ],
  occasions     : ["Date Night", "Evening", "Weekend"],
  seasons       : ["Winter"],
  signatureStyle: ["Creamy Oriental Warmth", "Gourmand Floral Luxury", "Intimate Winter Signature"],
  recommendedFor: [
    "Anyone seeking a creamy, gourmand oriental that bridges sweetness and sophistication for intimate winter evenings",
    "Those who love warm vanilla and tonka comfort layered with exotic florals like orange blossom and dates",
    "Fragrance collectors drawn to unisex orientals that feel luxurious and intimate rather than assertive",
    "Men and women wanting a signature winter fragrance that evokes Arabian luxury and sensual warmth",
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
  subtitle      : "Honeyed Musk",
  description   : "Honey and bergamot open onto a warm embrace of dates and orange blossom, grounding into a creamy base of musk, vanilla, and tonka bean. Sweet without cloying, this is oriental perfumery rendered in soft focus—sensual, intimate, deeply comforting.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "gourmand",
    "oriental-floral",
    "musk",
    "vanilla",
    "tonka-bean",
    "honey",
    "dates",
    "winter",
    "date-night",
    "layering",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 4,
  freshness     : 3,
  warmth        : 2,
  intensity     : 4,
  versatility   : 2,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["baccarat-rouge-540-inspired", "love-don't-be-shy-inspired"],
    wardrobePartners: ["oud-mood-inspired", "baccarat-rouge-540-extrait-inspired"],
  },
};
