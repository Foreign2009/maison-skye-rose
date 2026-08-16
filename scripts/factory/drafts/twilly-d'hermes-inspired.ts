// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — twilly-d'hermes-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-16T18:08:21.443Z
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

export const twillyDhermesInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "twilly-d'hermes-inspired",
  slug          : "twilly-d'hermes-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Twilly d'Hermes Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Floral", "Spicy"],
  scentCharacter: "Rich & Full-Bodied",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral Spicy",
  season        : "Spring",
  notes: {
    top:   ["Ginger", "Bitter Orange", "Bergamot"],
    heart: ["Tuberose", "Orange Blossom", "Jasmine"],
    base:  ["Sandalwood", "Vanilla"],
  },
  mood          : "Spicy Floral Feminine",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Confident",
    "Feminine",
    "Sophisticated",
    "Warm",
    "Sensual",
    "Playful",
  ],
  occasions     : [
    "Daily Wear",
    "Office",
    "Date Night",
    "Weekend",
    "Wedding",
  ],
  seasons       : ["Spring", "Summer"],
  signatureStyle: ["Spiced Floral Elegance", "Modern Feminine Power"],
  recommendedFor: [
    "Women seeking a confident floral that balances spice and softness for everyday elegance",
    "Those who love rich, creamy florals with enough ginger bite to feel modern and assertive",
    "Anyone wanting a signature scent that works from office to evening without feeling overdressed",
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
  subtitle      : "Spiced Bloom",
  description   : "Ginger and bitter orange ignite with a sharp, almost peppery warmth that immediately commands attention. The heart unfolds into creamy tuberose and jasmine, their indolic richness tempered by the fragrance's restless spice—a floral that refuses to whisper. Sandalwood and vanilla settle beneath, grounding the composition in soft amber rather than sweetness.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "how-to-wear-fragrance"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "floral",
    "spicy",
    "tuberose",
    "jasmine",
    "ginger",
    "sandalwood",
    "feminine",
    "rich",
    "full-bodied",
    "layering",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 3,
  warmth        : 4,
  intensity     : 2,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["chance-eau-tendre-inspired", "mon-paris-inspired"],
    wardrobePartners: ["alien-inspired"],
  },
};
