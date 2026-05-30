"use client";

import { useCart } from "../context/CartContext";

type BundleProps = {
  fragrances: any[];
};

export default function QuickAddBundle({
  fragrances,
}: BundleProps) {

  const { addToCart } =
    useCart();

  const addBundle = () => {

    fragrances.forEach(
      (fragrance) => {

        addToCart({
          id:
            `${fragrance.title}-5ml`,

          title:
            fragrance.title,

          size: "5ml",

          quantity: 1,

          price:
            fragrance.prices["5ml"],

          image:
            fragrance.images[
              "5ml"
            ],
        });

      }
    );

  };

  return (

    <div
      className="
        mt-12
        rounded-[32px]
        bg-gradient-to-r
        from-pink-50
        to-blue-50
        p-8
      "
    >

      <h3
        className="
          text-3xl
          font-black
          text-[#4f4a52]
        "
      >
        Discovery Bundle
      </h3>

      <p
        className="
          mt-4
          text-[#7b7480]
        "
      >
        Sample all recommended
        fragrances and discover
        your favourite.
      </p>

      <button
        onClick={addBundle}
        className="
          mt-6
          rounded-full
          bg-gradient-to-r
          from-pink-400
          to-blue-400
          px-8
          py-4
          font-bold
          text-white
        "
      >
        Add Bundle To Cart
      </button>

    </div>

  );

}