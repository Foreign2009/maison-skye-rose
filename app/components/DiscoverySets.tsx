const sets = [

  {
    title: "Men’s Starter Set",
    mood: "Fresh • Bold • Everyday",
    description:
      "A curated introduction to modern masculine fragrance energy.",
    includes: [
      "Inspired by Sauvage",
      "Inspired by Aventus",
      "Inspired by Erba Pura",
    ],
    price: "R349",
  },

  {
    title: "Date Night Set",
    mood: "Sweet • Seductive • Luxury",
    description:
      "Warm addictive fragrances crafted for nightlife and confidence.",
    includes: [
      "Inspired by Baccarat Rouge 540",
      "Inspired by Black Opium",
      "Inspired by Good Girl",
    ],
    price: "R399",
  },

  {
    title: "Summer Rotation",
    mood: "Fresh • Tropical • Bright",
    description:
      "Fresh lifestyle fragrances ideal for warm weather and travel.",
    includes: [
      "Inspired by God of Fire",
      "Inspired by Libre",
      "Inspired by Erba Pura",
    ],
    price: "R379",
  },

];

export default function DiscoverySets() {

  return (
    <section className="px-6 pb-28">

      <div className="mx-auto max-w-7xl">

        <div className="mb-14">

          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-zinc-500">
            Curated Fragrance Bundles
          </p>

          <h2 className="text-4xl font-black uppercase tracking-[-0.03em] md:text-6xl">
            Discovery
            <span className="block text-[#7a8fa3]">
              Sets
            </span>
          </h2>

        </div>

        <div className="grid gap-6 md:grid-cols-3">

          {sets.map((set, index) => (

            <div
              key={index}
              className="rounded-[40px] bg-white p-8 shadow-sm"
            >

              <p className="mb-3 text-xs uppercase tracking-[0.3em] text-zinc-500">
                {set.mood}
              </p>

              <h3 className="text-3xl font-black uppercase leading-[1] tracking-[-0.04em]">
                {set.title}
              </h3>

              <p className="mt-5 text-sm leading-7 text-zinc-600">
                {set.description}
              </p>

              <div className="mt-8 space-y-3">

                {set.includes.map((item, itemIndex) => (

                  <div
                    key={itemIndex}
                    className="rounded-[18px] bg-[#f5f1eb] px-4 py-3 text-sm"
                  >
                    {item}
                  </div>

                ))}

              </div>

              <div className="mt-8 flex items-end justify-between border-t border-black/5 pt-6">

                <div>

                  <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                    Bundle Price
                  </p>

                  <h4 className="mt-2 text-4xl font-black text-[#b67d73]">
                    {set.price}
                  </h4>

                </div>

                <button className="rounded-full bg-black px-6 py-4 text-xs uppercase tracking-[0.25em] text-white">
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