"use client";

export default function Newsletter() {
  return (
    <section className="px-5 py-24">

      <div
        className="
          mx-auto
          max-w-5xl
          rounded-[40px]
          bg-gradient-to-r
          from-pink-50
          to-blue-50
          p-10
          text-center
        "
      >

        <p className="text-[11px] uppercase tracking-[0.45em] text-[#d89ca4]">
          Maison Insider
        </p>

        <h2 className="mt-4 text-5xl font-black text-[#4f4a52]">
          Join The Community
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-[#7b7480] leading-8">
          Receive fragrance tips, new arrivals,
          exclusive offers and discovery set launches.
        </p>

        <div className="mt-10 flex flex-col gap-4 md:flex-row">

          <input
            type="email"
            placeholder="Enter your email"
            className="
              flex-1
              rounded-full
              border
              border-white
              bg-white
              px-6
              py-4
              outline-none
            "
          />

          <button
            className="
              rounded-full
              bg-gradient-to-r
              from-pink-400
              to-blue-400
              px-8
              py-4
              font-bold
              text-white
            "
          >
            Join Now
          </button>

        </div>

      </div>

    </section>
  );
}