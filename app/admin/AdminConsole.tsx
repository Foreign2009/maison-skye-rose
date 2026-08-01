"use client";

import { useState, useEffect, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, MessageCircle, Copy, Check, Printer } from "lucide-react";
import {
  ORDER_STATUSES,
  VALID_TRANSITIONS,
  type OrderStatus,
  type StatusHistoryEntry,
} from "@/app/lib/orderStatus";
import { logoutAction, updateStatusAction, updateNotesAction } from "./actions";
import type { DiscoveryAttribution } from "@/app/lib/discoveryAttribution";

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
  discovery_context:    DiscoveryAttribution | null;
  created_at:           string;
}

interface DashboardMetrics {
  pendingRevenue:   number;
  confirmedRevenue: number;
  activeCount:      number;
  needsAttention:   OrderRow[];
  readyToShip:      OrderRow[];
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

// Status priority for "Needs Attention" sort — lower number = higher urgency.
const ATTENTION_PRIORITY: Partial<Record<OrderStatus, number>> = {
  payment_confirmed: 0,
  awaiting_payment:  1,
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

function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-ZA", {
    day:   "2-digit",
    month: "short",
    year:  "numeric",
  });
}

function toWhatsAppNumber(phone: string): string {
  const d = phone.replace(/\D/g, "");
  if (d.startsWith("27")) return d;
  if (d.startsWith("0"))  return "27" + d.slice(1);
  return d;
}

// Returns how overdue an order is relative to its created_at timestamp.
// Ages are calculated once at data-load time (inside useMemo on initialOrders).
// Refresh the page to get updated ages.
function orderAge(createdAt: string): { label: string; urgent: boolean } {
  const hours = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
  if (hours < 24)  return { label: "",                               urgent: false };
  if (hours < 48)  return { label: `${Math.floor(hours)}h overdue`, urgent: false };
  return           { label: `${Math.floor(hours / 24)}d overdue`,   urgent: true  };
}

function fmtR(amount: number): string {
  if (amount === 0) return "R0";
  return "R" + Math.round(amount).toLocaleString("en-ZA");
}

// Derives all dashboard metrics from the order list.
// Called inside useMemo — do not call directly in render.
function computeDashboard(orders: OrderRow[]): DashboardMetrics {
  const HOUR_24 = 24 * 60 * 60 * 1000;
  const now     = Date.now();

  let pendingRevenue   = 0;
  let confirmedRevenue = 0;
  let activeCount      = 0;
  const needsAttention: OrderRow[] = [];
  const readyToShip:    OrderRow[] = [];

  for (const o of orders) {
    const age = now - new Date(o.created_at).getTime();

    switch (o.payment_status) {
      case "awaiting_payment":
        pendingRevenue += o.total;
        activeCount++;
        if (age > HOUR_24) needsAttention.push(o);
        break;
      case "payment_confirmed":
        confirmedRevenue += o.total;
        activeCount++;
        needsAttention.push(o);
        break;
      case "processing":
        confirmedRevenue += o.total;
        activeCount++;
        readyToShip.push(o);
        break;
      case "dispatched":
        confirmedRevenue += o.total;
        activeCount++;
        break;
      case "delivered":
        confirmedRevenue += o.total;
        break;
    }
  }

  needsAttention.sort((a, b) => {
    const pa = ATTENTION_PRIORITY[a.payment_status] ?? 99;
    const pb = ATTENTION_PRIORITY[b.payment_status] ?? 99;
    if (pa !== pb) return pa - pb;
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });

  readyToShip.sort((a, b) =>
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  return { pendingRevenue, confirmedRevenue, activeCount, needsAttention, readyToShip };
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

// ── CopyButton ────────────────────────────────────────────────────────────────

function CopyButton({ value, label }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }).catch(() => {});
  }

  return (
    <button
      onClick={handleCopy}
      aria-label={label ?? "Copy"}
      title={label ?? "Copy"}
      className="shrink-0 rounded-lg p-1 text-[#9b9298] transition hover:bg-gray-100 hover:text-[#4f4a52]"
    >
      {copied
        ? <Check size={12} className="text-green-500" />
        : <Copy size={12} />
      }
    </button>
  );
}

