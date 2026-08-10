// Maison Knowledge Catalogue — Side Effect Inspired
import type { FragranceKnowledge } from "../types";

export const sideEffectInspired: FragranceKnowledge = {

  // ── Identity ─────────────────────────────────────────────────────────────────
  id:             "side-effect-inspired",
  slug:           "side-effect-inspired",
  brand:          "Maison Skye & Rose",
  name:           "Side Effect Inspired",
  collection:     "Skye",
  catalogVersion: "1.0",
  status:         "active",

  // ── Classification ───────────────────────────────────────────────────────────
  gender:         "male",
  family:         ["Tobacco", "Vanilla", "Amber"],
  scentCharacter: "Rich & Full-Bodied",
  projection:     "strong",

  // ── Composition ──────────────────────────────────────────────────────────────
  // "Rum" is a free-form note ingredient, not a governed family.
  // Family maps to ["Tobacco", "Vanilla", "Amber"] — "Rum" is not in fragranceFamilies.ts.
  profile: "Rum Tobacco",
  season:  "Winter",
  notes: {
    top:   ["Rum", "Lemon"],
    heart: ["Tobacco", "Iris", "Heliotrope"],
    base:  ["Vanilla", "Benzoin", "Tonka Bean", "White Musk"],
  },
  mood: "Rum, tobacco and the hour before midnight — an oriental that rewards those with the restraint to let it breathe.",

  // ── Discovery ────────────────────────────────────────────────────────────────
  vibe:           ["Mysterious", "Sexy", "Bold", "Romantic", "Wealthy", "Old Money"],
  occasions:      ["Evening", "Date Night", "Winter Evenings", "Weekend"],
  seasons:        ["Autumn", "Winter"],
  signatureStyle: ["After Dark Oriental", "Addictive Rum Tobacco", "Kilian Darkness"],
  recommendedFor: [
    "Evening fragrance enthusiasts who prize dark, rum-tobacco orientals with genuine character",
    "Those exploring the By Kilian portfolio — Side Effect is the most intimate and addictive entry",
    "Evenings and date nights in autumn and winter; a fragrance that rewards the right occasion",
    "Collectors who have worked through the sweet-oriental genre and want something less expected",
  ],

  // ── Merchandising ────────────────────────────────────────────────────────────
  prices: { "5ml": 60, "10ml": 100, "30ml": 250 },
  images: {
    "5ml":  "/images/blue-5ml.png",
    "10ml": "/images/blue-10ml.png",
    "30ml": "/images/glass-blue-30ml.png",
  },
  bestSeller: true,
  newArrival: false,

  // ── Education ────────────────────────────────────────────────────────────────
  subtitle: "After Dark",
  description:
    "Side Effect Inspired is the collection's after-dark oriental — the fragrance you reach for when the evening has a specific kind of weight to it. " +
    "Rum and Lemon open with an immediacy that is both unexpected and recognizable: sweet, resinous, and unapologetically rich. " +
    "Tobacco and Iris in the heart add a complexity that prevents the sweetness from ever feeling simple, Heliotrope lending a powdery warmth beneath the darker notes. " +
    "Benzoin, Vanilla and Tonka Bean in the base build a quiet, enveloping warmth that settles slowly and stays late. " +
    "Reserved for occasions that warrant it.",

  // ── Academy integration ───────────────────────────────────────────────────────
  academyArticleIds: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "oud-the-worlds-most-complex-ingredient",
    "vanilla-and-amber-the-warm-base",
    "evening-and-date-night-fragrances",
    "what-makes-a-signature-scent",
  ],
  academyCategories: [
    "fragrance-families",
    "building-your-wardrobe",
    "seasonal-guide",
  ],
  educationTags: [
    "rum", "tobacco", "vanilla", "amber", "tonka", "iris",
    "benzoin", "masculine", "winter", "oriental", "evening", "niche",
  ],
  learningPath: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "oud-the-worlds-most-complex-ingredient",
    "evening-and-date-night-fragrances",
    "choosing-your-season-scent",
  ],

  // ── Intelligence ─────────────────────────────────────────────────────────────
  // Rum/tobacco warmth reference — see docs/mkc-authoring-guide.md calibration anchors.
  // warmth:4 (not 5) because the iris/heliotrope heart introduces powdery-soapy quality
  // that tempers the pure warmth vs Naxos (warmth:5, honey-tobacco route).
  sweetness:   4,
  freshness:   2,
  warmth:      4,
  intensity:   4,
  versatility: 2,
  popularity:  8,
};
