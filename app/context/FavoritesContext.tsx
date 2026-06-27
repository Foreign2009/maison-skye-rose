"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type FavoriteProduct = {
  title: string;
  subtitle?: string;
  mood?: string;
  profile?: string;
  season?: string[];
  notes?: string[];
  prices?: {
    "5ml": number;
    "10ml": number;
    "30ml": number;
  };
  images?: {
    "5ml": string;
    "10ml": string;
    "30ml": string;
  };
  image?: string;
  bestSeller?: boolean;
  newArrival?: boolean;
};

type FavoritesContextType = {
  favorites: FavoriteProduct[];

  addToFavorites: (
    product: FavoriteProduct
  ) => void;

  removeFromFavorites: (
    title: string
  ) => void;

  clearFavorites: () => void;

  isFavorite: (
    title: string
  ) => boolean;
};

const FavoritesContext =
  createContext<FavoritesContextType>({
    favorites: [],

    addToFavorites: () => {},

    removeFromFavorites: () => {},

    clearFavorites: () => {},

    isFavorite: () => false,
  });

export function FavoritesProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [favorites, setFavorites] =
    useState<FavoriteProduct[]>(
      []
    );

  const [isInitialized, setIsInitialized] =
    useState(false);

  // LOAD
  useEffect(() => {

    try {

      const storedFavorites =
        localStorage.getItem(
          "maison-skye-rose-favorites"
        );

      if (storedFavorites) {

        setFavorites(
          JSON.parse(
            storedFavorites
          )
        );

      }

    } catch (error) {

      console.error(
        "Failed to load favorites",
        error
      );

    } finally {

      setIsInitialized(true);

    }

  }, []);

  // SAVE
  useEffect(() => {

    if (!isInitialized) return;

    localStorage.setItem(
      "maison-skye-rose-favorites",
      JSON.stringify(
        favorites
      )
    );

  }, [favorites, isInitialized]);

  // CHECK FAVORITE
  const isFavorite = useCallback(
    (title: string) => favorites.some((item) => item.title === title),
    [favorites]
  );

  // ADD
  const addToFavorites = useCallback(
    (product: FavoriteProduct) => {
      setFavorites((prev) => {
        const exists = prev.some((item) => item.title === product.title);
        if (exists) return prev;
        return [...prev, product];
      });
    },
    []
  );

  // REMOVE
  const removeFromFavorites = useCallback(
    (title: string) => {
      setFavorites((prev) => prev.filter((item) => item.title !== title));
    },
    []
  );

  // CLEAR
  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  const value = useMemo(
    () => ({ favorites, addToFavorites, removeFromFavorites, clearFavorites, isFavorite }),
    [favorites, addToFavorites, removeFromFavorites, clearFavorites, isFavorite]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () =>
  useContext(
    FavoritesContext
  );