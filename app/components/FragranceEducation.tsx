export default function FragranceEducation() {
  return (
    <section className="px-6 pb-28">
      <div className="mx-auto max-w-7xl">

        {/* HEADING */}
        <div className="mb-16 text-center">

          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-zinc-500">
            Understanding Fragrance
          </p>

          <h2 className="text-4xl font-black uppercase tracking-[-0.03em] md:text-6xl">
            Learn Your
            <span className="block text-[#7a8fa3]">
              Scent Profile
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-zinc-600">
            Every fragrance evolves differently depending on the notes,
            composition, weather, skin chemistry, and environment.
            Understanding fragrance notes helps you discover scents
            that better match your lifestyle, mood, and personal energy.
          </p>

        </div>

        {/* NOTES GRID */}
        <div className="grid gap-6 md:grid-cols-3">

          {/* TOP NOTES */}
          <div className="rounded-[36px] bg-[#dfe7ef] p-8">

            <p className="mb-4 text-xs uppercase tracking-[0.35em] text-[#5f7386]">
              Top Notes
            </p>

            <h3 className="text-4xl font-black uppercase leading-[0.95] text-[#3e4d5c]">
              First
              <span className="block">
                Impression
              </span>
            </h3>

            <p className="mt-6 text-sm leading-7 text-[#4f5d6b]">
              The opening scent profile you notice first.
              Often fresh, bright, energetic, and lighter in feel.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <span className="rounded-full bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.2em]">
                Citrus
              </span>

              <span className="rounded-full bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.2em]">
                Fresh
              </span>

              <span className="rounded-full bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.2em]">
                Clean
              </span>
            </div>
          </div>

          {/* HEART NOTES */}
          <div className="rounded-[36px] bg-[#f3e3e4] p-8">

            <p className="mb-4 text-xs uppercase tracking-[0.35em] text-[#b67d73]">
              Heart Notes
            </p>

            <h3 className="text-4xl font-black uppercase leading-[0.95] text-[#8f6f69]">
              Main
              <span className="block">
                Personality
              </span>
            </h3>

            <p className="mt-6 text-sm leading-7 text-[#8f6f69]">
              The core scent profile that develops after the opening settles,
              shaping the fragrance character and emotional feel.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <span className="rounded-full bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.2em]">
                Floral
              </span>

              <span className="rounded-full bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.2em]">
                Sweet
              </span>

              <span className="rounded-full bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.2em]">
                Spicy
              </span>
            </div>
          </div>

          {/* BASE NOTES */}
          <div className="rounded-[36px] bg-[#e9e3db] p-8">

            <p className="mb-4 text-xs uppercase tracking-[0.35em] text-[#6d5d53]">
              Base Notes
            </p>

            <h3 className="text-4xl font-black uppercase leading-[0.95] text-[#5e5048]">
              Deeper
              <span className="block">
                Presence
              </span>
            </h3>

            <p className="mt-6 text-sm leading-7 text-zinc-600">
              Richer fragrance notes that give depth, warmth,
              smoothness, and stronger lingering scent character.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <span className="rounded-full bg-white px-4 py-2 text-xs uppercase tracking-[0.2em]">
                Oud
              </span>

              <span className="rounded-full bg-white px-4 py-2 text-xs uppercase tracking-[0.2em]">
                Amber
              </span>

              <span className="rounded-full bg-white px-4 py-2 text-xs uppercase tracking-[0.2em]">
                Musk
              </span>
            </div>
          </div>

        </div>

        {/* EDUCATION STRIP */}
        <div className="mt-8 rounded-[40px] bg-[#1a1a1a] p-10 text-white">

          <div className="grid gap-10 md:grid-cols-2">

            <div>
              <p className="mb-4 text-xs uppercase tracking-[0.35em] text-zinc-500">
                Fragrance Knowledge
              </p>

              <h3 className="text-4xl font-black uppercase leading-[0.95]">
                Why Some
                <span className="block text-[#c48b7a]">
                  Fragrances Feel Stronger
                </span>
              </h3>
            </div>

            <div>
              <p className="text-sm leading-8 text-zinc-400">
                Fragrance experience can vary depending on scent composition,
                weather, skin chemistry, clothing, and fragrance notes.
                Richer notes such as oud, amber, woods, vanilla, and musk
                often create a deeper and warmer scent presence,
                while citrus and fresh notes usually feel brighter,
                cleaner, and lighter.
              </p>
            </div>

          </div>

          {/* LONGER LASTING NOTES */}
          <div className="mt-12 grid gap-6 md:grid-cols-2">

            {/* LONGER LASTING */}
            <div className="rounded-[30px] bg-white/[0.04] p-8">

              <p className="mb-4 text-xs uppercase tracking-[0.35em] text-[#c48b7a]">
                Common Longer Wearing Notes
              </p>

              <h4 className="text-3xl font-black uppercase leading-[0.95]">
                Rich &
                <span className="block">
                  Deep Notes
                </span>
              </h4>

              <p className="mt-6 text-sm leading-7 text-zinc-400">
                Fragrances containing richer and heavier notes often feel
                warmer, deeper, and more noticeable over time due to their composition.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <span className="rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em]">
                  Oud
                </span>

                <span className="rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em]">
                  Amber
                </span>

                <span className="rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em]">
                  Musk
                </span>

                <span className="rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em]">
                  Vanilla
                </span>

                <span className="rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em]">
                  Woods
                </span>
              </div>

            </div>

            {/* LIGHTER NOTES */}
            <div className="rounded-[30px] bg-white/[0.04] p-8">

              <p className="mb-4 text-xs uppercase tracking-[0.35em] text-[#7a8fa3]">
                Common Fresher Notes
              </p>

              <h4 className="text-3xl font-black uppercase leading-[0.95]">
                Bright &
                <span className="block">
                  Fresh Notes
                </span>
              </h4>

              <p className="mt-6 text-sm leading-7 text-zinc-400">
                Fresher notes often feel cleaner, lighter, and more energetic,
                making them popular for daytime wear, summer, and daily use.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <span className="rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em]">
                  Citrus
                </span>

                <span className="rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em]">
                  Bergamot
                </span>

                <span className="rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em]">
                  Marine
                </span>

                <span className="rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em]">
                  Green Notes
                </span>

                <span className="rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em]">
                  Fresh Spice
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}