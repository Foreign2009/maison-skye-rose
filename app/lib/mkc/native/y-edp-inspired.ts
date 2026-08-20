// Maison Knowledge Catalogue — Y EDP Inspired
import type { FragranceKnowledge } from "../types";

export const yEdpInspired: FragranceKnowledge = {

  // ── Identity ─────────────────────────────────────────────────────────────────
  id:             "y-edp-inspired",
  slug:           "y-edp-inspired",
  brand:          "Maison Skye & Rose",
  name:           "Y EDP Inspired",
  collection:     "Skye",
  catalogVersion: "1.0",
  status:         "active",

  // ── Classification ───────────────────────────────────────────────────────────
  gender:         "male",
  family:         ["Aromatic", "Woody", "Amber"],
  scentCharacter: "Balanced Signature",
  projection:     "strong",

  // ── Composition ──────────────────────────────────────────────────────────────
  profile: "Aromatic Fresh",
  season:  "All Season",
  notes: {
    top:   ["Apple", "Bergamot"],
    heart: ["Sage", "Geranium", "Lavender", "Fir Balsam"],
    base:  ["Cedar", "Ambergris", "Tonka Bean"],
  },
  mood: "Fresh and aromatic in the morning, warm and grounded by evening — ambition, bottled.",

  // ── Discovery ────────────────────────────────────────────────────────────────
  vibe:           ["Confident", "Modern", "Professional", "Sophisticated", "Powerful", "Bold"],
  occasions:      ["Daily Wear", "Office", "Date Night", "Evening", "Weekend"],
  seasons:        ["Spring", "Summer", "Autumn", "Winter"],
  signatureStyle: ["Modern Professional", "Day-to-Evening Signature", "Ambitious Edge"],
  recommendedFor: [
    "Men who want a signature that carries confidently from morning meetings to evening plans",
    "Those who enjoy the original Y but want more warmth and depth for autumn and winter",
    "Young professionals building a first serious fragrance wardrobe — distinctive without being polarising",
    "All-season wearers who prefer aromatic freshness anchored by a rich, grounded dry-down",
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
  subtitle: "Modern Ambition",
  description:
    "Y EDP Inspired takes everything that made the original Y a modern masculine standard and enriches it with depth the lighter formulation only gestures toward. " +
    "Apple and Bergamot open with vivid clarity — bright, citrus-fresh, the kind of opening that makes a strong first impression without demanding one. " +
    "The heart is where the EDP earns its distinction: Sage and Lavender are joined by Fir Balsam, a resinous green note that introduces a quiet warmth beneath the aromatic freshness. " +
    "Cedar, Ambergris and Tonka Bean in the base create a masculine richness that builds through the day — confident without heaviness, warm without sweetness. " +
    "This is the fragrance that moves easily between contexts: the office that respects it, the evening that rewards it.",

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
    "fragrance-fundamentals",
  ],
  educationTags: [
    "aromatic", "woody", "amber", "apple", "sage", "lavender",
    "tonka", "ambergris", "masculine", "all-season", "professional", "signature",
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
    evolutionOf: "y-inspired",
    alternatives: ["montblanc-legend-inspired"],
  },

  // ── Intelligence ─────────────────────────────────────────────────────────────
  sweetness:   3,
  freshness:   3,
  warmth:      4,
  intensity:   4,
  versatility: 4,
  popularity:  8,
};
