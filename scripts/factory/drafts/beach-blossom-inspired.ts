// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — beach-blossom-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-26T18:04:24.889Z
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

export const beachBlossomInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "beach-blossom-inspired",
  slug          : "beach-blossom-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Beach Blossom Inspired",
  collection    : "Elite",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "unisex",
  family        : ["Aromatic", "Fresh"],
  scentCharacter: "Fresh & Light",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Aromatic Green",
  season        : "Summer",
  notes: {
    top:   [],
    heart: ["Lime", "Mint", "Coconut Water", "Tonka Bean"],
    base:  [],
  },
  notesEvidenceLocked: true,
  mood          : "Fresh Tropical",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Fresh",
    "Bright",
    "Tropical",
    "Alive",
    "Clean",
    "Playful",
  ],
  occasions     : [
    "Daily Wear",
    "Vacation",
    "Summer Days",
    "Weekend",
    "Casual",
  ],
  seasons       : ["Summer"],
  signatureStyle: ["Tropical Freshness", "Green Aromatic Light", "Summer Ease"],
  recommendedFor: [
    "Anyone seeking a fresh, skin-like fragrance that captures the feeling of sun, salt air, and tropical ease without heaviness.",
    "Women and men who want a versatile summer signature that works equally well for beach days, casual outings, and warm-weather travel.",
    "Those who prefer aromatic green freshness with a subtle sweetness—alive and uplifting rather than floral or gourmand.",
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
  subtitle      : "Green Tropical Light",
  description   : "Lime and mint open into a sunlit breeze, where coconut water meets the warmth of tonka bean. Green, tropical, utterly alive—a fragrance that tastes like salt air and tastes like skin.",
  academyArticleIds: ["guide-to-fragrance-families", "choosing-your-season-scent", "how-to-wear-fragrance"],
  academyCategories: ["fragrance-families", "occasions-and-style"],
  educationTags : [
    "aromatic",
    "fresh",
    "lime",
    "mint",
    "coconut",
    "tonka",
    "unisex",
    "summer",
    "vacation",
    "daily-wear",
  ],
  learningPath  : ["guide-to-fragrance-families", "choosing-your-season-scent", "how-to-wear-fragrance"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 1,
  freshness     : 5,
  warmth        : 1,
  intensity     : 2,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["pacific-chill-inspired", "torino21-inspired"],
    wardrobePartners: ["le-beau-paradise-garden-inspired"],
  },
};
