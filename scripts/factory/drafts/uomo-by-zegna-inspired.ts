// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — uomo-by-zegna-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-09-02T17:27:09.314Z
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

export const uomoByZegnaInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "uomo-by-zegna-inspired",
  slug          : "uomo-by-zegna-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Uomo By Zegna Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Aromatic", "Woody"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Woody Aromatic",
  season        : "Autumn",
  notes: {
    top:   ["Bergamot", "Mandarin Orange", "Juniper Berries", "Pink Pepper"],
    heart: ["Iris", "Violet", "Cedar"],
    base:  ["Vetiver", "Sandalwood", "Patchouli", "Amber"],
  },
  notesEvidenceLocked: true,
  mood          : "Fresh Woody Aromatic",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Sophisticated",
    "Fresh",
    "Confident",
    "Elegant",
    "Composed",
  ],
  occasions     : ["Daily Wear", "Office", "Date Night", "Weekend"],
  seasons       : ["Autumn", "Spring", "Winter"],
  signatureStyle: ["Refined Woody Aromatic", "Balanced Signature", "Modern Classic Restraint"],
  recommendedFor: [
    "Men seeking a refined woody signature that transitions seamlessly from boardroom to evening without projection or drama",
    "Those who appreciate balanced aromatic compositions where citrus brightness and floral restraint prevent any heaviness",
    "Professionals building a capsule fragrance wardrobe who want autumn versatility paired with year-round professional credibility",
    "Anyone drawn to the clean woody tradition of luxury European menswear — crisp, composed, and distinctly tailored",
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
  subtitle      : "Refined Woody Clarity",
  description   : "Bergamot and mandarin open with crisp brightness, anchored by juniper's green snap and pink pepper's subtle bite. Iris and violet bring a refined floral restraint to the heart, while cedarwood grounds the composition with dry woody confidence. Vetiver and sandalwood emerge slowly, layered with patchouli's earthiness and amber's subtle warmth—a fragrance that feels both immediate and considered.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-wear-fragrance", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "aromatic",
    "woody",
    "bergamot",
    "iris",
    "vetiver",
    "sandalwood",
    "balanced",
    "signature",
    "office",
    "versatile",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

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
    alternatives:     ["valentino-uomo-born-in-roma-inspired", "armani-code-parfum-inspired", "lacoste-noir-inspired"],
    wardrobePartners: ["spicebomb-extreme-inspired", "prada-l'homme-inspired"],
  },
};
