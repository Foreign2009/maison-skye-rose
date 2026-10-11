/**
 * Knowledge Factory — Wave 9 Staging Catalogue
 *
 * CATALOGUE-WAVE9-B1 (CORRECTED): 6 Wave 9 identities registered for
 * controlled factory intake. Factory-only. NOT customer-facing.
 *
 * This file MUST NOT be imported by any module under app/.
 * Managed exclusively by: scripts/factory/intake.ts (decenary catalogue fallback).
 *
 * Collections:  Batch 1 — ROSE (6) = 6 total (includes beautiful-by-estee-lauder, jimmy-choo and
 *               romance-by-ralph-lauren, already promoted).
 *               Batch 2 (2026-10-11, review drafts, NOT promoted) — ROSE (4) + SKYE (1) = 5 total:
 *               perfect-by-marc-jacobs, euphoria-by-calvin-klein, wonderlust-by-michael-kors, prada-candy
 *               (evidence hold), only-the-brave. See the BATCH 2 section below.
 *               PROMOTED 2026-10-11 (uncommitted): perfect-by-marc-jacobs, euphoria-by-calvin-klein,
 *               only-the-brave. NOT promoted: wonderlust-by-michael-kors (review), prada-candy (hold).
 *
 * EVIDENCE STATUS — per record (not production-ready)
 *
 * Pyramids were first drafted from model knowledge, then corrected from web-search
 * results attributed to Fragrantica. No Fragrantica page was inspected (HTTP 403).
 * Inspected secondary pages are logged in
 * data/supplier/decisions/wave-9-source-evidence.json.
 *
 * Tier-2 sources per repository policy: Fragrantica, Basenotes, major authorised retailers.
 * thescentbase.com / scentverdict.com are NOT treated as equivalent without corroboration.
 *
 * PYRAMID_SECONDARY_SUPPORTED (full pyramid matches an inspected named/authorised source):
 *   romance-by-ralph-lauren (Ulta + brand copy), beautiful-by-estee-lauder (Nordstrom),
 *   jimmy-choo (John Lewis; "Green Notes" removed 2026-10-11 as third-party-only).
 *   (Withdrawn duplicate dolce-and-gabbana-the-one also had supported 2006 EDP evidence.)
 * AI_INFERENCE_UNSOURCED (no full corroboration from a named/authorised source):
 *   gucci-rush, tommy-girl, poison-by-dior.
 * Evidence tier qualifies the reference-fragrance pyramid only; promotion eligibility is
 * recorded separately in the ledger.
 *
 * Supplier identities for The One, Jimmy Choo, Romance, Beautiful and Poison were confirmed
 * by founder-reported confirmation on 2026-10-11 (founder wording: original version, "EDP").
 * No direct supplier response was inspected. No supplier identity holds remain.
 * The wording does not say whether "EDP" is the reference fragrance's edition or the concentration
 * supplied to Maison; the two are recorded separately in the ledger (concentrationProvenance).
 * Poison: inspected references are EDT (or a vintage "Esprit de Parfum", not EDP) —
 *   CONCENTRATION/REFERENCE hold; founder clarification requested.
 * PROMOTED to native MKC 2026-10-11: beautiful-by-estee-lauder (promotionId o60aTXEc01Dy;
 *   commit 2803160, pushed — an ancestor of origin/main; deployed per founder report).
 *   Its entry below remains for factory intake history.
 * PROMOTED to native MKC 2026-10-11 (uncommitted), after founder editorial/promotion approval of the
 *   reviewed r12 profiles (approval is not supplier identity or concentration evidence):
 *   jimmy-choo (Fruity Floral Sweet; promotionId fBkPTNpdbCYp) and romance-by-ralph-lauren
 *   (Floral Fresh; promotionId 13zI9yHDv62X). Their entries below remain for factory intake history.
 * WITHDRAWN DUPLICATE (not promoted): dolce-and-gabbana-the-one — see REMOVED note below.
 * Held: gucci-rush, tommy-girl (evidence); poison-by-dior (evidence + concentration reference).
 * Eligible for promotion: none.
 *
 * IDENTITY REMOVALS (corrected from initial batch):
 *
 *   REMOVED — "Jean Paul Gaultier" (unqualified supplier entry):
 *     Identity unresolved. Supplier text does not self-identify the specific
 *     fragrance or variant (Classique, Le Male, La Belle, etc.). Inference
 *     to Classique (1993) is not evidence. Recorded in catalogue-expansion-ledger.json
 *     as UNRESOLVED_IDENTITY. Draft jean-paul-gaultier-classique-inspired.ts deleted.
 *
 *   REMOVED — "Issey Miyake" (unqualified supplier entry):
 *     Identity unresolved. Supplier text does not self-identify the specific
 *     fragrance or variant (L'Eau d'Issey Women, Pour Homme, etc.). Inference
 *     to L'Eau d'Issey Women (1992) is not evidence. Recorded in
 *     catalogue-expansion-ledger.json as UNRESOLVED_IDENTITY.
 *     Draft issey-miyake-inspired.ts deleted.
 *
 * IDENTITY NOTE — "Gucci Guilty" (supplier entry, not in this batch):
 *   Resolved as DUPLICATE_ALIAS of gucci-guilty-pour-femme-inspired (already
 *   in native MKC). Gucci Rush (distinct 1999 fragrance) included instead.
 *
 * REMOVED — "Dolce & Gabbana The One" (LADIES-108-Dolce & Gabbana The One):
 *   DUPLICATE_ALIAS of the-one-pour-femme-inspired, already active in native MKC
 *   (Wave 5, commit e8082fd, same supplier row). Removed from this staging catalogue on
 *   2026-10-11. Draft dolce-and-gabbana-the-one-inspired.ts, its research, source evidence and
 *   founder-reported identity confirmation are preserved for reference only — do not promote.
 *   No further provisional-count reduction (LADIES-108 was already subtracted).
 *
 * REMOVED — "Versace Yellow Diamonds" (LADIES-277-Versace Yellow Diamonds):
 *   DUPLICATE_ALIAS of yellow-diamond-inspired, already active in native MKC
 *   (promoted 2026-08-20, Wave 2, same supplier row). Removed from this staging
 *   catalogue on 2026-10-11. Draft versace-yellow-diamonds-inspired.ts and its source
 *   evidence are preserved for reference only — do not promote.
 *
 * IDENTITY NOTE — "Beautiful" (supplier entry):
 *   Supplier text is unqualified. Resolution to Estée Lauder Beautiful (1985)
 *   is a HIGH-CONFIDENCE inference (no other mainstream fragrance carries this
 *   exact name) but is NOT AUTHORITATIVE. Flagged in ledger.
 *   A brand or reference page establishes facts about Estée Lauder Beautiful but cannot
 *   confirm what the supplier's unqualified "Beautiful" entry means. Resolved by
 *   founder-reported confirmation on 2026-10-11 (original Estée Lauder Beautiful, EDP).
 *
 * CANDIDATE SOURCE: Batch 1 of reconcile.mjs NOT-IN-MKC list (2026-10-10).
 * The original "all 8 slugs confirmed clear" check was incorrect: LADIES-277 was already
 * active as yellow-diamond-inspired. A 2026-10-11 brand/name re-check of the remaining 7
 * also missed LADIES-108: a later pre-promotion recheck by name, alias and supplier source key
 * found it already active as the-one-pour-femme-inspired (Wave 5). Slug-only and brand-name
 * searches are not sufficient; check supplier source keys and wave identity source files.
 *
 * Pre-Wave-9 baseline (measured): 267 native MKC records (Elite 49, Skye 109, Rose 109).
 * After promoting beautiful-by-estee-lauder: 268 (Elite 49, Skye 109, Rose 110).
 * Provisional missing count: 349, an upper bound — not a unique-fragrance count.
 *
 * Canonical retail pricing: 5ml=60, 10ml=100, 30ml=250 (ZAR).
 * Images: placeholders. Populated at MKC promotion time.
 */

