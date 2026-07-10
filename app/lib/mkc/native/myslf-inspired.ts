// Maison Knowledge Catalogue — MYSLF Inspired
import type { FragranceKnowledge } from "../types";

export const myslfInspired: FragranceKnowledge = {

  // ── Identity ─────────────────────────────────────────────────────────────────
  id:             "myslf-inspired",
  slug:           "myslf-inspired",
  brand:          "Maison Skye & Rose",
  name:           "MYSLF Inspired",
  collection:     "Skye",
  catalogVersion: "1.0",
  status:         "active",

  // ── Classification ───────────────────────────────────────────────────────────
  gender:         "male",
  family:         ["Fresh", "Floral", "Woody"],
  scentCharacter: "Balanced Signature",
  projection:     "moderate",

  // ── Composition ──────────────────────────────────────────────────────────────
  profile: "Fresh Floral",
  season:  "All Season",
  notes: {
    top:   ["Bergamot", "Cardamom", "Pink Pepper"],
    heart: ["Orange Blossom", "Iris", "Sandalwood"],
    base:  ["Amberwood", "White Musk", "Vetiver"],
  },
  mood: "Bergamot, orange blossom and amberwood in a clean modern accord — the all-season signature that adapts without changing.",

  // ── Discovery ────────────────────────────────────────────────────────────────
  vibe:           ["Clean", "Modern", "Sophisticated", "Confident", "Elegant", "Professional"],
  occasions:      ["Daily Wear", "Office", "Weekend", "Evening"],
  seasons:        ["Spring", "Summer", "Autumn", "Winter"],
  signatureStyle: ["Modern Floral Confidence", "All-Season Authenticity", "Clean Contemporary Luxury"],
  recommendedFor: [
    "Those building their first all-season modern signature — MYSLF occupies a position no conventional fresh masculine does: the clean-floral masculine that reads as contemporary luxury without becoming seasonal or occasion-specific, performing with equal confidence in an office, across a weekend, and into early evening",
    "Men who find most fresh signatures either too sporty or too classic in character — MYSLF has a similar versatility to Sauvage and Bleu De Chanel but arrives through orange blossom and amberwood rather than citrus-lavender, giving it a distinctly modern identity within the same all-occasion tier",
    "Professionals who want fragrance presence that communicates intention without announcement — the iris and amberwood combination creates a refined close-wearing quality suited to environments where fragrance should be a detail noticed only at proximity, not a statement made across the room",
    "Customers who want a single fragrance capable of representing them across an entire year without requiring seasonal adjustment — MYSLF's genuinely all-season construction means one bottle handles every temperature without compromise, the practical choice for those who prefer depth of relationship to breadth of collection",
  ],

  // ── Merchandising ────────────────────────────────────────────────────────────
  prices: { "5ml": 60, "10ml": 100, "30ml": 250 },
  images: {
    "5ml":  "/images/blue-5ml.png",
    "10ml": "/images/blue-10ml.png",
    "30ml": "/images/glass-blue-30ml.png",
  },
  bestSeller: false,
  newArrival: false,

  // ── Education ────────────────────────────────────────────────────────────────
  subtitle: "Modern Freshness",
  description:
    "MYSLF Inspired opens with Bergamot and Cardamom — not the sharp citrus brightness of a conventional fresh masculine, but a clean modern composition that feels considered from the first moment. " +
    "Orange Blossom in the heart introduces a soft, contemporary florality that prevents this from reading as another fougère, while Iris brings a powdery restraint that holds the composition close without making it small. " +
    "Amberwood and Vetiver in the base deliver warmth without sweetness — a signature that is clean enough to wear to the office, refined enough for an evening, and modern enough to mean it.",

  // ── Academy integration ───────────────────────────────────────────────────────
  academyArticleIds: [
    "what-makes-a-signature-scent",
    "guide-to-fragrance-families",
    "the-note-pyramid-explained",
    "choosing-your-season-scent",
  ],
  academyCategories: [
    "fragrance-fundamentals",
    "fragrance-families",
    "building-your-wardrobe",
  ],
  educationTags: [
    "bergamot", "orange-blossom", "amberwood", "iris", "floral", "fresh", "modern",
    "clean", "masculine", "all-season", "versatile", "professional", "contemporary",
  ],
  learningPath: [
    "what-makes-a-signature-scent",
    "guide-to-fragrance-families",
    "the-note-pyramid-explained",
    "choosing-your-season-scent",
  ],

  // ── Relationships ─────────────────────────────────────────────────────────────
  relationships: {
    alternatives: ["valentino-uomo-born-in-roma-inspired"],
  },

  // ── Intelligence ─────────────────────────────────────────────────────────────
  // Modern clean floral masculine benchmark. Distinct from Born in Roma (sweetness:1,
  // freshness:3, warmth:3, intensity:2, versatility:5 — Italian green-aromatic via violet
  // leaf/sage/vetiver) by note route: MYSLF is orange blossom/amberwood/musk (modern, airy,
  // contemporary). Both earn versatility:5 through restrained projection and all-season
  // character rather than sheer breadth. warmth:2 (MYSLF) vs warmth:3 (Born in Roma)
  // reflects the difference between amberwood lightness and vetiver/patchouli earthiness.
  // intensity:2 places MYSLF in the close-wearing tier alongside Imagination and Prada L'Homme —
  // the all-season soft-projection masculine triad (Imagination: fresh-linear; Prada L'Homme:
  // powdery-iris; MYSLF: floral-modern). sweetness:1 confirms zero-sweet orientation despite
  // the floral heart: orange blossom here reads as white-floral clean, not honeyed.
  sweetness:   1,
  freshness:   3,
  warmth:      2,
  intensity:   2,
  versatility: 5,
  popularity:  5,
};
