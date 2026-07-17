// Maison Knowledge Catalogue — Y Inspired
import type { FragranceKnowledge } from "../types";

export const yInspired: FragranceKnowledge = {

  // ── Identity ─────────────────────────────────────────────────────────────────
  id:             "y-inspired",
  slug:           "y-inspired",
  brand:          "Maison Skye & Rose",
  name:           "Y Inspired",
  collection:     "Skye",
  catalogVersion: "1.0",
  status:         "active",

  // ── Classification ───────────────────────────────────────────────────────────
  gender:         "male",
  family:         ["Aromatic", "Fresh", "Woody"],
  scentCharacter: "Balanced Signature",
  projection:     "moderate",

  // ── Composition ──────────────────────────────────────────────────────────────
  profile: "Fresh Aromatic Woody",
  season:  "All Season",
  notes: {
    top:   ["Bergamot", "Apple", "Ginger"],
    heart: ["Sage", "Geranium"],
    base:  ["Amberwood", "Cedar", "Tonka Bean"],
  },
  mood: "Fresh and versatile — the modern gentleman's everyday signature.",

  // ── Discovery ────────────────────────────────────────────────────────────────
  vibe:           ["Modern", "Professional", "Clean", "Confident", "Elegant"],
  occasions:      ["Daily Wear", "Office", "Weekend", "Date Night"],
  seasons:        ["Spring", "Summer", "Autumn", "Winter"],
  signatureStyle: ["Modern Professional", "Clean Everyday", "Versatile Signature"],
  recommendedFor: [
    "Men seeking a reliable, non-polarising all-season daily signature",
    "Office environments where clean freshness and professionalism are valued",
    "Those who prefer clean aromatic masculines over sweet or heavy options",
    "Fragrance beginners looking for an accessible, versatile starting point",
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
  subtitle: "Everyday Signature",
  description:
    "Y Inspired channels the energy of one of Saint Laurent's most commercially successful masculines — an easy-wearing, confidence-first aromatic. " +
    "Bergamot and Apple open with clean brightness: the Apple is crisp rather than sweet, the Bergamot precise and citrusy. " +
    "Sage in the heart introduces aromatic freshness that elevates this beyond the ordinary — green and herbal without being medicinal. " +
    "Amberwood in the base provides the lasting warmth that gives Y its longevity, while Cedar and Tonka Bean ensure the dry-down never tips into sweetness. " +
    "Versatile enough for every day, polished enough for every occasion.",

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
    "aromatic", "fresh", "woody", "bergamot", "sage", "amberwood",
    "masculine", "versatile", "all-season", "everyday",
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
    evolutions: ["y-edp-inspired"],
    alternatives: ["torino21-inspired"],
  },

  // ── Intelligence ─────────────────────────────────────────────────────────────
  sweetness:   2,
  freshness:   4,
  warmth:      3,
  intensity:   3,
  versatility: 5,
  popularity:  7,
};
