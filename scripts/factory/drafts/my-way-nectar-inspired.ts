// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — my-way-nectar-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-22T15:14:49.111Z
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

export const myWayNectarInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "my-way-nectar-inspired",
  slug          : "my-way-nectar-inspired",
  brand         : "Maison Skye & Rose",
  name          : "My Way Nectar Inspired",
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
  season        : "Autumn",
  notes: {
    top:   ["Pear", "Bergamot", "Orange Blossom"],
    heart: ["Tuberose", "Jasmine", "Violet Leaf"],
    base:  ["White Musk", "Bourbon Vanilla", "Cedarwood"],
  },
  notesEvidenceLocked: true,
  mood          : "Warm Fruity Floral",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Warm",
    "Elegant",
    "Sensual",
    "Sophisticated",
    "Luminous",
    "Intimate",
  ],
  occasions     : ["Daily Wear", "Office", "Date Night", "Evening"],
  seasons       : ["Autumn", "Spring"],
  signatureStyle: ["Creamy Floral Signature", "Warm Fruity Elegance", "Balanced Luxury"],
  recommendedFor: [
    "Women seeking a warm, creamy floral that transitions seamlessly from professional settings to intimate evenings.",
    "Those who love tuberose and jasmine but prefer them softened by fruit and vanilla rather than sharp or indolic.",
    "Anyone building a signature collection who wants a balanced floral that feels both luxurious and wearable year-round.",
    "Women drawn to gourmand florals who appreciate depth, restraint, and the sensuality of white musk over heavy sweetness.",
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
  subtitle      : "Warm Floral Depth",
  description   : "Pear and bergamot open with a whisper of orange blossom, then the heart unfolds into creamy tuberose and jasmine—a floral richness that feels both intimate and luminous. White musk and bourbon vanilla settle into a warm, skin-like base, grounded by cedarwood's gentle structure.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "what-makes-a-signature-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "floral",
    "fruity",
    "tuberose",
    "jasmine",
    "pear",
    "balanced",
    "signature",
    "layering",
    "office",
    "date-night",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 3,
  warmth        : 2,
  intensity     : 3,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["delina-inspired", "chance-eau-tendre-inspired", "mon-paris-inspired"],
    wardrobePartners: ["my-way-inspired", "alien-inspired"],
  },
};
