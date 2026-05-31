"use client";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search fragrances...",
}: SearchBarProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) =>
        onChange(e.target.value)
      }
      placeholder={placeholder}
      className="w-full rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-sm outline-none transition focus:border-[#d89ca4]"
    />
  );
}