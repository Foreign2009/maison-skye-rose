// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — cloud-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-09-07T18:27:38.407Z
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

import type { FragranceKnowledge } from "../../../app/lib/mkc/types";

export const cloudInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "cloud-inspired",
  slug          : "cloud-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Cloud Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Gourmand", "Floral"],
  scentCharacter: "Rich & Full-Bodied",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Gourmand Floral",
  season        : "Spring",
  notes: {
    top:   ["Bergamot", "Pear", "Lavender"],
    heart: ["Coconut", "Whipped Cream", "Praline", "Vanilla Orchid"],
    base:  ["Woody Notes", "Musk"],
  },
  notesEvidenceLocked: true,
  mood          : "Sweet Dreamy Feminine",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Feminine",
    "Dreamy",
    "Sweet",
    "Elegant",
    "Soft",
    "Warm",
  ],
  occasions     : ["Daily Wear", "Weekend", "Date Night", "Wedding"],
  seasons       : ["Spring", "Summer", "Autumn"],
  signatureStyle: ["Gourmand Feminine", "Sweet Comfort Luxury", "Modern Dreamy"],
  recommendedFor: [
    "Women seeking a gourmand signature that feels effortless, wearable, and distinctly feminine across seasons",
    "Those who love sweet comfort fragrances but want brightness and sophistication to balance the richness",
    "Anyone looking for a dreamy everyday scent that transitions seamlessly from casual to special occasions",
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
  subtitle      : "Sweetness Unwound",
  description   : "A gourmand drift of whipped cream and praline settles on skin like sweet, cloudlike comfort, anchored by soft vanilla orchid and woody musk. Bergamot and pear open the composition with luminous brightness, while coconut rounds the edges into something intimate and skin-like. Dreamy without artifice—a fragrance that feels less worn than inhabited.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "how-to-wear-fragrance"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "gourmand",
    "floral",
    "vanilla",
    "coconut",
    "praline",
    "bergamot",
    "orchid",
    "feminine",
    "spring",
    "layering",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 4,
  freshness     : 3,
  warmth        : 2,
  intensity     : 2,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["love-don't-be-shy-inspired", "bianco-latte-inspired", "oriana-inspired"],
    wardrobePartners: ["bleu-de-chanel-inspired"],
  },
};
