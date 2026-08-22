// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — dark-vanilla-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-22T18:54:41.929Z
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

export const darkVanillaInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "dark-vanilla-inspired",
  slug          : "dark-vanilla-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Dark Vanilla Inspired",
  collection    : "Elite",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "unisex",
  family        : ["Gourmand"],
  scentCharacter: "Rich & Full-Bodied",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Gourmand",
  season        : "Winter",
  notes: {
    top:   [
      "Pink Pepper",
      "Saffron",
      "Cumin",
      "Cardamom",
      "Lemon",
      "Coriander",
    ],
    heart: ["Sandalwood", "Leather", "Oud", "Patchouli"],
    base:  ["Vanilla", "Amber"],
  },
  notesEvidenceLocked: true,
  mood          : "Rich Dark Gourmand",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Rich",
    "Sensual",
    "Sophisticated",
    "Warm",
    "Intense",
    "Mysterious",
  ],
  occasions     : ["Date Night", "Evening", "Winter Evenings", "Formal"],
  seasons       : ["Winter", "Autumn"],
  signatureStyle: ["Dark Gourmand", "Spiced Leather Warmth", "Luxury Depth"],
  recommendedFor: [
    "Those seeking a gourmand fragrance that balances indulgence with dark spice and leather sophistication.",
    "Anyone who loves warm amber and vanilla but wants depth, not sweetness—a winter signature with edge.",
    "Fragrance collectors drawn to oud and patchouli who appreciate rich, full-bodied compositions for evening wear.",
    "Men and women preferring sensual warmth with artisanal spice for intimate gatherings and cooler months.",
  ],

  // ── Merchandising ───────────────────────────────────────────────────────────
  prices: {
    "5ml":  60,
    "10ml": 100,
    "30ml": 250,
  },
  images: {
    "5ml":  "/images/blue-5ml.png",
    "10ml": "/images/blue-10ml.png",
    "30ml": "/images/glass-blue-30ml.png",
  },
  bestSeller    : false,
  newArrival    : false,

  // ── Education ───────────────────────────────────────────────────────────────
  subtitle      : "Spiced Leather Warmth",
  description   : "Pink pepper and saffron ignite a warmth that unfolds into leather and oud—a dark, spiced landscape beneath. Vanilla and amber deepen into a smouldering base—rich and unhurried, without sweetness's typical brightness.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "choosing-your-season-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "gourmand",
    "vanilla",
    "amber",
    "spiced",
    "oud",
    "leather",
    "patchouli",
    "winter",
    "date-night",
    "rich",
    "full-bodied",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 4,
  freshness     : 2,
  warmth        : 2,
  intensity     : 4,
  versatility   : 2,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["spicebomb-extreme-inspired", "hypnotic-poison-inspired"],
    wardrobePartners: ["oud-mood-inspired", "baccarat-rouge-540-inspired"],
  },
};
