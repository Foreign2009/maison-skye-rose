import type { FragranceKnowledge } from "../types";

export const pradaParadoxeInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "prada-paradoxe-inspired",
  slug          : "prada-paradoxe-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Prada Paradoxe Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Floral", "Amber"],
  scentCharacter: "Rich & Full-Bodied",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral Amber",
  season        : "All Season",
  notes: {
    top:   ["Pear", "Bergamot", "Pink Pepper"],
    heart: ["Orange Blossom", "Rose Absolute", "Heliotrope"],
    base:  ["Amber", "Musk", "Vanilla Bourbon"],
  },
  mood          : "Bright and sophisticated.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Sophisticated",
    "Elegant",
    "Warm",
    "Luminous",
    "Confident",
    "Mature",
  ],
  occasions     : ["Daily Wear", "Office", "Date Night", "Evening"],
  seasons       : ["Spring", "Summer", "Autumn", "Winter"],
  signatureStyle: ["Modern Luxury", "Radiant Femininity", "Warm Sophistication"],
  recommendedFor: [
    "Women seeking a luminous floral signature that transitions seamlessly from boardroom to evening without adjustment.",
    "Those who love rose and orange blossom but want warmth and depth rather than airiness or delicacy.",
    "Anyone building a refined fragrance collection who needs one sophisticated amber-floral for all seasons and occasions.",
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
  subtitle      : "Radiant Softness",
  description   : "Opens with bright bergamot and pear before settling into a luminous heart of rose absolute and orange blossom—soft florals that refuse to whisper. Amber and vanilla bourbon create a warm, skin-close base that feels both contemporary and timeless, grounding the brightness without dimming it.",
  academyArticleIds: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "the-world-of-floral-fragrances",
    "oriental-and-amber-fragrances",
    "office-and-professional-fragrances",
    "how-to-layer-fragrances",
  ],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "floral",
    "amber",
    "rose",
    "orange-blossom",
    "heliotrope",
    "vanilla",
    "musk",
    "sophisticated",
    "daily-wear",
    "office",
  ],
  learningPath  : [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "the-world-of-floral-fragrances",
    "office-and-professional-fragrances",
    "how-to-layer-fragrances",
  ],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 3,
  freshness     : 3,
  warmth        : 4,
  intensity     : 3,
  versatility   : 5,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["baccarat-rouge-540-inspired", "carmina-inspired", "la-belle-inspired"],
    wardrobePartners: ["sauvage-inspired", "bleu-de-chanel-inspired"],
  },
};
