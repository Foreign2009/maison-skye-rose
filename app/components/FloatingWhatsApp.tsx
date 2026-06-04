"use client";

import { MessageCircle } from "lucide-react";
import { brand } from "../data/brand";

export default function FloatingWhatsApp() {
  return (
    <a
      href={brand.social.whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-[9999] flex items-center gap-3 rounded-full bg-green-500 px-5 py-4 text-white shadow-2xl transition hover:scale-105 hover:bg-green-600"
      aria-label="Chat with us on WhatsApp"
    >
      <MessageCircle size={22} />
      <span className="hidden font-semibold md:block">
        WhatsApp Us
      </span>
    </a>
  );
}