/**
 * Knowledge Factory — Wave 3 Staging Catalogue
 *
 * EP-CAT-P11: 30 Founder-selected Wave 3 identities registered for
 * controlled factory intake. Factory-only. NOT customer-facing.
 *
 * This file MUST NOT be imported by any module under app/.
 * Managed exclusively by: scripts/factory/intake.ts (quaternary catalogue fallback).
 *
 * Collections:  ELITE (10) · ROSE (10) · SKYE (10) = 30 total
 *
 * All 30 entries are evidence-locked (notesEvidenceLocked: true).
 * Note evidence sourced exclusively from named external references in
 * data/identity/source/wave-3-2026-research.json. No LLM general knowledge.
 *
 * Special governance entries:
 *
 * UNORDERED_GOVERNED_NOTES (2 entries — Jo Malone London):
 *   fig-lotus-flower-inspired, grapefruit-inspired
 *   Pattern: notes=[all], notesStructured={ top:[], heart:[...all], base:[] }
 *   Jo Malone London does not publish a top/heart/base pyramid.
 *   This is a TRANSPORT CONVENTION only — heartNotes[] does NOT assert semantic
 *   tier. No tier redistribution, no note deletion or addition is permitted.
 *   Precedent: Wave 2 (peony-blush-suede-inspired, english-pear-freesia-inspired,
 *   velvet-rose-oud-inspired, oud-bergamot-inspired, gold-oud-inspired).
 *
 * SPARSE structured (1 entry):
 *   scandal-pour-homme-inspired: 1-1-1 pyramid (Geranium / Tonka Bean / Sandalwood).
 *   This is not a data gap — Jean Paul Gaultier officially publishes exactly 3 notes
 *   for Scandal Pour Homme Le Parfum (2022 EDP Intense). Scaffold preserves exactly.
 *
 * BRANDED MOLECULES (1 entry):
 *   abu-dhabi-inspired: Memo Paris publishes proprietary captive ingredients
 *   (Safraleine, Mahonial, Ambrofix, AmbreXolide, Hydrocarboresine) on their
 *   official product page. These names must survive scaffold verbatim.
 *
 * BRAND_NARRATIVE_ONLY (1 entry):
 *   torino24-inspired: Xerjoff deliberately withholds all notes for the
 *   "Join the Club" collection. Founder decision EP-CAT-P11 (2026-08-22):
 *   BRAND_NARRATIVE_ONLY governance. notes=[], notesStructured={top:[],heart:[],base:[]}.
 *   Community-sourced notes are preserved in wave-3-2026-research.json as LOW-confidence
 *   reference only — they must NOT appear in this catalogue or factory output.
 *   notesEvidenceLocked:true prevents AI note generation.
 *
 * Diacritics: stripped from titles (slug derivation requires ASCII-safe lowercase),
 *   preserved in subtitles.
 *   - "Attrape Reves Inspired" → slug: attrape-reves-inspired
 *     subtitle: "Inspired by Louis Vuitton Attrape-Rêves"
 *   - "A La Rose Inspired" → slug: a-la-rose-inspired
 *     subtitle: "Inspired by Maison Francis Kurkdjian À la rose"
 *   - "Egoiste Platinum Inspired" → slug: egoiste-platinum-inspired
 *     subtitle: "Inspired by Chanel Platinum Égoïste"
 *   - "Armani Prive Oud Royal Inspired" → slug: armani-prive-oud-royal-inspired
 *     subtitle: "Inspired by Giorgio Armani Armani Privé Oud Royal"
 *
 * Slug derivation: all titles are crafted so that
 *   title.toLowerCase().replace(/\s+/g, "-")
 * produces exactly the Founder-approved proposedSlug from the Wave 3 research
 * artifact (data/identity/source/wave-3-2026-research.json).
 *
 * Year corrections (4 documented in research governance):
 *   LADIES-202 My Way Nectar: 2022 → 2024 (disposition record error)
 *   MEN-42 Eternity for Men: 1988 → 1990 (supplier confusion: women's vs men's launch)
 *   MEN-10 212 VIP Black: 2012 → 2017 (212 VIP Men 2011 ≠ 212 VIP Black 2017)
 *   UNISEX-20 Centaurus: 2023 → 2024 (initial brief error)
 */

