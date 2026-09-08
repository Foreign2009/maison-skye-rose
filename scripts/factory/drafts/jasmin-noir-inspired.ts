// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — jasmin-noir-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-09-07T18:27:25.394Z
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

export const jasminNoirInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "jasmin-noir-inspired",
  slug          : "jasmin-noir-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Jasmin Noir Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Floral"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Oriental Floral",
  season        : "Autumn",
  notes: {
    top:   ["Gardenia", "Green Notes"],
    heart: ["Jasmine Sambac", "Almond"],
    base:  [
      "Tonka Bean",
      "Licorice",
      "Precious Woods",
      "Musk",
      "Amber",
      "Patchouli",
    ],
  },
  notesEvidenceLocked: true,
  mood          : "Dark Floral Oriental",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Sophisticated",
    "Sensual",
    "Mysterious",
    "Warm",
    "Elegant",
    "Magnetic",
  ],
  occasions     : ["Office", "Date Night", "Evening", "Weekend"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Dark Floral Sophistication", "Creamy Oriental Signature", "Honeyed Elegance"],
  recommendedFor: [
    "Women seeking a sophisticated dark floral that transitions seamlessly from professional settings to evening occasions.",
    "Those who love jasmine and gardenia but want depth, warmth, and a honeyed richness rather than bright florals.",
    "Anyone building a signature collection who values versatility — a fragrance that works equally well in autumn office wear and date night.",
    "Fragrance enthusiasts drawn to oriental florals who appreciate creamy tonka and amber layered with mysterious woody and licorice notes.",
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
  subtitle      : "Dark Floral Honey",
  description   : "Gardenia and green notes open onto a heart of creamy jasmine sambac and almond, deep and honeyed. The base settles into tonka bean, licorice, and precious woods — a dark floral that moves between sweetness and shadow, amber and musk layering beneath.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "what-makes-a-signature-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "oriental-floral",
    "jasmine",
    "gardenia",
    "tonka-bean",
    "amber",
    "patchouli",
    "signature-scent",
    "layering",
    "autumn",
    "elegant",
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
    alternatives:     ["alien-inspired", "mon-guerlain-inspired"],
    wardrobePartners: ["baccarat-rouge-540-inspired", "hypnotic-poison-inspired"],
  },
};
