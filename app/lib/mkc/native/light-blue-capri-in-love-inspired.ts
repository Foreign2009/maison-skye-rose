// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — light-blue-capri-in-love-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-09-07T18:27:11.289Z
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

export const lightBlueCapriInLoveInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "light-blue-capri-in-love-inspired",
  slug          : "light-blue-capri-in-love-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Light Blue Capri In Love Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Floral", "Fruity"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral Fruity",
  season        : "Summer",
  notes: {
    top:   ["Jasmine Tea"],
    heart: ["Apple"],
    base:  ["Longoza"],
  },
  notesEvidenceLocked: true,
  mood          : "Fresh Floral Summer",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Fresh",
    "Luminous",
    "Feminine",
    "Bright",
    "Elegant",
    "Warm",
  ],
  occasions     : [
    "Daily Wear",
    "Vacation",
    "Summer Days",
    "Weekend",
    "Casual",
  ],
  seasons       : ["Summer"],
  signatureStyle: ["Luminous Floral", "Mediterranean Summer", "Balanced Signature"],
  recommendedFor: [
    "Women seeking a luminous daily signature that captures the essence of sun-drenched Mediterranean summers",
    "Those who love fresh florals with fruit-forward brightness and want something both approachable and sophisticated",
    "Anyone looking for a balanced fragrance that transitions seamlessly from beach days to casual evenings without heaviness",
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
  subtitle      : "Luminous Floral",
  description   : "Jasmine tea opens into a sun-bright apple heart, creating a floral composition that feels both luminous and intimate. The fragrance settles into a warm floral base that grounds its airy top notes without diminishing their clarity.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "floral",
    "fruity",
    "jasmine",
    "apple",
    "summer",
    "signature",
    "balanced",
    "daily-wear",
    "vacation",
    "layering",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 3,
  warmth        : 2,
  intensity     : 2,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["delina-inspired", "mon-paris-inspired", "chance-eau-fraiche-inspired"],
    wardrobePartners: ["light-blue-inspired"],
  },
};
