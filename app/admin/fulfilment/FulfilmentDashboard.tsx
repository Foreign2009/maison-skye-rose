"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import AdminNavigation from "../components/AdminNavigation";
import { logoutAction } from "../actions";
import { ORDER_STATUSES, type OrderStatus } from "../../lib/orderStatus";
import {
  buildReminderLink,
  formatAge,
  formatSaDateTime,
  formatTotal,
  fulfilmentMethod,
  hasPayfastItnHistory,
  isKnownStatus,
  matchesFilter,
  reminderStage,
  type FulfilmentFilter,
  type FulfilmentOrder,
  type ReminderKind,
  type ReminderStage,
} from "../../lib/admin/fulfilment";

// Read-only fulfilment queue (Admin Fulfilment M1). Nothing on this page writes
// to the database, sends a message or records a reminder.

const STATUS_LABELS: Record<OrderStatus, string> = {
  awaiting_payment:  "Awaiting Payment",
  payment_confirmed: "Payment Confirmed",
  processing:        "Processing",
  dispatched:        "Dispatched",
  delivered:         "Delivered",
  cancelled:         "Cancelled",
};

const STATUS_BADGES: Record<OrderStatus, string> = {
  awaiting_payment:  "bg-amber-100 text-amber-800",
  payment_confirmed: "bg-blue-100 text-blue-800",
  processing:        "bg-purple-100 text-purple-800",
  dispatched:        "bg-indigo-100 text-indigo-800",
  delivered:         "bg-green-100 text-green-800",
  cancelled:         "bg-red-50 text-red-700",
};

const STAGE_COPY: Record<Exclude<ReminderStage, "not_applicable">, { label: string; detail: string; tone: string }> = {
  none:        { label: "No reminder due",            detail: "Awaiting EFT for under 24 hours.",                         tone: "border-gray-200 bg-white text-[#4f4a52]" },
  friendly:    { label: "Friendly reminder due",      detail: "Awaiting EFT for 24 hours or more.",                       tone: "border-[#d89ca4]/50 bg-[#fdf6f7] text-[#4f4a52]" },
  final:       { label: "Final reminder due",         detail: "Awaiting EFT for 48 hours or more.",                       tone: "border-amber-300 bg-amber-50 text-[#4f4a52]" },
  review:      { label: "Manual cancellation review", detail: "Awaiting EFT for 72 hours or more. Review manually — nothing is cancelled automatically.", tone: "border-red-200 bg-red-50 text-[#4f4a52]" },
  unknown_age: { label: "Age unavailable",            detail: "The order's creation time is missing or invalid. Check this order manually.", tone: "border-gray-300 bg-gray-50 text-[#4f4a52]" },
};

const PRIMARY_FILTERS: { value: FulfilmentFilter; label: string }[] = [
  { value: "all",                 label: "All orders" },
  { value: "awaiting_payment",    label: "Awaiting payment" },
  { value: "reminders_due",       label: "Reminders due" },
  { value: "cancellation_review", label: "Cancellation review" },
];

const STATUS_FILTERS: { value: FulfilmentFilter; label: string }[] = ORDER_STATUSES
  .filter((s) => s !== "awaiting_payment")
  .map((s) => ({ value: s, label: STATUS_LABELS[s] }));

const REMINDER_LABELS: Record<ReminderKind, string> = {
  friendly: "Open friendly reminder in WhatsApp",
  final:    "Open final reminder in WhatsApp",
};

