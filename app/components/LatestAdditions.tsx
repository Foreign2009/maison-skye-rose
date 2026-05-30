"use client";

const latestAdditions = [
  "Eclaire Inspired",
  "Libre Vanille Couture Inspired",
  "Bleu de Chanel L'Exclusif Inspired",
  "Paradigme Inspired",
  "Haltane Inspired",
  "Oud Bouquet Inspired",
  "Decision Inspired",
  "Hibiscus Mahajad Inspired",
  "Kirke Overdose Inspired",
  "City of Stars Inspired",
  "Rose of No Man's Land Inspired",
  "Dynasty Inspired",
];

export default function LatestAdditions() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">

        <p className="text-xs uppercase tracking-[0.4em] text-[#b67d73]">
          Maison Skye & Rose
        </p>

        <h2 className="mt-4 text-5xl font-black uppercase">
          Latest Additions
        </h2>

        <p className="mt-6 max-w-2xl text-zinc-600">
          Recently added luxury inspirations curated for our collection.
        </p>

        <div className="mt-12 grid gap-4 md:grid-cols-3 lg:grid-cols-4">

          {latestAdditions.map((item) => (
            <div
              key={item}
              className="rounded-3xl border border-black/5 bg-[#faf7f5] p-5"
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