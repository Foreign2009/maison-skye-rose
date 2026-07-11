// default: standard note chip (px-3 py-1.5 text-xs) — PDP, QuickView, Wardrobe
// sm: compact variant (px-2 py-0.5 text-[11px]) — Academy spotlight blocks

const sizes = {
  default: "px-3 py-1.5 text-xs",
  sm:      "px-2 py-0.5 text-[11px]",
};

export function NoteChip({ note, size = "default" }: { note: string; size?: "sm" | "default" }) {
  return (
    <span className={`rounded-full bg-pink-50 font-semibold text-[#d89ca4] ${sizes[size]}`}>
      {note}
    </span>
  );
}
