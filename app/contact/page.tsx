import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#faf7f5]">
      <Navbar />

      <section className="mx-auto max-w-5xl px-6 py-24">

        <p className="text-xs uppercase tracking-[0.45em] text-[#d89ca4]">
          Contact Us
        </p>

        <h1 className="mt-4 text-6xl font-black tracking-[-0.05em] text-[#4f4a52]">
          Let's Find Your
          <br />
          Signature Scent
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-600">
          Whether you're looking for a specific fragrance,
          need help choosing a scent, or have a question about
          your order, we're here to help.
        </p>

        <div className="mt-16 grid gap-8 md:grid-cols-2">

          <div className="rounded-[32px] bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-black text-[#4f4a52]">
              WhatsApp Orders
            </h2>

            <p className="mt-4 text-zinc-600 leading-7">
              Place orders, request fragrances, and get support
              directly through WhatsApp.
            </p>

            <a
              href="https://wa.me/27696863952"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex rounded-full bg-black px-6 py-3 text-white font-semibold"
            >
              Message Us
            </a>
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-black text-[#4f4a52]">
              Contact Details
            </h2>

            <div className="mt-6 space-y-4 text-zinc-600">

              <p>
                <span className="font-semibold text-[#4f4a52]">
                  WhatsApp:
                </span>
                <br />
                +27 69 686 3952
              </p>

              <p>
                <span className="font-semibold text-[#4f4a52]">
                  Location:
                </span>
                <br />
                Cape Town, South Africa
              </p>

              <p>
                <span className="font-semibold text-[#4f4a52]">
                  Catalogue:
                </span>
                <br />
                465+ Luxury-Inspired Fragrances
              </p>

            </div>
          </div>

        </div>

        <div className="mt-12 rounded-[40px] bg-black p-10 text-center text-white">

          <p className="text-xs uppercase tracking-[0.45em] text-[#d89ca4]">
            Looking For Something Specific?
          </p>

          <h2 className="mt-4 text-4xl font-black">
            Request Any Fragrance
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-zinc-300 leading-8">
            Can't find your fragrance on our website?
            We source from a catalogue of over 465 luxury-inspired
            fragrances available on request.
          </p>

          <a
            href="https://wa.me/27696863952?text=Hi%20Maison%20Skye%20%26%20Rose,%20I%20am%20looking%20for%20a%20specific%20fragrance."
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex rounded-full bg-white px-8 py-4 font-bold text-black"
          >
            Request A Fragrance
          </a>

        </div>

      </section>

      <Footer />
    </main>
  );
}