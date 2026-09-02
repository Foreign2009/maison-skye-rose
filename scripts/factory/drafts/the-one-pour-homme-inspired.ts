// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — the-one-pour-homme-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-09-02T17:25:56.489Z
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

export const theOnePourHommeInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "the-one-pour-homme-inspired",
  slug          : "the-one-pour-homme-inspired",
  brand         : "Maison Skye & Rose",
  name          : "The One Pour Homme Inspired",
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
    top:   ["Grapefruit", "Basil", "Coriander", "Cardamom"],
    heart: ["Ginger", "Orange Blossom", "Geranium"],
    base:  [
      "Cedarwood",
      "Vetiver",
      "Amber",
      "Tobacco",
      "Musk",
    ],
  },
  notesEvidenceLocked: true,
  mood          : "Warm Spiced Oriental",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Warm",
    "Sophisticated",
    "Balanced",
    "Magnetic",
    "Elegant",
    "Mature",
  ],
  occasions     : ["Office", "Date Night", "Evening", "Weekend"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Warm Spiced Oriental", "Balanced Sophistication", "Woody Signature"],
  recommendedFor: [
    "Men seeking a sophisticated warm spice signature that transitions seamlessly from office to evening occasions.",
    "Those who appreciate tobacco and cedarwood depth balanced with bright citrus and spice complexity.",
    "Anyone building a curated fragrance collection who wants an autumn-ready woody oriental with depth and versatility.",
    "Men who prefer layered sophistication over one-note freshness and value warm amber and vetiver foundations.",
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
  subtitle      : "Warm Spiced Depth",
  description   : "Warm spice opens with grapefruit and cardamom, a bright counterpoint to the fragrance's deeper ambitions. Ginger and orange blossom soften the heart before cedarwood and tobacco anchor the composition in amber-tinged warmth—a fragrance that deepens as it settles.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "woody",
    "oriental",
    "cedarwood",
    "vetiver",
    "amber",
    "tobacco",
    "ginger",
    "spiced",
    "signature",
    "layering",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],

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
    alternatives:     ["spicebomb-extreme-inspired", "sauvage-elixir-inspired"],
    wardrobePartners: ["sauvage-inspired", "bleu-de-chanel-inspired"],
  },
};
