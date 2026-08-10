// Maison Knowledge Catalogue — Le Male Elixir Inspired
import type { FragranceKnowledge } from "../types";

export const leMaleElixirInspired: FragranceKnowledge = {

  // ── Identity ─────────────────────────────────────────────────────────────────
  id:             "le-male-elixir-inspired",
  slug:           "le-male-elixir-inspired",
  brand:          "Maison Skye & Rose",
  name:           "Le Male Elixir Inspired",
  collection:     "Skye",
  catalogVersion: "1.0",
  status:         "active",

  // ── Classification ───────────────────────────────────────────────────────────
  gender:         "male",
  family:         ["Amber", "Vanilla", "Aromatic"],
  scentCharacter: "Rich & Full-Bodied",
  projection:     "strong",

  // ── Composition ──────────────────────────────────────────────────────────────
  profile: "Amber Vanilla",
  season:  "Winter",
  notes: {
    top:   ["Cardamom", "Lavender", "Bergamot"],
    heart: ["Honey", "Iris", "Orange Blossom"],
    base:  ["Vanilla", "Tonka Bean", "Sandalwood"],
  },
  mood: "Honey, warmth and a sweetness that announces itself before you speak — JPG's most addictive masculine statement.",

  // ── Discovery ────────────────────────────────────────────────────────────────
  vibe:           ["Seductive", "Bold", "Warm", "Luxurious", "Mysterious", "Confident"],
  occasions:      ["Date Night", "Evening", "Winter Evenings", "Weekend"],
  seasons:        ["Autumn", "Winter"],
  signatureStyle: ["Maximum Honey Sweetness", "JPG Seduction", "Winter Evening Ritual"],
  recommendedFor: [
    "Those who want a maximally sweet, enveloping masculine — Le Male Elixir occupies the top of the sweetness scale alongside Ultra Male, with honey and iris giving it a distinct powdery-golden character that sets it apart",
    "Date nights and winter evenings where a rich, unforgettable presence is the intended effect — this does not blend into the background",
    "Cold weather wear specifically — the honey-vanilla warmth demands low temperatures to remain in balance; warm weather amplifies it beyond its intended register",
    "Collectors who explored Stronger With You's warm romantic character and want to push further — Le Male Elixir is where warmth and sweetness become deliberately extreme",
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
  subtitle: "Modern Seduction",
  description:
    "Le Male Elixir Inspired opens with Cardamom and Lavender before the composition surrenders entirely to its purpose — Honey, Iris, and Orange Blossom building a heart that is both powdery and intensely seductive. " +
    "The Iris prevents the sweetness from becoming one-dimensional, adding a cool elegance that holds the composition in balance. " +
    "Vanilla and Tonka Bean in the base anchor everything in a warmth so deliberate it could only belong to winter evenings.",

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
    "seasonal-guide",
    "building-your-wardrobe",
  ],
  educationTags: [
    "honey", "vanilla", "tonka", "amber", "iris", "lavender", "sweet", "powdery",
    "masculine", "winter", "seductive", "evening",
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
  // Honey sweetness reference for Wave 2. Occupies the sweetness:5 ceiling alongside
  // Ultra Male — different route (honey/iris/powdery vs pear/caramel/gourmand)
  // at the same tier. Fourth route to warmth:5, joining Layton (amber/vanilla),
  // Spicebomb Extreme (tobacco/cinnamon), Naxos (honey/tobacco) — this record
  // adds the honey/tonka/sandalwood route.
  sweetness:   5,
  freshness:   1,
  warmth:      5,
  intensity:   4,
  versatility: 2,
  popularity:  7,
};
