// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — rose-n'-roses-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-16T18:06:42.053Z
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

export const roseNRosesInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "rose-n'-roses-inspired",
  slug          : "rose-n'-roses-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Rose N' Roses Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Floral"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral",
  season        : "Spring",
  notes: {
    top:   ["Italian Mandarin", "Bergamot", "Geranium"],
    heart: ["Grasse Rose", "Damask Rose"],
    base:  ["White Musk"],
  },
  notesEvidenceLocked: true,
  mood          : "Romantic Floral Fresh",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Romantic",
    "Fresh",
    "Elegant",
    "Bright",
    "Sophisticated",
  ],
  occasions     : ["Daily Wear", "Office", "Date Night", "Wedding"],
  seasons       : ["Spring", "Summer"],
  signatureStyle: ["Romantic Floral Fresh", "Radiant Rose Signature"],
  recommendedFor: [
    "Women seeking a romantic yet fresh signature that transitions seamlessly from day to evening",
    "Those who love rose fragrances but want brightness and clarity over heavy sweetness",
    "Anyone looking for an elegant floral that feels both timeless and modern",
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
  subtitle      : "Radiant Rose",
  description   : "Citrus brightness—Italian mandarin and bergamot—gives way to a heart of Grasse and Damask rose, layered with an almost whispered sensuality. White musk anchors the composition, allowing the roses to breathe rather than dominate. The effect is romantic without sentiment, fresh without artifice.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "choosing-your-season-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "floral",
    "rose",
    "damask-rose",
    "grasse-rose",
    "bergamot",
    "mandarin",
    "white-musk",
    "romantic",
    "signature",
    "spring",
    "wedding",
    "daily-wear",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "choosing-your-season-scent"],

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
    alternatives:     ["miss-dior-inspired", "coco-mademoiselle-inspired", "mon-paris-inspired"],
    wardrobePartners: ["delina-inspired", "black-opium-inspired"],
  },
};
