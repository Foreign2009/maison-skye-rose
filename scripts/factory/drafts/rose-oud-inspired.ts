// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — rose-oud-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-16T17:08:42.738Z
// Factory version:   0.5.0
// Prompt versions:   EditorialProducer@1.1.0  RelationshipProducer@1.0.0  EducationProducer@1.0.0  DiscoveryProducer@1.0.0
// Validation status: PASS  [0 error(s), 0 warning(s)]
// Projected KQ tier: (not available — requires Intelligence Producer)
// ─────────────────────────────────────────────────────────────────
// REVIEW CHECKLIST
//   □ Notes pyramid verified (≥ 2 per tier, no cross-tier duplicates)
//   □ Description reviewed in Maison editorial voice
//   □ Vibe tags meet minimum of 3 (from approved vocabulary)
//   □ recommendedFor has minimum of 2 persona statements
//   □ All FACTORY_ERROR markers resolved
//   □ All FACTORY_WARN markers reviewed
//   □ Relationship suggestions reviewed (see footer)
//   □ npm run mkc:validate passes before promotion
// ═════════════════════════════════════════════════════════════════

import type { FragranceKnowledge } from "../../../app/lib/mkc/types";

export const roseOudInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "rose-oud-inspired",
  slug          : "rose-oud-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Rose Oud Inspired",
  collection    : "Elite",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "unisex",
  family        : ["Floral"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Oriental Floral",
  season        : "Winter",
  notes: {
    top:   ["Bulgarian Rose", "Saffron", "Cinnamon"],
    heart: ["Tincture of Rose", "Litchi"],
    base:  ["Agarwood (Oud)", "Cypriol Oil/Nagarmotha", "Cedarwood"],
  },
  mood          : "Smoky Romantic Oriental",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Romantic",
    "Sophisticated",
    "Sensual",
    "Mysterious",
    "Warm",
    "Luxurious",
  ],
  occasions     : ["Date Night", "Evening", "Formal", "Weekend"],
  seasons       : ["Winter", "Autumn"],
  signatureStyle: ["Spiced Floral Romance", "Oriental Elegance", "Smoky Rose Signature"],
  recommendedFor: [
    "Anyone seeking a sophisticated rose fragrance that balances spice and sensuality without sweetness or lightness.",
    "Those drawn to oud and agarwood who want a wearable oriental that centers on rose rather than raw wood.",
    "Women and men who wear velvet, leather, and dark florals and want their signature winter evening scent.",
    "Fragrance collectors building a curated wardrobe who recognise rose oud as a modern classic register.",
  ],

  // ── Merchandising ───────────────────────────────────────────────────────────
  prices: {
    "5ml":  60,
    "10ml": 100,
    "30ml": 250,
  },
  images: {
    "5ml":  "/images/pink-5ml.png",
    "10ml": "/images/pink-10ml.png",
    "30ml": "/images/glass-pink-30ml.png",
  },
  bestSeller    : false,
  newArrival    : false,

  // ── Education ───────────────────────────────────────────────────────────────
  subtitle      : "Spiced Velvet Romance",
  description   : "Opens with Bulgarian rose and saffron—a spiced floral that immediately commands attention. The heart deepens into a tincture of rose and litchi, a sensual pairing that blurs sweetness with shadow, while agarwood and cedarwood anchor the composition in smoke and velvet warmth.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "oriental-floral",
    "rose",
    "oud",
    "agarwood",
    "saffron",
    "cedarwood",
    "romantic",
    "winter",
    "signature",
    "layering",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 3,
  warmth        : 2,
  intensity     : 4,
  versatility   : 2,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["baccarat-rouge-540-inspired", "oud-mood-inspired"],
    wardrobePartners: ["delina-inspired"],
  },
};
