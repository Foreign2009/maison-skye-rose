// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — lacoste-blanc-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-22T18:52:54.715Z
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

export const lacosteBlancInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "lacoste-blanc-inspired",
  slug          : "lacoste-blanc-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Lacoste Blanc Inspired",
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
  season        : "Summer",
  notes: {
    top:   ["Grapefruit", "Rosemary", "Cardamom"],
    heart: ["Ylang-Ylang", "Tuberose"],
    base:  ["Virginia Cedar", "Suede", "Vetiver", "Leather"],
  },
  notesEvidenceLocked: true,
  mood          : "Fresh Clean Woody",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Fresh",
    "Clean",
    "Sophisticated",
    "Balanced",
    "Confident",
    "Elegant",
  ],
  occasions     : [
    "Daily Wear",
    "Office",
    "Casual",
    "Weekend",
    "Travel",
  ],
  seasons       : ["Summer", "Spring"],
  signatureStyle: ["Crisp Woody Elegance", "Fresh Aromatic Signature", "Summer Refined"],
  recommendedFor: [
    "Men seeking a crisp, wearable signature that balances fresh citrus with refined woody depth for everyday confidence",
    "Those who appreciate herbal aromatic freshness with creamy floral softness rather than heavy sweetness or spice",
    "Anyone looking for a summer essential that transitions seamlessly from casual weekend wear to relaxed office settings",
    "Men drawn to clean, balanced compositions that feel both modern and classically elegant without demanding attention",
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
  subtitle      : "Crisp Elegance",
  description   : "Grapefruit and rosemary open with herbal clarity, before ylang-ylang and tuberose soften into creamy florals. Virginia cedar and vetiver anchor the composition—a woody base that feels both refined and skin-warm, touched with suede and leather.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-wear-fragrance", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "aromatic",
    "woody",
    "grapefruit",
    "rosemary",
    "cedar",
    "vetiver",
    "clean",
    "fresh",
    "signature",
    "summer",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-wear-fragrance", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 2,
  warmth        : 3,
  intensity     : 2,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["sauvage-inspired", "bleu-de-chanel-inspired", "valentino-uomo-born-in-roma-inspired"],
    wardrobePartners: ["spicebomb-extreme-inspired", "le-male-elixir-inspired"],
  },
};
