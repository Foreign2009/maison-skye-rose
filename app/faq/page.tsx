import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const faqs = [
  {
    question: "How long do the fragrances last?",
    answer:
      "Longevity varies by fragrance and skin type, but most fragrances last between 6 to 12 hours with proper application.",
  },
  {
    question: "What sizes are available?",
    answer:
      "We currently offer 5ml, 10ml and 30ml fragrance bottles.",
  },
  {
    question: "How do I place an order?",
    answer:
      "Simply add products to your cart and complete checkout through WhatsApp. We'll confirm your order and arrange delivery.",
  },
  {
    question: "Can I request a fragrance that is not on the website?",
    answer:
      "Yes. We have access to over 465 luxury-inspired fragrances. Contact us via WhatsApp and we'll source it for you.",
  },
  {
    question: "Do you deliver nationwide?",
    answer:
      "Yes. We deliver throughout South Africa with delivery costs based on your location.",
  },
  {
    question: "How much is delivery?",
    answer:
      "Cape Town Metro: R100, Western Cape Regional: R150, Johannesburg: R180, Durban: R180, Other Major Cities: R200 and Outlying Areas: R300.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Delivery times vary by location, but most orders are delivered within a few business days after confirmation.",
  },
  {
    question: "Are your fragrances original designer perfumes?",
    answer:
      "No. Maison Skye & Rose offers luxury-inspired fragrances crafted to capture the character of popular designer and niche scents.",
  },
];

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-[#faf7f5]">
      <Navbar />

      <section className="mx-auto max-w-5xl px-6 py-24">
        <p className="text-xs uppercase tracking-[0.45em] text-[#d89ca4]">
          Frequently Asked Questions
        </p>

        <h1 className="mt-4 text-6xl font-black tracking-[-0.05em] text-[#4f4a52]">
          FAQ
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-600">
          Everything you need to know about ordering,
          delivery and our fragrances.
        </p>

        <div className="mt-16 space-y-6">
          {faqs.map((faq) => (
            <div
              key={faq.question}
              className="rounded-[32px] bg-white p-8 shadow-sm"
            >
              <h2 className="text-xl font-black text-[#4f4a52]">
                {faq.question}
              </h2>

              <p className="mt-4 leading-8 text-zinc-600">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-[40px] bg-black p-10 text-center text-white">
          <h2 className="text-4xl font-black">
            Still Have Questions?
          </h2>

          <p className="mx-auto mt-6 max-w-2xl leading-8 text-zinc-300">
            Our team is ready to help you choose the perfect
            fragrance or answer any questions about your order.
          </p>

          <a
            href="https://wa.me/27696863952"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex rounded-full bg-white px-8 py-4 font-bold text-black"
          >
            Chat On WhatsApp
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}