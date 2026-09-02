/**
 * Knowledge Factory — Wave 5 Staging Catalogue
 *
 * CATALOGUE-W5-P2: 20 Founder-approved Wave 5 identities registered for
 * controlled factory intake. Factory-only. NOT customer-facing.
 *
 * This file MUST NOT be imported by any module under app/.
 * Managed exclusively by: scripts/factory/intake.ts (senary catalogue fallback).
 *
 * Collections:  ELITE (6) · SKYE (7) · ROSE (7) = 20 total
 *
 * EVIDENCE LOCK
 *
 * All 20 records are at CATALOGUE-W5-P1 governed evidence-lock state.
 * Notes, notesStructured, and notesEvidenceLocked are populated from
 * externally researched evidence in data/identity/source/wave-5-2026-research.json.
 * All evidence sourced in CATALOGUE-W5-P1 (2026-08-31).
 * No LLM general knowledge. No invented notes. No inferred tiers.
 *
 * UNORDERED_GOVERNED_NOTES (2 entries — Jo Malone London):
 *   earl-grey-cucumber-inspired: notes=[all], notesStructured={ top:[], heart:[...all], base:[] }
 *   myrrh-tonka-inspired:        notes=[all], notesStructured={ top:[], heart:[...all], base:[] }
 *   Jo Malone London presents flat bouquet (no top/heart/base pyramid).
 *   Per Wave 2/3/4 precedent. No tier redistribution permitted.
 *
 * FOUNDER DECISIONS (all resolved in CATALOGUE-W5-P1):
 *   FD-1: The One for Men — EDT (2008) selected (informational, non-blocking).
 *   FD-2: Chrome — brand confirmed as Azzaro (informational; brief annotation required).
 *   FD-3: Uomo by Zegna — 2013 EDT confirmed as sole canonical product at this name.
 *   FD-4: Chanel Allure — EDP (1999) selected (informational, non-blocking).
 *   FD-5: D&G Devotion — EXCLUDED (DUPLICATE_EXISTING_MKC). NOT present in this batch.
 *
 * NAME CORRECTIONS (titles craft correct slugs; subtitles carry canonical forms):
 *   "Dolce & Gabanna The One" → "The One Pour Homme Inspired" / subtitle corrects to D&G.
 *   "Huggo Boss The Scent" → "Boss The Scent Inspired" / subtitle corrects to Hugo Boss.
 *   "Ange ou Demon" → subtitle corrects to "Ange ou Démon" (with accent).
 *   "212 CH Bad Boy" → subtitle confirms Carolina Herrera Bad Boy (NOT 212-series).
 *   "Dolce / Dolce & Gabbana" → "Dolce Inspired" / subtitle confirms canonical product.
 *   "Earl Grey & Cucumber" / "Myrrh & Tonka" → titles strip & for correct slug derivation.
 *
 * Supplier source: data/supplier/normalized/fragrance-list-2026-08-normalized.json
 * Evidence source: data/identity/source/wave-5-2026-research.json
 * Supplier file:   data/identity/source/wave-5-2026-supplier.json
 * All 20 identities confirmed as NEW_SUPPLIER_CANDIDATE with no existingMKCSlug.
 * All 20 slugs confirmed clear across native MKC and Waves 1–4 source files.
 *
 * Post-Wave-5 projected counts: Elite 44, Skye 101, Rose 97 = 242 total.
 *
 * Pricing: prices is a required (non-optional) field on DisplayFragrance.
 * Canonical retail pricing: 5ml=60, 10ml=100, 30ml=250 (ZAR).
 *
 * Images: empty string placeholders. No product photography for pre-promoted
 * identities. Populated at MKC promotion time.
 *
 * Slug derivation: titles are crafted so that
 *   title.toLowerCase().replace(/\s+/g, "-")
 * produces the governed slug. Special characters (apostrophes, ampersands)
 * are handled by stripping them from the title where needed:
 *   "Earl Grey & Cucumber Inspired" would produce "earl-grey-&-cucumber-inspired"
 *   → instead use "Earl Grey Cucumber Inspired" → "earl-grey-cucumber-inspired".
 *   "Ralph's Club Inspired" → "ralph's-club-inspired" (apostrophe preserved per precedent).
 */

