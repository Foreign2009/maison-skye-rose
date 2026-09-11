/**
 * Knowledge Factory — Wave 7 Staging Catalogue
 *
 * CATALOGUE-WAVE7-P1: 8 evidence-verified Wave 7 identities registered for
 * controlled factory intake. Factory-only. NOT customer-facing.
 *
 * This file MUST NOT be imported by any module under app/.
 * Managed exclusively by: scripts/factory/intake.ts (octenary catalogue fallback).
 *
 * Collections:  SKYE (3) · ROSE (5) = 8 total
 *
 * EVIDENCE LOCK
 *
 * All 8 records are at CATALOGUE-WAVE7-P1 governed evidence-lock state.
 * Notes, notesStructured, and notesEvidenceLocked are populated from
 * externally researched evidence verified in CATALOGUE-SRC-P1 (2026-09-10).
 * No LLM general knowledge. No invented notes. No inferred tiers.
 *
 * GOVERNANCE LOCKS ACTIVE (must not regress):
 *
 *   LOCK A — Leather Malaki:
 *     OUD_IN_PYRAMID=NO, OUD_IN_FAMILY=NO, OUD_IN_MAIN_ACCORDS=NO.
 *     No "leather-oud", no "oud leather", no oud positioning anywhere.
 *     Evidence: official Chopard source (AUTHORITATIVE) — no oud note present.
 *     notesEvidenceLocked=true: CompositionProducer bypassed entirely.
 *
 *   LOCK B — La Nuit Trésor Nude:
 *     Sparse 1/1/2 pyramid (Bergamot/Rose/Vanilla+Coconut) is authoritative.
 *     notesEvidenceLocked=true: do NOT enrich or add notes to satisfy minimums.
 *     Evidence: Fragrantica (HIGH) — the deliberately minimal EDT composition.
 *
 *   LOCK C — Cool Water Woman:
 *     Travel occasion must NOT be assigned. No evidence supports Travel.
 *     Official Davidoff positioning: "everyday wear, warm-weather occasions".
 *     Travel language absent from all official sources.
 *
 *   LOCK D — Ultraviolet Woman:
 *     Canonical brand reference = "Rabanne" (not "Paco Rabanne").
 *     Brand rebranded: subtitle must use "Rabanne Ultraviolet Woman".
 *
 *   LOCK E — Polo Sport:
 *     Family = ["Aromatic", "Aquatic"]. Profile = "Aromatic Aquatic".
 *     Evidence: mainAccords includes "aquatic" prominently; Seagrass heart note;
 *     character descriptions consistently lead with aquatic identity.
 *
 *   P2R — Leather Malaki gender = male.
 *     Supplier classified UNISEX-66 but official Chopard (AUTHORITATIVE) and
 *     Fragrantica (HIGH) classify as men's fragrance. Malaki line pattern confirms
 *     deliberate male designation. Explicit gender override required.
 *
 * HELD CANDIDATES (not registered here):
 *   MK Rose Radiant Gold (LADIES-193): evidenceStatus=RESEARCH_PARTIAL. HOLD_FOR_EVIDENCE.
 *   Lacoste Rose (LADIES-176): identity ambiguous. HOLD_FOR_DISAMBIGUATION.
 *
 * Supplier source: data/identity/source/src-p1-2026-supplier.json
 * Evidence: CATALOGUE-SRC-P1 research session (2026-09-10).
 * All 8 slugs confirmed clear: native MKC, production fragrances.ts, Waves 1–6, drafts.
 *
 * Canonical retail pricing: 5ml=60, 10ml=100, 30ml=250 (ZAR).
 * Images: placeholders. Populated at MKC promotion time.
 *   BLUE_IMAGES: Skye (male).
 *   PINK_IMAGES: Rose (female).
 *
 * Pre-Wave-7 baseline: 255 native MKC records (Elite 48, Skye 105, Rose 102).
 * Post-Wave-7 projected (all promoted): Skye 108, Rose 107 = 263 total.
 */

import type { DisplayFragrance } from "../../../app/lib/knowledgeAdapter";

const PRICES = { "5ml": 60, "10ml": 100, "30ml": 250 } as const;

const BLUE_IMAGES = { "5ml": "/images/blue-5ml.png", "10ml": "/images/blue-10ml.png", "30ml": "/images/glass-blue-30ml.png" } as const;
const PINK_IMAGES = { "5ml": "/images/pink-5ml.png", "10ml": "/images/pink-10ml.png", "30ml": "/images/glass-pink-30ml.png" } as const;

