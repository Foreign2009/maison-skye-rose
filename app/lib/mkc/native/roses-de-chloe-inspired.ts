// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — roses-de-chloe-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-09-11T18:45:46.172Z
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

export const rosesDeChloeInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "roses-de-chloe-inspired",
  slug          : "roses-de-chloe-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Roses de Chloe Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Floral", "Fruity"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral Fruity",
  season        : "Spring",
  notes: {
    top:   ["Litchi", "Bergamot", "Tarragon", "Lemon"],
    heart: [
      "Damask Rose",
      "Magnolia",
      "Cedar",
      "Apple",
      "Black Currant",
      "Peach",
    ],
    base:  ["White Musk", "Amber", "Woody Notes"],
  },
  notesEvidenceLocked: true,
  mood          : "Fresh Romantic Floral",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Romantic",
    "Fresh",
    "Elegant",
    "Modern",
    "Sophisticated",
    "Delicate",
  ],
  occasions     : [
    "Daily Wear",
    "Office",
    "Date Night",
    "Wedding",
    "Weekend",
  ],
  seasons       : ["Spring", "Summer"],
  signatureStyle: ["Fresh Romantic Floral", "Modern Rose With Edge", "Balanced Signature"],
  recommendedFor: [
    "Women seeking a romantic floral that feels fresh and modern rather than traditional or heavily perfumed",
    "Those who love rose fragrances but want unexpected depth from cedar and magnolia—not just sweetness",
    "Anyone looking for a signature spring fragrance that transitions effortlessly into summer and early autumn",
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
  subtitle      : "Rose With Edge",
  description   : "Litchi and bergamot spark an immediate freshness before damask rose blooms with an unexpected depth—magnolia and cedar ground the florality in something almost structural. White musk and amber settle the composition into a warm, skin-like finish that feels both romantic and restrained.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "floral",
    "fruity",
    "damask-rose",
    "litchi",
    "balanced",
    "signature",
    "romantic",
    "spring",
    "daily-wear",
    "wedding",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 3,
  warmth        : 2,
  intensity     : 2,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["delina-inspired", "mon-paris-inspired", "gucci-guilty-pour-femme-inspired"],
    wardrobePartners: ["baccarat-rouge-540-inspired", "my-way-inspired"],
  },
};
