// Maison Knowledge Catalogue — Valentino Uomo Born In Roma Inspired
import type { FragranceKnowledge } from "../types";

export const valentinoUomoBornInRomaInspired: FragranceKnowledge = {

  // ── Identity ─────────────────────────────────────────────────────────────────
  id:             "valentino-uomo-born-in-roma-inspired",
  slug:           "valentino-uomo-born-in-roma-inspired",
  brand:          "Maison Skye & Rose",
  name:           "Valentino Uomo Born In Roma Inspired",
  collection:     "Skye",
  catalogVersion: "1.0",
  status:         "active",

  // ── Classification ───────────────────────────────────────────────────────────
  gender:         "male",
  family:         ["Aromatic", "Woody", "Floral"],
  scentCharacter: "Balanced Signature",
  projection:     "moderate",

  // ── Composition ──────────────────────────────────────────────────────────────
  profile: "Woody Aromatic",
  season:  "All Season",
  notes: {
    top:   ["Bergamot", "Lavender", "Sage"],
    heart: ["Violet Leaf", "Clary Sage", "Orris Root"],
    base:  ["Vetiver", "Patchouli", "Iso E Super"],
  },
  mood: "Sage, violet leaf and a woody character that adapts to every season — the signature of a considered wardrobe.",

  // ── Discovery ────────────────────────────────────────────────────────────────
  vibe:           ["Sophisticated", "Elegant", "Clean", "Modern", "Professional", "Confident"],
  occasions:      ["Daily Wear", "Office", "Weekend", "Evening"],
  seasons:        ["Spring", "Summer", "Autumn", "Winter"],
  signatureStyle: ["Italian Aromatic Artistry", "Green Woody Signature", "All-Season Refinement"],
  recommendedFor: [
    "Those building a genuine all-season daily signature — Born In Roma performs with equal confidence in a professional environment, across a weekend, and into the evening without needing to be changed",
    "Men who find most fresh masculines too casual and most rich masculines too heavy — this occupies the thoughtful middle ground with its own distinct Italian aromatic character",
    "Office and professional environments where a clean, green-woody presence earns respect without drawing attention away from the person wearing it",
    "Customers who already wear Terre D'Hermès or Prada L'Homme and want to explore a greener, more contemporary interpretation of the all-occasion aromatic tradition",
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
  subtitle: "Modern Gentleman",
  description:
    "Valentino Uomo Born In Roma Inspired opens with Bergamot and Sage — clean, green, and immediately defined — before Violet Leaf and Clary Sage build a heart of genuine artistic character. " +
    "Orris Root adds a refined powdery quality that sits lightly without heaviness, while Vetiver and Patchouli in the base provide the woody depth that earns the all-season classification. " +
    "A fragrance that does not announce a mood — it reveals a person.",

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
    "fragrance-fundamentals",
    "fragrance-families",
    "building-your-wardrobe",
  ],
  educationTags: [
    "sage", "violet-leaf", "vetiver", "woody", "aromatic", "green", "masculine",
    "all-season", "professional", "versatile", "refined", "italian",
  ],
  learningPath: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "fresh-citrus-and-aquatic-fragrances",
    "office-and-professional-fragrances",
    "what-makes-a-signature-scent",
  ],

  // ── Relationships ─────────────────────────────────────────────────────────────
  relationships: {
    alternatives: ["myslf-inspired", "bleu-de-chanel-l'exclusif-inspired", "bois-d'argent-inspired", "decision-inspired", "godolphin-inspired", "lacoste-noir-inspired", "montblanc-legend-inspired", "montblanc-explorer-inspired", "fahrenheit-inspired", "gucci-guilty-pour-homme-inspired", "cinque-terre-inspired", "egoiste-platinum-inspired", "lacoste-blanc-inspired", "legend-blue-inspired", "uomo-by-zegna-inspired"],
    wardrobePartners: ["valentino-donna-born-in-roma-inspired"],
  },

  // ── Intelligence ─────────────────────────────────────────────────────────────
  // Green aromatic all-season benchmark. Distinguished from Terre D'Hermès
  // (sweetness:1, freshness:3, warmth:3, versatility:5 — earthy mineral) and
  // Prada L'Homme (sweetness:2, intensity:2, versatility:4 — powdery soft) by its
  // green-violet leaf character. intensity:2 with versatility:5 establishes the
  // all-occasion soft-projection pattern: presence through character, not volume.
  // The Italian aromatic reference for the Skye green-woody tier.
  sweetness:   1,
  freshness:   3,
  warmth:      3,
  intensity:   2,
  versatility: 5,
  popularity:  5,
};
