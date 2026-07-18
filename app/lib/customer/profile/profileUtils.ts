import type { UnifiedCustomerProfile } from "./UnifiedCustomerProfile";

export function hasMeaningfulProfile(profile: UnifiedCustomerProfile): boolean {
  return (
    profile.signals.length > 0 ||
    profile.recentlyViewed.length > 0 ||
    profile.savedSlugs.length > 0 ||
    profile.lastQuizSlugs.length > 0
  );
}
