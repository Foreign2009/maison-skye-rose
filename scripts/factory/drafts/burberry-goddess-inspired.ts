// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — burberry-goddess-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-07-13T18:29:30.272Z
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

export const burberryGoddessInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "burberry-goddess-inspired",
  slug          : "burberry-goddess-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Burberry Goddess Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Vanilla", "Floral"],
  scentCharacter: "Rich & Long Wearing",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Vanilla Floral",
  season        : "All Season",
  notes: {
    top:   ["Bergamot", "Vanilla", "Pink Pepper"],
    heart: ["Lavender", "Rose Absolute", "Iris Root"],
    base:  ["Cacao", "Sandalwood", "Vanilla Musk"],
  },
  mood          : "Elegant vanilla luxury.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Elegant",
    "Luxury",
    "Sophisticated",
    "Warm",
    "Feminine",
    "Refined",
  ],
  occasions     : [
    "Daily Wear",
    "Office",
    "Date Night",
    "Evening",
    "Weekend",
  ],
  seasons       : ["Spring", "Summer", "Autumn", "Winter"],
  signatureStyle: ["Elegant Vanilla Floral", "Refined Luxury", "Soft Femininity"],
  recommendedFor: [
    "Women seeking a refined daily signature that bridges professional polish and intimate femininity.",
    "Those who love rose and vanilla but prefer elegance over sweetness, with depth that lasts all day.",
    "Anyone building a luxury fragrance wardrobe who wants one versatile scent for work, weekend, and evening.",
    "Fragrance lovers drawn to soft florals with unexpected warmth—cacao and sandalwood add richness without heaviness.",
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
  subtitle      : "Soft Elegance",
  description   : "Bergamot and pink pepper open with a whisper of vanilla, then rose absolute settles into the heart with lavender and iris—a floral composition that feels both intimate and refined. Cacao and sandalwood ground the fragrance, while vanilla musk creates a second skin that lingers without demanding attention.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "what-makes-a-signature-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "vanilla",
    "floral",
    "rose",
    "lavender",
    "iris",
    "cacao",
    "sandalwood",
    "elegant",
    "luxury",
    "all-season",
    "signature-scent",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 4,
  freshness     : 3,
  warmth        : 4,
  intensity     : 3,
  versatility   : 5,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["delina-inspired"],
    wardrobePartners: ["sauvage-inspired"],
  },
};
