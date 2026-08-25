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
 * P18B GOVERNANCE — IDENTITY-ONLY INTAKE
 *
 * All 20 records are at P18B identity-lock stage.
 * mood, profile, season, notes, and notesStructured fields are intentionally
 * empty. No notes evidence has been established at P18B.
 * These fields MUST NOT be filled without independently sourced supplier
 * or authoritative brand evidence in a P18C research episode.
 *
 * notesEvidenceLocked is false on all records. Factory generation (P18C)
 * will establish governed note sets before these records may be promoted.
 *
 * Supplier source: data/supplier/normalized/fragrance-list-2026-08-normalized.json
 * All 20 identities confirmed as NEW_SUPPLIER_CANDIDATE with no existingMKCSlug.
 * All 20 slugs confirmed clear across native, draft, review, and promotion registries.
 *
 * OUD CADENZA SPECIAL GATE (Phase 7):
 * Oud Cadenza by Maison Crivelli — identity confirmed, UNISEX → Elite.
 * "Oud" appears in the product name but no note-level Oud evidence exists
 * in the supplier record. Oud-family classification is deferred to P18C.
 * If P18C research cannot confirm Oud-family from authoritative sources,
 * this record must be reclassified before promotion.
 *
 * P18A DISCREPANCY RESOLVED:
 * Authoritative native counts: Skye 87, Rose 83, Elite 32 = 202 total.
 * Rose = 83 (not 82 as stated in P18A). The discrepancy arose because
 * baccarat-rouge-540-inspired has collection=Rose but gender=unisex.
 * P18A's gender-based count (female=82) was used instead of the
 * collection-based count (Rose=83). Repository is authoritative.
 *
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
    // Gap addressed: Aquatic/Fresh — critical gap (Elite collection)
    title:               "Creed Delphinus Inspired",
    collection:          "Elite",
    subtitle:            "Inspired by Creed Delphinus EDP",
    mood:                "",
    profile:             "",
    season:              "",
    notes:               [],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: false,
    notesStructured:     { top: [], heart: [], base: [] },
  },
  {
    // slug: aqua-allegoria-rosa-verde-inspired
    // Supplier: [UNISEX] 'Aqua Allegoria Rosa Verde by Guerlain' — NEW_SUPPLIER_CANDIDATE
    // Gap addressed: Citrus/Fresh — critical gap (Elite collection)
    title:               "Aqua Allegoria Rosa Verde Inspired",
    collection:          "Elite",
    subtitle:            "Inspired by Guerlain Aqua Allegoria Rosa Verde",
    mood:                "",
    profile:             "",
    season:              "",
    notes:               [],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: false,
    notesStructured:     { top: [], heart: [], base: [] },
  },
  {
    // slug: vanilla-powder-inspired
    // Supplier: [UNISEX] 'Vanilla Powder by Matiere Premiere' — NEW_SUPPLIER_CANDIDATE
    // Gap addressed: Powdery/Vanilla — critical gap (Elite collection)
    title:               "Vanilla Powder Inspired",
    collection:          "Elite",
    subtitle:            "Inspired by Matière Première Vanilla Powder",
    mood:                "",
    profile:             "",
    season:              "",
    notes:               [],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: false,
    notesStructured:     { top: [], heart: [], base: [] },
  },
  {
    // slug: beach-blossom-inspired
    // Supplier: [UNISEX] 'Jo Malone Beach Blossom' — NEW_SUPPLIER_CANDIDATE
    // Gap addressed: Fresh/Aquatic, Vacation occasion (Elite collection)
    title:               "Beach Blossom Inspired",
    collection:          "Elite",
    subtitle:            "Inspired by Jo Malone London Beach Blossom",
    mood:                "",
    profile:             "",
    season:              "",
    notes:               [],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: false,
    notesStructured:     { top: [], heart: [], base: [] },
  },
  {
    // slug: ck-one-inspired
    // Supplier: [UNISEX] 'CK One' — NEW_SUPPLIER_CANDIDATE
    // Gap addressed: Fresh/Clean unisex — iconic fresh (Elite collection)
    title:               "CK One Inspired",
    collection:          "Elite",
    subtitle:            "Inspired by Calvin Klein CK One",
    mood:                "",
    profile:             "",
    season:              "",
    notes:               [],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: false,
    notesStructured:     { top: [], heart: [], base: [] },
  },
  {
    // slug: oud-cadenza-inspired
    // Supplier: [UNISEX] 'Oud Cadenza by Maison Crivelli' — NEW_SUPPLIER_CANDIDATE
    // Gap addressed: Oud — critical gap (Elite collection)
    // SPECIAL GATE: "Oud" appears in product name only. No note-level Oud
    // evidence in supplier record. Oud-family classification deferred to P18C.
    title:               "Oud Cadenza Inspired",
    collection:          "Elite",
    subtitle:            "Inspired by Maison Crivelli Oud Cadenza",
    mood:                "",
    profile:             "",
    season:              "",
    notes:               [],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: false,
    notesStructured:     { top: [], heart: [], base: [] },
  },
];

