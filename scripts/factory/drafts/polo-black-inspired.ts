// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — polo-black-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-19T19:01:38.456Z
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

export const poloBlackInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "polo-black-inspired",
  slug          : "polo-black-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Polo Black Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Fruity", "Woody"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Woody Fruity",
  season        : "Autumn",
  notes: {
    top:   ["Mango", "Tangerine", "Lemon"],
    heart: ["Sage", "Wormwood", "Patchouli"],
    base:  ["Sandalwood", "Tonka Bean"],
  },
  notesEvidenceLocked: true,
  mood          : "Dark Woody Sweet",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Warm",
    "Sophisticated",
    "Grounded",
    "Confident",
    "Balanced",
  ],
  occasions     : ["Office", "Date Night", "Casual", "Evening"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Woody Fruity Signature", "Balanced Dark Sweetness", "Modern Classic"],
  recommendedFor: [
    "Men seeking a balanced signature fragrance that transitions seamlessly from office to evening without requiring a wardrobe change",
    "Those who appreciate woody depth with subtle fruit sweetness—sophisticated enough for formal settings yet approachable for daily wear",
    "Anyone drawn to autumnal character: warm mango and citrus that ground into earthy sage and sandalwood rather than bright freshness",
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
  subtitle      : "Dark Woody Sweet",
  description   : "Mango and tangerine open with a citrus warmth that deepens into sage and wormwood—herbaceous, slightly bitter, grounding. Sandalwood and tonka bean anchor the composition, weaving woody restraint with a whisper of vanilla sweetness that feels more like caramel smoke than confession.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "fruity-woody",
    "mango",
    "citrus",
    "patchouli",
    "sandalwood",
    "tonka-bean",
    "balanced",
    "signature-scent",
    "office",
    "date-night",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],

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
    alternatives:     ["god-of-fire-inspired", "hacivat-inspired"],
    wardrobePartners: ["spicebomb-extreme-inspired", "sauvage-elixir-inspired"],
  },
};
