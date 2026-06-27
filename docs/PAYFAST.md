# PayFast

**Project:** Maison Skye & Rose
**Related:** [docs/SUPABASE.md](SUPABASE.md) · [docs/DEPLOYMENT.md](DEPLOYMENT.md) · [docs/CART.md](CART.md)

---

## Overview

PayFast is the secondary checkout method. The primary checkout method is WhatsApp (see [docs/MINICART.md](MINICART.md)). PayFast handles card payments and EFT for customers who prefer a formal online checkout.

**Current status:** Sandbox mode. Not yet live in production.

---

## Payment Flow

```
User fills checkout form (name, phone, address, province)
  → clicks "Secure Payment"
  → POST /api/orders → Supabase insert (status: pending)
  → POST /api/payfast → builds PayFast query string
  → Returns { success: true, paymentUrl }
  → window.location.href redirects to PayFast (sandbox)
  → Customer completes payment on PayFast
  → PayFast redirects to return_url (/payment-success) or cancel_url (/payment-cancel)
```

---

## Route Handler

`app/api/payfast/route.ts` — POST handler:

**Input (request body):**

```ts
{
  amount: number,   // total order amount in ZAR
  item_name: string // "Maison Skye & Rose Order"
}
```

**PayFast payment data built:**

```ts
{
  merchant_id,
  merchant_key,
  return_url: `${website_url}/payment-success`,
  cancel_url: `${website_url}/payment-cancel`,
  notify_url: `${website_url}/api/payfast`,   // ITN webhook (not yet implemented as receiver)
  name_first: "Maison",
  name_last: "Customer",
  email_address: "customer@email.com",        // Hardcoded placeholder — not customer's actual email
  m_payment_id: `MSR-${Date.now()}`,          // Unique per-payment ID
  amount: amount.toFixed(2),
  item_name,
}
```

**Output:**

```ts
{ success: true, paymentUrl: string }
// or
{ success: false, error: "Payment initialization failed" }
```

**Current sandbox URL:**

```
https://sandbox.payfast.co.za/eng/process?{queryString}
```

---

## Order Flow

Before calling `/api/payfast`, the checkout page calls `/api/orders` to persist the order to Supabase with `payment_status: "pending"`. This ensures the order is recorded even if the customer does not complete payment.

TODO: The `payment_status` is never updated from `"pending"` because the PayFast ITN (Instant Transaction Notification) webhook receiver is not implemented. This means Supabase `orders` will always show `payment_status: "pending"` regardless of whether payment succeeded.

---

## Verification / ITN

PayFast sends an ITN (Instant Transaction Notification) POST to the `notify_url` after a transaction. The `notify_url` is set to `${website_url}/api/payfast`.

**Current state:** The `/api/payfast` route only handles POST requests to *initiate* payment. It does not handle incoming ITN callbacks from PayFast. Implementing ITN would require:

1. Separating initiation from ITN handling (or using query params to distinguish)
2. Verifying the PayFast signature on the ITN payload
3. Updating the Supabase order `payment_status` based on the ITN `payment_status` field

---

## Environment Variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_PAYFAST_MERCHANT_ID` | Identifies the merchant account |
| `NEXT_PUBLIC_PAYFAST_MERCHANT_KEY` | Authenticates the merchant |
| `NEXT_PUBLIC_PAYFAST_PASSPHRASE` | Used for signature generation (currently built into query string but not hashed) |
| `NEXT_PUBLIC_WEBSITE_URL` | Used to construct return, cancel, and notify URLs |

---

## Security Considerations

1. **All PayFast credentials use `NEXT_PUBLIC_` prefix** — they are included in the client bundle. This is acceptable for `merchant_id` and `merchant_key` (these are semi-public by PayFast's design) but represents a risk for the `passphrase`. Consider moving credentials to server-only environment variables (without `NEXT_PUBLIC_` prefix) and handling the entire PayFast initialization server-side only.

2. **No signature hash** — PayFast recommends computing an MD5 signature of the payment data using the passphrase. The current implementation does not compute this signature. This should be added before going live.

3. **ITN not implemented** — without ITN, payment status cannot be verified server-side. An order could be marked as paid in PayFast but still show `pending` in Supabase.

4. **Hardcoded customer details** — `name_first: "Maison"`, `name_last: "Customer"`, `email_address: "customer@email.com"` are placeholders. These should use the actual customer name and email from the checkout form.

---

## Switching to Production

Before going live:

1. Replace sandbox URL in `app/api/payfast/route.ts`:
   ```
   https://sandbox.payfast.co.za/eng/process  →  https://www.payfast.co.za/eng/process
   ```
2. Replace sandbox credentials with live PayFast merchant credentials
3. Implement MD5 signature generation
4. Implement ITN handler to update order `payment_status`
5. Use actual customer name and email from the checkout form
6. Test the full payment flow on live PayFast before public launch

---

## Testing Checklist

- [ ] Sandbox order completes and redirects to `/payment-success`
- [ ] Cancelled order redirects to `/payment-cancel`
- [ ] Order appears in Supabase `orders` table with `payment_status: "pending"`
- [ ] `m_payment_id` is unique per transaction (uses `Date.now()`)
- [ ] Amount matches the checkout total
- [ ] Environment variables are set in Vercel (not only `.env.local`)
