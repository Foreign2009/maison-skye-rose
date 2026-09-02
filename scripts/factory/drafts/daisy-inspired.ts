// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — daisy-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-09-02T17:27:48.626Z
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

export const daisyInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "daisy-inspired",
  slug          : "daisy-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Daisy Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Floral", "Fresh"],
  scentCharacter: "Fresh & Light",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral Fresh",
  season        : "Spring",
  notes: {
    top:   ["Strawberry", "Violet Leaves", "Ruby Red Grapefruit"],
    heart: ["Violet", "Jasmine", "Gardenia"],
    base:  ["Musk", "Vanilla", "Sandalwood", "White Woods"],
  },
  notesEvidenceLocked: true,
  mood          : "Light Fresh Floral",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Fresh",
    "Bright",
    "Youthful",
    "Innocent",
    "Delicate",
    "Confident",
  ],
  occasions     : ["Daily Wear", "Wedding", "Casual", "Date Night"],
  seasons       : ["Spring", "Summer"],
  signatureStyle: ["Fresh Luminous Floral", "Youthful Innocence", "Everyday Elegance"],
  recommendedFor: [
    "Women seeking a luminous everyday floral that feels fresh, youthful, and effortlessly put-together",
    "Those who love violet and gardenia but want brightness and lift rather than depth or mystery",
    "Anyone looking for a spring signature that transitions seamlessly from casual days to special occasions",
    "Fragrance lovers drawn to strawberry-forward florals with genuine fruit character and clean woods",
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
  subtitle      : "Luminous Innocence",
  description   : "Strawberry and violet leaves open with a burst of ruby red grapefruit—immediate, alive, unguarded. The heart unfolds into jasmine and gardenia, soft but never shy, anchored by a whisper of musk and sandalwood that keeps the composition grounded.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "floral",
    "fresh",
    "violet",
    "jasmine",
    "gardenia",
    "strawberry",
    "spring",
    "light",
    "daily-wear",
    "wedding",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 1,
  freshness     : 5,
  warmth        : 1,
  intensity     : 2,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["chance-eau-fraiche-inspired", "coco-mademoiselle-inspired", "chance-inspired"],
    wardrobePartners: ["flowerbomb-inspired", "la-vie-est-belle-inspired"],
  },
};