import type { DisplayFragrance } from "../../../app/lib/knowledgeAdapter";

// Canonical retail pricing. Required field — cannot be omitted on DisplayFragrance.
const PRICES = { "5ml": 60, "10ml": 100, "30ml": 250 } as const;

// Factory-staging image placeholders. No product photography for pre-promoted identities.
const IMAGES = { "5ml": "", "10ml": "", "30ml": "" } as const;

// ── ROSE (10) ─────────────────────────────────────────────────────────────────

const rose: DisplayFragrance[] = [
  {
    // slug: my-way-nectar-inspired
    // Giorgio Armani My Way Nectar EDP (2024). Floral Fruity.
    // Year correction: disposition record stated 2022; research confirms 2024.
    title:               "My Way Nectar Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Giorgio Armani My Way Nectar",
    mood:                "Warm Fruity Floral",
    profile:             "Floral Fruity",
    season:              "Autumn",
    notes:               ["Pear", "Bergamot", "Orange Blossom", "Tuberose", "Jasmine", "Violet Leaf", "White Musk", "Bourbon Vanilla", "Cedarwood"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Pear", "Bergamot", "Orange Blossom"],
      heart: ["Tuberose", "Jasmine", "Violet Leaf"],
      base:  ["White Musk", "Bourbon Vanilla", "Cedarwood"],
    },
  },
  {
    // slug: changing-constance-inspired
    // Penhaligon's Changing Constance EDP (2018). Gourmand.
    title:               "Changing Constance Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Penhaligon's Changing Constance",
    mood:                "Sweet Spicy Gourmand",
    profile:             "Gourmand",
    season:              "Autumn",
    notes:               ["Cardamom", "Pimento Seeds", "Caramel", "Salt", "Vanilla", "Cashmeran", "Tobacco"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Cardamom", "Pimento Seeds"],
      heart: ["Caramel", "Salt"],
      base:  ["Vanilla", "Cashmeran", "Tobacco"],
    },
  },
  {
    // slug: queen-of-silk-inspired
    // Creed Queen of Silk EDP (2024). Floral Amber. AUTHORITATIVE evidence.
    title:               "Queen of Silk Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Creed Queen of Silk",
    mood:                "Warm Floral Amber",
    profile:             "Floral Amber",
    season:              "Year-Round",
    notes:               ["Chinese Osmanthus", "Passionfruit", "Tuberose", "Javanese Patchouli", "Cedar", "Agarwood", "Madagascan Vanilla", "Ambers"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Chinese Osmanthus", "Passionfruit"],
      heart: ["Tuberose", "Javanese Patchouli"],
      base:  ["Cedar", "Agarwood", "Madagascan Vanilla", "Ambers"],
    },
  },
  {
    // slug: chanel-no-5-inspired
    // Chanel N°5 Eau de Parfum (1986, Jacques Polge reformulation). Floral Aldehyde.
    // Concentration: EDP — most commonly retailed version; distinct from Parfum/Extrait (1921).
    title:               "Chanel No 5 Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Chanel N°5 Eau de Parfum",
    mood:                "Powdery Floral Classic",
    profile:             "Floral Aldehyde",
    season:              "Year-Round",
    notes:               ["Aldehydes", "Ylang-Ylang", "Neroli", "Bergamot", "Peach", "May Rose", "Jasmine", "Iris", "Lily of the Valley", "Sandalwood", "Vetiver", "Oakmoss", "Patchouli", "Vanilla"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Aldehydes", "Ylang-Ylang", "Neroli", "Bergamot", "Peach"],
      heart: ["May Rose", "Jasmine", "Iris", "Lily of the Valley"],
      base:  ["Sandalwood", "Vetiver", "Oakmoss", "Patchouli", "Vanilla"],
    },
  },
  {
    // slug: gabrielle-inspired
    // Chanel Gabrielle EDP (2017). Floral.
    title:               "Gabrielle Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Chanel Gabrielle",
    mood:                "Luminous White Floral",
    profile:             "Floral",
    season:              "Year-Round",
    notes:               ["Grapefruit", "Mandarin Orange", "Black Currant", "Orange Blossom", "Jasmine", "Ylang-Ylang", "Tuberose", "Lily of the Valley", "Pear", "Pink Pepper", "Musk", "Sandalwood", "Cashmeran", "Orris"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Grapefruit", "Mandarin Orange", "Black Currant"],
      heart: ["Orange Blossom", "Jasmine", "Ylang-Ylang", "Tuberose", "Lily of the Valley", "Pear", "Pink Pepper"],
      base:  ["Musk", "Sandalwood", "Cashmeran", "Orris"],
    },
  },
  {
    // slug: attrape-reves-inspired
    // EVIDENCE-LOCK: Louis Vuitton Attrape-Rêves EDP (2018). Floral Gourmand.
    // Diacritics stripped from title for slug derivation; preserved in subtitle.
    // Canonical name: Attrape-Rêves (circumflex accent preserved per governance).
    title:               "Attrape Reves Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Louis Vuitton Attrape-Rêves",
    mood:                "Sweet Floral Exotic",
    profile:             "Floral Gourmand",
    season:              "Autumn",
    notes:               ["Litchi", "Bergamot", "Ginger", "Peony", "Turkish Rose", "Cacao", "Patchouli"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Litchi", "Bergamot", "Ginger"],
      heart: ["Peony", "Turkish Rose", "Cacao"],
      base:  ["Patchouli"],
    },
  },
  {
    // slug: omnia-crystalline-inspired
    // Bvlgari Omnia Crystalline EDT (2005). Floral Aquatic.
    title:               "Omnia Crystalline Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Bvlgari Omnia Crystalline",
    mood:                "Fresh Aquatic Floral",
    profile:             "Floral Aquatic",
    season:              "Summer",
    notes:               ["Bamboo", "Pear", "Lotus", "Tea", "Cassia", "Musk", "Guaiac Wood", "Oakmoss"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Bamboo", "Pear"],
      heart: ["Lotus", "Tea", "Cassia"],
      base:  ["Musk", "Guaiac Wood", "Oakmoss"],
    },
  },
  {
    // slug: valaya-exclusif-inspired
    // Parfums de Marly Valaya Exclusif EDP (2025). Floral Powdery Woody.
    // "Exclusif" IS part of the canonical product name — distinct from Valaya (2023).
    // AUTHORITATIVE evidence (Parfums de Marly official site).
    title:               "Valaya Exclusif Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Parfums de Marly Valaya Exclusif",
    mood:                "Soft Powdery Floral",
    profile:             "Floral Powdery Woody",
    season:              "Year-Round",
    notes:               ["Almond", "Bergamot", "Mandarin", "Orange Blossom", "White Flowers", "White Musks", "Akigalawood", "Sandalwood", "Vanilla"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Almond", "Bergamot", "Mandarin"],
      heart: ["Orange Blossom", "White Flowers"],
      base:  ["White Musks", "Akigalawood", "Sandalwood", "Vanilla"],
    },
  },
  {
    // slug: crazy-in-love-inspired
    // Montale Crazy in Love EDP (2021). Oriental Floral.
    title:               "Crazy in Love Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Montale Crazy in Love",
    mood:                "Warm Floral Oriental",
    profile:             "Oriental Floral",
    season:              "Autumn",
    notes:               ["Wild Rose", "Violet Leaves", "Saffron", "Brown Sugar", "Amber", "Vanilla Bean"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Wild Rose", "Violet Leaves"],
      heart: ["Saffron", "Brown Sugar"],
      base:  ["Amber", "Vanilla Bean"],
    },
  },
  {
    // slug: a-la-rose-inspired
    // EVIDENCE-LOCK: Maison Francis Kurkdjian À la rose EDP (2014). Floral.
    // Diacritics stripped from title for slug derivation; preserved in subtitle.
    // Canonical name: À la rose (grave accent + lowercase per MFK official).
    title:               "A La Rose Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Maison Francis Kurkdjian À la rose",
    mood:                "Dewy Floral Rose",
    profile:             "Floral",
    season:              "Spring",
    notes:               ["Calabrian Bergamot", "California Orange", "Bulgarian Rose", "Grasse Rose", "Violet", "Magnolia", "Cedar", "Musk"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Calabrian Bergamot", "California Orange"],
      heart: ["Bulgarian Rose", "Grasse Rose", "Violet", "Magnolia"],
      base:  ["Cedar", "Musk"],
    },
  },
];

