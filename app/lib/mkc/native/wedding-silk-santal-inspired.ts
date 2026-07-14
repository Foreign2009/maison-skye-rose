// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — wedding-silk-santal-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-07-13T18:31:17.470Z
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

import type { FragranceKnowledge } from "../types";

export const weddingSilkSantalInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "wedding-silk-santal-inspired",
  slug          : "wedding-silk-santal-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Wedding Silk Santal Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Vanilla", "Floral"],
  scentCharacter: "Rich & Long Wearing",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral Vanilla",
  season        : "All Season",
  notes: {
    top:   ["Champagne Accord", "Neroli", "Galbanum"],
    heart: ["Vanilla Absolute", "Tuberose", "Sandalwood"],
    base:  ["White Musk", "Amber Resin", "Creamy Sandalwood"],
  },
  mood          : "Soft luxury.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Luxury",
    "Elegant",
    "Soft",
    "Romantic",
    "Sophisticated",
    "Warm",
  ],
  occasions     : [
    "Daily Wear",
    "Office",
    "Date Night",
    "Evening",
    "Wedding",
  ],
  seasons       : ["Spring", "Summer", "Autumn", "Winter"],
  signatureStyle: ["Elegant Romance", "Soft Luxury", "Creamy Femininity", "Signature Floral"],
  recommendedFor: [
    "Women seeking an elegant signature fragrance that transitions seamlessly from office to evening occasions",
    "Those who love creamy vanilla and tuberose but want luxury and sophistication over sweetness",
    "Anyone looking for a soft, intimate fragrance that feels like a second skin rather than a statement",
    "Women who appreciate champagne-bright openings and want a fragrance that deepens beautifully throughout the day",
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
  newArrival    : true,

  // ── Education ───────────────────────────────────────────────────────────────
  subtitle      : "Soft Luxury",
  description   : "Champagne and neroli open into a luminous heart of tuberose and vanilla absolute, where creamy sandalwood and white musk create an intimate second skin. The fragrance settles into warm amber resin and soft sandalwood, a gentle veil of luxury that feels both ceremonial and deeply personal.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "what-makes-a-signature-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "vanilla",
    "floral",
    "tuberose",
    "sandalwood",
    "white-musk",
    "amber",
    "luxury",
    "signature-scent",
    "all-season",
    "office-wear",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "what-makes-a-signature-scent"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 4,
  freshness     : 3,
  warmth        : 4,
  intensity     : 3,
  versatility   : 5,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["delina-inspired"],
    wardrobePartners: ["layton-inspired", "prada-l'homme-inspired"],
  },
};
