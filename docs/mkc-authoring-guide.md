# Maison Knowledge Catalogue — Authoring Guide

The Maison Knowledge Catalogue (MKC) is the single source of truth for all fragrance data across the Maison Skye & Rose platform. This guide defines the authoring standard for every native `FragranceKnowledge` record.

---

## Quick Start

```bash
# Scaffold a new record
npm run mkc:new -- "Layton Inspired"

# Validate all native records
npm run mkc:validate
```

The scaffold generator:
1. Creates `app/lib/mkc/native/layton-inspired.ts` from the canonical template
2. Registers the record in `app/lib/mkc/native/index.ts`
3. Runs the validator automatically

Open the generated file, fill in every field, run `npm run mkc:validate`, confirm PASS, then commit.

---

## Naming Conventions

| Input | Output |
|---|---|
| Display name | `"Layton Inspired"` — as provided to `mkc:new` |
| Slug | `layton-inspired` — `name.toLowerCase().replace(/\s+/g, "-")` |
| File name | `app/lib/mkc/native/layton-inspired.ts` |
| Export name | `laytonInspired` — camelCase of the slug |
| Map key | `"layton-inspired"` — slug, in `native/index.ts` |

The slug derivation formula is identical to the one used internally by `adaptFragrance()`. This guarantees the hybrid catalogue loader finds the native record when looking up by slug.

---

## Field Reference

### Identity

These fields are auto-filled by the scaffold generator. Do not change `id`, `slug`, or `name` after generation.

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | `string` | ✅ | Must equal `slug` |
| `slug` | `string` | ✅ | Derived from name; must equal `id` |
| `brand` | `string` | ✅ | Always `"Maison Skye & Rose"` |
| `name` | `string` | ✅ | Display name; slug must match its derivation |
| `collection` | `"Skye" \| "Rose" \| "Elite"` | ✅ | Skye = masculine, Rose = feminine, Elite = premium/unisex |
| `catalogVersion` | `string` | ⚠ | Use `"1.0"` for all initial records |
| `status` | `string` | ⚠ | `"active"` or `"discontinued"` |

---

### Classification

These fields drive the similarity engine (weights: family ×20, character ×20, projection ×12).

| Field | Type | Required | Notes |
|---|---|---|---|
| `gender` | `"male" \| "female" \| "unisex"` | ✅ | Based on the character of the fragrance, not the collection alone |
| `family` | `string[]` | ✅ | 1–3 values from the approved vocabulary (see below) |
| `scentCharacter` | union | ✅ | One of 4 values — author after completing composition |
| `projection` | `"soft" \| "moderate" \| "strong"` | ✅ | Honest assessment; most masculines are `strong`, most florals `soft` |

**Approved fragrance family vocabulary:**

```
Fresh    Aquatic    Citrus      Woody       Aromatic
Amber    Sweet      Gourmand    Floral      White Floral
Rose     Vanilla    Leather     Tobacco     Oud
Musk     Powdery    Spicy       Fruity
```

**`scentCharacter` values:**

| Value | When to use |
|---|---|
| `"Fresh & Light"` | Citrus/aquatic dominants; effortless and approachable; light sillage |
| `"Balanced Signature"` | Well-rounded; works across occasions; not too light or too heavy |
| `"Rich & Long Wearing"` | Amber/spice/vanilla base; noticeable sillage; occasion-appropriate weight |
| `"Deep & Intense"` | Oud/leather/tobacco dominants; maximum sillage; evening/occasion focus |

---

### Composition

These fields feed the similarity engine's note scoring (×8 per shared note, capped at 3 matches) and the Concierge's fragrance context block.

| Field | Type | Required | Notes |
|---|---|---|---|
| `profile` | `string` | ✅ | 2–3 word olfactive descriptor e.g. `"Fresh Spicy Woody"` |
| `season` | `string` | ✅ | `"All Season"`, `"Summer"`, `"Winter"`, `"Spring"`, `"Autumn"` |
| `notes.top` | `string[]` | ✅ | Minimum 2; opening accord (0–30 minutes) |
| `notes.heart` | `string[]` | ✅ | Minimum 2; character of the fragrance (30 min–3 hours) |
| `notes.base` | `string[]` | ✅ | Minimum 2; dry-down and longevity (3+ hours) |
| `mood` | `string` | ✅ | 1–2 sentence mood in Maison voice |

