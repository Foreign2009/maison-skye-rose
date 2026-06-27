# Deployment

**Project:** Maison Skye & Rose
**Related:** [README.md](../README.md) · [docs/SUPABASE.md](SUPABASE.md) · [docs/PAYFAST.md](PAYFAST.md)

---

## Platform

Deployed on **Vercel**. Pushing to `main` triggers automatic production deployment.

---

## Environment Variables

The following environment variables must be configured in Vercel → Project Settings → Environment Variables:

| Variable | Description | Required |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous public key | Yes |
| `NEXT_PUBLIC_PAYFAST_MERCHANT_ID` | PayFast merchant ID | Yes |
| `NEXT_PUBLIC_PAYFAST_MERCHANT_KEY` | PayFast merchant key | Yes |
| `NEXT_PUBLIC_PAYFAST_PASSPHRASE` | PayFast passphrase | Yes |
| `NEXT_PUBLIC_WEBSITE_URL` | Full production URL e.g. `https://maisonskyerose.com` | Yes |

**Important:** All variables use the `NEXT_PUBLIC_` prefix, making them accessible in both server-side Route Handlers and client-side components. This means they are embedded in the client bundle at build time — do not use this prefix for secrets that must remain server-only.

For local development, create `.env.local` in the project root. This file is gitignored and must never be committed.

---

## Build Process

```bash
npm run build
```

Build steps:
1. TypeScript compilation — errors fail the build
2. Static generation of all product pages via `generateStaticParams`
3. Optimization of all `next/image` references
4. Output to `.next/` directory

Build output includes:
- List of all statically generated pages and their sizes
- Bundle sizes per route
- Total pages count

A clean build must produce zero TypeScript errors and zero build errors before deployment.

---

## Production Deployment

1. Ensure all environment variables are set in Vercel
2. Push to `main`:
   ```bash
   git push origin main
   ```
3. Vercel detects the push and triggers a build
4. On successful build, the new version is promoted to production

---

## PayFast: Sandbox vs Production

The current `app/api/payfast/route.ts` uses the **sandbox URL**:

```ts
const paymentUrl = `https://sandbox.payfast.co.za/eng/process?${queryString}`;
```

Before going live, this must be changed to:

```
https://www.payfast.co.za/eng/process
```

This change requires a code update and redeployment. **Do not deploy to production with the sandbox URL.**

---

## Custom Domain

TODO: Verify custom domain configuration from Vercel project settings.

Steps (general):
1. Add domain in Vercel → Project → Domains
2. Update DNS records at your domain registrar (A record or CNAME pointing to Vercel)
3. Vercel provisions SSL automatically via Let's Encrypt
4. Update `NEXT_PUBLIC_WEBSITE_URL` in Vercel environment variables to match the production domain

---

## Known Deployment Requirements

- `NEXT_PUBLIC_WEBSITE_URL` must be set correctly — it is used to construct canonical URLs, OG image URLs, and PayFast return/cancel/notify URLs
- PayFast `notify_url` is set to `${website_url}/api/payfast` — this Route Handler must be publicly accessible (Vercel deployment satisfies this)
- Supabase `orders` table must exist with the correct schema before orders can be persisted (see [docs/SUPABASE.md](SUPABASE.md))

---

## Vercel-Specific Notes

- Next.js 16 is fully supported on Vercel
- Route Handlers (`app/api/*/route.ts`) deploy as Vercel Serverless Functions
- Static pages (product pages via `generateStaticParams`) are served from Vercel's Edge Network

TODO: Confirm Vercel project name and team/organisation from Vercel dashboard.
