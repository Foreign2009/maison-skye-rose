"use client";

export default function RequestFragrance() {
  return (
    <section className="bg-[#f5f1eb] px-6 py-24">

      <div className="mx-auto max-w-4xl rounded-[40px] bg-white p-12 text-center shadow-sm">

        <p className="text-xs uppercase tracking-[0.4em] text-[#b67d73]">
          Extended Catalogue
        </p>

        <h2 className="mt-5 text-5xl font-black uppercase">
          Can't Find Your Fragrance?
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-zinc-600 leading-8">
          We have access to over 465 luxury inspired fragrances.
          If you don't see your fragrance listed,
          we'll source it for you.
        </p>

        <button
          onClick={() =>
            window.open(
              "https://wa.me/27696863952?text=Hi%20Maison%20Skye%20%26%20Rose,%20I%20am%20looking%20for%20a%20specific%20fragrance.",
              "_blank"
            )
          }
          className="mt-8 rounded-full bg-black px-10 py-5 text-white"
        >
          Request A Fragrance
        </button>

      </div>

    </section>
  );
}