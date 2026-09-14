export const REWARD_TIERS = [
  { threshold: 400,  reward: "1 Free 5ml Sample" },
  { threshold: 700,  reward: "2 Free 5ml Samples" },
  { threshold: 1000, reward: "3 Free 5ml Samples" },
  { threshold: 1500, reward: "Discovery Set (5 × 5ml)" },
] as const;

export function getNextReward(subtotal: number): { amount: number; reward: string } | null {
  for (const tier of REWARD_TIERS) {
    if (subtotal < tier.threshold) return { amount: tier.threshold, reward: tier.reward };
  }
  return null;
}

import { FREE_DELIVERY_THRESHOLD } from "./delivery";

// Founder decision 2026-09-14: free delivery on orders over R2000 (subtotal > 2000).
export function getRewardMessage(subtotal: number): string {
  if (subtotal > FREE_DELIVERY_THRESHOLD) return "✓ Discovery Set (5 × 5ml) + Free Delivery";
  if (subtotal >= 1500) return "✓ Discovery Set (5 × 5ml)";
  if (subtotal >= 1000) return "✓ 3 Free 5ml Samples";
  if (subtotal >= 700)  return "✓ 2 Free 5ml Samples";
  if (subtotal >= 400)  return "✓ 1 Free 5ml Sample";
  return "";
}
