# Maison Knowledge Catalogue (MKC)

The Maison Knowledge Catalogue is the canonical fragrance data model for Maison Skye & Rose.

## Purpose

`FragranceKnowledge` (`types.ts`) is the single source of truth for all fragrance data.

It owns every known attribute of a fragrance, organised into seven logical groups:

| Group | What it covers |
|---|---|
| Identity | id, slug, brand, name, collection, catalogVersion, status |
| Classification | gender, family, scentCharacter, projection |
| Composition | profile, season, notes (top/heart/base), mood |
| Discovery | vibe, occasions, seasons, signatureStyle, recommendedFor |
| Merchandising | prices, images, bestSeller, newArrival, featured |
| Education | subtitle, description |
| Intelligence | sweetness, freshness, warmth, intensity, versatility, popularity |

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

## Compatibility

`DisplayFragrance` and `Fragrance` remain the contracts for their respective layers.
Existing consumers (UI components, recommendation engine, analytics) are not modified
in this phase. Migration is a separate sprint.

The MKC introduces infrastructure only. No production behaviour changes.

## Files

| File | Purpose |
|---|---|
| `types.ts` | `FragranceKnowledge` canonical interface |
| `displayAdapter.ts` | Projects `FragranceKnowledge` → `DisplayFragrance` |
| `recommendationAdapter.ts` | Projects `FragranceKnowledge` → `Fragrance` |
| `README.md` | This document |
