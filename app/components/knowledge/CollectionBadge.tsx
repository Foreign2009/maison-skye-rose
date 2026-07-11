// Knowledge Experience Components — presentation layer for MKC data.
// MKC owns knowledge data (app/lib/mkc/). Graph owns relationships (app/lib/mkc/graph.ts).
// Knowledge Components own presentation.

const STYLES: Record<string, { pill: string; label: string }> = {
  Skye:  { pill: "bg-blue-50 text-blue-600",    label: "Skye Collection"  },
  Rose:  { pill: "bg-pink-50 text-[#d89ca4]",   label: "Rose Collection"  },
  Elite: { pill: "bg-[#f3f0fa] text-[#9b7ce0]", label: "Elite Collection" },
};

export function CollectionBadge({ collection }: { collection: string }) {
  const style = STYLES[collection] ?? STYLES.Skye;
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${style.pill}`}>
      {style.label}
    </span>
  );
}