// ── PriorityQueue ─────────────────────────────────────────────────────────────

function PriorityQueue({
  title,
  orders,
  badgeClass,
  onSelect,
}: {
  title:      string;
  orders:     OrderRow[];
  badgeClass: string;
  onSelect:   (ref: string) => void;
}) {
  const MAX      = 3;
  const visible  = orders.slice(0, MAX);
  const overflow = orders.length - MAX;

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#4f4a52]">
          {title}
        </span>
        <span className={`rounded-full px-2 py-0.5 text-[9px] font-black ${badgeClass}`}>
          {orders.length}
        </span>
      </div>
      <div className="space-y-1.5">
        {visible.map(o => {
          const { label, urgent } = orderAge(o.created_at);
          return (
            <button
              key={o.order_ref}
              onClick={() => onSelect(o.order_ref)}
              className="flex w-full items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white px-4 py-2.5 text-left transition hover:border-[#4f4a52]/20 hover:shadow-sm"
            >
              <div className="flex min-w-0 items-center gap-2">
                <StatusBadge status={o.payment_status} />
                <span className="truncate text-sm text-[#4f4a52]">{o.customer_name}</span>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {label && (
                  <span className={`text-[10px] font-bold ${urgent ? "text-red-500" : "text-amber-600"}`}>
                    {label}
                  </span>
                )}
                <span className="text-sm font-bold text-[#4f4a52]">{fmtR(o.total)}</span>
              </div>
            </button>
          );
        })}
        {overflow > 0 && (
          <p className="pl-4 text-xs text-[#9b9298]">+{overflow} more — use the filter below</p>
        )}
      </div>
    </div>
  );
}

// ── PackingSlip ───────────────────────────────────────────────────────────────
// Print-only component. Hidden on screen via "hidden print:block" in parent wrapper.

