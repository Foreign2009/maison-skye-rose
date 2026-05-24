import Navbar from "../components/Navbar";
import MiniCart from "../components/MiniCart";
import Footer from "../components/Footer";

const faqs = [
  {
    question: "Are these original fragrances?",
    answer:
      "Maison Skye & Rose offers luxury-inspired fragrances crafted to capture the experience and character of globally loved scent profiles.",
  },

  {
    question: "How long do the fragrances last?",
    answer:
      "Fragrance longevity can vary depending on skin type, weather, fragrance composition, and application. Notes such as oud, vanilla, amber, musk, woods, and spices generally last longer than lighter citrus or aquatic notes.",
  },

  {
    question: "What sizes are available?",
    answer:
      "Most fragrances are available in 5ml, 10ml, and 30ml sizes. Our smaller atomizers are ideal for travel, pockets, handbags, and testing new fragrances.",
  },

  {
    question: "Do you deliver across South Africa?",
    answer:
      "Yes. Maison Skye & Rose delivers nationwide across South Africa.",
  },

  {
    question: "How does WhatsApp ordering work?",
    answer:
      "Simply add products to your cart and checkout through WhatsApp. Your order summary will automatically be generated for quick and easy ordering.",
  },

  {
    question: "What makes Maison Skye & Rose different?",
    answer:
      "Maison Skye & Rose combines accessible luxury with modern fragrance lifestyle culture — blending confidence, fashion, nightlife, travel, and self-expression into everyday fragrance experiences.",
  },

  {
    question: "Which fragrance notes last longer?",
    answer:
      "Typically, oud, amber, vanilla, musk, sandalwood, patchouli, leather, and spicy notes remain noticeable longer than fresh citrus or aquatic notes.",
  },

  {
    question: "Are your fragrances suitable for daily wear?",
    answer:
      "Yes. Our collections are curated for everyday confidence, lifestyle versatility, nightlife, seasonal moods, and signature daily scent rotations.",
  },
];

export default function FAQPage() {

  return (
    <main className="min-h-screen bg-[#f5f1eb] text-[#1a1a1a]">

      <Navbar />
      <MiniCart />

      {/* HERO */}
      <section className="relative overflow-hidden px-6 pb-20 pt-24">

        {/* BLOBS */}
        <div className="absolute left-[-100px] top-[100px] h-[240px] w-[240px] rounded-full bg-[#dfe7ef]/60 blur-[120px]" />

        <div className="absolute right-[-100px] top-[180px] h-[240px] w-[240px] rounded-full bg-[#f2deda]/70 blur-[120px]" />

        <div className="relative mx-auto max-w-5xl text-center">

          <p className="mb-5 text-sm uppercase tracking-[0.35em] text-zinc-500">
            Maison Skye & Rose
          </p>

          <h1 className="text-5xl font-black uppercase leading-[0.95] tracking-[-0.05em] md:text-7xl">
            Frequently Asked
            <span className="block text-[#7a8fa3]">
              Questions
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-zinc-600">
            Everything you need to know about Maison Skye & Rose,
            fragrance sizing, delivery, ordering, and fragrance experience.
          </p>

        </div>

      </section>

      {/* FAQS */}
      <section className="px-6 pb-32">

        <div className="mx-auto max-w-5xl space-y-6">

          {faqs.map((faq, index) => (

            <div
              key={index}
              className="rounded-[32px] bg-white p-8 shadow-sm"
            >

              <h2 className="text-2xl font-black tracking-[-0.03em]">
                {faq.question}
              </h2>

              <p className="mt-5 text-base leading-8 text-zinc-600">
                {faq.answer}
              </p>

            </div>

          ))}

        </div>

      </section>

      <Footer />

    </main>
  );
}