# Rewards

**Project:** Maison Skye & Rose
**Related:** [docs/CART.md](CART.md) · [docs/MINICART.md](MINICART.md) · [docs/WHOLESALE.md](WHOLESALE.md)

---

## Purpose

The reward system incentivizes higher order values by offering progressive free gifts as the cart total grows. It is a retention and conversion tool — the closer a customer gets to the next tier, the stronger the prompt to add one more item.

---

## Architecture

The reward system is entirely client-side. It is calculated from `cartTotal` (which itself comes from `CartContext`) inside `MiniCart.tsx` and `QuickAddModal.tsx`. There is no server-side reward validation or fulfillment — rewards are communicated to the customer via the WhatsApp order message, and it is the responsibility of the business to include the reward item when packing the order.

---

## Reward Tiers

| Cart Total (Subtotal) | Reward |
|---|---|
| R0 – R399 | No reward |
| R400+ | 1 Free 5ml Sample |
| R700+ | 2 Free 5ml Samples |
| R1000+ | 3 Free 5ml Samples |
| R1500+ | Discovery Set (5 × 5ml) |
| R2000+ | Discovery Set (5 × 5ml) + Free Delivery |

Tiers are cumulative — reaching R1500 also includes the R400 / R700 / R1000 rewards (they're all superseded by the Discovery Set).

**Source (MiniCart.tsx):**

```ts
const nextReward =
  subtotal < 400  ? { amount: 400,  reward: "1 Free 5ml Sample" }
: subtotal < 700  ? { amount: 700,  reward: "2 Free 5ml Samples" }
: subtotal < 1000 ? { amount: 1000, reward: "3 Free 5ml Samples" }
: subtotal < 1500 ? { amount: 1500, reward: "Discovery Set (5 × 5ml)" }
: null;
```

---

## Progress Bar

The MiniCart shows a visual progress bar from R0 to R1500 (the maximum reward tier):

```ts
const progressPercent =
  subtotal >= 1500 ? 100
: subtotal >= 1000 ? 75 + ((subtotal - 1000) / 500) * 25
: subtotal >= 700  ? 50 + ((subtotal - 700)  / 300) * 25
: subtotal >= 400  ? 25 + ((subtotal - 400)  / 300) * 25
: (subtotal / 400) * 25;
```

The bar fills in four equal segments corresponding to the four reward thresholds. Each segment is 25% of the bar width.

The progress bar is shown only when wholesale pricing is **not** active. When wholesale is active, the wholesale pricing panel replaces the reward progress bar (the assumption is that wholesale customers are a different segment from reward seekers).

---

## Reward Messaging

### MiniCart — Current Reward Panel

Shows the highest unlocked reward and the next reward with the amount still needed:

```
"🎁 Only R{amount remaining} more"
"{nextReward.reward}"
"Add a 5ml fragrance from R89"
```

When the highest tier is reached:
```
"🎉 Highest Reward Tier Unlocked"
"Discovery Set (5 × 5ml)"
```

### MiniCart — WhatsApp Checkout Message

The reward message is embedded in the WhatsApp order summary:

```ts
const rewardMessage =
  subtotal >= 2000 ? "✓ Discovery Set (5 × 5ml) + Free Delivery"
: subtotal >= 1500 ? "✓ Discovery Set (5 × 5ml)"
: subtotal >= 1000 ? "✓ 3 Free 5ml Samples"
: subtotal >= 700  ? "✓ 2 Free 5ml Samples"
: subtotal >= 400  ? "✓ 1 Free 5ml Sample"
: "";
```

If `rewardMessage` is non-empty, the WhatsApp message includes a `🎁 REWARDS UNLOCKED` section.

### QuickAddModal — Pre-Add Preview

Before adding an item, the modal shows whether the combined cart total (current cart + item being added) reaches the R400 free sample threshold:

```ts
const combinedTotal = contextCartTotal + total;
const amountToSample = Math.max(0, 400 - combinedTotal);

// Display:
combinedTotal >= 400
  ? "🎁 Free 5ml Sample Unlocked"
  : `Spend only R${amountToSample.toFixed(0)} more to unlock a FREE 5ml sample`
```

This only shows the R400 threshold — it does not show the higher tiers in the modal.

---

## Delivery Reward

The MiniCart applies free delivery at R2000+:

```ts
const delivery =
  !cart || cart.length === 0 ? 0
: wholesaleActive             ? 0
: subtotal >= 2000            ? 0
: 100;
```

Free delivery is also granted when wholesale pricing is active (regardless of order total).

Note: The checkout page (`app/checkout/page.tsx`) uses a different delivery logic (province-based R100/R180). These two delivery pricing systems are not aligned.

---

## Business Rules

1. Rewards are based on `cartTotal` — which uses wholesale pricing when active. If 10+ units are in the cart, the cart total reflects wholesale prices, and reward tier calculation is based on the lower wholesale total.

2. There is no reward "stacking" UI — only the highest achieved reward is prominently displayed.

3. Reward fulfillment is manual — the business owner physically includes the reward sample(s) when packing the order. There is no automated fulfillment.

4. The 5ml sample included as a reward is not specified — the business chooses which fragrance to include.

---

## Future Improvements

- Show all reward tiers (not just next) so customers can see the full progression
- Allow customers to choose their free sample fragrance
- Add reward tier to the WhatsApp order summary with specific sample choices
- Align MiniCart delivery logic with checkout page delivery logic
- Add loyalty points system on top of the tier-based rewards
