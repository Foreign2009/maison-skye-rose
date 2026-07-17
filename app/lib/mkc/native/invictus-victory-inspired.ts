// Maison Knowledge Catalogue — Invictus Victory Inspired
import type { FragranceKnowledge } from "../types";

export const invictusVictoryInspired: FragranceKnowledge = {

  // ── Identity ─────────────────────────────────────────────────────────────────
  id:             "invictus-victory-inspired",
  slug:           "invictus-victory-inspired",
  brand:          "Maison Skye & Rose",
  name:           "Invictus Victory Inspired",
  collection:     "Skye",
  catalogVersion: "1.0",
  status:         "active",

  // ── Classification ───────────────────────────────────────────────────────────
  gender:         "male",
  family:         ["Amber", "Vanilla", "Spicy"],
  scentCharacter: "Rich & Long Wearing",
  projection:     "strong",

  // ── Composition ──────────────────────────────────────────────────────────────
  profile: "Amber Vanilla",
  season:  "Winter",
  notes: {
    top:   ["Pink Pepper", "Cardamom", "Bergamot"],
    heart: ["Jasmine", "Iris", "Cashmere"],
    base:  ["Amber", "Tonka Bean", "Vanilla"],
  },
  mood: "Pink pepper, amber and tonka — the champion masculine translated from the water into winter.",

  // ── Discovery ────────────────────────────────────────────────────────────────
  vibe:           ["Bold", "Powerful", "Confident", "Wealthy", "Luxury", "Sexy"],
  occasions:      ["Date Night", "Evening", "Winter Evenings", "Weekend"],
  seasons:        ["Autumn", "Winter"],
  signatureStyle: ["Winter Amber Power", "Spiced Vanilla Confidence", "Champion's Dark Season"],
  recommendedFor: [
    "Those who know the Invictus lineage in its fresh aquatic form and want to discover what that same competitive energy becomes when translated into winter amber — Victory carries the bold, unapologetic masculine character into an entirely different seasonal register without losing what made the original compelling",
    "Men building a complete fragrance wardrobe with both a summer fresh signature and a winter bold alternative — Victory pairs with Invictus or Hawas as the warm-season counterpart, giving the same masculine confidence a seasonal home in autumn and winter",
    "Date nights and winter evenings where sweet amber presence is the appropriate register — the pink pepper and cardamom opening provides complexity and intrigue before Tonka Bean and Vanilla in the base settle into a warmth that is unapologetic about its intentions",
    "Customers who sit at the sweeter end of the amber masculine range but want greater spice and projection alongside that sweetness — Victory reaches the same sweetness tier as 9PM and Most Wanted while adding genuine pink pepper-cardamom complexity that lifts it above straightforward amber masculines",
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
  subtitle: "Champion Energy",
  description:
    "Invictus Victory Inspired opens with Pink Pepper and Cardamom — the first signal that this fragrance is not the aquatic Invictus but its colder, more serious evolution. " +
    "Jasmine and Iris in the heart introduce a brief floral complexity before the composition gives way entirely to what it was always heading toward: Amber, Tonka Bean and Vanilla in the base, warm and unapologetically bold. " +
    "The champion masculine in its winter form — the same competitive energy, a completely different season.",

  // ── Academy integration ───────────────────────────────────────────────────────
  academyArticleIds: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "oriental-and-amber-fragrances",
    "vanilla-and-amber-the-warm-base",
    "evening-and-date-night-fragrances",
    "choosing-your-season-scent",
  ],
  academyCategories: [
    "fragrance-families",
    "seasonal-guide",
    "occasion-guide",
  ],
  educationTags: [
    "pink-pepper", "cardamom", "amber", "tonka", "vanilla", "jasmine",
    "masculine", "winter", "autumn", "sweet", "bold", "powerful", "sexy", "warm",
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
    evolutionOf:      "invictus-inspired",
    wardrobePartners: ["invictus-inspired"],
  },

  // ── Intelligence ─────────────────────────────────────────────────────────────
  // Winter amber athletic benchmark. The Invictus line expressed as warm-season masculine:
  // Invictus Inspired (sweetness:2, freshness:4, warmth:2, intensity:3, versatility:5) vs
  // Victory (sweetness:4, freshness:1, warmth:4, intensity:4, versatility:2) — full seasonal
  // inversion within one fragrance house: zero crossover in any dimension except confidence.
  // sweetness:4 via amber/tonka/vanilla route; same tier as 9PM (apple/tonka) and SWY
  // (chestnut/cinnamon/vanilla) but Victory adds intensity:4 via pink pepper/cardamom spice,
  // separating it from 9PM (intensity:3) and making it the most projected sweet amber in the
  // current warm masculine tier. freshness:1 (winter amber — no aquatic or citrus character
  // persists past the bergamot opener). versatility:2 confirms occasion-specialist register:
  // winter evenings and date nights, not daily rotation.
  sweetness:   4,
  freshness:   1,
  warmth:      4,
  intensity:   4,
  versatility: 2,
  popularity:  5,
};
