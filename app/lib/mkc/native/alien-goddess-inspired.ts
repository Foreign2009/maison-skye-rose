// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — alien-goddess-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-07-13T18:29:58.694Z
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

import type { FragranceKnowledge } from "../types";

export const alienGoddessInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "alien-goddess-inspired",
  slug          : "alien-goddess-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Alien Goddess Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Vanilla", "Floral"],
  scentCharacter: "Rich & Long Wearing",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Vanilla Floral",
  season        : "Summer",
  notes: {
    top:   ["Coconut Milk", "Yuzu"],
    heart: ["Jasmine Sambac", "Tuberose"],
    base:  ["Vanilla Absolute", "Sandalwood"],
  },
  mood          : "Radiant and uplifting.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Radiant",
    "Luminous",
    "Sensual",
    "Confident",
    "Warm",
    "Sophisticated",
  ],
  occasions     : [
    "Daily Wear",
    "Vacation",
    "Summer Days",
    "Date Night",
    "Evening",
  ],
  seasons       : ["Summer"],
  signatureStyle: ["Golden Glow", "Luminous Floral", "Tropical Luxury", "Creamy Radiance"],
  recommendedFor: [
    "Women seeking a radiant, long-wearing signature that celebrates golden hour glamour and luminous florals",
    "Those who love creamy vanilla florals with tropical brightness and want a fragrance that blooms louder as the day progresses",
    "Anyone looking for a summer essential that transitions effortlessly from beach days to evening occasions without feeling seasonal",
    "Fragrance collectors drawn to opulent tuberose and jasmine compositions that feel luxurious yet wearable",
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
  subtitle      : "Radiant Bloom",
  description   : "Coconut milk and yuzu open with sun-drenched clarity, yielding to a luminous heart of jasmine sambac and tuberose that blooms without apology. Vanilla absolute and sandalwood anchor the composition in warm, creamy depth—a fragrance that radiates from within.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "choosing-your-season-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "vanilla",
    "floral",
    "jasmine",
    "tuberose",
    "coconut",
    "sandalwood",
    "summer",
    "long-wearing",
    "layering",
    "tropical",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "choosing-your-season-scent"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 4,
  freshness     : 3,
  warmth        : 4,
  intensity     : 2,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["delina-inspired"],
    wardrobePartners: ["baccarat-rouge-540-inspired"],
  },
};
