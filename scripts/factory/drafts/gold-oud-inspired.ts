// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — gold-oud-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-19T18:06:53.065Z
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

export const goldOudInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "gold-oud-inspired",
  slug          : "gold-oud-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Gold Oud Inspired",
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
  season        : "Winter",
  notes: {
    top:   [],
    heart: ["Rose", "Agarwood (Oud)", "Guaiac Wood", "Saffron"],
    base:  [],
  },
  notesEvidenceLocked: true,
  mood          : "Rich Dark Oud",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Mysterious",
    "Sophisticated",
    "Warm",
    "Sensual",
    "Mature",
    "Magnetic",
  ],
  occasions     : ["Date Night", "Evening", "Formal", "Weekend"],
  seasons       : ["Winter", "Autumn"],
  signatureStyle: ["Dark Oud Sophistication", "Balanced Oriental Woody", "Winter Luxury Signature"],
  recommendedFor: [
    "Those seeking a sophisticated oud fragrance that balances dark woods with floral restraint for evening wear and special occasions",
    "Men and women drawn to rich, resinous scents that evoke luxury without overwhelming sweetness",
    "Fragrance enthusiasts who appreciate the complexity of rose and saffron tempering oud's animalic character into wearable elegance",
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
  subtitle      : "Burnished Darkness",
  description   : "A dark, resinous composition of rose and agarwood, saffron and guaiac wood—richly complex, with an animalic depth held in balance by rose's quiet warmth. Dense in character and deliberate in mood, this is oud at its most considered.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "what-makes-a-signature-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "oud",
    "woody",
    "oriental",
    "rose",
    "saffron",
    "guaiac-wood",
    "balanced",
    "winter",
    "signature",
    "date-night",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "what-makes-a-signature-scent"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 2,
  warmth        : 3,
  intensity     : 4,
  versatility   : 2,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["oud-mood-inspired", "rose-oud-inspired"],
    wardrobePartners: ["ombre-nomade-inspired"],
  },
};
