import type { Metadata } from "next";
import { cookies }       from "next/headers";
import { createHash }    from "crypto";
import AdminConsole, { type OrderRow } from "./AdminConsole";
import { loginAction }   from "./actions";
import { getSupabaseAdmin } from "../lib/supabaseAdmin";

export const metadata: Metadata = {
  title:  "Operations | Maison Skye & Rose",
  robots: { index: false, follow: false },
};

function computeSessionToken(): string {
  return createHash("sha256")
    .update((process.env.ADMIN_SECRET ?? "") + "msr-ops-v1")
    .digest("hex");
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error }    = await searchParams;
  const cookieStore  = await cookies();
  const session      = cookieStore.get("msr-ops-session")?.value;
  const isAuth       = !!session && session === computeSessionToken();

  if (!isAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f1eb] px-6">
        <div className="w-full max-w-sm">
          <p className="mb-3 text-center text-[10px] uppercase tracking-[0.5em] text-[#d89ca4]">
            Internal
          </p>
          <h1 className="mb-8 text-center text-2xl font-black uppercase tracking-[-0.04em] text-[#4f4a52]">
            Maison Operations
          </h1>
          <form action={loginAction} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="admin-pass"
                className="block text-sm font-semibold text-[#4f4a52]"
              >
                Access Code
              </label>
              <input
                id="admin-pass"
                type="password"
                name="password"
                required
                autoFocus
                className="w-full rounded-2xl border border-gray-200 bg-white p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#4f4a52]/20"
                placeholder="Enter admin access code"
              />
            </div>
            {error && (
              <p className="text-sm text-red-500">
                Incorrect access code. Please try again.
              </p>
            )}
            <button
              type="submit"
              className="w-full rounded-full bg-[#4f4a52] py-4 text-sm font-bold text-white transition hover:bg-black"
            >
              Sign In
            </button>
          </form>
        </div>
      </main>
    );
  }

  // Authenticated — fetch all orders, newest first.
  let orders: OrderRow[] = [];
  try {
    const db = getSupabaseAdmin();
    const { data, error: dbError } = await db
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (dbError) {
      console.error("[Admin] Orders fetch error:", dbError.message);
    } else {
      orders = (data ?? []) as OrderRow[];
    }
  } catch (err) {
    // SUPABASE_SERVICE_ROLE_KEY not configured in local dev — console is still usable but empty.
    console.warn("[Admin] Could not fetch orders:", err instanceof Error ? err.message : err);
  }

  return <AdminConsole initialOrders={orders} />;
}
