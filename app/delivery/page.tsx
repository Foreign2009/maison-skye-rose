import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const deliveryRates = [
  {
    area: "Cape Town Metro",
    price: "R100",
  },
  {
    area: "Western Cape Regional",
    price: "R150",
  },
  {
    area: "Johannesburg",
    price: "R180",
  },
  {
    area: "Durban",
    price: "R180",
  },
  {
    area: "Other Major Cities",
    price: "R200",
  },
  {
    area: "Outlying Areas",
    price: "R300",
  },
];

export default function DeliveryPage() {
  return (
    <main className="min-h-screen bg-[#faf7f5]">
      <Navbar />

      <section className="mx-auto max-w-5xl px-6 py-24">
        <p className="text-xs uppercase tracking-[0.45em] text-[#d89ca4]">
          Delivery Information
        </p>

        <h1 className="mt-4 text-6xl font-black tracking-[-0.05em] text-[#4f4a52]">
          Delivery &
          <br />
          Shipping
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-600">
          We deliver nationwide throughout South Africa.
          Delivery costs are calculated based on your location.
        </p>

        <div className="mt-16 rounded-[40px] bg-white p-8 shadow-sm">
          <h2 className="text-3xl font-black text-[#4f4a52]">
            Delivery Rates
          </h2>

          <div className="mt-8 space-y-4">
            {deliveryRates.map((item) => (
              <div
                key={item.area}
                className="flex items-center justify-between border-b border-zinc-100 pb-4"
              >
                <span className="font-medium text-zinc-700">
                  {item.area}
                </span>

                <span className="font-black text-[#4f4a52]">
                  {item.price}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 rounded-[40px] bg-white p-8 shadow-sm">
          <h2 className="text-3xl font-black text-[#4f4a52]">
            Estimated Delivery Times
          </h2>

          <div className="mt-6 space-y-4 text-zinc-600 leading-8">
            <p>
              • Orders are processed once payment has been confirmed.
            </p>

            <p>
              • Cape Town deliveries typically arrive within
              1–3 business days after dispatch.
            </p>

            <p>
              • Major cities typically arrive within
              2–5 business days after dispatch.
            </p>

            <p>
              • Regional and outlying areas may take
              3–7 business days after dispatch.
            </p>

            <p>
              • Delivery times may vary during peak periods
              and are dependent on courier operations.
            </p>
          </div>
        </div>

        <div className="mt-10 rounded-[40px] bg-black p-10 text-center text-white">
          <p className="text-xs uppercase tracking-[0.45em] text-[#d89ca4]">
            Need Assistance?
          </p>

          <h2 className="mt-4 text-4xl font-black">
            We're Here To Help
          </h2>

          <p className="mx-auto mt-6 max-w-2xl leading-8 text-zinc-300">
            Contact us on WhatsApp if you need assistance
            with delivery estimates, fragrance requests or
            order support.
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