# MiniCart

**Project:** Maison Skye & Rose
**Related:** [docs/CART.md](CART.md) · [docs/REWARDS.md](REWARDS.md) · [docs/WHOLESALE.md](WHOLESALE.md) · [docs/FAVORITES.md](FAVORITES.md)

---

## Purpose

The MiniCart is the primary shopping bag interface. It displays all cart items, shows reward progress, applies wholesale pricing, generates recommendations, and handles WhatsApp checkout. It is the final step before order placement.

---

## Architecture

**File:** `app/components/MiniCart.tsx`

Client component. Opens as a full-screen overlay on mobile and a floating panel (420px wide) on desktop.

Consumes:
- `useCart()` — all cart state and operations
- `useFavorites()` — for "From Your Favorites" recommendations

Is controlled by `CartUIContext` (`cartOpen` / `openCart` / `closeCart`) via the Navbar — but `MiniCart` itself receives `isOpen` and `onClose` as props, not from the context directly.

---

## Layout Structure

```
MiniCart
├── Mobile drag handle (md:hidden)
├── Header
│   ├── Brand label + "Your Bag" heading
│   ├── Wholesale Panel (when active) OR Reward Progress Panel
│   └── Close button (desktop only)
├── Scrollable Products Area
│   ├── Empty state (when cart is empty)
│   └── Cart item rows (key: id-size)
└── Sticky Footer
    ├── Scrollable Summary
    │   ├── Subtotal / Delivery rows
    │   ├── Savings row (wholesale savings)
    │   ├── Total row
    │   ├── Current Reward Panel
    │   └── "You May Also Like" (collapsible recommendations)
    └── Checkout Button (Checkout via WhatsApp)
```

---

## Positioning

```css
/* Mobile: full-screen bottom sheet */
fixed z-50 bottom-0 left-0 right-0 w-full h-screen

/* Desktop: floating panel bottom-right */
md:bottom-6 md:right-6 md:left-auto md:w-[420px] md:rounded-[32px] md:h-[85vh]
```

---

## Wholesale Panel vs Reward Panel

**When `wholesaleActive` is false:**
Shows the reward progress bar with spend tracking toward R1500 and "Wholesale Available" label.

**When `wholesaleActive` is true:**
Replaces the reward panel with:
```
WHOLESALE PRICING ACTIVE
Mix & Match pricing applied
✓ Free Delivery Included
```

---

## Reward Display

### Progress Bar (non-wholesale)

Progress tracks from R0 → R1500 in four segments:

| Segment | Range | Bar % |
|---|---|---|
| 0–R400 | 0–25% | `(subtotal / 400) * 25` |
| R400–R700 | 25–50% | `25 + ((subtotal - 400) / 300) * 25` |
| R700–R1000 | 50–75% | `50 + ((subtotal - 700) / 300) * 25` |
| R1000–R1500 | 75–100% | `75 + ((subtotal - 1000) / 500) * 25` |

### Current Reward Panel (footer)

Shows the highest unlocked reward and the next reward to unlock:

```
Current: ✓ 1 Free 5ml Sample         (at R400)
Next:    🎁 Only R{x} more → 2 Free 5ml Samples
         Add a 5ml fragrance from R89
```

At R1500+: "🎉 Highest Reward Tier Unlocked — Discovery Set (5 × 5ml)"

---

## Delivery Calculation

```ts
const delivery =
  !cart || cart.length === 0 ? 0   // Empty cart: no delivery charge
: wholesaleActive             ? 0   // Wholesale: always free
: subtotal >= 2000            ? 0   // R2000+ reward: free
: 100;                              // Standard: R100
```

---

## Savings Display

When wholesale is active:

```ts
const originalTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
const savings = originalTotal - subtotal;  // subtotal uses wholesale prices
```

Shown as: `"You Saved R{savings}"`

Per-item savings: `"Save R{(item.price - getWholesalePrice(item)).toFixed(2)}"`

---

## Recommendations

Three recommendation categories, shown in a collapsible "You May Also Like" section:

### 1. From Your Favorites
Products in the customer's favorites list that are not already in the cart (up to 3):

```ts
const favoriteRecommendations = useMemo(
  () => fragrances
    .filter((f) => favorites.some((fav) => fav.title === f.title) && !cart.some((item) => item.title === f.title))
    .slice(0, 3),
  [favorites, cart]
);
```

