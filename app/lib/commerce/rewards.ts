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

// POLICY-PENDING: The R2000 entry includes "+ Free Delivery".
// Authority for this free-delivery rule is unresolved pending founder confirmation.
// This string appears only in the MiniCart WhatsApp preview.
export function getRewardMessage(subtotal: number): string {
  if (subtotal >= 2000) return "✓ Discovery Set (5 × 5ml) + Free Delivery";
  if (subtotal >= 1500) return "✓ Discovery Set (5 × 5ml)";
  if (subtotal >= 1000) return "✓ 3 Free 5ml Samples";
  if (subtotal >= 700)  return "✓ 2 Free 5ml Samples";
  if (subtotal >= 400)  return "✓ 1 Free 5ml Sample";
  return "";
}
