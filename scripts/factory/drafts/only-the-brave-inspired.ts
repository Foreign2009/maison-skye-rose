// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — only-the-brave-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-10-11T19:36:58.936Z
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

export const onlyTheBraveInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "only-the-brave-inspired",
  slug          : "only-the-brave-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Only The Brave Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Citrus", "Woody"],
  scentCharacter: "Fresh & Light",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Citrus Woody",
  season        : "All Season",
  notes: {
    top:   ["Lemon", "Mandarin", "Coriander"],
    heart: ["Labdanum", "Violet Leaves", "Rosemary"],
    base:  ["Amber", "Leather", "Cedar"],
  },
  notesEvidenceLocked: true,
  mood          : "Bold Confident Energetic",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Bold",
    "Confident",
    "Energetic",
    "Fresh",
    "Warm",
    "Magnetic",
  ],
  occasions     : ["Daily Wear", "Office", "Casual", "Weekend"],
  seasons       : ["Spring", "Summer", "Autumn", "Winter"],
  signatureStyle: ["Citrus Courage", "Fresh Woody Confidence", "Energetic Signature"],
  recommendedFor: [
    "Men seeking a fresh citrus signature with a confident, assured character for professional and casual settings",
    "Those who want bold citrus brightness tempered by leather, amber and cedar",
    "Anyone building a collection who wants a citrus-woody piece for daily wear, office and weekends",
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
  subtitle      : "Citrus Courage",
  description   : "A bold citrus opens with bright lemon and mandarin, sharpened by coriander's spiced edge. Labdanum, violet leaves and rosemary form an aromatic heart, grounded by amber, leather and cedar—a fragrance that moves between brightness and depth with assured restraint.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "how-to-wear-fragrance"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "citrus",
    "woody",
    "lemon",
    "mandarin",
    "amber",
    "leather",
    "cedar",
    "fresh",
    "confident",
    "daily-wear",
    "office",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 1,
  freshness     : 5,
  warmth        : 3,
  intensity     : 3,
  versatility   : 5,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // All pairings cleared pending promotion-time verification (Wave 9 policy).
  // Factory RelationshipProducer suggestions are recorded unverified in
  // catalogue-expansion-ledger.json → pending_relationship_proposals (batch2). Reciprocity
  // would require edits to native counterpart records; none are activated here.
  relationships: {
    alternatives:     [],
    wardrobePartners: [],
  },
};
