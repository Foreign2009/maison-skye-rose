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
  scentCharacter: "Rich & Long Wearing",
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
    "Vanilla and Benzoin in the base soften the edges just enough to ensure wearability without diminishing the power — the result is a fragrance that warms from the inside out and lingers for hours after you have left the room.",

  // ── Academy integration ───────────────────────────────────────────────────────
  academyArticleIds: [
    "guide-to-fragrance-families",
    "choosing-your-season-scent",
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
    "choosing-your-season-scent",
  ],

  // ── Intelligence ─────────────────────────────────────────────────────────────
  sweetness:       3,
  freshness:       1,
  warmth:          5,
  intensity:       5,
  versatility:     2,
  popularity:      8,
  longevitySignal: "exceptional",
};
