// ═════════════════════════════════════════════════════════════════
// REVIEW DRAFT — this-is-her-inspired (Wave 9 Batch 5, W9-B5-P1B)
// ─────────────────────────────────────────────────────────────────
// Prepared:          2026-10-15 — hand-authored from inspected evidence (no factory AI generation)
// Status:            LOCAL REVIEW DRAFT — not promoted, not registered in app/lib/mkc/native
// Supplier:          LADIES-296 'Zadig & Voltaire / This is Her' (LADIES list, page 3)
// Founder review:    brand 100 ml page says "Eau de Toilette"; brand 50 ml page says "Eau de Parfum" (unreconciled)
// ─────────────────────────────────────────────────────────────────
// REVIEW CHECKLIST
//   □ Notes match the inspected tier-1 sequence (sparse tiers allowed: notesEvidenceLocked)
//   □ Concentration discrepancy reviewed by founder before promotion
//   □ No performance, equivalence, brand or concentration wording in customer copy
//   □ Relationships remain empty until promotion-time verification
//   □ npm run mkc:validate passes before promotion
// ═════════════════════════════════════════════════════════════════

import type { FragranceKnowledge } from "../../../app/lib/mkc/types";

export const thisIsHerInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "this-is-her-inspired",
  slug          : "this-is-her-inspired",
  brand         : "Maison Skye & Rose",
  name          : "This Is Her Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Floral", "Woody"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral Woody",
  season        : "All Season",
  notes: {
    top:   ["Jasmine Sambac", "Pink Berry"],
    heart: ["Chestnut", "Vanilla"],
    base:  ["Sandalwood"],
    // Evidence-locked to zadig-et-voltaire.com (This Is Her!, 100 ml page, inspected 2026-10-15):
    // "opens with the delicate floral essence of jasmine sambac" / "a spicy hint of pink berry";
    // "A heart of sweet chestnut and creamy vanilla"; "signature sandalwood base". The 50 ml summary's
    // "pink pepper" is not used. Lookfantastic (Jasmine / Vanilla, Chestnut / Sandalwood) agrees on heart and base.
    // PYRAMID_SECONDARY_SUPPORTED. Reference notes only — not Maison formulation facts. See wave-9-source-evidence.json (revision 12).
  },
  notesEvidenceLocked: true,
  mood          : "Warm Sensual Confident",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Confident",
    "Sensual",
    "Warm",
    "Feminine",
  ],
  occasions     : ["Daily Wear", "Office", "Date Night", "Weekend"],
  seasons       : ["Spring", "Summer", "Autumn", "Winter"],
  signatureStyle: ["Floral Woods", "Soft Gourmand", "Modern Feminine"],
  recommendedFor: [
    "Women seeking a warm floral-woody signature for every day.",
    "Those who enjoy jasmine softened by chestnut, vanilla and sandalwood.",
    "Anyone drawn to a gentle gourmand warmth with a floral character.",
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
  subtitle      : "Floral Woods",
  description   : "Jasmine sambac and pink berry open softly bright with a gentle spice. Chestnut and vanilla bring a quiet gourmand warmth, resting on a smooth sandalwood base.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "choosing-your-season-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "floral",
    "woody",
    "jasmine",
    "pink-berry",
    "chestnut",
    "vanilla",
    "sandalwood",
    "warm",
    "daily-wear",
    "all-season",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Scores derived by knowledgeAdapter.deriveMetrics(profile="Floral Woody", season="All Season").
  // Heuristic approximations; no calibration producer in pipeline.
  sweetness     : 2,
  freshness     : 3,
  warmth        : 3,
  intensity     : 3,
  versatility   : 5,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // Empty pending promotion-time verification (Wave 9 policy). No pairings proposed in this phase.
  relationships: {
    alternatives:     [],
    wardrobePartners: [],
  },
};
