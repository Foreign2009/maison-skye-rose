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
| `"Rich & Full-Bodied"` | Amber/spice/vanilla base; noticeable sillage; occasion-appropriate weight |
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
| Imagination Inspired | 1 | 4 | 2 | 2 | 4 | 4 |
| Stronger With You Inspired | 4 | 2 | 4 | 3 | 3 | 6 |
| Oud Wood Inspired | 1 | 1 | 4 | 4 | 2 | 5 |
| Invictus Inspired | 2 | 4 | 2 | 3 | 5 | 8 |
| Le Male Elixir Inspired | 5 | 1 | 5 | 4 | 2 | 7 |
| 1 Million Inspired | 3 | 2 | 4 | 4 | 3 | 9 |
| Hawas Inspired | 3 | 4 | 2 | 4 | 4 | 6 |
| 9PM Inspired | 4 | 2 | 4 | 3 | 2 | 5 |
| Stronger With You Intensely Inspired | 4 | 1 | 5 | 4 | 2 | 5 |
| Le Beau Paradise Garden Inspired | 4 | 3 | 2 | 2 | 3 | 4 |
| Azzaro Most Wanted Inspired | 4 | 1 | 4 | 3 | 3 | 5 |
| Valentino Uomo Born In Roma Inspired | 1 | 3 | 3 | 2 | 5 | 5 |
| MYSLF Inspired | 1 | 3 | 2 | 2 | 5 | 5 |
| Acqua Di Gio Profondo Inspired | 1 | 4 | 2 | 4 | 3 | 5 |
| Acqua Di Gio Parfum Inspired | 1 | 3 | 3 | 4 | 3 | 6 |
| Prada Luna Rossa Carbon Inspired | 1 | 4 | 2 | 3 | 4 | 5 |
| Invictus Victory Inspired | 4 | 1 | 4 | 4 | 2 | 5 |
| Armani Code Parfum Inspired | 2 | 2 | 4 | 3 | 3 | 6 |

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

**Calibration notes for EP20-P1 anchors:**

- **Imagination Inspired (fresh through elegance reference)** — The catalogue's quiet luxury fresh masculine. freshness:4 and intensity:2 together define the close-wearing, intimate fresh tier — distinct from Invictus (freshness:4, intensity:3) which is fresh through energy. Future soft fresh masculines calibrate against Imagination on intensity. sweetness:1 and warmth:2 confirm a purely clean, zero-sweet orientation.
- **Stronger With You Inspired (aromatic spice sweet reference)** — sweetness:4 and warmth:4 via chestnut/cinnamon/vanilla route, compared to Layton's lavender/amber route at the same tier. The key distinction is intensity:3 vs Layton's intensity:4 — Stronger With You is approachable where Layton is authoritative. Bridge record between the moderate warm tier (Y EDP: warmth:4) and the maximum warm tier (Layton: warmth:5).
- **Oud Wood Inspired (specialist oud reference)** — First dedicated oud record. sweetness:1 and freshness:1 set the floor for the dry woody-spice character. warmth:4 via amber/tonka/sandalwood route — drier than Layton (warmth:5) because the oud brings resinous depth without vanilla sweetness. versatility:2 anchors the specialist-occasion tier for oud records; future oud fragrances calibrate against this baseline.
- **Invictus Inspired (high-versatility fresh masculine reference)** — versatility:5 in the fresh register, alongside Sauvage and Bleu De Chanel in the all-occasion tier. The distinction: Invictus achieves versatility within its seasonal range (Spring/Summer) rather than across all seasons. intensity:3 and popularity:8 position it as the mainstream fresh masculine anchor alongside Aqua Di Gio (popularity:8, intensity:2).

**Calibration notes for EP20-P2 anchors:**

