type SearchBarProps = {
  searchTerm: string;
  setSearchTerm: (
    value: string
  ) => void;
};

export default function SearchBar({
  searchTerm,
  setSearchTerm,
}: SearchBarProps) {

  return (
    <div className="mb-10">

      <div className="relative overflow-hidden rounded-full border border-black/10 bg-white shadow-sm">

        <input
          type="text"
          placeholder="Search fragrances..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
          className="w-full bg-transparent px-7 py-5 text-sm outline-none placeholder:text-zinc-400"
        />

      </div>

    </div>
  );
}