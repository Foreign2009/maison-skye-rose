import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/app/lib/supabaseAdmin";
import {
  ORDER_STATUSES,
  VALID_TRANSITIONS,
  lifecycleTimestampField,
  type OrderStatus,
  type StatusHistoryEntry,
} from "@/app/lib/orderStatus";

const MAX_NOTE_LENGTH    = 500;
const MAX_TRACKING_LENGTH = 100;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ ref: string }> }
) {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const adminSecret = process.env.ADMIN_SECRET;
  if (!adminSecret) {
    console.error("[Orders/PATCH] ADMIN_SECRET is not configured");
    return NextResponse.json(
      { success: false, message: "Service unavailable." },
      { status: 503 }
    );
  }

  const authHeader = request.headers.get("Authorization");
  if (!authHeader || authHeader !== `Bearer ${adminSecret}`) {
    return NextResponse.json(
      { success: false, message: "Unauthorized." },
      { status: 401 }
    );
  }

  // ── Route param ───────────────────────────────────────────────────────────
  const { ref } = await params;
  if (!ref || typeof ref !== "string" || !ref.startsWith("MSR-")) {
    return NextResponse.json(
      { success: false, message: "Invalid order reference." },
      { status: 400 }
    );
  }

  // ── Body ──────────────────────────────────────────────────────────────────
  let body: Record<string, unknown>;
  try {
    body = await request.json() as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body." },
      { status: 400 }
    );
  }

  const { status, note, tracking_number } = body;

  if (!status || !ORDER_STATUSES.includes(status as OrderStatus)) {
    return NextResponse.json(
      { success: false, message: `Invalid status. Valid values: ${ORDER_STATUSES.join(", ")}.` },
      { status: 400 }
    );
  }

  if (note !== undefined && (typeof note !== "string" || note.length > MAX_NOTE_LENGTH)) {
    return NextResponse.json(
      { success: false, message: `Note must be a string under ${MAX_NOTE_LENGTH} characters.` },
      { status: 400 }
    );
  }

  if (
    tracking_number !== undefined &&
    (typeof tracking_number !== "string" || tracking_number.trim().length === 0 || tracking_number.length > MAX_TRACKING_LENGTH)
  ) {
    return NextResponse.json(
      { success: false, message: `Tracking number must be a non-empty string under ${MAX_TRACKING_LENGTH} characters.` },
      { status: 400 }
    );
  }

  // ── Fetch current order ───────────────────────────────────────────────────
  const db = getSupabaseAdmin();

  const { data: rows, error: fetchError } = await db
    .from("orders")
    .select("payment_status, status_history")
    .eq("order_ref", ref)
    .limit(1);

  if (fetchError) {
    console.error("[Orders/PATCH] Fetch error:", fetchError.message);
    return NextResponse.json(
      { success: false, message: "Failed to fetch order." },
      { status: 500 }
    );
  }

  if (!rows || rows.length === 0) {
    return NextResponse.json(
      { success: false, message: "Order not found." },
      { status: 404 }
    );
  }

  const currentStatus = rows[0].payment_status as OrderStatus;
  const newStatus     = status as OrderStatus;

  // ── Transition validation ─────────────────────────────────────────────────
  if (currentStatus === newStatus) {
    return NextResponse.json(
      { success: false, message: `Order is already in status "${newStatus}".` },
      { status: 400 }
    );
  }

  const allowedNext = VALID_TRANSITIONS[currentStatus] ?? [];
  if (!allowedNext.includes(newStatus)) {
    return NextResponse.json(
      {
        success: false,
        message: `Cannot transition from "${currentStatus}" to "${newStatus}". Allowed next: ${allowedNext.length ? allowedNext.join(", ") : "none (terminal state)"}.`,
      },
      { status: 400 }
    );
  }

  if (newStatus === "dispatched" && !tracking_number) {
    return NextResponse.json(
      { success: false, message: "A tracking number is required when dispatching an order." },
      { status: 400 }
    );
  }

  // ── Build update payload ──────────────────────────────────────────────────
  const historyEntry: StatusHistoryEntry = {
    status:     newStatus,
    changed_at: new Date().toISOString(),
    ...(note ? { note: (note as string).trim() } : {}),
  };

  const existingHistory: StatusHistoryEntry[] = Array.isArray(rows[0].status_history)
    ? rows[0].status_history
    : [];

  const updatePayload: Record<string, unknown> = {
    payment_status: newStatus,
    status_history: [...existingHistory, historyEntry],
  };

  const tsField = lifecycleTimestampField(newStatus);
  if (tsField) updatePayload[tsField] = new Date().toISOString();

  if (tracking_number) updatePayload.tracking_number = (tracking_number as string).trim();
  if (note)            updatePayload.notes            = (note as string).trim();

  // ── Write ─────────────────────────────────────────────────────────────────
  const { error: updateError } = await db
    .from("orders")
    .update(updatePayload)
    .eq("order_ref", ref);

  if (updateError) {
    console.error("[Orders/PATCH] Update error:", updateError.message);
    return NextResponse.json(
      { success: false, message: "Failed to update order." },
      { status: 500 }
    );
  }

  console.log("[Orders] Status updated", {
    orderRef: ref,
    from:     currentStatus,
    to:       newStatus,
    ...(tracking_number ? { trackingNumber: tracking_number } : {}),
  });

  return NextResponse.json({
    success:  true,
    orderRef: ref,
    status:   newStatus,
  });
}