- **Le Male Elixir Inspired (honey sweetness reference)** — Second sweetness:5 record alongside Ultra Male. Different route: honey/iris/powdery vs Ultra Male's pear/caramel/gourmand. Also the fourth warmth:5 record, adding the honey/tonka/sandalwood route to Layton (amber/vanilla), Spicebomb Extreme (tobacco/cinnamon/benzoin), and Naxos (honey/tobacco). Future warm honey fragrances calibrate against Le Male Elixir; future gourmand masculines calibrate against Ultra Male. versatility:2 confirms the occasion-specific ceiling for sweet oriental masculines.
- **1 Million Inspired (leather-spice statement reference)** — The catalogue's leather masculine anchor. sweetness:3 despite warm amber character because leather introduces dryness that tempers what the amber contributes — same sweetness tier as Y EDP and Eros, via different route. warmth:4 via leather route: drier than Layton's amber/vanilla warmth (5) but distinctly warmer than balanced aromatics. popularity:9 reflects global bestseller status — one of the world's most purchased masculines.
- **Hawas Inspired (fresh aquatic with projection reference)** — intensity:4 in the fresh register is the notable calibration signal. Invictus (intensity:3) is the comparison: same freshness:4, but Hawas projects more assertively. sweetness:3 from apple accord distinguishes it from Invictus (sweetness:2) and Aqua Di Gio (sweetness:1). Establishes that fresh fragrances can reach intensity:4 when projection is a documented characteristic of the reference.
- **9PM Inspired (sweet nightlife amber reference)** — sweetness:4 via apple/tonka/vanilla route, same tier as Stronger With You (sweetness:4) via chestnut/cinnamon route. The key distinction is versatility:2 vs SWY's versatility:3 — 9PM is a dedicated night-out masculine, SWY has broader autumn/winter range. popularity:5 is intentional: value-tier brand with community awareness but without mainstream designer recognition. Future accessible amber masculines calibrate against 9PM on the versatility/popularity axes.

**Calibration notes for EP20-P3 anchors:**

- **Stronger With You Intensely Inspired (amber evening evolution reference)** — Paired with Stronger With You (sweetness:4, warmth:4, intensity:3, versatility:3) to model the original-to-intensely progression: same sweetness tier, warmth escalates from 4→5, intensity escalates from 3→4, versatility contracts from 3→2. This is the fifth route to warmth:5, adding the apple/iris/vanilla/amber route alongside Layton (amber/sandalwood), Spicebomb Extreme (tobacco/benzoin), Naxos (honey/tobacco), and Le Male Elixir (honey/tonka). When a customer wants the next step from Stronger With You, these score differences explain the recommendation precisely.
- **Le Beau Paradise Garden Inspired (tropical sweet summer benchmark)** — The catalogue's soft tropical sweet masculine. sweetness:4 in a fresh/summer frame is unusual — compare with Hawas (sweetness:3, intensity:4, bold projection) and God of Fire (sweetness:3, tropical mango energy). Le Beau Paradise Garden is sweeter than both with lower intensity (intensity:2) — intimate rather than projecting. The coconut/fig/tonka tropical route to sweetness:4. `newArrival: true` preserved from production data; update when status changes.
- **Azzaro Most Wanted Inspired (dark amber gourmand benchmark)** — The toffee-hazelnut amber reference. Calibrate against 1 Million (sweetness:3, intensity:4, leather route — bold, theatrical) and 9PM (sweetness:4, intensity:3, versatility:2 — dedicated nightlife). Most Wanted occupies the space between: sweetness:4 via savory-toffee route, intensity:3 (intimate, not projecting), versatility:3 (broader autumn/winter range than 9PM). The correct distinction: Most Wanted seduces through proximity; 1 Million announces from a distance.
- **Valentino Uomo Born In Roma Inspired (green aromatic all-season benchmark)** — The Italian aromatic counterpart to Terre D'Hermès (earthy mineral) and Prada L'Homme (powdery soft). All three sit at intensity:2 with versatility 4–5; differentiation is through note character: Terre D'Hermès is mineral/orange peel, Prada L'Homme is iris/cedar powdery, Born in Roma is violet leaf/sage/vetiver green. Born in Roma extends the all-occasion soft-projection tier (intensity:2, versatility:5) that Imagination Inspired established for fresh masculines — proving that versatility is earned through character, not volume, across both fresh and aromatic families.

**Calibration notes for EP20-P4 anchors (Wave 2 completion):**

