// Maison Knowledge Catalogue — Oud Wood Inspired
import type { FragranceKnowledge } from "../types";

export const oudWoodInspired: FragranceKnowledge = {

  // ── Identity ─────────────────────────────────────────────────────────────────
  id:             "oud-wood-inspired",
  slug:           "oud-wood-inspired",
  brand:          "Maison Skye & Rose",
  name:           "Oud Wood Inspired",
  collection:     "Skye",
  catalogVersion: "1.0",
  status:         "active",

  // ── Classification ───────────────────────────────────────────────────────────
  gender:         "male",
  family:         ["Oud", "Woody", "Amber"],
  scentCharacter: "Rich & Full-Bodied",
  projection:     "moderate",

  // ── Composition ──────────────────────────────────────────────────────────────
  profile: "Woody Oud",
  season:  "Winter",
  notes: {
    top:   ["Cardamom", "Chinese Pepper", "Rosewood"],
    heart: ["Oud Wood", "Sandalwood", "Vetiver"],
    base:  ["Amber", "Tonka Bean", "Vanilla"],
  },
  mood: "Spice, precision and oud at its most civilised — the luxury wood that established a category.",

  // ── Discovery ────────────────────────────────────────────────────────────────
  vibe:           ["Sophisticated", "Refined", "Luxurious", "Elegant", "Confident", "Distinctive"],
  occasions:      ["Formal Events", "Evening", "Date Night", "Business", "Winter Days"],
  seasons:        ["Autumn", "Winter"],
  signatureStyle: ["Polished Oud Authority", "Western Luxury Reference", "Executive Refinement"],
  recommendedFor: [
    "Those exploring oud for the first time — this interpretation removes the animalic rawness of traditional oud and delivers the ingredient at its most approachable and refined",
    "Business and formal environments where a quietly prestigious presence is appropriate — this does not demand attention but commands respect",
    "Men who already wear warm Skye masculines and want to expand into specialist oud territory without a dramatic adjustment to their established wardrobe",
    "Customers who asked the Concierge for something woody and sophisticated — this is the definitive collection answer",
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
  subtitle: "Executive Luxury",
  description:
    "A precisely calibrated spice opening — Cardamom and Chinese Pepper creating warmth without aggression — transitions into a smooth, polished Oud that represents the ingredient at its most refined and approachable. " +
    "Sandalwood and Vetiver deepen the woody character without hardening it, while Amber and Tonka Bean lay a quietly resinous foundation that serves the star note rather than competing with it. " +
    "The benchmark for accessible luxury oud: a fragrance that opened a category.",

  // ── Academy integration ───────────────────────────────────────────────────────
  academyArticleIds: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "oud-the-worlds-most-complex-ingredient",
    "woody-fragrances-explained",
    "evening-and-date-night-fragrances",
    "what-makes-a-signature-scent",
  ],
  academyCategories: [
    "fragrance-families",
    "building-your-wardrobe",
    "luxury-guide",
  ],
  educationTags: [
    "oud", "sandalwood", "woody", "amber", "cardamom", "spicy", "masculine",
    "winter", "luxury", "sophisticated", "formal", "warm",
  ],
  learningPath: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "oud-the-worlds-most-complex-ingredient",
    "evening-and-date-night-fragrances",
    "choosing-your-season-scent",
  ],

  // ── Relationships ─────────────────────────────────────────────────────────────
  relationships: {
    alternatives: ["arabians-tonka-inspired", "ombre-nomade-inspired", "oud-for-greatness-inspired", "oud-mood-inspired", "haltane-inspired", "alien-man-inspired", "royal-oud-inspired", "invictus-victory-absolu-inspired", "ombre-leather-inspired", "oud-bergamot-inspired", "boss-bottled-elixir-inspired"],
    wardrobePartners: ["baccarat-rouge-540-extrait-inspired", "crystal-noir-inspired", "bois-d'argent-inspired", "oud-ispahan-inspired", "khamrah-inspired", "tom-ford-noir-inspired"],
  },

  // ── Intelligence ─────────────────────────────────────────────────────────────
  // First oud record in Wave 2. Anchors the specialist oud position in the collection.
  // sweetness:1 and freshness:1 confirm pure woody-spice dry character.
  // warmth:4 matches Y EDP — substantial but drier than Layton (5) without lavender-vanilla.
  // versatility:2 matches Spicebomb Extreme — specialist, occasion-specific wear.
  sweetness:   1,
  freshness:   1,
  warmth:      4,
  intensity:   4,
  versatility: 2,
  popularity:  5,
};
