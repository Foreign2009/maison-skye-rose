// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — invictus-victory-absolu-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-16T18:50:55.862Z
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

export const invictusVictoryAbsoluInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "invictus-victory-absolu-inspired",
  slug          : "invictus-victory-absolu-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Invictus Victory Absolu Inspired",
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
    top:   ["Black Pepper"],
    heart: ["Amber", "Ambergris", "Woodsy Notes"],
    base:  ["Sandalwood", "Frankincense", "Patchouli"],
  },
  notesEvidenceLocked: true,
  mood          : "Warm Oriental Masculine",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Warm",
    "Sophisticated",
    "Confident",
    "Sensual",
    "Mysterious",
    "Elegant",
  ],
  occasions     : ["Office", "Date Night", "Evening", "Weekend"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Warm Oriental Woody", "Sophisticated Spice", "Balanced Signature"],
  recommendedFor: [
    "Men seeking a warm, spiced signature that balances confidence with intimacy for evening and social occasions",
    "Those who appreciate Oriental woody fragrances with resinous depth and want measured presence over assertive projection",
    "Anyone looking for a sophisticated autumn fragrance that transitions seamlessly from office to date night",
    "Men who prefer dark amber and incense over fresh citrus and want a fragrance with character and maturity",
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
  subtitle      : "Warm Resin, Dark Spice",
  description   : "Black pepper ignites a warm, resinous core of amber and ambergris, grounding into sandalwood and frankincense with a whisper of patchouli. A fragrance that moves between spice and smoke, intimate and commanding.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "what-makes-a-signature-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "woody",
    "oriental",
    "amber",
    "sandalwood",
    "patchouli",
    "black-pepper",
    "signature",
    "balanced",
    "office",
    "date-night",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

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
    alternatives:     ["sauvage-elixir-inspired", "oud-wood-inspired"],
    wardrobePartners: ["invictus-inspired", "invictus-victory-inspired"],
  },
};
