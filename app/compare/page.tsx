import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getKnowledgeInsights } from "../lib/intelligence";
import { getSimilarFragrances } from "../lib/discovery/similarityEngine";
import { deriveSimilarityReasons } from "../lib/concierge/similarityReasons";
import ComparisonView from "../components/ComparisonView";
import type { FragranceComparisonDTO } from "../components/ComparisonView";

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

  // Full similarity set ensures B is always present (93 total, excluding A = 92 candidates)
  const allSimilar = getSimilarFragrances(insightsA.record, { count: 93 });
  const resultForB = allSimilar.find((r) => r.fragrance.slug === insightsB.record.slug);

  // Safe fallback: zero-score result if B is somehow absent
  const similarityResult = resultForB ?? {
    fragrance:  insightsB.record,
    totalScore: 0,
    breakdown:  { family: 0, notes: 0, season: 0, occasion: 0, character: 0, projection: 0, collection: 0, popularity: 0 },
  };

  const reasons = deriveSimilarityReasons(insightsA.record, similarityResult);

  const fragranceA: FragranceComparisonDTO = {
    slug:        insightsA.record.slug,
    name:        insightsA.record.name,
    subtitle:    insightsA.record.subtitle ?? null,
    mood:        insightsA.record.mood,
    profile:     insightsA.record.profile,
    freshness:   insightsA.record.freshness,
    warmth:      insightsA.record.warmth,
    sweetness:   insightsA.record.sweetness,
    intensity:   insightsA.record.intensity,
    versatility: insightsA.record.versatility,
    notes: [
      ...insightsA.record.notes.top,
      ...insightsA.record.notes.heart,
      ...insightsA.record.notes.base,
    ],
  };

  const fragranceB: FragranceComparisonDTO = {
    slug:        insightsB.record.slug,
    name:        insightsB.record.name,
    subtitle:    insightsB.record.subtitle ?? null,
    mood:        insightsB.record.mood,
    profile:     insightsB.record.profile,
    freshness:   insightsB.record.freshness,
    warmth:      insightsB.record.warmth,
    sweetness:   insightsB.record.sweetness,
    intensity:   insightsB.record.intensity,
    versatility: insightsB.record.versatility,
    notes: [
      ...insightsB.record.notes.top,
      ...insightsB.record.notes.heart,
      ...insightsB.record.notes.base,
    ],
  };

  return (
    <main className="min-h-screen bg-[#f5f1eb]">
      <Navbar />
      <ComparisonView fragranceA={fragranceA} fragranceB={fragranceB} reasons={reasons} />
      <Footer />
    </main>
  );
}
