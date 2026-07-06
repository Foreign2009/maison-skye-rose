"use client";

import { useState, useEffect, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, MessageCircle } from "lucide-react";
import {
  ORDER_STATUSES,
  VALID_TRANSITIONS,
  type OrderStatus,
  type StatusHistoryEntry,
} from "@/app/lib/orderStatus";
import { logoutAction, updateStatusAction, updateNotesAction } from "./actions";

// ── Types ─────────────────────────────────────────────────────────────────────

interface CartItem {
  id:       string;
  title:    string;
  price:    number;
  image:    string;
  quantity: number;
  size:     string;
}

export interface OrderRow {
  id:                   string;
  order_ref:            string;
  customer_name:        string;
  phone:                string;
  address:              string;
  province:             string;
  items:                CartItem[];
  subtotal:             number;
  vat:                  number;
  delivery:             number;
  total:                number;
  payment_status:       OrderStatus;
  notes:                string | null;
  tracking_number:      string | null;
  payment_confirmed_at: string | null;
  dispatched_at:        string | null;
  delivered_at:         string | null;
  cancelled_at:         string | null;
  status_history:       StatusHistoryEntry[];
  created_at:           string;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<OrderStatus, { badge: string; dot: string }> = {
  awaiting_payment:  { badge: "bg-amber-100 text-amber-700",   dot: "bg-amber-400"  },
  payment_confirmed: { badge: "bg-blue-100 text-blue-700",     dot: "bg-blue-400"   },
  processing:        { badge: "bg-purple-100 text-purple-700", dot: "bg-purple-400" },
  dispatched:        { badge: "bg-indigo-100 text-indigo-700", dot: "bg-indigo-400" },
  delivered:         { badge: "bg-green-100 text-green-700",   dot: "bg-green-400"  },
  cancelled:         { badge: "bg-red-50 text-red-400",        dot: "bg-red-300"    },
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  awaiting_payment:  "Awaiting Payment",
  payment_confirmed: "Payment Confirmed",
  processing:        "Processing",
  dispatched:        "Dispatched",
  delivered:         "Delivered",
  cancelled:         "Cancelled",
};

const ACTION_LABELS: Partial<Record<OrderStatus, string>> = {
  payment_confirmed: "Confirm Payment",
  processing:        "Mark as Processing",
  dispatched:        "Mark as Dispatched",
  delivered:         "Mark as Delivered",
  cancelled:         "Cancel Order",
};

const ACTION_BUTTON_STYLES: Partial<Record<OrderStatus, string>> = {
  payment_confirmed: "bg-blue-600 hover:bg-blue-700 text-white",
  processing:        "bg-purple-600 hover:bg-purple-700 text-white",
  dispatched:        "bg-indigo-600 hover:bg-indigo-700 text-white",
  delivered:         "bg-green-600 hover:bg-green-700 text-white",
  cancelled:         "border border-red-200 bg-white text-red-500 hover:bg-red-50",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-ZA", {
    day:    "2-digit",
    month:  "short",
    year:   "numeric",
    hour:   "2-digit",
    minute: "2-digit",
  });
}

function toWhatsAppNumber(phone: string): string {
  const d = phone.replace(/\D/g, "");
  if (d.startsWith("27")) return d;
  if (d.startsWith("0"))  return "27" + d.slice(1);
  return d;
}

