// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — carlisle-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-07-13T18:27:48.302Z
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

export const carlisleInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "carlisle-inspired",
  slug          : "carlisle-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Carlisle Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Amber", "Spicy"],
  scentCharacter: "Rich & Long Wearing",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Amber Spicy",
  season        : "Winter",
  notes: {
    top:   ["Nutmeg", "Pink Pepper", "Bergamot"],
    heart: ["Vanilla", "Cinnamon", "Clove"],
    base:  ["Patchouli", "Amber", "Sandalwood"],
  },
  mood          : "Rich and commanding.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Rich",
    "Commanding",
    "Warm",
    "Sophisticated",
    "Sensual",
    "Intense",
  ],
  occasions     : ["Date Night", "Evening", "Formal", "Winter Evenings"],
  seasons       : ["Winter", "Autumn"],
  signatureStyle: ["Dark Luxury", "Spiced Warmth", "Evening Statement"],
  recommendedFor: [
    "Men seeking a warm, spiced signature for evening occasions and cooler months when they want to command attention without aggression.",
    "Those who appreciate amber and spice layered with vanilla—rich enough for formal settings yet intimate enough for close encounters.",
    "Anyone building a winter rotation who wants a fragrance that feels expensive, stays close to the skin, and rewards patient wear.",
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
  subtitle      : "Warm Dominion",
  description   : "Nutmeg and pink pepper ignite with bergamot's brightness, then dissolve into a warm heart of vanilla and cinnamon that feels both intimate and commanding. Patchouli and amber settle into the skin like cashmere—rich, textured, impossible to ignore.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "amber",
    "spicy",
    "nutmeg",
    "cinnamon",
    "clove",
    "patchouli",
    "sandalwood",
    "warm",
    "winter",
    "date-night",
    "rich",
    "long-wearing",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 3,
  freshness     : 2,
  warmth        : 4,
  intensity     : 4,
  versatility   : 2,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["spicebomb-extreme-inspired", "azzaro-most-wanted-inspired", "stronger-with-you-inspired"],
    wardrobePartners: ["sauvage-elixir-inspired"],
  },
};
