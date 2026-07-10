// Maison Knowledge Catalogue — Stronger With You Intensely Inspired
import type { FragranceKnowledge } from "../types";

export const strongerWithYouIntenselyInspired: FragranceKnowledge = {

  // ── Identity ─────────────────────────────────────────────────────────────────
  id:             "stronger-with-you-intensely-inspired",
  slug:           "stronger-with-you-intensely-inspired",
  brand:          "Maison Skye & Rose",
  name:           "Stronger With You Intensely Inspired",
  collection:     "Skye",
  catalogVersion: "1.0",
  status:         "active",

  // ── Classification ───────────────────────────────────────────────────────────
  gender:         "male",
  family:         ["Amber", "Vanilla", "Aromatic"],
  scentCharacter: "Rich & Long Wearing",
  projection:     "strong",

  // ── Composition ──────────────────────────────────────────────────────────────
  profile: "Sweet Amber",
  season:  "Winter",
  notes: {
    top:   ["Apple", "Neroli", "Bergamot"],
    heart: ["Cinnamon", "Iris", "Clary Sage"],
    base:  ["Vanilla", "Tonka Bean", "Amber"],
  },
  mood: "Vanilla, tonka and an amber depth that belongs to the evening — the more deliberate expression of a familiar warmth.",

  // ── Discovery ────────────────────────────────────────────────────────────────
  vibe:           ["Seductive", "Bold", "Warm", "Romantic", "Mysterious", "Confident"],
  occasions:      ["Date Night", "Evening", "Winter Evenings", "Weekend"],
  seasons:        ["Autumn", "Winter"],
  signatureStyle: ["Amber Evening Intensity", "Armani After-Dark", "Concentrated Warmth"],
  recommendedFor: [
    "Those who already own Stronger With You and want its natural after-dark evolution — the Intensely version deepens the amber and vanilla while keeping the romantic DNA of the original intact",
    "Date nights and winter evenings that call for a heavier, more deliberate presence — a fragrance that commits to the occasion rather than hedging toward versatility",
    "Men building a cold-weather wardrobe who want one signature held specifically for evening, distinct from their broader autumn option",
    "The Concierge recommendation when a customer loves Stronger With You but wants more intensity — this is the direct wardrobe progression without leaving the Armani aromatic family",
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
  subtitle: "Date Night",
  description:
    "Stronger With You Intensely Inspired trades the original's spiced-chestnut warmth for something more amber-forward — Apple and Neroli open cleanly before Iris and Cinnamon develop a heart that is sweeter and denser than its predecessor. " +
    "The Vanilla and Tonka Bean base pushes deeper into the rich amber register, building a presence that is heavier and more deliberate than the original. " +
    "The after-dark expression of a fragrance that already understood the value of warmth — worn when the evening has weight.",

  // ── Academy integration ───────────────────────────────────────────────────────
  academyArticleIds: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "choosing-your-season-scent",
    "how-to-layer-fragrances",
  ],
  academyCategories: [
    "fragrance-families",
    "building-your-wardrobe",
    "seasonal-guide",
  ],
  educationTags: [
    "vanilla", "amber", "tonka", "iris", "sweet", "warm", "masculine",
    "winter", "evening", "seductive", "aromatic", "concentrated",
  ],
  learningPath: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "choosing-your-season-scent",
    "how-to-layer-fragrances",
  ],

  // ── Relationships ─────────────────────────────────────────────────────────────
  relationships: {
    evolutionOf: "stronger-with-you-inspired",
  },

  // ── Intelligence ─────────────────────────────────────────────────────────────
  // Amber evening evolution reference. Pair with Stronger With You (sweetness:4,
  // warmth:4, intensity:3) to understand the progression: same sweetness tier,
  // warmth escalates to 5, intensity escalates to 4, versatility contracts from 3 to 2.
  // Fifth route to warmth:5 — vanilla/tonka/amber route, distinct from Layton
  // (amber/sandalwood), Spicebomb Extreme (tobacco), Naxos (honey/tobacco),
  // Le Male Elixir (honey/iris). The apple/iris opening differentiates the character.
  sweetness:   4,
  freshness:   1,
  warmth:      5,
  intensity:   4,
  versatility: 2,
  popularity:  5,
};
