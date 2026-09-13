/**
 * Knowledge Factory — Wave 8 Staging Catalogue
 *
 * CATALOGUE-WAVE8-P3: 4 evidence-governed Wave 8 identities registered for
 * controlled factory intake. Factory-only. NOT customer-facing.
 *
 * This file MUST NOT be imported by any module under app/.
 * Managed exclusively by: scripts/factory/intake.ts (nonarary catalogue fallback).
 *
 * Collections:  SKYE (1) · ROSE (2) · ELITE (1) = 4 total
 *
 * EVIDENCE LOCK
 *
 * All 4 records are at CATALOGUE-WAVE8-P2 governed evidence-lock state.
 * Notes, notesStructured, and notesEvidenceLocked are populated from
 * mid-year-2026-research.json (Gemini AI, 2026-08-08).
 * Source type: AI_RESEARCH_SUMMARY — no stored underlying URLs.
 * Evidence tier: PYRAMID_SECONDARY_SUPPORTED for all 4 records.
 * No LLM general knowledge supplementation. No invented notes. No inferred tiers.
 *
 * GOVERNANCE LOCKS ACTIVE:
 *
 *   LOCK A — Azzaro Wanted by Night:
 *     FLANKER_IDENTITY_LOCK: distinct from azzaro-wanted-inspired (2016) and
 *     azzaro-most-wanted-inspired. "Fruity Notes" and "Iso E Super" in notes
 *     must be preserved literally — do NOT expand or substitute.
 *     family = ["Woody", "Spicy", "Tobacco"]. No "Aromatic" or "Leather" as family.
 *
 *   LOCK B — 24 Faubourg:
 *     FULL_EVIDENCE_PYRAMID_REQUIRED: all 14 notes must survive generation exactly.
 *     Do NOT abbreviate. "Black Elder" must not be dropped.
 *     family = ["Floral", "Amber"]. No "Fruity" as primary family.
 *
 *   LOCK C — Boss Nuit Pour Femme:
 *     SPARSE_PYRAMID_INTENTIONAL: 7-note pyramid is evidence-complete. Do NOT supplement.
 *     "White Flowers" is a generic placeholder — do NOT expand to named florals.
 *     perfumer = UNKNOWN: must be omitted from generated record.
 *     family = ["Floral"]. No "Powdery" without governed editorial confirmation.
 *
 *   LOCK D — Capri Lemon Sugar 14:
 *     COLLECTION_ELITE: unisex evidence + 47/48 Maison precedent + scaffold default.
 *     Display identity must preserve "| 14" per Kayali naming convention.
 *     perfumer = UNKNOWN: must be omitted from generated record.
 *     family = ["Citrus", "Gourmand"]. No "Sweet" as redundant separate family.
 *
 * PERFORMANCE CLAIM PROHIBITION (all 4):
 *   No longevity, sillage, projection, or beast-mode claims in any generated field.
 *   projection categorical field must follow editorial rules — NOT inferred from notes.
 *
 * SOURCE PROVENANCE (all 4):
 *   Source: data/identity/source/mid-year-2026-research.json
 *   Researcher: Gemini — AI_RESEARCH_SUMMARY (not AUTHORITATIVE or HIGH_QUALITY_SECONDARY)
 *   Research date: 2026-08-08. No stored URLs.
 *
 * Canonical retail pricing: 5ml=60, 10ml=100, 30ml=250 (ZAR).
 * Images: placeholders. Populated at MKC promotion time.
 *   BLUE_IMAGES: Skye (male).
 *   PINK_IMAGES: Rose (female).
 *   ELITE_IMAGES: Elite (unisex).
 *
 * Pre-Wave-8 baseline: 263 native MKC records (Elite 47, Skye 108, Rose 108).
 * Post-Wave-8 projected (all promoted): Elite 48, Skye 109, Rose 110 = 267 total.
 */

import type { DisplayFragrance } from "../../../app/lib/knowledgeAdapter";

const PRICES = { "5ml": 60, "10ml": 100, "30ml": 250 } as const;

const BLUE_IMAGES  = { "5ml": "/images/blue-5ml.png",  "10ml": "/images/blue-10ml.png",  "30ml": "/images/glass-blue-30ml.png"  } as const;
const PINK_IMAGES  = { "5ml": "/images/pink-5ml.png",  "10ml": "/images/pink-10ml.png",  "30ml": "/images/glass-pink-30ml.png"  } as const;
const ELITE_IMAGES = { "5ml": "/images/elite-5ml.png", "10ml": "/images/elite-10ml.png", "30ml": "/images/glass-elite-30ml.png" } as const;

// ── SKYE (1) ─────────────────────────────────────────────────────────────────

const skye: DisplayFragrance[] = [
  {
    // slug: azzaro-wanted-by-night-inspired
    // Supplier: 'Azzaro Wanted By Night' — mid-year-2026 candidate
    // Canonical identity: Azzaro Wanted by Night EDP (2018). Male.
    // Evidence: mid-year-2026-research.json (Gemini, 2026-08-08). AI_RESEARCH_SUMMARY.
    // LOCK A (FLANKER IDENTITY): distinct from azzaro-wanted-inspired (2016 original) and
    //   azzaro-most-wanted-inspired. "Fruity Notes" and "Iso E Super" preserved literally.
    //   family = ["Woody", "Spicy", "Tobacco"]. No "Aromatic" or "Leather" as primary family.
    // Perfumers: Quentin Bisch, Michel Almairac (SECONDARY_SUPPORTED — include if generated).
    title:               "Azzaro Wanted By Night Inspired",
    collection:          "Skye",
    subtitle:            "Inspired by Azzaro Wanted by Night",
    mood:                "Bold Sensual Dark",
    profile:             "Woody Spicy Tobacco",
    season:              "Autumn",
    notes:               ["Cinnamon", "Mandarin Orange", "Lavender", "Lemon", "Fruity Notes", "Red Cedar", "Cumin", "Incense", "Tobacco", "Vanilla", "Cedar", "Leather", "Cypress", "Iso E Super", "Patchouli", "Benzoin"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              BLUE_IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Cinnamon", "Mandarin Orange", "Lavender", "Lemon"],
      heart: ["Fruity Notes", "Red Cedar", "Cumin", "Incense"],
      base:  ["Tobacco", "Vanilla", "Cedar", "Leather", "Cypress", "Iso E Super", "Patchouli", "Benzoin"],
    },
  },
];

