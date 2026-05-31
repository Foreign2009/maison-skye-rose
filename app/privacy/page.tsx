import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#faf7f5]">
      <Navbar />

      <section className="mx-auto max-w-5xl px-6 py-24">
        <p className="text-xs uppercase tracking-[0.45em] text-[#d89ca4]">
          Legal
        </p>

        <h1 className="mt-4 text-6xl font-black tracking-[-0.05em] text-[#4f4a52]">
          Privacy Policy
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
              Maison Skye & Rose respects your privacy and is committed
              to protecting your personal information. This policy explains
              how we collect, use and protect information provided when
              using our website or placing an order.
            </p>
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-black text-[#4f4a52]">
              Information We Collect
            </h2>

            <p className="mt-4 leading-8 text-zinc-600">
              We may collect information such as:
            </p>

            <ul className="mt-4 space-y-3 text-zinc-600">
              <li>• Full Name</li>
              <li>• Contact Number</li>
              <li>• Delivery Address</li>
              <li>• Order Information</li>
              <li>• Communication through WhatsApp</li>
            </ul>
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-black text-[#4f4a52]">
              How We Use Your Information
            </h2>

            <ul className="mt-4 space-y-3 text-zinc-600">
              <li>• Process and fulfil orders</li>
              <li>• Arrange delivery</li>
              <li>• Provide customer support</li>
              <li>• Respond to fragrance requests</li>
              <li>• Improve our services</li>
            </ul>
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-black text-[#4f4a52]">
              Information Sharing
            </h2>

            <p className="mt-4 leading-8 text-zinc-600">
              Maison Skye & Rose does not sell your personal
              information. Information may only be shared with
              delivery partners or service providers when necessary
              to fulfil your order.
            </p>
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-black text-[#4f4a52]">
              Data Security
            </h2>

            <p className="mt-4 leading-8 text-zinc-600">
              We take reasonable measures to protect customer
              information and limit access to authorised parties
              only.
            </p>
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-black text-[#4f4a52]">
              Contact Us
            </h2>

            <p className="mt-4 leading-8 text-zinc-600">
              If you have any questions regarding this Privacy Policy,
              please contact us through WhatsApp at:
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