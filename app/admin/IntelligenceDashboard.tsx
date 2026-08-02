import React             from "react";
import Link              from "next/link";
import { logoutAction }  from "./actions";
import type { RecommendationMetrics }    from "@/app/lib/customer/recommendations";
import type { RecommendationConfidence } from "@/app/lib/customer/recommendations";
import type { RecommendationReasonType } from "@/app/lib/customer/recommendations";
import type { StrategyPerformanceSnapshot } from "@/app/lib/customer/recommendations/StrategyPerformance";
import type { SignalCalibrationReport }     from "@/app/lib/customer/signals/SignalCalibration";
import type {
  ExperimentStatusSummary,
  CalibrationStatusSummary,
  PromotionDecision,
  CurrentBaseline,
  ExperimentLifecycleStage,
} from "@/app/lib/customer/recommendations/ExperimentPromotion";
import {
  QUALITY_THRESHOLDS,
  QUALITY_BAND_COLORS,
  classifyBand,
  formatRate,
  formatThresholdRange,
} from "@/app/lib/customer/recommendations/RecommendationQuality";

// ── Shared types ──────────────────────────────────────────────────────────────

export interface RERow {
  slug:           string;
  name:           string;
  rank:           number;
  scoreTotal:     number;
  profileScore:   number;
  catalogScore:   number;
  relationScore:  number;
  discoveryScore: number;
  confidence:     RecommendationConfidence;
  topReason:      RecommendationReasonType | null;
  humanText:      string;
  reasonCount:    number;
  allReasonTypes: readonly RecommendationReasonType[];
}

export interface CatalogueStats {
  total:       number;
  bestSellers: number;
  newArrivals: number;
  featured:    number;
}

export type { ExperimentStatusSummary, CalibrationStatusSummary };

export interface IntelligenceData {
  generatedAt:         string;
  catalogueStats:      CatalogueStats;
  discoveryMetrics:    RecommendationMetrics;
  personalisedMetrics: RecommendationMetrics;
  trendingMetrics:     RecommendationMetrics;
  syntheticSavedSlugs: readonly string[];
  discoveryRows:       RERow[];
  personalisedRows:    RERow[];
  performanceSnapshot: StrategyPerformanceSnapshot;
  signalCalibration:   SignalCalibrationReport;
  experimentStatus:    ExperimentStatusSummary;
  calibrationStatus:   CalibrationStatusSummary;
  promotionDecision:   PromotionDecision;
  currentBaseline:     CurrentBaseline;
}

// ── Shared helpers ────────────────────────────────────────────────────────────

function fmtPct(n: number): string {
  return `${(n * 100).toFixed(1)}%`;
}

function fmtScore(n: number): string {
  return n.toFixed(3);
}

function reasonLabel(t: RecommendationReasonType | null): string {
  if (!t) return "—";
  return t.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function avgFromRows(rows: readonly RERow[], key: "reasonCount" | "scoreTotal"): number {
  if (rows.length === 0) return 0;
  return rows.reduce((s, r) => s + r[key], 0) / rows.length;
}

function avgConfidence(rows: readonly RERow[]): number {
  if (rows.length === 0) return 0;
  return rows.reduce((s, r) => s + r.confidence.score, 0) / rows.length;
}

// ── Shared constants ──────────────────────────────────────────────────────────

const CONFIDENCE_COLOR: Record<string, string> = {
  HIGH:   "text-emerald-600",
  MEDIUM: "text-[#4f4a52]/60",
  LOW:    "text-[#d89ca4]",
};

const STATUS_COLOR: Record<string, string> = {
  active:      "text-emerald-600",
  partial:     "text-amber-500",
  placeholder: "text-[#4f4a52]/30",
  dead:        "text-[#d89ca4]",
};

const STRATEGY_ORDER = ["personalised", "discovery", "similar", "complementary", "trending"] as const;

interface FeedbackEvent {
  name:            string;
  isNew:           boolean;
  payload:         string;
  correlationKeys: string;
  component:       string;
}

const FEEDBACK_EVENTS: FeedbackEvent[] = [
  {
    name:            "recommendation_set_shown",
    isNew:           true,
    payload:         "strategy, surface, count, slugs[], isPersonalised, processingTimeMs",
    correlationKeys: "slugs[] — impression anchor for all downstream attribution",
    component:       "IntelligenceSection",
  },
  {
    name:            "product_clicked",
    isNew:           false,
    payload:         "title, slug, source, rank",
    correlationKeys: "slug (primary), source, rank",
    component:       "ProductCard, RecommendationCard",
  },
  {
    name:            "product_detail_viewed",
    isNew:           false,
    payload:         "title, source, rank",
    correlationKeys: "title → slug via catalogue, source",
    component:       "ProductDetail",
  },
  {
    name:            "add_to_cart",
    isNew:           false,
    payload:         "title, size, price, source",
    correlationKeys: "title → slug via catalogue, source",
    component:       "QuickAddModal, ProductDetail",
  },
  {
    name:            "checkout_started",
    isNew:           false,
    payload:         "itemCount, cartTotal, deliveryMethod",
    correlationKeys: "session-level downstream conversion",
    component:       "checkout/page.tsx",
  },
];

// ── Shared sub-components ─────────────────────────────────────────────────────

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="text-[10px] uppercase tracking-[0.4em] text-[#d89ca4]">{children}</p>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-2 text-xl font-black text-[#4f4a52]">{children}</h2>
  );
}

