"use client";

type RecentlyViewedProps = {
  viewed: string[];
};

export default function RecentlyViewed({
  viewed,
}: RecentlyViewedProps) {

  if (viewed.length === 0) return null;

  return (
    <section className="px-6 pb-20">

      <div className="mx-auto max-w-7xl">

        <div className="mb-10">

          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-zinc-500">
            Your Journey
          </p>

          <h2 className="text-4xl font-black uppercase tracking-[-0.03em] md:text-5xl">
            Recently Viewed
          </h2>

        </div>

        <div className="flex flex-wrap gap-4">

          {viewed.map((item) => (

            <div
              key={item}
              className="rounded-full bg-white px-6 py-4 text-sm uppercase tracking-[0.2em] shadow-sm"
            >
              {item}
            </div>

          ))}

        </div>

      </div>

    </section>
  );
}