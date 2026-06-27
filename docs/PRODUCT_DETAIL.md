# Product Detail

**Project:** Maison Skye & Rose
**Related:** [docs/CART.md](CART.md) · [SEO.md](../SEO.md) · [docs/FAVORITES.md](FAVORITES.md)

---

## Purpose

The Product Detail Page (PDP) is the primary conversion page. It presents the complete fragrance story, handles size selection, and provides two purchase paths: Add to Cart (opens MiniCart) and Buy Now (opens WhatsApp).

---

## Architecture

The PDP is split into two files:

| File | Type | Role |
|---|---|---|
| `app/product/[slug]/page.tsx` | Server Component | Routing, static params, metadata, JSON-LD |
| `app/components/ProductDetail.tsx` | Client Component | All interactive UI |

---

## Routing & Static Generation

`app/product/[slug]/page.tsx` pre-renders all product pages at build time:

```ts
export function generateStaticParams() {
  return fragrances.map((f) => ({ slug: toSlug(f.title) }));
}
```

`toSlug()`: `title.toLowerCase().replace(/\s+/g, "-")`

URL example: `/product/black-orchid-noir`

If a slug is not found in the `fragrances` array, `notFound()` is called and Next.js renders the 404 page.

---

## SEO (Server Component)

### generateMetadata

```ts
export async function generateMetadata({ params }): Promise<Metadata> {
  return {
    title: `${fragrance.title} | Maison Skye & Rose`,
    description: `${fragrance.mood} Notes: ${fragrance.notes.join(", ")}. From R${startingPrice}.`,
    category: fragrance.collection,
    robots: { index: true, follow: true },
    alternates: { canonical: url },
    openGraph: {
      title, description, url,
      images: [{ url: ogImage, width: 800, height: 800, alt: fragrance.title }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title, description, images: [ogImage]
    },
  };
}
```

### JSON-LD

Product schema is injected via `<script type="application/ld+json">`:

```ts
{
  "@type": "Product",
  name, description, brand, image, url, sku, category,
  offers: [
    { "@type": "Offer", name: "5ml",  price: ..., priceCurrency: "ZAR", availability: "InStock" },
    { "@type": "Offer", name: "10ml", price: ..., priceCurrency: "ZAR", availability: "InStock" },
    { "@type": "Offer", name: "30ml", price: ..., priceCurrency: "ZAR", availability: "InStock" },
  ]
}
```

---

## PDP Layout (ProductDetail.tsx)

### Breadcrumb (Desktop only)
```
Shop / {collection} / {title}
```

### Product Gallery

Main image: `next/image` with `width={240} height={240} priority` — PDP is a destination page so `priority` is appropriate.

Size thumbnail strip: 3 buttons (5ml / 10ml / 30ml), each showing the corresponding bottle image. Clicking a thumbnail updates `selectedSize` state and swaps the main image.

### Product Information

- Collection label (small, accent color)
- Product title (H1, large, font-black)
- Subtitle (secondary accent)
- Attribute chips: Profile, Season, Best Seller badge, New Arrival badge
- Mood description
- Price for selected size

### Trust Block

```
🎁 Orders over R400 receive a FREE 5ml Sample
✓ Nationwide South African Delivery
✓ 465+ Signature Fragrances Available
✓ Secure Checkout
✓ Luxury Inspired Fragrance Collection
```

### Size Selector

3-column grid with size buttons. Selected size: `bg-[#d89ca4] text-white border-[#d89ca4]`

Each button shows:
- Size label (5ml / 10ml / 30ml)
- Descriptor: "Perfect for Trying" / "Most Popular" / "Best Value"
- Price

### CTAs

1. **Add To Cart** — calls `addToCart()` then `openCart()` (opens MiniCart)
2. **Buy Now** — calls `addToCart()` then opens WhatsApp with pre-populated message

### Fragrance Profile Card

2×2 grid: Collection | Profile | Season | Best For (hardcoded to "Daily Wear")

### The Experience Section

Full-width paragraph combining `fragrance.title`, notes, and a narrative about the fragrance.

### Fragrance Notes Section

3 cards: Top Note / Heart Note / Base Note — reads `fragrance.notes[0]`, `[1]`, `[2]`

Note: This assumes `notes` is a flat array (`string[]`), not the `{ top, heart, base }` structure in the `Fragrance` type from `types.ts`. The display data uses the flat array.

### Related Products

4-column grid of other products from the same collection (up to 4), linked to their PDP. Uses `next/image` with `fill` and `sizes="(max-width: 768px) 50vw, 25vw"`.

---

## Sticky CTA (Mobile)

Appears after the user scrolls 300px:

```ts
const [showStickyBar, setShowStickyBar] = useState(false);

useEffect(() => {
  const handleScroll = () => setShowStickyBar(window.scrollY > 300);
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);
```

Sticky bar shows: selected size label, size descriptor, truncated product title, price, Add To Cart button.

**Mobile only** — `md:hidden`

---

## Recently Viewed Tracking

On PDP mount, the fragrance is added to `localStorage("recentlyViewed")`:

```ts
useEffect(() => {
  const existing = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
  const filtered = existing.filter((item: any) => item.title !== fragrance.title);
  const entry = { title, subtitle, mood, profile, season, notes, prices, images };
  localStorage.setItem("recentlyViewed", JSON.stringify([entry, ...filtered].slice(0, 12)));
}, [fragrance.title]);
```

Up to 12 recently viewed products are stored.

---

## WhatsApp Buy Now Message

```ts
`Hi Maison Skye & Rose! 👋\n\n
I'd like to order the following:\n\n
🧴 Fragrance: ${fragrance.title}\n
📦 Size: ${selectedSize}\n
🔢 Quantity: 1\n
💰 Price: R${fragrance.prices[selectedSize]}\n\n
Please let me know the total including delivery and send me the payment details.\n\n
Thank you!`
```

Opens `wa.me/{brand.social.whatsappNumber}` in a new tab.

---

## User Flow

```
User clicks product from any listing page
  → navigates to /product/{slug}
  → Server Component renders static HTML with metadata and JSON-LD
  → ProductDetail hydrates as client component
  → Recently viewed entry written to localStorage on mount
  → User selects size → main image swaps, price updates
  → Add To Cart → item added to CartContext → MiniCart opens
  → Buy Now → item added to CartContext → WhatsApp message opens
```

---

## Important Files

| File | Role |
|---|---|
| `app/product/[slug]/page.tsx` | Static routing, metadata, JSON-LD |
| `app/components/ProductDetail.tsx` | All interactive PDP UI |
| `app/data/fragrances.ts` | Product data source |
| `app/data/brand.ts` | WhatsApp number for Buy Now |
| `app/context/CartContext.tsx` | `addToCart` |
| `app/context/CartUIContext.tsx` | `openCart` (opens MiniCart after Add To Cart) |