function StatusBadge({ status }: { status: string }) {
  if (!isKnownStatus(status)) {
    return (
      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-gray-700">
        Unrecognised status: {status}
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${STATUS_BADGES[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}

function ReminderAction({ order, kind }: { order: FulfilmentOrder; kind: ReminderKind }) {
  const link = buildReminderLink(kind, order);
  if (!link.ok) {
    return (
      <p className="rounded-xl bg-gray-100 px-3 py-2 text-xs text-gray-700" role="note">
        WhatsApp reminder unavailable: {link.reason}
      </p>
    );
  }
  return (
    <div className="space-y-1.5">
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-[44px] w-full items-center justify-center rounded-full bg-[#4f4a52] px-5 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4f4a52] sm:w-auto"
      >
        {REMINDER_LABELS[kind]}
      </a>
      <p className="text-[11px] text-[#7b7480]">Opens WhatsApp with a draft only. Nothing is sent or recorded.</p>
    </div>
  );
}

function OrderCard({ order, nowMs }: { order: FulfilmentOrder; nowMs: number }) {
  const stage   = reminderStage(order.payment_status, order.created_at, nowMs);
  const method  = fulfilmentMethod(order.province);
  const total   = formatTotal(order.total);
  const created = formatSaDateTime(order.created_at);
  const age     = formatAge(order.created_at, nowMs);
  const itn     = hasPayfastItnHistory(order.status_history);

  return (
    <li className="rounded-[24px] border border-[#e8ddd6] bg-white p-4 shadow-sm sm:p-5" data-order-ref={order.order_ref}>
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div className="min-w-0">
          <p className="break-all font-mono text-sm font-bold text-[#4f4a52]">{order.order_ref}</p>
          <p className="mt-0.5 break-words text-sm text-[#4f4a52]">{order.customer_name || "Name not recorded"}</p>
        </div>
        <p className="text-lg font-black text-[#4f4a52]" aria-label="Stored order total">
          {total ?? "Total not recorded"}
        </p>
      </div>

      <dl className="mt-3 grid grid-cols-1 gap-x-4 gap-y-1 text-xs text-[#7b7480] sm:grid-cols-2">
        <div><dt className="inline font-semibold">Ordered: </dt><dd className="inline">{created ? `${created} (SAST)` : "Date not recorded"}</dd></div>
        <div><dt className="inline font-semibold">Age: </dt><dd className="inline">{age ?? "Unknown"}</dd></div>
        <div>
          <dt className="inline font-semibold">Fulfilment: </dt>
          <dd className="inline">
            {method.kind === "collection" ? "Collection" : method.kind === "courier" ? `Courier — ${method.province}` : "Not recorded"}
          </dd>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <dt className="font-semibold">Stored status:</dt>
          <dd><StatusBadge status={order.payment_status} /></dd>
        </div>
      </dl>

      {itn && (
        <p role="alert" className="mt-3 rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-xs font-semibold text-red-800">
          ⚠ Security warning: this order&apos;s history contains a PayFast ITN entry. Treat any payment status as unverified and check the business bank account before fulfilling.
        </p>
      )}

      {stage !== "not_applicable" && (
        <section aria-label="Suggested next action" className={`mt-3 space-y-2 rounded-xl border px-3 py-3 ${STAGE_COPY[stage].tone}`}>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9b9298]">Suggested next action (advisory)</p>
          <p className="text-sm font-bold">{STAGE_COPY[stage].label}</p>
          <p className="text-xs">{STAGE_COPY[stage].detail}</p>
          {stage === "friendly" && <ReminderAction order={order} kind="friendly" />}
          {stage === "final" && <ReminderAction order={order} kind="final" />}
        </section>
      )}
    </li>
  );
}

export default function FulfilmentDashboard({
  orders,
  loadFailed,
  generatedAtMs,
}: {
  orders:        FulfilmentOrder[];
  loadFailed:    boolean;
  generatedAtMs: number;
}) {
  const [filter, setFilter] = useState<FulfilmentFilter>("all");

  const counts = useMemo(() => {
    const result = new Map<FulfilmentFilter, number>();
    for (const f of [...PRIMARY_FILTERS, ...STATUS_FILTERS]) {
      result.set(f.value, orders.filter((o) => matchesFilter(o, f.value, generatedAtMs)).length);
    }
    return result;
  }, [orders, generatedAtMs]);

  const visible = useMemo(
    () => orders.filter((o) => matchesFilter(o, filter, generatedAtMs)),
    [orders, filter, generatedAtMs],
  );

  const generatedAt = formatSaDateTime(new Date(generatedAtMs).toISOString());

  const filterButton = ({ value, label }: { value: FulfilmentFilter; label: string }) => (
    <button
      key={value}
      type="button"
      onClick={() => setFilter(value)}
      aria-pressed={filter === value}
      className={`min-h-[44px] rounded-full border px-4 py-2 text-xs font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4f4a52] ${
        filter === value
          ? "border-[#4f4a52] bg-[#4f4a52] text-white"
          : "border-[#e8ddd6] bg-white text-[#4f4a52] hover:border-[#4f4a52]/40"
      }`}
    >
      {label} <span className="opacity-70">({counts.get(value) ?? 0})</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#f5f1eb]">
      <header className="flex items-center justify-between gap-3 bg-[#4f4a52] px-4 py-3 sm:px-6 print:hidden">
        <div className="flex min-w-0 items-center gap-3 sm:gap-6">
          <div className="min-w-0">
            <p className="text-[9px] uppercase tracking-[0.5em] text-[#d89ca4]">Internal</p>
            <p className="truncate text-sm font-black uppercase tracking-widest text-white">Maison Operations</p>
          </div>
          {/* shrink-0 keeps the 44px menu button from being squeezed on narrow screens */}
          <div className="shrink-0">
            <AdminNavigation />
          </div>
        </div>
        <form action={logoutAction}>
          <button type="submit" className="min-h-[44px] rounded-full px-3 text-xs text-white/70 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60">
            Sign Out
          </button>
        </form>
      </header>

      <main className="mx-auto w-full max-w-[1100px] space-y-6 px-4 py-6 sm:px-6 sm:py-10">
        <div className="space-y-2">
          <Link
            href="/admin"
            className="inline-flex min-h-[44px] items-center rounded-full text-sm font-semibold text-[#b67d73] hover:text-[#4f4a52] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4f4a52]"
          >
            ← Back to Operations
          </Link>
          <h1 className="text-2xl font-black uppercase tracking-[-0.03em] text-[#4f4a52] sm:text-3xl">Fulfilment</h1>
          <p className="text-sm text-[#7b7480]">
            Website orders, read-only. Ages calculated at {generatedAt ?? "load time"} (SAST); refresh to update.
          </p>
        </div>

        <aside className="rounded-2xl border border-[#e8ddd6] bg-[#faf7f3] px-4 py-3 text-xs leading-relaxed text-[#4f4a52]">
          <p>
            Reminder suggestions are advisory and follow SOP V2.1 (24h friendly, 48h final, 72h manual cancellation review).
            Opening WhatsApp does not send or record anything, and no order is changed from this page.
          </p>
          <p className="mt-1">
            A stored “Payment Confirmed” status is not proof that a bank payment was received. Verify every EFT in the business bank account.
          </p>
        </aside>

        <nav aria-label="Order filters" className="space-y-2">
          <div role="group" aria-label="Payment follow-up filters" className="flex flex-wrap gap-2">
            {PRIMARY_FILTERS.map(filterButton)}
          </div>
          <div role="group" aria-label="Other status filters" className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map(filterButton)}
          </div>
        </nav>

        {loadFailed ? (
          <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-800">
            Orders could not be loaded. Refresh the page to try again.
          </p>
        ) : orders.length === 0 ? (
          <p className="rounded-2xl border border-[#e8ddd6] bg-white px-4 py-6 text-center text-sm text-[#7b7480]">
            No website orders yet.
          </p>
        ) : visible.length === 0 ? (
          <p className="rounded-2xl border border-[#e8ddd6] bg-white px-4 py-6 text-center text-sm text-[#7b7480]">
            No orders match this filter.
          </p>
        ) : (
          <ul className="space-y-3" aria-label="Website orders">
            {visible.map((o) => <OrderCard key={o.order_ref} order={o} nowMs={generatedAtMs} />)}
          </ul>
        )}
      </main>
    </div>
  );
}
