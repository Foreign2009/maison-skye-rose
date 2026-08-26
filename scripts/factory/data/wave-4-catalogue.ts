/**
 * Knowledge Factory — Wave 4 Staging Catalogue
 *
 * EP-CAT-P18B: 20 Founder-approved Wave 4 identities registered for
 * controlled factory intake. Factory-only. NOT customer-facing.
 *
 * This file MUST NOT be imported by any module under app/.
 * Managed exclusively by: scripts/factory/intake.ts (quinary catalogue fallback).
 *
 * Collections:  ELITE (6) · SKYE (7) · ROSE (7) = 20 total
 *
 * EP-CAT-P18D STAGING — EVIDENCE-LOCKED
 *
 * All 20 records are at P18D governed staging state.
 * Notes, notesStructured, and notesEvidenceLocked are populated from
 * externally researched evidence in data/identity/source/wave-4-2026-research.json.
 * All evidence sourced in EP-CAT-P18C / EP-CAT-P18C-R1 (2026-08-25 / 2026-08-26).
 * No LLM general knowledge. No invented notes. No inferred tiers.
 *
 * mood, profile, and season values are governed curatorial fields derived
 * from the canonical fragranceFamily evidence in wave-4-2026-research.json.
 * These are evidence-led, not AI-generated.
 *
 * UNORDERED_GOVERNED_NOTES (1 entry — Jo Malone London):
 *   beach-blossom-inspired: notes=[all], notesStructured={ top:[], heart:[...all], base:[] }
 *   Jo Malone London presents flat bouquet (no top/heart/base pyramid).
 *   Pattern: Wave 2 / Wave 3 precedent (heartNotes transport convention only).
 *   No tier redistribution, no note deletion or addition permitted.
 *
 * OUD CADENZA — OUD_GAP_PROVEN_HIGH (resolved EP-CAT-P18C-R1 2026-08-26):
 *   Agarwood (Oud) confirmed in heart notes from Fragrantica (HIGH) and
 *   Harrods (HIGH, authorised retailer). Oriental Woody family confirmed.
 *   Oud-family classification approved for P18D staging.
 *
 * CREED DELPHINUS — ASSORTMENT_GAP_MISMATCH_INFORMATIONAL:
 *   Oriental Floral (not Aquatic). Founder confirmed RETAIN EP-CAT-P18C-R1.
 *
 * BLEU NOIR subtitle correction (EP-CAT-P18D):
 *   Supplier 'Blue Noir' → canonical 'for Him Bleu Noir'. French spelling.
 *   Intake title preserved as 'Blue Noir Inspired' (English, slug derivation).
 *   Subtitle updated to 'Inspired by Narciso Rodriguez for Him Bleu Noir'.
 *
 * GUCCI FLORA subtitle correction (EP-CAT-P18D):
 *   Resolved identity: Flora Gorgeous Gardenia EDP (2021).
 *   Founder confirmed Option B EP-CAT-P18C-R1 2026-08-26.
 *   Subtitle updated to 'Inspired by Gucci Flora Gorgeous Gardenia'.
 *
 * Supplier source: data/supplier/normalized/fragrance-list-2026-08-normalized.json
 * Evidence source: data/identity/source/wave-4-2026-research.json
 * All 20 identities confirmed as NEW_SUPPLIER_CANDIDATE with no existingMKCSlug.
 * All 20 slugs confirmed clear across native, draft, review, and promotion registries.
 *
 * P18A DISCREPANCY RESOLVED:
 * Authoritative native counts: Skye 87, Rose 83, Elite 32 = 202 total.
 * Post-Wave-4 projected counts: Elite 38, Skye 94, Rose 90 = 222 total.
 *
 * Pricing: prices is a required (non-optional) field on DisplayFragrance.
 * Canonical retail pricing: 5ml=60, 10ml=100, 30ml=250 (ZAR).
 *
 * Images: empty string placeholders. No product photography for pre-promoted
 * identities. Populated at MKC promotion time.
 *
 * Slug derivation: titles are crafted so that
 *   title.toLowerCase().replace(/\s+/g, "-")
 * produces the governed slug. Diacritics stripped from titles;
 * preserved in subtitles.
 */

import type { DisplayFragrance } from "../../../app/lib/knowledgeAdapter";

// Canonical retail pricing. Required field — cannot be omitted on DisplayFragrance.
const PRICES = { "5ml": 60, "10ml": 100, "30ml": 250 } as const;