// ── SKYE (3) ─────────────────────────────────────────────────────────────────

const skye: DisplayFragrance[] = [
  {
    // slug: polo-sport-inspired
    // Supplier: [MEN] 'Polo Sport' (MEN-121) — SRC-P1 candidate
    // Canonical identity: Ralph Lauren Polo Sport EDT (1994). Male.
    // Evidence: Fragrantica (HIGH), Basenotes. Source: CATALOGUE-SRC-P1 (2026-09-10).
    // LOCK E: family = ["Aromatic", "Aquatic"]. Profile = "Aromatic Aquatic".
    //   fragranceFamily="Aromatic Green" but mainAccords includes "aquatic" prominently.
    //   Seagrass heart note and aquatic character confirmed. P0 correction accepted.
    // Gap: Energetic×male — sporty aquatic character and active lifestyle positioning.
    title:               "Polo Sport Inspired",
    collection:          "Skye",
    subtitle:            "Inspired by Ralph Lauren Polo Sport",
    mood:                "Fresh Energetic",
    profile:             "Aromatic Aquatic",
    season:              "Summer",
    notes:               ["Mint", "Lavender", "Bergamot", "Lemon", "Mandarin Orange", "Aldehydes", "Artemisia", "Neroli", "Pineapple", "Seagrass", "Ginger", "Jasmine", "Geranium", "Cyclamen", "Rose", "Brazilian Rosewood", "Musk", "Sandalwood", "Cedar", "Guaiac Wood", "Amber"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              BLUE_IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Mint", "Lavender", "Bergamot", "Lemon", "Mandarin Orange", "Aldehydes", "Artemisia", "Neroli", "Pineapple"],
      heart: ["Seagrass", "Ginger", "Jasmine", "Geranium", "Cyclamen", "Rose", "Brazilian Rosewood"],
      base:  ["Musk", "Sandalwood", "Cedar", "Guaiac Wood", "Amber"],
    },
  },
  {
    // slug: leather-malaki-inspired
    // Supplier: [UNISEX] 'Leather Malaki / Chopard' (UNISEX-66) — SRC-P1 candidate
    // Canonical identity: Chopard Leather Malaki EDP (2024). Male.
    // Evidence: chopard.com (AUTHORITATIVE). Source: CATALOGUE-SRC-P1 (2026-09-10).
    // LOCK A (OUD PROHIBITION): No oud in any note, family, or accord. Not optional.
    //   Official Chopard pyramid contains zero oud. Registration is oud-clean.
    //   notesEvidenceLocked=true: CompositionProducer bypassed — no AI note generation.
    // P2R GENDER OVERRIDE: explicit "male" overrides supplier UNISEX-66 classification.
    //   Evidence: Chopard /perfume-for-men/ URL (AUTHORITATIVE) + Fragrantica "for men" +
    //   Malaki line pattern (five unisex variants; Oud and Leather are explicitly male).
    gender:              "male",
    title:               "Leather Malaki Inspired",
    collection:          "Skye",
    subtitle:            "Inspired by Chopard Leather Malaki",
    mood:                "Dry Smoky Leather Mineral",
    profile:             "Leather Woody",
    season:              "Autumn",
    notes:               ["Bergamot", "Black Pepper", "Alaskan Cedar", "Cypress", "Spicy Notes", "Leather", "Labdanum", "Mineral Notes", "Amber"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              BLUE_IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Bergamot", "Black Pepper"],
      heart: ["Alaskan Cedar", "Cypress", "Spicy Notes"],
      base:  ["Leather", "Labdanum", "Mineral Notes", "Amber"],
    },
  },
  {
    // slug: leau-dissey-pour-homme-sport-inspired
    // Supplier: [MEN] 'Issey Miyake Sport' (MEN-85) — SRC-P1 candidate
    // Canonical identity: Issey Miyake L'Eau d'Issey Pour Homme Sport EDT (2012). Male.
    //   Title uses ASCII-safe form matching slug derivation convention (cf. wave-2 leau-dissey).
    //   Confirmed distinct from leau-dissey-pour-homme-inspired (1994 original, different character).
    // Evidence: Fragrantica (HIGH). Source: CATALOGUE-SRC-P1 (2026-09-10).
    // NOTE: Energetic vibe is evidence-supported — Fragrantica: "energetic, unconventional
    //   edition ideal for everyday use." Coastal NOT assigned: no aquatic/marine notes
    //   (composition: bergamot/grapefruit/nutmeg/leather/vetiver/cedar/ambergris).
    // Gap: Energetic×male — sporty citrus-spice everyday character (Fragrantica-evidenced).
    title:               "Leau Dissey Pour Homme Sport Inspired",
    collection:          "Skye",
    subtitle:            "Inspired by Issey Miyake L'Eau d'Issey Pour Homme Sport",
    mood:                "Fresh Energetic",
    profile:             "Aromatic Fresh Spicy",
    season:              "Spring",
    notes:               ["Bergamot", "Grapefruit", "Nutmeg", "Leather", "Vetiver", "Virginia Cedar", "Ambergris"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              BLUE_IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Bergamot", "Grapefruit"],
      heart: ["Nutmeg", "Leather"],
      base:  ["Vetiver", "Virginia Cedar", "Ambergris"],
    },
  },
];

