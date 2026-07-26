"use client";

import React, { useState } from "react";
import Link                 from "next/link";
import { logoutAction }     from "./actions";
import {
  QUALITY_THRESHOLDS,
  QUALITY_BAND_COLORS,
  QUALITY_BAND_DESCRIPTIONS,
  computeCoverage,
  formatRate,
  type QualityBand,
  type QualityMetricKey,
} from "@/app/lib/customer/recommendations/RecommendationQuality";
import {
  listExperiments,
  listActiveExperiments,
} from "@/app/lib/customer/recommendations/RecommendationExperiments";
import {
  listBenchmarks,
  type BenchmarkComparison,
  type BenchmarkReadinessState,
  type BenchmarkVerdict,
} from "@/app/lib/customer/recommendations/RecommendationBenchmark";
import {
  evaluateOptimisationReadiness,
  type OptimisationReadinessLevel,
  type OptimisationDimensionStatus,
} from "@/app/lib/customer/recommendations/RecommendationOptimisationReadiness";
import type {
  RecommendationInsightReport,
  StrategyInsight,
  OpportunityAlert,
  OperationalRecommendation,
  InsightStatus,
  AlertSeverity,
  GuidancePriority,
  HealthStatus,
} from "@/app/lib/customer/recommendations/RecommendationInsights";

