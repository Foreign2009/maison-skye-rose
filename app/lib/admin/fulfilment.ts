import { COLLECTION_PROVINCE } from "../commerce/delivery";
import { ORDER_STATUSES, type OrderStatus, type StatusHistoryEntry } from "../orderStatus";

/**
 * Read-only fulfilment dashboard logic (Admin Fulfilment M1).
 *
 * Pure functions only: no database access, no writes and no network calls.
 * Reminder stages follow SOP V2.1 (24h friendly, 48h final, 72h manual
 * cancellation review) and are advisory — nothing here sends a message,
 * records a reminder or changes an order.
 */

const HOUR_MS = 60 * 60 * 1000;

export const REMINDER_THRESHOLD_HOURS = { friendly: 24, final: 48, review: 72 } as const;

export const SA_TIME_ZONE = "Africa/Johannesburg";

/** Stored order fields the dashboard reads. Values are shown as stored, never inferred. */
export type FulfilmentOrder = {
  order_ref:      string;
  customer_name:  string;
  phone:          string | null;
  province:       string | null;
  total:          number | null;
  payment_status: string;
  status_history: unknown;
  created_at:     string | null;
};

/** Suggested next action for an awaiting-payment order. Advisory only. */
export type ReminderStage =
  | "none"            // awaiting payment, under 24 hours
  | "friendly"        // 24 to under 48 hours
  | "final"           // 48 to under 72 hours
  | "review"          // 72 hours or more: manual cancellation review
  | "unknown_age"     // awaiting payment but created_at is missing or invalid
  | "not_applicable"; // no longer awaiting payment

/** Milliseconds since epoch, or null when the timestamp is missing or unparseable. */
export function parseTimestamp(iso: string | null | undefined): number | null {
  if (typeof iso !== "string" || iso.trim() === "") return null;
  const ms = Date.parse(iso);
  return Number.isFinite(ms) ? ms : null;
}

/** Whole and fractional hours elapsed between two absolute instants; null if the age is unknown. */
export function ageHours(createdAt: string | null | undefined, nowMs: number): number | null {
  const created = parseTimestamp(createdAt);
  if (created === null) return null;
  return (nowMs - created) / HOUR_MS;
}

/**
 * The single highest-priority reminder action for an order.
 * Calculated from absolute timestamps, so the result never depends on the
 * computer's local time zone.
 */
export function reminderStage(status: string, createdAt: string | null | undefined, nowMs: number): ReminderStage {
  if (status !== "awaiting_payment") return "not_applicable";
  const hours = ageHours(createdAt, nowMs);
  if (hours === null) return "unknown_age";
  if (hours >= REMINDER_THRESHOLD_HOURS.review) return "review";
  if (hours >= REMINDER_THRESHOLD_HOURS.final) return "final";
  if (hours >= REMINDER_THRESHOLD_HOURS.friendly) return "friendly";
  return "none";
}

/** Human age label, e.g. "5h" or "3d 2h". Null when the age is unknown. */
export function formatAge(createdAt: string | null | undefined, nowMs: number): string | null {
  const hours = ageHours(createdAt, nowMs);
  if (hours === null) return null;
  if (hours < 0) return "0h";
  const whole = Math.floor(hours);
  if (whole < 24) return `${whole}h`;
  const days = Math.floor(whole / 24);
  const rem = whole % 24;
  return rem === 0 ? `${days}d` : `${days}d ${rem}h`;
}

/** Date and time shown in South African time, regardless of where the code runs. */
export function formatSaDateTime(iso: string | null | undefined): string | null {
  const ms = parseTimestamp(iso);
  if (ms === null) return null;
  return new Intl.DateTimeFormat("en-ZA", {
    timeZone: SA_TIME_ZONE,
    day:      "2-digit",
    month:    "short",
    year:     "numeric",
    hour:     "2-digit",
    minute:   "2-digit",
    hour12:   false,
  }).format(new Date(ms));
}

/** Stored total in the storefront's format, e.g. "R1250.00". Null when no valid total is stored. */
export function formatTotal(total: number | null | undefined): string | null {
  if (typeof total !== "number" || !Number.isFinite(total)) return null;
  return `R${total.toFixed(2)}`;
}

export type FulfilmentMethod = { kind: "collection" } | { kind: "courier"; province: string } | { kind: "unknown" };

