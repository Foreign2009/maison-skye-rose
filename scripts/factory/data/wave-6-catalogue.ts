/**
 * Knowledge Factory — Wave 6 Staging Catalogue
 *
 * CATALOGUE-WAVE6-P2: 13 evidence-verified Wave 6 identities registered for
 * controlled factory intake. Factory-only. NOT customer-facing.
 *
 * This file MUST NOT be imported by any module under app/.
 * Managed exclusively by: scripts/factory/intake.ts (septenary catalogue fallback).
 *
 * Collections:  ELITE (4) · SKYE (4) · ROSE (5) = 13 total
 *
 * EVIDENCE LOCK
 *
 * All 13 records are at CATALOGUE-WAVE6-P1 governed evidence-lock state.
 * Notes, notesStructured, and notesEvidenceLocked are populated from
 * externally researched evidence verified in CATALOGUE-WAVE6-P1 (2026-09-07).
 * No LLM general knowledge. No invented notes. No inferred tiers.
 *
 * NOTES EXCEPTION (minimal composition):
 *   light-blue-capri-in-love-inspired: Only 3 notes confirmed (Jasmine Tea / Apple / Longoza).
 *   Intentionally minimalist D&G composition per Fragrantica and official D&G sources.
 *   notesEvidenceLocked: true — pyramid is authoritative as-is.
 *
 * P1 NEGATIVE EVIDENCE LOCKS (must not regress to P0 assumptions):
 *   opium-inspired:                          NOT Tobacco family. Oriental Spicy (Amber Spicy).
 *   matiere-noire-inspired:                  NOT Leather. Oriental Woody (Oud/Floral Bouquet).
 *   jasmin-noir-inspired:                    NOT Leather / NOT leather-adjacent. Oriental Floral.
 *   cloud-inspired:                          NOT Powdery. Floral Fruity Gourmand (sweet/creamy).
 *   euphoria-men-inspired:                   NOT Gourmand. Aromatic Woody (Oriental Woody).
 *   stronger-with-you-sandalwood-inspired:   NOT Tobacco family. Oriental Woody.
 *
 * WAVE 6 GOVERNANCE DECISIONS (from P1):
 *   FD-W6-1: "Opium Black" (R1) — ELIMINATED. Black Opium already in MKC as two records.
 *   FD-W6-2: Agua Mística — HELD. Format: perfume mist (not EDP). Governance unresolved.
 *   FD-W6-3: Dança Mística — HELD. Format: perfume mist. Same governance concern.
 *   FD-W6-4: Gucci Oud — HELD. Identity ambiguous (three distinct products). Supplier clarification needed.
 *   FD-W6-5: D&G The One Rose — HELD. Discontinuation risk unresolved. Supplier availability required.
 *   FD-W6-6: Boss Orange Ladies — HELD. Hugo Boss Orange line discontinued.
 *
 * TRAVEL GOVERNANCE (P2-7 — DiscoveryProducer constraint):
 *   light-blue-capri-in-love-inspired: Travel eligible ONLY from notes character (fresh floral)
 *     AND D&G Light Blue line brand identity (Mediterranean Summer positioning, 2001–present).
 *     NOT from "Capri" appearing in product name.
 *   bombshell-escape-inspired: Tropical Travel eligible ONLY from notes character
 *     (Guava, Palm Leaf, Palm Tree confirm beach/tropical occasion).
 *     NOT from "Escape" appearing in product name.
 *
 * Supplier source: data/supplier/normalized/fragrance-list-2026-08-normalized.json
 * Evidence: CATALOGUE-WAVE6-P1 research session (2026-09-07); WAVE6-P2 reverifications same date.
 * All 13 slugs confirmed clear: native MKC, production fragrances.ts, Waves 1–5, drafts.
 *
 * Canonical retail pricing: 5ml=60, 10ml=100, 30ml=250 (ZAR).
 * Images: placeholders. Populated at MKC promotion time.
 *   BLUE_IMAGES: Skye, Elite non-floral/dark/warm.
 *   PINK_IMAGES: Rose, Elite floral/rose-oriented.
 *
 * Pre-Wave-6 baseline: 242 native MKC records (Elite 44, Skye 101, Rose 97).
 * Post-Wave-6 projected (all promoted): Elite 48, Skye 105, Rose 102 = 255 total.
 */

