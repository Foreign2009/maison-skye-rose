// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — leau-dissey-pour-homme-sport-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-09-11T18:51:03.267Z
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

export const leauDisseyPourHommeSportInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "leau-dissey-pour-homme-sport-inspired",
  slug          : "leau-dissey-pour-homme-sport-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Leau Dissey Pour Homme Sport Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Aromatic", "Fresh", "Spicy"],
  scentCharacter: "Fresh & Light",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Aromatic Fresh Spicy",
  season        : "Spring",
  notes: {
    top:   ["Bergamot", "Grapefruit"],
    heart: ["Nutmeg", "Leather"],
    base:  ["Vetiver", "Virginia Cedar", "Ambergris"],
  },
  notesEvidenceLocked: true,
  mood          : "Fresh Energetic",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Energetic",
    "Fresh",
    "Confident",
    "Bright",
    "Warm",
  ],
  occasions     : ["Daily Wear", "Office", "Weekend", "Casual"],
  seasons       : ["Spring", "Summer"],
  signatureStyle: ["Fresh Aromatic Spice", "Modern Athletic Elegance", "Energetic Everyday Icon"],
  recommendedFor: [
    "Men seeking a fresh, energetic fragrance that transitions seamlessly from morning workouts to office and weekend activities",
    "Those who want bergamot brightness with subtle leather warmth — fresh without being sweet or overly citrus-driven",
    "Active men who appreciate a clean aromatic-spicy profile and subtle textured freshness over sweetness or loudness",
    "Fragrance enthusiasts building a spring rotation who need a versatile daily wear that feels bright and energetic",
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
  subtitle      : "Fresh Leather Energy",
  description   : "Bergamot and grapefruit spark with immediate brightness, cutting through the air like morning light. Nutmeg and leather settle into the heart, grounding the freshness with subtle warmth and texture. Vetiver and cedarwood anchor the composition, leaving a clean, slightly mineral finish that feels both refined and alive.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-wear-fragrance", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "aromatic",
    "fresh",
    "spicy",
    "bergamot",
    "grapefruit",
    "vetiver",
    "leather",
    "energetic",
    "daily-wear",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-wear-fragrance"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 1,
  freshness     : 5,
  warmth        : 4,
  intensity     : 2,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["sauvage-elixir-inspired", "prada-luna-rossa-carbon-inspired", "leau-dissey-pour-homme-inspired"],
    wardrobePartners: ["spicebomb-extreme-inspired"],
  },
};
