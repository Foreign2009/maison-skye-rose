/**
 * Knowledge Factory — Wave 1 Staging Catalogue
 *
 * EP-CAT-P3C-R2: 40 Founder-approved Wave 1 identities registered for
 * controlled factory intake. Factory-only. NOT customer-facing.
 *
 * This file MUST NOT be imported by any module under app/.
 * Managed exclusively by: scripts/factory/intake.ts (secondary catalogue fallback).
 *
 * Collections:  ELITE (6) · ROSE (18) · SKYE (16) = 40 total
 * Evidence-locked (20): rose-oud-inspired, bloom-inspired, taif-rose-inspired,
 *   wood-sage-sea-salt-inspired, h24-herbes-vives-inspired, light-blue-inspired,
 *   royal-oud-inspired, chance-inspired, black-opium-over-red-inspired,
 *   ombre-leather-inspired, tobacco-vanille-inspired, oud-ispahan-inspired,
 *   eros-flame-inspired, carmina-inspired, mon-guerlain-inspired,
 *   oriana-inspired, bvlgari-aqua-inspired, dior-homme-sport-inspired,
 *   spicebomb-dark-leather-inspired, godolphin-inspired
 *
 * Pricing: prices is a required (non-optional) field on DisplayFragrance.
 * Omitting it would require weakening customer-facing type safety. Canonical
 * retail pricing is used: 5ml=60, 10ml=100, 30ml=250 (ZAR).
 *
 * Images: empty string placeholders. No product photography for pre-promoted
 * identities. Images are populated at MKC promotion time.
 *
 * Slug derivation: all titles are crafted so that
 *   title.toLowerCase().replace(/\s+/g, "-")
 * produces exactly the Founder-approved proposedSlug from the Wave 1 research
 * artifact (data/identity/source/wave-1-2026-research.json).
 */

import type { DisplayFragrance } from "../../../app/lib/knowledgeAdapter";

// Canonical retail pricing. Required field — cannot be omitted on DisplayFragrance.
const PRICES = { "5ml": 60, "10ml": 100, "30ml": 250 } as const;

// Factory-staging image placeholders. No product photography for pre-promoted identities.
const IMAGES = { "5ml": "", "10ml": "", "30ml": "" } as const;

// ── ELITE (6) ─────────────────────────────────────────────────────────────────

