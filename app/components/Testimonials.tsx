export default function Testimonials() {
  const reviews = [
    {
      name: "Cape Town Customer",
      review: "Smells incredibly close to the original and lasts all day.",
    },
    {
      name: "Johannesburg Customer",
      review: "Fast WhatsApp ordering and excellent service.",
    },
    {
      name: "Durban Customer",
      review: "The best inspired fragrances I've bought online.",
    },
  ];

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <p className="text-[11px] uppercase tracking-[0.45em] text-[#d89ca4]">
            Customer Reviews
          </p>
          <h2 className="mt-4 text-5xl font-black tracking-[-0.03em] text-[#4f4a52]">
            Loved By Our Community
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {reviews.map((review, idx) => (
            <div
              key={idx}
              className="group relative rounded-[32px] bg-[#faf7f5] p-10 transition hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)]"
            >
              <div className="text-2xl mb-4 text-[#d89ca4]">★★★★★</div>
              <p className="text-lg leading-relaxed text-zinc-600 italic">
                "{review.review}"
              </p>
              <div className="mt-8 flex items-center gap-3">
                <div className="h-1 w-8 bg-[#d89ca4]" />
                <p className="font-bold uppercase tracking-widest text-xs text-[#4f4a52]">
                  {review.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}