import type { DisplayFragrance } from "../../../app/lib/knowledgeAdapter";

const PRICES = { "5ml": 60, "10ml": 100, "30ml": 250 } as const;

const BLUE_IMAGES = { "5ml": "/images/blue-5ml.png", "10ml": "/images/blue-10ml.png", "30ml": "/images/glass-blue-30ml.png" } as const;
const PINK_IMAGES = { "5ml": "/images/pink-5ml.png", "10ml": "/images/pink-10ml.png", "30ml": "/images/glass-pink-30ml.png" } as const;

// ── ELITE (4) ────────────────────────────────────────────────────────────────

const elite: DisplayFragrance[] = [
  {
    // slug: versace-rose-flamboyante-inspired
    // Supplier: [UNISEX] 'Rose Flamboyante by Versace' — NEW_SUPPLIER_CANDIDATE
    // Canonical identity: Versace Rose Flamboyante EDP (2024). Atelier Versace (premium/niche line).
    // Gender: Unisex ("women and men"). Elite: Atelier Versace premium positioning.
    // Evidence: Fragrantica (HIGH). Confirmed distinct from all native MKC records.
    // Source: CATALOGUE-WAVE6-P1 research (2026-09-07).
    // Gap: Rose family — Rose is primary heart note. Floral Woody with Chypre character.
    //   NOT a pure soft rose: Patchouli + Vetiver ground it as Floral Woody/Chypre.
    title:               "Versace Rose Flamboyante Inspired",
    collection:          "Elite",
    subtitle:            "Inspired by Versace Rose Flamboyante",
    mood:                "Bold Floral Woody",
    profile:             "Floral Woody",
    season:              "Autumn",
    notes:               ["Cardamom", "Mandarin Orange", "Rose", "Patchouli", "Geranium", "Musk", "Cedar", "Vetiver"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              PINK_IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Cardamom", "Mandarin Orange"],
      heart: ["Rose", "Patchouli", "Geranium"],
      base:  ["Musk", "Cedar", "Vetiver"],
    },
  },
  {
    // slug: tobacco-honey-inspired
    // Supplier: [UNISEX] 'Tobacco Honey by Guerlain' — NEW_SUPPLIER_CANDIDATE
    // Canonical identity: Guerlain Tobacco Honey EDP (2023). L'Art & La Matière collection.
    // Gender: Unisex. Elite: Guerlain L'Art & La Matière premium/niche positioning.
    // Evidence: Guerlain official, Fragrantica (HIGH). Confirmed distinct from all MKC records.
    // Source: CATALOGUE-WAVE6-P1 research (2026-09-07).
    // Gap: Only verified tobacco-note candidate in Wave 6 (heart: Tobacco confirmed).
    //   Addresses Female/Unisex Tobacco gap (Female Tobacco = 0 in current 242-record MKC).
    //   Classification note: Tobacco is a note in the heart. Family is Oriental Spicy, not
    //   "Tobacco family." Do not override family classification based on note presence alone.
    title:               "Tobacco Honey Inspired",
    collection:          "Elite",
    subtitle:            "Inspired by Guerlain Tobacco Honey",
    mood:                "Smoky Honey Tobacco",
    profile:             "Oriental Spicy",
    season:              "Autumn",
    notes:               ["Honey", "Cloves", "Anise", "Tobacco", "Vanilla", "Tonka Bean", "Sesame", "Agarwood", "Sandalwood"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              BLUE_IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Honey", "Cloves", "Anise"],
      heart: ["Tobacco", "Vanilla", "Tonka Bean", "Sesame"],
      base:  ["Agarwood", "Sandalwood"],
    },
  },
  {
    // slug: oud-bouquet-inspired
    // Supplier: [LADIES/UNISEX] 'Oud Bouquet by Lancome' — NEW_SUPPLIER_CANDIDATE
    // Title omits Maison for slug clarity; subtitle preserves full canonical form with accent.
    // Canonical identity: Maison Lancôme Oud Bouquet EDP (2014). Maison Lancôme premium line.
    // Gender: Unisex ("women and men" per official lancome-usa.com). Elite: Maison Lancôme niche.
    // Evidence: Fragrantica (HIGH), lancome-usa.com (AUTHORITATIVE).
    // Source: CATALOGUE-WAVE6-P1 research (2026-09-07).
    // Gap: Oriental Oud Unisex coverage. Rose note bridges to Rose family cross-reference.
    title:               "Oud Bouquet Inspired",
    collection:          "Elite",
    subtitle:            "Inspired by Maison Lancôme Oud Bouquet",
    mood:                "Rich Oriental Rose",
    profile:             "Oriental Woody",
    season:              "Autumn",
    notes:               ["Saffron", "Oud", "Rose", "Vanilla", "Praline"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              BLUE_IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Saffron"],
      heart: ["Oud", "Rose"],
      base:  ["Vanilla", "Praline"],
    },
  },
  {
    // slug: matiere-noire-inspired
    // Supplier: [LADIES] 'Matiere Noire by Louis Vuitton' — NEW_SUPPLIER_CANDIDATE
    // Title strips accent: "Matiere Noire" → slug: matiere-noire-inspired.
    // Subtitle preserves: "Matière Noire" with accent.
    // Canonical identity: Louis Vuitton Matière Noire EDP (2016). Jacques Cavallier Belletrud.
    // Gender: Female. Elite: Louis Vuitton Les Parfums (luxury/niche positioning).
    // Evidence: Fragrantica (HIGH), louisvuitton.com (AUTHORITATIVE). P2 reverification confirms.
    // Source: CATALOGUE-WAVE6-P1 + P2 reverification (2026-09-07).
    // NEGATIVE EVIDENCE LOCK: NOT Leather. Notes confirmed Oriental Woody (Oud/Floral):
    //   Blackcurrant Syrup + Watery Notes / Rose + Cyclamen + Narcissus + Jasmine Sambac /
    //   Agarwood + Benzoin + Patchouli + Incense. No leather note present.
    //   P0 "Leather × Female" claim UNSUPPORTED. Reclassified: Oriental Woody Female.
    // GENDER OVERRIDE (CATALOGUE-FACTORY-GENDER-P1): explicit female — overrides Elite→unisex
    //   collection default. Evidence: louisvuitton.com (AUTHORITATIVE) + Fragrantica (HIGH).
    title:               "Matiere Noire Inspired",
    collection:          "Elite",
    gender:              "female",
    subtitle:            "Inspired by Louis Vuitton Matière Noire",
    mood:                "Dark Floral Oud",
    profile:             "Oriental Woody",
    season:              "Autumn",
    notes:               ["Blackcurrant Syrup", "Watery Notes", "Rose", "Cyclamen", "Narcissus", "Jasmine Sambac", "Agarwood", "Benzoin", "Patchouli", "Incense"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              BLUE_IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Blackcurrant Syrup", "Watery Notes"],
      heart: ["Rose", "Cyclamen", "Narcissus", "Jasmine Sambac"],
      base:  ["Agarwood", "Benzoin", "Patchouli", "Incense"],
    },
  },
];

