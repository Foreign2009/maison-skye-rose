"use client";

import {
  Sparkles,
  Clock3,
  Truck,
  MessageCircle,
  Gem,
  Search,
} from "lucide-react";

const features = [
  {
    icon: Gem,
    title: "Premium Quality Oils",
    description:
      "Carefully selected fragrance oils crafted for a luxurious scent experience.",
  },
  {
    icon: Clock3,
    title: "Long Lasting Performance",
    description:
      "Designed to keep you smelling incredible throughout your day and evening.",
  },
  {
    icon: Sparkles,
    title: "Luxury Inspired Fragrances",
    description:
      "Inspired by some of the world's most loved and iconic fragrances.",
  },
  {
    icon: Truck,
    title: "Nationwide Delivery",
    description:
      "Fast and reliable delivery available across South Africa.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Ordering",
    description:
      "Simple ordering and support directly through WhatsApp.",
  },
  {
    icon: Search,
    title: "465+ Fragrances Available",
    description:
      "Can't find your fragrance online? We can source it from our extended catalogue.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-[#faf7f5] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 text-center">
          <p className="text-[11px] uppercase tracking-[0.45em] text-[#d89ca4]">
            Why Choose Us
          </p>

          <h2 className="mt-4 text-5xl font-black tracking-[-0.05em] text-[#4f4a52]">
            Maison Skye & Rose
          </h2>

          <p className="mx-auto mt-6 max-w-2xl leading-8 text-[#7b7480]">
            Luxury-inspired fragrances, exceptional value and a growing
            catalogue of over 465 fragrances available on request.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-[32px] bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f5f1eb]">
                  <Icon
                    size={26}
                    className="text-[#d89ca4]"
                  />
                </div>

                <h3 className="text-xl font-black text-[#4f4a52]">
                  {feature.title}
                </h3>

                <p className="mt-4 leading-7 text-[#7b7480]">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}