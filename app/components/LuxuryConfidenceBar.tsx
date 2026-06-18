export default function LuxuryConfidenceBar() {
  return (
    <section className="bg-white border-y border-[#efe8e1]">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-sm font-black text-[#4f4a52]">
              Luxury Inspired
            </p>
            <p className="text-[11px] text-[#7b7480]">
              Premium fragrance collection
            </p>
          </div>

          <div>
            <p className="text-sm font-black text-[#4f4a52]">
              Free Samples
            </p>
            <p className="text-[11px] text-[#7b7480]">
              Orders over R400
            </p>
          </div>

          <div>
            <p className="text-sm font-black text-[#4f4a52]">
              Fast Support
            </p>
            <p className="text-[11px] text-[#7b7480]">
              Direct WhatsApp ordering
            </p>
          </div>

          <div>
            <p className="text-sm font-black text-[#4f4a52]">
              Nationwide
            </p>
            <p className="text-[11px] text-[#7b7480]">
              Delivery across South Africa
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}