// ── SKYE (4) ─────────────────────────────────────────────────────────────────

const skye: DisplayFragrance[] = [
  {
    // slug: kouros-silver-inspired
    // Supplier: [MEN] 'Kouros Silver by YSL' — NEW_SUPPLIER_CANDIDATE
    // Canonical identity: Yves Saint Laurent Kouros Silver EDT (2015).
    // P1 CORRECTION: P0 assumed 1994 launch — INCORRECT. 1994 is original Kouros.
    //   Confirmed 2015. Distinct from original Kouros (1977/1984).
    //   2015 contemporary launch supports Youthful × Male gap filling.
    // Evidence: Fragrantica (HIGH), YSL official. Source: CATALOGUE-WAVE6-P1 research.
    // Gap: Youthful × Male — Aromatic Fresh masculine, 2015 contemporary positioning.
    title:               "Kouros Silver Inspired",
    collection:          "Skye",
    subtitle:            "Inspired by Yves Saint Laurent Kouros Silver",
    mood:                "Fresh Aromatic Masculine",
    profile:             "Aromatic Fresh",
    season:              "Spring",
    notes:               ["Apple", "Sage", "Amber", "Woody Notes"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              BLUE_IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Apple"],
      heart: ["Sage"],
      base:  ["Amber", "Woody Notes"],
    },
  },
  {
    // slug: 212-heroes-inspired
    // Supplier: [MEN] '212 CH Heroes' — NEW_SUPPLIER_CANDIDATE
    // Canonical identity: Carolina Herrera 212 Heroes EDT (2021). Aromatic Fruity.
    //   Creators: Domitille Michalon Bertier, Juliette Karagueuzoglou, Carlos Benaïm.
    // P2-5 REVERIFICATION: P1 recorded MEDIUM confidence — now HIGH.
    //   Source: Fragrantica (HIGH). Confirmed 2021 launch. Notes independently reverified.
    // Evidence: Fragrantica (HIGH). Confirmed distinct from all native MKC records.
    // Source: CATALOGUE-WAVE6-P1 + P2-5 reverification (2026-09-07).
    // Gap: Youthful × Male — Aromatic Fruity, 2021 launch (highly contemporary).
    title:               "212 Heroes Inspired",
    collection:          "Skye",
    subtitle:            "Inspired by Carolina Herrera 212 Heroes",
    mood:                "Bold Aromatic Fruity",
    profile:             "Aromatic Fruity",
    season:              "Spring",
    notes:               ["Pear", "Cannabis", "Ginger", "Geranium", "Sage", "Musk", "Leather"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              BLUE_IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Pear", "Cannabis", "Ginger"],
      heart: ["Geranium", "Sage"],
      base:  ["Musk", "Leather"],
    },
  },
  {
    // slug: stronger-with-you-sandalwood-inspired
    // Supplier: [MEN/UNISEX] 'Stronger With You Sandalwood by Armani' — NEW_SUPPLIER_CANDIDATE
    // Canonical identity: Giorgio Armani Stronger With You Sandalwood EDP (2025). Unisex.
    // CONFIRMED DISTINCT from stronger-with-you-intensely-inspired (2019 — different formulation).
    // Gender: Unisex. Collection Skye: Stronger With You line is male-positioned; Unisex confirmed
    //   but male-anchored as consistent with all other SWW releases.
    // Evidence: Fragrantica (HIGH). Source: CATALOGUE-WAVE6-P1 research (2026-09-07).
    // NEGATIVE EVIDENCE LOCK: NOT Tobacco family. Family: Oriental Woody.
    //   Notes: Saffron / Lavender + Chestnut / Sandalwood + Vanilla + Cedarwood. No tobacco note.
    title:               "Stronger With You Sandalwood Inspired",
    collection:          "Skye",
    subtitle:            "Inspired by Giorgio Armani Stronger With You Sandalwood",
    mood:                "Warm Spiced Woody",
    profile:             "Oriental Woody",
    season:              "Autumn",
    notes:               ["Saffron", "Lavender", "Chestnut", "Sandalwood", "Vanilla", "Cedarwood"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              BLUE_IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Saffron"],
      heart: ["Lavender", "Chestnut"],
      base:  ["Sandalwood", "Vanilla", "Cedarwood"],
    },
  },
  {
    // slug: euphoria-men-inspired
    // Supplier: [MEN] 'Euphoria Men by CK' — NEW_SUPPLIER_CANDIDATE
    // Canonical identity: Calvin Klein Euphoria Men EDT (2006). Aromatic Woody.
    //   Creators: Carlos Benaïm, Loc Dong, Jean-Marc Chaillan.
    // Evidence: Fragrantica (HIGH), Perfume.com. Source: CATALOGUE-WAVE6-P1 research (2026-09-07).
    // NEGATIVE EVIDENCE LOCK: NOT Gourmand. Family: Aromatic Woody / Oriental Woody.
    //   Notes: Ginger + Pepper / Black Basil + Sage + Cedar / Amber + Suede + Brazilian Redwood + Patchouli.
    //   No sweet/food notes. P0 "Gourmand × Male" gap justification UNSUPPORTED.
    //   Reclassified: Aromatic Woody Male (dark warm masculine).
    title:               "Euphoria Men Inspired",
    collection:          "Skye",
    subtitle:            "Inspired by Calvin Klein Euphoria Men",
    mood:                "Warm Aromatic Dark",
    profile:             "Aromatic Woody",
    season:              "Autumn",
    notes:               ["Ginger", "Pepper", "Black Basil", "Sage", "Cedar", "Amber", "Suede", "Brazilian Redwood", "Patchouli"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              BLUE_IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Ginger", "Pepper"],
      heart: ["Black Basil", "Sage", "Cedar"],
      base:  ["Amber", "Suede", "Brazilian Redwood", "Patchouli"],
    },
  },
];

