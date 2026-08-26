// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — creed-delphinus-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-26T18:03:50.125Z
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

export const creedDelphinusInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "creed-delphinus-inspired",
  slug          : "creed-delphinus-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Creed Delphinus Inspired",
  collection    : "Elite",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "unisex",
  family        : ["Floral"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Oriental Floral",
  season        : "Autumn",
  notes: {
    top:   ["Almond", "Incense", "Black Pepper", "Pink Pepper"],
    heart: ["Orris", "Heliotrope", "Orchid"],
    base:  [
      "Bourbon Vanilla",
      "Tonka Bean",
      "Leather",
      "Amberwood",
      "Patchouli",
    ],
  },
  notesEvidenceLocked: true,
  mood          : "Warm Spiced Oriental",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Warm",
    "Sensual",
    "Sophisticated",
    "Magnetic",
    "Mysterious",
  ],
  occasions     : ["Office", "Date Night", "Evening", "Weekend"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Warm Spiced Oriental", "Balanced Intimacy", "Modern Baroque"],
  recommendedFor: [
    "Anyone seeking a warm, spiced Oriental that bridges professional polish and intimate evening wear",
    "Those who love creamy almond and vanilla but want depth from leather and incense rather than sweetness alone",
    "Women and men drawn to powdered florals with sensual edge—orchid and heliotrope grounded in patchouli and tonka",
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
  subtitle      : "Warm Spiced Intimacy",
  description   : "Black pepper and incense spark against almond's creamy warmth, then settle into a heart of orris and heliotrope—sensual, softly powdered. Bourbon vanilla and tonka bean deepen into leather and patchouli, creating an oriental that feels both refined and darkly intimate.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "oriental-floral",
    "almond",
    "vanilla",
    "tonka",
    "orchid",
    "heliotrope",
    "patchouli",
    "leather",
    "signature-scent",
    "unisex",
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
    alternatives:     ["baccarat-rouge-540-inspired", "oud-mood-inspired"],
    wardrobePartners: ["spicebomb-extreme-inspired", "hypnotic-poison-inspired"],
  },
};