// ── SKYE (7) ─────────────────────────────────────────────────────────────────

const skye: DisplayFragrance[] = [
  {
    // slug: cool-water-inspired
    // Supplier: [MEN] 'Cool Water' — NEW_SUPPLIER_CANDIDATE
    // Gap addressed: Aquatic/Fresh — critical gap (Skye collection)
    title:               "Cool Water Inspired",
    collection:          "Skye",
    subtitle:            "Inspired by Davidoff Cool Water",
    mood:                "",
    profile:             "",
    season:              "",
    notes:               [],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: false,
    notesStructured:     { top: [], heart: [], base: [] },
  },
  {
    // slug: dylan-blue-inspired
    // Supplier: [MEN] 'Versace Dylan Blue' — NEW_SUPPLIER_CANDIDATE
    // Gap addressed: Aquatic/Citrus — critical gap (Skye collection)
    // Note: distinct from Dylan Blue Pour Femme (R4, rose collection).
    title:               "Dylan Blue Inspired",
    collection:          "Skye",
    subtitle:            "Inspired by Versace Dylan Blue",
    mood:                "",
    profile:             "",
    season:              "",
    notes:               [],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: false,
    notesStructured:     { top: [], heart: [], base: [] },
  },
  {
    // slug: polo-blue-inspired
    // Supplier: [MEN] 'Polo Blue' — NEW_SUPPLIER_CANDIDATE
    // Gap addressed: Fresh/Aquatic/Sport (Skye collection)
    title:               "Polo Blue Inspired",
    collection:          "Skye",
    subtitle:            "Inspired by Ralph Lauren Polo Blue",
    mood:                "",
    profile:             "",
    season:              "",
    notes:               [],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: false,
    notesStructured:     { top: [], heart: [], base: [] },
  },
  {
    // slug: prada-paradigme-inspired
    // Supplier: [MEN] 'Prada Paradigme' — NEW_SUPPLIER_CANDIDATE
    // Gap addressed: Aromatic/Fresh premium (Skye collection)
    // P18C NOTE: verify canonical Prada fragrance identity from authoritative source.
    title:               "Prada Paradigme Inspired",
    collection:          "Skye",
    subtitle:            "Inspired by Prada Paradigme",
    mood:                "",
    profile:             "",
    season:              "",
    notes:               [],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: false,
    notesStructured:     { top: [], heart: [], base: [] },
  },
  {
    // slug: legend-blue-inspired
    // Supplier: [MEN] 'Legend Blue by Mont Blanc' — NEW_SUPPLIER_CANDIDATE
    // Gap addressed: Fresh/Aquatic (Skye collection)
    // Distinct from montblanc-legend-inspired (Aromatic/Woody, already native).
    title:               "Legend Blue Inspired",
    collection:          "Skye",
    subtitle:            "Inspired by Mont Blanc Legend Blue",
    mood:                "",
    profile:             "",
    season:              "",
    notes:               [],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: false,
    notesStructured:     { top: [], heart: [], base: [] },
  },
  {
    // slug: blue-noir-inspired
    // Supplier: [MEN] 'Blue Noir by Narciso Rodriquez' — NEW_SUPPLIER_CANDIDATE
    // Note: supplier spells brand 'Rodriquez'; canonical is 'Narciso Rodriguez'.
    // Subtitle uses canonical brand spelling.
    // Gap addressed: Fresh/Aromatic masculine (Skye collection)
    title:               "Blue Noir Inspired",
    collection:          "Skye",
    subtitle:            "Inspired by Narciso Rodriguez Blue Noir",
    mood:                "",
    profile:             "",
    season:              "",
    notes:               [],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: false,
    notesStructured:     { top: [], heart: [], base: [] },
  },
  {
    // slug: bvlgari-aqva-marine-inspired
    // Supplier: [MEN] 'Bulgari Aqva Marine' — NEW_SUPPLIER_CANDIDATE
    // Note: supplier spells brand 'Bulgari'; canonical is 'Bvlgari'.
    // Subtitle uses canonical brand spelling.
    // Distinct from bvlgari-aqua-inspired (original Aqva, already native)
    // and aqva-amara-inspired (Aqva Amara flanker, already native).
    // Gap addressed: Aquatic/Marine luxury (Skye collection)
    title:               "Bvlgari Aqva Marine Inspired",
    collection:          "Skye",
    subtitle:            "Inspired by Bvlgari AQVA Marine Pour Homme",
    mood:                "",
    profile:             "",
    season:              "",
    notes:               [],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: false,
    notesStructured:     { top: [], heart: [], base: [] },
  },
];

