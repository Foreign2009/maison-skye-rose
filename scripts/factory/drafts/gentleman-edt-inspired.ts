// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — gentleman-edt-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-16T18:11:26.906Z
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

export const gentlemanEdtInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "gentleman-edt-inspired",
  slug          : "gentleman-edt-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Gentleman EDT Inspired",
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
  season        : "Autumn",
  notes: {
    top:   ["Pear", "Cardamom", "Pineapple"],
    heart: ["Iris", "Lavender", "Geranium"],
    base:  ["Leather", "Black Vanilla Husk", "Patchouli"],
  },
  mood          : "Elegant Masculine Spicy",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Elegant",
    "Sophisticated",
    "Warm",
    "Confident",
    "Spicy",
    "Restrained",
  ],
  occasions     : ["Office", "Date Night", "Evening", "Formal"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Elegant Masculine Spice", "Balanced Signature", "Refined Oriental Floral"],
  recommendedFor: [
    "Men seeking a refined signature that balances spice and floral sophistication for professional and evening occasions",
    "Those who appreciate restrained intensity—cardamom and leather over sweetness or aggression",
    "Anyone building a wardrobe fragrance that pairs seamlessly with tailored autumn wear and date night dressing",
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
  subtitle      : "Restrained Intensity",
  description   : "Cardamom and pear open with quiet intensity, giving way to iris and lavender that speak of restraint and precision. Leather and black vanilla husk anchor the composition—a masculine warmth that refuses to whisper.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "what-makes-a-signature-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "oriental-floral",
    "iris",
    "lavender",
    "leather",
    "patchouli",
    "cardamom",
    "balanced",
    "signature",
    "versatile",
    "office",
    "date-night",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 3,
  warmth        : 2,
  intensity     : 3,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["prada-l'homme-inspired", "myslf-inspired"],
    wardrobePartners: ["spicebomb-extreme-inspired"],
  },
};
