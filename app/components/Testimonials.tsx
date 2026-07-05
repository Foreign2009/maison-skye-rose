const reviews = [
  {
    location: "Cape Town",
    review:
      "I started with one 5ml and now I have a full wardrobe. Maison has completely changed how I think about fragrance.",
  },
  {
    location: "Johannesburg",
    review:
      "The Concierge helped me find exactly what I was looking for within minutes. It felt like talking to someone who genuinely knows fragrance.",
  },
  {
    location: "Durban",
    review:
      "The quality, the curation, the experience — exceptional. This is not your average fragrance purchase.",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.55em] text-[#d89ca4]">
            The Maison Community
          </p>
          <h2 className="mt-4 text-3xl md:text-5xl font-black tracking-[-0.04em] text-[#4f4a52]">
            Loved Across South Africa
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((review) => (
            <div
              key={review.location}
              className="rounded-[24px] bg-white border border-[#f0ebe8] p-8 md:p-10"
            >
              <div className="flex gap-0.5 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} width="14" height="14" viewBox="0 0 14 14" fill="#d89ca4" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 0.5L8.545 5.045H13.318L9.386 7.91L10.932 12.455L7 9.59L3.068 12.455L4.614 7.91L0.682 5.045H5.455L7 0.5Z" />
                  </svg>
                ))}
              </div>
              <p className="text-base leading-relaxed text-[#4f4a52]">
                &ldquo;{review.review}&rdquo;
              </p>
              <div className="mt-8 flex items-center gap-3">
                <div className="h-px w-8 bg-[#d89ca4]" />
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9b9298]">
                  {review.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
