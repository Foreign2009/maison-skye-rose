# Current State — Maison Skye & Rose

**Last updated:** 2026-06-27
**Current phase:** Phase 5 — Documentation (complete)
**Branch:** main

---

## Build Status

**Last build:** Unknown — run `npm run build` to verify current state.
**TypeScript:** Unknown — verify with build output.

To check: `npm run build`

---

## What Is Working

| Feature | Confidence | Notes |
|---|---|---|
| Product catalogue display | High | fragrances.ts is the source of truth |
| Add to cart (ProductDetail) | High | |
| Add to cart (QuickAddModal) | High | |
| Cart persistence across sessions | High | localStorage with hydration guard |
| MiniCart open/close | High | CartUIContext |
| Wholesale pricing (10+ units) | High | Auto-activates |
| Reward tier progress (R400–R1500) | High | MiniCart progress bar |
| WhatsApp checkout | High | Primary flow, pre-populated message |
| Favorites (add/remove/persist) | High | localStorage with hydration guard |
| Recently viewed (12 items) | High | localStorage on PDP mount |
| Shop search (300ms debounce) | High | |
| Shop filter + sort | High | 6 tabs, 4 sort options |
| Static product pages (generateStaticParams) | High | Pre-rendered at build time |
| Per-product SEO metadata | High | generateMetadata + JSON-LD |
| Cart success toast | High | 2600ms auto-clear |
| Add to cart success animation | High | CartFeedbackContext |
| Sticky CTA on PDP mobile | High | Appears after 300px scroll |
| MiniCart recommendations (3 types) | High | Favorites, Recently Viewed, Collection |
| PayFast checkout form | Medium | Works in sandbox — NOT production |
| Order saved to Supabase | Medium | Saves, but payment_status never updates |
| Fragrance quiz | Unknown | Exists but not audited this session |

---

## What Is Broken or Incomplete

| Issue | Severity | Reference |
|---|---|---|
| PayFast on sandbox URL | Critical | KI-01 in KNOWN_ISSUES.md |
| PayFast ITN not implemented | Critical | KI-02 |
| PayFast MD5 signature missing | Critical | KI-03 |
| Cart id inconsistency across add flows | High | KI-04 |
| PayFast passphrase in client bundle | High | KI-05 |
| Hardcoded customer details in PayFast | High | KI-06 |
| Delivery pricing mismatch (MiniCart vs Checkout) | High | KI-07 |
| No sitemap | Medium | KI-08 |
| No robots.txt | Medium | KI-09 |
| No OG metadata on homepage/shop/collections | Medium | KI-10 |
| instagramUrl incomplete in brand.ts | Medium | KI-12 |
| MiniCart quantity buttons 36px (below 44px min) | Low | KI-13 |
| MiniCart mobile close gesture not implemented | Low | KI-14 |

---

## What Does Not Exist Yet

| Feature | Priority | Notes |
|---|---|---|
| Sitemap (app/sitemap.ts) | High | Required for launch |
| robots.txt (app/robots.ts) | High | Required for launch |
| PayFast ITN webhook | Critical | Required for launch |
| OG metadata on non-product pages | Medium | SEO improvement |
| Customer authentication | Low | Post-launch |
| Order history page | Low | Post-launch |
| Email order confirmation | Medium | Post-launch |
| Inventory tracking | Low | Post-launch |
| CMS product management | Low | Post-launch |
| Product reviews | Low | Post-launch |
| Wishlist sharing | Low | Post-launch |

---

## Documentation Status

Phase 5 documentation is complete and committed (commit 242b71e).

| Document | Status |
|---|---|
| CLAUDE.md | Complete — v3.0 |
| README.md | Complete |
| ARCHITECTURE.md | Complete |
| UI_STANDARDS.md | Complete |
| PERFORMANCE.md | Complete |
| SEO.md | Complete |
| ROADMAP.md | Complete |
| CHANGELOG.md | Complete |
| CONTRIBUTING.md | Complete |
| docs/CART.md | Complete |
| docs/MINICART.md | Complete |
| docs/REWARDS.md | Complete |
| docs/WHOLESALE.md | Complete |
| docs/PAYFAST.md | Complete |
| docs/SUPABASE.md | Complete |
| docs/DEPLOYMENT.md | Complete |
| docs/PRODUCT_DETAIL.md | Complete |
| docs/QUICK_ADD.md | Complete |
| docs/SEARCH.md | Complete |
| docs/FAVORITES.md | Complete |
| .ai/ context system | Complete — this session |
| docs/CHECKOUT.md | Missing — checkout page logic undocumented |

---

## Open Application Changes (Unstaged)

These files were modified before this session but have not been committed:

```
app/components/BestSellers.tsx
app/components/FavoritesHome.tsx
app/components/LatestAdditions.tsx
app/components/ProductCard.tsx
app/context/CartFeedbackContext.tsx
app/context/CartUIContext.tsx
app/context/FavoritesContext.tsx
```

**Before starting any new implementation task, review these unstaged changes** with `git diff` to understand their current state.

---

## Next Priority Actions

1. Review and commit (or stash) the 7 unstaged app/ changes
2. Fix delivery pricing mismatch (KI-07) — most impactful UX issue
3. Standardize cart id format (KI-04) — silent data integrity issue
4. Add sitemap (KI-08) and robots.txt (KI-09) — quick wins
5. Fix PayFast before any live traffic (KI-01, KI-02, KI-03, KI-05, KI-06)