import type { DisplayFragrance } from "../../../app/lib/knowledgeAdapter";

// Canonical retail pricing. Required field — cannot be omitted on DisplayFragrance.
const PRICES = { "5ml": 60, "10ml": 100, "30ml": 250 } as const;

// Factory-staging image placeholders. No product photography for pre-promoted identities.
const IMAGES = { "5ml": "", "10ml": "", "30ml": "" } as const;

// ── ELITE (6) ────────────────────────────────────────────────────────────────

const elite: DisplayFragrance[] = [
  {
    // slug: earl-grey-cucumber-inspired
    // Supplier: [UNISEX] 'Earl Grey & Cucumber by Jo Malone' — NEW_SUPPLIER_CANDIDATE
    // UNORDERED_GOVERNED_NOTES — Jo Malone London presents flat bouquet.
    // All notes in heartNotes[]; top=[], base=[] per Wave 2/3/4 governance precedent.
    // Title strips & for correct slug derivation ("Earl Grey Cucumber" → correct slug).
    // Evidence: jomalone.com (AUTHORITATIVE), Fragrantica (HIGH).
    // Source: wave-5-2026-research.json UNISEX-26.
    title:               "Earl Grey Cucumber Inspired",
    collection:          "Elite",
    subtitle:            "Inspired by Jo Malone London Earl Grey & Cucumber",
    mood:                "Fresh Tea Citrus",
    profile:             "Tea Aromatic",
    season:              "Spring",
    notes:               ["Earl Grey Tea", "Bergamot", "Cucumber", "Beeswax", "Musk", "Vanilla"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   [],
      heart: ["Earl Grey Tea", "Bergamot", "Cucumber", "Beeswax", "Musk", "Vanilla"],
      base:  [],
    },
  },
  {
    // slug: myrrh-tonka-inspired
    // Supplier: [UNISEX] 'Jo Malone / Myrrh & Tonka' — NEW_SUPPLIER_CANDIDATE
    // UNORDERED_GOVERNED_NOTES — Jo Malone London presents flat bouquet.
    // All notes in heartNotes[]; top=[], base=[] per Wave 2/3/4 governance precedent.
    // Title strips & for correct slug derivation ("Myrrh Tonka" → correct slug).
    // Evidence: jomalone.com (AUTHORITATIVE), Fragrantica (HIGH).
    // Source: wave-5-2026-research.json UNISEX-62.
    title:               "Myrrh Tonka Inspired",
    collection:          "Elite",
    subtitle:            "Inspired by Jo Malone London Myrrh & Tonka",
    mood:                "Warm Amber Balsamic",
    profile:             "Oriental Amber",
    season:              "Autumn",
    notes:               ["Myrrh", "Tonka Bean", "Lavender", "Almond", "Vanilla", "Benzoin", "Amber"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   [],
      heart: ["Myrrh", "Tonka Bean", "Lavender", "Almond", "Vanilla", "Benzoin", "Amber"],
      base:  [],
    },
  },
  {
    // slug: ck-everyone-inspired
    // Supplier: [UNISEX] 'CK Everyone' — NEW_SUPPLIER_CANDIDATE
    // Canonical identity: Calvin Klein CK Everyone EDT (2020).
    // Evidence: Fragrantica (HIGH), calvinklein.us (AUTHORITATIVE).
    // Source: wave-5-2026-research.json UNISEX-18.
    title:               "CK Everyone Inspired",
    collection:          "Elite",
    subtitle:            "Inspired by Calvin Klein CK Everyone",
    mood:                "Clean Fresh Unisex",
    profile:             "Fresh Woody",
    season:              "Spring",
    notes:               ["Orange", "Bergamot", "Cedar Leaf", "Iris", "Cotton", "White Musk", "Sandalwood", "Ambrette Seeds", "Musk"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Orange", "Bergamot", "Cedar Leaf"],
      heart: ["Iris", "Cotton", "White Musk"],
      base:  ["Sandalwood", "Ambrette Seeds", "Musk"],
    },
  },
  {
    // slug: greenley-inspired
    // Supplier: [UNISEX] 'Greenley by Parfums de Marly' — NEW_SUPPLIER_CANDIDATE
    // Canonical identity: Parfums de Marly Greenley EDP (2020).
    // Year correction: P0 indicated 2019; Fragrantica confirms 2020.
    // Evidence: Fragrantica (HIGH). Source: wave-5-2026-research.json UNISEX-28.
    title:               "Greenley Inspired",
    collection:          "Elite",
    subtitle:            "Inspired by Parfums de Marly Greenley",
    mood:                "Fresh Floral Green",
    profile:             "Floral Fresh",
    season:              "Spring",
    notes:               ["Bergamot", "Lemon", "Petitgrain", "Rose", "Iris", "Violet", "Sandalwood", "Vetiver", "White Musk"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Bergamot", "Lemon", "Petitgrain"],
      heart: ["Rose", "Iris", "Violet"],
      base:  ["Sandalwood", "Vetiver", "White Musk"],
    },
  },
  {
    // slug: smoking-hot-inspired
    // Supplier: [UNISEX] 'Smoking Hot by Kilian' — NEW_SUPPLIER_CANDIDATE
    // Canonical identity: By Kilian Smoking Hot EDP (2023).
    // Year correction: P0 approximated 2021; Fragrantica confirms 2023.
    // Evidence: Fragrantica (HIGH). Source: wave-5-2026-research.json UNISEX-44.
    title:               "Smoking Hot Inspired",
    collection:          "Elite",
    subtitle:            "Inspired by By Kilian Smoking Hot",
    mood:                "Smoky Tobacco Apple",
    profile:             "Woody Tobacco",
    season:              "Autumn",
    notes:               ["Apple", "Red Apple", "Tobacco", "Birch", "Leather", "Vetiver", "Guaiac Wood", "Styrax"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Apple", "Red Apple"],
      heart: ["Tobacco", "Birch"],
      base:  ["Leather", "Vetiver", "Guaiac Wood", "Styrax"],
    },
  },
  {
    // slug: les-sables-roses-inspired
    // Supplier: [UNISEX] 'Les Sables Roses by Louis Vuitton' — NEW_SUPPLIER_CANDIDATE
    // Canonical identity: Louis Vuitton Les Sables Roses EDP (2019).
    // Name note: supplier omits accent; "Les Sables Roses" used per Fragrantica convention.
    // Perfumer: Jacques Cavallier Belletrud (Louis Vuitton exclusive master perfumer).
    // Evidence: Fragrantica (HIGH), louisvuitton.com (AUTHORITATIVE).
    // Source: wave-5-2026-research.json UNISEX-67.
    title:               "Les Sables Roses Inspired",
    collection:          "Elite",
    subtitle:            "Inspired by Louis Vuitton Les Sables Roses",
    mood:                "Warm Rose Amber",
    profile:             "Floral Oriental",
    season:              "Autumn",
    notes:               ["Pink Pepper", "Rose de Mai", "Turkish Rose", "Sandalwood", "Oud", "Amber", "White Musk"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Pink Pepper"],
      heart: ["Rose de Mai", "Turkish Rose"],
      base:  ["Sandalwood", "Oud", "Amber", "White Musk"],
    },
  },
];

