import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#faf7f5]">
      <Navbar />

      <section className="mx-auto max-w-5xl px-6 py-24">
        <p className="text-xs uppercase tracking-[0.45em] text-[#d89ca4]">
          Legal
        </p>

        <h1 className="mt-4 text-6xl font-black tracking-[-0.05em] text-[#4f4a52]">
          Terms & Conditions
        </h1>

        <p className="mt-8 text-lg leading-8 text-zinc-600">
          Last Updated: May 2026
        </p>

        <div className="mt-16 space-y-12">

          <div className="rounded-[32px] bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-black text-[#4f4a52]">
              Introduction
            </h2>

            <p className="mt-4 leading-8 text-zinc-600">
              By accessing and using the Maison Skye & Rose website,
              you agree to these Terms & Conditions. Please read them
              carefully before placing an order.
            </p>
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-black text-[#4f4a52]">
              Product Information
            </h2>

            <p className="mt-4 leading-8 text-zinc-600">
              Maison Skye & Rose offers luxury-inspired fragrances.
              Our products are inspired by popular designer and niche
              fragrances but are not affiliated with, endorsed by, or
              manufactured by the original brands.
            </p>
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-black text-[#4f4a52]">
              Pricing
            </h2>

            <p className="mt-4 leading-8 text-zinc-600">
              All prices are displayed in South African Rand (ZAR)
              and include VAT where applicable. Prices may change
              without prior notice.
            </p>
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-black text-[#4f4a52]">
              Orders & Payment
            </h2>

            <p className="mt-4 leading-8 text-zinc-600">
              Orders are confirmed once payment has been received and
              verified. Maison Skye & Rose reserves the right to
              decline or cancel any order where necessary.
            </p>
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-black text-[#4f4a52]">
              Delivery
            </h2>

            <p className="mt-4 leading-8 text-zinc-600">
              Delivery times provided are estimates only and may vary
              depending on location, courier performance and external
              circumstances. Maison Skye & Rose cannot guarantee
              specific delivery dates.
            </p>
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-black text-[#4f4a52]">
              Returns & Refunds
            </h2>

            <p className="mt-4 leading-8 text-zinc-600">
              If your order arrives damaged or incorrect, please
              contact us within 48 hours of receiving your parcel.
              Each case will be reviewed individually.
            </p>
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-black text-[#4f4a52]">
              Intellectual Property
            </h2>

            <p className="mt-4 leading-8 text-zinc-600">
              All website content, branding, text, logos and designs
              remain the property of Maison Skye & Rose and may not be
              copied, reproduced or distributed without permission.
            </p>
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-black text-[#4f4a52]">
              Contact
            </h2>

            <p className="mt-4 leading-8 text-zinc-600">
              For any questions regarding these Terms & Conditions,
              please contact us via WhatsApp.
            </p>

            <p className="mt-4 font-bold text-[#4f4a52]">
              +27 69 686 3952
            </p>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}