const elite: DisplayFragrance[] = [
  {
    // slug: rose-oud-inspired
    // EVIDENCE-LOCK: Founder-authorized canonical note set (EP-CAT-P3A disposition, 2026-08-15).
    // Kilian Paris Rose Oud. Conflict note: Guaiac Wood appears in external source (bykilian.com)
    // but is NOT in the Founder-canonical baseNotes. Founder resolution: preserve as-is.
    title:               "Rose Oud Inspired",
    collection:          "Elite",
    subtitle:            "Inspired by Kilian Paris Rose Oud",
    mood:                "Smoky Romantic Oriental",
    profile:             "Oriental Floral",
    season:              "Winter",
    notes:               ["Bulgarian Rose", "Saffron", "Cinnamon", "Tincture of Rose", "Litchi", "Agarwood (Oud)", "Cypriol Oil/Nagarmotha", "Cedarwood"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Bulgarian Rose", "Saffron", "Cinnamon"],
      heart: ["Tincture of Rose", "Litchi"],
      base:  ["Agarwood (Oud)", "Cypriol Oil/Nagarmotha", "Cedarwood"],
    },
  },
  {
    // slug: arabians-musk-inspired
    // Montale Arabians Musk (2024). Source: Fragrantica, montaleparfums.us.
    title:      "Arabians Musk Inspired",
    collection: "Elite",
    subtitle:   "Inspired by Montale Arabians Musk",
    mood:       "Sweet Oriental Musky",
    profile:    "Oriental Floral Gourmand",
    season:     "Winter",
    notes:      ["Honey", "Bergamot", "Dates", "Orange Blossom", "Musk", "Vanilla", "Tonka Bean", "Sugar"],
    bestSeller: false,
    newArrival: false,
    prices:     PRICES,
    images:     IMAGES,
  },
  {
    // slug: royal-oud-inspired
    // Creed Royal Oud (2011). Source: Fragrantica, creedfragrance.com.
    title:               "Royal Oud Inspired",
    collection:          "Elite",
    subtitle:            "Inspired by Creed Royal Oud",
    mood:                "Woody Sophisticated",
    profile:             "Woody Aromatic",
    season:              "Autumn",
    notes:               ["Pink Pepper", "Lemon", "Sicilian Bergamot", "Cedar", "Angelica", "Galbanum", "Sandalwood", "Agarwood (Oud)", "Musk"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Pink Pepper", "Lemon", "Sicilian Bergamot"],
      heart: ["Cedar", "Angelica", "Galbanum"],
      base:  ["Sandalwood", "Agarwood (Oud)", "Musk"],
    },
  },
  {
    // slug: rose-of-no-man's-land-inspired  (apostrophe preserved by deriveSlug)
    // Byredo Rose of No Man's Land (2015). Source: Fragrantica, byredo.com.
    title:      "Rose of No Man's Land Inspired",
    collection: "Elite",
    subtitle:   "Inspired by Byredo Rose of No Man's Land",
    mood:       "Romantic Floral",
    profile:    "Floral",
    season:     "Spring",
    notes:      ["Turkish Rose", "Pink Pepper", "Raspberry Bloom", "Papyrus", "White Amber"],
    bestSeller: false,
    newArrival: false,
    prices:     PRICES,
    images:     IMAGES,
  },
  {
    // slug: wood-sage-sea-salt-inspired
    // EVIDENCE-LOCK: Jo Malone London official minimal 3-note brand presentation.
    // Title omits ampersand (&) — deriveSlug does not strip it, so title must not contain it.
    // Source: jomalone.com (Ambrette Seeds / Sea Salt / Sage — official brand note set).
    title:               "Wood Sage Sea Salt Inspired",
    collection:          "Elite",
    subtitle:            "Inspired by Jo Malone London Wood Sage & Sea Salt",
    mood:                "Fresh Clean Marine",
    profile:             "Woody Fresh",
    season:              "Summer",
    notes:               ["Ambrette Seeds", "Sea Salt", "Sage"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Ambrette Seeds"],
      heart: ["Sea Salt"],
      base:  ["Sage"],
    },
  },
  {
    // slug: decision-inspired
    // Amouage Decision (2025). Source: Fragrantica, parfumo.com.
    title:      "Decision Inspired",
    collection: "Elite",
    subtitle:   "Inspired by Amouage Decision",
    mood:       "Woody Resinous Aromatic",
    profile:    "Woody Aromatic",
    season:     "Autumn",
    notes:      ["Cardamom", "Bergamot", "Pink Pepper", "Frankincense", "Myrrh", "Juniper Berries", "Vanilla", "Cedarwood", "Patchouli"],
    bestSeller: false,
    newArrival: false,
    prices:     PRICES,
    images:     IMAGES,
  },
];

// ── ROSE (18) ─────────────────────────────────────────────────────────────────

