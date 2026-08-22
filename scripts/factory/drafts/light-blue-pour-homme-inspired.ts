// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — light-blue-pour-homme-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-22T18:50:59.182Z
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

export const lightBluePourHommeInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "light-blue-pour-homme-inspired",
  slug          : "light-blue-pour-homme-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Light Blue Pour Homme Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Aromatic", "Citrus"],
  scentCharacter: "Fresh & Light",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Citrus Aromatic",
  season        : "Summer",
  notes: {
    top:   ["Grapefruit", "Bergamot", "Sicilian Mandarin", "Juniper"],
    heart: ["Pepper", "Rosemary", "Brazilian Rosewood"],
    base:  ["Musk", "Incense", "Oakmoss"],
  },
  notesEvidenceLocked: true,
  mood          : "Fresh Citrus Mediterranean",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Fresh",
    "Bright",
    "Sophisticated",
    "Clean",
    "Warm",
    "Confident",
  ],
  occasions     : [
    "Daily Wear",
    "Office",
    "Casual",
    "Weekend",
    "Travel",
  ],
  seasons       : ["Summer", "Spring"],
  signatureStyle: ["Mediterranean Citrus", "Fresh Sophistication", "Casual Elegance"],
  recommendedFor: [
    "Men seeking a crisp, Mediterranean-inspired daily fragrance that feels effortless in warm weather and professional settings.",
    "Those who want fresh citrus with understated sophistication—bright enough for casual wear, refined enough for the office.",
    "Anyone drawn to morning freshness and sunlit clarity who prefers understated elegance over bold statements.",
    "Fragrance explorers building a summer wardrobe who need a versatile anchor between sporty and elegant scents.",
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
  subtitle      : "Citrus Clarity",
  description   : "Grapefruit and bergamot open with Mediterranean clarity, bright as morning light on water. Rosemary and pepper anchor the composition in quiet sophistication, while musk and incense settle into a warm, understated base that feels both mineral and intimate.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-wear-fragrance"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "citrus",
    "aromatic",
    "grapefruit",
    "bergamot",
    "fresh",
    "summer",
    "daily-wear",
    "masculine",
    "rosemary",
    "musk",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-wear-fragrance"],

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
    alternatives:     ["aqua-di-gio-inspired", "bleu-de-chanel-inspired", "imagination-inspired"],
    wardrobePartners: ["sauvage-inspired", "le-male-inspired"],
  },
};
