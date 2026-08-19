// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — gucci-guilty-pour-homme-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-19T19:01:17.522Z
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

export const gucciGuiltyPourHommeInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "gucci-guilty-pour-homme-inspired",
  slug          : "gucci-guilty-pour-homme-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Gucci Guilty Pour Homme Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Aromatic"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Fougère Aromatic",
  season        : "Year-Round",
  notes: {
    top:   ["Lavender", "Amalfi Lemon"],
    heart: ["African Orange Flower"],
    base:  ["Virginia Cedar", "Patchouli", "Vanilla"],
  },
  notesEvidenceLocked: true,
  mood          : "Fresh Citrus Woody",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Fresh",
    "Balanced",
    "Sophisticated",
    "Confident",
    "Clean",
    "Warm",
  ],
  occasions     : ["Daily Wear", "Office", "Weekend", "Casual"],
  seasons       : ["Spring", "Summer", "Autumn", "Winter"],
  signatureStyle: ["Balanced Aromatic Fougère", "Coastal Freshness", "Everyday Signature"],
  recommendedFor: [
    "Men seeking a balanced everyday fragrance that transitions seamlessly from office to weekend without demanding attention",
    "Those who appreciate Mediterranean freshness tempered by woody depth—clean but not austere",
    "Anyone building a signature collection who wants a versatile aromatic fougère that respects professionalism and personal style",
    "Men drawn to lavender and cedar as foundational notes rather than novelty accents",
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
  subtitle      : "Mediterranean Clarity",
  description   : "Lavender and Amalfi lemon open with a sharp, Mediterranean clarity—the scent of sun-bleached linens and coastal air. African orange flower softens the composition through its heart, while Virginia cedar and patchouli ground the fragrance in warm, woody restraint.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "aromatic",
    "fougère",
    "lavender",
    "cedar",
    "patchouli",
    "masculine",
    "balanced",
    "signature-scent",
    "daily-wear",
    "versatile",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 2,
  warmth        : 2,
  intensity     : 3,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["sauvage-inspired", "bleu-de-chanel-inspired", "valentino-uomo-born-in-roma-inspired"],
    wardrobePartners: ["spicebomb-extreme-inspired", "prada-l'homme-inspired"],
  },
};