// ── ROSE (5) ─────────────────────────────────────────────────────────────────

const rose: DisplayFragrance[] = [
  {
    // slug: ultraviolet-woman-inspired
    // Supplier: [LADIES] 'Paco Rabanne Ultra Violet' (LADIES-223) — SRC-P1 candidate
    // Canonical identity: Rabanne Ultraviolet Woman EDP (1999). Female.
    // Evidence: Fragrantica (HIGH), Rabanne official URL. Source: CATALOGUE-SRC-P1 (2026-09-10).
    // LOCK D (BRAND): subtitle uses "Rabanne" — brand rebranded from Paco Rabanne.
    //   Do NOT use "Paco Rabanne" in this record. Canonical brand = Rabanne.
    // Gap: Powdery×female, Spicy×female — violet/spice/patchouli character confirmed.
    title:               "Ultraviolet Woman Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Rabanne Ultraviolet Woman",
    mood:                "Bold Sensual Mysterious",
    profile:             "Floral Powdery Spicy",
    season:              "Autumn",
    notes:               ["Apricot", "Coriander", "Orange Pepper", "Red Pepper", "Fresh Almond", "Rosewood", "Violet", "Japanese Osmanthus", "Rose", "Jasmine", "Vanilla", "Amber", "Patchouli", "Cedar"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              PINK_IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Apricot", "Coriander", "Orange Pepper", "Red Pepper", "Fresh Almond", "Rosewood"],
      heart: ["Violet", "Japanese Osmanthus", "Rose", "Jasmine"],
      base:  ["Vanilla", "Amber", "Patchouli", "Cedar"],
    },
  },
  {
    // slug: roses-de-chloe-inspired
    // Supplier: [LADIES] 'Chloe Roses' (LADIES-71) — SRC-P1 candidate
    // Canonical identity: Chloé Roses de Chloé EDT (2013). Female.
    //   Title uses ASCII-safe form; subtitle preserves canonical accent form.
    //   Confirmed distinct from chloe-original-inspired (2008 EDP, different character).
    // Evidence: Fragrantica (HIGH). Source: CATALOGUE-SRC-P1 (2026-09-10).
    // Gap: Rose×female depth — Damask Rose as primary heart note.
    title:               "Roses de Chloe Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Chloé Roses de Chloé",
    mood:                "Fresh Romantic Floral",
    profile:             "Floral Fruity",
    season:              "Spring",
    notes:               ["Litchi", "Bergamot", "Tarragon", "Lemon", "Damask Rose", "Magnolia", "Cedar", "Apple", "Black Currant", "Peach", "White Musk", "Amber", "Woody Notes"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              PINK_IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Litchi", "Bergamot", "Tarragon", "Lemon"],
      heart: ["Damask Rose", "Magnolia", "Cedar", "Apple", "Black Currant", "Peach"],
      base:  ["White Musk", "Amber", "Woody Notes"],
    },
  },
  {
    // slug: 212-vip-rose-inspired
    // Supplier: [LADIES] '212 VIP Rose' (LADIES-7) — SRC-P1 candidate
    // Canonical identity: Carolina Herrera 212 VIP Rosé EDP (2014). Female.
    //   Title uses ASCII-safe form (no accent); subtitle preserves "Rosé".
    //   Confirmed distinct from 212-vip-black-inspired (different product line, different year).
    // Evidence: carolinaherrera.com (AUTHORITATIVE). Source: CATALOGUE-SRC-P1 (2026-09-10).
    // NOTE: family does NOT include "Rose" — derived from profile "Floral Fruity Woody" only.
    //   "Rosé" in product name is a marketing term, not a family assignment signal.
    // Gap: Rose×female depth — rose/peach blossom heart; sparkling feminine character.
    title:               "212 VIP Rose Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Carolina Herrera 212 VIP Rosé",
    mood:                "Luminous Feminine Magnetic",
    profile:             "Floral Fruity Woody",
    season:              "Spring",
    notes:               ["Champagne Rosé", "Pink Pepper", "Peach Blossom", "Rose", "Queenwood", "Musk"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              PINK_IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Champagne Rosé", "Pink Pepper"],
      heart: ["Peach Blossom", "Rose"],
      base:  ["Queenwood", "Musk"],
    },
  },
  {
    // slug: cool-water-woman-inspired
    // Supplier: [LADIES] 'Cool Water' (LADIES-84) — SRC-P1 candidate
    // Canonical identity: Davidoff Cool Water Woman EDT (1996). Female.
    //   Confirmed distinct from cool-water-inspired (1988 male, Skye, different composition).
    // Evidence: zinodavidoff.com (AUTHORITATIVE). Source: CATALOGUE-SRC-P1 (2026-09-10).
    // LOCK C (TRAVEL): Travel occasion must NOT be assigned.
    //   Official Davidoff sources have no Travel language. Character: "everyday wear,
    //   warm-weather occasions". Summer season → SEASON_OCCASIONS = [Daily Wear, Vacation,
    //   Summer Days] — no Travel. DiscoveryProducer must not introduce Travel in generation.
    // Gap: Aquatic×female — aquatic/fresh/floral character.
    title:               "Cool Water Woman Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Davidoff Cool Water Woman",
    mood:                "Fresh Luminous Feminine",
    profile:             "Aquatic Floral",
    season:              "Summer",
    notes:               ["Watermelon", "Pineapple", "Melon", "Lotus", "Lemon", "Calone", "Quince", "Lily", "Black Currant", "Lotus", "Water Lily", "Lily-of-the-Valley", "Jasmine", "Honey", "Hawthorn", "Rose", "Musk", "Vetiver", "Violet Root", "Sandalwood", "Peach", "Raspberry", "Blackberry", "Vanilla"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              PINK_IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Watermelon", "Pineapple", "Melon", "Lotus", "Lemon", "Calone", "Quince", "Lily", "Black Currant"],
      heart: ["Lotus", "Water Lily", "Lily-of-the-Valley", "Jasmine", "Honey", "Hawthorn", "Rose"],
      base:  ["Musk", "Vetiver", "Violet Root", "Sandalwood", "Peach", "Raspberry", "Blackberry", "Vanilla"],
    },
  },
  {
    // slug: la-nuit-tresor-nude-inspired
    // Supplier: [LADIES] 'La Nuit Tresor Nude' (LADIES-171) — SRC-P1 candidate
    // Canonical identity: Lancôme La Nuit Trésor Nude EDT (2020). Female.
    //   Title uses ASCII-safe form (no accent on Tresor); subtitle preserves accent form.
    //   Confirmed distinct from la-nuit-tresor-inspired (2015 EDP, richer pyramid).
    // Evidence: Fragrantica (HIGH). Source: CATALOGUE-SRC-P1 (2026-09-10).
    // LOCK B (SPARSE PYRAMID): 1/1/2 pyramid is authoritative — do NOT enrich.
    //   notesEvidenceLocked=true: validation NOTES_*_MIN checks are bypassed.
    //   Deliberately minimalist EDT flanker composition. Pyramid is evidence-complete.
    // Gap: flanker depth — lighter feminine rose/vanilla with bergamot brightness.
    title:               "La Nuit Tresor Nude Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Lancôme La Nuit Trésor Nude",
    mood:                "Warm Romantic Soft",
    profile:             "Floral Sweet Vanilla",
    season:              "Spring",
    notes:               ["Bergamot", "Rose", "Vanilla", "Coconut"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              PINK_IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Bergamot"],
      heart: ["Rose"],
      base:  ["Vanilla", "Coconut"],
    },
  },
];

// ── Export ────────────────────────────────────────────────────────────────────

export const wave7Catalogue: DisplayFragrance[] = [...skye, ...rose];
