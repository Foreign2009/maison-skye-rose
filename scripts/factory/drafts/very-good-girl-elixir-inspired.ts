// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — very-good-girl-elixir-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-19T18:37:59.714Z
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

export const veryGoodGirlElixirInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "very-good-girl-elixir-inspired",
  slug          : "very-good-girl-elixir-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Very Good Girl Elixir Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Floral"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral Oriental",
  season        : "Autumn",
  notes: {
    top:   ["Black Cherry", "Bitter Almond"],
    heart: ["Rose", "Tuberose"],
    base:  ["Vanilla", "Cocoa"],
  },
  notesEvidenceLocked: true,
  mood          : "Dark Sweet Floral",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Sophisticated",
    "Sensual",
    "Warm",
    "Elegant",
    "Mysterious",
    "Confident",
  ],
  occasions     : ["Office", "Date Night", "Evening", "Daily Wear"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Dark Floral Elegance", "Sensual Signature", "Balanced Gourmand Floral"],
  recommendedFor: [
    "Women seeking a signature floral that balances elegance with sensuality for professional and evening wear.",
    "Those who love dark, gourmand florals and want something more sophisticated than purely sweet fragrances.",
    "Anyone looking for a fragrance that transitions seamlessly from office to date night.",
    "Women building a collection who want a rose-based scent with unexpected depth and edible warmth.",
  ],

  // ── Merchandising ───────────────────────────────────────────────────────────
  prices: {
    "5ml":  60,
    "10ml": 100,
    "30ml": 250,
  },
  images: {
    "5ml":  "",  // FACTORY_ERROR: IMAGE_MISSING — image path for 5ml is required
    "10ml": "",  // FACTORY_ERROR: IMAGE_MISSING — image path for 10ml is required
    "30ml": "",  // FACTORY_ERROR: IMAGE_MISSING — image path for 30ml is required
  },
  bestSeller    : false,
  newArrival    : false,

  // ── Education ───────────────────────────────────────────────────────────────
  subtitle      : "Dark Floral Sweetness",
  description   : "Black cherry and bitter almond open into a darkened floral heart of rose and tuberose, where sweetness turns sultry. Vanilla and cocoa deepen the composition into something almost edible—a fragrance that tastes like indulgence feels.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "what-makes-a-signature-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "floral-oriental",
    "rose",
    "tuberose",
    "vanilla",
    "cocoa",
    "black-cherry",
    "balanced",
    "signature-scent",
    "layering",
    "autumn",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 3,
  warmth        : 2,
  intensity     : 3,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["good-girl-inspired", "hypnotic-poison-inspired", "delina-inspired"],
    wardrobePartners: ["very-good-girl-inspired", "black-opium-inspired"],
  },
};
