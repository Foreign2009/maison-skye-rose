// Maison Knowledge Catalogue — Invictus Inspired
import type { FragranceKnowledge } from "../types";

export const invictusInspired: FragranceKnowledge = {

  // ── Identity ─────────────────────────────────────────────────────────────────
  id:             "invictus-inspired",
  slug:           "invictus-inspired",
  brand:          "Maison Skye & Rose",
  name:           "Invictus Inspired",
  collection:     "Skye",
  catalogVersion: "1.0",
  status:         "active",

  // ── Classification ───────────────────────────────────────────────────────────
  gender:         "male",
  family:         ["Fresh", "Aquatic", "Woody"],
  scentCharacter: "Balanced Signature",
  projection:     "strong",

  // ── Composition ──────────────────────────────────────────────────────────────
  profile: "Fresh Aquatic",
  season:  "Summer",
  notes: {
    top:   ["Grapefruit", "Marine Accord", "Mandarin"],
    heart: ["Bay Laurel", "Jasmine", "Ambrette"],
    base:  ["Ambergris", "Guaiac Wood", "Patchouli"],
  },
  mood: "Grapefruit, sea and a dry-down that earns attention — the modern masculine signature that won globally.",

  // ── Discovery ────────────────────────────────────────────────────────────────
  vibe:           ["Confident", "Clean", "Bold", "Modern", "Energetic", "Fresh"],
  occasions:      ["Daily Wear", "Office", "Weekend", "Summer Days", "Vacation", "Social Events"],
  seasons:        ["Spring", "Summer"],
  signatureStyle: ["Aquatic Confidence", "Fresh Authority", "Modern Masculine Signature"],
  recommendedFor: [
    "Those looking for an established, recognised masculine that works confidently across all warm-weather occasions — one of the most universally wearable fresh fragrances in this collection",
    "Buyers building their first serious fragrance wardrobe — a foundation piece that earns consistent recognition and provides immediate confidence",
    "The daytime warm-weather signature for men who want clean, modern freshness with genuine projection rather than a close-wearing whisper",
    "Customers who love Aqua Di Gio but want more presence and a warmer, more distinctive dry-down — the same clean philosophy with meaningfully more character",
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
  subtitle: "Victory Energy",
  description:
    "Invictus Inspired announces itself with an assertive Marine accord and Grapefruit opening that is immediately recognisable — clean, citrus-aquatic, and unapologetically confident. " +
    "Bay Laurel in the heart introduces a subtle herbal depth that prevents the fresh opening from feeling generic, while Ambergris in the base provides warmth and a distinctive dry-down that separates this from simpler aquatics. " +
    "A fragrance that earned its place in this collection by earning its place in the world.",

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
    "seasonal-guide",
    "building-your-wardrobe",
  ],
  educationTags: [
    "grapefruit", "marine", "aquatic", "fresh", "ambergris", "clean", "masculine",
    "summer", "spring", "versatile", "signature", "confident",
  ],
  learningPath: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "fresh-citrus-and-aquatic-fragrances",
    "office-and-professional-fragrances",
    "choosing-your-season-scent",
  ],

  // ── Relationships ─────────────────────────────────────────────────────────────
  relationships: {
    evolutions:       ["invictus-victory-inspired"],
    wardrobePartners: ["invictus-victory-inspired", "invictus-victory-absolu-inspired"],
    alternatives: ["afternoon-swim-inspired", "silver-mountain-water-inspired", "bvlgari-aqua-inspired", "leau-dissey-pour-homme-inspired", "aqva-amara-inspired", "cool-water-inspired", "dylan-blue-inspired", "polo-blue-inspired", "bvlgari-aqva-marine-inspired", "azzaro-chrome-inspired"],
  },

  // ── Intelligence ─────────────────────────────────────────────────────────────
  // Fresh through energy — compare Imagination (freshness:4, intensity:2, quiet elegance).
  // Shared freshness:4 but intensity:3 and versatility:5 confirm distinct personality.
  // popularity:8 reflects global bestseller status — comparable to Aqua Di Gio (8).
  sweetness:   2,
  freshness:   4,
  warmth:      2,
  intensity:   3,
  versatility: 5,
  popularity:  8,
};
