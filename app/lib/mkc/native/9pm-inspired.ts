// Maison Knowledge Catalogue — 9PM Inspired
import type { FragranceKnowledge } from "../types";

export const ninePmInspired: FragranceKnowledge = {

  // ── Identity ─────────────────────────────────────────────────────────────────
  id:             "9pm-inspired",
  slug:           "9pm-inspired",
  brand:          "Maison Skye & Rose",
  name:           "9PM Inspired",
  collection:     "Skye",
  catalogVersion: "1.0",
  status:         "active",

  // ── Classification ───────────────────────────────────────────────────────────
  gender:         "male",
  family:         ["Amber", "Vanilla", "Aromatic"],
  scentCharacter: "Rich & Long Wearing",
  projection:     "strong",

  // ── Composition ──────────────────────────────────────────────────────────────
  profile: "Vanilla Amber",
  season:  "Winter",
  notes: {
    top:   ["Apple", "Pink Pepper", "Neroli"],
    heart: ["Tonka Bean", "Lavender", "Jasmine"],
    base:  ["Vanilla", "Amber", "Musk"],
  },
  mood: "Apple, tonka and an amber sweetness made for the hours when confidence is everything.",

  // ── Discovery ────────────────────────────────────────────────────────────────
  vibe:           ["Bold", "Seductive", "Warm", "Playful", "Energetic", "Modern"],
  occasions:      ["Evening", "Date Night", "Weekend", "Winter Evenings"],
  seasons:        ["Autumn", "Winter"],
  signatureStyle: ["Sweet Evening Signature", "After-Dark Authority", "Accessible Luxury Amber"],
  recommendedFor: [
    "Those building a dedicated evening masculine for the colder months — the apple-tonka-vanilla character is precisely calibrated for social settings after dark",
    "Buyers seeking a memorable sweet amber signature at an accessible price point — this delivers evening presence without a premium investment",
    "Men who enjoy Stronger With You's warm romantic register but want a more social, energetic evening direction — 9PM shifts the same sweetness into distinctly nocturnal territory",
    "The customer looking for a clear night-out option — a sweet amber built for one occasion and committed to it",
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
  subtitle: "Night Out",
  description:
    "9PM Inspired opens with a crisp Apple accord lifted by Pink Pepper and Neroli — a bright, clean entry that hints at the warmth to come. " +
    "Tonka Bean and Lavender in the heart establish the fragrance's defining character: sweet, aromatic, and deliberately nocturnal in its energy. " +
    "Vanilla and Amber in the base build a plush foundation that carries the sweetness through the evening — a night-out signature designed with a single occasion in mind and committed to it.",

  // ── Academy integration ───────────────────────────────────────────────────────
  academyArticleIds: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "oriental-and-amber-fragrances",
    "vanilla-and-amber-the-warm-base",
    "evening-and-date-night-fragrances",
    "what-makes-a-signature-scent",
  ],
  academyCategories: [
    "fragrance-families",
    "building-your-wardrobe",
    "occasion-guide",
  ],
  educationTags: [
    "vanilla", "amber", "apple", "tonka", "sweet", "lavender", "aromatic",
    "masculine", "winter", "evening", "social", "accessible",
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
    alternatives: ["althair-inspired", "vanilla-28-inspired"],
  },

  // ── Intelligence ─────────────────────────────────────────────────────────────
  // Sweet nightlife amber reference for Wave 2. sweetness:4 from apple+tonka+vanilla —
  // same tier as Stronger With You (4) via different route (fruity amber vs spice amber).
  // versatility:2 is more occasion-specific than SWY (3) — this is a dedicated night-out
  // masculine, not a broadly seasonal one. popularity:5 reflects value-tier brand
  // awareness against the catalogue population mean.
  sweetness:   4,
  freshness:   2,
  warmth:      4,
  intensity:   3,
  versatility: 2,
  popularity:  5,
};
