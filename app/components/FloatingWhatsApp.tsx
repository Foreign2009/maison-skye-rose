"use client";

import { MessageCircle } from "lucide-react";
import { brand } from "../data/brand";
import { useConcierge } from "../context/ConciergeContext";
import { useCartUI } from "../context/CartUIContext";

export default function FloatingWhatsApp() {
  const { isOpen } = useConcierge();
  const { cartOpen } = useCartUI();
  if (isOpen || cartOpen) return null;

  return (
    <a
      href={brand.social.whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-32 md:bottom-5 right-5 z-[9999] flex items-center gap-3 rounded-full bg-green-500 px-5 py-4 text-white shadow-2xl transition hover:scale-105 hover:bg-green-600"
      aria-label="Chat with us on WhatsApp"
    >
      <MessageCircle size={22} />
      <span className="hidden font-semibold md:block">
        WhatsApp Us
      </span>
    </a>
  );
}