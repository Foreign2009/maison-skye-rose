import type { FragranceKnowledge } from "../types";

export const grisCharnelInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "gris-charnel-inspired",
  slug          : "gris-charnel-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Gris Charnel Inspired",
  collection    : "Elite",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "unisex",
  family        : ["Aromatic", "Woody"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Tea Woody",
  season        : "Autumn",
  notes: {
    top:   ["Bergamot", "Green Tea Absolute", "Cardamom"],
    heart: ["Fig Leaf Absolute", "Heliotrope", "Cinnamon Bark"],
    base:  ["Sandalwood", "Vanilla Bourbon", "Amber Resin"],
  },
  mood          : "Creamy and sophisticated.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Sophisticated",
    "Elegant",
    "Creamy",
    "Warm",
    "Refined",
    "Mysterious",
  ],
  occasions     : ["Daily Wear", "Office", "Date Night", "Evening"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Creamy Woody Sophistication", "Tea-Driven Signature", "Parisian Elegance"],
  recommendedFor: [
    "Anyone seeking a refined signature that bridges fresh and warm without demanding attention in professional settings.",
    "Those who love tea-based fragrances with creamy depth and want something more sophisticated than bright citrus.",
    "Fragrance collectors building a curated wardrobe who appreciate balanced woody compositions with skin-like comfort.",
    "Women and men drawn to Parisian elegance who wear this for intimate evenings as much as thoughtful daily wear.",
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
  subtitle      : "Creamy Depth",
  description   : "Bergamot and green tea open with cardamom's precise warmth, settling into a heart of fig leaf and heliotrope—creamy, almost skin-like. Sandalwood and amber resin anchor the composition, offering a sophisticated base that lingers between wood smoke and vanilla warmth.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "what-makes-a-signature-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "aromatic",
    "woody",
    "tea",
    "sandalwood",
    "fig-leaf",
    "cardamom",
    "cinnamon",
    "heliotrope",
    "amber",
    "balanced",
    "signature",
    "unisex",
    "autumn",
    "office",
    "sophisticated",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "what-makes-a-signature-scent"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 2,
  warmth        : 3,
  intensity     : 3,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["sauvage-elixir-inspired", "prada-l'homme-inspired"],
    wardrobePartners: ["baccarat-rouge-540-inspired", "spicebomb-extreme-inspired"],
  },
};
