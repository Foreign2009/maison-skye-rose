// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — allure-homme-sport-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-16T18:10:41.184Z
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

export const allureHommeSportInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "allure-homme-sport-inspired",
  slug          : "allure-homme-sport-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Allure Homme Sport Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Woody", "Spicy"],
  scentCharacter: "Rich & Full-Bodied",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Woody Spicy",
  season        : "Autumn",
  notes: {
    top:   ["Orange", "Sea Notes", "Aldehydes", "Blood Mandarin"],
    heart: ["Pepper", "Neroli", "Cedar"],
    base:  [
      "Vanilla",
      "Tonka Bean",
      "White Musk",
      "Amber",
      "Vetiver",
      "Elemi Resin",
    ],
  },
  mood          : "Fresh Citrus Masculine",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Fresh",
    "Confident",
    "Sophisticated",
    "Warm",
    "Magnetic",
  ],
  occasions     : ["Office", "Date Night", "Weekend", "Evening"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Citrus Spice Sophistication", "Woody-Aromatic Refinement", "Modern Versatile Signature"],
  recommendedFor: [
    "Men seeking a refined citrus-spice signature that transitions seamlessly from office to evening.",
    "Those who appreciate fresh opening brightness balanced with warm woody-spice depth for autumn and cool-weather wear.",
    "Anyone building a versatile collection who wants one fragrance that bridges crisp aldehydes and creamy vanilla warmth.",
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
  subtitle      : "Citrus Edge",
  description   : "Opens with bright blood mandarin and sea spray, sharp aldehydes cutting through citrus warmth. Pepper and neroli emerge as the composition settles into cedar and vanilla, grounded by vetiver and white musk that feel clean without surrender.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "how-to-wear-fragrance"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "woody",
    "spicy",
    "amber",
    "vanilla",
    "pepper",
    "cedar",
    "vetiver",
    "autumn",
    "office",
    "date-night",
    "layering",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 2,
  warmth        : 4,
  intensity     : 3,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["spicebomb-extreme-inspired", "sauvage-elixir-inspired"],
    wardrobePartners: ["sauvage-inspired", "terre-d'hermes-inspired"],
  },
};
