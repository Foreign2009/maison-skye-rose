// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — kouros-silver-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-09-07T18:26:20.287Z
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

import type { FragranceKnowledge } from "../types";

export const kourosSilverInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "kouros-silver-inspired",
  slug          : "kouros-silver-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Kouros Silver Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Aromatic", "Fresh"],
  scentCharacter: "Fresh & Light",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Aromatic Fresh",
  season        : "Spring",
  notes: {
    top:   ["Apple"],
    heart: ["Sage"],
    base:  ["Amber", "Woody Notes"],
  },
  notesEvidenceLocked: true,
  mood          : "Fresh Aromatic Masculine",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Fresh",
    "Crisp",
    "Confident",
    "Bright",
    "Clean",
    "Sophisticated",
  ],
  occasions     : ["Daily Wear", "Office", "Weekend", "Casual"],
  seasons       : ["Spring", "Summer"],
  signatureStyle: ["Aromatic Fresh", "Crystalline Brightness", "Botanical Masculine"],
  recommendedFor: [
    "Men seeking a crisp, versatile fragrance that transitions seamlessly from office to weekend social occasions",
    "Those who appreciate aromatic freshness with botanical clarity rather than sweet or heavy base notes",
    "Anyone looking for a modern spring signature that feels both polished and effortlessly wearable",
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
  subtitle      : "Crystalline Freshness",
  description   : "Sharp green apple cuts through silvered sage, a botanical clarity that feels almost crystalline. Amber and soft woods anchor the composition, grounding the brightness without dimming it. This is fresh without apology—a fragrance that tastes like spring air.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "how-to-wear-fragrance"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "aromatic",
    "fresh",
    "apple",
    "sage",
    "amber",
    "woody",
    "crisp",
    "spring",
    "daily-wear",
    "versatile",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 1,
  freshness     : 5,
  warmth        : 1,
  intensity     : 2,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["y-inspired", "y-edp-inspired"],
    wardrobePartners: ["spicebomb-extreme-inspired"],
  },
};