function PipelineCard({
  label,
  metrics,
  reserved,
}: {
  label:     string;
  metrics:   RecommendationMetrics;
  reserved?: boolean;
}) {
  const filterRate = metrics.poolSize === 0 ? "—" : fmtPct(metrics.filteredSize / metrics.poolSize);
  const yieldRate  = metrics.filteredSize === 0 ? "—" : fmtPct(metrics.returnedSize / metrics.filteredSize);

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#4f4a52]/40">{label}</p>
        {reserved && (
          <span className="text-[9px] font-semibold uppercase tracking-wider text-[#4f4a52]/30">
            Reserved
          </span>
        )}
      </div>
      <div className="space-y-2.5">
        {(
          [
            ["Pool size",       String(metrics.poolSize)],
            ["After filtering", String(metrics.filteredSize)],
            ["Returned",        String(metrics.returnedSize)],
          ] as [string, string][]
        ).map(([k, v]) => (
          <div key={k} className="flex items-center justify-between">
            <span className="text-xs text-[#4f4a52]/60">{k}</span>
            <span className="text-xs font-semibold tabular-nums text-[#4f4a52]">{v}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 space-y-2 border-t border-gray-100 pt-4">
        {(
          [
            ["Filter pass rate", filterRate],
            ["Yield rate",       yieldRate],
            ["Processing time",  `${metrics.processingTimeMs}ms`],
          ] as [string, string][]
        ).map(([k, v]) => (
          <div key={k} className="flex items-center justify-between">
            <span className="text-xs text-[#4f4a52]/40">{k}</span>
            <span className="text-xs font-semibold tabular-nums text-[#4f4a52]">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 1 · OverviewHealthSection ─────────────────────────────────────────────────

function OverviewHealthSection({ data }: { data: IntelligenceData }) {
  const sc = data.signalCalibration;
  const ex = data.experimentStatus;

  const chips: { label: string; value: string; color: string }[] = [
    { label: "Engine",            value: "Operational",                                color: "text-emerald-600" },
    { label: "Active strategies", value: `4 / 5`,                                     color: "text-emerald-600" },
    { label: "Signal sources",    value: `${sc.activeSources.length} / ${sc.sourceHealth.length}`, color: "text-[#4f4a52]" },
    { label: "Signal types",      value: `${sc.activeTypes.length} / ${sc.typeHealth.length}`,     color: "text-[#4f4a52]" },
    { label: "Experiment mode",   value: ex.baselineMode ? "Baseline" : `${ex.activeExperiments.length} active`, color: ex.baselineMode ? "text-[#4f4a52]/60" : "text-emerald-600" },
    { label: "Calibration",       value: data.calibrationStatus.activeCalibrationId,   color: "text-[#4f4a52]" },
  ];

  return (
    <section>
      <SectionLabel>System Overview</SectionLabel>
      <SectionHeading>RE Observatory</SectionHeading>
      <p className="mt-3 max-w-xl text-sm leading-7 text-[#4f4a52]/60">
        Unified optimisation observatory for the Recommendation Engine. Data computed
        from synthetic profiles — no customer data is read or stored.
      </p>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {chips.map((c) => (
          <div key={c.label} className="rounded-xl bg-white px-4 py-3 shadow-sm">
            <p className="text-[10px] text-[#4f4a52]/40">{c.label}</p>
            <p className={`mt-1 text-sm font-bold ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-[#4f4a52]/30">Generated at {new Date(data.generatedAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}.</p>
    </section>
  );
}

// ── 2 · RecommendationHealthSection ──────────────────────────────────────────

function RecommendationHealthSection({ data }: { data: IntelligenceData }) {
  const { catalogueStats, discoveryRows, personalisedRows } = data;

  const allRows    = [...discoveryRows, ...personalisedRows];
  const avgConf    = avgConfidence(allRows);
  const avgReasons = avgFromRows(allRows, "reasonCount");

  return (
    <section className="space-y-10">

      {/* Catalogue Baseline */}
      <div>
        <SectionLabel>Catalogue Baseline</SectionLabel>
        <SectionHeading>Catalogue Composition</SectionHeading>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(
            [
              ["Total",        catalogueStats.total],
              ["Best sellers", catalogueStats.bestSellers],
              ["New arrivals", catalogueStats.newArrivals],
              ["Featured",     catalogueStats.featured],
            ] as [string, number][]
          ).map(([k, v]) => (
            <div key={k} className="rounded-xl bg-white px-4 py-3 shadow-sm">
              <p className="text-[10px] text-[#4f4a52]/40">{k}</p>
              <p className="mt-1 text-2xl font-black text-[#4f4a52]">{v}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pipeline Health */}
      <div>
        <SectionLabel>Pipeline Health</SectionLabel>
        <SectionHeading>RE Performance by Strategy</SectionHeading>
        <p className="mt-3 max-w-xl text-sm text-[#4f4a52]/50">
          Discovery and Trending use cold-start profiles. Personalised, Similar, and
          Complementary use a synthetic profile with{" "}
          {data.syntheticSavedSlugs.length > 0
            ? `${data.syntheticSavedSlugs.length} saved fragrance${data.syntheticSavedSlugs.length !== 1 ? "s" : ""}`
            : "no saved fragrances"}.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <PipelineCard label="Discovery Strategy"    metrics={data.discoveryMetrics} />
          <PipelineCard label="Personalised Strategy" metrics={data.personalisedMetrics} />
          <PipelineCard label="Trending Strategy"     metrics={data.trendingMetrics} reserved />
        </div>
      </div>

      {/* Explainability Health */}
      <div>
        <SectionLabel>Explainability Health</SectionLabel>
        <SectionHeading>Reason + Confidence Summary</SectionHeading>
        <p className="mt-3 max-w-xl text-sm text-[#4f4a52]/50">
          Averaged across discovery and personalised top results.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-white px-4 py-3 shadow-sm">
            <p className="text-[10px] text-[#4f4a52]/40">Avg confidence score</p>
            <p className="mt-1 text-xl font-black text-[#4f4a52]">{fmtScore(avgConf)}</p>
          </div>
          <div className="rounded-xl bg-white px-4 py-3 shadow-sm">
            <p className="text-[10px] text-[#4f4a52]/40">Avg reasons per result</p>
            <p className="mt-1 text-xl font-black text-[#4f4a52]">{avgReasons.toFixed(1)}</p>
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div>
        <SectionLabel>Score Breakdown</SectionLabel>
        <SectionHeading>Discovery — Top {discoveryRows.length} Results</SectionHeading>
        <p className="mt-3 max-w-xl text-sm text-[#4f4a52]/50">
          Cold-start visitor scores. Total is the additive composite across four dimensions.
        </p>
        {discoveryRows.length === 0 ? (
          <p className="mt-6 text-sm text-[#4f4a52]/40">No results returned.</p>
        ) : (
          <div className="mt-6 space-y-2">
            {discoveryRows.map((row) => (
              <div
                key={row.slug}
                className="flex items-center gap-4 rounded-xl bg-white px-4 py-3 shadow-sm"
              >
                <span className="w-5 shrink-0 text-center text-[11px] font-black text-[#4f4a52]/25">
                  {row.rank}
                </span>
                <p className="min-w-0 flex-1 truncate text-sm font-semibold text-[#4f4a52]">
                  {row.name}
                </p>
                <div className="flex shrink-0 items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs font-bold tabular-nums text-[#4f4a52]">
                      {fmtScore(row.scoreTotal)}
                    </p>
                    <p className="text-[9px] text-[#4f4a52]/30">total</p>
                  </div>
                  <div className="hidden text-right sm:block">
                    <p className="text-[10px] text-[#4f4a52]/50">{fmtPct(row.catalogScore)} cat</p>
                    <p className="text-[10px] text-[#4f4a52]/50">{fmtPct(row.discoveryScore)} disc</p>
                  </div>
                  <div className="min-w-[90px] text-right">
                    <p className="text-[10px] font-medium text-[#d89ca4]">
                      {reasonLabel(row.topReason)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Intelligence Trace */}
      <div>
        <SectionLabel>Intelligence Trace</SectionLabel>
        <SectionHeading>Personalised — Top {personalisedRows.length} with Trace</SectionHeading>
        <p className="mt-3 max-w-xl text-sm text-[#4f4a52]/50">
          Full scoring trace and confidence per recommendation. Confidence reflects
          profile signal depth at recommendation time.
        </p>
        {personalisedRows.length === 0 ? (
          <p className="mt-6 text-sm text-[#4f4a52]/40">No results returned.</p>
        ) : (
          <div className="mt-6 space-y-4">
            {personalisedRows.map((row) => (
              <div key={row.slug} className="rounded-2xl bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-black text-[#4f4a52]/25">{row.rank}</span>
                    <p className="text-sm font-bold text-[#4f4a52]">{row.name}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className={`text-[10px] font-semibold uppercase tracking-wider ${CONFIDENCE_COLOR[row.confidence.level] ?? ""}`}>
                      {row.confidence.level}
                    </span>
                    <span className="text-[10px] tabular-nums text-[#4f4a52]/40">
                      {fmtScore(row.confidence.score)}
                    </span>
                  </div>
                </div>
                <p className="mt-3 text-xs leading-5 text-[#4f4a52]/60">{row.humanText}</p>
                <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-2 border-t border-gray-100 pt-4">
                  {(
                    [
                      ["Total score", fmtScore(row.scoreTotal)],
                      ["Top signal",  reasonLabel(row.topReason)],
                      ["Reason count", String(row.reasonCount)],
                      ["Confidence",  row.confidence.reason],
                      ["Profile",     fmtPct(row.profileScore)],
                      ["Catalog",     fmtPct(row.catalogScore)],
                      ["Relation",    fmtPct(row.relationScore)],
                      ["Discovery",   fmtPct(row.discoveryScore)],
                    ] as [string, string][]
                  ).map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between">
                      <span className="text-[10px] text-[#4f4a52]/40">{k}</span>
                      <span className="text-[10px] font-semibold text-[#4f4a52]">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Feedback Loop */}
      <div>
        <SectionLabel>Feedback Loop</SectionLabel>
        <SectionHeading>Recommendation Outcome Events</SectionHeading>
        <p className="mt-3 max-w-xl text-sm text-[#4f4a52]/50">
          Outcome events captured via PostHog. The impression anchor (
          <span className="font-mono">recommendation_set_shown</span>) records the
          ordered slug list so downstream events can be attributed to the originating set.
        </p>
        <div className="mt-6 space-y-2">
          {FEEDBACK_EVENTS.map((ev) => (
            <div key={ev.name} className="rounded-xl bg-white px-5 py-4 shadow-sm">
              <div className="flex items-center gap-2">
                <span className={`shrink-0 text-[10px] font-semibold uppercase tracking-wider ${ev.isNew ? "text-emerald-600" : "text-[#4f4a52]/30"}`}>
                  {ev.isNew ? "New" : "Existing"}
                </span>
                <span className="font-mono text-sm font-bold text-[#4f4a52]">{ev.name}</span>
              </div>
              <div className="mt-2 space-y-1">
                <p className="text-[10px] text-[#4f4a52]/50">
                  Payload: <span className="font-mono text-[#4f4a52]/70">{ev.payload}</span>
                </p>
                <p className="text-[10px] text-[#4f4a52]/50">
                  Correlation: <span className="text-[#4f4a52]/70">{ev.correlationKeys}</span>
                </p>
                <p className="text-[10px] text-[#4f4a52]/50">
                  Component: <span className="text-[#4f4a52]/70">{ev.component}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}

// ── Quality cell helper ───────────────────────────────────────────────────────
// Shows a quality band badge when a live value is available, or a threshold
// reference when the metric is still pending analytics integration.

function QualityCell({
  value,
  metric,
}: {
  value:  number | null;
  metric: "ctr" | "favouriteRate" | "addToCartRate";
}) {
  if (value !== null) {
    const band  = classifyBand(metric, value);
    const color = QUALITY_BAND_COLORS[band];
    return (
      <span
        className="inline-block rounded border px-1.5 py-0.5 font-mono text-[10px] font-bold tabular-nums"
        style={{ color, borderColor: color + "44", backgroundColor: color + "11" }}
      >
        {formatRate(value)}
      </span>
    );
  }
  const t = QUALITY_THRESHOLDS[metric];
  return (
    <span
      className="block text-[9px] leading-tight text-[#4f4a52]/25"
      title={formatThresholdRange(t)}
    >
      —
    </span>
  );
}

// ── 3 · StrategyPerformanceSection ────────────────────────────────────────────

function StrategyPerformanceSection({ snapshot }: { snapshot: StrategyPerformanceSnapshot }) {
  const ordered = STRATEGY_ORDER
    .map((s) => snapshot.summaries.find((x) => x.strategy === s))
    .filter(Boolean) as typeof snapshot.summaries[number][];

  return (
    <section>
      <SectionLabel>Strategy Performance</SectionLabel>
      <SectionHeading>Cross-Strategy Comparison</SectionHeading>
      <p className="mt-3 max-w-xl text-sm text-[#4f4a52]/50">
        All 5 strategies run against synthetic profiles. Engagement metrics require
        EP23.5 analytics integration.
      </p>

      <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-[11px]">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-4 py-3 text-left font-semibold text-[#4f4a52]/40">Strategy</th>
              <th className="px-3 py-3 text-right font-semibold text-[#4f4a52]/40">Pool→Ret</th>
              <th className="px-3 py-3 text-right font-semibold text-[#4f4a52]/40">Filter%</th>
              <th className="px-3 py-3 text-right font-semibold text-[#4f4a52]/40">Avg Score</th>
              <th className="px-3 py-3 text-right font-semibold text-[#4f4a52]/40">Avg Conf</th>
              <th className="px-3 py-3 text-right font-semibold text-[#4f4a52]/40">Reasons</th>
              <th className="px-3 py-3 text-right font-semibold text-[#4f4a52]/30">CTR</th>
              <th className="px-3 py-3 text-right font-semibold text-[#4f4a52]/30">Save</th>
              <th className="px-3 py-3 text-right font-semibold text-[#4f4a52]/30">Cart</th>
            </tr>
          </thead>
          <tbody>
            {ordered.map((s) => (
              <tr key={s.strategy} className="border-b border-gray-50 last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${s.active ? "text-emerald-600" : "text-[#4f4a52]/30"}`}>
                      {s.active ? "●" : "○"}
                    </span>
                    <span className="font-mono font-semibold text-[#4f4a52]">{s.strategy}</span>
                  </div>
                </td>
                <td className="px-3 py-3 text-right tabular-nums text-[#4f4a52]">
                  {s.poolSize}→{s.returnedSize}
                </td>
                <td className="px-3 py-3 text-right tabular-nums text-[#4f4a52]">
                  {fmtPct(s.filterPassRate)}
                </td>
                <td className="px-3 py-3 text-right tabular-nums font-semibold text-[#4f4a52]">
                  {fmtScore(s.avgScore)}
                </td>
                <td className="px-3 py-3 text-right tabular-nums text-[#4f4a52]">
                  {fmtScore(s.avgConfidence)}
                </td>
                <td className="px-3 py-3 text-right tabular-nums text-[#4f4a52]">
                  {s.avgReasonCount.toFixed(1)}
                </td>
                <td className="px-3 py-3 text-right">
                  <QualityCell value={s.clickThroughRate} metric="ctr" />
                </td>
                <td className="px-3 py-3 text-right">
                  <QualityCell value={s.saveRate} metric="favouriteRate" />
                </td>
                <td className="px-3 py-3 text-right">
                  <QualityCell value={s.addToCartRate} metric="addToCartRate" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-[10px] text-[#4f4a52]/30">
        ● Active in production.&nbsp;&nbsp;○ Reserved.&nbsp;&nbsp;CTR / Save / Cart pending EP23.5 analytics integration.
        Thresholds: CTR ≥{formatRate(QUALITY_THRESHOLDS.ctr.healthy)} Healthy · Save ≥{formatRate(QUALITY_THRESHOLDS.favouriteRate.healthy)} · Cart ≥{formatRate(QUALITY_THRESHOLDS.addToCartRate.healthy)}.
        Quality bands defined in RecommendationQuality.ts.
      </p>
    </section>
  );
}

// ── 4 · SignalIntelligenceSection ─────────────────────────────────────────────

function SignalIntelligenceSection({ report }: { report: SignalCalibrationReport }) {
  return (
    <section className="space-y-10">

      {/* Health summary chips */}
      <div>
        <SectionLabel>Signal Intelligence</SectionLabel>
        <SectionHeading>Signal Architecture Health</SectionHeading>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {(
            [
              ["Active sources",       `${report.activeSources.length} / ${report.sourceHealth.length}`, "text-emerald-600"],
              ["Unused sources",       `${report.unusedSources.length} / ${report.sourceHealth.length}`, "text-amber-500"],
              ["Active types",         `${report.activeTypes.length} / ${report.typeHealth.length}`,     "text-emerald-600"],
              ["Dead types",           `${report.deadTypes.length} / ${report.typeHealth.length}`,       "text-[#d89ca4]"],
              ["signals[] consumed",   report.signalsArrayConsumed ? "Yes" : "No",                       report.signalsArrayConsumed ? "text-emerald-600" : "text-amber-500"],
              ["Confidence weight",    report.confidenceWeightUsed ? "Applied" : "Not applied",          report.confidenceWeightUsed ? "text-emerald-600" : "text-amber-500"],
            ] as [string, string, string][]
          ).map(([label, value, color]) => (
            <div key={label} className="rounded-xl bg-white px-4 py-3 shadow-sm">
              <p className="text-[10px] text-[#4f4a52]/40">{label}</p>
              <p className={`mt-1 text-sm font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Source health table */}
      <div>
        <SectionLabel>Signal Sources</SectionLabel>
        <SectionHeading>Source Health by Status</SectionHeading>
        <div className="mt-6 space-y-2">
          {report.sourceHealth.map((e) => (
            <div key={e.source} className="rounded-xl bg-white px-5 py-4 shadow-sm">
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-semibold uppercase tracking-wider ${STATUS_COLOR[e.status] ?? ""}`}>
                  {e.status}
                </span>
                <span className="font-mono text-sm font-bold text-[#4f4a52]">{e.source}</span>
                <div className="flex gap-2">
                  {e.usedInScoring && (
                    <span className="text-[10px] text-emerald-600">scoring ✓</span>
                  )}
                  {e.usedInReasons && (
                    <span className="text-[10px] text-emerald-600">reasons ✓</span>
                  )}
                </div>
              </div>
              <p className="mt-1 text-[10px] text-[#4f4a52]/50">{e.scoringPath}</p>
              <p className="mt-0.5 text-[10px] text-[#4f4a52]/40">{e.description}</p>
              {e.enabledReasonTypes.length > 0 && (
                <p className="mt-1.5 text-[10px] text-[#4f4a52]/40">
                  Reasons:{" "}
                  <span className="font-mono text-[#4f4a52]/60">
                    {e.enabledReasonTypes.join(", ")}
                  </span>
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Dead signal types */}
      <div>
        <SectionLabel>Dead Signal Types</SectionLabel>
        <SectionHeading>{report.deadTypes.length} Types With No Scoring Path</SectionHeading>
        <p className="mt-3 max-w-xl text-sm text-[#4f4a52]/50">
          These types are defined and captured but produce no effect on recommendation scoring or reasons.
        </p>
        <div className="mt-6 space-y-2">
          {report.typeHealth
            .filter((e) => e.status === "dead")
            .map((e) => (
              <div key={e.type} className="rounded-xl bg-white px-5 py-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#d89ca4]">
                    Dead
                  </span>
                  <span className="font-mono text-sm font-bold text-[#4f4a52]">{e.type}</span>
                </div>
                <p className="mt-1 text-[10px] text-[#4f4a52]/50">{e.description}</p>
              </div>
            ))}
        </div>
      </div>

      {/* Architecture gaps */}
      <div>
        <SectionLabel>Architecture Gaps</SectionLabel>
        <SectionHeading>Observed Gaps in Signal Consumption</SectionHeading>
        <div className="mt-6 space-y-3">
          <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-5">
            <p className="text-sm font-bold text-[#4f4a52]">profile.signals[] not consumed by PreferenceScorer</p>
            <p className="mt-2 text-xs leading-5 text-[#4f4a52]/60">
              UnifiedCustomerProfile.signals[] is populated by the LearningEngine and
              persisted to storage. PreferenceScorer.buildPreferenceProfile() reads
              only savedSlugs, lastQuizSlugs, and recentlyViewed. The structured signal
              objects — with confidence grades, timestamps, and source attribution — are
              not consumed by the recommendation scorer.
            </p>
          </div>
          <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-5">
            <p className="text-sm font-bold text-[#4f4a52]">CONFIDENCE_WEIGHT defined but not applied</p>
            <p className="mt-2 text-xs leading-5 text-[#4f4a52]/60">
              CONFIDENCE_WEIGHT = {"{"}HIGH: 1.0, MEDIUM: 0.6, LOW: 0.3{"}"} is defined in
              SignalConfidence.ts. buildPreferenceProfile() does not import or apply these
              weights. All contributing slugs receive equal weight regardless of signal
              confidence tier.
            </p>
          </div>
        </div>
      </div>

    </section>
  );
}

// ── 5 · ExperimentStatusSection ───────────────────────────────────────────────

function ExperimentStatusSection({ status }: { status: ExperimentStatusSummary }) {
  return (
    <section>
      <SectionLabel>Experiment Status</SectionLabel>
      <SectionHeading>Active Experiments</SectionHeading>
      <p className="mt-3 max-w-xl text-sm text-[#4f4a52]/50">
        Deterministic bucketing by deviceId → sessionId → accountId. Assignment is
        stable per (experimentId, subjectId) pair.
      </p>
      <div className="mt-6 space-y-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="space-y-3">
            {(
              [
                ["Framework",          status.frameworkImplemented ? "Implemented" : "Pending EP24.1",           status.frameworkImplemented ? "text-emerald-600" : "text-amber-500"],
                ["Mode",               status.baselineMode ? "Baseline — no active experiments" : "Experiment active", status.baselineMode ? "text-[#4f4a52]/60" : "text-emerald-600"],
                ["Active experiments", status.activeExperiments.length === 0 ? "None" : status.activeExperiments.join(", "), "text-[#4f4a52]"],
                ["Variant support",    "control / variant_a / variant_b",                                        "text-[#4f4a52]/60"],
                ["Subject ID scheme",  "deviceId ?? sessionId ?? accountId ?? anonymous",                        "text-[#4f4a52]/60"],
              ] as [string, string, string][]
            ).map(([k, v, color]) => (
              <div key={k} className="flex items-center justify-between">
                <span className="text-xs text-[#4f4a52]/40">{k}</span>
                <span className={`text-xs font-semibold ${color}`}>{v}</span>
              </div>
            ))}
          </div>
        </div>
        {status.baselineMode && (
          <p className="text-[10px] text-[#4f4a52]/30">
            Baseline mode: all customers receive control-equivalent recommendations. No
            variant differentiation is active.
          </p>
        )}
      </div>
    </section>
  );
}

// ── 6 · CalibrationStatusSection ─────────────────────────────────────────────

function CalibrationStatusSection({ status }: { status: CalibrationStatusSummary }) {
  const dimensionHeaders = ["Profile", "Catalog", "Relation", "Discovery"];

  return (
    <section>
      <SectionLabel>Calibration Status</SectionLabel>
      <SectionHeading>Active Scoring Calibration</SectionHeading>
      <p className="mt-3 max-w-xl text-sm text-[#4f4a52]/50">
        Dimension weights per strategy currently hardcoded in WeightedRecommendationScorer.ts.
        EP24.2 will make these configuration-driven.
      </p>
      <div className="mt-6 space-y-4">

        {/* Status card */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="space-y-3">
            {(
              [
                ["Framework",      status.frameworkImplemented ? "Implemented" : "Pending EP24.2", status.frameworkImplemented ? "text-emerald-600" : "text-amber-500"],
                ["Active profile", status.activeCalibrationId,  "text-[#4f4a52]"],
                ["Registered",     `${status.registeredCount} profile${status.registeredCount !== 1 ? "s" : ""}`, "text-[#4f4a52]"],
              ] as [string, string, string][]
            ).map(([k, v, color]) => (
              <div key={k} className="flex items-center justify-between">
                <span className="text-xs text-[#4f4a52]/40">{k}</span>
                <span className={`text-xs font-semibold ${color}`}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Strategy weights table */}
        <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
          <table className="w-full min-w-[480px] text-[11px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-4 py-3 text-left font-semibold text-[#4f4a52]/40">Strategy</th>
                {dimensionHeaders.map((h) => (
                  <th key={h} className="px-3 py-3 text-right font-semibold text-[#4f4a52]/40">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {STRATEGY_ORDER.map((s) => {
                const w = status.strategyWeights[s];
                if (!w) return null;
                return (
                  <tr key={s} className="border-b border-gray-50 last:border-0">
                    <td className="px-4 py-3 font-mono font-semibold text-[#4f4a52]">{s}</td>
                    <td className="px-3 py-3 text-right tabular-nums text-[#4f4a52]">{fmtPct(w.profile)}</td>
                    <td className="px-3 py-3 text-right tabular-nums text-[#4f4a52]">{fmtPct(w.catalog)}</td>
                    <td className="px-3 py-3 text-right tabular-nums text-[#4f4a52]">{fmtPct(w.relation)}</td>
                    <td className="px-3 py-3 text-right tabular-nums text-[#4f4a52]">{fmtPct(w.discovery)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Catalog sub-weights */}
        <div className="rounded-xl bg-white px-5 py-4 shadow-sm">
          <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-[#4f4a52]/40">Catalogue Sub-weights</p>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 sm:grid-cols-3">
            {(
              [
                ["Best seller",   "+0.40"],
                ["Featured",      "+0.25"],
                ["Quality rich",  "+0.25"],
                ["Quality std",   "+0.15"],
                ["Quality min",   "+0.05"],
                ["New arrival",   "+0.10"],
              ] as [string, string][]
            ).map(([k, v]) => (
              <div key={k} className="flex items-center justify-between">
                <span className="text-[10px] text-[#4f4a52]/40">{k}</span>
                <span className="font-mono text-[10px] font-semibold text-[#4f4a52]">{v}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

// ── 7 · EngineeringObservationsSection ───────────────────────────────────────

function EngineeringObservationsSection({ report }: { report: SignalCalibrationReport }) {
  const observations = [
    { text: `${report.deadTypes.length} signal types are captured but produce no scoring or reason effect`, source: "Signal Intelligence" },
    { text: "profile.signals[] is populated by the LearningEngine but not consumed by PreferenceScorer", source: "Signal Intelligence" },
    { text: "CONFIDENCE_WEIGHT (HIGH=1.0, MEDIUM=0.6, LOW=0.3) is defined but not applied in PreferenceScorer", source: "Signal Intelligence" },
    { text: "cart and search signals are captured into signals[] but have no scoring path", source: "Signal Intelligence" },
    { text: "trending strategy is reserved — not active in production", source: "Strategy Performance" },
    { text: "concierge, purchase, and discovery sources have no signal emission path", source: "Signal Intelligence" },
    { text: "Engagement metrics (CTR, save rate, add-to-cart rate) pending EP23.5 analytics integration", source: "Strategy Performance" },
    { text: "Experiment framework pending EP24.1 implementation", source: "Experiment Status" },
    { text: "Calibration framework pending EP24.2 implementation — scoring weights currently hardcoded", source: "Calibration Status" },
  ];

  return (
    <section>
      <SectionLabel>Engineering Observations</SectionLabel>
      <SectionHeading>Aggregated Findings</SectionHeading>
      <p className="mt-3 max-w-xl text-sm text-[#4f4a52]/50">
        Informational observations derived from current codebase state. These describe
        the architecture accurately — they are not errors, warnings, or action items.
      </p>
      <div className="mt-6 space-y-2">
        {observations.map((obs, i) => (
          <div key={i} className="flex items-start gap-4 rounded-xl bg-white px-5 py-4 shadow-sm">
            <span className="mt-0.5 shrink-0 text-[11px] font-black text-[#4f4a52]/20">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-[#4f4a52]">{obs.text}</p>
              <p className="mt-0.5 text-[10px] text-[#4f4a52]/30">{obs.source}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Lifecycle stage helpers ───────────────────────────────────────────────────

const STAGE_LABEL: Record<ExperimentLifecycleStage, string> = {
  draft:      "Draft",
  active:     "Active",
  evaluating: "Evaluating",
  ready:      "Ready",
  promoted:   "Promoted",
  archived:   "Archived",
};

const STAGE_COLOR: Record<ExperimentLifecycleStage, string> = {
  draft:      "bg-[#4f4a52]/10 text-[#4f4a52]/50",
  active:     "bg-emerald-50 text-emerald-700",
  evaluating: "bg-amber-50 text-amber-700",
  ready:      "bg-emerald-50 text-emerald-700",
  promoted:   "bg-[#d89ca4]/20 text-[#4f4a52]",
  archived:   "bg-[#4f4a52]/10 text-[#4f4a52]/30",
};

const ACTION_COLOR: Record<string, string> = {
  await_framework:     "text-amber-500",
  continue_evaluating: "text-[#4f4a52]/60",
  promote:             "text-emerald-600",
  archive:             "text-[#4f4a52]/40",
};

// ── 8 · CurrentBaselineSection ────────────────────────────────────────────────

function CurrentBaselineSection({ baseline }: { baseline: CurrentBaseline }) {
  return (
    <section>
      <SectionLabel>Current Baseline</SectionLabel>
      <SectionHeading>Recommendation Production Baseline</SectionHeading>
      <p className="mt-3 max-w-xl text-sm text-[#4f4a52]/50">
        The current production state of the recommendation engine. Any experiment
        variant is measured relative to this baseline.
      </p>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {(
          [
            ["Calibration profile", baseline.calibrationId,                        "text-[#4f4a52]"],
            ["Experiment mode",     baseline.experimentMode === "baseline" ? "Baseline" : "Active", baseline.experimentMode === "baseline" ? "text-[#4f4a52]/60" : "text-emerald-600"],
            ["Active strategies",   `${baseline.activeStrategyCount} / ${baseline.strategyCount}`,  "text-emerald-600"],
            ["Avg score (active)",  fmtScore(baseline.avgScoreAcrossActive),        "text-[#4f4a52]"],
            ["Signal sources",      `${baseline.signalSourcesActive} / ${baseline.signalSourcesTotal}`, "text-[#4f4a52]"],
            ["Engagement data",     "Pending EP23.5",                               "text-[#4f4a52]/30"],
          ] as [string, string, string][]
        ).map(([label, value, color]) => (
          <div key={label} className="rounded-xl bg-white px-4 py-3 shadow-sm">
            <p className="text-[10px] text-[#4f4a52]/40">{label}</p>
            <p className={`mt-1 text-sm font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── 9 · PromotionReadinessSection ─────────────────────────────────────────────

function PromotionReadinessSection({ decision }: { decision: PromotionDecision }) {
  const { readiness, recommendation, rationale, followUpWork } = decision;

  return (
    <section className="space-y-10">

      {/* Stage + recommendation */}
      <div>
        <SectionLabel>Promotion Readiness</SectionLabel>
        <SectionHeading>Experiment Lifecycle</SectionHeading>
        <p className="mt-3 max-w-xl text-sm text-[#4f4a52]/50">
          Evidence-backed readiness assessment. Promotion decisions are informational
          only — no variants are activated or promoted automatically.
        </p>
        <div className="mt-6 space-y-3">

          {/* Stage chip + experiment id */}
          <div className="flex items-center gap-3">
            <span className={`rounded-lg px-3 py-1 text-xs font-bold uppercase tracking-wider ${STAGE_COLOR[readiness.stage]}`}>
              {STAGE_LABEL[readiness.stage]}
            </span>
            <span className="font-mono text-xs text-[#4f4a52]/40">
              experiment: {decision.experimentId}
            </span>
            <span className="font-mono text-xs text-[#4f4a52]/40">
              calibration: {decision.calibrationId}
            </span>
          </div>

          {/* Rationale */}
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#4f4a52]/40">Rationale</p>
            <p className="mt-2 text-sm leading-6 text-[#4f4a52]">{rationale}</p>
          </div>

          {/* Recommendation */}
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#4f4a52]/40">Recommendation</p>
              <span className={`text-[10px] font-semibold uppercase tracking-wider ${ACTION_COLOR[recommendation.action] ?? ""}`}>
                {recommendation.action.replace(/_/g, " ")}
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-[#4f4a52]">{recommendation.summary}</p>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-[10px] text-[#4f4a52]/30">Confidence:</span>
              <span className="text-[10px] font-semibold text-[#4f4a52]/60">{recommendation.confidence}</span>
            </div>
          </div>

        </div>
      </div>

      {/* Criteria table */}
      <div>
        <SectionLabel>Promotion Criteria</SectionLabel>
        <SectionHeading>Readiness Evaluation</SectionHeading>
        <p className="mt-3 max-w-xl text-sm text-[#4f4a52]/50">
          Each criterion evaluated against current repository state.
        </p>
        <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-sm">
          <table className="w-full min-w-[520px] text-[11px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-4 py-3 text-left font-semibold text-[#4f4a52]/40">Criterion</th>
                <th className="px-3 py-3 text-right font-semibold text-[#4f4a52]/40">Observed</th>
                <th className="px-3 py-3 text-right font-semibold text-[#4f4a52]/40">Required</th>
                <th className="px-3 py-3 text-right font-semibold text-[#4f4a52]/40">Source</th>
                <th className="px-3 py-3 text-right font-semibold text-[#4f4a52]/40">Met</th>
              </tr>
            </thead>
            <tbody>
              {readiness.criteria.map((c) => (
                <tr key={c.criterion} className="border-b border-gray-50 last:border-0">
                  <td className="px-4 py-3 font-semibold text-[#4f4a52]">{c.criterion}</td>
                  <td className="px-3 py-3 text-right tabular-nums text-[#4f4a52]/70">{c.value}</td>
                  <td className="px-3 py-3 text-right text-[#4f4a52]/40">{c.required}</td>
                  <td className="px-3 py-3 text-right text-[#4f4a52]/30">{c.source}</td>
                  <td className="px-3 py-3 text-right">
                    <span className={`font-bold ${c.met ? "text-emerald-600" : "text-[#d89ca4]"}`}>
                      {c.met ? "✓" : "✗"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {readiness.blockers.length > 0 && (
          <div className="mt-3 space-y-1">
            {readiness.blockers.map((b, i) => (
              <p key={i} className="text-[10px] text-[#d89ca4]">
                ✗ {b}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Observations */}
      <div>
        <SectionLabel>Evidence</SectionLabel>
        <SectionHeading>Supporting Observations</SectionHeading>
        <div className="mt-6 space-y-2">
          {readiness.observations.map((obs, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl bg-white px-5 py-3 shadow-sm">
              <span className="mt-0.5 shrink-0 text-[10px] text-[#4f4a52]/30">{i + 1}</span>
              <p className="text-xs text-[#4f4a52]">{obs}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Follow-up work */}
      {followUpWork.length > 0 && (
        <div>
          <SectionLabel>Required Work</SectionLabel>
          <SectionHeading>Before Promotion Is Possible</SectionHeading>
          <div className="mt-6 space-y-2">
            {followUpWork.map((item, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl bg-white px-5 py-4 shadow-sm">
                <span className="mt-0.5 shrink-0 text-[11px] font-black text-[#d89ca4]">{i + 1}</span>
                <p className="text-sm text-[#4f4a52]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </section>
  );
}

// ── 10 · PromotionHistorySection ──────────────────────────────────────────────

function PromotionHistorySection() {
  return (
    <section>
      <SectionLabel>Promotion History</SectionLabel>
      <SectionHeading>Experiment Promotion Record</SectionHeading>
      <p className="mt-3 max-w-xl text-sm text-[#4f4a52]/50">
        A chronological record of every experiment that entered the promotion
        pipeline. Populated when EP24.1 is implemented and experiments begin
        moving through the lifecycle.
      </p>
      <div className="mt-6 rounded-2xl bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold text-[#4f4a52]/40">No promotions recorded</p>
        <p className="mt-1 text-[10px] text-[#4f4a52]/25">
          History will appear here once experiments are active and evaluated.
        </p>
      </div>
    </section>
  );
}

// ── IntelligenceDashboard ─────────────────────────────────────────────────────

export default function IntelligenceDashboard({ data }: { data: IntelligenceData }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f8f7f5]">

      {/* Header */}
      <header className="flex items-center justify-between bg-[#4f4a52] px-6 py-4 print:hidden">
        <div className="flex items-center gap-6">
          <div>
            <p className="text-[9px] uppercase tracking-[0.5em] text-[#d89ca4]">Internal</p>
            <p className="text-sm font-black uppercase tracking-widest text-white">Maison Operations</p>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/admin" className="text-xs text-white/60 transition hover:text-white">
              Operations
            </Link>
            <Link href="/admin/briefing" className="text-xs text-white/60 transition hover:text-white">
              Briefing
            </Link>
            <span className="text-xs font-bold text-white">Intelligence</span>
            <Link href="/admin/recommendation-performance" className="text-xs text-white/60 transition hover:text-white">
              Performance
            </Link>
            <Link href="/admin/customer-intelligence" className="text-xs text-white/60 transition hover:text-white">
              Customer Intelligence
            </Link>
            <Link href="/admin/commerce-intelligence" className="text-xs text-white/60 transition hover:text-white">
              Commerce Intelligence
            </Link>
            <Link href="/admin/executive-operations" className="text-xs text-white/60 transition hover:text-white">
              Executive Operations
            </Link>
            <Link href="/admin/operations" className="text-xs text-white/60 transition hover:text-white">
              Unified Operations
            </Link>
            <Link href="/admin/alerts" className="text-xs text-white/60 transition hover:text-white">
              Alerts
            </Link>
            <Link href="/admin/alert-center" className="text-xs text-white/60 transition hover:text-white">
              Alert Center
            </Link>
            <Link href="/admin/executive-digest" className="text-xs text-white/60 transition hover:text-white">
              Executive Digest
            </Link>
            <Link href="/admin/executive-briefing" className="text-xs text-white/60 transition hover:text-white">
              Executive Briefing
            </Link>
            <Link href="/admin/executive-report" className="text-xs text-white/60 transition hover:text-white">
              Executive Report
            </Link>
            <Link href="/admin/executive-report-center" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Center
            </Link>
            <Link href="/admin/executive-report-archive" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Archive
            </Link>
            <Link href="/admin/executive-report-archive-center" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Archive Center
            </Link>
            <Link href="/admin/executive-report-history" className="text-xs text-white/60 transition hover:text-white">
              Executive Report History
            </Link>
            <Link href="/admin/executive-report-history-center" className="text-xs text-white/60 transition hover:text-white">
              Executive Report History Center
            </Link>
            <Link href="/admin/executive-report-comparison" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Comparison
            </Link>
            <Link href="/admin/executive-report-comparison-center" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Comparison Center
            </Link>
            <Link href="/admin/executive-report-delta" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Delta
            </Link>
            <Link href="/admin/executive-report-delta-center" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Delta Center
            </Link>
            <Link href="/admin/executive-report-insight" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Insight
            </Link>
            <Link href="/admin/executive-report-insight-center" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Insight Center
            </Link>
            <Link href="/admin/executive-report-trend" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Trend
            </Link>
            <Link href="/admin/executive-report-trend-center" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Trend Center
            </Link>
            <Link href="/admin/executive-report-forecast" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Forecast
            </Link>
            <Link href="/admin/executive-report-forecast-center" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Forecast Center
            </Link>
            <Link href="/admin/executive-report-outlook" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Outlook
            </Link>
            <Link href="/admin/executive-report-outlook-center" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Outlook Center
            </Link>
            <Link href="/admin/executive-report-strategy" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Strategy
            </Link>
            <Link href="/admin/executive-report-strategy-center" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Strategy Center
            </Link>
            <Link href="/admin/executive-report-action" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Action
            </Link>
            <Link href="/admin/executive-report-action-center" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Action Center
            </Link>
            <Link href="/admin/executive-report-decision" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Decision
            </Link>
            <Link href="/admin/executive-report-decision-center" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Decision Center
            </Link>
            <Link href="/admin/executive-report-approval" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Approval
            </Link>
            <Link href="/admin/executive-report-approval-center" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Approval Center
            </Link>
            <Link href="/admin/executive-report-execution" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Execution
            </Link>
            <Link href="/admin/executive-report-execution-center" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Execution Center
            </Link>
            <Link href="/admin/executive-report-completion" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Completion
            </Link>
            <Link href="/admin/executive-report-completion-center" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Completion Center
            </Link>
            <Link href="/admin/executive-report-publication" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Publication
            </Link>
            <Link href="/admin/executive-report-publication-center" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Publication Center
            </Link>
            <Link href="/admin/executive-report-distribution" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Distribution
            </Link>
            <Link href="/admin/executive-report-distribution-center" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Distribution Center
            </Link>
            <Link href="/admin/executive-report-delivery" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Delivery
            </Link>
            <Link href="/admin/executive-report-delivery-center" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Delivery Center
            </Link>
            <Link href="/admin/executive-report-acknowledgement" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Acknowledgement
            </Link>
            <Link href="/admin/executive-report-acknowledgement-center" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Acknowledgement Center
            </Link>
            <Link href="/admin/executive-report-receipt" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Receipt
            </Link>
            <Link href="/admin/executive-report-receipt-center" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Receipt Center
            </Link>
            <Link href="/admin/executive-report-confirmation" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Confirmation
            </Link>
            <Link href="/admin/executive-report-confirmation-center" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Confirmation Center
            </Link>
            <Link href="/admin/executive-report-validation" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Validation
            </Link>
            <Link href="/admin/executive-report-validation-center" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Validation Center
            </Link>
            <Link href="/admin/executive-report-certification" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Certification
            </Link>
            <Link href="/admin/executive-report-certification-center" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Certification Center
            </Link>
            <Link href="/admin/executive-report-authorization" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Authorization
            </Link>
            <Link href="/admin/executive-report-authorization-center" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Authorization Center
            </Link>
            <Link href="/admin/executive-report-authentication" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Authentication
            </Link>
            <Link href="/admin/executive-report-authentication-center" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Authentication Center
            </Link>
            <Link href="/admin/executive-report-ratification" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Ratification
            </Link>
            <Link href="/admin/executive-report-ratification-center" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Ratification Center
            </Link>
            <Link href="/admin/executive-report-endorsement" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Endorsement
            </Link>
            <Link href="/admin/executive-report-endorsement-center" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Endorsement Center
            </Link>
            <Link href="/admin/executive-report-acceptance" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Acceptance
            </Link>
            <Link href="/admin/executive-report-acceptance-center" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Acceptance Center
            </Link>
            <Link href="/admin/executive-report-adoption" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Adoption
            </Link>
            <Link href="/admin/executive-report-adoption-center" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Adoption Center
            </Link>
            <Link href="/admin/executive-report-commitment" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Commitment
            </Link>
          </nav>
        </div>
        <form action={logoutAction}>
          <button type="submit" className="text-xs text-white/60 transition hover:text-white">
            Sign Out
          </button>
        </form>
      </header>

      {/* Content */}
      <div className="mx-auto w-full max-w-[780px] space-y-14 px-6 py-12">

        <OverviewHealthSection data={data} />
        <hr className="border-gray-200" />

        <RecommendationHealthSection data={data} />
        <hr className="border-gray-200" />

        <StrategyPerformanceSection snapshot={data.performanceSnapshot} />
        <hr className="border-gray-200" />

        <SignalIntelligenceSection report={data.signalCalibration} />
        <hr className="border-gray-200" />

        <ExperimentStatusSection status={data.experimentStatus} />
        <hr className="border-gray-200" />

        <CalibrationStatusSection status={data.calibrationStatus} />
        <hr className="border-gray-200" />

        <EngineeringObservationsSection report={data.signalCalibration} />
        <hr className="border-gray-200" />

        <CurrentBaselineSection baseline={data.currentBaseline} />
        <hr className="border-gray-200" />

        <PromotionReadinessSection decision={data.promotionDecision} />
        <hr className="border-gray-200" />

        <PromotionHistorySection />

      </div>
    </div>
  );
}
