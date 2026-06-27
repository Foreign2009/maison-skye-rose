# Search

**Project:** Maison Skye & Rose
**Related:** [docs/PRODUCT_DETAIL.md](PRODUCT_DETAIL.md)

---

## Purpose

Search allows customers to find fragrances by name, subtitle, mood description, scent profile, or fragrance notes without navigating through collections manually.

---

## Architecture

Search and filtering are implemented entirely client-side in `app/shop/page.tsx`. There is no server-side search endpoint. The `fragrances` array is imported directly and filtered in-memory.

**File:** `app/shop/page.tsx`

**Component:** `app/components/SearchBar.tsx` (controlled input)

---

## SearchBar Component

`app/components/SearchBar.tsx` is a simple controlled input:

```ts
type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};
```

It renders a styled `<input type="text">` with brand focus styling (`focus:border-[#d89ca4]`). It holds no state — state is managed by the parent page.

---

## Debouncing

Search input is debounced by 300ms to prevent filtering on every keystroke:

```ts
useEffect(() => {
  if (!search) {
    setDebouncedSearch("");  // Clears immediately — no delay on clear
    return;
  }
  const timer = setTimeout(() => {
    setDebouncedSearch(search);
  }, 300);
  return () => clearTimeout(timer);
}, [search]);
```

The `filtered` useMemo depends on `debouncedSearch`, not `search`. Clearing the input empties results immediately (no debounce on empty string).

---

## Filtering Logic

`useMemo` recomputes only when `debouncedSearch` or `currentFilter` changes:

```ts
const filtered = useMemo(() => {
  const searchTerm = debouncedSearch.toLowerCase();

  return fragrances.filter((item) => {
    const matchesSearch =
      !searchTerm ||
      item.title.toLowerCase().includes(searchTerm) ||
      item.subtitle?.toLowerCase().includes(searchTerm) ||
      item.mood?.toLowerCase().includes(searchTerm) ||
      item.profile?.toLowerCase().includes(searchTerm) ||
      item.notes?.some((note) => note.toLowerCase().includes(searchTerm));

    const matchesFilter =
      currentFilter === "All"         ? true :
      currentFilter === "Skye"        ? item.collection === "Skye" :
      currentFilter === "Rose"        ? item.collection === "Rose" :
      currentFilter === "Elite"       ? item.collection === "Elite" :
      currentFilter === "Best Sellers" ? item.bestSeller :
      currentFilter === "New Arrivals" ? item.newArrival :
      true;

    return matchesSearch && matchesFilter;
  });
}, [debouncedSearch, currentFilter]);
```

### Searchable Fields

| Field | Description |
|---|---|
| `title` | Product name |
| `subtitle` | Fragrance subtitle/tagline |
| `mood` | Mood description paragraph |
| `profile` | Scent profile (e.g., "Woody", "Floral") |
| `notes` | Fragrance notes array (flat `string[]`) |

Search is case-insensitive (both search term and field values are lowercased).

---

## Sorting Logic

`displayItems` applies sorting to the `filtered` result:

```ts
const displayItems = useMemo(() => {
  let items = [...filtered];

  if (sortBy === "Price Low → High")  items.sort((a, b) => a.prices["5ml"] - b.prices["5ml"]);
  if (sortBy === "Price High → Low")  items.sort((a, b) => b.prices["5ml"] - a.prices["5ml"]);
  if (sortBy === "Best Sellers")      items = items.filter((f) => f.bestSeller);
  if (sortBy === "New Arrivals")      items = items.filter((f) => f.newArrival);

  return items;
}, [filtered, sortBy]);
```

Sort is based on 5ml price (the lowest price point). "Best Sellers" and "New Arrivals" in the sort dropdown act as additional filters applied on top of the collection filter.

---

## Filter Tabs

Available collection filters (shown as tab buttons):

| Tab | Behaviour |
|---|---|
| All | No filter |
| Skye | `item.collection === "Skye"` |
| Rose | `item.collection === "Rose"` |
| Elite | `item.collection === "Elite"` |
| Best Sellers | `item.bestSeller === true` |
| New Arrivals | `item.newArrival === true` |

On mobile: only "All", "Skye", "Rose", "Elite" are shown as tabs. "Best Sellers" and "New Arrivals" are hidden (`hidden md:inline-flex`) and accessible via the mobile drawer.

---

## Mobile Filter Drawer

On mobile, a "Filters ▼" button opens a bottom-sheet drawer with:
- Special Segments: Best Sellers, New Arrivals (toggle buttons)
- Sort By: 5 options (Featured, Price Low → High, Price High → Low, Best Sellers, New Arrivals)

Closing the drawer also applies the selected filter/sort.

An indicator dot appears on the Filters button when a non-default sort or special filter is active:
```ts
{(sortBy !== "Featured" || ["Best Sellers", "New Arrivals"].includes(currentFilter)) && "•"}
```

---

## Empty State

When `displayItems.length === 0`:

```
Your fragrance journey starts here.
No matches found for "{search}".
[Explore our collection →]  // Resets search, filter, and sort
```

---

## Performance Considerations

- Filtering is O(n × m) where n = fragrances count and m = notes array length. With 465 fragrances and ~10 notes each, this is fast for client-side execution.
- The 300ms debounce prevents filter recalculation on every keystroke
- Both `filtered` and `displayItems` are memoized — filtering does not re-run unless inputs change

---

## Future Improvements

- Filter by scent profile (Fresh, Woody, Oriental, Floral) — the data exists in the `Fragrance` type but is not exposed as a filter
- Filter by gender (male, female, unisex) — exists in `Fragrance` type
- Filter by season — exists in `Fragrance` type
- Fuzzy search (currently requires exact substring match)
- Search autocomplete / suggestions
- Search analytics (track what customers search for)

---

## Important Files

| File | Role |
|---|---|
| `app/shop/page.tsx` | All search, filter, sort state and logic |
| `app/components/SearchBar.tsx` | Controlled text input UI |
| `app/data/fragrances.ts` | Data source |
