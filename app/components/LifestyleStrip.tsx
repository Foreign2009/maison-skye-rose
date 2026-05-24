export default function LifestyleStrip() {
  return (
    <section className="px-6 pb-28">
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">

        {/* DAILY CARRY */}
        <div className="rounded-[36px] bg-[#e9e3db] p-8 text-[#1a1a1a]">

          <p className="mb-4 text-xs uppercase tracking-[0.35em] text-zinc-500">
            Everyday Lifestyle
          </p>

          <h3 className="text-4xl font-black uppercase leading-[0.95]">
            Daily
            <span className="block text-[#7a8fa3]">
              Carry
            </span>
          </h3>

          <p className="mt-6 text-sm leading-7 text-zinc-600">
            Pocket fragrances designed for handbags,
            cars, gym bags, coffee runs, travel,
            and everyday confidence.
          </p>

          <div className="mt-10 flex gap-3">
            <span className="rounded-full bg-white px-4 py-2 text-xs uppercase tracking-[0.2em]">
              5ML
            </span>

            <span className="rounded-full bg-white px-4 py-2 text-xs uppercase tracking-[0.2em]">
              Pocket Luxury
            </span>
          </div>
        </div>

        {/* NIGHT OUT */}
        <div className="rounded-[36px] bg-[#dfe7ef] p-8 text-[#1a1a1a]">

          <p className="mb-4 text-xs uppercase tracking-[0.35em] text-[#5f7386]">
            Social Energy
          </p>

          <h3 className="text-4xl font-black uppercase leading-[0.95]">
            Night
            <span className="block text-[#5f7386]">
              Out
            </span>
          </h3>

          <p className="mt-6 text-sm leading-7 text-[#4f5d6b]">
            Built for compliments, confidence,
            nightlife, fashion, dates, and
            unforgettable presence.
          </p>

          <div className="mt-10 flex gap-3">
            <span className="rounded-full bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.2em]">
              10ML
            </span>

            <span className="rounded-full bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.2em]">
              Confidence
            </span>
          </div>
        </div>

        {/* ACCESSIBLE LUXURY */}
        <div className="rounded-[36px] bg-[#f2deda] p-8 text-[#1a1a1a]">

          <p className="mb-4 text-xs uppercase tracking-[0.35em] text-[#b67d73]">
            Luxury For Everyone
          </p>

          <h3 className="text-4xl font-black uppercase leading-[0.95]">
            Smell
            <span className="block text-[#b67d73]">
              Expensive
            </span>
          </h3>

          <p className="mt-6 text-sm leading-7 text-[#8f6f69]">
            Luxury-inspired fragrances created to
            make premium scent culture more accessible,
            wearable, and enjoyable daily.
          </p>

          <div className="mt-10 flex gap-3">
            <span className="rounded-full bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.2em]">
              30ML
            </span>

            <span className="rounded-full bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.2em]">
              Signature
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}