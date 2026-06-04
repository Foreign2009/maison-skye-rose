export default function TrustBar() {
  const items = [
    "465+ Fragrances Available",
    "Nationwide Delivery",
    "Collection Available",
    "Secure Ordering",
    "WhatsApp Support",
  ];

  return (
    <section className="border-y border-neutral-200 bg-white py-4">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-6 px-6 text-center">
        {items.map((item) => (
          <div
            key={item}
            className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4f4a52]"
          >
            ✓ {item}
          </div>
        ))}
      </div>
    </section>
  );
}