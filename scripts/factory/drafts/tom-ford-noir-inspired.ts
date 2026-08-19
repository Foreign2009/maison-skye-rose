// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — tom-ford-noir-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-19T19:00:55.813Z
// Factory version:   0.5.0
// Prompt versions:   EditorialProducer@1.1.0  RelationshipProducer@1.0.0  EducationProducer@1.0.0  DiscoveryProducer@1.0.0
// Validation status: FAIL  [3 error(s), 0 warning(s)]
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

export const tomFordNoirInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "tom-ford-noir-inspired",
  slug          : "tom-ford-noir-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Tom Ford Noir Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Floral"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Oriental Floral",
  season        : "Winter",
  notes: {
    top:   [
      "Violet",
      "Pink Pepper",
      "Caraway",
      "Bergamot",
      "Verbena",
    ],
    heart: [
      "Tuscan Iris",
      "Bulgarian Rose",
      "Black Pepper",
      "Nutmeg",
      "Geranium",
      "Clary Sage",
    ],
    base:  [
      "Indonesian Patchouli Leaf",
      "Amber",
      "Vanilla",
      "Civet",
      "Leather",
      "Opoponax",
      "Benzoin",
      "Vetiver",
      "Styrax",
    ],
  },
  notesEvidenceLocked: true,
  mood          : "Dark Spicy Oriental",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Sophisticated",
    "Sensual",
    "Warm",
    "Mysterious",
    "Elegant",
    "Bold",
  ],
  occasions     : ["Date Night", "Evening", "Formal", "Weekend"],
  seasons       : ["Winter", "Autumn"],
  signatureStyle: ["Dark Spicy Oriental", "Velvet Masculine Floral", "Winter Evening Signature"],
  recommendedFor: [
    "Men seeking a refined dark fragrance that balances floral sophistication with spiced warmth for evening occasions.",
    "Those who appreciate rose and iris in a masculine context without sweetness, grounded by leather and patchouli.",
    "Anyone drawn to oriental fragrances who wants velvet sensuality and quiet authority for winter nights and formal settings.",
    "Fragrance enthusiasts building a collection who need a signature evening piece that bridges delicate florals and bold spices.",
  ],

  // ── Merchandising ───────────────────────────────────────────────────────────
  prices: {
    "5ml":  60,
    "10ml": 100,
    "30ml": 250,
  },
  images: {
    "5ml":  "",  // FACTORY_ERROR: IMAGE_MISSING — image path for 5ml is required
    "10ml": "",  // FACTORY_ERROR: IMAGE_MISSING — image path for 10ml is required
    "30ml": "",  // FACTORY_ERROR: IMAGE_MISSING — image path for 30ml is required
  },
  bestSeller    : false,
  newArrival    : false,

  // ── Education ───────────────────────────────────────────────────────────────
  subtitle      : "Velvet Noir",
  description   : "Pink pepper and violet open with a whisper of bergamot before a dark heart of iris and rose emerges, warmed by nutmeg and black pepper. Indonesian patchouli, amber, and civet anchor the composition in shadow, creating an oriental that moves between floral elegance and animalic depth.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "choosing-your-season-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "oriental-floral",
    "rose",
    "iris",
    "amber",
    "vanilla",
    "patchouli",
    "spiced",
    "warm",
    "winter",
    "signature",
    "date-night",
    "leather",
    "pepper",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-layer-fragrances"],

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
    alternatives:     ["prada-l'homme-inspired", "gentleman-edt-inspired"],
    wardrobePartners: ["spicebomb-extreme-inspired", "oud-wood-inspired"],
  },
};
