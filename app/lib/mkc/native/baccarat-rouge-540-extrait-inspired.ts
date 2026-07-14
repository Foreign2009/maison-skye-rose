// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — baccarat-rouge-540-extrait-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-07-13T18:29:52.585Z
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

import type { FragranceKnowledge } from "../types";

export const baccaratRouge540ExtraitInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "baccarat-rouge-540-extrait-inspired",
  slug          : "baccarat-rouge-540-extrait-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Baccarat Rouge 540 Extrait Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Woody", "Amber"],
  scentCharacter: "Rich & Long Wearing",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Amber Woody",
  season        : "Winter",
  notes: {
    top:   ["Almond", "Pink Pepper", "Galbanum"],
    heart: ["Saffron", "Rose Absolute", "Oud"],
    base:  ["Ambergris", "Sandalwood", "Vanilla Absolute"],
  },
  mood          : "Deep and captivating.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Luxurious",
    "Mysterious",
    "Sensual",
    "Sophisticated",
    "Warm",
    "Powerful",
  ],
  occasions     : ["Date Night", "Evening", "Formal", "Weekend"],
  seasons       : ["Winter", "Autumn"],
  signatureStyle: ["Dark Luxury Floral", "Amber Woody Elegance", "Radiant Depth"],
  recommendedFor: [
    "Women seeking a signature fragrance that commands attention in intimate evening settings without relying on sweetness.",
    "Those who appreciate deep florals anchored by precious woods and amber — a sophisticated alternative to traditional rose fragrances.",
    "Anyone building a luxury collection who wants one winter fragrance that transitions seamlessly from date night to formal occasions.",
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
  subtitle      : "Radiant Depth",
  description   : "Opens with a sharp burst of almond and pink pepper that softens immediately into saffron and rose absolute—a dark floral that radiates warmth rather than sweetness. Oud and ambergris emerge as the fragrance settles, creating a resinous, almost tactile second skin that lingers between sandalwood and vanilla absolute, deep and utterly hypnotic.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "choosing-your-season-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "amber",
    "woody",
    "oud",
    "rose-absolute",
    "saffron",
    "sandalwood",
    "vanilla",
    "winter",
    "date-night",
    "layering",
    "long-wearing",
    "rich",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "choosing-your-season-scent"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 3,
  freshness     : 2,
  warmth        : 4,
  intensity     : 4,
  versatility   : 2,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["baccarat-rouge-540-inspired"],
    wardrobePartners: ["oud-wood-inspired", "delina-inspired"],
  },
};
