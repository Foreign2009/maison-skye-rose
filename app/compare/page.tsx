import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getKnowledgeInsights } from "../lib/intelligence";
import { getSimilarFragrances } from "../lib/discovery/similarityEngine";
import { deriveSimilarityReasons } from "../lib/concierge/similarityReasons";
import { getCollectionsForFragrance } from "../lib/discovery/collectionEngine";
import { generateWhyYoullLikeIt } from "../lib/mkc/merchandising";
import ComparisonView from "../components/ComparisonView";
import type {
  FragranceComparisonDTO,
  ComparisonDimensions,
} from "../components/ComparisonView";

export const metadata: Metadata = {
  title: "Compare Fragrances | Maison Skye & Rose",
  robots: { index: false, follow: false },
};

interface ComparePageProps {
  searchParams: Promise<{ a?: string; b?: string }>;
}

function ErrorState({ message }: { message: string }) {
  return (
    <main className="min-h-screen bg-[#f5f1eb]">
      <Navbar />
      <section className="px-4 md:px-6 pt-28 pb-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-2xl font-black text-[#4f4a52]">{message}</p>
          <a
            href="/shop"
            className="mt-8 inline-block rounded-2xl bg-[#d89ca4] px-6 py-3 font-bold text-white transition hover:opacity-90"
          >
            Browse Fragrances
          </a>
        </div>
      </section>
      <Footer />
    </main>
  );
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const { a, b } = await searchParams;

  if (!a || !b) {
    return <ErrorState message="Select two fragrances to compare." />;
  }
  if (a === b) {
    return <ErrorState message="Please select two different fragrances to compare." />;
  }

  const insightsA = getKnowledgeInsights(a);
  const insightsB = getKnowledgeInsights(b);

  if (!insightsA) {
    return <ErrorState message={`Fragrance "${a}" could not be found.`} />;
  }
  if (!insightsB) {
    return <ErrorState message={`Fragrance "${b}" could not be found.`} />;
  }

  const recA = insightsA.record;
  const recB = insightsB.record;

  // ── Similarity reasons ──────────────────────────────────────────────────────
  // Full similarity run guarantees B appears in results (93 total − 1 = 92 candidates)
  const allSimilar     = getSimilarFragrances(recA, { count: 93 });
  const resultForB     = allSimilar.find((r) => r.fragrance.slug === recB.slug);
  const similarityResult = resultForB ?? {
    fragrance:  recB,
    totalScore: 0,
    breakdown:  { family: 0, notes: 0, season: 0, occasion: 0, character: 0, projection: 0, collection: 0, popularity: 0 },
  };
  const reasons = deriveSimilarityReasons(recA, similarityResult);

  // ── Notes comparison ────────────────────────────────────────────────────────
  const flatNotesA = new Set([...recA.notes.top, ...recA.notes.heart, ...recA.notes.base]);
  const flatNotesB = new Set([...recB.notes.top, ...recB.notes.heart, ...recB.notes.base]);
  const sharedNotes  = [...flatNotesA].filter((n) => flatNotesB.has(n));
  const uniqueNotesA = [...flatNotesA].filter((n) => !flatNotesB.has(n));
  const uniqueNotesB = [...flatNotesB].filter((n) => !flatNotesA.has(n));

  // ── Occasions comparison ────────────────────────────────────────────────────
  const occSetB = new Set(recB.occasions);
  const occSetA = new Set(recA.occasions);
  const sharedOccasions  = recA.occasions.filter((o) => occSetB.has(o));
  const uniqueOccasionsA = recA.occasions.filter((o) => !occSetB.has(o));
  const uniqueOccasionsB = recB.occasions.filter((o) => !occSetA.has(o));

  // ── Seasons comparison ──────────────────────────────────────────────────────
  const seaSetB = new Set(recB.seasons);
  const seaSetA = new Set(recA.seasons);
  const sharedSeasons  = recA.seasons.filter((s) => seaSetB.has(s));
  const uniqueSeasonsA = recA.seasons.filter((s) => !seaSetB.has(s));
  const uniqueSeasonsB = recB.seasons.filter((s) => !seaSetA.has(s));

  // ── Collections comparison ──────────────────────────────────────────────────
  const colsA    = getCollectionsForFragrance(recA).map((c) => ({ id: c.id, name: c.name, icon: c.icon }));
  const colsB    = getCollectionsForFragrance(recB).map((c) => ({ id: c.id, name: c.name, icon: c.icon }));
  const colBIds  = new Set(colsB.map((c) => c.id));
  const colAIds  = new Set(colsA.map((c) => c.id));
  const sharedCollections  = colsA.filter((c) =>  colBIds.has(c.id));
  const uniqueCollectionsA = colsA.filter((c) => !colBIds.has(c.id));
  const uniqueCollectionsB = colsB.filter((c) => !colAIds.has(c.id));

  // ── Graph relationship ──────────────────────────────────────────────────────
  // Labels sourced from discoveryIntelligence.ts pathway copy — not new prose.
  const relA = insightsA.relationships;
  const relB = insightsB.relationships;
  const slugA = recA.slug;
  const slugB = recB.slug;

  type RelEntry = { label: string; type: string } | null;
  let graphRelationship: RelEntry = null;

  if      (relA.evolutionOf?.slug === slugB || relB.evolutionOf?.slug === slugA)
    graphRelationship = { label: "The origin of this fragrance line",    type: "origin"           };
  else if (relA.evolutions.some((e) => e.slug === slugB) || relB.evolutions.some((e) => e.slug === slugA))
    graphRelationship = { label: "A more intense interpretation",         type: "evolution"        };
  else if (relA.alternatives.some((e) => e.slug === slugB) || relB.alternatives.some((e) => e.slug === slugA))
    graphRelationship = { label: "A different expression of this style",  type: "alternative"      };
  else if (relA.wardrobePartners.some((e) => e.slug === slugB) || relB.wardrobePartners.some((e) => e.slug === slugA))
    graphRelationship = { label: "Often worn alongside",                  type: "wardrobe-partner" };

  // ── Serializable DTOs ───────────────────────────────────────────────────────

  const fragranceA: FragranceComparisonDTO = {
    slug:        recA.slug,
    name:        recA.name,
    subtitle:    recA.subtitle ?? null,
    mood:        recA.mood,
    profile:     recA.profile,
    freshness:   recA.freshness,
    warmth:      recA.warmth,
    sweetness:   recA.sweetness,
    intensity:   recA.intensity,
    versatility: recA.versatility,
    notes:       [...recA.notes.top, ...recA.notes.heart, ...recA.notes.base],
  };

  const fragranceB: FragranceComparisonDTO = {
    slug:        recB.slug,
    name:        recB.name,
    subtitle:    recB.subtitle ?? null,
    mood:        recB.mood,
    profile:     recB.profile,
    freshness:   recB.freshness,
    warmth:      recB.warmth,
    sweetness:   recB.sweetness,
    intensity:   recB.intensity,
    versatility: recB.versatility,
    notes:       [...recB.notes.top, ...recB.notes.heart, ...recB.notes.base],
  };

  const dimensions: ComparisonDimensions = {
    notes:      { shared: sharedNotes,      uniqueA: uniqueNotesA,      uniqueB: uniqueNotesB      },
    occasions:  { shared: sharedOccasions,  uniqueA: uniqueOccasionsA,  uniqueB: uniqueOccasionsB  },
    seasons:    { shared: sharedSeasons,    uniqueA: uniqueSeasonsA,    uniqueB: uniqueSeasonsB     },
    projection: { a: recA.projection, b: recB.projection, same: recA.projection === recB.projection },
    character:  { a: recA.scentCharacter, b: recB.scentCharacter, same: recA.scentCharacter === recB.scentCharacter },
    collections: { shared: sharedCollections, uniqueA: uniqueCollectionsA, uniqueB: uniqueCollectionsB },
    graphRelationship,
    commercial: {
      prices: {
        "5ml":  { a: recA.prices["5ml"],  b: recB.prices["5ml"]  },
        "10ml": { a: recA.prices["10ml"], b: recB.prices["10ml"] },
        "30ml": { a: recA.prices["30ml"], b: recB.prices["30ml"] },
      },
      whyYoullLikeIt: {
        a: generateWhyYoullLikeIt(recA),
        b: generateWhyYoullLikeIt(recB),
      },
      collection: { a: recA.collection, b: recB.collection },
      popularity:  { a: recA.popularity, b: recB.popularity },
    },
  };

  return (
    <main className="min-h-screen bg-[#f5f1eb]">
      <Navbar />
      <ComparisonView
        fragranceA={fragranceA}
        fragranceB={fragranceB}
        reasons={reasons}
        dimensions={dimensions}
      />
      <Footer />
    </main>
  );
}
