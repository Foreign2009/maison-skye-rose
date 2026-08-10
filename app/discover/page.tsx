import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CollectionCard from "../components/CollectionCard";
import DiscoverCollectionGrid from "../components/DiscoverCollectionGrid";
import HelpMeChooseButton from "../components/HelpMeChooseButton";
import { COLLECTION_SPECS, getCollection, getCurrentSeason } from "../lib/discovery";
import { toDisplayFragrance } from "../lib/mkc/displayAdapter";
import { mkcCatalogue } from "../lib/mkc/catalogue";
import { CHARACTER_STAGES } from "../lib/mkc/wardrobeEngine";

export const metadata: Metadata = {
  title: "Discover Fragrances | Maison Skye & Rose",
  description:
    "Explore intelligent fragrance collections curated using the Maison Knowledge Catalogue. Find your perfect signature scent.",
  alternates: { canonical: "/discover" },
  openGraph: {
    title: "Discover Fragrances | Maison Skye & Rose",
    description:
      "Explore intelligent fragrance collections curated using the Maison Knowledge Catalogue.",
    url: "/discover",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Discover Fragrances | Maison Skye & Rose",
    description:
      "Explore intelligent fragrance collections curated using the Maison Knowledge Catalogue.",
  },
};

// Pre-compute collection data for each spec
const specData = COLLECTION_SPECS.map((spec) => {
  const products = getCollection(spec.id);
  return {
    spec,
    productCount: products.length,
    sampleImages: products.slice(0, 3).map((k) => k.images["10ml"]),
  };
});

const featuredSpecData = specData.filter((d) => d.spec.featured);
const allSpecData = specData;

// Editorial collections — featured first, then repository order
const editorialSpecData = specData
  .filter((d) => !!d.spec.editorial)
  .sort((a, b) => {
    if (a.spec.featured && !b.spec.featured) return -1;
    if (!a.spec.featured && b.spec.featured) return 1;
    return 0;
  });

// Accent colours sourced from existing COLLECTION_SPECS.accentColor values
const CHARACTER_ACCENTS: Record<string, string> = {
  "Fresh & Light":       "#7a8fa3", // fresh-office
  "Balanced Signature":  "#6aaa8a", // everyday-wear
  "Rich & Full-Bodied": "#c4935a", // vanilla-lovers
  "Deep & Intense":      "#9b7ce0", // luxury-picks
};

// Seasonal picks
const season = getCurrentSeason();
const SEASON_LABEL: Record<string, string> = {
  Spring: "Spring Essentials",
  Summer: "Summer Picks",
  Autumn: "Autumn Favourites",
  Winter: "Winter Warmers",
};
const seasonalProducts = mkcCatalogue
  .filter((k) => k.season === season)
  .sort((a, b) => {
    if (a.bestSeller && !b.bestSeller) return -1;
    if (!a.bestSeller && b.bestSeller) return 1;
    return b.popularity - a.popularity;
  })
  .slice(0, 4)
  .map(toDisplayFragrance);

// Hidden Gems preview
const hiddenGemsProducts = getCollection("hidden-gems")
  .slice(0, 4)
  .map(toDisplayFragrance);

