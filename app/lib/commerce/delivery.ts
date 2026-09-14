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
  return rate !== undefined ? rate : 180;
}

export function isCollectionOrder(province: string): boolean {
  return province === COLLECTION_PROVINCE;
}
