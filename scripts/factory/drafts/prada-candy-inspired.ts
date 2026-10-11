// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — prada-candy-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-10-11T19:36:42.220Z
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

export const pradaCandyInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "prada-candy-inspired",
  slug          : "prada-candy-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Prada Candy Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Gourmand", "Spicy"],
  scentCharacter: "Rich & Full-Bodied",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Gourmand Spicy",
  season        : "Winter",
  notes: {
    top:   ["White Musk"],
    heart: ["Benzoin"],
    base:  ["Caramel Accord"],
  },
  notesEvidenceLocked: true,
  mood          : "Playful Sensual Warm",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Sensual",
    "Warm",
    "Playful",
    "Sophisticated",
    "Magnetic",
  ],
  occasions     : ["Date Night", "Evening", "Winter Evenings", "Casual"],
  seasons       : ["Winter", "Autumn"],
  signatureStyle: ["Creamy Gourmand", "Sensual Warmth", "Playful Luxury"],
  recommendedFor: [
    "Women seeking a sensual winter signature that feels luxurious without pretension",
    "Anyone drawn to gourmand fragrances who wants creamy warmth over pure sweetness",
    "Those planning intimate evenings who prefer playful confidence to heavy florals",
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
  subtitle      : "Creamy Warmth",
  description   : "A gourmand embrace of warm caramel and creamy benzoin, softened by whispers of white musk. Playful and sensual, it settles into skin like a luxe second layer—sweet without artifice, spiced with an undercurrent of subtle warmth.",
  academyArticleIds: ["guide-to-fragrance-families", "choosing-your-season-scent", "how-to-layer-fragrances", "how-to-wear-fragrance"],
  academyCategories: ["fragrance-families", "occasions-and-style"],
  educationTags : [
    "gourmand",
    "spicy",
    "caramel",
    "benzoin",
    "musk",
    "warm",
    "sensual",
    "winter",
    "date-night",
    "playful",
  ],
  learningPath  : ["guide-to-fragrance-families", "choosing-your-season-scent", "how-to-wear-fragrance"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 4,
  freshness     : 2,
  warmth        : 4,
  intensity     : 4,
  versatility   : 2,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // All pairings cleared pending promotion-time verification (Wave 9 policy).
  // Factory RelationshipProducer suggestions are recorded unverified in
  // catalogue-expansion-ledger.json → pending_relationship_proposals (batch2). Reciprocity
  // would require edits to native counterpart records; none are activated here.
  relationships: {
    alternatives:     [],
    wardrobePartners: [],
  },
};
