// Maison Knowledge Catalogue — Poison Girl Inspired
import type { FragranceKnowledge } from "../types";

export const poisonGirlInspired: FragranceKnowledge = {

  // ── Identity ─────────────────────────────────────────────────────────────────
  id:             "poison-girl-inspired",
  slug:           "poison-girl-inspired",
  brand:          "Maison Skye & Rose",
  name:           "Poison Girl Inspired",
  collection:     "Rose",
  catalogVersion: "1.0",
  status:         "active",

  // ── Classification ───────────────────────────────────────────────────────────
  // Orange-tonka gourmand — sits between the dark gourmands (Hypnotic Poison, Black Opium)
  // and the light gourmands (Bianco Latte). The bitter orange top introduces brightness
  // the dark gourmands lack; the tonka-amber base is richer and warmer than Bianco Latte.
  gender:         "female",
  family:         ["Gourmand", "Amber", "Citrus"],
  scentCharacter: "Rich & Long Wearing",
  projection:     "strong",

  // ── Composition ──────────────────────────────────────────────────────────────
  profile: "Orange Tonka Gourmand",
  season:  "Winter",
  notes: {
    top:   ["Bitter Orange", "Bergamot", "Petitgrain"],
    heart: ["Rose Absolute", "Iris", "Heliotrope"],
    base:  ["Tonka Bean", "Vanilla", "Sandalwood"],
  },
  mood: "The warmth of tonka and vanilla lifted by bitter orange into something that feels richly dressed — an oriental that announces itself with confidence rather than darkness.",

  // ── Discovery ────────────────────────────────────────────────────────────────
  vibe:           ["Sensual", "Feminine", "Bold", "Sophisticated", "Mysterious", "Luxury"],
  occasions:      ["Date Night", "Evening", "Weekend", "Winter Evenings"],
  seasons:        ["Autumn", "Winter"],
  signatureStyle: ["Orange Tonka Accord", "Warm Oriental Statement", "Rebellious Feminine"],
  recommendedFor: [
    "Women drawn to oriental richness who want brightness alongside depth — the bitter orange lifts the tonka and vanilla into something festive rather than heavy",
    "Those who wear fragrance as a deliberate statement: Poison Girl's projection and character read immediately intentional, making it ideal for occasions where presence matters",
    "Anyone who finds almond and coffee gourmands too unrelenting — the citrus opening gives Poison Girl warmth and depth without the darkness",
    "Women who want a fragrance that moves confidently between autumn evenings and winter celebrations: the orange-warm accord is dressed for both",
  ],

  // ── Merchandising ────────────────────────────────────────────────────────────
  prices: { "5ml": 60, "10ml": 100, "30ml": 250 },
  images: {
    "5ml":  "/images/pink-5ml.png",
    "10ml": "/images/pink-10ml.png",
    "30ml": "/images/glass-pink-30ml.png",
  },
  bestSeller: false,
  newArrival: false,

  // ── Education ────────────────────────────────────────────────────────────────
  subtitle: "Rebellious Luxury",
  description:
    "Poison Girl Inspired opens with the immediate brightness of bitter orange and bergamot — " +
    "a citrus opening that is warm rather than fresh, sharpening the attention before the sweetness arrives. " +
    "Petitgrain adds a green-bitter clarity that keeps the top from becoming heavy. " +
    "Rose absolute and iris unfold in the heart with a feminine depth that anchors the composition " +
    "without softening its edge; heliotrope introduces a powdery warmth that bridges floral to oriental. " +
    "Tonka bean and vanilla in the base are the foundation: rich, skin-close, lasting — " +
    "the accord that makes the fragrance feel like a second skin by the end of the evening.",

  // ── Academy integration ───────────────────────────────────────────────────────
  academyArticleIds: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "gourmand-fragrances-guide",
    "oriental-and-amber-fragrances",
    "evening-and-date-night-fragrances",
    "what-makes-a-signature-scent",
  ],
  academyCategories: [
    "fragrance-families",
    "the-note-pyramid",
    "building-your-wardrobe",
    "occasion-guide",
  ],
  educationTags: [
    "gourmand", "amber", "citrus", "orange", "tonka",
    "vanilla", "rose", "oriental", "warm", "winter",
  ],
  learningPath: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "gourmand-fragrances-guide",
    "evening-and-date-night-fragrances",
    "choosing-your-season-scent",
  ],

  // ── Relationships ─────────────────────────────────────────────────────────────
  relationships: {
    alternatives:     ["hypnotic-poison-inspired", "black-opium-inspired"],
    wardrobePartners: ["chance-eau-fraiche-inspired"],
  },

  // ── Intelligence ─────────────────────────────────────────────────────────────
  // Positioned between the dark gourmands and the light gourmands:
  //   Hypnotic Poison  — sweetness:4 / freshness:1 / warmth:4 / intensity:4 / versatility:2
  //   Black Opium      — sweetness:4 / freshness:1 / warmth:4 / intensity:4 / versatility:2
  //   Bianco Latte     — sweetness:5 / freshness:3 / warmth:2 / intensity:3 / versatility:5
  // Poison Girl occupies the space between:
  //   sweetness:4  — rich tonka/vanilla sweetness, same register as dark gourmands
  //   freshness:2  — bitter orange adds citrus brightness HP/BO lack; not fresh, but not dark-flat either
  //   warmth:4     — amber/tonka base is as warm as the dark gourmands; the family (Amber, Citrus) differs
  //   intensity:4  — strong projector; orange top amplifies sillage before the base settles
  //   versatility:3 — broader than HP/BO (orange makes it less specialist) but not all-season
  sweetness:   4,
  freshness:   2,
  warmth:      4,
  intensity:   4,
  versatility: 3,
  popularity:  6,
};