// Factory-staging image placeholders. No product photography for pre-promoted identities.
const IMAGES = { "5ml": "", "10ml": "", "30ml": "" } as const;

// ── ELITE (6) ────────────────────────────────────────────────────────────────

const elite: DisplayFragrance[] = [
  {
    // slug: creed-delphinus-inspired
    // Supplier: [UNISEX] 'Creed Delphinus EDP' — NEW_SUPPLIER_CANDIDATE
    // Gap addressed: Oriental Floral (Elite). ASSORTMENT_GAP_MISMATCH_INFORMATIONAL:
    // P18A targeted Aquatic/Fresh gap; Founder confirmed RETAIN EP-CAT-P18C-R1.
    // Evidence: Fragrantica (HIGH). Source: wave-4-2026-research.json UNISEX-21.
    title:               "Creed Delphinus Inspired",
    collection:          "Elite",
    subtitle:            "Inspired by Creed Delphinus EDP",
    mood:                "Warm Spiced Oriental",
    profile:             "Oriental Floral",
    season:              "Autumn",
    notes:               ["Almond", "Incense", "Black Pepper", "Pink Pepper", "Orris", "Heliotrope", "Orchid", "Bourbon Vanilla", "Tonka Bean", "Leather", "Amberwood", "Patchouli"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Almond", "Incense", "Black Pepper", "Pink Pepper"],
      heart: ["Orris", "Heliotrope", "Orchid"],
      base:  ["Bourbon Vanilla", "Tonka Bean", "Leather", "Amberwood", "Patchouli"],
    },
  },
  {
    // slug: aqua-allegoria-rosa-verde-inspired
    // Supplier: [UNISEX] 'Aqua Allegoria Rosa Verde by Guerlain' — NEW_SUPPLIER_CANDIDATE
    // Gap addressed: Citrus/Fresh — critical gap (Elite collection)
    // Evidence: Fragrantica (HIGH). Source: wave-4-2026-research.json UNISEX-7.
    title:               "Aqua Allegoria Rosa Verde Inspired",
    collection:          "Elite",
    subtitle:            "Inspired by Guerlain Aqua Allegoria Rosa Verde",
    mood:                "Fresh Green Floral",
    profile:             "Floral Fresh",
    season:              "Spring",
    notes:               ["Cucumber", "Mint", "Bergamot", "Rose", "Violet", "Pear", "Musk", "Chypre Notes", "Iris"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Cucumber", "Mint", "Bergamot"],
      heart: ["Rose", "Violet", "Pear"],
      base:  ["Musk", "Chypre Notes", "Iris"],
    },
  },
  {
    // slug: vanilla-powder-inspired
    // Supplier: [UNISEX] 'Vanilla Powder by Matiere Premiere' — NEW_SUPPLIER_CANDIDATE
    // Gap addressed: Powdery/Vanilla — critical gap (Elite collection)
    // Evidence: Fragrantica (HIGH). Source: wave-4-2026-research.json UNISEX-51.
    title:               "Vanilla Powder Inspired",
    collection:          "Elite",
    subtitle:            "Inspired by Matière Première Vanilla Powder",
    mood:                "Sweet Powdery Vanilla",
    profile:             "Gourmand Vanilla",
    season:              "Autumn",
    notes:               ["Coconut Powder", "Heliotrope", "Madagascar Vanilla", "Vanilla Absolute", "White Musk", "Musk", "Palo Santo", "Coconut", "Lactones"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Coconut Powder", "Heliotrope"],
      heart: ["Madagascar Vanilla"],
      base:  ["Vanilla Absolute", "White Musk", "Musk", "Palo Santo", "Coconut", "Lactones"],
    },
  },
  {
    // slug: beach-blossom-inspired
    // Supplier: [UNISEX] 'Jo Malone Beach Blossom' — NEW_SUPPLIER_CANDIDATE
    // Gap addressed: Fresh/Aromatic Green, Vacation occasion (Elite collection)
    // UNORDERED_GOVERNED_NOTES — Jo Malone London presents flat bouquet.
    // All notes in heartNotes[]; top=[], base=[] per Wave 2/3 governance precedent.
    // Founder confirmed RETAIN EP-CAT-P18C-R1 (Fragrantica 'Limited Edition' advisory).
    // Evidence: Fragrantica (HIGH). Source: wave-4-2026-research.json UNISEX-59.
    title:               "Beach Blossom Inspired",
    collection:          "Elite",
    subtitle:            "Inspired by Jo Malone London Beach Blossom",
    mood:                "Fresh Tropical",
    profile:             "Aromatic Green",
    season:              "Summer",
    notes:               ["Lime", "Mint", "Coconut Water", "Tonka Bean"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   [],
      heart: ["Lime", "Mint", "Coconut Water", "Tonka Bean"],
      base:  [],
    },
  },
  {
    // slug: ck-one-inspired
    // Supplier: [UNISEX] 'CK One' — NEW_SUPPLIER_CANDIDATE
    // Gap addressed: Fresh/Clean unisex — iconic fresh (Elite collection)
    // Evidence: Fragrantica (HIGH), Basenotes (HIGH). Source: wave-4-2026-research.json UNISEX-19.
    title:               "CK One Inspired",
    collection:          "Elite",
    subtitle:            "Inspired by Calvin Klein CK One",
    mood:                "Fresh Clean Unisex",
    profile:             "Citrus Aromatic",
    season:              "Spring",
    notes:               ["Lemon", "Green Notes", "Bergamot", "Mandarin Orange", "Pineapple", "Cardamom", "Papaya", "Lily-of-the-Valley", "Jasmine", "Violet", "Rose", "Nutmeg", "Orris Root", "Freesia", "Green Accord", "Musk", "Cedar", "Green Tea", "Sandalwood", "Oakmoss", "Amber"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Lemon", "Green Notes", "Bergamot", "Mandarin Orange", "Pineapple", "Cardamom", "Papaya"],
      heart: ["Lily-of-the-Valley", "Jasmine", "Violet", "Rose", "Nutmeg", "Orris Root", "Freesia"],
      base:  ["Green Accord", "Musk", "Cedar", "Green Tea", "Sandalwood", "Oakmoss", "Amber"],
    },
  },
  {
    // slug: oud-cadenza-inspired
    // Supplier: [UNISEX] 'Oud Cadenza by Maison Crivelli' — NEW_SUPPLIER_CANDIDATE
    // Gap addressed: Oud — critical gap (Elite collection)
    // OUD_GAP_PROVEN_HIGH (EP-CAT-P18C-R1 2026-08-26): Agarwood (Oud) confirmed
    // in heart notes from Fragrantica (HIGH) and Harrods (HIGH, authorised retailer).
    // Oriental Woody family confirmed. Oud classification approved for P18D staging.
    // Evidence: Fragrantica (HIGH), Harrods (HIGH). Source: wave-4-2026-research.json UNISEX-82.
    title:               "Oud Cadenza Inspired",
    collection:          "Elite",
    subtitle:            "Inspired by Maison Crivelli Oud Cadenza",
    mood:                "Rich Spiced Oud",
    profile:             "Oriental Woody",
    season:              "Autumn",
    notes:               ["Saffron", "Cinnamon", "Cardamom", "Nutmeg", "Ginger", "Pink Pepper", "Dates", "Agarwood (Oud)", "Caramel", "Sugar Cane", "Incense", "Amberwood", "Myrrh", "Davana", "Madagascar Vanilla", "Cacao Butter", "Tonka Bean", "Leather", "Benzoin", "Musk", "Patchouli", "Labdanum", "Mate"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Saffron", "Cinnamon", "Cardamom", "Nutmeg", "Ginger", "Pink Pepper"],
      heart: ["Dates", "Agarwood (Oud)", "Caramel", "Sugar Cane", "Incense", "Amberwood", "Myrrh", "Davana"],
      base:  ["Madagascar Vanilla", "Cacao Butter", "Tonka Bean", "Leather", "Benzoin", "Musk", "Patchouli", "Labdanum", "Mate"],
    },
  },
];

