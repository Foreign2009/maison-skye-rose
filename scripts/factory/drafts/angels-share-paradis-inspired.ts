// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — angels-share-paradis-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-19T18:06:32.457Z
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

export const angelsShareParadisInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "angels-share-paradis-inspired",
  slug          : "angels-share-paradis-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Angels Share Paradis Inspired",
  collection    : "Elite",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "unisex",
  family        : ["Fruity"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Oriental Fruity",
  season        : "Autumn",
  notes: {
    top:   ["Raspberry", "Cognac", "Liquor"],
    heart: ["Tonka Bean", "Bulgarian Rose", "Caramel"],
    base:  [
      "Oak",
      "Praline",
      "Sandalwood",
      "Oakmoss",
      "Vanilla",
    ],
  },
  notesEvidenceLocked: true,
  mood          : "Sweet Fruity Woody",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Luxurious",
    "Warm",
    "Sensual",
    "Sophisticated",
    "Balanced",
    "Magnetic",
  ],
  occasions     : ["Date Night", "Evening", "Office", "Formal"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Oriental Fruity Elegance", "Gourmand Sophistication", "Liquid Gold Warmth"],
  recommendedFor: [
    "Anyone seeking a sophisticated unisex fragrance that balances fruity brightness with creamy warmth for autumn evenings and special occasions.",
    "Those who love gourmand fragrances with depth—raspberry and cognac paired with tonka and caramel for sensual, layered wear.",
    "Fragrance collectors drawn to Oriental Fruity compositions that feel both indulgent and wearable, not costume-like.",
    "Men and women who want a signature that works equally well at intimate dinners and professional settings where personality matters.",
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
  subtitle      : "Liquid Gold",
  description   : "Raspberry and cognac open with the warmth of spiced liquor, giving way to tonka bean's creamy sweetness against delicate rose. Oak and praline settle into a woody base that smells like caramelized amber and skin.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "what-makes-a-signature-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "fruity",
    "oriental",
    "tonka-bean",
    "rose",
    "caramel",
    "vanilla",
    "praline",
    "cognac",
    "unisex",
    "signature",
    "autumn",
    "layering",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 2,
  warmth        : 2,
  intensity     : 3,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["arabians-tonka-inspired", "ultra-male-inspired"],
    wardrobePartners: ["alien-inspired"],
  },
};