Quick Add button (5ml): background `#b67d73`

### 2. Recently Viewed
Products from `localStorage("recentlyViewed")` that are not in the cart (up to 3):

```ts
const recentRecommendations = useMemo(() => {
  if (typeof window === "undefined") return [];
  const viewed = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
  return viewed
    .map((item: any) => fragrances.find((f) => f.title === item.title))
    .filter(Boolean)
    .filter((f: any) => !cart.some((cartItem) => cartItem.title === f.title))
    .slice(0, 3);
}, [cart]);
```

Quick Add button (5ml): background `#4f4a52`

### 3. Complete Your Collection
Score-based recommendations from the same collection as the first cart item:

```ts
const collectionRecommendations = useMemo(() => {
  const cartFragrance = fragrances.find((f) => f.title === cart[0]?.title);
  return fragrances
    .filter((f) => !cart.map(i => i.title).includes(f.title))
    .map((f) => {
      let score = 0;
      if (f.collection === cartFragrance?.collection) score += 3;
      if (f.profile === cartFragrance?.profile)       score += 2;
      if (f.season === cartFragrance?.season)         score += 1;
      if (f.bestSeller)                               score += 1;
      return { ...f, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}, [cart]);
```

Quick Add button (5ml): background `#b67d73`

All "quick add from recommendations" calls add a 5ml unit of the recommended fragrance using `fragrance.title` as the `id`.

---

## WhatsApp Checkout

```ts
const handleWhatsAppCheckout = () => {
  const orderLines = cart.map((item) => {
    const itemPrice = getWholesalePrice(item);
    return `• ${item.title} (${item.size}) x${item.quantity} - R${(itemPrice * item.quantity).toFixed(2)}${wholesaleActive ? " (Wholesale)" : ""}`;
  }).join("\n");

  const message = `🌹 MAISON SKYE & ROSE
${wholesaleActive ? "WHOLESALE ORDER\n\n" : ""}ORDER SUMMARY
${orderLines}
${rewardMessage ? `🎁 REWARDS UNLOCKED\n${rewardMessage}\n` : ""}
Subtotal: R${subtotal.toFixed(2)}
Delivery: ${delivery === 0 ? "FREE" : `R${delivery.toFixed(2)}`}
TOTAL: R${total.toFixed(2)}

CUSTOMER DETAILS
Name:
Contact Number:
Delivery Area:

A member of our team will confirm your order and delivery details shortly.`;

  window.open(`https://wa.me/27696863952?text=${encodeURIComponent(message)}`, `_blank`);
};
```

The message is a structured order summary. Customer details fields (Name, Contact Number, Delivery Area) are left blank for the customer to fill in WhatsApp.

**Checkout button is disabled when the cart is empty** (`disabled={!cart || cart.length === 0}`).

---

## Performance Optimizations

- `favoriteRecommendations`, `recentRecommendations`, `collectionRecommendations` — all wrapped in `useMemo`
- `collectionRecommendations` depends only on `[cart]` — recomputes only when cart changes
- `recentRecommendations` reads from `localStorage` inside `useMemo` — returns `[]` during SSR (`typeof window === "undefined"`)
- Products list keyed by `${item.id}-${item.size}` composite key

---

## Mobile Behaviour

- Full-screen height (`h-screen`) on mobile — covers the entire viewport
- Mobile drag handle at top (visual affordance only, no actual drag gesture implemented)
- Products area scrolls independently (`flex-1 min-h-0 overflow-y-auto`)
- Footer is sticky (`shrink-0`) — always visible at bottom
- Close button is hidden on mobile (`X` button visible only on desktop)
- Close on mobile: TODO: verify how customers close the MiniCart on mobile (drag, back button, or overlay tap)

---

## Important Files

| File | Role |
|---|---|
| `app/components/MiniCart.tsx` | All MiniCart UI and logic |
| `app/context/CartContext.tsx` | Cart state, totals, wholesale, operations |
| `app/context/CartUIContext.tsx` | `cartOpen` state, `openCart`, `closeCart` |
| `app/context/FavoritesContext.tsx` | `favorites` for recommendations |
| `app/data/fragrances.ts` | Source for recommendation scoring |
