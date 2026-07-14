// Maison Knowledge Catalogue — Aventus Inspired
import type { FragranceKnowledge } from "../types";

export const aventusInspired: FragranceKnowledge = {

  // ── Identity ─────────────────────────────────────────────────────────────────
  id:             "aventus-inspired",
  slug:           "aventus-inspired",
  brand:          "Maison Skye & Rose",
  name:           "Aventus Inspired",
  collection:     "Skye",
  catalogVersion: "1.0",
  status:         "active",

  // ── Classification ───────────────────────────────────────────────────────────
  gender:         "male",
  family:         ["Fruity", "Woody", "Musk"],
  scentCharacter: "Balanced Signature",
  projection:     "strong",

  // ── Composition ──────────────────────────────────────────────────────────────
  profile: "Fruity Smoky Woody",
  season:  "All Season",
  notes: {
    top:   ["Pineapple", "Bergamot", "Blackcurrant"],
    heart: ["Birch", "Pink Pepper", "Jasmine"],
    base:  ["Ambergris", "Oakmoss", "Vanilla", "Musk"],
  },
  mood: "Powerful, ambitious and unforgettable — the definitive masculine statement.",

  // ── Discovery ────────────────────────────────────────────────────────────────
  vibe:           ["Powerful", "Confident", "Wealthy", "Sophisticated", "Bold"],
  occasions:      ["Office", "Date Night", "Weekend", "Evening"],
  seasons:        ["Spring", "Summer", "Autumn", "Winter"],
  signatureStyle: ["Executive Presence", "Power Statement", "Timeless Ambition"],
  recommendedFor: [
    "Men who want a fragrance that commands a room",
    "Professionals seeking a power signature for high-stakes occasions",
    "Those who value ambition and success as a personal statement",
    "Fragrance lovers seeking a conversation-starting all-season masculine",
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
  subtitle: "Success Energy",
  description:
    "Aventus Inspired distils the DNA of one of perfumery's most celebrated masculines into Maison's signature oil format. " +
    "The opening is a study in contrasts — Pineapple's tropical brightness cut by Bergamot and sharp Blackcurrant, creating an accord that is immediately arresting and rewards a second breath. " +
    "Birch and Pink Pepper in the heart introduce a cool, smoky character that separates this fragrance from every generic woody masculine on the market. " +
    "The base of Ambergris, Oakmoss and Musk produces an exceptional dry-down: animalic, modern, deeply personal — a fragrance that becomes yours rather than wearing you.",

  // ── Academy integration ───────────────────────────────────────────────────────
  academyArticleIds: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "what-makes-a-signature-scent",
  ],
  academyCategories: [
    "fragrance-fundamentals",
    "building-your-wardrobe",
  ],
  educationTags: [
    "pineapple", "birch", "ambergris", "oakmoss", "fruity", "woody",
    "masculine", "signature", "power", "all-season",
  ],
  learningPath: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "what-makes-a-signature-scent",
    "how-to-wear-fragrance",
  ],

  // ── Relationships ─────────────────────────────────────────────────────────────
  relationships: {
    wardrobePartners: ["ani-inspired", "armani-si-inspired", "delina-exclusif-inspired", "oud-for-greatness-inspired", "very-good-girl-inspired"],
    alternatives: ["erba-pura-inspired", "kirke-overdose-inspired"],
  },

  // ── Intelligence ─────────────────────────────────────────────────────────────
  sweetness:   2,
  freshness:   3,
  warmth:      3,
  intensity:   4,
  versatility: 4,
  popularity:  9,
};
