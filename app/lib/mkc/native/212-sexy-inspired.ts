// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — 212-sexy-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-10-12T19:03:23.938Z
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

export const _212SexyInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "212-sexy-inspired",
  slug          : "212-sexy-inspired",
  brand         : "Maison Skye & Rose",
  name          : "212 Sexy Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Gourmand", "Floral", "Amber"],
  scentCharacter: "Rich & Full-Bodied",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Amber Gourmand Floral",
  season        : "Autumn",
  notes: {
    top:   ["Mandarin", "Pink Pepper"],
    heart: ["Gardenia", "Cotton Candy Accord"],
    base:  ["Sandalwood", "Vanilla"],
    // Evidence-locked to carolinaherrera.com (212 Sexy EDP, women): Top "Mandarin & Pink Pepper";
    // Heart "Gardenia & Cotton Candy Accord"; Base "Sandalwood & Vanilla"; classification "AMBERY Gourmand Floral".
    // PYRAMID_SECONDARY_SUPPORTED. See wave-9-source-evidence.json (revision 9).
  },
  notesEvidenceLocked: true,
  mood          : "Sensual Playful Warm",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Sensual",
    "Playful",
    "Warm",
    "Confident",
    "Romantic",
    "Soft",
  ],
  occasions     : ["Date Night", "Evening", "Weekend", "Casual"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Warm Sensual Gourmand", "Playful Amber Floral", "Modern Seduction"],
  recommendedFor: [
    "Women seeking a warm, gourmand fragrance that balances playful sweetness with genuine sensuality for date nights and intimate occasions",
    "Those who love vanilla and amber warmth with a floral, gardenia-led heart",
    "Anyone looking for an autumn signature that feels both approachable and alluring",
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
  subtitle      : "Warm Seduction",
  description   : "Pink pepper and mandarin ignite a playful opening, giving way to gardenia softened by a whisper of cotton candy. Sandalwood and vanilla settle into a warm, sensual base that feels intimate and quietly confident.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "choosing-your-season-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "gourmand",
    "floral",
    "amber",
    "vanilla",
    "gardenia",
    "mandarin",
    "sensual",
    "warm",
    "autumn",
    "date-night",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Scores derived by knowledgeAdapter.deriveMetrics(profile="Amber Gourmand Floral", season="Autumn").
  // Heuristic approximations; no calibration producer in pipeline.
  sweetness     : 4,
  freshness     : 3,
  warmth        : 4,
  intensity     : 3,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // All pairings cleared pending promotion-time verification (Wave 9 policy).
  // Factory RelationshipProducer suggestions are recorded unverified in
  // catalogue-expansion-ledger.json → pending_relationship_proposals (batch3). Reciprocity
  // would require edits to native counterpart records; none are activated here.
  relationships: {
    alternatives:     [],
    wardrobePartners: [],
  },
};
