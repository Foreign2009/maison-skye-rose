// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — opium-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-09-07T18:28:03.168Z
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

export const opiumInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "opium-inspired",
  slug          : "opium-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Opium Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Spicy"],
  scentCharacter: "Rich & Full-Bodied",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Oriental Spicy",
  season        : "Autumn",
  notes: {
    top:   [
      "Mandarin Orange",
      "Plum",
      "Clove",
      "Coriander",
      "Pepper",
      "Bay Leaf",
    ],
    heart: [
      "Jasmine",
      "Rose",
      "Lily of the Valley",
      "Carnation",
      "Cinnamon",
      "Peach",
      "Orris Root",
    ],
    base:  ["Sandalwood", "Cedarwood", "Myrrh"],
  },
  notesEvidenceLocked: true,
  mood          : "Bold Spiced Oriental",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Bold",
    "Sensual",
    "Sophisticated",
    "Warm",
    "Mysterious",
    "Intense",
  ],
  occasions     : ["Date Night", "Evening", "Weekend", "Formal"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Bold Spiced Oriental", "Sensual Rose Statement", "Warm Resinous Luxury"],
  recommendedFor: [
    "Women who command attention with bold spiced florals and want a signature that lingers in memory",
    "Those seeking an evening or date fragrance that balances sensuality with sophisticated warmth",
    "Anyone drawn to rich orientals with rose and myrrh—complex enough for repeated discovery",
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
  subtitle      : "Spiced Rose, Dark Warmth",
  description   : "Mandarin and clove ignite a warm spice that deepens into rose and jasmine—florals wrapped in cinnamon and myrrh. Sandalwood and cedarwood anchor the composition with resinous weight, creating an oriental that is both sensual and structured.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "choosing-your-season-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "oriental-spicy",
    "rose",
    "jasmine",
    "sandalwood",
    "warm-spice",
    "cinnamon",
    "mandarin",
    "bold",
    "autumn",
    "sensual",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-layer-fragrances"],

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
    alternatives:     ["hypnotic-poison-inspired", "black-opium-inspired"],
    wardrobePartners: ["spicebomb-extreme-inspired"],
  },
};
