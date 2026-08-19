// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — black-orchid-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-19T18:08:19.026Z
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

export const blackOrchidInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "black-orchid-inspired",
  slug          : "black-orchid-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Black Orchid Inspired",
  collection    : "Elite",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "unisex",
  family        : ["Floral"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral Oriental",
  season        : "Autumn",
  notes: {
    top:   [
      "French Jasmine",
      "Black Truffle",
      "Ylang-Ylang",
      "Black Currant",
      "Bergamot",
    ],
    heart: ["Black Orchid"],
    base:  [
      "Patchouli",
      "Sandalwood",
      "Dark Chocolate",
      "Incense",
      "Amber",
      "Vetiver",
      "Vanilla",
      "Balsam",
    ],
  },
  notesEvidenceLocked: true,
  mood          : "Dark Floral Mysterious",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Mysterious",
    "Sophisticated",
    "Magnetic",
    "Elegant",
    "Bold",
    "Sensual",
  ],
  occasions     : [
    "Date Night",
    "Evening",
    "Office",
    "Formal",
    "Weekend",
  ],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Dark Floral Luxury", "Mysterious Signature", "Sophisticated Oriental"],
  recommendedFor: [
    "Women and men seeking a dark floral signature that combines mystery with sophisticated elegance for evening and special occasions",
    "Anyone drawn to the unconventional side of florals—those who want jasmine and orchid without sweetness or apology",
    "Fragrance collectors building a luxury wardrobe who need a statement piece that bridges feminine and masculine registers",
    "Those planning a memorable date night or evening event who want to feel magnetic and unforgettable",
  ],

  // ── Merchandising ───────────────────────────────────────────────────────────
  prices: {
    "5ml":  60,
    "10ml": 100,
    "30ml": 250,
  },
  images: {
    "5ml":  "",  // FACTORY_ERROR: IMAGE_MISSING — image path for 5ml is required
    "10ml": "",  // FACTORY_ERROR: IMAGE_MISSING — image path for 10ml is required
    "30ml": "",  // FACTORY_ERROR: IMAGE_MISSING — image path for 30ml is required
  },
  bestSeller    : false,
  newArrival    : false,

  // ── Education ───────────────────────────────────────────────────────────────
  subtitle      : "Dark Floral Mysterious",
  description   : "Black orchid unfolds against a backdrop of truffle and dark chocolate, anchored by patchouli and incense that deepen into amber and vetiver. This is a floral that refuses softness—jasmine and ylang-ylang curve toward mystery rather than innocence, while bergamot and black currant add a tart, almost dangerous edge. Sensual without surrender.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "what-makes-a-signature-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "floral-oriental",
    "black-orchid",
    "jasmine",
    "patchouli",
    "dark-chocolate",
    "mysterious",
    "signature-scent",
    "unisex",
    "layerable",
    "autumn",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "what-makes-a-signature-scent"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 3,
  warmth        : 2,
  intensity     : 3,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["baccarat-rouge-540-inspired", "oud-mood-inspired"],
    wardrobePartners: ["alien-inspired", "ombre-nomade-inspired"],
  },
};