**Note naming:** Use standard INCI or common industry names. Capitalise each note. Examples: `"Bergamot"`, `"Ambroxan"`, `"White Musk"`, `"Labdanum"`.

---

### Discovery

These fields feed the recommendation engine, the Concierge retrieval planner, and the wardrobe engine.

| Field | Type | Required | Notes |
|---|---|---|---|
| `vibe` | `string[]` | ✅ | Minimum 3; from the approved vibe vocabulary |
| `occasions` | `string[]` | ✅ | Minimum 2; drives occasion-based collection generation |
| `seasons` | `string[]` | ✅ | Minimum 1; explicit list e.g. `["Spring", "Summer", "Autumn", "Winter"]` |
| `signatureStyle` | `string[]` | ✅ | 2–3 curated wardrobe descriptors (not a copy of `subtitle`) |
| `recommendedFor` | `string[]` | ✅ | Minimum 2 specific customer persona statements |

**Approved vibe vocabulary:**

```
── Universal ──────────────────────────────────────────────
Luxury      Confident    Powerful     Sexy         Professional
Clean       Elegant      Playful      Mysterious   Romantic
Bold        Sophisticated  Modern     Wealthy      Old Money

── Rose & Elite ───────────────────────────────────────────
Feminine    Sensual      Delicate     Flirtatious
```

Select the 5–8 vibes that best describe the fragrance's character. A record can draw from both groups; most Rose records will include at least 2–3 entries from the Rose & Elite group. See [Vocabulary Governance](#vocabulary-governance) for how new vocabulary is proposed.

**Approved occasion vocabulary:**

```
Daily Wear    Office    Date Night    Weekend    Evening
Vacation      Wedding   Summer Days   Winter Evenings
```