import type { DisplayFragrance } from "../../../app/lib/knowledgeAdapter";

const PRICES = { "5ml": 60, "10ml": 100, "30ml": 250 } as const;

const PINK_IMAGES = { "5ml": "/images/pink-5ml.png", "10ml": "/images/pink-10ml.png", "30ml": "/images/glass-pink-30ml.png" } as const;
const BLUE_IMAGES = { "5ml": "/images/blue-5ml.png", "10ml": "/images/blue-10ml.png", "30ml": "/images/glass-blue-30ml.png" } as const;

// ── ROSE (6) ─────────────────────────────────────────────────────────────────

const rose: DisplayFragrance[] = [
  {
    // slug: gucci-rush-inspired
    // Supplier: 'Gucci Rush' (sourceKey: LADIES-132-Gucci Rush)
    // Canonical identity: Gucci Rush EDT (1999). Female.
    // Identity confidence: HIGH — supplier text is specific; Gucci Rush is a
    //   distinct fragrance from other Gucci lines.
    // NOTE: Supplier 'Gucci Guilty' entry resolved as DUPLICATE_ALIAS of
    //   gucci-guilty-pour-femme-inspired (already native). Gucci Rush is a
    //   distinct 1999 fragrance — no identity conflict.
    // Evidence: AI_INFERENCE_UNSOURCED — thescentbase.com matches but is uncorroborated
    //   (Basenotes 403; gucci.com not accessible; Amazon listing unreadable).
    title:               "Gucci Rush Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Gucci Rush",
    mood:                "Bold Vivid Floral",
    profile:             "Floral Woody",
    season:              "All Season",
    // Fragrantica not inspected (403). See wave-9-source-evidence.json.
    notes:               ["Peach", "Californian Gardenia", "African Freesia Petals", "Coriander", "Damask Rose", "Jasmine", "Patchouli", "Natural Vanilla", "Vetiver"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              PINK_IMAGES,
    gender:              "female",
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Peach", "Californian Gardenia", "African Freesia Petals"],
      heart: ["Coriander", "Damask Rose", "Jasmine"],
      base:  ["Patchouli", "Natural Vanilla", "Vetiver"],
    },
  },
  {
    // slug: jimmy-choo-inspired
    // Supplier: 'Jimmy Choo' (sourceKey: LADIES-156-Jimmy Choo); distinct entries also exist for
    //   'Jimmy Choo Fever' and 'Jimmy Choo Flash'. Their presence does not identify the unqualified entry.
    // Reference edition used: Jimmy Choo EDP (2011). Female.
    // IDENTITY CONFIRMED (founder-reported 2026-10-11; no direct supplier response inspected):
    //   founder wording "original women's Jimmy Choo, EDP".
    // Evidence: PYRAMID_SECONDARY_SUPPORTED — full pyramid matches johnlewis.com (authorised); "Tiger
    //   Orchid" naming per Nordstrom, Ulta, Debenhams. "Green Notes" removed 2026-10-11 (third-party only).
    //   Wording variants: Nordstrom/Debenhams "sweet Italian orange"; Nordstrom "caramel".
    // PROMOTED 2026-10-11 (fBkPTNpdbCYp) after founder editorial/promotion approval of this profile.
    // EDITORIAL PROFILE (proposed and approved 2026-10-11): "Fruity Floral Sweet" — Nordstrom style
    //   "Fruity, floral" + Ulta family "Sweet". Also on record: "fruity chypre" (Nordstrom story, Ulta scent
    //   type, John Lewis). Previous editorial mapping "Floral Gourmand". Not a supplier confirmation.
    title:               "Jimmy Choo Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Jimmy Choo",
    mood:                "Feminine Playful Modern",
    profile:             "Fruity Floral Sweet",
    season:              "Spring",
    // Fragrantica not inspected (403). Single heart note matches John Lewis, Nordstrom and Ulta.
    notes:               ["Pear", "Mandarin Orange", "Tiger Orchid", "Toffee", "Patchouli"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              PINK_IMAGES,
    gender:              "female",
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Pear", "Mandarin Orange"],
      heart: ["Tiger Orchid"],
      base:  ["Toffee", "Patchouli"],
    },
  },
  {
    // slug: romance-by-ralph-lauren-inspired
    // Supplier: 'Romance' (sourceKey: LADIES-251-Romance) — fragrance name only, no brand qualifier
    // Reference fragrance: Ralph Lauren Romance EDP (1998). Female.
    // IDENTITY CONFIRMED (founder-reported 2026-10-11; no direct supplier response inspected):
    //   original Ralph Lauren Romance, EDP.
    // Evidence: PYRAMID_SECONDARY_SUPPORTED — Ulta listing (authorised retailer), corroborated by brand copy.
    title:               "Romance by Ralph Lauren Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Ralph Lauren Romance",
    mood:                "Romantic Classic Lush",
    // Ulta family "Fresh Floral" supports this profile; brand copy (non-authorised retailer) says
    //   "Floral, Woody" — conflict recorded in wave-9-research.json profileRationale.
    // PROMOTED 2026-10-11 (13zI9yHDv62X) after founder editorial/promotion approval of this profile.
    // EDITORIAL PROFILE (proposed and approved 2026-10-11): retain "Floral Fresh" (Ulta). Not a supplier confirmation.
    profile:             "Floral Fresh",
    season:              "Spring",
    // Pyramid per ulta.com (inspected); replaces uninspected Fragrantica-attributed pyramid.
    notes:               ["Mandarin", "Pink Pepper", "Violet Leaves", "Rose", "Jasmine", "Marigold", "Geranium", "Patchouli", "Oakmoss", "Musk"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              PINK_IMAGES,
    gender:              "female",
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Mandarin", "Pink Pepper", "Violet Leaves"],
      heart: ["Rose", "Jasmine", "Marigold", "Geranium"],
      base:  ["Patchouli", "Oakmoss", "Musk"],
    },
  },
  {
    // slug: tommy-girl-inspired
    // Supplier: 'Tommy Girl' (sourceKey: LADIES-265-Tommy Girl)
    // Canonical identity: Tommy Hilfiger Tommy Girl EDT (1996). Female.
    // Identity confidence: HIGH — supplier text is specific; no other mainstream
    //   fragrance carries this exact name.
    // Evidence: AI_INFERENCE_UNSOURCED — amcal.com.au matches but is not a named/verified authorised
    //   retailer; current brand listings appear to describe a reformulated EDT (pages timed out).
    title:               "Tommy Girl Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Tommy Hilfiger Tommy Girl",
    mood:                "Fresh Clean Youthful",
    profile:             "Citrus Floral",
    season:              "Spring",
    // Fragrantica not inspected (403). See wave-9-source-evidence.json.
    notes:               ["Apple Tree Blossom", "Mandarin Orange", "Camellia", "Blackcurrant", "Lemon", "Honeysuckle", "Grapefruit", "Rose", "Lily", "Mint", "Violet", "Magnolia", "Jasmine", "Cedar", "Sandalwood", "Leather"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              PINK_IMAGES,
    gender:              "female",
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Apple Tree Blossom", "Mandarin Orange", "Camellia", "Blackcurrant"],
      heart: ["Lemon", "Honeysuckle", "Grapefruit", "Rose", "Lily", "Mint", "Violet"],
      base:  ["Magnolia", "Jasmine", "Cedar", "Sandalwood", "Leather"],
    },
  },
  {
    // slug: beautiful-by-estee-lauder-inspired
    // Supplier: 'Beautiful' (sourceKey: LADIES-34-Beautiful) — unqualified, no brand attribution
    //   in supplier text.
    // Reference fragrance: Estée Lauder Beautiful EDP (1985). Female.
    // IDENTITY CONFIRMED (founder-reported 2026-10-11; no direct supplier response inspected):
    //   original Estée Lauder Beautiful, EDP — matches the inspected Nordstrom EDP listing.
    // Evidence: PYRAMID_SECONDARY_SUPPORTED — nordstrom.com EDP listing (named tier-2 retailer).
    title:               "Beautiful by Estee Lauder Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Estée Lauder Beautiful",
    mood:                "Classic Timeless Feminine",
    profile:             "Floral",
    season:              "Spring",
    // Pyramid per nordstrom.com ("muguet" = Lily of the Valley); replaces uninspected Fragrantica-attributed pyramid.
    notes:               ["Rose", "Mandarin", "Lily", "Tuberose", "Marigold", "Orange Flower", "Lily of the Valley", "Jasmine", "Ylang-Ylang", "Sandalwood", "Vetiver", "Amber"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              PINK_IMAGES,
    gender:              "female",
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Rose", "Mandarin", "Lily", "Tuberose", "Marigold"],
      heart: ["Orange Flower", "Lily of the Valley", "Jasmine", "Ylang-Ylang"],
      base:  ["Sandalwood", "Vetiver", "Amber"],
    },
  },
  {
    // slug: poison-by-dior-inspired
    // Supplier: 'Poison' (sourceKey: LADIES-232-Poison) — fragrance name only, no brand qualifier
    // Supplier also lists 'Poison Girl', 'Poison / Hypnotic', 'Poison / Midnite' and
    //   'Poison / Pure' separately.
    // IDENTITY CONFIRMED (founder-reported 2026-10-11; no direct supplier response inspected):
    //   original Dior Poison, EDP.
    // CONCENTRATION/REFERENCE HOLD: inspected references (scentverdict, Nordstrom, John Lewis) are EDT;
    //   thescentbase does not state a concentration. Not relabelled as EDP — held until an EDP reference exists.
    // Evidence: AI_INFERENCE_UNSOURCED — thescentbase.com matches but is uncorroborated; Nordstrom key notes
    //   (coriander, spice / tuberose / opoponax) agree except Opoponax is base there, heart here.
    title:               "Poison by Dior Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Dior Poison",
    mood:                "Dark Mysterious Bold",
    // Profile "Amber Floral" replaces "Oriental Floral" because "Oriental" is not in the vocabulary.
    profile:             "Amber Floral",
    season:              "Autumn",
    // Fragrantica not inspected (403); dior.com returned 403. See wave-9-source-evidence.json.
    notes:               ["Plum", "Wild Berries", "Coriander", "Anise", "Brazilian Rosewood", "Tuberose", "Incense", "White Honey", "Cinnamon", "Opoponax", "Carnation", "Jasmine", "African Orange Flower", "Rose", "Vanilla", "Amber", "Sandalwood", "Heliotrope", "Musk", "Vetiver", "Virginia Cedar"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              PINK_IMAGES,
    gender:              "female",
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Plum", "Wild Berries", "Coriander", "Anise", "Brazilian Rosewood"],
      heart: ["Tuberose", "Incense", "White Honey", "Cinnamon", "Opoponax", "Carnation", "Jasmine", "African Orange Flower", "Rose"],
      base:  ["Vanilla", "Amber", "Sandalwood", "Heliotrope", "Musk", "Vetiver", "Virginia Cedar"],
    },
  },
];


