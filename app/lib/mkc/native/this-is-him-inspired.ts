// ═════════════════════════════════════════════════════════════════
// REVIEW DRAFT — this-is-him-inspired (Wave 9 Batch 5, W9-B5-P1B)
// ─────────────────────────────────────────────────────────────────
// Prepared:          2026-10-15 — hand-authored from inspected evidence (no factory AI generation)
// Status:            LOCAL REVIEW DRAFT — not promoted, not registered in app/lib/mkc/native
// Supplier:          MEN-145 'Zadig & Voltaire / This is Him' (MEN list, page 3)
// ─────────────────────────────────────────────────────────────────
// REVIEW CHECKLIST
//   □ Notes match the inspected tier-1 pyramid (sparse tiers allowed: notesEvidenceLocked)
//   □ Description reviewed in Maison editorial voice
//   □ No performance, equivalence, brand or concentration wording in customer copy
//   □ Relationships remain empty until promotion-time verification
//   □ npm run mkc:validate passes before promotion
// ═════════════════════════════════════════════════════════════════

import type { FragranceKnowledge } from "../types";

export const thisIsHimInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "this-is-him-inspired",
  slug          : "this-is-him-inspired",
  brand         : "Maison Skye & Rose",
  name          : "This Is Him Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Woody", "Spicy"],
  scentCharacter: "Rich & Full-Bodied",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Woody Spicy",
  season        : "Autumn",
  notes: {
    top:   ["Black Pepper", "Grapefruit"],
    heart: ["Incense", "Vanilla"],
    base:  ["Sandalwood"],
    // Evidence-locked to zadig-et-voltaire.com (This Is Him! Eau de Toilette, inspected 2026-10-15):
    // "Top notes: Black pepper, grapefruit"; "Middle notes: Incense, vanilla"; "Base note: Sandalwood".
    // Untiered "cedar" on the same page is not used. PYRAMID_SECONDARY_SUPPORTED. Reference notes only —
    // not Maison formulation facts. See wave-9-source-evidence.json (revision 12).
  },
  notesEvidenceLocked: true,
  mood          : "Bold Warm Confident",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Confident",
    "Bold",
    "Warm",
    "Sophisticated",
  ],
  occasions     : ["Office", "Date Night", "Evening", "Weekend"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Spiced Woods", "Smoky Vanilla", "Modern Masculine"],
  recommendedFor: [
    "Men drawn to a spiced, woody signature with a soft, creamy heart.",
    "Those who enjoy black pepper and grapefruit opening into incense and vanilla.",
    "Anyone exploring warm woody fragrances for cooler days and evenings.",
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
  subtitle      : "Spiced Woods",
  description   : "Black pepper and grapefruit open with a bright, spiced edge. Incense and vanilla form a smoky, creamy heart before sandalwood settles into a warm, woody finish.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "choosing-your-season-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "woody",
    "spicy",
    "black-pepper",
    "grapefruit",
    "incense",
    "vanilla",
    "sandalwood",
    "warm",
    "evening",
    "autumn",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Scores derived by knowledgeAdapter.deriveMetrics(profile="Woody Spicy", season="Autumn").
  // Heuristic approximations; no calibration producer in pipeline.
  sweetness     : 2,
  freshness     : 2,
  warmth        : 4,
  intensity     : 3,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // Empty pending promotion-time verification (Wave 9 policy). No pairings proposed in this phase.
  relationships: {
    alternatives:     [],
    wardrobePartners: [],
  },
};
