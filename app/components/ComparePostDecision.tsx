"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import QuickAddModal from "./QuickAddModal";
import DiscoverCollectionGrid from "./DiscoverCollectionGrid";
import { useConcierge } from "../context/ConciergeContext";
import { trackAiChatStarted } from "../lib/analytics";

export type PurchaseItem = {
  slug:   string;
  name:   string;
  prices: { "5ml": number; "10ml": number; "30ml": number };
  images: { "5ml": string; "10ml": string; "30ml": string };
};

export type RelatedGridItem = {
  title:          string;
  subtitle:       string;
  mood:           string;
  profile:        string;
  season:         string;
  notes:          string[];
  prices:         { "5ml": number; "10ml": number; "30ml": number };
  images:         { "5ml": string; "10ml": string; "30ml": string };
  bestSeller?:    boolean;
  newArrival?:    boolean;
  scentCharacter?: string;
};

interface ComparePostDecisionProps {
  fragA:             PurchaseItem;
  fragB:             PurchaseItem;
  relatedFragrances: RelatedGridItem[];
}

export default function ComparePostDecision({
  fragA,
  fragB,
  relatedFragrances,
}: ComparePostDecisionProps) {
  const [selectedItem, setSelectedItem] = useState<PurchaseItem | null>(null);
  const [quickOpen, setQuickOpen] = useState(false);
  const { openConcierge, conversationState } = useConcierge();

  function handleConcierge() {
    openConcierge();
    trackAiChatStarted({ trigger: "discover", sessionId: conversationState.sessionId });
  }

  return (
    <>
      {/* ── Part A: Ready To Choose ──────────────────────────────────────────── */}
      <section className="px-4 pb-8 md:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl bg-white p-6 md:p-10">
            <div className="mb-8 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.55em] text-[#d89ca4]">
                Decision Time
              </p>
              <h2 className="mt-3 text-2xl font-black tracking-[-0.04em] text-[#4f4a52] md:text-3xl">
                Ready To Choose?
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#7b7480]">
                Both fragrances are available in three sizes. Choose the one that feels right.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {[fragA, fragB].map((frag) => (
                <div
                  key={frag.slug}
                  className="rounded-2xl border border-[#f0ebe8] bg-[#faf7f5] p-6"
                >
                  <h3 className="text-lg font-black text-[#4f4a52]">{frag.name}</h3>
                  <p className="mt-1 text-sm font-semibold text-[#d89ca4]">
                    From R{frag.prices["5ml"]}
                  </p>
                  <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                    <Link
                      href={`/product/${frag.slug}`}
                      className="flex-1 rounded-xl bg-[#4f4a52] px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-black"
                    >
                      View Fragrance
                    </Link>
                    <button
                      onClick={() => { setSelectedItem(frag); setQuickOpen(true); }}
                      className="flex-1 rounded-xl border border-[#d89ca4] px-5 py-3 text-sm font-bold text-[#d89ca4] transition hover:bg-[#d89ca4]/5"
                    >
                      Quick Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Part C: Still Deciding ───────────────────────────────────────────── */}
      <section className="px-4 pb-8 md:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-[#f0ebe8] bg-white p-6 text-center md:p-10">
            <p className="text-[10px] font-semibold uppercase tracking-[0.55em] text-[#d89ca4]">
              Maison Concierge
            </p>
            <h2 className="mt-3 text-2xl font-black tracking-[-0.04em] text-[#4f4a52]">
              Still Deciding?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#7b7480]">
              The Maison Concierge can help you understand which fragrance suits your preferences and lifestyle.
            </p>
            <button
              onClick={handleConcierge}
              className="mt-6 inline-flex items-center gap-2.5 rounded-full bg-[#4f4a52] px-8 py-4 text-sm font-bold text-white transition hover:bg-black hover:scale-[1.02]"
            >
              <Sparkles size={15} />
              Ask Maison Concierge
            </button>
          </div>
        </div>
      </section>

      {/* ── Part B: Continue Exploring ──────────────────────────────────────── */}
      {relatedFragrances.length > 0 && (
        <section className="px-4 pb-16 md:px-6">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 md:mb-10">
              <p className="text-[10px] font-semibold uppercase tracking-[0.55em] text-[#d89ca4]">
                Continue Exploring
              </p>
              <h2 className="mt-3 text-2xl font-black tracking-[-0.04em] text-[#4f4a52] md:text-3xl">
                Related Fragrances
              </h2>
            </div>
            <DiscoverCollectionGrid
              fragrances={relatedFragrances}
              source="compare-related"
              columns={3}
            />
          </div>
        </section>
      )}

      {selectedItem && (
        <QuickAddModal
          open={quickOpen}
          onClose={() => setQuickOpen(false)}
          title={selectedItem.name}
          images={selectedItem.images}
          prices={selectedItem.prices}
        />
      )}
    </>
  );
}
