// Maison Knowledge Catalogue — Prada Luna Rossa Carbon Inspired
import type { FragranceKnowledge } from "../types";

export const pradaLunaRossaCarbonInspired: FragranceKnowledge = {

  // ── Identity ─────────────────────────────────────────────────────────────────
  id:             "prada-luna-rossa-carbon-inspired",
  slug:           "prada-luna-rossa-carbon-inspired",
  brand:          "Maison Skye & Rose",
  name:           "Prada Luna Rossa Carbon Inspired",
  collection:     "Skye",
  catalogVersion: "1.0",
  status:         "active",

  // ── Classification ───────────────────────────────────────────────────────────
  gender:         "male",
  family:         ["Fresh", "Aromatic", "Spicy"],
  scentCharacter: "Balanced Signature",
  projection:     "moderate",

  // ── Composition ──────────────────────────────────────────────────────────────
  profile: "Fresh Spicy",
  season:  "All Season",
  notes: {
    top:   ["Bergamot", "Lavender", "Black Pepper"],
    heart: ["Iris", "Laurel", "Vetiver"],
    base:  ["Ambroxan", "Charcoal", "Musks"],
  },
  mood: "Lavender, black pepper and ambroxan in a metallic-clean accord — urban precision with a contemporary masculine edge.",

  // ── Discovery ────────────────────────────────────────────────────────────────
  vibe:           ["Clean", "Modern", "Confident", "Professional", "Sophisticated", "Bold"],
  occasions:      ["Daily Wear", "Office", "Weekend", "Evening"],
  seasons:        ["Spring", "Summer", "Autumn", "Winter"],
  signatureStyle: ["Metallic Aromatic Precision", "Contemporary Urban Confidence", "All-Season Technical Freshness"],
  recommendedFor: [
    "Those who find conventional lavender aromatics too warm or classic in character — Luna Rossa Carbon takes the lavender-bergamot opening and strips it of traditional warmth, replacing it with a metallic precision and charcoal accord that reads as thoroughly contemporary without losing its aromatic foundation",
    "Men who know Prada L'Homme and want to explore a different dimension of the same house sensibility — where L'Homme is powdery and iris-focused with a quiet, close-wearing intimacy, Carbon is clean and metallic with modern technical energy; two distinct expressions of Prada's masculine intelligence",
    "Office and professional environments that suit a clean, precise masculine presence — the ambroxan base projects with understated authority without the sweetness or warmth that would make it feel less appropriate in professional contexts, making Carbon a reliable daily signature for men who prefer their fragrance noticed at the right distance",
    "Customers building a fresh masculine wardrobe who want an alternative to citrus-dominant signatures — Carbon's lavender-charcoal character fills the modern-aromatic position that neither Sauvage's spiced freshness nor the ADG lineage's aquatic freshness covers, adding a genuinely different fresh register to a developing wardrobe",
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
  subtitle: "Urban Luxury",
  description:
    "Prada Luna Rossa Carbon Inspired opens with Bergamot, Lavender and Black Pepper — familiar aromatic territory treated with a precision that removes warmth and replaces it with clean metallic authority. " +
    "Iris and Vetiver in the heart anchor the composition in structured restraint, while the Charcoal and Ambroxan base gives Carbon its defining character: a cool, synthetic freshness that projects with quiet confidence without asking for attention. " +
    "The all-season aromatic masculine for men who have moved past the classics and want something more technically considered in its construction.",

  // ── Academy integration ───────────────────────────────────────────────────────
  academyArticleIds: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "fresh-citrus-and-aquatic-fragrances",
    "oriental-and-amber-fragrances",
    "office-and-professional-fragrances",
    "what-makes-a-signature-scent",
  ],
  academyCategories: [
    "fragrance-fundamentals",
    "fragrance-families",
    "building-your-wardrobe",
  ],
  educationTags: [
    "lavender", "pepper", "ambroxan", "iris", "vetiver", "charcoal",
    "fresh", "aromatic", "modern", "clean", "masculine", "all-season", "professional", "metallic",
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
    alternatives: ["prada-l'homme-inspired"],
  },

  // ── Intelligence ─────────────────────────────────────────────────────────────
  // Metallic aromatic benchmark. Distinct from Prada L'Homme (sweetness:2, freshness:2,
  // warmth:3, intensity:2, versatility:4 — powdery iris, close-wearing intimacy) by character:
  // Carbon is freshness:4 via lavender/ambroxan metallic route (not powdery). Both are Prada
  // masculines with restraint and intelligence; entirely different constructions.
  // Compare with Y Inspired (freshness:4, warmth:3, intensity:3 — fern-aromatic freshness)
  // and Bleu De Chanel (freshness:4, warmth:2 — citrus-woody): Carbon's lavender-charcoal-
  // ambroxan route is the synthetic-modern interpretation of freshness:4, cooler and more
  // technical than both. versatility:4 (not 5): the metallic contemporary character suits
  // modern-casual occasions more naturally than formal or classic settings, unlike the truly
  // all-occasion neutrality of Sauvage or MYSLF. intensity:3 from ambroxan — above the soft
  // tier (Prada L'Homme, Imagination) without reaching bold projection.
  sweetness:   1,
  freshness:   4,
  warmth:      2,
  intensity:   3,
  versatility: 4,
  popularity:  5,
};
