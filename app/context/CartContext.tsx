"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export type CartProduct = {
  id: string;

  title: string;

  price: number;

  image: string;

  quantity: number;

  size: string;
};

type CartContextType = {
  cart: CartProduct[];

  addToCart: (
    product: CartProduct
  ) => void;

  removeFromCart: (
    id: string
  ) => void;

  increaseQuantity: (
    id: string
  ) => void;

  decreaseQuantity: (
    id: string
  ) => void;

  clearCart: () => void;

  cartTotal: number;

  cartCount: number;
};

const CartContext =
  createContext<CartContextType>({
    cart: [],

    addToCart: () => {},

    removeFromCart: () => {},

    increaseQuantity: () => {},

    decreaseQuantity: () => {},

    clearCart: () => {},

    cartTotal: 0,

    cartCount: 0,
  });

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [cart, setCart] =
    useState<CartProduct[]>([]);

  /* LOAD CART */
  useEffect(() => {

    try {

      const storedCart =
        localStorage.getItem(
          "maison-skye-rose-cart"
        );

      if (storedCart) {

        setCart(
          JSON.parse(storedCart)
        );

      }

    } catch (error) {

      console.error(
        "Failed to load cart",
        error
      );

    }

  }, []);

  /* SAVE CART */
  useEffect(() => {

    localStorage.setItem(
      "maison-skye-rose-cart",
      JSON.stringify(cart)
    );

  }, [cart]);

  /* ADD TO CART */
  const addToCart = (
    product: CartProduct
  ) => {

    setCart((prev) => {

      const existing =
        prev.find(
          (item) =>
            item.id ===
            product.id
        );

      /* IF EXISTS */
      if (existing) {

        return prev.map((item) =>

          item.id === product.id

            ? {
                ...item,

                quantity:
                  item.quantity +
                  product.quantity,
              }

            : item

        );

      }

      /* NEW ITEM */
      return [
        ...prev,

        {
          ...product,
        },
      ];

    });

  };

  /* REMOVE */
  const removeFromCart = (
    id: string
  ) => {

    setCart((prev) =>

      prev.filter(
        (item) =>
          item.id !== id
      )

    );

  };

  /* INCREASE */
  const increaseQuantity = (
    id: string
  ) => {

    setCart((prev) =>

      prev.map((item) =>

        item.id === id

          ? {
              ...item,

              quantity:
                item.quantity + 1,
            }

          : item

      )

    );

  };

  /* DECREASE */
  const decreaseQuantity = (
    id: string
  ) => {

    setCart((prev) =>

      prev
        .map((item) =>

          item.id === id

            ? {
                ...item,

                quantity:
                  item.quantity - 1,
              }

            : item

        )
        .filter(
          (item) =>
            item.quantity > 0
        )

    );

  };

  /* CLEAR */
  const clearCart = () => {

    setCart([]);

  };

  /* TOTAL */
  const cartTotal =
    cart.reduce(

      (total, item) =>

        total +
        item.price *
          item.quantity,

      0

    );

  /* COUNT */
  const cartCount =
    cart.reduce(

      (total, item) =>

        total +
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

        clearCart,

        cartTotal,

        cartCount,
      }}
    >

      {children}

    </CartContext.Provider>
  );
}

export const useCart = () =>
  useContext(CartContext);