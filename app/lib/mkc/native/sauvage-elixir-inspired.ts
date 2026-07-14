// Maison Knowledge Catalogue — Sauvage Elixir Inspired
import type { FragranceKnowledge } from "../types";

export const sauvageElixirInspired: FragranceKnowledge = {

  // ── Identity ─────────────────────────────────────────────────────────────────
  id:             "sauvage-elixir-inspired",
  slug:           "sauvage-elixir-inspired",
  brand:          "Maison Skye & Rose",
  name:           "Sauvage Elixir Inspired",
  collection:     "Skye",
  catalogVersion: "1.0",
  status:         "active",

  // ── Classification ───────────────────────────────────────────────────────────
  gender:         "male",
  family:         ["Spicy", "Woody", "Aromatic"],
  scentCharacter: "Rich & Long Wearing",
  projection:     "strong",

  // ── Composition ──────────────────────────────────────────────────────────────
  profile: "Spicy Woody",
  season:  "Winter",
  notes: {
    top:   ["Nutmeg", "Grapefruit", "Cardamom", "Cinnamon"],
    heart: ["Lavender", "Geranium"],
    base:  ["Sandalwood", "Licorice", "Amber", "Vetiver"],
  },
  mood: "Concentrated, dark and authoritative — the Sauvage DNA distilled to its most powerful form.",

  // ── Discovery ────────────────────────────────────────────────────────────────
  vibe:           ["Powerful", "Bold", "Mysterious", "Confident", "Sophisticated"],
  occasions:      ["Evening", "Date Night", "Winter Evenings", "Weekend"],
  seasons:        ["Autumn", "Winter"],
  signatureStyle: ["Concentrated Authority", "Dark Sauvage", "Winter Statement"],
  recommendedFor: [
    "Men seeking the most intense expression of the Sauvage DNA — amplified and uncompromising",
    "Evening occasions and date nights in cold autumn and winter conditions",
    "Those who already own Sauvage Inspired and want a darker, warmer companion for the coldest months",
    "Fragrance connoisseurs who appreciate concentrated, high-intensity masculines",
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

  // ── Education ────────────────────────────────────────────────────────────────
  subtitle: "Ultimate Power",
  description:
    "Sauvage Elixir Inspired captures the DNA of Dior's most concentrated masculine — amplified, darkened, and stripped of everything unnecessary. " +
    "Where Sauvage Inspired opens with bergamot brightness, the Elixir opens with weight: Nutmeg, Cardamom and Cinnamon announce themselves with dry, immediate spice that leaves no ambiguity about the direction of travel. " +
    "Lavender in the heart preserves a trace of the original Sauvage character — the aromatic quality that made the line iconic — but here it is surrounded by warmth rather than freshness, grounded rather than lifted. " +
    "Sandalwood, Licorice and a deep Amber accord in the base create a dry, resinous presence that is assertive rather than sweet, masculine in the truest sense of the word. " +
    "Apply with restraint in enclosed spaces — this concentration is built for cold air and open evenings, where the spice and depth have room to settle.",

  // ── Academy integration ───────────────────────────────────────────────────────
  academyArticleIds: [
    "guide-to-fragrance-families",
    "the-note-pyramid-explained",
    "choosing-your-season-scent",
    "what-makes-a-signature-scent",
  ],
  academyCategories: [
    "fragrance-families",
    "seasonal-guide",
  ],
  educationTags: [
    "spicy", "woody", "nutmeg", "cardamom", "sandalwood", "licorice",
    "lavender", "masculine", "winter", "concentrated", "intense",
  ],
  learningPath: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "choosing-your-season-scent",
    "what-makes-a-signature-scent",
  ],

  // ── Relationships ─────────────────────────────────────────────────────────────
  relationships: {
    evolutionOf: "sauvage-inspired",
    wardrobePartners: ["carlisle-inspired", "creed-green-irish-tweed-inspired", "ombre-nomade-inspired", "torino21-inspired"],
    alternatives: ["oud-for-greatness-inspired", "gris-charnel-inspired"],
  },

  // ── Intelligence ─────────────────────────────────────────────────────────────
  sweetness:   2,
  freshness:   3,
  warmth:      4,
  intensity:   5,
  versatility: 2,
  popularity:  8,
};
