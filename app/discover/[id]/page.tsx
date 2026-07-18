import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import DiscoverCollectionGrid from "../../components/DiscoverCollectionGrid";
import CollectionCard from "../../components/CollectionCard";
import MomentConciergeButton from "../../components/MomentConciergeButton";
import { COLLECTION_SPECS, getCollection, catalogueMaps } from "../../lib/discovery";
import { getRelatedKnowledge } from "../../lib/intelligence";
import { getMomentContent } from "../../lib/discovery/momentContent";
import { getCollectionDimensions, getRepresentativeFragrances, getDiscoveryPathways, getJourneyTopics } from "../../lib/discovery/discoveryIntelligence";
import { resolveJourneyArticles } from "../../lib/academy/journeyResolver";
import { getProgressionConnections } from "../../lib/discovery/discoveryProgression";
import DiscoveryAttributionSetter from "../../components/DiscoveryAttributionSetter";
import { CollectionDimensions } from "../../components/knowledge/CollectionDimensions";
import { FragranceSpotlight } from "../../components/knowledge/FragranceSpotlight";
import { toDisplayFragrance } from "../../lib/mkc/displayAdapter";
import { academyCatalogue } from "../../lib/academy/catalogue";

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return COLLECTION_SPECS.map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const spec = COLLECTION_SPECS.find((s) => s.id === id);
  if (!spec) return {};

  const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL ?? "";

  return {
    title: `${spec.name} | Maison Skye & Rose`,
    description: spec.description,
    alternates: { canonical: `${baseUrl}/discover/${id}` },
    openGraph: {
      title: `${spec.name} | Maison Skye & Rose`,
      description: spec.description,
      url: `${baseUrl}/discover/${id}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${spec.name} | Maison Skye & Rose`,
      description: spec.description,
    },
  };
}

