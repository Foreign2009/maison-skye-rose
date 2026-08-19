// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — khamrah-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-19T18:09:02.231Z
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

export const khamrahInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "khamrah-inspired",
  slug          : "khamrah-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Khamrah Inspired",
  collection    : "Elite",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "unisex",
  family        : ["Gourmand"],
  scentCharacter: "Rich & Full-Bodied",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Oriental Gourmand",
  season        : "Autumn",
  notes: {
    top:   ["Bergamot", "Cinnamon", "Clary Sage"],
    heart: ["Praline", "Fruity Notes", "Tuberose"],
    base:  [
      "Vanilla",
      "Spicy Precious Woods",
      "Agarwood (Oud)",
      "Myrrh",
      "Tonka Bean",
      "Benzoin",
      "Amber",
    ],
  },
  notesEvidenceLocked: true,
  mood          : "Sweet Spicy Oud",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Warm",
    "Sophisticated",
    "Sensual",
    "Mysterious",
    "Rich",
    "Luxurious",
  ],
  occasions     : ["Date Night", "Evening", "Weekend", "Formal"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Sweet Spice & Oud", "Oriental Gourmand", "Amber Elegance"],
  recommendedFor: [
    "Anyone seeking a luxurious unisex fragrance that balances gourmand sweetness with smoky, woody depth for evening occasions.",
    "Those who love oud and amber but want them softened by praline and vanilla rather than worn raw or austere.",
    "Women and men drawn to oriental fragrances that feel rich and full-bodied without being overly floral or traditionally feminine.",
    "Fragrance collectors building an autumn wardrobe of spiced, resinous scents with gourmand heart and olfactory complexity.",
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
  subtitle      : "Sweet Spice & Smoke",
  description   : "Cinnamon and bergamot ignite a warm opening that yields to praline and tuberose—sweetness deepened by spice. Agarwood and vanilla anchor the base, where myrrh and tonka bean create a lingering amber glow that feels both sensual and grounded.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "choosing-your-season-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "gourmand",
    "oriental",
    "vanilla",
    "oud",
    "praline",
    "amber",
    "autumn",
    "unisex",
    "spicy",
    "rich",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 4,
  freshness     : 2,
  warmth        : 2,
  intensity     : 3,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["arabians-musk-inspired", "hypnotic-poison-inspired", "black-opium-over-red-inspired"],
    wardrobePartners: ["oud-wood-inspired", "oud-mood-inspired"],
  },
};