function PackingSlip({ order, printedAt }: { order: OrderRow; printedAt: string }) {
  return (
    <div className="font-sans text-black">
      {/* Branding */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-gray-500">Packing Slip</p>
          <h1 className="mt-1 text-2xl font-black uppercase tracking-tight">
            Maison Skye & Rose
          </h1>
        </div>
        <div className="text-right text-sm text-gray-600">
          <p className="font-bold">{order.order_ref}</p>
          <p>{formatShortDate(order.created_at)}</p>
        </div>
      </div>

      <hr className="mb-6 border-gray-300" />

      {/* Ship To */}
      <div className="mb-6">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500">Ship To</p>
        <p className="text-base font-bold">{order.customer_name}</p>
        <p className="text-sm text-gray-600">{order.phone}</p>
        <p className="text-sm text-gray-600">{order.address}</p>
        <p className="text-sm text-gray-600">{order.province}</p>
      </div>

      <hr className="mb-6 border-gray-300" />

      {/* Items */}
      <div className="mb-6">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500">Items</p>
        <div className="space-y-2.5">
          {(order.items ?? []).map((item, i) => (
            <div key={i} className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                {/* Physical checkbox for packer to tick */}
                <span className="mt-0.5 inline-block h-4 w-4 shrink-0 rounded border border-gray-400" />
                <span className="text-sm">
                  {item.title}
                  {item.size ? ` (${item.size})` : ""} × {item.quantity}
                </span>
              </div>
              <span className="shrink-0 text-sm font-semibold">
                R{(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <hr className="mb-4 border-gray-300" />

      {/* Totals */}
      <div className="mb-6 flex flex-col items-end gap-1">
        <div className="flex w-52 justify-between text-sm text-gray-600">
          <span>Subtotal</span>
          <span>R{order.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex w-52 justify-between text-sm text-gray-600">
          <span>Delivery ({order.province})</span>
          <span>R{order.delivery.toFixed(2)}</span>
        </div>
        <div className="mt-1 flex w-52 justify-between border-t border-gray-300 pt-1 text-sm font-black text-black">
          <span>TOTAL</span>
          <span>R{order.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Tracking number (if dispatched) */}
      {order.tracking_number && (
        <>
          <hr className="mb-4 border-gray-300" />
          <div className="mb-6">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500">
              Tracking
            </p>
            <p className="text-sm font-bold">{order.tracking_number}</p>
          </div>
        </>
      )}

      {/* Internal notes */}
      {order.notes && (
        <>
          <hr className="mb-4 border-gray-300" />
          <div className="mb-6">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500">
              Notes
            </p>
            <p className="text-sm text-gray-700">{order.notes}</p>
          </div>
        </>
      )}

      <hr className="mb-4 border-gray-300" />
      <p className="text-xs text-gray-400">Printed: {printedAt}</p>
    </div>
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
  // Packing checklist — ephemeral, resets when order changes.
  const [checkedItems,   setCheckedItems]   = useState<Set<number>>(new Set());
  // Print timestamp — set just before window.print() so the slip shows accurate time.
  const [printTimestamp, setPrintTimestamp] = useState<string>("");

  useEffect(() => {
    setCheckedItems(new Set());
  }, [order.order_ref]);

  const items    = order.items ?? [];
  const allPacked = items.length > 0 && checkedItems.size === items.length;
  const firstName = order.customer_name.split(" ")[0];

  const waUrl = `https://wa.me/${toWhatsAppNumber(order.phone)}?text=${encodeURIComponent(
    `Hi ${firstName}! This is Maison Skye & Rose regarding your order ${order.order_ref}.`
  )}`;

  const dispatchWaUrl = order.tracking_number
    ? `https://wa.me/${toWhatsAppNumber(order.phone)}?text=${encodeURIComponent(
        `Hi ${firstName}! Great news — your Maison Skye & Rose order has been dispatched 🎉\n\nOrder: ${order.order_ref}\nTracking: ${order.tracking_number}\n\nThank you for shopping with us! 💜`
      )}`
    : null;

  function handlePrint() {
    const ts = new Date().toLocaleString("en-ZA", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
    setPrintTimestamp(ts);
    // Allow React one tick to re-render with the new timestamp before printing.
    setTimeout(() => window.print(), 80);
  }

  return (
    <>
      {/* ── Screen view (hidden during print) ─────────────────────────────── */}
      <div className="flex flex-col print:hidden">

        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <div className="flex items-center gap-1">
              <p className="text-xs font-black tracking-wide text-[#4f4a52]">{order.order_ref}</p>
              <CopyButton value={order.order_ref} label="Copy order reference" />
            </div>
            <p className="mt-0.5 text-sm text-[#7b7480]">
              {order.customer_name} · {order.province}
            </p>
            <div className="mt-2">
              <StatusBadge status={order.payment_status} />
            </div>
          </div>
          <div className="flex items-center gap-0.5">
            <button
              onClick={handlePrint}
              aria-label="Print packing slip"
              title="Print packing slip"
              className="rounded-full p-1.5 text-[#9b9298] transition hover:bg-gray-100 hover:text-[#4f4a52]"
            >
              <Printer size={16} />
            </button>
            <button
              onClick={onClose}
              aria-label="Close"
              className="rounded-full p-1.5 text-[#9b9298] transition hover:bg-gray-100 hover:text-[#4f4a52]"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-7 px-6 py-6">

          {/* ── Customer ──────────────────────────────────────────────────── */}
          <section>
            <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#d89ca4]">
              Customer
            </p>
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-[#4f4a52]">{order.customer_name}</p>
                <CopyButton value={order.customer_name} label="Copy name" />
              </div>
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm text-[#7b7480]">{order.phone}</p>
                <CopyButton value={order.phone} label="Copy phone" />
              </div>
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm text-[#7b7480]">{order.address}</p>
                <CopyButton
                  value={`${order.address}, ${order.province}`}
                  label="Copy address"
                />
              </div>
            </div>
          </section>

          {/* ── Items ─────────────────────────────────────────────────────── */}
          <section>
            <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#d89ca4]">
              Items
            </p>
            <div className="mt-3 space-y-2">
              {items.map((item, i) => (
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
              <div className="space-y-1 border-t border-gray-100 pt-2">
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
              <div className="mt-2 flex items-center justify-between gap-2">
                <p className="text-xs text-[#7b7480]">
                  Tracking:{" "}
                  <span className="font-semibold text-[#4f4a52]">
                    {order.tracking_number}
                  </span>
                </p>
                <CopyButton
                  value={order.tracking_number}
                  label="Copy tracking number"
                />
              </div>
            )}
          </section>

          {/* ── Packing Checklist — processing orders only ────────────────── */}
          {order.payment_status === "processing" && items.length > 0 && (
            <section>
              <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#d89ca4]">
                Packing Checklist
              </p>
              <div className="mt-3 space-y-1">
                {items.map((item, i) => (
                  <label
                    key={i}
                    className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={checkedItems.has(i)}
                      onChange={() => {
                        setCheckedItems(prev => {
                          const next = new Set(prev);
                          if (next.has(i)) next.delete(i); else next.add(i);
                          return next;
                        });
                      }}
                      className="h-4 w-4 rounded accent-[#4f4a52]"
                    />
                    <span
                      className={`text-sm transition-colors ${
                        checkedItems.has(i)
                          ? "text-[#9b9298] line-through"
                          : "text-[#4f4a52]"
                      }`}
                    >
                      {item.title}
                      {item.size ? ` (${item.size})` : ""} × {item.quantity}
                    </span>
                  </label>
                ))}
              </div>
              {allPacked && (
                <p className="mt-2 rounded-xl bg-green-50 px-3 py-2 text-xs font-semibold text-green-700">
                  All items packed — ready to dispatch
                </p>
              )}
            </section>
          )}

          {/* ── Actions ───────────────────────────────────────────────────── */}
          {nextStatuses.length > 0 && (
            <section>
              <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#d89ca4]">
                Actions
              </p>
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
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={pendingAction.trackingNumber}
                            onChange={e =>
                              onPendingChange({ ...pendingAction, trackingNumber: e.target.value })
                            }
                            placeholder="e.g. SN123456789"
                            autoFocus
                            className="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4f4a52]/20"
                          />
                          {pendingAction.trackingNumber.trim() && (
                            <CopyButton
                              value={pendingAction.trackingNumber.trim()}
                              label="Copy tracking number"
                            />
                          )}
                        </div>
                        <p className="mt-1 text-[10px] text-[#9b9298]">
                          Copy the number above to paste into your courier portal.
                        </p>
                      </div>
                    )}

                    <div>
                      <label className="mb-1 block text-[10px] uppercase tracking-[0.3em] text-[#9b9298]">
                        Note (optional)
                      </label>
                      <textarea
                        value={pendingAction.note}
                        onChange={e =>
                          onPendingChange({ ...pendingAction, note: e.target.value })
                        }
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
                          (pendingAction.status === "dispatched" &&
                            !pendingAction.trackingNumber.trim())
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

          {/* ── Feedback ──────────────────────────────────────────────────── */}
          {feedback && (
            <p
              className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
                feedback.type === "success"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {feedback.text}
            </p>
          )}

          {/* ── Timeline ──────────────────────────────────────────────────── */}
          <section>
            <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#d89ca4]">
              Timeline
            </p>
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

          {/* ── Internal Notes ────────────────────────────────────────────── */}
          <section>
            <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#d89ca4]">
              Internal Notes
            </p>
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

          {/* ── WhatsApp — general ────────────────────────────────────────── */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] py-3.5 text-sm font-bold text-white transition hover:bg-[#1ebe59]"
          >
            <MessageCircle size={16} />
            WhatsApp {firstName}
          </a>

          {/* ── Dispatch notification — dispatched orders with tracking ───── */}
          {order.payment_status === "dispatched" && dispatchWaUrl && (
            <a
              href={dispatchWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 py-3.5 text-sm font-bold text-indigo-700 transition hover:bg-indigo-100"
            >
              <MessageCircle size={16} />
              Send Dispatch Notification
            </a>
          )}

        </div>
      </div>

      {/* ── Print view (hidden on screen, shown during print) ─────────────── */}
      <div className="hidden print:block p-8">
        <PackingSlip order={order} printedAt={printTimestamp} />
      </div>
    </>
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

  const dashboard = useMemo(() => computeDashboard(initialOrders), [initialOrders]);

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

  function handlePrioritySelect(ref: string) {
    setStatusFilter("all");
    setSelectedRef(ref);
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

  const hasPriorityItems =
    dashboard.needsAttention.length > 0 || dashboard.readyToShip.length > 0;

  return (
    <>
      {/* Print page settings — isolated to the admin console. */}
      <style>{`
        @media print {
          @page { margin: 1.5cm; size: A4 portrait; }
          body  { background: white !important; }
        }
      `}</style>

      <div className="flex min-h-screen flex-col bg-[#f8f7f5]">

        {/* ── Header ──────────────────────────────────────────────────────────── */}
        <header className="flex items-center justify-between bg-[#4f4a52] px-6 py-4 print:hidden">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-[9px] uppercase tracking-[0.5em] text-[#d89ca4]">Internal</p>
              <h1 className="text-sm font-black uppercase tracking-widest text-white">
                Maison Operations
              </h1>
            </div>
            <nav className="flex items-center gap-4">
              <span className="text-xs font-bold text-white">Operations</span>
              <Link href="/admin/briefing" className="text-xs text-white/60 transition hover:text-white">
                Briefing
              </Link>
              <Link href="/admin/intelligence" className="text-xs text-white/60 transition hover:text-white">
                Intelligence
              </Link>
              <Link href="/admin/recommendation-performance" className="text-xs text-white/60 transition hover:text-white">
                Performance
              </Link>
              <Link href="/admin/customer-intelligence" className="text-xs text-white/60 transition hover:text-white">
                Customer Intelligence
              </Link>
              <Link href="/admin/commerce-intelligence" className="text-xs text-white/60 transition hover:text-white">
                Commerce Intelligence
              </Link>
              <Link href="/admin/executive-operations" className="text-xs text-white/60 transition hover:text-white">
                Executive Operations
              </Link>
              <Link href="/admin/operations" className="text-xs text-white/60 transition hover:text-white">
                Unified Operations
              </Link>
              <Link href="/admin/alerts" className="text-xs text-white/60 transition hover:text-white">
                Alerts
              </Link>
              <Link href="/admin/alert-center" className="text-xs text-white/60 transition hover:text-white">
                Alert Center
              </Link>
              <Link href="/admin/executive-digest" className="text-xs text-white/60 transition hover:text-white">
                Executive Digest
              </Link>
              <Link href="/admin/executive-briefing" className="text-xs text-white/60 transition hover:text-white">
                Executive Briefing
              </Link>
              <Link href="/admin/executive-report" className="text-xs text-white/60 transition hover:text-white">
                Executive Report
              </Link>
              <Link href="/admin/executive-report-center" className="text-xs text-white/60 transition hover:text-white">
                Executive Report Center
              </Link>
              <Link href="/admin/executive-report-archive" className="text-xs text-white/60 transition hover:text-white">
                Executive Report Archive
              </Link>
              <Link href="/admin/executive-report-archive-center" className="text-xs text-white/60 transition hover:text-white">
                Executive Report Archive Center
              </Link>
              <Link href="/admin/executive-report-history" className="text-xs text-white/60 transition hover:text-white">
                Executive Report History
              </Link>
              <Link href="/admin/executive-report-history-center" className="text-xs text-white/60 transition hover:text-white">
                Executive Report History Center
              </Link>
              <Link href="/admin/executive-report-comparison" className="text-xs text-white/60 transition hover:text-white">
                Executive Report Comparison
              </Link>
              <Link href="/admin/executive-report-comparison-center" className="text-xs text-white/60 transition hover:text-white">
                Executive Report Comparison Center
              </Link>
              <Link href="/admin/executive-report-delta" className="text-xs text-white/60 transition hover:text-white">
                Executive Report Delta
              </Link>
              <Link href="/admin/executive-report-delta-center" className="text-xs text-white/60 transition hover:text-white">
                Executive Report Delta Center
              </Link>
              <Link href="/admin/executive-report-insight" className="text-xs text-white/60 transition hover:text-white">
                Executive Report Insight
              </Link>
              <Link href="/admin/executive-report-insight-center" className="text-xs text-white/60 transition hover:text-white">
                Executive Report Insight Center
              </Link>
              <Link href="/admin/executive-report-trend" className="text-xs text-white/60 transition hover:text-white">
                Executive Report Trend
              </Link>
              <Link href="/admin/executive-report-trend-center" className="text-xs text-white/60 transition hover:text-white">
                Executive Report Trend Center
              </Link>
              <Link href="/admin/executive-report-forecast" className="text-xs text-white/60 transition hover:text-white">
                Executive Report Forecast
              </Link>
              <Link href="/admin/executive-report-forecast-center" className="text-xs text-white/60 transition hover:text-white">
                Executive Report Forecast Center
              </Link>
              <Link href="/admin/executive-report-outlook" className="text-xs text-white/60 transition hover:text-white">
                Executive Report Outlook
              </Link>
              <Link href="/admin/executive-report-outlook-center" className="text-xs text-white/60 transition hover:text-white">
                Executive Report Outlook Center
              </Link>
              <Link href="/admin/executive-report-strategy" className="text-xs text-white/60 transition hover:text-white">
                Executive Report Strategy
              </Link>
              <Link href="/admin/executive-report-strategy-center" className="text-xs text-white/60 transition hover:text-white">
                Executive Report Strategy Center
              </Link>
              <Link href="/admin/executive-report-action" className="text-xs text-white/60 transition hover:text-white">
                Executive Report Action
              </Link>
              <Link href="/admin/executive-report-action-center" className="text-xs text-white/60 transition hover:text-white">
                Executive Report Action Center
              </Link>
              <Link href="/admin/executive-report-decision" className="text-xs text-white/60 transition hover:text-white">
                Executive Report Decision
              </Link>
              <Link href="/admin/executive-report-decision-center" className="text-xs text-white/60 transition hover:text-white">
                Executive Report Decision Center
              </Link>
              <Link href="/admin/executive-report-approval" className="text-xs text-white/60 transition hover:text-white">
                Executive Report Approval
              </Link>
              <Link href="/admin/executive-report-approval-center" className="text-xs text-white/60 transition hover:text-white">
                Executive Report Approval Center
              </Link>
              <Link href="/admin/executive-report-execution" className="text-xs text-white/60 transition hover:text-white">
                Executive Report Execution
              </Link>
              <Link href="/admin/executive-report-execution-center" className="text-xs text-white/60 transition hover:text-white">
                Executive Report Execution Center
              </Link>
              <Link href="/admin/executive-report-completion" className="text-xs text-white/60 transition hover:text-white">
                Executive Report Completion
              </Link>
              <Link href="/admin/executive-report-completion-center" className="text-xs text-white/60 transition hover:text-white">
                Executive Report Completion Center
              </Link>
              <Link href="/admin/executive-report-publication" className="text-xs text-white/60 transition hover:text-white">
                Executive Report Publication
              </Link>
              <Link href="/admin/executive-report-publication-center" className="text-xs text-white/60 transition hover:text-white">
                Executive Report Publication Center
              </Link>
              <Link href="/admin/executive-report-distribution" className="text-xs text-white/60 transition hover:text-white">
                Executive Report Distribution
              </Link>
              <Link href="/admin/executive-report-distribution-center" className="text-xs text-white/60 transition hover:text-white">
                Executive Report Distribution Center
              </Link>
              <Link href="/admin/executive-report-delivery" className="text-xs text-white/60 transition hover:text-white">
                Executive Report Delivery
              </Link>
              <Link href="/admin/executive-report-delivery-center" className="text-xs text-white/60 transition hover:text-white">
                Executive Report Delivery Center
              </Link>
              <Link href="/admin/executive-report-acknowledgement" className="text-xs text-white/60 transition hover:text-white">
                Executive Report Acknowledgement
              </Link>
              <Link href="/admin/executive-report-acknowledgement-center" className="text-xs text-white/60 transition hover:text-white">
                Executive Report Acknowledgement Center
              </Link>
              <Link href="/admin/executive-report-receipt" className="text-xs text-white/60 transition hover:text-white">
                Executive Report Receipt
              </Link>
              <Link href="/admin/executive-report-receipt-center" className="text-xs text-white/60 transition hover:text-white">
                Executive Report Receipt Center
              </Link>
              <Link href="/admin/executive-report-confirmation" className="text-xs text-white/60 transition hover:text-white">
                Executive Report Confirmation
              </Link>
              <Link href="/admin/executive-report-confirmation-center" className="text-xs text-white/60 transition hover:text-white">
                Executive Report Confirmation Center
              </Link>
              <Link href="/admin/executive-report-validation" className="text-xs text-white/60 transition hover:text-white">
                Executive Report Validation
              </Link>
              <Link href="/admin/executive-report-validation-center" className="text-xs text-white/60 transition hover:text-white">
                Executive Report Validation Center
              </Link>
              <Link href="/admin/executive-report-certification" className="text-xs text-white/60 transition hover:text-white">
                Executive Report Certification
              </Link>
              <Link href="/admin/executive-report-certification-center" className="text-xs text-white/60 transition hover:text-white">
                Executive Report Certification Center
              </Link>
              <Link href="/admin/executive-report-authorization" className="text-xs text-white/60 transition hover:text-white">
                Executive Report Authorization
              </Link>
              <Link href="/admin/executive-report-authorization-center" className="text-xs text-white/60 transition hover:text-white">
                Executive Report Authorization Center
              </Link>
              <Link href="/admin/executive-report-authentication" className="text-xs text-white/60 transition hover:text-white">
                Executive Report Authentication
              </Link>
              <Link href="/admin/executive-report-authentication-center" className="text-xs text-white/60 transition hover:text-white">
                Executive Report Authentication Center
              </Link>
              <Link href="/admin/executive-report-ratification" className="text-xs text-white/60 transition hover:text-white">
                Executive Report Ratification
              </Link>
              <Link href="/admin/executive-report-ratification-center" className="text-xs text-white/60 transition hover:text-white">
                Executive Report Ratification Center
              </Link>
            </nav>
          </div>
          <form action={logoutAction}>
            <button type="submit" className="text-xs text-white/60 transition hover:text-white">
              Sign Out
            </button>
          </form>
        </header>

        {/* ── Revenue Briefing ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3 px-6 pt-4 pb-3 print:hidden">
          <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-4">
            <p className="text-[9px] uppercase tracking-[0.35em] text-amber-600">Pending</p>
            <p className="mt-1 text-xl font-black tabular-nums text-[#4f4a52]">
              {fmtR(dashboard.pendingRevenue)}
            </p>
            <p className="mt-0.5 text-[10px] text-amber-600/80">awaiting payment</p>
          </div>
          <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-4">
            <p className="text-[9px] uppercase tracking-[0.35em] text-blue-600">Confirmed</p>
            <p className="mt-1 text-xl font-black tabular-nums text-[#4f4a52]">
              {fmtR(dashboard.confirmedRevenue)}
            </p>
            <p className="mt-0.5 text-[10px] text-blue-600/80">payment received</p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white px-4 py-4">
            <p className="text-[9px] uppercase tracking-[0.35em] text-[#9b9298]">Active</p>
            <p className="mt-1 text-xl font-black tabular-nums text-[#4f4a52]">
              {dashboard.activeCount}
            </p>
            <p className="mt-0.5 text-[10px] text-[#9b9298]">open orders</p>
          </div>
        </div>

        {/* ── Priority Queues ──────────────────────────────────────────────────── */}
        {hasPriorityItems && (
          <div className="space-y-4 px-6 pb-4 print:hidden">
            {dashboard.needsAttention.length > 0 && (
              <PriorityQueue
                title="Needs Attention"
                orders={dashboard.needsAttention}
                badgeClass="bg-amber-500 text-white"
                onSelect={handlePrioritySelect}
              />
            )}
            {dashboard.readyToShip.length > 0 && (
              <PriorityQueue
                title="Ready to Ship"
                orders={dashboard.readyToShip}
                badgeClass="bg-indigo-500 text-white"
                onSelect={handlePrioritySelect}
              />
            )}
          </div>
        )}

        {/* ── Packing Workspace Entry Point ────────────────────────────────────── */}
        <div className="px-6 pb-3 print:hidden">
          <button
            onClick={() =>
              setStatusFilter(prev => (prev === "processing" ? "all" : "processing"))
            }
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition-all ${
              statusFilter === "processing"
                ? "bg-purple-600 text-white shadow-sm"
                : "border border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100"
            }`}
          >
            Ready for Packing
            <span
              className={`rounded-full px-2 py-0.5 text-[9px] font-black ${
                statusFilter === "processing"
                  ? "bg-white/20 text-white"
                  : "bg-purple-200 text-purple-700"
              }`}
            >
              {statusCounts.processing ?? 0}
            </span>
          </button>
        </div>

        {/* ── Status Filter Cards ──────────────────────────────────────────────── */}
        <div className="flex gap-2.5 overflow-x-auto px-6 pb-3 print:hidden">
          {ORDER_STATUSES.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(prev => (prev === s ? "all" : s))}
              className={`flex shrink-0 flex-col items-start rounded-2xl border px-4 py-3 transition-all ${
                statusFilter === s
                  ? "border-[#4f4a52] bg-white shadow-sm"
                  : "border-transparent bg-white/70 hover:bg-white"
              }`}
            >
              <span className="text-xl font-black tabular-nums text-[#4f4a52]">
                {statusCounts[s] ?? 0}
              </span>
              <span className="mt-0.5 text-[9px] uppercase tracking-[0.3em] text-[#9b9298]">
                {STATUS_LABELS[s]}
              </span>
            </button>
          ))}
        </div>

        {/* ── Main area ────────────────────────────────────────────────────────── */}
        <div className="flex min-h-0 flex-1 overflow-hidden">

          {/* Orders list — hidden during print */}
          <div className="flex min-w-0 flex-1 flex-col overflow-hidden print:hidden">

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
                  {filteredOrders.map(order => {
                    const ageInfo =
                      order.payment_status === "awaiting_payment"
                        ? orderAge(order.created_at)
                        : null;
                    return (
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
                              {ageInfo?.label && (
                                <span
                                  className={`text-[10px] font-bold ${
                                    ageInfo.urgent ? "text-red-500" : "text-amber-600"
                                  }`}
                                >
                                  {ageInfo.label}
                                </span>
                              )}
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
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ── Detail panel (desktop) — full-width during print ────────────── */}
          <div className="hidden w-[440px] shrink-0 overflow-y-auto border-l border-gray-100 bg-white lg:block print:block print:w-full print:border-0">
            {selectedOrder ? (
              <DetailPanel
                {...detailPanelProps}
                onClose={() => setSelectedRef(null)}
              />
            ) : (
              <div className="flex h-full items-center justify-center print:hidden">
                <p className="text-sm text-[#9b9298]">Select an order to view details</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Detail panel (mobile overlay) — hidden during print ─────────────── */}
        <AnimatePresence>
          {selectedOrder && (
            <>
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedRef(null)}
                className="fixed inset-0 z-20 bg-black/40 lg:hidden print:hidden"
              />
              <motion.div
                key="drawer"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="fixed inset-x-0 bottom-0 z-30 max-h-[88vh] overflow-y-auto rounded-t-[28px] bg-white lg:hidden print:hidden"
              >
                <div className="flex justify-center pb-1 pt-3">
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
    </>
  );
}
