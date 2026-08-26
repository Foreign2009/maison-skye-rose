// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — cherry-in-the-air-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-26T18:07:13.113Z
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

export const cherryInTheAirInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "cherry-in-the-air-inspired",
  slug          : "cherry-in-the-air-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Cherry In The Air Inspired",
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
    top:   ["Sour Cherry", "Raspberry", "Daim", "Mandarin Orange"],
    heart: ["Marshmallow", "Vanilla", "Gardenia", "Orchid"],
    base:  ["White Suede", "Sandalwood", "Musk", "Oak"],
  },
  notesEvidenceLocked: true,
  mood          : "Sweet Fruity Floral",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Fresh",
    "Playful",
    "Feminine",
    "Warm",
    "Elegant",
    "Soft",
  ],
  occasions     : ["Daily Wear", "Vacation", "Weekend", "Casual"],
  seasons       : ["Summer"],
  signatureStyle: ["Fruity Floral Elegance", "Summer Signature", "Balanced Brightness"],
  recommendedFor: [
    "Women seeking a fruity floral that feels fresh and approachable without being overly sweet or heavy.",
    "Those who love the brightness of tart cherry and raspberry but want it softened by creamy marshmallow and silk.",
    "Fragrance lovers who want a signature summer scent that transitions seamlessly from casual daytime to evening leisure.",
    "Anyone drawn to balanced compositions where fruit, florals, and warm base notes feel equally important and harmonious.",
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
  subtitle      : "Fruit & Silk",
  description   : "Tart cherry and raspberry open with candied brightness, then dissolve into a marshmallow-soft heart of gardenia and orchid. White suede and sandalwood anchor the composition with quiet warmth, letting the floral sweetness breathe.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "occasions-and-style", "the-note-pyramid"],
  educationTags : [
    "floral",
    "fruity",
    "cherry",
    "raspberry",
    "marshmallow",
    "gardenia",
    "orchid",
    "summer",
    "signature",
    "balanced",
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
    alternatives:     ["delina-inspired", "mon-paris-inspired", "very-good-girl-inspired"],
    wardrobePartners: ["love-don't-be-shy-inspired"],
  },
};
