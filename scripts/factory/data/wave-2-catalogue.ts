/**
 * Knowledge Factory — Wave 2 Staging Catalogue
 *
 * EP-CAT-P4C: 40 Founder-approved Wave 2 identities registered for
 * controlled factory intake. Factory-only. NOT customer-facing.
 *
 * This file MUST NOT be imported by any module under app/.
 * Managed exclusively by: scripts/factory/intake.ts (tertiary catalogue fallback).
 *
 * Collections:  ELITE (11) · ROSE (16) · SKYE (13) = 40 total
 *
 * All 40 entries are evidence-locked (notesEvidenceLocked: true).
 * Note evidence sourced exclusively from named external references in
 * data/identity/source/wave-2-2026-research.json. No LLM general knowledge.
 *
 * Five UNORDERED_GOVERNED_NOTES entries (brand presents as bouquet, no pyramid):
 *   gold-oud-inspired, peony-blush-suede-inspired, velvet-rose-oud-inspired,
 *   english-pear-freesia-inspired, oud-bergamot-inspired
 * Pattern: notes=[all], notesStructured={ top:[], heart:[...all], base:[] }
 * This is a TRANSPORT CONVENTION only — heartNotes[] does NOT assert
 * that these notes are semantically "heart tier". No top-note invention,
 * no tier redistribution, no note deletion or addition is permitted.
 * Precedent: bloom-inspired (Wave 1, Gucci Bloom).
 *
 * Founding content rule (UNORDERED_GOVERNED_NOTES): governed note strings
 * must survive the factory pipeline byte-for-byte. The evidence-lock
 * prevents AI generation from adding, removing, or redistributing notes.
 *
 * Slug derivation: all titles are crafted so that
 *   title.toLowerCase().replace(/\s+\g, "-")
 * produces exactly the Founder-approved proposedSlug from the Wave 2 research
 * artifact (data/identity/source/wave-2-2026-research.json).
 *
 * Founder decisions carried from EP-CAT-P4B-R1 (2026-08-18):
 *   MEN-83  → L'Eau d'Issey Pour Homme, collection SKYE
 *   MEN-87  → Le Male, collection SKYE
 *   LADIES-207 → Narciso Rouge EDP (2018) — NOT the 2019 EDT
 *   MEN-133 → Tuscan Leather, collection ELITE (moved from SKYE)
 *   UNISEX-55 → Peony & Blush Suede, ELITE confirmed
 *   UNISEX-64 → English Pear & Freesia, ELITE confirmed
 */

import type { DisplayFragrance } from "../../../app/lib/knowledgeAdapter";

// Canonical retail pricing. Required field — cannot be omitted on DisplayFragrance.
const PRICES = { "5ml": 60, "10ml": 100, "30ml": 250 } as const;

// Factory-staging image placeholders. No product photography for pre-promoted identities.
const IMAGES = { "5ml": "", "10ml": "", "30ml": "" } as const;

// ── ELITE (11) ────────────────────────────────────────────────────────────────

