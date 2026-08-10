// Maison Knowledge Catalogue — Ultra Male Inspired
import type { FragranceKnowledge } from "../types";

export const ultraMaleInspired: FragranceKnowledge = {

  // ── Identity ─────────────────────────────────────────────────────────────────
  id:             "ultra-male-inspired",
  slug:           "ultra-male-inspired",
  brand:          "Maison Skye & Rose",
  name:           "Ultra Male Inspired",
  collection:     "Skye",
  catalogVersion: "1.0",
  status:         "active",

  // ── Classification ───────────────────────────────────────────────────────────
  gender:         "male",
  family:         ["Sweet", "Amber", "Gourmand"],
  scentCharacter: "Rich & Full-Bodied",
  projection:     "strong",

  // ── Composition ──────────────────────────────────────────────────────────────
  profile: "Sweet Amber",
  season:  "Winter",
  notes: {
    top:   ["Pear", "Bergamot", "Lavender"],
    heart: ["Cinnamon", "Licorice", "Iris", "Amber"],
    base:  ["Vanilla", "Caramel", "White Musk"],
  },
  mood: "Sweet, magnetic and completely unapologetic — a fragrance that turns heads and demands attention.",

  // ── Discovery ────────────────────────────────────────────────────────────────
  vibe:           ["Confident", "Sexy", "Bold", "Playful", "Modern"],
  occasions:      ["Date Night", "Evening", "Winter Evenings", "Weekend"],
  seasons:        ["Autumn", "Winter"],
  signatureStyle: ["Sweet Seduction", "Compliment Magnet", "Winter Crowd Pleaser"],
  recommendedFor: [
    "Men who want maximum social impact from a sweet, crowd-pleasing signature",
    "Evening occasions and date nights in autumn and winter",
    "Those who enjoy gourmand and sweet fragrances without apology",
    "Fragrance beginners looking for something immediately likeable and attention-commanding",
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
  subtitle: "Compliment Magnet",
  description:
    "Ultra Male Inspired is Maison's interpretation of the fragrance that proved sweet masculines could be genuinely powerful. " +
    "Pear and Lavender open with a sweetness that is immediate and deliberate — not shy, but the kind of confident sweetness that fills a room before you do. " +
    "The lavender sits within the sweetness rather than above it, giving the opening an aromatic softness that keeps the composition from tipping into pure fruit. " +
    "Cinnamon and Iris in the heart add warm spice — the moment the fragrance moves from likeable to seductive. " +
    "Vanilla and Caramel in the base complete the intention: a creamy, warm character that clings to fabric and skin in exactly the way a memorable fragrance should. " +
    "Wear this with intention — it does not pass unnoticed.",

  // ── Academy integration ───────────────────────────────────────────────────────
  academyArticleIds: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "gourmand-fragrances-guide",
    "oriental-and-amber-fragrances",
    "evening-and-date-night-fragrances",
    "what-makes-a-signature-scent",
  ],
  academyCategories: [
    "fragrance-families",
    "seasonal-guide",
    "building-your-wardrobe",
  ],
  educationTags: [
    "sweet", "gourmand", "amber", "vanilla", "pear", "lavender",
    "cinnamon", "masculine", "winter", "compliment-getter",
  ],
  learningPath: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "gourmand-fragrances-guide",
    "evening-and-date-night-fragrances",
    "choosing-your-season-scent",
  ],

  // ── Relationships ─────────────────────────────────────────────────────────────
  relationships: {
    alternatives: ["black-opium-inspired", "good-girl-inspired"],
    wardrobePartners: ["la-vie-est-belle-inspired"],
  },

  // ── Intelligence ─────────────────────────────────────────────────────────────
  sweetness:   5,
  freshness:   2,
  warmth:      4,
  intensity:   4,
  versatility: 3,
  popularity:  9,
};
