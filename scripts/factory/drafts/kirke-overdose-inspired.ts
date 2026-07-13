// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — kirke-overdose-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-07-13T18:31:30.576Z
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

export const kirkeOverdoseInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "kirke-overdose-inspired",
  slug          : "kirke-overdose-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Kirke Overdose Inspired",
  collection    : "Elite",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "unisex",
  family        : ["Fruity", "Musk"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Fruity Musk",
  season        : "Summer",
  notes: {
    top:   ["Passionfruit", "Grapefruit", "Pink Pepper"],
    heart: ["Peach", "Tuberose Absolute", "Vanilla Orchid"],
    base:  ["Musk", "Amber Gris", "Sandalwood"],
  },
  mood          : "Explosive fruity luxury.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Explosive",
    "Sensual",
    "Luxury",
    "Confident",
    "Warm",
    "Magnetic",
  ],
  occasions     : ["Daily Wear", "Vacation", "Weekend", "Evening"],
  seasons       : ["Summer"],
  signatureStyle: ["Fruity Luxury", "Sensual Beast", "Summer Statement"],
  recommendedFor: [
    "Anyone seeking a bold fruity statement that balances sweetness with muscular depth for summer adventures.",
    "Unisex fragrance lovers who want luxury that feels explosive and sensual rather than delicate or floral.",
    "Those who crave a signature scent that transforms throughout the day — bright citrus top, creamy peach heart, powerful musk finish.",
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
  newArrival    : true,

  // ── Education ───────────────────────────────────────────────────────────────
  subtitle      : "Velvet Frenzy",
  description   : "Passionfruit and grapefruit detonate against pink pepper, then dissolve into creamy peach and tuberose that cling to skin like silk. A muscular amber and sandalwood base transforms the sweetness into something feral and hypnotic—luxury that refuses to whisper.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "fruity-musk",
    "passionfruit",
    "grapefruit",
    "peach",
    "tuberose",
    "musk",
    "sandalwood",
    "summer",
    "balanced",
    "signature",
    "unisex",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 2,
  warmth        : 2,
  intensity     : 2,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["aventus-inspired", "god-of-fire-inspired"],
    wardrobePartners: ["baccarat-rouge-540-inspired"],
  },
};
