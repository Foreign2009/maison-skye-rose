// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — poison-girl-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-07-13T18:30:25.172Z
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

export const poisonGirlInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "poison-girl-inspired",
  slug          : "poison-girl-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Poison Girl Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Amber", "Sweet"],
  scentCharacter: "Rich & Long Wearing",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Sweet Amber",
  season        : "Winter",
  notes: {
    top:   ["Bergamot", "Cinnamon", "Vanilla"],
    heart: ["Orange Blossom", "Tuberose", "Cinnamon"],
    base:  ["Tonka Bean", "Amber", "Sandalwood"],
  },
  mood          : "Bold and seductive.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Bold",
    "Seductive",
    "Powerful",
    "Warm",
    "Sensual",
    "Confident",
  ],
  occasions     : ["Date Night", "Evening", "Weekend"],
  seasons       : ["Winter"],
  signatureStyle: ["Rebellious Luxury", "Seductive Warmth", "Bold Amber Statement"],
  recommendedFor: [
    "Women seeking a bold, unapologetic signature that turns heads and commands attention in intimate settings",
    "Those who love warm spices and creamy amber and want fragrance that lingers on skin and clothing",
    "Anyone drawn to seductive, sensual scents that feel luxurious without apology or restraint",
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
  subtitle      : "Velvet Rebellion",
  description   : "Cinnamon and bergamot ignite the opening with sharp warmth, then tuberose and tonka bean deepen into a voluptuous, amber-tinged embrace. This is fragrance as seduction—bold, unapologetic, wrapped in sandalwood smoke and vanilla silk.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "choosing-your-season-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "amber",
    "sweet",
    "tonka-bean",
    "vanilla",
    "cinnamon",
    "tuberose",
    "sandalwood",
    "bold",
    "winter",
    "date-night",
    "long-wearing",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "choosing-your-season-scent"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 4,
  freshness     : 1,
  warmth        : 4,
  intensity     : 4,
  versatility   : 2,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["ultra-male-inspired", "stronger-with-you-intensely-inspired"],
    wardrobePartners: ["sauvage-inspired"],
  },
};
