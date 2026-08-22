// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — a-la-rose-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-22T18:50:45.257Z
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

import type { FragranceKnowledge } from "../types";

export const aLaRoseInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "a-la-rose-inspired",
  slug          : "a-la-rose-inspired",
  brand         : "Maison Skye & Rose",
  name          : "A La Rose Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Floral"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral",
  season        : "Spring",
  notes: {
    top:   ["Calabrian Bergamot", "California Orange"],
    heart: ["Bulgarian Rose", "Grasse Rose", "Violet", "Magnolia"],
    base:  ["Cedar", "Musk"],
  },
  notesEvidenceLocked: true,
  mood          : "Dewy Floral Rose",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Fresh",
    "Elegant",
    "Romantic",
    "Dewy",
    "Sophisticated",
    "Soft",
  ],
  occasions     : ["Daily Wear", "Wedding", "Office", "Casual"],
  seasons       : ["Spring", "Summer"],
  signatureStyle: ["Luminous Floral Rose", "Modern Garden Classic", "Balanced Signature Bloom"],
  recommendedFor: [
    "Women seeking a luminous rose signature that feels garden-fresh rather than powdery or heavy.",
    "Those who love floral fragrances but want brightness and citrus lift, not drowsy sweetness.",
    "Anyone building a spring wardrobe who needs a fragrance that works from morning coffee to evening garden parties.",
    "Fragrance collectors drawn to classic rose compositions with modern restraint and timeless elegance.",
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
  subtitle      : "Morning Rose",
  description   : "Bergamot and California orange open onto a lush garden of Bulgarian and Grasse rose, softened by violet and magnolia. Cedar and musk ground the composition, allowing the floral heart to breathe with dewy, luminous restraint.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "floral",
    "rose",
    "bulgarian-rose",
    "violet",
    "magnolia",
    "citrus",
    "bergamot",
    "signature-scent",
    "spring",
    "daily-wear",
    "wedding",
    "balanced",
    "cedar",
    "musk",
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
    alternatives:     ["miss-dior-inspired", "coco-mademoiselle-inspired", "chance-inspired"],
    wardrobePartners: ["blanche-bete-inspired", "crystal-noir-inspired"],
  },
};
