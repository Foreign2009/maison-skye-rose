// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — armani-diamonds-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-10-13T20:19:55.540Z
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

import type { FragranceKnowledge } from "../types";

export const armaniDiamondsInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "armani-diamonds-inspired",
  slug          : "armani-diamonds-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Armani Diamonds Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Floral", "Fruity"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Fruity Floral",
  season        : "Spring",
  notes: {
    top:   ["Lychee", "Raspberry"],
    heart: ["Rose", "Lily of the Valley", "Patchouli", "Freesia"],
    base:  ["Vetiver", "Amber", "Vanilla"],
    // Evidence-locked to johnlewis.com (Emporio Armani Diamonds EDP, "For Her"): Top "Lychee, raspberry"; Heart "Rose,
    // lily of the valley, patchouli, freesia"; Base "Vetiver, amber, vanilla"; scent family "Fruity Floral".
    // Release year (2008 on page; 2007 in search results) is research metadata only. PYRAMID_SECONDARY_SUPPORTED.
    // See wave-9-source-evidence.json (revision 10).
  },
  notesEvidenceLocked: true,
  mood          : "Romantic Bright Playful",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Romantic",
    "Playful",
    "Bright",
    "Feminine",
    "Elegant",
  ],
  occasions     : ["Daily Wear", "Wedding", "Date Night", "Weekend"],
  seasons       : ["Spring", "Summer"],
  signatureStyle: ["Romantic Fruity Floral", "Bright Signature Bloom", "Playful Luminous"],
  recommendedFor: [
    "Women seeking a luminous signature that balances playful fruity brightness with romantic floral elegance.",
    "Those looking for a bright spring fragrance for daytime and celebrations.",
    "Anyone looking for a fruity floral built on lychee, raspberry and rose.",
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
  subtitle      : "Radiant Bloom",
  description   : "Lychee and raspberry open with bright, playful energy—a fruity greeting that feels almost edible. Rose and lily of the valley unfold into something tender and luminous, while a whisper of patchouli grounds the sweetness with quiet depth. Vetiver and amber anchor the composition, preventing it from drifting into pure romance; there's a spine of composure beneath the bloom.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "choosing-your-season-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "fruity-floral",
    "lychee",
    "rose",
    "raspberry",
    "lily-of-the-valley",
    "signature-scent",
    "spring",
    "romantic",
    "daily-wear",
    "balanced",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Scores derived by knowledgeAdapter.deriveMetrics(profile="Fruity Floral", season="Spring").
  // Heuristic approximations; no calibration producer in pipeline.
  sweetness     : 2,
  freshness     : 3,
  warmth        : 2,
  intensity     : 2,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // All pairings cleared pending promotion-time verification (Wave 9 policy).
  // Factory RelationshipProducer suggestions are recorded unverified in
  // catalogue-expansion-ledger.json → pending_relationship_proposals (batch4). Reciprocity
  // would require edits to native counterpart records; none are activated here.
  relationships: {
    alternatives:     [],
    wardrobePartners: [],
  },
};
