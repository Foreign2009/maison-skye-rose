// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — armani-prive-oud-royal-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-22T18:54:54.946Z
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

export const armaniPriveOudRoyalInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "armani-prive-oud-royal-inspired",
  slug          : "armani-prive-oud-royal-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Armani Prive Oud Royal Inspired",
  collection    : "Elite",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "unisex",
  family        : ["Woody", "Amber"],
  scentCharacter: "Rich & Full-Bodied",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Amber Woody",
  season        : "Winter",
  notes: {
    top:   ["Saffron", "Incense"],
    heart: ["Rose", "Amber"],
    base:  ["Sandalwood", "Hindi Oud"],
  },
  notesEvidenceLocked: true,
  mood          : "Rich Dark Oud",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Mysterious",
    "Luxurious",
    "Sensual",
    "Sophisticated",
    "Warm",
    "Intense",
  ],
  occasions     : ["Date Night", "Evening", "Formal"],
  seasons       : ["Winter"],
  signatureStyle: ["Luxe Oud Ceremony", "Dark Amber Sophistication", "Unisex Evening Ritual"],
  recommendedFor: [
    "Those seeking a luxurious evening fragrance that transforms intimate moments with dark, resinous warmth and ceremonial depth.",
    "Unisex fragrance lovers who want a sophisticated oud experience grounded in rose and amber rather than aggressive wood.",
    "Anyone drawn to ritual and incense—who wears fragrance as a personal ceremony and values complexity over simplicity.",
    "Collectors building a winter wardrobe who need a statement piece that pairs beautifully with leather, velvet, and candlelit settings.",
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
  subtitle      : "Ritual & Resin",
  description   : "Saffron and incense open with ceremonial warmth, giving way to a rose-amber heart that deepens into Hindi oud and sandalwood. Dark, resinous, and thoroughly self-assured—this is fragrance as intimate luxury, where restraint meets opulence.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "what-makes-a-signature-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "scent-science"],
  educationTags : [
    "woody",
    "amber",
    "oud",
    "sandalwood",
    "rose",
    "saffron",
    "incense",
    "unisex",
    "winter",
    "full-bodied",
    "luxurious",
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
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["oud-mood-inspired", "arabians-tonka-inspired", "rose-oud-inspired"],
    wardrobePartners: ["baccarat-rouge-540-inspired", "ombre-nomade-inspired"],
  },
};
