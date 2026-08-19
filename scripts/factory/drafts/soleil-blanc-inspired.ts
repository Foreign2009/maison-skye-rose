// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — soleil-blanc-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-19T18:08:40.877Z
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

export const soleilBlancInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "soleil-blanc-inspired",
  slug          : "soleil-blanc-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Soleil Blanc Inspired",
  collection    : "Elite",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "unisex",
  family        : ["Floral"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral Oriental",
  season        : "Summer",
  notes: {
    top:   ["Pistachio", "Bergamot", "Cardamom", "Pink Pepper"],
    heart: ["Tuberose", "Ylang-Ylang", "Jasmine"],
    base:  ["Coconut", "Amber", "Tonka Bean", "Benzoin"],
  },
  notesEvidenceLocked: true,
  mood          : "Warm Floral Creamy",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Warm",
    "Sensual",
    "Elegant",
    "Soft",
    "Luxurious",
    "Magnetic",
  ],
  occasions     : ["Daily Wear", "Vacation", "Weekend", "Evening"],
  seasons       : ["Summer"],
  signatureStyle: ["Warm Floral Comfort", "Creamy Luxury", "Tropical Elegance"],
  recommendedFor: [
    "Women seeking a warm, creamy floral that feels luxurious yet wearable for everyday moments",
    "Anyone who loves tropical warmth and wants a signature that smells like skin — soft, personal, and intimate",
    "Those planning a summer escape who need one fragrance that works from beach to dinner",
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
  subtitle      : "Warm Floral Creamy",
  description   : "Pistachio and cardamom open with a whisper of pink pepper, then warm tuberose and jasmine bloom into a creamy, amber-touched base of coconut and tonka. This is soft florality anchored by skin-like warmth—a fragrance that feels like sun on bare skin, held close.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "choosing-your-season-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "floral-oriental",
    "tuberose",
    "jasmine",
    "ylang-ylang",
    "coconut",
    "amber",
    "tonka",
    "summer",
    "signature",
    "layering",
    "unisex",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 3,
  warmth        : 2,
  intensity     : 2,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["baccarat-rouge-540-inspired", "alien-goddess-inspired"],
    wardrobePartners: ["sauvage-inspired", "bleu-de-chanel-inspired"],
  },
};