const rose: DisplayFragrance[] = [
  {
    // slug: rose-n'-roses-inspired  (apostrophe in N' preserved by deriveSlug)
    // Dior Miss Dior Rose N' Roses (2020). Source: dior.com, Fragrantica.
    title:      "Rose N' Roses Inspired",
    collection: "Rose",
    subtitle:   "Inspired by Dior Miss Dior Rose N' Roses",
    mood:       "Romantic Floral Fresh",
    profile:    "Floral",
    season:     "Spring",
    notes:      ["Italian Mandarin", "Bergamot", "Geranium", "Grasse Rose", "Damask Rose", "White Musk"],
    bestSeller: false,
    newArrival: false,
    prices:     PRICES,
    images:     IMAGES,
  },
  {
    // slug: black-opium-over-red-inspired
    // YSL Black Opium Over Red (2023). Source: yslbeauty.com, Fragrantica.
    title:               "Black Opium Over Red Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Yves Saint Laurent Black Opium Over Red",
    mood:                "Gourmand Sweet Dark",
    profile:             "Oriental Gourmand",
    season:              "Autumn",
    notes:               ["Cherry", "Green Mandarin", "Jasmine", "Orange Blossom", "Black Tea", "Madagascar Vanilla", "Coffee", "Indonesian Patchouli Leaf"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Cherry", "Green Mandarin"],
      heart: ["Jasmine", "Orange Blossom", "Black Tea"],
      base:  ["Madagascar Vanilla", "Coffee", "Indonesian Patchouli Leaf"],
    },
  },
  {
    // slug: taif-rose-inspired
    // EVIDENCE-LOCK: Jo Malone London official minimal 4-note brand presentation.
    // Source: Fragrantica (Rose / Taif Rose / Amber / Coffee — official brand note set).
    title:               "Taif Rose Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Jo Malone London Taif Rose Cologne",
    mood:                "Romantic Floral Oriental",
    profile:             "Floral Oriental",
    season:              "Spring",
    notes:               ["Rose", "Taif Rose", "Amber", "Coffee"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Rose"],
      heart: ["Taif Rose"],
      base:  ["Amber", "Coffee"],
    },
  },
  {
    // slug: libre-flowers-flames-florale-inspired
    // YSL Libre Flowers & Flames EDP Florale (2024). Title omits ampersand.
    // Source: johnlewis.com, macys.com, Fragrantica.
    title:      "Libre Flowers Flames Florale Inspired",
    collection: "Rose",
    subtitle:   "Inspired by Yves Saint Laurent Libre Flowers & Flames EDP Florale",
    mood:       "Fresh Floral Sweet Tropical",
    profile:    "Floral",
    season:     "Spring",
    notes:      ["Lavender", "Bergamot", "Orange Blossom", "Coconut", "Lily", "Palm Tree Flower", "Vanilla"],
    bestSeller: false,
    newArrival: false,
    prices:     PRICES,
    images:     IMAGES,
  },
  {
    // slug: fresh-blossom-inspired
    // DKNY Be Delicious Fresh Blossom (2009). Source: Fragrantica.
    title:      "Fresh Blossom Inspired",
    collection: "Rose",
    subtitle:   "Inspired by DKNY Be Delicious Fresh Blossom",
    mood:       "Fresh Fruity Feminine",
    profile:    "Floral Fruity",
    season:     "Spring",
    notes:      ["Grapefruit", "Apricot", "Cassis", "Rose", "Lily of the Valley", "Jasmine", "Red Apple", "Woodsy Notes"],
    bestSeller: false,
    newArrival: false,
    prices:     PRICES,
    images:     IMAGES,
  },
  {
    // slug: light-blue-inspired
    // Dolce & Gabbana Light Blue women (2001). Title omits ampersand.
    // Source: Fragrantica.
    // EVIDENCE-LOCK: EP-CAT-P3C-R4. Research evidence authoritative; CompositionProducer
    // bypassed. Cedar appears in both top and base in authoritative research (cross-tier
    // duplicate); both instances are preserved faithfully in notesStructured.
    title:      "Light Blue Inspired",
    collection: "Rose",
    subtitle:   "Inspired by Dolce & Gabbana Light Blue",
    mood:       "Fresh Citrus Clean",
    profile:    "Floral Aquatic",
    season:     "Summer",
    notes:      ["Sicilian Lemon", "Apple", "Cedar", "Bellflower", "Bamboo", "Jasmine", "White Rose", "Musk", "Amber"],
    bestSeller: false,
    newArrival: false,
    prices:     PRICES,
    images:     IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Sicilian Lemon", "Apple", "Cedar", "Bellflower"],
      heart: ["Bamboo", "Jasmine", "White Rose"],
      base:  ["Cedar", "Musk", "Amber"],
    },
  },
  {
    // slug: bloom-inspired
    // EVIDENCE-LOCK: Gucci Bloom — unordered floral bouquet. Gucci does not present
    // this as a top/heart/base pyramid. All 5 notes belong in heart; top and base
    // are intentionally empty. Source: gucci.com, Fragrantica.
    title:               "Bloom Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Gucci Bloom",
    mood:                "Romantic Feminine White Floral",
    profile:             "White Floral",
    season:              "Spring",
    notes:               ["Tuberose", "Jasmine Sambac", "Jasmine Bud", "Rangoon Creeper", "Orris Root"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   [],
      heart: ["Tuberose", "Jasmine Sambac", "Jasmine Bud", "Rangoon Creeper", "Orris Root"],
      base:  [],
    },
  },
  {
    // slug: carmina-inspired
    // Creed Carmina (2023). Source: Fragrantica, creedboutique.com.
    title:               "Carmina Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Creed Carmina",
    mood:                "Romantic Floral Spicy",
    profile:             "Floral Amber Woody",
    season:              "Autumn",
    notes:               ["Pink Pepper", "Black Cherry", "Saffron", "Rose de Mai", "Violet", "Peony", "Cashmere Wood", "Myrrh", "Frankincense", "Ambroxan", "Musk"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Pink Pepper", "Black Cherry", "Saffron"],
      heart: ["Rose de Mai", "Violet", "Peony", "Cashmere Wood"],
      base:  ["Myrrh", "Frankincense", "Ambroxan", "Musk"],
    },
  },
  {
    // slug: my-way-ylang-inspired
    // Giorgio Armani My Way Ylang (2023). Source: giorgioarmanibeauty-usa.com, Fragrantica.
    title:      "My Way Ylang Inspired",
    collection: "Rose",
    subtitle:   "Inspired by Giorgio Armani My Way Ylang",
    mood:       "Tropical Feminine Floral",
    profile:    "Floral",
    season:     "Spring",
    notes:      ["Mango Accord", "White Flowers", "Ginger", "Bergamot", "Ylang Ylang Essence", "Coconut Water Accord", "Tuberose", "White Musk", "Vanilla Bourbon", "Cedarwood"],
    bestSeller: false,
    newArrival: false,
    prices:     PRICES,
    images:     IMAGES,
  },
  {
    // slug: si-passione-red-musk-inspired
    // Giorgio Armani Si Passione Red Musk (2025). Title strips accent from canonical "Sì".
    // Source: Fragrantica (primary note set: Strawberry/Red Musk / Rose/Milk / Musk/Vanilla).
    title:      "Si Passione Red Musk Inspired",
    collection: "Rose",
    subtitle:   "Inspired by Giorgio Armani Si Passione Red Musk",
    mood:       "Sensual Musky Sweet",
    profile:    "Floral Musky",
    season:     "Spring",
    notes:      ["Strawberry", "Red Musk", "Rose", "Milk", "Musk", "Vanilla"],
    bestSeller: false,
    newArrival: false,
    prices:     PRICES,
    images:     IMAGES,
  },
  {
    // slug: omnia-green-jade-inspired
    // Bvlgari Omnia Green Jade (2009). Source: Fragrantica, bvlgari.com.
    title:      "Omnia Green Jade Inspired",
    collection: "Rose",
    subtitle:   "Inspired by Bvlgari Omnia Green Jade",
    mood:       "Fresh Green Floral",
    profile:    "Floral Aquatic",
    season:     "Summer",
    notes:      ["Green Notes", "Mandarin Orange", "Jasmine", "Peony", "Pear Blossom", "Woodsy Notes", "Pistachio", "Musk"],
    bestSeller: false,
    newArrival: false,
    prices:     PRICES,
    images:     IMAGES,
  },
  {
    // slug: coach-floral-inspired
    // Coach Floral (2018). Source: Fragrantica, coach.com.
    title:      "Coach Floral Inspired",
    collection: "Rose",
    subtitle:   "Inspired by Coach Floral",
    mood:       "Feminine Floral Fresh",
    profile:    "Floral Woody",
    season:     "Spring",
    notes:      ["Citrus", "Pink Peppercorn", "Pineapple Sorbet", "Rose Tea", "Jasmine Sambac", "Gardenia", "Creamy Wood", "Patchouli", "Musk"],
    bestSeller: false,
    newArrival: false,
    prices:     PRICES,
    images:     IMAGES,
  },
  {
    // slug: oud-ispahan-inspired
    // Dior Oud Ispahan (2012). La Collection Privee. Source: dior.com, Fragrantica.
    title:               "Oud Ispahan Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Dior Oud Ispahan",
    mood:                "Oriental Romantic Rose",
    profile:             "Oriental Woody",
    season:              "Winter",
    notes:               ["Labdanum", "Rose", "Patchouli", "Saffron", "Agarwood (Oud)", "Sandalwood", "Cedar"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Labdanum"],
      heart: ["Rose", "Patchouli", "Saffron"],
      base:  ["Agarwood (Oud)", "Sandalwood", "Cedar"],
    },
  },
  {
    // slug: chance-inspired
    // Chanel Chance EDT (2002). Original — not Eau Tendre, Eau Fraiche, or Eau Vive.
    // Source: Fragrantica.
    title:               "Chance Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Chanel Chance",
    mood:                "Fresh Floral Feminine",
    profile:             "Floral Fresh",
    season:              "Spring",
    notes:               ["Citron", "Pink Pepper", "Jasmine Absolute", "Iris Absolute", "Hyacinth", "Amber Patchouli", "White Musk", "Vetiver"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Citron", "Pink Pepper"],
      heart: ["Jasmine Absolute", "Iris Absolute", "Hyacinth"],
      base:  ["Amber Patchouli", "White Musk", "Vetiver"],
    },
  },
  {
    // slug: mon-guerlain-inspired
    // Guerlain Mon Guerlain EDP (2017). Source: Fragrantica.
    title:               "Mon Guerlain Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Guerlain Mon Guerlain",
    mood:                "Sweet Floral Romantic",
    profile:             "Oriental Floral",
    season:              "Winter",
    notes:               ["Lavender", "Bergamot", "Iris", "Jasmine Sambac", "Rose", "Tahitian Vanilla", "Tonka Bean", "Australian Sandalwood", "Benzoin", "Licorice", "Patchouli"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Lavender", "Bergamot"],
      heart: ["Iris", "Jasmine Sambac", "Rose"],
      base:  ["Tahitian Vanilla", "Tonka Bean", "Australian Sandalwood", "Benzoin", "Licorice", "Patchouli"],
    },
  },
  {
    // slug: bright-crystal-inspired
    // Versace Bright Crystal (2006). Source: Fragrantica.
    title:      "Bright Crystal Inspired",
    collection: "Rose",
    subtitle:   "Inspired by Versace Bright Crystal",
    mood:       "Fresh Feminine Elegant",
    profile:    "Floral Fruity",
    season:     "Spring",
    notes:      ["Yuzu", "Pomegranate", "Caramelized Red Fruits", "Ice Accord", "Lotus Flower", "Magnolia", "Peony", "Amber Woods", "Acajou", "Ambrox Super", "Musk"],
    bestSeller: false,
    newArrival: false,
    prices:     PRICES,
    images:     IMAGES,
  },
  {
    // slug: twilly-d'hermes-inspired  (apostrophe in d' preserved by deriveSlug)
    // Hermes Twilly d'Hermes EDP (2017). Title strips accent from canonical "d'Hermès".
    // Source: hermes.com/us/en, Fragrantica.
    title:      "Twilly d'Hermes Inspired",
    collection: "Rose",
    subtitle:   "Inspired by Hermes Twilly d'Hermes",
    mood:       "Spicy Floral Feminine",
    profile:    "Floral Spicy",
    season:     "Spring",
    notes:      ["Ginger", "Bitter Orange", "Bergamot", "Tuberose", "Orange Blossom", "Jasmine", "Sandalwood", "Vanilla"],
    bestSeller: false,
    newArrival: false,
    prices:     PRICES,
    images:     IMAGES,
  },
  {
    // slug: oriana-inspired
    // Parfums de Marly Oriana (2021). Source: us.parfums-de-marly.com, Fragrantica.
    title:               "Oriana Inspired",
    collection:          "Rose",
    subtitle:            "Inspired by Parfums de Marly Oriana",
    mood:                "Sweet Fruity Feminine",
    profile:             "Floral Fruity Gourmand",
    season:              "Spring",
    notes:               ["Mandarin Orange", "Bergamot", "Grapefruit", "Orange Blossom", "Blackcurrant", "Raspberry", "Marshmallow", "Ambrette", "Chantilly Cream", "Musk"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Mandarin Orange", "Bergamot", "Grapefruit"],
      heart: ["Orange Blossom", "Blackcurrant", "Raspberry"],
      base:  ["Marshmallow", "Ambrette", "Chantilly Cream", "Musk"],
    },
  },
];

