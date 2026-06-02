export default function AnnouncementBar() {
  return (
    <div className="bg-black py-3 text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-3 px-6 text-center md:flex-row">

        <p className="text-xs uppercase tracking-[0.25em]">
          465+ Luxury Inspired Fragrances Available
        </p>

        <span className="hidden md:block">
          •
        </span>

        <p className="text-xs uppercase tracking-[0.25em]">
          Nationwide Delivery
        </p>

        <span className="hidden md:block">
          •
        </span>

        <p className="text-xs uppercase tracking-[0.25em]">
          Collection Available
        </p>

        <a
          href="https://wa.me/27696863952?text=Hi%20Maison%20Skye%20%26%20Rose,%20I%20am%20looking%20for%20a%20specific%20fragrance."
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.15em] text-black"
        >
          Request Any Fragrance
        </a>

      </div>
    </div>
  );
}