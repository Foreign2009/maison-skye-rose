"use client";

const comingSoon = [
  "God of Fire Inspired",
  "Babycat Inspired",
  "Musk Therapy Inspired",
  "Guidance Inspired",
  "Paragon Inspired",
  "Greenley Inspired",
  "Althair Inspired",
  "Vanilla Powder Inspired",
  "Mango Aoud Inspired",
  "Triumph of Bacchus Inspired",
];

export default function ComingSoon() {
  return (
    <section className="bg-[#f5f1eb] py-24">
      <div className="mx-auto max-w-7xl px-6">

        <p className="text-xs uppercase tracking-[0.4em] text-[#7a8fa3]">
          Future Releases
        </p>

        <h2 className="mt-4 text-5xl font-black uppercase">
          Coming Soon
        </h2>

        <div className="mt-12 grid gap-4 md:grid-cols-3 lg:grid-cols-5">

          {comingSoon.map((item) => (
            <div
              key={item}
              className="rounded-3xl bg-white p-5 shadow-sm"
            >
              <p className="font-bold">
                {item}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}