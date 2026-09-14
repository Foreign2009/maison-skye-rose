import { ALL_PROVINCES, isCollectionOrder, computeDelivery } from "./delivery";
import { WHOLESALE_THRESHOLD, getWholesaleItemPrice } from "./wholesale";
import { mkcCatalogue } from "../mkc/catalogue";
import type { FragranceKnowledge } from "../mkc/types";

// Built once at module load; O(1) lookups during request handling.
const catalogueBySlug = new Map<string, FragranceKnowledge>(
  mkcCatalogue.map(f => [f.slug, f]),
);

const MAX_LENGTHS = { customer_name: 100, phone: 20, address: 500 } as const;
const MAX_ITEMS   = 50;

export type NormalizedOrderItem = {
  id:       string;
  title:    string;
  price:    number;   // effective price — retail, or wholesale when threshold is met
  quantity: number;
  size:     string;
};

export type OrderValidationResult =
  | { ok: false; error: string }
  | { ok: true;  subtotal: number; delivery: number; total: number; items: NormalizedOrderItem[] };

function isPurchasable(product: FragranceKnowledge): boolean {
  const s = product.availabilityStatus;
  // Absence defaults to "online" per catalogue type definition.
  return s === undefined || s === "online" || s === "limited";
}

export function validateOrderBody(body: unknown): OrderValidationResult {
  if (!body || typeof body !== "object") return { ok: false, error: "Invalid request." };
  const b = body as Record<string, unknown>;

  if (!b.customer_name || typeof b.customer_name !== "string" || b.customer_name.trim().length < 2)
    return { ok: false, error: "Please enter your full name." };
  if (b.customer_name.trim().length > MAX_LENGTHS.customer_name)
    return { ok: false, error: "Name is too long." };

  if (!b.phone || typeof b.phone !== "string" || b.phone.trim().replace(/\D/g, "").length < 9)
    return { ok: false, error: "Please enter a valid phone number." };
  if (b.phone.trim().length > MAX_LENGTHS.phone)
    return { ok: false, error: "Phone number is too long." };

  // Province validated before address — collection orders do not require an address.
  if (!b.province || !ALL_PROVINCES.includes(b.province as string))
    return { ok: false, error: "Please select a valid delivery area." };

  if (!isCollectionOrder(b.province as string)) {
    if (!b.address || typeof b.address !== "string" || b.address.trim().length < 5)
      return { ok: false, error: "Please enter your delivery address." };
    if (b.address.trim().length > MAX_LENGTHS.address)
      return { ok: false, error: "Address is too long." };
  }

  if (!Array.isArray(b.items) || b.items.length === 0)
    return { ok: false, error: "Your cart appears to be empty." };
  if (b.items.length > MAX_ITEMS)
    return { ok: false, error: "Your cart contains too many items." };

  for (const item of b.items) {
    if (!item || typeof item !== "object") return { ok: false, error: "Invalid cart item." };
    const i = item as Record<string, unknown>;
    if (typeof i.id       !== "string" || !i.id)    return { ok: false, error: "Invalid cart item." };
    if (typeof i.title    !== "string" || !i.title) return { ok: false, error: "Invalid cart item." };
    if (typeof i.quantity !== "number" || i.quantity < 1 || !Number.isInteger(i.quantity))
      return { ok: false, error: "Invalid cart item quantity." };
    if (typeof i.size !== "string" || !i.size) return { ok: false, error: "Invalid cart item size." };

    // Resolve item against authoritative catalogue — client-submitted price is ignored.
    const product = catalogueBySlug.get(i.id as string);
    if (!product)                    return { ok: false, error: `Product not found: ${i.id}` };
    if (!isPurchasable(product))     return { ok: false, error: "Product is not available." };
    if (product.prices[i.size as "5ml" | "10ml" | "30ml"] === undefined)
      return { ok: false, error: "Invalid product size." };
  }

  if (typeof b.subtotal !== "number" || b.subtotal <= 0) return { ok: false, error: "Invalid order total." };
  if (typeof b.delivery !== "number" || b.delivery <  0) return { ok: false, error: "Invalid delivery amount." };
  if (typeof b.total    !== "number" || b.total    <= 0) return { ok: false, error: "Invalid order total." };

  // Recompute from authoritative catalogue prices.
  // Client-submitted unit prices, subtotal, delivery, total, and wholesale flags are not trusted.
  const castItems       = b.items as Array<Record<string, unknown>>;
  const cartCount       = castItems.reduce((n, i) => n + (i.quantity as number), 0);
  const activeWholesale = cartCount >= WHOLESALE_THRESHOLD;

  const normalizedItems: NormalizedOrderItem[] = [];
  const serverSubtotal = castItems.reduce((sum, i) => {
    const product        = catalogueBySlug.get(i.id as string)!; // already validated above
    const retailPrice    = product.prices[i.size as "5ml" | "10ml" | "30ml"]!;
    const effectivePrice = getWholesaleItemPrice(i.size as string, retailPrice, activeWholesale);
    normalizedItems.push({
      id:       i.id       as string,
      title:    i.title    as string,
      price:    effectivePrice,
      quantity: i.quantity as number,
      size:     i.size     as string,
    });
    return sum + effectivePrice * (i.quantity as number);
  }, 0);

  const serverDelivery = computeDelivery(b.province as string, serverSubtotal);
  const serverTotal    = serverSubtotal + serverDelivery;

  // All catalogue prices are whole numbers — exact integer comparison is correct.
  if ((b.subtotal as number) !== serverSubtotal)
    return { ok: false, error: "Order subtotal does not match." };
  if ((b.delivery as number) !== serverDelivery)
    return { ok: false, error: "Delivery charge does not match." };
  if ((b.total as number) !== serverTotal)
    return { ok: false, error: "Order total does not match." };

  return { ok: true, subtotal: serverSubtotal, delivery: serverDelivery, total: serverTotal, items: normalizedItems };
}