// ── ROSE (5) ─────────────────────────────────────────────────────────────────

const rose: DisplayFragrance[] = [
  {
    // slug: light-blue-capri-in-love-inspired
    // Supplier: [LADIES] 'Light Blue Capri In Love by D&G' — NEW_SUPPLIER_CANDIDATE
    // Canonical identity: Dolce & Gabbana Light Blue Capri In Love EDP (2025).
    //   Female. Perfumer: Emilie Coppermann. EDP format confirmed (not mist).
    // Evidence: Fragrantica (HIGH), D&G official. P2 reverification confirms 3-note pyramid.
    // Source: CATALOGUE-WAVE6-P1 + P2 reverification (2026-09-07).
    // NOTES: Intentionally minimalist composition — 3 notes confirmed authoritative.
    //   Top: Jasmine Tea. Heart: Apple. Base: Longoza.
    //   notesEvidenceLocked: true — do not enrich or redistribute.
    // TRAVEL GOVERNANCE (P2-7): Travel occasion eligible via DiscoveryProducer ONLY if
    //   supported by (a) notes character — Jasmine Tea, Apple, Longoza fresh floral profile —
    //   AND (b) D&G Light Blue line documented Mediterranean Summer positioning (2001–present).
    //   NOT from "Capri" or "In Love" appearing in product name.
    title:               "Light Blue Capri In Love Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Dolce & Gabbana Light Blue Capri In Love",
    mood:                "Fresh Floral Summer",
    profile:             "Floral Fruity",
    season:              "Summer",
    notes:               ["Jasmine Tea", "Apple", "Longoza"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              PINK_IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Jasmine Tea"],
      heart: ["Apple"],
      base:  ["Longoza"],
    },
  },
  {
    // slug: jasmin-noir-inspired
    // Supplier: [LADIES] 'Jasmin Noir by Bvlgari' — NEW_SUPPLIER_CANDIDATE
    // Canonical identity: Bulgari Jasmin Noir EDP (2008). Female. Oriental Floral.
    // Evidence: Fragrantica (HIGH), Bvlgari official. Source: CATALOGUE-WAVE6-P1 research.
    // NEGATIVE EVIDENCE LOCK: NOT Leather / NOT leather-adjacent.
    //   Full notes pyramid: Gardenia + Green Notes / Jasmine Sambac + Almond /
    //   Tonka Bean + Licorice + Precious Woods + Musk + Amber + Patchouli.
    //   No leather note present. P0 "Leather × Female" claim UNSUPPORTED.
    //   Reclassified: Oriental Floral Female.
    title:               "Jasmin Noir Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Bulgari Jasmin Noir",
    mood:                "Dark Floral Oriental",
    profile:             "Oriental Floral",
    season:              "Autumn",
    notes:               ["Gardenia", "Green Notes", "Jasmine Sambac", "Almond", "Tonka Bean", "Licorice", "Precious Woods", "Musk", "Amber", "Patchouli"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              PINK_IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Gardenia", "Green Notes"],
      heart: ["Jasmine Sambac", "Almond"],
      base:  ["Tonka Bean", "Licorice", "Precious Woods", "Musk", "Amber", "Patchouli"],
    },
  },
  {
    // slug: cloud-inspired
    // Supplier: [LADIES] 'Cloud by Ariana Grande' — NEW_SUPPLIER_CANDIDATE
    // Canonical identity: Ariana Grande Cloud EDP (2018). Female. Floral Fruity Gourmand.
    //   Perfumer: Clement Gavarry.
    // Evidence: Fragrantica (HIGH), arianagrandefragrances.com (AUTHORITATIVE).
    // Source: CATALOGUE-WAVE6-P1 research (2026-09-07).
    // NEGATIVE EVIDENCE LOCK: NOT Powdery. Family confirmed Floral Fruity Gourmand.
    //   Notes: Bergamot + Pear + Lavender / Coconut + Whipped Cream + Praline + Vanilla Orchid /
    //   Woody Notes + Musk. Lavender adds softness but dominant character is sweet/creamy
    //   gourmand — NOT iris/violet/talc Powdery in the traditional sense.
    //   P0 "Powdery × Female" justification UNSUPPORTED. Reclassified: Gourmand Floral Female.
    title:               "Cloud Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Ariana Grande Cloud",
    mood:                "Sweet Dreamy Feminine",
    profile:             "Gourmand Floral",
    season:              "Spring",
    notes:               ["Bergamot", "Pear", "Lavender", "Coconut", "Whipped Cream", "Praline", "Vanilla Orchid", "Woody Notes", "Musk"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              PINK_IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Bergamot", "Pear", "Lavender"],
      heart: ["Coconut", "Whipped Cream", "Praline", "Vanilla Orchid"],
      base:  ["Woody Notes", "Musk"],
    },
  },
  {
    // slug: bombshell-escape-inspired
    // Supplier: [LADIES] "Bombshell Escape by Victoria's Secret" — NEW_SUPPLIER_CANDIDATE
    // Canonical identity: Victoria's Secret Bombshell Escape EDP (2024). Female. Tropical Floral Fruity.
    // Evidence: Victoria's Secret official, Fragrantica. Source: CATALOGUE-WAVE6-P1 research.
    // TRAVEL GOVERNANCE (P2-7): Tropical/Beach Travel eligible via DiscoveryProducer ONLY from
    //   notes character — Guava (tropical fruit), Palm Leaf, Palm Tree (beach/tropical notes)
    //   confirm beach/holiday occasion independently of product name.
    //   NOT from "Escape" appearing in product name.
    title:               "Bombshell Escape Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Victoria's Secret Bombshell Escape",
    mood:                "Tropical Feminine Fresh",
    profile:             "Floral Fruity",
    season:              "Summer",
    notes:               ["Guava", "Peony", "Palm Leaf", "Palm Tree"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              PINK_IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Guava"],
      heart: ["Peony"],
      base:  ["Palm Leaf", "Palm Tree"],
    },
  },
  {
    // slug: opium-inspired
    // Supplier: [LADIES] 'Opium by YSL' — NEW_SUPPLIER_CANDIDATE
    // Canonical identity: Yves Saint Laurent Opium EDP (1977 original). Female. Oriental Spicy.
    // CONFIRMED DISTINCT from black-opium-inspired (2014, in MKC) and
    //   black-opium-over-red-inspired (in MKC). Original 1977 Opium is a separate product line.
    // Evidence: Wikipedia, Fragrantica (HIGH). Source: CATALOGUE-WAVE6-P1 research (2026-09-07).
    // NEGATIVE EVIDENCE LOCK: NOT Tobacco family. Family: Oriental Spicy (Amber Spicy).
    //   Full notes: Mandarin Orange + Plum + Clove + Coriander + Pepper + Bay Leaf /
    //   Jasmine + Rose + Lily of the Valley + Carnation + Cinnamon + Peach + Orris Root /
    //   Sandalwood + Cedarwood + Myrrh. Spices confirmed; NO tobacco note.
    //   P0 "Female Tobacco gap" justification UNSUPPORTED.
    //   Reclassified: Heritage Oriental Spicy Female.
    title:               "Opium Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Yves Saint Laurent Opium",
    mood:                "Bold Spiced Oriental",
    profile:             "Oriental Spicy",
    season:              "Autumn",
    notes:               ["Mandarin Orange", "Plum", "Clove", "Coriander", "Pepper", "Bay Leaf", "Jasmine", "Rose", "Lily of the Valley", "Carnation", "Cinnamon", "Peach", "Orris Root", "Sandalwood", "Cedarwood", "Myrrh"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              PINK_IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Mandarin Orange", "Plum", "Clove", "Coriander", "Pepper", "Bay Leaf"],
      heart: ["Jasmine", "Rose", "Lily of the Valley", "Carnation", "Cinnamon", "Peach", "Orris Root"],
      base:  ["Sandalwood", "Cedarwood", "Myrrh"],
    },
  },
];

// ── Export ────────────────────────────────────────────────────────────────────

export const wave6Catalogue: DisplayFragrance[] = [...elite, ...skye, ...rose];
