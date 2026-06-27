# UI Standards

**Project:** Maison Skye & Rose
**Related:** [ARCHITECTURE.md](ARCHITECTURE.md) · [PERFORMANCE.md](PERFORMANCE.md)

---

## Brand Identity

Maison Skye & Rose is: **Luxury · Modern · Premium · Minimal · Elegant · Fast**

Every interface decision should feel effortless. Remove anything that does not serve the customer's journey toward a purchase.

---

## Color Palette

| Name | Hex | Usage |
|---|---|---|
| Primary Text | `#4f4a52` | Headings, product titles, body text |
| Accent / Rose | `#d89ca4` | Active states, badges, CTAs, icons |
| Muted Accent | `#b67d73` | Secondary CTAs, price text, reward text |
| Muted Text | `#7b7480` | Body copy, descriptions, metadata |
| Background Ivory | `#faf7f5` | Page background, card backgrounds |
| Background Light | `#f5f1eb` | Section backgrounds |
| White | `#ffffff` | Cards, modals, input backgrounds |
| Black | `#111111` | Primary buttons (Shop Now, View All) |
| Gold | `#C9B37E` | Brand accent (from brand.ts, not yet widely used in components) |

### Contextual Colors

| Context | Color |
|---|---|
| Wholesale active | `green-600 / green-50 / green-200` (Tailwind) |
| Reward unlocked | `green-600` |
| Error / Remove | `#b67d73` hover `#a96e65` |
| Border default | `#efe8e1` / `#e8ddd6` |

---

## Typography

No custom font is loaded. The project uses the system font stack via Tailwind's default sans-serif.

### Scale (used in practice)

| Element | Classes |
|---|---|
| Page heading H1 | `text-5xl md:text-6xl font-black tracking-[-0.05em]` |
| Section heading H2 | `text-2xl md:text-5xl font-black tracking-[-0.05em]` |
| Product title (card) | `text-sm md:text-2xl font-black text-[#4f4a52] leading-tight` |
| Product title (PDP) | `text-[1.8rem] md:text-5xl font-black tracking-[-0.05em]` |
| Subtitle | `text-lg md:text-xl font-semibold text-[#b67d73]` |
| Body copy | `text-sm leading-6 text-[#7b7480]` or `text-base leading-7` |
| Label / eyebrow | `text-xs uppercase tracking-[0.35em–0.45em] text-[#d89ca4]` |
| Price | `text-base md:text-2xl font-black text-[#4f4a52]` |
| Badge text | `text-[10px] md:text-xs font-bold` |
| Button text | `text-xs md:text-sm font-bold uppercase tracking-[0.25em]` |

### Principles

- `font-black` (weight 900) for all headings and prices — conveys luxury and confidence
- Negative letter-spacing (`tracking-[-0.05em]` to `tracking-[-0.06em]`) on large headings
- Wide positive tracking (`tracking-[0.35em]` to `tracking-[0.6em]`) on small uppercase labels
- No italic usage in the current design system

---

## Spacing

Tailwind's default spacing scale is used. Key patterns:

| Pattern | Classes |
|---|---|
| Section padding (mobile) | `px-4 py-10` |
| Section padding (desktop) | `px-6 md:px-6 py-20 md:py-24` |
| Card internal padding | `p-4 md:p-6` |
| Max content width | `max-w-7xl mx-auto` |
| Card gap (grid) | `gap-3 md:gap-6 md:gap-8` |
| Stack gap | `space-y-4` or `gap-4` |

---

## Border Radius

| Element | Radius |
|---|---|
| Product cards | `rounded-[32px]` |
| Inner image containers | `rounded-[24px]` |
| Modals | `rounded-t-[38px] sm:rounded-[38px]` |
| MiniCart panel (desktop) | `rounded-[32px]` |
| Buttons (primary) | `rounded-full` |
| Buttons (secondary) | `rounded-2xl` |
| Form inputs | `rounded-2xl` |
| Tags / chips | `rounded-full` |
| Info panels | `rounded-2xl` or `rounded-3xl` |
| Note chips | `rounded-full` |

---

## Shadows

| Element | Shadow |
|---|---|
| Product card | `shadow-[0_20px_60px_rgba(0,0,0,0.08)]` |
| MiniCart panel (desktop) | `shadow-[0_25px_80px_rgba(0,0,0,0.12)]` |
| MiniCart panel (mobile) | `shadow-[0_-10px_40px_rgba(0,0,0,0.08)]` |
| Primary CTA button | `shadow-[0_12px_30px_rgba(182,125,115,0.25)]` |
| Modal | `shadow-[0_30px_100px_rgba(0,0,0,0.18)]` |
| Cart item row | `shadow-[0_12px_40px_rgba(0,0,0,0.06)]` |
| Featured section | `shadow-[0_20px_60px_rgba(0,0,0,0.02)]` |

---

## Buttons

### Primary (Black — navigation/editorial)
```
rounded-full bg-black px-8 py-4 text-sm font-bold uppercase tracking-widest text-white
transition hover:bg-zinc-800 hover:scale-105
```

