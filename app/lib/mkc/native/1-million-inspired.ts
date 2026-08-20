// Maison Knowledge Catalogue — 1 Million Inspired
import type { FragranceKnowledge } from "../types";

export const oneMillionInspired: FragranceKnowledge = {

  // ── Identity ─────────────────────────────────────────────────────────────────
  id:             "1-million-inspired",
  slug:           "1-million-inspired",
  brand:          "Maison Skye & Rose",
  name:           "1 Million Inspired",
  collection:     "Skye",
  catalogVersion: "1.0",
  status:         "active",

  // ── Classification ───────────────────────────────────────────────────────────
  gender:         "male",
  family:         ["Spicy", "Leather", "Amber"],
  scentCharacter: "Rich & Full-Bodied",
  projection:     "strong",

  // ── Composition ──────────────────────────────────────────────────────────────
  profile: "Spicy Amber",
  season:  "Winter",
  notes: {
    top:   ["Blood Mandarin", "Grapefruit", "Mint"],
    heart: ["Cinnamon", "Rose", "Spices"],
    base:  ["Leather", "Amber", "Patchouli"],
  },
  mood: "Blood mandarin, cinnamon and leather — the golden masculine that set the standard.",

  // ── Discovery ────────────────────────────────────────────────────────────────
  vibe:           ["Bold", "Confident", "Luxurious", "Playful", "Seductive", "Powerful"],
  occasions:      ["Date Night", "Evening", "Weekend", "Winter Evenings"],
  seasons:        ["Autumn", "Winter"],
  signatureStyle: ["Golden Statement", "Leather Amber Authority", "Paco Rabanne Boldness"],
  recommendedFor: [
    "Those who want an immediately recognisable masculine with global cultural weight — 1 Million carries the confidence of one of the world's most purchased fragrances",
    "Date nights and autumn evenings where a bold statement is the intention — the leather-amber combination commands attention from the first application",
    "Men entering the spicy-amber masculine category looking for its defining reference — this is the benchmark the rest of the category measures itself against",
    "Customers whose wardrobe skews fresh or clean and want one commanding autumn option — 1 Million fills that evening statement position without requiring specialist taste",
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

  // ── Education ────────────────────────────────────────────────────────────────
  subtitle: "Golden Luxury",
  description:
    "1 Million Inspired opens with a vivid Blood Mandarin and Grapefruit accord that is sharp, citrus-forward, and immediately arresting before the composition pivots into Cinnamon and Rose — a spiced floral heart where warmth and sophistication briefly coexist. " +
    "The base is the defining statement: Leather, Amber, and Patchouli arriving together with the confidence of a fragrance that already knows it has won. " +
    "A masculine that defined an era of bold evening wear and continues to set the register for statement masculinity.",

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
    "building-your-wardrobe",
    "occasion-guide",
  ],
  educationTags: [
    "leather", "amber", "cinnamon", "spicy", "mandarin", "bold", "masculine",
    "autumn", "winter", "statement", "patchouli", "iconic",
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
    alternatives: ["azzaro-most-wanted-inspired"],
    wardrobePartners: ["lady-million-inspired"],
  },

  // ── Intelligence ─────────────────────────────────────────────────────────────
  // Leather-spice statement reference for Wave 2. sweetness:3 despite being a warm
  // amber — leather tempers what the amber contributes, keeping it below SWY (4).
  // warmth:4 via leather route: drier warmth than Layton's amber/vanilla (5) but
  // richer than a balanced aromatic. popularity:9 reflects global bestseller status.
  sweetness:   3,
  freshness:   2,
  warmth:      4,
  intensity:   4,
  versatility: 3,
  popularity:  9,
};
