// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — narciso-rouge-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-19T18:36:28.074Z
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

export const narcisoRougeInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "narciso-rouge-inspired",
  slug          : "narciso-rouge-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Narciso Rouge Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Floral", "Musk"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral Musk",
  season        : "Year-Round",
  notes: {
    top:   ["Iris", "Bulgarian Rose"],
    heart: ["Musk", "Tuberose", "Orange Blossom"],
    base:  [
      "Tonka Bean",
      "Vanilla",
      "White Cedar Extract",
      "Cedar",
      "Sandalwood",
      "Vetiver",
    ],
  },
  notesEvidenceLocked: true,
  mood          : "Powdery Floral",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Elegant",
    "Sophisticated",
    "Soft",
    "Luminous",
    "Feminine",
    "Warm",
  ],
  occasions     : ["Daily Wear", "Office", "Date Night", "Evening"],
  seasons       : ["Spring", "Summer", "Autumn", "Winter"],
  signatureStyle: ["Powdery Floral Signature", "Modern Rose Icon", "Sophisticated Elegance"],
  recommendedFor: [
    "Women seeking a sophisticated signature fragrance that transitions seamlessly from office to evening without adjustment",
    "Those who love rose but want it softened by powdery florals and creamy musks rather than sharp or dewy interpretations",
    "Anyone building a year-round collection who needs one versatile floral that feels both polished and intimately personal",
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
  subtitle      : "Powdered Rose",
  description   : "Iris and Bulgarian rose open with pristine clarity, yielding to a powdery heart of tuberose and musk that feels both intimate and luminous. Tonka bean and sandalwood settle into a soft, skin-close base that whispers rather than demands.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-wear-fragrance", "what-makes-a-signature-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "floral-musk",
    "rose",
    "iris",
    "tuberose",
    "vanilla",
    "tonka-bean",
    "signature-scent",
    "balanced",
    "year-round",
    "daily-wear",
    "sandalwood",
    "cedar",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-wear-fragrance"],

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
    alternatives:     ["baccarat-rouge-540-inspired", "crystal-noir-inspired", "si-passione-red-musk-inspired"],
    wardrobePartners: ["delina-inspired", "good-girl-inspired"],
  },
};
