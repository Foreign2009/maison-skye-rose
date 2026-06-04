"use client";

import { useState, useEffect } from "react";

export default function AnnouncementBar() {
  const messages = [
    "Free Collection Available",
    "Nationwide Delivery",
    "VAT Included",
    "WhatsApp Orders Welcome",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black py-3 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-6 px-6 text-center">
        <p className="text-xs uppercase tracking-[0.25em] transition-opacity duration-500 ease-in-out">
          {messages[currentIndex]}
        </p>

        <a
          href="https://wa.me/27696863952?text=Hi%20Maison%20Skye%20%26%20Rose,%20I%20am%20looking%20for%20a%20specific%20fragrance."
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-white hover:bg-white hover:text-black transition-colors"
        >
          WhatsApp Support
        </a>
      </div>
    </div>
  );
}