- **MYSLF Inspired (modern clean floral masculine benchmark)** — The sixth versatility:5 masculine in the catalogue, alongside Sauvage, Bleu De Chanel, Y, Terre D'Hermes, and Born in Roma. Each earns versatility:5 through all-occasion neutrality via a different route; MYSLF's route is orange blossom/amberwood/musk — modern, airy, contemporary floral. Distinct from Born in Roma (sweetness:1, freshness:3, warmth:3 — Italian green-aromatic via violet leaf/sage/vetiver) and Prada L'Homme (sweetness:2, warmth:3, powdery iris): MYSLF is warmer:2 (amberwood is lighter than vetiver/patchouli) and reads as contemporary rather than classic. All three are intensity:2, versatility achievers via restraint. sweetness:1 despite floral heart: orange blossom here is white-floral clean, not honeyed.
- **Acqua Di Gio Profondo Inspired (mineral aquatic benchmark)** — Establishes the ADG lineage calibration step-model: Aqua Di Gio (freshness:5, intensity:2 — breezy classic) → Profondo (freshness:4, intensity:4 — mineral dark) → Parfum (freshness:3, warmth:3, intensity:4 — incense elevated). Each step adds depth and presence at the cost of pure freshness. Profondo shares intensity:4 and freshness:4 with Hawas — the same coordinate pair reached via entirely different routes: Hawas via fruity-aquatic (apple/jasmine), Profondo via mineral/sea (geological weight without sweetness). Future dark aquatics calibrate against Profondo; future bold fresh masculines calibrate against both Hawas and Profondo as the two legitimate intensity:4 fresh reference points.
- **Acqua Di Gio Parfum Inspired (aquatic-incense transition benchmark)** — The incense transformation of the ADG lineage. freshness:3 (population mean) reflects marine character tempered by incense heart: the aquatic DNA is still present but no longer dominant. warmth:3 from incense/patchouli/amber — same warmth tier as Terre D'Hermes (earthy mineral route) but entirely different texture: Parfum is Mediterranean incense/maritime, Terre D'Hermes is dry mineral/orange peel. Both sit at warmth:3 via architecturally different constructions. Future incense-fresh masculines calibrate against Parfum (warmth:3, intensity:4). popularity:6 reflects the elevated positioning above mainstream ADG awareness.
- **Prada Luna Rossa Carbon Inspired (metallic aromatic benchmark)** — The synthetic-modern interpretation of freshness:4, distinct from Y Inspired (freshness:4 via bergamot/ginger/fern — classic aromatic) and Bleu De Chanel (freshness:4 via citrus/vetiver — timeless clean). Carbon's lavender/ambroxan/charcoal route is the contemporary-technical fresh: cooler, more synthetic, metallic in character. Compare with Prada L'Homme (sweetness:2, freshness:2, warmth:3, intensity:2, versatility:4) — same house, entirely different register: L'Homme is powdery-intimate, Carbon is metallic-projecting. intensity:3 from ambroxan sits above the soft-projection tier without reaching bold projection. versatility:4 (not 5): the metallic character suits modern-casual occasions more naturally than formal or traditional settings.
- **Invictus Victory Inspired (winter amber athletic benchmark)** — The full seasonal inversion of the Invictus lineage: Invictus (sweetness:2, freshness:4, warmth:2, intensity:3, versatility:5 — aquatic champion) vs Victory (sweetness:4, freshness:1, warmth:4, intensity:4, versatility:2 — warm amber champion). No dimension overlaps. Victory reaches intensity:4 in the sweet amber tier — the highest projected sweet masculine in the catalogue alongside SWY Intensely (sweetness:4, intensity:4) and 1 Million (sweetness:3, intensity:4). The pink pepper/cardamom spice distinguishes Victory from 9PM (sweetness:4, intensity:3, versatility:2 — softer sweet amber) at the same sweetness tier. Future winter amber masculines with spiced openings calibrate against Victory's spice-sweetness balance.
- **Armani Code Parfum Inspired (refined woody evening benchmark)** — The evening-focused woody aromatic in the catalogue. Calibration position between Y EDP (warmth:4, intensity:4, versatility:4 — daytime versatile aromatic) and Oud Wood (warmth:4, intensity:4, versatility:2 — specialist oud). Code Parfum is warmth:4, intensity:3, versatility:3 — more occasion-focused than Y EDP, more accessible than Oud Wood. warmth:4 via guaiac wood/sandalwood/amber: the smoky-dry route, drier than Layton's amber/vanilla (warmth:5) and less sweet than most warmth:4 records. sweetness:2 reflects iris/violet leaf dryness tempering tonka — the same sweetness tier as Prada L'Homme (powdery), MYSLF (floral-clean), and Sauvage Elixir (dry spice), confirming that warmth:4 does not require sweetness. Future restrained evening woody aromatics calibrate against Code Parfum at intensity:3.

