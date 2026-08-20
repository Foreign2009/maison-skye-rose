// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — le-male-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-19T19:03:50.849Z
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

export const leMaleInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "le-male-inspired",
  slug          : "le-male-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Le Male Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Aromatic"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Oriental Fougère",
  season        : "Year-Round",
  notes: {
    top:   ["Mint", "Lavender", "Bergamot"],
    heart: ["Cinnamon", "Cumin", "Orange Blossom"],
    base:  ["Vanilla", "Tonka Bean", "Sandalwood", "Cedarwood"],
  },
  notesEvidenceLocked: true,
  mood          : "Warm Sweet Aromatic",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Warm",
    "Sweet",
    "Sophisticated",
    "Confident",
    "Aromatic",
    "Elegant",
  ],
  occasions     : ["Daily Wear", "Office", "Weekend", "Casual"],
  seasons       : ["Spring", "Summer", "Autumn", "Winter"],
  signatureStyle: ["Warm Spiced Elegance", "Balanced Aromatic", "Creamy Sophistication"],
  recommendedFor: [
    "Men seeking a warm signature fragrance that balances fresh aromatic notes with creamy sweetness for everyday confidence",
    "Those who love spiced fragrances but want sophistication over aggression—a refined alternative to heavier orientals",
    "Anyone building a collection who needs a versatile middle ground between fresh and gourmand for any season",
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
  subtitle      : "Warm Spiced Cream",
  description   : "Mint and bergamot spark against warm spice—cinnamon and cumin—before melting into creamy tonka and sandalwood. A fragrance that balances aromatic freshness with enveloping sweetness, neither aggressive nor soft.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "oriental",
    "fougère",
    "mint",
    "lavender",
    "vanilla",
    "tonka-bean",
    "spicy",
    "warm",
    "signature-scent",
    "daily-wear",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 2,
  warmth        : 2,
  intensity     : 3,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["spicebomb-extreme-inspired", "le-male-elixir-inspired", "stronger-with-you-inspired"],
    wardrobePartners: ["sauvage-inspired", "bleu-de-chanel-inspired"],
  },
};