// ── UI helpers ────────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] uppercase tracking-[0.4em] text-[#d89ca4]">
      {children}
    </p>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-1 text-xl font-black uppercase tracking-tight text-[#4f4a52]">
      {children}
    </h2>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-gray-100 bg-white p-5 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  }

  return (
    <button
      onClick={handleCopy}
      className="rounded-lg bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white transition hover:bg-white/20"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

// ── Data ──────────────────────────────────────────────────────────────────────

const KPI_FRAMEWORK = [
  { kpi: "Impressions (EI)",      event: "experience_intelligence_shown",     field: "renderSource",           note: "One per EI recommendation set render" },
  { kpi: "Impressions (SE)",      event: "recommendation_set_shown",           field: "surface",                note: "One per similarity engine render" },
  { kpi: "Impressions (MiniCart)",event: "cart_recommendations_shown",         field: "renderSource",           note: "Panel-level; breakdown in count fields" },
  { kpi: "Clicks",                event: "product_clicked",                    field: "source",                 note: "Filter where source is a rec surface" },
  { kpi: "CTR",                   event: "Derived",                            field: "clicks ÷ impressions",   note: "Compute in PostHog via HogQL subquery" },
  { kpi: "Favourites",            event: "favourite_toggled",                  field: "source + action = 'add'",note: "Filter where action = 'add'" },
  { kpi: "Favourite Rate",        event: "Derived",                            field: "favourites ÷ impressions",note: "Surface-level join in PostHog" },
  { kpi: "Add to Cart",           event: "add_to_cart",                        field: "recommendationSource",   note: "Set when triggered from rec surface" },
  { kpi: "Add-to-Cart Rate",      event: "Derived",                            field: "adds ÷ impressions",     note: "Surface-level join in PostHog" },
  { kpi: "Checkout Attribution",  event: "recommendation_checkout_attributed", field: "surface",                note: "Fires at checkout if rec session exists" },
] as const;

const ENGINES = [
  {
    name:  "Experience Intelligence",
    abbr:  "EI",
    color: "#d89ca4",
    impressionEvent: "experience_intelligence_shown",
    surfaces: [
      { id: "shop-recommendation",            label: "Shop" },
      { id: "profile-page-recommendation",    label: "Fragrance Profile" },
      { id: "best-sellers-recommendation",    label: "Best Sellers" },
      { id: "new-arrivals-recommendation",    label: "New Arrivals" },
      { id: "favorites-recommendation",       label: "Favourites" },
      { id: "recently-viewed-recommendation", label: "Recently Viewed" },
      { id: "collection-skye-recommendation", label: "Collection — Skye" },
      { id: "collection-rose-recommendation", label: "Collection — Rose" },
      { id: "collection-elite-recommendation",label: "Collection — Elite" },
      { id: "quiz-continuation",              label: "Quiz Results" },
      { id: "character-journey-profile",      label: "Character Journey" },
      { id: "homepage-curated",               label: "Homepage — Curated For You" },
      { id: "discover-intelligence",          label: "Discover Collections" },
      { id: "academy-intelligence",           label: "Academy Articles" },
      { id: "pdp-recommendation",             label: "PDP — Intelligence Panel" },
      { id: "compare-post-decision",          label: "Compare — Post Decision" },
    ],
  },
  {
    name:  "Similarity Engine",
    abbr:  "SE",
    color: "#7b9cc4",
    impressionEvent: "recommendation_set_shown",
    surfaces: [
      { id: "pdp-recommendation", label: "PDP — Why You'll Love It" },
    ],
  },
  {
    name:  "Editorial",
    abbr:  "ED",
    color: "#8fa87a",
    impressionEvent: "— (no impression event; clicks are primary signal)",
    surfaces: [
      { id: "pdp-journey",    label: "PDP — Continue Your Journey" },
      { id: "pdp-collection", label: "PDP — You May Also Like" },
    ],
  },
  {
    name:  "Behavioural MiniCart",
    abbr:  "BM",
    color: "#a07ab4",
    impressionEvent: "cart_recommendations_shown (panel-level aggregate)",
    surfaces: [
      { id: "minicart-favorites",           label: "MiniCart — From Favourites" },
      { id: "minicart-recently-viewed",     label: "MiniCart — Recently Viewed" },
      { id: "minicart-complete-collection", label: "MiniCart — Complete Your Collection" },
    ],
  },
] as const;

type CoverageCell = "✓" | "—" | "✓*";

interface CoverageRow {
  surface:     string;
  engine:      string;
  impression:  CoverageCell;
  click:       CoverageCell;
  favourite:   CoverageCell;
  addToCart:   CoverageCell;
  attribution: CoverageCell;
}

const COVERAGE: CoverageRow[] = [
  // EI surfaces — full lifecycle
  ...([
    "shop-recommendation",
    "profile-page-recommendation",
    "best-sellers-recommendation",
    "new-arrivals-recommendation",
    "favorites-recommendation",
    "recently-viewed-recommendation",
    "collection-skye-recommendation",
    "collection-rose-recommendation",
    "collection-elite-recommendation",
    "quiz-continuation",
    "character-journey-profile",
    "homepage-curated",
    "discover-intelligence",
    "academy-intelligence",
    "pdp-recommendation (EI)",
    "compare-post-decision",
  ] as const).map((surface) => ({
    surface,
    engine:      "EI",
    impression:  "✓" as CoverageCell,
    click:       "✓" as CoverageCell,
    favourite:   "✓" as CoverageCell,
    addToCart:   "✓" as CoverageCell,
    attribution: "✓" as CoverageCell,
  })),
  // Similarity Engine
  {
    surface:     "pdp-recommendation (SE)",
    engine:      "SE",
    impression:  "✓",
    click:       "✓",
    favourite:   "—",
    addToCart:   "—",
    attribution: "—",
  },
  // Editorial — click only
  {
    surface:     "pdp-journey",
    engine:      "ED",
    impression:  "—",
    click:       "✓",
    favourite:   "—",
    addToCart:   "—",
    attribution: "—",
  },
  {
    surface:     "pdp-collection",
    engine:      "ED",
    impression:  "—",
    click:       "✓",
    favourite:   "—",
    addToCart:   "—",
    attribution: "—",
  },
  // Behavioural MiniCart — impression is panel-level
  {
    surface:     "minicart-favorites",
    engine:      "BM",
    impression:  "✓*",
    click:       "—",
    favourite:   "—",
    addToCart:   "✓",
    attribution: "✓",
  },
  {
    surface:     "minicart-recently-viewed",
    engine:      "BM",
    impression:  "✓*",
    click:       "—",
    favourite:   "—",
    addToCart:   "✓",
    attribution: "✓",
  },
  {
    surface:     "minicart-complete-collection",
    engine:      "BM",
    impression:  "✓*",
    click:       "—",
    favourite:   "—",
    addToCart:   "✓",
    attribution: "✓",
  },
];

const QUERIES = [
  {
    title: "EI Impressions by Surface — 30 days",
    sql:
`SELECT
  properties.renderSource                            AS surface,
  count()                                            AS impressions,
  avg(toInt64OrNull(properties.recommendationCount)) AS avg_recs_shown,
  properties.strategy                                AS strategy,
  properties.profileType                             AS profile_type
FROM events
WHERE event = 'experience_intelligence_shown'
  AND timestamp >= now() - interval 30 day
GROUP BY surface, strategy, profile_type
ORDER BY impressions DESC`,
  },
  {
    title: "Similarity Engine Impressions — 30 days",
    sql:
`SELECT
  properties.surface                       AS surface,
  count()                                  AS impressions,
  avg(toInt64OrNull(properties.count))     AS avg_recs_shown
FROM events
WHERE event = 'recommendation_set_shown'
  AND timestamp >= now() - interval 30 day
GROUP BY surface
ORDER BY impressions DESC`,
  },
  {
    title: "Recommendation Clicks by Surface — 30 days",
    sql:
`SELECT
  properties.source                        AS surface,
  count()                                  AS clicks,
  avg(toFloat64OrNull(properties.rank))    AS avg_rank_clicked
FROM events
WHERE event = 'product_clicked'
  AND properties.source IN (
    'pdp-recommendation',
    'academy-intelligence',
    'discover-intelligence',
    'shop-recommendation',
    'profile-page-recommendation',
    'best-sellers-recommendation',
    'new-arrivals-recommendation',
    'favorites-recommendation',
    'recently-viewed-recommendation',
    'collection-skye-recommendation',
    'collection-rose-recommendation',
    'collection-elite-recommendation',
    'quiz-continuation',
    'character-journey-profile',
    'homepage-curated',
    'compare-post-decision',
    'pdp-journey',
    'pdp-collection'
  )
  AND timestamp >= now() - interval 30 day
GROUP BY surface
ORDER BY clicks DESC`,
  },
  {
    title: "Add-to-Cart by Recommendation Source — 30 days",
    sql:
`SELECT
  properties.recommendationSource          AS surface,
  count()                                  AS adds
FROM events
WHERE event = 'add_to_cart'
  AND isNotNull(properties.recommendationSource)
  AND timestamp >= now() - interval 30 day
GROUP BY surface
ORDER BY adds DESC`,
  },
  {
    title: "Favourites Added by Surface — 30 days",
    sql:
`SELECT
  properties.source                        AS surface,
  countIf(properties.action = 'add')       AS favourites_added,
  countIf(properties.action = 'remove')    AS favourites_removed
FROM events
WHERE event = 'favourite_toggled'
  AND isNotNull(properties.source)
  AND timestamp >= now() - interval 30 day
GROUP BY surface
ORDER BY favourites_added DESC`,
  },
  {
    title: "Checkout Attribution by Surface — 30 days",
    sql:
`SELECT
  properties.surface                                      AS surface,
  count()                                                 AS checkout_attributions,
  avg(toFloat64OrNull(properties.ageMs)) / 1000.0        AS avg_age_seconds,
  avg(toFloat64OrNull(properties.ageMs)) / 60000.0       AS avg_age_minutes
FROM events
WHERE event = 'recommendation_checkout_attributed'
  AND timestamp >= now() - interval 30 day
GROUP BY surface
ORDER BY checkout_attributions DESC`,
  },
  {
    title: "MiniCart Panel Impressions — 30 days",
    sql:
`SELECT
  count()                                                      AS panel_opens,
  avg(toInt64OrNull(properties.fromFavoritesCount))            AS avg_from_favorites,
  avg(toInt64OrNull(properties.recentlyViewedCount))           AS avg_recently_viewed,
  avg(toInt64OrNull(properties.completeYourCollectionCount))   AS avg_collection,
  avg(toInt64OrNull(properties.totalCount))                    AS avg_total
FROM events
WHERE event = 'cart_recommendations_shown'
  AND timestamp >= now() - interval 30 day`,
  },
  {
    title: "EI Strategy Distribution — 30 days",
    sql:
`SELECT
  properties.strategy                                AS strategy,
  properties.profileType                             AS profile_type,
  count()                                            AS impressions,
  avg(toInt64OrNull(properties.recommendationCount)) AS avg_recs
FROM events
WHERE event = 'experience_intelligence_shown'
  AND timestamp >= now() - interval 30 day
GROUP BY strategy, profile_type
ORDER BY impressions DESC`,
  },
] as const;

const EVENT_SCHEMAS = [
  {
    event: "experience_intelligence_shown",
    fields: [
      { name: "experience",          type: "string",   values: "academy | discover | quiz-continuation | shop | …" },
      { name: "strategy",            type: "string",   values: "personalised | discovery | trending | similar | complementary" },
      { name: "profileType",         type: "string",   values: "personalised | seeded | discovery" },
      { name: "seeded",              type: "boolean",  values: "true | false" },
      { name: "recommendationCount", type: "number",   values: "1–12" },
      { name: "slugs",               type: "string[]", values: "rendered product slugs (join key)" },
      { name: "renderSource",        type: "string",   values: "AnalyticsSource — EI surface identifier" },
      { name: "processingTimeMs",    type: "number?",  values: "RE processing duration in ms" },
    ],
  },
  {
    event: "recommendation_set_shown",
    fields: [
      { name: "strategy",        type: "string",   values: "similar" },
      { name: "surface",         type: "string",   values: "pdp-recommendation" },
      { name: "count",           type: "number",   values: "1–8" },
      { name: "slugs",           type: "string[]", values: "rendered product slugs (join key)" },
      { name: "isPersonalised",  type: "boolean",  values: "false" },
      { name: "processingTimeMs",type: "number?",  values: "processing duration in ms" },
    ],
  },
  {
    event: "product_clicked",
    fields: [
      { name: "title",  type: "string",  values: "product name" },
      { name: "slug",   type: "string?", values: "product slug" },
      { name: "source", type: "string?", values: "AnalyticsSource — recommendation surface" },
      { name: "rank",   type: "number?", values: "position in rendered set (1-indexed)" },
    ],
  },
  {
    event: "add_to_cart",
    fields: [
      { name: "title",               type: "string",  values: "product name" },
      { name: "size",                type: "string",  values: "5ml | 10ml | 30ml" },
      { name: "price",               type: "number",  values: "retail price in ZAR" },
      { name: "source",              type: "string?", values: "pdp | quick-add | buy-now | minicart" },
      { name: "recommendationSource",type: "string?", values: "AnalyticsSource — set when rec-driven" },
    ],
  },
  {
    event: "favourite_toggled",
    fields: [
      { name: "title",  type: "string",  values: "product name" },
      { name: "slug",   type: "string?", values: "product slug" },
      { name: "source", type: "string?", values: "AnalyticsSource — surface where heart was clicked" },
      { name: "action", type: "string",  values: "add | remove" },
    ],
  },
  {
    event: "recommendation_checkout_attributed",
    fields: [
      { name: "surface", type: "string",  values: "recommendation surface" },
      { name: "slug",    type: "string?", values: "last interacted product slug" },
      { name: "ageMs",   type: "number?", values: "ms elapsed between rec interaction and checkout" },
    ],
  },
  {
    event: "cart_recommendations_shown",
    fields: [
      { name: "fromFavoritesCount",          type: "number", values: "recs sourced from favourites" },
      { name: "recentlyViewedCount",         type: "number", values: "recs from recently viewed" },
      { name: "completeYourCollectionCount", type: "number", values: "recs for collection completion" },
      { name: "totalCount",                  type: "number", values: "total recommendations shown" },
      { name: "renderSource",                type: "string", values: "minicart" },
    ],
  },
] as const;

// ── Experiment Registry Section ───────────────────────────────────────────────

const LIFECYCLE_COLORS: Record<string, string> = {
  draft:      "bg-gray-100 text-gray-600",
  active:     "bg-green-50 text-green-700",
  evaluating: "bg-blue-50 text-blue-700",
  ready:      "bg-purple-50 text-purple-700",
  promoted:   "bg-emerald-50 text-emerald-700",
  archived:   "bg-amber-50 text-amber-700",
};

function ExperimentRegistrySection() {
  const experiments = listExperiments();
  const activeCount = experiments.filter((e) => e.status === "active").length;
  const draftCount  = experiments.filter((e) => e.status === "draft").length;

  return (
    <section>
      <SectionLabel>Experiment Registry</SectionLabel>
      <SectionHeading>Registered Experiments</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        Canonical registry of recommendation experiments. Experiments in{" "}
        <span className="font-semibold text-[#4f4a52]">draft</span> status are metadata only —
        no traffic routing is active. An experiment affects recommendation behaviour only when
        status is <span className="font-semibold text-[#4f4a52]">active</span> and routing
        is implemented at the call site.
      </p>

      {/* Summary chips */}
      <div className="mb-5 flex flex-wrap gap-3">
        <div className="rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
          <p className="text-[10px] text-[#a09aa6]">Total registered</p>
          <p className="mt-0.5 text-lg font-black text-[#4f4a52]">{experiments.length}</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
          <p className="text-[10px] text-[#a09aa6]">Active</p>
          <p className={`mt-0.5 text-lg font-black ${activeCount > 0 ? "text-green-600" : "text-[#a09aa6]"}`}>
            {activeCount}
          </p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
          <p className="text-[10px] text-[#a09aa6]">Draft</p>
          <p className="mt-0.5 text-lg font-black text-[#4f4a52]">{draftCount}</p>
        </div>
      </div>

      {/* Experiment cards */}
      <div className="space-y-4">
        {experiments.map((exp) => (
          <Card key={exp.id}>
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <code className="text-[10px] font-mono text-[#a09aa6]">{exp.id}</code>
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${LIFECYCLE_COLORS[exp.status] ?? "bg-gray-100 text-gray-600"}`}
                  >
                    {exp.status}
                  </span>
                </div>
                <p className="font-black uppercase tracking-tight text-[#4f4a52]">
                  {exp.displayName}
                </p>
                <p className="mt-1 text-xs text-[#7b7480] leading-relaxed max-w-lg">
                  {exp.description}
                </p>
              </div>
              <div className="shrink-0 text-right text-[11px] text-[#a09aa6] space-y-0.5">
                <p>Created {exp.createdDate}</p>
                <p>Owner: {exp.owner}</p>
              </div>
            </div>

            {/* Strategy comparison */}
            <div className="mb-4 flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-widest text-[#a09aa6] mb-1">Baseline</p>
                <code className="text-sm font-bold text-[#4f4a52]">{exp.baselineStrategy}</code>
              </div>
              <span className="text-[#d89ca4] font-bold">→</span>
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-widest text-[#a09aa6] mb-1">Candidate</p>
                <code className="text-sm font-bold text-[#4f4a52]">{exp.candidateStrategy}</code>
              </div>
            </div>

            {/* Hypothesis */}
            <div className="mb-4">
              <p className="text-[10px] uppercase tracking-widest text-[#a09aa6] mb-1">Hypothesis</p>
              <p className="text-xs text-[#7b7480] leading-relaxed">{exp.hypothesis}</p>
            </div>

            {/* Success criteria */}
            <div className="mb-4">
              <p className="text-[10px] uppercase tracking-widest text-[#a09aa6] mb-2">
                Success Criteria
              </p>
              <div className="space-y-2">
                {exp.successCriteria.map((c, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white px-3 py-2"
                  >
                    <span
                      className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold"
                      style={{
                        color:           QUALITY_BAND_COLORS[c.targetBand],
                        backgroundColor: QUALITY_BAND_COLORS[c.targetBand] + "15",
                        borderColor:     QUALITY_BAND_COLORS[c.targetBand] + "33",
                        border:          "1px solid",
                      }}
                    >
                      {c.targetBand}
                    </span>
                    <span className="font-mono text-[11px] text-[#7b7480]">
                      {QUALITY_THRESHOLDS[c.metric].label}
                    </span>
                    <span className="font-mono text-[11px] font-bold text-[#4f4a52]">
                      ≥ {formatRate(c.threshold)}
                    </span>
                    <span className="text-[11px] text-[#a09aa6]">{c.description}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Target surfaces */}
            <div className="mb-3">
              <p className="text-[10px] uppercase tracking-widest text-[#a09aa6] mb-2">
                Target Surfaces
              </p>
              <div className="flex flex-wrap gap-2">
                {exp.targetSurfaces.map((s) => (
                  <code
                    key={s}
                    className="rounded-lg bg-gray-50 px-3 py-1 text-[11px] font-mono text-[#7b7480]"
                  >
                    {s}
                  </code>
                ))}
              </div>
            </div>

            {/* Notes */}
            {exp.notes && (
              <p className="text-[11px] text-[#a09aa6] leading-relaxed border-t border-gray-50 pt-3">
                {exp.notes}
              </p>
            )}
          </Card>
        ))}
      </div>

      {experiments.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-10 text-center">
          <p className="text-sm text-[#a09aa6]">No experiments registered yet.</p>
          <p className="mt-1 text-xs text-[#a09aa6]">
            Add entries to EXPERIMENT_REGISTRY in RecommendationExperiments.ts.
          </p>
        </div>
      )}
    </section>
  );
}

// ── Quality Framework Section ─────────────────────────────────────────────────

const ORDERED_METRICS: QualityMetricKey[] = [
  "ctr",
  "favouriteRate",
  "addToCartRate",
  "checkoutAttributionRate",
  "coverage",
];

const BANDS: QualityBand[] = ["Excellent", "Healthy", "Needs Attention", "Critical"];

function QualityFrameworkSection() {
  const coverage = computeCoverage();

  return (
    <section>
      <SectionLabel>Quality Framework</SectionLabel>
      <SectionHeading>KPI Thresholds &amp; Classification</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        Centralized quality bands and thresholds for every recommendation KPI.
        All dashboards and future optimisation work reference this single source.
        Coverage is computed from the codebase — all other KPIs require PostHog data.
      </p>

      {/* Quality band legend */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {BANDS.map((band) => (
          <div
            key={band}
            className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
          >
            <div
              className="mb-2 h-1.5 w-8 rounded-full"
              style={{ backgroundColor: QUALITY_BAND_COLORS[band] }}
            />
            <p className="text-xs font-bold text-[#4f4a52]">{band}</p>
            <p className="mt-1 text-[11px] text-[#a09aa6] leading-snug">
              {QUALITY_BAND_DESCRIPTIONS[band]}
            </p>
          </div>
        ))}
      </div>

      {/* Threshold table */}
      <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/60">
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[#7b7480]">KPI</th>
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[#7b7480]">Formula</th>
              <th className="px-3 py-3 text-center text-[10px] font-bold uppercase tracking-widest" style={{ color: QUALITY_BAND_COLORS["Excellent"] }}>Excellent</th>
              <th className="px-3 py-3 text-center text-[10px] font-bold uppercase tracking-widest" style={{ color: QUALITY_BAND_COLORS["Healthy"] }}>Healthy</th>
              <th className="px-3 py-3 text-center text-[10px] font-bold uppercase tracking-widest" style={{ color: QUALITY_BAND_COLORS["Needs Attention"] }}>OK</th>
              <th className="px-3 py-3 text-center text-[10px] font-bold uppercase tracking-widest" style={{ color: QUALITY_BAND_COLORS["Critical"] }}>Critical</th>
              <th className="px-3 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-[#7b7480]">Status</th>
            </tr>
          </thead>
          <tbody>
            {ORDERED_METRICS.map((key) => {
              const t      = QUALITY_THRESHOLDS[key];
              const isLive = key === "coverage";
              return (
                <tr key={key} className="border-b border-gray-50 last:border-0">
                  <td className="px-4 py-3 font-semibold text-[#4f4a52]">{t.label}</td>
                  <td className="px-4 py-3 font-mono text-[11px] text-[#7b7480]">{t.formula}</td>
                  <td className="px-3 py-3 text-center font-mono tabular-nums text-[#4f4a52]">≥ {formatRate(t.excellent)}</td>
                  <td className="px-3 py-3 text-center font-mono tabular-nums text-[#4f4a52]">≥ {formatRate(t.healthy)}</td>
                  <td className="px-3 py-3 text-center font-mono tabular-nums text-[#4f4a52]">≥ {formatRate(t.needsAttention)}</td>
                  <td className="px-3 py-3 text-center font-mono tabular-nums text-[#4f4a52]">&lt; {formatRate(t.needsAttention)}</td>
                  <td className="px-3 py-3 text-center">
                    {isLive ? (
                      <span
                        className="rounded-lg border px-2 py-0.5 text-[10px] font-bold"
                        style={{
                          color:           QUALITY_BAND_COLORS[coverage.band as QualityBand],
                          borderColor:     QUALITY_BAND_COLORS[coverage.band as QualityBand] + "33",
                          backgroundColor: QUALITY_BAND_COLORS[coverage.band as QualityBand] + "11",
                        }}
                      >
                        {formatRate(coverage.value ?? 0)} · {coverage.band}
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#a09aa6]">Pending PostHog</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Coverage live result */}
      <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#a09aa6]">Live — computed from codebase</p>
            <p className="mt-1 font-black uppercase tracking-tight text-[#4f4a52]">
              Recommendation Coverage
            </p>
            <p className="mt-1 text-xs text-[#7b7480]">
              {String(coverage.value !== null ? coverage.value * 20 : 0)}/20 instrumented surfaces · {QUALITY_THRESHOLDS.coverage.formula}
            </p>
            <p className="mt-2 text-xs text-[#a09aa6] leading-relaxed max-w-sm">
              {QUALITY_THRESHOLDS.coverage.interpretation}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p
              className="text-3xl font-black tabular-nums"
              style={{ color: QUALITY_BAND_COLORS[coverage.band as QualityBand] }}
            >
              {formatRate(coverage.value ?? 0)}
            </p>
            <p
              className="mt-1 text-xs font-bold uppercase tracking-widest"
              style={{ color: QUALITY_BAND_COLORS[coverage.band as QualityBand] }}
            >
              {coverage.band}
            </p>
          </div>
        </div>
      </div>

      {/* Pending KPIs note */}
      <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50/50 p-4">
        <p className="text-xs font-semibold text-amber-700">
          CTR · Favourite Rate · Add-to-Cart Rate · Checkout Attribution Rate
        </p>
        <p className="mt-1 text-[11px] text-amber-600">
          These KPIs require PostHog data. Run the HogQL queries in the section below, then apply
          the thresholds above to classify each surface. Thresholds are defined once in
          RecommendationQuality.ts and shared across all admin dashboards.
        </p>
      </div>
    </section>
  );
}

// ── Optimisation Readiness ────────────────────────────────────────────────────

const READINESS_LEVEL_STYLES: Record<OptimisationReadinessLevel, string> = {
  "not-ready":                          "bg-red-50    text-red-700    border-red-200",
  "partially-ready":                    "bg-amber-50  text-amber-700  border-amber-200",
  "ready-for-controlled-optimisation":  "bg-blue-50   text-blue-700   border-blue-200",
  "ready-for-production-optimisation":  "bg-green-50  text-green-700  border-green-200",
};

const READINESS_LEVEL_LABELS: Record<OptimisationReadinessLevel, string> = {
  "not-ready":                          "Not Ready",
  "partially-ready":                    "Partially Ready",
  "ready-for-controlled-optimisation":  "Ready for Controlled Optimisation",
  "ready-for-production-optimisation":  "Ready for Production Optimisation",
};

const DIMENSION_STATUS_STYLES: Record<OptimisationDimensionStatus, string> = {
  "complete":          "bg-green-50  text-green-700  border-green-100",
  "partially-ready":   "bg-amber-50  text-amber-700  border-amber-100",
  "pending":           "bg-gray-100  text-gray-500   border-gray-200",
  "not-ready":         "bg-red-50    text-red-700    border-red-100",
};

const DIMENSION_STATUS_LABELS: Record<OptimisationDimensionStatus, string> = {
  "complete":          "Complete",
  "partially-ready":   "Partially Ready",
  "pending":           "Pending",
  "not-ready":         "Not Ready",
};

const CHECK_STATUS_STYLES = {
  pass:    "text-green-500",
  fail:    "text-red-500",
  pending: "text-amber-400",
} as const;

const CHECK_STATUS_SYMBOLS = {
  pass:    "✓",
  fail:    "✕",
  pending: "◌",
} as const;

function OptimisationReadinessSection() {
  const report = evaluateOptimisationReadiness();
  const { overallLevel, overallSummary, dimensions, blockingIssues, completedFoundations, recommendedNextProgram } = report;
  const completeCount = dimensions.filter((d) => d.status === "complete").length;

  return (
    <section>
      <SectionLabel>Certification</SectionLabel>
      <SectionHeading>Optimisation Readiness</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        Repository-derived readiness assessment across all recommendation optimisation dimensions.
        No runtime analytics are queried. All verdicts derive from module exports and repository state.
      </p>

      {/* Overall level */}
      <Card className="mb-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#a09aa6] mb-1">Overall Readiness</p>
            <span
              className={`inline-flex items-center rounded-xl border px-3 py-1.5 text-sm font-bold ${READINESS_LEVEL_STYLES[overallLevel]}`}
            >
              {READINESS_LEVEL_LABELS[overallLevel]}
            </span>
            <p className="mt-3 text-sm text-[#4f4a52] leading-relaxed">{overallSummary}</p>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <span className="rounded-full border border-gray-100 bg-white px-3 py-1 text-[11px] font-semibold text-[#4f4a52] shadow-sm">
              {completeCount}/{dimensions.length} dimensions complete
            </span>
            <span className="rounded-full border border-gray-100 bg-white px-3 py-1 text-[11px] font-semibold text-[#4f4a52] shadow-sm">
              {blockingIssues.length} blocking issue{blockingIssues.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </Card>

      {/* Dimensions table */}
      <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm mb-5">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/60">
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[#7b7480]">Dimension</th>
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[#7b7480]">Status</th>
              <th className="hidden px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[#7b7480] md:table-cell">Summary</th>
              <th className="hidden px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[#7b7480] lg:table-cell">Next Step</th>
            </tr>
          </thead>
          <tbody>
            {dimensions.map((dim) => (
              <tr key={dim.key} className="border-b border-gray-50 last:border-0">
                <td className="px-4 py-3 font-semibold text-[#4f4a52] whitespace-nowrap">{dim.label}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap ${DIMENSION_STATUS_STYLES[dim.status]}`}
                  >
                    {DIMENSION_STATUS_LABELS[dim.status]}
                  </span>
                </td>
                <td className="hidden px-4 py-3 text-xs text-[#7b7480] md:table-cell">{dim.summary}</td>
                <td className="hidden px-4 py-3 text-xs text-[#a09aa6] lg:table-cell">{dim.recommendedNextStep}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mb-5">
        {/* Completed foundations */}
        <Card>
          <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-[#a09aa6]">
            Completed Foundations
          </p>
          <ul className="space-y-1.5">
            {completedFoundations.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-[#4f4a52]">
                <span className="text-green-500 font-bold">✓</span>
                {f}
              </li>
            ))}
          </ul>
        </Card>

        {/* Blocking issues */}
        <Card>
          <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-[#a09aa6]">
            Blocking Issues {blockingIssues.length === 0 && <span className="ml-1 text-green-500">None</span>}
          </p>
          {blockingIssues.length === 0 ? (
            <p className="text-sm text-[#a09aa6]">No blocking issues. All architectural foundations are in place.</p>
          ) : (
            <ul className="space-y-1.5">
              {blockingIssues.map((issue, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[#7b7480]">
                  <span className="mt-px text-red-500 font-bold shrink-0">✕</span>
                  {issue}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* Check detail — collapsed by default to keep the section scannable */}
      <div className="mb-5 space-y-3">
        {dimensions.filter((d) => d.status !== "complete").map((dim) => (
          <Card key={dim.key}>
            <div className="flex items-center justify-between gap-3 mb-3">
              <p className="font-semibold text-[#4f4a52]">{dim.label}</p>
              <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${DIMENSION_STATUS_STYLES[dim.status]}`}>
                {DIMENSION_STATUS_LABELS[dim.status]}
              </span>
            </div>
            <div className="space-y-1.5">
              {dim.checks.map((check) => (
                <div key={check.id} className="flex items-start gap-2.5">
                  <span className={`mt-0.5 text-xs font-bold shrink-0 ${CHECK_STATUS_STYLES[check.status]}`}>
                    {CHECK_STATUS_SYMBOLS[check.status]}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs text-[#4f4a52]">{check.description}</p>
                    <p className="text-[10px] text-[#a09aa6] mt-0.5">{check.evidence}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Recommended next program */}
      <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500 mb-1.5">
          Recommended Next Engineering Program
        </p>
        <p className="text-sm text-[#4f4a52]">{recommendedNextProgram}</p>
      </div>
    </section>
  );
}

// ── Strategy Benchmarks ───────────────────────────────────────────────────────

const READINESS_STYLES: Record<BenchmarkReadinessState, string> = {
  "not-ready":          "bg-gray-100    text-gray-600    border-gray-200",
  "awaiting-analytics": "bg-amber-50   text-amber-700   border-amber-100",
  "ready-to-evaluate":  "bg-blue-50    text-blue-700    border-blue-100",
  "completed":          "bg-green-50   text-green-700   border-green-100",
};

const READINESS_LABELS: Record<BenchmarkReadinessState, string> = {
  "not-ready":          "Not Ready",
  "awaiting-analytics": "Awaiting Analytics",
  "ready-to-evaluate":  "Ready to Evaluate",
  "completed":          "Completed",
};

const VERDICT_STYLES: Record<BenchmarkVerdict, string> = {
  "pending":        "bg-gray-100  text-gray-500",
  "candidate-wins": "bg-green-50  text-green-700",
  "baseline-wins":  "bg-amber-50  text-amber-700",
  "inconclusive":   "bg-purple-50 text-purple-700",
};

const VERDICT_LABELS: Record<BenchmarkVerdict, string> = {
  "pending":        "Pending",
  "candidate-wins": "Candidate Wins",
  "baseline-wins":  "Baseline Wins",
  "inconclusive":   "Inconclusive",
};

function BenchmarkCard({ benchmark }: { benchmark: BenchmarkComparison }) {
  const { readiness, result, kpiComparisons } = benchmark;
  return (
    <Card>
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-black text-[#4f4a52]">{benchmark.displayName}</p>
          <p className="mt-0.5 font-mono text-[11px] text-[#a09aa6]">{benchmark.experimentId}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border bg-gray-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[#7b7480]">
            {benchmark.lifecycleStatus}
          </span>
          <span
            className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${READINESS_STYLES[readiness.state]}`}
          >
            {READINESS_LABELS[readiness.state]}
          </span>
        </div>
      </div>

      {/* Strategy comparison */}
      <div className="mb-4 flex items-center gap-2 text-sm">
        <span className="rounded-lg bg-gray-50 px-2.5 py-1 font-mono text-[11px] text-[#7b7480]">
          {benchmark.baselineStrategy}
        </span>
        <span className="text-[#a09aa6]">→</span>
        <span className="rounded-lg bg-[#f9f0f2] px-2.5 py-1 font-mono text-[11px] text-[#d89ca4]">
          {benchmark.candidateStrategy}
        </span>
        <span className="ml-1 text-xs text-[#a09aa6]">
          on {benchmark.targetSurfaces.join(", ")}
        </span>
      </div>

      {/* Readiness */}
      <div className="mb-4 rounded-xl border border-gray-100 bg-gray-50/60 p-3.5">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[#a09aa6]">Readiness</p>
        <p className="text-sm text-[#4f4a52]">{readiness.reason}</p>
        {readiness.blockers.length > 0 && (
          <ul className="mt-2 space-y-1">
            {readiness.blockers.map((b, i) => (
              <li key={i} className="flex items-start gap-1.5 text-xs text-[#7b7480]">
                <span className="mt-px text-amber-400">▲</span>
                {b}
              </li>
            ))}
          </ul>
        )}
        <p className="mt-2 text-[11px] text-[#a09aa6]">
          <span className="font-semibold">Next step:</span> {readiness.nextStep}
        </p>
      </div>

      {/* Methodology */}
      <p className="mb-4 text-[11px] text-[#a09aa6]">
        <span className="font-semibold text-[#7b7480]">Methodology:</span>{" "}
        {benchmark.methodology}
      </p>

      {/* KPI comparison table */}
      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/60">
              <th className="px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-widest text-[#7b7480]">Metric</th>
              <th className="px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-widest text-[#7b7480]">Target</th>
              <th className="px-3 py-2.5 text-center text-[10px] font-bold uppercase tracking-widest text-[#7b7480]">Baseline</th>
              <th className="px-3 py-2.5 text-center text-[10px] font-bold uppercase tracking-widest text-[#7b7480]">Candidate</th>
              <th className="hidden px-3 py-2.5 text-center text-[10px] font-bold uppercase tracking-widest text-[#7b7480] md:table-cell">Δ</th>
              <th className="px-3 py-2.5 text-center text-[10px] font-bold uppercase tracking-widest text-[#7b7480]">Verdict</th>
            </tr>
          </thead>
          <tbody>
            {kpiComparisons.map((kpi) => (
              <tr key={kpi.metric} className="border-b border-gray-50 last:border-0">
                <td className="px-3 py-2.5">
                  <p className="font-semibold text-[#4f4a52] text-xs">{kpi.label}</p>
                  <p className="text-[10px] text-[#a09aa6]">{kpi.formula}</p>
                </td>
                <td className="px-3 py-2.5">
                  <span className="font-mono text-xs text-[#7b7480]">
                    ≥ {formatRate(kpi.threshold)}
                  </span>
                  <span className="ml-1 text-[10px] text-[#a09aa6]">({kpi.targetBand})</span>
                </td>
                <td className="px-3 py-2.5 text-center font-mono text-xs text-[#a09aa6]">
                  {kpi.baselineValue !== null ? formatRate(kpi.baselineValue) : "—"}
                </td>
                <td className="px-3 py-2.5 text-center font-mono text-xs text-[#a09aa6]">
                  {kpi.candidateValue !== null ? formatRate(kpi.candidateValue) : "—"}
                </td>
                <td className="hidden px-3 py-2.5 text-center font-mono text-xs text-[#a09aa6] md:table-cell">
                  {kpi.delta !== null
                    ? `${kpi.delta >= 0 ? "+" : ""}${formatRate(kpi.delta)}`
                    : "—"}
                </td>
                <td className="px-3 py-2.5 text-center">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${VERDICT_STYLES[kpi.verdict]}`}
                  >
                    {VERDICT_LABELS[kpi.verdict]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Overall result */}
      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-[11px] text-[#a09aa6]">{result.recommendation}</p>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${VERDICT_STYLES[result.overallVerdict]}`}
        >
          {VERDICT_LABELS[result.overallVerdict]}
        </span>
      </div>
    </Card>
  );
}

function StrategyBenchmarkSection() {
  const benchmarks = listBenchmarks();
  const readyCount = benchmarks.filter((b) => b.readiness.state === "ready-to-evaluate").length;

  return (
    <section>
      <SectionLabel>Benchmark Framework</SectionLabel>
      <SectionHeading>Strategy Benchmarks</SectionHeading>
      <p className="mt-2 mb-4 text-sm text-[#7b7480]">
        Each registered experiment defines baseline and candidate strategies with explicit
        success criteria drawn from the Quality Framework. Benchmark results are computed
        from live analytics supplied via PostHog HogQL queries — no values are fabricated.
        When analytics are unavailable the benchmark reports "Pending" for all KPI comparisons.
      </p>

      {/* Summary chips */}
      <div className="mb-5 flex flex-wrap gap-2">
        <span className="rounded-full border border-gray-100 bg-white px-3 py-1 text-[11px] font-semibold text-[#4f4a52] shadow-sm">
          {benchmarks.length} benchmark{benchmarks.length !== 1 ? "s" : ""} registered
        </span>
        <span className="rounded-full border border-gray-100 bg-white px-3 py-1 text-[11px] font-semibold text-[#4f4a52] shadow-sm">
          {readyCount} ready to evaluate
        </span>
        <span className="rounded-full border border-gray-100 bg-white px-3 py-1 text-[11px] font-semibold text-[#4f4a52] shadow-sm">
          Analytics pending · EP23.5
        </span>
      </div>

      <div className="space-y-4">
        {benchmarks.map((b) => (
          <BenchmarkCard key={b.experimentId} benchmark={b} />
        ))}
      </div>
    </section>
  );
}

// ── Strategy Resolution Section ───────────────────────────────────────────────

const RESOLUTION_RULES = [
  { surface: "product (PDP)",                           defaultStrategy: "similar",        note: "Always similar — product context" },
  { surface: "compare",                                 defaultStrategy: "complementary",  note: "Always complementary — wardrobe pairing" },
  { surface: "discover",                                defaultStrategy: "discovery",      note: "Always discovery — exploration context" },
  { surface: "concierge (currentSlug present)",         defaultStrategy: "similar",        note: "Slug provided — similarity context" },
  { surface: "concierge (no slug, with profile)",       defaultStrategy: "personalised",   note: "Profile signals present" },
  { surface: "concierge (no slug, cold-start)",         defaultStrategy: "discovery",      note: "No signals — exploration fallback" },
  { surface: "homepage / shop / collections (profile)", defaultStrategy: "personalised",   note: "Profile signals present" },
  { surface: "homepage / shop / collections (cold)",    defaultStrategy: "discovery",      note: "No signals — exploration fallback" },
  { surface: "minicart-complete-collection",            defaultStrategy: "complementary",  note: "Cart context — wardrobe completion" },
];

function StrategyResolutionSection() {
  const activeExperiments = listActiveExperiments();
  const activeCount = activeExperiments.length;
  const isBaseline  = activeCount === 0;

  return (
    <section>
      <SectionLabel>Experiment Execution</SectionLabel>
      <SectionHeading>Strategy Resolution</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        All production strategy selection passes through{" "}
        <code className="rounded bg-gray-100 px-1 font-mono text-[11px] text-[#4f4a52]">
          resolveRecommendationStrategy()
        </code>.
        The resolver consults the experiment registry on every call and returns the candidate
        strategy when an active experiment overrides the surface&apos;s default. In baseline mode
        (no active experiments) the resolver is transparent — every call returns the default
        strategy unchanged and behaviour is identical to direct assignment.
      </p>

      {/* Status */}
      <div className="mb-5 flex flex-wrap gap-3">
        <div className="rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
          <p className="text-[10px] text-[#a09aa6]">Resolver</p>
          <p className="mt-0.5 text-sm font-black text-green-600">Implemented ✓</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
          <p className="text-[10px] text-[#a09aa6]">Mode</p>
          <p className={`mt-0.5 text-sm font-black ${isBaseline ? "text-[#4f4a52]" : "text-green-600"}`}>
            {isBaseline ? "Baseline" : "Experiment Active"}
          </p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
          <p className="text-[10px] text-[#a09aa6]">Active experiments</p>
          <p className={`mt-0.5 text-sm font-black ${activeCount > 0 ? "text-green-600" : "text-[#a09aa6]"}`}>
            {activeCount}
          </p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
          <p className="text-[10px] text-[#a09aa6]">Production call sites</p>
          <p className="mt-0.5 text-sm font-black text-[#4f4a52]">2</p>
        </div>
      </div>

      {/* Call sites */}
      <Card className="mb-5">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-[#a09aa6]">
          Registered Call Sites
        </p>
        <div className="space-y-2">
          {[
            {
              file: "ExperienceIntelligence.ts",
              fn:   "resolveStrategy()",
              note: "All customer-facing EI surfaces — shop, PDP, discover, homepage, concierge, and more",
            },
            {
              file: "CartRecommendationStrategy.ts",
              fn:   "resolveComplementary()",
              note: "MiniCart — Complete Your Collection (surface: minicart-complete-collection)",
            },
          ].map((site) => (
            <div key={site.file} className="rounded-xl border border-gray-100 bg-gray-50/60 px-4 py-3">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <code className="text-xs font-bold text-[#4f4a52]">{site.file}</code>
                <code className="text-[11px] text-[#d89ca4]">{site.fn}</code>
              </div>
              <p className="text-[11px] text-[#a09aa6]">{site.note}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Default strategy rules */}
      <div className="mb-5 overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/60">
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[#7b7480]">
                Surface / Experience
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[#7b7480]">
                Default Strategy
              </th>
              <th className="hidden px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[#7b7480] md:table-cell">
                Rule
              </th>
            </tr>
          </thead>
          <tbody>
            {RESOLUTION_RULES.map((rule) => (
              <tr key={rule.surface} className="border-b border-gray-50 last:border-0">
                <td className="px-4 py-2.5 font-mono text-[11px] text-[#7b7480]">{rule.surface}</td>
                <td className="px-4 py-2.5">
                  <code className="rounded-lg bg-gray-50 px-2 py-0.5 text-[11px] font-bold text-[#4f4a52]">
                    {rule.defaultStrategy}
                  </code>
                </td>
                <td className="hidden px-4 py-2.5 text-[11px] text-[#a09aa6] md:table-cell">
                  {rule.note}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Activation instructions */}
      <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
        <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-blue-500">
          How to Activate an Experiment
        </p>
        <p className="text-sm text-[#4f4a52]">
          Set <code className="rounded bg-blue-100 px-1 font-mono text-xs">status: &quot;active&quot;</code> on
          a registered experiment in{" "}
          <code className="font-mono text-xs">RecommendationExperiments.ts</code>. The resolver
          automatically routes the experiment&apos;s target surfaces to the candidate strategy on the
          next deploy — no call-site changes are required.
        </p>
      </div>
    </section>
  );
}

// ── Insight Sections ──────────────────────────────────────────────────────────

const HEALTH_STATUS_STYLES: Record<HealthStatus, string> = {
  "excellent":              "bg-green-50  text-green-700  border-green-200",
  "healthy":                "bg-blue-50   text-blue-700   border-blue-200",
  "needs-attention":        "bg-amber-50  text-amber-700  border-amber-200",
  "critical":               "bg-red-50    text-red-700    border-red-200",
  "insufficient-evidence":  "bg-gray-100  text-gray-600   border-gray-200",
};

const HEALTH_STATUS_LABELS: Record<HealthStatus, string> = {
  "excellent":             "Excellent",
  "healthy":               "Healthy",
  "needs-attention":       "Needs Attention",
  "critical":              "Critical",
  "insufficient-evidence": "Awaiting Evidence",
};

const INSIGHT_STATUS_STYLES: Record<InsightStatus, string> = {
  "strongest":             "bg-green-50  text-green-700  border-green-100",
  "healthy":               "bg-blue-50   text-blue-700   border-blue-100",
  "needs-attention":       "bg-amber-50  text-amber-700  border-amber-100",
  "weakest":               "bg-red-50    text-red-700    border-red-100",
  "insufficient-evidence": "bg-gray-100  text-gray-500   border-gray-200",
};

const INSIGHT_STATUS_LABELS: Record<InsightStatus, string> = {
  "strongest":             "Top Performer",
  "healthy":               "Healthy",
  "needs-attention":       "Needs Attention",
  "weakest":               "Lowest Engagement",
  "insufficient-evidence": "Awaiting Data",
};

const SEVERITY_STYLES: Record<AlertSeverity, string> = {
  "high":   "bg-red-50    text-red-700    border-red-100",
  "medium": "bg-amber-50  text-amber-700  border-amber-100",
  "low":    "bg-gray-100  text-gray-600   border-gray-200",
};

const SEVERITY_LABELS: Record<AlertSeverity, string> = {
  "high":   "High",
  "medium": "Medium",
  "low":    "Low",
};

const GUIDANCE_PRIORITY_STYLES: Record<GuidancePriority, string> = {
  "high":   "bg-red-50    text-red-700",
  "medium": "bg-amber-50  text-amber-700",
  "low":    "bg-gray-100  text-gray-500",
};

const BAND_STYLES: Record<string, string> = {
  "Excellent":       "bg-green-50  text-green-700  border-green-100",
  "Healthy":         "bg-blue-50   text-blue-700   border-blue-100",
  "Needs Attention": "bg-amber-50  text-amber-700  border-amber-100",
  "Critical":        "bg-red-50    text-red-700    border-red-100",
  "Pending":         "bg-gray-100  text-gray-500   border-gray-200",
};

function ExecutiveSummarySection({ report }: { report: RecommendationInsightReport }) {
  const { executiveSummary: s, analyticsAvailable, analyticsWindowDays } = report;

  return (
    <section>
      <SectionLabel>Intelligence Summary</SectionLabel>
      <SectionHeading>Executive Summary</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        Derived from live analytics, signal calibration, and benchmark outputs.
        Updated on every page load.
      </p>

      {/* Overall health card */}
      <Card className="mb-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <span
                className={`inline-flex items-center rounded-xl border px-3 py-1.5 text-sm font-bold ${HEALTH_STATUS_STYLES[s.healthStatus]}`}
              >
                {HEALTH_STATUS_LABELS[s.healthStatus]}
              </span>
              {analyticsAvailable && analyticsWindowDays !== null && (
                <span className="rounded-full border border-gray-100 bg-white px-3 py-1 text-[11px] text-[#a09aa6] shadow-sm">
                  {analyticsWindowDays}-day window
                </span>
              )}
            </div>
            <p className="font-black text-[#4f4a52] mb-1">{s.headline}</p>
            <p className="text-sm text-[#7b7480]">{s.summary}</p>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0 text-right">
            <p className="text-[10px] text-[#a09aa6]">Strategies with data</p>
            <p className="text-2xl font-black text-[#4f4a52]">{s.strategiesAnalyzed}</p>
            {s.alertCount > 0 && (
              <>
                <p className="text-[10px] text-[#a09aa6]">Alerts</p>
                <p className="text-2xl font-black text-red-600">{s.alertCount}</p>
              </>
            )}
          </div>
        </div>

        {/* Priority action */}
        <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500 mb-1">
            Priority Action
          </p>
          <p className="text-sm text-[#4f4a52]">{s.priorityAction}</p>
        </div>
      </Card>

      {/* Strengths + Risks */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-green-500">
            Key Strengths
          </p>
          <ul className="space-y-1.5">
            {s.keyStrengths.map((strength, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#4f4a52]">
                <span className="mt-px text-green-500 font-bold shrink-0">✓</span>
                {strength}
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-amber-500">
            Key Risks
          </p>
          {s.keyRisks.length === 0 ? (
            <p className="text-sm text-[#a09aa6]">No risks identified.</p>
          ) : (
            <ul className="space-y-1.5">
              {s.keyRisks.map((risk, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[#7b7480]">
                  <span className="mt-px text-amber-400 font-bold shrink-0">▲</span>
                  {risk}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </section>
  );
}

function InsightsSection({ insights }: { insights: readonly StrategyInsight[] }) {
  const withEvidence = insights.filter((i) => i.evidenceAvailable);
  const pending      = insights.filter((i) => !i.evidenceAvailable);

  return (
    <section>
      <SectionLabel>Strategy Intelligence</SectionLabel>
      <SectionHeading>Strategy Insights</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        Per-strategy performance ranked by click-through rate.
        Strongest and Weakest labels apply only when at least two strategies have analytics data.
      </p>

      {withEvidence.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-10 text-center mb-5">
          <p className="text-sm text-[#a09aa6]">No analytics data available yet.</p>
          <p className="mt-1 text-xs text-[#a09aa6]">
            Configure PostHog environment variables to unlock strategy insights.
          </p>
        </div>
      )}

      {withEvidence.length > 0 && (
        <div className="space-y-3 mb-5">
          {withEvidence.map((insight) => (
            <Card key={insight.strategy}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-black uppercase tracking-tight text-[#4f4a52]">
                      {insight.strategy.charAt(0).toUpperCase() + insight.strategy.slice(1)}
                    </span>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${INSIGHT_STATUS_STYLES[insight.status]}`}
                    >
                      {INSIGHT_STATUS_LABELS[insight.status]}
                    </span>
                  </div>
                  <p className="text-xs text-[#7b7480] leading-relaxed">{insight.detail}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-right">
                    <p className="text-[10px] text-[#a09aa6]">CTR</p>
                    <span className={`rounded-lg border px-2 py-0.5 text-[11px] font-bold ${BAND_STYLES[insight.ctrBand]}`}>
                      {insight.ctrValue !== null
                        ? `${(insight.ctrValue * 100).toFixed(1)}%`
                        : "—"}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-[#a09aa6]">ATC</p>
                    <span className={`rounded-lg border px-2 py-0.5 text-[11px] font-bold ${BAND_STYLES[insight.atcBand]}`}>
                      {insight.atcValue !== null
                        ? `${(insight.atcValue * 100).toFixed(1)}%`
                        : "—"}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {pending.length > 0 && (
        <div className="rounded-2xl border border-gray-100 bg-white p-4">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#a09aa6]">
            Awaiting Analytics ({pending.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {pending.map((i) => (
              <span
                key={i.strategy}
                className="rounded-full border border-gray-200 bg-gray-50 px-3 py-0.5 text-[11px] font-mono text-[#a09aa6]"
              >
                {i.strategy}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function OpportunityDetectionSection({ opportunities }: { opportunities: readonly OpportunityAlert[] }) {
  return (
    <section>
      <SectionLabel>Opportunity Detection</SectionLabel>
      <SectionHeading>Alerts &amp; Opportunities</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        Issues and improvement opportunities derived from quality band classifications
        and benchmark results. High-severity alerts require immediate review.
      </p>

      {opportunities.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-10 text-center">
          <p className="text-sm text-green-600 font-semibold">No alerts detected.</p>
          <p className="mt-1 text-xs text-[#a09aa6]">
            All measured strategies are within acceptable quality bands, or analytics are pending.
          </p>
        </div>
      )}

      {opportunities.length > 0 && (
        <div className="space-y-3">
          {opportunities.map((alert, i) => (
            <Card key={i}>
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${SEVERITY_STYLES[alert.severity]}`}
                  >
                    {SEVERITY_LABELS[alert.severity]}
                  </span>
                  <code className="rounded-lg bg-gray-50 px-2 py-0.5 text-[11px] font-mono text-[#7b7480]">
                    {alert.strategy}
                  </code>
                </div>
              </div>
              <p className="font-bold text-sm text-[#4f4a52] mb-1">{alert.headline}</p>
              <p className="text-xs text-[#7b7480] mb-2">{alert.detail}</p>
              <div className="rounded-xl bg-gray-50 px-3 py-2 mb-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#a09aa6] mb-0.5">Evidence</p>
                <p className="text-xs text-[#7b7480]">{alert.evidence}</p>
              </div>
              <div className="rounded-xl border border-blue-100 bg-blue-50/60 px-3 py-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500 mb-0.5">Guidance</p>
                <p className="text-xs text-[#4f4a52]">{alert.guidance}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}

function OperationalGuidanceSection({ guidance }: { guidance: readonly OperationalRecommendation[] }) {
  return (
    <section>
      <SectionLabel>Operational Intelligence</SectionLabel>
      <SectionHeading>Operational Recommendations</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        Ranked action items derived from analytics availability, signal health, and experiment state.
        High-priority items should be addressed before the next analysis cycle.
      </p>

      {guidance.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-10 text-center">
          <p className="text-sm text-green-600 font-semibold">No operational actions required.</p>
        </div>
      )}

      {guidance.length > 0 && (
        <div className="space-y-3">
          {guidance.map((rec, i) => (
            <Card key={i}>
              <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${GUIDANCE_PRIORITY_STYLES[rec.priority]}`}
                  >
                    {rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)} priority
                  </span>
                  <span className="rounded-lg bg-gray-100 px-2 py-0.5 text-[10px] font-mono text-[#7b7480]">
                    {rec.category}
                  </span>
                </div>
              </div>
              <p className="font-bold text-sm text-[#4f4a52] mb-1">{rec.headline}</p>
              <p className="text-xs text-[#7b7480]">{rec.detail}</p>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  generatedAt:  string;
  insightReport: RecommendationInsightReport;
}

export default function RecommendationPerformanceDashboard({ generatedAt, insightReport }: Props) {
  const ts = new Date(generatedAt).toLocaleString("en-ZA", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="min-h-screen bg-[#f5f1eb]">

      {/* ── Header ── */}
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
            <Link href="/admin/intelligence" className="text-xs text-white/60 transition hover:text-white">
              Intelligence
            </Link>
            <span className="text-xs font-bold text-white">Performance</span>
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
          </nav>
        </div>
        <form action={logoutAction}>
          <button type="submit" className="text-xs text-white/60 transition hover:text-white">
            Sign Out
          </button>
        </form>
      </header>

      {/* ── Content ── */}
      <div className="mx-auto w-full max-w-[780px] space-y-14 px-6 py-12">

        {/* Intro */}
        <section>
          <SectionLabel>Recommendation Analytics</SectionLabel>
          <SectionHeading>Performance Framework</SectionHeading>
          <p className="mt-3 text-sm leading-relaxed text-[#7b7480]">
            Analytics taxonomy, surface coverage matrix, and PostHog HogQL query reference for
            the Maison Skye &amp; Rose recommendation system. Run queries in PostHog Insights → SQL
            to compute live KPIs. No live data is computed here — this dashboard is the permanent
            operational reference.
          </p>
          <p className="mt-1.5 text-[11px] text-[#a09aa6]">Generated {ts}</p>
        </section>

        <hr className="border-gray-200" />

        {/* ── I · Executive Summary ── */}
        <ExecutiveSummarySection report={insightReport} />

        <hr className="border-gray-200" />

        {/* ── II · Strategy Insights ── */}
        <InsightsSection insights={insightReport.insights} />

        <hr className="border-gray-200" />

        {/* ── III · Opportunity Detection ── */}
        <OpportunityDetectionSection opportunities={insightReport.opportunities} />

        <hr className="border-gray-200" />

        {/* ── IV · Operational Guidance ── */}
        <OperationalGuidanceSection guidance={insightReport.guidance} />

        <hr className="border-gray-200" />

        {/* ── 0 · Optimisation Readiness ── */}
        <OptimisationReadinessSection />

        <hr className="border-gray-200" />

        {/* ── 1 · KPI Framework ── */}
        <section>
          <SectionLabel>KPI Framework</SectionLabel>
          <SectionHeading>Metric Definitions</SectionHeading>
          <p className="mt-2 mb-5 text-sm text-[#7b7480]">
            Each metric is anchored to a specific PostHog event and field. Derived metrics
            (CTR, favourite rate, add-to-cart rate) require a surface-level join in HogQL.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[#7b7480]">KPI</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[#7b7480]">Event</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[#7b7480]">Field</th>
                  <th className="hidden px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[#7b7480] md:table-cell">Note</th>
                </tr>
              </thead>
              <tbody>
                {KPI_FRAMEWORK.map((row) => (
                  <tr key={`${row.kpi}-${row.event}`} className="border-b border-gray-50 last:border-0">
                    <td className="px-4 py-3 font-semibold text-[#4f4a52]">{row.kpi}</td>
                    <td className="px-4 py-3 font-mono text-[11px] text-[#7b7480]">{row.event}</td>
                    <td className="px-4 py-3 font-mono text-[11px] text-[#d89ca4]">{row.field}</td>
                    <td className="hidden px-4 py-3 text-xs text-[#a09aa6] md:table-cell">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <hr className="border-gray-200" />

        {/* ── 2 · Quality Framework ── */}
        <QualityFrameworkSection />

        <hr className="border-gray-200" />

        {/* ── 3 · Experiment Registry ── */}
        <ExperimentRegistrySection />

        <hr className="border-gray-200" />

        {/* ── 4 · Strategy Benchmarks ── */}
        <StrategyBenchmarkSection />

        <hr className="border-gray-200" />

        {/* ── 5 · Strategy Resolution ── */}
        <StrategyResolutionSection />

        <hr className="border-gray-200" />

        {/* ── 6 · Engine Breakdown ── */}
        <section>
          <SectionLabel>Engine Breakdown</SectionLabel>
          <SectionHeading>Surfaces by Engine</SectionHeading>
          <p className="mt-2 mb-5 text-sm text-[#7b7480]">
            Four recommendation engines operate across 24 surfaces. Editorial surfaces have no
            impression event — clicks are the primary engagement signal. MiniCart impressions are
            panel-level aggregates, not per-surface.
          </p>
          <div className="space-y-4">
            {ENGINES.map((engine) => (
              <Card key={engine.abbr}>
                <div className="mb-3 flex items-start justify-between gap-4">
                  <div>
                    <p className="font-black uppercase tracking-tight text-[#4f4a52]">{engine.name}</p>
                    <p className="mt-0.5 font-mono text-[11px] text-[#a09aa6]">
                      impression: {engine.impressionEvent}
                    </p>
                  </div>
                  <span
                    className="shrink-0 rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white"
                    style={{ backgroundColor: engine.color }}
                  >
                    {engine.surfaces.length} {engine.surfaces.length === 1 ? "surface" : "surfaces"}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {engine.surfaces.map((s) => (
                    <div key={s.id} className="flex items-center gap-3">
                      <code className="min-w-0 flex-1 truncate rounded-lg bg-gray-50 px-3 py-1.5 font-mono text-[11px] text-[#7b7480]">
                        {s.id}
                      </code>
                      <span className="shrink-0 text-xs text-[#a09aa6]">{s.label}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </section>

        <hr className="border-gray-200" />

        {/* ── 3 · Coverage Matrix ── */}
        <section>
          <SectionLabel>Coverage Matrix</SectionLabel>
          <SectionHeading>Analytics Lifecycle by Surface</SectionHeading>
          <p className="mt-2 mb-5 text-sm text-[#7b7480]">
            Which analytics events fire at each surface across the full recommendation lifecycle.
            Missing impressions on editorial surfaces and MiniCart click gaps are expected.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[#7b7480]">Surface</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[#7b7480]">Engine</th>
                  <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-[#7b7480]">Impression</th>
                  <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-[#7b7480]">Click</th>
                  <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-[#7b7480]">Favourite</th>
                  <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-[#7b7480]">Add-to-Cart</th>
                  <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-[#7b7480]">Attribution</th>
                </tr>
              </thead>
              <tbody>
                {COVERAGE.map((row) => (
                  <tr key={row.surface} className="border-b border-gray-50 last:border-0">
                    <td className="px-4 py-2 font-mono text-[11px] text-[#7b7480]">{row.surface}</td>
                    <td className="px-4 py-2">
                      <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-bold text-[#7b7480]">
                        {row.engine}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-center font-semibold text-green-600">{row.impression}</td>
                    <td className="px-4 py-2 text-center font-semibold text-green-600">{row.click}</td>
                    <td className="px-4 py-2 text-center font-semibold text-green-600">{row.favourite}</td>
                    <td className="px-4 py-2 text-center font-semibold text-green-600">{row.addToCart}</td>
                    <td className="px-4 py-2 text-center font-semibold text-green-600">{row.attribution}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[11px] text-[#a09aa6]">
            ✓ Tracked &nbsp;·&nbsp; ✓* Panel-level aggregate &nbsp;·&nbsp; — Not applicable
          </p>
        </section>

        <hr className="border-gray-200" />

        {/* ── 4 · PostHog Query Reference ── */}
        <section>
          <SectionLabel>PostHog Query Reference</SectionLabel>
          <SectionHeading>HogQL Queries</SectionHeading>
          <p className="mt-2 mb-5 text-sm text-[#7b7480]">
            Open PostHog → Insights → SQL and paste any query below. All queries use a 30-day
            window — change the interval clause to adjust the date range.
          </p>
          <div className="space-y-4">
            {QUERIES.map((q) => (
              <div key={q.title} className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between bg-[#4f4a52] px-4 py-3">
                  <span className="text-xs font-semibold text-white">{q.title}</span>
                  <CopyButton text={q.sql} />
                </div>
                <pre className="overflow-x-auto bg-white p-4 font-mono text-[11px] leading-relaxed text-[#7b7480]">
                  {q.sql}
                </pre>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-gray-200" />

        {/* ── 5 · Schema Reference ── */}
        <section>
          <SectionLabel>Schema Reference</SectionLabel>
          <SectionHeading>Event Schemas</SectionHeading>
          <p className="mt-2 mb-5 text-sm text-[#7b7480]">
            PostHog event properties for all recommendation analytics events. Use these schemas
            when building PostHog Insights, funnels, or dashboards.
          </p>
          <div className="space-y-4">
            {EVENT_SCHEMAS.map((schema) => (
              <Card key={schema.event}>
                <p className="mb-3 font-mono text-sm font-bold text-[#4f4a52]">{schema.event}</p>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="pb-2 text-left font-semibold text-[#7b7480]">Field</th>
                      <th className="pb-2 text-left font-semibold text-[#7b7480]">Type</th>
                      <th className="pb-2 text-left font-semibold text-[#7b7480]">Values</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono">
                    {schema.fields.map((f) => (
                      <tr key={f.name} className="border-b border-gray-50 last:border-0">
                        <td className="py-1.5 text-[#d89ca4]">{f.name}</td>
                        <td className="py-1.5 text-[#a09aa6]">{f.type}</td>
                        <td className="py-1.5 text-[10px] text-[#7b7480]">{f.values}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