### Primary (Pink gradient — conversion)
```
rounded-full bg-gradient-to-r from-pink-400 to-blue-400 px-3 md:px-6 py-1.5 md:py-3
text-xs md:text-sm font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl
```

### Primary CTA (MiniCart checkout)
```
rounded-full bg-gradient-to-r from-[#c8948a] to-[#b67d73] px-6 py-4
text-[11px] font-bold uppercase tracking-[0.25em] text-white
shadow-[0_12px_30px_rgba(182,125,115,0.25)]
hover:scale-[1.01] hover:shadow-[0_16px_40px_rgba(182,125,115,0.35)]
disabled:opacity-50
```

### Secondary (Outline)
```
rounded-full border border-gray-200 py-4 font-semibold text-[#4f4a52] transition hover:bg-gray-50
```

### Filter Tabs (active)
```
rounded-xl bg-[#d89ca4] text-white px-3 py-2 md:px-4 md:py-2.5 text-xs font-semibold uppercase tracking-wider shadow-md
```

### Filter Tabs (inactive)
```
rounded-xl border border-zinc-200 bg-white text-zinc-600 px-3 py-2 hover:bg-zinc-50
```

---

## Cards

### Product Card

```
relative flex h-full flex-col overflow-hidden rounded-[32px] bg-white p-4 md:p-6
border border-[#e8ddd6] shadow-[0_20px_60px_rgba(0,0,0,0.08)]
transition-all duration-300 hover:-translate-y-2
```

Image container: `h-[110px] md:h-[280px] rounded-[24px] bg-gradient-to-br from-pink-50 to-blue-50`

**Mobile:** Shows title and price only. Subtitle, mood, notes, profile/season are hidden on mobile (`hidden md:block`).

---

## Inputs

```
w-full rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-sm outline-none
transition focus:border-[#d89ca4]
```

---

## Badges / Tags

| Badge | Classes |
|---|---|
| Best Seller | `rounded-full bg-black px-2 md:px-3 py-0.5 md:py-1 text-[10px] md:text-xs font-bold text-white` |
| New Arrival | `rounded-full bg-pink-500 px-2 md:px-3 py-0.5 md:py-1 text-[10px] md:text-xs font-bold text-white` |
| Note chip | `rounded-full bg-pink-50 px-2.5 md:px-3 py-1 text-[10px] md:text-xs font-semibold text-[#d89ca4]` |
| Wholesale active | `rounded-xl border border-green-200 bg-green-50 px-3 py-2` |

---

## Icons

Icon library: **Lucide React** (v1.16.0)

Used icons: `Heart` (favorites toggle), `X` (close MiniCart).

All icons should be `h-4 w-4` to `h-5 w-5`. No decorative icons without `aria-hidden`.

---

## Animations

Library: **Framer Motion 12**

Used in `QuickAddModal`:
- Modal overlay: `initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}`
- Modal panel: `initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} transition={{ duration: 0.35 }}`
- Image swap: `initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.25 }}`
- Quantity buttons: `whileTap={{ scale: 0.92 }}`
- Add to Cart button: `whileTap={{ scale: 0.97 }}`

Keep animations under 400ms. Prefer `ease-out` for entering, `ease-in` for exiting.

---

## Breakpoints

| Name | Value | Usage |
|---|---|---|
| Mobile | default (0px+) | Base design target — 375px width |
| Tablet/Desktop | `md:` (768px+) | Enhanced layout |
| Wide | `lg:` (1024px+) | 4-column grids |
| Max width | `xl:` (1280px+) | 4-column product grids on homepage |

---

## Tailwind Conventions

- Use Tailwind utility classes directly — no CSS modules, no `styled-components`
- Arbitrary values `[value]` are acceptable for brand colors and specific measurements that fall outside Tailwind's default scale
- `clsx` and `tailwind-merge` are available for conditional class composition
- Responsive prefix order: base → `md:` → `lg:` → `xl:`
- `hidden md:block` pattern for desktop-only content
- `block md:hidden` pattern for mobile-only content

---

## Luxury Brand Principles

1. **White space is luxury** — do not fill every pixel
2. **Restraint over decoration** — one accent color, used purposefully
3. **Typography does the heavy lifting** — let font weight and tracking create hierarchy
4. **Every interaction should feel effortless** — animations should ease, not jolt
5. **Mobile is the primary surface** — desktop is the enhancement

---

## Accessibility

- All buttons with no visible text label must have `aria-label`
- `Heart` button: `aria-label="Close Cart"` pattern (see MiniCart close button)
- All images: meaningful `alt` text describing the product, not the filename
- Interactive elements: visible focus states via Tailwind's `focus:` utilities
- Color contrast: brand pink `#d89ca4` on white requires care — use for decorative text only, not body copy
- Touch targets: minimum 44px × 44px (`h-9 w-9` = 36px minimum — TODO: audit quantity buttons in MiniCart)

---

## Mobile-First Standards

Design questions to ask before every UI change:

- Is every touch target at least 44px?
- Can the primary action be completed with one thumb?
- Is the key information visible without scrolling on a 375px screen?
- Does the mobile version hide non-essential content (subtitle, mood, notes on ProductCard)?
- Is there a sticky CTA for long pages (PDP sticky bar, MiniCart checkout button)?
