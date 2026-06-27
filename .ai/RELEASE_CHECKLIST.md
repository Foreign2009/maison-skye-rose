# Release Checklist — Maison Skye & Rose

Everything that must be complete before the site goes live with real customers.
Check each item off only when verified — not when "probably done".

---

## Critical — Must Be Done Before Any Live Traffic

### Payments

- [ ] **Switch PayFast URL from sandbox to production**
  `https://sandbox.payfast.co.za/eng/process` → `https://www.payfast.co.za/eng/process`
  File: `app/api/payfast/route.ts`

- [ ] **Replace sandbox PayFast credentials with live credentials**
  Update `NEXT_PUBLIC_PAYFAST_MERCHANT_ID` and `NEXT_PUBLIC_PAYFAST_MERCHANT_KEY` in Vercel environment variables.

- [ ] **Implement MD5 signature generation in PayFast route**
  PayFast requires an MD5 hash of the payment payload. Currently missing.
  File: `app/api/payfast/route.ts`

- [ ] **Implement PayFast ITN webhook receiver**
  Without this, all Supabase orders stay `payment_status: "pending"` forever.
  File: `app/api/payfast/route.ts` (or new route)

- [ ] **Replace hardcoded customer details with actual form data**
  `name_first`, `name_last`, `email_address` are currently hardcoded placeholders.
  File: `app/api/payfast/route.ts`

- [ ] **Move PayFast passphrase to server-only env var**
  Drop `NEXT_PUBLIC_` prefix from `NEXT_PUBLIC_PAYFAST_PASSPHRASE`. Update route handler to read from `process.env.PAYFAST_PASSPHRASE`.
  Security risk: passphrase is currently exposed in client bundle.

- [ ] **Test full PayFast payment flow end-to-end on live**
  Add to cart → checkout form → PayFast live → payment-success → Supabase order status updated.

---

### Infrastructure

- [ ] **All environment variables set in Vercel production**
  Verify each variable is present:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_PAYFAST_MERCHANT_ID`
  - `NEXT_PUBLIC_PAYFAST_MERCHANT_KEY`
  - `PAYFAST_PASSPHRASE` (after moving to server-only)
  - `NEXT_PUBLIC_WEBSITE_URL` — must be the real production domain

- [ ] **Custom domain configured in Vercel and SSL active**

- [ ] **`NEXT_PUBLIC_WEBSITE_URL` points to the real domain** (not localhost or a preview URL)

---

## High Priority — Should Be Done Before Launch

### SEO

- [ ] **Add `app/sitemap.ts`** — enumerate all product URLs + collection + static pages
  Required for Google to discover product pages.

- [ ] **Add `app/robots.ts`** — explicit allow/disallow rules

- [ ] **Add Open Graph metadata to homepage** — OG title, description, image
  File: `app/layout.tsx` or `app/page.tsx`

- [ ] **Add Open Graph metadata to shop page** (`app/shop/page.tsx`)

- [ ] **Add Open Graph metadata to collection pages** (`/collections/skye`, `/collections/rose`, `/collections/elite`)

- [ ] **Verify OG images are publicly accessible** at `${NEXT_PUBLIC_WEBSITE_URL}/images/...`
  Product OG images are set to `${baseUrl}${imagePath}` — only works if the domain and image paths are correct.

- [ ] **Submit sitemap to Google Search Console** after deploying

### Content

- [ ] **Fix instagramUrl in brand.ts** — currently `"https://instagram.com/"` with no handle
  File: `app/data/brand.ts`

- [ ] **Verify WhatsApp number is correct** — `27696863952` — test a real WhatsApp message opens correctly

### Consistency

- [ ] **Reconcile delivery pricing** — MiniCart (total-based R100/free at R2000) vs Checkout (province-based R100/R180)
  Decision required: which model to use. See `DECISIONS.md` D10.

---

## Functional Testing — Before Launch

### WhatsApp Checkout Flow (Primary)

- [ ] Add 1 item to cart → open MiniCart → click Checkout via WhatsApp
- [ ] Verify message format: order lines, reward section, totals, empty customer fields
- [ ] Verify message opens in WhatsApp on mobile and desktop
- [ ] Test with wholesale active (10+ units) — verify WHOLESALE ORDER label in message

### PayFast Checkout Flow (Secondary)

- [ ] Add items → fill checkout form → click Secure Payment
- [ ] Verify order appears in Supabase with correct fields
- [ ] Verify PayFast payment page loads (live, not sandbox)
- [ ] Complete a test payment → verify redirect to /payment-success
- [ ] Cancel a payment → verify redirect to /payment-cancel
- [ ] Verify Supabase order payment_status updates to "paid" after successful payment (ITN)

### Cart

- [ ] Add from ProductDetail, QuickAddModal, and MiniCart recommendations — verify no duplicate line items for same product/size
- [ ] Refresh page — cart persists
- [ ] Open new browser tab — cart persists
- [ ] Add 10 units — wholesale activates, prices change, delivery shows FREE
- [ ] Remove items below 10 — wholesale deactivates, retail prices restore

### Rewards

- [ ] Subtotal below R400 — no reward shown
- [ ] Subtotal R400 → "1 Free 5ml Sample" unlocked
- [ ] Subtotal R700 → "2 Free 5ml Samples" unlocked
- [ ] Subtotal R1000 → "3 Free 5ml Samples" unlocked
- [ ] Subtotal R1500 → "Discovery Set (5 × 5ml)" unlocked
- [ ] Subtotal R2000 → free delivery shown in MiniCart total

### Mobile (Test on Real Device at 375px)

- [ ] Homepage scrolls smoothly — no layout breaks
- [ ] Shop page filter drawer opens and closes
- [ ] MiniCart opens full-screen — products scroll, footer sticky
- [ ] QuickAddModal opens and closes correctly
- [ ] PDP sticky CTA appears after scrolling
- [ ] All buttons are tappable (aim for 44px, verify MiniCart quantity buttons)

### SEO

- [ ] Product pages: view source — verify `<title>`, `<meta name="description">`, `<link rel="canonical">`, JSON-LD
- [ ] Homepage: view source — verify title and description (at minimum)
- [ ] /sitemap.xml is accessible and lists product URLs

---

## Build Verification

- [ ] `npm run build` passes with zero TypeScript errors
- [ ] Zero new warnings in build output
- [ ] Correct number of static pages generated (one per fragrance + static pages)
- [ ] No unoptimized image warnings

---

## Post-Launch Monitoring

- [ ] First 5 WhatsApp orders received and processed correctly
- [ ] First PayFast payment completes and Supabase order status updates
- [ ] No JavaScript console errors on homepage, shop, and product pages
- [ ] Google Search Console — verify no crawl errors after sitemap submission
