// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — versace-yellow-diamonds-inspired
// WITHDRAWN 2026-10-11 — DUPLICATE_ALIAS of active native yellow-diamond-inspired
//   (LADIES-277-Versace Yellow Diamonds). Reference only — do not promote.
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-10-10T17:58:03.390Z
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

export const versaceYellowDiamondsInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "versace-yellow-diamonds-inspired",
  slug          : "versace-yellow-diamonds-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Versace Yellow Diamonds Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Citrus", "Floral"],
  scentCharacter: "Fresh & Light",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral Citrus",
  season        : "Spring",
  notes: {
    // Source: nordstrom.com Yellow Diamond EDT listing (inspected 2026-10-10; named tier-2 retailer):
    //   Top: bergamot, lemon, neroli, pear sorbet / Middle: freesia, mimosa, orange blossom, water lily /
    //   Base: guaiac wood, amber, musk. Unsupported "Amalfi" and "African" qualifiers removed.
    //   Fragrantica not inspected (403). See wave-9-source-evidence.json.
    top:   ["Lemon", "Pear", "Bergamot", "Neroli"],
    heart: ["Mimosa", "Freesia", "Water Lily", "Orange Blossom"],
    base:  ["Musk", "Guaiac Wood", "Amber"],
  },
  notesEvidenceLocked: true,
  mood          : "Bright Fresh Feminine",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Bright",
    "Feminine",
    "Fresh",
    "Elegant",
    "Delicate",
  ],
  occasions     : ["Daily Wear", "Wedding", "Casual", "Weekend"],
  seasons       : ["Spring", "Summer"],
  signatureStyle: ["Luminous Floral Citrus", "Everyday Elegance", "Fresh Feminine Icon"],
  recommendedFor: [
    "Women seeking a fresh, luminous everyday fragrance that feels like spring captured in a bottle",
    "Those who love floral elegance without heaviness — bright neroli and mimosa with a whisper of warmth",
    "Anyone looking for a signature scent that transitions seamlessly from daily wear to special occasions like weddings",
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
  subtitle      : "Petals in Sunlight",
  description   : "Lemon and pear open with luminous, citrus-bright freshness, neroli adding soft radiance to the accord. Mimosa and freesia bloom in the heart with effortless radiance, water lily lending cool transparency. Guaiac wood and amber close with quiet, grounding warmth.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "choosing-your-season-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "citrus",
    "floral",
    "neroli",
    "fresh",
    "light",
    "feminine",
    "spring",
    "daily-wear",
    "wedding",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Scores derived by knowledgeAdapter.deriveMetrics(profile="Floral Citrus", season="Spring").
  // sweetness:1 (citrus), freshness:5 (citrus), warmth:1 (citrus), intensity:2 (Spring), versatility:3 (Spring).
  // Scores are heuristic-derived approximations (knowledgeAdapter.ts line 208). No calibration producer in pipeline.
  sweetness     : 1,
  freshness     : 5,
  warmth        : 1,
  intensity     : 2,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // All pairings cleared pending promotion-time verification.
  // Validator (validator.ts): BOTH alternatives AND wardrobePartners require reciprocity
  // when allRecords is provided — RELATIONSHIP_ALTERNATIVES_NOT_RECIPROCAL and
  // RELATIONSHIP_WARDROBE_PARTNERS_NOT_RECIPROCAL both fire. Empty arrays pass without error.
  // Proposed pairings retained in catalogue-expansion-ledger.json → pending_relationship_proposals.
  // NOTE: yellow-diamond-inspired is the active native record of this same fragrance; this draft
  //   is withdrawn as its duplicate (proposals in the ledger are void).
  relationships: {
    alternatives:     [],
    wardrobePartners: [],
  },
};