// ── ROSE (7) ─────────────────────────────────────────────────────────────────

const rose: DisplayFragrance[] = [
  {
    // slug: dkny-be-delicious-green-inspired
    // Supplier: [LADIES] 'DKNY be Delicious (Green)' — NEW_SUPPLIER_CANDIDATE
    // Note: parentheses in supplier name omitted from title per slug derivation.
    // LADIES category confirmed; MEN version is a separate supplier entry.
    // Gap addressed: Citrus/Fresh/Fruity — critical gap (Rose collection)
    title:               "DKNY Be Delicious Green Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by DKNY Be Delicious",
    mood:                "",
    profile:             "",
    season:              "",
    notes:               [],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: false,
    notesStructured:     { top: [], heart: [], base: [] },
  },
  {
    // slug: clinique-happy-inspired
    // Supplier: [LADIES] 'Clinique Happy' — NEW_SUPPLIER_CANDIDATE
    // LADIES category confirmed; MEN version is a separate supplier entry.
    // Gap addressed: Citrus/Fresh — critical gap (Rose collection)
    title:               "Clinique Happy Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Clinique Happy",
    mood:                "",
    profile:             "",
    season:              "",
    notes:               [],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: false,
    notesStructured:     { top: [], heart: [], base: [] },
  },
  {
    // slug: narciso-pure-musc-inspired
    // Supplier: [LADIES] 'Narciso Pure Musc' — NEW_SUPPLIER_CANDIDATE
    // Distinct from narciso-rodriguez-for-her-inspired and narciso-rouge-inspired
    // (both already native). Pure Musc is a distinct concentration/variant.
    // Gap addressed: Powdery/Musc — critical gap (Rose collection)
    title:               "Narciso Pure Musc Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Narciso Rodriguez Pure Musc",
    mood:                "",
    profile:             "",
    season:              "",
    notes:               [],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: false,
    notesStructured:     { top: [], heart: [], base: [] },
  },
  {
    // slug: dylan-blue-pour-femme-inspired
    // Supplier: [LADIES] 'Versace Dylan Blue' — NEW_SUPPLIER_CANDIDATE
    // LADIES category confirmed. This is the feminine version (Dylan Blue Pour Femme).
    // Distinct from dylan-blue-inspired (S2, Skye, MEN supplier entry).
    // Gap addressed: Aquatic/Fresh — critical gap (Rose collection)
    title:               "Dylan Blue Pour Femme Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Versace Dylan Blue Pour Femme",
    mood:                "",
    profile:             "",
    season:              "",
    notes:               [],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: false,
    notesStructured:     { top: [], heart: [], base: [] },
  },
  {
    // slug: cherry-in-the-air-inspired
    // Supplier: [LADIES] 'Escada Cherry In The Air' — NEW_SUPPLIER_CANDIDATE
    // Gap addressed: Fruity/Fresh, Summer/Vacation occasion (Rose collection)
    title:               "Cherry In The Air Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Escada Cherry in the Air",
    mood:                "",
    profile:             "",
    season:              "",
    notes:               [],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: false,
    notesStructured:     { top: [], heart: [], base: [] },
  },
  {
    // slug: chloe-original-inspired
    // Supplier: [LADIES] 'Chloe Original' — NEW_SUPPLIER_CANDIDATE
    // Note: supplier spells brand 'Chloe'; canonical is 'Chloé'.
    // Title strips diacritic per slug-derivation convention.
    // Subtitle preserves diacritic per Wave 3 precedent.
    // Gap addressed: Classic luxury floral (Rose collection)
    title:               "Chloe Original Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Chloé Original",
    mood:                "",
    profile:             "",
    season:              "",
    notes:               [],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: false,
    notesStructured:     { top: [], heart: [], base: [] },
  },
  {
    // slug: gucci-flora-inspired
    // Supplier: [LADIES] 'Gucci Flora' — NEW_SUPPLIER_CANDIDATE
    // Gap addressed: Fresh Floral premium (Rose collection)
    title:               "Gucci Flora Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Gucci Flora",
    mood:                "",
    profile:             "",
    season:              "",
    notes:               [],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: false,
    notesStructured:     { top: [], heart: [], base: [] },
  },
];

// ── Export ────────────────────────────────────────────────────────────────────

export const wave4Catalogue: DisplayFragrance[] = [...elite, ...skye, ...rose];
