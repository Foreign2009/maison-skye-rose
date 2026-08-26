// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — oud-cadenza-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-26T18:04:50.885Z
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

export const oudCadenzaInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "oud-cadenza-inspired",
  slug          : "oud-cadenza-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Oud Cadenza Inspired",
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
  season        : "Autumn",
  notes: {
    top:   [
      "Saffron",
      "Cinnamon",
      "Cardamom",
      "Nutmeg",
      "Ginger",
      "Pink Pepper",
    ],
    heart: [
      "Dates",
      "Agarwood (Oud)",
      "Caramel",
      "Sugar Cane",
      "Incense",
      "Amberwood",
      "Myrrh",
      "Davana",
    ],
    base:  [
      "Madagascar Vanilla",
      "Cacao Butter",
      "Tonka Bean",
      "Leather",
      "Benzoin",
      "Musk",
      "Patchouli",
      "Labdanum",
      "Mate",
    ],
  },
  notesEvidenceLocked: true,
  mood          : "Rich Spiced Oud",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Rich",
    "Warm",
    "Sophisticated",
    "Sensual",
    "Elegant",
    "Mysterious",
  ],
  occasions     : ["Date Night", "Evening", "Weekend", "Office"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Spiced Oud Luxury", "Oriental Warmth", "Balanced Resin Statement"],
  recommendedFor: [
    "Those who appreciate oud's depth and want it sweetened by dates, caramel, and vanilla rather than animalic or harsh",
    "Evening and weekend wearers seeking a signature that balances spice, resin, and dessert-like warmth for intimate settings",
    "Fragrance collectors building an oud wardrobe who value accessible luxury and balanced projection over aggressive sillage",
    "Anyone drawn to oriental woody scents who prefer a composed, wearable interpretation over raw or austere oud expressions",
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
  subtitle      : "Spiced Oud Reverie",
  description   : "Saffron and cinnamon ignite immediately, a warm spice that settles into the deep resin of oud and myrrh. Dates and caramel add a dessert-like richness, while leather and tonka bean ground the composition in sensual depth—a fragrance that feels both ancient and indulgent.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "what-makes-a-signature-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "oud",
    "woody",
    "oriental",
    "spice",
    "vanilla",
    "amber",
    "leather",
    "signature-scent",
    "autumn",
    "unisex",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],

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
    alternatives:     ["oud-mood-inspired", "oud-ispahan-inspired", "arabians-tonka-inspired"],
    wardrobePartners: ["sauvage-elixir-inspired", "godolphin-inspired"],
  },
};
