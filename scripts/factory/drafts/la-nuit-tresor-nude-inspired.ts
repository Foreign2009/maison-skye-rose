// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — la-nuit-tresor-nude-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-09-11T18:53:14.895Z
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

export const laNuitTresorNudeInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "la-nuit-tresor-nude-inspired",
  slug          : "la-nuit-tresor-nude-inspired",
  brand         : "Maison Skye & Rose",
  name          : "La Nuit Tresor Nude Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Vanilla", "Floral", "Sweet"],
  scentCharacter: "Rich & Full-Bodied",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral Sweet Vanilla",
  season        : "Spring",
  notes: {
    top:   ["Bergamot"],
    heart: ["Rose"],
    base:  ["Vanilla", "Coconut"],
  },
  notesEvidenceLocked: true,
  mood          : "Warm Romantic Soft",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Romantic",
    "Warm",
    "Soft",
    "Intimate",
    "Sensual",
    "Elegant",
  ],
  occasions     : ["Daily Wear", "Date Night", "Weekend", "Wedding"],
  seasons       : ["Spring", "Summer"],
  signatureStyle: ["Romantic Skin Scent", "Soft Floral Intimacy", "Modern Romance"],
  recommendedFor: [
    "Women seeking a romantic everyday fragrance that feels like a warm second skin rather than a bold statement",
    "Those who love rose and vanilla but want softness and quiet warmth over bold statements",
    "Anyone looking for a versatile floral that works equally well for spring dates, weekend wear, and casual evenings",
    "Fragrance enthusiasts who want softness and sensuality without sweetness that feels cloying or juvenile",
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
  subtitle      : "Warm Romantic Skin",
  description   : "Bergamot opens with bright warmth, yielding to a full-bodied rose that feels intimate rather than grand. Vanilla and coconut create a soft, skin-like base—a fragrance that feels like a second skin and deepens quietly with wear.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "occasions-and-style", "wear-and-application"],
  educationTags : [
    "floral",
    "rose",
    "vanilla",
    "sweet",
    "bergamot",
    "coconut",
    "romantic",
    "warm",
    "spring",
    "daily-wear",
    "wedding",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 4,
  freshness     : 3,
  warmth        : 4,
  intensity     : 2,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["la-vie-est-belle-inspired", "flowerbomb-inspired", "la-nuit-tresor-inspired"],
    wardrobePartners: ["bleu-de-chanel-inspired"],
  },
};
