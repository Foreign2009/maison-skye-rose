// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — black-opium-over-red-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-16T16:51:39.209Z
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

export const blackOpiumOverRedInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "black-opium-over-red-inspired",
  slug          : "black-opium-over-red-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Black Opium Over Red Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Gourmand"],
  scentCharacter: "Rich & Full-Bodied",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Oriental Gourmand",
  season        : "Autumn",
  notes: {
    top:   ["Cherry", "Green Mandarin"],
    heart: ["Jasmine", "Orange Blossom", "Black Tea"],
    base:  ["Madagascar Vanilla", "Coffee", "Indonesian Patchouli Leaf"],
  },
  notesEvidenceLocked: true,
  mood          : "Gourmand Sweet Dark",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Mysterious",
    "Sensual",
    "Sophisticated",
    "Warm",
    "Luxurious",
    "Edgy",
  ],
  occasions     : ["Office", "Date Night", "Evening", "Weekend"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Dark Gourmand Elegance", "Oriental Sweetness", "Velvet Intensity"],
  recommendedFor: [
    "Women seeking a signature autumn fragrance that balances gourmand sweetness with dark floral sophistication",
    "Those who love rich vanilla and coffee notes but want depth beyond typical dessert fragrances",
    "Anyone drawn to mysterious, sensual scents that work equally well for intimate evenings and confident office presence",
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
  subtitle      : "Velvet Darkness",
  description   : "Cherry and green mandarin open into a dark floral heart of jasmine and black tea, grounding into Madagascar vanilla, coffee, and patchouli. A gourmand oriental that moves between brightness and shadow, sweetness and smoke. Autumn made fragrant.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "choosing-your-season-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "gourmand",
    "oriental",
    "vanilla",
    "coffee",
    "patchouli",
    "jasmine",
    "autumn",
    "rich",
    "full-bodied",
    "date-night",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 4,
  freshness     : 2,
  warmth        : 2,
  intensity     : 3,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["black-opium-inspired", "hypnotic-poison-inspired", "love-don't-be-shy-inspired"],
    wardrobePartners: ["alien-inspired", "libre-inspired"],
  },
};
