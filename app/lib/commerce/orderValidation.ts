import { ALL_PROVINCES, isCollectionOrder } from "./delivery";

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

  const expectedTotal = (b.subtotal as number) + (b.delivery as number);
  if (Math.abs((b.total as number) - expectedTotal) > TOTAL_TOLERANCE)
    return "Order total does not match.";

  return null;
}
