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
Luxury    Confident    Powerful    Sexy         Professional
Clean     Elegant      Playful     Mysterious   Romantic
Bold      Sophisticated  Modern    Wealthy      Old Money
```

**Common occasions:**

```
Daily Wear    Office    Date Night    Weekend    Vacation
Wedding       Evening   Summer Days   Winter Evenings
```

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
| `longevitySignal` | optional | `"moderate"` (4–6h) `"long"` (6–8h) `"exceptional"` (8h+); omit for average wearers |

**Calibration guidance:** Population average for all 1–5 fields is 3. Calibrate relative to the full catalogue, not just the fragrance in isolation. A `freshness: 5` means the strongest fresh fragrance in the catalogue.

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
- Promises about longevity, projection, or sillage outcomes — body chemistry varies
- Copying marketing copy from the inspiration fragrance brand

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
