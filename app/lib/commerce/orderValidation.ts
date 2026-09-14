import { ALL_PROVINCES, isCollectionOrder, computeDelivery } from "./delivery";
import { WHOLESALE_THRESHOLD, getWholesaleItemPrice } from "./wholesale";

const MAX_LENGTHS = { customer_name: 100, phone: 20, address: 500 } as const;
const MAX_ITEMS       = 50;
const TOTAL_TOLERANCE = 0.02;

export function validateOrderBody(body: unknown): string | null {
  if (!body || typeof body !== "object") return "Invalid request.";
  const b = body as Record<string, unknown>;

  if (!b.customer_name || typeof b.customer_name !== "string" || b.customer_name.trim().length < 2)
    return "Please enter your full name.";
  if (b.customer_name.trim().length > MAX_LENGTHS.customer_name)
    return "Name is too long.";

  if (!b.phone || typeof b.phone !== "string" || b.phone.trim().replace(/\D/g, "").length < 9)
    return "Please enter a valid phone number.";
  if (b.phone.trim().length > MAX_LENGTHS.phone)
    return "Phone number is too long.";

  // Province validated before address — collection orders do not require an address.
  if (!b.province || !ALL_PROVINCES.includes(b.province as string))
    return "Please select a valid delivery area.";

  if (!isCollectionOrder(b.province as string)) {
    if (!b.address || typeof b.address !== "string" || b.address.trim().length < 5)
      return "Please enter your delivery address.";
    if (b.address.trim().length > MAX_LENGTHS.address)
      return "Address is too long.";
  }

  if (!Array.isArray(b.items) || b.items.length === 0)
    return "Your cart appears to be empty.";
  if (b.items.length > MAX_ITEMS)
    return "Your cart contains too many items.";

  for (const item of b.items) {
    if (!item || typeof item !== "object") return "Invalid cart item.";
    const i = item as Record<string, unknown>;
    if (typeof i.id       !== "string"  || !i.id)                         return "Invalid cart item.";
    if (typeof i.title    !== "string"  || !i.title)                      return "Invalid cart item.";
    if (typeof i.price    !== "number"  || i.price < 0)                   return "Invalid cart item price.";
    if (typeof i.quantity !== "number"  || i.quantity < 1
        || !Number.isInteger(i.quantity))                                 return "Invalid cart item quantity.";
    if (typeof i.size     !== "string"  || !i.size)                       return "Invalid cart item size.";
  }

  if (typeof b.subtotal !== "number" || b.subtotal <= 0) return "Invalid order total.";
  if (typeof b.delivery !== "number" || b.delivery <  0) return "Invalid delivery amount.";
  if (typeof b.total    !== "number" || b.total    <= 0) return "Invalid order total.";

  // Recompute subtotal and delivery server-side from item data.
  // This prevents a tampered client payload from obtaining free delivery.
  const castItems = b.items as Array<Record<string, unknown>>;
  const cartCount = castItems.reduce((n, i) => n + (i.quantity as number), 0);
  const activeWholesale = cartCount >= WHOLESALE_THRESHOLD;
  const serverSubtotal = castItems.reduce(
    (sum, i) =>
      sum + getWholesaleItemPrice(i.size as string, i.price as number, activeWholesale) * (i.quantity as number),
    0,
  );
  const serverDelivery = computeDelivery(b.province as string, serverSubtotal);

  if (Math.abs((b.subtotal as number) - serverSubtotal) > TOTAL_TOLERANCE)
    return "Order subtotal does not match.";
  if (Math.abs((b.delivery as number) - serverDelivery) > TOTAL_TOLERANCE)
    return "Delivery charge does not match.";

  const expectedTotal = serverSubtotal + serverDelivery;
  if (Math.abs((b.total as number) - expectedTotal) > TOTAL_TOLERANCE)
    return "Order total does not match.";

  return null;
}