**Wave 2 Completion Note:** EP20-P4 closes all 18 Wave 2 records. Skye native coverage is now 37/48 (~77%). The full Wave 2 ADG lineage (Aqua Di Gio → Profondo → Parfum) is natively authored and calibrated as a step-model. The Prada masculine pair (L'Homme → Luna Rossa Carbon) and the Invictus line (Invictus → Victory) are fully represented with relationship context in their native records. Wave 3 (Rose collection) is the recommended next migration phase.

**Update this table** each time a new native record is committed. The table is permanent engineering state — it enables every future author to calibrate without reading all previous records.

---

## Relationship Graph

The Relationship Graph is a structured part of the Maison Knowledge Catalogue. It captures editorial knowledge about how fragrances connect to each other — not scoring or ranking, but context.

Relationships answer questions like:
- What evolved from this fragrance?
- What belongs beside this in a wardrobe?
- What serves a similar role for a customer with different preferences?

Relationships must never imply one fragrance is objectively better than another. They represent editorial reasoning, not hierarchy.

---

### Relationship Model

The canonical relationship model for MKC v1 is:

```typescript
relationships?: {
  evolutionOf?:      string;    // slug of the direct predecessor in this fragrance line
  evolutions?:       string[];  // slugs of fragrances that evolved FROM this record
  alternatives?:     string[];  // slugs of comparable alternatives in a similar register
  wardrobePartners?: string[];  // slugs recommended to own alongside this fragrance
};
```

The `relationships` field is optional. Records without editorial relationships simply omit it. Sparse, accurate knowledge is preferable to dense but questionable links.

---

### Field Definitions

**`evolutionOf`** (string, optional)

This fragrance is a direct development of another fragrance in the same line. The relationship is directional: Sauvage Elixir evolved FROM Sauvage.

Use when: the reference fragrance is a stronger, richer, or reformulated version within the same house/line — not just thematically similar. The connection must be unmistakable.

Example: `evolutionOf: "sauvage-inspired"` on the Sauvage Elixir record.

---

**`evolutions`** (string[], optional)

Other fragrances that evolved FROM this record. The directional counterpart to `evolutionOf`.

Use when: one or more other native records are known evolutions of this fragrance. Always populate `evolutions` when the downstream record has `evolutionOf` pointing here.

Example: `evolutions: ["sauvage-elixir-inspired"]` on the Sauvage record.

---

**`alternatives`** (string[], optional)

Comparable native records that serve a similar role for a customer with different preferences. The relationship is non-directional — both records should list each other.

Use when: two fragrances serve the same customer need through genuinely different routes (different house, different note character, or different aesthetic). The customer would realistically choose one or the other.

Do NOT use for fragrances that are merely in the same family or have overlapping Intelligence scores. The editorial question is: "would a customer deciding between these two choose based on preference rather than need?"

Example: `alternatives: ["prada-luna-rossa-carbon-inspired"]` on Prada L'Homme, reflecting that both are Prada masculines for the all-season professional register via entirely different note routes.

---

**`wardrobePartners`** (string[], optional)

Native records recommended to own alongside this fragrance. The relationship is non-directional and both records should list each other.

Use when: two fragrances complement each other in a complete wardrobe — most commonly a seasonal pair (summer + winter expression of the same energy) or an occasion pair (daytime + evening within the same register).

Do NOT use for fragrances that are merely aesthetically compatible. The editorial question is: "would a customer who owns one naturally want to own the other?"

Example: `wardrobePartners: ["invictus-victory-inspired"]` on Invictus Inspired, reflecting that the fresh summer champion and its winter amber evolution are the natural seasonal pair.

---

### Authoring Rules

**Only author relationships between native records.** Never reference an adapter-only record in a relationship field. If the target slug is not in `app/lib/mkc/native/index.ts`, omit the relationship.

**Preserve symmetry.** If Record A has `alternatives: ["record-b"]`, then Record B must have `alternatives: ["record-a"]`. If Record A has `wardrobePartners: ["record-b"]`, then Record B must have `wardrobePartners: ["record-a"]`. If this symmetry cannot be maintained, reconsider the relationship.

**`evolutionOf` and `evolutions` are directional and always reciprocal.** If Record B has `evolutionOf: "record-a"`, then Record A must have `evolutions: ["record-b"]`.

**Do not introduce relationships merely to increase graph density.** A record with zero relationships is correct if no genuine editorial relationship exists for it among current native records. Do not link records that happen to have similar Intelligence scores — that is what the Intelligence fields are for.

**Do not imply quality hierarchy.** Relationships state connections, not rankings. An `evolutionOf` relationship means "same line, developed" not "better than." An `alternatives` relationship means "serves a similar need differently" not "inferior to."

**Limit relationship fields to what the data can support.** A fragrance can appear in multiple relationship categories only when each is genuinely justified. Invictus appears in both `evolutions` and `wardrobePartners` for Victory because Victory is both an evolutionary development AND a seasonal complement — both are justified independently.

---

### When NOT to Create a Relationship

- The target record is adapter-only (not in the native registry)
- The connection is based only on shared Intelligence scores or fragrance families
- The editorial justification requires reading about the brand or reference fragrance rather than the MKC records themselves
- The relationship would need to be explained in a way that implies one fragrance is better, more authentic, or more prestigious than another
- The relationship is speculative — "these might pair well" rather than "a customer who owns one would naturally want the other"

---

### EP21-P1 Authored Relationships

As of EP21-P1, relationships have been authored for 21 of 37 native records. The remaining 16 records have no editorial relationships with currently native records.

**Evolution chains:**

| Predecessor | Evolution(s) |
|---|---|
| Sauvage Inspired | Sauvage Elixir Inspired |
| Y Inspired | Y EDP Inspired |
| Stronger With You Inspired | Stronger With You Intensely Inspired |
| Invictus Inspired | Invictus Victory Inspired |
| Aqua Di Gio Inspired | Acqua Di Gio Profondo Inspired, Acqua Di Gio Parfum Inspired |

**Alternatives (bidirectional):**

| Pair | Rationale |
|---|---|
| Acqua Di Gio Profondo ↔ Acqua Di Gio Parfum | Parallel evolutions of the same ADG lineage — mineral summer vs incense elevated |
| Prada L'Homme ↔ Prada Luna Rossa Carbon | Two Prada masculines: powdery-intimate vs metallic-contemporary |
| 1 Million Inspired ↔ Azzaro Most Wanted Inspired | Dark amber register: leather-theatrical vs toffee-intimate |
| MYSLF Inspired ↔ Valentino Uomo Born In Roma Inspired | Both versatility:5 all-season aromatics via different note routes |
| Layton Inspired ↔ Naxos Inspired | Both warmth:5 winter luxury masculines via different routes |

**Wardrobe Partners (bidirectional):**

| Pair | Rationale |
|---|---|
| Invictus Inspired ↔ Invictus Victory Inspired | Seasonal pair: fresh summer champion + warm winter amber |
| Hawas Inspired ↔ Le Beau Paradise Garden Inspired | Summer wardrobe pair: bold fresh aquatic + intimate tropical sweet |

---

### Graph Validation (EP21-P2)

Relationship graph validation is an official quality gate of the Maison Knowledge Catalogue. A record is not considered fully valid unless both its per-record data and its graph relationships are valid. Graph integrity is equal in importance to editorial integrity.

Validation runs automatically via `npm run mkc:validate` and `npm run mkc:coverage`. The `relationships` group is the eighth validation group in the MKC quality gate.

Records with no `relationships` field automatically PASS the relationships group. Validation only runs checks when relationship fields are present.

---

#### Validation Rules

**Rule 1 — Slug must exist in native registry**

Every slug referenced in any relationship field must be a registered key in `app/lib/mkc/native/index.ts`.

Error code: `RELATIONSHIP_SLUG_NOT_FOUND`

Message format: `"<source>" references "<target>" in <field> — slug does not exist in the native registry`

Common cause: the target record is adapter-only (not yet migrated to a native record), or a slug was mistyped.

---

**Rule 2 — Alternative relationships must be symmetric**

If Record A has `alternatives: ["record-b"]`, then Record B must have `alternatives: ["record-a"]`. The relationship must exist on both sides.

Error code: `RELATIONSHIP_ALTERNATIVES_NOT_RECIPROCAL`

Message format: `"<A>" lists "<B>" as an alternative, but "<B>" does not list "<A>" in its alternatives — alternative relationships must be symmetric`

Common cause: authoring one side of the pair and not updating the other record.

---

**Rule 3 — Wardrobe partner relationships must be symmetric**

If Record A has `wardrobePartners: ["record-b"]`, then Record B must have `wardrobePartners: ["record-a"]`. The relationship must exist on both sides.

Error code: `RELATIONSHIP_WARDROBE_PARTNERS_NOT_RECIPROCAL`

Message format: `"<A>" lists "<B>" as a wardrobePartner, but "<B>" does not list "<A>" in its wardrobePartners — wardrobe partner relationships must be symmetric`

Common cause: authoring one side of the pair and not updating the other record.

---

**Rule 4 — Evolution chains must be fully reciprocal (evolutionOf direction)**

If Record B has `evolutionOf: "record-a"`, then Record A must have `evolutions: ["record-b"]`.

Error code: `RELATIONSHIP_EVOLUTION_NOT_RECIPROCAL`

Message format: `"<B>" has evolutionOf: "<A>", but "<A>" does not list "<B>" in its evolutions — evolution chains must be fully reciprocal`

---

**Rule 5 — Evolution chains must be fully reciprocal (evolutions direction)**

If Record A has `evolutions: ["record-b"]`, then Record B must have `evolutionOf: "record-a"`.

Error code: `RELATIONSHIP_EVOLUTION_NOT_RECIPROCAL`

Message format: `"<A>" lists "<B>" in evolutions, but "<B>" does not have evolutionOf: "<A>" — evolution chains must be fully reciprocal`

---

**Rule 6 — Self-reference is not permitted**

No relationship field may reference the record's own slug.

Error code: `RELATIONSHIP_SELF_REFERENCE`

Message format: `"<slug>" lists itself in <field> — a fragrance cannot reference its own slug`

Common cause: copy-paste error when authoring.

---

**Rule 7 — Duplicate slugs within a field are not permitted**

No slug may appear more than once within the same relationship array (`evolutions`, `alternatives`, `wardrobePartners`).

Error code: `RELATIONSHIP_DUPLICATE_SLUG`

Message format: `"<slug>" appears more than once in <field> for record "<source>"`

Common cause: copy-paste error or accidentally adding a slug that was already present.

---

#### Expected Authoring Workflow

When adding a new relationship:

1. Author the relationship on Record A.
2. Navigate to Record B and add the reciprocal.
3. Run `npm run mkc:validate` to confirm both records PASS the relationships group.
4. If a `RELATIONSHIP_SLUG_NOT_FOUND` error appears, the target record is not yet native — remove the relationship until the target is migrated.

All errors are hard failures. There are no warnings in the relationships group. A failed relationships check fails the entire record.

---

#### What Graph Validation Does Not Enforce

Graph validation verifies structural integrity only. It does not verify:

- Whether the editorial reasoning behind a relationship is sound
- Whether two fragrances are genuinely complementary
- Whether an alternatives pair serves the same customer need
- Recommendation logic or Concierge behaviour

Editorial quality of relationships remains the author's responsibility. Graph validation preserves consistency; it does not replace judgment.

---

### Future Engineering

EP21-P2 (graph validation) is complete. Future engineering builds on this foundation:

- **EP21-P3 — Relationship Graph Services:** API layer for graph traversal, enabling Concierge and product pages to query fragrance relationships.
- **EP21-P4 — Concierge Graph Reasoning:** Concierge uses validated graph data to surface "evolved from," "pairs with," and "similar to" context in recommendations.
- **EP21-P5 — Wardrobe Graph Analysis:** Graph-aware wardrobe analysis to identify seasonal gaps and suggest partners based on what the customer already owns.

Future validation extensions that may be added in later sprints (out of scope for EP21-P2):
- Orphan detection (records no longer referenced by any other record)
- Disconnected graph detection (isolated records with no path to any other node)
- Circular evolution detection (A → B → A)
- Relationship coverage statistics

All future graph work should build on validated graph data rather than duplicate validation elsewhere.

---

## Graph Services (EP21-P3)

### Philosophy

Relationship data belongs to native records.
Relationship traversal belongs to `graph.ts`.

`graph.ts` is the only supported way to traverse the Relationship Graph programmatically. Future engineering — Concierge, product pages, wardrobe analysis — should consume graph services rather than reading `relationships` fields directly.

This separation exists because:

- Native records are authored once and change infrequently.
- Traversal logic (chain following, deduplication, graceful degradation) should not be duplicated across consumers.
- A stable service layer means the graph data model can evolve without breaking consumers.

---

### Service Architecture

Graph services are pure functions. There is no global state, no singleton, no runtime cache, and no import of `mkcCatalogue`.

Consumers own the lifecycle of the `FragranceIndex`. The typical pattern:

```typescript
import { mkcCatalogue }                       from "@/app/lib/mkc/catalogue";
import { buildIndex, getRelationshipSummary } from "@/app/lib/mkc/graph";

// Build once per page or component tree, then reuse.
const index   = buildIndex(mkcCatalogue);
const summary = getRelationshipSummary(record, index);
```

`buildIndex` is O(n) over the catalogue. All subsequent service calls are O(1) per slug lookup.

---

### Service Reference

**`buildIndex(records)`** → `Map<string, FragranceKnowledge>`

Builds a slug-to-record map. Call once per consumer.

---

**`getRelationshipSummary(record, index)`** → `RelationshipSummary`

The preferred consumer entry point. Returns all relationship types in a single typed call.

```typescript
interface RelationshipSummary {
  hasRelationships: boolean;
  evolutionOf:      FragranceKnowledge | null;
  evolutions:       FragranceKnowledge[];
  alternatives:     FragranceKnowledge[];
  wardrobePartners: FragranceKnowledge[];
  connected:        FragranceKnowledge[];   // deduplicated union of all types
  totalConnections: number;
}
```

All fields are typed and non-undefined. Records with no `relationships` field return `hasRelationships: false` with empty collections.

---

**`getEvolution(record, index)`** → `FragranceKnowledge | null`

Returns the direct predecessor (`evolutionOf`) or null.

---

**`getEvolutionChain(record, index)`** → `FragranceKnowledge[]`

Returns the full ancestor chain, ordered oldest to most recent. Does not include the record itself. Tolerates circular references and unresolved slugs via an internal visited-set. Returns `[]` for records with no ancestor.

---

**`getEvolutions(record, index)`** → `FragranceKnowledge[]`

Returns all direct evolution descendants. Returns `[]` when none defined.

---

**`getAlternatives(record, index)`** → `FragranceKnowledge[]`

Returns all alternative records. Returns `[]` when none defined.

---

**`getWardrobePartners(record, index)`** → `FragranceKnowledge[]`

Returns all wardrobe partner records. Returns `[]` when none defined.

---

**`getConnectedFragrances(record, index)`** → `FragranceKnowledge[]`

Returns all records connected by any relationship type, deduplicated. Ordering: ancestor → descendants → alternatives → wardrobe partners. Returns `[]` for records with no `relationships` field.

---

### Intended Consumer Pattern

Concierge and product pages should call `getRelationshipSummary` once per record and destructure what they need:

```typescript
const { hasRelationships, evolutionOf, alternatives, wardrobePartners } =
  getRelationshipSummary(record, index);

if (evolutionOf) {
  // surface "evolved from" context in the recommendation
}
if (alternatives.length > 0) {
  // offer alternatives when the primary recommendation is unavailable
}
```

Narrow queries (single relationship type) should use individual services only when the full summary would be wasteful.

---

### Graceful Degradation

All services degrade gracefully:

- Records with no `relationships` field return null, `[]`, or `false` as appropriate — never undefined, never errors.
- Unresolved slugs (target not in index) are silently skipped.
- The index may be built from any subset of the catalogue. Services only return records present in the provided index.

Graph services do not validate relationship correctness — that is the responsibility of `validator.ts` (EP21-P2).

---

### Future Engineering

EP21-P3 establishes the graph service foundation. Future sprints build on this layer:

- **EP21-P4 — Concierge Graph Integration:** Concierge uses `getRelationshipSummary` to surface "evolved from," "pairs with," and "alternatives" context in consultation responses.
- **EP21-P5 — Wardrobe Graph Analysis:** Graph-aware wardrobe analysis detects seasonal gaps and suggests wardrobe partners based on what the customer already owns.
- **EP21-P6 — Similarity Graph Services:** Extends the graph service layer with similarity and proximity queries using Intelligence field data alongside graph structure.
- **EP21-P7 — Relationship Explorer UI:** Product page or discovery component that surfaces relationship context visually.

All future graph work should consume `graph.ts` services rather than re-implementing traversal logic.

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
- Amber/vanilla base, evening focus → `Rich & Full-Bodied`
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
- Gourmand/oriental, evening weight → `Rich & Full-Bodied`
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