// ── BATCH 2 (5) — review drafts prepared 2026-10-11; NOT promoted ─────────────
// Supplier text and row IDs are exact (data/supplier/raw/fragrance-list-2026-08.json). The supplier
// states no concentration for any of these rows; no founder or supplier identity/concentration
// confirmation exists for Batch 2, and the Batch 1 EDP confirmations do NOT apply.
// "Reference edition" = the reference fragrance's edition used for evidence only.
// Pyramids are evidence-locked to inspected pages (data/supplier/decisions/wave-9-source-evidence.json,
// revision 8). Profiles use source classifications; seasons are editorial assumptions.

const batch2: DisplayFragrance[] = [
  {
    // PROMOTED 2026-10-11 (V7fJUpJ310Qr) after founder editorial/promotion approval; reference identity
    //   founder-reported (r14b); supplied concentration unconfirmed.
    // slug: perfect-by-marc-jacobs-inspired — Supplier: 'Perfect by Marc Jacobs' (LADIES-227-Perfect by Marc Jacobs).
    // Reference edition: Marc Jacobs Perfect Eau de Parfum (2020). Female.
    // Evidence: PYRAMID_SECONDARY_SUPPORTED — johnlewis.com and ulta.com key notes agree in the same tiers.
    //   John Lewis description also names cedarwood (in neither key-notes list; not added).
    // Profile: John Lewis specification "Floral Woody"; Ulta family "Floral", scent type "Warm Floral" (kept on record).
    title:               "Perfect by Marc Jacobs Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Marc Jacobs Perfect",
    mood:                "Playful Bright Modern",
    profile:             "Floral Woody",
    season:              "Spring",
    notes:               ["Rhubarb", "Daffodil", "Almond Milk", "Cashmeran"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              PINK_IMAGES,
    gender:              "female",
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Rhubarb", "Daffodil"],
      heart: ["Almond Milk"],
      base:  ["Cashmeran"],
    },
  },
  {
    // PROMOTED 2026-10-11 (L1hdNMRYvMxC) after founder editorial/promotion approval; reference identity
    //   founder-reported (r14b); supplied concentration unconfirmed.
    // slug: euphoria-by-calvin-klein-inspired — Supplier: 'CK Euphoria' (LADIES-75-CK Euphoria). The supplier lists
    //   MEN-43 'CK Euphoria' separately (native euphoria-men-inspired). Reference edition: Calvin Klein Euphoria
    //   for Women Eau de Parfum (2005). Female.
    // Evidence: PYRAMID_SECONDARY_SUPPORTED — ulta.com key notes (full pyramid). John Lewis description supports
    //   persimmon, pomegranate, lotus blossom, orchid; Lookfantastic adds champaca, liquid amber, "black violet".
    // Profile: John Lewis scent "Amber, Floral"; Ulta family "Chypre" (adapter aliases Chypre to Amber), type "Floral".
    title:               "Euphoria by Calvin Klein Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Calvin Klein Euphoria",
    mood:                "Sensual Mysterious Luxurious",
    profile:             "Floral Amber",
    season:              "Autumn",
    notes:               ["Pomegranate", "Persimmon", "Green Accord", "Black Orchid", "Lotus Blossom", "Cream Accord", "Mahogany Wood", "Violet"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              PINK_IMAGES,
    gender:              "female",
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Pomegranate", "Persimmon", "Green Accord"],
      heart: ["Black Orchid", "Lotus Blossom"],
      base:  ["Cream Accord", "Mahogany Wood", "Violet"],
    },
  },
  {
    // slug: wonderlust-by-michael-kors-inspired — Supplier: 'Michael Kors Wonderlust' (LADIES-195-Michael Kors Wonderlust).
    // Reference edition: Michael Kors Wonderlust Eau de Parfum (2016). Female.
    // Evidence: PYRAMID_SECONDARY_SUPPORTED — nordstrom.com key notes (full pyramid; listing marked "no longer available").
    //   CONFLICT SIGNAL (not inspected): a Macy's listing located by search reportedly gives a different pyramid
    //   (almond milk, dianthus / benzoin / sandalwood). macys.com returns 403; recorded, not used.
    // Profile: Nordstrom style "Warm, spicy". "Floral" (jasmine heart) and "Woody" (sandalwood base) are editorial.
    title:               "Wonderlust by Michael Kors Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Michael Kors Wonderlust",
    mood:                "Warm Sensual Sophisticated",
    profile:             "Floral Spicy Woody",
    season:              "Autumn",
    notes:               ["Italian Bergamot", "Jasmine Grandiflorum", "Sri Lankan Sandalwood"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              PINK_IMAGES,
    gender:              "female",
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Italian Bergamot"],
      heart: ["Jasmine Grandiflorum"],
      base:  ["Sri Lankan Sandalwood"],
    },
  },
  {
    // slug: prada-candy-inspired — Supplier: 'Prada / Candy' (LADIES-238-Prada / Candy).
    // Reference edition: Prada Candy Eau de Parfum (2011). Female. Not Candy L'Eau or Candy Night (distinct flankers).
    // Evidence: AI_INFERENCE_UNSOURCED (tiers) — White Musk, Benzoin, Caramel Accord are listed by ulta.com and
    //   johnlewis.com (authorised) WITHOUT tiers; tier placement is from lookfantastic.com only (first-party,
    //   authorised status not verified). EVIDENCE HOLD until an authorised tiered source is inspected.
    // Profile: Ulta fragrance family "Warm & Spicy" and "Gourmand"; John Lewis scent "Sweet"; Lookfantastic "Amber Gourmand".
    title:               "Prada Candy Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Prada Candy",
    mood:                "Playful Sensual Warm",
    profile:             "Gourmand Spicy",
    season:              "Winter",
    notes:               ["White Musk", "Benzoin", "Caramel Accord"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              PINK_IMAGES,
    gender:              "female",
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["White Musk"],
      heart: ["Benzoin"],
      base:  ["Caramel Accord"],
    },
  },
  {
    // PROMOTED 2026-10-11 (KvfQqR73e2wA) after founder editorial/promotion approval; reference identity
    //   founder-reported (r14b); supplied concentration unconfirmed.
    // slug: only-the-brave-inspired — Supplier: 'Diesel - Only The Brave' (MEN-52-Diesel - Only The Brave).
    // Reference edition: Diesel Only The Brave Eau de Toilette (2009). Male.
    // Evidence: PYRAMID_SECONDARY_SUPPORTED — johnlewis.com description names top, heart and base notes explicitly.
    //   Dis-Chem (first-party) prose also names violet, styrax and benzoin (not added). The John Lewis copy's
    //   performance wording ("long-lasting") is NOT carried into this record.
    // Profile: John Lewis description "A Citrus Woody"; specification Scent "Amber" (kept on record).
    title:               "Only The Brave Inspired",
    collection:          "Skye",
    subtitle:            "Inspired by Diesel Only The Brave",
    mood:                "Bold Confident Energetic",
    profile:             "Citrus Woody",
    season:              "All Season",
    notes:               ["Lemon", "Mandarin", "Coriander", "Labdanum", "Violet Leaves", "Rosemary", "Amber", "Leather", "Cedar"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              BLUE_IMAGES,
    gender:              "male",
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Lemon", "Mandarin", "Coriander"],
      heart: ["Labdanum", "Violet Leaves", "Rosemary"],
      base:  ["Amber", "Leather", "Cedar"],
    },
  },
];

// ── Export ────────────────────────────────────────────────────────────────────

/** Batch 1 staging entries (6; includes promoted records kept for intake history). */
export const wave9Batch1Catalogue: DisplayFragrance[] = [...rose];
/** Batch 2 staging entries (5; review drafts, not promoted). */
export const wave9Batch2Catalogue: DisplayFragrance[] = [...batch2];
export const wave9Catalogue: DisplayFragrance[] = [...rose, ...batch2];
