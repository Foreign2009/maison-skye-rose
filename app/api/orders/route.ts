import { NextResponse } from "next/server";
import type { StatusHistoryEntry } from "@/app/lib/orderStatus";
import { validateDiscoveryAttribution } from "@/app/lib/discoveryAttribution";
import { validateOrderBody } from "@/app/lib/commerce/orderValidation";

// Minimal DB interface — allows the real handler to be tested with a mock.
// The production POST adapter wraps the supabase client to satisfy this shape.
export interface OrderDb {
  insertOrder(row: Record<string, unknown>): Promise<{ error: unknown }>;
}

function generateOrderRef(): string {
  const now     = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
  const suffix  = Math.floor(10000 + Math.random() * 90000);
  return `MSR-${dateStr}-${suffix}`;
}

export async function handleOrder(body: unknown, db: OrderDb): Promise<NextResponse> {
  try {
    const validation = validateOrderBody(body);
    if (!validation.ok) {
      return NextResponse.json(
        { success: false, message: validation.error },
        { status: 400 }
      );
    }

    const {
      customer_name,
      phone,
      address,
      province,
      discovery_context: rawDiscovery,
    } = body as {
      customer_name:      string;
      phone:              string;
      address?:           string;
      province:           string;
      discovery_context?: unknown;
    };

    const discoveryContext = rawDiscovery
      ? validateDiscoveryAttribution(rawDiscovery)
      : null;

    const order_ref = generateOrderRef();

    const initialHistory: StatusHistoryEntry[] = [
      { status: "awaiting_payment", changed_at: new Date().toISOString(), note: "Order created" },
    ];

    // Use server-computed financial values and normalized items from validation result.
    // validation.items carries effective (wholesale or retail) prices — not raw client prices.
    const { error } = await db.insertOrder({
      order_ref,
      customer_name:     customer_name.trim(),
      phone:             phone.trim(),
      address:           (address ?? "").trim(),
      province,
      items:             validation.items,
      subtotal:          validation.subtotal,
      vat:               0,
      delivery:          validation.delivery,
      total:             validation.total,
      payment_status:    "awaiting_payment",
      status_history:    initialHistory,
      discovery_context: discoveryContext ?? null,
    });

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
      itemCount: validation.items.length,
      total:     validation.total,
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Supabase is imported lazily so the module can be loaded in tests
    // without triggering client initialization.
    const { supabase } = await import("@/app/lib/supabase");
    const db: OrderDb = {
      insertOrder: async (row) => supabase.from("orders").insert([row]),
    };
    return handleOrder(body, db);
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
