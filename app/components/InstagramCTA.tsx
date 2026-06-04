import { brand } from "../data/brand";

export default function InstagramCTA() {
  return (
    <section className="bg-[#f5f1eb] py-20 text-center">
      <p className="text-[11px] uppercase tracking-[0.45em] text-[#d89ca4]">
        Follow The Journey
      </p>

      <h2 className="mt-4 text-5xl font-black text-[#4f4a52]">
        {brand.name}
      </h2>

      <p className="mx-auto mt-6 max-w-2xl text-[#7b7480]">
        Discover new arrivals, fragrance recommendations and customer favourites.
      </p>

      <a
        href={brand.social.instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-block rounded-full bg-black px-8 py-4 text-sm font-bold uppercase tracking-widest text-white"
      >
        Follow On Instagram
      </a>
    </section>
  );
}