"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type CartProduct = {
  title: string;
  price: number;
  image: string;
  quantity: number;
};

type CartContextType = {
  cart: CartProduct[];

  addToCart: (
    product: CartProduct
  ) => void;

  removeFromCart: (
    title: string
  ) => void;

  increaseQuantity: (
    title: string
  ) => void;

  decreaseQuantity: (
    title: string
  ) => void;

  cartTotal: number;
};

const CartContext =
  createContext<CartContextType>({
    cart: [],

    addToCart: () => {},

    removeFromCart: () => {},

    increaseQuantity: () => {},

    decreaseQuantity: () => {},

    cartTotal: 0,
  });

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [cart, setCart] =
    useState<CartProduct[]>([]);

  // LOAD
  useEffect(() => {

    const storedCart =
      localStorage.getItem(
        "cart"
      );

    if (storedCart) {

      setCart(
        JSON.parse(storedCart)
      );

    }

  }, []);

  // SAVE
  useEffect(() => {

    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );

  }, [cart]);

  // ADD
  const addToCart = (
    product: CartProduct
  ) => {

    setCart((prev) => {

      const existing =
        prev.find(
          (item) =>
            item.title ===
            product.title
        );

      if (existing) {

        return prev.map((item) =>

          item.title ===
          product.title

            ? {
                ...item,

                quantity:
                  item.quantity + 1,
              }

            : item

        );

      }

      return [
        ...prev,

        product,
      ];

    });

  };

  // REMOVE
  const removeFromCart = (
    title: string
  ) => {

    setCart((prev) =>

      prev.filter(
        (item) =>
          item.title !== title
      )

    );

  };

  // INCREASE
  const increaseQuantity = (
    title: string
  ) => {

    setCart((prev) =>

      prev.map((item) =>

        item.title === title

          ? {
              ...item,

              quantity:
                item.quantity + 1,
            }

          : item

      )

    );

  };

  // DECREASE
  const decreaseQuantity = (
    title: string
  ) => {

    setCart((prev) =>

      prev.map((item) =>

        item.title === title

          ? {
              ...item,

              quantity:
                item.quantity - 1,
            }

          : item

      ).filter(
        (item) =>
          item.quantity > 0
      )

    );

  };

  const cartTotal =
    cart.reduce(

      (total, item) =>

        total +
        item.price *
          item.quantity,

      0

    );

  return (
    <CartContext.Provider
      value={{
        cart,

        addToCart,

        removeFromCart,

        increaseQuantity,

        decreaseQuantity,

        cartTotal,
      }}
    >

      {children}

    </CartContext.Provider>
  );
}

export const useCart = () =>
  useContext(CartContext);