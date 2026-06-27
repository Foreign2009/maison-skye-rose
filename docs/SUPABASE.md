# Supabase

**Project:** Maison Skye & Rose
**Related:** [docs/DEPLOYMENT.md](DEPLOYMENT.md) · [docs/PAYFAST.md](PAYFAST.md)

---

## Overview

Supabase provides the PostgreSQL database for order persistence. It is used exclusively for storing orders submitted through the checkout form. Product data, cart state, and favorites are not stored in Supabase — they live in `fragrances.ts` (static) and `localStorage` (browser).

---

## Client Setup

`app/lib/supabase.ts`:

```ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

A single shared Supabase client is exported. It uses the anonymous public key — there is no authenticated user session. Row-level security (RLS) policies govern what operations are permitted with the anon key.

**SDK version:** `@supabase/supabase-js` ^2.106.2

---

## Authentication

No user authentication is implemented. The Supabase client operates with the anon key only.

Orders are associated with customer details (name, phone, address) submitted via the checkout form — not a Supabase Auth user ID.

TODO: If customer authentication is added in future, use Supabase Auth with Next.js middleware for session management.

---

## Tables

### `orders`

The only confirmed table. Used by `app/api/orders/route.ts`.

| Column | Type | Notes |
|---|---|---|
| `id` | auto-generated | Primary key (inferred from Supabase default) |
| `customer_name` | text | Full name from checkout form |
| `phone` | text | Phone number from checkout form |
| `address` | text | Delivery address from checkout form |
| `province` | text | Province selection (Western Cape / Gauteng / KwaZulu-Natal) |
| `items` | jsonb | Array of `CartProduct` objects |
| `subtotal` | numeric | Cart subtotal (retail prices, before wholesale if applicable) |
| `vat` | numeric | VAT calculated at 15% of subtotal |
| `delivery` | numeric | Delivery fee (R100 Western Cape, R180 other) |
| `total` | numeric | subtotal + vat + delivery |
| `payment_status` | text | Set to `"pending"` on insert; never updated (PayFast ITN not implemented) |
| `created_at` | timestamp | TODO: Verify if this column exists / is auto-set by Supabase |

**Insert operation** (from `app/api/orders/route.ts`):

```ts
await supabase
  .from("orders")
  .insert([{ customer_name, phone, address, province, items, subtotal, vat, delivery, total, payment_status: "pending" }])
  .select();
```

---

## RLS (Row Level Security)

TODO: Verify RLS policies from the Supabase dashboard. The anon key is used for inserts — the `orders` table must have an RLS policy that permits anonymous inserts, or RLS must be disabled for this table.

---

## Storage

No Supabase Storage is currently used. Product images are stored as static files in `/public/` and served via Vercel's CDN.

---

## Future Migrations

When schema changes are needed:

1. Plan the migration in ChatGPT first — identify columns to add, types, nullability, defaults
2. Test in the Supabase dashboard using the SQL editor
3. Apply to production via Supabase dashboard → Table Editor or SQL editor
4. Update this document with the new schema

TODO: Confirm whether a migration tool (e.g., Supabase CLI) is used or if changes are applied manually through the dashboard.

---

## Known Conventions

- The Supabase client is initialized once in `app/lib/supabase.ts` and imported wherever needed — do not create additional clients
- Use `@/app/lib/supabase` (path alias) when importing in Route Handlers
- Error objects from Supabase (`{ data, error }`) must always be checked before using `data`
- The `payment_status` column is always `"pending"` — a future PayFast ITN webhook should update this to `"paid"`, `"failed"`, or `"cancelled"`
