// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — l'immensite-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-07-13T18:28:30.819Z
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

import type { FragranceKnowledge } from "../../../app/lib/mkc/types";

export const limmensiteInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "l'immensite-inspired",
  slug          : "l'immensite-inspired",
  brand         : "Maison Skye & Rose",
  name          : "L'immensite Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Citrus", "Amber"],
  scentCharacter: "Fresh & Light",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Amber Citrus",
  season        : "Summer",
  notes: {
    top:   ["Grapefruit", "Bergamot", "Pink Pepper"],
    heart: ["Ginger", "Neroli", "Saffron"],
    base:  ["Amber", "Sandalwood", "Musk"],
  },
  mood          : "Fresh sophistication.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Fresh",
    "Sophisticated",
    "Bright",
    "Warm",
    "Refined",
  ],
  occasions     : [
    "Daily Wear",
    "Office",
    "Vacation",
    "Weekend",
    "Evening",
  ],
  seasons       : ["Summer", "Spring"],
  signatureStyle: ["Citrus Sophistication", "Warm Freshness", "Summer Elegance"],
  recommendedFor: [
    "Men seeking a fresh citrus fragrance that transitions seamlessly from office to evening without heaviness.",
    "Those who love classic aquatic freshness but want something with subtle warmth and sophistication.",
    "Anyone looking for a summer signature that feels refined rather than sporty or casual.",
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
  subtitle      : "Boundless Light",
  description   : "Grapefruit and bergamot ignite with a whisper of pink pepper—a burst of clean radiance that dissolves into warm ginger and neroli. Amber and sandalwood settle beneath, creating a sophisticated second skin that feels both weightless and grounded, perfect for sunlit moments that demand presence without effort.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-wear-fragrance"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "citrus",
    "amber",
    "grapefruit",
    "bergamot",
    "fresh",
    "light",
    "summer",
    "daily-wear",
    "saffron",
    "sandalwood",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 3,
  freshness     : 5,
  warmth        : 4,
  intensity     : 2,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["aqua-di-gio-inspired", "bleu-de-chanel-inspired", "imagination-inspired"],
    wardrobePartners: ["layton-inspired", "stronger-with-you-inspired"],
  },
};
