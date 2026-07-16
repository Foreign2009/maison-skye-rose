// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — delina-exclusif-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-07-13T18:29:35.584Z
// Factory version:   0.5.0
// Prompt versions:   CompositionProducer@1.0.0  EditorialProducer@1.0.0  RelationshipProducer@1.0.0  EducationProducer@1.0.0  DiscoveryProducer@1.0.0
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

export const delinaExclusifInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "delina-exclusif-inspired",
  slug          : "delina-exclusif-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Delina Exclusif Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Amber", "Rose"],
  scentCharacter: "Rich & Long Wearing",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Rose Amber",
  season        : "Winter",
  notes: {
    top:   ["Pink Peppercorn", "Bergamot"],
    heart: ["Rose Absolute", "Vanilla Bourbon"],
    base:  ["Incense", "Ambroxan"],
  },
  mood          : "Rich and elegant.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Elegant",
    "Warm",
    "Sophisticated",
    "Sensual",
    "Confident",
    "Mature",
  ],
  occasions     : ["Date Night", "Evening", "Wedding", "Formal"],
  seasons       : ["Winter", "Autumn"],
  signatureStyle: ["Luxury Romance", "Opulent Warmth", "Rose Amber Elegance"],
  recommendedFor: [
    "Women seeking a signature winter fragrance that feels both intimate and commanding, perfect for special evenings and celebrations.",
    "Those who love rose fragrances but want depth, warmth, and longevity—not just floral sweetness.",
    "Anyone drawn to amber and rose combinations who values elegance and doesn't shy away from richness and presence.",
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
  bestSeller    : true,
  newArrival    : false,

  // ── Education ───────────────────────────────────────────────────────────────
  subtitle      : "Opulent Warmth",
  description   : "Pink peppercorn and bergamot ignite with a sharp, crystalline brightness before the composition settles into rose absolute and vanilla bourbon—a dense, honeyed heart that feels both intimate and grand. Incense and ambroxan anchor the fragrance in warmth, creating a lingering halo of amber smoke that deepens against skin.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "choosing-your-season-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "amber",
    "rose",
    "rose-absolute",
    "vanilla",
    "incense",
    "warm",
    "elegant",
    "long-wearing",
    "winter",
    "date-night",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 3,
  freshness     : 2,
  warmth        : 4,
  intensity     : 4,
  versatility   : 2,
  popularity    : 10,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["delina-inspired", "baccarat-rouge-540-inspired", "hypnotic-poison-inspired"],
    wardrobePartners: ["aventus-inspired"],
  },
};
