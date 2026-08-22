// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — queen-of-silk-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-22T18:49:13.959Z
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

export const queenOfSilkInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "queen-of-silk-inspired",
  slug          : "queen-of-silk-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Queen of Silk Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Floral", "Amber"],
  scentCharacter: "Rich & Full-Bodied",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral Amber",
  season        : "Year-Round",
  notes: {
    top:   ["Chinese Osmanthus", "Passionfruit"],
    heart: ["Tuberose", "Javanese Patchouli"],
    base:  ["Cedar", "Agarwood", "Madagascan Vanilla", "Ambers"],
  },
  notesEvidenceLocked: true,
  mood          : "Warm Floral Amber",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Warm",
    "Sophisticated",
    "Sensual",
    "Elegant",
    "Magnetic",
    "Luxurious",
  ],
  occasions     : ["Daily Wear", "Evening", "Date Night", "Weekend"],
  seasons       : ["Spring", "Summer", "Autumn", "Winter"],
  signatureStyle: ["Luminous Floral Amber", "Creamy Sophistication", "Warm Luxury Floral"],
  recommendedFor: [
    "Women seeking a rich, enveloping fragrance that transitions seamlessly from day to evening and feels like a signature second skin.",
    "Those who love creamy florals with depth and warmth — tuberose and patchouli lovers who want luxury without sweetness dominating.",
    "Anyone drawn to amber and woody base notes who wants a full-bodied floral that lingers with sophistication and sensuality.",
    "Women building a refined fragrance wardrobe who need one versatile floral-amber that works year-round and pairs beautifully with other scents.",
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
  subtitle      : "Luminous Warmth",
  description   : "Chinese osmanthus and passionfruit open into a creamy, intoxicating tuberose that settles against warm patchouli and cedarwood. Agarwood and vanilla deepen into a soft amber that feels like silk against skin—luminous, sensual, utterly assured.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "what-makes-a-signature-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "floral-amber",
    "tuberose",
    "patchouli",
    "vanilla",
    "agarwood",
    "rich",
    "full-bodied",
    "amber",
    "signature-scent",
    "year-round",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 3,
  freshness     : 3,
  warmth        : 4,
  intensity     : 3,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["libre-inspired", "prada-paradoxe-inspired", "crystal-noir-inspired"],
    wardrobePartners: ["delina-inspired"],
  },
};
