// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — oud-bergamot-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-19T18:07:55.920Z
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

export const oudBergamotInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "oud-bergamot-inspired",
  slug          : "oud-bergamot-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Oud Bergamot Inspired",
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
  season        : "Year-Round",
  notes: {
    top:   [],
    heart: [
      "Agarwood (Oud)",
      "Bergamot",
      "Virginia Cedar",
      "Orange",
      "Amalfi Lemon",
    ],
    base:  [],
  },
  notesEvidenceLocked: true,
  mood          : "Smoky Citrus Oud",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Sophisticated",
    "Smoky",
    "Fresh",
    "Grounded",
    "Modern",
    "Elegant",
  ],
  occasions     : ["Daily Wear", "Office", "Weekend", "Evening"],
  seasons       : ["Spring", "Summer", "Autumn", "Winter"],
  signatureStyle: ["Smoky Citrus Oud", "Balanced Woody Unisex", "Sophisticated Signature"],
  recommendedFor: [
    "Anyone seeking a sophisticated unisex signature that balances citrus brightness with smoky wood depth",
    "Those who appreciate oud's complexity but want it softened by fresh bergamot and lemon rather than heavy sweetness",
    "Fragrance collectors building a woody wardrobe who value year-round versatility and a restrained, considered character",
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
  subtitle      : "Smoky Citrus Depth",
  description   : "Bergamot and agarwood in striking contrast—citrus brightness meeting smoky, resinous depth. Virginia cedar, orange, and Amalfi lemon complete a composition that is simultaneously fresh and grounding, with an earthy woody character that makes it fully year-round.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "what-makes-a-signature-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "oud",
    "woody",
    "oriental",
    "bergamot",
    "citrus",
    "cedar",
    "unisex",
    "signature-scent",
    "layering",
    "daily-wear",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "what-makes-a-signature-scent"],

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
    alternatives:     ["oud-wood-inspired", "ombre-nomade-inspired", "arabians-tonka-inspired"],
    wardrobePartners: ["bleu-de-chanel-inspired"],
  },
};
