"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type FavoriteProduct = {
  title: string;
  subtitle: string;
  mood: string;
  profile: string;
  season: string[];
  notes: string[];
  prices: {
    "5ml": number;
    "10ml": number;
    "30ml": number;
  };
  images: {
    "5ml": string;
    "10ml": string;
    "30ml": string;
  };
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
};

const FavoritesContext =
  createContext<FavoritesContextType>({
    favorites: [],

    addToFavorites: () => {},

    removeFromFavorites: () => {},
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

  // LOAD LOCAL STORAGE
  useEffect(() => {

    const storedFavorites =
      localStorage.getItem(
        "favorites"
      );

    if (storedFavorites) {

      setFavorites(
        JSON.parse(
          storedFavorites
        )
      );

    }

  }, []);

  // SAVE LOCAL STORAGE
  useEffect(() => {

    localStorage.setItem(
      "favorites",
      JSON.stringify(favorites)
    );

  }, [favorites]);

  // ADD
  const addToFavorites = (
    product: FavoriteProduct
  ) => {

    setFavorites((prev) => [

      ...prev,

      product,

    ]);

  };

  // REMOVE
  const removeFromFavorites = (
    title: string
  ) => {

    setFavorites((prev) =>

      prev.filter(
        (item) =>
          item.title !== title
      )

    );

  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,

        addToFavorites,

        removeFromFavorites,
      }}
    >

      {children}

    </FavoritesContext.Provider>
  );
}

export const useFavorites = () =>
  useContext(
    FavoritesContext
  );