// ── StatusBadge ───────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: OrderStatus }) {
  const { badge } = STATUS_COLORS[status] ?? STATUS_COLORS.awaiting_payment;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${badge}`}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

// ── DetailPanel ───────────────────────────────────────────────────────────────

interface DetailPanelProps {
  order:           OrderRow;
  nextStatuses:    OrderStatus[];
  pendingAction:   { status: OrderStatus; note: string; trackingNumber: string } | null;
  onActionClick:   (s: OrderStatus) => void;
  onPendingChange: (pa: { status: OrderStatus; note: string; trackingNumber: string } | null) => void;
  onConfirmAction: () => void;
  onCancelAction:  () => void;
  notesValue:      string;
  notesChanged:    boolean;
  onNotesChange:   (v: string) => void;
  onSaveNotes:     () => void;
  feedback:        { type: "success" | "error"; text: string } | null;
  isPending:       boolean;
  onClose:         () => void;
}

function DetailPanel({
  order,
  nextStatuses,
  pendingAction,
  onActionClick,
  onPendingChange,
  onConfirmAction,
  onCancelAction,
  notesValue,
  notesChanged,
  onNotesChange,
  onSaveNotes,
  feedback,
  isPending,
  onClose,
}: DetailPanelProps) {
  const waUrl = `https://wa.me/${toWhatsAppNumber(order.phone)}?text=${encodeURIComponent(
    `Hi ${order.customer_name}! This is Maison Skye & Rose regarding your order ${order.order_ref}.`
  )}`;

  const firstName = order.customer_name.split(" ")[0];

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5">
        <div>
          <p className="text-xs font-black tracking-wide text-[#4f4a52]">{order.order_ref}</p>
          <p className="mt-0.5 text-sm text-[#7b7480]">
            {order.customer_name} · {order.province}
          </p>
          <div className="mt-2">
            <StatusBadge status={order.payment_status} />
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="rounded-full p-1.5 text-[#9b9298] transition hover:bg-gray-100 hover:text-[#4f4a52]"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex flex-col gap-7 px-6 py-6">
        {/* ── Customer ──────────────────────────────────────────────────────── */}
        <section>
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#d89ca4]">Customer</p>
          <div className="mt-3 space-y-1">
            <p className="text-sm font-semibold text-[#4f4a52]">{order.customer_name}</p>
            <p className="text-sm text-[#7b7480]">{order.phone}</p>
            <p className="text-sm text-[#7b7480]">{order.address}</p>
          </div>
        </section>

        {/* ── Items ─────────────────────────────────────────────────────────── */}
        <section>
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#d89ca4]">Items</p>
          <div className="mt-3 space-y-2">
            {(order.items ?? []).map((item, i) => (
              <div key={i} className="flex items-start justify-between gap-2 text-sm">
                <span className="text-[#7b7480]">
                  {item.title}
                  {item.size ? ` (${item.size})` : ""} × {item.quantity}
                </span>
                <span className="shrink-0 font-semibold text-[#4f4a52]">
                  R{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="border-t border-gray-100 pt-2 space-y-1">
              <div className="flex justify-between text-sm text-[#7b7480]">
                <span>Delivery</span>
                <span>R{order.delivery.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-[#4f4a52]">
                <span>Total</span>
                <span>R{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          {order.tracking_number && (
            <p className="mt-2 text-xs text-[#7b7480]">
              Tracking:{" "}
              <span className="font-semibold text-[#4f4a52]">{order.tracking_number}</span>
            </p>
          )}
        </section>

        {/* ── Actions ───────────────────────────────────────────────────────── */}
        {nextStatuses.length > 0 && (
          <section>
            <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#d89ca4]">Actions</p>
            <div className="mt-3">
              {!pendingAction ? (
                <div className="flex flex-wrap gap-2">
                  {nextStatuses.map(s => (
                    <button
                      key={s}
                      onClick={() => onActionClick(s)}
                      disabled={isPending}
                      className={`rounded-full px-4 py-2 text-xs font-bold transition-all disabled:opacity-50 ${ACTION_BUTTON_STYLES[s] ?? "bg-gray-100 text-[#4f4a52]"}`}
                    >
                      {ACTION_LABELS[s] ?? STATUS_LABELS[s]}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-3 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                  <p className="text-sm font-semibold text-[#4f4a52]">
                    {ACTION_LABELS[pendingAction.status] ?? STATUS_LABELS[pendingAction.status]}
                  </p>

                  {pendingAction.status === "dispatched" && (
                    <div>
                      <label className="mb-1 block text-[10px] uppercase tracking-[0.3em] text-[#9b9298]">
                        Tracking Number <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={pendingAction.trackingNumber}
                        onChange={e => onPendingChange({ ...pendingAction, trackingNumber: e.target.value })}
                        placeholder="e.g. SN123456789"
                        autoFocus
                        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4f4a52]/20"
                      />
                    </div>
                  )}

                  <div>
                    <label className="mb-1 block text-[10px] uppercase tracking-[0.3em] text-[#9b9298]">
                      Note (optional)
                    </label>
                    <textarea
                      value={pendingAction.note}
                      onChange={e => onPendingChange({ ...pendingAction, note: e.target.value })}
                      placeholder="e.g. Confirmed via WhatsApp"
                      rows={2}
                      className="w-full resize-none rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4f4a52]/20"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={onConfirmAction}
                      disabled={
                        isPending ||
                        (pendingAction.status === "dispatched" && !pendingAction.trackingNumber.trim())
                      }
                      className="flex-1 rounded-full bg-[#4f4a52] py-2.5 text-xs font-bold text-white transition hover:bg-black disabled:opacity-40"
                    >
                      {isPending ? "Updating…" : "Confirm"}
                    </button>
                    <button
                      onClick={onCancelAction}
                      disabled={isPending}
                      className="rounded-full border border-gray-200 px-4 py-2.5 text-xs font-semibold text-[#7b7480] transition hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── Feedback ──────────────────────────────────────────────────────── */}
        {feedback && (
          <p className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
            feedback.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
          }`}>
            {feedback.text}
          </p>
        )}

        {/* ── Timeline ──────────────────────────────────────────────────────── */}
        <section>
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#d89ca4]">Timeline</p>
          <div className="mt-3 space-y-3">
            {(order.status_history ?? []).map((entry, i) => {
              const { dot } = STATUS_COLORS[entry.status] ?? STATUS_COLORS.awaiting_payment;
              return (
                <div key={i} className="flex items-start gap-3">
                  <div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dot}`} />
                  <div>
                    <p className="text-sm font-semibold text-[#4f4a52]">
                      {STATUS_LABELS[entry.status] ?? entry.status}
                    </p>
                    <p className="text-xs text-[#9b9298]">{formatDate(entry.changed_at)}</p>
                    {entry.note && (
                      <p className="mt-0.5 text-xs text-[#7b7480]">{entry.note}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Internal Notes ────────────────────────────────────────────────── */}
        <section>
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#d89ca4]">Internal Notes</p>
          <div className="mt-3">
            <textarea
              value={notesValue}
              onChange={e => onNotesChange(e.target.value)}
              placeholder="Private notes about this order…"
              rows={3}
              className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4f4a52]/20"
            />
            <button
              onClick={onSaveNotes}
              disabled={!notesChanged || isPending}
              className="mt-2 rounded-full bg-[#4f4a52] px-5 py-2 text-xs font-bold text-white transition hover:bg-black disabled:opacity-40"
            >
              {isPending ? "Saving…" : "Save Notes"}
            </button>
          </div>
        </section>

        {/* ── WhatsApp ──────────────────────────────────────────────────────── */}
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] py-3.5 text-sm font-bold text-white transition hover:bg-[#1ebe59]"
        >
          <MessageCircle size={16} />
          WhatsApp {firstName}
        </a>
      </div>
    </div>
  );
}

// ── AdminConsole ──────────────────────────────────────────────────────────────

export default function AdminConsole({ initialOrders }: { initialOrders: OrderRow[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [searchQuery,   setSearchQuery]   = useState("");
  const [statusFilter,  setStatusFilter]  = useState<OrderStatus | "all">("all");
  const [selectedRef,   setSelectedRef]   = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<{
    status:         OrderStatus;
    note:           string;
    trackingNumber: string;
  } | null>(null);
  const [notesValue, setNotesValue] = useState("");
  const [feedback,   setFeedback]   = useState<{ type: "success" | "error"; text: string } | null>(null);

  const selectedOrder = useMemo(
    () => (selectedRef ? (initialOrders.find(o => o.order_ref === selectedRef) ?? null) : null),
    [selectedRef, initialOrders],
  );

  // Sync notes and reset drawer state when the selected order changes.
  // Intentionally only on selectedRef, not on selectedOrder.notes —
  // we don't want to discard in-progress edits during a background refresh.
  useEffect(() => {
    setNotesValue(selectedOrder?.notes ?? "");
    setPendingAction(null);
    setFeedback(null);
  }, [selectedRef]); // eslint-disable-line react-hooks/exhaustive-deps

  const statusCounts = useMemo(() => {
    const c: Partial<Record<OrderStatus, number>> = {};
    for (const s of ORDER_STATUSES) c[s] = 0;
    for (const o of initialOrders) {
      if (o.payment_status in c) (c[o.payment_status as OrderStatus] as number)++;
    }
    return c;
  }, [initialOrders]);

  const filteredOrders = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return initialOrders.filter(o => {
      if (statusFilter !== "all" && o.payment_status !== statusFilter) return false;
      if (!q) return true;
      return (
        o.order_ref.toLowerCase().includes(q)     ||
        o.customer_name.toLowerCase().includes(q) ||
        o.phone.includes(q)
      );
    });
  }, [initialOrders, searchQuery, statusFilter]);

  const nextStatuses = selectedOrder
    ? (VALID_TRANSITIONS[selectedOrder.payment_status] ?? [])
    : [];

  const notesSaved   = selectedOrder?.notes ?? "";
  const notesChanged = notesValue !== notesSaved;

  function handleSelectOrder(ref: string) {
    setSelectedRef(prev => (prev === ref ? null : ref));
  }

  function handleStatusAction(status: OrderStatus) {
    setPendingAction({ status, note: "", trackingNumber: "" });
    setFeedback(null);
  }

  function handleConfirmAction() {
    if (!pendingAction || !selectedOrder) return;
    startTransition(async () => {
      const result = await updateStatusAction(
        selectedOrder.order_ref,
        pendingAction.status,
        pendingAction.note || undefined,
        pendingAction.trackingNumber || undefined,
      );
      if (result.success) {
        router.refresh();
        setPendingAction(null);
        setFeedback({ type: "success", text: "Order updated successfully." });
      } else {
        setFeedback({ type: "error", text: result.message ?? "Update failed." });
      }
    });
  }

  function handleSaveNotes() {
    if (!selectedOrder) return;
    startTransition(async () => {
      const result = await updateNotesAction(selectedOrder.order_ref, notesValue);
      if (result.success) {
        router.refresh();
        setFeedback({ type: "success", text: "Notes saved." });
      } else {
        setFeedback({ type: "error", text: result.message ?? "Failed to save notes." });
      }
    });
  }

  const detailPanelProps: Omit<DetailPanelProps, "onClose"> = {
    order:           selectedOrder!,
    nextStatuses,
    pendingAction,
    onActionClick:   handleStatusAction,
    onPendingChange: setPendingAction,
    onConfirmAction: handleConfirmAction,
    onCancelAction:  () => setPendingAction(null),
    notesValue,
    notesChanged,
    onNotesChange:   setNotesValue,
    onSaveNotes:     handleSaveNotes,
    feedback,
    isPending,
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f8f7f5]">

      {/* ── Header ────────────────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between bg-[#4f4a52] px-6 py-4">
        <div>
          <p className="text-[9px] uppercase tracking-[0.5em] text-[#d89ca4]">Internal</p>
          <h1 className="text-sm font-black uppercase tracking-widest text-white">
            Maison Operations
          </h1>
        </div>
        <form action={logoutAction}>
          <button type="submit" className="text-xs text-white/60 transition hover:text-white">
            Sign Out
          </button>
        </form>
      </header>

      {/* ── Summary Cards ─────────────────────────────────────────────────────── */}
      <div className="flex gap-3 overflow-x-auto px-6 py-4">
        {ORDER_STATUSES.map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(prev => (prev === s ? "all" : s))}
            className={`flex shrink-0 flex-col items-start rounded-2xl border px-5 py-4 transition-all ${
              statusFilter === s
                ? "border-[#4f4a52] bg-white shadow-sm"
                : "border-transparent bg-white/70 hover:bg-white"
            }`}
          >
            <span className="text-2xl font-black tabular-nums text-[#4f4a52]">
              {statusCounts[s] ?? 0}
            </span>
            <span className="mt-1 text-[9px] uppercase tracking-[0.3em] text-[#9b9298]">
              {STATUS_LABELS[s]}
            </span>
          </button>
        ))}
      </div>

      {/* ── Main area ─────────────────────────────────────────────────────────── */}
      <div className="flex min-h-0 flex-1 overflow-hidden">

        {/* Orders list */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">

          {/* Search + filter */}
          <div className="flex items-center gap-3 px-6 py-3">
            <input
              type="search"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name, reference, or phone…"
              className="min-w-0 flex-1 rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4f4a52]/20"
            />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as OrderStatus | "all")}
              className="shrink-0 rounded-2xl border border-gray-200 bg-white px-3 py-2.5 text-sm"
            >
              <option value="all">All statuses</option>
              {ORDER_STATUSES.map(s => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>

          {/* Orders */}
          <div className="flex-1 overflow-y-auto px-6 pb-8">
            {filteredOrders.length === 0 ? (
              <div className="flex h-40 items-center justify-center text-sm text-[#9b9298]">
                No orders match your search.
              </div>
            ) : (
              <div className="space-y-2">
                {filteredOrders.map(order => (
                  <button
                    key={order.order_ref}
                    onClick={() => handleSelectOrder(order.order_ref)}
                    className={`w-full rounded-2xl border p-4 text-left transition-all hover:shadow-sm ${
                      selectedRef === order.order_ref
                        ? "border-[#4f4a52] bg-white shadow-sm"
                        : "border-gray-100 bg-white hover:border-gray-200"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-bold text-[#4f4a52]">
                            {order.order_ref}
                          </span>
                          <StatusBadge status={order.payment_status} />
                        </div>
                        <p className="mt-0.5 truncate text-sm text-[#7b7480]">
                          {order.customer_name} · {order.province}
                        </p>
                        <p className="mt-0.5 text-xs text-[#9b9298]">
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <span className="text-sm font-bold text-[#4f4a52]">
                          R{order.total.toFixed(2)}
                        </span>
                        <ChevronRight size={14} className="text-[#9b9298]" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Detail panel (desktop) ─────────────────────────────────────────── */}
        <div className="hidden w-[440px] shrink-0 overflow-y-auto border-l border-gray-100 bg-white lg:block">
          {selectedOrder ? (
            <DetailPanel
              {...detailPanelProps}
              onClose={() => setSelectedRef(null)}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-[#9b9298]">Select an order to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Detail panel (mobile overlay) ─────────────────────────────────────── */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRef(null)}
              className="fixed inset-0 z-20 bg-black/40 lg:hidden"
            />
            <motion.div
              key="drawer"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 z-30 max-h-[88vh] overflow-y-auto rounded-t-[28px] bg-white lg:hidden"
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="h-1 w-10 rounded-full bg-gray-200" />
              </div>
              <DetailPanel
                {...detailPanelProps}
                onClose={() => setSelectedRef(null)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
