export default function PocketLuxury() {
  return (
    <section className="relative px-6 pb-28">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[40px] border border-white/10 bg-white/[0.03]">

        <div className="grid md:grid-cols-3">

          {/* 5ML */}
          <div className="border-b border-white/10 p-10 md:border-b-0 md:border-r">
            <p className="mb-4 text-xs uppercase tracking-[0.4em] text-zinc-500">
              5ML
            </p>

            <h3 className="text-3xl font-black uppercase">
              Daily
              <span className="block text-[#c48b7a]">
                Carry
              </span>
            </h3>

            <p className="mt-6 text-sm leading-7 text-zinc-400">
              Compact luxury fragrance designed for pockets,
              handbags, travel, gym bags, and everyday confidence.
            </p>

            <div className="mt-8">
              <span className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-zinc-500">
                Pocket Luxury
              </span>
            </div>
          </div>

          {/* 10ML */}
          <div className="border-b border-white/10 p-10 md:border-b-0 md:border-r">
            <p className="mb-4 text-xs uppercase tracking-[0.4em] text-zinc-500">
              10ML
            </p>

            <h3 className="text-3xl font-black uppercase">
              Night
              <span className="block text-[#7a8fa3]">
                Energy
              </span>
            </h3>

            <p className="mt-6 text-sm leading-7 text-zinc-400">
              Your signature nightlife companion built for movement,
              fashion culture, social settings, and unforgettable presence.
            </p>

            <div className="mt-8">
              <span className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-zinc-500">
                Street Luxury
              </span>
            </div>
          </div>

          {/* 30ML */}
          <div className="p-10">
            <p className="mb-4 text-xs uppercase tracking-[0.4em] text-zinc-500">
              30ML
            </p>

            <h3 className="text-3xl font-black uppercase">
              Signature
              <span className="block text-[#c48b7a]">
                Presence
              </span>
            </h3>

            <p className="mt-6 text-sm leading-7 text-zinc-400">
              Refined glass bottle collection crafted for lasting elegance,
              shelf presence, and luxury fragrance identity.
            </p>

            <div className="mt-8">
              <span className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-zinc-500">
                Premium Collection
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}