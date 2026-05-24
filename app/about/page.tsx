import Navbar from "../components/Navbar";
import MiniCart from "../components/MiniCart";
import Footer from "../components/Footer";

export default function AboutPage() {

  return (
    <main className="min-h-screen bg-[#f5f1eb] text-[#1a1a1a]">

      <Navbar />
      <MiniCart />

      {/* HERO */}
      <section className="relative overflow-hidden px-6 pb-24 pt-24">

        {/* BACKGROUND BLOBS */}
        <div className="absolute left-[-100px] top-[80px] h-[240px] w-[240px] rounded-full bg-[#dfe7ef]/60 blur-[120px]" />

        <div className="absolute right-[-100px] top-[160px] h-[240px] w-[240px] rounded-full bg-[#f2deda]/70 blur-[120px]" />

        <div className="relative mx-auto max-w-6xl text-center">

          <p className="mb-5 text-sm uppercase tracking-[0.35em] text-zinc-500">
            Maison Skye & Rose
          </p>

          <h1 className="text-5xl font-black uppercase leading-[0.95] tracking-[-0.05em] md:text-7xl">
            Fragrance
            <span className="block text-[#7a8fa3]">
              For Real Life
            </span>
          </h1>

          <p className="mx-auto mt-10 max-w-3xl text-lg leading-8 text-zinc-600">
            Maison Skye & Rose was created to make luxury-inspired
            fragrance culture more accessible, modern, and connected
            to everyday lifestyle energy.
          </p>

        </div>

      </section>

      {/* STORY */}
      <section className="px-6 pb-28">

        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2">

          {/* LEFT */}
          <div className="rounded-[40px] bg-white p-10">

            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-zinc-500">
              Our Philosophy
            </p>

            <h2 className="text-4xl font-black uppercase leading-[1] tracking-[-0.04em]">
              Confidence
              <span className="block text-[#b67d73]">
                Through Fragrance
              </span>
            </h2>

            <p className="mt-8 text-base leading-8 text-zinc-600">
              We believe fragrance should feel exciting, expressive,
              wearable, and part of everyday lifestyle — not reserved
              only for luxury boutiques or unreachable pricing.
            </p>

            <p className="mt-6 text-base leading-8 text-zinc-600">
              From nightlife to travel, daily wear to unforgettable
              moments, Maison Skye & Rose is built around fragrance
              experiences that move with modern life.
            </p>

          </div>

          {/* RIGHT */}
          <div className="rounded-[40px] bg-[#ece7df] p-10">

            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-zinc-500">
              The Experience
            </p>

            <h2 className="text-4xl font-black uppercase leading-[1] tracking-[-0.04em]">
              Everyday
              <span className="block text-[#7a8fa3]">
                Luxury Energy
              </span>
            </h2>

            <div className="mt-8 space-y-5">

              <div className="rounded-[24px] bg-white p-5">
                Travel-friendly fragrance sizes
              </div>

              <div className="rounded-[24px] bg-white p-5">
                Curated lifestyle-inspired collections
              </div>

              <div className="rounded-[24px] bg-white p-5">
                Fresh, sweet, oud, bold, and seasonal moods
              </div>

              <div className="rounded-[24px] bg-white p-5">
                Modern fragrances for him and her
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* CLOSING */}
      <section className="px-6 pb-32">

        <div className="mx-auto max-w-5xl rounded-[50px] bg-black px-10 py-20 text-center text-white">

          <p className="text-sm uppercase tracking-[0.35em] text-white/60">
            Maison Skye & Rose
          </p>

          <h2 className="mt-6 text-5xl font-black uppercase tracking-[-0.04em]">
            Crafted For
            <span className="block text-[#d8b6ad]">
              Everyday Confidence
            </span>
          </h2>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-white/70">
            Luxury-inspired fragrances designed to move with your
            lifestyle, energy, and identity.
          </p>

        </div>

      </section>

      <Footer />

    </main>
  );
}