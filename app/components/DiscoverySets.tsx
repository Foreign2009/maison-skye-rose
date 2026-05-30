"use client";

const sets = [
  {
    title:
      "Modern Gentleman Set",

    fragrances: [
      "Sauvage Inspired",
      "Bleu Inspired",
      "Aventus Inspired",
      "Imagination Inspired",
    ],

    price: "R499",
  },

  {
    title:
      "Date Night Set",

    fragrances: [
      "Ultra Male Inspired",
      "Eros Inspired",
      "Stronger With You Inspired",
      "Most Wanted Inspired",
    ],

    price: "R499",
  },

  {
    title:
      "Luxury Women's Set",

    fragrances: [
      "Delina Inspired",
      "Libre Inspired",
      "Good Girl Inspired",
      "Baccarat Rouge Inspired",
    ],

    price: "R499",
  },
];

export default function DiscoverySets() {
  return (
    <section className="px-5 py-24">

      <div className="mx-auto max-w-7xl">

        <div className="mb-12 text-center">

          <p className="text-[11px] uppercase tracking-[0.45em] text-[#d89ca4]">
            Discovery Sets
          </p>

          <h2 className="mt-4 text-5xl font-black tracking-[-0.06em] text-[#4f4a52]">
            Explore More Fragrances
          </h2>

        </div>

        <div className="grid gap-6 lg:grid-cols-3">

          {sets.map((set) => (

            <div
              key={set.title}
              className="
                rounded-[32px]
                bg-white
                p-8
                shadow-[0_20px_60px_rgba(0,0,0,0.08)]
              "
            >

              <h3 className="text-2xl font-black text-[#4f4a52]">
                {set.title}
              </h3>

              <ul className="mt-6 space-y-2 text-[#7b7480]">

                {set.fragrances.map(
                  (item) => (

                    <li key={item}>
                      • {item}
                    </li>

                  )
                )}

              </ul>

              <div className="mt-8 flex items-center justify-between">

                <span className="text-2xl font-black text-[#4f4a52]">
                  {set.price}
                </span>

                <button
                  className="
                    rounded-full
                    bg-gradient-to-r
                    from-pink-400
                    to-blue-400
                    px-6
                    py-3
                    text-white
                    font-bold
                  "
                >
                  View Set
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}