// ── SKYE (16) ─────────────────────────────────────────────────────────────────

const skye: DisplayFragrance[] = [
  {
    // slug: bleu-de-chanel-l'exclusif-inspired  (apostrophe in L' preserved by deriveSlug)
    // Chanel Bleu de Chanel L'Exclusif (2025). Source: Fragrantica, bustle.com.
    title:      "Bleu de Chanel L'Exclusif Inspired",
    collection: "Skye",
    subtitle:   "Inspired by Chanel Bleu de Chanel L'Exclusif",
    mood:       "Sophisticated Masculine Elegant",
    profile:    "Woody Leathery Aromatic",
    season:     "Autumn",
    notes:      ["Lavender", "Bergamot", "Lemon Peel", "Jasmine", "Leather Accord", "Sandalwood", "Virginia Cedar", "Patchouli", "Cistus Labdanum"],
    bestSeller: false,
    newArrival: false,
    prices:     PRICES,
    images:     IMAGES,
  },
  {
    // slug: ombre-leather-inspired
    // Tom Ford Ombre Leather (2018). Title strips accent from canonical "Ombré".
    // Source: tomfordbeauty.com, Fragrantica.
    title:               "Ombre Leather Inspired",
    collection:          "Skye",
    subtitle:            "Inspired by Tom Ford Ombre Leather",
    mood:                "Dark Masculine",
    profile:             "Leather Woody",
    season:              "Autumn",
    notes:               ["Cardamom", "Leather", "Jasmine Sambac", "Amber", "Moss", "Patchouli"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Cardamom"],
      heart: ["Leather", "Jasmine Sambac"],
      base:  ["Amber", "Moss", "Patchouli"],
    },
  },
  {
    // slug: tobacco-vanille-inspired
    // Tom Ford Tobacco Vanille (2007). Source: tomfordbeauty.com, Fragrantica.
    title:               "Tobacco Vanille Inspired",
    collection:          "Skye",
    subtitle:            "Inspired by Tom Ford Tobacco Vanille",
    mood:                "Sweet Warm Masculine",
    profile:             "Oriental Spicy",
    season:              "Winter",
    notes:               ["Tobacco Leaf", "Spicy Notes", "Vanilla", "Cacao", "Tonka Bean", "Tobacco Blossom", "Dried Fruits", "Woody Notes"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Tobacco Leaf", "Spicy Notes"],
      heart: ["Vanilla", "Cacao", "Tonka Bean", "Tobacco Blossom"],
      base:  ["Dried Fruits", "Woody Notes"],
    },
  },
  {
    // slug: dior-homme-sport-inspired
    // Dior Homme Sport 2021 reformulation (market launch 2022). Source: Fragrantica.
    title:               "Dior Homme Sport Inspired",
    collection:          "Skye",
    subtitle:            "Inspired by Dior Homme Sport",
    mood:                "Fresh Clean Masculine",
    profile:             "Woody Fresh",
    season:              "Summer",
    notes:               ["Lemon", "Bergamot", "Aldehydes", "Elemi", "Pink Pepper", "Woody Notes", "Amber", "Olibanum"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Lemon", "Bergamot", "Aldehydes"],
      heart: ["Elemi", "Pink Pepper"],
      base:  ["Woody Notes", "Amber", "Olibanum"],
    },
  },
  {
    // slug: dunhill-fresh-inspired
    // Alfred Dunhill Dunhill Fresh (2005). Source: Fragrantica, basenotes.net.
    title:      "Dunhill Fresh Inspired",
    collection: "Skye",
    subtitle:   "Inspired by Alfred Dunhill Dunhill Fresh",
    mood:       "Fresh Aromatic Clean",
    profile:    "Woody Fresh Aromatic",
    season:     "Summer",
    notes:      ["Green Notes", "Mint", "Basil", "Lavender", "Freesia", "Sage", "Violet", "Iris", "Mimosa", "Vetiver", "Cedar", "Oakmoss", "Patchouli", "Amber", "Coumarin"],
    bestSeller: false,
    newArrival: false,
    prices:     PRICES,
    images:     IMAGES,
  },
  {
    // slug: eros-flame-inspired
    // Versace Eros Flame (2018). Source: Fragrantica, versace.com.
    title:               "Eros Flame Inspired",
    collection:          "Skye",
    subtitle:            "Inspired by Versace Eros Flame",
    mood:                "Fresh Spicy Masculine",
    profile:             "Woody Citrus",
    season:              "Autumn",
    notes:               ["Mandarin Orange", "Lemon", "Chinotto", "Black Pepper", "Rosemary", "Geranium", "Rose", "Pepperwood", "Vanilla", "Tonka Bean", "Sandalwood", "Texas Cedar", "Patchouli", "Oakmoss"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Mandarin Orange", "Lemon", "Chinotto", "Black Pepper", "Rosemary"],
      heart: ["Geranium", "Rose", "Pepperwood"],
      base:  ["Vanilla", "Tonka Bean", "Sandalwood", "Texas Cedar", "Patchouli", "Oakmoss"],
    },
  },
  {
    // slug: alien-man-inspired
    // Mugler Alien Man (2018). Source: Fragrantica, mugler.com.
    title:      "Alien Man Inspired",
    collection: "Skye",
    subtitle:   "Inspired by Mugler Alien Man",
    mood:       "Aromatic Spicy Masculine",
    profile:    "Oriental Woody",
    season:     "Autumn",
    notes:      ["Anise", "Dill", "Mint", "Lavender", "Beech", "Thyme", "Lemon", "Leather", "Cashmere Wood", "Osmanthus", "Pepper", "Geranium", "White Amber", "Cashmeran", "Vanilla"],
    bestSeller: false,
    newArrival: false,
    prices:     PRICES,
    images:     IMAGES,
  },
  {
    // slug: bvlgari-aqua-inspired
    // Bvlgari AQVA Pour Homme (2005). Original — not Atlantiqve, Marine, or Amara flankers.
    // Source: Fragrantica, basenotes.net.
    title:               "Bvlgari Aqua Inspired",
    collection:          "Skye",
    subtitle:            "Inspired by Bvlgari AQVA Pour Homme",
    mood:                "Fresh Aquatic Clean",
    profile:             "Aromatic Aquatic",
    season:              "Summer",
    notes:               ["Mandarin Orange", "Orange", "Petitgrain", "Seaweed", "Lavender", "Cotton Flower", "Virginia Cedar", "Woodsy Notes", "Patchouli", "Clary Sage", "Amber"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Mandarin Orange", "Orange", "Petitgrain"],
      heart: ["Seaweed", "Lavender", "Cotton Flower"],
      base:  ["Virginia Cedar", "Woodsy Notes", "Patchouli", "Clary Sage", "Amber"],
    },
  },
  {
    // slug: h24-herbes-vives-inspired
    // EVIDENCE-LOCK: Hermes H24 Herbes Vives (2024) — official Hermes minimal 3-note
    // brand presentation (herbes / pear / Physcool®). Physcool® is a registered Hermes
    // proprietary cooling molecule — must be preserved verbatim.
    // Source: hermes.com/us/en (Tier 1 authoritative).
    title:               "H24 Herbes Vives Inspired",
    collection:          "Skye",
    subtitle:            "Inspired by Hermes H24 Herbes Vives",
    mood:                "Fresh Herbal Aromatic",
    profile:             "Aromatic Fresh",
    season:              "Summer",
    notes:               ["Herbal Notes", "Pear", "Physcool®"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Herbal Notes"],
      heart: ["Pear"],
      base:  ["Physcool®"],
    },
  },
  {
    // slug: invictus-victory-absolu-inspired
    // Rabanne Invictus Victory Absolu (2025). Source: rabanne.com, Fragrantica.
    title:      "Invictus Victory Absolu Inspired",
    collection: "Skye",
    subtitle:   "Inspired by Rabanne Invictus Victory Absolu",
    mood:       "Warm Oriental Masculine",
    profile:    "Oriental Woody",
    season:     "Autumn",
    notes:      ["Black Pepper", "Amber", "Ambergris", "Woodsy Notes", "Sandalwood", "Frankincense", "Patchouli"],
    bestSeller: false,
    newArrival: false,
    prices:     PRICES,
    images:     IMAGES,
  },
  {
    // slug: spicebomb-dark-leather-inspired
    // Viktor & Rolf Spicebomb Dark Leather (2024). Source: viktor-rolf.com, Fragrantica.
    title:               "Spicebomb Dark Leather Inspired",
    collection:          "Skye",
    subtitle:            "Inspired by Viktor & Rolf Spicebomb Dark Leather",
    mood:                "Dark Spicy Masculine",
    profile:             "Woody Leathery Spicy",
    season:              "Autumn",
    notes:               ["Black Pepper", "Nutmeg", "Incense", "Cinnamon", "Dark Leather", "Tobacco Accord"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Black Pepper", "Nutmeg"],
      heart: ["Incense", "Cinnamon"],
      base:  ["Dark Leather", "Tobacco Accord"],
    },
  },
  {
    // slug: godolphin-inspired
    // Parfums de Marly Godolphin (2010). Source: us.parfums-de-marly.com, Fragrantica.
    title:               "Godolphin Inspired",
    collection:          "Skye",
    subtitle:            "Inspired by Parfums de Marly Godolphin",
    mood:                "Woody Oriental Masculine",
    profile:             "Oriental Woody Floral",
    season:              "Autumn",
    notes:               ["Thyme", "Saffron", "Cypress", "Green Notes", "Fruity Notes", "Mate", "Rose", "Iris", "Jasmine", "Leather", "Vetiver", "Cedar", "Musk", "Amber", "Vanilla"],
    bestSeller:          false,
    newArrival:          false,
    prices:              PRICES,
    images:              IMAGES,
    notesEvidenceLocked: true,
    notesStructured: {
      top:   ["Thyme", "Saffron", "Cypress", "Green Notes", "Fruity Notes", "Mate"],
      heart: ["Rose", "Iris", "Jasmine"],
      base:  ["Leather", "Vetiver", "Cedar", "Musk", "Amber", "Vanilla"],
    },
  },
  {
    // slug: voyage-d'hermes-inspired  (apostrophe in d' preserved by deriveSlug)
    // Hermes Voyage d'Hermes EDT (2010). Title strips accent from canonical "d'Hermès".
    // Disambiguation: original 2010 EDT, not the 2014 Parfum.
    // Source: Fragrantica, decantx.com.
    title:      "Voyage d'Hermes Inspired",
    collection: "Skye",
    subtitle:   "Inspired by Hermes Voyage d'Hermes",
    mood:       "Fresh Woody Clean",
    profile:    "Woody Fresh",
    season:     "Summer",
    notes:      ["Cardamom", "Amalfi Lemon", "Spices", "Juniper Berries", "Tea", "Green Notes", "Floral Notes", "Woodsy Notes", "Musk", "Cedar"],
    bestSeller: false,
    newArrival: false,
    prices:     PRICES,
    images:     IMAGES,
  },
  {
    // slug: bois-d'argent-inspired  (apostrophe in d' preserved by deriveSlug)
    // Dior Bois d'Argent (2004). La Collection Privee. Original Annick Menardo version.
    // Source: dior.com, Fragrantica.
    title:      "Bois d'Argent Inspired",
    collection: "Skye",
    subtitle:   "Inspired by Dior Bois d'Argent",
    mood:       "Woody Floral",
    profile:    "Woody Floral",
    season:     "Autumn",
    notes:      ["Iris", "Cypress", "Juniper Berries", "Myrrh", "Patchouli", "Woodsy Notes", "Honey", "Vanilla", "Amber", "Resins", "Musk", "Leather"],
    bestSeller: false,
    newArrival: false,
    prices:     PRICES,
    images:     IMAGES,
  },
  {
    // slug: allure-homme-sport-inspired
    // Chanel Allure Homme Sport (2004). Source: Fragrantica, basenotes.net.
    title:      "Allure Homme Sport Inspired",
    collection: "Skye",
    subtitle:   "Inspired by Chanel Allure Homme Sport",
    mood:       "Fresh Citrus Masculine",
    profile:    "Woody Spicy",
    season:     "Autumn",
    notes:      ["Orange", "Sea Notes", "Aldehydes", "Blood Mandarin", "Pepper", "Neroli", "Cedar", "Vanilla", "Tonka Bean", "White Musk", "Amber", "Vetiver", "Elemi Resin"],
    bestSeller: false,
    newArrival: false,
    prices:     PRICES,
    images:     IMAGES,
  },
  {
    // slug: gentleman-edt-inspired
    // Givenchy Gentleman EDT (2017). Founder resolution EP-CAT-P3C-R1 (2026-08-15):
    // supplier text "Gentleman by Givenchy" maps to the 2017 EDT — not EDP, EDP Boisee,
    // or any other qualified flanker.
    // Source: Fragrantica, decanthouse.com; Founder authorization: AUTHORITATIVE.
    title:      "Gentleman EDT Inspired",
    collection: "Skye",
    subtitle:   "Inspired by Givenchy Gentleman EDT 2017",
    mood:       "Elegant Masculine Spicy",
    profile:    "Oriental Floral",
    season:     "Autumn",
    notes:      ["Pear", "Cardamom", "Pineapple", "Iris", "Lavender", "Geranium", "Leather", "Black Vanilla Husk", "Patchouli"],
    bestSeller: false,
    newArrival: false,
    prices:     PRICES,
    images:     IMAGES,
  },
];

// ── Export ────────────────────────────────────────────────────────────────────

/**
 * All 40 Wave 1 staging entries.
 * ELITE (6) + ROSE (18) + SKYE (16) = 40.
 * Factory-only. Import ONLY from scripts/factory/intake.ts.
 */
export const wave1Catalogue: DisplayFragrance[] = [...elite, ...rose, ...skye];
