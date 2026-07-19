"use client";

import { useMemo }                     from "react";
import { useUnifiedCustomerProfile }   from "../lib/customer/hooks/useUnifiedCustomerProfile";
import { getCustomerInsights }         from "../lib/customer/intelligence/CustomerIntelligenceEngine";
import { KnowledgeChip }               from "./knowledge/KnowledgeChip";
import type { CustomerJourneyStage }   from "../lib/customer/intelligence/CustomerJourney";

// ── Stage presentation ─────────────────────────────────────────────────────────

const STAGE_META: Record<
  CustomerJourneyStage,
  { label: string; description: string; color: string }
> = {
  new:        { label: "New Explorer",    description: "Start discovering your fragrance style.",             color: "#7b7480" },
  exploring:  { label: "Exploring",       description: "You are actively browsing and building your taste.",  color: "#7a8fa3" },
  engaged:    { label: "Engaged",         description: "You have expressed clear fragrance preferences.",     color: "#6aaa8a" },
  converting: { label: "Loyal Customer",  description: "Your fragrance journey is well underway.",           color: "#d89ca4" },
};

// ── Component ──────────────────────────────────────────────────────────────────

export default function CustomerInsightsPanel() {
  const { profile, isReady } = useUnifiedCustomerProfile();

  const insights = useMemo(
    () => (profile ? getCustomerInsights(profile) : null),
    [profile],
  );

  if (!isReady || !insights) return null;

  const { preferences, journey } = insights;

  // Nothing to show for brand-new customers with no history
  if (journey.stage === "new" && !preferences.hasPreferences) return null;

  const stageMeta = STAGE_META[journey.stage];

  const families  = preferences.preferredFamilies.slice(0, 4);
  const occasions = preferences.preferredOccasions.slice(0, 3);
  const seasons   = preferences.preferredSeasons.slice(0, 2);
  const gender    = preferences.dominantGender;

  const hasPrefs = families.length > 0 || occasions.length > 0 || seasons.length > 0 || gender !== null;

  return (
    <div className="mb-8 rounded-3xl border border-[#e8e4e9] bg-white p-5 md:p-6">

      {/* Journey stage ───────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <span
          className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em]"
          style={{ backgroundColor: `${stageMeta.color}18`, color: stageMeta.color }}
        >
          {stageMeta.label}
        </span>
        <p className="text-sm text-[#7b7480]">{stageMeta.description}</p>
      </div>

      {/* Preferences ─────────────────────────────────────────────────────────── */}
      {hasPrefs && (
        <div>
          <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#4f4a52]/40">
            Your Preferences
          </p>
          <div className="flex flex-wrap gap-2">
            {families.map((f) => (
              <KnowledgeChip key={`fam-${f}`} label={f} />
            ))}
            {occasions.map((o) => (
              <KnowledgeChip key={`occ-${o}`} label={o} variant="bordered" />
            ))}
            {seasons.map((s) => (
              <KnowledgeChip key={`sea-${s}`} label={s} />
            ))}
            {gender && (
              <KnowledgeChip label={gender} variant="bordered" />
            )}
          </div>
        </div>
      )}

    </div>
  );
}
