// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — idole-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-19T18:33:50.409Z
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

export const idoleInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "idole-inspired",
  slug          : "idole-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Idole Inspired",
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
  season        : "Spring",
  notes: {
    top:   ["Pear", "Bergamot", "Pink Pepper"],
    heart: ["Rose", "Jasmine"],
    base:  ["White Musk", "Vanilla", "Patchouli", "Cedar"],
  },
  notesEvidenceLocked: true,
  mood          : "Clean Floral Fresh",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Clean",
    "Fresh",
    "Elegant",
    "Luminous",
    "Sophisticated",
    "Soft",
  ],
  occasions     : [
    "Daily Wear",
    "Office",
    "Wedding",
    "Date Night",
    "Casual",
  ],
  seasons       : ["Spring", "Summer"],
  signatureStyle: ["Luminous Rose", "Clean Floral Signature", "Balanced Elegance"],
  recommendedFor: [
    "Women seeking a luminous rose signature that feels fresh and wearable every day, from office to casual moments",
    "Those who love florals but prefer clean, balanced compositions over heavy sweetness or darkness",
    "Anyone looking for a graceful spring fragrance that blooms quietly without demanding attention",
    "Fragrance collectors wanting a modern rose that pairs beautifully with both professional and intimate wardrobes",
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
  subtitle      : "Luminous Rose",
  description   : "Opens with bright pear and bergamot, a luminous prelude to a heart of rose and jasmine that blooms with quiet intensity. White musk and vanilla anchor the composition, creating a fragrance that feels both fresh and deeply sensual—modern femininity distilled to its essence.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "floral",
    "rose",
    "jasmine",
    "pear",
    "bergamot",
    "signature-scent",
    "balanced",
    "spring",
    "daily-wear",
    "wedding",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 3,
  warmth        : 2,
  intensity     : 2,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["delina-inspired", "chance-eau-tendre-inspired", "coco-mademoiselle-inspired"],
    wardrobePartners: ["stronger-with-you-inspired", "black-opium-inspired"],
  },
};
