"use client";

import Link from "next/link";
import RecommendationCard from "./RecommendationCard";
import { NoteChip } from "./knowledge/NoteChip";
import { KnowledgeChip } from "./knowledge/KnowledgeChip";
import { CollectionBadge } from "./knowledge/CollectionBadge";

// ── DTOs ──────────────────────────────────────────────────────────────────────

export interface FragranceComparisonDTO {
  slug:        string;
  name:        string;
  subtitle:    string | null;
  mood:        string;
  profile:     string;
  freshness:   number;
  warmth:      number;
  sweetness:   number;
  intensity:   number;
  versatility: number;
  notes:       string[];
}

export interface CollectionRef {
  id:   string;
  name: string;
  icon: string;
}

export interface GraphRelationship {
  label: string;
  type:  string;
}

export interface ComparisonDimensions {
  notes: {
    shared:  string[];
    uniqueA: string[];
    uniqueB: string[];
  };
  occasions: {
    shared:  string[];
    uniqueA: string[];
    uniqueB: string[];
  };
  seasons: {
    shared:  string[];
    uniqueA: string[];
    uniqueB: string[];
  };
  projection: {
    a:    string;
    b:    string;
    same: boolean;
  };
  character: {
    a:    string;
    b:    string;
    same: boolean;
  };
  collections: {
    shared:  CollectionRef[];
    uniqueA: CollectionRef[];
    uniqueB: CollectionRef[];
  };
  graphRelationship: GraphRelationship | null;
  commercial: {
    prices: {
      "5ml":  { a: number; b: number };
      "10ml": { a: number; b: number };
      "30ml": { a: number; b: number };
    };
    whyYoullLikeIt: {
      a: [string, string, string];
      b: [string, string, string];
    };
    collection: { a: string; b: string };
    popularity:  { a: number; b: number };
  };
}

// ── Constants ─────────────────────────────────────────────────────────────────

const CHARACTER_SPECTRUM = [
  "Fresh & Light",
  "Balanced Signature",
  "Rich & Long Wearing",
  "Deep & Intense",
] as const;

const PROJECTION_LABELS: Record<string, string> = {
  soft:     "Soft",
  moderate: "Moderate",
  strong:   "Strong",
};

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionCard({
  title,
  children,
}: {
  title:    string;
  children: React.ReactNode;
}) {
  return (
    <section className="px-4 md:px-6 pb-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-3xl bg-white p-6 md:p-10">
          <h2 className="text-2xl font-black text-[#4f4a52]">{title}</h2>
          {children}
        </div>
      </div>
    </section>
  );
}

function SubLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">
      {children}
    </p>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ComparisonView({
  fragranceA,
  fragranceB,
  reasons,
  dimensions,
}: {
  fragranceA:  FragranceComparisonDTO;
  fragranceB:  FragranceComparisonDTO;
  reasons:     string[];
  dimensions:  ComparisonDimensions;
}) {
  const { notes, occasions, seasons, projection, character, collections, graphRelationship, commercial } = dimensions;

  return (
    <>
      {/* ── Header + Summary cards ──────────────────────────────────────────── */}
      <section className="px-4 md:px-6 pt-16 md:pt-28 pb-8">
        <div className="mx-auto max-w-7xl">

          <div className="mb-10 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#d89ca4]">
              Fragrance Comparison
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-[#4f4a52] md:text-4xl">
              {fragranceA.name}{" "}
              <span className="text-[#d89ca4]">vs</span>{" "}
              {fragranceB.name}
            </h1>
            <div className="mt-5 flex items-center justify-center gap-6 text-sm">
              <Link
                href={`/product/${fragranceA.slug}`}
                className="text-zinc-500 hover:text-[#d89ca4] transition-colors"
              >
                ← {fragranceA.name}
              </Link>
              <span className="text-zinc-300">·</span>
              <Link
                href={`/product/${fragranceB.slug}`}
                className="text-zinc-500 hover:text-[#d89ca4] transition-colors"
              >
                {fragranceB.name} →
              </Link>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <RecommendationCard
              slug={fragranceA.slug}
              title={fragranceA.name}
              subtitle={fragranceA.subtitle}
              profile={fragranceA.profile}
              mood={fragranceA.mood}
              notes={fragranceA.notes}
              freshness={fragranceA.freshness}
              warmth={fragranceA.warmth}
              sweetness={fragranceA.sweetness}
              intensity={fragranceA.intensity}
              versatility={fragranceA.versatility}
              reasons={reasons}
            />
            <RecommendationCard
              slug={fragranceB.slug}
              title={fragranceB.name}
              subtitle={fragranceB.subtitle}
              profile={fragranceB.profile}
              mood={fragranceB.mood}
              notes={fragranceB.notes}
              freshness={fragranceB.freshness}
              warmth={fragranceB.warmth}
              sweetness={fragranceB.sweetness}
              intensity={fragranceB.intensity}
              versatility={fragranceB.versatility}
              reasons={reasons}
            />
          </div>

        </div>
      </section>

      {/* ── Section 1: Notes ────────────────────────────────────────────────── */}
      <SectionCard title="Notes Comparison">
        <div className="mt-8 space-y-7">
          {notes.shared.length > 0 && (
            <div>
              <SubLabel>Shared Notes</SubLabel>
              <div className="flex flex-wrap gap-2">
                {notes.shared.map((n) => (
                  <NoteChip key={n} note={n} />
                ))}
              </div>
            </div>
          )}

          {(notes.uniqueA.length > 0 || notes.uniqueB.length > 0) && (
            <div className="grid gap-6 md:grid-cols-2">
              {notes.uniqueA.length > 0 && (
                <div>
                  <SubLabel>Only in {fragranceA.name}</SubLabel>
                  <div className="flex flex-wrap gap-2">
                    {notes.uniqueA.map((n) => (
                      <NoteChip key={n} note={n} />
                    ))}
                  </div>
                </div>
              )}
              {notes.uniqueB.length > 0 && (
                <div>
                  <SubLabel>Only in {fragranceB.name}</SubLabel>
                  <div className="flex flex-wrap gap-2">
                    {notes.uniqueB.map((n) => (
                      <NoteChip key={n} note={n} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </SectionCard>

      {/* ── Section 2: Occasions ────────────────────────────────────────────── */}
      <SectionCard title="Occasions">
        <div className="mt-8 space-y-7">
          {occasions.shared.length > 0 && (
            <div>
              <SubLabel>Shared Occasions</SubLabel>
              <div className="flex flex-wrap gap-2">
                {occasions.shared.map((o) => (
                  <KnowledgeChip key={o} label={o} variant="bordered" />
                ))}
              </div>
            </div>
          )}

          {(occasions.uniqueA.length > 0 || occasions.uniqueB.length > 0) && (
            <div className="grid gap-6 md:grid-cols-2">
              {occasions.uniqueA.length > 0 && (
                <div>
                  <SubLabel>Only {fragranceA.name}</SubLabel>
                  <div className="flex flex-wrap gap-2">
                    {occasions.uniqueA.map((o) => (
                      <KnowledgeChip key={o} label={o} variant="bordered" />
                    ))}
                  </div>
                </div>
              )}
              {occasions.uniqueB.length > 0 && (
                <div>
                  <SubLabel>Only {fragranceB.name}</SubLabel>
                  <div className="flex flex-wrap gap-2">
                    {occasions.uniqueB.map((o) => (
                      <KnowledgeChip key={o} label={o} variant="bordered" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </SectionCard>

      {/* ── Section 3: Seasons ──────────────────────────────────────────────── */}
      <SectionCard title="Seasons">
        <div className="mt-8 space-y-7">
          {seasons.shared.length > 0 && (
            <div>
              <SubLabel>Shared Seasons</SubLabel>
              <div className="flex flex-wrap gap-2">
                {seasons.shared.map((s) => (
                  <KnowledgeChip key={s} label={s} variant="bordered" />
                ))}
              </div>
            </div>
          )}

          {(seasons.uniqueA.length > 0 || seasons.uniqueB.length > 0) && (
            <div className="grid gap-6 md:grid-cols-2">
              {seasons.uniqueA.length > 0 && (
                <div>
                  <SubLabel>Only {fragranceA.name}</SubLabel>
                  <div className="flex flex-wrap gap-2">
                    {seasons.uniqueA.map((s) => (
                      <KnowledgeChip key={s} label={s} variant="bordered" />
                    ))}
                  </div>
                </div>
              )}
              {seasons.uniqueB.length > 0 && (
                <div>
                  <SubLabel>Only {fragranceB.name}</SubLabel>
                  <div className="flex flex-wrap gap-2">
                    {seasons.uniqueB.map((s) => (
                      <KnowledgeChip key={s} label={s} variant="bordered" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </SectionCard>

      {/* ── Section 4: Projection ───────────────────────────────────────────── */}
      <SectionCard title="Projection">
        <div className="mt-6 overflow-hidden rounded-2xl bg-[#f9f7f4]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#ede8e1]">
            <p className="text-sm text-zinc-500 truncate mr-4">{fragranceA.name}</p>
            <p className="text-sm font-bold text-[#4f4a52] shrink-0">
              {PROJECTION_LABELS[projection.a] ?? projection.a}
            </p>
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <p className="text-sm text-zinc-500 truncate mr-4">{fragranceB.name}</p>
            <p className="text-sm font-bold text-[#4f4a52] shrink-0">
              {PROJECTION_LABELS[projection.b] ?? projection.b}
            </p>
          </div>
        </div>
      </SectionCard>

      {/* ── Section 5: Character Position ───────────────────────────────────── */}
      <SectionCard title="Character Position">
        <div className="mt-8 space-y-2">
          {CHARACTER_SPECTRUM.map((level) => {
            const isA = character.a === level;
            const isB = character.b === level;

            return (
              <div
                key={level}
                className={`flex items-center justify-between gap-3 rounded-2xl px-5 py-3.5 ${
                  isA || isB ? "bg-[#f5f1eb]" : ""
                }`}
              >
                <p
                  className={`text-sm flex-1 ${
                    isA || isB
                      ? "font-bold text-[#4f4a52]"
                      : "font-medium text-zinc-400"
                  }`}
                >
                  {level}
                </p>
                <div className="flex shrink-0 gap-2">
                  {isA && (
                    <span className="rounded-full bg-[#d89ca4] px-2.5 py-0.5 text-[10px] font-bold text-white">
                      {fragranceA.name}
                    </span>
                  )}
                  {isB && (
                    <span className="rounded-full bg-[#4f4a52] px-2.5 py-0.5 text-[10px] font-bold text-white">
                      {fragranceB.name}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* ── Section 6: Discovery Collections ────────────────────────────────── */}
      <SectionCard title="Discovery Collections">
        <div className="mt-8 space-y-7">
          {collections.shared.length > 0 && (
            <div>
              <SubLabel>Shared Collections</SubLabel>
              <div className="flex flex-wrap gap-2">
                {collections.shared.map((c) => (
                  <KnowledgeChip
                    key={c.id}
                    label={`${c.icon} ${c.name}`}
                    variant="bordered"
                    href={`/discover/${c.id}`}
                  />
                ))}
              </div>
            </div>
          )}

          {(collections.uniqueA.length > 0 || collections.uniqueB.length > 0) && (
            <div className="grid gap-6 md:grid-cols-2">
              {collections.uniqueA.length > 0 && (
                <div>
                  <SubLabel>Only {fragranceA.name}</SubLabel>
                  <div className="flex flex-wrap gap-2">
                    {collections.uniqueA.map((c) => (
                      <KnowledgeChip
                        key={c.id}
                        label={`${c.icon} ${c.name}`}
                        variant="bordered"
                        href={`/discover/${c.id}`}
                      />
                    ))}
                  </div>
                </div>
              )}
              {collections.uniqueB.length > 0 && (
                <div>
                  <SubLabel>Only {fragranceB.name}</SubLabel>
                  <div className="flex flex-wrap gap-2">
                    {collections.uniqueB.map((c) => (
                      <KnowledgeChip
                        key={c.id}
                        label={`${c.icon} ${c.name}`}
                        variant="bordered"
                        href={`/discover/${c.id}`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </SectionCard>

      {/* ── Section 7: Graph Relationship (conditional) ──────────────────────── */}
      {graphRelationship && (
        <SectionCard title="Fragrance Connection">
          <div className="mt-6">
            <p className="text-base font-semibold text-[#4f4a52]">{graphRelationship.label}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <KnowledgeChip
                label={fragranceA.name}
                variant="bordered"
                href={`/product/${fragranceA.slug}`}
              />
              <KnowledgeChip
                label={fragranceB.name}
                variant="bordered"
                href={`/product/${fragranceB.slug}`}
              />
            </div>
          </div>
        </SectionCard>
      )}

      {/* ── Section 8: Price Comparison ─────────────────────────────────────── */}
      <SectionCard title="Price Comparison">
        <div className="mt-6 overflow-hidden rounded-2xl bg-[#f9f7f4]">
          <div className="grid grid-cols-3 border-b border-[#ede8e1] px-5 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">Size</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400 text-center truncate">{fragranceA.name}</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400 text-center truncate">{fragranceB.name}</p>
          </div>
          {(["5ml", "10ml", "30ml"] as const).map((size, i) => (
            <div
              key={size}
              className={`grid grid-cols-3 px-5 py-4 ${i < 2 ? "border-b border-[#ede8e1]" : ""}`}
            >
              <p className="text-sm font-semibold text-[#4f4a52]">{size}</p>
              <p className="text-sm font-bold text-[#4f4a52] text-center">R{commercial.prices[size].a}</p>
              <p className="text-sm font-bold text-[#4f4a52] text-center">R{commercial.prices[size].b}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* ── Section 9: Why You'll Like Each ─────────────────────────────────── */}
      <SectionCard title="Why You'll Like Each">
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <div>
            <SubLabel>{fragranceA.name}</SubLabel>
            <ul className="space-y-3">
              {commercial.whyYoullLikeIt.a.map((bullet) => (
                <li key={bullet} className="flex items-start gap-2 text-sm text-[#7b7480]">
                  <span className="mt-0.5 shrink-0 text-[#d89ca4]">✓</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SubLabel>{fragranceB.name}</SubLabel>
            <ul className="space-y-3">
              {commercial.whyYoullLikeIt.b.map((bullet) => (
                <li key={bullet} className="flex items-start gap-2 text-sm text-[#7b7480]">
                  <span className="mt-0.5 shrink-0 text-[#4f4a52]">✓</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SectionCard>

      {/* ── Section 10: Collection ───────────────────────────────────────────── */}
      <SectionCard title="Collection">
        <div className="mt-6 overflow-hidden rounded-2xl bg-[#f9f7f4]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#ede8e1]">
            <p className="text-sm text-zinc-500 truncate mr-4">{fragranceA.name}</p>
            <CollectionBadge collection={commercial.collection.a} />
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <p className="text-sm text-zinc-500 truncate mr-4">{fragranceB.name}</p>
            <CollectionBadge collection={commercial.collection.b} />
          </div>
        </div>
      </SectionCard>

      {/* ── Section 11: Popularity ───────────────────────────────────────────── */}
      <SectionCard title="Popularity">
        <div className="mt-6 overflow-hidden rounded-2xl bg-[#f9f7f4]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#ede8e1]">
            <p className="text-sm text-zinc-500 truncate mr-4">{fragranceA.name}</p>
            <p className="text-sm font-bold text-[#4f4a52] shrink-0">{commercial.popularity.a}</p>
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <p className="text-sm text-zinc-500 truncate mr-4">{fragranceB.name}</p>
            <p className="text-sm font-bold text-[#4f4a52] shrink-0">{commercial.popularity.b}</p>
          </div>
        </div>
      </SectionCard>

    </>
  );
}
