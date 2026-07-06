import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

const VALID_PROVINCES = [
  "Cape Town Metro",
  "Western Cape Regional",
  "Gauteng",
  "KwaZulu-Natal",
  "Other Major Cities",
  "Outlying Areas",
] as const;

const MAX_LENGTHS = { customer_name: 100, phone: 20, address: 500 } as const;
const MAX_ITEMS       = 50;
const TOTAL_TOLERANCE = 0.02;

function generateOrderRef(): string {
  const now     = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
  const suffix  = Math.floor(10000 + Math.random() * 90000);
  return `MSR-${dateStr}-${suffix}`;
}

function validateBody(body: unknown): string | null {
  if (!body || typeof body !== "object") return "Invalid request.";
  const b = body as Record<string, unknown>;

  // ── String fields ──────────────────────────────────────────────────────────
  if (!b.customer_name || typeof b.customer_name !== "string" || b.customer_name.trim().length < 2)
    return "Please enter your full name.";
  if (b.customer_name.trim().length > MAX_LENGTHS.customer_name)
    return "Name is too long.";

  if (!b.phone || typeof b.phone !== "string" || b.phone.trim().replace(/\D/g, "").length < 9)
    return "Please enter a valid phone number.";
  if (b.phone.trim().length > MAX_LENGTHS.phone)
    return "Phone number is too long.";

  if (!b.address || typeof b.address !== "string" || b.address.trim().length < 5)
    return "Please enter your delivery address.";
  if (b.address.trim().length > MAX_LENGTHS.address)
    return "Address is too long.";

  if (!b.province || !(VALID_PROVINCES as readonly string[]).includes(b.province as string))
    return "Please select a valid delivery area.";

  // ── Cart items ─────────────────────────────────────────────────────────────
  if (!Array.isArray(b.items) || b.items.length === 0)
    return "Your cart appears to be empty.";
  if (b.items.length > MAX_ITEMS)
    return "Your cart contains too many items.";

  for (const item of b.items) {
    if (!item || typeof item !== "object") return "Invalid cart item.";
    const i = item as Record<string, unknown>;
    if (typeof i.id       !== "string"  || !i.id)                          return "Invalid cart item.";
    if (typeof i.title    !== "string"  || !i.title)                       return "Invalid cart item.";
    if (typeof i.price    !== "number"  || i.price < 0)                    return "Invalid cart item price.";
    if (typeof i.quantity !== "number"  || i.quantity < 1
        || !Number.isInteger(i.quantity))                                  return "Invalid cart item quantity.";
    if (typeof i.size     !== "string"  || !i.size)                        return "Invalid cart item size.";
  }

  // ── Totals ─────────────────────────────────────────────────────────────────
  if (typeof b.subtotal !== "number" || b.subtotal <= 0) return "Invalid order total.";
  if (typeof b.delivery !== "number" || b.delivery <  0) return "Invalid delivery amount.";
  if (typeof b.total    !== "number" || b.total    <= 0) return "Invalid order total.";

  const expectedTotal = (b.subtotal as number) + (b.delivery as number);
  if (Math.abs((b.total as number) - expectedTotal) > TOTAL_TOLERANCE)
    return "Order total does not match.";

  return null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validationError = validateBody(body);
    if (validationError) {
      return NextResponse.json(
        { success: false, message: validationError },
        { status: 400 }
      );
    }

    const {
      customer_name,
      phone,
      address,
      province,
      items,
      subtotal,
      delivery,
      total,
    } = body as {
      customer_name: string;
      phone:         string;
      address:       string;
      province:      string;
      items:         unknown[];
      subtotal:      number;
      delivery:      number;
      total:         number;
    };

    const order_ref = generateOrderRef();

    const { error } = await supabase
      .from("orders")
      .insert([
        {
          order_ref,
          customer_name: customer_name.trim(),
          phone:         phone.trim(),
          address:       address.trim(),
          province,
          items,
          subtotal,
          vat:            0,
          delivery,
          total,
          payment_status: "awaiting_payment",
        },
      ]);

    if (error) {
      console.error(
        "Order save failed:",
        error instanceof Error ? error.message : "Supabase write error"
      );
      return NextResponse.json(
        { success: false, message: "We could not save your order. Please try again." },
        { status: 500 }
      );
    }

    console.log("[Orders] Order created", {
      orderRef:  order_ref,
      province,
      itemCount: items.length,
      total,
    });

    return NextResponse.json({
      success:  true,
      orderRef: order_ref,
    });

  } catch (error) {
    console.error(
      "Orders route error:",
      error instanceof Error ? error.message : "Unknown error"
    );
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