// ── SKYE (7) ─────────────────────────────────────────────────────────────────

const skye: DisplayFragrance[] = [
  {
    // slug: cool-water-inspired
    // Supplier: [MEN] 'Cool Water' — NEW_SUPPLIER_CANDIDATE
    // Gap addressed: Aquatic/Fresh — critical gap (Skye collection)
    // Evidence: Fragrantica (HIGH), Wikipedia (HIGH). Source: wave-4-2026-research.json MEN-45.
    title:               "Cool Water Inspired",
    collection:          "Skye",
    subtitle:            "Inspired by Davidoff Cool Water",
    mood:                "Fresh Aquatic",
    profile:             "Aquatic Fougère",
    season:              "Summer",
    notes:               ["Sea Water", "Lavender", "Mint", "Green Notes", "Rosemary", "Calone", "Coriander", "Sandalwood", "Neroli", "Geranium", "Jasmine", "Musk", "Tobacco", "Oakmoss", "Cedar", "Amber"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Sea Water", "Lavender", "Mint", "Green Notes", "Rosemary", "Calone", "Coriander"],
      heart: ["Sandalwood", "Neroli", "Geranium", "Jasmine"],
      base:  ["Musk", "Tobacco", "Oakmoss", "Cedar", "Amber"],
    },
  },
  {
    // slug: dylan-blue-inspired
    // Supplier: [MEN] 'Versace Dylan Blue' — NEW_SUPPLIER_CANDIDATE
    // Gap addressed: Aquatic/Citrus — critical gap (Skye collection)
    // Note: distinct from Dylan Blue Pour Femme (R4, Rose collection).
    // Evidence: versace.com (AUTHORITATIVE), Fragrantica (HIGH). Source: wave-4-2026-research.json MEN-139.
    title:               "Dylan Blue Inspired",
    collection:          "Skye",
    subtitle:            "Inspired by Versace Dylan Blue",
    mood:                "Fresh Aquatic Aromatic",
    profile:             "Aromatic Aquatic",
    season:              "Summer",
    notes:               ["Water Notes", "Fig Leaves", "Bergamot", "Grapefruit", "Violet Leaves", "Patchouli", "Papyrus", "Black Pepper", "Ambroxan", "Musk", "Saffron", "Incense", "Tonka Bean"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Water Notes", "Fig Leaves", "Bergamot", "Grapefruit"],
      heart: ["Violet Leaves", "Patchouli", "Papyrus", "Black Pepper", "Ambroxan"],
      base:  ["Musk", "Saffron", "Incense", "Tonka Bean"],
    },
  },
  {
    // slug: polo-blue-inspired
    // Supplier: [MEN] 'Polo Blue' — NEW_SUPPLIER_CANDIDATE
    // Gap addressed: Fresh/Aquatic/Sport (Skye collection)
    // Evidence: ralphlaurenfragrances.com (AUTHORITATIVE), Fragrantica (HIGH). Source: wave-4-2026-research.json MEN-118.
    title:               "Polo Blue Inspired",
    collection:          "Skye",
    subtitle:            "Inspired by Ralph Lauren Polo Blue",
    mood:                "Crisp Aquatic Fresh",
    profile:             "Aquatic Fresh",
    season:              "Summer",
    notes:               ["Cantaloupe Melon Accord", "Cucumber Accord", "Watery Melon Accord", "Bergamot Oil", "Aquatic Accord", "Clary Sage Oil", "Geranium Oil", "Basil Verbena Oil", "Washed Suede Accord", "Patchouli Heart", "Sheer Musk Accord"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Cantaloupe Melon Accord", "Cucumber Accord", "Watery Melon Accord", "Bergamot Oil"],
      heart: ["Aquatic Accord", "Clary Sage Oil", "Geranium Oil", "Basil Verbena Oil"],
      base:  ["Washed Suede Accord", "Patchouli Heart", "Sheer Musk Accord"],
    },
  },
  {
    // slug: prada-paradigme-inspired
    // Supplier: [MEN] 'Prada Paradigme' — NEW_SUPPLIER_CANDIDATE
    // Gap addressed: Aromatic/Oriental premium (Skye collection)
    // P18B identity verification flag RESOLVED — confirmed distinct from Prada Paradoxe.
    // Evidence: prada.com (AUTHORITATIVE), Fragrantica (HIGH). Source: wave-4-2026-research.json MEN-172.
    title:               "Prada Paradigme Inspired",
    collection:          "Skye",
    subtitle:            "Inspired by Prada Paradigme",
    mood:                "Warm Aromatic Oriental",
    profile:             "Oriental Fougère",
    season:              "Autumn",
    notes:               ["Calabrian Bergamot", "Musk", "Bourbon Geranium", "Rose Geranium", "Benzoin", "Peru Balsam", "Guaiac Wood"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Calabrian Bergamot", "Musk"],
      heart: ["Bourbon Geranium", "Rose Geranium"],
      base:  ["Benzoin", "Peru Balsam", "Guaiac Wood"],
    },
  },
  {
    // slug: legend-blue-inspired
    // Supplier: [MEN] 'Legend Blue by Mont Blanc' — NEW_SUPPLIER_CANDIDATE
    // Gap addressed: Fresh/Woody Aromatic (Skye collection)
    // Distinct from montblanc-legend-inspired (Aromatic/Woody, already native).
    // Evidence: montblanc.com (AUTHORITATIVE), Fragrantica (HIGH). Source: wave-4-2026-research.json MEN-186.
    title:               "Legend Blue Inspired",
    collection:          "Skye",
    subtitle:            "Inspired by Mont Blanc Legend Blue",
    mood:                "Fresh Woody Aromatic",
    profile:             "Woody Aromatic",
    season:              "Autumn",
    notes:               ["Mint", "Lavender", "Cedar", "Sandalwood", "Ambroxan", "Moss"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Mint", "Lavender"],
      heart: ["Cedar", "Sandalwood"],
      base:  ["Ambroxan", "Moss"],
    },
  },
  {
    // slug: blue-noir-inspired
    // Supplier: [MEN] 'Blue Noir by Narciso Rodriquez' — NEW_SUPPLIER_CANDIDATE
    // Supplier spells brand 'Rodriquez' (typo); canonical is 'Narciso Rodriguez'.
    // Supplier uses English 'Blue Noir'; canonical product name is French 'Bleu Noir'.
    // Title preserves English 'Blue Noir' for slug derivation convention.
    // Subtitle corrected to canonical 'for Him Bleu Noir' (EP-CAT-P18D 2026-08-26).
    // Gap addressed: Aromatic Woody Musk masculine (Skye collection)
    // Evidence: narcisorodriguezparfums.com (AUTHORITATIVE), Fragrantica (HIGH).
    // Source: wave-4-2026-research.json MEN-151.
    title:               "Blue Noir Inspired",
    collection:          "Skye",
    subtitle:            "Inspired by Narciso Rodriguez for Him Bleu Noir",
    mood:                "Fresh Woody Musky",
    profile:             "Aromatic Woody Musk",
    season:              "Autumn",
    notes:               ["Cypress", "Cardamom", "Bergamot", "Mandarin Orange", "Iris", "Suede", "Musk", "Sandalwood", "Tonka Bean", "Leather", "Vetiver", "Atlas Cedar"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Cypress", "Cardamom", "Bergamot", "Mandarin Orange"],
      heart: ["Iris", "Suede", "Musk"],
      base:  ["Sandalwood", "Tonka Bean", "Leather", "Vetiver", "Atlas Cedar"],
    },
  },
  {
    // slug: bvlgari-aqva-marine-inspired
    // Supplier: [MEN] 'Bulgari Aqva Marine' — NEW_SUPPLIER_CANDIDATE
    // Note: supplier spells brand 'Bulgari'; canonical is 'Bvlgari'.
    // Subtitle uses canonical brand spelling.
    // Distinct from bvlgari-aqua-inspired (original Aqva, already native)
    // and aqva-amara-inspired (Aqva Amara flanker, already native).
    // Gap addressed: Aquatic/Marine luxury (Skye collection)
    // Evidence: Fragrantica (HIGH). Source: wave-4-2026-research.json MEN-34.
    title:               "Bvlgari Aqva Marine Inspired",
    collection:          "Skye",
    subtitle:            "Inspired by Bvlgari AQVA Marine Pour Homme",
    mood:                "Fresh Marine Aquatic",
    profile:             "Aromatic Aquatic",
    season:              "Summer",
    notes:               ["Grapefruit", "Neroli", "Mandarin Orange", "Petitgrain", "Water Notes", "Seaweed", "Rosemary", "Virginia Cedar", "Amber"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Grapefruit", "Neroli", "Mandarin Orange", "Petitgrain"],
      heart: ["Water Notes", "Seaweed", "Rosemary"],
      base:  ["Virginia Cedar", "Amber"],
    },
  },
];

