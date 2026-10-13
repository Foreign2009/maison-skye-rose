// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — 212-vip-men-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-10-13T20:19:22.620Z
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

export const _212VipMenInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "212-vip-men-inspired",
  slug          : "212-vip-men-inspired",
  brand         : "Maison Skye & Rose",
  name          : "212 VIP Men Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Aromatic", "Woody", "Amber"],
  scentCharacter: "Rich & Full-Bodied",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Woody Amber Aromatic",
  season        : "All Season",
  notes: {
    top:   ["Caviar Lime", "Frozen Mint"],
    heart: ["Ginger", "Chilled Vodka"],
    base:  ["Kingwood", "Tonka Bean"],
    // Evidence-locked to carolinaherrera.com (212 VIP Men EDT, "For: Him"): Top "Caviar Lime & Frozen Mint";
    // Heart "Ginger & Chilled Vodka"; Bottom "Kingwood & Tonka Bean"; family "WOODY Amber Aromatic".
    // "Chilled Vodka" is the reference's accord wording, not a Maison ingredient. PYRAMID_SECONDARY_SUPPORTED.
    // See wave-9-source-evidence.json (revision 10).
  },
  notesEvidenceLocked: true,
  mood          : "Bold Playful Confident",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Confident",
    "Playful",
    "Bold",
    "Modern",
    "Magnetic",
    "Sophisticated",
  ],
  occasions     : [
    "Daily Wear",
    "Office",
    "Date Night",
    "Weekend",
    "Casual",
  ],
  seasons       : ["Spring", "Summer", "Autumn", "Winter"],
  signatureStyle: ["Iced Confidence", "Modern Woody Aromatic", "Playful Sophistication"],
  recommendedFor: [
    "Men who want a bold, modern signature that balances icy freshness with warm, woody depth.",
    "Those seeking an all-season fragrance with playful confidence—caviar lime and mint up top, tonka bean beneath.",
    "Anyone looking for an aromatic woody fragrance with a cool, minty opening.",
    "Confident men who appreciate aromatic woody compositions with a contemporary edge.",
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
  subtitle      : "Iced Confidence",
  description   : "Caviar lime and frozen mint open with an icy, sparkling jolt, cut by warm ginger and a chilled vodka accord. Kingwood and tonka bean anchor the composition with dry, woody depth—bold and playful.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-wear-fragrance", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "aromatic",
    "woody",
    "amber",
    "tonka-bean",
    "kingwood",
    "ginger",
    "mint",
    "confident",
    "bold",
    "daily-wear",
    "office",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-wear-fragrance", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Scores derived by knowledgeAdapter.deriveMetrics(profile="Woody Amber Aromatic", season="All Season").
  // Heuristic approximations; no calibration producer in pipeline.
  sweetness     : 3,
  freshness     : 2,
  warmth        : 4,
  intensity     : 3,
  versatility   : 5,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // All pairings cleared pending promotion-time verification (Wave 9 policy).
  // Factory RelationshipProducer suggestions are recorded unverified in
  // catalogue-expansion-ledger.json → pending_relationship_proposals (batch4). Reciprocity
  // would require edits to native counterpart records; none are activated here.
  relationships: {
    alternatives:     [],
    wardrobePartners: [],
  },
};
