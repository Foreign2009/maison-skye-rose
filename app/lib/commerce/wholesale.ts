export const WHOLESALE_THRESHOLD = 10;

export const WHOLESALE_PRICES: Record<string, number> = {
  "5ml":  48,
  "10ml": 77,
  "30ml": 180,
};

export function isWholesaleActive(cartCount: number): boolean {
  return cartCount >= WHOLESALE_THRESHOLD;
}

export function getWholesaleItemPrice(
  size: string,
  retailPrice: number,
  active: boolean,
): number {
  if (!active) return retailPrice;
  return WHOLESALE_PRICES[size] ?? retailPrice;
}
