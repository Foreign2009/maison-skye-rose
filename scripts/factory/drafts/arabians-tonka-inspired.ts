// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — arabians-tonka-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-07-13T18:28:40.449Z
// Factory version:   0.5.0
// Prompt versions:   CompositionProducer@1.0.0  EditorialProducer@1.0.0  RelationshipProducer@1.0.0  EducationProducer@1.0.0  DiscoveryProducer@1.0.0
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

export const arabiansTonkaInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "arabians-tonka-inspired",
  slug          : "arabians-tonka-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Arabians Tonka Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Amber", "Oud"],
  scentCharacter: "Deep & Intense",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Oud Amber",
  season        : "Winter",
  notes: {
    top:   ["Tonka Bean", "Cardamom", "Black Pepper"],
    heart: ["Oud", "Rose Absolute", "Amber Resin"],
    base:  ["Vanilla Bourbon", "Sandalwood", "Musk Ambroxan"],
  },
  mood          : "Dark and powerful.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Powerful",
    "Mysterious",
    "Warm",
    "Intense",
    "Sophisticated",
    "Sensual",
  ],
  occasions     : ["Date Night", "Evening", "Formal", "Weekend"],
  seasons       : ["Winter", "Autumn"],
  signatureStyle: ["Middle Eastern Luxury", "Dark Amber Ritual", "Spiced Oriental"],
  recommendedFor: [
    "Men who want a dark, ritualistic fragrance that commands attention in evening and intimate settings.",
    "Those seeking authentic oud depth without compromising on wearability or modern appeal.",
    "Anyone drawn to warm spice, vanilla, and amber who craves intensity over freshness.",
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
  subtitle      : "Dark Amber Ritual",
  description   : "Black pepper and tonka bean ignite against deep oud and rose absolute, building into a dark amber resin that unfolds like aged leather and incense. Vanilla bourbon and sandalwood anchor the base with a sensual warmth that lingers on skin, unapologetic and hypnotic.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "how-to-wear-fragrance"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "oud",
    "amber",
    "tonka-bean",
    "oriental",
    "spicy",
    "warm",
    "vanilla",
    "sandalwood",
    "date-night",
    "winter",
    "layering",
    "masculine",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 3,
  freshness     : 1,
  warmth        : 4,
  intensity     : 4,
  versatility   : 2,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["oud-wood-inspired", "naxos-inspired"],
    wardrobePartners: ["sauvage-inspired"],
  },
};
