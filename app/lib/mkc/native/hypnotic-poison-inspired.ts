// Maison Knowledge Catalogue — Hypnotic Poison Inspired
import type { FragranceKnowledge } from "../types";

export const hypnoticPoisonInspired: FragranceKnowledge = {

  // ── Identity ─────────────────────────────────────────────────────────────────
  id:             "hypnotic-poison-inspired",
  slug:           "hypnotic-poison-inspired",
  brand:          "Maison Skye & Rose",
  name:           "Hypnotic Poison Inspired",
  collection:     "Rose",
  catalogVersion: "1.0",
  status:         "active",

  // ── Classification ───────────────────────────────────────────────────────────
  // Dark almond gourmand reference for the Rose collection.
  // Establishes the bitter-almond register for Rose — distinct from the milky
  // gourmand route (Bianco Latte) and the coffee route (Black Opium).
  gender:         "female",
  family:         ["Gourmand", "Vanilla", "Floral"],
  scentCharacter: "Rich & Long Wearing",
  projection:     "strong",

  // ── Composition ──────────────────────────────────────────────────────────────
  profile: "Dark Almond Gourmand",
  season:  "Winter",
  notes: {
    top:   ["Bitter Almond", "Plum", "Apricot"],
    heart: ["Jasmine", "Rose", "Carrot Seeds"],
    base:  ["Vanilla", "Sandalwood", "Musk", "Coconut"],
  },
  mood: "Bitter almond and vanilla locked in a dark accord — the fragrance that defined what the modern feminine gourmand should feel like.",

  // ── Discovery ────────────────────────────────────────────────────────────────
  // Rose editorial direction: Elegant, Feminine, Expressive.
  // Dark character places emphasis on Sensual and Mysterious over delicate femininity.
  vibe:           ["Sensual", "Mysterious", "Feminine", "Sexy", "Bold", "Elegant", "Sophisticated"],
  occasions:      ["Date Night", "Evening", "Weekend", "Winter Evenings"],
  seasons:        ["Winter", "Autumn"],
  signatureStyle: ["Dark Feminine Icon", "Almond Vanilla Accord", "Winter Evening Statement"],
  recommendedFor: [
    "Women who want a signature that announces itself — the bitter almond and vanilla accord is impossible to mistake and leaves a trail that stays",
    "Those who wear fragrance as a deliberate mood setter for evenings and special occasions: the warm, dark character transforms any atmosphere",
    "Anyone who loves vanilla but wants depth and edge rather than sweetness alone — the bitter almond introduces a complexity that straightforward vanilla cannot",
    "Collectors of the feminine oriental tradition who want the reference that shaped an entire category of warm feminine perfumery",
  ],

  // ── Merchandising ────────────────────────────────────────────────────────────
  prices: { "5ml": 60, "10ml": 100, "30ml": 250 },
  images: {
    "5ml":  "/images/pink-5ml.png",
    "10ml": "/images/pink-10ml.png",
    "30ml": "/images/glass-pink-30ml.png",
  },
  bestSeller: true,
  newArrival: false,

  // ── Education ────────────────────────────────────────────────────────────────
  subtitle: "Dark Vanilla",
  description:
    "Hypnotic Poison Inspired is the fragrance that rewrote what a feminine oriental could be. " +
    "Bitter almond and plum open with a dark richness that is immediately distinctive — recognisable from the first moment of contact. " +
    "Jasmine and rose in the heart bring a femininity that softens without lightening; this is not a fragrance that ever becomes gentle. " +
    "Vanilla, sandalwood and musk settle into the base as a warm, addictive presence — a skin scent that lingers for hours and invites closeness.",

  // ── Academy integration ───────────────────────────────────────────────────────
  academyArticleIds: [
    "guide-to-fragrance-families",
    "the-note-pyramid-explained",
    "what-makes-a-signature-scent",
    "choosing-your-season-scent",
  ],
  academyCategories: [
    "fragrance-families",
    "the-note-pyramid",
    "building-your-wardrobe",
  ],
  educationTags: [
    "gourmand", "vanilla", "almond", "jasmine", "dark", "oriental",
    "feminine", "winter", "date-night", "sensual",
  ],
  learningPath: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "what-makes-a-signature-scent",
    "choosing-your-season-scent",
  ],

  // ── Relationships ─────────────────────────────────────────────────────────────
  relationships: {
    alternatives: [
      "black-opium-inspired",
      "delina-exclusif-inspired",
      "la-vie-est-belle-inspired",
      "love-don't-be-shy-inspired",
      "kayali-vanilla-28-inspired",
    ],
    wardrobePartners: ["delina-inspired", "baccarat-rouge-540-inspired"],
  },

  // ── Intelligence ─────────────────────────────────────────────────────────────
  // Calibrated against Rose anchor records:
  //   Delina           — sweetness:2 / freshness:4 / warmth:2 (fresh floral baseline)
  //   Baccarat Rouge 540 — sweetness:3 / warmth:4 (warm unisex amber anchor)
  //   Black Opium      — sweetness:4 / freshness:1 / warmth:4 (dark feminine gourmand sibling)
  // Almond/vanilla bitterness tempers sweetness to 4 rather than 5:
  //   the bitter almond dries the accord relative to Bianco Latte (milky, sweetness:5 candidate)
  //   and Le Male Elixir (honey/tonka, sweetness:5). intensity:4 reflects documented strong
  //   sillage and trail. versatility:2 — specialist evening/winter occasion only.
  sweetness:   4,
  freshness:   1,
  warmth:      4,
  intensity:   4,
  versatility: 2,
  popularity:  9,
};
