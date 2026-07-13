// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — creed-green-irish-tweed-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-07-13T18:27:46.328Z
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

export const creedGreenIrishTweedInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "creed-green-irish-tweed-inspired",
  slug          : "creed-green-irish-tweed-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Creed Green Irish Tweed Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Fresh", "Woody"],
  scentCharacter: "Fresh & Light",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Green Woody",
  season        : "Spring",
  notes: {
    top:   ["Lemon", "Galbanum", "Ginger"],
    heart: ["Violet Leaf", "Geranium", "Iris Root"],
    base:  ["Sandalwood", "Vetiver", "Ambroxan"],
  },
  mood          : "Fresh and sophisticated.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Sophisticated",
    "Fresh",
    "Elegant",
    "Refined",
    "Bright",
    "Mature",
  ],
  occasions     : [
    "Daily Wear",
    "Office",
    "Weekend",
    "Formal",
    "Wedding",
  ],
  seasons       : ["Spring", "Summer", "Autumn"],
  signatureStyle: ["Classic Green Woody", "Refined Freshness", "Verdant Elegance"],
  recommendedFor: [
    "Men seeking a refined green woody that bridges casual sophistication and formal elegance across seasons",
    "Those who appreciate fresh citrus and herbal notes grounded in creamy wood rather than heavy base accords",
    "Anyone building a versatile collection who wants one fragrance that works from spring through autumn without feeling seasonal",
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
  subtitle      : "Verdant Elegance",
  description   : "A green woody that opens with bright lemon and galbanum, then settles into a refined heart of violet leaf and iris root. Sandalwood and vetiver anchor the composition with quiet sophistication, creating something both crisp and enduring.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "how-to-wear-fragrance"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "fresh",
    "woody",
    "green",
    "lemon",
    "galbanum",
    "violet-leaf",
    "sandalwood",
    "vetiver",
    "sophisticated",
    "layering",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 1,
  freshness     : 5,
  warmth        : 3,
  intensity     : 2,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["terre-d'hermes-inspired", "imagination-inspired"],
    wardrobePartners: ["sauvage-elixir-inspired"],
  },
};
