// Maison Knowledge Catalogue — Chance Eau Fraiche Inspired
import type { FragranceKnowledge } from "../types";

export const chanceEauFraicheInspired: FragranceKnowledge = {

  // ── Identity ─────────────────────────────────────────────────────────────────
  id:             "chance-eau-fraiche-inspired",
  slug:           "chance-eau-fraiche-inspired",
  brand:          "Maison Skye & Rose",
  name:           "Chance Eau Fraiche Inspired",
  collection:     "Rose",
  catalogVersion: "1.0",
  status:         "active",

  // ── Classification ───────────────────────────────────────────────────────────
  // The freshest feminine reference in the Rose collection.
  // Citrus-green character distinguishes it clearly from the fruity-floral register
  // of Chance Eau Tendre and the rosy warmth of Delina.
  gender:         "female",
  family:         ["Fresh", "Floral", "Citrus"],
  scentCharacter: "Fresh & Light",
  projection:     "moderate",

  // ── Composition ──────────────────────────────────────────────────────────────
  profile: "Citrus-Green Floral",
  season:  "Summer",
  notes: {
    top:   ["Citron", "Bergamot", "Pink Pepper"],
    heart: ["Water Jasmine", "Hyacinth", "Freesia"],
    base:  ["Cedar", "Vetiver", "White Musk"],
  },
  mood: "Citrus-sharp and green-clear — the fragrance that makes summer feel effortless and the workday feel finished the moment it touches skin.",

  // ── Discovery ────────────────────────────────────────────────────────────────
  vibe:           ["Clean", "Feminine", "Elegant", "Sophisticated", "Modern", "Delicate"],
  occasions:      ["Daily Wear", "Office", "Summer Days", "Weekend"],
  seasons:        ["Spring", "Summer", "Autumn"],
  signatureStyle: ["Citrus-Green Floral", "Clean Morning Signature", "Warm-Weather Essential"],
  recommendedFor: [
    "Women who want freshness without sweetness — the citrus-green opening reads immediately crisp and clean, nothing fruity or soft about it",
    "Those who wear fragrance in summer heat and want it to stay composed: the green freshness holds its character and never turns heavy on warm skin",
    "Office and daily wearers who need a signature that reads polished and professional without asserting itself — this fragrance completes rather than announces",
    "Anyone who has found the Rose collection's floral-warm registers too rich and wants the lightest, most effortless entry point in the catalogue",
  ],

  // ── Merchandising ────────────────────────────────────────────────────────────
  prices: { "5ml": 60, "10ml": 100, "30ml": 250 },
  images: {
    "5ml":  "/images/pink-5ml.png",
    "10ml": "/images/pink-10ml.png",
    "30ml": "/images/glass-pink-30ml.png",
  },
  bestSeller: false,
  newArrival: false,

  // ── Education ────────────────────────────────────────────────────────────────
  subtitle: "Fresh Elegance",
  description:
    "Chance Eau Fraiche Inspired opens with the sharp clarity of citron and bergamot — " +
    "not a soft opening but a decisive one, announcing itself cleanly before anything else settles. " +
    "A touch of pink pepper adds a quiet edge without weight. " +
    "Water jasmine and hyacinth unfold in the heart with a translucent quality that keeps the composition open: " +
    "this is a fragrance that never thickens, never turns sweet, never closes in on itself. " +
    "Cedar and vetiver in the base ground the freshness in something cool and composed — " +
    "a clean trail that stays close to the skin and stays honest throughout the day.",

  // ── Academy integration ───────────────────────────────────────────────────────
  academyArticleIds: [
    "guide-to-fragrance-families",
    "the-note-pyramid-explained",
    "choosing-your-season-scent",
    "what-makes-a-signature-scent",
  ],
  academyCategories: [
    "fragrance-families",
    "the-note-pyramid",
    "seasonal-guide",
    "occasion-guide",
  ],
  educationTags: [
    "fresh", "citrus", "green", "floral", "clean",
    "feminine", "summer", "daily-wear", "office", "light",
  ],
  learningPath: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "choosing-your-season-scent",
    "what-makes-a-signature-scent",
  ],

  // ── Relationships ─────────────────────────────────────────────────────────────
  relationships: {
    alternatives:     ["chance-eau-tendre-inspired"],
    wardrobePartners: ["coco-mademoiselle-inspired", "poison-girl-inspired", "devotion-inspired"],
  },

  // ── Intelligence ─────────────────────────────────────────────────────────────
  // Positioned as the freshest feminine reference in the Rose collection.
  // Calibrated against the differentiation anchors:
  //   Chance Eau Tendre — sweetness:2 / freshness:3 / warmth:2 / intensity:2 / versatility:3 (fruity floral)
  //   Delina            — sweetness:2 / freshness:4 / warmth:2 / intensity:3 / versatility:4 (rosy fruity)
  // Chance Eau Fraîche takes all three differentiation axes to their extreme:
  //   sweetness:1  — no fruity or gourmand sweetness; citrus-green is the driest read in the catalogue
  //   freshness:5  — the freshest feminine record; citrus + green + vetiver sustain freshness throughout
  //   warmth:1     — cedar/vetiver base is cool and clean; no amber, no vanilla, no musk warmth
  //   intensity:3  — moderate projection; present without announcing
  //   versatility:4 — Spring through Autumn wearability; summer is its peak but not its limit
  sweetness:   1,
  freshness:   5,
  warmth:      1,
  intensity:   3,
  versatility: 4,
  popularity:  7,
};
