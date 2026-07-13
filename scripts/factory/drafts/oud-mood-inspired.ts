// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — oud-mood-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-07-13T18:31:20.189Z
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

export const oudMoodInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "oud-mood-inspired",
  slug          : "oud-mood-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Oud Mood Inspired",
  collection    : "Elite",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "unisex",
  family        : ["Amber", "Oud"],
  scentCharacter: "Deep & Intense",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Amber Oud",
  season        : "Winter",
  notes: {
    top:   ["Oud Distillate", "Black Cardamom"],
    heart: ["Amber Resin", "Labdanum"],
    base:  ["Caramel Absolute", "Sandalwood"],
  },
  mood          : "Deep sweet oud.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Luxurious",
    "Sensual",
    "Warm",
    "Mysterious",
    "Sophisticated",
    "Intense",
  ],
  occasions     : ["Date Night", "Evening", "Weekend"],
  seasons       : ["Winter", "Autumn"],
  signatureStyle: ["Arabian Luxury", "Honeyed Darkness", "Intimate Oud"],
  recommendedFor: [
    "Those seeking a deeply sensual, honeyed oud that transforms spice into warmth for intimate evening occasions.",
    "Fragrance collectors who appreciate traditional Arabian oud balanced with caramel sweetness and creamy sandalwood.",
    "Anyone drawn to amber and oud compositions who wants moderate projection with lasting, cozy depth rather than aggressive sillage.",
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
  subtitle      : "Honeyed Darkness",
  description   : "Oud distillate and black cardamom open with austere spice, then settle into a warm embrace of amber resin and labdanum. Caramel absolute and sandalwood deepen the base into something honeyed and intimate—a fragrance that wraps rather than announces.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "choosing-your-season-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "oud",
    "amber",
    "cardamom",
    "sandalwood",
    "caramel",
    "labdanum",
    "deep",
    "intense",
    "winter",
    "unisex",
    "date-night",
    "woody-amber",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 3,
  freshness     : 1,
  warmth        : 4,
  intensity     : 4,
  versatility   : 2,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["oud-wood-inspired"],
    wardrobePartners: ["baccarat-rouge-540-inspired"],
  },
};
