import type { Metadata } from "next";
import { cookies }       from "next/headers";
import { redirect }      from "next/navigation";
import { getSupabaseAdmin } from "../../lib/supabaseAdmin";
import { ADMIN_SESSION_COOKIE } from "../../lib/admin/session";
import { FULFILMENT_COLUMNS, loadFulfilment } from "./loadFulfilment";
import FulfilmentDashboard from "./FulfilmentDashboard";

export const metadata: Metadata = {
  title:  "Fulfilment | Maison Skye & Rose",
  robots: { index: false, follow: false },
};

// Read-only fulfilment queue. The admin session is checked (loadFulfilment →
// shared isValidAdminSessionToken) before any order query; an invalid session
// redirects to the existing /admin login.
export default async function FulfilmentPage() {
  const cookieStore = await cookies();
  const result = await loadFulfilment({
    adminSecret:   process.env.ADMIN_SECRET,
    sessionCookie: cookieStore.get(ADMIN_SESSION_COOKIE)?.value,
    fetchOrders:   async () =>
      getSupabaseAdmin()
        .from("orders")
        .select(FULFILMENT_COLUMNS)
        .order("created_at", { ascending: false }),
  });

  if (result.kind === "unauthorized") redirect("/admin");

  return (
    <FulfilmentDashboard
      orders={result.kind === "ok" ? result.orders : []}
      loadFailed={result.kind === "error"}
      generatedAtMs={Date.now()}
    />
  );
}
