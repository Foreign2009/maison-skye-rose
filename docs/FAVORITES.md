# Favorites

**Project:** Maison Skye & Rose
**Related:** [docs/CART.md](CART.md) · [docs/MINICART.md](MINICART.md)

---

## Purpose

The favorites system allows customers to save fragrances for later reference. Favorites persist across sessions via `localStorage` and are used to power personalized recommendations in the MiniCart.

---

## Architecture

**File:** `app/context/FavoritesContext.tsx`

Implemented as a React Context with a Provider in `app/layout.tsx` (the outermost provider in the tree).

Context type:

```ts
type FavoritesContextType = {
  favorites: FavoriteProduct[];
  addToFavorites: (product: FavoriteProduct) => void;
  removeFromFavorites: (title: string) => void;
  clearFavorites: () => void;
  isFavorite: (title: string) => boolean;
};
```

---

## FavoriteProduct Type

```ts
type FavoriteProduct = {
  title: string;
  subtitle?: string;
  mood?: string;
  profile?: string;
  season?: string[];
  notes?: string[];
  prices?: { "5ml": number; "10ml": number; "30ml": number };
  images?: { "5ml": string; "10ml": string; "30ml": string };
  image?: string;
  bestSeller?: boolean;
  newArrival?: boolean;
};
```

All fields except `title` are optional — this allows the context to be used with varying levels of product data richness. `title` is the unique identifier for favorites operations.

---

## Identifier

Favorites are keyed by `title` (product name). This means:

- `isFavorite(title)` — `favorites.some((item) => item.title === title)`
- `addToFavorites` — no-op if a product with the same title already exists
- `removeFromFavorites(title)` — removes all entries with matching title

There is no numeric ID or slug used as the favorites key — only the display title.

---

## Persistence

### Load (on mount)

```ts
useEffect(() => {
  try {
    const storedFavorites = localStorage.getItem("maison-skye-rose-favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  } catch (error) {
    console.error("Failed to load favorites", error);
  } finally {
    setIsInitialized(true);
  }
}, []);
```

### Save (on favorites change)

```ts
useEffect(() => {
  if (!isInitialized) return;  // Hydration guard
  localStorage.setItem("maison-skye-rose-favorites", JSON.stringify(favorites));
}, [favorites, isInitialized]);
```

**Hydration guard:** The `isInitialized` flag ensures favorites are not overwritten with an empty array during Next.js client-side hydration before `localStorage` has been read.

**localStorage key:** `maison-skye-rose-favorites`

---

## Known Safeguards

1. **Hydration guard** — `isInitialized` prevents blank overwrite (same pattern as CartContext)
2. **Duplicate prevention** — `addToFavorites` checks for existing title before inserting:
   ```ts
   const exists = prev.some((item) => item.title === product.title);
   if (exists) return prev;
   ```
3. **try/catch on load** — graceful error handling if `localStorage` is unavailable or contains corrupted JSON
4. **Functional state updates** — `setFavorites((prev) => ...)` ensures updates are based on the latest state, not stale closures

---

## Business Logic

- No limit on number of favorites
- Adding the same product twice is a no-op (not an error)
- Removing a product that is not in favorites is a no-op (filter returns the original array)
- Favorites do not affect pricing, cart totals, or rewards
- Favorites are used by MiniCart to generate "From Your Favorites" recommendations (products in favorites not in cart)

---

## UI Integration

### ProductCard

Every `ProductCard` shows a heart button:

```tsx
<button onClick={handleFavorite} className="absolute left-2 md:left-4 top-2 md:top-4 ...">
  <Heart className="h-4 w-4 md:h-[18px] md:w-[18px]" fill={favorite ? "currentColor" : "none"} />
</button>
```

- Heart is filled when `isFavorite(title)` is true
- Clicking toggles: removes if favorite, adds if not
- The product shape stored in favorites includes all relevant display data

### FavoritesHome (Homepage)

`app/components/FavoritesHome.tsx` shows up to 4 saved favorites on the homepage. It cross-references `favorites` titles against the `fragrances` array to get the full product data:

```ts
const favoriteProducts = useMemo(
  () => fragrances.filter((fragrance) =>
    favorites.some((item) => item.title === fragrance.title)
  ).slice(0, 4),
  [favorites]
);
```

Returns `null` (renders nothing) if there are no favorites.

### Favorites Page

`app/favorites/page.tsx` — full list of saved favorites. TODO: Read this page if documentation of its layout is needed.

### MiniCart Recommendations

`MiniCart.tsx` uses favorites to generate recommendations:

```ts
const favoriteRecommendations = useMemo(
  () => fragrances
    .filter((fragrance) =>
      favorites.some((fav) => fav.title === fragrance.title) &&
      !cart.some((item) => item.title === fragrance.title)
    )
    .slice(0, 3),
  [favorites, cart]
);
```

Shows up to 3 favorites not already in the cart.

---

## Context Optimization

- All mutation functions wrapped in `useCallback`
- `isFavorite` wrapped in `useCallback` (depends on `favorites`)
- Context value object wrapped in `useMemo` to prevent new object references on unrelated renders

---

## Important Files

| File | Role |
|---|---|
| `app/context/FavoritesContext.tsx` | Favorites state and persistence |
| `app/components/ProductCard.tsx` | Heart button UI |
| `app/components/FavoritesHome.tsx` | Homepage favorites section |
| `app/components/MiniCart.tsx` | "From Your Favorites" recommendations |
| `app/favorites/page.tsx` | Full favorites listing page |
