import { fragrances } from "../data/fragrances";
import ProductCard from "./ProductCard";

export default function NewArrivals() {

  const newArrivals = fragrances.filter(
    (fragrance) => fragrance.newArrival
  );

  return (
    <section
      id="new-arrivals"
      className="px-6 pb-28"
    >

      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

          <div>

            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-zinc-500">
              Monthly Drops
            </p>

            <h2 className="text-4xl font-black uppercase tracking-[-0.03em] md:text-6xl">
              New
              <span className="block text-[#b67d73]">
                Arrivals
              </span>
            </h2>

          </div>

          <p className="max-w-lg text-sm leading-7 text-zinc-600">
            Discover the latest fragrance releases added to the
            Maison Skye & Rose collection curated for seasonal
            moods, confidence, nightlife, and everyday luxury energy.
          </p>

        </div>

        {/* PRODUCTS */}
        <div className="grid gap-6 md:grid-cols-3">

          {newArrivals.map((fragrance) => (

            <ProductCard
              key={fragrance.title}
              title={fragrance.title}
              subtitle={fragrance.subtitle}
              mood={fragrance.mood}
              profile={fragrance.profile}
              season={fragrance.season}
              notes={fragrance.notes}
              prices={fragrance.prices}
              images={fragrance.images}
              bestSeller={fragrance.bestSeller ?? false}
              newArrival={fragrance.newArrival ?? false}
            />

          ))}

        </div>

      </div>

    </section>
  );
}