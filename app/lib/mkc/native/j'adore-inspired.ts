import type { FragranceKnowledge } from "../types";

export const jadoreInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "j'adore-inspired",
  slug          : "j'adore-inspired",
  brand         : "Maison Skye & Rose",
  name          : "J'adore Inspired",
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
  season        : "All Season",
  notes: {
    top:   ["Bergamot", "Ylang Ylang", "Neroli"],
    heart: ["Jasmine Sambac", "Tuberose Absolute", "Gardenia"],
    base:  ["Rose Absolute", "Sandalwood", "Vanilla Bourbon"],
  },
  mood          : "Radiant and elegant.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Elegant",
    "Radiant",
    "Sophisticated",
    "Warm",
    "Confident",
    "Magnetic",
  ],
  occasions     : ["Daily Wear", "Office", "Date Night", "Evening"],
  seasons       : ["Spring", "Summer", "Autumn", "Winter"],
  signatureStyle: ["Golden Femininity", "Luminous Elegance", "Modern Classic"],
  recommendedFor: [
    "Women seeking a radiant everyday fragrance that transitions seamlessly from office to evening",
    "Those who love classic florals but want modern elegance without heavy sweetness",
    "Anyone building a signature scent wardrobe who values luminous sophistication and timeless appeal",
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
  subtitle      : "Luminous Elegance",
  description   : "Bergamot and neroli open onto a luminous heart of jasmine and tuberose, creamy and intoxicating in its swell. Rose absolute and sandalwood settle into a warm, sensual base that lingers on skin like silk catching afternoon light.",
  academyArticleIds: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "the-world-of-floral-fragrances",
    "office-and-professional-fragrances",
    "what-makes-a-signature-scent",
    "how-to-layer-fragrances",
  ],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "floral",
    "rose",
    "jasmine",
    "tuberose",
    "elegant",
    "signature-scent",
    "daily-wear",
    "office",
    "all-season",
    "balanced",
  ],
  learningPath  : [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "the-world-of-floral-fragrances",
    "office-and-professional-fragrances",
    "what-makes-a-signature-scent",
  ],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 3,
  warmth        : 2,
  intensity     : 3,
  versatility   : 5,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["delina-inspired"],
    wardrobePartners: ["baccarat-rouge-540-inspired"],
  },
};
