// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — si-passione-red-musk-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-16T18:49:37.225Z
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

export const siPassioneRedMuskInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "si-passione-red-musk-inspired",
  slug          : "si-passione-red-musk-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Si Passione Red Musk Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Floral", "Musk"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral Musky",
  season        : "Spring",
  notes: {
    top:   ["Strawberry", "Red Musk"],
    heart: ["Rose", "Milk"],
    base:  ["Musk", "Vanilla"],
  },
  mood          : "Sensual Musky Sweet",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Sensual",
    "Warm",
    "Elegant",
    "Soft",
    "Romantic",
    "Intimate",
  ],
  occasions     : ["Daily Wear", "Date Night", "Wedding", "Evening"],
  seasons       : ["Spring", "Summer"],
  signatureStyle: ["Sensual Floral Signature", "Creamy Rose Musk", "Intimate Warmth"],
  recommendedFor: [
    "Women seeking a sensual signature that feels intimate and skin-close rather than loud or imposing",
    "Those who love creamy florals with warmth — rose and musk that embrace rather than announce",
    "Anyone looking for a spring fragrance that transitions seamlessly from daily wear to special occasions",
    "Fragrance lovers who want strawberry sweetness balanced by grown-up musk and vanilla depth",
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
  subtitle      : "Skin Warmth",
  description   : "Strawberry and red musk open with immediate warmth, a sweet and sensual entry that feels like bare skin. Rose and milk unfold at the heart, softening into a creamy floral that is both intimate and luminous. Musk and vanilla anchor the composition with a tender, skin-like base that feels like a second layer of yourself.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "occasions-and-style", "the-note-pyramid"],
  educationTags : [
    "floral",
    "rose",
    "musk",
    "strawberry",
    "vanilla",
    "sensual",
    "signature",
    "spring",
    "daily-wear",
    "wedding",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],

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
    alternatives:     ["blanche-bete-inspired", "mon-paris-inspired", "olympea-inspired", "narciso-rodriguez-for-her-inspired", "narciso-rouge-inspired"],
    wardrobePartners: ["baccarat-rouge-540-inspired"],
  },
};
