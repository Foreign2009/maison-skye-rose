"use server";

import { cookies }        from "next/headers";
import { redirect }       from "next/navigation";
import { createHash }     from "crypto";
import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "../lib/supabaseAdmin";
import type { OrderStatus } from "../lib/orderStatus";

// Session token is a one-way hash of the secret — never reversible to the secret itself.
// Not exported: "use server" requires all exports to be async. page.tsx defines its own copy.
function computeSessionToken(): string {
  return createHash("sha256")
    .update((process.env.ADMIN_SECRET ?? "") + "msr-ops-v1")
    .digest("hex");
}

export async function loginAction(formData: FormData) {
  const password    = formData.get("password") as string;
  const adminSecret = process.env.ADMIN_SECRET;

  if (!adminSecret || password !== adminSecret) {
    redirect("/admin?error=invalid");
  }

  const cookieStore = await cookies();
  cookieStore.set("msr-ops-session", computeSessionToken(), {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge:   60 * 60 * 8, // 8 hours
    path:     "/admin",
  });

  redirect("/admin");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("msr-ops-session");
  redirect("/admin");
}

export async function updateStatusAction(
  ref:             string,
  status:          OrderStatus,
  note?:           string,
  trackingNumber?: string,
  courierName?:    string,
  trackingUrl?:    string,
  courierCost?:    string,
): Promise<{ success: boolean; message?: string }> {
  const adminSecret = process.env.ADMIN_SECRET;
  const baseUrl     = process.env.NEXT_PUBLIC_WEBSITE_URL ?? "http://localhost:3000";

  // Validate courierCost before calling PATCH.
  // Blank/whitespace → omitted (null in DB, not zero).
  // Non-blank valid → sent as a typed number so the route's typeof check passes.
  // Non-blank invalid → return error; no PATCH request is made.
  let parsedCourierCost: number | undefined;
  if (courierCost !== undefined && courierCost.trim() !== "") {
    const n = Number(courierCost);
    // toFixed(2) round-trip detects extra precision and scientific notation.
    if (!isFinite(n) || n < 0 || n > 9999.99 || Number.parseFloat(n.toFixed(2)) !== n) {
      return { success: false, message: "Courier cost must be a number between 0 and 9999.99 with at most two decimal places." };
    }
    parsedCourierCost = n;
  }

  try {
    const res = await fetch(`${baseUrl}/api/orders/${encodeURIComponent(ref)}`, {
      method:  "PATCH",
      headers: {
        "Authorization": `Bearer ${adminSecret}`,
        "Content-Type":  "application/json",
      },
      body: JSON.stringify({
        status,
        ...(note?.trim()           ? { note:             note.trim() }           : {}),
        ...(trackingNumber?.trim() ? { tracking_number: trackingNumber.trim() } : {}),
        ...(courierName?.trim()    ? { courier_name:    courierName.trim() }    : {}),
        ...(trackingUrl?.trim()    ? { tracking_url:    trackingUrl.trim() }    : {}),
        ...(parsedCourierCost !== undefined ? { courier_cost: parsedCourierCost } : {}),
      }),
    });

    const data = await res.json() as { success: boolean; message?: string };
    if (!data.success) return { success: false, message: data.message };

    revalidatePath("/admin");
    return { success: true };
  } catch {
    return { success: false, message: "Failed to connect to the orders API." };
  }
}

export async function updateNotesAction(
  ref:   string,
  notes: string,
): Promise<{ success: boolean; message?: string }> {
  try {
    const db = getSupabaseAdmin();
    const { error } = await db
      .from("orders")
      .update({ notes: notes.trim() || null })
      .eq("order_ref", ref);

    if (error) return { success: false, message: "Failed to save notes." };

    revalidatePath("/admin");
    return { success: true };
  } catch {
    return { success: false, message: "Failed to connect to the database." };
  }
}

export async function updateCourierCostAction(
  ref:  string,
  cost: string,
): Promise<{ success: boolean; message?: string }> {
  // Independent auth check — this action bypasses the PATCH route so
  // it must verify the session cookie itself.
  const adminSecret = process.env.ADMIN_SECRET;
  if (!adminSecret) return { success: false, message: "Server misconfiguration." };
  const expected    = computeSessionToken();
  const cookieStore = await cookies();
  const session     = cookieStore.get("msr-ops-session");
  if (session?.value !== expected) {
    return { success: false, message: "Unauthorized." };
  }

  // Validate order_ref format before touching the DB.
  if (!/^MSR-\d{8}-\d{5}$/.test(ref)) {
    return { success: false, message: "Invalid order reference." };
  }

  // Validate cost: blank or whitespace → null; non-blank must be a valid cost.
  let parsedCost: number | null = null;
  if (cost.trim() !== "") {
    const n = Number(cost);
    if (!isFinite(n) || n < 0 || n > 9999.99 || Number.parseFloat(n.toFixed(2)) !== n) {
      return {
        success: false,
        message: "Courier cost must be a number between 0 and 9999.99 with at most two decimal places.",
      };
    }
    parsedCost = n;
  }

  try {
    const db = getSupabaseAdmin();

    // Update only courier_cost. The status filter is embedded in the UPDATE
    // itself — not a preceding SELECT — so a status change between a read and
    // this write (TOCTOU) cannot silently succeed. If 0 rows are returned the
    // order is either absent or no longer dispatched/delivered.
    const { data: updated, error: updateError } = await db
      .from("orders")
      .update({ courier_cost: parsedCost })
      .eq("order_ref", ref)
      .in("payment_status", ["dispatched", "delivered"])
      .select("order_ref");

    if (updateError) return { success: false, message: "Failed to save courier cost." };
    if (!updated || updated.length === 0) {
      return { success: false, message: "Order not found or not eligible for a cost update." };
    }

    revalidatePath("/admin");
    return { success: true };
  } catch {
    return { success: false, message: "Failed to connect to the database." };
  }
}
