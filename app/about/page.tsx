import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#faf7f5]">
      <Navbar />

      <section className="mx-auto max-w-5xl px-6 py-24">

        <p className="text-xs uppercase tracking-[0.45em] text-[#d89ca4]">
          Our Story
        </p>

        <h1 className="mt-4 text-6xl font-black tracking-[-0.05em]">
          Maison Skye & Rose
        </h1>

        <div className="mt-12 space-y-8 text-lg leading-9 text-zinc-600">

          <p>
            Maison Skye & Rose was created from a passion for
            luxury fragrances and the desire to make premium
            scent experiences accessible to everyone.
          </p>

          <p>
            Named after Skye and Rose, our brand represents
            confidence, elegance, individuality and timeless style.
          </p>

          <p>
            We carefully source quality fragrance oils inspired
            by some of the world's most loved designer and niche
            fragrances.
          </p>

          <p>
            Today we offer a growing catalogue of over
            465 luxury-inspired fragrances available throughout
            South Africa.
          </p>

        </div>

      </section>

      <Footer />
    </main>
  );
}