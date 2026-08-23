// Maison Knowledge Catalogue — Aqua Di Gio Inspired
import type { FragranceKnowledge } from "../types";

export const aquaDiGioInspired: FragranceKnowledge = {

  // ── Identity ─────────────────────────────────────────────────────────────────
  id:             "aqua-di-gio-inspired",
  slug:           "aqua-di-gio-inspired",
  brand:          "Maison Skye & Rose",
  name:           "Aqua Di Gio Inspired",
  collection:     "Skye",
  catalogVersion: "1.0",
  status:         "active",

  // ── Classification ───────────────────────────────────────────────────────────
  gender:         "male",
  family:         ["Aquatic", "Citrus", "Aromatic"],
  scentCharacter: "Fresh & Light",
  projection:     "moderate",

  // ── Composition ──────────────────────────────────────────────────────────────
  profile: "Aquatic Citrus Fresh",
  season:  "Summer",
  notes: {
    top:   ["Bergamot", "Neroli", "Sea Notes"],
    heart: ["Jasmine", "Rosemary", "Persimmon"],
    base:  ["Patchouli", "Cedar", "White Musk"],
  },
  mood: "Clean Mediterranean freshness — the essential warm-weather masculine.",

  // ── Discovery ────────────────────────────────────────────────────────────────
  vibe:           ["Clean", "Fresh", "Professional", "Modern", "Confident"],
  occasions:      ["Daily Wear", "Summer Days", "Weekend", "Vacation"],
  seasons:        ["Spring", "Summer"],
  signatureStyle: ["Summer Signature", "Mediterranean Style", "Clean Everyday"],
  recommendedFor: [
    "Men seeking a proven, crowd-pleasing fragrance for warm weather",
    "Beach, holiday and outdoor settings in spring and summer",
    "Fragrance beginners who want something fresh, clean and universally liked",
    "Daytime and office wear during the warmer months",
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
  subtitle: "Ocean Fresh",
  description:
    "Aqua Di Gio Inspired translates the world's most recognised aquatic masculine into Maison's oil format. " +
    "Calabrian Bergamot and Neroli open with a sunlit Mediterranean clarity — bright, citrusy, immediately recognisable as warm-weather freshness. " +
    "The heart reveals Rosemary and Jasmine over a soft marine accord: not synthetic ocean, but the memory of the sea — salty, clean and alive. " +
    "Patchouli and Cedar in the base introduce quiet warmth to the dry-down — a presence that draws people closer rather than announcing itself from a distance. " +
    "This is the summer fragrance standard against which all others are measured.",

  // ── Academy integration ───────────────────────────────────────────────────────
  academyArticleIds: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "fresh-citrus-and-aquatic-fragrances",
    "office-and-professional-fragrances",
    "choosing-your-season-scent",
    "how-to-wear-fragrance",
  ],
  academyCategories: [
    "fragrance-families",
    "seasonal-guide",
  ],
  educationTags: [
    "aquatic", "citrus", "bergamot", "marine", "patchouli",
    "masculine", "summer", "fresh", "casual",
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
    evolutions: ["acqua-di-gio-profondo-inspired", "acqua-di-gio-parfum-inspired"],
    alternatives: ["afternoon-swim-inspired", "l'immensite-inspired", "pacific-chill-inspired", "silver-mountain-water-inspired", "torino21-inspired", "bvlgari-aqua-inspired", "dior-homme-sport-inspired", "h24-herbes-vives-inspired", "leau-dissey-pour-homme-inspired", "eros-energy-inspired", "light-blue-pour-homme-inspired", "aqva-amara-inspired"],
    wardrobePartners: ["erba-pura-inspired", "scandal-pour-homme-inspired"],
  },

  // ── Intelligence ─────────────────────────────────────────────────────────────
  sweetness:   1,
  freshness:   5,
  warmth:      1,
  intensity:   2,
  versatility: 3,
  popularity:  8,
};
