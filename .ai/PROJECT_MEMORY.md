# Project Memory — Maison Skye & Rose

Patterns that work. Anti-patterns to avoid. Traps already encountered.
This file saves future sessions from repeating past mistakes.

---

## Patterns That Work

### Hydration Guard for localStorage Contexts

Both `CartContext` and `FavoritesContext` use an `isInitialized` flag to prevent the save `useEffect` from overwriting localStorage with an empty array during Next.js client-side hydration.

```ts
// Load effect sets isInitialized = true AFTER reading localStorage
// Save effect checks isInitialized before writing
useEffect(() => {
  if (!isInitialized) return;
  localStorage.setItem(KEY, JSON.stringify(state));
}, [state, isInitialized]);
```

**Always use this pattern when persisting to localStorage in a context.** Without it, the first render overwrites stored data with initial state.

---

### Context Value Wrapped in useMemo

All four contexts wrap their value object in `useMemo` to prevent new object references on every render. This is required — without it, every context consumer re-renders on every parent render.

```ts
const value = useMemo(() => ({
  cart, addToCart, removeFromCart, ...
}), [cart, addToCart, removeFromCart, ...]);
```

---

### Composite Key in Cart Iteration

When iterating cart items in MiniCart, always key by `${item.id}-${item.size}`:

```tsx
{cart.map((item) => (
  <div key={`${item.id}-${item.size}`}>
```

Using only `item.id` risks React reconciliation issues when the same product exists in multiple sizes.

---

### normalizeImagePath Utility

`app/product/[slug]/page.tsx` uses `normalizeImagePath()` to ensure all image URLs have a leading slash before constructing the full OG image URL. Always use this when building absolute image URLs from relative paths in fragrances.ts.

---

### createPortal for Modals Above Everything

`QuickAddModal` uses `createPortal(modal, document.body)` to escape any parent stacking context. Use this pattern for any modal that must appear above page content, MiniCart, or Navbar.

---

## Anti-Patterns to Avoid

### Do Not Use Native `<img>` Tags

Always use `next/image`. Native `<img>` bypasses optimization, triggers build warnings, and violates the image rules in CLAUDE.md. The previous codebase had native `<img>` in ProductDetail — this was already fixed in Phase 4.

---

### Do Not Add priority to Non-Above-Fold Images

`priority` disables lazy loading and fetches the image immediately. It was incorrectly applied to non-above-fold images in a previous phase and was removed in the Phase 4 performance cleanup. Only use `priority` on the hero image and the main PDP product image.

---

### Do Not Memoize Everything Unconditionally

Earlier documentation stated "All components: export default memo(Component)" as an absolute rule. This was corrected — wrap in `memo()` only where the component re-renders from parent while its props have not changed. Trivially cheap renders do not need memoization.

---

### Do Not Edit PayFast/Supabase/Layout Without a Plan

`app/api/payfast/route.ts`, `app/api/orders/route.ts`, `app/lib/supabase.ts`, and `app/layout.tsx` are the highest-risk files in the project. A mistake in any of these breaks payments, order persistence, or the entire provider tree. Always produce a plan and wait for approval before touching them.

---

### Do Not Assume the product `id` Format

The cart `id` field is set differently by ProductDetail (slug), QuickAddModal (title-size), and MiniCart recommendations (title). Never assume the id format is consistent. When implementing anything that involves cart `id`, check which add-to-cart source is involved.

---

### Do Not Merge the Two notes Data Shapes Without a Full Plan

`Fragrance` type uses `notes: { top, heart, base }` (for the quiz). Display components use `notes: string[]` (flat array). These coexist by design (see DECISIONS.md D05). Merging them without planning will break either the quiz scoring or the PDP notes display.

---

### Do Not Introduce Zustand, Redux, or External State Libraries

The project intentionally uses only React Context. Adding a state library would create a mixed state management model and is out of scope unless explicitly requested.

---

## Traps Already Encountered

### CLAUDE.md Overwrote the @AGENTS.md Import

When CLAUDE.md was rewritten from scratch with the new v3.0 framework, the original `@AGENTS.md` import line at the top of the old CLAUDE.md was lost. The new framework v3.0 replaced it with inline NEXT.JS 16 RULES. If any `@AGENTS.md` file is added in the future, ensure it is referenced in CLAUDE.md.

---

### Write Tool Requires Prior Read

The Write tool rejects files that have not been previously read in the same session. When creating a new file over an existing one, always Read it first. When creating a genuinely new file, check with Glob or ls that the file doesn't already exist before writing.

---

### docs/ Directory Must Exist Before Writing docs/ Files

The `docs/` directory did not exist when docs/ files were first created. Write tool creates files but not parent directories. Use `mkdir -p docs/` before writing the first docs/ file.

---

### "465+ Fragrances" Is Marketing Copy, Not a Verified Count

The text "465+ Signature Fragrances Available" appears in ProductDetail trust block copy. This number has not been verified against the actual count of entries in `fragrances.ts`. Do not use it as a hard fact for logic or documentation without checking `fragrances.length`.

---

### MiniCart Positioning: Not a Sidebar — Conditional on Breakpoint

MiniCart is `fixed bottom-0 left-0 right-0 w-full h-screen` on mobile (full-screen overlay). It is `md:bottom-6 md:right-6 md:left-auto md:w-[420px] md:rounded-[32px] md:h-[85vh]` on desktop (floating panel bottom-right). It is NOT a traditional sidebar. CSS changes to positioning must account for both modes.
