// Maison Knowledge Catalogue — Terre d'Hermes Inspired
import type { FragranceKnowledge } from "../types";

export const terreDHermesInspired: FragranceKnowledge = {

  // ── Identity ─────────────────────────────────────────────────────────────────
  id:             "terre-d'hermes-inspired",
  slug:           "terre-d'hermes-inspired",
  brand:          "Maison Skye & Rose",
  name:           "Terre d'Hermes Inspired",
  collection:     "Skye",
  catalogVersion: "1.0",
  status:         "active",

  // ── Classification ───────────────────────────────────────────────────────────
  gender:         "male",
  family:         ["Citrus", "Woody", "Aromatic"],
  scentCharacter: "Balanced Signature",
  projection:     "moderate",

  // ── Composition ──────────────────────────────────────────────────────────────
  profile: "Citrus Woody Mineral",
  season:  "All Season",
  notes: {
    top:   ["Orange", "Grapefruit"],
    heart: ["Pink Pepper", "Flint", "Geranium"],
    base:  ["Vetiver", "Cedar", "Benzoin"],
  },
  mood: "Earthy sophistication — nature distilled into a timeless masculine.",

  // ── Discovery ────────────────────────────────────────────────────────────────
  vibe:           ["Sophisticated", "Elegant", "Professional", "Confident", "Old Money"],
  occasions:      ["Daily Wear", "Office", "Weekend", "Date Night"],
  seasons:        ["Spring", "Summer", "Autumn", "Winter"],
  signatureStyle: ["Timeless Gentleman", "Earthy Elegance", "Professional Authority"],
  recommendedFor: [
    "Men who want a fragrance that signals intelligence and refinement without effort",
    "Office environments where a polished, understated masculine presence is valued",
    "Those who appreciate nature-inspired, mineral complexity over sweetness",
    "Mature fragrance lovers seeking a layered conversation between citrus and earth",
  ],

  // ── Merchandising ────────────────────────────────────────────────────────────
  prices: { "5ml": 60, "10ml": 100, "30ml": 250 },
  images: {
    "5ml":  "/images/blue-5ml.png",
    "10ml": "/images/blue-10ml.png",
    "30ml": "/images/glass-blue-30ml.png",
  },
  bestSeller: false,
  newArrival: false,
  featured:   false,

  // ── Education ────────────────────────────────────────────────────────────────
  subtitle: "Timeless Gentleman",
  description:
    "Terre d'Hermes Inspired captures the philosophical ambition of one of perfumery's most admired masculines. " +
    "Orange and Grapefruit open with a citrus clarity that is vivid without sharpness — sunlit and immediately grounding. " +
    "The heart reveals something unexpected: a mineral, almost flint-like quality from a smoked accord alongside Pink Pepper that introduces gentle heat and edge. " +
    "Vetiver in the base is the soul of this fragrance — earthy, slightly smoky, rooted — supported by Cedar and warm Benzoin. " +
    "This is a fragrance about the relationship between man and earth: sophisticated without trying, complex without being difficult.",

  // ── Academy integration ───────────────────────────────────────────────────────
  academyArticleIds: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "fresh-citrus-and-aquatic-fragrances",
    "woody-fragrances-explained",
    "office-and-professional-fragrances",
    "what-makes-a-signature-scent",
  ],
  academyCategories: [
    "fragrance-families",
    "building-your-wardrobe",
  ],
  educationTags: [
    "citrus", "woody", "vetiver", "cedar", "orange", "mineral",
    "masculine", "sophisticated", "all-season", "timeless",
  ],
  learningPath: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "fresh-citrus-and-aquatic-fragrances",
    "office-and-professional-fragrances",
    "what-makes-a-signature-scent",
  ],

  // ── Relationships ─────────────────────────────────────────────────────────────
  relationships: {
    alternatives: ["creed-green-irish-tweed-inspired"],
  },

  // ── Intelligence ─────────────────────────────────────────────────────────────
  sweetness:   1,
  freshness:   3,
  warmth:      3,
  intensity:   3,
  versatility: 5,
  popularity:  7,
};
