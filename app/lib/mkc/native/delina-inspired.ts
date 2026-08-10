// Maison Knowledge Catalogue — Delina Inspired
import type { FragranceKnowledge } from "../types";

export const delinaInspired: FragranceKnowledge = {

  // ── Identity ─────────────────────────────────────────────────────────────────
  id:             "delina-inspired",
  slug:           "delina-inspired",
  brand:          "Maison Skye & Rose",
  name:           "Delina Inspired",
  collection:     "Rose",
  catalogVersion: "1.0",
  status:         "active",

  // ── Classification ───────────────────────────────────────────────────────────
  // First Rose collection record. Establishes the fresh feminine floral benchmark.
  // Future Rose records calibrate against Delina for sweetness, freshness, and warmth.
  gender:         "female",
  family:         ["Floral", "Fruity", "Rose"],
  scentCharacter: "Balanced Signature",
  projection:     "strong",

  // ── Composition ──────────────────────────────────────────────────────────────
  profile: "Floral Fruity",
  season:  "Spring",
  notes: {
    top:   ["Lychee", "Rhubarb", "Pink Pepper", "Bergamot"],
    heart: ["Rose", "Peony", "Magnolia"],
    base:  ["Vanilla", "Cashmere", "Musk"],
  },
  mood: "Rose, lychee and an effortless femininity — the modern signature that made Parfums de Marly a name everyone knows.",

  // ── Discovery ────────────────────────────────────────────────────────────────
  // Rose editorial direction: Elegant, Feminine, Expressive.
  // ≥2 Rose/Elite vibes required — "Feminine" and "Delicate" satisfy the requirement.
  vibe:           ["Feminine", "Elegant", "Romantic", "Luxury", "Sophisticated", "Delicate"],
  occasions:      ["Date Night", "Daily Wear", "Weekend", "Evening", "Wedding"],
  seasons:        ["Spring", "Summer", "Autumn"],
  signatureStyle: ["Modern Feminine Icon", "Rose Lychee Signature", "Everyday Elegance"],
  recommendedFor: [
    "Women seeking the definitive modern feminine signature — the one fragrance that genuinely does it all",
    "Those transitioning from department-store feminine to niche: Delina is the entry point that converts permanently",
    "Spring and summer occasions from the everyday to the elevated — a fragrance that suits both without compromise",
    "Rose fragrance lovers who want the flower at its most elegant: accompanied by fruit and softened by vanilla",
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
  subtitle: "Modern Romance",
  description:
    "Delina Inspired captures the quality that made the Parfums de Marly original one of the most-loved feminine fragrances of the last decade: an effortless elegance that feels at home in the everyday and entirely at ease on the extraordinary occasion. " +
    "Lychee and Rhubarb open with a freshness that is distinctly feminine without being delicate — confident enough for a Monday morning, refined enough for a Saturday evening. " +
    "Rose and Peony in the heart are the core of the fragrance: blooming, present, wearable rather than loud. " +
    "Vanilla and Cashmere in the base carry the floral heart into a luminous, soft warmth that stays close and stays beautiful. " +
    "The definitive modern feminine in the Rose collection.",

  // ── Academy integration ───────────────────────────────────────────────────────
  academyArticleIds: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "the-world-of-floral-fragrances",
    "weekend-and-casual-fragrances",
    "evening-and-date-night-fragrances",
    "what-makes-a-signature-scent",
  ],
  academyCategories: [
    "fragrance-families",
    "building-your-wardrobe",
    "fragrance-fundamentals",
  ],
  educationTags: [
    "rose", "lychee", "floral", "fruity", "feminine", "elegant",
    "vanilla", "peony", "spring", "modern", "niche", "signature",
  ],
  learningPath: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "the-world-of-floral-fragrances",
    "evening-and-date-night-fragrances",
    "choosing-your-season-scent",
  ],

  // ── Relationships ─────────────────────────────────────────────────────────────
  relationships: {
    alternatives: ["miss-dior-inspired", "armani-si-inspired", "blanche-bete-inspired", "burberry-goddess-inspired", "burberry-her-inspired", "chance-eau-tendre-inspired", "coco-mademoiselle-inspired", "delina-exclusif-inspired", "flowerbomb-inspired", "kayali-vanilla-28-inspired", "la-vie-est-belle-inspired", "libre-inspired", "love-don't-be-shy-inspired", "mon-paris-inspired", "rolling-in-love-inspired", "very-good-girl-inspired", "wedding-silk-santal-inspired", "good-girl-blush-inspired", "j'adore-inspired"],
    wardrobePartners: ["baccarat-rouge-540-extrait-inspired", "black-opium-inspired", "my-way-inspired", "hypnotic-poison-inspired", "bianco-latte-inspired", "devotion-inspired"],
  },

  // ── Intelligence ─────────────────────────────────────────────────────────────
  // Fresh feminine floral reference — see docs/mkc-authoring-guide.md calibration anchors.
  // Establishes the baseline for female-gender records: sweetness:2, freshness:4, warmth:2.
  sweetness:   2,
  freshness:   4,
  warmth:      2,
  intensity:   3,
  versatility: 4,
  popularity:  9,
};
