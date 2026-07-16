import type { FragranceKnowledge } from "../types";

export const veryGoodGirlInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "very-good-girl-inspired",
  slug          : "very-good-girl-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Very Good Girl Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Floral", "Fruity"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Fruity Floral",
  season        : "Spring",
  notes: {
    top:   ["Litchi", "Bergamot", "Pink Pepper"],
    heart: ["Rose Absolute", "Peony", "Almond Milk"],
    base:  ["Vanilla Bourbon", "Musk", "Sandalwood"],
  },
  mood          : "Sexy and playful.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Playful",
    "Sexy",
    "Confident",
    "Feminine",
    "Warm",
    "Bright",
  ],
  occasions     : ["Daily Wear", "Date Night", "Weekend", "Wedding"],
  seasons       : ["Spring", "Summer"],
  signatureStyle: ["Playful Romance", "Fruity Floral Signature", "Modern Sensuality"],
  recommendedFor: [
    "Women seeking a signature floral that balances playful energy with romantic allure for everyday wear and special occasions.",
    "Those who love fruity florals with creamy warmth but want spicy brightness to keep things modern and exciting.",
    "Anyone looking for a sensual rose fragrance that never feels heavy or overdone—accessible luxury that works from day to evening.",
    "Women ready to layer with masculine fragrances like Aventus or Spicebomb for complementary scent experiences.",
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
  subtitle      : "Playful Allure",
  description   : "Litchi and pink pepper ignite a playful spark, while rose absolute and peony bloom into soft, creamy warmth with a whisper of almond milk. Vanilla bourbon and sandalwood settle into skin with a sensual, lingering musk that feels both intimate and unapologetic.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "what-makes-a-signature-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "floral",
    "fruity",
    "rose",
    "peony",
    "litchi",
    "vanilla",
    "signature-scent",
    "layering",
    "spring",
    "playful",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 3,
  warmth        : 2,
  intensity     : 2,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["delina-inspired"],
    wardrobePartners: ["aventus-inspired", "spicebomb-extreme-inspired"],
  },
};
