// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — aqva-amara-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-22T18:52:26.051Z
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

export const aqvaAmaraInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "aqva-amara-inspired",
  slug          : "aqva-amara-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Aqva Amara Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Aquatic", "Woody"],
  scentCharacter: "Fresh & Light",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Woody Aquatic",
  season        : "Summer",
  notes: {
    top:   ["Sicilian Mandarin"],
    heart: ["Watery Notes", "Neroli"],
    base:  ["Olibanum", "Indonesian Patchouli Leaf"],
  },
  notesEvidenceLocked: true,
  mood          : "Citrus Aquatic Bitter",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Fresh",
    "Bright",
    "Clean",
    "Sophisticated",
    "Airy",
  ],
  occasions     : ["Daily Wear", "Office", "Casual", "Travel"],
  seasons       : ["Summer", "Spring"],
  signatureStyle: ["Citrus Aquatic", "Summer Signature", "Fresh Clarity"],
  recommendedFor: [
    "Men seeking a fresh, citrus-driven summer signature that feels clean and slightly sophisticated without heaviness.",
    "Those who want fresh citrus clarity — ideal for office, travel, or warm-weather daily wear.",
    "Fragrance explorers who appreciate aquatic-woody balance with a subtle bitter edge and natural neroli character.",
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
  subtitle      : "Citrus Aquatic Clarity",
  description   : "Sicilian mandarin cuts through a luminous aquatic heart, bright and slightly bitter. Neroli and watery notes create an airy, almost translucent core that feels like salt spray and citrus zest. Olibanum and patchouli leaf anchor the composition with warm, resinous depth—woody without weight.",
  academyArticleIds: ["guide-to-fragrance-families", "choosing-your-season-scent", "how-to-wear-fragrance"],
  academyCategories: ["fragrance-families", "occasions-and-style"],
  educationTags : [
    "aquatic",
    "woody",
    "mandarin",
    "neroli",
    "fresh",
    "light",
    "summer",
    "daily-wear",
    "vacation",
    "citrus",
  ],
  learningPath  : ["guide-to-fragrance-families", "choosing-your-season-scent", "how-to-wear-fragrance"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 1,
  freshness     : 5,
  warmth        : 3,
  intensity     : 2,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["aqua-di-gio-inspired", "invictus-inspired", "hawas-inspired"],
    wardrobePartners: ["spicebomb-extreme-inspired"],
  },
};