/** Collection or courier, read from the stored province exactly as checkout records it. */
export function fulfilmentMethod(province: string | null | undefined): FulfilmentMethod {
  if (typeof province !== "string" || province.trim() === "") return { kind: "unknown" };
  if (province === COLLECTION_PROVINCE) return { kind: "collection" };
  return { kind: "courier", province };
}

/**
 * True only when the stored status history contains an entry written by the
 * old PayFast notification handler, whose notes begin "PayFast ITN".
 */
export function hasPayfastItnHistory(history: unknown): boolean {
  if (!Array.isArray(history)) return false;
  return history.some((entry) => {
    const note = (entry as Partial<StatusHistoryEntry> | null)?.note;
    return typeof note === "string" && /^PayFast ITN\b/i.test(note.trim());
  });
}

/** Known statuses are shown as stored; anything else is reported as unrecognised, never coerced. */
export function isKnownStatus(status: string): status is OrderStatus {
  return (ORDER_STATUSES as readonly string[]).includes(status);
}

// ── WhatsApp handoff ──────────────────────────────────────────────────────────

/**
 * South African number in international form (27XXXXXXXXX), or null.
 * Accepts 0XXXXXXXXX, 27XXXXXXXXX and +27XXXXXXXXX, with spaces or dashes.
 * Only mobile ranges (06x, 07x, 08x) are accepted, because WhatsApp needs a mobile number.
 */
export function toSaWhatsAppNumber(phone: string | null | undefined): string | null {
  if (typeof phone !== "string") return null;
  const digits = phone.replace(/\D/g, "");
  let national: string;
  if (digits.startsWith("27") && digits.length === 11) national = digits.slice(2);
  else if (digits.startsWith("0") && digits.length === 10) national = digits.slice(1);
  else return null;
  return /^[678]\d{8}$/.test(national) ? "27" + national : null;
}

export type ReminderKind = "friendly" | "final";

function firstName(name: string): string {
  const first = name.trim().split(/\s+/)[0];
  return first || "there";
}

/**
 * Approved reminder wording. It reports only what the order record shows (payment
 * awaiting confirmation): it never claims the bank was checked, never says money
 * has or has not arrived, and never sets a deadline.
 */
export function buildReminderMessage(kind: ReminderKind, order: Pick<FulfilmentOrder, "order_ref" | "customer_name" | "total">): string {
  const name = firstName(order.customer_name ?? "");
  const amount = formatTotal(order.total);
  const amountClause = amount ? ` of ${amount}` : "";
  if (kind === "friendly") {
    return (
      `Hi ${name}, thank you for your Maison Skye & Rose order ${order.order_ref}. 🌸\n\n` +
      `This is a friendly reminder that our order records still show your EFT payment${amountClause} as awaiting confirmation. ` +
      `Please use ${order.order_ref} as your payment reference. Our banking details are on your order receipt, ` +
      `and we're happy to resend them here if you need them.\n\n` +
      `If you've already paid, please send your proof of payment here so we can match it to your order. Thank you!`
    );
  }
  return (
    `Hi ${name}, a final reminder about your Maison Skye & Rose order ${order.order_ref}. 🌸\n\n` +
    `Our order records still show your EFT payment${amountClause} as awaiting confirmation. ` +
    `If you haven't paid yet, please use ${order.order_ref} as your reference, or let us know if you need help ` +
    `or would like to change your order.\n\n` +
    `If you've already paid, please send your proof of payment here so we can match it to your order. Thank you!`
  );
}

export type ReminderLink = { ok: true; href: string } | { ok: false; reason: string };

/** wa.me link for a staff-initiated reminder, or the reason it is unavailable. */
export function buildReminderLink(kind: ReminderKind, order: FulfilmentOrder): ReminderLink {
  const number = toSaWhatsAppNumber(order.phone);
  if (!number) {
    return { ok: false, reason: "No valid South African mobile number is stored for this order." };
  }
  const text = encodeURIComponent(buildReminderMessage(kind, order));
  return { ok: true, href: `https://wa.me/${number}?text=${text}` };
}

// ── Filters ───────────────────────────────────────────────────────────────────

export type FulfilmentFilter = "all" | "awaiting_payment" | "reminders_due" | "cancellation_review" | OrderStatus;

export function matchesFilter(order: FulfilmentOrder, filter: FulfilmentFilter, nowMs: number): boolean {
  if (filter === "all") return true;
  const stage = reminderStage(order.payment_status, order.created_at, nowMs);
  if (filter === "reminders_due") return stage === "friendly" || stage === "final";
  if (filter === "cancellation_review") return stage === "review";
  return order.payment_status === filter;
}
