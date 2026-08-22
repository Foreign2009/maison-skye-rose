// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — fig-lotus-flower-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-22T18:53:44.858Z
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

import type { FragranceKnowledge } from "../../../app/lib/mkc/types";

export const figLotusFlowerInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "fig-lotus-flower-inspired",
  slug          : "fig-lotus-flower-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Fig Lotus Flower Inspired",
  collection    : "Elite",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "unisex",
  family        : ["Floral"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral",
  season        : "Summer",
  notes: {
    top:   [],
    heart: ["Fig Leaf", "Lotus Flower", "Vetiver"],
    base:  [],
  },
  notesEvidenceLocked: true,
  mood          : "Fresh Green Aquatic",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Fresh",
    "Luminous",
    "Balanced",
    "Sophisticated",
    "Serene",
    "Clean",
  ],
  occasions     : ["Daily Wear", "Vacation", "Weekend", "Casual"],
  seasons       : ["Summer"],
  signatureStyle: ["Green Aquatic Floral", "Luminous Minimalism", "Summer Elegance"],
  recommendedFor: [
    "Anyone seeking a fresh green fragrance that feels like a cool escape on warm days without heavy florals or sweetness",
    "Women and men who appreciate luminous aquatic florals that complement rather than dominate their presence",
    "Those drawn to sophisticated simplicity — a single-note luxury that works from morning through evening travel",
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
  subtitle      : "Green Water Luxury",
  description   : "Green fig leaf meets luminous lotus in a composition of quiet clarity and botanical depth. Vetiver grounds this brightness with quiet earthiness, creating something that feels both aquatic and botanical—fresh without artifice, contemplative without heaviness.",
  academyArticleIds: ["guide-to-fragrance-families", "choosing-your-season-scent", "what-makes-a-signature-scent"],
  academyCategories: ["fragrance-families", "occasions-and-style"],
  educationTags : [
    "floral",
    "fig-leaf",
    "lotus",
    "vetiver",
    "unisex",
    "summer",
    "balanced",
    "fresh",
    "daily-wear",
    "signature",
  ],
  learningPath  : ["guide-to-fragrance-families", "choosing-your-season-scent", "what-makes-a-signature-scent"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 3,
  warmth        : 2,
  intensity     : 2,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["chance-eau-fraiche-inspired", "light-blue-inspired"],
    wardrobePartners: ["oud-mood-inspired"],
  },
};
