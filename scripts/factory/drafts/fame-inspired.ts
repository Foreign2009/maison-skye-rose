// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — fame-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-19T18:34:14.655Z
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

export const fameInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "fame-inspired",
  slug          : "fame-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Fame Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Floral", "Woody", "Musk"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral Woody Musk",
  season        : "Summer",
  notes: {
    top:   ["Mango", "Bergamot"],
    heart: ["Jasmine", "Olibanum"],
    base:  ["Vanilla", "Sandalwood"],
  },
  notesEvidenceLocked: true,
  mood          : "Warm Floral",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Warm",
    "Luminous",
    "Sophisticated",
    "Romantic",
    "Elegant",
    "Confident",
  ],
  occasions     : [
    "Daily Wear",
    "Vacation",
    "Summer Days",
    "Weekend",
    "Date Night",
  ],
  seasons       : ["Summer"],
  signatureStyle: ["Luminous Floral Warmth", "Balanced Signature Elegance", "Modern Radiant Feminine"],
  recommendedFor: [
    "Women seeking a luminous, warm floral that feels both approachable and refined for everyday confidence",
    "Those who love jasmine-centered fragrances but want the softness of vanilla and sandalwood grounding the intensity",
    "Anyone looking for a summer signature that transitions effortlessly from day to evening without feeling heavy",
    "Fragrance collectors drawn to balanced compositions that blend fruity brightness with creamy woody warmth",
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
  subtitle      : "Luminous Warmth",
  description   : "Mango and bergamot open with sun-touched brightness before yielding to jasmine and olibanum—a floral heart that deepens into warmth. Vanilla and sandalwood settle into skin like radiant, amber-tinged silk.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-wear-fragrance"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "floral",
    "woody",
    "musk",
    "jasmine",
    "vanilla",
    "sandalwood",
    "bergamot",
    "mango",
    "summer",
    "signature",
    "balanced",
    "daily-wear",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-wear-fragrance"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 3,
  warmth        : 3,
  intensity     : 2,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["delina-inspired", "mon-paris-inspired", "chance-eau-tendre-inspired"],
    wardrobePartners: ["spicebomb-extreme-inspired"],
  },
};