// ── ROSE (7) ─────────────────────────────────────────────────────────────────

const rose: DisplayFragrance[] = [
  {
    // slug: dkny-be-delicious-green-inspired
    // Supplier: [LADIES] 'DKNY be Delicious (Green)' — NEW_SUPPLIER_CANDIDATE
    // '(Green)' in supplier name is a colloquial descriptor for the green apple bottle,
    // not part of the official product name. Canonical name: 'DKNY Be Delicious'.
    // LADIES category confirmed; MEN version is a separate supplier entry.
    // Gap addressed: Citrus/Fresh/Fruity — critical gap (Rose collection)
    // Evidence: Fragrantica (HIGH). Source: wave-4-2026-research.json LADIES-97.
    title:               "DKNY Be Delicious Green Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by DKNY Be Delicious",
    mood:                "Fresh Fruity Floral",
    profile:             "Floral Fruity",
    season:              "Spring",
    notes:               ["Cucumber", "Grapefruit", "Magnolia", "Green Apple", "Lily-of-the-Valley", "Tuberose", "Violet", "Rose", "Woodsy Notes", "Sandalwood", "Amber"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Cucumber", "Grapefruit", "Magnolia"],
      heart: ["Green Apple", "Lily-of-the-Valley", "Tuberose", "Violet", "Rose"],
      base:  ["Woodsy Notes", "Sandalwood", "Amber"],
    },
  },
  {
    // slug: clinique-happy-inspired
    // Supplier: [LADIES] 'Clinique Happy' — NEW_SUPPLIER_CANDIDATE
    // LADIES category confirmed; MEN version is a separate supplier entry.
    // Gap addressed: Citrus/Fresh — critical gap (Rose collection)
    // Evidence: Fragrantica (HIGH), clinique.com confirmed. Source: wave-4-2026-research.json LADIES-78.
    title:               "Clinique Happy Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Clinique Happy",
    mood:                "Bright Citrus Floral",
    profile:             "Citrus Floral",
    season:              "Spring",
    notes:               ["Orange", "Blood Grapefruit", "Indian Mandarin", "Bergamot", "Apple", "Plum", "Lily-of-the-Valley", "Freesia", "Orchid", "Rose", "Mimosa", "Lily", "Magnolia", "Musk", "Amber"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Orange", "Blood Grapefruit", "Indian Mandarin", "Bergamot", "Apple", "Plum"],
      heart: ["Lily-of-the-Valley", "Freesia", "Orchid", "Rose"],
      base:  ["Mimosa", "Lily", "Magnolia", "Musk", "Amber"],
    },
  },
  {
    // slug: narciso-pure-musc-inspired
    // Supplier: [LADIES] 'Narciso Pure Musc' — NEW_SUPPLIER_CANDIDATE
    // Distinct from narciso-rodriguez-for-her-inspired (2003) and narciso-rouge-inspired (2019).
    // Pure Musc has a unique 4-note minimal composition with Musk as lead top note.
    // Gap addressed: Powdery/Musc — critical gap (Rose collection)
    // Evidence: narcisorodriguezparfums.com (AUTHORITATIVE), Fragrantica (HIGH).
    // Source: wave-4-2026-research.json LADIES-204.
    title:               "Narciso Pure Musc Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Narciso Rodriguez Pure Musc",
    mood:                "Clean Musky Floral",
    profile:             "Floral Woody Musk",
    season:              "Spring",
    notes:               ["Musk", "Jasmine", "Ylang-Ylang", "Orange Blossom", "Cashmeran"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Musk"],
      heart: ["Jasmine", "Ylang-Ylang", "Orange Blossom"],
      base:  ["Cashmeran"],
    },
  },
  {
    // slug: dylan-blue-pour-femme-inspired
    // Supplier: [LADIES] 'Versace Dylan Blue' — NEW_SUPPLIER_CANDIDATE
    // LADIES category confirmed. This is the feminine version (Dylan Blue Pour Femme).
    // Distinct from dylan-blue-inspired (S2, Skye, MEN supplier entry).
    // Contains proprietary captive ingredients: Pétalia, Rosyfolia, Shisolia —
    // preserved verbatim per BRANDED MOLECULES governance.
    // Gap addressed: Floral/Aquatic — critical gap (Rose collection)
    // Evidence: versace.com (AUTHORITATIVE), Fragrantica (HIGH). Source: wave-4-2026-research.json LADIES-275.
    title:               "Dylan Blue Pour Femme Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Versace Dylan Blue Pour Femme",
    mood:                "Fresh Floral Aquatic",
    profile:             "Floral Aquatic",
    season:              "Spring",
    notes:               ["Blackcurrant", "Granny Smith Apple", "Clover Accord", "Forget-me-not Accord", "Shisolia", "Eglantine Rose", "Pétalia", "Rosyfolia", "Jasmine", "Icy Infusion of Peach", "Styrax", "White Smooth Woods", "Musk", "Patchouli Coeur"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Blackcurrant", "Granny Smith Apple", "Clover Accord", "Forget-me-not Accord", "Shisolia"],
      heart: ["Eglantine Rose", "Pétalia", "Rosyfolia", "Jasmine", "Icy Infusion of Peach"],
      base:  ["Styrax", "White Smooth Woods", "Musk", "Patchouli Coeur"],
    },
  },
  {
    // slug: cherry-in-the-air-inspired
    // Supplier: [LADIES] 'Escada Cherry In The Air' — NEW_SUPPLIER_CANDIDATE
    // Supplier name 'Escada Cherry In The Air' locks the 2013 edition identity
    // (distinct from other years in the Escada annual summer series).
    // Founder confirmed RETAIN EP-CAT-P18C-R1 2026-08-26.
    // 'Daim' = suede accord (French) — preserved verbatim per evidence.
    // Gap addressed: Fruity/Fresh, Summer/Vacation occasion (Rose collection)
    // Evidence: Fragrantica (HIGH). Source: wave-4-2026-research.json LADIES-117.
    title:               "Cherry In The Air Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Escada Cherry in the Air",
    mood:                "Sweet Fruity Floral",
    profile:             "Floral Fruity",
    season:              "Summer",
    notes:               ["Sour Cherry", "Raspberry", "Daim", "Mandarin Orange", "Marshmallow", "Vanilla", "Gardenia", "Orchid", "White Suede", "Sandalwood", "Musk", "Oak"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Sour Cherry", "Raspberry", "Daim", "Mandarin Orange"],
      heart: ["Marshmallow", "Vanilla", "Gardenia", "Orchid"],
      base:  ["White Suede", "Sandalwood", "Musk", "Oak"],
    },
  },
  {
    // slug: chloe-original-inspired
    // Supplier: [LADIES] 'Chloe Original' — NEW_SUPPLIER_CANDIDATE
    // Note: supplier spells brand 'Chloe'; canonical is 'Chloé'.
    // Title strips diacritic per slug-derivation convention.
    // Subtitle preserves diacritic per Wave 3 precedent.
    // Gap addressed: Classic luxury floral (Rose collection)
    // Evidence: Fragrantica (HIGH), Basenotes (HIGH). Source: wave-4-2026-research.json LADIES-70.
    title:               "Chloe Original Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Chloé Original",
    mood:                "Soft Powdery Floral",
    profile:             "Floral",
    season:              "Spring",
    notes:               ["Peony", "Litchi", "Freesia", "Rose", "Lily-of-the-Valley", "Magnolia", "Virginia Cedar", "Amber"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Peony", "Litchi", "Freesia"],
      heart: ["Rose", "Lily-of-the-Valley", "Magnolia"],
      base:  ["Virginia Cedar", "Amber"],
    },
  },
  {
    // slug: gucci-flora-inspired
    // Supplier: [LADIES] 'Gucci Flora' — NEW_SUPPLIER_CANDIDATE
    // Identity resolved: Flora Gorgeous Gardenia EDP (2021).
    // Founder confirmed Option B EP-CAT-P18C-R1 2026-08-26.
    // Subtitle corrected to 'Inspired by Gucci Flora Gorgeous Gardenia' (EP-CAT-P18D).
    // Gap addressed: Fresh Floral premium (Rose collection)
    // Evidence: Fragrantica (HIGH). Source: wave-4-2026-research.json LADIES-127.
    title:               "Gucci Flora Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Gucci Flora Gorgeous Gardenia",
    mood:                "Bright Fruity Floral",
    profile:             "Floral Fruity",
    season:              "Spring",
    notes:               ["Pear Blossom", "Red Berries", "Italian Mandarin", "Gardenia", "Jasmine", "Frangipani", "Brown Sugar", "Patchouli"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Pear Blossom", "Red Berries", "Italian Mandarin"],
      heart: ["Gardenia", "Jasmine", "Frangipani"],
      base:  ["Brown Sugar", "Patchouli"],
    },
  },
];

// ── Export ────────────────────────────────────────────────────────────────────

export const wave4Catalogue: DisplayFragrance[] = [...elite, ...skye, ...rose];
