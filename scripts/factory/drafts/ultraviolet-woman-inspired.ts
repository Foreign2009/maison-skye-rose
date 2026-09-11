// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — ultraviolet-woman-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-09-11T18:50:42.466Z
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

export const ultravioletWomanInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "ultraviolet-woman-inspired",
  slug          : "ultraviolet-woman-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Ultraviolet Woman Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Powdery", "Floral", "Spicy"],
  scentCharacter: "Rich & Full-Bodied",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral Powdery Spicy",
  season        : "Autumn",
  notes: {
    top:   [
      "Apricot",
      "Coriander",
      "Orange Pepper",
      "Red Pepper",
      "Fresh Almond",
      "Rosewood",
    ],
    heart: ["Violet", "Japanese Osmanthus", "Rose", "Jasmine"],
    base:  ["Vanilla", "Amber", "Patchouli", "Cedar"],
  },
  notesEvidenceLocked: true,
  mood          : "Bold Sensual Mysterious",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Sensual",
    "Mysterious",
    "Bold",
    "Sophisticated",
    "Warm",
  ],
  occasions     : ["Date Night", "Evening", "Formal", "Weekend"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Sensual Powdery Spice", "Modern Mysterious Icon", "Evening Elegance"],
  recommendedFor: [
    "Women who want a signature fragrance that feels bold, sensual, and mysteriously elegant for evening and intimate occasions",
    "Those seeking a powdery floral with unexpected spice—a fragrance that commands attention without being sweet or conventional",
    "Anyone drawn to violet and rose but craving depth, warmth, and amber-patchouli sophistication over delicate florals",
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
  subtitle      : "Velvet Spice",
  description   : "Apricot and coriander ignite a spiced warmth that gives way to violet and rose—petals threaded with jasmine's honeyed depth. A base of amber and patchouli anchors the composition in sensual mystery, while cedar adds restraint to what could easily overwhelm.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "choosing-your-season-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "powdery-floral",
    "spicy",
    "violet",
    "rose",
    "amber",
    "vanilla",
    "autumn",
    "sensual",
    "bold",
    "office-to-evening",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 3,
  warmth        : 4,
  intensity     : 3,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["valaya-exclusif-inspired", "twilly-d'hermes-inspired"],
    wardrobePartners: ["coco-mademoiselle-inspired"],
  },
};
