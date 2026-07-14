// Maison Knowledge Catalogue — Stronger With You Inspired
import type { FragranceKnowledge } from "../types";

export const strongerWithYouInspired: FragranceKnowledge = {

  // ── Identity ─────────────────────────────────────────────────────────────────
  id:             "stronger-with-you-inspired",
  slug:           "stronger-with-you-inspired",
  brand:          "Maison Skye & Rose",
  name:           "Stronger With You Inspired",
  collection:     "Skye",
  catalogVersion: "1.0",
  status:         "active",

  // ── Classification ───────────────────────────────────────────────────────────
  gender:         "male",
  family:         ["Aromatic", "Amber", "Spicy"],
  scentCharacter: "Rich & Long Wearing",
  projection:     "strong",

  // ── Composition ──────────────────────────────────────────────────────────────
  profile: "Sweet Spicy",
  season:  "Winter",
  notes: {
    top:   ["Chestnut", "Pink Pepper", "Bergamot"],
    heart: ["Cinnamon", "Salvia", "Violet"],
    base:  ["Vanilla", "Cashmeran", "Sandalwood"],
  },
  mood: "Chestnut warmth, cinnamon edge and a quiet confidence that gets stronger the closer you are.",

  // ── Discovery ────────────────────────────────────────────────────────────────
  vibe:           ["Confident", "Romantic", "Warm", "Modern", "Sophisticated", "Bold"],
  occasions:      ["Date Night", "Evening", "Weekend", "Autumn Evenings", "Winter Days"],
  seasons:        ["Autumn", "Winter"],
  signatureStyle: ["Modern Romantic", "Warm Spice Authority", "Armani Confidence"],
  recommendedFor: [
    "Those entering the sweet-spicy masculine space for the first time — this offers immediate warmth and appeal without the intensity of heavier amber fragrances in the collection",
    "Date night and evening occasions where a warm, romantic presence is the appropriate register — the chestnut-vanilla character creates genuine closeness",
    "Men transitioning from summer freshness into autumn — the chestnut-cinnamon warmth signals the seasonal change with authority and a distinctive personality",
    "Customers building a cold-weather wardrobe alongside a fresher daily driver — Stronger With You fills the evening-occasion position clearly",
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
    "Stronger With You Inspired opens with roasted Chestnut — warm, unexpected, and immediately distinctive — before Cinnamon and Salvia layer a spiced accord that is confident without aggression. " +
    "Violet in the heart adds a quietly sophisticated floral thread that elevates the composition beyond the sweet-spicy category. " +
    "Vanilla and Cashmeran build the base into a rich, enveloping warmth — a modern masculine built for the colder months and the occasions that matter most.",

  // ── Academy integration ───────────────────────────────────────────────────────
  academyArticleIds: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "choosing-your-season-scent",
    "what-makes-a-signature-scent",
  ],
  academyCategories: [
    "fragrance-families",
    "seasonal-guide",
    "building-your-wardrobe",
  ],
  educationTags: [
    "vanilla", "cinnamon", "chestnut", "spicy", "sweet", "amber", "aromatic",
    "masculine", "autumn", "winter", "romantic", "modern",
  ],
  learningPath: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "choosing-your-season-scent",
    "what-makes-a-signature-scent",
  ],

  // ── Relationships ─────────────────────────────────────────────────────────────
  relationships: {
    evolutions: ["stronger-with-you-intensely-inspired"],
    alternatives: ["carlisle-inspired"],
    wardrobePartners: ["l'immensite-inspired"],
  },

  // ── Intelligence ─────────────────────────────────────────────────────────────
  // Sweet-spicy warm anchor for Wave 2. Comparable to Layton (sweetness:4, warmth:4)
  // but Layton's lavender-amber structure is heavier. Chestnut-violet gives personality
  // at a more approachable intensity — intensity:3 vs Layton's intensity:4.
  sweetness:   4,
  freshness:   2,
  warmth:      4,
  intensity:   3,
  versatility: 3,
  popularity:  6,
};
