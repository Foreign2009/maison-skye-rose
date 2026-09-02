// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — bad-boy-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-09-02T17:26:54.898Z
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

export const badBoyInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "bad-boy-inspired",
  slug          : "bad-boy-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Bad Boy Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Woody", "Amber"],
  scentCharacter: "Rich & Full-Bodied",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Amber Woody",
  season        : "Autumn",
  notes: {
    top:   ["Cardamom", "Black Pepper", "Bergamot"],
    heart: ["Sage", "Lavender"],
    base:  [
      "Cacao",
      "Vetiver",
      "Leather",
      "Papyrus",
      "Tonka Bean",
    ],
  },
  notesEvidenceLocked: true,
  mood          : "Dark Spiced Amber",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Powerful",
    "Mysterious",
    "Sophisticated",
    "Warm",
    "Edgy",
  ],
  occasions     : ["Office", "Date Night", "Evening", "Weekend"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Dark Spiced Amber", "Masculine Leather & Cacao", "Autumn Signature"],
  recommendedFor: [
    "Men seeking a bold amber fragrance with spiced depth for evening and weekend exploration",
    "Those who want dark leather and cacao richness without sacrificing wearability in professional settings",
    "Anyone drawn to contemplative woody-amber with enough character to stand apart from crowd-pleasing fresh fragrances",
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
  subtitle      : "Spiced Shadow",
  description   : "Dark cardamom and black pepper ignite against cool bergamot, then settle into a contemplative heart of sage and lavender. Cacao and leather unfold beneath, grounded by vetiver and tonka—a fragrance that moves between spice and shadow, restless and deliberately composed.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "choosing-your-season-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "woody",
    "amber",
    "cardamom",
    "pepper",
    "leather",
    "vetiver",
    "tonka-bean",
    "masculine",
    "autumn",
    "office",
    "date-night",
    "spiced",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 3,
  freshness     : 2,
  warmth        : 4,
  intensity     : 3,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["spicebomb-extreme-inspired", "1-million-inspired", "layton-inspired"],
    wardrobePartners: ["sauvage-inspired"],
  },
};