export default async function DiscoverCollectionPage({ params }: PageProps) {
  const { id } = await params;
  const spec = COLLECTION_SPECS.find((s) => s.id === id);
  if (!spec) notFound();

  const baseUrl        = process.env.NEXT_PUBLIC_WEBSITE_URL ?? "";
  const momentContent  = getMomentContent(id);
  const dimensions      = getCollectionDimensions(spec.id);
  const representatives = getRepresentativeFragrances(spec.id);
  const pathways        = getDiscoveryPathways(spec.id);
  const journeyArticles = !spec.editorial ? resolveJourneyArticles(getJourneyTopics(spec.id)) : [];
  const connectedCollections = !spec.editorial
    ? getProgressionConnections(spec.id).map(({ spec: connSpec, label }) => {
        const connProducts = getCollection(connSpec.id);
        return {
          spec:         connSpec,
          label,
          productCount: connProducts.length,
          sampleImages: connProducts.slice(0, 3).map((k) => k.images["10ml"]),
        };
      })
    : [];
  const products        = getCollection(spec.id).map((k) => ({ ...toDisplayFragrance(k), scentCharacter: k.scentCharacter }));

  // ── Relationship enrichment (EP17.0-P5) ──────────────────────────────────────
  // Source: graph relationships of the primary representative fragrance.
  // Excludes: collection members and pathways already shown on the page.
  const primaryRep      = representatives[0] ?? null;
  const repRelationships = primaryRep ? getRelatedKnowledge(primaryRep.slug) : null;

  const collectionSlugs = new Set<string>(getCollection(spec.id).map((k) => k.slug));
  const pathwaySlugs    = new Set<string>(pathways.map((p) => p.fragrance.slug));
  const shownSlugs      = new Set<string>([...collectionSlugs, ...pathwaySlugs]);

  const relatedSummaries = repRelationships
    ? [...repRelationships.alternatives, ...repRelationships.evolutions].filter((s) => !shownSlugs.has(s.slug))
    : [];

  const relatedGridItems = relatedSummaries
    .map((s) => {
      const k = catalogueMaps.bySlug.get(s.slug);
      return k ? { ...toDisplayFragrance(k), scentCharacter: k.scentCharacter } : null;
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const relatedSlugsSet = new Set<string>(relatedSummaries.map((s) => s.slug));

  const wardrobeGridItems = repRelationships
    ? repRelationships.wardrobePartners
        .filter((s) => !shownSlugs.has(s.slug) && !relatedSlugsSet.has(s.slug))
        .map((s) => {
          const k = catalogueMaps.bySlug.get(s.slug);
          return k ? { ...toDisplayFragrance(k), scentCharacter: k.scentCharacter } : null;
        })
        .filter((item): item is NonNullable<typeof item> => item !== null)
    : [];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",     item: `${baseUrl}/` },
      { "@type": "ListItem", position: 2, name: "Discover", item: `${baseUrl}/discover` },
      { "@type": "ListItem", position: 3, name: spec.name,  item: `${baseUrl}/discover/${spec.id}` },
    ],
  };

  // ── Editorial moment page ───────────────────────────────────────────────────

  if (momentContent) {
    const relatedArticles = momentContent.relatedArticleSlugs
      .map((slug) => academyCatalogue.find((a) => a.slug === slug))
      .filter((a): a is NonNullable<typeof a> => a !== undefined);

    const relatedMomentData = momentContent.relatedMomentIds
      .map((mid) => {
        const relatedSpec = COLLECTION_SPECS.find((s) => s.id === mid);
        if (!relatedSpec) return null;
        const relatedProducts = getCollection(mid);
        return {
          spec:         relatedSpec,
          productCount: relatedProducts.length,
          sampleImages: relatedProducts.slice(0, 3).map((k) => k.images["10ml"]),
        };
      })
      .filter((d): d is NonNullable<typeof d> => d !== null);

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />

        <main className="min-h-screen bg-[#faf7f5]">
          <DiscoveryAttributionSetter source="discover-moment" momentId={id} />
          <Navbar />

          {/* ── Breadcrumb ────────────────────────────────────────────────── */}
          <nav aria-label="Breadcrumb" className="pt-32 md:pt-40 pb-4 px-4">
            <ol className="mx-auto max-w-7xl flex items-center gap-2 text-xs text-[#7b7480]">
              <li>
                <Link href="/" className="hover:text-[#d89ca4] transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/discover" className="hover:text-[#d89ca4] transition-colors">
                  Discover
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="font-semibold text-[#4f4a52]">{momentContent.label}</li>
            </ol>
          </nav>

          {/* ── Editorial Hero ────────────────────────────────────────────── */}
          <section className="px-4 pb-12 md:pb-20">
            <div className="mx-auto max-w-7xl">
              <div
                className="rounded-[32px] p-8 md:p-16"
                style={{ backgroundColor: `${spec.accentColor}10` }}
              >
                <div className="max-w-2xl">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.55em] text-[#d89ca4]">
                    Discover by Moment
                  </p>
                  <h1 className="mt-4 text-4xl font-black tracking-[-0.05em] text-[#4f4a52] leading-tight md:text-6xl">
                    {momentContent.label}
                  </h1>
                  <p className="mt-3 text-sm font-semibold" style={{ color: spec.accentColor }}>
                    {momentContent.subtitle}
                  </p>
                  <p className="mt-6 text-base leading-[1.85] text-[#7b7480] md:text-lg">
                    {momentContent.story}
                  </p>

                  {/* Maison Insight */}
                  <div className="mt-8 border-l-2 border-[#d89ca4] pl-5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#d89ca4]">
                      Maison Insight
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-[#7b7480]">
                      {momentContent.insight}
                    </p>
                  </div>

                  {momentContent.wardrobeNote && (
                    <p className="mt-6 text-sm italic leading-relaxed text-[#9b9298]">
                      {momentContent.wardrobeNote}
                    </p>
                  )}

                  <p className="mt-8 text-sm text-[#9b9298]">
                    {products.length} fragrances in this collection
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ── Curated Recommendations ───────────────────────────────────── */}
          <section className="px-4 pb-16 md:pb-24">
            <div className="mx-auto max-w-7xl">
              <div className="mb-8 md:mb-10">
                <p className="text-[10px] font-semibold uppercase tracking-[0.55em] text-[#d89ca4]">
                  Curated for this moment
                </p>
                <h2 className="mt-3 text-2xl font-black tracking-[-0.04em] text-[#4f4a52] md:text-3xl">
                  The Collection
                </h2>
              </div>
              <DiscoverCollectionGrid
                fragrances={products}
                source="discover-collection"
                columns={4}
              />
            </div>
          </section>

          {/* ── Wardrobe Perspective ──────────────────────────────────────── */}
          <section className="px-4 pb-12 md:pb-16">
            <div className="mx-auto max-w-7xl">
              <div className="rounded-[24px] border border-[#ede8e1] bg-white px-8 py-8 md:px-10 md:py-10">
                <p className="text-[10px] font-semibold uppercase tracking-[0.45em] text-[#d89ca4]">
                  A Wardrobe Perspective
                </p>
                <p className="mt-3 text-base font-black text-[#4f4a52] md:text-lg">
                  Building a considered collection
                </p>
                <p className="mt-3 max-w-xl text-sm leading-7 text-[#7b7480]">
                  {momentContent.conciergeCopy}
                </p>
                <div className="mt-6">
                  <MomentConciergeButton
                    context={momentContent.conciergeContext}
                    label="Ask the Concierge"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ── Academy Articles ──────────────────────────────────────────── */}
          {relatedArticles.length > 0 && (
            <section className="bg-white py-16 px-4 md:py-24">
              <div className="mx-auto max-w-7xl">
                <div className="mb-10 max-w-2xl">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.55em] text-[#d89ca4]">
                    Maison Academy
                  </p>
                  <h2 className="mt-3 text-2xl font-black tracking-[-0.04em] text-[#4f4a52] md:text-3xl">
                    {momentContent.academyCopy}
                  </h2>
                </div>
                <div className="grid gap-5 md:grid-cols-3">
                  {relatedArticles.map(({ slug, title, excerpt, readTime }) => (
                    <Link
                      key={slug}
                      href={`/academy/${slug}`}
                      className="group block rounded-[20px] border border-[#f0ebe8] bg-[#faf7f5] p-7 transition-all duration-300 hover:border-[#d89ca4] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#d89ca4]">
                        {readTime} min read
                      </p>
                      <h3 className="mt-3 text-base font-black leading-snug text-[#4f4a52]">
                        {title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-[#7b7480]">
                        {excerpt}
                      </p>
                      <p className="mt-5 text-sm font-bold text-[#d89ca4]">
                        Read more →
                      </p>
                    </Link>
                  ))}
                </div>
                <div className="mt-8">
                  <Link
                    href="/academy"
                    className="text-sm font-semibold text-[#7b7480] underline-offset-4 transition-colors hover:text-[#4f4a52] hover:underline"
                  >
                    Visit the full Academy →
                  </Link>
                </div>
              </div>
            </section>
          )}

          {/* ── Concierge Continuation ────────────────────────────────────── */}
          <section className="bg-[#faf7f5] py-16 px-4 md:py-24">
            <div className="mx-auto max-w-7xl">
              <div className="max-w-2xl">
                <p className="text-[10px] font-semibold uppercase tracking-[0.55em] text-[#d89ca4]">
                  Your Personal Concierge
                </p>
                <h2 className="mt-3 text-2xl font-black tracking-[-0.04em] text-[#4f4a52] md:text-3xl">
                  Not sure which one is right for you?
                </h2>
                <p className="mt-4 text-base leading-relaxed text-[#7b7480]">
                  {momentContent.conciergeCopy}
                </p>
                <div className="mt-6">
                  <MomentConciergeButton
                    context={momentContent.conciergeContext}
                    label="Ask your Concierge"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ── Related Moments ───────────────────────────────────────────── */}
          {relatedMomentData.length > 0 && (
            <section className="bg-white py-16 px-4 md:py-24">
              <div className="mx-auto max-w-7xl">
                <div className="mb-10">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.55em] text-[#d89ca4]">
                    Continue Exploring
                  </p>
                  <h2 className="mt-3 text-2xl font-black tracking-[-0.04em] text-[#4f4a52] md:text-3xl">
                    Other Moments to Discover
                  </h2>
                </div>
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {relatedMomentData.map(({ spec: relSpec, productCount, sampleImages }) => (
                    <CollectionCard
                      key={relSpec.id}
                      spec={relSpec}
                      productCount={productCount}
                      sampleImages={sampleImages}
                    />
                  ))}
                </div>
                <div className="mt-8">
                  <Link
                    href="/discover"
                    className="text-sm font-semibold text-[#7b7480] underline-offset-4 transition-colors hover:text-[#4f4a52] hover:underline"
                  >
                    View all collections →
                  </Link>
                </div>
              </div>
            </section>
          )}
        </main>

        <Footer />
      </>
    );
  }

  // ── Standard collection page ────────────────────────────────────────────────

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <main className="min-h-screen bg-[#faf7f5]">
        <DiscoveryAttributionSetter source="discover-moment" momentId={id} />
        <Navbar />

        {/* ── Breadcrumbs ──────────────────────────────────────────────────── */}
        <nav
          aria-label="Breadcrumb"
          className="pt-32 md:pt-40 pb-4 px-4"
        >
          <ol className="mx-auto max-w-7xl flex items-center gap-2 text-xs text-[#7b7480]">
            <li>
              <Link href="/" className="hover:text-[#d89ca4] transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/discover" className="hover:text-[#d89ca4] transition-colors">
                Discover
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="font-semibold text-[#4f4a52]">{spec.name}</li>
          </ol>
        </nav>

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <section className="px-4 pb-12 md:pb-20">
          <div className="mx-auto max-w-7xl">
            <div
              className="rounded-[32px] p-8 md:p-16"
              style={{ backgroundColor: `${spec.accentColor}10` }}
            >
              <div className="max-w-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <span
                    className="flex h-16 w-16 items-center justify-center rounded-2xl text-3xl shadow-sm"
                    style={{ backgroundColor: `${spec.accentColor}20` }}
                  >
                    {spec.icon}
                  </span>
                  {spec.featured && (
                    <span
                      className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]"
                      style={{
                        backgroundColor: `${spec.accentColor}20`,
                        color: spec.accentColor,
                      }}
                    >
                      Featured Collection
                    </span>
                  )}
                </div>

                <h1 className="text-4xl md:text-6xl font-black tracking-[-0.05em] text-[#4f4a52]">
                  {spec.name}
                </h1>

                <p className="mt-4 text-base md:text-lg text-[#7b7480] leading-7 max-w-xl">
                  {spec.editorial ? spec.editorial.introduction : spec.description}
                </p>

                {spec.editorial && (
                  <div className="mt-6 border-l-2 border-[#d89ca4] pl-5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#d89ca4]">
                      Maison Insight
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-[#7b7480]">
                      {spec.editorial.purpose}
                    </p>
                  </div>
                )}

                {!spec.editorial && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {spec.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full px-3 py-1 text-xs font-semibold"
                        style={{
                          backgroundColor: `${spec.accentColor}15`,
                          color: spec.accentColor,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <p className="mt-6 text-sm text-[#7b7480]">
                  {products.length} fragrances in this collection
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Discovery Intelligence ────────────────────────────────────────── */}
        {dimensions && (
          <section className="px-4 pb-4">
            <div className="mx-auto max-w-7xl">
              <CollectionDimensions
                families={dimensions.topFamilies}
                occasions={dimensions.topOccasions}
                seasons={dimensions.topSeasons}
              />
            </div>
          </section>
        )}

        {/* ── Representative Fragrances ────────────────────────────────────── */}
        {representatives.length > 0 && (
          <section className="px-4 pb-8 md:pb-10">
            <div className="mx-auto max-w-7xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400 mb-4">
                Fragrance Examples
              </p>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {representatives.map((fragrance) => (
                  <FragranceSpotlight
                    key={fragrance.id}
                    fragrance={fragrance}
                    caption={fragrance.mood}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Continue Exploring (EP23-P3) ─────────────────────────────────── */}
        {pathways.length > 0 && (
          <section className="px-4 pb-8 md:pb-10">
            <div className="mx-auto max-w-7xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400 mb-4">
                Continue Exploring
              </p>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {pathways.map(({ fragrance, label }) => (
                  <FragranceSpotlight
                    key={fragrance.id}
                    fragrance={fragrance}
                    caption={label}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── From the Academy (EP24-P1) ────────────────────────────────────── */}
        {journeyArticles.length > 0 && (
          <section className="px-4 pb-8 md:pb-10">
            <div className="mx-auto max-w-7xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400 mb-4">
                From the Academy
              </p>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {journeyArticles.map(({ slug, title, excerpt, readTime }) => (
                  <Link
                    key={slug}
                    href={`/academy/${slug}`}
                    className="group block rounded-[20px] border border-[#f0ebe8] bg-white p-6 transition-all duration-300 hover:border-[#d89ca4] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#d89ca4]">
                      {readTime} min read
                    </p>
                    <h3 className="mt-2 text-sm font-bold leading-snug text-[#4f4a52]">
                      {title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-[#7b7480] line-clamp-2">
                      {excerpt}
                    </p>
                    <p className="mt-4 text-xs font-bold text-[#d89ca4]">Read more →</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Product Grid ──────────────────────────────────────────────────── */}
        <section className="px-4 pb-16 md:pb-24">
          <div className="mx-auto max-w-7xl">
            {spec.editorial && (
              <div className="mb-8 md:mb-10">
                <p className="text-[10px] font-semibold uppercase tracking-[0.55em] text-[#d89ca4]">
                  The Collection
                </p>
                <h2 className="mt-3 text-2xl font-black tracking-[-0.04em] text-[#4f4a52] md:text-3xl">
                  {spec.name}
                </h2>
              </div>
            )}
            <DiscoverCollectionGrid
              fragrances={products}
              source="discover-collection"
              columns={4}
            />
          </div>
        </section>

        {/* ── Wardrobe Perspective ──────────────────────────────────────────── */}
        <section className="px-4 pb-12 md:pb-16">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-[24px] border border-[#ede8e1] bg-white px-8 py-8 md:px-10 md:py-10">
              <p className="text-[10px] font-semibold uppercase tracking-[0.45em] text-[#d89ca4]">
                A Wardrobe Perspective
              </p>
              <p className="mt-3 text-base font-black text-[#4f4a52] md:text-lg">
                Building a considered collection
              </p>
              <p className="mt-3 max-w-xl text-sm leading-7 text-[#7b7480]">
                {spec.editorial
                  ? spec.editorial.wardrobePurpose
                  : "Not sure where this fits in your wardrobe? Your Concierge can help you understand how this collection layers with what you already own."}
              </p>
              <div className="mt-6">
                <MomentConciergeButton
                  context={spec.editorial ? spec.editorial.conciergeContext : { occasion: spec.tags[0] }}
                  label="Ask the Concierge"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Related Fragrances (EP17.0-P5) ──────────────────────────────────── */}
        {relatedGridItems.length > 0 && (
          <section className="px-4 pb-12 md:pb-16">
            <div className="mx-auto max-w-7xl">
              <div className="mb-8 md:mb-10">
                <p className="text-[10px] font-semibold uppercase tracking-[0.55em] text-[#d89ca4]">
                  Related Fragrances
                </p>
                <h2 className="mt-3 text-2xl font-black tracking-[-0.04em] text-[#4f4a52] md:text-3xl">
                  Comparable Expressions
                </h2>
              </div>
              <DiscoverCollectionGrid
                fragrances={relatedGridItems}
                source="discover-collection"
                columns={3}
              />
            </div>
          </section>
        )}

        {/* ── Complete Your Wardrobe (EP17.0-P5) ───────────────────────────────── */}
        {wardrobeGridItems.length > 0 && (
          <section className="bg-white py-12 px-4 md:py-16">
            <div className="mx-auto max-w-7xl">
              <div className="mb-8 md:mb-10">
                <p className="text-[10px] font-semibold uppercase tracking-[0.55em] text-[#d89ca4]">
                  Complete Your Wardrobe
                </p>
                <h2 className="mt-3 text-2xl font-black tracking-[-0.04em] text-[#4f4a52] md:text-3xl">
                  Often Worn Alongside
                </h2>
              </div>
              <DiscoverCollectionGrid
                fragrances={wardrobeGridItems}
                source="discover-collection"
                columns={3}
              />
            </div>
          </section>
        )}

        {/* ── Continue Your Journey (EP24-P3) ─────────────────────────────────── */}
        {connectedCollections.length > 0 && (
          <section className="bg-white py-16 px-4 md:py-20">
            <div className="mx-auto max-w-7xl">
              <div className="mb-8 md:mb-10">
                <p className="text-[10px] font-semibold uppercase tracking-[0.55em] text-[#d89ca4]">
                  Continue Your Journey
                </p>
                <h2 className="mt-3 text-2xl font-black tracking-[-0.04em] text-[#4f4a52] md:text-3xl">
                  Collections You Might Enjoy Next
                </h2>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                {connectedCollections.map(({ spec: connSpec, productCount, sampleImages, label }) => (
                  <div key={connSpec.id}>
                    <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.4em] text-[#d89ca4]">
                      {label}
                    </p>
                    <CollectionCard
                      spec={connSpec}
                      productCount={productCount}
                      sampleImages={sampleImages}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Academy Articles (editorial collections only) ──────────────────── */}
        {spec.editorial && (() => {
          const editorialArticles = spec.editorial.articleSlugs
            .map((slug) => academyCatalogue.find((a) => a.slug === slug))
            .filter((a): a is NonNullable<typeof a> => a !== undefined);
          return editorialArticles.length > 0 ? (
            <section className="bg-white py-16 px-4 md:py-24">
              <div className="mx-auto max-w-7xl">
                <div className="mb-10 max-w-2xl">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.55em] text-[#d89ca4]">
                    Maison Academy
                  </p>
                  <h2 className="mt-3 text-2xl font-black tracking-[-0.04em] text-[#4f4a52] md:text-3xl">
                    {spec.editorial.academyCopy}
                  </h2>
                </div>
                <div className="grid gap-5 md:grid-cols-3">
                  {editorialArticles.map(({ slug, title, excerpt, readTime }) => (
                    <Link
                      key={slug}
                      href={`/academy/${slug}`}
                      className="group block rounded-[20px] border border-[#f0ebe8] bg-[#faf7f5] p-7 transition-all duration-300 hover:border-[#d89ca4] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#d89ca4]">
                        {readTime} min read
                      </p>
                      <h3 className="mt-3 text-base font-black leading-snug text-[#4f4a52]">
                        {title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-[#7b7480]">
                        {excerpt}
                      </p>
                      <p className="mt-5 text-sm font-bold text-[#d89ca4]">
                        Read more →
                      </p>
                    </Link>
                  ))}
                </div>
                <div className="mt-8">
                  <Link
                    href="/academy"
                    className="text-sm font-semibold text-[#7b7480] underline-offset-4 transition-colors hover:text-[#4f4a52] hover:underline"
                  >
                    Visit the full Academy →
                  </Link>
                </div>
              </div>
            </section>
          ) : null;
        })()}

        {/* ── Concierge Continuation (editorial collections only) ────────────── */}
        {spec.editorial && (
          <section className="bg-[#faf7f5] py-16 px-4 md:py-24">
            <div className="mx-auto max-w-7xl">
              <div className="max-w-2xl">
                <p className="text-[10px] font-semibold uppercase tracking-[0.55em] text-[#d89ca4]">
                  Your Personal Concierge
                </p>
                <h2 className="mt-3 text-2xl font-black tracking-[-0.04em] text-[#4f4a52] md:text-3xl">
                  Not sure which one is right for you?
                </h2>
                <p className="mt-4 text-base leading-relaxed text-[#7b7480]">
                  {spec.editorial.conciergeCopy}
                </p>
                <div className="mt-6">
                  <MomentConciergeButton
                    context={spec.editorial.conciergeContext}
                    label="Ask your Concierge"
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── CTA ───────────────────────────────────────────────────────────── */}
        <section className="bg-white py-16 px-4 text-center">
          <div className="mx-auto max-w-xl">
            <p className="text-[11px] uppercase tracking-[0.4em] text-[#d89ca4]">
              Not What You&apos;re Looking For?
            </p>
            <h2 className="mt-3 text-2xl md:text-3xl font-black text-[#4f4a52]">
              Explore More Collections
            </h2>
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <Link
                href="/discover"
                className="rounded-full border border-[#ede8e1] bg-white px-6 py-3 text-sm font-bold uppercase tracking-widest text-[#4f4a52] transition hover:border-[#d89ca4]"
              >
                All Collections
              </Link>
              <Link
                href="/shop"
                className="rounded-full bg-black px-6 py-3 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-zinc-800"
              >
                Browse All Fragrances
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