// ── SKYE (10) ─────────────────────────────────────────────────────────────────

const skye: DisplayFragrance[] = [
  {
    // slug: light-blue-pour-homme-inspired
    // Dolce & Gabbana Light Blue Pour Homme EDT (2007). Citrus Aromatic.
    title:               "Light Blue Pour Homme Inspired",
    collection:          "Skye",
    subtitle:            "Inspired by Dolce & Gabbana Light Blue Pour Homme",
    mood:                "Fresh Citrus Mediterranean",
    profile:             "Citrus Aromatic",
    season:              "Summer",
    notes:               ["Grapefruit", "Bergamot", "Sicilian Mandarin", "Juniper", "Pepper", "Rosemary", "Brazilian Rosewood", "Musk", "Incense", "Oakmoss"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Grapefruit", "Bergamot", "Sicilian Mandarin", "Juniper"],
      heart: ["Pepper", "Rosemary", "Brazilian Rosewood"],
      base:  ["Musk", "Incense", "Oakmoss"],
    },
  },
  {
    // slug: bois-pacifique-inspired
    // Tom Ford Bois Pacifique EDP (2024). Woody Spicy. AUTHORITATIVE evidence.
    // Marketed as unisex; placed in Skye per Founder collection assignment.
    title:               "Bois Pacifique Inspired",
    collection:          "Skye",
    subtitle:            "Inspired by Tom Ford Bois Pacifique",
    mood:                "Warm Woody Spicy",
    profile:             "Woody Spicy",
    season:              "Autumn",
    notes:               ["Turmeric", "Cardamom", "Akigalawood", "Olibanum", "Orris", "Sandalwood", "Cedar", "Oakwood"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Turmeric", "Cardamom"],
      heart: ["Akigalawood", "Olibanum", "Orris"],
      base:  ["Sandalwood", "Cedar", "Oakwood"],
    },
  },
  {
    // slug: egoiste-platinum-inspired
    // EVIDENCE-LOCK: Chanel Platinum Égoïste EDT (1993). Woody Floral Musk.
    // Diacritics stripped from title for slug derivation; preserved in subtitle.
    // Canonical name: Platinum Égoïste (acute + diaeresis per Chanel official).
    title:               "Egoiste Platinum Inspired",
    collection:          "Skye",
    subtitle:            "Inspired by Chanel Platinum Égoïste",
    mood:                "Aromatic Woody Classic",
    profile:             "Woody Floral Musk",
    season:              "Year-Round",
    notes:               ["Lavender", "Rosemary", "Neroli", "Petitgrain", "Geranium", "Clary Sage", "Galbanum", "Jasmine", "Oakmoss", "Vetiver", "Cedar", "Sandalwood", "Amber"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Lavender", "Rosemary", "Neroli", "Petitgrain"],
      heart: ["Geranium", "Clary Sage", "Galbanum", "Jasmine"],
      base:  ["Oakmoss", "Vetiver", "Cedar", "Sandalwood", "Amber"],
    },
  },
  {
    // slug: burberry-london-inspired
    // Burberry London for Men EDT (2006). Oriental Spicy.
    title:               "Burberry London Inspired",
    collection:          "Skye",
    subtitle:            "Inspired by Burberry London for Men",
    mood:                "Warm Spicy Tobacco",
    profile:             "Oriental Spicy",
    season:              "Autumn",
    notes:               ["Cinnamon", "Lavender", "Bergamot", "Leather", "Mimosa", "Tobacco Leaf", "Guaiac Wood", "Opoponax", "Oakmoss"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Cinnamon", "Lavender", "Bergamot"],
      heart: ["Leather", "Mimosa"],
      base:  ["Tobacco Leaf", "Guaiac Wood", "Opoponax", "Oakmoss"],
    },
  },
  {
    // slug: eternity-inspired
    // Calvin Klein Eternity for Men EDT (1990). Aromatic Fougere.
    // Year correction: supplier note stated 1988 (women's Eternity launch); men's is 1990.
    title:               "Eternity Inspired",
    collection:          "Skye",
    subtitle:            "Inspired by Calvin Klein Eternity for Men",
    mood:                "Fresh Aromatic Classic",
    profile:             "Aromatic Fougere",
    season:              "Year-Round",
    notes:               ["Lavender", "Lemon", "Bergamot", "Mandarin Orange", "Sage", "Juniper Berries", "Basil", "Geranium", "Jasmine", "Coriander", "Orange Blossom", "Lily of the Valley", "Lily", "Sandalwood", "Musk", "Vetiver", "Brazilian Rosewood", "Amber"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Lavender", "Lemon", "Bergamot", "Mandarin Orange"],
      heart: ["Sage", "Juniper Berries", "Basil", "Geranium", "Jasmine", "Coriander", "Orange Blossom", "Lily of the Valley", "Lily"],
      base:  ["Sandalwood", "Musk", "Vetiver", "Brazilian Rosewood", "Amber"],
    },
  },
  {
    // slug: bvlgari-black-inspired
    // Bvlgari Black EDT (1998). Oriental Woody. Genderless positioning.
    title:               "Bvlgari Black Inspired",
    collection:          "Skye",
    subtitle:            "Inspired by Bvlgari Black",
    mood:                "Smoky Rubbery Dark",
    profile:             "Oriental Woody",
    season:              "Autumn",
    notes:               ["Lapsang Souchong", "Bergamot", "Rose", "Sandalwood", "Cedar", "Jasmine", "Oakmoss", "Vanilla", "Leather", "Amber", "Musk"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Lapsang Souchong", "Bergamot", "Rose"],
      heart: ["Sandalwood", "Cedar", "Jasmine", "Oakmoss"],
      base:  ["Vanilla", "Leather", "Amber", "Musk"],
    },
  },
  {
    // slug: 212-vip-black-inspired
    // Carolina Herrera 212 VIP Black EDP (2017). Aromatic Fougere.
    // Year correction: supplier stated 2012; research confirms 2017
    // (2011 release was "212 VIP Men" — a different product).
    title:               "212 Vip Black Inspired",
    collection:          "Skye",
    subtitle:            "Inspired by Carolina Herrera 212 VIP Black",
    mood:                "Dark Spicy Aromatic",
    profile:             "Aromatic Fougere",
    season:              "Winter",
    notes:               ["Absinthe", "Anise", "Fennel", "Lavender", "Black Vanilla Husk", "Musk"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Absinthe", "Anise", "Fennel"],
      heart: ["Lavender"],
      base:  ["Black Vanilla Husk", "Musk"],
    },
  },
  {
    // slug: aqva-amara-inspired
    // Bvlgari AQVA Amara EDT (2014). Woody Aquatic.
    // Canonical name: AQVA Amara (official Bvlgari spelling with V).
    title:               "Aqva Amara Inspired",
    collection:          "Skye",
    subtitle:            "Inspired by Bvlgari AQVA Amara",
    mood:                "Citrus Aquatic Bitter",
    profile:             "Woody Aquatic",
    season:              "Summer",
    notes:               ["Sicilian Mandarin", "Watery Notes", "Neroli", "Olibanum", "Indonesian Patchouli Leaf"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Sicilian Mandarin"],
      heart: ["Watery Notes", "Neroli"],
      base:  ["Olibanum", "Indonesian Patchouli Leaf"],
    },
  },
  {
    // slug: scandal-pour-homme-inspired
    // EVIDENCE-LOCK (SPARSE 1-1-1): Jean Paul Gaultier Scandal Pour Homme Le Parfum
    // EDP Intense (2022). Oriental Woody. Supplier suffix "NEW" resolved as internal
    // convention — canonical product name is "Scandal Pour Homme Le Parfum".
    // Jean Paul Gaultier officially publishes exactly 3 notes for this fragrance.
    // This is NOT a data gap — it is a deliberately minimal pyramid. Do not enrich.
    title:               "Scandal Pour Homme Inspired",
    collection:          "Skye",
    subtitle:            "Inspired by Jean Paul Gaultier Scandal Pour Homme Le Parfum",
    mood:                "Warm Woody Sensual",
    profile:             "Oriental Woody",
    season:              "Autumn",
    notes:               ["Geranium", "Tonka Bean", "Sandalwood"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Geranium"],
      heart: ["Tonka Bean"],
      base:  ["Sandalwood"],
    },
  },
  {
    // slug: lacoste-blanc-inspired
    // Lacoste Eau de Lacoste L.12.12 Blanc EDT (2011). Woody Aromatic.
    // Supplier name "Lacoste White" resolved to official canonical name.
    title:               "Lacoste Blanc Inspired",
    collection:          "Skye",
    subtitle:            "Inspired by Lacoste Eau de Lacoste L.12.12 Blanc",
    mood:                "Fresh Clean Woody",
    profile:             "Woody Aromatic",
    season:              "Summer",
    notes:               ["Grapefruit", "Rosemary", "Cardamom", "Ylang-Ylang", "Tuberose", "Virginia Cedar", "Suede", "Vetiver", "Leather"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Grapefruit", "Rosemary", "Cardamom"],
      heart: ["Ylang-Ylang", "Tuberose"],
      base:  ["Virginia Cedar", "Suede", "Vetiver", "Leather"],
    },
  },
];

