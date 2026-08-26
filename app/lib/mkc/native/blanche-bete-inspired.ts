import type { FragranceKnowledge } from "../types";

export const blancheBeteInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "blanche-bete-inspired",
  slug          : "blanche-bete-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Blanche Bete Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Gourmand", "Floral"],
  scentCharacter: "Rich & Full-Bodied",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Milky Floral",
  season        : "Winter",
  notes: {
    top:   ["Bergamot", "Milk Accord", "Neroli"],
    heart: ["Vanilla Absolute", "White Musk", "Tuberose Absolute"],
    base:  ["Sandalwood", "Creamy Amber", "Heliotrope"],
  },
  mood          : "Soft and addictive.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Soft",
    "Addictive",
    "Elegant",
    "Sensual",
    "Warm",
    "Sophisticated",
  ],
  occasions     : ["Date Night", "Evening", "Weekend", "Casual"],
  seasons       : ["Winter", "Autumn"],
  signatureStyle: ["Creamy Elegance", "Soft Luxury", "Intimate Floral", "Winter Signature"],
  recommendedFor: [
    "Women seeking a luxurious second-skin fragrance that deepens through the evening",
    "Those who love creamy florals and want a signature that feels like cashmere against skin",
    "Anyone building a winter collection who values intimate, full-bodied scents over bold projection",
    "Women on date nights who want softness paired with sensuality and lasting presence",
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
  subtitle      : "Soft Luxury",
  description   : "Milky bergamot and neroli dissolve into tuberose and vanilla absolute, a white floral wrapped in warm sandalwood and creamy amber. Addictive and intimate, it settles on skin like cashmere—soft, enveloping, impossibly close.",
  academyArticleIds: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "gourmand-fragrances-guide",
    "the-world-of-floral-fragrances",
    "evening-and-date-night-fragrances",
    "how-to-layer-fragrances",
  ],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "gourmand",
    "floral",
    "tuberose",
    "vanilla",
    "milky",
    "creamy",
    "winter",
    "date-night",
    "sensual",
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
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["delina-inspired", "si-passione-red-musk-inspired"],
    wardrobePartners: ["sauvage-inspired", "oriana-inspired", "libre-flowers-flames-florale-inspired", "a-la-rose-inspired", "chloe-original-inspired"],
  },
};
