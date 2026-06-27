# Cart

**Project:** Maison Skye & Rose
**Related:** [docs/MINICART.md](MINICART.md) · [docs/WHOLESALE.md](WHOLESALE.md) · [docs/REWARDS.md](REWARDS.md) · [docs/QUICK_ADD.md](QUICK_ADD.md)

---

## Purpose

The cart manages all product selections before checkout. It persists across page refreshes via `localStorage`, automatically calculates totals and wholesale pricing, and exposes a clean API to all consuming components.

---

## Architecture

**File:** `app/context/CartContext.tsx`

The cart is implemented as a React Context with a Provider wrapping the entire application (via `app/layout.tsx`).

Context type exposed to consumers:

```ts
type CartContextType = {
  cart: CartProduct[];
  addToCart: (product: CartProduct) => void;
  removeFromCart: (id: string, size: string) => void;
  increaseQuantity: (id: string, size: string) => void;
  decreaseQuantity: (id: string, size: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  wholesaleActive: boolean;
  getWholesalePrice: (item: CartProduct) => number;
};
```

---

## CartProduct Type

```ts
type CartProduct = {
  id: string;      // Typically fragrance title, or title-size in QuickAddModal
  title: string;   // Display name
  price: number;   // Retail price for the selected size
  image: string;   // Product image URL
  quantity: number;
  size: string;    // "5ml" | "10ml" | "30ml"
};
```

---

## Composite Key

Cart line items are identified by `id + size` composite key. This means:

- The same fragrance in a different size = separate line item
- Attempting to add an existing `id + size` combination increases quantity instead of creating a duplicate

```ts
const existing = prev.find(
  (item) => item.id === product.id && item.size === product.size
);
```

Note: `id` is set differently depending on the add-to-cart source:
- `ProductDetail.tsx`: uses `fragrance.title.toLowerCase().replace(/\s+/g, "-")` (the URL slug)
- `QuickAddModal.tsx`: uses `` `${title}-${selectedSize}` ``
- `MiniCart.tsx` quick-add: uses `fragrance.title`

This inconsistency means the same product added via different flows could appear as separate line items if their `id` values differ.

---

## Persistence

### Load (on mount)

```ts
useEffect(() => {
  try {
    const storedCart = localStorage.getItem("maison-skye-rose-cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  } catch (error) {
    console.error("Failed to load cart", error);
  } finally {
    setIsInitialized(true);
  }
}, []);
```

### Save (on cart change)

```ts
useEffect(() => {
  if (!isInitialized) return;  // Hydration guard — prevents blank overwrite
  try {
    localStorage.setItem("maison-skye-rose-cart", JSON.stringify(cart));
  } catch (error) {
    console.error("Failed to save cart state:", error);
  }
}, [cart, isInitialized]);
```

The `isInitialized` flag is critical — it prevents the `useEffect` from saving an empty cart before the load effect has finished reading from `localStorage`. Without it, Next.js hydration could overwrite a stored cart with an empty array.

**localStorage key:** `maison-skye-rose-cart`

---

## Calculations

### cartCount

```ts
const cartCount = useMemo(
  () => cart.reduce((total, item) => total + item.quantity, 0),
  [cart]
);
```

Total units across all line items (not distinct products).

### wholesaleActive

```ts
const wholesaleActive = cartCount >= 10;
```

Derived directly from `cartCount`. Not memoized (primitive comparison).

### getWholesalePrice

```ts
const getWholesalePrice = useCallback(
  (item: CartProduct) => {
    if (!wholesaleActive) return item.price;
    switch (item.size) {
      case "5ml":  return 48;
      case "10ml": return 77;
      case "30ml": return 180;
      default:     return item.price;
    }
  },
  [wholesaleActive]
);
```

### cartTotal

```ts
const cartTotal = useMemo(
  () => cart.reduce((total, item) => total + getWholesalePrice(item) * item.quantity, 0),
  [cart, getWholesalePrice]
);
```

Always reflects the effective price (wholesale or retail). When wholesale is active, `cartTotal` uses wholesale rates.

---

## Delivery

Delivery is calculated in **MiniCart**, not CartContext:

```ts
const delivery =
  !cart || cart.length === 0 ? 0
: wholesaleActive             ? 0  // Free for wholesale
: subtotal >= 2000            ? 0  // Free above R2000
: 100;                             // Standard: R100
```

Note: The **checkout page** calculates delivery differently (province-based: R100 for Western Cape, R180 for other provinces). These two systems are not aligned and should be reconciled before launch.

---

## Business Logic Summary

| Scenario | Outcome |
|---|---|
| Cart empty | `cartTotal = 0`, `cartCount = 0`, `wholesaleActive = false` |
| Cart < 10 units | Retail prices, standard delivery |
| Cart >= 10 units | Wholesale prices, free delivery |
| Cart total >= R400 | 1 Free 5ml Sample reward |
| Cart total >= R700 | 2 Free 5ml Samples reward |
| Cart total >= R1000 | 3 Free 5ml Samples reward |
| Cart total >= R1500 | Discovery Set (5 × 5ml) reward |
| Cart total >= R2000 | Discovery Set + Free Delivery |

---

## Consumers

All components that call `useCart()`:

- `MiniCart.tsx` — displays cart, handles checkout
- `ProductDetail.tsx` — Add to Cart, Buy Now
- `QuickAddModal.tsx` — Quick Add with size/quantity
- `CheckoutPage` — checkout form total calculation
- `Navbar.tsx` — cart icon badge count (TODO: verify)

---

## Important Files

| File | Role |
|---|---|
| `app/context/CartContext.tsx` | Cart state, calculations, persistence |
| `app/context/CartUIContext.tsx` | Controls MiniCart open/close |
| `app/context/CartFeedbackContext.tsx` | Add-to-cart success toast |
| `app/components/MiniCart.tsx` | Cart display and checkout |
| `app/components/QuickAddModal.tsx` | Quick add with size selection |
| `app/components/CartSuccessToast.tsx` | Toast notification on add |
