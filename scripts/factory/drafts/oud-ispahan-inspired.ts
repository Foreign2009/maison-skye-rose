// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — oud-ispahan-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-16T16:53:29.429Z
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

import type { FragranceKnowledge } from "../../../app/lib/mkc/types";

export const oudIspahanInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "oud-ispahan-inspired",
  slug          : "oud-ispahan-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Oud Ispahan Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Woody"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Oriental Woody",
  season        : "Winter",
  notes: {
    top:   ["Labdanum"],
    heart: ["Rose", "Patchouli", "Saffron"],
    base:  ["Agarwood (Oud)", "Sandalwood", "Cedar"],
  },
  mood          : "Oriental Romantic Rose",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Romantic",
    "Sophisticated",
    "Warm",
    "Sensual",
    "Luxurious",
    "Mysterious",
  ],
  occasions     : ["Date Night", "Evening", "Wedding", "Formal"],
  seasons       : ["Winter", "Autumn"],
  signatureStyle: ["Oriental Romantic", "Spiced Luxury", "Sophisticated Rose"],
  recommendedFor: [
    "Women seeking a luxurious Oriental signature that balances romance with sophisticated depth.",
    "Those who appreciate rose fragrances elevated by dark woods and spice rather than sweetness.",
    "Anyone drawn to the warmth of oud and saffron for intimate evenings and special occasions.",
    "Fragrance collectors building a winter wardrobe around woody, resinous Oriental classics.",
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
  subtitle      : "Rosewood Incense",
  description   : "Rose and saffron bloom in warm spice, anchored by the dark, resinous depth of agarwood and cedar. This is romantic luxury stripped of artifice—a fragrance that settles into skin like silk, unfolding layers of patchouli and sandalwood as it deepens.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "what-makes-a-signature-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "oud",
    "woody",
    "oriental",
    "rose",
    "patchouli",
    "saffron",
    "sandalwood",
    "winter",
    "romantic",
    "signature",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 2,
  warmth        : 3,
  intensity     : 4,
  versatility   : 2,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["delina-exclusif-inspired", "baccarat-rouge-540-inspired"],
    wardrobePartners: ["oud-wood-inspired", "oud-for-greatness-inspired"],
  },
};
