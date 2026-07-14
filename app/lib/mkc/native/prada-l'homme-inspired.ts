// Maison Knowledge Catalogue — Prada L'Homme Inspired
import type { FragranceKnowledge } from "../types";

export const pradaLHommeInspired: FragranceKnowledge = {

  // ── Identity ─────────────────────────────────────────────────────────────────
  id:             "prada-l'homme-inspired",
  slug:           "prada-l'homme-inspired",
  brand:          "Maison Skye & Rose",
  name:           "Prada L'Homme Inspired",
  collection:     "Skye",
  catalogVersion: "1.0",
  status:         "active",

  // ── Classification ───────────────────────────────────────────────────────────
  gender:         "male",
  family:         ["Woody", "Powdery", "Aromatic"],
  scentCharacter: "Balanced Signature",
  projection:     "soft",

  // ── Composition ──────────────────────────────────────────────────────────────
  profile: "Powdery Iris Woody",
  season:  "All Season",
  notes: {
    top:   ["Neroli", "Amber"],
    heart: ["Iris", "Geranium", "Vetiver"],
    base:  ["Sandalwood", "Cedar"],
  },
  mood: "Clean, powdery elegance — the fragrance for those who lead with quiet confidence.",

  // ── Discovery ────────────────────────────────────────────────────────────────
  vibe:           ["Sophisticated", "Elegant", "Professional", "Clean", "Confident"],
  occasions:      ["Office", "Daily Wear", "Date Night", "Weekend"],
  seasons:        ["Spring", "Summer", "Autumn", "Winter"],
  signatureStyle: ["Office King", "Quiet Luxury", "Intellectual Elegance"],
  recommendedFor: [
    "Men who appreciate understated refinement over loud or obvious fragrances",
    "Office environments where quiet, well-dressed presence is the goal",
    "Those who enjoy iris and powdery florals in a distinctly masculine context",
    "Daily wear that rewards proximity rather than projecting across the room",
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
  featured:   false,

  // ── Education ────────────────────────────────────────────────────────────────
  subtitle: "Office King",
  description:
    "Prada L'Homme Inspired channels the quiet authority of one of the most underrated masculines in contemporary perfumery. " +
    "Neroli opens the composition with a soft citrus-floral sweetness — delicate and considered, not aggressive. " +
    "Iris is the signature note: powdery, pale, almost cool in its precision — in this heart it is joined by Geranium and Vetiver, which produce a green-earthy counterpoint that prevents the fragrance from feeling one-dimensional. " +
    "Sandalwood and Cedar in the base are quietly warm and creamy, anchoring everything without adding obvious heaviness. " +
    "This is the fragrance for the man whose presence is felt before he speaks.",

  // ── Academy integration ───────────────────────────────────────────────────────
  academyArticleIds: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "how-to-wear-fragrance",
  ],
  academyCategories: [
    "fragrance-families",
    "building-your-wardrobe",
  ],
  educationTags: [
    "iris", "powdery", "woody", "neroli", "sandalwood", "cedar",
    "masculine", "office", "elegant", "all-season",
  ],
  learningPath: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "how-to-wear-fragrance",
  ],

  // ── Relationships ─────────────────────────────────────────────────────────────
  relationships: {
    alternatives: ["prada-luna-rossa-carbon-inspired"],
    wardrobePartners: ["afternoon-swim-inspired"],
  },

  // ── Intelligence ─────────────────────────────────────────────────────────────
  sweetness:   2,
  freshness:   2,
  warmth:      3,
  intensity:   2,
  versatility: 4,
  popularity:  6,
};
