// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — chanel-allure-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-09-02T17:28:00.406Z
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

import type { FragranceKnowledge } from "../types";

export const chanelAllureInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "chanel-allure-inspired",
  slug          : "chanel-allure-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Chanel Allure Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Floral"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral Aldehyde",
  season        : "Autumn",
  notes: {
    top:   ["Mandarin Orange", "Bergamot", "Peach", "Aldehydes"],
    heart: [
      "Rose",
      "Jasmine",
      "Iris",
      "Magnolia",
      "Peach Blossom",
    ],
    base:  [
      "Musk",
      "Vanilla",
      "Sandalwood",
      "Amber",
      "Vetiver",
    ],
  },
  notesEvidenceLocked: true,
  mood          : "Elegant Powdery Floral",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Elegant",
    "Sophisticated",
    "Soft",
    "Luminous",
    "Balanced",
    "Feminine",
  ],
  occasions     : ["Daily Wear", "Office", "Date Night", "Evening"],
  seasons       : ["Autumn", "Spring"],
  signatureStyle: ["Elegant Powdery Floral", "Balanced Signature", "Soft Luminous Radiance"],
  recommendedFor: [
    "Women seeking a refined signature fragrance that balances floral elegance with subtle warmth for everyday wear and professional settings",
    "Those who appreciate powdery florals with restraint—rose and jasmine without heaviness or overwhelming sweetness",
    "Anyone looking for a versatile autumn fragrance that transitions seamlessly from office to evening social occasions",
    "Women who want a sophisticated, balanced composition inspired by iconic feminine fragrance architecture",
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
  subtitle      : "Soft Radiance",
  description   : "Aldehydes open this composition with a luminous, almost powdery radiance—a soft shimmer that frames a heart of rose and jasmine rendered with restraint. Mandarin and peach add a whisper of warmth before musk and sandalwood settle into a skin-close base of refined elegance.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "floral-aldehyde",
    "rose",
    "jasmine",
    "iris",
    "signature-scent",
    "balanced",
    "elegant",
    "autumn",
    "office-wear",
    "date-night",
    "musk-vanilla",
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
    alternatives:     ["coco-mademoiselle-inspired", "miss-dior-inspired"],
    wardrobePartners: ["spicebomb-extreme-inspired", "sauvage-inspired"],
  },
};
