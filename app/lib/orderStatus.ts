export const ORDER_STATUSES = [
  "awaiting_payment",
  "payment_confirmed",
  "processing",
  "dispatched",
  "delivered",
  "cancelled",
] as const;

export type OrderStatus = typeof ORDER_STATUSES[number];

export const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  awaiting_payment:  ["payment_confirmed", "cancelled"],
  payment_confirmed: ["processing",        "cancelled"],
  processing:        ["dispatched",        "cancelled"],
  dispatched:        ["delivered",         "cancelled"],
  delivered:         [],
  cancelled:         [],
};

export function lifecycleTimestampField(status: OrderStatus): string | null {
  switch (status) {
    case "payment_confirmed": return "payment_confirmed_at";
    case "dispatched":        return "dispatched_at";
    case "delivered":         return "delivered_at";
    case "cancelled":         return "cancelled_at";
    default:                  return null;
  }
}

export interface StatusHistoryEntry {
  status:     OrderStatus;
  changed_at: string;
  note?:      string;
}
