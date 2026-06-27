"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
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

  const openCart = useCallback(() => setCartOpen(true), []);

  const closeCart = useCallback(() => setCartOpen(false), []);

  const value = useMemo(
    () => ({ cartOpen, openCart, closeCart }),
    [cartOpen, openCart, closeCart]
  );

  return (
    <CartUIContext.Provider value={value}>
      {children}
    </CartUIContext.Provider>
  );

}

export const useCartUI = () =>
  useContext(CartUIContext);