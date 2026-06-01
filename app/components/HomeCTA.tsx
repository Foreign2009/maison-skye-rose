export default function HomeCTA() {
  return (
    <section className="bg-black py-24 text-white">
      <div className="mx-auto max-w-4xl px-6 text-center">

        <h2 className="text-5xl font-black">
          Discover Your Signature Scent
        </h2>

        <p className="mt-6 text-zinc-300">
          Explore 90+ featured fragrances and
          access over 465 luxury-inspired scents.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">

          <a
            href="/shop"
            className="rounded-full bg-white px-8 py-4 font-bold text-black"
          >
            Shop Collection
          </a>

          <a
            href="/quiz"
            className="rounded-full border border-white px-8 py-4 font-bold"
          >
            Take Fragrance Quiz
          </a>

        </div>

      </div>
    </section>
  );
}