// ── ELITE (10) ────────────────────────────────────────────────────────────────

const elite: DisplayFragrance[] = [
  {
    // slug: oud-sapparot-inspired
    // Montale Oud Sapparot EDP (2025). Oriental Woody.
    title:               "Oud Sapparot Inspired",
    collection:          "Elite",
    subtitle:            "Inspired by Montale Oud Sapparot",
    mood:                "Rich Oud Tropical",
    profile:             "Oriental Woody",
    season:              "Autumn",
    notes:               ["Thai Pineapple", "Cambodian Oud", "Indian Saffron", "Dark Leather", "Smoky Silver Birch", "Ceylon Cinnamon", "Sweet Vanilla", "Mexican Coconut", "White Musk"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Thai Pineapple", "Cambodian Oud", "Indian Saffron"],
      heart: ["Dark Leather", "Smoky Silver Birch", "Ceylon Cinnamon"],
      base:  ["Sweet Vanilla", "Mexican Coconut", "White Musk"],
    },
  },
  {
    // slug: abu-dhabi-inspired
    // EVIDENCE-LOCK (BRANDED MOLECULES): Memo Paris Abu Dhabi EDP (2024). Fruity Amber.
    // AUTHORITATIVE evidence from us.memoparis.com official product page.
    // Notes include proprietary captive ingredients published by Memo Paris:
    //   Safraleine, Mahonial, Ambrofix, AmbreXolide, Hydrocarboresine
    // These synthetic/branded molecule names must survive scaffold pipeline verbatim.
    // No substitution, normalisation, or removal permitted.
    title:               "Abu Dhabi Inspired",
    collection:          "Elite",
    subtitle:            "Inspired by Memo Paris Abu Dhabi",
    mood:                "Rich Fruity Amber",
    profile:             "Fruity Amber",
    season:              "Year-Round",
    notes:               [
      "Bergamot Oil", "Orange Oil Brazil", "Pink Peppercorn", "Cardamom", "Ginger", "Olibanum", "Safraleine",
      "Date Accord", "Plum Accord", "Davana Oil", "Carrot Seed", "Orange Flower Absolute", "Mahonial",
      "Vetiver des Sables", "Vetiver Oil Haiti", "Vetiver Oil Indonesia", "Patchouli", "Cistus Absolute", "Hydrocarboresine", "Fir Balsam Absolute", "Vanillin", "Ambrofix", "AmbreXolide",
    ],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Bergamot Oil", "Orange Oil Brazil", "Pink Peppercorn", "Cardamom", "Ginger", "Olibanum", "Safraleine"],
      heart: ["Date Accord", "Plum Accord", "Davana Oil", "Carrot Seed", "Orange Flower Absolute", "Mahonial"],
      base:  ["Vetiver des Sables", "Vetiver Oil Haiti", "Vetiver Oil Indonesia", "Patchouli", "Cistus Absolute", "Hydrocarboresine", "Fir Balsam Absolute", "Vanillin", "Ambrofix", "AmbreXolide"],
    },
  },
  {
    // slug: cinque-terre-inspired
    // Mancera Cinque Terre EDP (2024). Woody Aromatic. AUTHORITATIVE evidence.
    title:               "Cinque Terre Inspired",
    collection:          "Elite",
    subtitle:            "Inspired by Mancera Cinque Terre",
    mood:                "Fresh Mediterranean Woody",
    profile:             "Woody Aromatic",
    season:              "Summer",
    notes:               ["Italian Rosemary", "Lemon", "Cardamom", "Cedar & Pine", "Fig Leaves", "Sea Salt", "Grey Amber", "Oakmoss", "Tonka Beans", "Sandalwood", "Labdanum"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Italian Rosemary", "Lemon", "Cardamom"],
      heart: ["Cedar & Pine", "Fig Leaves", "Sea Salt", "Grey Amber"],
      base:  ["Oakmoss", "Tonka Beans", "Sandalwood", "Labdanum"],
    },
  },
  {
    // slug: fig-lotus-flower-inspired
    // EVIDENCE-LOCK (UNORDERED_GOVERNED_NOTES): Jo Malone London Fig & Lotus Flower
    // Cologne (2020). Floral. Jo Malone London does not publish a top/heart/base pyramid.
    // All 3 notes placed in heart[] as transport convention ONLY.
    // No tier assertion. No note invention. No redistribution permitted.
    title:               "Fig Lotus Flower Inspired",
    collection:          "Elite",
    subtitle:            "Inspired by Jo Malone London Fig & Lotus Flower",
    mood:                "Fresh Green Aquatic",
    profile:             "Floral",
    season:              "Summer",
    notes:               ["Fig Leaf", "Lotus Flower", "Vetiver"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   [],
      heart: ["Fig Leaf", "Lotus Flower", "Vetiver"],
      base:  [],
    },
  },
  {
    // slug: torino24-inspired
    // EVIDENCE-LOCK (BRAND_NARRATIVE_ONLY): Xerjoff TORINO24 EDP (2024). Fruity Gourmand.
    // Founder decision EP-CAT-P11 (2026-08-22): BRAND_NARRATIVE_ONLY governance.
    // Xerjoff deliberately withholds all notes for the "Join the Club" collection.
    // Community-sourced notes are preserved in wave-3-2026-research.json as LOW-confidence
    // reference only — they do NOT appear here and must NOT enter factory output.
    // notes=[], notesStructured={top:[],heart:[],base:[]} — empty locked scaffold.
    // notesEvidenceLocked:true prevents AI composition generation.
    // Editorial producer must generate description from brand narrative only.
    title:               "Torino24 Inspired",
    collection:          "Elite",
    subtitle:            "Inspired by Xerjoff TORINO24",
    mood:                "Fruity Gourmand",
    profile:             "Fruity Gourmand",
    season:              "Year-Round",
    notes:               [],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   [],
      heart: [],
      base:  [],
    },
  },
  {
    // slug: outlands-inspired
    // Amouage Outlands Essence de Parfum (2024, Cecile Zarokian). Oriental Woody.
    // Part of Amouage "The Essences" collection (high-concentration format).
    title:               "Outlands Inspired",
    collection:          "Elite",
    subtitle:            "Inspired by Amouage Outlands",
    mood:                "Rich Oud Oriental",
    profile:             "Oriental Woody",
    season:              "Autumn",
    notes:               ["Frankincense", "Cardamom", "Elemi", "Lemon", "Bergamot", "Sichuan Pepper", "Patchouli", "Anise", "Coriander", "Saffron", "Cumin", "Orange Blossom", "Wormwood", "Geranium", "Rose", "Vanilla", "Amber", "Benzoin", "Oud", "Opoponax", "Birch", "Ambergris", "Labdanum", "Maltol", "Musk"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Frankincense", "Cardamom", "Elemi", "Lemon", "Bergamot", "Sichuan Pepper"],
      heart: ["Patchouli", "Anise", "Coriander", "Saffron", "Cumin", "Orange Blossom", "Wormwood", "Geranium", "Rose"],
      base:  ["Frankincense", "Vanilla", "Amber", "Benzoin", "Oud", "Opoponax", "Birch", "Ambergris", "Labdanum", "Maltol", "Musk"],
    },
  },
  {
    // slug: centaurus-inspired
    // Creed Centaurus EDP (2024). Oriental Spicy. AUTHORITATIVE evidence.
    // Year correction: initial brief stated 2023; research confirms 2024.
    title:               "Centaurus Inspired",
    collection:          "Elite",
    subtitle:            "Inspired by Creed Centaurus",
    mood:                "Warm Spicy Oriental",
    profile:             "Oriental Spicy",
    season:              "Autumn",
    notes:               ["Pink Pepper", "Cinnamon", "Cardamom", "Sandalwood", "Jasmine", "Heliotrope", "Patchouli", "Tonka Bean", "Bourbon Vanilla"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Pink Pepper", "Cinnamon", "Cardamom"],
      heart: ["Sandalwood", "Jasmine", "Heliotrope"],
      base:  ["Patchouli", "Tonka Bean", "Bourbon Vanilla"],
    },
  },
  {
    // slug: grapefruit-inspired
    // EVIDENCE-LOCK (UNORDERED_GOVERNED_NOTES): Jo Malone London Grapefruit
    // Cologne (1992). Citrus. Jo Malone London does not publish a top/heart/base pyramid.
    // All 4 notes placed in heart[] as transport convention ONLY.
    // No tier assertion. No note invention. No redistribution permitted.
    title:               "Grapefruit Inspired",
    collection:          "Elite",
    subtitle:            "Inspired by Jo Malone London Grapefruit",
    mood:                "Fresh Citrus Herbal",
    profile:             "Citrus",
    season:              "Summer",
    notes:               ["Grapefruit", "Rosemary", "Peppermint", "Pimento"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   [],
      heart: ["Grapefruit", "Rosemary", "Peppermint", "Pimento"],
      base:  [],
    },
  },
  {
    // slug: dark-vanilla-inspired
    // Montale Dark Vanilla EDP (2020). Gourmand. AUTHORITATIVE evidence.
    title:               "Dark Vanilla Inspired",
    collection:          "Elite",
    subtitle:            "Inspired by Montale Dark Vanilla",
    mood:                "Rich Dark Gourmand",
    profile:             "Gourmand",
    season:              "Winter",
    notes:               ["Pink Pepper", "Saffron", "Cumin", "Cardamom", "Lemon", "Coriander", "Sandalwood", "Leather", "Oud", "Patchouli", "Vanilla", "Amber"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Pink Pepper", "Saffron", "Cumin", "Cardamom", "Lemon", "Coriander"],
      heart: ["Sandalwood", "Leather", "Oud", "Patchouli"],
      base:  ["Vanilla", "Amber"],
    },
  },
  {
    // slug: armani-prive-oud-royal-inspired
    // EVIDENCE-LOCK: Giorgio Armani Armani Privé Oud Royal EDP (2010). Amber Woody.
    // Diacritics stripped from title for slug derivation; preserved in subtitle.
    // Canonical name: Armani Privé Oud Royal (acute accent on Privé per Armani official).
    title:               "Armani Prive Oud Royal Inspired",
    collection:          "Elite",
    subtitle:            "Inspired by Giorgio Armani Armani Privé Oud Royal",
    mood:                "Rich Dark Oud",
    profile:             "Amber Woody",
    season:              "Winter",
    notes:               ["Saffron", "Incense", "Rose", "Amber", "Sandalwood", "Hindi Oud"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Saffron", "Incense"],
      heart: ["Rose", "Amber"],
      base:  ["Sandalwood", "Hindi Oud"],
    },
  },
];

// ── Export ─────────────────────────────────────────────────────────────────────

export const wave3Catalogue: DisplayFragrance[] = [...rose, ...skye, ...elite];
