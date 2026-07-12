// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — miss-dior-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-07-12T20:59:48.962Z
// Factory version:   0.3.0
// Prompt versions:   CompositionProducer@1.0.0  EditorialProducer@1.0.0  RelationshipProducer@1.0.0
// Validation status: FAIL  [1 error(s), 3 warning(s)]
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

export const missDiorInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "miss-dior-inspired",
  slug          : "miss-dior-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Miss Dior Inspired",
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
    top:   ["Bergamot", "Rose Absolute", "Green Mandarin"],
    heart: ["Peony", "Jasmine Sambac", "Iris Root"],
    base:  ["Vanilla Bourbon", "Musk Ambrettolide", "Cedarwood"],
  },
  mood          : "Elegant feminine florals with playful luxury.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : ["Feminine", "Elegant", "Playful", "Luxury"],
  occasions     : ["Daily Wear", "Wedding"],
  seasons       : ["Spring"],
  signatureStyle: ["Soft Luxury"],
  recommendedFor: [],  // FACTORY_ERROR: RECOMMENDED_FOR_MIN — minimum 2 recommendedFor values required (found 0)

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
  bestSeller    : true,
  newArrival    : false,

  // ── Education ───────────────────────────────────────────────────────────────
  subtitle      : "Radiant Femininity",
  description   : "Bergamot and rose absolute open with citrus brightness, immediately feminine and radiant. The heart layers peony and jasmine sambac into a luminous floral core, grounded by iris root's subtle powder. Vanilla bourbon and musk anchor the composition with warmth and skin-like sensuality.",
  // academyArticleIds: (not set — will be linked in P4)  // FACTORY_WARN: ACADEMY_ARTICLES_NOT_LINKED — no academy articles linked — academy article boost (+50) will not apply

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 3,
  warmth        : 2,
  intensity     : 2,
  versatility   : 3,
  popularity    : 10,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["delina-inspired"],
    wardrobePartners: ["sauvage-inspired", "bleu-de-chanel-inspired"],
  },
};
