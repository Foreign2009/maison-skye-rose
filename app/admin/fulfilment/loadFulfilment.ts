import { isValidAdminSessionToken } from "../../lib/admin/session";
import type { FulfilmentOrder } from "../../lib/admin/fulfilment";

/**
 * Server-side loader for /admin/fulfilment (Admin Fulfilment M1).
 *
 * Dependencies are injected so the access check can be tested without a
 * database: the session is verified with the shared admin validator before
 * fetchOrders is ever called, and a missing or empty ADMIN_SECRET always fails
 * closed. Read-only — this module performs no inserts, updates or deletes.
 */

export const FULFILMENT_COLUMNS =
  "order_ref, customer_name, phone, province, total, payment_status, status_history, created_at";

export type FulfilmentLoadResult =
  | { kind: "unauthorized" }
  | { kind: "ok"; orders: FulfilmentOrder[] }
  | { kind: "error" };

export type FulfilmentDeps = {
  adminSecret:   string | undefined;
  sessionCookie: string | undefined;
  fetchOrders:   () => Promise<{ data: unknown[] | null; error: { message: string } | null }>;
};

export async function loadFulfilment(deps: FulfilmentDeps): Promise<FulfilmentLoadResult> {
  if (!isValidAdminSessionToken(deps.adminSecret, deps.sessionCookie)) return { kind: "unauthorized" };
  try {
    const { data, error } = await deps.fetchOrders();
    if (error) {
      console.error("[Admin/Fulfilment] Orders fetch error:", error.message);
      return { kind: "error" };
    }
    return { kind: "ok", orders: (data ?? []) as FulfilmentOrder[] };
  } catch (err) {
    console.error("[Admin/Fulfilment] Orders fetch failed:", err instanceof Error ? err.message : "unknown error");
    return { kind: "error" };
  }
}
