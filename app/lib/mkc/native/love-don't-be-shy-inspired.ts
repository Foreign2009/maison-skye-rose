import type { FragranceKnowledge } from "../types";

export const loveDontBeShyInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "love-don't-be-shy-inspired",
  slug          : "love-don't-be-shy-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Love Don't Be Shy Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Gourmand", "Floral"],
  scentCharacter: "Rich & Full-Bodied",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Marshmallow Floral",
  season        : "Winter",
  notes: {
    top:   ["Marshmallow", "Pink Pepper", "Neroli"],
    heart: ["Orange Blossom", "Rose Absolute", "Heliotrope"],
    base:  ["Vanilla", "Tonka Bean", "Sandalwood"],
  },
  mood          : "Sweet and irresistible.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Sensual",
    "Warm",
    "Romantic",
    "Soft",
    "Luxurious",
    "Irresistible",
  ],
  occasions     : ["Date Night", "Evening", "Weekend", "Formal"],
  seasons       : ["Winter"],
  signatureStyle: ["Gourmand Floral", "Soft Irresistibility", "Romance & Warmth"],
  recommendedFor: [
    "Women seeking a signature fragrance that balances sweetness with sophistication for intimate occasions and evenings.",
    "Those who love gourmand fragrances but want floral elegance rather than pure dessert—comfort with depth.",
    "Anyone drawn to rose fragrances that feel warm and enveloping rather than sharp or classical.",
    "Women who want a fragrance that invites closeness and feels tactile, perfect for date nights and winter celebrations.",
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
  bestSeller    : true,
  newArrival    : false,

  // ── Education ───────────────────────────────────────────────────────────────
  subtitle      : "Soft Irresistibility",
  description   : "Opens with a dusted marshmallow sweetness and pink pepper's delicate bite, softening into rose absolute and orange blossom—a floral that exhales warmth rather than demands it. Vanilla and tonka bean anchor the composition in skin-soft comfort, creating a fragrance that feels like an intimate whisper rather than a declaration.",
  academyArticleIds: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "gourmand-fragrances-guide",
    "the-world-of-floral-fragrances",
    "evening-and-date-night-fragrances",
    "choosing-your-season-scent",
  ],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "gourmand",
    "floral",
    "marshmallow",
    "rose",
    "vanilla",
    "tonka-bean",
    "winter",
    "date-night",
    "feminine",
  ],
  learningPath  : [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "gourmand-fragrances-guide",
    "evening-and-date-night-fragrances",
    "choosing-your-season-scent",
  ],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 4,
  freshness     : 3,
  warmth        : 2,
  intensity     : 4,
  versatility   : 2,
  popularity    : 10,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["delina-inspired", "hypnotic-poison-inspired", "bianco-latte-inspired", "arabians-musk-inspired", "black-opium-over-red-inspired", "scandal-inspired", "changing-constance-inspired", "attrape-reves-inspired", "angel-inspired"],
    wardrobePartners: ["sauvage-inspired", "oriana-inspired", "cherry-in-the-air-inspired", "chloe-original-inspired"],
  },
};
