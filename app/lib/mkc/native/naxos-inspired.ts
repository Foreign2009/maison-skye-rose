// Maison Knowledge Catalogue — Naxos Inspired
import type { FragranceKnowledge } from "../types";

export const naxosInspired: FragranceKnowledge = {

  // ── Identity ─────────────────────────────────────────────────────────────────
  id:             "naxos-inspired",
  slug:           "naxos-inspired",
  brand:          "Maison Skye & Rose",
  name:           "Naxos Inspired",
  collection:     "Skye",
  catalogVersion: "1.0",
  status:         "active",

  // ── Classification ───────────────────────────────────────────────────────────
  gender:         "male",
  family:         ["Amber", "Vanilla", "Tobacco"],
  scentCharacter: "Rich & Long Wearing",
  projection:     "strong",

  // ── Composition ──────────────────────────────────────────────────────────────
  profile: "Honey Tobacco",
  season:  "Winter",
  notes: {
    top:   ["Bergamot", "Lavender", "Lemon"],
    heart: ["Honey", "Jasmine", "Beeswax"],
    base:  ["Tobacco", "Vanilla", "Tonka Bean", "Musk"],
  },
  mood: "Honey, tobacco and warm evenings — Italian luxury translated into the most intimate fragrance in the collection.",

  // ── Discovery ────────────────────────────────────────────────────────────────
  vibe:           ["Wealthy", "Old Money", "Sophisticated", "Mysterious", "Romantic", "Bold"],
  occasions:      ["Evening", "Date Night", "Winter Evenings", "Weekend"],
  seasons:        ["Autumn", "Winter"],
  signatureStyle: ["Niche Indulgence", "Italian Heritage", "Honey-Tobacco Luxury"],
  recommendedFor: [
    "Niche fragrance enthusiasts who appreciate honey-driven orientals with genuine depth and complexity",
    "Evening occasions and intimate settings in autumn and winter",
    "Those exploring the niche world who want something opulent but immediately wearable",
    "Collectors who prize the Xerjoff house — Naxos is its most approachable masterpiece",
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
  subtitle: "Italian Luxury",
  description:
    "Naxos Inspired captures the warmth of the Xerjoff original — a fragrance that feels less like wearing a scent and more like arriving somewhere you have always wanted to be. " +
    "Bergamot and Lavender open with a softness that belies what follows: a heart of Honey, Jasmine and Beeswax that is simultaneously natural and opulent, warm without any trace of artificiality. " +
    "The transition to the base is Naxos at its most distinctive — Tobacco meets Vanilla and Tonka Bean in a rich, complex character that is effortlessly sensual without announcing itself. " +
    "This is the fragrance of fireside evenings and quiet conversation, of Italian heritage distilled into oil. " +
    "One of the most beloved niche references in the collection, and entirely, unapologetically its own thing.",

  // ── Academy integration ───────────────────────────────────────────────────────
  academyArticleIds: [
    "guide-to-fragrance-families",
    "the-note-pyramid-explained",
    "what-makes-a-signature-scent",
    "choosing-your-season-scent",
  ],
  academyCategories: [
    "fragrance-families",
    "building-your-wardrobe",
    "seasonal-guide",
  ],
  educationTags: [
    "honey", "tobacco", "vanilla", "amber", "tonka", "jasmine",
    "beeswax", "masculine", "winter", "niche", "luxury", "italian",
  ],
  learningPath: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "what-makes-a-signature-scent",
    "choosing-your-season-scent",
  ],

  // ── Relationships ─────────────────────────────────────────────────────────────
  relationships: {
    alternatives: ["layton-inspired"],
  },

  // ── Intelligence ─────────────────────────────────────────────────────────────
  sweetness:   4,
  freshness:   2,
  warmth:      5,
  intensity:   4,
  versatility: 2,
  popularity:  8,
};