// ── ROSE (2) ─────────────────────────────────────────────────────────────────

const rose: DisplayFragrance[] = [
  {
    // slug: 24-faubourg-inspired
    // Supplier: 'Hermes 24 Faubourg' — mid-year-2026 candidate
    // Canonical identity: Hermès 24 Faubourg EDP (1995). Female.
    // Evidence: mid-year-2026-research.json (Gemini, 2026-08-08). AI_RESEARCH_SUMMARY.
    // LOCK B (FULL PYRAMID): all 14 notes required — do NOT abbreviate.
    //   "Black Elder" in heart must be preserved. No "Fruity" as primary family.
    //   family = ["Floral", "Amber"]. Perfumer: Maurice Roucel (SECONDARY_SUPPORTED).
    title:               "24 Faubourg Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Hermès 24 Faubourg",
    mood:                "Luminous Warm Elegant",
    profile:             "Floral Amber",
    season:              "Spring",
    notes:               ["Hyacinth", "Orange", "Peach", "Bergamot", "Ylang-Ylang", "Jasmine", "Orange Blossom", "Gardenia", "Black Elder", "Iris", "Sandalwood", "Amber", "Patchouli", "Vanilla"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              PINK_IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Hyacinth", "Orange", "Peach", "Bergamot", "Ylang-Ylang"],
      heart: ["Jasmine", "Orange Blossom", "Gardenia", "Black Elder", "Iris"],
      base:  ["Sandalwood", "Amber", "Patchouli", "Vanilla"],
    },
  },
  {
    // slug: boss-nuit-pour-femme-inspired
    // Supplier: 'Hugo Boss - Boss Nuit Pour Femme' — mid-year-2026 candidate
    // Canonical identity: Hugo Boss Boss Nuit Pour Femme EDP (2012). Female.
    // Evidence: mid-year-2026-research.json (Gemini, 2026-08-08). AI_RESEARCH_SUMMARY.
    // LOCK C (SPARSE PYRAMID): 7-note pyramid is evidence-complete. Do NOT supplement.
    //   "White Flowers" in heart is a generic placeholder — do NOT expand to named florals.
    //   family = ["Floral"]. No "Powdery" without governed editorial confirmation.
    //   perfumer = UNKNOWN: must be OMITTED from generated record — do not fabricate.
    title:               "Boss Nuit Pour Femme Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Hugo Boss Nuit Pour Femme",
    mood:                "Soft Feminine Elegant",
    profile:             "Floral",
    season:              "Spring",
    notes:               ["Aldehydes", "Peach", "White Flowers", "Jasmine", "Violet", "Sandalwood", "Moss"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              PINK_IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Aldehydes", "Peach"],
      heart: ["White Flowers", "Jasmine", "Violet"],
      base:  ["Sandalwood", "Moss"],
    },
  },
];

// ── ELITE (1) ────────────────────────────────────────────────────────────────

const elite: DisplayFragrance[] = [
  {
    // slug: capri-lemon-sugar-inspired
    // Supplier: 'Kayali Capri In a Bottle Lemon Sugar 14' — mid-year-2026 candidate
    // Canonical identity: Kayali Capri In a Bottle Lemon Sugar | 14 EDP (2024). Unisex.
    //   Display identity MUST preserve "| 14" per Kayali naming convention.
    //   Slug: capri-lemon-sugar-inspired (pipe omitted for ASCII slug compatibility).
    // Evidence: mid-year-2026-research.json (Gemini, 2026-08-08). AI_RESEARCH_SUMMARY.
    //   sourceNotes: "Part of Kayali's Vacay in a Bottle collection released in 2024."
    // LOCK D (COLLECTION ELITE): unisex evidence + 47/48 Maison unisex→Elite precedent +
    //   scaffold default (Elite → unisex). No contrary editorial basis.
    //   family = ["Citrus", "Gourmand"]. No "Sweet" as redundant expansion.
    //   perfumer = UNKNOWN: must be OMITTED from generated record — do not fabricate.
    //   DO NOT infer relationship to light-blue-capri-in-love-inspired from naming.
    title:               "Capri Lemon Sugar Inspired",
    collection:          "Elite",
    subtitle:            "Inspired by Kayali Capri In a Bottle Lemon Sugar | 14",
    mood:                "Bright Playful Sweet",
    profile:             "Citrus Gourmand",
    season:              "Summer",
    notes:               ["Lemon", "Mandarin Orange", "Bergamot", "Freesia", "Raspberry", "Peach", "Brown Sugar", "Vanilla", "Musk", "Amber"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              ELITE_IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Lemon", "Mandarin Orange", "Bergamot"],
      heart: ["Freesia", "Raspberry", "Peach"],
      base:  ["Brown Sugar", "Vanilla", "Musk", "Amber"],
    },
  },
];

// ── Export ────────────────────────────────────────────────────────────────────

export const wave8Catalogue: DisplayFragrance[] = [...skye, ...rose, ...elite];
