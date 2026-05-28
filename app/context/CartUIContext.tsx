"use client";

import {
  createContext,
  useContext,
  useState,
} from "react";

type CartUIContextType = {
  cartOpen: boolean;

  openCart: () => void;

  closeCart: () => void;
};

const CartUIContext =
  createContext<CartUIContextType>({
    cartOpen: false,

    openCart: () => {},

    closeCart: () => {},
  });

export function CartUIProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [cartOpen, setCartOpen] =
    useState(false);

  const openCart = () =>
    setCartOpen(true);

  const closeCart = () =>
    setCartOpen(false);

  return (

    <CartUIContext.Provider
      value={{
        cartOpen,
        openCart,
        closeCart,
      }}
    >

      {children}

    </CartUIContext.Provider>

  );

}

export const useCartUI = () =>
  useContext(CartUIContext);