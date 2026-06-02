"use client";

import { Sparkles, Package, Truck, Zap, MessageCircle } from "lucide-react";

export default function WhyMaison() {
  const features = [
    {
      icon: <Sparkles className="h-6 w-6 text-[#d89ca4]" />,
      title: "465+ Fragrances",
      description: "An extensive library of premium scents.",
    },
    {
      icon: <Package className="h-6 w-6 text-[#d89ca4]" />,
      title: "Luxury Inspired",
      description: "High-quality formulations, crafted with care.",
    },
    {
      icon: <Truck className="h-6 w-6 text-[#d89ca4]" />,
      title: "Nationwide Delivery",
      description: "Delivered safely to your door across SA.",
    },
    {
      icon: <Zap className="h-6 w-6 text-[#d89ca4]" />,
      title: "Full Collection",
      description: "Browse our entire range in one place.",
    },
    {
      icon: <MessageCircle className="h-6 w-6 text-[#d89ca4]" />,
      title: "WhatsApp Ordering",
      description: "Quick and easy support via WhatsApp.",
    },
  ];

  return (
    <section className="bg-[#faf7f5] py-20 px-6">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center text-4xl font-black text-[#4f4a52] mb-16">
          Why Maison
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center text-center p-6 bg-white rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.03)]"
            >
              <div className="mb-4 p-3 bg-pink-50 rounded-full">
                {feature.icon}
              </div>
              <h3 className="font-bold text-[#4f4a52] mb-2">{feature.title}</h3>
              <p className="text-sm text-[#7b7480] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}