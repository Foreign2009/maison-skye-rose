"use client";

import Navbar from "../../components/Navbar";
import ProductCard from "../../components/ProductCard";

import { fragrances } from "../../data/fragrances";

export default function SkyeCollectionPage() {

  const products =
    fragrances.filter(
      (item) =>
        item.collection ===
        "Skye"
    );

  return (
    <main className="fade-up min-h-screen bg-[#f5f1eb]">

      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-20">

        <p className="text-xs uppercase tracking-[0.45em] text-[#7a8fa3]">
          For Him
        </p>

        <h1 className="mt-6 text-7xl font-black uppercase leading-[0.9] tracking-[-0.05em]">
          Skye
          <br />
          Collection
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-9 text-zinc-600">
          Bold masculine luxury fragrances inspired by confidence,
          nightlife, movement and modern elegance.
        </p>

        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {products.map((fragrance) => (

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
              bestSeller={fragrance.bestSeller}
              newArrival={fragrance.newArrival}
            />

          ))}

        </div>

      </section>

    </main>
  );
}