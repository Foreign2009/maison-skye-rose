"use client";

export default function RequestFragrance() {
  return (
    <section className="bg-black py-24 text-white">
      <div className="mx-auto max-w-5xl px-6 text-center">

        <p className="text-[11px] uppercase tracking-[0.45em] text-[#d89ca4]">
          Extended Catalogue
        </p>

        <h2 className="mt-4 text-5xl font-black tracking-[-0.05em]">
          Can't Find Your Fragrance?
        </h2>

        <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-zinc-300">
          We currently showcase our most popular fragrances online.
          Looking for something specific? We source from a catalogue of
          over 465 luxury-inspired fragrances.
        </p>

        <a
          href="https://wa.me/27696863952?text=Hi%20Maison%20Skye%20%26%20Rose,%20I%20am%20looking%20for%20a%20specific%20fragrance."
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-flex rounded-full bg-white px-8 py-4 font-bold text-black transition hover:scale-105"
        >
          Request A Fragrance
        </a>

      </div>
    </section>
  );
}