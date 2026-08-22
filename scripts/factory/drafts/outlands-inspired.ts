// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — outlands-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-22T18:54:00.416Z
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

export const outlandsInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "outlands-inspired",
  slug          : "outlands-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Outlands Inspired",
  collection    : "Elite",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "unisex",
  family        : ["Woody"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Oriental Woody",
  season        : "Autumn",
  notes: {
    top:   [
      "Frankincense",
      "Cardamom",
      "Elemi",
      "Lemon",
      "Bergamot",
      "Sichuan Pepper",
    ],
    heart: [
      "Patchouli",
      "Anise",
      "Coriander",
      "Saffron",
      "Cumin",
      "Orange Blossom",
      "Wormwood",
      "Geranium",
      "Rose",
    ],
    base:  [
      "Frankincense",
      "Vanilla",
      "Amber",
      "Benzoin",
      "Oud",
      "Opoponax",
      "Birch",
      "Ambergris",
      "Labdanum",
      "Maltol",
      "Musk",
    ],
  },
  notesEvidenceLocked: true,
  mood          : "Rich Oud Oriental",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Sophisticated",
    "Warm",
    "Intense",
    "Mysterious",
    "Artistic",
    "Powerful",
  ],
  occasions     : ["Office", "Date Night", "Evening", "Formal"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Rich Oud Oriental", "Ritualistic Resin", "Balanced Signature"],
  recommendedFor: [
    "Anyone seeking a unisex signature that balances sharp resin and warm spice with sophisticated depth",
    "Those who appreciate complex orientals with prominent oud and want to move beyond conventional florals",
    "Men and women drawn to ritualistic, incense-forward fragrances that command attention without aggression",
    "Fragrance collectors building a curated wardrobe of statement woody-orientals for evening and special occasions",
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
  subtitle      : "Wild Frontier",
  description   : "Frankincense and cardamom ignite a sharp, almost medicinal opening that dissolves into a complex heart of saffron, patchouli, and rose—layered, warm, uncompromising. The base settles into a deep oud-amber symphony, grounded by vanilla and benzoin, where the fragrance becomes something slower, richer, almost ceremonial.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "what-makes-a-signature-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "woody",
    "oriental",
    "oud",
    "frankincense",
    "patchouli",
    "spiced",
    "amber",
    "signature-scent",
    "unisex",
    "autumn",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 2,
  warmth        : 3,
  intensity     : 3,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["oud-mood-inspired", "haltane-inspired", "rose-oud-inspired"],
    wardrobePartners: ["spicebomb-extreme-inspired", "oud-for-greatness-inspired"],
  },
};
