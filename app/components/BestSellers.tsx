import { fragrances } from "../data/fragrances";
import ProductCard from "./ProductCard";

export default function BestSellers() {

  const bestSellers = fragrances.filter(
    (fragrance) => fragrance.bestSeller
  );

  return (
    <section className="px-6 pb-28">

      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

          <div>

            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-zinc-500">
              Trending Right Now
            </p>

            <h2 className="text-4xl font-black uppercase tracking-[-0.03em] md:text-6xl">
              Most
              <span className="block text-[#b67d73]">
                Wanted
              </span>
            </h2>

          </div>

          <p className="max-w-lg text-sm leading-7 text-zinc-600">
            Discover the fragrances customers are reaching for most —
            bold signatures, fresh essentials, sweet icons, and
            modern everyday luxury favorites.
          </p>

        </div>

        {/* GRID */}
        <div className="grid gap-6 md:grid-cols-3">

          {bestSellers.map((fragrance) => (

            <ProductCard
              key={fragrance.id}
              title={fragrance.title}
              subtitle={fragrance.description}
              mood={fragrance.mood}
              profile={fragrance.profile}
              season={fragrance.season}
              notes={fragrance.notes}
              prices={fragrance.prices}
              images={fragrance.images}
            />

          ))}

        </div>

      </div>

    </section>
  );
}