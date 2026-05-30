"use client";

export default function ScentEducationCard() {

  return (

    <div
      className="
        mt-12
        rounded-[32px]
        border
        border-white/40
        bg-white/80
        p-8
        shadow-[0_20px_60px_rgba(0,0,0,0.08)]
      "
    >

      <h3
        className="
          text-3xl
          font-black
          text-[#4f4a52]
        "
      >
        Understanding Your Fragrance
      </h3>

      <p
        className="
          mt-4
          leading-8
          text-[#7b7480]
        "
      >
        Every fragrance evolves over
        time and creates a scent
        journey unique to the wearer.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-3">

        <div>

          <h4 className="font-bold text-[#4f4a52]">

            Opening Character

          </h4>

          <p className="mt-2 text-sm text-[#7b7480]">

            Bright notes such as citrus,
            bergamot and fresh accords
            create the first impression.

          </p>

        </div>

        <div>

          <h4 className="font-bold text-[#4f4a52]">

            Heart Character

          </h4>

          <p className="mt-2 text-sm text-[#7b7480]">

            Florals, spices and aromatic
            notes create the fragrance's
            personality.

          </p>

        </div>

        <div>

          <h4 className="font-bold text-[#4f4a52]">

            Base Impression

          </h4>

          <p className="mt-2 text-sm text-[#7b7480]">

            Woods, musks, amber and
            vanilla create depth and
            richness.

          </p>

        </div>

      </div>

    </div>

  );

}