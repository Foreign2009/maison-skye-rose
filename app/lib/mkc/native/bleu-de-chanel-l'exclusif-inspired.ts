// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — bleu-de-chanel-l'exclusif-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-16T18:50:28.394Z
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

export const bleuDeChanelLexclusifInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "bleu-de-chanel-l'exclusif-inspired",
  slug          : "bleu-de-chanel-l'exclusif-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Bleu de Chanel L'Exclusif Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Aromatic", "Leather", "Woody"],
  scentCharacter: "Deep & Intense",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Woody Leathery Aromatic",
  season        : "Autumn",
  notes: {
    top:   ["Lavender", "Bergamot", "Lemon Peel"],
    heart: ["Jasmine", "Leather Accord"],
    base:  ["Sandalwood", "Virginia Cedar", "Patchouli", "Cistus Labdanum"],
  },
  mood          : "Sophisticated Masculine Elegant",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Sophisticated",
    "Elegant",
    "Confident",
    "Warm",
    "Mature",
  ],
  occasions     : ["Office", "Date Night", "Evening", "Formal"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Leather & Clarity", "Sophisticated Woody", "Tailored Elegance"],
  recommendedFor: [
    "Men who appreciate refined leather and woody depth as an evolution beyond fresh fragrances.",
    "Those seeking a sophisticated signature for professional settings and evening occasions.",
    "Anyone drawn to aromatic florals anchored by warm sandalwood and cedar rather than citrus brightness.",
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
  subtitle      : "Leather & Clarity",
  description   : "Lavender and bergamot open with crisp clarity, giving way to a supple leather that speaks of tailored restraint. Sandalwood and Virginia cedar anchor the composition in quiet woody depth, while cistus labdanum adds a subtle resinous warmth that refuses to soften the edges.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-wear-fragrance", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "aromatic",
    "leather",
    "woody",
    "sandalwood",
    "cedar",
    "patchouli",
    "lavender",
    "sophisticated",
    "office",
    "layering",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-wear-fragrance", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 1,
  warmth        : 3,
  intensity     : 3,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["armani-code-parfum-inspired", "valentino-uomo-born-in-roma-inspired", "blue-noir-inspired"],
    wardrobePartners: ["spicebomb-extreme-inspired"],
  },
};
