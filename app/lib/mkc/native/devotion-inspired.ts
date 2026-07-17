// Maison Knowledge Catalogue — Devotion Inspired
import type { FragranceKnowledge } from "../types";

export const devotionInspired: FragranceKnowledge = {

  // ── Identity ─────────────────────────────────────────────────────────────────
  id:             "devotion-inspired",
  slug:           "devotion-inspired",
  brand:          "Maison Skye & Rose",
  name:           "Devotion Inspired",
  collection:     "Rose",
  catalogVersion: "1.0",
  status:         "active",

  // ── Classification ───────────────────────────────────────────────────────────
  // Luminous vanilla citrus — the fragrance that bridges the bright and the warm.
  // Lemon and neroli open with citrus clarity; rum and vanilla close with rich sweetness.
  // Sits between Bianco Latte (lighter/milky) and Poison Girl (darker/amber).
  // Rum is a compositional note; "Gourmand" and "Amber" are excluded per profile brief
  // to prevent it reading as a dessert or a dark oriental.
  gender:         "female",
  family:         ["Vanilla", "Citrus", "Floral"],
  scentCharacter: "Rich & Long Wearing",
  projection:     "moderate",

  // ── Composition ──────────────────────────────────────────────────────────────
  profile: "Luminous Vanilla Citrus",
  season:  "Winter",
  notes: {
    top:   ["Lemon", "Bergamot", "Neroli"],
    heart: ["Gardenia", "Jasmine", "Frangipani"],
    base:  ["Rum", "Vanilla", "Sandalwood"],
  },
  mood: "Lemon brightness over a rum-warmed vanilla — the Italian afternoon that never quite cools, moving between celebration and ease without effort.",

  // ── Discovery ────────────────────────────────────────────────────────────────
  vibe:           ["Feminine", "Sensual", "Playful", "Confident", "Romantic", "Elegant"],
  occasions:      ["Daily Wear", "Date Night", "Weekend", "Evening"],
  seasons:        ["Spring", "Autumn", "Winter"],
  signatureStyle: ["Luminous Rum Vanilla", "Citrus-Warm Accord", "Italian Dessert Elegance"],
  recommendedFor: [
    "Women who want warmth with brightness — the lemon opening keeps the vanilla-rum base from ever feeling heavy, creating a fragrance that is festive rather than evening-specialist",
    "Those who dress their fragrance for celebration: the rum-citrus character was made for occasions where joyful and beautiful are the same thing",
    "Anyone looking for a warm-season gourmand that doesn't disappear in heat — the lemon-bright opening holds its clarity before transitioning to a vanilla-rum base that deepens rather than fades",
    "Women who want versatility from a warm fragrance: Devotion reads from spring afternoon to autumn evening without a change of register",
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
  subtitle: "Italian Dessert",
  description:
    "Devotion Inspired opens with the immediate clarity of lemon and bergamot — " +
    "bright, clean, unapologetically citrus. " +
    "Neroli shifts the character before the lemon fully fades, introducing a warmth that is floral rather than sweet. " +
    "Gardenia and jasmine in the heart deepen the femininity: white-floral and generous, never delicate. " +
    "Rum and vanilla emerge in the base as the accord that justifies the name — " +
    "indulgent in the way only warm, sweet things can be, the Italian dessert of the Rose collection. " +
    "Sandalwood grounds the sweetness into something that lasts and earns its presence. " +
    "Luminous at the top. Warm at the finish. Entirely itself throughout.",

  // ── Academy integration ───────────────────────────────────────────────────────
  academyArticleIds: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "vanilla-and-amber-the-warm-base",
    "fresh-citrus-and-aquatic-fragrances",
    "office-and-professional-fragrances",
    "what-makes-a-signature-scent",
  ],
  academyCategories: [
    "fragrance-families",
    "the-note-pyramid",
    "building-your-wardrobe",
    "seasonal-guide",
  ],
  educationTags: [
    "vanilla", "citrus", "floral", "rum", "lemon",
    "feminine", "warm", "versatile", "luminous", "winter",
  ],
  learningPath: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "vanilla-and-amber-the-warm-base",
    "office-and-professional-fragrances",
    "choosing-your-season-scent",
  ],

  // ── Relationships ─────────────────────────────────────────────────────────────
  relationships: {
    alternatives:     ["bianco-latte-inspired", "la-vie-est-belle-inspired"],
    wardrobePartners: ["chance-eau-fraiche-inspired", "delina-inspired"],
  },

  // ── Intelligence ─────────────────────────────────────────────────────────────
  // Calibrated to occupy the luminous-warm space between the bright and dark registers:
  //   Bianco Latte     — sweetness:5 / freshness:3 / warmth:2 / intensity:3 / versatility:5 (milky/light)
  //   Poison Girl      — sweetness:4 / freshness:2 / warmth:4 / intensity:4 / versatility:3 (orange-amber/dark)
  //   Chance Eau Fraîche — sweetness:1 / freshness:5 / warmth:1 / intensity:3 / versatility:4 (citrus-cool)
  // Devotion is the only Rose record at warmth:3 + freshness:3 simultaneously —
  // the citrus-vanilla balance is expressed precisely in the intelligence layer:
  //   sweetness:4  — vanilla-rum is rich and sweet, but the lemon prevents it reading as a dessert
  //   freshness:3  — lemon/neroli opening adds genuine brightness above the dark gourmands (freshness:1-2)
  //   warmth:3     — warmer than Bianco Latte (2), cooler than the dark orientals (4); balanced
  //   intensity:3  — moderate projection; the lemon top is present but not assertive
  //   versatility:4 — Spring through Winter wearability; the citrus-bright opening earns warmer-season use
  sweetness:   4,
  freshness:   3,
  warmth:      3,
  intensity:   3,
  versatility: 4,
  popularity:  6,
};
