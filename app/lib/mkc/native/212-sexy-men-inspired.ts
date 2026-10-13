// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — 212-sexy-men-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-10-13T20:19:06.709Z
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

export const _212SexyMenInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "212-sexy-men-inspired",
  slug          : "212-sexy-men-inspired",
  brand         : "Maison Skye & Rose",
  name          : "212 Sexy Men Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Amber", "Spicy"],
  scentCharacter: "Rich & Full-Bodied",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Amber Spicy",
  season        : "Autumn",
  notes: {
    top:   ["Mandarin Orange", "Bergamot"],
    heart: ["Cardamom", "Black Pepper"],
    base:  ["Sandalwood", "Vanilla Bourbon"],
    // Evidence-locked to carolinaherrera.com (212 Men Sexy EDT, "For: Him"): Top "Mandarin Orange & Bergamot";
    // Heart "Cardamom & Black Pepper"; Bottom "Sandalwood, Vanilla Bourbon"; family "AMBERY Spicy".
    // PYRAMID_SECONDARY_SUPPORTED. Reference notes only — not Maison formulation facts. See wave-9-source-evidence.json (revision 10).
  },
  notesEvidenceLocked: true,
  mood          : "Sensual Warm Confident",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Confident",
    "Sensual",
    "Warm",
    "Sophisticated",
    "Magnetic",
  ],
  occasions     : ["Office", "Date Night", "Evening", "Weekend"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Amber Spice", "Sensual Confidence", "Warm Masculine"],
  recommendedFor: [
    "Men seeking a sensual, spiced signature for evenings and cooler days.",
    "Those who enjoy cardamom and black pepper softened by sandalwood and vanilla.",
    "Anyone drawn to amber and cardamom who prefers a warm, comfortable character.",
    "Men building a collection beyond fresh fragrances, exploring the depth of amber and oriental warmth.",
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
  subtitle      : "Amber Spice",
  description   : "Mandarin and bergamot ignite with cardamom and black pepper, a spiced warmth that feels both intimate and assured. Sandalwood and vanilla bourbon settle into a soft, sensual base.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "choosing-your-season-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "amber",
    "spicy",
    "cardamom",
    "sandalwood",
    "vanilla",
    "warm",
    "sensual",
    "office",
    "date-night",
    "autumn",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Scores derived by knowledgeAdapter.deriveMetrics(profile="Amber Spicy", season="Autumn").
  // Heuristic approximations; no calibration producer in pipeline.
  sweetness     : 3,
  freshness     : 2,
  warmth        : 4,
  intensity     : 3,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // All pairings cleared pending promotion-time verification (Wave 9 policy).
  // Factory RelationshipProducer suggestions are recorded unverified in
  // catalogue-expansion-ledger.json → pending_relationship_proposals (batch4). Reciprocity
  // would require edits to native counterpart records; none are activated here.
  relationships: {
    alternatives:     [],
    wardrobePartners: [],
  },
};
