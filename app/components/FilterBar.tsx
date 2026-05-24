interface FilterBarProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

const filters = [
  "All",
  "For Him",
  "For Her",
  "Fresh",
  "Sweet",
  "Luxury",
  "Date Night",
  "Summer",
  "Winter",
];

export default function FilterBar({
  activeFilter,
  setActiveFilter,
}: FilterBarProps) {

  return (
    <div className="mb-12 flex flex-wrap gap-3">

      {filters.map((filter) => (

        <button
          key={filter}
          onClick={() => setActiveFilter(filter)}
          className={`rounded-full px-5 py-3 text-sm uppercase tracking-[0.2em] transition ${
            activeFilter === filter
              ? "bg-black text-white"
              : "bg-white text-black"
          }`}
        >
          {filter}
        </button>

      ))}

    </div>
  );
}