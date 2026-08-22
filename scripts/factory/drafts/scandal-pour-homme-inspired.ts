// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — scandal-pour-homme-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-22T18:52:38.562Z
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

export const scandalPourHommeInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "scandal-pour-homme-inspired",
  slug          : "scandal-pour-homme-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Scandal Pour Homme Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Woody"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Oriental Woody",
  season        : "Autumn",
  notes: {
    top:   ["Geranium"],
    heart: ["Tonka Bean"],
    base:  ["Sandalwood"],
  },
  notesEvidenceLocked: true,
  mood          : "Warm Woody Sensual",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Sensual",
    "Warm",
    "Sophisticated",
    "Confident",
    "Elegant",
    "Mysterious",
  ],
  occasions     : ["Office", "Date Night", "Evening", "Weekend"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Warm Woody Sensual", "Intimate Signature", "Autumn Statement"],
  recommendedFor: [
    "Men seeking a warm woody signature that commands attention without aggression—perfect for evening dates and intimate occasions.",
    "Those who appreciate creamy, sensual bases and want a fragrance that deepens with warmth and restraint.",
    "Anyone building a collection who needs a sophisticated autumn staple that bridges office professionalism and date night confidence.",
    "Men drawn to oriental woody compositions who prefer balanced warmth over heavy sweetness or spice-forward intensity.",
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
  newArrival    : false,

  // ── Education ───────────────────────────────────────────────────────────────
  subtitle      : "Warm Woody Sensual",
  description   : "Geranium's green spice opens into a creamy tonka bean heart that settles against warm sandalwood—a composition that feels both intimate and deliberate. The fragrance moves through warmth without softness, holding its ground with woody restraint and sensual depth.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "what-makes-a-signature-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "woody",
    "oriental",
    "sandalwood",
    "tonka-bean",
    "geranium",
    "sensual",
    "signature",
    "autumn",
    "office",
    "date-night",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 2,
  warmth        : 3,
  intensity     : 3,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["spicebomb-extreme-inspired", "tobacco-vanille-inspired"],
    wardrobePartners: ["aqua-di-gio-inspired", "sauvage-inspired"],
  },
};
