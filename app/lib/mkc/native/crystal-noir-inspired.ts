import type { FragranceKnowledge } from "../types";

export const crystalNoirInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "crystal-noir-inspired",
  slug          : "crystal-noir-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Crystal Noir Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Floral", "Amber"],
  scentCharacter: "Rich & Long Wearing",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Amber Floral",
  season        : "Winter",
  notes: {
    top:   ["Pink Pepper", "Bergamot", "Gardenia"],
    heart: ["Amber", "Rose Absolute", "Oud"],
    base:  ["Coconut", "Vetiver", "Musk"],
  },
  mood          : "Dark and elegant.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Elegant",
    "Mysterious",
    "Sophisticated",
    "Sensual",
    "Warm",
    "Powerful",
  ],
  occasions     : ["Date Night", "Evening", "Formal", "Weekend"],
  seasons       : ["Winter", "Autumn"],
  signatureStyle: ["Luxury Mystery", "Dark Floral Elegance", "Winter Nocturne"],
  recommendedFor: [
    "Women seeking a sophisticated winter signature that commands attention in evening and intimate settings",
    "Those who love rich florals with depth — rose and oud paired with amber warmth rather than sweetness",
    "Anyone drawn to nocturnal elegance who wants a fragrance that feels luxurious, complex, and unmistakably feminine",
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
  subtitle      : "Nocturnal Bloom",
  description   : "Pink pepper and bergamot crack open like winter frost, revealing a heart of rose absolute and oud that blooms dark and uncompromising. Amber and vetiver ground the composition in warmth, while a whisper of coconut adds an unexpected tenderness to the base—a fragrance that moves between shadow and luminescence.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "choosing-your-season-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "amber",
    "floral",
    "rose",
    "oud",
    "winter",
    "elegant",
    "long-wearing",
    "date-night",
    "rich",
    "layering",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 3,
  freshness     : 3,
  warmth        : 4,
  intensity     : 4,
  versatility   : 2,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["baccarat-rouge-540-inspired"],
    wardrobePartners: ["sauvage-inspired", "oud-wood-inspired"],
  },
};
