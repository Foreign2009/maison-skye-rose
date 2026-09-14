import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";
import type { StatusHistoryEntry } from "@/app/lib/orderStatus";
import { validateDiscoveryAttribution } from "@/app/lib/discoveryAttribution";
import { validateOrderBody } from "@/app/lib/commerce/orderValidation";

function generateOrderRef(): string {
  const now     = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
  const suffix  = Math.floor(10000 + Math.random() * 90000);
  return `MSR-${dateStr}-${suffix}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

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
      items,
      discovery_context: rawDiscovery,
    } = body as {
      customer_name:      string;
      phone:              string;
      address?:           string;
      province:           string;
      items:              unknown[];
      discovery_context?: unknown;
    };

    const discoveryContext = rawDiscovery
      ? validateDiscoveryAttribution(rawDiscovery)
      : null;

    const order_ref = generateOrderRef();

    const initialHistory: StatusHistoryEntry[] = [
      { status: "awaiting_payment", changed_at: new Date().toISOString(), note: "Order created" },
    ];

    // Use server-computed financial values — validation.subtotal/delivery/total are
    // derived from the authoritative catalogue, not from the client submission.
    const { error } = await supabase
      .from("orders")
      .insert([
        {
          order_ref,
          customer_name:     customer_name.trim(),
          phone:             phone.trim(),
          address:           (address ?? "").trim(),
          province,
          items,
          subtotal:          validation.subtotal,
          vat:               0,
          delivery:          validation.delivery,
          total:             validation.total,
          payment_status:    "awaiting_payment",
          status_history:    initialHistory,
          discovery_context: discoveryContext ?? null,
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
