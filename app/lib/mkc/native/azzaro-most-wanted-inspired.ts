// Maison Knowledge Catalogue — Azzaro Most Wanted Inspired
import type { FragranceKnowledge } from "../types";

export const azzaroMostWantedInspired: FragranceKnowledge = {

  // ── Identity ─────────────────────────────────────────────────────────────────
  id:             "azzaro-most-wanted-inspired",
  slug:           "azzaro-most-wanted-inspired",
  brand:          "Maison Skye & Rose",
  name:           "Azzaro Most Wanted Inspired",
  collection:     "Skye",
  catalogVersion: "1.0",
  status:         "active",

  // ── Classification ───────────────────────────────────────────────────────────
  gender:         "male",
  family:         ["Amber", "Sweet", "Spicy"],
  scentCharacter: "Rich & Long Wearing",
  projection:     "moderate",

  // ── Composition ──────────────────────────────────────────────────────────────
  profile: "Amber Spicy",
  season:  "Winter",
  notes: {
    top:   ["Cardamom", "Juniper", "Wild Berry"],
    heart: ["Toffee", "Amber Wood", "Iris"],
    base:  ["Hazelnut Milk", "Sandalwood", "Amber"],
  },
  mood: "Cardamom, toffee and a warmth that draws people in rather than announcing itself — dark amber seduction.",

  // ── Discovery ────────────────────────────────────────────────────────────────
  vibe:           ["Seductive", "Mysterious", "Sophisticated", "Warm", "Confident", "Elegant"],
  occasions:      ["Date Night", "Evening", "Weekend", "Winter Evenings"],
  seasons:        ["Autumn", "Winter"],
  signatureStyle: ["Dark Amber Seduction", "Gourmand Sophistication", "Azzaro Attraction"],
  recommendedFor: [
    "Those who want seductive amber without the theatrical boldness of 1 Million — Most Wanted operates at a lower projection with a more intimate and lasting impression that rewards proximity",
    "Men whose autumn wardrobe skews fresh or clean and want one dark, inviting option for evenings — the toffee-cardamom character is approachable enough for first-time gourmand explorers",
    "Date nights and social evenings where quiet attraction is the appropriate register — this draws people closer rather than projecting a statement from across the room",
    "Customers deciding between Most Wanted and Oud Wood — both are refined autumn-winter choices; Most Wanted offers toffee-amber sweetness where Oud Wood offers spiced-wood dryness; different textures for different personalities",
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
  subtitle: "Bold Attraction",
  description:
    "Azzaro Most Wanted Inspired opens with Cardamom and Juniper before the composition's true character asserts itself — Toffee and Amber Wood in the heart create an accord that is smooth, quietly seductive, and harder to walk away from than it first appears. " +
    "Hazelnut Milk in the base introduces a savory sweetness that lifts this above conventional amber masculines, a warmth that is indulgent without being obvious. " +
    "The dark amber for a man who understands that attraction works better at close range.",

  // ── Academy integration ───────────────────────────────────────────────────────
  academyArticleIds: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "what-makes-a-signature-scent",
    "choosing-your-season-scent",
  ],
  academyCategories: [
    "fragrance-families",
    "building-your-wardrobe",
    "occasion-guide",
  ],
  educationTags: [
    "toffee", "amber", "cardamom", "hazelnut", "sweet", "dark", "masculine",
    "winter", "autumn", "seductive", "sophisticated", "gourmand",
  ],
  learningPath: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "what-makes-a-signature-scent",
    "choosing-your-season-scent",
  ],

  // ── Intelligence ─────────────────────────────────────────────────────────────
  // Dark amber gourmand benchmark. Distinct from 1 Million (sweetness:3, intensity:4,
  // leather route — bold leather-spice) and 9PM (sweetness:4, versatility:2 —
  // dedicated nightlife). Most Wanted occupies the middle of that range: sweetness:4
  // via savory-toffee route, intensity:3 (intimate rather than projecting),
  // versatility:3 (broader evening range than 9PM). The toffee-hazelnut amber route.
  sweetness:   4,
  freshness:   1,
  warmth:      4,
  intensity:   3,
  versatility: 3,
  popularity:  5,
};
