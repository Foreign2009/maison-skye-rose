# Code Review Checklist — Maison Skye & Rose

Use this checklist before approving any implementation.
Check only what is relevant to the specific change — not every item applies to every PR.

---

## 1. Scope

- [ ] The change touches only files listed in the approved plan
- [ ] No unrelated refactors or cleanup has been introduced
- [ ] No new dependencies have been added without discussion
- [ ] The commit message accurately describes what changed and why

---

## 2. TypeScript

- [ ] No `any` types introduced without a documented reason
- [ ] All new function parameters and return types are explicitly typed
- [ ] New types/interfaces use `interface` for object shapes (props), `type` for unions and utilities
- [ ] No `@ts-ignore` or `@ts-expect-error` used without explanation
- [ ] Types from `app/data/types.ts` are used where applicable

---

## 3. React / Component Quality

- [ ] New components that receive stable props from a frequently re-rendering parent are wrapped in `memo()`
- [ ] Event handlers defined in components are wrapped in `useCallback()` with correct dependencies
- [ ] Derived data that involves non-trivial computation is in `useMemo()` with correct dependencies
- [ ] No unnecessary re-renders introduced — if a context value object is created inline, it must be in `useMemo()`
- [ ] Context consumers are not over-subscribing — they only call the hooks they need
- [ ] No `useEffect` with missing dependencies (or suppressions without explanation)

---

## 4. Images

- [ ] No native `<img>` tags introduced — only `next/image`
- [ ] All `next/image` with `fill` layout have a `sizes` prop
- [ ] `priority` is used only on above-the-fold hero images and the main PDP image
- [ ] All images have meaningful `alt` text (not empty, not "image", not the filename)

---

## 5. Mobile / Accessibility

- [ ] The change has been considered at 375px width
- [ ] All interactive elements have visible focus states
- [ ] Button and link touch targets are at minimum 44px (height + padding)
- [ ] New text elements have readable font size (minimum 14px, body text 16px)
- [ ] Colour contrast is sufficient for primary and secondary text
- [ ] ARIA labels added where icon-only buttons exist
- [ ] `alt` text on all images (see Images section)

---

## 6. Performance

- [ ] No new expensive computations running on every render without memoization
- [ ] No new `localStorage` reads inside render functions (move to `useEffect` or `useMemo` with SSR guard)
- [ ] Client components (`"use client"`) are used only where browser APIs or interactivity is required
- [ ] No large data structures imported into client components unnecessarily

---

## 7. Security

- [ ] No new credentials, API keys, or secrets added to client-side code
- [ ] No new `NEXT_PUBLIC_` env vars that expose sensitive values
- [ ] No user-controlled input concatenated into URLs, SQL, or shell commands without sanitization
- [ ] Route handlers (`app/api/`) validate required fields before processing

---

## 8. Cart Regression (Required When Cart/Context Is Touched)

Run through mentally or in the browser:

- [ ] Add to cart from ProductDetail — id is URL slug, correct size and quantity
- [ ] Add to cart from QuickAddModal — id is `${title}-${selectedSize}`, correct quantity
- [ ] Same product + same size via same flow: quantity increments, no duplicate
- [ ] Same product + different size: separate line item
- [ ] Cart persists after page refresh
- [ ] Cart does not blank on first load (hydration guard intact)
- [ ] At 10+ units: wholesale activates, flat prices applied (5ml R48, 10ml R77, 30ml R180)
- [ ] At 9 units: wholesale does NOT activate
- [ ] Reward tiers display correctly at R400, R700, R1000, R1500, R2000

---

## 9. WhatsApp Checkout (Required When MiniCart or Cart Logic Is Touched)

- [ ] Message format: `• {title} ({size}) x{qty} - R{price}`
- [ ] Reward section present when reward is unlocked
- [ ] WHOLESALE ORDER header present when wholesale is active
- [ ] "(Wholesale)" suffix on line items when wholesale is active
- [ ] Totals (subtotal, delivery, total) correct
- [ ] Delivery shows FREE when wholesale active or subtotal >= R2000

---

## 10. SEO (Required When Pages Are Added or Modified)

- [ ] New pages have `title` and `description` (at minimum)
- [ ] New pages have canonical URL set via `alternates.canonical`
- [ ] New pages have Open Graph metadata if they are publicly discoverable
- [ ] No duplicate `<title>` tags (check root layout vs page-level metadata)
- [ ] Product pages: JSON-LD is present and valid
- [ ] `generateStaticParams` used for new dynamic routes with stable param sets

---

## 11. Payments / Supabase (Required When api/ or checkout/ Is Touched)

- [ ] `app/api/payfast/route.ts` — change reviewed line by line
- [ ] `app/api/orders/route.ts` — change reviewed line by line
- [ ] `app/lib/supabase.ts` — change reviewed line by line
- [ ] No new hardcoded credentials or URLs
- [ ] Supabase insert fields match the orders table schema exactly
- [ ] Error handling is present for all async operations

---

## 12. Build

- [ ] `npm run build` was run after the implementation
- [ ] Zero TypeScript errors in build output
- [ ] Zero new warnings in build output
- [ ] Static page count is correct (one per fragrance + static pages)
- [ ] No "Image with src X has either width or height modified" warnings
