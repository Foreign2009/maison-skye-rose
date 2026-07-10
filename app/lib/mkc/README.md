# Maison Knowledge Catalogue (MKC)

The Maison Knowledge Catalogue is the canonical fragrance data model for Maison Skye & Rose.

## Purpose

`FragranceKnowledge` (`types.ts`) is the single source of truth for all fragrance data.

It owns every known attribute of a fragrance, organised into eight logical groups:

| Group | What it covers |
|---|---|
| Identity | id, slug, brand, name, collection, catalogVersion, status |
| Classification | gender, family, scentCharacter, projection |
| Composition | profile, season, notes (top/heart/base), mood |
| Discovery | vibe, occasions, seasons, signatureStyle, recommendedFor |
| Merchandising | prices, images, bestSeller, newArrival, featured |
| Education | subtitle, description |
| Intelligence | sweetness, freshness, warmth, intensity, versatility, popularity |
| Relationships | evolutionOf, evolutions, alternatives, wardrobePartners |

## Architecture

Existing application models are projected from the canonical model via adapters.

```
Maison Knowledge Catalogue (FragranceKnowledge)
        |
        v
Display Adapter (toDisplayFragrance)
        |
        v
DisplayFragrance
        |
        v
UI (ProductCard, ProductDetail, Shop, Collections, Quiz)
```

```
Maison Knowledge Catalogue (FragranceKnowledge)
        |
        v
Recommendation Adapter (toRecommendationFragrance)
        |
        v
Fragrance
        |
        v
Recommendation Engine (recommendFragrances)
```

```
Maison Knowledge Catalogue (FragranceKnowledge)
        |
        v
Relationship Graph Services (graph.ts)
        |
        v
RelationshipSummary / FragranceKnowledge[]
        |
        v
Concierge (EP21-P4) / Wardrobe Analysis (EP21-P5) / Product Pages
```

## Relationship Graph

The `relationships?` field on `FragranceKnowledge` captures editorial knowledge about how fragrances connect to each other. It is authored in native records and validated by `validator.ts`.

**Relationship data belongs to native records.**
**Relationship traversal belongs to `graph.ts`.**

Consumers should not read `relationships` fields directly. Instead, build a `FragranceIndex` and call the graph services:

```typescript
import { mkcCatalogue }                       from "@/app/lib/mkc/catalogue";
import { buildIndex, getRelationshipSummary } from "@/app/lib/mkc/graph";

const index   = buildIndex(mkcCatalogue);
const summary = getRelationshipSummary(record, index);
```

`getRelationshipSummary()` is the preferred consumer entry point. It returns all relationship types in a single typed call, covering: evolution ancestor, evolution descendants, alternatives, wardrobe partners, and the deduplicated connected set.

Individual services (`getEvolution`, `getEvolutionChain`, `getEvolutions`, `getAlternatives`, `getWardrobePartners`, `getConnectedFragrances`) are available for narrower queries.

## Compatibility

`DisplayFragrance` and `Fragrance` remain the contracts for their respective layers.
Existing consumers (UI components, recommendation engine, analytics) are not modified
in this phase. Migration is a separate sprint.

The MKC introduces infrastructure only. No production behaviour changes.

## Files

| File | Purpose |
|---|---|
| `types.ts` | `FragranceKnowledge` canonical interface |
| `catalogue.ts` | Hydrated catalogue — exports `mkcCatalogue` |
| `graph.ts` | Relationship Graph Services — traversal and summary |
| `validator.ts` | Quality gate — per-record and cross-record validation |
| `wardrobeEngine.ts` | Wardrobe role computation |
| `merchandising.ts` | Merchandising copy generation |
| `displayAdapter.ts` | Projects `FragranceKnowledge` → `DisplayFragrance` |
| `recommendationAdapter.ts` | Projects `FragranceKnowledge` → `Fragrance` |
| `native/` | 37 native `FragranceKnowledge` records |
| `README.md` | This document |