// ── SKYE (7) ─────────────────────────────────────────────────────────────────

const skye: DisplayFragrance[] = [
  {
    // slug: the-one-pour-homme-inspired
    // Supplier: [MEN] 'Dolce & Gabanna The One' — NEW_SUPPLIER_CANDIDATE
    // Supplier misspells brand 'Gabanna'; canonical: 'Dolce & Gabbana'.
    // FD-1 (informational): EDT (2008) selected as canonical concentration.
    // Distinct from RO entry (the-one-pour-femme-inspired, LADIES-108).
    // Evidence: Fragrantica (HIGH). Source: wave-5-2026-research.json MEN-60.
    title:               "The One Pour Homme Inspired",
    collection:          "Skye",
    subtitle:            "Inspired by Dolce & Gabbana The One for Men",
    mood:                "Warm Spiced Oriental",
    profile:             "Oriental Woody",
    season:              "Autumn",
    notes:               ["Grapefruit", "Basil", "Coriander", "Cardamom", "Ginger", "Orange Blossom", "Geranium", "Cedarwood", "Vetiver", "Amber", "Tobacco", "Musk"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Grapefruit", "Basil", "Coriander", "Cardamom"],
      heart: ["Ginger", "Orange Blossom", "Geranium"],
      base:  ["Cedarwood", "Vetiver", "Amber", "Tobacco", "Musk"],
    },
  },
  {
    // slug: azzaro-wanted-inspired
    // Supplier: [MEN] 'Azzaro Wanted' — NEW_SUPPLIER_CANDIDATE
    // Canonical identity: Azzaro Wanted EDT (2016).
    // Distinct from existing azzaro-most-wanted-inspired (Azzaro Most Wanted, 2021).
    // Evidence: Fragrantica (HIGH). Source: wave-5-2026-research.json MEN-24.
    title:               "Azzaro Wanted Inspired",
    collection:          "Skye",
    subtitle:            "Inspired by Azzaro Wanted",
    mood:                "Bold Woody Aromatic",
    profile:             "Woody Aromatic",
    season:              "Autumn",
    notes:               ["Cardamom", "Grapefruit", "Star Anise", "Juniper Berries", "Suede", "Vetiver", "Guaiac Wood", "Amberwood"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Cardamom", "Grapefruit", "Star Anise"],
      heart: ["Juniper Berries", "Suede"],
      base:  ["Vetiver", "Guaiac Wood", "Amberwood"],
    },
  },
  {
    // slug: azzaro-chrome-inspired
    // Supplier: [MEN] 'Chrome' — NEW_SUPPLIER_CANDIDATE
    // FD-2 (informational): supplier text is brand-less. Brand confirmed: Azzaro.
    // Canonical identity: Azzaro Chrome EDT (1996). Generation brief: brand = Azzaro.
    // Evidence: Fragrantica (HIGH). Source: wave-5-2026-research.json MEN-41.
    title:               "Azzaro Chrome Inspired",
    collection:          "Skye",
    subtitle:            "Inspired by Azzaro Chrome",
    mood:                "Fresh Aquatic Aromatic",
    profile:             "Aromatic Aquatic",
    season:              "Summer",
    notes:               ["Bergamot", "Lemon", "Pineapple", "Water Notes", "Rosemary", "Cyclamen", "Jasmine", "Cedar", "Coriander", "Oakmoss", "Tonka Bean", "Musk", "Sandalwood", "Vetiver"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Bergamot", "Lemon", "Pineapple", "Water Notes", "Rosemary", "Cyclamen"],
      heart: ["Jasmine", "Cedar", "Coriander", "Oakmoss"],
      base:  ["Tonka Bean", "Oakmoss", "Musk", "Sandalwood", "Vetiver"],
    },
  },
  {
    // slug: boss-the-scent-inspired
    // Supplier: [MEN] 'Huggo Boss The Scent' — NEW_SUPPLIER_CANDIDATE
    // Supplier misspells brand 'Huggo'; canonical: 'Hugo Boss'.
    // Canonical identity: Hugo Boss Boss The Scent for Him EDT (2015).
    // Evidence: Fragrantica (HIGH). Source: wave-5-2026-research.json MEN-80.
    title:               "Boss The Scent Inspired",
    collection:          "Skye",
    subtitle:            "Inspired by Hugo Boss Boss The Scent",
    mood:                "Bold Spiced Leather",
    profile:             "Oriental Woody",
    season:              "Autumn",
    notes:               ["Ginger", "Maniguette Pepper", "Osmanthus", "Leather"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Ginger", "Maniguette Pepper"],
      heart: ["Osmanthus"],
      base:  ["Leather"],
    },
  },
  {
    // slug: ralph's-club-inspired
    // Supplier: [MEN] "Ralph's Club by Ralph Lauren" — NEW_SUPPLIER_CANDIDATE
    // Canonical identity: Ralph Lauren Ralph's Club EDP (2021).
    // Apostrophe in title preserved → slug: ralph's-club-inspired (per precedent).
    // Evidence: Fragrantica (HIGH). Source: wave-5-2026-research.json MEN-123.
    title:               "Ralph's Club Inspired",
    collection:          "Skye",
    subtitle:            "Inspired by Ralph Lauren Ralph's Club",
    mood:                "Warm Aromatic Amber",
    profile:             "Aromatic Fougère",
    season:              "Autumn",
    notes:               ["Apple", "Pink Pepper", "Bergamot", "Iris", "Rose", "Cedarwood", "Patchouli", "Sandalwood", "Amber", "Musk"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Apple", "Pink Pepper", "Bergamot"],
      heart: ["Iris", "Rose"],
      base:  ["Cedarwood", "Patchouli", "Sandalwood", "Amber", "Musk"],
    },
  },
  {
    // slug: bad-boy-inspired
    // Supplier: [MEN] '212 CH Bad Boy' — NEW_SUPPLIER_CANDIDATE
    // CRITICAL: '212 CH' is supplier shorthand for Carolina Herrera brand (NOT 212-series).
    // Canonical identity: Carolina Herrera Bad Boy EDP (2019). NOT from the 212 line.
    // Evidence: Fragrantica (HIGH). Source: wave-5-2026-research.json MEN-7.
    title:               "Bad Boy Inspired",
    collection:          "Skye",
    subtitle:            "Inspired by Carolina Herrera Bad Boy",
    mood:                "Dark Spiced Amber",
    profile:             "Amber Woody",
    season:              "Autumn",
    notes:               ["Cardamom", "Black Pepper", "Bergamot", "Sage", "Lavender", "Cacao", "Vetiver", "Leather", "Papyrus", "Tonka Bean"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Cardamom", "Black Pepper", "Bergamot"],
      heart: ["Sage", "Lavender"],
      base:  ["Cacao", "Vetiver", "Leather", "Papyrus", "Tonka Bean"],
    },
  },
  {
    // slug: uomo-by-zegna-inspired
    // Supplier: [MEN] 'Uomo by Zegna' — NEW_SUPPLIER_CANDIDATE
    // FD-3 RESOLVED: 'Uomo by Zegna' = Ermenegildo Zegna Uomo EDT (2013).
    // Fragrantica confirms single canonical product at this name.
    // Evidence: Fragrantica (HIGH). Source: wave-5-2026-research.json MEN-5.
    title:               "Uomo By Zegna Inspired",
    collection:          "Skye",
    subtitle:            "Inspired by Ermenegildo Zegna Uomo",
    mood:                "Fresh Woody Aromatic",
    profile:             "Woody Aromatic",
    season:              "Autumn",
    notes:               ["Bergamot", "Mandarin Orange", "Juniper Berries", "Pink Pepper", "Iris", "Violet", "Cedar", "Vetiver", "Sandalwood", "Patchouli", "Amber"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Bergamot", "Mandarin Orange", "Juniper Berries", "Pink Pepper"],
      heart: ["Iris", "Violet", "Cedar"],
      base:  ["Vetiver", "Sandalwood", "Patchouli", "Amber"],
    },
  },
];

