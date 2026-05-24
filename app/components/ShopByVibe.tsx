export default function ShopByVibe() {
  return (
    <section className="px-6 pb-28">
      <div className="mx-auto max-w-7xl">

        {/* HEADING */}
        <div className="mb-14 text-center">

          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-zinc-500">
            Shop By Mood & Season
          </p>

          <h2 className="text-4xl font-black uppercase tracking-[-0.03em] md:text-6xl">
            Match Your
            <span className="block text-[#b67d73]">
              Energy
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-zinc-600">
            Discover fragrances based on your lifestyle,
            confidence, mood, season, and everyday moments.
          </p>

        </div>

        {/* GRID */}
        <div className="grid gap-6 md:grid-cols-3">

          {/* SUMMER FRESH */}
          <div className="group rounded-[36px] bg-[#dfe7ef] p-8 transition duration-300 hover:-translate-y-1">

            <p className="mb-4 text-xs uppercase tracking-[0.35em] text-[#5f7386]">
              Summer Fresh
            </p>

            <h3 className="text-4xl font-black uppercase leading-[0.95] text-[#3e4d5c]">
              Clean
              <span className="block">
                Energy
              </span>
            </h3>

            <p className="mt-6 text-sm leading-7 text-[#4f5d6b]">
              Fresh fragrances inspired by movement,
              sunshine, clean confidence, gym sessions,
              beach days, and everyday wear.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <span className="rounded-full bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.2em]">
                Fresh
              </span>

              <span className="rounded-full bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.2em]">
                Daily Wear
              </span>
            </div>
          </div>

          {/* SOFT & SWEET */}
          <div className="group rounded-[36px] bg-[#f3e3e4] p-8 transition duration-300 hover:-translate-y-1">

            <p className="mb-4 text-xs uppercase tracking-[0.35em] text-[#b67d73]">
              Soft & Sweet
            </p>

            <h3 className="text-4xl font-black uppercase leading-[0.95] text-[#8f6f69]">
              Playful
              <span className="block">
                Luxury
              </span>
            </h3>

            <p className="mt-6 text-sm leading-7 text-[#8f6f69]">
              Warm sweet fragrances designed for compliments,
              attraction, confidence, softness, and feminine energy.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <span className="rounded-full bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.2em]">
                Sweet
              </span>

              <span className="rounded-full bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.2em]">
                Compliment Getter
              </span>
            </div>
          </div>

          {/* WINTER BOLD */}
          <div className="group rounded-[36px] bg-[#e9e3db] p-8 transition duration-300 hover:-translate-y-1">

            <p className="mb-4 text-xs uppercase tracking-[0.35em] text-[#6d5d53]">
              Winter Bold
            </p>

            <h3 className="text-4xl font-black uppercase leading-[0.95] text-[#5e5048]">
              Rich
              <span className="block">
                Presence
              </span>
            </h3>

            <p className="mt-6 text-sm leading-7 text-zinc-600">
              Deep warm fragrances crafted for cold nights,
              luxury settings, confidence, layering, and bold identity.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <span className="rounded-full bg-white px-4 py-2 text-xs uppercase tracking-[0.2em]">
                Spicy
              </span>

              <span className="rounded-full bg-white px-4 py-2 text-xs uppercase tracking-[0.2em]">
                Night Out
              </span>
            </div>
          </div>

          {/* DATE NIGHT */}
          <div className="group rounded-[36px] bg-[#efe1e6] p-8 transition duration-300 hover:-translate-y-1">

            <p className="mb-4 text-xs uppercase tracking-[0.35em] text-[#9a5c74]">
              Date Night
            </p>

            <h3 className="text-4xl font-black uppercase leading-[0.95] text-[#7e475d]">
              Attractive
              <span className="block">
                Energy
              </span>
            </h3>

            <p className="mt-6 text-sm leading-7 text-[#7e475d]">
              Seductive fragrances built for compliments,
              intimacy, confidence, nightlife, and memorable moments.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <span className="rounded-full bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.2em]">
                Seductive
              </span>

              <span className="rounded-full bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.2em]">
                Nightlife
              </span>
            </div>
          </div>

          {/* EVERYDAY CLEAN */}
          <div className="group rounded-[36px] bg-[#ece8e2] p-8 transition duration-300 hover:-translate-y-1">

            <p className="mb-4 text-xs uppercase tracking-[0.35em] text-zinc-500">
              Everyday Clean
            </p>

            <h3 className="text-4xl font-black uppercase leading-[0.95] text-[#5f5a54]">
              Easy
              <span className="block">
                Luxury
              </span>
            </h3>

            <p className="mt-6 text-sm leading-7 text-zinc-600">
              Smooth wearable fragrances perfect for work,
              casual wear, errands, coffee runs, and everyday confidence.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <span className="rounded-full bg-white px-4 py-2 text-xs uppercase tracking-[0.2em]">
                Casual
              </span>

              <span className="rounded-full bg-white px-4 py-2 text-xs uppercase tracking-[0.2em]">
                Signature Scent
              </span>
            </div>
          </div>

          {/* ELEGANT OUD */}
          <div className="group rounded-[36px] bg-[#ddd6cf] p-8 transition duration-300 hover:-translate-y-1">

            <p className="mb-4 text-xs uppercase tracking-[0.35em] text-[#6b5648]">
              Elegant Oud
            </p>

            <h3 className="text-4xl font-black uppercase leading-[0.95] text-[#4e4036]">
              Luxury
              <span className="block">
                Mood
              </span>
            </h3>

            <p className="mt-6 text-sm leading-7 text-[#5e5048]">
              Rich luxury fragrances inspired by elegance,
              exclusivity, formal wear, and statement presence.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <span className="rounded-full bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.2em]">
                Oud
              </span>

              <span className="rounded-full bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.2em]">
                Luxury
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}