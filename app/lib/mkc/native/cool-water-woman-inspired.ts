// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — cool-water-woman-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-09-11T18:49:55.032Z
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

export const coolWaterWomanInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "cool-water-woman-inspired",
  slug          : "cool-water-woman-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Cool Water Woman Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Aquatic", "Floral"],
  scentCharacter: "Fresh & Light",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Aquatic Floral",
  season        : "Summer",
  notes: {
    top:   [
      "Watermelon",
      "Pineapple",
      "Melon",
      "Lotus",
      "Lemon",
      "Calone",
      "Quince",
      "Lily",
      "Black Currant",
    ],
    heart: [
      "Lotus",
      "Water Lily",
      "Lily-of-the-Valley",
      "Jasmine",
      "Honey",
      "Hawthorn",
      "Rose",
    ],
    base:  [
      "Musk",
      "Vetiver",
      "Violet Root",
      "Sandalwood",
      "Peach",
      "Raspberry",
      "Blackberry",
      "Vanilla",
    ],
  },
  notesEvidenceLocked: true,
  mood          : "Fresh Luminous Feminine",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Luminous",
    "Feminine",
    "Fresh",
    "Delicate",
    "Bright",
    "Elegant",
  ],
  occasions     : ["Daily Wear", "Vacation", "Weekend", "Casual"],
  seasons       : ["Summer", "Spring"],
  signatureStyle: ["Aquatic Rose Luminosity", "Fresh Feminine Bloom", "Summer Skin Scent"],
  recommendedFor: [
    "Women seeking a luminous fresh fragrance that feels like skin itself on warm days and vacations",
    "Those who love aquatic florals with delicate sweetness but want brightness over heaviness",
    "Anyone drawn to watermelon and lotus as opening signals of effortless summer elegance",
    "Fragrance beginners wanting an approachable, skin-like signature for daily wear and warm summer days",
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
  subtitle      : "Aquatic Rose Luminosity",
  description   : "Watermelon and lotus open into a luminous aquatic heart where rose and lily-of-the-valley bloom with delicate sweetness. Musk and sandalwood anchor the composition in soft, skin-like warmth—a fragrance that feels like sunlight on cool water.",
  academyArticleIds: ["guide-to-fragrance-families", "choosing-your-season-scent", "the-note-pyramid-explained", "how-to-wear-fragrance"],
  academyCategories: ["fragrance-families", "occasions-and-style", "the-note-pyramid"],
  educationTags : [
    "aquatic",
    "floral",
    "fresh",
    "light",
    "summer",
    "watermelon",
    "lotus",
    "lily",
    "feminine",
    "daily-wear",
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
    alternatives:     ["light-blue-inspired", "omnia-crystalline-inspired", "omnia-green-jade-inspired"],
    wardrobePartners: ["invictus-inspired", "cool-water-inspired"],
  },
};
