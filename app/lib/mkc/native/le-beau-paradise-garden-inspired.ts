// Maison Knowledge Catalogue — Le Beau Paradise Garden Inspired
import type { FragranceKnowledge } from "../types";

export const leBeauParadiseGardenInspired: FragranceKnowledge = {

  // ── Identity ─────────────────────────────────────────────────────────────────
  id:             "le-beau-paradise-garden-inspired",
  slug:           "le-beau-paradise-garden-inspired",
  brand:          "Maison Skye & Rose",
  name:           "Le Beau Paradise Garden Inspired",
  collection:     "Skye",
  catalogVersion: "1.0",
  status:         "active",

  // ── Classification ───────────────────────────────────────────────────────────
  gender:         "male",
  family:         ["Fresh", "Sweet", "Vanilla"],
  scentCharacter: "Fresh & Light",
  projection:     "moderate",

  // ── Composition ──────────────────────────────────────────────────────────────
  profile: "Fresh Sweet",
  season:  "Summer",
  notes: {
    top:   ["Coconut", "Bergamot", "Lemon"],
    heart: ["Fig", "White Flowers", "Vanilla"],
    base:  ["Tonka Bean", "Sandalwood", "Musk"],
  },
  mood: "Coconut, fig and a warmth that feels like it arrived from somewhere exotic — sweet summer luxury.",

  // ── Discovery ────────────────────────────────────────────────────────────────
  vibe:           ["Playful", "Elegant", "Luxury", "Romantic", "Modern", "Clean"],
  occasions:      ["Summer Days", "Vacation", "Weekend", "Evening"],
  seasons:        ["Spring", "Summer"],
  signatureStyle: ["Tropical Sweet Luxury", "JPG Paradise", "Summer Evening Indulgence"],
  recommendedFor: [
    "Those who want the collection's most intimate warm-weather option — Le Beau Paradise Garden is softer and sweeter than the bold summer masculines, designed to be discovered up close rather than projected across the room",
    "Vacation and holiday wear where a tropical, unhurried character is appropriate — this is a fragrance that belongs beside the water rather than at the starting line",
    "Men who find most summer masculines too aquatic or too sporty — this fills the sweet tropical position that neither Hawas nor Invictus occupies",
    "Customers building a summer wardrobe who want a second option alongside a fresher daily signature — Le Beau Paradise Garden works as the evening or occasion layer",
  ],

  // ── Merchandising ────────────────────────────────────────────────────────────
  prices: { "5ml": 60, "10ml": 100, "30ml": 250 },
  images: {
    "5ml":  "/images/blue-5ml.png",
    "10ml": "/images/blue-10ml.png",
    "30ml": "/images/glass-blue-30ml.png",
  },
  bestSeller: false,
  newArrival: true,

  // ── Education ────────────────────────────────────────────────────────────────
  subtitle: "Tropical Luxury",
  description:
    "Le Beau Paradise Garden Inspired opens with Coconut and Bergamot in an accord that is instantly tropical — bright, indulgent, and unhurried in its sweetness. " +
    "Fig in the heart introduces a soft, green-sweet dimension that prevents the coconut character from tipping into the obvious, while Vanilla adds a warmth that carries the composition into early evening. " +
    "A new arrival in the collection: the sweet summer option for those who want their fragrance to feel like a destination rather than a departure.",

  // ── Academy integration ───────────────────────────────────────────────────────
  academyArticleIds: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "fresh-citrus-and-aquatic-fragrances",
    "gourmand-fragrances-guide",
    "choosing-your-season-scent",
    "how-to-wear-fragrance",
  ],
  academyCategories: [
    "fragrance-families",
    "seasonal-guide",
    "occasion-guide",
  ],
  educationTags: [
    "coconut", "fig", "tonka", "vanilla", "sweet", "tropical", "fresh",
    "masculine", "summer", "spring", "vacation", "new-arrival",
  ],
  learningPath: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "fresh-citrus-and-aquatic-fragrances",
    "choosing-your-season-scent",
  ],

  // ── Relationships ─────────────────────────────────────────────────────────────
  relationships: {
    wardrobePartners: ["hawas-inspired"],
  },

  // ── Intelligence ─────────────────────────────────────────────────────────────
  // Tropical sweet summer benchmark. Occupies the sweet-fresh summer position that
  // no existing record covered: sweetness:4 in a summer/fresh frame, compared to
  // Hawas (sweetness:3, intensity:4 — bold projection) and God of Fire
  // (sweetness:3, freshness:4 — mango tropical energy). Le Beau Paradise Garden
  // is softer and more intimate than both (intensity:2) with a higher sweetness.
  // The coconut/fig/tonka tropical route to sweetness:4.
  sweetness:   4,
  freshness:   3,
  warmth:      2,
  intensity:   2,
  versatility: 3,
  popularity:  4,
};
