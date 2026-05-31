export default function Reviews() {
  const reviews = [
    {
      name: "Aaliyah",
      review:
        "The quality shocked me. Lasted all day and smelled incredibly close to the original.",
    },
    {
      name: "Jason",
      review:
        "Fast delivery and amazing scent performance. Definitely ordering again.",
    },
    {
      name: "Tyrone",
      review:
        "Best value fragrance purchase I've made this year.",
    },
    {
      name: "Megan",
      review:
        "Received so many compliments wearing my fragrance.",
    },
    {
      name: "Daniel",
      review:
        "Excellent service and communication via WhatsApp.",
    },
  ];

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-12 text-center">
          <p className="text-xs uppercase tracking-[0.45em] text-[#d89ca4]">
            Customer Love
          </p>

          <h2 className="mt-4 text-5xl font-black tracking-[-0.05em]">
            What Customers Say
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <div
              key={review.name}
              className="rounded-[32px] bg-[#faf7f5] p-8"
            >
              <div className="mb-4 text-lg text-amber-500">
                ★★★★★
              </div>

              <p className="leading-8 text-zinc-600">
                "{review.review}"
              </p>

              <p className="mt-6 font-bold">
                {review.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}