// ── ROSE (7) ─────────────────────────────────────────────────────────────────

const rose: DisplayFragrance[] = [
  {
    // slug: the-one-pour-femme-inspired
    // Supplier: [LADIES] 'Dolce & Gabbana The One' — NEW_SUPPLIER_CANDIDATE
    // LADIES section placement confirms female. Canonical: D&G The One EDP (2006, women's).
    // Distinct from SK-1 (the-one-pour-homme-inspired, MEN-60, 2008).
    // Evidence: Fragrantica (HIGH). Source: wave-5-2026-research.json LADIES-108.
    title:               "The One Pour Femme Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Dolce & Gabbana The One",
    mood:                "Soft Floral Oriental",
    profile:             "Oriental Floral",
    season:              "Autumn",
    notes:               ["Litchi", "Mandarin Orange", "Bergamot", "Peach", "Lily", "Jasmine", "Lily of the Valley", "Musk", "Vetiver", "Amber"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Litchi", "Mandarin Orange", "Bergamot", "Peach"],
      heart: ["Lily", "Jasmine", "Lily of the Valley"],
      base:  ["Musk", "Vetiver", "Amber"],
    },
  },
  {
    // slug: angel-inspired
    // Supplier: [LADIES] 'Angel' — NEW_SUPPLIER_CANDIDATE
    // Brand-less supplier text. Canonical: Mugler Angel EDP (1992).
    // Generation brief: brand = Mugler (formerly Thierry Mugler).
    // Distinct from alien-inspired (Rose), alien-man-inspired (Skye), amen-fantasm-inspired (Skye).
    // Evidence: Fragrantica (HIGH). Source: wave-5-2026-research.json LADIES-15.
    title:               "Angel Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Mugler Angel",
    mood:                "Sweet Patchouli Gourmand",
    profile:             "Gourmand Oriental",
    season:              "Autumn",
    notes:               ["Melon", "Bergamot", "Coconut", "Cotton Candy", "Cassis", "Honey", "Apricot", "Blackberry", "Jasmine", "Lily of the Valley", "Red Berries", "Patchouli", "Chocolate", "Caramel", "Musk", "Vanilla", "Amber", "Sandalwood"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Melon", "Bergamot", "Coconut", "Cotton Candy", "Cassis"],
      heart: ["Honey", "Apricot", "Blackberry", "Jasmine", "Lily of the Valley", "Red Berries"],
      base:  ["Patchouli", "Chocolate", "Caramel", "Musk", "Vanilla", "Amber", "Sandalwood"],
    },
  },
  {
    // slug: daisy-inspired
    // Supplier: [LADIES] 'Daisy' — NEW_SUPPLIER_CANDIDATE
    // Brand-less supplier text. Canonical: Marc Jacobs Daisy EDT (2007).
    // Generation brief: brand = Marc Jacobs.
    // First Marc Jacobs identity in the catalogue.
    // Evidence: Fragrantica (HIGH). Source: wave-5-2026-research.json LADIES-90.
    title:               "Daisy Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Marc Jacobs Daisy",
    mood:                "Light Fresh Floral",
    profile:             "Floral Fresh",
    season:              "Spring",
    notes:               ["Strawberry", "Violet Leaves", "Ruby Red Grapefruit", "Violet", "Jasmine", "Gardenia", "Musk", "Vanilla", "Sandalwood", "White Woods"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Strawberry", "Violet Leaves", "Ruby Red Grapefruit"],
      heart: ["Violet", "Jasmine", "Gardenia"],
      base:  ["Musk", "Vanilla", "Sandalwood", "White Woods"],
    },
  },
  {
    // slug: chanel-allure-inspired
    // Supplier: [LADIES] 'Chanel Allure' — NEW_SUPPLIER_CANDIDATE
    // FD-4 (informational): EDP (1999) selected as canonical concentration.
    // Distinct from allure-homme-sport-inspired (Skye, Wave 1 — male, different product).
    // Evidence: Fragrantica (HIGH). Source: wave-5-2026-research.json LADIES-62.
    title:               "Chanel Allure Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Chanel Allure",
    mood:                "Elegant Powdery Floral",
    profile:             "Floral Aldehyde",
    season:              "Autumn",
    notes:               ["Mandarin Orange", "Bergamot", "Peach", "Aldehydes", "Rose", "Jasmine", "Iris", "Magnolia", "Peach Blossom", "Musk", "Vanilla", "Sandalwood", "Amber", "Vetiver"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Mandarin Orange", "Bergamot", "Peach", "Aldehydes"],
      heart: ["Rose", "Jasmine", "Iris", "Magnolia", "Peach Blossom"],
      base:  ["Musk", "Vanilla", "Sandalwood", "Amber", "Vetiver"],
    },
  },
  {
    // slug: ange-ou-demon-inspired
    // Supplier: [LADIES] 'Ange ou Demon' — NEW_SUPPLIER_CANDIDATE
    // Accent note: supplier omits accent; canonical: 'Ange ou Démon' by Givenchy.
    // Title uses no-accent form for slug derivation; subtitle corrects to canonical.
    // Canonical identity: Givenchy Ange ou Démon EDP (2006).
    // Evidence: Fragrantica (HIGH). Source: wave-5-2026-research.json LADIES-14.
    title:               "Ange Ou Demon Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Givenchy Ange ou Démon",
    mood:                "Ethereal White Floral",
    profile:             "Floral Aldehyde",
    season:              "Autumn",
    notes:               ["Gardenia", "Aldehydes", "Bergamot", "Iris", "White Flowers", "Lily", "White Musk", "Cashmere Wood", "Amber", "Vanilla", "Sandalwood"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Gardenia", "Aldehydes", "Bergamot"],
      heart: ["Iris", "White Flowers", "Lily"],
      base:  ["White Musk", "Cashmere Wood", "Amber", "Vanilla", "Sandalwood"],
    },
  },
  {
    // slug: amor-amor-inspired
    // Supplier: [LADIES] 'Amor Amor' — NEW_SUPPLIER_CANDIDATE
    // Canonical identity: Cacharel Amor Amor EDT (2003).
    // First Cacharel identity in the catalogue.
    // Evidence: Fragrantica (HIGH). Source: wave-5-2026-research.json LADIES-12.
    title:               "Amor Amor Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Cacharel Amor Amor",
    mood:                "Warm Fruity Floral",
    profile:             "Floral Fruity",
    season:              "Summer",
    notes:               ["Grapefruit", "Black Currant", "Cassis", "Mandarin Orange", "Jasmine", "Rose", "Freesia", "Musk", "Sandalwood", "Patchouli", "Amber", "Vetiver", "Vanilla"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Grapefruit", "Black Currant", "Cassis", "Mandarin Orange"],
      heart: ["Jasmine", "Rose", "Freesia"],
      base:  ["Musk", "Sandalwood", "Patchouli", "Amber", "Vetiver", "Vanilla"],
    },
  },
  {
    // slug: dolce-inspired
    // Supplier: [LADIES] 'Dolce / Dolce & Gabbana' — NEW_SUPPLIER_CANDIDATE
    // Supplier convention 'Dolce / Dolce & Gabbana' = product/brand.
    // Canonical product: Dolce by Dolce & Gabbana EDP (2014).
    // Distinct from devotion-inspired (existing Rose, D&G Devotion) and
    // the-one-pour-femme-inspired (this wave, different D&G product).
    // Evidence: Fragrantica (HIGH). Source: wave-5-2026-research.json LADIES-110.
    title:               "Dolce Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Dolce & Gabbana Dolce",
    mood:                "Soft White Floral",
    profile:             "White Floral",
    season:              "Spring",
    notes:               ["Neroli", "Papaya Blossom", "White Amaryllis", "Cashmere Daffodil", "White Muguet", "White Narcissus", "Ambroxan", "Sandalwood", "Cashmeran", "Musk"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Neroli", "Papaya Blossom", "White Amaryllis"],
      heart: ["Cashmere Daffodil", "White Muguet", "White Narcissus"],
      base:  ["Ambroxan", "Sandalwood", "Cashmeran", "Musk"],
    },
  },
];

// ── Export ────────────────────────────────────────────────────────────────────

export const wave5Catalogue: DisplayFragrance[] = [...elite, ...skye, ...rose];
