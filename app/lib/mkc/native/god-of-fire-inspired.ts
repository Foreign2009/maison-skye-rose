// Maison Knowledge Catalogue — God Of Fire Inspired
import type { FragranceKnowledge } from "../types";

export const godOfFireInspired: FragranceKnowledge = {

  // ── Identity ─────────────────────────────────────────────────────────────────
  id:             "god-of-fire-inspired",
  slug:           "god-of-fire-inspired",
  brand:          "Maison Skye & Rose",
  name:           "God Of Fire Inspired",
  collection:     "Skye",
  catalogVersion: "1.0",
  status:         "active",

  // ── Classification ───────────────────────────────────────────────────────────
  gender:         "male",
  family:         ["Fruity", "Woody", "Amber"],
  scentCharacter: "Balanced Signature",
  projection:     "strong",

  // ── Composition ──────────────────────────────────────────────────────────────
  profile: "Fruity Woody",
  season:  "Summer",
  notes: {
    top:   ["Mango", "Red Berries", "Lemon"],
    heart: ["Iris", "Jasmine", "Green Plum"],
    base:  ["Cedarwood", "Amber", "Sandalwood"],
  },
  mood: "Mango, heat and an unforgettable entrance — Xerjoff's most expressive summer statement.",

  // ── Discovery ────────────────────────────────────────────────────────────────
  vibe:           ["Playful", "Bold", "Modern", "Confident", "Luxury"],
  occasions:      ["Date Night", "Vacation", "Summer Days", "Weekend", "Evening"],
  seasons:        ["Spring", "Summer"],
  signatureStyle: ["Tropical Statement", "Xerjoff Expressionism", "Summer Luxury"],
  recommendedFor: [
    "Those seeking the collection's most expressive summer statement — bold, tropical and unapologetic",
    "Vacation and destination wear: God Of Fire belongs in the heat, somewhere worth arriving",
    "Men who wear fresh-aromatic signatures in spring and want something with more personality for summer",
    "Xerjoff enthusiasts exploring beyond Hacivat and Naxos — a completely different expression from the same house",
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
  subtitle: "Tropical Explosion",
  description:
    "God Of Fire Inspired is the collection's most vivid summer statement — a tropical, fruit-driven fragrance that announces itself with a confidence that turns heads before a word is spoken. " +
    "Mango and Lemon ignite the opening with brightness and warmth, Red Berries adding a depth that lifts the fruit beyond the obvious. " +
    "The heart settles into an unexpected elegance — Iris and Jasmine lending a floral sophistication that prevents the tropical character from ever feeling one-dimensional. " +
    "Cedarwood and Sandalwood in the base anchor the composition in a woody luxury that justifies the Xerjoff name. " +
    "A fragrance for arrivals.",

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
    "mango", "fruity", "woody", "amber", "tropical", "jasmine",
    "iris", "masculine", "summer", "luxury", "niche", "statement",
  ],
  learningPath: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "what-makes-a-signature-scent",
    "choosing-your-season-scent",
  ],

  // ── Intelligence ─────────────────────────────────────────────────────────────
  // Tropical fruity luxury reference — see docs/mkc-authoring-guide.md calibration anchors.
  // freshness:4 reflects summer/tropical vibrancy; warmth:2 confirms summer orientation.
  sweetness:   3,
  freshness:   4,
  warmth:      2,
  intensity:   3,
  versatility: 3,
  popularity:  7,
};
