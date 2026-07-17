import type { FragranceKnowledge } from "../types";

export const cocoMademoiselleInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "coco-mademoiselle-inspired",
  slug          : "coco-mademoiselle-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Coco Mademoiselle Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Floral", "Fresh"],
  scentCharacter: "Fresh & Light",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Fresh Floral",
  season        : "All Season",
  notes: {
    top:   ["Bitter Orange", "Bergamot"],
    heart: ["Rose Absolute", "Jasmine Sambac"],
    base:  ["Patchouli", "Vanilla Bourbon"],
  },
  mood          : "Sophisticated and feminine.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Sophisticated",
    "Feminine",
    "Elegant",
    "Fresh",
    "Confident",
    "Luminous",
  ],
  occasions     : [
    "Daily Wear",
    "Office",
    "Date Night",
    "Weekend",
    "Evening",
  ],
  seasons       : ["Spring", "Summer", "Autumn", "Winter"],
  signatureStyle: ["Timeless Elegance", "Modern Floral Sophistication", "Poised Femininity"],
  recommendedFor: [
    "Women who want a sophisticated floral signature that works everywhere—from the office to evening plans.",
    "Those seeking a fresh rose fragrance with enough depth to feel luxurious without being heavy or sweet.",
    "Anyone looking for a poised, confident everyday fragrance that pairs beautifully with professional and polished personal style.",
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
  subtitle      : "Poised Femininity",
  description   : "Bitter orange and bergamot open with crystalline brightness, immediately feminine and alert. Rose absolute and jasmine sambac unfold at the heart—a sophisticated floral accord that refuses to whisper, anchored by patchouli and vanilla bourbon that ground the composition with sensual warmth and depth.",
  academyArticleIds: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "the-world-of-floral-fragrances",
    "fresh-citrus-and-aquatic-fragrances",
    "office-and-professional-fragrances",
    "how-to-layer-fragrances",
  ],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "floral",
    "rose",
    "jasmine",
    "fresh",
    "citrus",
    "bergamot",
    "sophisticated",
    "daily-wear",
    "office",
    "layering",
  ],
  learningPath  : [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "the-world-of-floral-fragrances",
    "office-and-professional-fragrances",
    "how-to-wear-fragrance",
  ],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 1,
  freshness     : 5,
  warmth        : 1,
  intensity     : 3,
  versatility   : 5,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["delina-inspired"],
    wardrobePartners: ["sauvage-inspired", "chance-eau-fraiche-inspired"],
  },
};