Use 4–6 occasions per record. `Weekend` and `Evening` are appropriate for most warm/rich fragrances. Rose records may use any entry from this list; occasion choice should reflect the actual wearing context, not the target demographic. See [Vocabulary Governance](#vocabulary-governance) for how new occasions are proposed.

---

### Merchandising

Copy exact values from the production data source. Do not estimate.

| Field | Type | Required | Notes |
|---|---|---|---|
| `prices["5ml"]` | `number` | ✅ | Must be > 0 |
| `prices["10ml"]` | `number` | ✅ | Must be > 0 |
| `prices["30ml"]` | `number` | ✅ | Must be > 0 |
| `images["5ml"]` | `string` | ✅ | Path from `/public` e.g. `"/images/blue-5ml.png"` |
| `images["10ml"]` | `string` | ✅ | Path from `/public` |
| `images["30ml"]` | `string` | ✅ | Path from `/public` |
| `bestSeller` | `boolean` | ✅ | Set by operations, not the author |
| `newArrival` | `boolean` | ✅ | Set by operations |
| `featured` | `boolean` | — | Optional; omit unless explicitly featured |

---

### Education

| Field | Type | Required | Notes |
|---|---|---|---|
| `subtitle` | `string` | ✅ | 2–3 words; character summary shown as a badge e.g. `"Masculine Energy"` |
| `description` | `string` | ✅ | 2–4 sentences; the fragrance story in Maison voice |

---

### Academy Integration

These fields are optional but strongly recommended. They improve the Academy recommendation engine and the Concierge's educational responses.

| Field | Type | Notes |
|---|---|---|
| `academyArticleIds` | `string[]` | Article slugs; listed articles receive +50 score boost |
| `academyCategories` | `string[]` | Category slugs for Concierge education routing |
| `educationTags` | `string[]` | Tags shared with the Academy Registry for cross-referencing |
| `learningPath` | `string[]` | Ordered article slugs for guided learning |

**Available article slugs:**
- `the-note-pyramid-explained`
- `guide-to-fragrance-families`
- `how-to-wear-fragrance`
- `what-makes-a-signature-scent`
- `choosing-your-season-scent`
- `how-to-layer-fragrances`

**Available category slugs:**
- `fragrance-fundamentals`
- `fragrance-families`
- `the-note-pyramid`
- `building-your-wardrobe`
- `occasion-guide`
- `seasonal-guide`

---

### Intelligence

All scores are integers. They drive the similarity engine, collection boosting, and the Concierge's character context.

| Field | Scale | Notes |
|---|---|---|
| `sweetness` | 1–5 | 1 = no sweetness, 5 = candied/gourmand |
| `freshness` | 1–5 | 1 = zero freshness, 5 = dominant citrus/bergamot |
| `warmth` | 1–5 | 1 = cool and crisp, 5 = Oud/Amber/Vanilla dominant |
| `intensity` | 1–5 | 1 = soft and close, 5 = very powerful projection |
| `versatility` | 1–5 | 1 = niche/specialist, 5 = genuinely all-occasion |
| `popularity` | 1–10 | 10 = #1 bestseller; 8–10 = bestsellers; 5 = average; 2–4 = niche |

**Score philosophy:** All scores are relative to the current native catalogue, not absolute. The population mean for all 1–5 dimensions is 3. Scores of 1 and 5 are reserved for genuine anchors — fragrances that define the extreme for that dimension. Most fragrances will score 2–4.

**Calibration reference — all current native records:**

| Fragrance | Sweet | Fresh | Warm | Int | Vers | Pop |
|---|---|---|---|---|---|---|
| Sauvage Inspired | 1 | 5 | 3 | 4 | 5 | 10 |
| Aventus Inspired | 2 | 3 | 3 | 4 | 4 | 9 |
| Bleu De Chanel Inspired | 1 | 4 | 2 | 3 | 5 | 7 |
| Aqua Di Gio Inspired | 1 | 5 | 1 | 2 | 3 | 8 |
| Y Inspired | 2 | 4 | 3 | 3 | 5 | 7 |
| Eros Inspired | 3 | 4 | 2 | 4 | 3 | 8 |
| Hacivat Inspired | 2 | 3 | 3 | 4 | 4 | 9 |
| Terre D'Hermes Inspired | 1 | 3 | 3 | 3 | 5 | 7 |
| Prada L'Homme Inspired | 2 | 2 | 3 | 2 | 4 | 6 |
| Spicebomb Extreme Inspired | 3 | 1 | 5 | 5 | 2 | 8 |
| Layton Inspired | 4 | 2 | 5 | 4 | 3 | 9 |
| Ultra Male Inspired | 5 | 2 | 4 | 4 | 3 | 9 |
| Sauvage Elixir Inspired | 2 | 3 | 4 | 5 | 2 | 8 |
| Y EDP Inspired | 3 | 3 | 4 | 4 | 4 | 8 |
| Naxos Inspired | 4 | 2 | 5 | 4 | 2 | 8 |
| Side Effect Inspired | 4 | 2 | 4 | 4 | 2 | 8 |
| God Of Fire Inspired | 3 | 4 | 2 | 3 | 3 | 7 |
| Delina Inspired | 2 | 4 | 2 | 3 | 4 | 9 |
| Baccarat Rouge 540 Inspired | 3 | 3 | 4 | 4 | 4 | 9 |

**Calibration anchors per dimension:**

| Dimension | Score 1 | Score 3 (baseline) | Score 5 |
|---|---|---|---|
| `sweetness` | Sauvage, Aqua Di Gio, Terre D'Hermes — no sweetness | Eros, Spicebomb, Y EDP — moderate spiced or amber sweet | **Ultra Male** — pear/caramel/vanilla gourmand; the sweetness anchor |
| `freshness` | Spicebomb Extreme — no freshness | Sauvage Elixir, Aventus, Hacivat, Terre D'Hermes — moderate | Sauvage, Aqua Di Gio — dominant citrus/aquatic; the freshness anchors |
| `warmth` | Aqua Di Gio — cool, no warmth | Sauvage, Aventus, Y Inspired — balanced | **Layton, Spicebomb Extreme, Naxos** — amber/vanilla/tobacco; all three define maximum warmth via different routes |
| `intensity` | — | Bleu, Y, Terre D'Hermes, Prada L'Homme — moderate | **Spicebomb Extreme, Sauvage Elixir** — both define maximum intensity; Spicebomb via sheer projection, Sauvage Elixir via concentrated weight |
| `versatility` | Spicebomb Extreme, Sauvage Elixir, Naxos — specialist wear | Eros, Layton, Ultra Male, Aqua Di Gio — occasion focused | Sauvage, Bleu, Y, Y EDP, Terre D'Hermes — all-occasion range |

**Calibration notes for EP19-P2 anchors:**

- **Ultra Male Inspired (sweetness: 5)** — First sweetness: 5 record. The pear/caramel/vanilla combination places it at the top of the gourmand masculine range. Any future record that is sweeter than Ultra Male does not exist in this catalogue. Score relative to Ultra Male.
- **Sauvage Elixir Inspired (intensity: 5)** — Joins Spicebomb Extreme as the second intensity: 5 record. Sauvage Elixir reaches maximum intensity through concentrated weight and dry spice; Spicebomb Extreme reaches it through sheer projection force. Both are legitimate anchors for different reasons.
- **Naxos Inspired (warmth: 5)** — Third warmth: 5 record. Layton is amber/vanilla/sandalwood warmth; Spicebomb Extreme is tobacco/cinnamon/benzoin warmth; Naxos is honey/tobacco/tonka warmth. All three are genuinely at maximum warmth via distinct routes — the diversity of routes at the same score is correct.
- **Y EDP Inspired (warmth: 4, versatility: 4)** — Bridge record between the fresh designer signature tier (Y Inspired: warmth 3, versatility 5) and the richer amber tier (Layton: warmth 5, versatility 3). Calibrate future aromatic amber masculines between Y EDP and Layton on both dimensions.

**Calibration notes for EP19-P3 anchors:**

- **Side Effect Inspired (rum/tobacco warmth reference)** — The rum/tobacco/benzoin/vanilla oriental reference for the catalogue. warmth:4 (not 5) because the iris/heliotrope heart introduces a powdery-soapy quality that tempers the pure warmth relative to Naxos (honey/tobacco route, warmth:5). Future dark orientals with powdery notes calibrate against Side Effect. Future clean warm orientals calibrate against Naxos. The rum note appears as a free-form ingredient in notes[]; it is not in `fragranceFamilies.ts` and must never be used as a family value.
- **God Of Fire Inspired (tropical fruity luxury reference)** — The catalogue's first dedicated summer-tropical record. freshness:4 reflects vibrant fruity energy; warmth:2 confirms its summer, non-oriental character. Versatility:3 reflects its season-specific scope. Future fruity-woody records in the summer register calibrate against God Of Fire.
- **Delina Inspired (fresh feminine floral reference)** — The first Rose collection native record and the primary calibration anchor for feminine fragrances. sweetness:2 / freshness:4 / warmth:2 / intensity:3 establishes the baseline for modern fresh florals. Future Rose records calibrate against Delina on all five dimensions. Delina is also the editorial tone reference for Rose collection descriptions — read its description before authoring any Rose record.
- **Baccarat Rouge 540 Inspired (luxury unisex amber reference)** — The first unisex record in the Rose collection and the modern amber-floral standard for the catalogue. sweetness:3 and freshness:3 are both at population mean — intentional, reflecting the paradox that BR540 is simultaneously sweet and airy. warmth:4 and intensity:4 place it firmly in the rich-but-wearable range. Future unisex amber records calibrate against BR540. Future all-season, high-versatility records note that BR540 (versatility:4, popularity:9) is the benchmark for cross-occasion unisex signatures.

**Update this table** each time a new native record is committed. The table is permanent engineering state — it enables every future author to calibrate without reading all previous records.

---

## Editorial Standards

### Maison Voice

Maison Skye & Rose is luxury, modern, premium, minimal, and elegant. The editorial voice is:

- **Warm but precise** — knowledgeable, never academic
- **Specific over generic** — name the molecule, the note, the feeling
- **First-person discovery** — write as if the customer is experiencing the fragrance for the first time
- **Concise** — 2–4 sentences maximum for `description`; 1–2 for `mood`

### Description Formula

A strong description follows this structure:
1. **Opening** — the first impression; name the dominant top note and its character
2. **Heart** — how the fragrance evolves; what defines its character
3. **Dry-down** — the base; what lingers; the emotional impression it leaves

**Example (Sauvage Inspired):**
> "Sauvage Inspired captures the raw energy of Maison's most beloved masculine reference. A thunderclap of Calabrian Bergamot opens the composition — vivid, citrusy, and instantly recognisable. A peppery, aromatic heart of Lavender and Elemi bridges the freshness toward the dry-down, where Ambroxan takes over entirely. This molecule, responsible for the fragrance's magnetic character, blends with skin chemistry to produce a projection that feels personal rather than heavy."

### What to avoid

- Generic superlatives ("incredible", "amazing", "perfect")
- Subjective quality claims ("the best", "most luxurious")
- Any measurable performance claim — see the Performance Claim Policy below
- Copying marketing copy from the inspiration fragrance brand

---

### Collection-Specific Editorial Standards

Each collection has a distinct editorial identity. Write description and mood copy in the voice of its collection, not the voice of the inspiration brand.

---

#### Skye

**Editorial direction:** Confident. Modern. Versatile.

Skye is Maison's masculine collection. The Skye editorial voice is assured and direct — it describes the experience of wearing the fragrance, not its ingredients. Skye copy grounds the fragrance in real life: office, a date, a morning run. The vocabulary is contemporary masculine luxury.

**Writing principles:**
- Lead with the occasion or the emotion, not the note
- Use concrete masculine contexts: "the office on Monday", "crossing a crowded room", "the first cold evening of the year"
- Avoid superlatives and abstract luxury language
- Ambroxan, Cedar, Sandalwood — name the material and explain what it does
- One description should make a man reach for his wallet, not reach for a dictionary

**Gender default:** `"male"` unless the reference fragrance is marketed as officially unisex.

**`scentCharacter` in practice:**
- Dominant marine/citrus → `Fresh & Light`
- Clean fougère or versatile designer → `Balanced Signature`
- Amber/vanilla base, evening focus → `Rich & Long Wearing`
- Oud/tobacco/leather, specialist → `Deep & Intense`

---

#### Rose

**Editorial direction:** Elegant. Feminine. Expressive.

Rose is Maison's feminine collection. The Rose editorial voice is warm and expressive — it describes how the fragrance makes a woman feel, and where it belongs in her life. Rose copy is sensory and evocative without being precious. It respects the complexity of feminine fragrance: a Rose record can be both powerful and delicate.

**Writing principles:**
- Lead with mood or atmosphere: the first warm morning of spring, the intimacy of a quiet evening
- Feminine fragrances often reward the emotional impression as much as the olfactive one — write both
- Do not default to florals — gourmand, oriental, and aldehyde fragrances deserve equally expressive copy
- Use the extended vibe vocabulary freely: `Feminine`, `Sensual`, `Delicate`, `Flirtatious` are all valid
- Rose description should feel like a conversation between the author and the customer, not a product sheet

**Gender default:** `"female"` unless the reference fragrance is officially unisex (e.g., Baccarat Rouge 540 → `"unisex"`).

**`scentCharacter` in practice:**
- Bright citrus/white floral, effortless → `Fresh & Light`
- Classic chypre or balanced floral → `Balanced Signature`
- Gourmand/oriental, evening weight → `Rich & Long Wearing`
- Heavy oud/tobacco/leather → `Deep & Intense`

**Vibe selection for Rose:** Every Rose record should include at least 2 vibes from the Rose & Elite group (`Feminine`, `Sensual`, `Delicate`, `Flirtatious`) alongside universal vibes. A heavy oriental Rose record might be `Sensual, Mysterious, Bold, Romantic, Wealthy`. A light floral might be `Feminine, Delicate, Elegant, Playful, Clean`.

**Rose editorial reference records (EP19-P3 — first Rose native records):**

These two records serve as the editorial and calibration benchmarks for all future Rose migrations. Read both descriptions before authoring any Rose record.

- **Delina Inspired** — Modern feminine floral reference. Establishes the editorial tone for fresh, expressive Rose records: wearable elegance, confident femininity, floral-fruity freshness. Intelligence baseline: sweetness:2, freshness:4, warmth:2, intensity:3, versatility:4. The description demonstrates the Rose editorial voice for spring-summer florals: warm, personal, and grounded in real feminine experience rather than abstract luxury language.

- **Baccarat Rouge 540 Inspired** — Luxury unisex amber benchmark. The first unisex record in the Rose collection. Demonstrates how the Rose editorial direction (Elegant, Expressive, Sophisticated) applies even to gender:unisex records. Intelligence baseline: sweetness:3, freshness:3, warmth:4, intensity:4, versatility:4. The description demonstrates how to write for a culturally iconic fragrance: earned reverence, not marketing copy.

Future Rose records should position themselves relative to these two anchors when calibrating Intelligence scores and writing descriptions.

---

#### Elite

**Editorial direction:** Rare. Artistic. Luxury-first.

Elite is Maison's premium unisex collection. The Elite editorial voice is restrained and precise — it describes the fragrance as an object of art, not an accessory. Elite copy uses specialist vocabulary confidently (ambrette, orris, labdanum, oud) and trusts the customer to appreciate complexity.

**Writing principles:**
- Fewer, more deliberate sentences — one strong paragraph is more elite than three adequate ones
- Name the raw material and its origin when known: Haitian Vetiver, Turkish Rose, Tasmanian Pepper
- Do not explain what the fragrance is for — Elite customers know fragrance. Describe the experience instead
- Elite records often have lower `versatility` scores (2–3) — specialist wear is a feature, not a limitation
- The absence of sweetness or familiarity is often intentional — honour that in copy

**Gender default:** `"unisex"` for all Elite records unless a specific gender target is editorial intent.

**Vibe selection for Elite:** Focus on the rare and specialist end of the vocabulary: `Mysterious`, `Sophisticated`, `Old Money`, `Bold`, `Luxury`. Avoid populist vibes (`Playful`, `Modern`) unless the fragrance genuinely earns them.

---

### Performance Claim Policy

**Maison Skye & Rose does not make measurable performance claims about any fragrance. This is a permanent editorial standard.**

Do not state or imply:

- How many hours a fragrance lasts
- Projection distance or sillage radius
- Room-filling ability or detection range
- Comparative longevity against other fragrances

Specific phrases to avoid: *"lasts all day"*, *"hours after application"*, *"fills a room"*, *"long-lasting"*, *"strong sillage"*, *"lingers for hours after you've left"*, *"still going strong after X hours"*.

**What to write instead:**

Guide customers through the experience — the character of the fragrance, the moments and occasions it suits, the way it feels to wear, and when it is most at home. When a fragrance rewards close wearing, say so. When it suits evenings over offices, say so. When reapplication is part of the ritual, offer it as guidance rather than a performance correction.

The `projection` field in Classification is descriptive context for the similarity engine and the Concierge — it describes the character of the fragrance's presence, not a guarantee of distance. Do not echo it as a marketing claim in editorial copy.

**Why this policy exists:**

Performance is personal. Skin chemistry, humidity, application method and clothing all affect how a fragrance behaves. Claims that set measurable expectations create outcomes Maison cannot guarantee and customers cannot reproduce. The goal of editorial copy is to help the customer choose the right fragrance for their life — not to make promises about how it will perform on theirs.

---

## Vocabulary Governance

Vocabulary files are governed assets. They are not open lists — every entry must serve a clear authoring purpose and be validated by the validator against actual records.

### Governed files

| File | Purpose |
|---|---|
| `app/data/fragranceVibes.ts` | Approved vibe values for native record `vibe[]` field |
| `app/data/fragranceOccasions.ts` | Approved occasion values for native record `occasions[]` field |
| `app/data/fragranceFamilies.ts` | Approved family values for native record `family[]` field |

### Approved vocabulary (current state)

**Vibes (19 entries):**
```
Universal: Luxury, Confident, Powerful, Sexy, Professional, Clean, Elegant,
           Playful, Mysterious, Romantic, Bold, Sophisticated, Modern, Wealthy, Old Money

Rose & Elite: Feminine, Sensual, Delicate, Flirtatious
```

**Occasions (9 entries):**
```
Daily Wear, Office, Date Night, Weekend, Evening,
Vacation, Wedding, Summer Days, Winter Evenings
```

**Families (19 entries):**
```
Fresh, Aquatic, Citrus, Woody, Aromatic, Amber, Sweet, Gourmand, Floral,
White Floral, Rose, Vanilla, Leather, Tobacco, Oud, Musk, Powdery, Spicy, Fruity
```

### Deprecated values

None currently. When a value is deprecated:
1. It is removed from the vocabulary file
2. Existing records that use it are updated in the same commit
3. The removal and reason are noted here

### Proposing new vocabulary

New vocabulary entries are proposed when:
- An author encounters a fragrance character not expressible with current vocabulary
- At least 3 upcoming records would use the new term
- The term is not synonymous with an existing approved term

**Proposal process:**
1. Identify the gap and draft the proposed term
2. Confirm it is not covered by existing vocabulary
3. Add to the appropriate vocabulary file (`fragranceVibes.ts`, `fragranceOccasions.ts`, or `fragranceFamilies.ts`)
4. Update this governance section and the approved vocabulary lists above
5. Include it in the same commit as the first record that uses it

**Do not** use unapproved values in native records — the validator will not catch vocabulary violations, but they create inconsistency in the discovery engine and Concierge retrieval.

---

## Validation Workflow

Every native record must pass the quality gate before being committed.

```bash
# After filling in all fields
npm run mkc:validate

# Expected output for a complete record
✓  Fragrance Name  (fragrance-slug)
   Status: PASS  |  Errors: 0  |  Warnings: 0
```

### Validation groups and what they check

| Group | Errors on | Warnings on |
|---|---|---|
| Identity | missing id/slug/name/brand, slug mismatch | missing status, catalogVersion |
| Classification | invalid gender/character/projection, unknown family vocabulary | — |
| Composition | missing profile/season/mood, < 2 notes per tier | — |
| Editorial | missing subtitle/description/signatureStyle | missing academyArticleIds, educationTags, learningPath |
| Discovery | vibe < 3, occasions < 2, recommendedFor < 2, empty seasons | — |
| Intelligence | any score out of range, invalid longevitySignal value | — |
| Commerce | price ≤ 0, missing image path, non-boolean bestSeller/newArrival | — |

### Status meanings

| Status | Meaning |
|---|---|
| `PASS` | Record is complete and correct — safe to commit |
| `PASS_WITH_WARNINGS` | Record is valid but missing optional editorial richness |
| `FAIL` | Record has one or more errors — do not commit |

---

## Migration Workflow

The native knowledge migration proceeds one record at a time.

```bash
# 1. Scaffold the record
npm run mkc:new -- "Bleu de Chanel Inspired"

# 2. Open the generated file
#    app/lib/mkc/native/bleu-de-chanel-inspired.ts

# 3. Fill in every field using the field reference above

# 4. Validate
npm run mkc:validate

# 5. Fix any errors until PASS

# 6. Commit
git add app/lib/mkc/native/bleu-de-chanel-inspired.ts app/lib/mkc/native/index.ts
git commit -m "Add native knowledge record: Bleu de Chanel Inspired"
```

**Commit scope:** One fragrance per commit. Include only the record file and `native/index.ts`. No other files should be modified.

**Priority order:** Start with bestsellers (`bestSeller: true`), then new arrivals, then the rest of the catalogue in collection order (Skye → Rose → Elite).

---

## Architecture Reference

```
app/lib/mkc/
├── types.ts              — FragranceKnowledge type definition
├── catalogue.ts          — Hybrid loader (native-first, adapter fallback)
├── validator.ts          — Quality gate (7 validation groups)
├── templates/
│   └── fragrance-template.ts  — Canonical authoring template
└── native/
    ├── index.ts          — Native record registry (Map<slug, record>)
    ├── sauvage-inspired.ts
    └── ...               — One file per native record

scripts/
└── mkc-scaffold.ts       — Scaffold generator

validate-native-records.ts  — Validation runner

docs/
└── mkc-authoring-guide.md  — This document
```

The hybrid catalogue loader in `catalogue.ts` checks `nativeFragrances.get(slug)` first. If a native record exists, it is used directly — bypassing the adapter. Otherwise, the fragrance hydrates via the legacy adapter. This means every native record replaces the adapter output immediately upon registration, with zero changes to any consumer.
