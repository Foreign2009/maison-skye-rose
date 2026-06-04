"use client";

import { useState } from "react";
import Navbar from "./components/Navbar";
import AnnouncementBar from "./components/AnnouncementBar";
import ProductCard from "./components/ProductCard";
import AIHeroSection from "./components/AIHeroSection";
import TrustBar from "./components/TrustBar";
import BestSellers from "./components/BestSellers";
import LatestAdditions from "./components/LatestAdditions";
import EliteShowcase from "./components/EliteShowcase";
import ComingSoon from "./components/ComingSoon";
import RequestFragrance from "./components/RequestFragrance";
import ShopByPersonality from "./components/ShopByPersonality";
import DiscoverySets from "./components/DiscoverySets";
import YourFragranceJourney from "./components/YourFragranceJourney";
import InstagramCTA from "./components/InstagramCTA";
import QuickAddModal from "./components/QuickAddModal";
import WhyMaison from "./components/WhyMaison"; 
import { fragrances } from "./data/fragrances";

export default function HomePage() {
  const [selectedFragrance, setSelectedFragrance] = useState<any>(null);
  const [currentFilter, setCurrentFilter] = useState("All");

  // Logic to mix Skye, Rose, and Elite collections
  const skye = fragrances.filter((f) => f.collection === "Skye");
  const rose = fragrances.filter((f) => f.collection === "Rose");
  const elite = fragrances.filter((f) => f.collection === "Elite");
  
  const mixedProducts: any[] = [];
  const maxLength = Math.max(skye.length, rose.length, elite.length);

  for (let i = 0; i < maxLength; i++) {
    if (skye[i]) mixedProducts.push(skye[i]);
    if (rose[i]) mixedProducts.push(rose[i]);
    if (elite[i]) mixedProducts.push(elite[i]);
  }

  const filteredFragrances = fragrances.filter((item) => {
    if (currentFilter === "All") return true;
    if (currentFilter === "Skye" || currentFilter === "Rose" || currentFilter === "Elite") {
      return item.collection === currentFilter;
    }
    if (currentFilter === "Best Sellers") return item.bestSeller;
    if (currentFilter === "New Arrivals") return item.newArrival;
    return true;
  });

  const displayProducts = currentFilter === "All" ? mixedProducts : filteredFragrances;

  return (
    <main className="min-h-screen bg-[#faf7f5]">
      <Navbar />
      <AnnouncementBar />
      <AIHeroSection />
      
      {/* 1. Added Trust Bar */}
      <TrustBar />

      {/* 2. Best Sellers */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-black mb-12 text-center text-[#4f4a52]">Best Sellers</h2>
        <BestSellers onQuickAdd={(fragrance) => setSelectedFragrance(fragrance)} />
      </section>

      {/* 3. Latest Additions */}
      <LatestAdditions />
      
      {/* 4. Elite Showcase */}
      <EliteShowcase onQuickAdd={(fragrance) => setSelectedFragrance(fragrance)} />
      
      {/* 5. Signature Collection (Tabbed Grid) */}
      <section className="mx-auto max-w-7xl px-5 py-24">
        <div className="mb-12 text-center">
          <p className="text-[11px] uppercase tracking-[0.45em] text-[#d89ca4]">Signature Collection</p>
          <h2 className="mt-4 text-5xl font-black tracking-[-0.06em] text-[#4f4a52]">Inspired Scent Journeys</h2>
        </div>

        <div className="mb-12 flex flex-wrap items-center justify-center gap-2.5">
          {["All", "Skye", "Rose", "Elite", "Best Sellers", "New Arrivals"].map((tab) => (
            <button
              key={tab}
              onClick={() => setCurrentFilter(tab)}
              className={`rounded-full px-6 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                currentFilter === tab ? "bg-[#d89ca4] text-white shadow-md" : "bg-white text-[#7b7480] border border-gray-200/60 hover:bg-gray-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {displayProducts.slice(0, 12).map((fragrance) => (
            <ProductCard key={fragrance.title} {...fragrance} onQuickAdd={() => setSelectedFragrance(fragrance)} />
          ))}
        </div>
      </section>

      {/* 6. Discovery Sets */}
      <DiscoverySets />
      
      {/* 7. Shop By Personality */}
      <ShopByPersonality />
      
      {/* 8. Your Fragrance Journey */}
      <YourFragranceJourney />
      
      {/* 9. Instagram CTA */}
      <InstagramCTA />
      
      {/* 10. Request Fragrance */}
      <RequestFragrance />
      
      {/* 11. Why Maison */}
      <WhyMaison />
      
      {/* 12. Coming Soon */}
      <ComingSoon />

      {selectedFragrance && (
        <QuickAddModal open={true} onClose={() => setSelectedFragrance(null)} {...selectedFragrance} />
      )}
    </main>
  );
}