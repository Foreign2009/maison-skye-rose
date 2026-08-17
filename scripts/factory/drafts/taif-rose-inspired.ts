// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — taif-rose-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-16T17:09:19.571Z
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

export const taifRoseInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "taif-rose-inspired",
  slug          : "taif-rose-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Taif Rose Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Floral"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral Oriental",
  season        : "Spring",
  notes: {
    top:   ["Rose"],
    heart: ["Taif Rose"],
    base:  ["Amber", "Coffee"],
  },
  notesEvidenceLocked: true,
  mood          : "Romantic Floral Oriental",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Romantic",
    "Warm",
    "Sophisticated",
    "Delicate",
    "Elegant",
    "Sensual",
  ],
  occasions     : ["Daily Wear", "Wedding", "Date Night", "Evening"],
  seasons       : ["Spring", "Autumn"],
  signatureStyle: ["Romantic Floral Oriental", "Creamy Rose Signature", "Warm Elegance"],
  recommendedFor: [
    "Women seeking a romantic signature fragrance that balances delicate florality with warm, grounding base notes for everyday elegance",
    "Those who love rose as a central character and want complexity beyond a simple floral — with creamy tea-like depth and subtle coffee warmth",
    "Anyone looking for a wedding-appropriate fragrance that feels personal and intimate rather than overly formal or heavy",
    "Fragrance collectors building a rose wardrobe who appreciate Taif rose's refined, slightly spiced character over sweeter varieties",
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
  subtitle      : "Creamy Floral Warmth",
  description   : "Rose opens the composition with immediate brightness, yielding to the creamy, almost tea-like complexity of Taif rose at its heart. Amber and coffee ground the fragrance in warmth, creating a romantic oriental that feels both luminous and intimate.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "rose",
    "taif-rose",
    "floral",
    "oriental",
    "amber",
    "coffee",
    "romantic",
    "signature",
    "spring",
    "daily-wear",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],

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
    alternatives:     ["delina-inspired", "delina-exclusif-inspired"],
    wardrobePartners: ["black-opium-inspired", "coco-mademoiselle-inspired"],
  },
};
