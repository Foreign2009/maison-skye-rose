// Maison Knowledge Catalogue — Spicebomb Extreme Inspired
import type { FragranceKnowledge } from "../types";

export const spicebombExtremeInspired: FragranceKnowledge = {

  // ── Identity ─────────────────────────────────────────────────────────────────
  id:             "spicebomb-extreme-inspired",
  slug:           "spicebomb-extreme-inspired",
  brand:          "Maison Skye & Rose",
  name:           "Spicebomb Extreme Inspired",
  collection:     "Skye",
  catalogVersion: "1.0",
  status:         "active",

  // ── Classification ───────────────────────────────────────────────────────────
  gender:         "male",
  family:         ["Spicy", "Tobacco", "Vanilla"],
  scentCharacter: "Rich & Full-Bodied",
  projection:     "strong",

  // ── Composition ──────────────────────────────────────────────────────────────
  profile: "Spicy Tobacco Vanilla",
  season:  "Winter",
  notes: {
    top:   ["Cinnamon", "Elemi"],
    heart: ["Tobacco", "Cardamom", "Saffron"],
    base:  ["Vanilla", "Benzoin", "Smoked Accord"],
  },
  mood: "Warm, seductive and commanding — the winter signature that announces its presence from across the room.",

  // ── Discovery ────────────────────────────────────────────────────────────────
  vibe:           ["Bold", "Powerful", "Mysterious", "Sexy", "Sophisticated"],
  occasions:      ["Evening", "Date Night", "Winter Evenings", "Weekend"],
  seasons:        ["Autumn", "Winter"],
  signatureStyle: ["Winter Beast", "Dark Seduction", "Cold Weather Statement"],
  recommendedFor: [
    "Men who want an intensely spicy, polarising winter signature that demands attention",
    "Evening and date-night occasions in cold weather",
    "Those who prefer the depth of tobacco and saffron over sweet or fresh alternatives",
    "Fragrance collectors seeking a powerful, distinctive cold-season statement",
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
  featured:   true,

  // ── Education ────────────────────────────────────────────────────────────────
  subtitle: "Winter Beast",
  description:
    "Spicebomb Extreme Inspired is Maison's interpretation of Viktor&Rolf's most intensely spiced masculine — a fragrance that makes no apologies for its ambition. " +
    "Cinnamon and Elemi open with a dry, almost fiery spice that immediately signals you are not wearing something subtle. " +
    "Tobacco, Cardamom and Saffron in the heart transform that opening spice into something richer and more complex: smoky, leathery, and luxurious in the way only these materials can achieve. " +
    "Vanilla and Benzoin in the base soften the edges just enough to ensure wearability without diminishing the power — a fragrance that warms from the inside out and comes fully alive in cold evening air, when spice and depth are most at home.",

  // ── Academy integration ───────────────────────────────────────────────────────
  academyArticleIds: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "oriental-and-amber-fragrances",
    "oud-the-worlds-most-complex-ingredient",
    "evening-and-date-night-fragrances",
    "what-makes-a-signature-scent",
  ],
  academyCategories: [
    "fragrance-families",
    "seasonal-guide",
  ],
  educationTags: [
    "spicy", "tobacco", "vanilla", "cinnamon", "saffron", "cardamom",
    "masculine", "winter", "bold", "projection", "rich",
  ],
  learningPath: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "oriental-and-amber-fragrances",
    "evening-and-date-night-fragrances",
    "choosing-your-season-scent",
  ],

  // ── Relationships ─────────────────────────────────────────────────────────────
  relationships: {
    wardrobePartners: ["althair-inspired", "armani-si-inspired", "libre-intense-inspired", "ombre-nomade-inspired", "pacific-chill-inspired", "silver-mountain-water-inspired", "very-good-girl-inspired", "gris-charnel-inspired", "bleu-de-chanel-l'exclusif-inspired", "bois-d'argent-inspired", "dior-homme-sport-inspired", "eros-flame-inspired", "gentleman-edt-inspired", "godolphin-inspired", "fame-inspired", "lacoste-noir-inspired", "montblanc-legend-inspired", "montblanc-explorer-inspired", "leau-dissey-pour-homme-inspired", "tom-ford-noir-inspired", "polo-black-inspired", "fahrenheit-inspired", "gucci-guilty-pour-homme-inspired", "eros-energy-inspired"],
    alternatives: ["ani-inspired", "carlisle-inspired", "allure-homme-sport-inspired", "spicebomb-dark-leather-inspired", "tobacco-vanille-inspired", "angels-share-inspired", "amen-fantasm-inspired", "le-male-inspired"],
  },

  // ── Intelligence ─────────────────────────────────────────────────────────────
  sweetness:   3,
  freshness:   1,
  warmth:      5,
  intensity:   5,
  versatility: 2,
  popularity:  8,
};