const elite: DisplayFragrance[] = [
  {
    // slug: tuscan-leather-inspired
    // Tom Ford Tuscan Leather (2007). FOUNDER_COLLECTION_DECISION EP-CAT-P4B-R1: moved SKYE→ELITE.
    // Tom Ford Private Blend genderless positioning governs.
    title:               "Tuscan Leather Inspired",
    collection:          "Elite",
    subtitle:            "Inspired by Tom Ford Tuscan Leather",
    mood:                "Dark Leather Spicy",
    profile:             "Leather Oriental",
    season:              "Winter",
    notes:               ["Raspberry", "Saffron", "Thyme", "Olibanum", "Jasmine", "Leather", "Suede", "Woody Notes", "Amber"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Raspberry", "Saffron", "Thyme"],
      heart: ["Olibanum", "Jasmine"],
      base:  ["Leather", "Suede", "Woody Notes", "Amber"],
    },
  },
  {
    // slug: angels-share-inspired
    // Kilian Paris Angels' Share (2020). Supplier omits apostrophe; title follows slug convention.
    title:               "Angels Share Inspired",
    collection:          "Elite",
    subtitle:            "Inspired by Kilian Paris Angels' Share",
    mood:                "Warm Spicy Gourmand",
    profile:             "Oriental Spicy",
    season:              "Autumn",
    notes:               ["Cognac", "Cinnamon", "Tonka Bean", "Oak", "Hedione", "Vanilla", "Praline", "Sandalwood", "Candied Almond"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Cognac"],
      heart: ["Cinnamon", "Tonka Bean", "Oak", "Hedione"],
      base:  ["Vanilla", "Praline", "Sandalwood", "Candied Almond"],
    },
  },
  {
    // slug: angels-share-paradis-inspired
    // Kilian Paris Angels' Share Paradis (2025). Extrait de Parfum.
    title:               "Angels Share Paradis Inspired",
    collection:          "Elite",
    subtitle:            "Inspired by Kilian Paris Angels' Share Paradis",
    mood:                "Sweet Fruity Woody",
    profile:             "Oriental Fruity",
    season:              "Autumn",
    notes:               ["Raspberry", "Cognac", "Liquor", "Tonka Bean", "Bulgarian Rose", "Caramel", "Oak", "Praline", "Sandalwood", "Oakmoss", "Vanilla"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Raspberry", "Cognac", "Liquor"],
      heart: ["Tonka Bean", "Bulgarian Rose", "Caramel"],
      base:  ["Oak", "Praline", "Sandalwood", "Oakmoss", "Vanilla"],
    },
  },
  {
    // slug: gold-oud-inspired
    // EVIDENCE-LOCK (UNORDERED_GOVERNED_NOTES): Kilian Paris Gold Oud (2014).
    // Fragrantica presents as unordered bouquet — no top/heart/base pyramid.
    // All 4 notes placed in heart[] as transport convention ONLY.
    // No tier assertion. No note invention. No redistribution permitted.
    title:               "Gold Oud Inspired",
    collection:          "Elite",
    subtitle:            "Inspired by Kilian Paris Gold Oud",
    mood:                "Rich Dark Oud",
    profile:             "Oriental Woody",
    season:              "Winter",
    notes:               ["Rose", "Agarwood (Oud)", "Guaiac Wood", "Saffron"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   [],
      heart: ["Rose", "Agarwood (Oud)", "Guaiac Wood", "Saffron"],
      base:  [],
    },
  },
  {
    // slug: peony-blush-suede-inspired
    // EVIDENCE-LOCK (UNORDERED_GOVERNED_NOTES): Jo Malone London Peony & Blush Suede (2013).
    // Jo Malone London does not publish a top/heart/base pyramid — unordered bouquet.
    // All 6 notes placed in heart[] as transport convention ONLY.
    // FOUNDER_CONFIRMED EP-CAT-P4B-R1 — KEEP ELITE. Genderless positioning governs.
    // No tier assertion. No note invention. No redistribution permitted.
    title:               "Peony Blush Suede Inspired",
    collection:          "Elite",
    subtitle:            "Inspired by Jo Malone London Peony & Blush Suede",
    mood:                "Soft Powdery Floral",
    profile:             "Floral Soft",
    season:              "Year-Round",
    notes:               ["Red Apple", "Peony", "Rose", "Jasmine", "Carnation", "Suede"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   [],
      heart: ["Red Apple", "Peony", "Rose", "Jasmine", "Carnation", "Suede"],
      base:  [],
    },
  },
  {
    // slug: velvet-rose-oud-inspired
    // EVIDENCE-LOCK (UNORDERED_GOVERNED_NOTES): Jo Malone London Velvet Rose & Oud (2012).
    // Jo Malone London does not publish a top/heart/base pyramid — unordered bouquet.
    // All 4 notes placed in heart[] as transport convention ONLY.
    // No tier assertion. No note invention. No redistribution permitted.
    title:               "Velvet Rose Oud Inspired",
    collection:          "Elite",
    subtitle:            "Inspired by Jo Malone London Velvet Rose & Oud",
    mood:                "Rich Floral Warm",
    profile:             "Floral Oriental",
    season:              "Autumn",
    notes:               ["Damask Rose", "Agarwood (Oud)", "Praline", "Clove"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   [],
      heart: ["Damask Rose", "Agarwood (Oud)", "Praline", "Clove"],
      base:  [],
    },
  },
  {
    // slug: english-pear-freesia-inspired
    // EVIDENCE-LOCK (UNORDERED_GOVERNED_NOTES): Jo Malone London English Pear & Freesia (no year).
    // Jo Malone London does not publish a top/heart/base pyramid — unordered bouquet.
    // All 8 notes placed in heart[] as transport convention ONLY.
    // FOUNDER_CONFIRMED EP-CAT-P4B-R1 — KEEP ELITE. Genderless positioning governs.
    // No tier assertion. No note invention. No redistribution permitted.
    title:               "English Pear Freesia Inspired",
    collection:          "Elite",
    subtitle:            "Inspired by Jo Malone London English Pear & Freesia",
    mood:                "Fresh Fruity Floral",
    profile:             "Floral Fruity",
    season:              "Spring",
    notes:               ["Pear", "Melon", "Freesia", "Rose", "Musk", "Amber", "Patchouli", "Rhubarb"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   [],
      heart: ["Pear", "Melon", "Freesia", "Rose", "Musk", "Amber", "Patchouli", "Rhubarb"],
      base:  [],
    },
  },
  {
    // slug: oud-bergamot-inspired
    // EVIDENCE-LOCK (UNORDERED_GOVERNED_NOTES): Jo Malone London Oud & Bergamot (2010).
    // Jo Malone London does not publish a top/heart/base pyramid — unordered bouquet.
    // All 5 notes placed in heart[] as transport convention ONLY.
    // No tier assertion. No note invention. No redistribution permitted.
    title:               "Oud Bergamot Inspired",
    collection:          "Elite",
    subtitle:            "Inspired by Jo Malone London Oud & Bergamot",
    mood:                "Smoky Citrus Oud",
    profile:             "Oriental Woody",
    season:              "Year-Round",
    notes:               ["Agarwood (Oud)", "Bergamot", "Virginia Cedar", "Orange", "Amalfi Lemon"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   [],
      heart: ["Agarwood (Oud)", "Bergamot", "Virginia Cedar", "Orange", "Amalfi Lemon"],
      base:  [],
    },
  },
  {
    // slug: black-orchid-inspired
    // Tom Ford Black Orchid EDP (2006). Sparse heart: 1 note only (Black Orchid).
    title:               "Black Orchid Inspired",
    collection:          "Elite",
    subtitle:            "Inspired by Tom Ford Black Orchid",
    mood:                "Dark Floral Mysterious",
    profile:             "Floral Oriental",
    season:              "Autumn",
    notes:               ["French Jasmine", "Black Truffle", "Ylang-Ylang", "Black Currant", "Bergamot", "Black Orchid", "Patchouli", "Sandalwood", "Dark Chocolate", "Incense", "Amber", "Vetiver", "Vanilla", "Balsam"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["French Jasmine", "Black Truffle", "Ylang-Ylang", "Black Currant", "Bergamot"],
      heart: ["Black Orchid"],
      base:  ["Patchouli", "Sandalwood", "Dark Chocolate", "Incense", "Amber", "Vetiver", "Vanilla", "Balsam"],
    },
  },
  {
    // slug: soleil-blanc-inspired
    // Tom Ford Soleil Blanc (2016). Unisex.
    title:               "Soleil Blanc Inspired",
    collection:          "Elite",
    subtitle:            "Inspired by Tom Ford Soleil Blanc",
    mood:                "Warm Floral Creamy",
    profile:             "Floral Oriental",
    season:              "Summer",
    notes:               ["Pistachio", "Bergamot", "Cardamom", "Pink Pepper", "Tuberose", "Ylang-Ylang", "Jasmine", "Coconut", "Amber", "Tonka Bean", "Benzoin"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Pistachio", "Bergamot", "Cardamom", "Pink Pepper"],
      heart: ["Tuberose", "Ylang-Ylang", "Jasmine"],
      base:  ["Coconut", "Amber", "Tonka Bean", "Benzoin"],
    },
  },
  {
    // slug: khamrah-inspired
    // Lattafa Khamrah (2022). Unisex.
    title:               "Khamrah Inspired",
    collection:          "Elite",
    subtitle:            "Inspired by Lattafa Khamrah",
    mood:                "Sweet Spicy Oud",
    profile:             "Oriental Gourmand",
    season:              "Autumn",
    notes:               ["Bergamot", "Cinnamon", "Clary Sage", "Praline", "Fruity Notes", "Tuberose", "Vanilla", "Spicy Precious Woods", "Agarwood (Oud)", "Myrrh", "Tonka Bean", "Benzoin", "Amber"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Bergamot", "Cinnamon", "Clary Sage"],
      heart: ["Praline", "Fruity Notes", "Tuberose"],
      base:  ["Vanilla", "Spicy Precious Woods", "Agarwood (Oud)", "Myrrh", "Tonka Bean", "Benzoin", "Amber"],
    },
  },
];

