// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — gabrielle-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-22T18:49:40.400Z
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

export const gabrielleInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "gabrielle-inspired",
  slug          : "gabrielle-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Gabrielle Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Floral"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral",
  season        : "Year-Round",
  notes: {
    top:   ["Grapefruit", "Mandarin Orange", "Black Currant"],
    heart: [
      "Orange Blossom",
      "Jasmine",
      "Ylang-Ylang",
      "Tuberose",
      "Lily of the Valley",
      "Pear",
      "Pink Pepper",
    ],
    base:  ["Musk", "Sandalwood", "Cashmeran", "Orris"],
  },
  notesEvidenceLocked: true,
  mood          : "Luminous White Floral",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Luminous",
    "Confident",
    "Sophisticated",
    "Elegant",
    "Feminine",
    "Fresh",
  ],
  occasions     : [
    "Daily Wear",
    "Office",
    "Date Night",
    "Evening",
    "Weekend",
  ],
  seasons       : ["Spring", "Summer", "Autumn", "Winter"],
  signatureStyle: ["Luminous White Floral", "Modern Feminine Signature", "Balanced Elegance"],
  recommendedFor: [
    "Women seeking a luminous, balanced white floral that transitions seamlessly from office to evening without reapplication.",
    "Those who want signature femininity that feels modern and confident rather than traditionally romantic.",
    "Fragrance enthusiasts building a collection who need a sophisticated everyday floral that anchors multiple wardrobe moods.",
    "Anyone looking for a year-round staple with enough complexity to stay interesting through repeated wear.",
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
  subtitle      : "Luminous White Floral",
  description   : "Grapefruit and black currant open onto a luminous heart of orange blossom and jasmine, where tuberose and lily of the valley create an intoxicating white floral core. Sandalwood and musk settle beneath, grounding the composition in soft, creamy warmth.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "floral",
    "jasmine",
    "orange-blossom",
    "signature-scent",
    "year-round",
    "balanced",
    "feminine",
    "citrus",
    "musk",
    "sandalwood",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],

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
    alternatives:     ["delina-inspired", "mon-paris-inspired", "very-good-girl-inspired"],
    wardrobePartners: ["baccarat-rouge-540-inspired", "alien-inspired"],
  },
};
