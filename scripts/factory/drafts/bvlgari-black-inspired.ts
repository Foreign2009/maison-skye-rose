// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — bvlgari-black-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-22T18:52:02.775Z
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

export const bvlgariBlackInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "bvlgari-black-inspired",
  slug          : "bvlgari-black-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Bvlgari Black Inspired",
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
    top:   ["Lapsang Souchong", "Bergamot", "Rose"],
    heart: ["Sandalwood", "Cedar", "Jasmine", "Oakmoss"],
    base:  ["Vanilla", "Leather", "Amber", "Musk"],
  },
  notesEvidenceLocked: true,
  mood          : "Smoky Rubbery Dark",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Sophisticated",
    "Mysterious",
    "Warm",
    "Confident",
    "Smoky",
    "Sensual",
  ],
  occasions     : ["Office", "Date Night", "Evening", "Weekend"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Smoky Woody Signature", "Dark Leather Oriental", "Autumn Sophistication"],
  recommendedFor: [
    "Men seeking a sophisticated woody signature that bridges professional confidence and evening intrigue",
    "Those who appreciate smoky, leather-forward fragrances that age into warmth rather than sweetness",
    "Anyone looking for an autumn staple that commands presence without aggression",
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
  subtitle      : "Smoke & Leather",
  description   : "Lapsang Souchong and bergamot open into a smoky heart of sandalwood and cedar—jasmine anchored in shadow. Vanilla and amber settle into a dark, rubbery base that feels both intimate and austere—a fragrance that exhales smoke rather than sweetness.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-wear-fragrance", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "woody",
    "oriental",
    "sandalwood",
    "cedar",
    "leather",
    "amber",
    "vanilla",
    "signature-scent",
    "layering",
    "office",
    "date-night",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "how-to-wear-fragrance"],

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
    alternatives:     ["ombre-nomade-inspired", "tom-ford-noir-inspired", "tobacco-vanille-inspired"],
    wardrobePartners: ["sauvage-inspired", "bleu-de-chanel-inspired"],
  },
};
