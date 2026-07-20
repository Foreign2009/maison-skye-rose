// Presentational component — receives only pre-derived insights from the parent's useMemo.
// No intelligence calculations here. All editorial copy is computed upstream.

export interface ProfileInsight {
  id:   string;
  body: string;
}

interface ProfileInsightsProps {
  insights: readonly ProfileInsight[];
}

export function ProfileInsights({ insights }: ProfileInsightsProps) {
  if (insights.length === 0) return null;

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-5">
        <div className="max-w-2xl">
          <p className="text-[10px] uppercase tracking-[0.55em] text-[#d89ca4]">
            Profile Insights
          </p>
          <div className="mt-8 divide-y divide-[#f0ebe5]">
            {insights.map((insight) => (
              <p
                key={insight.id}
                className="py-5 text-[15px] leading-relaxed text-[#7b7480] first:pt-0 last:pb-0"
              >
                {insight.body}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