export default function DiscoverPage() {
  return (
    <>
      <main className="min-h-screen bg-[#faf7f5]">
        <Navbar />

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <section className="bg-white pt-32 md:pt-40 pb-16 md:pb-24 px-4">
          <div className="mx-auto max-w-4xl text-center">
            <span className="inline-block rounded-full bg-[#f5f1eb] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.28em] text-[#d89ca4]">
              Maison Knowledge Catalogue
            </span>
            <h1 className="mt-6 text-4xl md:text-6xl font-black tracking-[-0.06em] text-[#4f4a52] leading-tight">
              Discover Your
              <br />
              Signature Scent
            </h1>
            <p className="mt-6 text-base md:text-lg text-[#7b7480] max-w-2xl mx-auto leading-7">
              Fragrances curated using the Maison Knowledge Catalogue — our
              intelligent fragrance database spanning 93 unique scents.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <Link
                href="/shop"
                className="rounded-full bg-black px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-zinc-800"
              >
                Browse All Fragrances
              </Link>
              <Link
                href="/quiz"
                className="rounded-full border border-[#ede8e1] bg-white px-8 py-4 text-sm font-bold uppercase tracking-widest text-[#4f4a52] transition hover:border-[#d89ca4]"
              >
                Take the Scent Finder
              </Link>
              <HelpMeChooseButton />
            </div>
          </div>
        </section>

        {/* ── Featured Collections ──────────────────────────────────────────── */}
        <section className="py-16 md:py-24 px-4">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center">
              <p className="text-[11px] uppercase tracking-[0.45em] text-[#d89ca4]">
                Curated Intelligence
              </p>
              <h2 className="mt-2 text-2xl md:text-4xl font-black text-[#4f4a52]">
                Featured Collections
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {featuredSpecData.map(({ spec, productCount, sampleImages }) => (
                <CollectionCard
                  key={spec.id}
                  spec={spec}
                  productCount={productCount}
                  sampleImages={sampleImages}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ── Seasonal Collections ──────────────────────────────────────────── */}
        {seasonalProducts.length > 0 && (
          <section className="bg-white py-16 md:py-24 px-4">
            <div className="mx-auto max-w-7xl">
              <div className="mb-10 flex items-end justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.45em] text-[#d89ca4]">
                    Curated For Right Now
                  </p>
                  <h2 className="mt-2 text-2xl md:text-4xl font-black text-[#4f4a52]">
                    {SEASON_LABEL[season] ?? "Seasonal Collections"}
                  </h2>
                </div>
                <Link
                  href="/shop"
                  className="hidden md:block text-sm font-bold text-[#d89ca4] hover:underline"
                >
                  Browse All →
                </Link>
              </div>

              <DiscoverCollectionGrid
                fragrances={seasonalProducts}
                source="discover-seasonal"
                columns={4}
              />
            </div>
          </section>
        )}

        {/* ── Explore by Scent Character ────────────────────────────────── */}
        <section className="bg-white py-16 md:py-24 px-4">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center">
              <p className="text-[11px] uppercase tracking-[0.45em] text-[#d89ca4]">
                Your Fragrance Journey
              </p>
              <h2 className="mt-2 text-2xl md:text-4xl font-black text-[#4f4a52]">
                Explore by Scent Character
              </h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {CHARACTER_STAGES.map((stage, i) => {
                const accent = CHARACTER_ACCENTS[stage.character] ?? "#d89ca4";
                return (
                  <Link
                    key={stage.character}
                    href="/discover/character-journey"
                    className="group flex flex-col rounded-[32px] border border-[#ede8e1] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.10)]"
                  >
                    <div className="mb-4">
                      <span
                        className="inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] mb-2"
                        style={{ backgroundColor: `${accent}18`, color: accent }}
                      >
                        Stage {i + 1}
                      </span>
                      <h3 className="text-base font-black text-[#4f4a52] leading-snug group-hover:text-[#d89ca4] transition-colors">
                        {stage.character}
                      </h3>
                      <p className="mt-1 text-sm font-semibold" style={{ color: accent }}>
                        {stage.role}
                      </p>
                    </div>

                    <p className="text-xs leading-5 text-[#7b7480] line-clamp-4 flex-1">
                      {stage.editorial}
                    </p>

                    {stage.nextLabel && (
                      <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
                        {stage.nextLabel} →
                      </p>
                    )}

                    <div className="mt-5 flex items-center gap-1.5 text-sm font-bold text-[#d89ca4] group-hover:gap-2.5 transition-all">
                      <span>Explore Collection</span>
                      <span>→</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Editor's Choice ───────────────────────────────────────────────── */}
        {editorialSpecData.length > 0 && (
          <section className="py-16 md:py-24 px-4">
            <div className="mx-auto max-w-7xl">
              <div className="mb-10 text-center">
                <p className="text-[11px] uppercase tracking-[0.45em] text-[#d89ca4]">
                  Curated Selection
                </p>
                <h2 className="mt-2 text-2xl md:text-4xl font-black text-[#4f4a52]">
                  Editor&apos;s Choice
                </h2>
                <p className="mt-3 text-sm text-[#7b7480] max-w-md mx-auto">
                  Our curated selection of exceptional fragrances — personally
                  chosen by the Maison team.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {editorialSpecData.map(({ spec, productCount, sampleImages }) => (
                  <CollectionCard
                    key={spec.id}
                    spec={spec}
                    productCount={productCount}
                    sampleImages={sampleImages}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Hidden Gems ───────────────────────────────────────────────────── */}
        {hiddenGemsProducts.length > 0 && (
          <section className="bg-white py-16 md:py-24 px-4">
            <div className="mx-auto max-w-7xl">
              <div className="mb-10 flex items-end justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.45em] text-[#9b7ce0]">
                    Beyond The Obvious
                  </p>
                  <h2 className="mt-2 text-2xl md:text-4xl font-black text-[#4f4a52]">
                    Hidden Gems
                  </h2>
                  <p className="mt-2 text-sm text-[#7b7480] max-w-lg">
                    Extraordinary fragrances waiting to be discovered.
                  </p>
                </div>
                <Link
                  href="/discover/hidden-gems"
                  className="hidden md:block text-sm font-bold text-[#9b7ce0] hover:underline"
                >
                  See All Hidden Gems →
                </Link>
              </div>

              <DiscoverCollectionGrid
                fragrances={hiddenGemsProducts}
                source="discover-hidden-gems"
                columns={4}
              />

              <div className="mt-8 text-center md:hidden">
                <Link
                  href="/discover/hidden-gems"
                  className="text-sm font-bold text-[#9b7ce0] hover:underline"
                >
                  See All Hidden Gems →
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ── Browse All Collections ────────────────────────────────────────── */}
        <section className="py-16 md:py-24 px-4">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center">
              <p className="text-[11px] uppercase tracking-[0.45em] text-[#d89ca4]">
                Every Theme
              </p>
              <h2 className="mt-2 text-2xl md:text-4xl font-black text-[#4f4a52]">
                Browse All Collections
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {allSpecData.map(({ spec, productCount, sampleImages }) => (
                <CollectionCard
                  key={spec.id}
                  spec={spec}
                  productCount={productCount}
                  sampleImages={sampleImages}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
