// Maison Knowledge Catalogue — Baccarat Rouge 540 Inspired
import type { FragranceKnowledge } from "../types";

export const baccaratRouge540Inspired: FragranceKnowledge = {

  // ── Identity ─────────────────────────────────────────────────────────────────
  id:             "baccarat-rouge-540-inspired",
  slug:           "baccarat-rouge-540-inspired",
  brand:          "Maison Skye & Rose",
  name:           "Baccarat Rouge 540 Inspired",
  collection:     "Rose",
  catalogVersion: "1.0",
  status:         "active",

  // ── Classification ───────────────────────────────────────────────────────────
  // First unisex record in the Rose collection.
  // Establishes the luxury unisex amber-floral benchmark for the catalogue.
  // Future unisex records calibrate against BR540 for warmth, versatility, and intensity.
  gender:         "unisex",
  family:         ["Amber", "Floral", "Musk"],
  scentCharacter: "Rich & Full-Bodied",
  projection:     "strong",

  // ── Composition ──────────────────────────────────────────────────────────────
  profile: "Amber Floral",
  season:  "All Season",
  notes: {
    top:   ["Saffron", "Jasmine"],
    heart: ["Amberwood", "Ambergris", "Cedar"],
    base:  ["Fir Resin", "Musk"],
  },
  mood: "Amberwood, saffron and the impossible paradox — a fragrance that feels simultaneously airy and deeply rich.",

  // ── Discovery ────────────────────────────────────────────────────────────────
  // Rose editorial direction applies to Rose collection records even when gender is unisex.
  // ≥2 Rose/Elite vibes required — "Sensual" and "Elegant" satisfy the requirement.
  vibe:           ["Luxury", "Sophisticated", "Elegant", "Sensual", "Mysterious", "Wealthy"],
  occasions:      ["Date Night", "Evening", "Daily Wear", "Weekend", "Office"],
  seasons:        ["Spring", "Summer", "Autumn", "Winter"],
  signatureStyle: ["The Niche Icon", "Signature Statement", "Modern Luxury Standard"],
  recommendedFor: [
    "Anyone seeking a unisex signature that will be recognised and admired — BR540 is the modern luxury standard",
    "Those who want all-season, all-occasion wear from a single statement fragrance with genuine cultural cachet",
    "The fragrance for those who have tried everything and returned to the one that cannot be replaced",
    "Rose collection wearers seeking the most prestigious unisex option in the collection",
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
  subtitle: "Luxury Icon",
  description:
    "Baccarat Rouge 540 Inspired is the most recognised niche fragrance of the modern era, and this interpretation earns that reputation. " +
    "Saffron and Jasmine open in a luminous, immediately arresting accord — warm without weight, distinctive without demanding attention. " +
    "Amberwood in the heart is the signature: simultaneously sweet, woody and inexplicably airy, the paradox that made the original a cultural landmark. " +
    "All-season wear, genuinely unisex, at home on the wrist of someone leaving for work as it is on someone arriving for the evening. " +
    "The unisex luxury benchmark for the Rose collection and the modern amber-floral standard for the Maison catalogue.",

  // ── Academy integration ───────────────────────────────────────────────────────
  academyArticleIds: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "oriental-and-amber-fragrances",
    "the-world-of-floral-fragrances",
    "evening-and-date-night-fragrances",
    "what-makes-a-signature-scent",
  ],
  academyCategories: [
    "fragrance-families",
    "building-your-wardrobe",
    "fragrance-fundamentals",
  ],
  educationTags: [
    "amber", "amberwood", "floral", "jasmine", "saffron", "musk",
    "unisex", "all-season", "luxury", "niche", "signature", "iconic",
  ],
  learningPath: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "oriental-and-amber-fragrances",
    "evening-and-date-night-fragrances",
    "what-makes-a-signature-scent",
  ],

  // ── Relationships ─────────────────────────────────────────────────────────────
  relationships: {
    wardrobePartners: ["kirke-overdose-inspired", "libre-inspired", "my-way-inspired", "oud-mood-inspired", "vanilla-28-inspired", "gentle-fluidity-gold-inspired", "gris-charnel-inspired", "haltane-inspired", "j'adore-inspired", "hypnotic-poison-inspired", "bright-crystal-inspired", "carmina-inspired", "decision-inspired", "omnia-green-jade-inspired", "rose-of-no-man's-land-inspired", "royal-oud-inspired", "si-passione-red-musk-inspired", "wood-sage-sea-salt-inspired", "peony-blush-suede-inspired", "velvet-rose-oud-inspired", "english-pear-freesia-inspired", "angels-share-inspired", "tuscan-leather-inspired"],
    alternatives: ["alien-inspired", "baccarat-rouge-540-extrait-inspired", "crystal-noir-inspired", "delina-exclusif-inspired", "libre-intense-inspired", "libre-le-parfum-inspired", "prada-paradoxe-inspired", "valentino-donna-born-in-roma-inspired", "guidance-inspired", "hibiscus-mahajad-inspired", "arabians-musk-inspired", "rose-oud-inspired", "oud-ispahan-inspired", "black-orchid-inspired", "soleil-blanc-inspired", "narciso-rouge-inspired"],
  },

  // ── Intelligence ─────────────────────────────────────────────────────────────
  // Luxury unisex amber reference — see docs/mkc-authoring-guide.md calibration anchors.
  // sweetness:3 and freshness:3 are both population mean — intentional.
  // BR540 is simultaneously sweet and airy: intelligence reflects the paradox, not a forced category.
  sweetness:   3,
  freshness:   3,
  warmth:      4,
  intensity:   4,
  versatility: 4,
  popularity:  9,
};
