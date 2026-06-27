# Quick Add

**Project:** Maison Skye & Rose
**Related:** [docs/CART.md](CART.md) · [docs/REWARDS.md](REWARDS.md) · [docs/WHOLESALE.md](WHOLESALE.md)

---

## Purpose

Quick Add allows customers to add a fragrance to the cart — with size and quantity selection — without navigating away from the current page. It appears as a bottom-sheet modal on mobile and a centered modal on desktop.

---

## Architecture

**File:** `app/components/QuickAddModal.tsx`

The modal is a client component that uses `createPortal` to render into `document.body`, ensuring it layers above all page content regardless of stacking context.

It consumes:
- `useCart()` — for `addToCart`, `cartTotal` (for reward preview), and `getWholesalePrice`
- `useCartFeedback()` — for `showFeedback` (triggers the success toast after add)

---

## Props

```ts
interface QuickAddModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  images?: { [key: string]: string };   // size → image URL mapping
  prices?: { [key: string]: number };   // size → price mapping
}
```

`images` and `prices` default to empty objects. The size options are derived from `Object.entries(prices)`.

---

## Flow

1. User clicks "Quick Add" button on `ProductCard`
2. Parent component sets `selectedFragrance` and `quickOpen = true`
3. `QuickAddModal` renders via portal with `open={true}`
4. Customer selects size (defaults to first available) and quantity (defaults to 1)
5. Image updates reactively when size changes (animated transition)
6. Customer sees real-time total and reward status
7. Customer clicks "Add To Cart"
8. `addToCart()` called with the selected size, quantity, retail price
9. `showFeedback()` called — triggers `CartSuccessToast`
10. `onClose()` called — modal closes

---

## Size Selection

```ts
const sizeOptions = Object.entries(prices);
const [selectedSize, setSelectedSize] = useState(sizeOptions?.[0]?.[0] || "10ml");
```

Size options are derived from the `prices` prop. The first size in the object is selected by default.

Size buttons show:
- Size label (5ml / 10ml / 30ml)
- "Best Value" label on 30ml
- Retail price for each size

The selected size button has active styling: `border-[#ff9fbc] bg-gradient-to-br from-pink-50 to-blue-50 shadow-lg scale-[1.02]`

---

## Price Calculation

```ts
const retailPrice = prices?.[selectedSize] || 0;
const effectivePrice = getWholesalePrice({
  id: `${title}-${selectedSize}`,
  title,
  price: retailPrice,
  image: "",
  quantity: 1,
  size: selectedSize
});
const total = effectivePrice * quantity;
```

`effectivePrice` uses `getWholesalePrice()` from CartContext — if wholesale is already active (cart has 10+ units), the price shown in the modal reflects the wholesale rate.

---

## Reward Preview

The modal shows a reward nudge based on `combinedTotal` (current cart + items being added):

```ts
const combinedTotal = contextCartTotal + total;
const amountToSample = Math.max(0, 400 - combinedTotal);
```

Display:
- If `combinedTotal >= 400`: `"🎁 Free 5ml Sample Unlocked"`
- If `combinedTotal < 400`: `"Spend only R{amountToSample} more to unlock a FREE 5ml sample"`

Only the R400 free sample threshold is shown here — higher tiers are shown in the MiniCart.

---

## Cart ID Format

```ts
addToCart({
  id: `${title}-${selectedSize}`,   // e.g. "Black Orchid Noir-10ml"
  title,
  price: retailPrice,               // Always retail price stored, wholesale computed on render
  quantity,
  image: selectedImage,
  size: selectedSize,
});
```

Note: The `id` format (`title-size`) differs from `ProductDetail.tsx` which uses the URL slug. This could result in duplicate line items for the same product added via different flows. See [docs/CART.md](CART.md) for details.

---

## Animations

Powered by Framer Motion:

| Element | Animation |
|---|---|
| Overlay | `opacity: 0 → 1 → 0` |
| Modal panel | `y: 100, opacity: 0 → y: 0, opacity: 1 → y: 100, opacity: 0` (0.35s) |
| Product image (size swap) | `opacity: 0, scale: 0.92 → 1, 1` (0.25s) via `AnimatePresence` + `key={selectedImage}` |
| Quantity `-` button | `whileTap: scale: 0.92` |
| Quantity `+` button | `whileTap: scale: 0.92` |
| Add To Cart button | `whileTap: scale: 0.97` |

---

## Wholesale Interaction

When wholesale is active:
- `effectivePrice` reflects wholesale rates
- `total` displayed in the modal reflects the lower wholesale price
- The cart item is added with `price: retailPrice` (retail) — wholesale is recalculated on render by `getWholesalePrice()`

---

## Where Quick Add Is Triggered

| Component | Trigger |
|---|---|
| `ProductCard` | "Quick Add" button |
| `BestSellers` | passes `onQuickAdd` to `ProductCard` |
| `LatestAdditions` | manages its own `selectedFragrance` + `QuickAddModal` instance |
| `ShopPage` | manages shared `selectedFragrance` + `QuickAddModal` instance |
| `HomePage` | manages shared `selectedFragrance` + `QuickAddModal` instance |

Each page/section manages its own `selectedFragrance` state and `quickOpen` boolean, passing them to a single `QuickAddModal` instance.

---

## Important Files

| File | Role |
|---|---|
| `app/components/QuickAddModal.tsx` | The modal component |
| `app/context/CartContext.tsx` | `addToCart`, `getWholesalePrice`, `cartTotal` |
| `app/context/CartFeedbackContext.tsx` | `showFeedback` for success toast |
| `app/components/CartSuccessToast.tsx` | Toast shown after successful add |
| `app/components/ProductCard.tsx` | Triggers Quick Add via `onQuickAdd` prop |
