// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — ombre-leather-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-16T16:52:13.666Z
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

export const ombreLeatherInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "ombre-leather-inspired",
  slug          : "ombre-leather-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Ombre Leather Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Leather", "Woody"],
  scentCharacter: "Deep & Intense",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Leather Woody",
  season        : "Autumn",
  notes: {
    top:   ["Cardamom"],
    heart: ["Leather", "Jasmine Sambac"],
    base:  ["Amber", "Moss", "Patchouli"],
  },
  notesEvidenceLocked: true,
  mood          : "Dark Masculine",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Powerful",
    "Mysterious",
    "Sophisticated",
    "Bold",
    "Sensual",
    "Intense",
  ],
  occasions     : ["Office", "Date Night", "Evening", "Formal"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Dark Leather Intensity", "Sophisticated Masculine", "Evening Statement"],
  recommendedFor: [
    "Men who want a leather fragrance that commands attention without relying on sweetness or fresh citrus",
    "Those seeking a sophisticated evening signature that works equally well in boardroom or bedroom",
    "Anyone drawn to dark, animalic scents tempered by unexpected floral grace—leather with restraint",
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
  subtitle      : "Dark Leather Restraint",
  description   : "Cardamom opens with a sharp, almost smoky bite before leather takes center stage—dark, slightly animalic, tempered by a whisper of jasmine's white floral restraint. Amber and moss settle into the base, creating a skin scent that feels worn, lived-in, unmistakably masculine.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "how-to-wear-fragrance"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "leather",
    "woody",
    "amber",
    "patchouli",
    "cardamom",
    "moss",
    "masculine",
    "intense",
    "office",
    "date-night",
    "autumn",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 1,
  warmth        : 3,
  intensity     : 3,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["oud-wood-inspired", "ombre-nomade-inspired"],
    wardrobePartners: ["sauvage-inspired"],
  },
};
