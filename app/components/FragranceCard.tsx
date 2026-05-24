type FragranceCardProps = {
  name: string;
  description: string;
};

export default function FragranceCard({
  name,
  description,
}: FragranceCardProps) {
  return (
    <div className="group overflow-hidden rounded-[30px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:border-white/20">
      <div className="mb-6 h-[320px] rounded-[24px] bg-gradient-to-b from-zinc-800 to-black" />

      <p className="mb-2 text-sm uppercase tracking-[0.3em] text-zinc-500">
        Signature Collection
      </p>

      <h3 className="text-2xl font-semibold">
        {name}
      </h3>

      <p className="mt-4 text-zinc-400">
        {description}
      </p>

      <button className="mt-6 rounded-full border border-white/20 px-5 py-3 transition hover:border-white">
        View Fragrance
      </button>
    </div>
  );
}