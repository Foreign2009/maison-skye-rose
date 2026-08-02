import { createHash } from "crypto";
import { supabase } from "@/app/lib/supabase";
import type { OrderStatus, StatusHistoryEntry } from "@/app/lib/orderStatus";

function computeItnSignature(
  params:     Record<string, string>,
  passphrase: string | undefined,
): string {
  const paramString = Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent(v).replace(/%20/g, "+")}`)
    .join("&");
  const sigInput = passphrase
    ? `${paramString}&passphrase=${encodeURIComponent(passphrase).replace(/%20/g, "+")}`
    : paramString;
  return createHash("md5").update(sigInput).digest("hex");
}

// Maps PayFast payment_status values to internal order status transitions
const PAYFAST_STATUS_MAP: Partial<Record<string, OrderStatus>> = {
  COMPLETE: "payment_confirmed",
  FAILED:   "cancelled",
};

export async function POST(request: Request) {
  try {
    // PayFast sends ITN as application/x-www-form-urlencoded
    const text   = await request.text();
    const params = new URLSearchParams(text);

    const payload: Record<string, string> = {};
    params.forEach((value, key) => { payload[key] = value; });

    const receivedSignature = payload["signature"];
    if (!receivedSignature) {
      return new Response("Missing signature", { status: 400 });
    }

    // Reconstruct param string in original order, excluding the signature field
    const signableParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(payload)) {
      if (k !== "signature") signableParams[k] = v;
    }

    const passphrase        = process.env.PAYFAST_PASSPHRASE;
    const expectedSignature = computeItnSignature(signableParams, passphrase);

    if (expectedSignature !== receivedSignature) {
      return new Response("Invalid signature", { status: 400 });
    }

    const m_payment_id   = payload["m_payment_id"];
    const payment_status = payload["payment_status"];

    if (!m_payment_id) {
      return new Response("Missing payment ID", { status: 400 });
    }

    const nextStatus = payment_status ? PAYFAST_STATUS_MAP[payment_status] : undefined;
    if (!nextStatus) {
      // PENDING or unrecognised status — acknowledge without changing order
      return new Response("OK", { status: 200 });
    }

    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("status_history")
      .eq("order_ref", m_payment_id)
      .single();

    if (fetchError || !order) {
      return new Response("Order not found", { status: 400 });
    }

    const existingHistory: StatusHistoryEntry[] = Array.isArray(order.status_history)
      ? (order.status_history as StatusHistoryEntry[])
      : [];

    const newEntry: StatusHistoryEntry = {
      status:     nextStatus,
      changed_at: new Date().toISOString(),
      note:       `PayFast ITN: ${payment_status}`,
    };

    const { error: updateError } = await supabase
      .from("orders")
      .update({
        payment_status: nextStatus,
        status_history: [...existingHistory, newEntry],
      })
      .eq("order_ref", m_payment_id);

    if (updateError) {
      return new Response("Update failed", { status: 500 });
    }

    return new Response("OK", { status: 200 });

  } catch {
    return new Response("Internal error", { status: 500 });
  }
}
