// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — azzaro-wanted-by-night-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-09-13T12:43:59.587Z
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

export const azzaroWantedByNightInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "azzaro-wanted-by-night-inspired",
  slug          : "azzaro-wanted-by-night-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Azzaro Wanted By Night Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Tobacco", "Woody", "Spicy"],
  scentCharacter: "Deep & Intense",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Woody Spicy Tobacco",
  season        : "Autumn",
  notes: {
    top:   ["Cinnamon", "Mandarin Orange", "Lavender", "Lemon"],
    heart: ["Fruity Notes", "Red Cedar", "Cumin", "Incense"],
    base:  [
      "Tobacco",
      "Vanilla",
      "Cedar",
      "Leather",
      "Cypress",
      "Iso E Super",
      "Patchouli",
      "Benzoin",
    ],
  },
  notesEvidenceLocked: true,
  mood          : "Bold Sensual Dark",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Sensual",
    "Bold",
    "Sophisticated",
    "Mysterious",
    "Warm",
    "Intense",
  ],
  occasions     : ["Date Night", "Evening", "Office", "Weekend"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Masculine Sensuality", "Tobacco & Leather", "Evening Intensity"],
  recommendedFor: [
    "Men seeking a sophisticated evening fragrance that balances spicy warmth with leather and tobacco depth",
    "Those who want bold sensuality without sweetness — smoky, aromatic, and unmistakably confident",
    "Anyone building a signature collection who needs a darker, more intense alternative to fresh daytime fragrances",
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
  subtitle      : "Smoke & Spice",
  description   : "Cinnamon and mandarin ignite against cool lavender, then settle into a warm heart of red cedar and cumin that feels both aromatic and intimate. Tobacco and leather anchor the composition, creating a dark, sensual base that unfolds with quiet intensity and the subtle sweetness of vanilla and benzoin.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "how-to-wear-fragrance"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "tobacco",
    "woody",
    "spicy",
    "cinnamon",
    "cedar",
    "leather",
    "sensual",
    "bold",
    "autumn",
    "layering",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 1,
  warmth        : 4,
  intensity     : 3,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["spicebomb-extreme-inspired", "tobacco-vanille-inspired"],
    wardrobePartners: ["sauvage-inspired", "bleu-de-chanel-inspired"],
  },
};
