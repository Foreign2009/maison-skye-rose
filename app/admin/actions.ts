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
): Promise<{ success: boolean; message?: string }> {
  const adminSecret = process.env.ADMIN_SECRET;
  const baseUrl     = process.env.NEXT_PUBLIC_WEBSITE_URL ?? "http://localhost:3000";

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
