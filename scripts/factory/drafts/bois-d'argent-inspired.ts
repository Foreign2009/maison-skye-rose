// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — bois-d'argent-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-16T18:51:58.905Z
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

export const boisDargentInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "bois-d'argent-inspired",
  slug          : "bois-d'argent-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Bois d'Argent Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Floral", "Woody"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Woody Floral",
  season        : "Autumn",
  notes: {
    top:   ["Iris", "Cypress", "Juniper Berries"],
    heart: ["Myrrh", "Patchouli"],
    base:  [
      "Woodsy Notes",
      "Honey",
      "Vanilla",
      "Amber",
      "Resins",
      "Musk",
      "Leather",
    ],
  },
  mood          : "Woody Floral",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Sophisticated",
    "Warm",
    "Elegant",
    "Earthy",
    "Mature",
  ],
  occasions     : ["Office", "Date Night", "Evening", "Formal"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Woody Floral Sophistication", "Amber Timber Signature", "Earthy Refined"],
  recommendedFor: [
    "Men seeking a sophisticated woody floral that bridges freshness and warmth for professional and evening contexts.",
    "Those who appreciate iris and leather as anchors for refined, earthy masculinity.",
    "Anyone building a signature collection who wants autumn depth without sacrificing versatility across seasons.",
    "Men drawn to balanced amber and resin compositions that feel mature and contemplative.",
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
  subtitle      : "Amber Timber",
  description   : "Iris and cypress open with austere clarity, then myrrh and patchouli deepen into a resinous warmth. Honeyed woods and leather settle into a soft amber base—earthy sophistication that feels like late autumn light through bare branches.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "what-makes-a-signature-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "woody-floral",
    "iris",
    "patchouli",
    "amber",
    "leather",
    "signature-scent",
    "autumn",
    "balanced",
    "office-wear",
    "date-night",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 3,
  warmth        : 3,
  intensity     : 3,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["prada-l'homme-inspired", "valentino-uomo-born-in-roma-inspired"],
    wardrobePartners: ["spicebomb-extreme-inspired", "oud-wood-inspired"],
  },
};
