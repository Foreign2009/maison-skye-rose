// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — dkny-be-delicious-green-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-26T18:06:25.878Z
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

export const dknyBeDeliciousGreenInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "dkny-be-delicious-green-inspired",
  slug          : "dkny-be-delicious-green-inspired",
  brand         : "Maison Skye & Rose",
  name          : "DKNY Be Delicious Green Inspired",
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
  season        : "Spring",
  notes: {
    top:   ["Cucumber", "Grapefruit", "Magnolia"],
    heart: [
      "Green Apple",
      "Lily-of-the-Valley",
      "Tuberose",
      "Violet",
      "Rose",
    ],
    base:  ["Woodsy Notes", "Sandalwood", "Amber"],
  },
  notesEvidenceLocked: true,
  mood          : "Fresh Fruity Floral",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Fresh",
    "Bright",
    "Elegant",
    "Feminine",
    "Balanced",
    "Luminous",
  ],
  occasions     : [
    "Daily Wear",
    "Office",
    "Weekend",
    "Wedding",
    "Casual",
  ],
  seasons       : ["Spring", "Summer"],
  signatureStyle: ["Fresh Green Floral", "Modern Luminous", "Balanced Everyday Elegance"],
  recommendedFor: [
    "Women seeking a fresh, approachable floral that works from morning meetings to weekend brunch without feeling heavy",
    "Those who love the green-fruity opening of the original Be Delicious but want a softer, more traditionally feminine heart",
    "Anyone drawn to luminous spring florals with enough substance to feel like a true signature rather than a seasonal spritz",
    "Fragrance lovers building a balanced collection who need a daytime floral that bridges casual and polished moments",
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
  subtitle      : "Luminous Green Floral",
  description   : "A bright green floral that opens with cucumber and grapefruit before settling into a luminous heart of lily-of-the-valley and rose. Sandalwood and amber anchor the composition with quiet warmth, creating a fragrance that feels both crisp and softly sensual.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "floral",
    "fruity",
    "green-apple",
    "rose",
    "lily-of-the-valley",
    "balanced",
    "signature",
    "spring",
    "daily-wear",
    "wedding",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],

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
    alternatives:     ["delina-inspired", "mon-paris-inspired", "very-good-girl-inspired"],
    wardrobePartners: ["flowerbomb-inspired", "light-blue-inspired"],
  },
};
