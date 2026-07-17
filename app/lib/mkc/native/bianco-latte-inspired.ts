// Maison Knowledge Catalogue — Bianco Latte Inspired
import type { FragranceKnowledge } from "../types";

export const biancoLatteInspired: FragranceKnowledge = {

  // ── Identity ─────────────────────────────────────────────────────────────────
  id:             "bianco-latte-inspired",
  slug:           "bianco-latte-inspired",
  brand:          "Maison Skye & Rose",
  name:           "Bianco Latte Inspired",
  collection:     "Rose",
  catalogVersion: "1.0",
  status:         "active",

  // ── Classification ───────────────────────────────────────────────────────────
  gender:         "female",
  family:         ["Gourmand", "Floral"],
  scentCharacter: "Rich & Long Wearing",
  projection:     "moderate",

  // ── Composition ──────────────────────────────────────────────────────────────
  profile: "Creamy Milk Gourmand",
  season:  "All Season",
  notes: {
    top:   ["Fresh Milk", "White Peach", "Bergamot"],
    heart: ["Peony", "Heliotrope", "Jasmine"],
    base:  ["White Musk", "Sandalwood", "Coconut", "Light Vanilla"],
  },
  mood: "Fresh milk and white flowers caught in the softest moment of morning — clean, creamy, and irresistibly close to the skin.",

  // ── Discovery ────────────────────────────────────────────────────────────────
  vibe:           ["Feminine", "Delicate", "Romantic", "Clean", "Elegant", "Sensual"],
  occasions:      ["Daily Wear", "Office", "Weekend", "Date Night"],
  seasons:        ["Spring", "Summer", "Autumn", "Winter"],
  signatureStyle: ["Creamy Milk Accord", "Soft Morning Ritual", "Year-Round Feminine"],
  recommendedFor: [
    "Women who want a signature that feels like clean skin — the milky accord is warm, inviting, and effortlessly wearable without announcing itself",
    "Anyone building a complete fragrance wardrobe who needs a soft daily presence that never competes: Bianco Latte works where darker gourmands cannot",
    "Those who love the gourmand family but find coffee and almond registers too heavy — the fresh milk route offers sweetness without darkness or warmth",
    "Women who want a single fragrance that moves from morning routine to afternoon meeting to weekend ease without a change of character",
  ],

  // ── Merchandising ────────────────────────────────────────────────────────────
  prices: { "5ml": 60, "10ml": 100, "30ml": 250 },
  images: {
    "5ml":  "/images/pink-5ml.png",
    "10ml": "/images/pink-10ml.png",
    "30ml": "/images/glass-pink-30ml.png",
  },
  bestSeller: true,
  newArrival: false,

  // ── Education ────────────────────────────────────────────────────────────────
  subtitle: "Creamy Milk",
  description:
    "Bianco Latte Inspired is the Rose collection's answer to uncomplicated femininity. " +
    "Fresh milk and white peach open with a clean brightness that reads immediately soft rather than sweet — " +
    "a distinction that separates this from every other gourmand in the wardrobe. " +
    "Peony, heliotrope and jasmine bloom gently in the heart, adding a white floral delicacy that lifts " +
    "the creaminess without challenging it. " +
    "White musk, sandalwood and coconut settle into a base that stays close to skin — " +
    "the kind of fragrance that people lean in to find rather than one that announces a room.",

  // ── Academy integration ───────────────────────────────────────────────────────
  academyArticleIds: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "gourmand-fragrances-guide",
    "the-world-of-floral-fragrances",
    "office-and-professional-fragrances",
    "choosing-your-season-scent",
  ],
  academyCategories: [
    "fragrance-families",
    "the-note-pyramid",
    "building-your-wardrobe",
    "occasion-guide",
  ],
  educationTags: [
    "gourmand", "milky", "creamy", "floral", "white-musk",
    "feminine", "all-season", "daily-wear", "soft", "clean",
  ],
  learningPath: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "gourmand-fragrances-guide",
    "office-and-professional-fragrances",
    "how-to-layer-fragrances",
  ],

  // ── Relationships ─────────────────────────────────────────────────────────────
  relationships: {
    alternatives:     ["love-don't-be-shy-inspired", "la-vie-est-belle-inspired", "kayali-vanilla-28-inspired", "devotion-inspired"],
    wardrobePartners: ["delina-inspired"],
  },

  // ── Intelligence ─────────────────────────────────────────────────────────────
  // Calibrated against Rose gourmand anchors — differentiated on all five axes:
  //   Hypnotic Poison  — sweetness:4 / freshness:1 / warmth:4 / intensity:4 / versatility:2 (dark almond)
  //   Black Opium      — sweetness:4 / freshness:1 / warmth:4 / intensity:4 / versatility:2 (coffee)
  //   Kayali Vanilla 28 — sweetness:4 / freshness:1 / warmth:4 / intensity:4 / versatility:2 (vanilla)
  // Bianco Latte is the milky route:
  //   sweetness:5   — milky sweetness is the cleanest, fullest form; brighter and more present than almond/vanilla
  //   freshness:3   — fresh milk introduces a brightness absent from dark gourmands; not aquatic, but present
  //   warmth:2      — musk-sandalwood base is soft and skin-close, not the enveloping warmth of amber/vanilla
  //   intensity:3   — moderate projection; Bianco Latte stays close to skin by design
  //   versatility:5 — genuine all-season, all-occasion wearability distinguishes it from all specialist evening records
  sweetness:   5,
  freshness:   3,
  warmth:      2,
  intensity:   3,
  versatility: 5,
  popularity:  8,
};
