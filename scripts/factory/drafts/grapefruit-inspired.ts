// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — grapefruit-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-22T18:54:27.161Z
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

export const grapefruitInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "grapefruit-inspired",
  slug          : "grapefruit-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Grapefruit Inspired",
  collection    : "Elite",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "unisex",
  family        : ["Citrus"],
  scentCharacter: "Fresh & Light",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Citrus",
  season        : "Summer",
  notes: {
    top:   [],
    heart: ["Grapefruit", "Rosemary", "Peppermint", "Pimento"],
    base:  [],
  },
  notesEvidenceLocked: true,
  mood          : "Fresh Citrus Herbal",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Fresh",
    "Bright",
    "Clean",
    "Herbal",
    "Energetic",
    "Modern",
  ],
  occasions     : ["Daily Wear", "Vacation", "Weekend", "Casual"],
  seasons       : ["Summer"],
  signatureStyle: ["Bright Citrus Herbal", "Summer Freshness", "Green & Alive"],
  recommendedFor: [
    "Anyone seeking a crisp, green citrus that energizes morning routines and workdays without overwhelming",
    "Women and men who want a fresh fragrance that reads herbal and savoury rather than sweet or fruity",
    "Those planning active summer days—beach trips, outdoor work, casual weekends—who need something light and clean",
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
  subtitle      : "Bright Green Energy",
  description   : "Bright, zesty grapefruit meets peppermint and rosemary in a composition that turns herbal and alive. A sharp, green citrus character emerges—less sweet than savoury, with pimento adding unexpected spice and depth.",
  academyArticleIds: ["guide-to-fragrance-families", "choosing-your-season-scent", "how-to-wear-fragrance"],
  academyCategories: ["fragrance-families", "occasions-and-style"],
  educationTags : [
    "citrus",
    "grapefruit",
    "fresh",
    "light",
    "unisex",
    "summer",
    "daily-wear",
    "herbal",
    "peppermint",
    "crisp",
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
    alternatives:     ["afternoon-swim-inspired", "silver-mountain-water-inspired", "torino21-inspired"],
  },
};
