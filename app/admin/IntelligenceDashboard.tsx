import Link         from "next/link";
import { logoutAction } from "./actions";
import type { RecommendationMetrics }    from "@/app/lib/customer/recommendations";
import type { RecommendationConfidence } from "@/app/lib/customer/recommendations";
import type { RecommendationReasonType } from "@/app/lib/customer/recommendations";

// ── Types ─────────────────────────────────────────────────────────────────────

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
}

export interface IntelligenceData {
  generatedAt:         string;
  discoveryMetrics:    RecommendationMetrics;
  personalisedMetrics: RecommendationMetrics;
  syntheticSavedSlugs: readonly string[];
  discoveryRows:       RERow[];
  personalisedRows:    RERow[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtPct(n: number): string {
  return `${(n * 100).toFixed(1)}%`;
}

function fmtScore(n: number): string {
  return n.toFixed(3);
}

function filterRate(filtered: number, pool: number): string {
  return pool === 0 ? "—" : fmtPct(filtered / pool);
}

function yieldRate(returned: number, filtered: number): string {
  return filtered === 0 ? "—" : fmtPct(returned / filtered);
}

const CONFIDENCE_COLOR: Record<string, string> = {
  HIGH:   "text-emerald-600",
  MEDIUM: "text-[#4f4a52]/60",
  LOW:    "text-[#d89ca4]",
};

function reasonLabel(t: RecommendationReasonType | null): string {
  if (!t) return "—";
  return t.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

const STRATEGIES: Array<{
  name:        string;
  description: string;
  callers:     string;
  active:      boolean;
}> = [
  { name: "personalised",  active: true,  description: "Customer signal-weighted scoring against full catalogue pool",   callers: "IntelligenceSection — all major browse surfaces" },
  { name: "discovery",     active: true,  description: "Catalogue-quality ranked discovery for cold-start visitors",     callers: "IntelligenceSection — cold-start fallback" },
  { name: "similar",       active: true,  description: "Relationship-graph fragrances relative to a pivot slug",        callers: "ProductDetail — Continue Your Journey" },
  { name: "complementary", active: true,  description: "Wardrobe partners and alternatives for a pivot slug",           callers: "ProductDetail — Continue Your Journey, MiniCart" },
  { name: "trending",      active: false, description: "Popularity-weighted recommendations (reserved for future use)", callers: "—" },
];

// ── PipelineCard ──────────────────────────────────────────────────────────────

function PipelineCard({ label, metrics }: { label: string; metrics: RecommendationMetrics }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-[#4f4a52]/40">{label}</p>
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
            ["Filter pass rate", filterRate(metrics.filteredSize, metrics.poolSize)],
            ["Yield rate",       yieldRate(metrics.returnedSize, metrics.filteredSize)],
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

// ── IntelligenceDashboard ─────────────────────────────────────────────────────

export default function IntelligenceDashboard({ data }: { data: IntelligenceData }) {
  const generatedLabel = new Date(data.generatedAt).toLocaleTimeString("en-GB", {
    hour: "2-digit", minute: "2-digit",
  });

  return (
    <div className="flex min-h-screen flex-col bg-[#f8f7f5]">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
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
          </nav>
        </div>
        <form action={logoutAction}>
          <button type="submit" className="text-xs text-white/60 transition hover:text-white">
            Sign Out
          </button>
        </form>
      </header>

      {/* ── Content ─────────────────────────────────────────────────────────── */}
      <div className="mx-auto w-full max-w-[780px] space-y-14 px-6 py-12">

        {/* 1 · Intro ────────────────────────────────────────────────────────── */}
        <section>
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#d89ca4]">
            Recommendation Intelligence
          </p>
          <h2 className="mt-2 text-3xl font-black text-[#4f4a52]">RE Observatory</h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-[#4f4a52]/60">
            Diagnostic view of the Recommendation Engine. Data computed on page load
            using synthetic profiles — no customer data is read or stored.
          </p>
          <p className="mt-4 text-xs text-[#4f4a52]/30">Generated at {generatedLabel}.</p>
        </section>

        <hr className="border-gray-200" />

        {/* 2 · Pipeline Health ──────────────────────────────────────────────── */}
        <section>
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#d89ca4]">Pipeline Health</p>
          <h2 className="mt-2 text-xl font-black text-[#4f4a52]">RE Performance by Strategy</h2>
          <p className="mt-3 max-w-xl text-sm text-[#4f4a52]/50">
            Discovery uses a cold-start profile (zero signals). Personalised uses a synthetic
            profile with{" "}
            {data.syntheticSavedSlugs.length > 0
              ? `${data.syntheticSavedSlugs.length} saved fragrance${data.syntheticSavedSlugs.length === 1 ? "" : "s"}`
              : "no saved fragrances"}.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <PipelineCard label="Discovery Strategy"    metrics={data.discoveryMetrics} />
            <PipelineCard label="Personalised Strategy" metrics={data.personalisedMetrics} />
          </div>
        </section>

        <hr className="border-gray-200" />

        {/* 3 · Discovery Score Breakdown ────────────────────────────────────── */}
        <section>
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#d89ca4]">Score Breakdown</p>
          <h2 className="mt-2 text-xl font-black text-[#4f4a52]">
            Discovery — Top {data.discoveryRows.length} Results
          </h2>
          <p className="mt-3 max-w-xl text-sm text-[#4f4a52]/50">
            What the RE returns for a cold-start visitor. Total score is the additive composite
            across four dimensions.
          </p>

          {data.discoveryRows.length === 0 ? (
            <p className="mt-6 text-sm text-[#4f4a52]/40">No results returned.</p>
          ) : (
            <div className="mt-6 space-y-2">
              {data.discoveryRows.map((row) => (
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
                      <p className="text-[10px] text-[#4f4a52]/50">
                        {fmtPct(row.catalogScore)} cat
                      </p>
                      <p className="text-[10px] text-[#4f4a52]/50">
                        {fmtPct(row.discoveryScore)} disc
                      </p>
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
        </section>

        <hr className="border-gray-200" />

        {/* 4 · Personalised Intelligence Trace ──────────────────────────────── */}
        <section>
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#d89ca4]">Intelligence Trace</p>
          <h2 className="mt-2 text-xl font-black text-[#4f4a52]">
            Personalised — Top {data.personalisedRows.length} with Trace
          </h2>
          <p className="mt-3 max-w-xl text-sm text-[#4f4a52]/50">
            Full scoring trace and confidence per recommendation. Confidence reflects profile
            signal depth at recommendation time.
          </p>

          {data.personalisedRows.length === 0 ? (
            <p className="mt-6 text-sm text-[#4f4a52]/40">No results returned.</p>
          ) : (
            <div className="mt-6 space-y-4">
              {data.personalisedRows.map((row) => (
                <div key={row.slug} className="rounded-2xl bg-white p-5 shadow-sm">

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-black text-[#4f4a52]/25">{row.rank}</span>
                      <p className="text-sm font-bold text-[#4f4a52]">{row.name}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span
                        className={`text-[10px] font-semibold uppercase tracking-wider ${CONFIDENCE_COLOR[row.confidence.level] ?? ""}`}
                      >
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
                        ["Profile",     fmtPct(row.profileScore)],
                        ["Catalog",     fmtPct(row.catalogScore)],
                        ["Relation",    fmtPct(row.relationScore)],
                        ["Discovery",   fmtPct(row.discoveryScore)],
                        ["Confidence",  row.confidence.reason],
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
        </section>

        <hr className="border-gray-200" />

        {/* 5 · Strategy Inventory ───────────────────────────────────────────── */}
        <section>
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#d89ca4]">Strategy Inventory</p>
          <h2 className="mt-2 text-xl font-black text-[#4f4a52]">Available RE Strategies</h2>

          <div className="mt-6 space-y-2">
            {STRATEGIES.map((s) => (
              <div key={s.name} className="rounded-xl bg-white px-5 py-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <span
                    className={`shrink-0 text-[10px] font-semibold uppercase tracking-wider ${
                      s.active ? "text-emerald-600" : "text-[#4f4a52]/30"
                    }`}
                  >
                    {s.active ? "Active" : "Reserved"}
                  </span>
                  <span className="font-mono text-sm font-bold text-[#4f4a52]">{s.name}</span>
                </div>
                <p className="mt-1.5 text-xs text-[#4f4a52]/60">{s.description}</p>
                <p className="mt-1 text-[10px] text-[#4f4a52]/40">Callers: {s.callers}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
