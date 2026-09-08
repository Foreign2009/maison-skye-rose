// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — matiere-noire-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-09-07T19:16:15.066Z
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

export const matiereNoireInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "matiere-noire-inspired",
  slug          : "matiere-noire-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Matiere Noire Inspired",
  collection    : "Elite",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Woody"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Oriental Woody",
  season        : "Autumn",
  notes: {
    top:   ["Blackcurrant Syrup", "Watery Notes"],
    heart: ["Rose", "Cyclamen", "Narcissus", "Jasmine Sambac"],
    base:  ["Agarwood", "Benzoin", "Patchouli", "Incense"],
  },
  notesEvidenceLocked: true,
  mood          : "Dark Floral Oud",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Sophisticated",
    "Mysterious",
    "Elegant",
    "Sensual",
    "Warm",
    "Intense",
  ],
  occasions     : ["Office", "Date Night", "Evening", "Formal"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Dark Floral Oud", "Sophisticated Oriental", "Nocturnal Elegance"],
  recommendedFor: [
    "Women seeking a sophisticated dark floral that transitions seamlessly from professional settings to intimate evenings.",
    "Those who appreciate oud and incense but want them softened by luminous florals rather than dominant and austere.",
    "Anyone drawn to nocturnal, introspective fragrances that reveal complexity and depth with wear.",
    "Fragrance collectors building an autumn and evening wardrobe around woody orientals with feminine grace.",
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
  subtitle      : "Nocturnal Bloom",
  description   : "Dark florals—rose, jasmine, cyclamen—unfold against a bruised blackcurrant opening, their luminosity deepening as agarwood and incense emerge from beneath. Benzoin and patchouli ground the composition in worn velvet and smoke, a fragrance that feels both intimate and austere.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "what-makes-a-signature-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "woody",
    "oriental",
    "agarwood",
    "rose",
    "balanced-signature",
    "autumn",
    "patchouli",
    "incense",
    "layering",
    "sophisticated",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

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
    alternatives:     ["baccarat-rouge-540-inspired", "crystal-noir-inspired"],
    wardrobePartners: ["oud-wood-inspired", "alien-inspired"],
  },
};
