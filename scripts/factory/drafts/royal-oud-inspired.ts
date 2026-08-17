// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — royal-oud-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-16T16:47:55.961Z
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

export const royalOudInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "royal-oud-inspired",
  slug          : "royal-oud-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Royal Oud Inspired",
  collection    : "Elite",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "unisex",
  family        : ["Aromatic", "Woody"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Woody Aromatic",
  season        : "Autumn",
  notes: {
    top:   ["Pink Pepper", "Lemon", "Sicilian Bergamot"],
    heart: ["Cedar", "Angelica", "Galbanum"],
    base:  ["Sandalwood", "Agarwood (Oud)", "Musk"],
  },
  mood          : "Woody Sophisticated",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Sophisticated",
    "Elegant",
    "Warm",
    "Balanced",
    "Mysterious",
  ],
  occasions     : ["Office", "Date Night", "Evening", "Casual"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Woody Sophistication", "Unisex Signature", "Aromatic Elegance"],
  recommendedFor: [
    "Those who appreciate woody sophistication and want a signature fragrance that transcends gender conventions.",
    "Anyone seeking an autumn-appropriate fragrance with moderate projection suitable for professional and intimate settings.",
    "Fragrance enthusiasts drawn to oud and natural resins who prefer balanced, understated elegance over dominant sweetness.",
    "Men and women building a refined collection with pieces that layer beautifully alongside amber and rose compositions.",
  ],

  // ── Merchandising ───────────────────────────────────────────────────────────
  prices: {
    "5ml":  60,
    "10ml": 100,
    "30ml": 250,
  },
  images: {
    "5ml":  "/images/blue-5ml.png",
    "10ml": "/images/blue-10ml.png",
    "30ml": "/images/glass-blue-30ml.png",
  },
  bestSeller    : false,
  newArrival    : false,

  // ── Education ───────────────────────────────────────────────────────────────
  subtitle      : "Regal Cedar",
  description   : "Pink pepper and bergamot spark against a cool galbanum heart, yielding swiftly to cedar and the resinous depth of agarwood. Sandalwood and musk anchor the composition in quiet, woody elegance—a fragrance that speaks in measured tones.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "what-makes-a-signature-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "oud",
    "woody",
    "aromatic",
    "sandalwood",
    "cedar",
    "sophisticated",
    "signature",
    "unisex",
    "autumn",
    "layering",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

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
    alternatives:     ["oud-wood-inspired", "ombre-nomade-inspired"],
    wardrobePartners: ["baccarat-rouge-540-inspired"],
  },
};