// ── ROSE (16) ─────────────────────────────────────────────────────────────────

const rose: DisplayFragrance[] = [
  {
    // slug: idole-inspired
    // Lancôme Idôle (2019). Chypre Floral.
    title:               "Idole Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Lancôme Idôle",
    mood:                "Clean Floral Fresh",
    profile:             "Floral",
    season:              "Spring",
    notes:               ["Pear", "Bergamot", "Pink Pepper", "Rose", "Jasmine", "White Musk", "Vanilla", "Patchouli", "Cedar"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Pear", "Bergamot", "Pink Pepper"],
      heart: ["Rose", "Jasmine"],
      base:  ["White Musk", "Vanilla", "Patchouli", "Cedar"],
    },
  },
  {
    // slug: fame-inspired
    // Rabanne Fame (2022). Floral Woody Musk.
    title:               "Fame Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Rabanne Fame",
    mood:                "Warm Floral",
    profile:             "Floral Woody Musk",
    season:              "Summer",
    notes:               ["Mango", "Bergamot", "Jasmine", "Olibanum", "Vanilla", "Sandalwood"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Mango", "Bergamot"],
      heart: ["Jasmine", "Olibanum"],
      base:  ["Vanilla", "Sandalwood"],
    },
  },
  {
    // slug: lady-million-inspired
    // Rabanne Lady Million (2010). Chypre Floral.
    title:               "Lady Million Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Rabanne Lady Million",
    mood:                "Powdery Floral Warm",
    profile:             "Floral Oriental",
    season:              "Autumn",
    notes:               ["Neroli", "Orange", "Raspberry", "Jasmine", "African Orange Blossom", "Gardenia", "Patchouli", "White Honey", "Amber"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Neroli", "Orange", "Raspberry"],
      heart: ["Jasmine", "African Orange Blossom", "Gardenia"],
      base:  ["Patchouli", "White Honey", "Amber"],
    },
  },
  {
    // slug: olympea-inspired
    // Rabanne Olympéa (2015). Floral Musk. Sparse: 1 heart note only (Salted Vanilla).
    title:               "Olympea Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Rabanne Olympéa",
    mood:                "Aquatic Sensual",
    profile:             "Floral Musk",
    season:              "Year-Round",
    notes:               ["Green Mandarin", "Ginger Lily", "Water Jasmine", "Salted Vanilla", "Ambergris", "Cashmere Wood", "Sandalwood"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Green Mandarin", "Ginger Lily", "Water Jasmine"],
      heart: ["Salted Vanilla"],
      base:  ["Ambergris", "Cashmere Wood", "Sandalwood"],
    },
  },
  {
    // slug: scandal-inspired
    // Jean Paul Gaultier Scandal (2017). Women's version; distinct from men's flanker.
    title:               "Scandal Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Jean Paul Gaultier Scandal",
    mood:                "Floral Gourmand Sweet",
    profile:             "Floral Fruity Gourmand",
    season:              "Autumn",
    notes:               ["Blood Orange", "Mandarin Orange", "Honey", "Gardenia", "Orange Blossom", "Jasmine", "Peach", "Beeswax", "Caramel", "Patchouli", "Licorice"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Blood Orange", "Mandarin Orange"],
      heart: ["Honey", "Gardenia", "Orange Blossom", "Jasmine", "Peach"],
      base:  ["Beeswax", "Caramel", "Patchouli", "Licorice"],
    },
  },
  {
    // slug: la-belle-inspired
    // Jean Paul Gaultier La Belle (2019).
    title:               "La Belle Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Jean Paul Gaultier La Belle",
    mood:                "Sweet Floral Sensual",
    profile:             "Floral Oriental",
    season:              "Autumn",
    notes:               ["Pear", "Bergamot", "Floral Notes", "Leather", "Vanilla", "Vetiver", "Amber", "Musk"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Pear", "Bergamot"],
      heart: ["Floral Notes", "Leather"],
      base:  ["Vanilla", "Vetiver", "Amber", "Musk"],
    },
  },
  {
    // slug: la-nuit-tresor-inspired
    // Lancôme La Nuit Trésor (2015). Supplier omits accent; canonical name includes accent.
    title:               "La Nuit Tresor Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Lancôme La Nuit Trésor",
    mood:                "Sweet Dark Romantic",
    profile:             "Oriental Fruity",
    season:              "Autumn",
    notes:               ["Pear", "Tangerine", "Bergamot", "Strawberry", "Black Rose", "Vanilla Orchid", "Passionfruit", "Praline", "Caramel", "Vanilla", "Litchi", "Patchouli", "Incense", "Coffee", "Licorice", "Coumarin", "Papyrus"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Pear", "Tangerine", "Bergamot"],
      heart: ["Strawberry", "Black Rose", "Vanilla Orchid", "Passionfruit"],
      base:  ["Praline", "Caramel", "Vanilla", "Litchi", "Patchouli", "Incense", "Coffee", "Licorice", "Coumarin", "Papyrus"],
    },
  },
  {
    // slug: narciso-rodriguez-for-her-inspired
    // Narciso Rodriguez For Her EDP (2006).
    title:               "Narciso Rodriguez for Her Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Narciso Rodriguez For Her",
    mood:                "Soft Floral Musk",
    profile:             "Floral Musk",
    season:              "Year-Round",
    notes:               ["Rose", "Peach", "Musk", "Amber", "Patchouli", "Sandalwood"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Rose", "Peach"],
      heart: ["Musk", "Amber"],
      base:  ["Patchouli", "Sandalwood"],
    },
  },
  {
    // slug: narciso-rouge-inspired
    // Narciso Rodriguez Narciso Rouge EDP (2018). FOUNDER_CONFIRMED EP-CAT-P4B-R1.
    // The 2019 EDT is NOT the selected identity.
    title:               "Narciso Rouge Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Narciso Rodriguez Narciso Rouge EDP",
    mood:                "Powdery Floral",
    profile:             "Floral Musk",
    season:              "Year-Round",
    notes:               ["Iris", "Bulgarian Rose", "Musk", "Tuberose", "Orange Blossom", "Tonka Bean", "Vanilla", "White Cedar Extract", "Cedar", "Sandalwood", "Vetiver"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Iris", "Bulgarian Rose"],
      heart: ["Musk", "Tuberose", "Orange Blossom"],
      base:  ["Tonka Bean", "Vanilla", "White Cedar Extract", "Cedar", "Sandalwood", "Vetiver"],
    },
  },
  {
    // slug: dylan-purple-inspired
    // Versace Dylan Purple (2022). Year correction: P4A estimated 2021.
    title:               "Dylan Purple Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Versace Dylan Purple",
    mood:                "Bright Floral Fresh",
    profile:             "Floral Fruity",
    season:              "Summer",
    notes:               ["Italian Bergamot", "Italian Bitter Orange", "Pear Juice", "Purple Freesia", "Mahonia", "Pomarosa", "Ambroxan", "ISO E Super", "Virginia Cedar", "Belambre", "Sylkolide"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Italian Bergamot", "Italian Bitter Orange", "Pear Juice"],
      heart: ["Purple Freesia", "Mahonia", "Pomarosa"],
      base:  ["Ambroxan", "ISO E Super", "Virginia Cedar", "Belambre", "Sylkolide"],
    },
  },
  {
    // slug: yellow-diamond-inspired
    // Versace Yellow Diamond (EDT, 2011). Supplier uses plural 'Yellow Diamonds' — canonical is singular.
    title:               "Yellow Diamond Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Versace Yellow Diamond",
    mood:                "Fresh Citrus Floral",
    profile:             "Floral Aquatic",
    season:              "Spring",
    notes:               ["Amalfi Lemon", "Pear", "Bergamot", "Neroli", "Mimosa", "Freesia", "Water Lily", "African Orange Flower", "Musk", "Guaiac Wood", "Amber"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Amalfi Lemon", "Pear", "Bergamot", "Neroli"],
      heart: ["Mimosa", "Freesia", "Water Lily", "African Orange Flower"],
      base:  ["Musk", "Guaiac Wood", "Amber"],
    },
  },
  {
    // slug: eden-sparkling-lychee-inspired
    // Kayali Eden Sparkling Lychee | 39 (2023). Name correction: canonical includes 'Eden' and '| 39'.
    // Year correction: P4A estimated 2021. Title omits pipe-number to produce clean slug.
    title:               "Eden Sparkling Lychee Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Kayali Eden Sparkling Lychee | 39",
    mood:                "Playful Fruity Sweet",
    profile:             "Floral Fruity",
    season:              "Summer",
    notes:               ["Litchi", "Black Currant", "Red Apple", "Italian Lemon", "Violet", "Rose", "Jasmine Sambac", "Sugar", "Vanilla Absolute", "Musk", "Amber", "Sandalwood", "Cedar"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Litchi", "Black Currant", "Red Apple", "Italian Lemon"],
      heart: ["Violet", "Rose", "Jasmine Sambac"],
      base:  ["Sugar", "Vanilla Absolute", "Musk", "Amber", "Sandalwood", "Cedar"],
    },
  },
  {
    // slug: very-good-girl-elixir-inspired
    // Carolina Herrera Very Good Girl Elixir (2024). Name correction: no '212' prefix.
    // Year correction: P4A estimated 2022.
    title:               "Very Good Girl Elixir Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Carolina Herrera Very Good Girl Elixir",
    mood:                "Dark Sweet Floral",
    profile:             "Floral Oriental",
    season:              "Autumn",
    notes:               ["Black Cherry", "Bitter Almond", "Rose", "Tuberose", "Vanilla", "Cocoa"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Black Cherry", "Bitter Almond"],
      heart: ["Rose", "Tuberose"],
      base:  ["Vanilla", "Cocoa"],
    },
  },
  {
    // slug: gucci-guilty-pour-femme-inspired
    // Gucci Guilty Pour Femme (2010). Confirmed distinct from MEN-74 Gucci Guilty Pour Homme.
    title:               "Gucci Guilty Pour Femme Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Gucci Guilty Pour Femme",
    mood:                "Playful Floral Warm",
    profile:             "Floral Fruity",
    season:              "Year-Round",
    notes:               ["Pink Pepper", "Mandarin Orange", "Bergamot", "Lilac", "Peach", "Geranium", "Jasmine", "Black Currant", "Patchouli", "Amber", "White Musk", "Vanilla"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Pink Pepper", "Mandarin Orange", "Bergamot"],
      heart: ["Lilac", "Peach", "Geranium", "Jasmine", "Black Currant"],
      base:  ["Patchouli", "Amber", "White Musk", "Vanilla"],
    },
  },
  {
    // slug: gucci-bamboo-inspired
    // Gucci Bamboo (2015). Sparse: 1 top note only (Bergamot).
    title:               "Gucci Bamboo Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Gucci Bamboo",
    mood:                "Floral Creamy Warm",
    profile:             "Floral Oriental",
    season:              "Year-Round",
    notes:               ["Bergamot", "Casablanca Lily", "Ylang-Ylang", "Orange Blossom", "Sandalwood", "Tahitian Vanilla", "Amber"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Bergamot"],
      heart: ["Casablanca Lily", "Ylang-Ylang", "Orange Blossom"],
      base:  ["Sandalwood", "Tahitian Vanilla", "Amber"],
    },
  },
  {
    // slug: eladaria-inspired
    // Creed Eladaria (2025). Year correction: P4A estimated 2024.
    title:               "Eladaria Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Creed Eladaria",
    mood:                "Powdery Floral",
    profile:             "Floral",
    season:              "Spring",
    notes:               ["Pink Pepper", "Mandarin Orange", "Bergamot", "Rose", "Powdery Notes", "Peony", "Lily of the Valley", "Musk", "Ambroxan", "Cashmere Wood", "Vanilla"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Pink Pepper", "Mandarin Orange", "Bergamot"],
      heart: ["Rose", "Powdery Notes", "Peony", "Lily of the Valley"],
      base:  ["Musk", "Ambroxan", "Cashmere Wood", "Vanilla"],
    },
  },
];

