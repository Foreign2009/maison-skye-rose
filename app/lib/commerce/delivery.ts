export const COLLECTION_PROVINCE = "Collection / Pickup" as const;

export const DELIVERY_RATES: Record<string, number> = {
  "Cape Town Metro":       100,
  "Western Cape Regional": 150,
  "Gauteng":               180,
  "KwaZulu-Natal":         180,
  "Other Major Cities":    200,
  "Outlying Areas":        300,
  "Collection / Pickup":   0,
};

export const ALL_PROVINCES: string[] = Object.keys(DELIVERY_RATES);

export function getDeliveryCharge(province: string): number {
  const rate = DELIVERY_RATES[province];
  // R180 fallback for unknown provinces. In the validated order submission
  // path, validateOrderBody rejects unknown provinces before reaching this
  // function — the fallback is only reachable via direct unvalidated calls.
  return rate !== undefined ? rate : 180;
}

export function isCollectionOrder(province: string): boolean {
  return province === COLLECTION_PROVINCE;
}

// Founder decision 2026-09-14: "orders over R2000 is free"
// Threshold is exclusive: subtotal must be strictly GREATER THAN R2000.
export const FREE_DELIVERY_THRESHOLD = 2000;

export function computeDelivery(province: string, subtotal: number): number {
  if (isCollectionOrder(province)) return 0;
  if (subtotal > FREE_DELIVERY_THRESHOLD) return 0;
  return getDeliveryCharge(province);
}
