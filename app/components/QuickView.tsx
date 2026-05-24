type QuickViewProps = {
  title: string;
  image: string;
  price: number;
  onOpen: () => void;
};

export default function QuickView({
  title,
  image,
  price,
  onOpen,
}: QuickViewProps) {

  return (
    <button
      onClick={onOpen}
      className="absolute inset-0 z-30 flex items-end justify-center bg-black/0 opacity-0 transition duration-500 hover:bg-black/10 group-hover:opacity-100"
    >

      <div className="mb-6 rounded-full bg-white px-6 py-4 text-xs uppercase tracking-[0.25em] text-black shadow-xl transition duration-300 hover:scale-105">
        Quick View
      </div>

    </button>
  );
}