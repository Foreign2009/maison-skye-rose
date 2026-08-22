// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — chance-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-16T16:51:00.314Z
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

export const chanceInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "chance-inspired",
  slug          : "chance-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Chance Inspired",
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
    top:   ["Citron", "Pink Pepper"],
    heart: ["Jasmine Absolute", "Iris Absolute", "Hyacinth"],
    base:  ["Amber Patchouli", "White Musk", "Vetiver"],
  },
  mood          : "Fresh Floral Feminine",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Feminine",
    "Fresh",
    "Elegant",
    "Bright",
    "Sophisticated",
    "Magnetic",
  ],
  occasions     : [
    "Daily Wear",
    "Office",
    "Date Night",
    "Wedding",
    "Weekend",
  ],
  seasons       : ["Spring", "Summer"],
  signatureStyle: ["Fresh Floral Elegance", "Modern Feminine Radiance", "Bright Jasmine Signature"],
  recommendedFor: [
    "Women seeking a radiant everyday floral that bridges fresh citrus brightness with elegant jasmine sophistication.",
    "Those who love pink pepper's subtle spice and want a feminine signature that feels both modern and timeless.",
    "Anyone looking for a spring fragrance that transitions effortlessly from daily wear to special occasions without heaviness.",
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
  subtitle      : "Radiant Femininity",
  description   : "Pink pepper and citron open with bright vitality, immediately yielding to a lush heart of jasmine and iris that unfolds with deliberate elegance. Amber patchouli and white musk anchor the composition, creating a feminine fragrance that is luminous without artifice.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-wear-fragrance", "choosing-your-season-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "floral",
    "fresh",
    "jasmine",
    "iris",
    "pink-pepper",
    "citron",
    "amber",
    "spring",
    "feminine",
    "daily-wear",
    "wedding",
    "light",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-wear-fragrance"],

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
    alternatives:     ["coco-mademoiselle-inspired", "chance-eau-fraiche-inspired", "chance-eau-tendre-inspired", "a-la-rose-inspired"],
    wardrobePartners: ["flowerbomb-inspired", "libre-inspired"],
  },
};
