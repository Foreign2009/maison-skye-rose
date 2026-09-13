// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — 24-faubourg-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-09-13T12:44:26.402Z
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

export const _24FaubourgInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "24-faubourg-inspired",
  slug          : "24-faubourg-inspired",
  brand         : "Maison Skye & Rose",
  name          : "24 Faubourg Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Floral", "Amber"],
  scentCharacter: "Rich & Full-Bodied",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral Amber",
  season        : "Spring",
  notes: {
    top:   [
      "Hyacinth",
      "Orange",
      "Peach",
      "Bergamot",
      "Ylang-Ylang",
    ],
    heart: [
      "Jasmine",
      "Orange Blossom",
      "Gardenia",
      "Black Elder",
      "Iris",
    ],
    base:  ["Sandalwood", "Amber", "Patchouli", "Vanilla"],
  },
  notesEvidenceLocked: true,
  mood          : "Luminous Warm Elegant",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Luminous",
    "Elegant",
    "Warm",
    "Sophisticated",
    "Refined",
    "Intimate",
  ],
  occasions     : [
    "Daily Wear",
    "Office",
    "Weekend",
    "Wedding",
    "Evening",
  ],
  seasons       : ["Spring", "Autumn"],
  signatureStyle: ["Sophisticated Floral Amber", "Luminous Elegance", "Creamy Warmth"],
  recommendedFor: [
    "Women seeking a sophisticated floral that radiates warmth without heavy sweetness—perfect for office, brunch, and transition seasons.",
    "Those who love jasmine and orange blossom but want creamy depth grounded in sandalwood and amber rather than bright citrus.",
    "Anyone building a signature collection who values elegance that works equally well for daily wear and special occasions.",
    "Women drawn to luminous, full-bodied florals that feel intimate and refined—a fragrance that whispers rather than shouts.",
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
  subtitle      : "Luminous Warmth",
  description   : "Hyacinth and peach open into a luminous heart of jasmine and orange blossom, their creamy warmth grounded by sandalwood and amber. A fragrance that feels both radiant and intimate—floral without sweetness, elegant without restraint.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "what-makes-a-signature-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "floral-amber",
    "jasmine",
    "orange-blossom",
    "gardenia",
    "sandalwood",
    "amber",
    "elegant",
    "warm",
    "luminous",
    "signature-scent",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 3,
  freshness     : 3,
  warmth        : 4,
  intensity     : 2,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["delina-inspired", "j-adore-inspired"],
    wardrobePartners: ["layton-inspired", "allure-homme-sport-inspired"],
  },
};
