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
  addToCart: (product: CartProduct) => void;
  removeFromCart: (id: string, size: string) => void;
  increaseQuantity: (id: string, size: string) => void;
  decreaseQuantity: (id: string, size: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  wholesaleActive: boolean;
  getWholesalePrice: (item: CartProduct) => number;
};

const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  increaseQuantity: () => {},
  decreaseQuantity: () => {},
  clearCart: () => {},
  cartTotal: 0,
  cartCount: 0,
  wholesaleActive: false,
  getWholesalePrice: (item: CartProduct) => item.price,
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartProduct[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  /* LOAD CART - Runs once on mount safely in client browser */
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem("maison-skye-rose-cart");
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error("Failed to load cart", error);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  /* SAVE CART - Prevents blank overwrite during Next.js hydration initialization */
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem("maison-skye-rose-cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Failed to save cart state:", error);
    }
  }, [cart, isInitialized]);

  /* ADD TO CART - Evaluates item using ID and Bottle Size */
  const addToCart = (product: CartProduct) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.id === product.id && item.size === product.size
      );

      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.size === product.size
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        );
      }

      return [...prev, { ...product }];
    });
  };

  /* REMOVE VIA COMPOSITE KEY */
  const removeFromCart = (id: string, size: string) => {
    setCart((prev) => 
      prev.filter((item) => !(item.id === id && item.size === size))
    );
  };

  /* INCREASE VIA COMPOSITE KEY */
  const increaseQuantity = (id: string, size: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id && item.size === size 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      )
    );
  };

  /* DECREASE VIA COMPOSITE KEY */
  const decreaseQuantity = (id: string, size: string) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id && item.size === size 
            ? { ...item, quantity: item.quantity - 1 } 
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  /* CLEAR */
  const clearCart = () => {
    setCart([]);
  };

  /* DERIVED DATA COMPUTATIONS */
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const wholesaleActive = cartCount >= 10;

  const getWholesalePrice = (item: CartProduct) => {
    if (!wholesaleActive) return item.price;

    switch (item.size) {
      case "5ml":
        return 48;
      case "10ml":
        return 77;
      case "30ml":
        return 180;
      default:
        return item.price;
    }
  };

  const cartTotal = cart.reduce(
    (total, item) => total + getWholesalePrice(item) * item.quantity,
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
        wholesaleActive,
        getWholesalePrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);