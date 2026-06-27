# Wholesale

**Project:** Maison Skye & Rose
**Related:** [docs/CART.md](CART.md) · [docs/MINICART.md](MINICART.md) · [docs/REWARDS.md](REWARDS.md)

---

## Purpose

Wholesale pricing allows bulk buyers (retailers, resellers, gifting customers) to purchase at reduced rates. It activates automatically when the cart reaches 10 or more total units — no account, login, or approval is required.

---

## Eligibility

Wholesale pricing activates automatically when `cartCount >= 10`.

`cartCount` is the total number of individual units across all cart line items (sum of all quantities). It is not the number of distinct products.

```ts
// CartContext.tsx
const wholesaleActive = cartCount >= 10;
```

Mix-and-match is supported: 10 units of any combination of fragrances and sizes triggers wholesale pricing.

---

## Wholesale Pricing

| Size | Retail (varies) | Wholesale |
|---|---|---|
| 5ml | Varies by product | R48 |
| 10ml | Varies by product | R77 |
| 30ml | Varies by product | R180 |

Wholesale prices are flat rates by bottle size — they do not vary by fragrance or collection.

**Source (CartContext.tsx):**

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

`getWholesalePrice()` returns the retail price when wholesale is not active. When active, it returns the flat wholesale rate.

---

## Cart Interaction

When `wholesaleActive` is true:

1. `cartTotal` reflects wholesale prices: `cart.reduce((total, item) => total + getWholesalePrice(item) * item.quantity, 0)`
2. MiniCart shows wholesale prices per line item (crossed-out retail + green wholesale price)
3. MiniCart shows savings amount per line item and total savings
4. Free delivery is automatically applied regardless of order total
5. The reward progress bar is replaced by the "Wholesale Pricing Active" panel
6. The WhatsApp checkout message includes "WHOLESALE ORDER" label

---

## MiniCart Interaction

When wholesale is active, MiniCart shows:

```
WHOLESALE PRICING ACTIVE
Mix & Match pricing applied
✓ Free Delivery Included
```

Per cart item:
- Retail price shown with strikethrough
- Wholesale price shown in green
- Per-item savings shown

Footer:
- Savings row displayed: "You Saved R{savings}"
- Delivery shows "FREE"

**Source (MiniCart.tsx):**

```ts
const originalTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
const savings = originalTotal - subtotal; // subtotal already uses wholesale prices
```

---

## Wholesale WhatsApp Message

When generating the WhatsApp order message, wholesale items are flagged:

```ts
`• ${item.title} (${item.size}) x${item.quantity} - R${itemPrice.toFixed(2)}${wholesaleActive ? " (Wholesale)" : ""}`
```

The message header includes `"WHOLESALE ORDER"` when `wholesaleActive` is true.

---

## QuickAddModal Interaction

`QuickAddModal` reads `getWholesalePrice` from `CartContext` to show the effective price at the time of adding an item:

```ts
const effectivePrice = getWholesalePrice({
  id: `${title}-${selectedSize}`,
  title,
  price: retailPrice,
  image: "",
  quantity: 1,
  size: selectedSize
});
```

If wholesale is already active when the modal opens, the price shown reflects wholesale rates.

---

## Homepage Wholesale Teaser

The homepage includes a wholesale teaser section:

```
Mix and match any fragrances and bottle sizes.
Wholesale pricing starts from only 10 units.

5ml • R48 | 10ml • R77 | 30ml • R180
```

With a link to `/wholesale` for more information.

---

## Future Enhancements

- Wholesale account system (register as a verified stockist)
- Volume-tiered wholesale pricing (e.g., 10 units vs 50 units)
- Minimum order quantity enforcement per SKU for wholesale customers
- Wholesale-specific checkout form with business name, VAT number
- Wholesale invoice generation
- Wholesale portal with order history
