// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — boss-bottled-elixir-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-19T19:02:19.823Z
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

export const bossBottledElixirInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "boss-bottled-elixir-inspired",
  slug          : "boss-bottled-elixir-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Boss Bottled Elixir Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Woody"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Oriental Woody",
  season        : "Autumn",
  notes: {
    top:   ["Frankincense", "Cardamom"],
    heart: ["Patchouli", "Vetiver"],
    base:  ["Labdanum", "Cedar"],
  },
  notesEvidenceLocked: true,
  mood          : "Warm Spicy Resinous",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Warm",
    "Sophisticated",
    "Mysterious",
    "Confident",
    "Sensual",
  ],
  occasions     : ["Office", "Date Night", "Evening", "Weekend"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Warm Oriental Woody", "Amber Resin Signature", "Balanced Sophistication"],
  recommendedFor: [
    "Men seeking a warm, resinous signature that bridges professional polish and evening sophistication.",
    "Those who appreciate spiced woods and amber over fresh citrus, and want resinous depth and earthy complexity.",
    "Anyone building a fragrance wardrobe who needs a confident autumn and winter staple for office and date nights.",
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
  subtitle      : "Amber Resin",
  description   : "Frankincense and cardamom ignite with a sharp, almost medicinal warmth, settling into a rich bed of patchouli and vetiver where earth meets smoke. Labdanum and cedar deepen the composition into something resinous and contemplative—a fragrance that smells like autumn itself, amber-toned and deliberate.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "what-makes-a-signature-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "woody",
    "oriental",
    "patchouli",
    "vetiver",
    "cedar",
    "frankincense",
    "cardamom",
    "labdanum",
    "signature",
    "autumn",
    "office",
    "layering",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "what-makes-a-signature-scent"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 2,
  warmth        : 3,
  intensity     : 3,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["sauvage-elixir-inspired", "oud-wood-inspired"],
    wardrobePartners: ["creed-green-irish-tweed-inspired"],
  },
};
