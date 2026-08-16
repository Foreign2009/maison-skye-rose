// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — spicebomb-dark-leather-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-16T17:11:50.195Z
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

export const spicebombDarkLeatherInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "spicebomb-dark-leather-inspired",
  slug          : "spicebomb-dark-leather-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Spicebomb Dark Leather Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Leather", "Woody", "Spicy"],
  scentCharacter: "Deep & Intense",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Woody Leathery Spicy",
  season        : "Autumn",
  notes: {
    top:   ["Black Pepper", "Nutmeg"],
    heart: ["Incense", "Cinnamon"],
    base:  ["Dark Leather", "Tobacco Accord"],
  },
  mood          : "Dark Spicy Masculine",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Powerful",
    "Dark",
    "Sophisticated",
    "Confident",
    "Intense",
    "Mysterious",
  ],
  occasions     : ["Office", "Date Night", "Evening", "Formal"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Dark Spicy Masculine", "Leather & Restraint", "Sophisticated Intensity"],
  recommendedFor: [
    "Men seeking a confident leather fragrance that balances intense spice with understated sophistication for evening and professional settings",
    "Those who wear dark tailored pieces and appreciate fragrances that echo leather jackets, tobacco, and incense",
    "Anyone looking for a signature autumn scent with enough depth and restraint to command attention without shouting",
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
  subtitle      : "Dark Spice, Quiet Power",
  description   : "Black pepper and nutmeg ignite against a bed of smoldering incense and cinnamon, while dark leather and tobacco settle into the skin with quiet intensity. This is spice tempered by restraint—heat without aggression, darkness without drama.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "choosing-your-season-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "leather",
    "woody",
    "spicy",
    "black-pepper",
    "tobacco",
    "incense",
    "cinnamon",
    "dark",
    "intense",
    "masculine",
    "autumn",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "choosing-your-season-scent"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 1,
  warmth        : 4,
  intensity     : 3,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["spicebomb-extreme-inspired", "oud-for-greatness-inspired"],
    wardrobePartners: ["sauvage-elixir-inspired"],
  },
};