// ── SKYE (13) ─────────────────────────────────────────────────────────────────

const skye: DisplayFragrance[] = [
  {
    // slug: montblanc-legend-inspired
    // Montblanc Legend EDT (2011). Supplier uses 'Mont Blanc' (two words) — canonical: 'Montblanc'.
    title:               "Montblanc Legend Inspired",
    collection:          "Skye",
    subtitle:            "Inspired by Montblanc Legend",
    mood:                "Fresh Aromatic Green",
    profile:             "Fougère Aromatic",
    season:              "Year-Round",
    notes:               ["Bergamot", "Lavender", "Pineapple Leaf", "Exotic Verbena", "Oakmoss Note", "Geranium", "Coumarin", "Apple", "Rose", "Pomarosa Molecule", "Sandalwood", "Tonka Bean", "Evernyl"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Bergamot", "Lavender", "Pineapple Leaf", "Exotic Verbena"],
      heart: ["Oakmoss Note", "Geranium", "Coumarin", "Apple", "Rose", "Pomarosa Molecule"],
      base:  ["Sandalwood", "Tonka Bean", "Evernyl"],
    },
  },
  {
    // slug: montblanc-explorer-inspired
    // Montblanc Explorer EDP (2019). Supplier uses 'Mont Blanc' (two words).
    // Note strings include branded molecule names with registered/trademark symbols.
    title:               "Montblanc Explorer Inspired",
    collection:          "Skye",
    subtitle:            "Inspired by Montblanc Explorer",
    mood:                "Earthy Woody Spicy",
    profile:             "Woody Aromatic",
    season:              "Autumn",
    notes:               ["OrPur® Bergamot", "French Sage", "Pink Pepper", "OrPur® Vetiver", "Skin", "Patchouli", "Cocoa", "Ambrofix™", "Akigalawood®"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["OrPur® Bergamot", "French Sage", "Pink Pepper"],
      heart: ["OrPur® Vetiver", "Skin"],
      base:  ["Patchouli", "Cocoa", "Ambrofix™", "Akigalawood®"],
    },
  },
  {
    // slug: leau-dissey-pour-homme-inspired
    // Issey Miyake L'Eau d'Issey Pour Homme (1994). FOUNDER_CONFIRMED EP-CAT-P4B-R1.
    // Title omits apostrophes/accents to produce Founder-authorized slug.
    // Supplier raw label 'Issey Miyake' (brand only) preserved as provenance in supplier file.
    title:               "Leau Dissey Pour Homme Inspired",
    collection:          "Skye",
    subtitle:            "Inspired by Issey Miyake L'Eau d'Issey Pour Homme",
    mood:                "Fresh Aquatic Clean",
    profile:             "Aquatic Floral",
    season:              "Summer",
    notes:               ["Yuzu", "Lemon", "Bergamot", "Lemon Verbena", "Mandarin Orange", "Cypress", "Calone", "Coriander", "Sage", "Tarragon", "Blue Lotus", "Lily of the Valley", "Nutmeg", "Bourbon Geranium", "Saffron", "Ceylon Cinnamon", "Mignonette", "Tahitian Vetiver", "Musk", "Cedar", "Sandalwood", "Amber", "Tobacco"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Yuzu", "Lemon", "Bergamot", "Lemon Verbena", "Mandarin Orange", "Cypress", "Calone", "Coriander", "Sage", "Tarragon"],
      heart: ["Blue Lotus", "Lily of the Valley", "Nutmeg", "Bourbon Geranium", "Saffron", "Ceylon Cinnamon", "Mignonette"],
      base:  ["Tahitian Vetiver", "Musk", "Cedar", "Sandalwood", "Amber", "Tobacco"],
    },
  },
  {
    // slug: tom-ford-noir-inspired
    // Tom Ford Noir EDP (2012).
    title:               "Tom Ford Noir Inspired",
    collection:          "Skye",
    subtitle:            "Inspired by Tom Ford Noir",
    mood:                "Dark Spicy Oriental",
    profile:             "Oriental Floral",
    season:              "Winter",
    notes:               ["Violet", "Pink Pepper", "Caraway", "Bergamot", "Verbena", "Tuscan Iris", "Bulgarian Rose", "Black Pepper", "Nutmeg", "Geranium", "Clary Sage", "Indonesian Patchouli Leaf", "Amber", "Vanilla", "Civet", "Leather", "Opoponax", "Benzoin", "Vetiver", "Styrax"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Violet", "Pink Pepper", "Caraway", "Bergamot", "Verbena"],
      heart: ["Tuscan Iris", "Bulgarian Rose", "Black Pepper", "Nutmeg", "Geranium", "Clary Sage"],
      base:  ["Indonesian Patchouli Leaf", "Amber", "Vanilla", "Civet", "Leather", "Opoponax", "Benzoin", "Vetiver", "Styrax"],
    },
  },
  {
    // slug: gucci-guilty-pour-homme-inspired
    // Gucci Guilty Pour Homme (2011). Confirmed distinct from LADIES-129 Gucci Guilty Pour Femme.
    // Sparse: 1 heart note only (African Orange Flower).
    title:               "Gucci Guilty Pour Homme Inspired",
    collection:          "Skye",
    subtitle:            "Inspired by Gucci Guilty Pour Homme",
    mood:                "Fresh Citrus Woody",
    profile:             "Fougère Aromatic",
    season:              "Year-Round",
    notes:               ["Lavender", "Amalfi Lemon", "African Orange Flower", "Virginia Cedar", "Patchouli", "Vanilla"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Lavender", "Amalfi Lemon"],
      heart: ["African Orange Flower"],
      base:  ["Virginia Cedar", "Patchouli", "Vanilla"],
    },
  },
  {
    // slug: polo-black-inspired
    // Ralph Lauren Polo Black (2005).
    title:               "Polo Black Inspired",
    collection:          "Skye",
    subtitle:            "Inspired by Ralph Lauren Polo Black",
    mood:                "Dark Woody Sweet",
    profile:             "Woody Fruity",
    season:              "Autumn",
    notes:               ["Mango", "Tangerine", "Lemon", "Sage", "Wormwood", "Patchouli", "Sandalwood", "Tonka Bean"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Mango", "Tangerine", "Lemon"],
      heart: ["Sage", "Wormwood", "Patchouli"],
      base:  ["Sandalwood", "Tonka Bean"],
    },
  },
  {
    // slug: phantom-inspired
    // Rabanne Phantom (2021). Supplier uses 'Paco Rabanne Phantom NEW'; brand rebranded to 'Rabanne'.
    title:               "Phantom Inspired",
    collection:          "Skye",
    subtitle:            "Inspired by Rabanne Phantom",
    mood:                "Fresh Aromatic Woody",
    profile:             "Fougère Woody",
    season:              "Year-Round",
    notes:               ["Lemon Peel Oil", "Styrallyl Acetate", "Lavender Oil", "Lavandin", "Patchouli", "Smoky Earthy Accord", "Apple", "Vetiver", "Lavandin Absolute", "Vanilla Absolute"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Lemon Peel Oil", "Styrallyl Acetate", "Lavender Oil"],
      heart: ["Lavandin", "Patchouli", "Smoky Earthy Accord", "Apple"],
      base:  ["Vetiver", "Lavandin Absolute", "Vanilla Absolute"],
    },
  },
  {
    // slug: boss-bottled-elixir-inspired
    // Hugo Boss BOSS Bottled Elixir (2023). Year correction: P4A estimated 2022.
    title:               "Boss Bottled Elixir Inspired",
    collection:          "Skye",
    subtitle:            "Inspired by Hugo Boss BOSS Bottled Elixir",
    mood:                "Warm Spicy Resinous",
    profile:             "Oriental Woody",
    season:              "Autumn",
    notes:               ["Frankincense", "Cardamom", "Patchouli", "Vetiver", "Labdanum", "Cedar"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Frankincense", "Cardamom"],
      heart: ["Patchouli", "Vetiver"],
      base:  ["Labdanum", "Cedar"],
    },
  },
  {
    // slug: eros-energy-inspired
    // Versace Eros Energy (2024). Year correction: P4A estimated 2023.
    title:               "Eros Energy Inspired",
    collection:          "Skye",
    subtitle:            "Inspired by Versace Eros Energy",
    mood:                "Fresh Energetic Citrus",
    profile:             "Citrus Aromatic",
    season:              "Summer",
    notes:               ["Bergamot", "Blood Orange", "Lime", "Mandarin Orange", "Grapefruit", "Lemon", "White Amber", "Black Currant", "Pink Pepper", "Patchouli", "Musk", "Oakmoss"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Bergamot", "Blood Orange", "Lime", "Mandarin Orange", "Grapefruit", "Lemon"],
      heart: ["White Amber", "Black Currant", "Pink Pepper"],
      base:  ["Patchouli", "Musk", "Oakmoss"],
    },
  },
  {
    // slug: fahrenheit-inspired
    // Christian Dior Fahrenheit (1988).
    title:               "Fahrenheit Inspired",
    collection:          "Skye",
    subtitle:            "Inspired by Christian Dior Fahrenheit",
    mood:                "Warm Leather Woody",
    profile:             "Woody Aromatic",
    season:              "Autumn",
    notes:               ["Nutmeg Flower", "Lavender", "Cedar", "Mandarin Orange", "Chamomile", "Bergamot", "Hawthorn", "Lemon", "Violet Leaf", "Nutmeg", "Cedar", "Sandalwood", "Carnation", "Honeysuckle", "Jasmine", "Lily of the Valley", "Leather", "Vetiver", "Musk", "Amber", "Patchouli", "Tonka Bean"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Nutmeg Flower", "Lavender", "Cedar", "Mandarin Orange", "Chamomile", "Bergamot", "Hawthorn", "Lemon"],
      heart: ["Violet Leaf", "Nutmeg", "Cedar", "Sandalwood", "Carnation", "Honeysuckle", "Jasmine", "Lily of the Valley"],
      base:  ["Leather", "Vetiver", "Musk", "Amber", "Patchouli", "Tonka Bean"],
    },
  },
  {
    // slug: amen-fantasm-inspired
    // Mugler A*Men Fantasm (2024). Sparse: 1 base note only (Patchouli).
    // Name correction: canonical is 'A*Men Fantasm' (asterisk). Brand rebranded from Thierry Mugler.
    // Year correction: P4A estimated 2022.
    title:               "Amen Fantasm Inspired",
    collection:          "Skye",
    subtitle:            "Inspired by Mugler A*Men Fantasm",
    mood:                "Dark Sweet Spicy",
    profile:             "Oriental Spicy",
    season:              "Autumn",
    notes:               ["Pink Pepper", "Citrus", "Bergamot", "Dark Chocolate", "Clary Sage", "Patchouli"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Pink Pepper", "Citrus", "Bergamot"],
      heart: ["Dark Chocolate", "Clary Sage"],
      base:  ["Patchouli"],
    },
  },
  {
    // slug: le-male-inspired
    // Jean Paul Gaultier Le Male (1995). FOUNDER_CONFIRMED EP-CAT-P4B-R1.
    // Supplier raw label 'Jean Paul Gaultier' (brand only) preserved as provenance in supplier file.
    title:               "Le Male Inspired",
    collection:          "Skye",
    subtitle:            "Inspired by Jean Paul Gaultier Le Male",
    mood:                "Warm Sweet Aromatic",
    profile:             "Oriental Fougère",
    season:              "Year-Round",
    notes:               ["Mint", "Lavender", "Bergamot", "Cinnamon", "Cumin", "Orange Blossom", "Vanilla", "Tonka Bean", "Sandalwood", "Cedarwood"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Mint", "Lavender", "Bergamot"],
      heart: ["Cinnamon", "Cumin", "Orange Blossom"],
      base:  ["Vanilla", "Tonka Bean", "Sandalwood", "Cedarwood"],
    },
  },
  {
    // slug: lacoste-noir-inspired
    // Eau de Lacoste L.12.12. Noir (2013). Sparse: 1 top note only (Watermelon).
    // Supplier shorthand 'Lacoste Noir' — canonical is longer official name.
    title:               "Lacoste Noir Inspired",
    collection:          "Skye",
    subtitle:            "Inspired by Eau de Lacoste L.12.12. Noir",
    mood:                "Fresh Dark Woody",
    profile:             "Woody Aromatic",
    season:              "Year-Round",
    notes:               ["Watermelon", "Basil", "Lavender", "Verbena", "Dark Chocolate", "Cashmeran", "Patchouli", "Coumarin"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Watermelon"],
      heart: ["Basil", "Lavender", "Verbena"],
      base:  ["Dark Chocolate", "Cashmeran", "Patchouli", "Coumarin"],
    },
  },
];

// ── Exports ───────────────────────────────────────────────────────────────────

export const wave2Catalogue: DisplayFragrance[] = [...elite, ...rose, ...skye];
