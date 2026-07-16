import type { FragranceKnowledge } from "../types";

export const libreIntenseInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "libre-intense-inspired",
  slug          : "libre-intense-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Libre Intense Inspired",
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
    top:   ["Lavender", "Grapefruit", "Pink Pepper"],
    heart: ["Orange Blossom", "Red Rose Absolute", "Amber Resin"],
    base:  ["Vanilla", "Sandalwood", "Musk"],
  },
  mood          : "Confident and addictive.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Confident",
    "Magnetic",
    "Sensual",
    "Sophisticated",
    "Addictive",
    "Warm",
  ],
  occasions     : ["Date Night", "Evening", "Winter Evenings", "Formal"],
  seasons       : ["Winter", "Autumn"],
  signatureStyle: ["Power & Elegance", "Winter Sensuality", "Addictive Amber Floral"],
  recommendedFor: [
    "Women seeking a confident amber floral that commands attention without apology",
    "Those who want a signature winter fragrance that evolves from fresh opening to sensual base",
    "Anyone looking for an addictive scent that layers beautifully with spiced fragrances for couples moments",
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
  subtitle      : "Addictive Elegance",
  description   : "Lavender and pink pepper ignite with citrus brightness, then surrender to a sumptuous heart of red rose and amber resin that clings to skin like worn silk. Vanilla and sandalwood ground the composition in warm, addictive sensuality—a fragrance that smells like confidence feels.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "choosing-your-season-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "floral",
    "amber",
    "rose",
    "vanilla",
    "sandalwood",
    "winter",
    "date-night",
    "layering",
    "confident",
    "long-wearing",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

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
    wardrobePartners: ["sauvage-inspired", "spicebomb-extreme-inspired"],
  },
};
